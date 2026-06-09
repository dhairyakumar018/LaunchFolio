import React from 'react';

export default function TermsOfService({ onBack }) {
  return (
    <div className="min-h-screen bg-bg-deep noise-bg p-8 pt-32 selection:bg-accent-neon/30">
      <div className="max-w-4xl mx-auto space-y-12 reveal-item">
        
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

        <div className="glass-panel p-10 md:p-16 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-white/5 space-y-12">
          <div className="space-y-4">
             <h1 className="font-headline text-5xl text-white tracking-tight uppercase italic border-b border-accent-neon/30 pb-4">Terms of <span className="text-accent-neon">Engagement</span></h1>
             <p className="text-[10px] text-text-dim font-bold uppercase tracking-[0.2em] italic">Protocol Version 1.8.2 • User Access Agreement</p>
          </div>
          
          <div className="space-y-12 text-[12px] text-text-dim font-bold uppercase tracking-widest leading-[1.8] lowercase first-letter:uppercase">
            <section className="space-y-4">
              <h2 className="font-headline text-2xl text-white normal-case italic">01. Agreement to Terms</h2>
              <p className="normal-case font-normal text-sm text-zinc-400">These terms of use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and launchfolio (“we,” “us” or “our”), concerning your access to and use of the launchfolio website.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-headline text-2xl text-white normal-case italic">02. Proprietary Assets</h2>
              <p className="normal-case font-normal text-sm text-zinc-400">Unless otherwise indicated, the site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, graphics, and trademarks are owned or controlled by us or licensed to us.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-headline text-2xl text-white normal-case italic">03. User Protocol</h2>
              <p className="normal-case font-normal text-sm text-zinc-400">By using the site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-headline text-2xl text-white normal-case italic">04. Terminal Access</h2>
              <p className="normal-case font-normal text-sm text-zinc-400">We reserve the right to change, modify, or remove the contents of the site at any time or for any reason at our sole discretion without notice. however, we have no obligation to update any information on our site.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-headline text-2xl text-white normal-case italic">05. Jurisdiction</h2>
              <p className="normal-case font-normal text-sm text-zinc-400">These terms of use and your use of the site are governed by and construed in accordance with the laws of the state of india applicable to agreements made and to be entirely performed within the state of india.</p>
            </section>
          </div>

          <div className="pt-12 border-t border-white/5 text-center">
             <p className="text-[8px] text-text-dim/50 font-black uppercase tracking-[0.3em]">Legal Framework • Binding Protocol 0xA1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
