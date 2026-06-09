import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, ChevronLeft } from 'lucide-react'

export default function Navbar({ page, onPageChange, onBack, onStartNew }) {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-500 border-b border-white/5 bg-bg-deep/80 backdrop-blur-xl">
      <div className="max-w-screen-2xl mx-auto px-8 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          className="font-headline text-2xl font-bold tracking-tighter text-white cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
          onClick={() => onPageChange('landing')}
        >
          LAUNCHFOLIO
        </div>
        
        {/* Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {[
            { label: 'Blueprints', page: 'templates' },
            { label: 'Architect', page: 'ai-builder' },
            { label: 'Support', page: 'support' }
          ].map(link => (
            <button
              key={link.label}
              onClick={() => onPageChange(link.page)}
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-accent-neon ${page === link.page ? 'text-accent-neon' : 'text-text-dim'}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {page !== 'landing' && onBack && (
            <button 
              className="flex items-center gap-2 text-text-dim hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
              onClick={onBack}
            >
              <ChevronLeft size={14} /> Back
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <button 
                className={`flex items-center gap-3 px-5 py-2 rounded-full border transition-all ${page === 'account' ? 'bg-accent-neon text-white border-accent-neon' : 'bg-white/5 border-white/5 text-text-dim hover:bg-white/10 hover:text-white'}`}
                onClick={() => onPageChange('account')}
              >
                <User size={14} />
                <span className="hidden sm:inline font-headline text-[10px] font-bold uppercase tracking-widest">Dash</span>
              </button>
              
              <button 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-text-dim hover:text-pink-500 hover:bg-pink-500/10 transition-all"
                onClick={logout} 
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
             <button 
              className="group relative h-11 px-8 bg-white text-bg-deep rounded-full font-headline font-bold text-[10px] tracking-widest uppercase overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={() => onPageChange('auth')}
             >
              <span className="relative z-10">{page === 'auth' ? 'Initialize' : 'Assemble'}</span>
              <div className="absolute inset-0 bg-accent-neon translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
             </button>
          )}
        </div>
      </div>
    </nav>
  )
}
