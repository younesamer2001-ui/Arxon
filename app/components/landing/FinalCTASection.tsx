'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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

const sAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export function FinalCTASection() {
  const router = useRouter()
  const { lang } = useLanguage()
  const no = lang === 'no'
  const { geo } = useGeo()

  const cityTag = geo.city && geo.country === 'NO'
    ? (no ? `i ${geo.city}` : `in ${geo.city}`)
    : null

  const openBooking = useCalBooking()

  const ctaClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Start gratis kartlegging', section: 'final_cta' })
    router.push('/kartlegging')
  }, [router])

  const bookingClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Book gratis møte', section: 'final_cta' })
    openBooking()
  }, [openBooking])

  return (
    <section className="py-16 md:py-32 relative overflow-hidden" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      <div className="cta-glow" />
      <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
        <motion.div {...sAnim}>
          <motion.h2
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[28px] md:text-[48px] font-bold tracking-tight mb-4" style={{ color: '#f4f1eb' }}>
            {no ? 'Slutt å tape kunder.' : 'Stop losing customers.'}
            <br />
            <span className="text-gradient-gold anim-gradient-shift">{no ? 'Start i dag.' : 'Start today.'}</span>
          </motion.h2>
          <p className="text-[15px] mb-8 max-w-md mx-auto" style={{ color: 'rgba(244,241,235,0.6)' }}>
            {no
              ? `Gratis kartlegging. Ingen binding. Implementert på ca. 14 dager.${cityTag ? ` Lokalt tilpasset ${cityTag}.` : ''}`
              : `Free assessment. No commitment. Implemented in ~14 days.${cityTag ? ` Locally tailored ${cityTag}.` : ''}`}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <button onClick={ctaClick} className="gold-btn gold-btn-pulse rounded-xl py-4 px-12 text-[16px] font-bold inline-flex items-center gap-2 group">
              {no ? 'Start gratis kartlegging' : 'Start free assessment'} <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={bookingClick}
              className="rounded-xl py-4 px-10 text-[16px] font-bold inline-flex items-center gap-2 group transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'transparent',
                border: `1px solid rgba(${goldRgb},0.4)`,
                color: gold,
              }}
              data-cal-namespace="gratis-ai-konsultasjon"
              data-cal-link="arxon/gratis-ai-konsultasjon"
              data-cal-config='{"layout":"month_view"}'
            >
              {no ? 'Book gratis møte' : 'Book free meeting'}
            </button>
          </div>
          <p className="text-[12px] mt-4" style={{ color: 'rgba(244,241,235,0.7)' }}>
            {no ? 'Eller ring oss:' : 'Or call us:'} <a href="tel:+4778896386" className="no-underline" style={{ color: gold }}
              onClick={() => trackEvent('Phone_Click', { section: 'final_cta' })}>78 89 63 86</a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
