'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Vapi from '@vapi-ai/web'

/* ───────── design tokens ───────── */
const gold = '#efc07b'
const goldDark = '#c9a96e'
const bg = '#050510'
const surface = '#0c0c1a'
const textPrimary = '#f0ede8'
const textMuted = '#7a7a8e'
const goldRgb = '239,192,123'

const labels = {
  tapToTalk: 'Trykk for å snakke med Eirik',
  connecting: 'Kobler til...',
  connected: 'Tilkoblet',
  speaking: 'Eirik snakker...',
  listening: 'Lytter...',
  error: 'Noe gikk galt — prøv igjen',
  inputActive: 'Skriv til Eirik...',
  inputIdle: 'Skriv en melding...',
} as const

type StatusKey = keyof typeof labels | ''

export default function ChatWidget() {
  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID

  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isCallActive, setIsCallActive] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [statusKey, setStatusKey] = useState<StatusKey>('')

  const vapiRef = useRef<Vapi | null>(null)
  const pendingMessageRef = useRef<string | null>(null)
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* initialise Vapi */
  useEffect(() => {
    if (!publicKey) return
    const vapi = new Vapi(publicKey)
    vapiRef.current = vapi

    vapi.on('call-start', () => {
      setIsCallActive(true); setIsConnecting(false); setStatusKey('connected')
      if (pendingMessageRef.current) {
        const msg = pendingMessageRef.current
        pendingMessageRef.current = null
        pendingTimerRef.current = setTimeout(() => {
          pendingTimerRef.current = null
          vapi.send({ type: 'add-message', message: { role: 'user', content: msg } })
        }, 3000)
      }
    })
    vapi.on('call-end', () => {
      setIsCallActive(false); setIsSpeaking(false); setIsListening(false)
      setVolumeLevel(0); setIsConnecting(false); setStatusKey('')
      if (pendingTimerRef.current) { clearTimeout(pendingTimerRef.current); pendingTimerRef.current = null }
      pendingMessageRef.current = null
    })
    vapi.on('speech-start', () => { setIsSpeaking(true); setIsListening(false); setStatusKey('speaking') })
    vapi.on('speech-end', () => { setIsSpeaking(false); setStatusKey('listening') })
    vapi.on('volume-level', (level: number) => setVolumeLevel(level))
    vapi.on('message', (msg: any) => {
      if (msg.type === 'transcript') {
        if (msg.transcriptType === 'partial' && msg.role === 'user') { setIsListening(true); setStatusKey('listening') }
        if (msg.transcriptType === 'final' && msg.role === 'user') setIsListening(false)
      }
    })
    vapi.on('error', () => { setIsConnecting(false); setStatusKey('error') })

    return () => { vapi.stop() }
  }, [publicKey])

  /* toggle voice call */
  const toggleCall = useCallback(async () => {
    if (!vapiRef.current || !assistantId) return
    if (isCallActive) {
      vapiRef.current.stop()
    } else {
      setIsConnecting(true); setStatusKey('connecting')
      try { await vapiRef.current.start(assistantId) }
      catch { setIsConnecting(false); setStatusKey('') }
    }
  }, [isCallActive, assistantId])

  /* start call with a suggestion topic */
  const startWithTopic = useCallback((msg: string) => {
    if (!vapiRef.current || !assistantId) return
    pendingMessageRef.current = msg
    setIsConnecting(true); setStatusKey('connecting')
    vapiRef.current.start(assistantId, {
      assistantOverrides: {
        firstMessageMode: 'assistant-speaks-first-with-model-generated-message' as any,
        model: { messages: [{ role: 'user' as const, content: msg }] },
      },
    } as any).catch(() => {
      pendingMessageRef.current = null; setIsConnecting(false); setStatusKey('')
    })
  }, [assistantId])

  /* send text */
  const sendMessage = useCallback(() => {
    if (!inputValue.trim() || !vapiRef.current) return
    const text = inputValue.trim()
    setInputValue('')
    if (isCallActive) {
      vapiRef.current.send({ type: 'add-message', message: { role: 'user', content: text } })
    } else {
      startWithTopic(text)
    }
  }, [inputValue, isCallActive, startWithTopic])

  if (!publicKey || !assistantId) return null

  const statusText = statusKey ? (labels as any)[statusKey] || '' : ''
  const isActive = isCallActive || isConnecting

  /* ─── orb visuals ─── */
  const orbScale = 1 + volumeLevel * 0.4
  const orbPrimary = isActive ? (isSpeaking ? gold : isListening ? '#8b7cf8' : '#6b8aff') : gold
  const orbSecondary = isActive ? (isSpeaking ? goldDark : isListening ? '#5b4ccc' : '#3a5ab0') : goldDark
  const glowIntensity = isActive ? (isSpeaking ? 0.6 : isListening ? 0.45 : 0.25) : 0.15

  const suggestions = [
    { emoji: '💰', label: 'Hva koster det?' , msg: 'Hva koster Arxon sine tjenester?' },
    { emoji: '📦', label: 'Hvilken pakke?',    msg: 'Jeg vil finne ut hvilken pakke som passer for min bedrift.' },
    { emoji: '⚡', label: 'Hvordan fungerer det?', msg: 'Kan du forklare hvordan Arxon fungerer i praksis?' },
    { emoji: '📅', label: 'Book samtale',       msg: 'Jeg vil gjerne booke en uforpliktende samtale med dere.' },
  ]

  return (
    <>
      {/* ── floating trigger ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Snakk med Eirik — Arxon AI"
          className="eirik-trigger"
        >
          <div className="eirik-trigger-ring" />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
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
                <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, lineHeight: 1.2 }}>Eirik</div>
                <div style={{ fontSize: 11, color: textMuted, lineHeight: 1.2 }}>Arxon AI-assistent</div>
              </div>
            </div>
            <button
              onClick={() => { if (isCallActive) vapiRef.current?.stop(); setOpen(false) }}
              aria-label="Lukk"
              className="eirik-close"
            >
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
              style={{
                background: `radial-gradient(circle at 38% 38%, ${orbPrimary}, ${orbSecondary}88, transparent)`,
                boxShadow: `0 0 ${24 + volumeLevel * 50}px rgba(${goldRgb},${glowIntensity}),
                             0 0 ${50 + volumeLevel * 80}px rgba(${goldRgb},${glowIntensity * 0.35})`,
                transform: `scale(${orbScale})`,
                cursor: isConnecting ? 'wait' : 'pointer',
              }}
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
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
            </button>

            {/* status line */}
            <div className="eirik-status" style={{
              color: isActive ? (isSpeaking ? gold : textMuted) : textMuted,
            }}>
              {isActive && (
                <span className="eirik-status-dot" style={{
                  background: isSpeaking ? gold : isListening ? '#8b7cf8' : '#6b8aff',
                }} />
              )}
              {isActive ? statusText : labels.tapToTalk}
            </div>

            {/* end call button (visible during call) */}
            {isCallActive && (
              <button
                onClick={() => vapiRef.current?.stop()}
                className="eirik-end-call"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 2.59 3.4z" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                Avslutt
              </button>
            )}
          </div>

          {/* suggestion chips — only when idle */}
          {!isActive && (
            <div className="eirik-suggestions">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => startWithTopic(s.msg)}
                  className="eirik-chip"
                >
                  <span style={{ fontSize: 13 }}>{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* text input */}
          <div className="eirik-input-wrap">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
              placeholder={isCallActive ? labels.inputActive : labels.inputIdle}
              className="eirik-input"
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              aria-label="Send"
              className="eirik-send"
              style={{
                background: inputValue.trim() ? gold : 'transparent',
                opacity: inputValue.trim() ? 1 : 0.4,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={inputValue.trim() ? '#0a0a0f' : textMuted}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {/* footer */}
          <div className="eirik-footer">
            Eirik bruker mikrofon for samtale. Ingen data lagres.
          </div>
        </div>
      )}

      <style>{`
        /* ── Trigger button ── */
        .eirik-trigger {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(145deg, ${gold}, ${goldDark});
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 24px rgba(${goldRgb},0.35);
          transition: transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s;
        }
        .eirik-trigger:hover {
          transform: scale(1.07);
          box-shadow: 0 6px 36px rgba(${goldRgb},0.5);
        }
        .eirik-trigger-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(${goldRgb},0.25);
          animation: eirik-ping 2.5s cubic-bezier(0,0,.2,1) infinite;
        }

        /* ── Panel ── */
        .eirik-panel {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          width: 340px;
          max-width: calc(100vw - 24px);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: ${bg};
          border: 1px solid rgba(${goldRgb},0.08);
          box-shadow: 0 12px 60px rgba(0,0,0,0.7), 0 0 80px rgba(${goldRgb},0.04);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          animation: eirik-slide-up 0.3s cubic-bezier(.4,0,.2,1);
        }

        /* ── Header ── */
        .eirik-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .eirik-avatar {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(145deg, ${gold}, ${goldDark});
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: ${bg};
          flex-shrink: 0;
        }
        .eirik-close {
          background: none;
          border: none;
          color: ${textMuted};
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          display: flex;
          transition: all 0.15s;
        }
        .eirik-close:hover {
          color: ${textPrimary};
          background: rgba(255,255,255,0.05);
        }

        /* ── Orb area ── */
        .eirik-orb-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 28px 16px 20px;
          gap: 14px;
        }
        .eirik-orb {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.12s ease, box-shadow 0.3s ease, background 0.4s ease;
          position: relative;
        }
        .eirik-orb::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1.5px solid rgba(${goldRgb},0.1);
          transition: border-color 0.3s;
        }
        .eirik-orb:hover::before {
          border-color: rgba(${goldRgb},0.2);
        }

        .eirik-status {
          font-size: 12px;
          text-align: center;
          min-height: 18px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .eirik-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
          animation: eirik-pulse-dot 1.5s ease-in-out infinite;
        }

        /* ── End call ── */
        .eirik-end-call {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(239,68,68,0.25);
          background: rgba(239,68,68,0.08);
          color: #f87171;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .eirik-end-call:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.4);
        }

        /* ── Suggestions ── */
        .eirik-suggestions {
          padding: 0 16px 6px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        .eirik-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 10px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          color: ${textPrimary};
          font-size: 11.5px;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
          text-align: left;
          line-height: 1.3;
        }
        .eirik-chip:hover {
          background: rgba(${goldRgb},0.06);
          border-color: rgba(${goldRgb},0.15);
          transform: translateY(-1px);
        }

        /* ── Input ── */
        .eirik-input-wrap {
          padding: 8px 16px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.015);
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .eirik-input {
          flex: 1;
          background: ${surface};
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          outline: none;
          color: ${textPrimary};
          font-size: 13px;
          padding: 9px 14px;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .eirik-input:focus {
          border-color: rgba(${goldRgb},0.2);
        }
        .eirik-input::placeholder {
          color: ${textMuted};
        }
        .eirik-send {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .eirik-send:hover {
          transform: scale(1.05);
        }

        /* ── Footer ── */
        .eirik-footer {
          padding: 0 16px 10px;
          text-align: center;
          font-size: 9.5px;
          color: rgba(255,255,255,0.16);
          line-height: 1.4;
        }

        /* ── Spinner ── */
        .eirik-spinner {
          width: 22px;
          height: 22px;
          border: 2px solid rgba(255,255,255,0.12);
          border-top: 2px solid rgba(255,255,255,0.85);
          border-radius: 50%;
          animation: eirik-spin 0.7s linear infinite;
        }

        /* ── Keyframes ── */
        @keyframes eirik-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes eirik-slide-up {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes eirik-ping {
          0% { transform: scale(1); opacity: 0.6; }
          75%, 100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes eirik-pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .eirik-panel {
            bottom: 12px !important;
            right: 12px !important;
            width: calc(100vw - 24px) !important;
            max-width: 340px !important;
            border-radius: 18px !important;
          }
          .eirik-trigger {
            bottom: 16px !important;
            right: 16px !important;
          }
          .eirik-suggestions {
            grid-template-columns: 1fr !important;
          }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .eirik-trigger-ring { animation: none !important; }
          .eirik-panel { animation: none !important; }
          .eirik-status-dot { animation: none !important; }
          .eirik-trigger:hover { transform: none; }
          .eirik-chip:hover { transform: none; }
          .eirik-send:hover { transform: none; }
        }
      `}</style>
    </>
  )
}

