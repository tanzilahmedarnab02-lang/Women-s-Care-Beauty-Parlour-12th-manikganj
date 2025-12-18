import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Check, Phone, Ticket, Scissors, Tag, Mail, Loader2 } from 'lucide-react';
import { Service, Appointment, CMSContent, Section } from '../types';

interface BookingSectionProps {
  services: Service[];
  cmsContent: CMSContent;
  onBook: (data: Partial<Appointment>) => void;
  preSelectedServiceId: string | null;
}

const MotionDiv = motion.div as any;

// --- MOCK EMAIL SERVICE ---
// In a real application, this would be an API call to a backend (Node.js/Python)
// that uses an SMTP service like SendGrid, AWS SES, or Nodemailer.
const sendBookingEmails = async (details: any) => {
    return new Promise((resolve) => {
        console.log("--- START EMAIL SIMULATION ---");
        
        // 1. Send Client Receipt
        console.log(`📧 SENDING TO CLIENT [${details.email}]:`);
        console.log(`Subject: Your Sanctuary Awaits - Booking Confirmation`);
        console.log(`Body: Dear ${details.name}, thank you for choosing Elysium. Your appointment for ${details.serviceName} is confirmed for ${details.date} at ${details.time}.`);

        // 2. Send Owner Notification
        console.log(`📧 SENDING TO OWNER [owner@elysium.com]:`);
        console.log(`Subject: 🔔 New Reservation Alert`);
        console.log(`Body: Admin, a new booking has been made by ${details.name} (${details.email}). Service: ${details.serviceName}.`);
        
        console.log("--- END EMAIL SIMULATION ---");
        
        // Simulate network delay
        setTimeout(resolve, 2000); 
    });
};

const CouponBox: React.FC<{ onApply: (code: string) => boolean; isApplied: boolean }> = ({ onApply, isApplied }) => {
    const [isUnzipped, setIsUnzipped] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        const valid = onApply(code.toUpperCase());
        if (valid) {
            setSuccess('20% Discount Applied!');
        } else {
            setError('Invalid Code');
        }
    };

    return (
        <div className="mt-8 relative overflow-hidden rounded-xl border border-gold-400/30 bg-black/40 shadow-xl max-w-sm mx-auto lg:mx-0">
             <AnimatePresence>
                {!isUnzipped && (
                    <MotionDiv
                        initial={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 z-20 bg-gradient-to-b from-luxury-charcoal to-black flex flex-col items-center justify-center p-6 cursor-pointer"
                        onClick={() => setIsUnzipped(true)}
                    >
                         <div className="w-full border-b-2 border-dashed border-gold-400/50 absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none"></div>
                         <div className="relative z-10 bg-luxury-charcoal p-3 rounded-full border border-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-bounce">
                             <Scissors size={24} className="text-gold-400 rotate-90" />
                         </div>
                         <p className="mt-8 text-gold-400 text-xs font-sans tracking-[0.2em] uppercase font-bold">Tap to Unzip Mystery Offer</p>
                    </MotionDiv>
                )}
             </AnimatePresence>

             <div className="p-6 text-center">
                 <div className="mb-4">
                     <Tag size={24} className="mx-auto text-gold-400 mb-2" />
                     <h4 className="text-white font-serif text-xl">Exclusive Offer</h4>
                     <p className="text-gray-400 text-xs">Use code <span className="text-white font-bold tracking-widest">GLOW20</span></p>
                 </div>
                 
                 {isApplied ? (
                    <div className="bg-green-500/10 text-green-400 p-3 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-green-500/20">
                        <Check size={14} /> Coupon Active
                    </div>
                 ) : (
                     <form onSubmit={handleApply} className="flex gap-2">
                         <input 
                            type="text" 
                            placeholder="Enter Code" 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-gold-400 focus:outline-none uppercase"
                         />
                         <button className="bg-gold-400 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-white transition-colors">
                             Apply
                         </button>
                     </form>
                 )}
                 {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                 {success && <p className="text-green-400 text-xs mt-2">{success}</p>}
             </div>
        </div>
    );
}

const BookingSection: React.FC<BookingSectionProps> = ({ services, cmsContent, onBook, preSelectedServiceId }) => {
  const containerRef = useRef<HTMLDivElement>(null); // Ref for scrolling control
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);

  // Sync prop to local state
  useEffect(() => {
    if (preSelectedServiceId) {
        setSelectedServiceId(preSelectedServiceId);
    }
  }, [preSelectedServiceId]);

  // SCROLL FIX: Auto-scroll to container when submitted to prevent jumping
  useEffect(() => {
    if (isSubmitted && containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSubmitted]);

  const checkCoupon = (code: string) => {
      if (code === 'GLOW20') {
          setDiscountApplied(true);
          return true;
      }
      return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true); // Start Loading

    const service = services.find(s => s.id === selectedServiceId);
    
    let formattedTime = time;
    try {
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        formattedTime = `${h12}:${minutes} ${ampm}`;
    } catch (e) {
        // fallback
    }

    const finalServiceName = discountApplied 
        ? `${service?.title} (20% OFF Applied)` 
        : service?.title;

    // 1. Simulate Sending Emails (Async Operation)
    await sendBookingEmails({
        name,
        email,
        serviceName: finalServiceName,
        date,
        time: formattedTime
    });

    // 2. Add Booking to App State
    onBook({
      clientName: name,
      clientEmail: email,
      serviceId: service?.id,
      serviceName: finalServiceName,
      date: date,
      time: formattedTime,
    });

    // 3. Update UI
    setIsProcessing(false);
    setIsSubmitted(true);
  };

  return (
    <section id={Section.BOOKING} ref={containerRef} className="py-32 bg-luxury-black text-white relative">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <MotionDiv 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
        >
            <span className="text-gold-400 tracking-[0.3em] text-xs uppercase block mb-4">Reservations</span>
            <h2 className="font-serif text-5xl md:text-6xl text-white">Secure Your Sanctuary</h2>
        </MotionDiv>

        {isProcessing ? (
             <div className="flex flex-col items-center justify-center py-32 bg-luxury-charcoal/30 rounded-3xl border border-white/5">
                <Loader2 size={64} className="text-gold-400 animate-spin mb-6" />
                <h3 className="text-2xl font-serif text-white mb-2">Processing Reservation...</h3>
                <p className="text-gray-400 text-sm">Sending confirmation to {email}</p>
             </div>
        ) : isSubmitted ? (
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-luxury-charcoal/50 rounded-3xl border border-gold-400/20"
          >
            <div className="w-24 h-24 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center mb-8 border border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
               <Check size={48} />
            </div>
            <h2 className="font-serif text-5xl text-white mb-4">Confirmed</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              We eagerly await your arrival, <span className="text-white font-medium">{name}</span>.
            </p>
            
            {/* Email Confirmation Badges */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 rounded-lg border border-green-500/20 text-green-400 text-xs">
                    <Mail size={14} /> Receipt sent to {email}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/20 rounded-lg border border-blue-500/20 text-blue-400 text-xs">
                    <Check size={14} /> Admin Notified
                </div>
            </div>

            {discountApplied && (
                <div className="mb-8 px-4 py-2 bg-gold-900/30 border border-gold-500/30 rounded text-gold-400 text-sm font-sans">
                    ✨ 20% Discount applied to your reservation
                </div>
            )}
            <button 
              onClick={() => { setIsSubmitted(false); setDiscountApplied(false); }}
              className="px-8 py-3 bg-gold-400 text-black font-sans uppercase tracking-widest text-xs font-bold hover:bg-white transition-colors"
            >
              Book Another
            </button>
          </MotionDiv>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* LEFT COLUMN: FORM */}
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Services */}
                <div className="bg-luxury-charcoal p-6 rounded-2xl border border-white/5 shadow-2xl">
                  <h3 className="font-serif text-2xl mb-6 text-gold-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold-400 text-black text-xs font-bold flex items-center justify-center">1</span>
                    Select Ritual
                  </h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {services.map(s => (
                      <div 
                        key={s.id}
                        onClick={() => setSelectedServiceId(s.id)}
                        className={`relative rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden group
                          ${selectedServiceId === s.id ? 'border-gold-400 shadow-lg shadow-gold-400/10' : 'border-white/10 hover:border-gold-400/50'}`}
                      >
                         <div className="flex h-24 bg-black/40">
                            <div className="w-24 h-full shrink-0 relative">
                               <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="flex-1 p-4 flex flex-col justify-center">
                               <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className={`font-serif text-lg transition-colors ${selectedServiceId === s.id ? 'text-gold-200' : 'text-white group-hover:text-gold-200'}`}>{s.title}</h4>
                                    <span className="text-xs text-gray-400 font-sans">{s.duration}</span>
                                  </div>
                                  <div className="text-right">
                                     <span className={`font-sans font-medium block ${discountApplied && selectedServiceId === s.id ? 'text-gray-500 line-through text-xs' : 'text-gold-400'}`}>
                                        {s.price}
                                     </span>
                                     {discountApplied && selectedServiceId === s.id && (
                                         <span className="text-green-400 text-sm font-bold">20% OFF</span>
                                     )}
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Date & Time */}
                <div className="bg-luxury-charcoal p-6 rounded-2xl border border-white/5 shadow-2xl">
                  <h3 className="font-serif text-2xl mb-6 text-gold-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold-400 text-black text-xs font-bold flex items-center justify-center">2</span>
                    Date & Time
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Date</label>
                        <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400" size={18} />
                        <input 
                            type="date" 
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold-400 focus:outline-none [color-scheme:dark]"
                        />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Time</label>
                        <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400" size={18} />
                        <input 
                            type="time" 
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold-400 focus:outline-none [color-scheme:dark]"
                        />
                        </div>
                    </div>
                  </div>
                </div>

                {/* 3. Details */}
                <div className="bg-luxury-charcoal p-6 rounded-2xl border border-white/5 shadow-2xl">
                   <h3 className="font-serif text-2xl mb-6 text-gold-100 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gold-400 text-black text-xs font-bold flex items-center justify-center">3</span>
                    Guest Details
                  </h3>
                  <div className="space-y-4">
                     <input 
                      type="text" 
                      placeholder="Full Name" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none placeholder-gray-600"
                    />
                     <input 
                      type="email" 
                      placeholder="Email Address" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none placeholder-gray-600"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!selectedServiceId || !date || !time || !name || !email}
                  className="w-full py-4 bg-gold-400 text-black font-sans uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  Confirm Appointment
                </button>

              </form>
            </div>

            {/* RIGHT COLUMN: MAP & INFO */}
            <div className="space-y-8">
               {/* COUPON BOX */}
               <CouponBox onApply={checkCoupon} isApplied={discountApplied} />

               {/* STYLED DARK MAP */}
               <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/5 relative group shadow-2xl">
                  <div className="absolute inset-0 pointer-events-none z-10 border-4 border-luxury-charcoal/50 rounded-2xl shadow-inner"></div>
                  
                  {/* Google Map Iframe with Dark Mode Filter */}
                  <iframe 
                    src={cmsContent.contact.mapUrl} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(90%) contrast(85%) grayscale(20%)' }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                  <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-gold-400/30">
                     <p className="text-gold-400 text-xs uppercase tracking-widest mb-1">Location</p>
                     <p className="text-white font-serif text-lg">Gulshan Avenue</p>
                  </div>
               </div>

               {/* Contact Card - Matching the dark theme specifically */}
               <div className="p-8 bg-gradient-to-br from-luxury-charcoal to-black border border-gold-400/10 rounded-2xl shadow-2xl">
                  <h3 className="font-serif text-2xl text-white mb-6">Concierge Assistance</h3>
                  <div className="space-y-6 text-gray-400 font-light text-sm">
                     <div className="flex items-start gap-4">
                        <MapPin className="text-gold-400 shrink-0" />
                        <div>
                           <p className="text-white font-medium mb-1">Elysium Parlour</p>
                           <p>{cmsContent.contact.addressLine1}</p>
                           <p>{cmsContent.contact.addressLine2}</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <Phone className="text-gold-400 shrink-0" />
                        <div>
                           <p className="text-white font-medium mb-1">Direct Line</p>
                           <p>{cmsContent.contact.phone}</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <Clock className="text-gold-400 shrink-0" />
                        <div>
                           <p className="text-white font-medium mb-1">Opening Hours</p>
                           <p>{cmsContent.contact.hours}</p>
                           <p>Friday: 2pm - 10pm</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingSection;