import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Section } from '../types';

interface NavigationProps {
  onBookClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onBookClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id: Section) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { id: Section.SERVICES, label: 'Services' },
    { id: Section.EXPERIENCE, label: 'The Experience' },
    { id: Section.CONTACT, label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'py-4 glass-panel border-b border-white/5' : 'py-8 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="cursor-pointer z-50" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
           <h1 className="font-serif text-2xl md:text-3xl tracking-widest text-gold-100 font-bold">ELYSIUM</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="font-sans text-xs tracking-[0.2em] uppercase text-gray-300 hover:text-gold-400 transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gold-400 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <button 
             onClick={onBookClick}
             className="px-6 py-2 border border-gold-400/50 text-gold-400 text-xs tracking-widest uppercase hover:bg-gold-400 hover:text-black transition-all duration-300"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden z-50 text-gold-100" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="font-serif text-3xl text-white hover:text-gold-400 transition-colors"
            >
              {link.label}
            </button>
          ))}
           <button 
             onClick={() => { onBookClick(); setMobileOpen(false); }}
             className="mt-4 px-8 py-3 bg-gold-400 text-black text-sm tracking-widest uppercase"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;