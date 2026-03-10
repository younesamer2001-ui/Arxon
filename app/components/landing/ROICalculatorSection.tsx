'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { gold, goldRgb, bg } from '@/lib/constants'
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

const roiData: Record<string, { avgDeal: number; conversion: number }> = {
  'Bygg & Håndverk': { avgDeal: 85000, conversion: 0.18 },
  'Eiendomsmegling': { avgDeal: 65000, conversion: 0.12 },
  'Salong & Skjønnhet': { avgDeal: 950, conversion: 0.65 },
  'Bilverksted & Bilforhandler': { avgDeal: 8500, conversion: 0.40 },
  'Reiseliv & Overnatting': { avgDeal: 4200, conversion: 0.50 },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const sAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export function ROICalculatorSection() {
  const router = useRouter()
  const { lang } = useLanguage()
  const no = lang === 'no'

  const [roiIndustry, setRoiIndustry] = useState('Bygg & Håndverk')
  const [missedCalls, setMissedCalls] = useState(8)
  const roiEntry = roiData[roiIndustry] || roiData['Bygg & Håndverk']
  const monthlySavings = Math.round(missedCalls * 4.3 * roiEntry.avgDeal * roiEntry.conversion)

  const ctaClick = useCallback(() => {
    trackEvent('CTA_Click', { button_text: 'Stopp tapet — få gratis analyse', section: 'roi_calculator' })
    router.push('/kartlegging')
  }, [router])

  return (
    <section className="py-14 md:py-28" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      <div className="max-w-xl mx-auto px-5">
        <motion.div {...sAnim} className="text-center mb-8 md:mb-10">
          <h2 className="text-[24px] md:text-[36px] font-bold tracking-tight mb-4" style={{ color: '#f4f1eb' }}>
            {no ? 'Hva taper' : 'What are'} <span className="text-gradient-gold">{no ? 'du' : 'you'}</span> {no ? 'per måned?' : 'losing per month?'}
          </h2>
          <p className="text-[15px] max-w-md mx-auto" style={{ color: 'rgba(244,241,235,0.6)' }}>{no ? 'Beregn ditt potensielle tap — og hva Arxon kan spare deg.' : 'Calculate your potential loss — and what Arxon can save you.'}</p>
        </motion.div>

        <motion.div {...scaleIn} className="glass-card p-6 md:p-8" role="form" aria-label="ROI-kalkulator">
          <label className="block mb-4" htmlFor="roi-industry">
            <span className="text-[12px] uppercase tracking-wide" style={{ color: 'rgba(244,241,235,0.55)' }}>{no ? 'Bransje' : 'Industry'}</span>
            <select id="roi-industry" value={roiIndustry} onChange={(e) => setRoiIndustry(e.target.value)}
              className="mt-2 w-full rounded-lg px-4 py-3 text-[14px] outline-none"
              aria-label="Velg din bransje"
              style={{ background: 'rgba(244,241,235,0.04)', border: '1px solid rgba(244,241,235,0.08)', color: 'rgba(244,241,235,0.8)' }}>
              {Object.keys(roiData).map((k) => <option key={k} value={k} style={{ background: bg }}>{k}</option>)}
            </select>
          </label>

          <label className="block mb-6" htmlFor="roi-calls">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] uppercase tracking-wide" style={{ color: 'rgba(244,241,235,0.55)' }}>{no ? 'Ubesvarte anrop per uke' : 'Missed calls per week'}</span>
              <span className="text-[14px] font-bold" style={{ color: gold }} aria-live="polite">{missedCalls}</span>
            </div>
            <input id="roi-calls" type="range" min={1} max={30} value={missedCalls} onChange={(e) => setMissedCalls(+e.target.value)}
              className="w-full" style={{ accentColor: gold }}
              aria-label={`Ubesvarte anrop per uke: ${missedCalls}`}
              aria-valuemin={1} aria-valuemax={30} aria-valuenow={missedCalls} />
          </label>

          <div className="text-center py-6 rounded-xl relative overflow-hidden" style={{ background: `rgba(${goldRgb},0.04)`, border: `1px solid rgba(${goldRgb},0.1)` }}
            aria-live="polite" aria-atomic="true">
            <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'rgba(244,241,235,0.55)' }}>{no ? 'Estimert månedlig tap' : 'Estimated monthly loss'}</div>
            <div className="text-[36px] md:text-[44px] font-extrabold text-gradient-gold">
              {monthlySavings.toLocaleString('nb-NO')} kr
            </div>
            <div className="text-[12px] mt-1" style={{ color: 'rgba(244,241,235,0.55)' }}>
              ≈ {Math.round(monthlySavings / 4.3).toLocaleString('nb-NO')} kr {no ? 'per uke' : 'per week'}
            </div>
          </div>

          <button onClick={ctaClick} className="gold-btn w-full rounded-xl py-4 mt-6 text-[15px] font-bold flex items-center justify-center gap-2">
            {no ? 'Stopp tapet — få gratis analyse' : 'Stop the loss — get free analysis'} <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
