'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot, CalendarCheck, Users, BarChart3, Cog, Megaphone, ArrowUpRight } from 'lucide-react'
import { gold, goldRgb } from '@/lib/constants'
import { useLanguage } from '@/lib/language-context'

const sAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export function BentoGridSection() {
  const { lang } = useLanguage()
  const no = lang === 'no'

  const features = no ? [
    { icon: <Bot size={18} />, title: 'AI-Mobilsvarer' },
    { icon: <CalendarCheck size={18} />, title: 'Automatisk booking' },
    { icon: <Users size={18} />, title: 'Kundeoppfølging' },
    { icon: <BarChart3 size={18} />, title: 'Lead-kvalifisering' },
    { icon: <Cog size={18} />, title: 'Automatisert admin' },
    { icon: <Megaphone size={18} />, title: 'Smart markedsføring' },
  ] : [
    { icon: <Bot size={18} />, title: 'AI Phone Answering' },
    { icon: <CalendarCheck size={18} />, title: 'Automatic booking' },
    { icon: <Users size={18} />, title: 'Customer follow-up' },
    { icon: <BarChart3 size={18} />, title: 'Lead qualification' },
    { icon: <Cog size={18} />, title: 'Automated admin' },
    { icon: <Megaphone size={18} />, title: 'Smart marketing' },
  ]

  return (
    <section className="py-10 md:py-20" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      <div className="max-w-4xl mx-auto px-5">
        <motion.div {...sAnim} className="text-center mb-8 md:mb-12">
          <h2 className="text-[24px] md:text-[36px] font-bold tracking-tight mb-3" style={{ color: '#f4f1eb' }}>
            {no ? 'Alt du trenger —' : 'Everything you need —'} <span className="text-gradient-gold">{no ? 'én plattform' : 'one platform'}</span>
          </h2>
          <p className="text-[14px] max-w-md mx-auto" style={{ color: 'rgba(244,241,235,0.55)' }}>
            {no ? 'Arxon erstatter manuelt arbeid med AI som jobber 24/7.' : 'Arxon replaces manual work with AI that works 24/7.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {features.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              whileHover={{ y: -3, borderColor: `rgba(${goldRgb},0.3)`, transition: { duration: 0.2 } }}
              className="flex items-center gap-3 px-4 py-3.5 md:px-5 md:py-4 rounded-xl cursor-default"
              style={{
                background: 'rgba(13, 26, 45, 0.35)',
                border: `1px solid rgba(${goldRgb},0.1)`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `rgba(${goldRgb},0.1)`, border: `1px solid rgba(${goldRgb},0.15)` }}>
                <span style={{ color: gold }}>{item.icon}</span>
              </div>
              <span className="text-[13px] md:text-[14px] font-semibold" style={{ color: '#f4f1eb' }}>{item.title}</span>
            </motion.div>
          ))}
        </div>

        <motion.div {...sAnim} className="text-center mt-6">
          <Link href="/tjenester" className="inline-flex items-center gap-1.5 text-[13px] font-medium" style={{ color: gold, textDecoration: 'none' }}>
            {no ? 'Se alle 75+ automatiseringer' : 'See all 75+ automations'} <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
