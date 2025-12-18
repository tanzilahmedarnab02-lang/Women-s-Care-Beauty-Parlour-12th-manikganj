
export interface Service {
  id: string;
  title: string;
  description: string;
  price: string; // Stored as string with symbol, e.g., "৳5000"
  duration: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum Section {
  HERO = 'hero',
  SERVICES = 'services',
  EXPERIENCE = 'experience',
  BOOKING = 'booking',
  CONTACT = 'contact'
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  isVip: boolean;
}

export interface CMSContent {
  hero: {
    subtitle: string;
    title: string;
    tagline: string;
  };
  contact: {
    addressLine1: string;
    addressLine2: string;
    phone: string;
    hours: string;
    mapUrl: string;
  };
}

export interface AdminStats {
  revenue: number;
  bookings: number;
  satisfaction: number;
}

export interface AdminCredentials {
  username: string;
  passcode: string;
}
