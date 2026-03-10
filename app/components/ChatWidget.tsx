'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Volume2, Loader2, Sparkles, X, MicOff, FileText, RefreshCw, Mail, ChevronDown, ChevronUp } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
   1. DESIGN TOKENS & CONSTANTS
   ───────────────────────────────────────────────────────────────────────────── */
const COLORS = {
  gold: '#efc07b',
  goldDark: '#c9a96e',
  bg: '#050510',
  surface: '#0c0c1a',
  textPrimary: '#f0ede8',
  textMuted: '#7a7a8e',
  listening: '#8b7cf8',
  speaking: '#efc07b',
  thinking: '#c9a96e',
}

const LABELS = {
  tapToTalk: 'Trykk for å snakke',
  connecting: 'Kobler til...',
  connected: 'Klar til å lytte',
  speaking: 'Eirik svarer...',
  thinking: 'Eirik tenker...',
  listening: 'Lytter...',
  error: 'Noe gikk galt — prøv igjen',
} as const

type StatusKey = keyof typeof LABELS | ''

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number };
}

interface ChatMessage {
  role: string;
  text: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. MAIN COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */
export default function ChatWidget() {
  const publicKey = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY : null
  const assistantId = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID : null

  // --- UI State ---
  const [open, setOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  
  // --- Vapi & Call State ---
  const [isCallActive, setIsCallActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [statusKey, setStatusKey] = useState<StatusKey>('')
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [duration, setDuration] = useState(0)
  
  // --- Transcripts & History ---
  const [userTranscript, setUserTranscript] = useState('')
  const [assistantTranscript, setAssistantTranscript] = useState('')
  const [history, setHistory] = useState<ChatMessage[]>([])
  
  // --- Gemini LLM State ---
  const [postCallView, setPostCallView] = useState<'menu' | 'summary' | 'email'>('menu')
  const [summary, setSummary] = useState<string | null>(null)
  const [emailDraft, setEmailDraft] = useState<string | null>(null)
  const [isGeneratingLLM, setIsGeneratingLLM] = useState(false)

  // --- Visuals ---
  const [particles, setParticles] = useState<Particle[]>([])
  const [waveformData, setWaveformData] = useState<number[]>(Array(24).fill(0))
  
  const vapiRef = useRef<any>(null)
  const animationRef = useRef<number>()
  const durationTimerRef = useRef<NodeJS.Timeout>()
  const lastScrollY = useRef(0)

  /* ─── Auto-Minimize on Scroll ─── */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // If we scroll down while call is active and widget is open/expanded, minimize it
      if (currentScrollY > lastScrollY.current + 20 && open && isCallActive && !isMinimized) {
        setIsMinimized(true);
      }
      lastScrollY.current = currentScrollY;
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [open, isCallActive, isMinimized]);

  /* ─── Expand automatically when call ends to show summary ─── */
  useEffect(() => {
    if (!isCallActive && isMinimized && history.length > 0) {
      setIsMinimized(false);
    }
  }, [isCallActive, isMinimized, history.length]);

  /* ─── Initialize Ambient Particles ─── */
  useEffect(() => {
    if (!open || isMinimized) return; // Don't run particles when minimized
    
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 25; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 340,
          y: Math.random() * 500,
          size: Math.random() * 2.5 + 1,
          opacity: Math.random() * 0.4 + 0.1,
          velocity: {
            x: (Math.random() - 0.5) * 0.4,
            y: (Math.random() - 0.5) * 0.4
          }
        });
      }
      setParticles(newParticles);
    };

    generateParticles();

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.velocity.x + 340) % 340,
        y: (particle.y + particle.velocity.y + 500) % 500,
        opacity: particle.opacity + (Math.random() - 0.5) * 0.015
      })));
      animationRef.current = requestAnimationFrame(animateParticles);
    };

    animationRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [open, isMinimized]);

  /* ─── Initialize Vapi ─── */
  useEffect(() => {
    if (!publicKey) return
    let vapiInstance: any = null

    const initVapi = async () => {
      try {
        const module = await new Function("return import('https://esm.sh/@vapi-ai/web')")()
        const Vapi = module.default
        
        vapiInstance = new Vapi(publicKey)
        vapiRef.current = vapiInstance

        vapiInstance.on('call-start', () => {
          setIsCallActive(true)
          setIsConnecting(false)
          setStatusKey('listening')
          setUserTranscript('')
          setAssistantTranscript('')
          setHistory([]) // Reset history on new call
          setSummary(null)
          setEmailDraft(null)
          setPostCallView('menu')
          setDuration(0)
          
          durationTimerRef.current = setInterval(() => {
            setDuration(prev => prev + 1)
          }, 1000)
        })

        vapiInstance.on('call-end', () => {
          setIsCallActive(false)
          setIsConnecting(false)
          setStatusKey('')
          setVolumeLevel(0)
          if (durationTimerRef.current) clearInterval(durationTimerRef.current)
        })

        vapiInstance.on('speech-start', () => { 
          setStatusKey('speaking')
          setUserTranscript('')
        })

        vapiInstance.on('speech-end', () => { 
          setStatusKey('thinking')
        })

        vapiInstance.on('volume-level', (level: number) => setVolumeLevel(level))

        vapiInstance.on('message', (msg: any) => {
          if (msg.type === 'transcript') {
            if (msg.role === 'user') {
              setStatusKey('listening')
              setUserTranscript(msg.transcript)
            } else if (msg.role === 'assistant') {
              setAssistantTranscript(msg.transcript)
            }
            
            // Save final transcripts to history for the Gemini Summary feature
            if (msg.transcriptType === 'final') {
              setHistory(prev => [...prev, { role: msg.role, text: msg.transcript }])
            }
          }
        })

        vapiInstance.on('error', (e: any) => { 
          console.error(e)
          setIsConnecting(false)
          setStatusKey('error') 
        })
      } catch (err) {
        console.error("Failed to load Vapi script:", err)
        setStatusKey('error')
      }
    }

    initVapi()

    return () => { 
      if (vapiInstance) vapiInstance.stop() 
      if (durationTimerRef.current) clearInterval(durationTimerRef.current)
    }
  }, [publicKey])

  /* ─── Waveform Simulation based on Volume ─── */
  useEffect(() => {
    if (isCallActive && statusKey !== 'thinking') {
      const interval = setInterval(() => {
        const newWaveform = Array(24).fill(0).map(() => 
          (volumeLevel * 40) + (Math.random() * (volumeLevel > 0.05 ? 15 : 4))
        );
        setWaveformData(newWaveform);
      }, 80);
      return () => clearInterval(interval);
    } else {
      setWaveformData(Array(24).fill(0));
    }
  }, [isCallActive, volumeLevel, statusKey]);

  /* ─── Gemini API Integrations ✨ ─── */
  const callGeminiAPI = async (prompt: string, systemInstruction: string) => {
    const apiKey = ""; 
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    
    let finalResult = "Kunne ikke fullføre handlingen på grunn av en feil.";

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
          })
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (generatedText) {
          finalResult = generatedText;
          break;
        }
      } catch (error) {
        if (attempt === 4) break;
        await delay(Math.pow(2, attempt) * 1000);
      }
    }
    return finalResult;
  };

  const generateSummaryWithGemini = async () => {
    if (history.length === 0) return;
    setPostCallView('summary');
    setIsGeneratingLLM(true);
    setSummary(null);
    
    const conversationText = history.map(h => `${h.role === 'user' ? 'Kunde' : 'Eirik'}: ${h.text}`).join('\n');
    const prompt = `Vennligst analyser og oppsummer følgende kundesamtale. Trekk ut hovedpunktene og lag en bullet-point liste over potensielle aksjonspunkter for Arxon AI:\n\n${conversationText}`;
    const systemInstruction = "Du er en skarp og profesjonell assistent for Arxon AI som spesialiserer deg på å trekke ut innsikt og oppsummere salgs- og kundesamtaler på norsk.";

    const result = await callGeminiAPI(prompt, systemInstruction);
    setSummary(result);
    setIsGeneratingLLM(false);
  };

  const generateEmailDraftWithGemini = async () => {
    if (history.length === 0) return;
    setPostCallView('email');
    setIsGeneratingLLM(true);
    setEmailDraft(null);

    const conversationText = history.map(h => `${h.role === 'user' ? 'Kunde' : 'Eirik'}: ${h.text}`).join('\n');
    const prompt = `Basert på følgende kundesamtale, skriv et profesjonelt og høflig utkast til en oppfølgings-e-post fra Arxon AI til kunden. E-posten bør takke for praten, oppsummere kort hva som ble diskutert, og foreslå neste steg. Hold det konsist.\n\nSamtale:\n${conversationText}`;
    const systemInstruction = "Du er en dyktig kunderådgiver for Arxon AI som skriver utmerkede oppfølgings-e-poster på norsk.";

    const result = await callGeminiAPI(prompt, systemInstruction);
    setEmailDraft(result);
    setIsGeneratingLLM(false);
  }

  /* ─── UI Helpers ─── */
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-2 leading-relaxed min-h-[1em]">
          {parts.map((part, j) => 
            part.startsWith('**') && part.endsWith('**') 
              ? <strong key={j} style={{ color: COLORS.textPrimary }}>{part.slice(2, -2)}</strong> 
              : part
          )}
        </p>
      );
    });
  };

  /* ─── Actions ─── */
  const toggleCall = useCallback(async () => {
    if (!vapiRef.current || !assistantId) return
    if (isCallActive) {
      vapiRef.current.stop()
    } else {
      setIsConnecting(true)
      setStatusKey('connecting')
      setAssistantTranscript('')
      setUserTranscript('')
      try { 
        await vapiRef.current.start(assistantId) 
      } catch { 
        setIsConnecting(false)
        setStatusKey('') 
      }
    }
  }, [isCallActive, assistantId])

  const handleClose = useCallback(() => {
    if (isCallActive) vapiRef.current?.stop()
    setOpen(false)
    setIsMinimized(false)
  }, [isCallActive])

  if (!publicKey || !assistantId) return null

  /* ─── Computed UI ─── */
  const isActive = isCallActive || isConnecting
  const statusText = statusKey ? LABELS[statusKey] : LABELS.tapToTalk
  const hasHistory = history.length > 0
  const showPostCallTools = !isActive && hasHistory
  
  const getStatusColor = () => {
    if (statusKey === 'listening') return COLORS.listening;
    if (statusKey === 'speaking') return COLORS.speaking;
    if (statusKey === 'thinking') return COLORS.thinking;
    return COLORS.textMuted;
  };

  const activeColor = getStatusColor();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      {!open && (
        <button 
          onClick={() => setOpen(true)} 
          aria-label="Snakk med Eirik" 
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center border-none cursor-pointer"
          style={{
            background: `linear-gradient(145deg, ${COLORS.gold}, ${COLORS.goldDark})`,
            boxShadow: `0 4px 24px rgba(239, 192, 123, 0.35)`,
          }}
        >
          <div className="absolute inset-[-4px] rounded-full border-2 animate-ping" style={{ borderColor: 'rgba(239,192,123,0.3)', animationDuration: '3s' }} />
          <Mic className="w-6 h-6 text-[#050510]" />
        </button>
      )}

      <AnimatePresence>
        {/* ── Minimized Compact Bar ── */}
        {open && isMinimized && (
          <motion.div
            key="minimized-panel"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:w-[340px] h-16 rounded-full overflow-hidden flex items-center justify-between px-2 z-[9999]"
            style={{
              background: COLORS.bg,
              border: `1px solid rgba(239, 192, 123, 0.2)`,
              boxShadow: `0 10px 40px rgba(0,0,0,0.8)`
            }}
          >
            {/* Indicator */}
            <div className="flex items-center gap-3 pl-2">
              <div className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${activeColor}20` }}>
                <Mic className="w-4 h-4" style={{ color: activeColor }} />
                {isActive && (
                  <motion.div 
                    className="absolute inset-0 rounded-full border border-current pointer-events-none" 
                    style={{ color: activeColor }} 
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }} 
                    transition={{ duration: 1.5, repeat: Infinity }} 
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-medium" style={{ color: activeColor }}>{statusText}</span>
                {isCallActive && <span className="text-[10px]" style={{ color: COLORS.textMuted }}>{formatTime(duration)}</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 pr-1">
              <button 
                onClick={() => setIsMinimized(false)} 
                className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Utvid widget"
              >
                <ChevronUp className="w-5 h-5" style={{ color: COLORS.textPrimary }} />
              </button>
              <button 
                onClick={handleClose} 
                className="p-2.5 rounded-full transition-colors hover:bg-red-500/30"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                aria-label="Avslutt samtale"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Full Siri-style Voice Panel ── */}
        {open && !isMinimized && (
          <motion.div 
            key="full-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[9999] w-[calc(100vw-32px)] sm:w-[340px] h-[440px] sm:h-[520px] rounded-[24px] sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            style={{ 
              background: COLORS.bg,
              border: `1px solid rgba(239, 192, 123, 0.1)`,
              boxShadow: `0 20px 80px rgba(0,0,0,0.8), 0 0 40px rgba(239, 192, 123, 0.05)`
            }}
          >
            {/* Ambient Particles */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              {particles.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    left: particle.x,
                    top: particle.y,
                    opacity: particle.opacity,
                    backgroundColor: showPostCallTools ? COLORS.gold : activeColor
                  }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>

            {/* Background Glow */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="w-80 h-80 rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${showPostCallTools ? COLORS.goldDark : activeColor}40, transparent 70%)`
                }}
                animate={{
                  scale: isActive ? [1, 1.1, 1] : [0.9, 1, 0.9],
                  opacity: isActive ? [0.4, 0.6, 0.4] : [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Header */}
            <div className="relative z-20 flex justify-between items-center p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: `linear-gradient(145deg, ${COLORS.gold}, ${COLORS.goldDark})`, color: COLORS.bg }}>
                  E
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] leading-tight" style={{ color: COLORS.textPrimary }}>Eirik</h3>
                  <p className="text-xs" style={{ color: COLORS.textMuted }}>Arxon AI-assistent</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(true)} className="p-2 rounded-full hover:bg-white/5 transition-colors" style={{ color: COLORS.textMuted }} aria-label="Minimer">
                  <ChevronDown className="w-5 h-5" />
                </button>
                <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/5 transition-colors" style={{ color: COLORS.textMuted }} aria-label="Lukk">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* View Switcher: Call Interface vs Gemini Post-Call Tools */}
            <AnimatePresence mode="wait">
              {showPostCallTools ? (
                /* ─── GEMINI POST-CALL VIEWS ✨ ─── */
                <motion.div 
                  key="post-call"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="relative z-10 flex-1 flex flex-col px-6 py-2 overflow-hidden"
                >
                  
                  {/* Tab Navigation */}
                  <div className="flex items-center gap-4 mb-4 pb-2 border-b border-white/10">
                    <button 
                      onClick={() => setPostCallView('menu')}
                      className={`text-[13px] font-medium transition-colors ${postCallView === 'menu' ? 'text-white' : 'text-[#7a7a8e] hover:text-white/70'}`}
                    >
                      Meny
                    </button>
                    {(summary || postCallView === 'summary') && (
                      <button 
                        onClick={() => setPostCallView('summary')}
                        className={`text-[13px] font-medium transition-colors flex items-center gap-1 ${postCallView === 'summary' ? `text-[${COLORS.gold}]` : 'text-[#7a7a8e] hover:text-white/70'}`}
                        style={{ color: postCallView === 'summary' ? COLORS.gold : undefined }}
                      >
                        Oppsummering
                      </button>
                    )}
                    {(emailDraft || postCallView === 'email') && (
                      <button 
                        onClick={() => setPostCallView('email')}
                        className={`text-[13px] font-medium transition-colors flex items-center gap-1 ${postCallView === 'email' ? `text-[${COLORS.gold}]` : 'text-[#7a7a8e] hover:text-white/70'}`}
                        style={{ color: postCallView === 'email' ? COLORS.gold : undefined }}
                      >
                        E-postutkast
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {postCallView === 'menu' && (
                      <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-2">
                        <p className="text-[13px] leading-relaxed mb-2" style={{ color: COLORS.textMuted }}>
                          Samtalen er ferdig! Hvordan vil du bruke Gemini til å behandle samtalen?
                        </p>
                        <button 
                          onClick={generateSummaryWithGemini}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-medium transition-all hover:bg-white/10"
                          style={{ border: `1px solid rgba(239, 192, 123, 0.3)`, color: COLORS.textPrimary }}
                        >
                          <FileText className="w-4 h-4" style={{ color: COLORS.gold }} />
                          Lag oppsummering ✨
                        </button>
                        <button 
                          onClick={generateEmailDraftWithGemini}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-medium transition-all hover:bg-white/10"
                          style={{ border: `1px solid rgba(239, 192, 123, 0.3)`, color: COLORS.textPrimary }}
                        >
                          <Mail className="w-4 h-4" style={{ color: COLORS.gold }} />
                          Skriv e-postutkast ✨
                        </button>
                      </div>
                    )}

                    {postCallView === 'summary' && (
                      isGeneratingLLM ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                          <Loader2 className="w-8 h-8 animate-spin" style={{ color: COLORS.gold }} />
                          <p className="text-xs text-center" style={{ color: COLORS.textMuted }}>Gemini analyserer transkripsjonene...</p>
                        </div>
                      ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px]" style={{ color: COLORS.textMuted }}>
                          {summary && renderFormattedText(summary)}
                        </motion.div>
                      )
                    )}

                    {postCallView === 'email' && (
                      isGeneratingLLM ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                          <Loader2 className="w-8 h-8 animate-spin" style={{ color: COLORS.gold }} />
                          <p className="text-xs text-center" style={{ color: COLORS.textMuted }}>Gemini skriver e-postutkast...</p>
                        </div>
                      ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px]" style={{ color: COLORS.textMuted }}>
                          {emailDraft && renderFormattedText(emailDraft)}
                        </motion.div>
                      )
                    )}
                  </div>
                </motion.div>
              ) : (
                /* ─── ACTIVE CALL VIEW ─── */
                <motion.div 
                  key="call"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4 sm:gap-8 px-4 sm:px-6"
                >
                  {/* Main Orb Button */}
                  <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <button
                      onClick={toggleCall}
                      disabled={isConnecting}
                      className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-500 z-10"
                      style={{
                        background: isActive ? `radial-gradient(circle at 30% 30%, ${activeColor}33, transparent)` : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${isActive ? activeColor : 'rgba(255,255,255,0.1)'}`,
                        boxShadow: isActive ? `0 0 30px ${activeColor}40, inset 0 0 20px ${activeColor}20` : 'none'
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {isConnecting || statusKey === 'thinking' ? (
                          <motion.div key="processing" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" style={{ color: activeColor }} />
                          </motion.div>
                        ) : statusKey === 'speaking' ? (
                          <motion.div key="speaking" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                            <Volume2 className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: activeColor }} />
                          </motion.div>
                        ) : isCallActive ? (
                          <motion.div key="listening" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                            <Mic className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: activeColor }} />
                          </motion.div>
                        ) : (
                          <motion.div key="idle" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                            <Mic className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: COLORS.textPrimary }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>

                    {/* Pulse Rings */}
                    <AnimatePresence>
                      {isActive && statusKey !== 'thinking' && (
                        <>
                          <motion.div
                            className="absolute inset-0 rounded-full border-[1.5px] pointer-events-none"
                            style={{ borderColor: activeColor }}
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: 1.6, opacity: 0 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-full border-[1.5px] pointer-events-none"
                            style={{ borderColor: activeColor }}
                            initial={{ scale: 1, opacity: 0.3 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                          />
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Status & Timer */}
                  <div className="flex flex-col items-center gap-1">
                    <motion.p 
                      className="text-base font-medium"
                      style={{ color: isActive ? activeColor : COLORS.textMuted }}
                      animate={{ opacity: isActive ? [1, 0.7, 1] : 1 }}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                    >
                      {statusText}
                    </motion.p>
                    {isCallActive && (
                      <p className="text-xs font-mono" style={{ color: COLORS.textMuted }}>
                        {formatTime(duration)}
                      </p>
                    )}
                  </div>

                  {/* Waveform Visualizer */}
                  <div className="flex items-end justify-center gap-[3px] h-12 w-full mt-2">
                    {waveformData.map((height, i) => (
                      <motion.div
                        key={i}
                        className="w-1 rounded-full transition-all duration-75"
                        style={{ backgroundColor: isActive ? activeColor : 'transparent' }}
                        animate={{ 
                          height: isActive ? `${Math.max(4, height)}px` : '4px',
                          opacity: isActive ? 0.8 : 0
                        }}
                      />
                    ))}
                  </div>

                  {/* Live Transcripts */}
                  <div className="w-full text-center min-h-[40px] flex flex-col justify-end">
                    <AnimatePresence mode="wait">
                      {userTranscript && statusKey === 'listening' && (
                        <motion.div 
                          key="user"
                          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          className="text-sm italic" style={{ color: COLORS.textMuted }}
                        >
                          "{userTranscript}"
                        </motion.div>
                      )}
                      {assistantTranscript && statusKey === 'speaking' && (
                        <motion.div 
                          key="ai"
                          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          className="text-[15px] font-medium leading-snug" style={{ color: COLORS.textPrimary }}
                        >
                          {assistantTranscript}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="relative z-20 p-5 flex flex-col items-center gap-4 border-t border-white/5 bg-[#050510]/80 backdrop-blur-md">
              {isCallActive ? (
                <button 
                  onClick={() => vapiRef.current?.stop()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors hover:bg-red-500/20"
                  style={{ color: '#f87171', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                >
                  <MicOff className="w-4 h-4" />
                  Avslutt samtale
                </button>
              ) : showPostCallTools ? (
                <button 
                  onClick={() => { setHistory([]); setSummary(null); setEmailDraft(null); setPostCallView('menu'); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors hover:bg-white/10"
                  style={{ color: COLORS.textPrimary, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Start ny samtale
                </button>
              ) : null}
              
              <motion.div 
                className="flex items-center gap-1.5 text-xs" 
                style={{ color: COLORS.textMuted }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: COLORS.goldDark }} />
                <span>Drevet av Arxon AI & Gemini</span>
              </motion.div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Custom scrollbar for the summary area */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(239, 192, 123, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(239, 192, 123, 0.4);
        }
      `}</style>
    </>
  )
}
