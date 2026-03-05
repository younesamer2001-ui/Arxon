'use client'
import { useLanguage } from '@/lib/language-context'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Phone, PhoneOff, Sparkles, MessageSquare,
  ArrowRight, Volume2, Shield, Zap, Bot
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, fadeUp, globalStyles } from '@/lib/constants'
import { useVapi, CallStatus } from '@/lib/useVapi'

/* ── Animated Orb ─────────────────────────────────────── */
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
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer pulse rings */}
      {(status === 'active' || status === 'connecting') && (
        <>
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.15, 0, 0.15] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute', width: 200, height: 200, borderRadius: '50%',
              border: `1px solid rgba(${goldRgb},0.2)`,
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            style={{
              position: 'absolute', width: 200, height: 200, borderRadius: '50%',
              border: `1px solid rgba(${goldRgb},0.15)`,
            }}
          />
        </>
      )}

      {/* Main orb */}
      <motion.div
        animate={{ scale: pulseSize }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 160, height: 160, borderRadius: '50%',
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
            style={{ width: 40, height: 40, border: `3px solid rgba(${goldRgb},0.15)`, borderTop: `3px solid ${gold}`, borderRadius: '50%' }}
          />
        ) : status === 'active' ? (
          <Volume2 size={48} color={gold} style={{ opacity: 0.8 }} />
        ) : (
          <Mic size={48} color={gold} style={{ opacity: 0.5 }} />
        )}
      </motion.div>
    </div>
  )
}

/* ── Chat Messages ────────────────────────────────────── */
function ChatMessages({ messages }: { messages: { role: string; text: string; timestamp: number }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) return null

  return (
    <div
      ref={scrollRef}
      style={{
        maxHeight: 240, overflowY: 'auto', width: '100%', maxWidth: 500,
        margin: '24px auto 0',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: 16,
      }}
    >
      <AnimatePresence>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 10,
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: msg.role === 'user'
                ? `rgba(${goldRgb},0.12)`
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${msg.role === 'user' ? `rgba(${goldRgb},0.2)` : 'rgba(255,255,255,0.06)'}`,
            }}>
              <span style={{ fontSize: 10, color: msg.role === 'user' ? gold : 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {msg.role === 'user' ? 'Deg' : 'Arxon AI'}
              </span>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginTop: 4 }}>{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ── Main Page ────────────────────────────────────────── */
export default function DemoPage() {
  const { lang } = useLanguage()
  const { status, isMuted, volume, messages, start, stop, toggleMute } = useVapi()
  const [showChat, setShowChat] = useState(false)

  const tx = lang === 'no' ? {
    badge: 'Live AI-demo',
    title: 'Snakk med vår',
    titleGold: 'AI-resepsjonist',
    subtitle: 'Trykk på mikrofonen og still et spørsmål. AI-en svarer deg i sanntid — akkurat som den ville svart kundene dine.',
    startBtn: 'Start samtale',
    stopBtn: 'Avslutt samtale',
    muteBtn: 'Demp mikrofon',
    unmuteBtn: 'Aktiver mikrofon',
    connecting: 'Kobler til...',
    active: 'AI lytter — snakk nå',
    idle: 'Trykk for å starte',
    ending: 'Avslutter...',
    showChat: 'Vis transkripsjon',
    hideChat: 'Skjul transkripsjon',
    tryAsk: 'Prøv å spørre:',
    q1: '"Hva er Arxon?"',
    q2: '"Hvilke tjenester tilbyr dere?"',
    q3: '"Hvor mye koster det?"',
    q4: '"Kan jeg booke en kartlegging?"',
    feat1: 'Sanntidssvar',
    feat1d: 'AI svarer på under 2 sekunder',
    feat2: 'Norsk tale',
    feat2d: 'Naturlig norsk stemme og forståelse',
    feat3: 'GDPR-trygt',
    feat3d: 'All data kryptert innen EØS',
    ctaTitle: 'Imponert? Tenk hva den kan gjøre for din bedrift.',
    ctaDesc: 'Denne demoen viser bare en brøkdel. Din AI-resepsjonist skreddersys med dine tjenester, priser og åpningstider.',
    ctaBtn: 'Start gratis kartlegging',
    note: 'Dette er en live demo. AI-en bruker din mikrofon og høyttaler for sanntidssamtale. Tale prosesseres via Deepgram (tale-til-tekst) og ElevenLabs (tekst-til-tale) i EØS/EU. Ingen samtaledata lagres etter at demoen avsluttes.',
  } : {
    badge: 'Live AI demo',
    title: 'Talk to our',
    titleGold: 'AI receptionist',
    subtitle: 'Press the microphone and ask a question. The AI answers in real-time — just like it would answer your customers.',
    startBtn: 'Start conversation',
    stopBtn: 'End conversation',
    muteBtn: 'Mute microphone',
    unmuteBtn: 'Unmute microphone',
    connecting: 'Connecting...',
    active: 'AI is listening — speak now',
    idle: 'Press to start',
    ending: 'Ending...',
    showChat: 'Show transcript',
    hideChat: 'Hide transcript',
    tryAsk: 'Try asking:',
    q1: '"What is Arxon?"',
    q2: '"What services do you offer?"',
    q3: '"How much does it cost?"',
    q4: '"Can I book an assessment?"',
    feat1: 'Real-time answers',
    feat1d: 'AI responds in under 2 seconds',
    feat2: 'Norwegian speech',
    feat2d: 'Natural Norwegian voice and understanding',
    feat3: 'GDPR safe',
    feat3d: 'All data encrypted within EEA',
    ctaTitle: 'Impressed? Imagine what it can do for your business.',
    ctaDesc: 'This demo shows just a fraction. Your AI receptionist is tailored with your services, prices and hours.',
    ctaBtn: 'Start free assessment',
    note: 'This is a live demo. The AI uses your microphone and speaker for real-time conversation. Speech is processed via Deepgram (speech-to-text) and ElevenLabs (text-to-speech) within the EEA/EU. No conversation data is stored after the demo ends.',
  }

  const statusText = {
    idle: tx.idle,
    connecting: tx.connecting,
    active: tx.active,
    ending: tx.ending,
  }[status]

  const handleMainAction = () => {
    if (status === 'idle') start()
    else if (status === 'active') stop()
  }

  return (
    <div style={{ minHeight: '100vh', background: `${bg}`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles(`
        @keyframes pulse-gold { 0%, 100% { box-shadow: 0 0 20px rgba(${goldRgb},0.15); } 50% { box-shadow: 0 0 40px rgba(${goldRgb},0.3); } }
      `)}</style>
      <Nav />

      {/* Hero */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '50px 24px 24px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 30, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.15)`, fontSize: 13, color: gold, marginBottom: 20 }}>
          <Sparkles size={14} />
          {tx.badge}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 14, letterSpacing: '-0.02em' }}>
          {tx.title} <span style={{ color: gold }}>{tx.titleGold}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
          style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: 'rgba(255,255,255,0.45)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
          {tx.subtitle}
        </motion.p>
      </section>

      {/* Voice Interface */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '30px 24px 16px', textAlign: 'center' }}>
        {/* Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, cursor: status === 'connecting' || status === 'ending' ? 'wait' : 'pointer' }}
          onClick={handleMainAction}
        >
          <VoiceOrb status={status} volume={volume} />
        </motion.div>

        {/* Status text */}
        <motion.p
          key={status}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: 14,
            color: status === 'active' ? gold : 'rgba(255,255,255,0.35)',
            fontWeight: status === 'active' ? 600 : 400,
            marginBottom: 20,
          }}
        >
          {statusText}
        </motion.p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {status === 'idle' && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={start}
              className="cta-shimmer"
              style={{
                color: bg, border: 'none', borderRadius: 14, padding: '14px 32px',
                fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <Phone size={16} />
              {tx.startBtn}
            </motion.button>
          )}

          {status === 'active' && (
            <>
              <button onClick={stop} style={{
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 12, padding: '12px 24px', color: '#ef4444',
                fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <PhoneOff size={16} />
                {tx.stopBtn}
              </button>
              <button onClick={toggleMute} style={{
                background: isMuted ? `rgba(${goldRgb},0.12)` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isMuted ? `rgba(${goldRgb},0.25)` : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 12, padding: '12px 18px',
                color: isMuted ? gold : 'rgba(255,255,255,0.5)',
                fontWeight: 500, fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                {isMuted ? tx.unmuteBtn : tx.muteBtn}
              </button>
            </>
          )}

          {(status === 'active' || messages.length > 0) && (
            <button onClick={() => setShowChat(!showChat)} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '12px 18px', color: 'rgba(255,255,255,0.5)',
              fontWeight: 500, fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <MessageSquare size={16} />
              {showChat ? tx.hideChat : tx.showChat}
            </button>
          )}
        </div>

        {/* Chat transcript */}
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <ChatMessages messages={messages} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Suggestions */}
      {status === 'idle' && messages.length === 0 && (
        <section style={{ maxWidth: 500, margin: '0 auto', padding: '20px 24px 40px', textAlign: 'center' }}>
          <motion.p {...fadeUp} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            {tx.tryAsk}
          </motion.p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {[tx.q1, tx.q2, tx.q3, tx.q4].map((q, i) => (
              <motion.span key={i} {...fadeUp} style={{
                fontSize: 12, color: 'rgba(255,255,255,0.35)', padding: '6px 14px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20,
              }}>{q}</motion.span>
            ))}
          </div>
        </section>
      )}

      {/* Feature pills */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '10px 24px 50px' }}>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: Zap, title: tx.feat1, desc: tx.feat1d },
            { icon: Bot, title: tx.feat2, desc: tx.feat2d },
            { icon: Shield, title: tx.feat3, desc: tx.feat3d },
          ].map((f, i) => (
            <motion.div key={i} {...fadeUp} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 14, padding: '18px 16px', textAlign: 'center',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(${goldRgb},0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <f.icon size={18} color={gold} />
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{f.title}</h4>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 30px', textAlign: 'center' }}>
        <motion.div {...fadeUp} style={{
          background: `linear-gradient(135deg, rgba(${goldRgb},0.06) 0%, rgba(${goldRgb},0.02) 100%)`,
          border: `1px solid rgba(${goldRgb},0.15)`, borderRadius: 24, padding: '40px 28px',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 700, marginBottom: 10 }}>
            {tx.ctaTitle}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>
            {tx.ctaDesc}
          </p>
          <button onClick={() => window.location.href = '/kartlegging'} className="cta-shimmer" style={{
            color: bg, border: 'none', borderRadius: 14, padding: '14px 32px',
            fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            {tx.ctaBtn}
            <ArrowRight size={15} style={{ display: 'inline', marginLeft: 8, verticalAlign: 'middle' }} />
          </button>
        </motion.div>
      </section>

      {/* Privacy note */}
      <section style={{ maxWidth: 500, margin: '0 auto', padding: '0 24px 50px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.5 }}>
          {tx.note}
        </p>
      </section>

      <Footer minimal />
    </div>
  )
}
