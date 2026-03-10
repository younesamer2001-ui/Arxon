'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'
import { FAQ } from './FAQ'

const sAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export function FAQSection() {
  const { lang } = useLanguage()
  const no = lang === 'no'

  const faqItems = no ? [
    { q: 'Hva koster det å komme i gang?', a: 'Kartleggingen er 100% gratis og uforpliktende. Etter analysen får du et skreddersydd pristilbud basert på dine behov — ingen skjulte kostnader.' },
    { q: 'Hvor lang tid tar implementeringen?', a: 'Fra signering til live tar det ca. 14 virkedager. Vi jobber grundig med oppsett, testing og tilpasning slik at alt fungerer skikkelig fra dag én.' },
    { q: 'Er det trygt med tanke på GDPR?', a: 'Absolutt. All data lagres kryptert innen EØS. Vi er GDPR-kompatible og EU AI Act-klare. Vi inngår databehandleravtale med alle kunder.' },
    { q: 'Kan jeg starte med én automatisering?', a: 'Ja! De fleste starter med AI-mobilsvarer eller auto-booking og bygger videre derfra. Du velger selv tempo og omfang.' },
    { q: 'Trenger jeg teknisk kunnskap?', a: 'Nei. Vi tar oss av alt teknisk. Du trenger bare å fortelle oss om bedriften din — så fikser vi resten.' },
    { q: 'Hva skjer etter implementering?', a: 'Du får 30 dager med full oppfølging og support. Vi finjusterer sammen basert på reelle resultater, slik at automatiseringene treffer best mulig.' },
  ] : [
    { q: 'What does it cost to get started?', a: 'The assessment is 100% free with no obligations. After the analysis you get a tailored quote based on your needs — no hidden costs.' },
    { q: 'How long does implementation take?', a: 'From signing to live takes about 14 business days. We handle setup, testing, and customization so everything works perfectly from day one.' },
    { q: 'Is it safe with regard to GDPR?', a: 'Absolutely. All data is stored encrypted within the EEA. We are GDPR-compliant and EU AI Act-ready. We sign a data processing agreement with all customers.' },
    { q: 'Can I start with just one automation?', a: 'Yes! Most customers start with the AI phone answering or auto-booking and build from there. You choose the pace and scope.' },
    { q: 'Do I need technical knowledge?', a: 'No. We handle all the technical work. You just tell us about your business — and we take care of the rest.' },
    { q: 'What happens after implementation?', a: 'You get 30 days of full support and follow-up. We fine-tune together based on real results, so the automations deliver maximum impact.' },
  ]

  return (
    <section className="py-14 md:py-28" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      <div className="max-w-xl mx-auto px-5">
        <motion.div {...sAnim} className="text-center mb-10">
          <h2 className="text-[24px] md:text-[36px] font-bold tracking-tight" style={{ color: '#f4f1eb' }}>
            {no ? 'Vanlige spørsmål' : 'Frequently asked questions'}
          </h2>
        </motion.div>
        <motion.div {...sAnim}>
          <FAQ items={faqItems} />
        </motion.div>
      </div>
    </section>
  )
}
