'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, MotionValue, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Shield, ChevronDown,
  Phone, MessageSquare, Calendar, TrendingUp,
  Hammer, Home as HomeIcon, Scissors, Car, Plane,
} from 'lucide-react'
import { gold, goldRgb } from '@/lib/constants'
import { useLanguage } from '@/lib/language-context'
import { useCalBooking } from '@/lib/useCalBooking'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function trackEvent(eventName: string, params?: Record<string, string | number>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, { page_location: window.location.href, ...params })
  }
}

/* ── Animated money counter — shows "money being lost" in real time ── */
function useLiveCounter(perSecond: number) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + perSecond)
    }, 1000)
    return () => clearInterval(interval)
  }, [perSecond])
  return count
}

/* ── Typewriter hook ── */
function useTypewriter(words: string[], typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.slice(0, text.length + 1))
        if (text.length + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        setText(currentWord.slice(0, text.length - 1))
        if (text.length === 0) {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime])

  return text
}

/* ── Mini chat demo messages ── */
const chatMessages = [
  { type: 'incoming', icon: Phone, text: 'Innkommende anrop...', delay: 0 },
  { type: 'ai', icon: MessageSquare, text: 'AI svarer på 0.3s — booker time automatisk', delay: 1.5 },
  { type: 'action', icon: Calendar, text: 'Møte booket: Torsdag 14:00', delay: 3 },
  { type: 'result', icon: TrendingUp, text: '+2 450 kr spart', delay: 4.5 },
]

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLElement>
  heroTextY: MotionValue<number>
  heroOpacity: MotionValue<number>
}

export function HeroSection({ heroRef, heroTextY, heroOpacity }: HeroSectionProps) {
  const router = useRouter()
  const { lang } = useLanguage()
  const no = lang === 'no'
  const openBooking = useCalBooking()

  // ~8 kr per second ≈ 25,000 kr/month lost for avg small business
  const lostKr = useLiveCounter(8)

  const typewriterWords = no
    ? ['svarer telefonen', 'booker møter', 'følger opp leads', 'sender tilbud', 'håndterer support']
    : ['answers the phone', 'books meetings', 'follows up leads', 'sends quotes', 'handles support']
  const typed = useTypewriter(typewriterWords, 70, 35, 1800)

  // Chat demo auto-play
  const [visibleMessages, setVisibleMessages] = useState(0)
  const chatCycleRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let step = 0
    const delays = [1200, 1500, 1500, 1500, 2000] // last = reset pause

    const runStep = () => {
      if (step < chatMessages.length) {
        setVisibleMessages(step + 1)
        step++
        chatCycleRef.current = setTimeout(runStep, delays[step] || 1500)
      } else {
        // Reset and loop
        chatCycleRef.current = setTimeout(() => {
          setVisibleMessages(0)
          step = 0
          chatCycleRef.current = setTimeout(runStep, 800)
        }, 2500)
      }
    }

    chatCycleRef.current = setTimeout(runStep, 1500)
    return () => { if (chatCycleRef.current) clearTimeout(chatCycleRef.current) }
  }, [])

  const ctaClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Start gratis kartlegging', section: 'hero' })
    router.push('/kartlegging')
  }, [router])

  const bookingClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Book gratis møte', section: 'hero' })
    openBooking()
  }, [openBooking])

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-[100vh] flex items-center" style={{ background: '#050510' }}>
      {/* ── Background layers ── */}
      <div className="hero-grid-overlay" />
      <div className="hero-glow-top" />
      <div className="hero-glow-bottom" />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${goldRgb},0.2), transparent)` }} />

      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-5 py-20 md:py-0"
        style={{ y: heroTextY, opacity: heroOpacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left: Copy ── */}
          <div className="text-left">
            {/* Live urgency counter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="hero-live-dot" />
              <span className="text-[13px] font-medium tracking-wide" style={{ color: 'rgba(244,241,235,0.5)' }}>
                {no ? 'Norske SMBer taper nå' : 'Norwegian SMBs are losing'}
              </span>
              <span className="text-[15px] font-bold tabular-nums" style={{ color: '#ef4444' }}>
                {lostKr.toLocaleString('nb-NO')} kr
              </span>
              <span className="text-[13px]" style={{ color: 'rgba(244,241,235,0.4)' }}>
                {no ? 'på ubesvarte anrop' : 'on missed calls'}
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[38px] md:text-[56px] lg:text-[64px] font-extrabold leading-[1.05] tracking-tight mb-2"
              style={{ color: '#f4f1eb' }}
            >
              {no ? 'AI som' : 'AI that'}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[38px] md:text-[56px] lg:text-[64px] font-extrabold leading-[1.05] tracking-tight mb-6"
            >
              <span className="text-gradient-gold anim-gradient-shift">{typed}</span>
              <span className="hero-cursor" style={{ color: gold }}>|</span>
            </motion.div>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-[17px] md:text-[19px] max-w-lg mb-8 leading-relaxed"
              style={{ color: 'rgba(244,241,235,0.65)' }}
            >
              {no
                ? 'Spar 15–20 timer i uken. Arxon automatiserer telefon, booking og oppfølging — live på 14 dager.'
                : 'Save 15–20 hours per week. Arxon automates phone, booking, and follow-up — live in 14 days.'}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-start gap-3 mb-6"
            >
              <button onClick={ctaClick} className="gold-btn gold-btn-pulse rounded-xl py-4 px-10 text-[16px] font-bold inline-flex items-center gap-2 group"
                aria-label="Start gratis kartlegging">
                {no ? 'Start gratis kartlegging' : 'Start free assessment'} <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                onClick={bookingClick}
                className="rounded-xl py-4 px-10 text-[16px] font-bold inline-flex items-center gap-2 group transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'transparent', border: `1px solid rgba(${goldRgb},0.35)`, color: gold }}
                data-cal-namespace="gratis-ai-konsultasjon"
                data-cal-link="arxon/gratis-ai-konsultasjon"
                data-cal-config='{"layout":"month_view"}'
              >
                {no ? 'Book gratis møte' : 'Book free meeting'}
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 text-[12px]"
              style={{ color: 'rgba(244,241,235,0.45)' }}
            >
              <span className="inline-flex items-center gap-1.5">
                <Shield size={12} style={{ color: gold }} /> GDPR
              </span>
              <span>·</span>
              <span>{no ? 'Norsk support' : 'Norwegian support'}</span>
              <span>·</span>
              <span>{no ? 'Live på ~14 dager' : 'Live in ~14 days'}</span>
              <span>·</span>
              <span>{no ? 'Ingen binding' : 'No commitment'}</span>
            </motion.div>
          </div>

          {/* ── Right: Live AI Demo Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="hero-demo-card">
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(244,241,235,0.06)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.5)' }} />
                  <span className="text-[12px] font-semibold tracking-wider uppercase" style={{ color: 'rgba(244,241,235,0.5)' }}>
                    {no ? 'AI-assistent — Live' : 'AI Assistant — Live'}
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                  Online
                </span>
              </div>

              {/* Chat messages */}
              <div className="px-5 py-4 space-y-3 min-h-[220px]">
                <AnimatePresence>
                  {chatMessages.slice(0, visibleMessages).map((msg, i) => {
                    const Icon = msg.icon
                    const colors: Record<string, { bg: string; border: string; icon: string; text: string }> = {
                      incoming: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', icon: '#3b82f6', text: 'rgba(244,241,235,0.8)' },
                      ai: { bg: `rgba(${goldRgb},0.08)`, border: `rgba(${goldRgb},0.2)`, icon: gold, text: 'rgba(244,241,235,0.8)' },
                      action: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', icon: '#22c55e', text: 'rgba(244,241,235,0.8)' },
                      result: { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)', icon: '#a855f7', text: 'rgba(244,241,235,0.8)' },
                    }
                    const c = colors[msg.type]
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                        style={{ background: c.bg, border: `1px solid ${c.border}` }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${c.bg}` }}>
                          <Icon size={16} style={{ color: c.icon }} />
                        </div>
                        <span className="text-[13px] font-medium" style={{ color: c.text }}>{msg.text}</span>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {visibleMessages < chatMessages.length && visibleMessages > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1.5 px-3 py-2"
                  >
                    <span className="hero-typing-dot" />
                    <span className="hero-typing-dot" style={{ animationDelay: '0.15s' }} />
                    <span className="hero-typing-dot" style={{ animationDelay: '0.3s' }} />
                  </motion.div>
                )}
              </div>

              {/* Card footer */}
              <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(244,241,235,0.06)' }}>
                <span className="text-[11px]" style={{ color: 'rgba(244,241,235,0.35)' }}>
                  {no ? 'Automatisert med Arxon AI' : 'Automated with Arxon AI'}
                </span>
                <span className="text-[11px] font-medium" style={{ color: gold }}>
                  {no ? '0 ventetid' : '0 wait time'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom: Industry pills + scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 lg:mt-16 flex flex-wrap items-center justify-center lg:justify-start gap-2"
        >
          <span className="text-[11px] uppercase tracking-wide mr-2" style={{ color: 'rgba(244,241,235,0.35)' }}>
            {no ? 'Populært i:' : 'Popular in:'}
          </span>
          {(no ? [
            { icon: Hammer, label: 'Bygg' },
            { icon: HomeIcon, label: 'Eiendom' },
            { icon: Scissors, label: 'Salong' },
            { icon: Car, label: 'Bil' },
            { icon: Plane, label: 'Reiseliv' },
          ] : [
            { icon: Hammer, label: 'Construction' },
            { icon: HomeIcon, label: 'Real Estate' },
            { icon: Scissors, label: 'Salon' },
            { icon: Car, label: 'Automotive' },
            { icon: Plane, label: 'Travel' },
          ]).map((ind) => (
            <Link key={ind.label} href="/bransjer" className="industry-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(244,241,235,0.5)',
                textDecoration: 'none',
              }}
            >
              <ind.icon size={12} />
              {ind.label}
            </Link>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8 flex flex-col items-center lg:items-start gap-1 cursor-pointer"
          onClick={() => document.getElementById('trust-bar')?.scrollIntoView({ behavior: 'smooth' })}
          role="button" tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('trust-bar')?.scrollIntoView({ behavior: 'smooth' }) }}
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ChevronDown size={20} style={{ color: 'rgba(244,241,235,0.25)' }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
