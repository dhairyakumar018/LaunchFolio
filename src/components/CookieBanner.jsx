import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:max-w-[400px] z-[2000] animate-in slide-in-from-bottom-12 duration-700 ease-out">
      <div className="glass-panel p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-white/5 relative overflow-hidden group">
        
        {/* Subtle Background Accent */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent-neon/5 blur-3xl rounded-full group-hover:bg-accent-neon/10 transition-all duration-700"></div>

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-accent-neon text-lg animate-pulse">database</span>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-headline font-bold text-[10px] uppercase tracking-[0.2em]">Data Protocol</h4>
              <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest leading-relaxed mt-2 italic">
                Synchronizing local telemetry for architectural optimization.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleAccept}
                className="group relative flex-1 h-10 bg-white text-bg-deep rounded-xl font-headline text-[9px] font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Authorize</span>
                <div className="absolute inset-0 bg-accent-neon translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms]"></div>
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="px-6 h-10 bg-white/5 text-text-dim rounded-xl font-headline text-[9px] font-bold uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-all"
              >
                Restrict
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
