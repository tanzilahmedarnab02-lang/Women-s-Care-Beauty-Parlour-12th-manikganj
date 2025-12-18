import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowDown, MapPin, Phone, Clock, Instagram, Facebook, Lock, MessageCircle, Send, Globe, Star, Award, Gem, Sparkles as SparklesIcon } from 'lucide-react';
import Hero3D from './components/Hero3D';
import Navigation from './components/Navigation';
import Concierge from './components/Concierge';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import BookingSection from './components/AppointmentPage';
import ServiceListModal from './components/ServiceListModal';
import CinematicIntro from './components/CinematicIntro';
import { Section, Service, Appointment, CMSContent, AdminCredentials } from './types';

// Fix for framer-motion type issues
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionH1 = motion.h1 as any;
const MotionA = motion.a as any;
const MotionImg = motion.img as any;

// --- INITIAL DATA STATES ---

const initialServices: Service[] = [
  {
    id: '1',
    title: "Bridal Ethereal Glow",
    price: "৳15,000",
    description: "High-definition airbrush makeup for the perfect wedding day radiance.",
    duration: "120m",
    image: "https://images.unsplash.com/photo-1487412947132-26c244971044?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: '2',
    title: "Midnight Smokey Glam",
    price: "৳8,000",
    description: "Intense, sultry eye makeup paired with nude lips for evening galas.",
    duration: "90m",
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: '3',
    title: "The Gold Contour",
    price: "৳6,500",
    description: "Expert sculpting and highlighting using 24K gold infused products.",
    duration: "60m",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: '4',
    title: "Avant-Garde Artistry",
    price: "৳10,000",
    description: "Editorial style creative makeup for photoshoots and runway looks.",
    duration: "100m",
    image: "https://images.unsplash.com/photo-1503236823255-94308a44eb67?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: '5',
    title: "Porcelain Skin Finish",
    price: "৳5,500",
    description: "Glass-skin makeup technique for a flawless, natural dewy look.",
    duration: "60m",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop"
  }
];

const initialCMS: CMSContent = {
  hero: {
    subtitle: "Est. 2024 • Dhaka • Gulshan",
    title: "ELYSIUM",
    tagline: "Where beauty meets infinite luxury."
  },
  contact: {
    addressLine1: "128 Gulshan Avenue, Penthouse Suite",
    addressLine2: "Dhaka, Bangladesh 1212",
    phone: "+880 1711-000000",
    hours: "Mon - Sat: 10am - 9pm",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.015243853683!2d90.41031337609276!3d23.793751787550183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a0f7514101%3A0x633d7b432924151b!2sGulshan%201%2C%20Dhaka%201212!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
  }
};

const initialAppointments: Appointment[] = [
  { id: '101', clientName: 'Sadia Islam', clientEmail: 'sadia@test.com', serviceId: '1', serviceName: 'Bridal Ethereal Glow', date: '2024-10-25', time: '10:00 AM', status: 'confirmed', isVip: true },
  { id: '102', clientName: 'Rahim Khan', clientEmail: 'rahim@test.com', serviceId: '2', serviceName: 'Midnight Smokey Glam', date: '2024-10-25', time: '02:00 PM', status: 'pending', isVip: false }
];

// --- COMPONENT ---

const ServiceCard: React.FC<{ item: Service; index: number; onBook: (id: string) => void }> = ({ item, index, onBook }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for fluid movement
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Tilt rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  // Image Parallax (moves opposite to tilt for depth)
  const imageX = useTransform(mouseXSpring, [-0.5, 0.5], ["-10%", "10%"]);
  const imageY = useTransform(mouseYSpring, [-0.5, 0.5], ["-10%", "10%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      style={{ perspective: 1000 }}
      className="h-[500px] w-[350px] shrink-0 cursor-pointer snap-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onBook(item.id)}
    >
      <motion.div
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d" 
        }}
        className="group relative h-full w-full overflow-hidden shadow-2xl transition-all duration-300 border border-white/5"
      >
        {/* Background & Image Layer */}
        <div className="absolute inset-0 bg-gray-900 overflow-hidden" style={{ transform: "translateZ(0)" }}>
          <motion.img 
            style={{ x: imageX, y: imageY, scale: 1.15 }}
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover opacity-70 transition-opacity duration-700 group-hover:opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
        </div>
        
        {/* Content Layer - Floats above */}
        <div className="absolute bottom-0 left-0 right-0 p-8 transform" style={{ transform: "translateZ(50px)" }}>
          <div className="w-12 h-[1px] bg-gold-400 mb-6 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
          <h3 className="font-serif text-3xl text-white mb-2 drop-shadow-md">{item.title}</h3>
          <p className="font-sans text-xs tracking-widest text-gold-400 mb-4">{item.price}</p>
          <p className="font-sans text-gray-400 text-sm opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            {item.description}
          </p>
        </div>
        
        {/* Border Layer - Floats mid-way */}
        <div 
          className="absolute inset-4 border border-white/10 opacity-0 transition-all duration-500 group-hover:opacity-100 pointer-events-none" 
          style={{ transform: "translateZ(30px)" }} 
        />
      </motion.div>
    </motion.div>
  );
};

const ProjectMarquee: React.FC = () => {
    const projects = [
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503236823255-94308a44eb67?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop",
    ];

    return (
        <div className="w-full overflow-hidden py-12 bg-black/50 border-y border-white/5 relative group">
            <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-luxury-charcoal to-transparent z-10"></div>
            <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-luxury-charcoal to-transparent z-10"></div>
            
            <div className="flex gap-4 mb-4 px-6 items-center">
                 <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></div>
                 <h4 className="text-xs font-sans tracking-[0.3em] uppercase text-gold-400">Our Recent Masterpieces</h4>
            </div>

            <MotionDiv 
                className="flex gap-6 w-max"
                animate={{ x: [0, -1500] }}
                transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            >
                {[...projects, ...projects, ...projects].map((img, i) => (
                    <div key={i} className="relative w-64 h-40 rounded-lg overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105 cursor-pointer">
                        <img src={img} alt="Project" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                             <p className="text-[10px] text-white font-sans uppercase tracking-widest opacity-0 hover:opacity-100 transition-opacity">Look #{i + 1}</p>
                        </div>
                    </div>
                ))}
            </MotionDiv>
        </div>
    );
}

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  // --- STATES ---
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<'client' | 'admin'>('client');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  
  // Admin & Config States
  const [isAiAgentEnabled, setIsAiAgentEnabled] = useState(true);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>({
    username: 'admin',
    passcode: 'admin'
  });
  
  // Data States
  const [services, setServices] = useState<Service[]>(initialServices);
  const [cmsContent, setCmsContent] = useState<CMSContent>(initialCMS);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  
  // Selection State for passing data between sections
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | null>(null);

  // --- AUTO SCROLL & DRAG LOGIC ---
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const scroll = () => {
      if (carouselRef.current && !isDragging) {
        const scrollWidth = carouselRef.current.scrollWidth;
        const oneSetWidth = scrollWidth / 3;

        if (carouselRef.current.scrollLeft >= oneSetWidth) {
           carouselRef.current.scrollLeft -= oneSetWidth;
        } else {
           carouselRef.current.scrollLeft += 1;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
      if(!carouselRef.current) return;
      setIsDragging(true);
      setStartX(e.pageX - carouselRef.current.offsetLeft);
      setInitialScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
      setIsDragging(false);
  };

  const handleMouseUp = () => {
      setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if(!isDragging || !carouselRef.current) return;
      e.preventDefault();
      const x = e.pageX - carouselRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      carouselRef.current.scrollLeft = initialScrollLeft - walk;
  };

  // --- HANDLERS ---
  const handleNewBooking = (bookingData: Partial<Appointment>) => {
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: bookingData.clientName || 'Guest',
      clientEmail: bookingData.clientEmail || '',
      serviceId: bookingData.serviceId || '',
      serviceName: bookingData.serviceName || 'Service',
      date: bookingData.date || new Date().toISOString().split('T')[0],
      time: bookingData.time || '10:00 AM',
      status: 'pending',
      isVip: false
    };
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const scrollToBooking = () => {
     const el = document.getElementById(Section.BOOKING);
     if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle clicking a service card
  const handleServiceClick = (id: string) => {
    setPreSelectedServiceId(id);
    scrollToBooking();
  };

  // Contact Handlers
  const handleWhatsApp = () => {
     // Remove non-numeric chars from phone
     const cleanPhone = cmsContent.contact.phone.replace(/[^0-9]/g, '');
     window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleCall = () => {
     window.location.href = `tel:${cmsContent.contact.phone}`;
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <div className={`bg-luxury-black min-h-screen text-white selection:bg-gold-400 selection:text-black overflow-x-hidden ${showIntro ? 'h-screen overflow-hidden' : ''}`}>
        
        {view === 'admin' ? (
          <AdminDashboard 
            onLogout={() => setView('client')} 
            appointments={appointments}
            setAppointments={setAppointments}
            services={services}
            setServices={setServices}
            cmsContent={cmsContent}
            setCmsContent={setCmsContent}
            isAiAgentEnabled={isAiAgentEnabled}
            setIsAiAgentEnabled={setIsAiAgentEnabled}
            adminCredentials={adminCredentials}
            setAdminCredentials={setAdminCredentials}
          />
        ) : (
          <>
            <Navigation onBookClick={scrollToBooking} />
            
            {/* HERO SECTION */}
            <section id={Section.HERO} className="relative h-screen flex items-center justify-center overflow-hidden">
              <Hero3D />
              
              <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <MotionDiv
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: showIntro ? 0 : 0.5 }}
                >
                  <p className="font-sans text-gold-400 tracking-[0.4em] text-xs md:text-sm mb-6 uppercase">
                    {cmsContent.hero.subtitle}
                  </p>
                  
                  {/* ANIMATED GLOWING TITLE */}
                  <MotionH1
                    className="font-serif text-6xl md:text-8xl lg:text-9xl mb-8 leading-tight text-white"
                    initial={{ letterSpacing: '0.1em' }}
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(255,255,255,0.2)",
                        "0 0 40px rgba(255,255,255,0.8)",
                        "0 0 10px rgba(255,255,255,0.2)"
                      ]
                    }}
                    transition={{
                      textShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {cmsContent.hero.title}
                  </MotionH1>
                  
                  <p className="font-serif text-xl md:text-2xl text-gray-400 italic mb-12">
                    {cmsContent.hero.tagline}
                  </p>
                  
                  <MotionButton 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const el = document.getElementById(Section.SERVICES);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-transparent border border-gold-400 text-gold-400 font-sans tracking-[0.2em] text-xs uppercase hover:bg-gold-400 hover:text-black transition-colors duration-300"
                  >
                    Explore Services
                  </MotionButton>
                </MotionDiv>
              </div>

              <MotionDiv 
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
              >
                <ArrowDown size={24} />
              </MotionDiv>
            </section>

            {/* EXPERIENCE SECTION: FOUNDER & DETAILS */}
            <section id={Section.EXPERIENCE} className="py-24 relative bg-luxury-charcoal overflow-hidden">
               <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-black/50 to-transparent pointer-events-none"></div>
               
               <div className="container mx-auto px-6">
                  <MotionDiv 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                  >
                     <span className="text-gold-400 tracking-[0.3em] text-xs uppercase block mb-4">The Vision</span>
                     <h2 className="font-serif text-5xl md:text-6xl text-white">Legacy & Craft</h2>
                  </MotionDiv>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
                     
                     {/* FOUNDER PROFILE (Left - Col 4) */}
                     <div className="lg:col-span-5 relative group">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold-400/20">
                            <MotionImg 
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.8 }}
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop" 
                                className="w-full aspect-[4/5] object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                                alt="Founder"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <h3 className="font-serif text-3xl text-white mb-1">Sarah Elysia</h3>
                                <p className="font-sans text-gold-400 text-xs tracking-widest uppercase mb-4">Founder & Lead Artist</p>
                                <div className="w-10 h-[1px] bg-white/30 mb-4"></div>
                                <p className="font-serif text-xl text-gray-300 italic">"True beauty is not about covering up, but illuminating the light that already exists within."</p>
                            </div>
                        </div>
                        {/* Decorative Signature Effect */}
                        <div className="absolute -bottom-10 -right-10 z-0 opacity-10 pointer-events-none">
                            <h2 className="font-serif text-9xl text-white">Sarah</h2>
                        </div>
                     </div>

                     {/* PARLOUR DETAILS (Right - Col 8) */}
                     <div className="lg:col-span-7 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Feature Card 1 */}
                            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-gold-400/30 transition-all group">
                                <Gem className="text-gold-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
                                <h4 className="font-serif text-xl text-white mb-2">The Sanctuary</h4>
                                <p className="text-gray-400 text-sm font-light">4,000 sq ft of pure luxury designed to isolate you from the city's chaos. Featuring 8 private VIP suites.</p>
                            </div>
                            {/* Feature Card 2 */}
                            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-gold-400/30 transition-all group">
                                <Award className="text-gold-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
                                <h4 className="font-serif text-xl text-white mb-2">World Class</h4>
                                <p className="text-gray-400 text-sm font-light">Awarded 'Best Luxury Spa 2023' in Dhaka. Our artists are internationally certified from London & Dubai.</p>
                            </div>
                             {/* Feature Card 3 */}
                            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-gold-400/30 transition-all group">
                                <SparklesIcon className="text-gold-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
                                <h4 className="font-serif text-xl text-white mb-2">Organic Lab</h4>
                                <p className="text-gray-400 text-sm font-light">We mix our own organic face masks fresh before every appointment, using ingredients sourced from Kyoto.</p>
                            </div>
                            {/* Feature Card 4 */}
                            <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-gold-400/30 transition-all group">
                                <Star className="text-gold-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
                                <h4 className="font-serif text-xl text-white mb-2">5-Star Hygiene</h4>
                                <p className="text-gray-400 text-sm font-light">Hospital-grade sterilization for all tools. Single-use kits for every client ensuring absolute safety.</p>
                            </div>
                        </div>
                        
                        <div className="p-8 bg-gradient-to-r from-gold-900/20 to-transparent border-l-2 border-gold-400 rounded-r-xl">
                            <h4 className="font-serif text-2xl text-white mb-2">The Elysium Promise</h4>
                            <p className="text-gray-400 font-sans font-light">We don't just offer services; we curate experiences. From the moment you step in, to the moment you leave, you are royalty.</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* DYNAMIC PROJECTS (Bottom) */}
               <ProjectMarquee />
            </section>

            {/* SERVICES SECTION */}
            <section id={Section.SERVICES} className="py-32 bg-black overflow-hidden">
              <div className="container mx-auto px-6 mb-16">
                <MotionDiv 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <span className="text-gold-400 tracking-[0.3em] text-xs uppercase block mb-4">Our Menu</span>
                  <h2 className="font-serif text-5xl md:text-6xl text-white">Curated Artistry</h2>
                </MotionDiv>
              </div>

              <div 
                className="w-full overflow-hidden cursor-grab active:cursor-grabbing"
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                 <div className="flex gap-8 px-8 w-max pb-12">
                    {[...services, ...services, ...services].map((service, index) => (
                      <ServiceCard 
                        key={`${service.id}-${index}`} 
                        item={service} 
                        index={index} 
                        onBook={handleServiceClick} 
                      />
                    ))}
                 </div>
              </div>
              
              <div className="container mx-auto text-center mt-8">
                 <button onClick={() => setIsServiceMenuOpen(true)} className="text-sm font-sans tracking-widest text-white border-b border-gold-400 pb-1 hover:text-gold-400 transition-colors">
                   VIEW FULL MENU
                 </button>
              </div>
            </section>

            {/* PARALLAX QUOTE */}
            <section className="h-[60vh] relative flex items-center justify-center overflow-hidden">
              <motion.div style={{ y }} className="absolute inset-0 z-0">
                 <img src="https://images.unsplash.com/photo-1604147706283-d711945205f9?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-30" alt="Texture" />
              </motion.div>
              <div className="relative z-10 container mx-auto px-6 text-center">
                <h2 className="font-serif text-4xl md:text-6xl text-white leading-normal italic">
                  "Elegance is the only beauty that never fades."
                </h2>
                <p className="mt-6 font-sans text-gold-400 tracking-widest text-sm uppercase">- Audrey Hepburn</p>
              </div>
            </section>

            {/* BOOKING SECTION (NEW) */}
            <BookingSection 
              services={services} 
              cmsContent={cmsContent} 
              onBook={handleNewBooking} 
              preSelectedServiceId={preSelectedServiceId}
            />

            {/* REDESIGNED CONTACT & FOOTER SECTION */}
            <section id={Section.CONTACT} className="relative bg-black pt-32 pb-12 overflow-hidden">
               {/* Background Ambiance */}
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="container mx-auto px-6 relative z-10">
                
                <MotionDiv 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-20 text-center"
                >
                    <span className="text-gold-400 tracking-[0.3em] text-xs uppercase block mb-4">Connect With Us</span>
                    <h2 className="font-serif text-5xl md:text-7xl text-white">The ELYSIUM Gate</h2>
                </MotionDiv>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                   
                   {/* Left: Contact Portals */}
                   <div className="space-y-6">
                      {/* Phone Card */}
                      <MotionDiv 
                         whileHover={{ scale: 1.02 }}
                         onClick={handleCall}
                         className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-gold-400/50 hover:bg-white/10"
                      >
                         <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black border border-gold-400 text-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform group-hover:scale-110">
                                  <Phone size={28} />
                               </div>
                               <div>
                                  <h3 className="font-serif text-2xl text-white group-hover:text-gold-200 transition-colors">Voice Concierge</h3>
                                  <p className="font-sans text-xs text-gray-400 tracking-wider uppercase mt-1">Instant Reservation Support</p>
                               </div>
                            </div>
                            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                               <ArrowDown className="-rotate-90 text-gold-400" size={16} />
                            </div>
                         </div>
                         <div className="absolute inset-0 bg-gradient-to-r from-gold-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </MotionDiv>

                      {/* WhatsApp Card */}
                      <MotionDiv 
                         whileHover={{ scale: 1.02 }}
                         onClick={handleWhatsApp}
                         className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-green-400/50 hover:bg-white/10"
                      >
                         <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-6">
                               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black border border-white/20 text-green-400 transition-transform group-hover:scale-110 group-hover:border-green-400 group-hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                                  <MessageCircle size={28} />
                               </div>
                               <div>
                                  <h3 className="font-serif text-2xl text-white group-hover:text-green-300 transition-colors">Priority Chat</h3>
                                  <p className="font-sans text-xs text-gray-400 tracking-wider uppercase mt-1">Direct WhatsApp Access</p>
                               </div>
                            </div>
                            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                               <ArrowDown className="-rotate-90 text-green-400" size={16} />
                            </div>
                         </div>
                         <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </MotionDiv>
                   </div>

                   {/* Right: Unique Subscription Invitation */}
                   <div className="relative p-10 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-luxury-charcoal to-black shadow-2xl overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-20">
                         <Globe size={120} className="text-gold-400 spin-slow" />
                      </div>
                      
                      <h3 className="font-serif text-4xl text-white mb-2 relative z-10">The Inner Circle</h3>
                      <p className="text-gray-400 font-sans text-sm mb-8 relative z-10 max-w-sm leading-relaxed">
                         Unlock access to private events, seasonal masterclasses, and hidden appointment slots reserved only for members.
                      </p>

                      <form className="relative z-10 space-y-8" onSubmit={(e) => e.preventDefault()}>
                         <div className="relative group">
                            <input 
                              type="email" 
                              placeholder="Your Email Signature" 
                              className="w-full bg-transparent border-b border-gray-700 py-4 text-xl text-white font-serif placeholder:text-gray-600 focus:outline-none focus:border-gold-400 transition-colors"
                            />
                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold-400 transition-all duration-500 group-focus-within:w-full" />
                         </div>

                         <MotionButton
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black font-sans font-bold uppercase tracking-[0.2em] text-xs rounded shadow-[0_0_20px_rgba(212,175,55,0.4)] relative overflow-hidden group"
                         >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                               Request Privilege <Send size={14} />
                            </span>
                            <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                         </MotionButton>
                      </form>
                   </div>

                </div>

                {/* Footer Links & Info */}
                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                   <div className="text-center md:text-left">
                      <h4 className="font-serif text-2xl text-gold-400 mb-2">ELYSIUM</h4>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest">&copy; 2024. All Rights Reserved.</p>
                   </div>
                   
                   <div className="flex items-center gap-8">
                      <MotionA 
                         href="#" 
                         whileHover={{ y: -5 }} 
                         className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                         <Instagram size={18} />
                      </MotionA>
                      <MotionA 
                         href="#" 
                         whileHover={{ y: -5 }} 
                         className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                         <Facebook size={18} />
                      </MotionA>
                      <button 
                         onClick={() => setIsLoginOpen(true)}
                         className="flex items-center gap-2 text-[10px] text-gray-600 hover:text-gold-400 uppercase tracking-widest transition-colors ml-4"
                      >
                         <Lock size={12} /> Staff Entrance
                      </button>
                   </div>
                </div>
              </div>
            </section>

            <Concierge 
               services={services} 
               cmsContent={cmsContent} 
               onBook={handleNewBooking} 
               enabled={isAiAgentEnabled}
            />
            <ServiceListModal 
              isOpen={isServiceMenuOpen} 
              onClose={() => setIsServiceMenuOpen(false)} 
              services={services} 
            />
            <LoginModal 
              isOpen={isLoginOpen} 
              onClose={() => setIsLoginOpen(false)} 
              onLoginSuccess={() => setView('admin')}
              credentials={adminCredentials}
            />
          </>
        )}
      </div>
    </>
  );
};

export default App;