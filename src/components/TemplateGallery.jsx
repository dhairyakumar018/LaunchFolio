import { useState } from 'react'
import { usePurchases } from '../hooks/usePurchases'
import toast from 'react-hot-toast'

const TEMPLATES = [
  {
    id: 'minimalist',
    name: 'THE MINIMALIST',
    category: 'Professional',
    desc: 'PURE & ESSENTIAL RESUME LAYOUT FOR IMPACT',
    colors: ['#f2f4f7', '#ffffff', '#0f172a'],
    badge: 'POPULAR',
    rating: 4.9,
    preview: '/previews/minimalist.png'
  },
  {
    id: 'developer',
    name: 'THE DEVELOPER',
    category: 'Tech',
    desc: 'MODERN & TECHNICAL, ATS OPTIMIZED STRUCTURE',
    colors: ['#071013', '#0f172a', '#38bdf8'],
    badge: 'ATS OPTIMIZED',
    rating: 4.8,
    preview: '/previews/developer.png'
  },
  {
    id: 'storyteller',
    name: 'THE STORYTELLER',
    category: 'Creative',
    desc: 'EDITORIAL STYLE WITH SOFT COLUMNS AND FLOW',
    colors: ['#ffffff', '#f3f4f6', '#111827'],
    rating: 4.7,
    preview: '/previews/storyteller.png'
  },
  {
    id: 'executive',
    name: 'THE EXECUTIVE',
    category: 'Professional',
    desc: 'SOPHISTICATED SECTIONS WITH PREMIUM SPACING',
    colors: ['#1a1a1a', '#d4af37', '#f9f9f9'],
    rating: 4.8,
    preview: '/previews/executive.png'
  },
  {
    id: 'architect',
    name: 'THE ARCHITECT',
    category: 'Tech',
    desc: 'STRUCTURED PRECISION WITH CLEAN TYPOGRAPHY',
    colors: ['#edf2f7', '#1e293b', '#ef4444'],
    rating: 4.7,
    preview: '/previews/architect.png'
  },
  {
    id: 'artisan',
    name: 'THE ARTISAN',
    category: 'Creative',
    desc: 'HANDCRAFTED ELEGANCE FOR THOUGHTFUL PROFILES',
    colors: ['#f8fafc', '#0f172a', '#7c3aed'],
    rating: 4.6,
    preview: '/previews/artisan.png'
  },
  {
    id: 'startup',
    name: 'STARTUP VIBES',
    category: 'Creative',
    desc: 'BRIGHT, BOLD, AND ENERGETIC STRUCTURE',
    colors: ['#fff5f7', '#ff006e', '#8338ec'],
    rating: 4.5,
    preview: '/previews/startup.png'
  },
  {
    id: 'corporate',
    name: 'CORPORATE PRO',
    category: 'Professional',
    desc: 'FORMAL LAYOUT BUILT FOR LEADERSHIP ROLES',
    colors: ['#0f172a', '#ffffff', '#1d4ed8'],
    rating: 4.6,
    preview: '/previews/corporate.png'
  },
  {
    id: 'codecraft',
    name: 'CODECRAFT',
    category: 'Tech',
    desc: 'DEVELOPER-FRIENDLY LAYOUT WITH MODERN DETAILS',
    colors: ['#020617', '#0ea5e9', '#94a3b8'],
    rating: 4.7,
    preview: '/previews/codecraft.png'
  },
  {
    id: 'polished',
    name: 'POLISHED',
    category: 'Professional',
    desc: 'CLEAN LINES, READABLE SECTIONS, PREMIUM FLOW',
    colors: ['#fafafa', '#111827', '#64748b'],
    rating: 4.8,
    preview: '/previews/polished.png'
  },
  {
    id: 'innovator',
    name: 'THE INNOVATOR',
    category: 'Creative',
    desc: 'PLAYFUL LAYOUT WITH STANDOUT ACCENT SECTIONS',
    colors: ['#111827', '#7c3aed', '#38bdf8'],
    rating: 4.4,
    preview: '/previews/innovator.png'
  },
  {
    id: 'designer',
    name: 'DESIGN BRIEF',
    category: 'Creative',
    desc: 'ARTFUL SPACING FOR PORTFOLIO-DRIVEN RESUMES',
    colors: ['#e0f2fe', '#0f172a', '#f97316'],
    rating: 4.7,
    preview: '/previews/designer.png'
  },
]

export default function TemplateGallery({ onSelectTemplate, onCreateCustom, selectedTemplate, customTemplates = [], onDeleteCustomTemplate }) {
  const { hasAccess } = usePurchases()
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const categories = ['All', 'Professional', 'Tech', 'Creative']

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = filter === 'All' || t.category === filter
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const isPremiumTemplate = (id) => ['creative', 'executive', 'artisan', 'startup', 'innovator', 'designer'].includes(id)
  const hasTemplateAccess = (id) => !isPremiumTemplate(id) || hasAccess('resume', id)

  const handleTemplateSelect = (id) => {
    if (isPremiumTemplate(id) && !hasAccess('resume', id)) { 
      toast.error('Shields active. Purchase required for this blueprint.')
      return
    }
    onSelectTemplate(id)
    toast.success('Blueprint synchronized.')
  }

  const handlePurchase = (id) => {
    toast.info('Redirecting to secure gateway...')
  }

  return (
    <div className="min-h-screen bg-[#0b0a1a] p-8 pt-32 selection:bg-accent-neon/30">
      <div className="max-w-screen-2xl mx-auto space-y-16">
        
        {/* Gallery Header */}
        <div className="text-center space-y-4">
           <h1 className="font-headline text-7xl text-white tracking-tight reveal-item">CHOOSE YOUR <span className="text-accent-neon">BLUEPRINT</span></h1>
           <p className="text-gray-500 text-[10px] font-black tracking-[0.3em] uppercase reveal-item [animation-delay:100ms]">Select a high-performance architectural style for your career narrative</p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-col md:flex-row items-center gap-6 reveal-item [animation-delay:200ms]">
          <div className="relative flex-1 group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors material-symbols-outlined">search</span>
            <input 
              type="text" 
              placeholder="SEARCH BLUEPRINTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl pl-16 pr-6 text-[10px] font-bold text-white uppercase tracking-[0.2em] outline-none focus:border-white/20 focus:bg-white/10 transition-all"
            />
          </div>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-white text-[#0b0a1a]' : 'text-gray-500 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blueprints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 reveal-item [animation-delay:400ms]">
          {filteredTemplates.map(t => (
            <div 
              key={t.id}
              onClick={() => handleTemplateSelect(t.id)}
              className={`group relative rounded-[2.5rem] bg-[#0b0a1a] border transition-all duration-500 cursor-pointer overflow-hidden ${selectedTemplate === t.id ? 'border-accent-neon shadow-[0_0_30px_rgba(0,255,163,0.15)]' : 'border-white/5 hover:border-white/20'}`}
            >
              {/* Preview Surface */}
              <div className="h-64 relative bg-[#131326] flex items-center justify-center overflow-hidden">
                <img 
                  src={t.preview} 
                  alt={t.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-bg-deep/10 group-hover:bg-transparent transition-colors"></div>

                {/* Badges */}
                {t.badge && (
                  <div className="absolute top-6 right-6 px-3 py-1.5 bg-white text-bg-deep rounded-full text-[8px] font-black uppercase tracking-widest shadow-2xl">
                    {t.badge}
                  </div>
                )}

                {/* Selection Indicator */}
                {selectedTemplate === t.id && (
                  <div className="absolute inset-0 bg-accent-neon/10 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-accent-neon text-bg-deep flex items-center justify-center shadow-[0_0_40px_rgba(0,255,163,0.5)] scale-110 transition-transform">
                      <span className="material-symbols-outlined font-black text-2xl">check</span>
                    </div>
                  </div>
                )}

                {/* Premium Badge */}
                {isPremiumTemplate(t.id) && (
                  <div className="absolute top-6 left-6 px-3 py-1.5 bg-accent-neon text-bg-deep rounded-full text-[8px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[10px] font-black">star</span>
                    PREMIUM
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-10 space-y-3">
                <h3 className="font-headline text-2xl text-white uppercase tracking-tight group-hover:text-accent-neon transition-colors">
                  {t.name}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.15em] leading-relaxed line-clamp-1">
                  {t.desc}
                </p>
              </div>

              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 w-full h-[2px] transition-all duration-500 ${selectedTemplate === t.id ? 'bg-accent-neon' : 'bg-transparent group-hover:bg-white/20'}`} />
            </div>
          ))}
        </div>

        {/* AI Synthesis Module */}
        <div className="pt-16 reveal-item [animation-delay:600ms]">
          <div className="rounded-[3rem] bg-gradient-to-br from-accent-neon/10 via-transparent to-transparent border border-accent-neon/20 p-12 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent-neon/5 blur-[100px] rounded-full" />
             <div className="flex items-center gap-10 relative z-10">
                <div className="w-24 h-24 rounded-3xl bg-accent-neon/20 flex items-center justify-center text-accent-neon shadow-[0_0_50px_rgba(0,255,163,0.2)]">
                  <span className="material-symbols-outlined text-5xl animate-pulse">auto_awesome</span>
                </div>
                <div className="space-y-2">
                  <h2 className="font-headline text-4xl text-white uppercase tracking-tight">AI SYNTHESIS ENGINE</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Generate a one-of-a-kind blueprint based on your career trajectory</p>
                </div>
             </div>
             <button 
               onClick={onCreateCustom}
               className="relative z-10 px-12 h-18 bg-accent-neon text-bg-deep rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,255,163,0.3)]"
             >
               Initialize Synthesis
             </button>
          </div>
        </div>

      </div>
    </div>
  )
}
