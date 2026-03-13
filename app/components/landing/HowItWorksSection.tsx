'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ClipboardList, FileText, Zap, ArrowRight } from 'lucide-react'
import { gold, goldRgb } from '@/lib/constants'
import { useLanguage } from '@/lib/language-context'

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

import { SpotlightCard } from '@/app/components/ui/SpotlightCard'

const sAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export function HowItWorksSection() {
  const router = useRouter()
  const { lang } = useLanguage()
  const no = lang === 'no'

  const ctaClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Start kartleggingen nå', section: 'how_it_works' })
    router.push('/kartlegging')
  }, [router])

  return (
    <section className="py-14 md:py-28" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      <div className="max-w-2xl mx-auto px-5">
        <motion.div {...sAnim} className="text-center mb-10 md:mb-16">
          <h2 className="text-[28px] md:text-[42px] font-bold tracking-tight mb-4" style={{ color: '#f4f1eb' }}>
            {no ? 'Tre steg til' : 'Three steps to'} <span className="text-gradient-gold">{no ? 'full automatisering' : 'full automation'}</span>
          </h2>
          <p className="text-[15px] max-w-md mx-auto" style={{ color: 'rgba(244,241,235,0.6)' }}>{no ? 'Enklere enn du tror. Vi gjør alt det tekniske.' : 'Easier than you think. We handle all the technical work.'}</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, rgba(${goldRgb},0.3), rgba(${goldRgb},0.05))` }} />

          {(no ? [
            { step: 1, icon: <ClipboardList size={20} />, title: 'Gratis kartlegging', time: '2 minutter', desc: 'Svar på noen enkle spørsmål. Vår AI analyserer dine behov og finner automatiseringene med størst effekt.' },
            { step: 2, icon: <FileText size={20} />, title: 'Skreddersydd AI-forslag', time: 'Umiddelbart', desc: 'Du får en komplett oversikt over prosesser vi kan automatisere, forventet besparelse og en tydelig prioriteringsliste.' },
            { step: 3, icon: <Zap size={20} />, title: 'Vi implementerer alt', time: 'Ca. 14 dager', desc: 'Vi setter opp alt fra A til Å. Du trenger ikke gjøre noe teknisk — bare gi oss tilgang, så fikser vi resten.' },
          ] : [
            { step: 1, icon: <ClipboardList size={20} />, title: 'Free assessment', time: '2 minutes', desc: 'Answer a few simple questions. Our AI analyzes your needs and finds the automations with the biggest impact.' },
            { step: 2, icon: <FileText size={20} />, title: 'Tailored AI proposal', time: 'Instant', desc: 'You get a complete overview of processes we can automate, expected savings, and a clear priority list.' },
            { step: 3, icon: <Zap size={20} />, title: 'We implement everything', time: '~14 days', desc: 'We set up everything from A to Z. You don\'t need to do anything technical — just give us access and we handle the rest.' },
          ]).map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -30, scale: 0.97 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative pl-16 md:pl-20 pb-12 last:pb-0"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.2 + 0.1, type: 'spring', stiffness: 200 }}
                className="absolute left-0 md:left-2 w-12 h-12 rounded-full flex items-center justify-center z-10"
                style={{ background: `rgba(${goldRgb},0.1)`, border: `1px solid rgba(${goldRgb},0.25)` }}>
                <span className="text-sm font-bold" style={{ color: gold }}>{item.step}</span>
              </motion.div>

              <SpotlightCard className="glass-card p-6" style={{ cursor: 'default' }}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2 relative z-10">
                  <h3 className="text-[16px] font-bold flex items-center gap-2" style={{ color: '#f4f1eb' }}>
                    <span style={{ color: gold }}>{item.icon}</span> {item.title}
                  </h3>
                  <span className="text-[11px] px-3 py-1 rounded-full font-medium"
                    style={{ background: `rgba(${goldRgb},0.08)`, color: gold, border: `1px solid rgba(${goldRgb},0.15)` }}>
                    {item.time}
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed relative z-10" style={{ color: 'rgba(244,241,235,0.65)' }}>{item.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <motion.div {...sAnim} className="text-center mt-12">
          <button onClick={ctaClick} className="gold-btn rounded-xl py-4 px-8 text-[15px] font-bold inline-flex items-center gap-2">
            {no ? 'Start kartleggingen nå' : 'Start the assessment now'} <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
