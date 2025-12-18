import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Check, ChevronRight, User } from 'lucide-react';
import ServiceOrb from './ServiceOrb';
import { Service, Appointment } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onBook: (data: Partial<Appointment>) => void;
}

const MotionDiv = motion.div as any;

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, services, onBook }) => {
  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Reset on close
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSelectedServiceId(null);
        setName('');
        setEmail('');
      }, 500);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!selectedServiceId) return;
    const s = services.find(x => x.id === selectedServiceId);
    
    onBook({
      clientName: name,
      clientEmail: email,
      serviceId: s?.id,
      serviceName: s?.title,
      date: new Date().toISOString().split('T')[0], // Mock date
      time: '2:00 PM' // Mock time
    });
    setStep(3);
  };

  const selectedService = services.find(s => s.id === selectedServiceId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <MotionDiv 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <MotionDiv 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="relative w-full max-w-4xl bg-luxury-black border border-gold-400/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px]"
      >
        {/* Left Side: 3D Visual */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-luxury-charcoal to-black relative flex flex-col items-center justify-center border-r border-white/5">
           <div className="absolute top-6 left-6 font-serif text-gold-400 tracking-widest text-xs uppercase">
              Elysium Booking
           </div>
           <ServiceOrb active={true} />
           <div className="absolute bottom-10 px-8 text-center">
              <h3 className="font-serif text-2xl text-white mb-2">
                {step === 1 && "Select Ritual"}
                {step === 2 && "Choose Time"}
                {step === 3 && "Finalize"}
                {step === 4 && "Confirmed"}
              </h3>
              <p className="text-gray-500 text-xs font-sans">Step {step} of 3</p>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 md:p-12 relative overflow-hidden bg-luxury-black/95">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
            <X size={24} />
          </button>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <MotionDiv 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col justify-center"
              >
                <h2 className="font-serif text-3xl text-white mb-8">Select Your Experience</h2>
                <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                  {services.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => setSelectedServiceId(s.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex justify-between items-center group
                        ${selectedServiceId === s.id ? 'bg-gold-400/20 border-gold-400' : 'bg-white/5 border-white/10 hover:border-gold-400/50'}`}
                    >
                      <div>
                        <h4 className="font-serif text-xl text-white group-hover:text-gold-200">{s.title}</h4>
                        <span className="text-xs text-gray-400 font-sans">{s.duration} Duration</span>
                      </div>
                      <span className="font-sans text-gold-400">{s.price}</span>
                    </div>
                  ))}
                </div>
                <button 
                  disabled={!selectedServiceId}
                  onClick={() => setStep(2)}
                  className="mt-8 self-end px-8 py-3 bg-gold-400 text-black font-sans uppercase tracking-widest text-xs font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next <ChevronRight size={14} />
                </button>
              </MotionDiv>
            )}

            {step === 2 && (
              <MotionDiv 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col justify-center"
              >
                <h2 className="font-serif text-3xl text-white mb-8">Reservation Details</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <label className="block text-xs text-gold-400 mb-2 uppercase">Date</label>
                      <div className="flex items-center gap-2 text-white">
                        <Calendar size={16} />
                        <span>Today (Simulated)</span>
                      </div>
                   </div>
                   <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <label className="block text-xs text-gold-400 mb-2 uppercase">Time</label>
                      <div className="flex items-center gap-2 text-white">
                        <Clock size={16} />
                        <span>2:00 PM (Simulated)</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                     <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                     <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border border-gray-700 rounded-xl py-3 pl-12 text-white focus:border-gold-400 focus:outline-none" 
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full bg-transparent border border-gray-700 rounded-xl py-3 px-4 text-white focus:border-gold-400 focus:outline-none" 
                  />
                </div>

                <div className="flex justify-between mt-8">
                   <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white text-sm">Back</button>
                   <button 
                    disabled={!name || !email}
                    onClick={handleConfirm}
                    className="px-8 py-3 bg-gold-400 text-black font-sans uppercase tracking-widest text-xs font-bold hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    Confirm Booking
                  </button>
                </div>
              </MotionDiv>
            )}

            {step === 3 && (
              <MotionDiv 
                key="step3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gold-400 text-black flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                   <Check size={40} />
                </div>
                <h2 className="font-serif text-4xl text-white mb-2">Confirmed</h2>
                <p className="text-gray-400 font-sans mb-8 max-w-xs mx-auto">
                  Your appointment for <strong>{selectedService?.title}</strong> has been secured.
                </p>
                <button 
                  onClick={onClose}
                  className="text-gold-400 border-b border-gold-400 pb-1 text-sm uppercase tracking-widest hover:text-white hover:border-white transition-colors"
                >
                  Return to Sanctuary
                </button>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </MotionDiv>
    </div>
  );
};

export default BookingModal;