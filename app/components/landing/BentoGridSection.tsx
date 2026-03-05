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

  return (
    <section className="py-20 md:py-28" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      <div className="max-w-5xl mx-auto px-5">
        <motion.div {...sAnim} className="text-center mb-14">
          <h2 className="text-[28px] md:text-[42px] font-bold tracking-tight mb-4" style={{ color: '#f4f1eb' }}>
            {no ? 'Alt du trenger —' : 'Everything you need —'} <span className="text-gradient-gold">{no ? 'én plattform' : 'one platform'}</span>
          </h2>
          <p className="text-[15px] max-w-lg mx-auto" style={{ color: 'rgba(244,241,235,0.6)' }}>
            {no ? 'Arxon erstatter manuelt arbeid med intelligente AI-systemer som jobber 24/7.' : 'Arxon replaces manual work with intelligent AI systems that work 24/7.'}
          </p>
        </motion.div>

        <div className="bento-grid">
          {(no ? [
            { icon: <Bot size={22} />, title: 'AI-Mobilsvarer', desc: 'Svarer telefonen 24/7. Kvalifiserer leads, booker møter og sender sammendrag — alt automatisk.', span: 'wide' },
            { icon: <CalendarCheck size={22} />, title: 'Automatisk booking', desc: 'Kundene booker direkte i kalenderen din. Ingen frem-og-tilbake på SMS.', span: 'normal' },
            { icon: <Users size={22} />, title: 'Kundeoppfølging', desc: 'AI følger opp leads med personlige meldinger til riktig tid.', span: 'normal' },
            { icon: <BarChart3 size={22} />, title: 'Lead-kvalifisering', desc: 'Rangerer og sorterer leads basert på kjøpssannsynlighet. Du ringer bare de varme.', span: 'normal' },
            { icon: <Cog size={22} />, title: 'Automatisert admin', desc: 'Fakturering, rapporter og oppgaver kjører av seg selv.', span: 'normal' },
            { icon: <Megaphone size={22} />, title: 'Smart markedsføring', desc: 'AI-drevne kampanjer som treffer riktig kunde til riktig tid.', span: 'wide' },
          ] : [
            { icon: <Bot size={22} />, title: 'AI Phone Answering', desc: 'Answers the phone 24/7. Qualifies leads, books meetings, and sends summaries — all automatically.', span: 'wide' },
            { icon: <CalendarCheck size={22} />, title: 'Automatic booking', desc: 'Customers book directly in your calendar. No back-and-forth via SMS.', span: 'normal' },
            { icon: <Users size={22} />, title: 'Customer follow-up', desc: 'AI follows up leads with personalized messages at the right time.', span: 'normal' },
            { icon: <BarChart3 size={22} />, title: 'Lead qualification', desc: 'Ranks and sorts leads by purchase likelihood. You only call the warm ones.', span: 'normal' },
            { icon: <Cog size={22} />, title: 'Automated admin', desc: 'Invoicing, reports, and tasks run by themselves.', span: 'normal' },
            { icon: <Megaphone size={22} />, title: 'Smart marketing', desc: 'AI-driven campaigns that reach the right customer at the right time.', span: 'wide' },
          ]).map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`bento-card group ${item.span === 'wide' ? 'md:col-span-2' : ''}`}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="bento-card-glow" />
              <div className="relative z-10 p-6 md:p-8">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: `rgba(${goldRgb},0.08)`, border: `1px solid rgba(${goldRgb},0.15)` }}>
                  <span style={{ color: gold }}>{item.icon}</span>
                </div>
                <h3 className="text-[16px] font-bold mb-2" style={{ color: '#f4f1eb' }}>{item.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(244,241,235,0.65)' }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...sAnim} className="text-center mt-10">
          <Link href="/tjenester" className="inline-flex items-center gap-2 text-[14px] font-medium" style={{ color: gold, textDecoration: 'none' }}>
            {no ? 'Se alle 75+ automatiseringer' : 'See all 75+ automations'} <ArrowUpRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
