'use client'

import { motion } from 'framer-motion'
import { X, CheckCircle2, Check } from 'lucide-react'
import { goldRgb } from '@/lib/constants'
import { useLanguage } from '@/lib/language-context'

const sAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  viewport: { once: true },
}

const staggerChild = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function BeforeAfterSection() {
  const { lang } = useLanguage()
  const no = lang === 'no'

  return (
    <section className="py-14 md:py-28" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      <div className="max-w-4xl mx-auto px-5">
        <motion.div {...sAnim} className="text-center mb-8 md:mb-14">
          <h2 className="text-[24px] md:text-[42px] font-bold tracking-tight mb-4" style={{ color: '#f4f1eb' }}>
            {no ? 'Før og etter' : 'Before and after'} <span className="text-gradient-gold">Arxon</span>
          </h2>
        </motion.div>

        <motion.div {...staggerContainer} className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <motion.div variants={staggerChild} className="glass-card p-6 md:p-8 hover-lift" style={{ borderColor: 'rgba(239,69,69,0.15)' }}>
            <div className="flex items-center gap-2 mb-6">
              <X size={18} style={{ color: '#ef4545' }} />
              <span className="text-[14px] font-bold uppercase tracking-wide" style={{ color: '#ef4545' }}>{no ? 'Uten Arxon' : 'Without Arxon'}</span>
            </div>
            <div className="space-y-4">
              {(no ? [
                'Mister 30–50% av innkommende anrop',
                '15–20 timer/uke på manuelt arbeid',
                'Kunder venter dager på svar',
                'Glemmer oppfølging av leads',
                'Fakturering tar timer hver uke',
                'Ingen oversikt over tapte muligheter',
              ] : [
                'Lose 30–50% of incoming calls',
                '15–20 hours/week on manual work',
                'Customers wait days for a response',
                'Forget to follow up on leads',
                'Invoicing takes hours every week',
                'No overview of lost opportunities',
              ]).map((item, i) => (
                <div key={i} className={`flex items-start gap-3${i >= 4 ? ' hidden md:flex' : ''}`}>
                  <X size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'rgba(239,69,69,0.6)' }} />
                  <span className="text-[13px] leading-relaxed" style={{ color: 'rgba(244,241,235,0.6)' }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div variants={staggerChild} className="glass-card p-6 md:p-8 hover-lift" style={{ borderColor: `rgba(${goldRgb},0.2)`, background: `rgba(${goldRgb},0.02)` }}>
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 size={18} style={{ color: '#4ade80' }} />
              <span className="text-[14px] font-bold uppercase tracking-wide" style={{ color: '#4ade80' }}>{no ? 'Med Arxon' : 'With Arxon'}</span>
            </div>
            <div className="space-y-4">
              {(no ? [
                'AI svarer alle anrop 24/7 — 0% tapte',
                'Spar 15+ timer/uke med automatisering',
                'Kundene får svar på sekunder',
                'Automatisk oppfølging av hver lead',
                'Fakturering sendes automatisk',
                'Full oversikt over ROI og resultater',
              ] : [
                'AI answers all calls 24/7 — 0% missed',
                'Save 15+ hours/week with automation',
                'Customers get answers in seconds',
                'Automatic follow-up on every lead',
                'Invoicing sent automatically',
                'Full overview of ROI and results',
              ]).map((item, i) => (
                <div key={i} className={`flex items-start gap-3${i >= 4 ? ' hidden md:flex' : ''}`}>
                  <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#4ade80' }} />
                  <span className="text-[13px] leading-relaxed" style={{ color: 'rgba(244,241,235,0.75)' }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
