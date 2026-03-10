'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   1. DESIGN TOKENS & CONSTANTS
   Moved outside the component to prevent recreation on every volume-level render.
   ───────────────────────────────────────────────────────────────────────────── */
const COLORS = {
  gold: '#efc07b',
  goldDark: '#c9a96e',
  goldRgb: '239,192,123',
  bg: '#050510',
  surface: '#0c0c1a',
  textPrimary: '#f0ede8',
  textMuted: '#7a7a8e',
  listening: '#8b7cf8',
  speaking: '#6b8aff',
}

const LABELS = {
  tapToTalk: 'Trykk for å snakke med Eirik',
  connecting: 'Kobler til...',
  connected: 'Tilkoblet',
  speaking: 'Eirik snakker...',
  thinking: 'Eirik tenker...', // New state to mask latency
  listening: 'Lytter...',
  error: 'Noe gikk galt — prøv igjen',
} as const

type StatusKey = keyof typeof LABELS | ''

/* ─────────────────────────────────────────────────────────────────────────────
   2. MAIN COMPONENT
   ───────────────────────────────────────────────────────────────────────────── */
export default function ChatWidget() {
  const publicKey = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY : null
  const assistantId = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID : null

  // --- UI State ---
  const [open, setOpen] = useState(false)
  
  // --- Vapi & Call State ---
  const [isCallActive, setIsCallActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [statusKey, setStatusKey] = useState<StatusKey>('')
  const [volumeLevel, setVolumeLevel] = useState(0)
  
  // --- Transcripts ---
  const [userTranscript, setUserTranscript] = useState('')
  const [assistantTranscript, setAssistantTranscript] = useState('')

  const vapiRef = useRef<any>(null)

  /* ─── Initialize Vapi ─── */
  useEffect(() => {
    if (!publicKey) return
    let vapiInstance: any = null

    const initVapi = async () => {
      try {
        // Dynamically import Vapi to bypass bundler static resolution issues
        const module = await new Function("return import('https://esm.sh/@vapi-ai/web')")()
        const Vapi = module.default
        
        vapiInstance = new Vapi(publicKey)
        vapiRef.current = vapiInstance

        vapiInstance.on('call-start', () => {
          setIsCallActive(true)
          setIsConnecting(false)
          setStatusKey('connected')
          setUserTranscript('')
          setAssistantTranscript('')
        })

        vapiInstance.on('call-end', () => {
          setIsCallActive(false)
          setIsConnecting(false)
          setStatusKey('')
          setVolumeLevel(0)
        })

        vapiInstance.on('speech-start', () => { 
          setStatusKey('speaking')
          setUserTranscript('') // Clear user transcript when AI starts talking
        })

        vapiInstance.on('speech-end', () => { 
          setStatusKey('thinking') // AI is processing user input
        })

        vapiInstance.on('volume-level', (level: number) => setVolumeLevel(level))

        vapiInstance.on('message', (msg: any) => {
          // Capture live transcripts to show on screen
          if (msg.type === 'transcript') {
            if (msg.role === 'user') {
              setStatusKey('listening')
              setUserTranscript(msg.transcript)
            } else if (msg.role === 'assistant') {
              setAssistantTranscript(msg.transcript)
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
    }
  }, [publicKey])

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
  }, [isCallActive])

  if (!publicKey || !assistantId) return null

  /* ─── Computed UI ─── */
  const isActive = isCallActive || isConnecting
  const statusText = statusKey ? LABELS[statusKey] : ''
  
  // Memoize orb styles to prevent recalculating complex strings on every volume frame
  const orbStyles = useMemo(() => {
    const scale = 1 + volumeLevel * 0.4
    const isSpeaking = statusKey === 'speaking'
    const isListening = statusKey === 'listening'
    
    const primary = isActive ? (isSpeaking ? COLORS.gold : isListening ? COLORS.listening : COLORS.speaking) : COLORS.gold
    const secondary = isActive ? (isSpeaking ? COLORS.goldDark : isListening ? '#5b4ccc' : '#3a5ab0') : COLORS.goldDark
    const intensity = isActive ? (isSpeaking ? 0.6 : isListening ? 0.45 : 0.25) : 0.15

    return {
      background: `radial-gradient(circle at 38% 38%, ${primary}, ${secondary}88, transparent)`,
      boxShadow: `0 0 ${24 + volumeLevel * 50}px rgba(${COLORS.goldRgb},${intensity}), 0 0 ${50 + volumeLevel * 80}px rgba(${COLORS.goldRgb},${intensity * 0.35})`,
      transform: `scale(${scale})`,
      cursor: isConnecting ? 'wait' : 'pointer',
    }
  }, [isActive, statusKey, volumeLevel, isConnecting])

  return (
    <>
      {/* ── floating trigger ── */}
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="Snakk med Eirik — Arxon AI" className="eirik-trigger">
          <div className="eirik-trigger-ring" />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      )}

      {/* ── voice panel ── */}
      {open && (
        <div className="eirik-panel">
          {/* header */}
          <div className="eirik-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="eirik-avatar">E</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary, lineHeight: 1.2 }}>Eirik</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.2 }}>Arxon AI-assistent</div>
              </div>
            </div>
            <button onClick={handleClose} aria-label="Lukk" className="eirik-close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* orb area */}
          <div className="eirik-orb-area">
            <button
              onClick={toggleCall}
              disabled={isConnecting}
              aria-label={isCallActive ? 'Avslutt samtale' : 'Start samtale'}
              className="eirik-orb"
              style={orbStyles}
            >
              {isConnecting ? (
                <div className="eirik-spinner" />
              ) : isCallActive ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" stroke="none">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
            </button>

            {/* status line */}
            <div className="eirik-status" style={{
              color: isActive ? (statusKey === 'speaking' ? COLORS.gold : COLORS.textPrimary) : COLORS.textMuted,
            }}>
              {isActive && (
                <span className="eirik-status-dot" style={{
                  background: statusKey === 'speaking' ? COLORS.gold : statusKey === 'listening' ? COLORS.listening : COLORS.speaking,
                }} />
              )}
              {isActive ? statusText : LABELS.tapToTalk}
            </div>

            {/* Live Transcripts Display */}
            {isActive && (userTranscript || assistantTranscript) && (
              <div className="eirik-transcripts">
                {userTranscript && <div className="eirik-transcript-user">"{userTranscript}"</div>}
                {assistantTranscript && statusKey === 'speaking' && <div className="eirik-transcript-ai">{assistantTranscript}</div>}
              </div>
            )}

            {/* end call button */}
            {isCallActive && (
              <button onClick={() => vapiRef.current?.stop()} className="eirik-end-call">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 2.59 3.4z" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                Avslutt
              </button>
            )}
          </div>

          {/* footer */}
          <div className="eirik-footer">
            Eirik bruker mikrofon for samtale. Ingen data lagres.
          </div>
        </div>
      )}

      <style>{`
        .eirik-trigger {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          width: 58px; height: 58px; border-radius: 50%; border: none;
          background: linear-gradient(145deg, ${COLORS.gold}, ${COLORS.goldDark});
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 24px rgba(${COLORS.goldRgb},0.35);
          transition: transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s;
        }
        .eirik-trigger:hover {
          transform: scale(1.07); box-shadow: 0 6px 36px rgba(${COLORS.goldRgb},0.5);
        }
        .eirik-trigger-ring {
          position: absolute; inset: -4px; border-radius: 50%;
          border: 2px solid rgba(${COLORS.goldRgb},0.25);
          animation: eirik-ping 2.5s cubic-bezier(0,0,.2,1) infinite;
        }

        .eirik-panel {
          position: fixed; bottom: 20px; right: 20px; z-index: 9999;
          width: 340px; max-width: calc(100vw - 24px); border-radius: 20px;
          overflow: hidden; display: flex; flex-direction: column;
          background: ${COLORS.bg}; border: 1px solid rgba(${COLORS.goldRgb},0.08);
          box-shadow: 0 12px 60px rgba(0,0,0,0.7), 0 0 80px rgba(${COLORS.goldRgb},0.04);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          animation: eirik-slide-up 0.3s cubic-bezier(.4,0,.2,1);
        }

        .eirik-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .eirik-avatar {
          width: 32px; height: 32px; border-radius: 10px;
          background: linear-gradient(145deg, ${COLORS.gold}, ${COLORS.goldDark});
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: ${COLORS.bg}; flex-shrink: 0;
        }
        .eirik-close {
          background: none; border: none; color: ${COLORS.textMuted}; cursor: pointer;
          padding: 6px; border-radius: 8px; display: flex; transition: all 0.15s;
        }
        .eirik-close:hover { color: ${COLORS.textPrimary}; background: rgba(255,255,255,0.05); }

        .eirik-orb-area {
          display: flex; flex-direction: column; align-items: center;
          padding: 28px 16px 20px; gap: 14px;
        }
        .eirik-orb {
          width: 96px; height: 96px; border-radius: 50%; border: none;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.12s ease, box-shadow 0.3s ease, background 0.4s ease;
          position: relative;
        }
        .eirik-orb::before {
          content: ''; position: absolute; inset: -6px; border-radius: 50%;
          border: 1.5px solid rgba(${COLORS.goldRgb},0.1); transition: border-color 0.3s;
        }
        .eirik-orb:hover::before { border-color: rgba(${COLORS.goldRgb},0.2); }

        .eirik-status {
          font-size: 13px; text-align: center; min-height: 18px;
          transition: color 0.2s; display: flex; align-items: center; gap: 6px;
        }
        .eirik-status-dot {
          width: 6px; height: 6px; border-radius: 50%; display: inline-block;
          animation: eirik-pulse-dot 1.5s ease-in-out infinite;
        }
        
        .eirik-transcripts {
          width: 100%; text-align: center; padding: 0 10px; 
          display: flex; flex-direction: column; gap: 4px;
          animation: eirik-fade-in 0.3s ease;
        }
        .eirik-transcript-user {
          font-size: 12px; color: ${COLORS.textMuted}; font-style: italic;
        }
        .eirik-transcript-ai {
          font-size: 13px; color: ${COLORS.textPrimary}; font-weight: 500;
        }

        .eirik-end-call {
          display: flex; align-items: center; gap: 6px; padding: 6px 14px;
          border-radius: 20px; border: 1px solid rgba(239,68,68,0.25);
          background: rgba(239,68,68,0.08); color: #f87171;
          font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; font-family: inherit;
        }
        .eirik-end-call:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); }

        .eirik-footer {
          padding: 0 16px 10px; text-align: center; font-size: 9.5px; color: rgba(255,255,255,0.16); line-height: 1.4;
        }
        .eirik-spinner {
          width: 22px; height: 22px; border: 2px solid rgba(255,255,255,0.12);
          border-top: 2px solid rgba(255,255,255,0.85); border-radius: 50%;
          animation: eirik-spin 0.7s linear infinite;
        }

        @keyframes eirik-spin { to { transform: rotate(360deg); } }
        @keyframes eirik-slide-up { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes eirik-ping { 0% { transform: scale(1); opacity: 0.6; } 75%, 100% { transform: scale(1.35); opacity: 0; } }
        @keyframes eirik-pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes eirik-fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 480px) {
          .eirik-panel { bottom: 12px !important; right: 12px !important; width: calc(100vw - 24px) !important; max-width: 340px !important; border-radius: 18px !important; }
          .eirik-trigger { bottom: 16px !important; right: 16px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .eirik-trigger-ring, .eirik-panel, .eirik-status-dot, .eirik-transcripts { animation: none !important; }
          .eirik-trigger:hover { transform: none; }
        }
      `}</style>
    </>
  )
}
