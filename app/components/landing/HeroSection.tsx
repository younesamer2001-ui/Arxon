'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, MotionValue } from 'framer-motion'
import { ArrowRight, Shield } from 'lucide-react'
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
    trackEvent('CTA_Click', { button_text: 'Se hva du taper', section: 'hero' })
    router.push('/kartlegging')
  }, [router])

  const bookingClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Snakk med oss', section: 'hero' })
    openBooking()
  }, [openBooking])

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-[100vh] flex items-center justify-center" style={{ background: '#050510' }}>
      {/* Subtle background glow */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 50% 40% at 50% 45%, rgba(${goldRgb},0.035) 0%, transparent 70%)`,
      }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${goldRgb},0.12), transparent)` }} />

      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto px-5 py-24 md:py-0 text-center"
        style={{ y: heroTextY, opacity: heroOpacity }}
      >
        {/* ── THE NUMBER — pattern interrupt, anchoring bias ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span
            className="text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] font-black leading-none tracking-tighter"
            style={{
              background: `linear-gradient(135deg, ${gold}, #ffd699, ${gold})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {no ? '23 000 kr' : '23 000 NOK'}
          </span>
        </motion.div>

        {/* ── THE PAIN — loss aversion, specificity ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-[20px] sm:text-[24px] md:text-[30px] font-medium leading-snug mb-3 tracking-tight"
          style={{ color: 'rgba(244,241,235,0.55)' }}
        >
          {no ? 'i måneden.' : 'per month.'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[20px] sm:text-[24px] md:text-[30px] font-semibold leading-snug mb-10"
          style={{ color: '#f4f1eb' }}
        >
          {no
            ? 'Tapt av norske bedrifter som ikke svarer telefonen.'
            : 'Lost by Norwegian businesses that don\'t answer the phone.'}
        </motion.p>

        {/* ── THE TWIST — curiosity gap + solution ── */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-[16px] md:text-[18px] max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'rgba(244,241,235,0.5)' }}
        >
          {no
            ? 'Arxon gir deg en AI-ansatt som svarer, booker og følger opp — døgnet rundt. Klar på 14 dager. Null risiko.'
            : 'Arxon gives you an AI employee that answers, books, and follows up — 24/7. Ready in 14 days. Zero risk.'}
        </motion.p>

        {/* ── CTAs — curiosity-driven primary ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <button
            onClick={ctaClick}
            className="gold-btn gold-btn-pulse rounded-xl py-4 px-10 text-[16px] font-bold inline-flex items-center gap-2 group"
            aria-label={no ? 'Se hva du taper' : 'See what you\'re losing'}
          >
            {no ? 'Se hva du taper — gratis' : 'See what you\'re losing — free'}
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
          transition={{ duration: 0.5, delay: 0.75 }}
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
          <span>{no ? 'Gratis kartlegging' : 'Free assessment'}</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
