import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function PricingModal({ isOpen, onClose, onPurchase }) {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState(null)

  const plans = [
    { id: 'basic-resume', name: 'Core Resume', price: 10, type: 'resume', accent: 'bg-accent-cyan', features: ['Minimalist Template', 'High-Res PDF', 'Standard PNG', 'Global Portability'], label: 'Essential' },
    { id: 'premium-resume', name: 'Elite Resume', price: 30, type: 'resume', accent: 'bg-accent-neon', features: ['Creative Templates', 'Full Customization', 'Priority Render', 'Multiple Formats'], label: 'Popular' },
    { id: 'basic-portfolio', name: 'Identity Site', price: 25, type: 'portfolio', accent: 'bg-accent-cyan', features: ['Core Web Blueprint', 'Custom Sections', 'Mobile Optimized', 'Standard Support'], label: 'Startup' },
    { id: 'premium-portfolio', name: 'Master Engine', price: 50, type: 'portfolio', accent: 'bg-white', features: ['Advanced Architecture', 'AI Content Logic', 'Custom Domain Node', 'Analytics Hub'], label: 'Pro' }
  ]

  const handlePurchase = (plan) => {
    if (!user) { toast.error('Shields active. Please authenticate.'); return; }
    onPurchase(plan); onClose();
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg-deep/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div 
        className="w-full max-w-6xl glass-panel rounded-[3rem] overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Aspect: Branding */}
        <div className="w-full md:w-80 bg-white/5 p-12 flex flex-col justify-between border-r border-white/5">
          <div className="space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-accent-neon flex items-center justify-center">
               <span className="material-symbols-outlined text-bg-deep text-2xl font-bold">layers</span>
             </div>
             <h2 className="font-headline text-3xl text-white leading-tight uppercase tracking-tight">Acquire <br/>Blueprints</h2>
             <p className="text-xs text-text-dim leading-relaxed uppercase tracking-widest font-bold">Upgrade your professional architecture with elite-grade modules.</p>
          </div>
          <button onClick={onClose} className="hidden md:flex items-center gap-2 text-text-dim hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">close</span> Dismiss
          </button>
        </div>

        {/* Right Aspect: Pricing Grid */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[80vh] scrollbar-hide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plans.map((plan, idx) => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`group relative glass-panel p-8 rounded-[2rem] cursor-pointer transition-all duration-500 hover:border-white/20 ${selectedPlan === plan.id ? 'ring-2 ring-accent-neon border-transparent bg-white/10' : 'bg-transparent'}`}
              >
                {plan.label && (
                  <span className={`absolute top-6 right-8 text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-full ${plan.accent} text-bg-deep`}>
                    {plan.label}
                  </span>
                )}
                
                <div className="space-y-6">
                   <div className="space-y-1">
                     <h3 className="font-headline text-xl text-white uppercase tracking-tight">{plan.name}</h3>
                     <div className="flex items-baseline gap-1">
                       <span className="text-2xl font-bold text-white">₹{plan.price}</span>
                       <span className="text-[10px] text-text-dim uppercase font-bold tracking-widest">/ Node</span>
                     </div>
                   </div>

                   <ul className="space-y-3">
                     {plan.features.map((f, i) => (
                       <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-text-dim uppercase tracking-widest">
                         <div className={`w-1 h-1 rounded-full ${plan.accent}`} />
                         {f}
                       </li>
                     ))}
                   </ul>

                   <button 
                     onClick={(e) => { e.stopPropagation(); handlePurchase(plan); }}
                     className={`w-full h-12 rounded-xl font-headline text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${selectedPlan === plan.id ? 'bg-accent-neon text-bg-deep shadow-[0_0_30px_rgba(0,255,163,0.3)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
                   >
                     Initialize Module
                   </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center space-y-2">
             <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest">💳 SSL Encrypted Transaction Protocol • Global Node Access</p>
             <p className="text-[9px] text-text-dim/50 uppercase tracking-tight">Support: status@blueprint-engine.io</p>
          </div>
        </div>
      </div>
    </div>
  )
}