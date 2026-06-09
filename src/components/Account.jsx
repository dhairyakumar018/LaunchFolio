import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePurchases } from '../hooks/usePurchases'
import { api } from '../lib/api'
import { User, CreditCard, FileText, Globe, LogOut, ChevronRight, Download, Eye, Loader2, ShieldCheck, Zap, Activity } from 'lucide-react'
import toast from 'react-hot-toast'
import { ModernResume, MinimalResume, CreativeResume } from './ResumeLayouts'

const TEMPLATES_INFO = [
  { id: 'minimalist', name: 'Minimalist', layout: 'minimal', colors: ['#0f172a', '#64748b', '#0f172a'] },
  { id: 'developer', name: 'The Developer', layout: 'modern', colors: ['#071013', '#0f172a', '#38bdf8'] },
  { id: 'storyteller', name: 'Storyteller', layout: 'creative', colors: ['#475569', '#1e293b', '#ccf381'] },
  { id: 'executive', name: 'Executive', layout: 'minimal', colors: ['#1a1a1a', '#d4af37', '#1a1a1a'] },
  { id: 'architect', name: 'Architect', layout: 'modern', colors: ['#1e293b', '#0f172a', '#ef4444'] },
  { id: 'artisan', name: 'Artisan', layout: 'creative', colors: ['#0f172a', '#1e1b4b', '#7c3aed'] },
  { id: 'startup', name: 'Startup Vibes', layout: 'modern', colors: ['#e11d48', '#8338ec', '#ff006e'] },
  { id: 'corporate', name: 'Corporate Pro', layout: 'minimal', colors: ['#0f172a', '#1d4ed8', '#0f172a'] },
  { id: 'codecraft', name: 'CodeCraft', layout: 'modern', colors: ['#020617', '#0ea5e9', '#0ea5e9'] },
  { id: 'polished', name: 'Polished', layout: 'minimal', colors: ['#111827', '#64748b', '#111827'] },
  { id: 'innovator', name: 'Innovator', layout: 'creative', colors: ['#111827', '#000000', '#38bdf8'] },
  { id: 'designer', name: 'Designer', layout: 'creative', colors: ['#0f172a', '#1e293b', '#f97316'] }
]

export default function Account({ onBack, onSelectResume }) {
  const { user, logout } = useAuth()
  const { purchases, loading: loadingPurchases, hasAccess } = usePurchases()
  const [activeTab, setActiveTab] = useState('profile')
  const [resumes, setResumes] = useState([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [downloading, setDownloading] = useState(null)
  const [selectedTemplates, setSelectedTemplates] = useState({})
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const hiddenResumeRef = useRef(null)

  useEffect(() => { if (user) loadResumes() }, [user])

  const loadResumes = async () => {
    try { const data = await api.resumes.list(); setResumes(data); }
    catch (err) { console.error('Failed to sync archives:', err); }
    finally { setLoadingResumes(false); }
  }

  const handleDownloadPDF = async (resume, e, purchaseId = null) => {
    e.stopPropagation()
    const templateId = (purchaseId && selectedTemplates[purchaseId]) || resume.template || 'minimalist'
    if (!hasAccess('resume', templateId)) { toast.error('Access Denied: Protocol Violation.'); return; }
    setDownloading({ resumeId: resume.id, template: templateId })
    try {
      const html2pdf = window.html2pdf; if (!html2pdf) throw new Error('Render node unreachable');
      const element = hiddenResumeRef.current; if (!element) throw new Error('Target stream missing');
      const opt = { margin: 0, filename: `${resume.name}_blueprint.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
      toast.loading('Synthesizing PDF archive...', { id: 'pdf-gen' })
      await new Promise(r => setTimeout(r, 400))
      await html2pdf().set(opt).from(element).save()
      toast.success('Transmission Successful.', { id: 'pdf-gen' })
    } catch (err) { toast.error('Synthesis Error: ' + err.message, { id: 'pdf-gen' }) }
    finally { setDownloading(null) }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const updatedUser = await api.auth.updateProfile(editForm)
      // Force refresh of local user state if necessary, but api.updateProfile already updates localStorage
      // We might need a way to notify AuthContext, but for now we'll just show success
      toast.success('Identity Synchronized.')
      setShowEditModal(false)
      window.location.reload() // Simplest way to sync AuthContext for now
    } catch (err) {
      toast.error('Failed to update: ' + err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const handleLogout = () => { logout(); onBack(); toast('Session Terminated.', { icon: '🚫' }) }
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()

  return (
    <div className="min-h-screen bg-bg-deep noise-bg p-6 md:p-12 pt-32 selection:bg-accent-neon/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Orbital Navigation (Sidebar) */}
          <aside className="w-full lg:w-80 space-y-8 shrink-0">
            <div className="group relative glass-panel p-10 rounded-[3rem] text-center space-y-6 overflow-hidden border-white/5 transition-all hover:border-white/10">
              <div className="absolute inset-0 bg-gradient-to-b from-accent-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-accent-neon opacity-20 blur-xl animate-pulse"></div>
                <div className="relative w-full h-full rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="font-headline text-4xl text-white italic">{user?.email?.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="space-y-1 relative">
                <h3 className="font-headline text-xl text-white uppercase tracking-tight">{user?.email?.split('@')[0]}</h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-neon animate-ping" />
                  <span className="text-[8px] text-text-dim font-black uppercase tracking-[0.2em]">Live Session</span>
                </div>
              </div>
            </div>

            <nav className="glass-panel p-4 rounded-[2.5rem] space-y-3 relative overflow-hidden backdrop-blur-3xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent-neon/20"></div>
              {[
                { id: 'profile', label: 'Identity Profile', icon: <User size={16} />, desc: 'Primary core data' },
                { id: 'purchases', label: 'Protocol Keys', icon: <CreditCard size={16} />, desc: 'Acquired blueprints' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all group ${activeTab === tab.id ? 'bg-white text-bg-deep shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-[1.02]' : 'text-text-dim hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-bg-deep text-white' : 'bg-white/5 text-text-dim group-hover:text-white'}`}>
                      {tab.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest">{tab.label}</p>
                      <p className={`text-[8px] font-bold uppercase opacity-40 ${activeTab === tab.id ? 'text-bg-deep' : 'text-text-dim'}`}>{tab.desc}</p>
                    </div>
                  </div>
                  {activeTab === tab.id && <ChevronRight size={14} />}
                </button>
              ))}
              <div className="h-px bg-white/5 my-6 mx-4" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-5 rounded-2xl text-pink-500 hover:bg-pink-500/10 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <div className="p-2 rounded-lg bg-pink-500/10"><LogOut size={16} /></div>
                Terminate Protocol
              </button>
            </nav>
          </aside>

          {/* Command Surface (Main) */}
          <main className="flex-1 space-y-12">
            <div className="reveal-item">
              
              {activeTab === 'profile' && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between gap-4">
                     <div className="space-y-1">
                        <h2 className="font-headline text-5xl text-white uppercase tracking-tighter">Core Identity</h2>
                        <p className="text-[10px] text-text-dim font-black uppercase tracking-[0.3em]">Module: ID-01_PROFILE_SURFACE</p>
                     </div>
                     <button 
                       onClick={() => {
                         setEditForm({ name: user?.name || '', email: user?.email || '' });
                         setShowEditModal(true);
                       }}
                       className="px-6 h-12 rounded-xl bg-white/5 border border-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                     >
                       <span className="material-symbols-outlined text-sm">edit</span>
                       Edit Profile
                     </button>
                     <div className="w-16 h-px bg-white/10 hidden md:block" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-panel p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-10">
                          <ShieldCheck size={120} />
                       </div>
                       <div className="space-y-2 relative">
                         <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">Profile Name</label>
                         <p className="text-2xl text-white font-light tracking-tight">{user?.name || user?.email?.split('@')[0] || 'Unidentified User'}</p>
                       </div>
                       <div className="space-y-2 relative">
                         <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">Authentication Node</label>
                         <p className="text-md text-white/60 font-bold uppercase tracking-widest italic">{user?.email}</p>
                       </div>
                    </div>

                    <div className="glass-panel p-10 rounded-[3rem] space-y-8 border-accent-cyan/10">
                       <div className="flex items-center gap-4 text-accent-cyan">
                          <Activity size={24} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Encryption Standard: AES-256</span>
                       </div>
                       <div className="space-y-4">
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-accent-cyan animate-pulse" style={{ width: '100%' }} />
                          </div>
                          <p className="text-[9px] text-text-dim font-bold uppercase tracking-[0.2em] leading-relaxed">
                            Full clearance granted via global identifier. session integrity is maintained by orbital synchronization nodes.
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="glass-panel p-10 rounded-[3rem] bg-accent-neon/5 border-accent-neon/10 flex flex-col md:flex-row items-center gap-8 justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-accent-neon/20 flex items-center justify-center text-accent-neon">
                           <Zap size={32} />
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-white font-headline text-xl uppercase tracking-tight">Active Engine Access</h4>
                           <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest">V2.4 Generation Protocol Operational</p>
                        </div>
                     </div>
                     <button onClick={onBack} className="w-full md:w-auto h-14 px-10 bg-white text-bg-deep rounded-2xl font-headline font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95">Enter Laboratory</button>
                  </div>
                </div>
              )}

              {activeTab === 'purchases' && (
                <div className="space-y-10">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                     <div className="space-y-1">
                        <h2 className="font-headline text-5xl text-white uppercase tracking-tighter">Protocol Keys</h2>
                        <p className="text-[10px] text-text-dim font-black uppercase tracking-[0.3em]">Module: TRN-99_LOGS_VIEW</p>
                     </div>
                     <div className="flex items-center gap-3 px-6 h-12 bg-white/5 border border-white/5 rounded-2xl">
                        <span className="text-[9px] font-black text-text-dim uppercase tracking-widest">Total Acquisitions:</span>
                        <span className="text-md font-headline text-accent-neon">{purchases.length}</span>
                     </div>
                  </div>

                  {loadingPurchases ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4 glass-panel rounded-[3rem]">
                      <Loader2 className="animate-spin text-accent-neon" size={40} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-dim animate-pulse">Syncing Mission Logs...</span>
                    </div>
                  ) : purchases.length === 0 ? (
                    <div className="glass-panel p-24 rounded-[4rem] text-center space-y-10 border-dashed border-2 border-white/5">
                       <div className="w-24 h-24 mx-auto rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center">
                          <CreditCard size={40} className="text-text-dim/20" />
                       </div>
                       <div className="space-y-3">
                          <h4 className="font-headline text-2xl text-white uppercase italic tracking-tight">Vault Empty</h4>
                          <p className="text-[10px] text-text-dim font-bold uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">No high-fidelity blueprints have been authorized for this node yet.</p>
                       </div>
                       <button onClick={onBack} className="px-12 h-14 bg-accent-neon text-bg-deep rounded-2xl font-headline font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,163,0.3)]">Archive Blueprints</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {purchases.map((purchase) => {
                        const isResumePlan = purchase.planId?.includes('resume') || purchase.type === 'resume';
                        const matchingResume = resumes[0];
                        const currentTemplate = selectedTemplates[purchase.id] || matchingResume?.template || 'minimalist';
                        
                        return (
                          <div key={purchase.id} className="relative group overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-r from-accent-neon/10 to-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                             <div className="relative glass-panel p-10 rounded-[3rem] border-white/5 transition-all duration-500 hover:translate-x-2 flex flex-col xl:flex-row xl:items-center justify-between gap-12">
                                <div className="flex items-center gap-8">
                                   <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center transition-all duration-500 ${purchase.type === 'portfolio' ? 'border-accent-cyan/20 bg-accent-cyan/10 text-accent-cyan' : 'border-accent-neon/20 bg-accent-neon/10 text-accent-neon'}`}>
                                      {purchase.type === 'portfolio' ? <Globe size={32} /> : <FileText size={32} />}
                                   </div>
                                   <div className="space-y-2">
                                      <div className="flex items-center gap-3">
                                         <h4 className="text-white font-headline text-2xl uppercase tracking-tight">{purchase.planId?.split('-').join(' ')}</h4>
                                         <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                                      </div>
                                      <p className="text-[9px] text-text-dim font-black uppercase tracking-[0.2em]">Archived: {formatDate(purchase.purchasedAt)} • Key: {purchase.id.slice(0,12)}</p>
                                   </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-6">
                                   {isResumePlan && matchingResume && (
                                      <div className="flex items-center gap-4 w-full xl:w-auto">
                                         <div className="flex-1 space-y-2">
                                            <p className="text-[8px] font-black text-text-dim uppercase tracking-[0.3em] ml-1">Render Frequency</p>
                                            <select 
                                              className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-6 pr-10 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-accent-neon transition-all appearance-none cursor-pointer"
                                              value={currentTemplate}
                                              onChange={(e) => {
                                                setSelectedTemplates(prev => ({ ...prev, [purchase.id]: e.target.value }));
                                                toast(`Active Style: ${e.target.value.toUpperCase()}`, { icon: '📐' });
                                              }}
                                            >
                                              <optgroup label="Core Standards" className="bg-bg-deep text-text-dim">
                                                <option value="minimalist">Minimalist</option>
                                                <option value="developer">The Developer</option>
                                                <option value="executive">The Executive</option>
                                              </optgroup>
                                              {(purchase.planId?.includes('premium') || purchase.planId?.includes('portfolio')) && (
                                                <optgroup label="Elite Blueprints" className="bg-bg-deep text-text-dim">
                                                  <option value="creative">Creative Edge</option>
                                                  <option value="architect">Architectural</option>
                                                  <option value="codecraft">CodeCraft Engine</option>
                                                  <option value="innovator">Innovation Core</option>
                                                </optgroup>
                                              )}
                                            </select>
                                         </div>
                                         <button 
                                           onClick={(e) => handleDownloadPDF(matchingResume, e, purchase.id)}
                                           disabled={downloading?.resumeId === matchingResume.id}
                                           title="Export Archive"
                                           className="w-14 h-14 rounded-2xl bg-white text-bg-deep flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(255,255,255,0.1)] disabled:opacity-30 disabled:scale-100 self-end mb-[1px]"
                                         >
                                           {downloading?.resumeId === matchingResume.id ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                                         </button>
                                      </div>
                                   )}
                                   <div className="flex items-center gap-3 px-5 py-2.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded-2xl self-end xl:self-center">
                                      <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                                      <p className="text-[10px] font-black text-accent-cyan uppercase tracking-widest">Protocol Valid</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          </main>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 bg-bg-deep/80 backdrop-blur-xl reveal-item">
          <div className="glass-panel w-full max-w-lg rounded-[3rem] bg-white/5 border-white/5 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <div className="p-10 space-y-8">
              <div className="space-y-1">
                <h3 className="font-headline text-3xl text-white uppercase tracking-tight">Modify Identity</h3>
                <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest">Update your core profile parameters</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Core Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-bold text-white uppercase tracking-widest outline-none focus:border-accent-neon transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-dim uppercase tracking-widest ml-1">Primary Email</label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-bold text-white uppercase tracking-widest outline-none focus:border-accent-neon transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 h-14 rounded-2xl border border-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={savingProfile}
                    className="flex-1 h-14 bg-white text-bg-deep rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                  >
                    {savingProfile ? <Loader2 className="animate-spin" size={16} /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Logic Stream Hidden Surface */}
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none opacity-0">
        <div ref={hiddenResumeRef} style={{ width: '210mm', minHeight: '297mm', background: 'white' }}>
          {downloading && (resumes.length > 0) && (() => {
            const res = resumes.find(r => r.id === downloading.resumeId) || resumes[0]
            const templateId = downloading.template || res.template || 'minimalist'
            const config = TEMPLATES_INFO.find(t => t.id === templateId) || TEMPLATES_INFO[0]
            if (config.layout === 'modern') return <ModernResume data={res.data} colors={config.colors} />
            if (config.layout === 'creative') return <CreativeResume data={res.data} colors={config.colors} />
            return <MinimalResume data={res.data} colors={config.colors} />
          })()}
        </div>
      </div>
    </div>
  )
}
