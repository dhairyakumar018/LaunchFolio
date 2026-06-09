import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePurchases } from '../hooks/usePurchases'
import PricingModal from './PricingModal'
import PaymentProcessor from './PaymentProcessor'
import toast from 'react-hot-toast'

function ModernResume({ data, colors }) {
  const [c1, c2, c3] = colors || ['#1e1b4b', '#312e81', '#4f46e5'];
  const headerBg = `linear-gradient(135deg, ${c1}, ${c2})`;

  return (
    <div className="resume-modern">
      <div className="resume-header" style={{ background: headerBg }}>
        <div className="resume-name">{data.name || 'Your Name'}</div>
        <div className="resume-title">{data.title || 'Professional Title'}</div>
        <div className="resume-contact">
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>📞 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.linkedin && <span>🔗 {data.linkedin}</span>}
          {data.github && <span>💻 {data.github}</span>}
        </div>
      </div>
      <div className="resume-body">
        {/* Sidebar */}
        <div className="resume-sidebar">
          {data.skills.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div className="resume-section-title" style={{ color: c3, borderColor: c3 }}>Skills</div>
              {data.skills.map((s, i) => (
                <div key={i} className="skill-bar">
                  <div className="skill-bar-label"><span>{s}</span></div>
                  <div className="skill-bar-track">
                    <div className="skill-bar-fill" style={{ width: `${70 + (i % 3) * 10}%`, background: `linear-gradient(90deg, ${c2}, ${c3})` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {(data.certifications || []).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div className="resume-section-title" style={{ color: c3, borderColor: c3 }}>Certifications</div>
              {data.certifications.map((c, i) => (
                <div key={i} style={{ fontSize: '0.8rem', color: '#374151', marginBottom: '6px', display: 'flex', gap: '6px' }}>
                  <span style={{ color: c3 }}>▸</span> {c}
                </div>
              ))}
            </div>
          )}
          {(data.achievements || []).length > 0 && (
            <div>
              <div className="resume-section-title" style={{ color: c3, borderColor: c3 }}>Achievements</div>
              {data.achievements.map((a, i) => (
                <div key={i} style={{ fontSize: '0.8rem', color: '#374151', marginBottom: '6px', display: 'flex', gap: '6px' }}>
                  <span>🏆</span> {a}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main */}
        <div className="resume-main">
          {data.summary && (
            <div style={{ marginBottom: '24px' }}>
              <div className="resume-section-title" style={{ color: c3, borderColor: c3 }}>Summary</div>
              <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.7 }}>{data.summary}</p>
            </div>
          )}

          {(data.experience || []).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div className="resume-section-title" style={{ color: c3, borderColor: c3 }}>Experience</div>
              {data.experience.map((exp, i) => (
                <div key={i} className="resume-entry">
                  <div className="resume-entry-title">{exp.role || 'Role'}</div>
                  <div className="resume-entry-subtitle">{exp.company} {exp.start && `• ${exp.start} – ${exp.end || 'Present'}`}</div>
                  {exp.description && <div className="resume-entry-desc" style={{ whiteSpace: 'pre-line' }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          )}

          {(data.education || []).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div className="resume-section-title" style={{ color: c3, borderColor: c3 }}>Education</div>
              {data.education.map((edu, i) => (
                <div key={i} className="resume-entry">
                  <div className="resume-entry-title">{edu.degree || 'Degree'}</div>
                  <div className="resume-entry-subtitle">{edu.institution} {edu.start && `• ${edu.start} – ${edu.end || 'Present'}`}</div>
                  {edu.gpa && <div className="resume-entry-desc">{edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {(data.projects || []).length > 0 && (
            <div>
              <div className="resume-section-title" style={{ color: c3, borderColor: c3 }}>Projects</div>
              {data.projects.map((proj, i) => (
                <div key={i} className="resume-entry">
                  <div className="resume-entry-title">{proj.name || 'Project Name'}</div>
                  {proj.tech && (
                    <div style={{ marginBottom: '4px' }}>
                      {proj.tech.split(',').map(t => <span key={t} className="resume-tag" style={{ background: `${c3}20`, color: c1 }}>{t.trim()}</span>)}
                    </div>
                  )}
                  {proj.description && <div className="resume-entry-desc">{proj.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MinimalResume({ data, colors }) {
  const [c1, c2, c3] = colors || ['#111', '#555', '#222'];
  
  return (
    <div className="resume-minimal">
      <div className="resume-header" style={{ borderBottomColor: c2 }}>
        <div className="resume-name" style={{ color: c1 }}>{data.name || 'Your Name'}</div>
        <div className="resume-title">{data.title}</div>
        <div className="resume-contact">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </div>

      {data.summary && (
        <>
          <div className="resume-section-title" style={{ color: c1, borderBottomColor: '#eee' }}>Profile</div>
          <p style={{ fontSize: '0.85rem', color: '#444', lineHeight: 1.7, marginBottom: '8px' }}>{data.summary}</p>
        </>
      )}

      {(data.experience || []).length > 0 && (
        <>
          <div className="resume-section-title" style={{ color: c1, borderBottomColor: '#eee' }}>Work Experience</div>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <strong style={{ fontSize: '0.9rem', color: c3 }}>{exp.role}</strong>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>{exp.start} – {exp.end || 'Present'}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '6px' }}>{exp.company}</div>
              {exp.description && <div style={{ fontSize: '0.8rem', color: '#444', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{exp.description}</div>}
            </div>
          ))}
        </>
      )}

      {(data.education || []).length > 0 && (
        <>
          <div className="resume-section-title" style={{ color: c1, borderBottomColor: '#eee' }}>Education</div>
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '0.9rem', color: c3 }}>{edu.degree}</strong>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>{edu.start} – {edu.end || 'Present'}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#555' }}>{edu.institution} {edu.gpa && `| ${edu.gpa}`}</div>
            </div>
          ))}
        </>
      )}

      {data.skills.length > 0 && (
        <>
          <div className="resume-section-title" style={{ color: c1, borderBottomColor: '#eee' }}>Skills</div>
          <p style={{ fontSize: '0.85rem', color: '#444' }}>{data.skills.join(' • ')}</p>
        </>
      )}

      {(data.projects || []).length > 0 && (
        <>
          <div className="resume-section-title" style={{ color: c1, borderBottomColor: '#eee' }}>Projects</div>
          {data.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <strong style={{ fontSize: '0.88rem', color: c3 }}>{proj.name}</strong>
              {proj.tech && <span style={{ fontSize: '0.8rem', color: '#666' }}> — {proj.tech}</span>}
              {proj.description && <p style={{ fontSize: '0.8rem', color: '#444', marginTop: '4px', lineHeight: 1.6 }}>{proj.description}</p>}
            </div>
          ))}
        </>
      )}

      {((data.certifications || []).length > 0 || (data.achievements || []).length > 0) && (
        <>
          <div className="resume-section-title" style={{ color: c1, borderBottomColor: '#eee' }}>Certifications & Awards</div>
          <p style={{ fontSize: '0.85rem', color: '#444' }}>
            {[...(data.certifications || []), ...(data.achievements || [])].join(' • ')}
          </p>
        </>
      )}
    </div>
  )
}

function CreativeResume({ data, colors }) {
  const [c1, c2, c3] = colors || ['#0f172a', '#1e1b4b', '#6366f1'];
  const headerBg = `linear-gradient(135deg, ${c1}, ${c2})`;
  const initials = data.name ? data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AI'
  
  return (
    <div className="resume-creative">
      <div className="resume-header" style={{ background: headerBg }}>
        <div className="avatar-circle" style={{ background: `linear-gradient(135deg, ${c3}, ${c2})` }}>{initials}</div>
        <div>
          <div className="resume-name">{data.name || 'Your Name'}</div>
          <div className="resume-title">{data.title || 'Professional Title'}</div>
          <div className="resume-contact">
            {data.email && <span>✉ {data.email}</span>}
            {data.phone && <span>📞 {data.phone}</span>}
            {data.location && <span>📍 {data.location}</span>}
            {data.github && <span>💻 {data.github}</span>}
          </div>
        </div>
      </div>
      <div className="resume-body">
        {/* sidebar */}
        <div className="resume-sidebar" style={{ background: c2 }}>
          {data.skills.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div className="resume-section-title" style={{ color: c3 }}>Skills</div>
              {data.skills.map((s, i) => (
                <div key={i} className="skill-bar">
                  <div className="skill-bar-label"><span>{s}</span></div>
                  <div className="skill-bar-track">
                    <div className="skill-bar-fill" style={{ width: `${65 + (i % 4) * 8}%`, background: c3 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {(data.education || []).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div className="resume-section-title" style={{ color: c3 }}>Education</div>
              {data.education.map((edu, i) => (
                <div key={i} className="resume-entry">
                  <div className="resume-entry-title">{edu.degree}</div>
                  <div className="resume-entry-subtitle">{edu.institution}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{edu.start} – {edu.end || 'Present'}</div>
                </div>
              ))}
            </div>
          )}

          {(data.certifications || []).length > 0 && (
            <div>
              <div className="resume-section-title" style={{ color: c3 }}>Certifications</div>
              {data.certifications.map((c, i) => (
                <div key={i} style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>▸ {c}</div>
              ))}
            </div>
          )}
        </div>

        {/* main */}
        <div className="resume-main">
          {data.summary && (
            <div style={{ marginBottom: '24px' }}>
              <div className="resume-section-title" style={{ color: c3 }}>About Me</div>
              <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.7 }}>{data.summary}</p>
            </div>
          )}

          {(data.experience || []).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div className="resume-section-title" style={{ color: c3 }}>Experience</div>
              {data.experience.map((exp, i) => (
                <div key={i} className="resume-entry">
                  <div className="resume-entry-title">{exp.role}</div>
                  <div style={{ fontSize: '0.8rem', color: c3, fontWeight: 600, marginBottom: '2px' }}>{exp.company}</div>
                  <div className="resume-entry-subtitle">{exp.start} – {exp.end || 'Present'}</div>
                  {exp.description && <div className="resume-entry-desc" style={{ whiteSpace: 'pre-line' }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          )}

          {(data.projects || []).length > 0 && (
            <div>
              <div className="resume-section-title" style={{ color: c3 }}>Projects</div>
              {data.projects.map((proj, i) => (
                <div key={i} className="resume-entry">
                  <div className="resume-entry-title">{proj.name}</div>
                  {proj.tech && (
                    <div style={{ marginBottom: '4px' }}>
                      {proj.tech.split(',').map(t => <span key={t} className="resume-tag" style={{ background: `${c3}20`, color: c3 }}>{t.trim()}</span>)}
                    </div>
                  )}
                  {proj.description && <div className="resume-entry-desc">{proj.description}</div>}
                </div>
              ))}
            </div>
          )}

          {(data.achievements || []).length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <div className="resume-section-title" style={{ color: c3 }}>Achievements</div>
              {data.achievements.map((a, i) => (
                <div key={i} style={{ fontSize: '0.82rem', color: '#374151', marginBottom: '4px' }}>🏆 {a}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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

export default function ResumePreview({ data, onEdit, onPortfolio, onBack, onChangeTemplate }) {
  const matchedTemplate = TEMPLATES_INFO.find(t => t.id === data.template) ? data.template : 'developer';
  const [activeTemplate, setActiveTemplate] = useState(matchedTemplate)
  const [downloading, setDownloading] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const resumeRef = useRef(null)
  const { user } = useAuth()
  const { hasAccess, addPurchase } = usePurchases()

  const handleDownload = async () => {
    if (!user) { toast.error('Shields active. Please authenticate to download.'); return; }
    if (!hasAccess('basic-resume') && !hasAccess('premium-resume')) {
      setSelectedPlan({ id: 'premium-resume', name: 'Elite Resume', price: 30, currency: 'INR', type: 'resume', template: activeTemplate });
      setShowPricing(true);
      return;
    }
    if (downloading) return;
    setDownloading(true);
    try {
      const original = resumeRef.current;
      if (!original) return;
      const html2canvas = window.html2canvas;
      if (!html2canvas) throw new Error('Render engine offline');
      const clone = original.cloneNode(true);
      Object.assign(clone.style, { position: 'absolute', left: '-9999px', top: '0', width: '794px', background: '#ffffff', color: '#000' });
      document.body.appendChild(clone);
      await new Promise(r => setTimeout(r, 500));
      const canvas = await html2canvas(clone, { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: 794 });
      const link = document.createElement('a');
      link.download = `${data.name || 'arch'}_blueprint.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      document.body.removeChild(clone);
      toast.success('Blueprint archived successfully.');
    } catch (err) {
      toast.error("Extraction failed: " + err.message);
    } finally {
      setDownloading(false);
    }
  }

  const handleDownloadPDF = async () => {
    if (!user) { toast.error('Shields active. Authenticate for PDF export.'); return; }
    if (!hasAccess('basic-resume') && !hasAccess('premium-resume')) {
      setSelectedPlan({ id: 'premium-resume', name: 'Elite Resume', price: 30, currency: 'INR', type: 'resume', template: activeTemplate });
      setShowPricing(true);
      return;
    }
    if (downloading) return;
    setDownloading(true);
    try {
      const element = resumeRef.current;
      if (!element) return;
      const html2pdf = window.html2pdf;
      if (!html2pdf) throw new Error('PDF Engine offline');
      const opt = { margin: 0, filename: `${data.name || 'arch'}_blueprint.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
      await html2pdf().set(opt).from(element).save();
      toast.success('PDF Transmission complete.');
    } catch (err) {
      toast.error('PDF Export Error: ' + err.message);
    } finally {
      setDownloading(false);
    }
  }

  const handlePurchase = (plan) => { setSelectedPlan(plan); setShowPricing(false); setShowPayment(true); }
  const handlePaymentSuccess = (plan) => {
    addPurchase({ planId: plan.id, planName: plan.name, price: plan.price, currency: plan.currency, type: plan.type, template: plan.template });
    toast.success(`Access granted: ${plan.name}`);
    setShowPayment(false); setSelectedPlan(null);
  }

  const renderResume = () => {
    const config = TEMPLATES_INFO.find(t => t.id === activeTemplate) || TEMPLATES_INFO[1];
    switch (config.layout) {
      case 'modern': return <ModernResume data={data} colors={config.colors} />
      case 'minimal': return <MinimalResume data={data} colors={config.colors} />
      case 'creative': return <CreativeResume data={data} colors={config.colors} />
      default: return <ModernResume data={data} colors={config.colors} />
    }
  }

  return (
    <div className="min-h-screen bg-bg-deep noise-bg p-8 pt-32">
      <div className="max-w-screen-2xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="font-headline text-5xl text-white tracking-tight reveal-item">
            Your <span className="text-accent-neon">Resume Preview</span>
          </h1>
          <p className="text-text-dim text-sm reveal-item [animation-delay:100ms]">
            Switch templates below • Download your Resume Image when ready
          </p>
        </div>

        {/* Template Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide reveal-item delay-100">
          {TEMPLATES_INFO.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTemplate(t.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-110 active:scale-95 ${
                activeTemplate === t.id
                  ? 'bg-accent-neon text-bg-deep shadow-[0_0_15px_rgba(192,193,255,0.4)]'
                  : 'bg-white/5 border border-white/10 text-text-dim hover:text-white hover:bg-white/10'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-4 reveal-item delay-200">
          <button 
            onClick={onEdit}
            className="h-11 px-6 bg-white/5 border border-white/10 text-white rounded-full text-sm font-semibold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            ✏️ Edit Resume
          </button>
          <button 
            onClick={onPortfolio}
            className="h-11 px-6 bg-white/5 border border-white/10 text-white rounded-full text-sm font-semibold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            🌐 View Portfolio
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="h-11 px-6 bg-white text-bg-deep rounded-full text-sm font-bold hover:bg-accent-neon hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            📄 {downloading ? 'Processing...' : 'Download PDF'}
          </button>
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="h-11 px-6 bg-accent-neon/20 border border-accent-neon/30 text-accent-neon rounded-full text-sm font-bold hover:bg-accent-neon/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            🖼️ {downloading ? 'Processing...' : 'Download PNG'}
          </button>
        </div>

        {/* Resume Surface */}
        <div className="relative flex justify-center reveal-item delay-300 py-8">
          {/* Security Badge */}
          <div className="absolute top-12 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full backdrop-blur-md pointer-events-none reveal-item delay-500">
            <span className="text-red-400 text-xs">🔒</span>
            <span className="text-[10px] font-semibold text-red-400">Protected - Screenshots Disabled</span>
          </div>

          <div 
            ref={resumeRef} 
            className="w-full max-w-[800px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden ring-1 ring-white/10 animate-float"
          >
            {renderResume()}
          </div>
        </div>

      </div>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} onPurchase={handlePurchase} />
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 bg-bg-deep/90 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="w-full max-w-xl">
            <PaymentProcessor plan={selectedPlan} onSuccess={handlePaymentSuccess} onCancel={handlePaymentCancel} />
          </div>
        </div>
      )}
    </div>
  )
}
