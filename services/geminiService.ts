import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Service, CMSContent } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Define the tool for booking appointments
const bookAppointmentTool: FunctionDeclaration = {
  name: 'book_appointment',
  description: 'Book an appointment for a client when they provide necessary details (name, email, service, date, time).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      clientName: { type: Type.STRING, description: 'Name of the client' },
      clientEmail: { type: Type.STRING, description: 'Email address (optional, use placeholder if not provided)' },
      serviceName: { type: Type.STRING, description: 'Name of the service to book' },
      date: { type: Type.STRING, description: 'Date of appointment (YYYY-MM-DD)' },
      time: { type: Type.STRING, description: 'Time of appointment (e.g. 10:00 AM)' },
    },
    required: ['clientName', 'serviceName', 'date', 'time']
  }
};

export const sendMessageToConcierge = async (
  history: { role: string; text: string }[], 
  newMessage: string,
  services: Service[],
  cmsContent: CMSContent
): Promise<{ text: string; bookingData?: any }> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const SYSTEM_INSTRUCTION = `
      আপনার নাম "Customer Care" (কাস্টমার কেয়ার)। আপনি Elysium বিউটি পার্লারের কাস্টমার সাপোর্ট এজেন্ট।
      
      আপনার লক্ষ্য হলো গ্রাহকদের প্রশ্নের উত্তর দেওয়া এবং অ্যাপয়েন্টমেন্ট বুক করতে সাহায্য করা।
      
      নিচে আমাদের পার্লারের বর্তমান সার্ভিস এবং তথ্যাবলী দেওয়া হলো। **শুধুমাত্র** এই তথ্যের ওপর ভিত্তি করে উত্তর দেবেন:
      
      সার্ভিস সমূহ (Services & Prices):
      ${JSON.stringify(services.map(s => `${s.title}: ${s.price} (${s.duration}) - ${s.description}`).join('\n'))}
      
      যোগাযোগ ও ঠিকানা (Contact Info):
      ঠিকানা: ${cmsContent.contact.addressLine1}, ${cmsContent.contact.addressLine2}
      ফোন: ${cmsContent.contact.phone}
      সময়সূচী: ${cmsContent.contact.hours}
      ট্যাগলাইন: ${cmsContent.hero.tagline}

      নির্দেশনা:
      ১. সব সময় **বাংলা ভাষায়** উত্তর দেবেন।
      ২. আপনার টোন হবে মার্জিত, ভদ্র এবং পেশাদার।
      ৩. যদি কেউ অ্যাপয়েন্টমেন্ট বুক করতে চায়, তাদের নাম, সার্ভিস, তারিখ এবং সময় জিজ্ঞাসা করুন। সব তথ্য পেলে 'book_appointment' টুলটি ব্যবহার করুন।
      ৪. ইমেইল না দিলে 'guest@example.com' ব্যবহার করুন।
      ৫. উত্তর ছোট এবং প্রাসঙ্গিক রাখবেন।
    `;

    // Transform history for the chat API
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
        tools: [{ functionDeclarations: [bookAppointmentTool] }]
      },
      history: recentHistory
    });

    const response = await chat.sendMessage({
      message: newMessage
    });

    // Check if the AI wants to call a function (Book Appointment)
    const functionCall = response.functionCalls?.[0];

    if (functionCall && functionCall.name === 'book_appointment') {
       return {
         text: "ধন্যবাদ! আপনার অ্যাপয়েন্টমেন্টটি আমাদের সিস্টেমে বুক করা হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
         bookingData: functionCall.args
       };
    }

    return { text: response.text || "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।" };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "সার্ভার এরুটির কারণে সংযোগ বিচ্ছিন্ন হয়েছে। দয়া করে অপেক্ষা করুন।" };
  }
};

export const getBusinessInsights = async (appointments: any[]): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Act as a high-end Spa Manager AI. Analyze the following appointment data for today:
      ${JSON.stringify(appointments)}
      
      Provide a brief 3-sentence "Executive Morning Briefing" for the staff. 
      Focus on VIPs coming in, potential resource bottlenecks, and a motivational quote.
      Format: Plain text.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Systems operational. Have a wonderful day.";
  } catch (error) {
    return "Analytics currently offline.";
  }
};