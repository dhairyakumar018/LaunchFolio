import { useState } from 'react'
import { useRateLimit } from '../hooks/useRateLimit'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const STEPS = [
  { id: 'basics', label: 'Basics', icon: '👤' },
  { id: 'summary', label: 'Summary', icon: '📝' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'extras', label: 'Extras', icon: '🏆' },
]

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Clean sidebar with gradient header',
    colors: ['#1e1b4b', '#4f46e5', '#f8f7ff'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Classic black & white elegance',
    colors: ['#000', '#333', '#fff'],
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Bold dark theme with color accents',
    colors: ['#0f172a', '#6366f1', '#8b5cf6'],
  },
  {
    id: 'executive',
    name: 'The Executive',
    desc: 'Sophisticated & bold with premium spacing',
    colors: ['#1a1a1a', '#d4af37', '#ffffff'],
  },
  {
    id: 'architect',
    name: 'The Architect',
    desc: 'Structured & precise with clean typography',
    colors: ['#f5f5f5', '#2c3e50', '#e74c3c'],
  },
  {
    id: 'vanguard',
    name: 'The Vanguard',
    desc: 'Unconventional design for creative professionals',
    colors: ['#1a1a2e', '#16213e', '#e94560'],
  },
  {
    id: 'tech',
    name: 'Tech Stack',
    desc: 'Minimalist with code-inspired elements',
    colors: ['#0d1117', '#58a6ff', '#79c0ff'],
  },
  {
    id: 'startup',
    name: 'Startup Vibes',
    desc: 'Modern & energetic with vibrant colors',
    colors: ['#fff5f7', '#ff006e', '#8338ec'],
  },
  {
    id: 'elegant',
    name: 'Elegant',
    desc: 'Sophisticated serif typography & spacing',
    colors: ['#f8f8f8', '#2d2d2d', '#c0a080'],
  },
  {
    id: 'corporate',
    name: 'Corporate Pro',
    desc: 'Formal layout for executives & managers',
    colors: ['#003366', '#ffffff', '#ff6600'],
  },
]

const AI_SUGGESTIONS = {
  summary: [
    'Results-driven professional with expertise in delivering high-impact solutions.',
    'Passionate about leveraging technology to solve complex real-world problems.',
    'Strong track record of collaborating cross-functionally to meet tight deadlines.',
  ],
  experience: [
    'Led a team of engineers to deliver a product 2 weeks ahead of schedule.',
    'Reduced system latency by 40% through architectural optimizations.',
    'Mentored junior developers, improving team velocity by 25%.',
  ],
  projects: [
    'Implemented CI/CD pipelines reducing deployment time by 60%.',
    'Achieved 98% test coverage using Jest and Cypress.',
    'Scaled application to serve 100k+ users with 99.9% uptime.',
  ],
}

function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState('')
  const add = () => {
    const v = input.trim()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setInput('')
  }
  const remove = (t) => onChange(tags.filter(x => x !== t))
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/5 rounded-xl focus-within:border-accent-neon transition-all">
      {tags.map(t => (
        <span key={t} className="flex items-center gap-2 px-3 py-1 bg-accent-neon/10 border border-accent-neon/20 text-accent-neon text-[10px] font-bold uppercase rounded-lg">
          {t}
          <button className="hover:text-white" onClick={() => remove(t)}>×</button>
        </span>
      ))}
      <input
        className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-text-dim/40 min-w-[120px]"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } if (e.key === 'Backspace' && !input) remove(tags[tags.length - 1]) }}
        onBlur={add}
        placeholder={placeholder || 'Type and press Enter...'}
      />
    </div>
  )
}

function AISuggestions({ type, onApply }) {
  const [applied, setApplied] = useState([])
  const { remaining, checkLimit, isLimited, timeUntilReset } = useRateLimit('ai_suggestions', 10)
  const suggestions = AI_SUGGESTIONS[type] || []
  if (!suggestions.length) return null
  const minutesRemaining = Math.ceil(timeUntilReset / 60000)

  const apply = (s) => {
    if (!checkLimit()) return
    setApplied(prev => [...prev, s])
    onApply(s)
    setTimeout(() => setApplied(prev => prev.filter(x => x !== s)), 1500)
  }

  return (
    <div className={`glass-panel p-6 rounded-2xl border-accent-neon/20 space-y-4 mb-8 ${isLimited ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-accent-neon text-xl">auto_awesome</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">AI Refinement Engine</span>
        </div>
        <span className="text-[9px] font-bold text-text-dim uppercase tracking-widest">
          {isLimited ? `Reset in ${minutesRemaining}m` : `${remaining} Optims Left`}
        </span>
      </div>
      <div className="space-y-2">
        {suggestions.map(s => (
          <button 
            key={s} 
            onClick={() => !applied.includes(s) && apply(s)}
            className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-neon/30 hover:bg-accent-neon/5 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-neon mt-1 group-hover:scale-125 transition-transform" />
              <span className="text-xs text-text-dim group-hover:text-white leading-relaxed">{s}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ResumeForm({ data, setData, onPreview, onBack, onTemplates }) {
  const [step, setStep] = useState(0)
  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))
  const progress = ((step + 1) / STEPS.length) * 100

  const addEntry = (key, obj) => set(key, [...(data[key] || []), obj])
  const removeEntry = (key, i) => set(key, data[key].filter((_, idx) => idx !== i))
  const updateEntry = (key, i, field, val) => {
    const arr = [...data[key]]
    arr[i] = { ...arr[i], [field]: val }
    set(key, arr)
  }

  const canProceed = () => {
    if (step === 0) return data.name.trim() && data.email.trim()
    return true
  }

  const fieldStyle = "w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:border-accent-neon focus:bg-white/[0.08] outline-none transition-all placeholder:text-text-dim/20"
  const labelStyle = "text-[10px] font-bold text-text-dim uppercase tracking-widest ml-1 mb-2 block"

  const renderStep = () => {
    switch (STEPS[step].id) {
      case 'basics': return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className={labelStyle}>Full Name *</label>
            <input className={fieldStyle} placeholder="Dhairya Kumar" value={data.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className={labelStyle}>Professional Title</label>
            <input className={fieldStyle} placeholder="Software Engineer" value={data.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className={labelStyle}>Email Address *</label>
            <input className={fieldStyle} type="email" placeholder="name@example.com" value={data.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className={labelStyle}>Phone Number</label>
            <input className={fieldStyle} placeholder="+91 0000000000" value={data.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className={labelStyle}>Location</label>
            <input className={fieldStyle} placeholder="Noida, India" value={data.location} onChange={e => set('location', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className={labelStyle}>Website / LinkedIn</label>
            <input className={fieldStyle} placeholder="https://linkedin.com/in/..." value={data.website} onChange={e => set('website', e.target.value)} />
          </div>
        </div>
      )

      case 'summary': return (
        <div className="space-y-6">
          <AISuggestions type="summary" onApply={s => set('summary', data.summary ? data.summary + ' ' + s : s)} />
          <div className="space-y-2">
            <label className={labelStyle}>Professional Summary</label>
            <textarea
              className={fieldStyle}
              style={{ minHeight: '160px' }}
              placeholder="Tell us about your professional background and goals..."
              value={data.summary}
              onChange={e => set('summary', e.target.value)}
            />
          </div>
        </div>
      )

      case 'skills': return (
        <div className="space-y-8">
          <div className="space-y-2">
            <label className={labelStyle}>Specializations</label>
            <TagInput tags={data.skills} onChange={v => set('skills', v)} placeholder="Type a tech/skill and press Enter" />
          </div>
          <div className="p-6 glass-panel rounded-2xl border-white/5 space-y-4">
             <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Active Stack Preview</span>
             <div className="flex flex-wrap gap-2">
               {data.skills.map(s => <span key={s} className="px-3 py-1 px-3 py-1 bg-white/5 text-white text-[10px] font-bold rounded-lg border border-white/5">{s}</span>)}
             </div>
          </div>
        </div>
      )

      case 'education': return (
        <div className="space-y-8">
          {(data.education || []).map((edu, i) => (
            <div key={i} className="glass-panel p-8 rounded-2xl relative border-white/5 reveal-item">
              <button 
                className="absolute top-6 right-6 text-[9px] font-bold text-pink-500 uppercase hover:underline" 
                onClick={() => removeEntry('education', i)}
              >
                Remove
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className={labelStyle}>Institution</label>
                  <input className={fieldStyle} placeholder="Standard University" value={edu.institution || ''} onChange={e => updateEntry('education', i, 'institution', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className={labelStyle}>Credentials</label>
                  <input className={fieldStyle} placeholder="B.Sc. in Engineering" value={edu.degree || ''} onChange={e => updateEntry('education', i, 'degree', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Year One</label>
                  <input className={fieldStyle} placeholder="2019" value={edu.start || ''} onChange={e => updateEntry('education', i, 'start', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Completion</label>
                  <input className={fieldStyle} placeholder="2023" value={edu.end || ''} onChange={e => updateEntry('education', i, 'end', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <button 
            className="w-full h-16 rounded-2xl border-2 border-dashed border-white/5 text-text-dim font-bold uppercase text-[10px] tracking-widest hover:border-accent-neon/40 hover:text-white transition-all"
            onClick={() => addEntry('education', { institution: '', degree: '', start: '', end: '', gpa: '' })}
          >
            + Add Education
          </button>
        </div>
      )

      case 'experience': return (
        <div className="space-y-8">
          <AISuggestions type="experience" onApply={s => {
            if (data.experience.length > 0) {
              const arr = [...data.experience]
              arr[arr.length - 1] = { ...arr[arr.length - 1], description: (arr[arr.length - 1].description || '') + '\n• ' + s }
              set('experience', arr)
            }
          }} />
          {(data.experience || []).map((exp, i) => (
            <div key={i} className="glass-panel p-8 rounded-2xl relative border-white/5 reveal-item">
              <button 
                className="absolute top-6 right-6 text-[9px] font-bold text-pink-500 uppercase hover:underline" 
                onClick={() => removeEntry('experience', i)}
              >
                Remove
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className={labelStyle}>Organization</label>
                  <input className={fieldStyle} placeholder="Global Dynamics" value={exp.company || ''} onChange={e => updateEntry('experience', i, 'company', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className={labelStyle}>Designation</label>
                  <input className={fieldStyle} placeholder="Senior Architect" value={exp.role || ''} onChange={e => updateEntry('experience', i, 'role', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Entry Period</label>
                  <input className={fieldStyle} placeholder="Jan 2022" value={exp.start || ''} onChange={e => updateEntry('experience', i, 'start', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className={labelStyle}>Exit Period</label>
                  <input className={fieldStyle} placeholder="Present" value={exp.end || ''} onChange={e => updateEntry('experience', i, 'end', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className={labelStyle}>Job Description & Achievements</label>
                  <textarea className={fieldStyle} style={{ minHeight: '120px' }} placeholder="Describe your responsibilities and impact..." value={exp.description || ''} onChange={e => updateEntry('experience', i, 'description', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <button 
            className="w-full h-16 rounded-2xl border-2 border-dashed border-white/5 text-text-dim font-bold uppercase text-[10px] tracking-widest hover:border-accent-neon/40 hover:text-white transition-all"
            onClick={() => addEntry('experience', { company: '', role: '', start: '', end: '', description: '' })}
          >
            + Add Experience
          </button>
        </div>
      )

      case 'projects': return (
        <div className="space-y-8">
           <AISuggestions type="projects" onApply={s => {
            if (data.projects.length > 0) {
              const arr = [...data.projects]
              arr[arr.length - 1] = { ...arr[arr.length - 1], description: (arr[arr.length - 1].description || '') + ' ' + s }
              set('projects', arr)
            }
          }} />
          {(data.projects || []).map((proj, i) => (
             <div key={i} className="glass-panel p-8 rounded-2xl relative border-white/5 reveal-item">
               <button className="absolute top-6 right-6 text-[9px] font-bold text-pink-500 uppercase hover:underline" onClick={() => removeEntry('projects', i)}>Decommission</button>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2 md:col-span-2">
                   <label className={labelStyle}>Project Name</label>
                   <input className={fieldStyle} placeholder="Phoenix Protocol" value={proj.name || ''} onChange={e => updateEntry('projects', i, 'name', e.target.value)} />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <label className={labelStyle}>Tech Stack</label>
                   <input className={fieldStyle} placeholder="Next.js, Tailwind, D1" value={proj.tech || ''} onChange={e => updateEntry('projects', i, 'tech', e.target.value)} />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                    <label className={labelStyle}>Blueprint Scope</label>
                    <textarea className={fieldStyle} placeholder="Architected a zero-latency protocol..." value={proj.description || ''} onChange={e => updateEntry('projects', i, 'description', e.target.value)} />
                 </div>
               </div>
             </div>
          ))}
          <button 
            className="w-full h-16 rounded-2xl border-2 border-dashed border-white/5 text-text-dim font-bold uppercase text-[10px] tracking-widest hover:border-accent-neon/40 hover:text-white transition-all"
            onClick={() => addEntry('projects', { name: '', tech: '', link: '', year: '', description: '' })}
          >
            + Add Project
          </button>
        </div>
      )

      case 'extras': return (
        <div className="space-y-8">
          <div className="space-y-2">
            <label className={labelStyle}>Certifications</label>
            <TagInput tags={data.certifications || []} onChange={v => set('certifications', v)} placeholder="e.g. AWS Certified, Google Cloud Architect..." />
          </div>
          <div className="space-y-2">
            <label className={labelStyle}>Achievements & Awards</label>
            <TagInput tags={data.achievements || []} onChange={v => set('achievements', v)} placeholder="e.g. Hackathon Winner, Dean's List..." />
          </div>
          <div className="p-8 glass-panel rounded-3xl border-accent-neon/20 bg-accent-neon/5 space-y-4">
             <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-accent-neon">military_tech</span>
               <span className="text-[10px] font-bold text-white uppercase tracking-widest">Final Synthesis Required</span>
             </div>
             <p className="text-xs text-text-dim leading-relaxed">You have completed all architectural modules. Proceed to preview your career blueprint.</p>
          </div>
        </div>
      )

      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-deep noise-bg p-8 pt-32">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-72 space-y-12">
            <div className="space-y-2">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-bold text-accent-neon uppercase tracking-widest">Progress Map</span>
                <span className="font-headline text-2xl text-white">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent-neon transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${i === step ? 'bg-white/10 text-white' : i < step ? 'text-accent-neon hover:bg-white/5' : 'text-text-dim/40 pointer-events-none'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border font-headline text-xs ${i === step ? 'border-accent-neon bg-accent-neon/10' : i < step ? 'border-accent-neon text-accent-neon' : 'border-white/5'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{s.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Builder Surface */}
          <div className="flex-1 space-y-12 reveal-item delay-100">
             <div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-accent-neon/10 border border-accent-neon/20 flex items-center justify-center text-accent-neon transition-transform hover:scale-110">
                    <span className="material-symbols-outlined">{STEPS[step].icon === '👤' ? 'person' : STEPS[step].icon === '📝' ? 'description' : STEPS[step].icon === '⚡' ? 'bolt' : STEPS[step].icon === '🎓' ? 'school' : STEPS[step].icon === '💼' ? 'work' : STEPS[step].icon === '🚀' ? 'rocket' : 'star'}</span>
                  </div>
                  <h2 className="font-headline text-4xl text-white uppercase tracking-tight">{STEPS[step].label}</h2>
               </div>

               <div className="reveal-item">
                 {renderStep()}
               </div>

               <div className="flex items-center justify-between pt-16 mt-8 border-t border-white/5">
                  <button
                    className="flex items-center gap-2 text-text-dim hover:text-white transition-all font-headline text-[10px] font-bold uppercase tracking-widest"
                    onClick={() => step > 0 ? setStep(step - 1) : onBack()}
                  >
                    <ChevronLeft size={14} /> Back
                  </button>

                  <div className="flex items-center gap-4">
                    {step < STEPS.length - 1 ? (
                      <button
                        className="group relative h-14 px-10 bg-white text-bg-deep rounded-full font-headline font-bold text-sm tracking-widest uppercase overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-30"
                        onClick={() => canProceed() && setStep(step + 1)}
                        disabled={!canProceed()}
                      >
                        <span className="relative z-10 flex items-center gap-2">Next Step <ChevronRight size={16} /></span>
                        <div className="absolute inset-0 bg-accent-neon translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                    ) : (
                      <button 
                        onClick={() => onPreview(data)}
                        className="group relative h-14 px-10 bg-accent-neon text-white rounded-full font-headline font-bold text-sm tracking-widest uppercase overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                         <span className="relative z-10 flex items-center gap-2">Preview Resume <span className="material-symbols-outlined text-lg">visibility</span></span>
                         <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                    )}
                  </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
