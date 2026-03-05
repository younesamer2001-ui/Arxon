'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Hammer, Home as HomeIcon, Scissors, Car, Plane, ArrowRight } from 'lucide-react'
import { gold, goldRgb } from '@/lib/constants'
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

export function IndustriesSection() {
  const { lang } = useLanguage()
  const no = lang === 'no'

  return (
    <section className="py-20 md:py-28" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      <div className="max-w-4xl mx-auto px-5">
        <motion.div {...sAnim} className="text-center mb-14">
          <h2 className="text-[28px] md:text-[42px] font-bold tracking-tight mb-4" style={{ color: '#f4f1eb' }}>
            {no ? 'Skreddersydd for' : 'Tailored for'} <span className="text-gradient-gold">{no ? 'din bransje' : 'your industry'}</span>
          </h2>
          <p className="text-[15px] max-w-lg mx-auto" style={{ color: 'rgba(244,241,235,0.6)' }}>
            {no ? 'Vi har spesialiserte løsninger for 5 bransjer — med automatiseringer tilpasset akkurat dine behov.' : 'We have specialized solutions for 5 industries — with automations tailored to your exact needs.'}
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-4" {...staggerContainer}>
          {(no ? [
            { icon: Hammer, label: 'Bygg & Håndverk', count: 12, slug: 'bygg-og-handverk' },
            { icon: HomeIcon, label: 'Eiendom', count: 12, slug: 'eiendomsmegling' },
            { icon: Scissors, label: 'Salong & Skjønnhet', count: 10, slug: 'salong-og-skjonnhet' },
            { icon: Car, label: 'Bilverksted', count: 9, slug: 'bilverksted-og-bilforhandler' },
            { icon: Plane, label: 'Reiseliv', count: 10, slug: 'reiseliv-og-overnatting' },
          ] : [
            { icon: Hammer, label: 'Construction', count: 12, slug: 'bygg-og-handverk' },
            { icon: HomeIcon, label: 'Real Estate', count: 12, slug: 'eiendomsmegling' },
            { icon: Scissors, label: 'Salon & Beauty', count: 10, slug: 'salong-og-skjonnhet' },
            { icon: Car, label: 'Automotive', count: 9, slug: 'bilverksted-og-bilforhandler' },
            { icon: Plane, label: 'Travel & Hospitality', count: 10, slug: 'reiseliv-og-overnatting' },
          ]).map((ind, i) => (
            <motion.div key={ind.slug} variants={staggerChild}>
              <Link href={`/bransjer#${ind.slug}`} style={{ textDecoration: 'none' }}>
                <div className="glass-card p-5 text-center group cursor-pointer hover-lift" style={{ transition: 'all 0.3s' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{ background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.12)` }}>
                    <ind.icon size={22} style={{ color: gold }} />
                  </div>
                  <h3 className="text-[13px] font-semibold mb-1" style={{ color: '#f4f1eb' }}>{ind.label}</h3>
                  <span className="text-[11px]" style={{ color: 'rgba(244,241,235,0.45)' }}>{ind.count} {no ? 'løsninger' : 'solutions'}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...sAnim} className="text-center mt-8">
          <Link href="/bransjer" className="inline-flex items-center gap-2 text-[13px] font-medium group" style={{ color: gold, textDecoration: 'none' }}>
            {no ? 'Se alle bransjer i detalj' : 'See all industries in detail'} <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
