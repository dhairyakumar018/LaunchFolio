import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function Support({ onBack }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'general', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message uplink established. Our analysts will respond shortly.');
    setFormData({ name: '', email: '', subject: 'general', message: '' });
  };

  return (
    <div className="min-h-screen bg-bg-deep noise-bg p-8 pt-32 selection:bg-accent-neon/30">
      <div className="max-w-6xl mx-auto space-y-12 reveal-item">
        
        {/* Navigation Control */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-text-dim hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </div>
          Return to Hub
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Info Aspect */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="font-headline text-6xl text-white tracking-tight leading-[1.1]">COMMAND <br/><span className="text-accent-neon italic">ASSISTANCE</span></h1>
              <p className="text-sm text-text-dim font-bold uppercase tracking-widest leading-relaxed max-w-md italic">Secure communication terminal for architectural anomalies and system upgrades.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { icon: 'mail', label: 'Primary Uplink', value: 'intel@launchfolio.io', color: 'accent-neon' },
                 { icon: 'bug_report', label: 'Anomaly Log', value: 'status@blueprint.dev', color: 'accent-cyan' }
               ].map((node, i) => (
                 <div key={i} className="glass-panel p-6 rounded-3xl space-y-4 hover:border-white/20 transition-all group">
                   <div className={`w-10 h-10 rounded-2xl bg-${node.color}/10 flex items-center justify-center text-${node.color} group-hover:scale-110 transition-transform`}>
                     <span className="material-symbols-outlined text-xl">{node.icon}</span>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[8px] font-black text-text-dim uppercase tracking-widest">{node.label}</p>
                     <p className="text-[10px] font-bold text-white uppercase tracking-tight">{node.value}</p>
                   </div>
                 </div>
               ))}
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center gap-6">
               <div className="w-12 h-12 rounded-full border-2 border-accent-neon/30 border-t-accent-neon animate-spin flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-accent-neon shadow-[0_0_10px_#00ffa3]"></div>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Support Status: Active</p>
                 <p className="text-[8px] font-bold text-text-dim uppercase tracking-tight">Mean Response Latency: 4.2 Hours</p>
               </div>
            </div>
          </div>

          {/* Form Aspect */}
          <div className="glass-panel p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <span className="material-symbols-outlined text-9xl">contact_support</span>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-text-dim uppercase tracking-widest ml-1">Identity Tag</label>
                  <input 
                    required type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="NAME.ID"
                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-bold text-white uppercase tracking-widest placeholder:text-white/10 outline-none focus:border-accent-neon/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-text-dim uppercase tracking-widest ml-1">Archive Address</label>
                  <input 
                    required type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="EMAIL@NODE.IO"
                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-bold text-white uppercase tracking-widest placeholder:text-white/10 outline-none focus:border-accent-neon/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-text-dim uppercase tracking-widest ml-1">Transmission Priority</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-bold text-white uppercase tracking-widest outline-none focus:border-accent-neon/50 appearance-none cursor-pointer"
                >
                  <option value="general">GENERAL PROTOCOL</option>
                  <option value="bug">ANOMALY DETECTED</option>
                  <option value="feature">UPGRADE REQUEST</option>
                  <option value="billing">FINANCIAL NODE</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-text-dim uppercase tracking-widest ml-1">Message Content</label>
                <textarea 
                  required rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="INITIALIZE TRANSMISSION..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-[10px] font-bold text-white uppercase tracking-widest placeholder:text-white/10 outline-none focus:border-accent-neon/50 focus:bg-white/10 transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="group relative w-full h-16 bg-white text-bg-deep rounded-2xl font-headline text-xs font-bold uppercase tracking-[0.25em] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Deploy Transmission</span>
                <div className="absolute inset-0 bg-accent-neon translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms]"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
