'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, MotionValue } from 'framer-motion'
import {
  ArrowRight, Shield, ChevronDown,
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
    trackEvent('CTA_Click', { button_text: 'Start gratis kartlegging', section: 'page' })
    router.push('/kartlegging')
  }, [router])

  const bookingClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Book gratis møte', section: 'hero' })
    openBooking()
  }, [openBooking])

  return (
    <section ref={heroRef} className="pt-8 md:pt-20 pb-16 md:pb-28 text-center relative overflow-hidden min-h-[85vh] flex flex-col justify-center">
      <div className="hero-gradient-mesh" />
      <div className="hero-orb" />
      <div className="hero-orb-accent hero-orb-accent-1" />
      <div className="hero-orb-accent hero-orb-accent-2" />
      <div className="hero-particles" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`hero-particle hero-particle-${i + 1}`} />
        ))}
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(244,241,235,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,235,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${goldRgb},0.15), transparent)` }} />

      <motion.div className="relative z-10 max-w-3xl mx-auto px-5" style={{ y: heroTextY, opacity: heroOpacity }}>
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass-card">
          <Shield size={13} style={{ color: gold }} className="anim-spin-slow" />
          <span className="text-[12px] tracking-wide" style={{ color: 'rgba(244,241,235,0.7)' }}>{no ? 'GDPR-kompatibel · Norsk support · Live på ca. 14 dager' : 'GDPR compliant · Norwegian support · Live in ~14 days'}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-[36px] md:text-[60px] font-extrabold leading-[1.08] tracking-tight mb-6"
          style={{ color: '#f4f1eb' }}>
          {no ? 'Spar 15–20 timer i uken med' : 'Save 15–20 hours a week with'}{' '}
          <span className="text-gradient-gold anim-gradient-shift">{no ? 'AI som jobber for deg' : 'AI that works for you'}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[16px] md:text-[18px] max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'rgba(244,241,235,0.7)' }}>
          {no
            ? 'Små bedrifter taper 15 000–25 000 kr/mnd på ubesvarte anrop og manuelt arbeid. Arxon automatiserer telefon, booking og oppfølging — slik at du kan fokusere på kundene.'
            : 'Small businesses lose 15,000–25,000 NOK/month on missed calls and manual work. Arxon automates phone, booking, and follow-up — so you can focus on your customers.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={ctaClick} className="gold-btn gold-btn-pulse rounded-xl py-4 px-10 text-[16px] font-bold inline-flex items-center gap-2 group"
              aria-label="Prøv kartlegging gratis — ingen binding">
              {no ? 'Prøv kartlegging gratis' : 'Try assessment free'} <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={bookingClick}
              className="rounded-xl py-4 px-10 text-[16px] font-bold inline-flex items-center gap-2 group transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'transparent',
                border: `1px solid rgba(${goldRgb},0.4)`,
                color: gold,
              }}
              aria-label="Book gratis AI-konsultasjon"
              data-cal-namespace="gratis-ai-konsultasjon"
              data-cal-link="arxon/gratis-ai-konsultasjon"
              data-cal-config='{"layout":"month_view"}'
            >
              {no ? 'Book gratis møte' : 'Book free meeting'}
            </button>
          </div>
          <p className="text-[12px] mt-4" style={{ color: 'rgba(244,241,235,0.55)' }}>
            {no ? 'Gratis · Uforpliktende · Resultat på 2–3 min' : 'Free · No obligation · Results in 2–3 min'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] uppercase tracking-wide mr-2" style={{ color: 'rgba(244,241,235,0.4)' }}>{no ? 'Populært i:' : 'Popular in:'}</span>
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
                color: 'rgba(244,241,235,0.6)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <ind.icon size={12} />
              {ind.label}
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => document.getElementById('trust-bar')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll ned for mer informasjon"
          role="button" tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('trust-bar')?.scrollIntoView({ behavior: 'smooth' }) }}
        >
          <span className="text-[11px] tracking-widest uppercase" style={{ color: 'rgba(244,241,235,0.4)' }}>{no ? 'Scroll ned' : 'Scroll down'}</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ChevronDown size={20} style={{ color: 'rgba(244,241,235,0.35)' }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
