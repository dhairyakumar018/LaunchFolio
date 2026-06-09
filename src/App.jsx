import { useState, useRef, useEffect } from 'react'
import { useRateLimit } from './hooks/useRateLimit'
import { useAuth } from './contexts/AuthContext'
import { usePurchases } from './hooks/usePurchases'
import { api } from './lib/api'
import { analytics } from './lib/analytics'
import LandingPage from './components/LandingPage'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import PortfolioView from './components/PortfolioView'
import PortfolioEditor from './components/PortfolioEditor'
import Auth from './components/Auth'
import Account from './components/Account'
import TemplateGallery from './components/TemplateGallery'
import AITemplateBuilder from './components/AITemplateBuilder'
import QuickTemplateSelector from './components/QuickTemplateSelector'
import PricingModal from './components/PricingModal'
import PaymentProcessor from './components/PaymentProcessor'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfService from './components/TermsOfService'
import Support from './components/Support'
import CookieBanner from './components/CookieBanner'
import toast from 'react-hot-toast'
import Navbar from './components/Navbar'

const defaultData = {
  name: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '',
  summary: '',
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
  template: 'modern',
}

export default function App() {
  const { user } = useAuth()
  const { hasAccess, addPurchase } = usePurchases()
  const [page, setPage] = useState('landing')
  const [resumeData, setResumeData] = useState(defaultData)
  const [customTemplates, setCustomTemplates] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('customTemplates') || '[]')
    } catch { return [] }
  })
  const [showPricing, setShowPricing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const { checkLimit, timeUntilReset } = useRateLimit('portfolio_view', 5)

  useEffect(() => {
    analytics.pageView(page)
  }, [page])

  useEffect(() => {
    if (user && page === 'auth') {
      setPage('landing')
    }
  }, [user, page])

  const handleSave = async (data) => {
    if (!user) {
      toast.error('Sign in to save your resume to the cloud')
      return false
    }
    
    try {
      await api.resumes.save({
        name: data.name || 'Untitled Resume',
        data: data,
        template: data.template || 'modern'
      })
      analytics.track('resume_saved', { template: data.template })
      toast.success('Resume saved to cloud!')
      return true
    } catch (err) {
      toast.error('Failed to save: ' + err.message)
      return false
    }
  }

  const handlePreview = (data) => {
    setResumeData(data)
    setPage('preview')
    if (user) {
      handleSave(data).catch(() => {})
    }
  }

  const handlePortfolioView = () => {
    if (checkLimit()) {
      setPage('portfolio')
    } else {
      const mins = Math.ceil(timeUntilReset / 60000)
      toast.error(`Limit reached! You can view your portfolio again in ${mins} minutes.`)
    }
  }

  const handleSelectTemplate = (templateId) => {
    setResumeData(prev => ({ ...prev, template: templateId }))
    handleSave({ ...resumeData, template: templateId })
    toast.success('Template updated!')
    setPage('form')
  }

  const handleCreateCustomTemplate = (templateConfig) => {
    setCustomTemplates(prev => {
      const updated = [...prev, templateConfig]
      try { localStorage.setItem('customTemplates', JSON.stringify(updated)) } catch {}
      return updated
    })
    setResumeData(prev => ({ ...prev, template: templateConfig.id }))
    handleSave({ ...resumeData, template: templateConfig.id })
    toast.success('Custom template saved!')
    setPage('form')
  }

  const handleQuickTemplateSelect = (templateId) => {
    if (templateId === 'creative' && !hasAccess('resume', 'creative')) {
      setSelectedPlan({
        id: 'premium-resume',
        name: 'Premium Resume',
        price: 30,
        currency: 'INR',
        type: 'resume',
        template: 'creative'
      })
      setShowPricing(true)
      return
    }

    setResumeData(prev => ({ ...prev, template: templateId }))
    handleSave({ ...resumeData, template: templateId })
    setPage('form')
  }

  const handleStartNew = () => {
    setResumeData(defaultData)
    setPage('template-select')
    analytics.track('resume_start_new')
  }

  const handleSelectResume = (resume) => {
    setResumeData(resume.data)
    setPage('form')
  }

  const handlePurchase = (plan) => {
    setSelectedPlan(plan)
    setShowPricing(false)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (plan) => {
    addPurchase({
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      currency: plan.currency,
      type: plan.type,
      template: plan.template
    })

    analytics.track('payment_success', { 
      plan: plan.id, 
      price: plan.price, 
      type: plan.type 
    })

    toast.success(`Successfully purchased ${plan.name}!`)

    if (plan.type === 'resume') {
      setResumeData(prev => ({ ...prev, template: plan.template }))
      setPage('form')
    } else if (plan.type === 'portfolio') {
      setPage('portfolio-edit')
    }

    setShowPayment(false)
    setSelectedPlan(null)
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setSelectedPlan(null)
  }

  const getBackAction = () => {
    if (page === 'template-select' || page === 'auth') return () => setPage('landing')
    if (page === 'form') return () => setPage('template-select')
    if (page === 'preview') return () => setPage('form')
    if (page === 'portfolio') return () => setPage('preview')
    if (page === 'templates') return () => setPage('landing')
    if (page === 'account') return () => setPage('landing')
    if (page === 'ai-builder') return () => setPage('templates')
    if (page === 'privacy' || page === 'terms' || page === 'support') return () => setPage('landing')
    return null
  }

  return (
    <div className={`app-container ${page === 'auth' ? '' : 'theme-v2'}`}>
      {(page !== 'auth' && page !== 'landing') && <Navbar page={page} onPageChange={setPage} onBack={getBackAction()} onStartNew={handleStartNew} />}
      <main style={{ paddingTop: (page === 'landing' || page === 'auth') ? '0px' : '80px' }}>
        {page === 'landing' && <LandingPage onStart={handleStartNew} onTemplates={() => setPage('templates')} onPageChange={setPage} />}
        {page === 'auth' && (user ? <LandingPage onStart={handleStartNew} onTemplates={() => setPage('templates')} onPageChange={setPage} /> : <Auth onSuccess={() => setPage('landing')} onForgotPassword={() => setPage('support')} />)}
        {page === 'template-select' && (
          <QuickTemplateSelector
            onSelectTemplate={handleQuickTemplateSelect}
            onSkip={() => setPage('form')}
          />
        )}
        {page === 'form' && (
          <ResumeForm
            data={resumeData}
            setData={setResumeData}
            onPreview={handlePreview}
            onBack={() => setPage('template-select')}
            onTemplates={() => setPage('templates')}
          />
        )}
        {page === 'preview' && (
          <ResumePreview
            data={resumeData}
            onEdit={() => setPage('form')}
            onPortfolio={handlePortfolioView}
            onBack={() => setPage('landing')}
            onChangeTemplate={() => setPage('template-select')}
          />
        )}
        {page === 'portfolio' && (
          <PortfolioView
            data={resumeData}
            onBack={() => setPage('preview')}
            onEdit={() => setPage('portfolio-edit')}
            onUpgrade={() => {
              setSelectedPlan({
                id: 'basic-portfolio',
                name: 'Basic Portfolio',
                price: 25,
                currency: 'INR',
                type: 'portfolio'
              })
              setShowPricing(true)
            }}
          />
        )}
        {page === 'portfolio-edit' && (
          <PortfolioEditor
            data={resumeData}
            onSave={(data) => {
              setResumeData(data)
              handleSave(data)
              setPage('portfolio')
              toast.success('Portfolio updated!')
            }}
            onBack={() => setPage('portfolio')}
          />
        )}
        {page === 'account' && (
          <Account 
            onBack={() => setPage('landing')} 
            onSelectResume={handleSelectResume}
          />
        )}
        {page === 'templates' && (
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            onCreateCustom={() => setPage('ai-builder')}
            selectedTemplate={resumeData.template}
            customTemplates={customTemplates}
            onDeleteCustomTemplate={(id) => {
              setCustomTemplates(prev => {
                const updated = prev.filter(t => t.id !== id)
                try { localStorage.setItem('customTemplates', JSON.stringify(updated)) } catch {}
                return updated
              })
              toast.success('Template removed.')
            }}
          />
        )}
        {page === 'ai-builder' && (
          <AITemplateBuilder
            onCreateTemplate={handleCreateCustomTemplate}
            onBack={() => setPage('templates')}
          />
        )}
        {page === 'privacy' && <PrivacyPolicy onBack={() => setPage('landing')} />}
        {page === 'terms' && <TermsOfService onBack={() => setPage('landing')} />}
        {page === 'support' && <Support onBack={() => setPage('landing')} />}
      </main>

      <CookieBanner />

      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onPurchase={handlePurchase}
      />

      {showPayment && selectedPlan && (
        <div className="fixed inset-0 z-[1002] flex items-center justify-center p-8 bg-bg-deep/80 backdrop-blur-xl">
           <div className="glass-panel w-full max-w-2xl rounded-[3rem] bg-white/5 border-white/5 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <PaymentProcessor
                plan={selectedPlan}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
           </div>
        </div>
      )}
    </div>
  )
}
