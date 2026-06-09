import { useState } from 'react'
import toast from 'react-hot-toast'

export default function PortfolioAIAssistant({ onSuggestion, data }) {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const aiPrompts = [
    "Write a compelling about section",
    "Suggest skills to add",
    "Improve project descriptions",
    "Create achievement highlights",
    "Write professional summary"
  ]

  const handleAIPrompt = async (promptText) => {
    setLoading(true)
    try {
      const response = await simulateAIResponse(promptText, data)
      setSuggestions(prev => [...prev, { prompt: promptText, response }])
      toast.success('Inference complete.');
    } catch (error) {
      toast.error('Synthesis error.');
    } finally {
      setLoading(false)
    }
  }

  const handleCustomPrompt = async () => {
    if (!prompt.trim()) return
    await handleAIPrompt(prompt)
    setPrompt('')
  }

  const applySuggestion = (suggestion) => {
    onSuggestion(suggestion)
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Intelligence Hub */}
      <button
        className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-bg-deep border border-accent-neon/30 flex items-center justify-center z-[1001] shadow-[0_0_40px_rgba(0,255,163,0.2)] group transition-all duration-500 hover:scale-110 active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Logic Hub"
      >
        <div className="absolute inset-0 rounded-full border border-accent-neon/50 animate-spin-slow group-hover:animate-spin-fast overflow-hidden">
           <div className="w-full h-full bg-gradient-to-tr from-accent-neon/20 to-transparent" />
        </div>
        <span className="material-symbols-outlined text-accent-neon text-2xl relative z-10">generating_tokens</span>
      </button>

      {/* Intelligence Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-8 animate-in fade-in duration-500">
           <div className="absolute inset-0 bg-bg-deep/90 backdrop-blur-2xl" onClick={() => setIsOpen(false)} />
           
           <div className="glass-panel w-full max-w-2xl rounded-[3.5rem] bg-white/5 border-white/5 relative z-10 overflow-hidden flex flex-col max-h-[80vh] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              
              {/* Header Interface */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-accent-neon/10 flex items-center justify-center">
                       <span className="material-symbols-outlined text-accent-neon text-xl animate-pulse">neurology</span>
                    </div>
                    <div className="space-y-0.5">
                       <h3 className="font-headline text-xl text-white uppercase italic tracking-tight">Logic <span className="text-accent-neon">Synthesis</span></h3>
                       <p className="text-[8px] text-text-dim font-black uppercase tracking-[0.3em]">AI Protocol v4.0 • Real-time Inference</p>
                    </div>
                 </div>
                 <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-text-dim hover:text-white transition-all">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              {/* Data Stream Body */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                 
                 {/* Inference Nodes */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <span className="text-[9px] font-black text-accent-neon uppercase tracking-widest">Inference Nodes</span>
                       <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {aiPrompts.map((promptText, index) => (
                         <button
                           key={index}
                           className="h-12 px-5 rounded-xl border border-white/5 bg-white/2 text-[10px] font-black text-white/50 uppercase tracking-widest text-left hover:border-accent-neon/30 hover:bg-white/5 hover:text-white transition-all group disabled:opacity-30"
                           onClick={() => handleAIPrompt(promptText)}
                           disabled={loading}
                         >
                           <span className="text-accent-neon/40 mr-2 group-hover:text-accent-neon">&gt;</span> {promptText}
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Terminal Interface */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <span className="text-[9px] font-black text-accent-cyan uppercase tracking-widest">Terminal Input</span>
                       <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="relative group">
                       <textarea
                         value={prompt}
                         onChange={(e) => setPrompt(e.target.value)}
                         className="w-full h-24 bg-bg-deep border border-white/10 rounded-2xl p-6 text-[11px] font-bold text-white uppercase tracking-widest outline-none focus:border-accent-cyan/30 focus:shadow-[0_0_30px_rgba(34,211,238,0.05)] transition-all placeholder:text-white/10 resize-none italic"
                         placeholder="Type a custom synthesis request..."
                       />
                       <button
                         onClick={handleCustomPrompt}
                         disabled={loading || !prompt.trim()}
                         className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-accent-cyan flex items-center justify-center text-bg-deep hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                       >
                         <span className="material-symbols-outlined text-xl">{loading ? 'sync' : 'cycle'}</span>
                       </button>
                    </div>
                 </div>

                 {/* Processing Stream */}
                 {suggestions.length > 0 && (
                   <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                      <div className="flex items-center gap-4">
                         <span className="text-[9px] font-black text-white uppercase tracking-widest">Synthesis Output</span>
                         <div className="h-px flex-1 bg-white/5" />
                      </div>
                      <div className="space-y-6">
                        {suggestions.map((suggestion, index) => (
                           <div key={index} className="glass-panel p-8 rounded-[2.5rem] bg-white/2 border-white/5 space-y-6">
                              <div className="flex items-center justify-between">
                                 <span className="text-[9px] font-black text-accent-neon uppercase tracking-widest bg-accent-neon/10 px-3 py-1 rounded-lg italic">Inference Output</span>
                                 <span className="text-[8px] font-black text-white/20 uppercase">Node ID: {index}A</span>
                              </div>
                              <p className="text-[11px] font-bold text-text-dim italic leading-relaxed uppercase tracking-widest">{suggestion.response}</p>
                              <button
                                onClick={() => applySuggestion(suggestion)}
                                className="group relative h-10 px-8 bg-white text-bg-deep rounded-xl font-headline text-[9px] font-black uppercase tracking-widest overflow-hidden transition-all"
                              >
                                 <span className="relative z-10">Inject into Node</span>
                                 <div className="absolute inset-0 bg-accent-neon translate-y-full group-hover:translate-y-0 transition-transform duration-[400ms]"></div>
                              </button>
                           </div>
                        ))}
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </>
  )
}

async function simulateAIResponse(prompt, data) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const responses = {
    "Write a compelling about section": `Passionate ${data.title || 'ARCHITECT'} focusing on strategic synthesis. specializing in domain execution and high-fidelity output.`,
    "Suggest skills to add": `ARCHITECTURAL_STRENGTHS:\n\n• STRATEGIC_ANALYSIS\n• SYSTEM_OPTIMIZATION\n• DOMAIN_MASTERY\n• DEPLOYMENT_PROTOCOLS`,
    "Improve project descriptions": `TRANSFORMED_NODE:\n\nEngineered a high-performance architectural module utilizing modern synthesis protocols. optimized system throughput by 40% while maintaining absolute logic integrity.`,
    "Create achievement highlights": `• DEPLOYED_CORE_NODE_V2\n• OPTIMIZED_SYSTEM_THROUGHPUT\n• SECURED_DOMAIN_AUTHORITY`,
    "Write professional summary": `Dynamic architect with a focuses on high-fidelity industrial execution. proven track record in deploying critical logic nodes and optimizing system performance.`
  };
  return responses[prompt] || `AI_RESPONSE: ${prompt} handled successfully. Data integrity verified.`;
}