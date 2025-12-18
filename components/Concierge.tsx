import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, MessageSquare, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToConcierge } from '../services/geminiService';
import { ChatMessage, Service, CMSContent, Appointment } from '../types';

const MotionButton = motion.button as any;
const MotionDiv = motion.div as any;

interface ConciergeProps {
  services: Service[];
  cmsContent: CMSContent;
  onBook: (data: Partial<Appointment>) => void;
  enabled?: boolean;
}

const Concierge: React.FC<ConciergeProps> = ({ services, cmsContent, onBook, enabled = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'স্বাগতম Elysium-এ। আমি কাস্টমার কেয়ার। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Call AI Service
    const result = await sendMessageToConcierge(messages, input, services, cmsContent);
    
    setIsTyping(false);
    
    // Check if a booking was requested by the AI
    if (result.bookingData) {
        onBook({
            clientName: result.bookingData.clientName,
            clientEmail: result.bookingData.clientEmail || 'guest@elysium.com',
            serviceName: result.bookingData.serviceName,
            date: result.bookingData.date,
            time: result.bookingData.time,
            status: 'pending', // Default to pending for AI bookings
            isVip: false
        });
    }

    setMessages(prev => [...prev, { role: 'model', text: result.text }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!enabled) return null;

  return (
    <>
      {/* Floating Action Button */}
      <MotionButton
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl border border-gold-400/30 flex items-center justify-center gap-2 transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-luxury-charcoal text-gold-400'}`}
      >
        <Sparkles size={24} />
        <span className="font-serif tracking-widest text-sm hidden md:block">CHAT</span>
      </MotionButton>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 w-[90vw] md:w-[400px] h-[500px] rounded-2xl overflow-hidden shadow-2xl glass-panel border border-gold-400/20 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-luxury-charcoal to-black p-4 flex justify-between items-center border-b border-gold-400/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center border border-gold-400/30">
                  <Bot size={20} className="text-gold-400" />
                </div>
                <div>
                  <h3 className="font-serif text-gold-200 text-lg">Customer Care</h3>
                  <p className="text-xs text-gray-400 font-sans tracking-wide">Support Agent</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-luxury-black/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gold-600/20 text-white border border-gold-600/30 rounded-br-none' 
                      : 'bg-white/5 text-gray-200 border border-white/10 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                      <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-luxury-charcoal border-t border-gold-400/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="আপনার প্রশ্ন লিখুন..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors font-sans placeholder-gray-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gold-400 hover:text-gold-200 disabled:opacity-50 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

export default Concierge;