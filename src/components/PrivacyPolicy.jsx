import React from 'react';

export default function PrivacyPolicy({ onBack }) {
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
             <h1 className="font-headline text-5xl text-white tracking-tight uppercase italic border-b border-accent-neon/30 pb-4">Privacy <span className="text-accent-neon">Directive</span></h1>
             <p className="text-[10px] text-text-dim font-bold uppercase tracking-[0.2em] italic">Protocol Version 2.0.4 • Architectural Compliance Standard</p>
          </div>
          
          <div className="space-y-12 text-[12px] text-text-dim font-bold uppercase tracking-widest leading-[1.8] lowercase first-letter:uppercase">
            <section className="space-y-4">
              <h2 className="font-headline text-2xl text-white normal-case italic">01. Initialization</h2>
              <p className="normal-case font-normal text-sm text-zinc-400">Welcome to Launchfolio. we are committed to protecting your personal information and your right to privacy. if you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-headline text-2xl text-white normal-case italic">02. Data Acquisition</h2>
              <p className="normal-case font-normal text-sm text-zinc-400">We collect personal information that you voluntarily provide to us when registering at launchfolio, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us.</p>
              <ul className="space-y-4 pt-4 border-l border-white/5 pl-8 ml-2">
                <li><span className="text-accent-neon">PERSONAL_INFO:</span> name, email address, phone number, and professional history (provided via resumes).</li>
                <li><span className="text-accent-cyan">TRANSACTION_PROTOCOL:</span> all payment data is stored by our payment processor (razorpay). you should review its privacy policies directly.</li>
                <li><span className="text-white">SYSTEM_LOGS:</span> service-related, diagnostic, usage and performance information our servers automatically collect.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-headline text-2xl text-white normal-case italic">03. Logic Applications</h2>
              <p className="normal-case font-normal text-sm text-zinc-400">We use personal information collected via our website for a variety of business purposes described below. we process your personal information for these purposes in reliance on our legitimate business interests.</p>
            </section>

            <section className="space-y-4">
              <h2 className="font-headline text-2xl text-white normal-case italic">04. Encryption & Security</h2>
              <p className="normal-case font-normal text-sm text-zinc-400">All architectural data is stored behind multi-layer encryption nodes. we only share information with your consent, to comply with laws, or to protect your rights.</p>
            </section>
          </div>

          <div className="pt-12 border-t border-white/5 text-center">
             <p className="text-[8px] text-text-dim/50 font-black uppercase tracking-[0.3em]">Institutional Grade Security • Verified Compliance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
