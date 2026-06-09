import { useState } from 'react'
import toast from 'react-hot-toast'

const STYLE_PRESETS = [
  { id: 'minimal', label: 'Minimalist', icon: '📋', colors: ['#ffffff', '#000000'] },
  { id: 'modern', label: 'Modern', icon: '✨', colors: ['#f0f4ff', '#4f46e5'] },
  { id: 'bold', label: 'Bold', icon: '💪', colors: ['#1a1a1a', '#ff6b6b'] },
  { id: 'elegant', label: 'Elegant', icon: '👑', colors: ['#f8f8f8', '#8b6f47'] },
  { id: 'vibrant', label: 'Vibrant', icon: '🎨', colors: ['#fff5f7', '#ff006e'] },
  { id: 'tech', label: 'Tech', icon: '💻', colors: ['#0d1117', '#58a6ff'] },
]

const INDUSTRY_OPTIONS = [
  'Technology',
  'Finance',
  'Healthcare',
  'Marketing',
  'Design',
  'Education',
  'Sales',
  'Operations',
]

const LAYOUT_OPTIONS = [
  { id: 'sidebar', label: 'Sidebar Layout', desc: 'Skills on left, experience on right' },
  { id: 'horizontal', label: 'Horizontal Sections', desc: 'Traditional stacked sections' },
  { id: 'mixed', label: 'Mixed Layout', desc: 'Combination of sidebar and sections' },
]

export default function AITemplateBuilder({ onCreateTemplate, onBack }) {
  const [step, setStep] = useState(0)
  const [config, setConfig] = useState({ style: 'modern', industry: 'Technology', layout: 'sidebar', colors: ['#00ffa3', '#ffffff'], accentColor: '#00ffa3', name: '', isCreating: false })

  const steps = [
    { id: 'style', label: 'Style', icon: 'palette' },
    { id: 'industry', label: 'Industry', icon: 'business' },
    { id: 'layout', label: 'Layout', icon: 'grid_view' },
    { id: 'colors', label: 'Colors', icon: 'colorize' },
    { id: 'review', label: 'Review', icon: 'checklist' }
  ]

  const updateConfig = (key, value) => setConfig(prev => ({ ...prev, [key]: value }))

  const handleCreateTemplate = async () => {
    if (!config.name.trim()) { toast.error('Please enter a template name.'); return; }
    updateConfig('isCreating', true)
    setTimeout(() => {
      const newTemplate = { id: `custom-${Date.now()}`, name: config.name, category: config.industry, desc: `Custom ${config.style} template for ${config.industry}`, colors: config.colors, isCustom: true, config: config }
      onCreateTemplate(newTemplate); toast.success('Template created successfully.');
      updateConfig('isCreating', false)
    }, 2000)
  }

  const renderContent = () => {
    switch (steps[step].id) {
      case 'style':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
               <h3 className="font-headline text-3xl text-white uppercase italic">Choose a Style</h3>
               <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest italic">Pick the visual foundation for your new resume template.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {STYLE_PRESETS.map(preset => (
                <div
                  key={preset.id}
                  onClick={() => { updateConfig('style', preset.id); updateConfig('colors', preset.colors); }}
                  className={`group glass-panel p-6 rounded-3xl cursor-pointer transition-all duration-500 hover:border-white/20 ${config.style === preset.id ? 'bg-white/10 border-accent-neon shadow-[0_0_20px_rgba(0,255,163,0.1)]' : 'bg-transparent'}`}
                >
                  <div className="text-center space-y-3">
                    <span className="text-2xl opacity-80 group-hover:scale-110 transition-transform block">{preset.icon}</span>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{preset.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'industry':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
               <h3 className="font-headline text-3xl text-white uppercase italic">Select Industry</h3>
               <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest italic">We'll optimize the template for your specific industry standards.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {INDUSTRY_OPTIONS.map(industry => (
                <button
                  key={industry}
                  onClick={() => updateConfig('industry', industry)}
                  className={`h-14 rounded-2xl border transition-all text-[9px] font-black uppercase tracking-widest ${config.industry === industry ? 'bg-white text-bg-deep border-transparent' : 'bg-white/5 text-text-dim border-white/5 hover:border-white/20 hover:text-white'}`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
        )
      case 'layout':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
               <h3 className="font-headline text-3xl text-white uppercase italic">Choose Architecture</h3>
               <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest italic">Define the structural hierarchy of your content.</p>
            </div>
            <div className="space-y-4">
              {LAYOUT_OPTIONS.map(layout => (
                <div
                  key={layout.id}
                  onClick={() => updateConfig('layout', layout.id)}
                  className={`glass-panel p-6 rounded-3xl cursor-pointer transition-all duration-300 flex items-center justify-between group ${config.layout === layout.id ? 'bg-white/10 border-accent-neon' : 'bg-transparent hover:border-white/10'}`}
                >
                   <div className="space-y-1">
                     <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{layout.label}</h4>
                     <p className="text-[9px] text-text-dim font-bold uppercase tracking-tight">{layout.desc}</p>
                   </div>
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${config.layout === layout.id ? 'border-accent-neon' : 'border-white/10 group-hover:border-white/20'}`}>
                      {config.layout === layout.id && <div className="w-2 h-2 rounded-full bg-accent-neon" />}
                   </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'colors':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center space-y-2">
               <h3 className="font-headline text-3xl text-white uppercase italic">Spectrum Modulation</h3>
               <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest italic">Calibrate the visual energy of your architectural blueprint.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {[0, 1].map(index => (
                  <div key={index} className="space-y-3">
                    <label className="text-[9px] font-black text-text-dim uppercase tracking-widest ml-1">{index === 0 ? 'Primary Frequency' : 'Secondary Frequency'}</label>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl group hover:border-white/10 transition-all">
                      <input 
                        type="color" 
                        value={config.colors[index]} 
                        onChange={e => {
                          const newColors = [...config.colors]; newColors[index] = e.target.value;
                          updateConfig('colors', newColors);
                          if(index === 0) updateConfig('accentColor', e.target.value);
                        }}
                        className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer" 
                      />
                      <span className="text-[12px] font-headline text-white/40 tracking-widest uppercase">{config.colors[index]}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-64 rounded-[3rem] border border-white/5 p-2 flex items-center justify-center relative group">
                <div className="absolute inset-0 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: `linear-gradient(135deg, ${config.colors[0]}, ${config.colors[1]})` }} />
                <div className="w-48 h-48 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/10 flex items-center justify-center relative translate-y-4">
                   <div className="w-full h-full rounded-full animate-spin-slow opacity-30" style={{ border: `4px dashed ${config.colors[0]}` }} />
                   <p className="absolute text-[8px] font-black text-white uppercase tracking-[0.4em]">Spectrum Check</p>
                </div>
              </div>
            </div>
          </div>
        )
      case 'review':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
               <h3 className="font-headline text-3xl text-white uppercase italic">Validation & Designation</h3>
               <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest italic">Archive your synthesized architecture into the permanent records.</p>
            </div>
            <div className="space-y-8">
               <div className="space-y-3">
                 <label className="text-[9px] font-black text-text-dim uppercase tracking-widest ml-1">Blueprint Designation</label>
                 <input 
                   type="text" 
                   required
                   placeholder="E.G., ALPHA-9 STRATEGIST"
                   value={config.name}
                   onChange={e => updateConfig('name', e.target.value)}
                   className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-8 text-[11px] font-bold text-white uppercase tracking-[0.2em] outline-none focus:border-accent-neon/50 focus:bg-white/10 transition-all placeholder:text-white/10"
                 />
               </div>
               <div className="grid grid-cols-3 gap-4">
                 {[
                   { label: 'Style', val: config.style },
                   { label: 'Domain', val: config.industry },
                   { label: 'Struct', val: config.layout }
                 ].map((d, i) => (
                   <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1">
                     <p className="text-[8px] font-black text-text-dim uppercase tracking-widest">{d.label}</p>
                     <p className="text-[10px] font-bold text-white uppercase tracking-tight">{d.val}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-deep noise-bg p-8 pt-32 selection:bg-accent-neon/30 overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Console */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 reveal-item">
          <button onClick={onBack} className="group flex items-center gap-3 text-text-dim hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
            <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </div>
            Abort Synthesis
          </button>
          <div className="text-center md:text-right">
             <h1 className="font-headline text-4xl text-white tracking-widest uppercase italic border-b border-accent-neon/30 inline-block pb-1">Synthesis Lab</h1>
          </div>
        </div>

        {/* Console Hub */}
        <div className="glass-panel p-10 md:p-16 rounded-[4rem] border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative overflow-hidden reveal-item">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent-neon/20">
             <div className="h-full bg-accent-neon transition-all duration-700 ease-out shadow-[0_0_15px_#00ffa3]" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>

          <div className="space-y-16">
            {/* Nav Steps */}
            <div className="flex justify-between items-center relative gap-4">
              {steps.map((s, i) => (
                <button 
                  key={s.id} 
                  onClick={() => i < step && setStep(i)}
                  className={`relative z-10 flex flex-col items-center gap-3 group disabled:cursor-default ${i > step ? 'opacity-20' : 'opacity-100'}`}
                  disabled={i > step}
                >
                  <div className={`w-12 h-12 rounded-2xl border transition-all duration-500 flex items-center justify-center ${i === step ? 'bg-white border-transparent text-bg-deep shadow-[0_0_25px_rgba(255,255,255,0.2)]' : i < step ? 'border-accent-neon text-accent-neon bg-accent-neon/10' : 'border-white/5 text-text-dim'}`}>
                    <span className="material-symbols-outlined text-xl">{i < step ? 'done' : s.icon}</span>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-[0.25em] transition-colors ${i === step ? 'text-white' : 'text-text-dim'}`}>{s.label}</span>
                </button>
              ))}
              <div className="absolute top-6 left-6 right-6 h-px bg-white/5 -z-10" />
            </div>

            {/* Step Surface */}
            <div className="min-h-[300px]">
              {renderContent()}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-8 border-t border-white/5">
              <button 
                onClick={() => step > 0 ? setStep(step - 1) : onBack()}
                className="h-12 px-8 text-text-dim text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
              >
                Previous Stage
              </button>
              
              {step < steps.length - 1 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  className="group relative h-14 px-12 bg-white text-bg-deep rounded-2xl font-headline text-xs uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">Proceed <span className="material-symbols-outlined text-sm">east</span></span>
                  <div className="absolute inset-0 bg-accent-neon translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms]"></div>
                </button>
              ) : (
                <button 
                  onClick={handleCreateTemplate}
                  disabled={config.isCreating || !config.name.trim()}
                  className="group relative h-16 px-16 bg-accent-neon text-bg-deep rounded-2xl font-headline text-xs uppercase tracking-[0.25em] overflow-hidden transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(0,255,163,0.3)] disabled:opacity-50 disabled:hover:scale-100"
                >
                  <span className="relative z-10">{config.isCreating ? 'Synthesizing...' : 'Finalize Synthesis'}</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms]"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
