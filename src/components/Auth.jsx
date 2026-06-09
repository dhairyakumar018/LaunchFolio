import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, Loader2, Star, Users, Check } from 'lucide-react'
import { api } from '../lib/api'
import toast from 'react-hot-toast'

// Custom SVGs for missing brand icons in legacy Lucide version
const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const GoogleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

export default function Auth({ onSuccess, onForgotPassword }) {
  const [loading, setLoading] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login', 'signup', 'forgot', 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const { login, signup } = useAuth()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (authMode === 'signup') {
        await signup(email, password)
        toast.success('Account created!')
      } else {
        await login(email, password)
        toast.success('Welcome back!')
      }
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.auth.forgotPassword(email)
      toast.success(res.message)
      if (res._dev_code) {
        console.log('RESET CODE:', res._dev_code)
        // Show fallback for developer email only to keep it secure
        if (email === 'gdhairya29@gmail.com') {
          toast(`RECOVERY CODE: ${res._dev_code}`, { icon: '🔑', duration: 10000 })
        }
      }
      setAuthMode('reset')
    } catch (error) {
      toast.error(error.message || 'Failed to initiate recovery')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.auth.resetPassword(email, resetCode, newPassword)
      toast.success('Master Key Reconstructed. You may now initialize session.')
      setAuthMode('login')
    } catch (error) {
      toast.error(error.message || 'Recovery failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-bg-deep noise-bg flex items-center justify-center p-6 overflow-hidden">
      {/* Background Orbits */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-pulse-slow [animation-delay:1s]"></div>
      </div>

      <div className="reveal-item w-full max-w-md relative z-10">
        <div className="glass-panel p-10 rounded-3xl space-y-10 shadow-2xl">
          <div className="space-y-2 text-center">
            <h2 className="font-headline text-5xl text-white tracking-tight">
              {authMode === 'signup' ? 'Create Identity' : 
               authMode === 'forgot' ? 'Recover Protocol' :
               authMode === 'reset' ? 'Reconstruct Key' : 'Resume Session'}
            </h2>
            <p className="text-gray-400 text-sm">
              {authMode === 'signup' ? 'Join the next generation of professionals.' : 
               authMode === 'forgot' ? 'Initialize identity verification sequence.' :
               authMode === 'reset' ? 'Enter verification code and new credentials.' : 'Securely access your career blueprints.'}
            </p>
          </div>

          {(authMode === 'login' || authMode === 'signup') && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => toast.error('GitHub authentication unavailable in dev.')} className="flex items-center justify-center gap-3 py-3 glass-panel rounded-xl hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest text-white">
                  <GithubIcon size={16} /> GitHub
                </button>
                <button onClick={() => toast.error('Google authentication unavailable in dev.')} className="flex items-center justify-center gap-3 py-3 glass-panel rounded-xl hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest text-white">
                  <GoogleIcon size={16} /> Google
                </button>
              </div>

              <div className="relative flex items-center justify-center py-4">
                <div className="absolute inset-0 flex items-center px-2"><div className="w-full border-t border-white/5"></div></div>
                <span className="relative px-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]" style={{ background: 'rgb(24, 23, 41)' }}>OR SECURELY VIA EMAIL</span>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">EMAIL ADDRESS</label>
                  <div className="relative flex items-center group">
                    <div className="absolute left-5 text-gray-500 group-focus-within:text-white transition-colors">
                      <Mail size={20} strokeWidth={1.5} />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl h-16 pl-14 pr-4 text-sm text-white focus:bg-white/[0.08] focus:border-white/20 outline-none transition-all placeholder:text-gray-600"
                      placeholder="arch@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">MASTER KEY</label>
                    <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] font-black text-accent-neon uppercase tracking-[0.1em] hover:underline transition-all">LOST?</button>
                  </div>
                  <div className="relative flex items-center group">
                    <div className="absolute left-5 text-gray-500 group-focus-within:text-white transition-colors">
                      <Lock size={20} strokeWidth={1.5} />
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl h-16 pl-14 pr-4 text-sm text-white focus:bg-white/[0.08] focus:border-white/20 outline-none transition-all placeholder:text-gray-600"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 bg-white text-[#0b0a1a] rounded-2xl font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)] flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (authMode === 'signup' ? 'Launch Account' : 'Initialize Session')}
                </button>
              </form>

              <div className="text-center">
                <p className="text-sm text-text-dim">
                  {authMode === 'signup' ? 'Already an architect? ' : 'New to the standard? '}
                  <button 
                    onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                    className="font-bold text-white hover:underline transition-all"
                  >
                    {authMode === 'signup' ? 'Resume Session' : 'Launch for free'}
                  </button>
                </p>
              </div>
            </>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">IDENTIFICATION EMAIL</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl h-16 px-6 text-sm text-white outline-none focus:border-accent-neon transition-all"
                    placeholder="ENTER REGISTERED EMAIL"
                    required
                  />
               </div>
               <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 bg-accent-neon text-bg-deep rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Request Reset Code'}
                </button>
                <button type="button" onClick={() => setAuthMode('login')} className="w-full text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Return to Login</button>
            </form>
          )}

          {authMode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-8">
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">VERIFICATION CODE</label>
                    <input 
                      type="text" 
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl h-16 px-6 text-xl text-center font-headline tracking-[1em] text-accent-neon outline-none focus:border-accent-neon transition-all"
                      placeholder="000000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">NEW MASTER KEY</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl h-16 px-6 text-sm text-white outline-none focus:border-accent-neon transition-all"
                      placeholder="ENTER NEW PASSWORD"
                      required
                    />
                  </div>
               </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 bg-white text-bg-deep rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Reconstruct Identity'}
                  </button>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="w-full text-[10px] font-black text-accent-neon uppercase tracking-widest hover:underline disabled:opacity-50"
                  >
                    Resend Verification Code
                  </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

