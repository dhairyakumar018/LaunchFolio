import { useState } from 'react'
import toast from 'react-hot-toast'

const TEMPLATES = [
  { id: 'minimalist', name: 'The Minimalist', desc: 'Pure & essential resume layout', colors: ['#f2f4f7', '#ffffff', '#0f172a'], badge: 'Popular', preview: '/previews/minimalist.png' },
  { id: 'developer', name: 'The Developer', desc: 'Modern & technical, ATS optimized', colors: ['#071013', '#0f172a', '#38bdf8'], badge: 'ATS Optimized', preview: '/previews/developer.png' },
  { id: 'storyteller', name: 'The Storyteller', desc: 'Editorial style with soft columns', colors: ['#ffffff', '#f3f4f6', '#111827'], preview: '/previews/storyteller.png' },
  { id: 'executive', name: 'The Executive', desc: 'Sophisticated sections with premium spacing', colors: ['#1a1a1a', '#d4af37', '#f9f9f9'], preview: '/previews/executive.png' },
  { id: 'architect', name: 'The Architect', desc: 'Structured precision with clean typography', colors: ['#edf2f7', '#1e293b', '#ef4444'], preview: '/previews/architect.png' },
  { id: 'artisan', name: 'The Artisan', desc: 'Handcrafted elegance for thoughtful profiles', colors: ['#f8fafc', '#0f172a', '#7c3aed'], preview: '/previews/artisan.png' },
  { id: 'startup', name: 'Startup Vibes', desc: 'Bright, bold, and energetic structure', colors: ['#fff5f7', '#ff006e', '#8338ec'], preview: '/previews/startup.png' },
  { id: 'corporate', name: 'Corporate Pro', desc: 'Formal layout built for leadership roles', colors: ['#0f172a', '#ffffff', '#1d4ed8'], preview: '/previews/corporate.png' },
  { id: 'codecraft', name: 'CodeCraft', desc: 'Developer-friendly layout with modern details', colors: ['#020617', '#0ea5e9', '#94a3b8'], preview: '/previews/codecraft.png' },
  { id: 'polished', name: 'Polished', desc: 'Clean lines, readable sections, premium flow', colors: ['#fafafa', '#111827', '#64748b'], preview: '/previews/polished.png' },
  { id: 'innovator', name: 'The Innovator', desc: 'Playful layout with standout accent sections', colors: ['#111827', '#7c3aed', '#38bdf8'], preview: '/previews/innovator.png' },
  { id: 'designer', name: 'Design Brief', desc: 'Artful spacing for portfolio-driven resumes', colors: ['#e0f2fe', '#0f172a', '#f97316'], preview: '/previews/designer.png' },
]

export default function QuickTemplateSelector({ onSelectTemplate, onSkip }) {
  const [selected, setSelected] = useState('minimalist')

  const handleSelect = () => {
    onSelectTemplate(selected);
    const template = TEMPLATES.find(t => t.id === selected);
    toast.success(`${template?.name ?? 'Template'} selected.`);
  }

  const selectedTemplate = TEMPLATES.find(t => t.id === selected);

  return (
    <div className="min-h-screen bg-bg-deep noise-bg p-8 pt-32 selection:bg-accent-neon/30">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 reveal-item">
           <h1 className="font-headline text-6xl text-white tracking-tight uppercase">CHOOSE YOUR <span className="text-accent-neon">TEMPLATE</span></h1>
           <p className="text-text-dim text-sm font-light tracking-widest uppercase">Select a professional design to start building your resume</p>
        </div>

        {/* Featured Surface */}
        <div className="glass-panel p-1 rounded-[4rem] bg-white/5 border-white/5 reveal-item [animation-delay:100ms]">
          <div className="rounded-[3.5rem] bg-bg-deep/40 backdrop-blur-xl p-12 flex flex-col lg:flex-row items-center gap-16 ">
            
            {/* Live Render Preview */}
            <div 
              className="w-full lg:w-1/2 h-96 rounded-[3rem] relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.4)] group bg-white/5"
            >
               <img 
                 src={selectedTemplate?.preview} 
                 alt={selectedTemplate?.name}
                 className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 via-transparent to-transparent"></div>
               
               {/* Design Overlay */}
               <div className="absolute top-0 right-0 p-10">
                 <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center animate-spin-slow">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-neon shadow-[0_0_15px_#00ffa3]"></div>
                 </div>
               </div>
            </div>

            <div className="flex-1 space-y-10">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-accent-neon uppercase tracking-[0.3em]">Featured Template</span>
                <h2 className="font-headline text-5xl text-white uppercase italic tracking-tight">{selectedTemplate?.name}</h2>
                <p className="text-[12px] text-text-dim font-bold uppercase tracking-widest leading-relaxed max-w-md italic">{selectedTemplate?.desc}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                   onClick={handleSelect}
                   className="group relative h-16 px-12 bg-white text-bg-deep rounded-2xl font-headline text-xs font-bold uppercase tracking-[0.25em] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                >
                  <span className="relative z-10 flex items-center gap-2">Use This Template <span className="material-symbols-outlined text-sm">arrow_forward</span></span>
                  <div className="absolute inset-0 bg-accent-neon translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms]"></div>
                </button>
                <button 
                  onClick={onSkip}
                  className="h-16 px-8 text-text-dim hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-white/5 rounded-2xl hover:bg-white/5"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rapid Archive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 reveal-item [animation-delay:200ms]">
          {TEMPLATES.map(t => (
            <div 
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`group relative glass-panel p-6 rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden ${selected === t.id ? 'ring-1 ring-accent-neon border-transparent bg-white/5' : 'bg-transparent hover:border-white/20'}`}
            >
               <div className="space-y-4">
                 <div 
                   className="h-32 rounded-2xl relative overflow-hidden bg-white/5"
                 >
                   <img 
                     src={t.preview} 
                     alt={t.name}
                     className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-bg-deep/20 group-hover:bg-transparent transition-colors"></div>
                   {selected === t.id && (
                     <div className="absolute inset-0 bg-accent-neon/10 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-8 h-8 rounded-full bg-accent-neon text-bg-deep flex items-center justify-center shadow-[0_0_20px_rgba(0,255,163,0.5)]">
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        </div>
                     </div>
                   )}
                 </div>
                 <div className="space-y-1">
                   <h3 className="text-[11px] font-black text-white uppercase tracking-tight group-hover:text-accent-neon transition-colors line-clamp-1">{t.name}</h3>
                   <p className="text-[8px] text-text-dim font-bold uppercase tracking-widest line-clamp-1">{t.desc}</p>
                 </div>
               </div>
               {t.badge && (
                 <div className="absolute top-2 right-2 px-2 py-1 bg-white/10 rounded-full text-[6px] font-black text-white uppercase tracking-widest border border-white/5">{t.badge}</div>
               )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
