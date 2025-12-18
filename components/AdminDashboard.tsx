import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, DollarSign, Calendar, TrendingUp, Sparkles, LogOut, 
  Bell, Search, Settings as SettingsIcon, CreditCard, 
  BarChart3, User, Mail, Edit3, Layout, PenTool, Plus, Trash2, Check, X, Save, Map, ToggleLeft, ToggleRight, Lock, Key
} from 'lucide-react';
import { getBusinessInsights } from '../services/geminiService';
import { Appointment, Service, CMSContent, AdminCredentials } from '../types';

const MotionDiv = motion.div as any;

interface AdminDashboardProps {
  onLogout: () => void;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  cmsContent: CMSContent;
  setCmsContent: React.Dispatch<React.SetStateAction<CMSContent>>;
  isAiAgentEnabled: boolean;
  setIsAiAgentEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  adminCredentials: AdminCredentials;
  setAdminCredentials: React.Dispatch<React.SetStateAction<AdminCredentials>>;
}

// --- SUB-COMPONENTS ---

const OverviewStats: React.FC<{ insight: string; appointments: Appointment[] }> = ({ insight, appointments }) => {
  const bookingsCount = appointments.length;
  // Calculate mock revenue in Taka
  const revenue = appointments.reduce((acc, curr) => acc + (curr.isVip ? 12000 : 5000), 0);
  const activeVIPs = appointments.filter(a => a.isVip).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* AI Insight */}
      <MotionDiv 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-gray-900 to-luxury-charcoal border border-gold-400/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={100} />
        </div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-gold-400/10 rounded-lg text-gold-400">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="font-serif text-lg text-gold-100 mb-2">Lumiere Executive Brief</h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{insight}</p>
          </div>
        </div>
      </MotionDiv>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-luxury-charcoal border border-white/5 hover:border-gold-400/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest">Revenue (Approx)</p>
              <h3 className="text-3xl font-serif mt-2 text-white">৳{revenue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-green-900/20 text-green-400 rounded-lg"><DollarSign size={20} /></div>
          </div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp size={12} /> Live Updates
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-luxury-charcoal border border-white/5 hover:border-gold-400/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest">Total Bookings</p>
              <h3 className="text-3xl font-serif mt-2 text-white">{bookingsCount}</h3>
            </div>
            <div className="p-2 bg-blue-900/20 text-blue-400 rounded-lg"><Calendar size={20} /></div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-luxury-charcoal border border-white/5 hover:border-gold-400/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest">Active VIPs</p>
              <h3 className="text-3xl font-serif mt-2 text-white">{activeVIPs}</h3>
            </div>
            <div className="p-2 bg-purple-900/20 text-purple-400 rounded-lg"><Users size={20} /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppointmentManager: React.FC<{ appointments: Appointment[]; setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>> }> = ({ appointments, setAppointments }) => {
  const [filter, setFilter] = useState('');

  const updateStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h3 className="font-serif text-2xl text-white">Live Schedule</h3>
         <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
             <input 
                type="text" 
                placeholder="Search clients..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-gold-400/50"
             />
         </div>
       </div>

       <div className="rounded-2xl bg-luxury-charcoal border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-[10px] uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4 font-light">Client</th>
                <th className="px-6 py-4 font-light">Service</th>
                <th className="px-6 py-4 font-light">Date & Time</th>
                <th className="px-6 py-4 font-light">Status</th>
                <th className="px-6 py-4 font-light text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {appointments.filter(a => a.clientName.toLowerCase().includes(filter.toLowerCase())).map((appt) => (
                <tr key={appt.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs text-white">
                        {appt.clientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white flex items-center gap-2">
                          {appt.clientName}
                          {appt.isVip && <span className="px-1.5 py-0.5 rounded bg-gold-400/20 text-gold-400 text-[9px] uppercase">VIP</span>}
                        </p>
                        <p className="text-[10px] text-gray-500">{appt.clientEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{appt.serviceName}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{appt.date} at {appt.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wide ${
                      appt.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : 
                      appt.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        {appt.status === 'pending' && (
                            <>
                            <button 
                                onClick={() => updateStatus(appt.id, 'confirmed')}
                                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                                title="Accept"
                            >
                                <Check size={14} />
                            </button>
                            <button 
                                onClick={() => updateStatus(appt.id, 'cancelled')}
                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                title="Cancel"
                            >
                                <X size={14} />
                            </button>
                            </>
                        )}
                        {(appt.status === 'confirmed' || appt.status === 'cancelled') && (
                            <button className="text-gray-600 cursor-not-allowed"><SettingsIcon size={14} /></button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                 <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                       No bookings yet.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
       </div>
    </div>
  );
};

// --- SETTINGS COMPONENT ---
const SettingsPanel: React.FC<{
    isAiEnabled: boolean;
    setAiEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    credentials: AdminCredentials;
    setCredentials: React.Dispatch<React.SetStateAction<AdminCredentials>>;
}> = ({ isAiEnabled, setAiEnabled, credentials, setCredentials }) => {
    const [tempCreds, setTempCreds] = useState(credentials);
    const [showPassword, setShowPassword] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSaveCreds = (e: React.FormEvent) => {
        e.preventDefault();
        setCredentials(tempCreds);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-8">
            {/* AI Agent Toggle */}
            <div className="p-6 bg-luxury-charcoal border border-white/5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gold-400/10 rounded-lg text-gold-400">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h4 className="font-serif text-lg text-white">AI Concierge (Customer Care)</h4>
                        <p className="text-sm text-gray-400">Enable or disable the floating chat agent on the client website.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setAiEnabled(!isAiEnabled)}
                    className={`transition-colors duration-300 ${isAiEnabled ? 'text-green-400' : 'text-gray-600'}`}
                >
                    {isAiEnabled ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
                </button>
            </div>

            {/* Password Management */}
            <div className="p-6 bg-luxury-charcoal border border-white/5 rounded-xl space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Lock size={18} className="text-gold-400" />
                    <h4 className="font-serif text-lg text-white">Admin Access Security</h4>
                </div>
                
                <form onSubmit={handleSaveCreds} className="space-y-4 max-w-md">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1 uppercase tracking-widest">Admin Username</label>
                        <input 
                            type="text" 
                            value={tempCreds.username}
                            onChange={(e) => setTempCreds({...tempCreds, username: e.target.value})}
                            className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-gold-400 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1 uppercase tracking-widest">New Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={tempCreds.passcode}
                                onChange={(e) => setTempCreds({...tempCreds, passcode: e.target.value})}
                                className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-gold-400 focus:outline-none pr-10"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                                <Key size={16} />
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-gold-400 hover:text-black transition-colors"
                    >
                        {saved ? <Check size={16} /> : <Save size={16} />}
                        {saved ? 'Updated' : 'Update Credentials'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ... Existing AddServiceModal, ServiceEditor, CMSEditor ... 
const AddServiceModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdd: (s: Service) => void }> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    title: '',
    price: '৳',
    description: '',
    duration: '',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2070&auto=format&fit=crop'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, id: Date.now().toString() });
    setFormData({
        title: '',
        price: '৳',
        description: '',
        duration: '',
        image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2070&auto=format&fit=crop'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <MotionDiv 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-luxury-charcoal border border-white/10 rounded-2xl p-8 w-full max-w-md relative shadow-2xl"
      >
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
         <h3 className="font-serif text-2xl text-white mb-6">Add New Ritual</h3>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-1">Service Title</label>
               <input 
                  required
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded p-3 text-sm text-white focus:border-gold-400 focus:outline-none"
                  placeholder="e.g. Royal Gold Facial"
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-1">Price</label>
                   <input 
                      required
                      type="text" 
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded p-3 text-sm text-white focus:border-gold-400 focus:outline-none"
                   />
                </div>
                <div>
                   <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-1">Duration</label>
                   <input 
                      required
                      type="text" 
                      value={formData.duration} 
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded p-3 text-sm text-white focus:border-gold-400 focus:outline-none"
                      placeholder="e.g. 60m"
                   />
                </div>
            </div>
            <div>
               <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-1">Description</label>
               <textarea 
                  required
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded p-3 text-sm text-white focus:border-gold-400 focus:outline-none resize-none h-24"
                  placeholder="Service details..."
               />
            </div>
            <div>
               <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-1">Image URL</label>
               <input 
                  required
                  type="text" 
                  value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 rounded p-3 text-xs text-gray-500 focus:border-gold-400 focus:outline-none"
               />
            </div>
            
            <button type="submit" className="w-full bg-gold-400 text-black py-4 mt-2 rounded font-sans font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors">
                Save & Add Service
            </button>
         </form>
      </MotionDiv>
    </div>
  );
};

const ServiceEditor: React.FC<{ services: Service[]; setServices: React.Dispatch<React.SetStateAction<Service[]>> }> = ({ services, setServices }) => {
   const [saved, setSaved] = useState(false);
   const [hasChanges, setHasChanges] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const updateService = (id: string, field: keyof Service, value: string) => {
      setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
      setHasChanges(true);
   };

   const deleteService = (id: string) => {
      if(confirm('Are you sure you want to remove this service?')) {
          setServices(prev => prev.filter(s => s.id !== id));
          setHasChanges(true);
      }
   }

   const handleAddService = (newService: Service) => {
       setServices(prev => [newService, ...prev]);
   };

   const handleSave = () => {
       setSaved(true);
       setHasChanges(false);
       setTimeout(() => setSaved(false), 2000);
   };

   return (
      <div className="space-y-6">
         <AddServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddService} />

         <div className="flex justify-between items-center bg-luxury-charcoal p-4 rounded-xl border border-white/5 sticky top-0 z-20 backdrop-blur-md shadow-lg">
            <h3 className="font-serif text-2xl text-white">Service Menu Editor</h3>
            <div className="flex gap-4 items-center h-10">
                <AnimatePresence>
                  {hasChanges && (
                    <MotionDiv 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2 bg-gold-400 text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-white transition-colors shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        >
                        {saved ? <Check size={14} /> : <Save size={14} />}
                        {saved ? 'Saved' : 'Save Changes'}
                        </button>
                    </MotionDiv>
                  )}
                </AnimatePresence>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-white/20 transition-colors border border-white/5"
                >
                    <Plus size={14} /> Add New
                </button>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
            {services.map((service) => (
               <MotionDiv 
                 key={service.id} 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                 className="p-6 bg-luxury-charcoal border border-white/5 rounded-xl flex flex-col md:flex-row gap-6 relative group"
               >
                  <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-black relative">
                     <img src={service.image} className="w-full h-full object-cover opacity-70" alt="Service" />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] text-white">Change Image URL</span>
                     </div>
                  </div>
                  <div className="flex-1 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-1">Service Title</label>
                           <input 
                              type="text" 
                              value={service.title} 
                              onChange={(e) => updateService(service.id, 'title', e.target.value)}
                              className="w-full bg-black/30 border border-white/10 rounded p-2 text-sm text-white focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                           />
                        </div>
                        <div>
                           <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-1">Price</label>
                           <input 
                              type="text" 
                              value={service.price} 
                              onChange={(e) => updateService(service.id, 'price', e.target.value)}
                              className="w-full bg-black/30 border border-white/10 rounded p-2 text-sm text-gold-400 focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-1">Description</label>
                        <input 
                           type="text" 
                           value={service.description} 
                           onChange={(e) => updateService(service.id, 'description', e.target.value)}
                           className="w-full bg-black/30 border border-white/10 rounded p-2 text-sm text-gray-300 focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                        />
                     </div>
                     <div>
                         <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-1">Image URL</label>
                          <input 
                           type="text" 
                           value={service.image} 
                           onChange={(e) => updateService(service.id, 'image', e.target.value)}
                           className="w-full bg-black/30 border border-white/10 rounded p-2 text-xs text-gray-500 focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                        />
                     </div>
                  </div>
                  <div className="flex flex-col justify-start pt-6">
                      <button 
                        onClick={() => deleteService(service.id)}
                        className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors"
                        title="Remove Service"
                      >
                         <Trash2 size={18} />
                      </button>
                  </div>
               </MotionDiv>
            ))}
            </AnimatePresence>
         </div>
      </div>
   );
};

const CMSEditor: React.FC<{ content: CMSContent; setContent: React.Dispatch<React.SetStateAction<CMSContent>> }> = ({ content, setContent }) => {
   const [saved, setSaved] = useState(false);
   const [hasChanges, setHasChanges] = useState(false);

   const updateHero = (field: keyof CMSContent['hero'], value: string) => {
      setContent(prev => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
      setHasChanges(true);
   };

   const updateContact = (field: keyof CMSContent['contact'], value: string) => {
      setContent(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
      setHasChanges(true);
   };

    const handleSave = () => {
       setSaved(true);
       setHasChanges(false);
       setTimeout(() => setSaved(false), 2000);
   };

   return (
      <div className="space-y-8">
         <div className="flex justify-between items-center bg-luxury-charcoal p-4 rounded-xl border border-white/5 sticky top-0 z-20 backdrop-blur-md shadow-lg">
            <h3 className="font-serif text-2xl text-white">Website Content Editor</h3>
            <div className="h-10 flex items-center">
                <AnimatePresence>
                    {hasChanges && (
                        <MotionDiv 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <button 
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2 bg-gold-400 text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-white transition-colors shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                            >
                                {saved ? <Check size={14} /> : <Save size={14} />}
                                {saved ? 'Saved' : 'Save Changes'}
                            </button>
                        </MotionDiv>
                    )}
                </AnimatePresence>
            </div>
         </div>
         
         {/* Hero Section */}
         <div className="p-6 bg-luxury-charcoal border border-white/5 rounded-xl space-y-6">
            <h4 className="flex items-center gap-2 text-gold-400 text-sm uppercase tracking-widest">
               <Layout size={16} /> Homepage Hero
            </h4>
            <div className="space-y-4">
               <div>
                  <label className="text-xs text-gray-500 block mb-1">Main Heading</label>
                  <input 
                     type="text" 
                     value={content.hero.title} 
                     onChange={(e) => updateHero('title', e.target.value)}
                     className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                  />
               </div>
               <div>
                  <label className="text-xs text-gray-500 block mb-1">Subtitle / Location</label>
                  <input 
                     type="text" 
                     value={content.hero.subtitle} 
                     onChange={(e) => updateHero('subtitle', e.target.value)}
                     className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                  />
               </div>
               <div>
                  <label className="text-xs text-gray-500 block mb-1">Tagline</label>
                  <input 
                     type="text" 
                     value={content.hero.tagline} 
                     onChange={(e) => updateHero('tagline', e.target.value)}
                     className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                  />
               </div>
            </div>
         </div>

         {/* Contact Section */}
         <div className="p-6 bg-luxury-charcoal border border-white/5 rounded-xl space-y-6">
            <h4 className="flex items-center gap-2 text-gold-400 text-sm uppercase tracking-widest">
               <Mail size={16} /> Contact Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-xs text-gray-500 block mb-1">Address Line 1</label>
                  <input 
                     type="text" 
                     value={content.contact.addressLine1} 
                     onChange={(e) => updateContact('addressLine1', e.target.value)}
                     className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                  />
               </div>
               <div>
                  <label className="text-xs text-gray-500 block mb-1">Address Line 2</label>
                  <input 
                     type="text" 
                     value={content.contact.addressLine2} 
                     onChange={(e) => updateContact('addressLine2', e.target.value)}
                     className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                  />
               </div>
               <div>
                  <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
                  <input 
                     type="text" 
                     value={content.contact.phone} 
                     onChange={(e) => updateContact('phone', e.target.value)}
                     className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                  />
               </div>
               <div>
                  <label className="text-xs text-gray-500 block mb-1">Business Hours</label>
                  <input 
                     type="text" 
                     value={content.contact.hours} 
                     onChange={(e) => updateContact('hours', e.target.value)}
                     className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                  />
               </div>
               <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Google Maps Embed URL</label>
                  <div className="flex gap-2">
                    <input 
                       type="text" 
                       value={content.contact.mapUrl} 
                       onChange={(e) => updateContact('mapUrl', e.target.value)}
                       className="w-full bg-black/30 border border-white/10 rounded p-3 text-white focus:border-gold-400 focus:outline-none transition-all focus:bg-black/50"
                       placeholder="https://www.google.com/maps/embed?..."
                    />
                    <a 
                       href="https://www.google.com/maps" 
                       target="_blank" 
                       rel="noreferrer"
                       className="p-3 bg-white/5 border border-white/10 rounded text-gold-400 hover:bg-white/10 transition-colors"
                       title="Open Google Maps to get embed code"
                    >
                       <Map size={20} />
                    </a>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">
                      Go to Google Maps {'>'} Share {'>'} Embed a map {'>'} Copy HTML {'>'} Extract the "src" URL.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

// --- MAIN DASHBOARD COMPONENT ---

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, appointments, setAppointments, services, setServices, cmsContent, setCmsContent,
  isAiAgentEnabled, setIsAiAgentEnabled, adminCredentials, setAdminCredentials
}) => {
  const [insight, setInsight] = useState<string>("Analyzing sanctuary data...");
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchInsights = async () => {
      const result = await getBusinessInsights(appointments);
      setInsight(result);
    };
    fetchInsights();
  }, [appointments]);

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <OverviewStats insight={insight} appointments={appointments} />;
      case 'appointments': return <AppointmentManager appointments={appointments} setAppointments={setAppointments} />;
      case 'services': return <ServiceEditor services={services} setServices={setServices} />;
      case 'cms': return <CMSEditor content={cmsContent} setContent={setCmsContent} />;
      case 'settings': return <SettingsPanel isAiEnabled={isAiAgentEnabled} setAiEnabled={setIsAiAgentEnabled} credentials={adminCredentials} setCredentials={setAdminCredentials} />;
      default: return <OverviewStats insight={insight} appointments={appointments} />;
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black text-white font-sans flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-luxury-charcoal p-6 flex flex-col z-20">
        <h1 className="font-serif text-2xl text-gold-400 mb-12 tracking-widest cursor-pointer" onClick={() => setActiveTab('overview')}>
          ELYSIUM 
          <span className="text-[10px] text-gray-500 block font-sans tracking-widest mt-1 uppercase">Admin Suite</span>
        </h1>
        
        <nav className="flex-1 space-y-1">
          {[
            { id: 'overview', icon: BarChart3, label: 'Overview' },
            { id: 'appointments', icon: Calendar, label: 'Appointments' },
            { id: 'services', icon: PenTool, label: 'Service Menu' },
            { id: 'cms', icon: Edit3, label: 'Website Editor' },
            { id: 'settings', icon: SettingsIcon, label: 'Settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 group
                ${activeTab === item.id 
                  ? 'bg-gold-400/10 text-gold-400' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={16} className={activeTab === item.id ? 'text-gold-400' : 'text-gray-500 group-hover:text-white'} />
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={onLogout} className="flex items-center gap-3 text-gray-500 hover:text-white text-sm mt-auto px-4 py-3 hover:bg-white/5 rounded-lg transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-luxury-black/50 backdrop-blur-md z-10">
          <h2 className="font-serif text-xl capitalize text-white">{activeTab === 'cms' ? 'Website Content Editor' : activeTab}</h2>
          <div className="flex items-center gap-6">
             <div className="relative cursor-pointer">
               <Bell size={18} className="text-gray-400 hover:text-gold-400 transition-colors" />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-400 rounded-full"></span>
             </div>
             <div className="h-8 w-[1px] bg-white/10"></div>
             <div className="flex items-center gap-3">
               <div className="text-right hidden md:block">
                 <p className="text-sm text-white font-medium">{adminCredentials.username}</p>
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest">Manager Access</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-serif font-bold border border-gold-300">
                 {adminCredentials.username.charAt(0).toUpperCase()}
               </div>
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-black/50 p-8 custom-scrollbar">
           <div className="max-w-6xl mx-auto">
             <AnimatePresence mode="wait">
               <MotionDiv 
                 key={activeTab}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.2 }}
               >
                 {renderContent()}
               </MotionDiv>
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;