import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

/**
 * A simple rate limiting hook using localStorage
 * @param {string} key - Unique key for the action (e.g., 'ai_suggestions')
 * @param {number} limit - Max number of actions allowed
 * @param {number} windowMs - Time window in milliseconds (default 1 hour)
 */
export function useRateLimit(key, limit, windowMs = 3600000) {
  const { user } = useAuth()
  const [usage, setUsage] = useState(() => {
    try {
      const stored = localStorage.getItem(`ratelimit_${key}`)
      if (!stored) return { count: 0, firstActionAt: Date.now() }
      
      const parsed = JSON.parse(stored)
      const now = Date.now()
      
      // If window has passed, reset
      if (now - parsed.firstActionAt > windowMs) {
        return { count: 0, firstActionAt: now }
      }
      
      return parsed
    } catch (e) {
      return { count: 0, firstActionAt: Date.now() }
    }
  })

  useEffect(() => {
    localStorage.setItem(`ratelimit_${key}`, JSON.stringify(usage))
  }, [usage, key])

  const checkLimit = () => {
    // Premium admin account - no rate limits
    if (user && (user.email === 'gdhairya29@gmail.com' || user.email === 'gdhirya29' || user.username === 'gdhirya29' || user.username === 'gdhairya29')) {
      return true
    }

    const now = Date.now()
    if (now - usage.firstActionAt > windowMs) {
      // Window expired, reset and allow
      setUsage({ count: 1, firstActionAt: now })
      return true
    }
    
    if (usage.count >= limit) {
      return false
    }
    
    setUsage(prev => ({ ...prev, count: prev.count + 1 }))
    return true
  }

  const resetUsage = () => {
    setUsage({ count: 0, firstActionAt: Date.now() })
  }

  const remaining = Math.max(0, limit - usage.count)
  const timeUntilReset = Math.max(0, windowMs - (Date.now() - usage.firstActionAt))

  return {
    count: usage.count,
    remaining,
    isLimited: usage.count >= limit,
    checkLimit,
    resetUsage,
    timeUntilReset
  }
}
