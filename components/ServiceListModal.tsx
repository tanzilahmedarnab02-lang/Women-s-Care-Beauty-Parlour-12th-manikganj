import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Service } from '../types';

const MotionDiv = motion.div as any;

interface ServiceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
}

const ServiceListModal: React.FC<ServiceListModalProps> = ({ isOpen, onClose, services }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <MotionDiv 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl bg-luxury-charcoal border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20">
            <h2 className="font-serif text-3xl text-gold-400">Full Service Menu</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="overflow-y-auto p-8 custom-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/10">
                    <tr>
                        <th className="py-4 font-normal">Service Name</th>
                        <th className="py-4 font-normal">Description</th>
                        <th className="py-4 font-normal text-right">Duration</th>
                        <th className="py-4 font-normal text-right">Price</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                    {services.map((service) => (
                        <tr key={service.id} className="hover:bg-white/5 transition-colors group">
                            <td className="py-6 font-serif text-lg text-white group-hover:text-gold-200 transition-colors">
                                {service.title}
                            </td>
                            <td className="py-6 pr-8 text-gray-400 font-light leading-relaxed">
                                {service.description}
                            </td>
                            <td className="py-6 text-right font-sans text-xs uppercase tracking-wide">
                                {service.duration}
                            </td>
                            <td className="py-6 text-right font-sans text-gold-400 font-medium">
                                {service.price}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <div className="p-6 border-t border-white/5 bg-black/20 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest">
                Prices are inclusive of all taxes.
            </p>
        </div>
      </MotionDiv>
    </div>
  );
};

export default ServiceListModal;