import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'

export function usePurchases() {
  const { user } = useAuth()
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadPurchases()
    } else {
      setPurchases([])
      setLoading(false)
    }
  }, [user])

  const loadPurchases = async () => {
    if (!user) return
    setLoading(true)
    try {
      const dbPurchases = await api.payments.getPurchases()
      setPurchases(dbPurchases || [])
      
      // Fallback: merge with local storage if some exist (for migration)
      const stored = JSON.parse(localStorage.getItem('userPurchases') || '[]')
      const local = stored.filter(p => p.userId === user.id)
      if (local.length > 0) {
        setPurchases(prev => {
          const combined = [...prev]
          local.forEach(lp => {
            if (!combined.some(cp => cp.planId === lp.planId)) {
              combined.push({ ...lp, status: 'active' })
            }
          })
          return combined
        })
      }
    } catch (error) {
      console.error('Error loading purchases:', error)
      // Check local storage only as fallback
      const stored = JSON.parse(localStorage.getItem('userPurchases') || '[]')
      setPurchases(stored.filter(p => p.userId === user?.id))
    } finally {
      setLoading(false)
    }
  }

  const hasAccess = (featureType, templateType = null) => {
    if (!user) return false

    // Premium admin account - all access unlocked
    if (user.email === 'gdhairya29@gmail.com' || user.email === 'gdhirya29' || user.username === 'gdhirya29' || user.username === 'gdhairya29') {
      return true
    }

    // Free features
    if (featureType === 'basic-resume' && templateType === 'minimalist') {
      return true
    }

    const BASIC_TEMPLATES = ['minimalist', 'developer', 'executive', 'corporate', 'polished'];

    // Check purchases
    return purchases.some(purchase => {
      if (purchase.status !== 'active' && purchase.status !== 'completed') return false

      if (featureType === 'resume') {
        // Premium and Portfolio plans get access to every resume template
        if (purchase.planId?.includes('premium') || purchase.planId?.includes('portfolio')) {
          return true;
        }
        
        // Basic Resume plan logic
        if (purchase.planId?.includes('resume') || purchase.type === 'resume') {
          if (!templateType) return true; // Checking general resume access
          if (BASIC_TEMPLATES.includes(templateType)) return true; // Allowed basic templates
          return false; // Deny access to premium templates for basic plan
        }
        
        return false;
      }

      if (featureType === 'portfolio') {
        return purchase.planId?.includes('portfolio') || purchase.type === 'portfolio'
      }

      return false;
    })
  }

  const getPurchasedTemplates = (type) => {
    return purchases
      .filter(purchase => purchase.type === type && purchase.status === 'active')
      .map(purchase => purchase.template)
  }

  const addPurchase = (purchaseData) => {
    const newPurchase = {
      id: Date.now().toString(),
      userId: user?.id,
      ...purchaseData,
      purchasedAt: new Date().toISOString(),
      status: 'active'
    }

    const allPurchases = JSON.parse(localStorage.getItem('userPurchases') || '[]')
    allPurchases.push(newPurchase)
    localStorage.setItem('userPurchases', JSON.stringify(allPurchases))

    setPurchases(prev => [...prev, newPurchase])
    return newPurchase
  }

  return {
    purchases,
    loading,
    hasAccess,
    getPurchasedTemplates,
    addPurchase,
    refreshPurchases: loadPurchases
  }
}