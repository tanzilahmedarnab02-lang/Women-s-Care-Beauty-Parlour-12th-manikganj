import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, Key, ChevronRight, AlertCircle } from 'lucide-react';
import ServiceOrb from './ServiceOrb';
import { AdminCredentials } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  credentials?: AdminCredentials;
}

// Fix for framer-motion type issues
const MotionDiv = motion.div as any;

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, credentials = { username: 'admin', passcode: 'admin' } }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset state on close
  React.useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setPassword('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay for effect
    setTimeout(() => {
      if (username === credentials.username && password === credentials.passcode) {
        setIsLoading(false);
        onLoginSuccess();
        onClose();
      } else {
        setIsLoading(false);
        setError('Invalid credentials provided.');
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <MotionDiv 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
      />

      {/* Login Card */}
      <MotionDiv 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="relative w-full max-w-lg bg-luxury-black border border-gold-400/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white z-20">
          <X size={24} />
        </button>

        {/* 3D Header Area */}
        <div className="h-40 bg-gradient-to-b from-luxury-charcoal to-black relative flex items-center justify-center border-b border-white/5 overflow-hidden">
           <div className="absolute inset-0 opacity-50 pointer-events-none">
             <ServiceOrb active={true} />
           </div>
           <div className="relative z-10 flex flex-col items-center">
             <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400 flex items-center justify-center mb-2 text-gold-400">
               <Lock size={20} />
             </div>
             <h2 className="font-serif text-2xl text-white tracking-widest">STAFF PORTAL</h2>
             <p className="text-[10px] text-gray-500 font-sans uppercase tracking-[0.2em] mt-1">Authorized Access Only</p>
           </div>
        </div>

        {/* Form */}
        <div className="p-8 md:p-10 space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-4">
              <div className="relative group">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold-400 transition-colors" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold-400 focus:outline-none focus:bg-white/10 transition-all placeholder-gray-600 font-sans text-sm"
                />
              </div>
              
              <div className="relative group">
                <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold-400 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-gold-400 focus:outline-none focus:bg-white/10 transition-all placeholder-gray-600 font-sans text-sm"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <MotionDiv 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-400 text-xs bg-red-900/10 p-3 rounded-lg border border-red-900/30"
                >
                  <AlertCircle size={14} />
                  {error}
                </MotionDiv>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gold-400 text-black font-sans uppercase tracking-widest text-xs font-bold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-black rounded-full animate-bounce delay-150"></span>
                </span>
              ) : (
                <>Access Sanctuary <ChevronRight size={14} /></>
              )}
            </button>
          </form>

          <div className="text-center">
             <button onClick={onClose} className="text-xs text-gray-500 hover:text-gold-400 transition-colors border-b border-transparent hover:border-gold-400 pb-0.5">
               Return to Guest View
             </button>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
};

export default LoginModal;