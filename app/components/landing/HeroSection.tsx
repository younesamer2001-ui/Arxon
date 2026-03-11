'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, MotionValue } from 'framer-motion'
import { ArrowRight, Shield } from 'lucide-react'
import { gold, goldRgb } from '@/lib/constants'
import { useLanguage } from '@/lib/language-context'
import { useGeo } from '@/lib/geo-context'
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
  const { geo } = useGeo()
  const openBooking = useCalBooking()

  // City-personalised solution line
  const cityTag = geo.city && geo.country === 'NO'
    ? (no ? `for bedrifter i ${geo.city}` : `for businesses in ${geo.city}`)
    : null

  const ctaClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Finn dine 20 timer', section: 'hero' })
    router.push('/kartlegging')
  }, [router])

  const bookingClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Snakk med oss', section: 'hero' })
    openBooking()
  }, [openBooking])

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-[100svh] flex items-center justify-center" style={{ background: '#050510' }}>
      {/* Subtle background glow */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 50% 40% at 50% 45%, rgba(${goldRgb},0.035) 0%, transparent 70%)`,
      }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${goldRgb},0.12), transparent)` }} />

      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto px-5 py-24 md:py-0 text-center"
        style={{ y: heroTextY, opacity: heroOpacity }}
      >
        {/* ── THE NUMBER — anchoring, pattern interrupt ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-3"
        >
          <span
            className="text-[60px] sm:text-[80px] md:text-[110px] lg:text-[140px] font-black leading-none tracking-tighter"
            style={{
              background: `linear-gradient(135deg, ${gold}, #ffd699, ${gold})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {no ? '20 timer' : '20 hours'}
          </span>
        </motion.div>

        {/* ── THE PAIN — personal, self-reflective ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-[22px] sm:text-[28px] md:text-[36px] font-semibold leading-snug mb-10 tracking-tight"
          style={{ color: '#f4f1eb' }}
        >
          {no
            ? 'i uka bruker du på oppgaver AI gjør bedre.'
            : 'a week you spend on tasks AI does better.'}
        </motion.h1>

        {/* ── THE SOLUTION — broad, covers everything ── */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-[15px] md:text-[18px] max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'rgba(244,241,235,0.5)' }}
        >
          {no
            ? `Telefon, booking, oppfølging, admin, markedsføring — Arxon automatiserer det som bremser bedriften din.${cityTag ? ` Skreddersydd ${cityTag}.` : ''} 75+ ferdige løsninger. Klar på 14 dager.`
            : `Phone, booking, follow-up, admin, marketing — Arxon automates what slows your business down.${cityTag ? ` Tailored ${cityTag}.` : ''} 75+ ready-made solutions. Ready in 14 days.`}
        </motion.p>

        {/* ── CTAs — curiosity-driven ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <button
            onClick={ctaClick}
            className="gold-btn gold-btn-pulse rounded-xl py-4 px-10 text-[16px] font-bold inline-flex items-center gap-2 group"
            aria-label={no ? 'Finn dine 20 timer' : 'Find your 20 hours'}
          >
            {no ? 'Finn dine 20 timer — gratis' : 'Find your 20 hours — free'}
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={bookingClick}
            className="rounded-xl py-4 px-10 text-[16px] font-bold inline-flex items-center gap-2 group transition-all duration-300 hover:scale-[1.02]"
            style={{ background: 'transparent', border: `1px solid rgba(${goldRgb},0.25)`, color: gold }}
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
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-4 text-[12px]"
          style={{ color: 'rgba(244,241,235,0.35)' }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Shield size={12} style={{ color: gold }} /> GDPR
          </span>
          <span style={{ color: 'rgba(244,241,235,0.12)' }}>·</span>
          <span>{no ? 'Norsk support' : 'Norwegian support'}</span>
          <span style={{ color: 'rgba(244,241,235,0.12)' }}>·</span>
          <span>{no ? 'Ingen binding' : 'No commitment'}</span>
          <span style={{ color: 'rgba(244,241,235,0.12)' }}>·</span>
          <span>{no ? '75+ automatiseringer' : '75+ automations'}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
