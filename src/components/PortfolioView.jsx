import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePurchases } from '../hooks/usePurchases'
import toast from 'react-hot-toast'

const BG_GRADIENTS = [
  'linear-gradient(135deg, #1e1b4b, #4f46e5)',
  'linear-gradient(135deg, #0f172a, #0e7490)',
  'linear-gradient(135deg, #1a0533, #7c3aed)',
  'linear-gradient(135deg, #052e16, #059669)',
  'linear-gradient(135deg, #1e1b4b, #c026d3)',
]

export default function PortfolioView({ data, onBack, onEdit, onUpgrade }) {
  const [downloading, setDownloading] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const portfolioRef = useRef(null)
  const { user } = useAuth()
  const { hasAccess } = usePurchases()

  const checkAccess = () => {
    if (!hasAccess('portfolio')) { onUpgrade(); return false; }
    return true
  }

  const handleDownload = async () => {
    if (!user) { toast.error('Shields active. Authorization required.'); return; }
    if (!checkAccess()) return
    if (downloading) return
    setDownloading(true)

    try {
      const original = portfolioRef.current; if (!original) return
      const html2pdf = window.html2pdf; if (!html2pdf) throw new Error('Protocol missing');
      
      const options = { margin: [10, 10, 10, 10], filename: `${data.name || 'node'}_manifest.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }
      await html2pdf().set(options).from(original).save(); toast.success('Manifest archived.');
    } catch (err) {
      toast.error('Manifest extraction failed.');
    } finally { setDownloading(false); }
  }

  const handleGetCode = () => {
    if (!user) { toast.error('Terminal locked.'); return; }
    if (!checkAccess()) return
    setShowCode(true); toast.success('Logic logic extracted.');
  }

  const portfolioCode = `// Institutional Grade Portfolio Architecture\nconst data = ${JSON.stringify(data, null, 2)};\n// Deploying Node...`;

  const initials = data.name ? data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AI'
  const sections = [data.summary && 'about', data.skills.length > 0 && 'skills', (data.projects || []).length > 0 && 'projects', (data.experience || []).length > 0 && 'experience', (data.email || data.phone || data.linkedin) && 'contact'].filter(Boolean)

  const scrollTo = (id) => document.getElementById(`portfolio-${id}`)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-bg-deep noise-bg selection:bg-accent-neon/30 overflow-x-hidden" ref={portfolioRef}>
      
      {/* Dynamic Nav Control */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] max-w-5xl w-[calc(100%-4rem)]">
        <div className="glass-panel p-2 rounded-[2rem] bg-white/5 border-white/5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
           <div onClick={onBack} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
             <span className="material-symbols-outlined text-white text-xl">satellite_alt</span>
           </div>
           
           <div className="hidden md:flex gap-1">
             {sections.map(s => (
               <button key={s} onClick={() => scrollTo(s)} className="px-5 h-10 rounded-xl text-[9px] font-black uppercase tracking-widest text-text-dim hover:text-white hover:bg-white/5 transition-all">{s}</button>
             ))}
           </div>

           <div className="flex gap-2">
             <button onClick={handleGetCode} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-dim hover:text-white transition-all">
               <span className="material-symbols-outlined text-lg">code</span>
             </button>
             <button 
               onClick={handleDownload} 
               disabled={downloading}
               className="group relative h-10 px-6 bg-accent-neon text-bg-deep rounded-xl font-headline text-[9px] font-black uppercase tracking-widest overflow-hidden transition-all shadow-[0_0_20px_rgba(0,255,163,0.2)]"
             >
               <span className="relative z-10">{downloading ? 'Processing...' : 'Export Manifest'}</span>
               <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms]"></div>
             </button>
             {onEdit && (
               <button onClick={onEdit} className="w-10 h-10 rounded-xl bg-white text-bg-deep flex items-center justify-center hover:scale-105 transition-all">
                 <span className="material-symbols-outlined text-lg">edit</span>
               </button>
             )}
           </div>
        </div>
      </nav>

      {/* Hero Aspect */}
      <section className="relative pt-64 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none opacity-20">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-accent-neon/10 blur-[150px] rounded-full" />
           <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-5xl mx-auto px-8 relative text-center space-y-12 reveal-item">
           <div className="inline-block">
             <div className="w-32 h-32 rounded-[3rem] bg-white/5 border-2 border-accent-neon/30 flex items-center justify-center text-accent-neon shadow-[0_0_40px_rgba(0,255,163,0.1)] relative group">
                <span className="font-headline text-4xl italic group-hover:scale-110 transition-transform">{initials}</span>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-bg-deep border border-white/5 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-accent-neon animate-ping" />
                </div>
             </div>
           </div>
           
           <div className="space-y-4">
             <h1 className="font-headline text-7xl md:text-8xl text-white tracking-tight uppercase reveal-item leading-none">{data.name || 'IDENT_PENDING'}</h1>
             {data.title && <p className="text-sm font-black text-accent-neon uppercase tracking-[0.4em] reveal-item [animation-delay:100ms]">{data.title}</p>}
           </div>

           <div className="flex justify-center gap-4 reveal-item [animation-delay:200ms]">
              {[
                { type: 'email', val: data.email, icon: 'mail' },
                { type: 'github', val: data.github, icon: 'terminal' },
                { type: 'linkedin', val: data.linkedin, icon: 'hub' }
              ].map(link => link.val && (
                <a key={link.type} href={link.type === 'email' ? `mailto:${link.val}` : (link.val.startsWith('http') ? link.val : `https://${link.val}`)} target="_blank" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-text-dim hover:text-white hover:border-white/20 hover:scale-110 transition-all">
                  <span className="material-symbols-outlined">{link.icon}</span>
                </a>
              ))}
           </div>
        </div>
      </section>

      {/* About Protocol */}
      {data.summary && (
        <section className="py-32" id="portfolio-about">
          <div className="max-w-5xl mx-auto px-8">
            <div className="glass-panel p-1 md:p-2 rounded-[4rem] bg-white/5 border-white/5">
               <div className="rounded-[3.5rem] bg-white/5 p-12 md:p-20 space-y-12">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-accent-neon uppercase tracking-widest">Initialization Log</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <h2 className="font-headline text-5xl text-white uppercase italic leading-tight max-w-3xl">{data.summary}</h2>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Domain Expertise */}
      {data.skills.length > 0 && (
        <section className="py-32" id="portfolio-skills">
          <div className="max-w-5xl mx-auto px-8 space-y-16">
             <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-accent-neon uppercase tracking-widest border-l-2 border-accent-neon pl-4">Asset Matrix</span>
                  <h2 className="font-headline text-6xl text-white uppercase italic">System Core.</h2>
                </div>
             </div>
             <div className="flex flex-wrap gap-4">
                {data.skills.map((s, i) => (
                  <div key={i} className="px-8 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center text-[10px] font-black text-white uppercase tracking-widest hover:border-accent-neon/30 hover:bg-white/10 transition-all group">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-neon/30 mr-3 group-hover:bg-accent-neon transition-colors" /> {s}
                  </div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* Projects Gallery */}
      {(data.projects || []).length > 0 && (
        <section className="py-32" id="portfolio-projects">
          <div className="max-w-5xl mx-auto px-8 space-y-16">
            <div className="space-y-4">
               <span className="text-[10px] font-black text-accent-neon uppercase tracking-widest border-l-2 border-accent-neon pl-4">Synthesis Archive</span>
               <h2 className="font-headline text-6xl text-white uppercase italic">Output Nodes.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((proj, i) => (
                <div key={i} className="group glass-panel p-2 rounded-[3.5rem] bg-white/5 border-white/5 hover:border-white/20 transition-all duration-500">
                  <div className="rounded-[3rem] h-full overflow-hidden bg-white/5 flex flex-col">
                     <div className="h-56 relative overflow-hidden" style={{ background: BG_GRADIENTS[i % BG_GRADIENTS.length] }}>
                        <div className="absolute inset-0 bg-bg-deep/40 backdrop-blur-3xl group-hover:bg-transparent transition-all duration-700" />
                        <div className="absolute inset-0 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-700">
                           <span className="font-headline text-[10rem] opacity-5 text-white italic">{i + 1}</span>
                        </div>
                     </div>
                     <div className="p-10 flex-1 flex flex-col justify-between space-y-8">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                             <h3 className="font-headline text-2xl text-white uppercase tracking-tight">{proj.name}</h3>
                             <span className="text-[9px] font-black text-white/30 uppercase">{proj.year}</span>
                           </div>
                           <p className="text-[11px] text-text-dim font-bold uppercase tracking-widest leading-relaxed line-clamp-3 italic">{proj.description}</p>
                           {proj.tech && (
                             <div className="flex flex-wrap gap-2">
                               {proj.tech.split(',').map(t => <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-white/50 uppercase">{t.trim()}</span>)}
                             </div>
                           )}
                        </div>
                        {proj.link && (
                          <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" className="flex items-center gap-3 text-[10px] font-black text-accent-neon uppercase tracking-[0.2em] hover:gap-5 transition-all">TERMINAL LINK <span className="material-symbols-outlined text-sm">east</span></a>
                        )}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Career Terminal */}
      {(data.experience || []).length > 0 && (
        <section className="py-32" id="portfolio-experience">
          <div className="max-w-5xl mx-auto px-8 space-y-16">
            <div className="space-y-4">
               <span className="text-[10px] font-black text-accent-neon uppercase tracking-widest border-l-2 border-accent-neon pl-4">Trajectory History</span>
               <h2 className="font-headline text-6xl text-white uppercase italic">Active Roles.</h2>
            </div>
            <div className="space-y-12 relative before:absolute before:left-0 md:before:left-1/2 before:top-0 before:w-px before:h-full before:bg-white/5">
              {data.experience.map((exp, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                   <div className="w-4 h-4 rounded-full bg-accent-neon absolute left-0 md:left-1/2 -ml-2 z-10 border-4 border-bg-deep shadow-[0_0_15px_#00ffa3]" />
                   <div className="flex-1 w-full">
                      <div className={`glass-panel p-8 rounded-[2.5rem] bg-white/5 border-white/5 space-y-4 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                        <div className="space-y-1">
                          <p className="text-accent-neon font-headline text-xl italic">{exp.company}</p>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">{exp.role}</p>
                          <p className="text-[8px] text-text-dim font-bold uppercase tracking-widest">{exp.start} — {exp.end || 'PRESENT'}</p>
                        </div>
                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest leading-relaxed italic">{exp.description}</p>
                      </div>
                   </div>
                   <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Source Protocol Modal */}
      {showCode && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-8 animate-in fade-in duration-500">
           <div className="absolute inset-0 bg-bg-deep/90 backdrop-blur-xl" onClick={() => setShowCode(false)} />
           <div className="glass-panel w-full max-w-4xl p-1 md:p-2 rounded-[3.5rem] relative z-10 bg-white/5 border-white/5">
              <div className="rounded-[3rem] bg-bg-deep border border-white/5 overflow-hidden flex flex-col h-[70vh]">
                 <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className="material-symbols-outlined text-accent-neon">terminal</span>
                       <h3 className="font-headline text-xl text-white uppercase italic tracking-tight">Logic Manifest</h3>
                    </div>
                    <button onClick={() => setShowCode(false)} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-white transition-all">
                       <span className="material-symbols-outlined">close</span>
                    </button>
                 </div>
                 <div className="flex-1 p-10 overflow-auto bg-white/2">
                    <pre className="text-[11px] font-bold text-accent-cyan tracking-widest leading-relaxed"><code>{portfolioCode}</code></pre>
                 </div>
                 <div className="p-8 border-t border-white/5 text-right">
                    <button onClick={() => { navigator.clipboard.writeText(portfolioCode); toast.success('Manifest copied.'); }} className="px-8 h-14 bg-white text-bg-deep rounded-2xl font-headline text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Archive Script</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Footer Terminal */}
      <footer className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-8 text-center space-y-8">
           <span className="font-headline text-2xl text-white italic opacity-50 tracking-widest">SATELLITE.IO</span>
           <p className="text-[9px] font-black text-text-dim uppercase tracking-[0.4em]">Integrated Intelligence • Secure Node Cluster • © {new Date().getFullYear()}</p>
        </div>
      </footer>

    </div>
  )
}
