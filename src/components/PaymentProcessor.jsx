import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function PaymentProcessor({ plan, onSuccess, onCancel }) {
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => { if (document.body.contains(script)) document.body.removeChild(script) }
  }, [])

  const handlePayment = async () => {
    if (!user) { toast.error('Shields active. Please authenticate.'); return; }
    setIsProcessing(true)
    try {
      const orderData = await api.request('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount: plan.price * 100, currency: plan.currency, planId: plan.id, planName: plan.name, userId: user.id, userEmail: user.email })
      })
      const options = {
        key: orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
        amount: plan.price * 100,
        currency: plan.currency,
        name: 'Launchfolio',
        description: plan.name,
        order_id: orderData.orderId,
        prefill: { email: user.email || '', name: user.name || 'User' },
        handler: async (response) => {
          try {
            const verifyData = await api.request('/payments/verify', {
              method: 'POST',
              body: JSON.stringify({ razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature, planId: plan.id, userId: user.id, amount: plan.price * 100 })
            })
            if (verifyData.success) onSuccess(plan)
            else throw new Error('Verification failure')
          } catch (error) { toast.error('Protocol Error: ' + error.message) }
          finally { setIsProcessing(false) }
        },
        modal: { ondismiss: () => { setIsProcessing(false); toast('Protocol session terminated.'); } },
        notes: { planType: plan.type, planTemplate: plan.template }
      }
      if (window.Razorpay) { const razorpay = new window.Razorpay(options); razorpay.open(); }
      else throw new Error('Gateway offline');
    } catch (error) { toast.error('Initiation failed: ' + error.message); setIsProcessing(false); }
  }

  return (
    <div className="glass-panel p-8 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-white/5">
      <div className="space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
           <h3 className="font-headline text-3xl text-white uppercase tracking-tight">Financial Protocol</h3>
           <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest">Authorized Transaction for <span className="text-white">{plan.name}</span></p>
        </div>

        {/* Amount Module */}
        <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex flex-col items-center gap-4">
           <div className="flex items-baseline gap-2">
             <span className="text-text-dim text-lg uppercase font-bold tracking-widest">₹</span>
             <span className="text-5xl font-headline text-white tracking-tighter">{plan.price}</span>
           </div>
           <div className="px-3 py-1 bg-accent-neon/10 border border-accent-neon/20 rounded-full">
             <span className="text-[8px] font-black text-accent-neon uppercase tracking-[0.2em]">Validated Architecture</span>
           </div>
        </div>

        {/* Spec List */}
        <div className="space-y-4">
          {[
            { label: 'Module Variant', value: plan.type },
            { label: 'Deployment State', value: 'Instant' },
            { label: 'Encryption Standard', value: 'SSL-256' }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center px-2">
              <span className="text-[9px] font-bold text-text-dim uppercase tracking-widest">{item.label}</span>
              <span className="text-[10px] font-bold text-white uppercase tracking-tight">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Security Badges */}
        <div className="flex justify-center gap-4 py-4 border-y border-white/5">
           <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300">
             <span className="material-symbols-outlined text-accent-cyan text-sm">shield</span>
             <span className="text-[8px] font-bold text-text-dim uppercase tracking-widest">PCI DSS</span>
           </div>
           <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300">
             <span className="material-symbols-outlined text-accent-neon text-sm">enhanced_encryption</span>
             <span className="text-[8px] font-bold text-text-dim uppercase tracking-widest">Secure Node</span>
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="group relative h-14 bg-white text-bg-deep rounded-2xl font-headline text-xs font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing Transaction...' : `Archive Blueprint (₹${plan.price})`}
            </span>
            <div className="absolute inset-0 bg-accent-neon translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms]"></div>
          </button>
          <button 
            onClick={onCancel}
            disabled={isProcessing}
            className="h-12 text-text-dim text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all disabled:opacity-20"
          >
            Terminate Protocol
          </button>
        </div>

        <div className="text-center">
            <p className="text-[8px] text-text-dim font-bold uppercase tracking-widest">Powered by Razorpay Global Intelligence Infrastructure</p>
        </div>

      </div>
    </div>
  )
}