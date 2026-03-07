'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Phone, PhoneOff, Sparkles, MessageSquare,
  Volume2, Shield, Zap, Bot, Send, User, Building2, Mail,
  PhoneCall, Briefcase, TrendingUp, Clock, ChevronDown, ChevronUp
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, fadeUp, globalStyles } from '@/lib/constants'
import { useVapiKundeservice, CallStatus, CrmEntry, Message } from '@/lib/useVapiKundeservice'

/* ── Animated Voice Orb ───────────────────────────────── */
function VoiceOrb({ status, volume }: { status: CallStatus; volume: number }) {
  const scale = status === 'active' ? 1 + volume * 0.4 : 1
  const pulseSize = status === 'connecting' ? 1.15 : scale

  const orbGradient = status === 'idle'
    ? `radial-gradient(circle at 35% 35%, rgba(${goldRgb},0.25), rgba(${goldRgb},0.05))`
    : status === 'connecting'
    ? `radial-gradient(circle at 35% 35%, rgba(${goldRgb},0.4), rgba(${goldRgb},0.1))`
    : `radial-gradient(circle at 35% 35%, rgba(${goldRgb},0.6), rgba(${goldRgb},0.15))`

  const borderColor = status === 'active'
    ? `rgba(${goldRgb},${0.3 + volume * 0.4})`
    : status === 'connecting'
    ? `rgba(${goldRgb},0.3)`
    : `rgba(${goldRgb},0.15)`

  return (
    <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {(status === 'active' || status === 'connecting') && (
        <>
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.15, 0, 0.15] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: `1px solid rgba(${goldRgb},0.2)` }}
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: `1px solid rgba(${goldRgb},0.15)` }}
          />
        </>
      )}
      <motion.div
        animate={{ scale: pulseSize }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 140, height: 140, borderRadius: '50%',
          background: orbGradient,
          border: `2px solid ${borderColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: status === 'active'
            ? `0 0 ${40 + volume * 60}px rgba(${goldRgb},${0.15 + volume * 0.2}), inset 0 0 30px rgba(${goldRgb},0.1)`
            : `0 0 30px rgba(${goldRgb},0.08)`,
          transition: 'box-shadow 0.15s ease',
        }}
      >
        {status === 'connecting' ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ width: 36, height: 36, border: `3px solid rgba(${goldRgb},0.15)`, borderTop: `3px solid ${gold}`, borderRadius: '50%' }}
          />
        ) : status === 'active' ? (
          <Volume2 size={42} color={gold} style={{ opacity: 0.8 }} />
        ) : (
          <Mic size={42} color={gold} style={{ opacity: 0.5 }} />
        )}
      </motion.div>
    </div>
  )
}

/* ── Chat Messages ────────────────────────────────────── */
function ChatMessages({ messages }: { messages: Message[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  if (messages.length === 0) return null

  return (
    <div
      ref={scrollRef}
      style={{
        maxHeight: 300, overflowY: 'auto', width: '100%',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14, padding: 14,
      }}
    >
      <AnimatePresence>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}
          >
            <div style={{
              maxWidth: '80%', padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: msg.role === 'user' ? `rgba(${goldRgb},0.12)` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${msg.role === 'user' ? `rgba(${goldRgb},0.2)` : 'rgba(255,255,255,0.06)'}`,
            }}>
              <span style={{ fontSize: 10, color: msg.role === 'user' ? gold : 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {msg.role === 'user' ? 'Deg' : 'Aria'}
              </span>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginTop: 4 }}>{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ── CRM Live Card ────────────────────────────────────── */
function CrmCard({ data }: { data: CrmEntry }) {
  const [expanded, setExpanded] = useState(true)
  const score = data.leadScore ?? 0
  const scoreColor = score >= 60 ? '#4ade80' : score >= 30 ? '#fbbf24' : 'rgba(255,255,255,0.3)'
  const hasAnyData = data.navn || data.bedrift || data.bransje || data.epost || data.telefon || (data.behov && data.behov.length > 0)

  if (!hasAnyData) return null

  const fields: { icon: typeof User; label: string; value?: string }[] = [
    { icon: User, label: 'Navn', value: data.navn },
    { icon: Building2, label: 'Bedrift', value: data.bedrift },
    { icon: Briefcase, label: 'Bransje', value: data.bransje },
    { icon: Mail, label: 'E-post', value: data.epost },
    { icon: PhoneCall, label: 'Telefon', value: data.telefon },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, overflow: 'hidden',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
          borderBottom: expanded ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `rgba(${goldRgb},0.1)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={16} color={gold} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#f0f0f0' }}>CRM — Live</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: 1 }}>
              Oppdateres i sanntid under samtalen
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Lead Score Badge */}
          <div style={{
            padding: '4px 10px', borderRadius: 20,
            background: `${scoreColor}15`, border: `1px solid ${scoreColor}30`,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: scoreColor }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: scoreColor }}>{score}%</span>
          </div>
          {expanded ? <ChevronUp size={16} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.3)" />}
        </div>
      </button>

      {/* Body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '14px 18px' }}>
              {/* Data fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                {fields.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <f.icon size={13} color={f.value ? gold : 'rgba(255,255,255,0.15)'} />
                    <div>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block' }}>
                        {f.label}
                      </span>
                      <span style={{ fontSize: 12, color: f.value ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)', fontWeight: f.value ? 500 : 400 }}>
                        {f.value || '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Needs / behov */}
              {data.behov && data.behov.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    Identifiserte behov
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {data.behov.map((b, i) => (
                      <span key={i} style={{
                        fontSize: 11, padding: '3px 10px', borderRadius: 20,
                        background: `rgba(${goldRgb},0.08)`, border: `1px solid rgba(${goldRgb},0.15)`,
                        color: gold, fontWeight: 500,
                      }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentiment */}
              {data.sentiment && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                    Stemning:
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    color: data.sentiment === 'positiv' ? '#4ade80' : data.sentiment === 'negativ' ? '#f87171' : 'rgba(255,255,255,0.5)',
                  }}>
                    {data.sentiment === 'positiv' ? '😊 Positiv' : data.sentiment === 'negativ' ? '😟 Negativ' : '😐 Nøytral'}
                  </span>
                </div>
              )}

              {/* Notes */}
              {data.notater && data.notater.length > 0 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    Notater
                  </span>
                  {data.notater.slice(-3).map((n, i) => (
                    <p key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, marginBottom: 3 }}>
                      • {n}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Text Input Bar ───────────────────────────────────── */
function TextInput({ onSend, disabled }: { onSend: (text: string) => void; disabled: boolean }) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'center',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, padding: '6px 8px 6px 16px',
    }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder={disabled ? 'Start en samtale først...' : 'Skriv en melding til Aria...'}
        disabled={disabled}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          color: '#f0f0f0', fontSize: 13, fontFamily: "'Inter', sans-serif",
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: text.trim() && !disabled ? `rgba(${goldRgb},0.15)` : 'rgba(255,255,255,0.03)',
          border: `1px solid ${text.trim() && !disabled ? `rgba(${goldRgb},0.25)` : 'rgba(255,255,255,0.06)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
        }}
      >
        <Send size={14} color={text.trim() && !disabled ? gold : 'rgba(255,255,255,0.2)'} />
      </button>
    </div>
  )
}

/* ── Main Page ────────────────────────────────────────── */
export default function KundeserviceDemoPage() {
  const { status, isMuted, volume, messages, crmData, start, stop, toggleMute, sendText } = useVapiKundeservice()
  const [showTranscript, setShowTranscript] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Call timer
  useEffect(() => {
    if (status === 'active') {
      setCallDuration(0)
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [status])

  const fmtTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const statusText: Record<CallStatus, string> = {
    idle: 'Trykk for å starte samtalen',
    connecting: 'Kobler til Aria...',
    active: 'Aria lytter — snakk nå',
    ending: 'Avslutter samtalen...',
  }

  const handleMainAction = () => {
    if (status === 'idle') start()
    else if (status === 'active') stop()
  }

  const suggestions = [
    'Hva er Arxon?',
    'Hvilke tjenester tilbyr dere?',
    'Hvor mye koster det?',
    'Kan du hjelpe min bedrift?',
  ]

  return (
    <div style={{ minHeight: '100vh', background: bg, color: '#f0f0f0', fontFamily: "'Inter', sans-serif" }}>
      <style>{globalStyles(`
        @keyframes pulse-gold { 0%, 100% { box-shadow: 0 0 20px rgba(${goldRgb},0.15); } 50% { box-shadow: 0 0 40px rgba(${goldRgb},0.3); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `)}</style>
      <Nav />

      {/* Header */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '50px 24px 16px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 30, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.15)`, fontSize: 13, color: gold, marginBottom: 20 }}>
          <Sparkles size={14} />
          Live Kundeservice-Demo
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 12, letterSpacing: '-0.02em' }}>
          Møt <span style={{ color: gold }}>Aria</span> — din AI kundeserviceagent
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
          style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: 'rgba(255,255,255,0.4)', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
          Ring eller skriv til Aria. Hun kjenner Arxon inn og ut, svarer på spørsmål, og logger all kundeinformasjon direkte i CRM — i sanntid.
        </motion.p>
      </section>

      {/* Main layout: 2 columns on desktop */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: 24, alignItems: 'start' }}
          className="grid-2"
        >
          {/* LEFT: Voice + Chat */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Voice Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20, padding: '32px 24px', textAlign: 'center',
              }}
            >
              {/* Timer */}
              {status === 'active' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', borderRadius: 20,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse-gold 2s infinite' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtTime(callDuration)}
                    </span>
                  </div>
                </div>
              )}

              {/* Orb */}
              <div
                style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, cursor: status === 'connecting' || status === 'ending' ? 'wait' : 'pointer' }}
                onClick={handleMainAction}
              >
                <VoiceOrb status={status} volume={volume} />
              </div>

              {/* Status text */}
              <motion.p key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ fontSize: 13, color: status === 'active' ? gold : 'rgba(255,255,255,0.35)', fontWeight: status === 'active' ? 600 : 400, marginBottom: 16 }}>
                {statusText[status]}
              </motion.p>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {status === 'idle' && (
                  <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    onClick={start} className="cta-shimmer"
                    style={{
                      color: bg, border: 'none', borderRadius: 12, padding: '12px 28px',
                      fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                    <Phone size={15} /> Start samtale
                  </motion.button>
                )}
                {status === 'active' && (
                  <>
                    <button onClick={stop} style={{
                      background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                      borderRadius: 10, padding: '10px 20px', color: '#ef4444',
                      fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <PhoneOff size={14} /> Avslutt
                    </button>
                    <button onClick={toggleMute} style={{
                      background: isMuted ? `rgba(${goldRgb},0.1)` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isMuted ? `rgba(${goldRgb},0.2)` : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 10, padding: '10px 16px',
                      color: isMuted ? gold : 'rgba(255,255,255,0.4)',
                      fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                      {isMuted ? 'Aktiver' : 'Demp'}
                    </button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Text Input */}
            <TextInput onSend={sendText} disabled={status !== 'active'} />

            {/* Suggestions (when idle) */}
            {status === 'idle' && messages.length === 0 && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                  Prøv å spørre
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {suggestions.map((q, i) => (
                    <span key={i} style={{
                      fontSize: 11, color: 'rgba(255,255,255,0.3)', padding: '5px 12px',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 20, cursor: 'default',
                    }}>
                      &quot;{q}&quot;
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Transcript toggle + messages */}
            {messages.length > 0 && (
              <div>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                    color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 500,
                  }}
                >
                  <MessageSquare size={13} />
                  {showTranscript ? 'Skjul transkripsjon' : 'Vis transkripsjon'}
                  {showTranscript ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                <AnimatePresence>
                  {showTranscript && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <ChatMessages messages={messages} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* RIGHT: CRM Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CrmCard data={crmData} />

            {/* Info cards */}
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                { icon: Zap, title: 'Sanntidssvar', desc: 'Aria svarer på under 2 sekunder' },
                { icon: Bot, title: 'Norsk kundeservice', desc: 'Naturlig norsk samtale med CRM-logging' },
                { icon: Shield, title: 'GDPR-sikker', desc: 'All data kryptert og innen EØS' },
              ].map((f, i) => (
                <motion.div key={i} {...fadeUp} style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 12, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: `rgba(${goldRgb},0.07)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <f.icon size={16} color={gold} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{f.title}</h4>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.3 }}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call duration summary (after call ends) */}
            {status === 'idle' && messages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: `rgba(${goldRgb},0.04)`, border: `1px solid rgba(${goldRgb},0.12)`,
                  borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <Clock size={16} color={gold} />
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: gold }}>Samtale fullført</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: 1 }}>
                    {messages.length} meldinger · Lead Score: {crmData.leadScore ?? 0}%
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Privacy note */}
      <section style={{ maxWidth: 500, margin: '0 auto', padding: '0 24px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', lineHeight: 1.5 }}>
          Dette er en live demo. AI-en bruker din mikrofon og høyttaler for sanntidssamtale.
          Tale prosesseres via Deepgram og Azure innen EØS. CRM-data vises kun lokalt i nettleseren og lagres ikke.
        </p>
      </section>

      <Footer minimal />
    </div>
  )
}
