'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, MotionValue } from 'framer-motion'
import { ArrowRight, Shield, PhoneOff } from 'lucide-react'
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

  const ctaClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Start gratis kartlegging', section: 'hero' })
    router.push('/kartlegging')
  }, [router])

  const bookingClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Book gratis møte', section: 'hero' })
    openBooking()
  }, [openBooking])

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-[100vh] flex items-center justify-center" style={{ background: '#050510' }}>
      {/* Minimal background — subtle gold glow */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 60% 50% at 50% 40%, rgba(${goldRgb},0.04) 0%, transparent 70%)`,
      }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${goldRgb},0.15), transparent)` }} />

      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto px-5 py-24 md:py-0 text-center"
        style={{ y: heroTextY, opacity: heroOpacity }}
      >
        {/* Eyebrow — social proof */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.15)',
          }}
        >
          <PhoneOff size={14} style={{ color: '#ef4444' }} />
          <span className="text-[13px] font-medium" style={{ color: 'rgba(244,241,235,0.7)' }}>
            {no
              ? '62% av norske småbedrifter mister kunder på ubesvarte anrop'
              : '62% of Norwegian SMBs lose customers to missed calls'}
          </span>
        </motion.div>

        {/* ── Main headline — the hook ── */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[36px] sm:text-[48px] md:text-[60px] lg:text-[72px] font-extrabold leading-[1.05] tracking-tight mb-6"
          style={{ color: '#f4f1eb' }}
        >
          {no ? (
            <>
              Kundene dine ringer.
              <br />
              <span style={{ color: gold }}>Ingen svarer.</span>
            </>
          ) : (
            <>
              Your customers are calling.
              <br />
              <span style={{ color: gold }}>Nobody answers.</span>
            </>
          )}
        </motion.h1>

        {/* ── Sub-headline — the solution ── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[17px] md:text-[20px] max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'rgba(244,241,235,0.6)' }}
        >
          {no
            ? 'Arxon gir bedriften din en AI-medarbeider som svarer telefonen, booker møter og følger opp kunder — 24 timer i døgnet. Klar på under 14 dager.'
            : 'Arxon gives your business an AI employee that answers calls, books meetings, and follows up customers — 24/7. Ready in under 14 days.'}
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <button
            onClick={ctaClick}
            className="cta-shimmer rounded-xl py-4 px-10 text-[16px] font-bold inline-flex items-center gap-2 group"
            style={{ color: '#0f1b27' }}
            aria-label={no ? 'Start gratis kartlegging' : 'Start free assessment'}
          >
            {no ? 'Finn ut hva du taper — gratis' : 'Find out what you\'re losing — free'}
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={bookingClick}
            className="rounded-xl py-4 px-10 text-[16px] font-bold inline-flex items-center gap-2 group transition-all duration-300 hover:scale-[1.02]"
            style={{ background: 'transparent', border: `1px solid rgba(${goldRgb},0.3)`, color: gold }}
            data-cal-namespace="gratis-ai-konsultasjon"
            data-cal-link="arxon/gratis-ai-konsultasjon"
            data-cal-config='{"layout":"month_view"}'
          >
            {no ? 'Snakk med oss' : 'Talk to us'}
          </button>
        </motion.div>

        {/* ── Trust line ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 text-[12px]"
          style={{ color: 'rgba(244,241,235,0.4)' }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Shield size={12} style={{ color: gold }} /> GDPR
          </span>
          <span style={{ color: 'rgba(244,241,235,0.15)' }}>·</span>
          <span>{no ? 'Norsk support' : 'Norwegian support'}</span>
          <span style={{ color: 'rgba(244,241,235,0.15)' }}>·</span>
          <span>{no ? 'Ingen binding' : 'No commitment'}</span>
          <span style={{ color: 'rgba(244,241,235,0.15)' }}>·</span>
          <span>{no ? 'Gratis kartlegging' : 'Free assessment'}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
