import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import PortfolioAIAssistant from './PortfolioAIAssistant'
import toast from 'react-hot-toast'

export default function PortfolioEditor({ data, onSave, onBack }) {
  const [portfolioData, setPortfolioData] = useState({
    ...data,
    portfolioSections: data.portfolioSections || {
      hero: { enabled: true, customTitle: '', customSubtitle: '' },
      about: { enabled: true, content: data.summary || '' },
      skills: { enabled: true, layout: 'cloud' },
      projects: { enabled: true, layout: 'grid' },
      experience: { enabled: true, layout: 'timeline' },
      education: { enabled: true, layout: 'cards' },
      achievements: { enabled: true, layout: 'grid' },
      contact: { enabled: true },
      customSections: []
    }
  })
  const { user } = useAuth()

  const handleSave = () => {
    if (!user) { toast.error('Terminal locked. Sign in required.'); return; }
    onSave(portfolioData); toast.success('Configuration synchronized.');
  }

  const updateSection = (section, updates) => {
    setPortfolioData(prev => ({
      ...prev,
      portfolioSections: { ...prev.portfolioSections, [section]: { ...prev.portfolioSections[section], ...updates } }
    }))
  }

  const addCustomSection = () => {
    const newSection = { id: `custom-${Date.now()}`, title: 'New Node', content: '', type: 'text' }
    setPortfolioData(prev => ({
      ...prev,
      portfolioSections: { ...prev.portfolioSections, customSections: [...prev.portfolioSections.customSections, newSection] }
    }))
  }

  const updateCustomSection = (index, updates) => {
    setPortfolioData(prev => ({
      ...prev,
      portfolioSections: {
        ...prev.portfolioSections,
        customSections: prev.portfolioSections.customSections.map((section, i) => i === index ? { ...section, ...updates } : section)
      }
    }))
  }

  const handleImageUpload = (index, file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => { updateCustomSection(index, { content: e.target.result, fileName: file.name }) }
      reader.readAsDataURL(file)
    }
  }

  const removeCustomSection = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      portfolioSections: {
        ...prev.portfolioSections,
        customSections: prev.portfolioSections.customSections.filter((_, i) => i !== index)
      }
    }))
  }

  return (
    <div className="min-h-screen bg-bg-deep noise-bg p-8 pt-32 selection:bg-accent-neon/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hub Navigation */}
        <div className="flex items-center justify-between reveal-item">
           <div className="space-y-1">
             <h1 className="font-headline text-5xl text-white uppercase italic tracking-tight">Interface <span className="text-accent-neon">Reconfiguration</span></h1>
             <p className="text-[10px] text-text-dim font-black uppercase tracking-[0.3em]">Institutional Grade Deployment • Node 4.2.0</p>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={onBack}
                className="h-14 px-8 text-text-dim hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-white/5 rounded-2xl hover:bg-white/5"
              >
                Abort Protocol
              </button>
              <button 
                onClick={handleSave}
                className="group relative h-14 px-10 bg-white text-bg-deep rounded-2xl font-headline text-xs font-bold uppercase tracking-widest overflow-hidden transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                 <span className="relative z-10">Push To Production</span>
                 <div className="absolute inset-0 bg-accent-neon translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms]"></div>
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Configuration Panel */}
          <div className="space-y-8 reveal-item [animation-delay:100ms]">
            
            {/* Core Sections */}
            <div className="glass-panel p-10 rounded-[3rem] bg-white/5 border-white/5 space-y-12">
               <div className="space-y-8">
                 <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-accent-neon uppercase tracking-widest">Architectural Core</span>
                    <div className="h-px flex-1 bg-white/5" />
                 </div>

                 {/* Hero Config */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-accent-neon" />
                       <h3 className="font-headline text-sm text-white uppercase tracking-widest italic">Identity Header</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <label className="text-[9px] font-black text-text-dim uppercase tracking-widest ml-4">Override Name</label>
                         <input 
                           type="text" 
                           value={portfolioData.portfolioSections.hero.customTitle}
                           onChange={(e) => updateSection('hero', { customTitle: e.target.value })}
                           className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[11px] font-bold text-white uppercase tracking-widest outline-none focus:border-accent-neon/30 focus:bg-white/10 transition-all placeholder:text-white/10"
                           placeholder="SYSTEM_DEFAULT"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[9px] font-black text-text-dim uppercase tracking-widest ml-4">Override Title</label>
                         <input 
                           type="text" 
                           value={portfolioData.portfolioSections.hero.customSubtitle}
                           onChange={(e) => updateSection('hero', { customSubtitle: e.target.value })}
                           className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[11px] font-bold text-white uppercase tracking-widest outline-none focus:border-accent-neon/30 focus:bg-white/10 transition-all placeholder:text-white/10"
                           placeholder="SYSTEM_DEFAULT"
                         />
                       </div>
                    </div>
                 </div>

                 {/* About Config */}
                 <div className="space-y-6 pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                          <h3 className="font-headline text-sm text-white uppercase tracking-widest italic">Personal Manifest</h3>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={portfolioData.portfolioSections.about.enabled} onChange={(e) => updateSection('about', { enabled: e.target.checked })} className="sr-only peer" />
                          <div className="w-11 h-6 bg-white/5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/30 after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-accent-neon peer-checked:bg-accent-neon/20"></div>
                       </label>
                    </div>
                    {portfolioData.portfolioSections.about.enabled && (
                      <textarea 
                        value={portfolioData.portfolioSections.about.content}
                        onChange={(e) => updateSection('about', { content: e.target.value })}
                        className="w-full h-32 bg-white/5 border border-white/5 rounded-[2rem] p-8 text-[11px] font-bold text-white uppercase tracking-widest outline-none focus:border-accent-neon/30 focus:bg-white/10 transition-all placeholder:text-white/10 resize-none leading-relaxed italic"
                        placeholder="Define your existence protocol..."
                      />
                    )}
                 </div>
               </div>
            </div>

            {/* Custom Nodes */}
            <div className="space-y-6">
               <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">Auxiliary Nodes</span>
                  <div className="h-px flex-1 bg-white/5" />
               </div>
               
               {portfolioData.portfolioSections.customSections.map((section, index) => (
                  <div key={section.id} className="glass-panel p-8 rounded-[2.5rem] bg-white/2 border-white/5 space-y-6 relative group overflow-hidden">
                     <div className="flex items-center justify-between">
                        <input 
                           type="text" 
                           value={section.title}
                           onChange={(e) => updateCustomSection(index, { title: e.target.value })}
                           className="bg-transparent border-none font-headline text-xl text-white uppercase italic tracking-tight outline-none w-2/3"
                        />
                        <button onClick={() => removeCustomSection(index)} className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-text-dim hover:text-red-400 transition-all">
                           <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                     </div>
                     <textarea 
                        value={section.content}
                        onChange={(e) => updateCustomSection(index, { content: e.target.value })}
                        className="w-full h-24 bg-white/5 border border-white/5 rounded-2xl p-6 text-[10px] font-bold text-white uppercase tracking-widest outline-none focus:border-accent-neon/30 focus:bg-white/10 transition-all placeholder:text-white/10 resize-none italic"
                        placeholder="Node data logic..."
                     />
                  </div>
               ))}

               <button 
                 onClick={addCustomSection}
                 className="w-full h-16 rounded-[2rem] border border-dashed border-white/10 flex items-center justify-center gap-3 text-[10px] font-black text-text-dim uppercase tracking-widest hover:border-white/30 hover:text-white hover:bg-white/5 transition-all"
               >
                 <span className="material-symbols-outlined text-sm">add_circle</span> Initialize Custom Node
               </button>
            </div>
          </div>

          {/* Render Monitoring */}
          <div className="lg:sticky lg:top-32 h-[calc(100vh-12rem)] reveal-item [animation-delay:200ms]">
             <div className="glass-panel h-full rounded-[4rem] bg-white/5 border-white/5 overflow-hidden flex flex-col">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Render Stream</span>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-12 h-1 bg-white/10 rounded-full" />
                      <div className="w-4 h-1 bg-accent-neon rounded-full" />
                   </div>
                </div>
                <div className="flex-1 p-12 overflow-auto bg-bg-deep/40 relative">
                   {/* Internal Preview Rendering */}
                   <div className="space-y-12 opacity-50 pointer-events-none scale-95 origin-top">
                      <div className="space-y-4 text-center">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/5 mx-auto" />
                        <h2 className="font-headline text-5xl text-white uppercase italic">{portfolioData.portfolioSections.hero.customTitle || portfolioData.name || 'IDENT_ID'}</h2>
                        <p className="text-[10px] text-accent-neon uppercase font-black tracking-widest">{portfolioData.portfolioSections.hero.customSubtitle || portfolioData.title || 'STATUS_ACTIVE'}</p>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="space-y-6">
                        <div className="h-4 w-1/4 bg-white/10 rounded-full" />
                        <div className="space-y-3">
                           <div className="h-2 w-full bg-white/5 rounded-full" />
                           <div className="h-2 w-full bg-white/5 rounded-full" />
                           <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                        </div>
                      </div>
                   </div>

                   {/* AI Assistant Node */}
                   <div className="absolute inset-x-8 bottom-8 pt-8">
                      <div className="glass-panel p-6 rounded-[2.5rem] bg-accent-neon/5 border-accent-neon/20 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                        <PortfolioAIAssistant 
                          data={portfolioData}
                          onSuggestion={(suggestion) => {
                            toast.success('Strategy synchronized.');
                            console.log('AI suggestion:', suggestion);
                          }}
                        />
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}