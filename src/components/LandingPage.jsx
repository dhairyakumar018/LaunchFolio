import { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User } from 'lucide-react'

export default function LandingPage({ onStart, onTemplates, onPageChange }) {
  const { user, logout } = useAuth()
  const [activeNav, setActiveNav] = useState('FEATURES')
  const featuresRef = useRef(null)

  const scrollToFeatures = () => {
    setActiveNav('FEATURES')
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDashboardClick = () => {
    if (user) { onPageChange('account'); return }
    onPageChange('auth')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#0b0a1a' }}>

      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 animate-pulse-glow" style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse-glow delay-500" style={{ background: 'radial-gradient(circle, #2fd9f4 0%, transparent 70%)' }} />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5" style={{ background: 'rgba(11,10,26,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-white tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Launchfolio</div>
          <nav className="hidden md:flex items-center gap-10">
            {[
              { id: 'FEATURES', label: 'FEATURES', action: scrollToFeatures },
              { id: 'TEMPLATES', label: 'TEMPLATES', action: onTemplates },
              { id: 'SUPPORT', label: 'SUPPORT', action: () => onPageChange('support') }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => { setActiveNav(item.id); item.action(); }}
                className={`text-[10px] font-black tracking-[0.2em] transition-all relative py-2 ${activeNav === item.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {item.label}
                {activeNav === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-neon reveal-item" />
                )}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {!user ? (
              <button onClick={handleDashboardClick} className="text-sm font-semibold px-5 py-2 rounded-full text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                Get Started
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => onPageChange('account')} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all">
                  <User size={14} /> Dashboard
                </button>
                <button onClick={logout} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-400/30 transition-all">
                  <LogOut size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* ── HERO ── */}
        <section className="pt-40 pb-24 px-6 relative">
          {/* Grid Background */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 relative z-10">

            {/* Left */}
            <div className="w-full lg:w-1/2 space-y-10 reveal-item-left">
              <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] text-white tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Build Your<br />
                <span style={{ background: 'linear-gradient(90deg, #c0c2ff, #7dd3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Resume</span><br />
                in Minutes
              </h1>
              <p className="text-gray-400 text-xl leading-relaxed max-w-lg font-light">
                Navigate your career with the intelligence of a personal architect. Leverage high-end AI guidance and professional-grade templates that capture recruiter attention.
              </p>
              <div className="flex flex-wrap gap-5 pt-4">
                <button
                  onClick={onStart}
                  className="px-10 py-5 rounded-full text-[#0b0a1a] font-bold text-lg transition-all hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(192,194,255,0.3)] hover:shadow-[0_0_50px_rgba(192,194,255,0.5)]"
                  style={{ background: '#c0c2ff' }}
                >
                  Build My Resume
                </button>
                <button
                  onClick={onTemplates}
                  className="px-10 py-5 rounded-full text-white font-bold text-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all hover:scale-105 active:scale-95 bg-[#0b0a1a]"
                >
                  Browse Templates
                </button>
              </div>
            </div>

            {/* Right — Mock Resume Card */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end reveal-item-right delay-300">
              <div className="w-full max-w-lg rounded-[2rem] border border-white/5 p-8 space-y-8 animate-float shadow-[0_50px_100px_rgba(0,0,0,0.5)]" style={{ background: 'linear-gradient(145deg, rgba(20,20,35,0.9), rgba(10,10,20,0.95))', backdropFilter: 'blur(30px)' }}>
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/5" />
                    <div>
                      <div className="text-white font-bold text-2xl tracking-tight">Alex Sterling</div>
                      <div className="text-gray-400 text-xs uppercase tracking-[0.2em] font-semibold">Senior Product Architect</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black text-gray-300 uppercase tracking-[0.15em] border border-white/5 bg-white/5">
                    <span className="material-symbols-outlined text-[14px] text-accent-neon">auto_awesome</span>
                    AI OPTIMIZING
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3">
                  <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Professional Summary</div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Strategic leader with 8+ years in{' '}
                    <span className="text-white font-bold">scaling SaaS infrastructure</span>
                    {' '}and driving cross-functional delivery. Proven record in{' '}
                    <span className="text-white font-bold underline decoration-white/20">architecting high-performance systems</span>.
                  </p>
                </div>

                {/* Experience */}
                <div className="space-y-4">
                  <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Experience</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-bold text-base">Lead Systems Engineer</div>
                      <div className="text-gray-500 text-[10px] font-bold">2021 - Present</div>
                    </div>
                    <div className="text-gray-500 text-xs font-semibold">Global Tech Solutions</div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">Spearheaded migration to cloud-native microservices, improving uptime by 40%.</p>
                  </div>
                </div>

                {/* Core Stack */}
                <div className="space-y-3">
                  <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Core Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {['System Design', 'Cloud Architecture', 'Distributed Systems', 'GraphQL'].map(tag => (
                      <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section ref={featuresRef} className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 space-y-3 reveal-item">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Designed for Results</h2>
              <p className="text-gray-400 text-lg max-w-xl">We've automated the tedious parts of resume building so you can focus on showing your true potential.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: '✦',
                  iconBg: 'rgba(124,58,237,0.2)',
                  iconColor: '#a78bfa',
                  title: 'AI Suggestions',
                  desc: 'Context-aware rewrite engine that transforms basic job descriptions into high-impact accomplishment statements.',
                  delay: 'delay-100'
                },
                {
                  icon: '⊞',
                  iconBg: 'rgba(79,70,229,0.2)',
                  iconColor: '#818cf8',
                  title: 'Multiple Templates',
                  desc: 'Choose from dozens of ATS-friendly templates designed by industry hiring experts across all sectors.',
                  delay: 'delay-200'
                },
                {
                  icon: '↓',
                  iconBg: 'rgba(47,217,244,0.15)',
                  iconColor: '#2fd9f4',
                  title: 'PDF Download',
                  desc: 'Export your professional profile in pixel-perfect PDF format with guaranteed layout integrity across all devices.',
                  delay: 'delay-300'
                }
              ].map((f, i) => (
                <div key={i} className={`rounded-2xl p-8 space-y-5 border border-white/8 hover:border-accent-neon/30 hover:bg-white/[0.07] transition-all group reveal-item ${f.delay} hover:scale-[1.02]`} style={{ background: 'rgba(30,27,50,0.5)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110 group-hover:rotate-6" style={{ background: f.iconBg, color: f.iconColor }}>
                    {f.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-lg group-hover:text-accent-neon transition-colors">{f.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl p-12 md:p-16 border border-white/8 reveal-item" style={{ background: 'rgba(20,18,40,0.8)' }}>
              <div className="text-center mb-16 space-y-3 reveal-item delay-100">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Your Journey to Hired</h2>
                <p className="text-gray-400 text-base">Three simple steps to professional excellence.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting lines (desktop only) */}
                <div className="hidden md:block absolute top-8 left-[25%] right-[25%] h-px bg-gradient-to-r from-purple-500/50 via-indigo-500/50 to-cyan-500/50 animate-gradient-x" />

                {[
                  { num: '1', color: '#ffffff', bg: 'rgba(255,255,255,0.1)', title: 'Fill Form', desc: 'Input your raw experience and let our AI handle the sophisticated phrasing and formatting.', delay: 'delay-200' },
                  { num: '2', color: '#a78bfa', bg: 'rgba(124,58,237,0.2)', title: 'Choose Template', desc: 'Browse our curated library of professional styles to find the one that matches your brand.', delay: 'delay-300' },
                  { num: '3', color: '#2fd9f4', bg: 'rgba(47,217,244,0.15)', title: 'Download', desc: 'Get your polished, interview-ready resume in seconds and start applying with confidence.', delay: 'delay-400' }
                ].map((step, i) => (
                  <div key={i} className={`flex flex-col items-center text-center space-y-4 reveal-item ${step.delay}`}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold border border-white/10 relative z-10 transition-all hover:scale-110 hover:border-accent-neon" style={{ background: step.bg, color: step.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                      {step.num}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-bold text-lg">{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-3xl p-12 md:p-20 text-center border border-white/8 relative overflow-hidden reveal-item shadow-2xl" style={{ background: 'rgba(20,18,40,0.9)' }}>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 animate-pulse-glow" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
              </div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight reveal-item delay-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Ready to accelerate<br />
                  <span style={{ background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your career?</span>
                </h2>
                <p className="text-gray-400 text-base max-w-md mx-auto reveal-item delay-200">
                  Join thousands of job seekers who found their dream role using our Launchfolio builder.
                </p>
                <div className="reveal-item delay-300">
                  <button
                    onClick={onStart}
                    className="inline-flex items-center px-10 py-4 rounded-full bg-white text-gray-900 font-bold text-base hover:bg-accent-neon hover:text-white transition-all hover:scale-110 active:scale-95 shadow-xl"
                  >
                    Build My Resume Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="font-bold text-white text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Launchfolio</div>
              <p className="text-gray-500 text-xs">Redefining Professional Narratives</p>
            </div>
            <div className="flex items-center gap-3">
              {!user ? (
                <button onClick={onStart} className="text-sm font-semibold px-5 py-2 rounded-full text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                  Get Started
                </button>
              ) : null}
              <button onClick={() => onPageChange('terms')} className="text-xs text-gray-500 hover:text-white transition-colors">Terms</button>
              <button onClick={() => onPageChange('privacy')} className="text-xs text-gray-500 hover:text-white transition-colors">Privacy</button>
              <button onClick={() => onPageChange('support')} className="text-xs text-gray-500 hover:text-white transition-colors">Support</button>
            </div>
            <p className="text-xs text-gray-600">© 2024 Launchfolio. Built for the bold.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
