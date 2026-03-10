'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { gold } from '@/lib/constants'
import { useLanguage } from '@/lib/language-context'
import { AnimCounter } from './AnimCounter'

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

export function AuthoritySection() {
  const { lang } = useLanguage()
  const no = lang === 'no'

  return (
    <section className="py-14 md:py-28" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      <div className="max-w-4xl mx-auto px-5">
        <motion.div {...sAnim} className="text-center mb-10 md:mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            {(no ? [
              { val: 200, suffix: '+', label: 'Automatiseringer' },
              { val: 5, suffix: '', label: 'Bransjer dekket' },
              { val: 85, suffix: '%', label: 'Raskere oppfølging' },
              { val: 24, suffix: '/7', label: 'AI tilgjengelig' },
            ] : [
              { val: 200, suffix: '+', label: 'Automations' },
              { val: 5, suffix: '', label: 'Industries covered' },
              { val: 85, suffix: '%', label: 'Faster follow-up' },
              { val: 24, suffix: '/7', label: 'AI available' },
            ]).map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.6, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1, type: 'spring', stiffness: 150, damping: 15 }}>
                <div className="text-[28px] md:text-[36px] font-extrabold text-gradient-gold">
                  <AnimCounter target={s.val} suffix={s.suffix} />
                </div>
                <div className="text-[12px] tracking-wide uppercase mt-1" style={{ color: 'rgba(244,241,235,0.55)' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...sAnim} className="text-center mb-12">
          <h2 className="text-[24px] md:text-[36px] font-bold tracking-tight" style={{ color: '#f4f1eb' }}>
            {no ? 'Det fungerer for' : 'It works for'} <span className="text-gradient-gold">{no ? 'andre' : 'others'}</span>
          </h2>
        </motion.div>

        <motion.div className="grid md:grid-cols-2 gap-6" {...staggerContainer}>
          {(no ? [
            { name: 'Martin K.', biz: 'Bygg & Håndverk', quote: 'Vi gikk fra å miste halvparten av leads til å fange alle. Omsetningen økte 25% på tre måneder — uten å ansette noen.', result: '+25% omsetning', stars: 5 },
            { name: 'Camilla H.', biz: 'Salong & Skjønnhet', quote: 'Kundene booker selv døgnet rundt, og vi får påminnelser automatisk. No-shows gikk ned 70% på første måned.', result: '–70% no-shows', stars: 5 },
            { name: 'Lars T.', biz: 'Eiendomsmegling', quote: 'Arxon sin AI-telefonsvarer fanger opp alle interessenter — selv de som ringer kl. 22 på søndag. Vi har aldri booket så mange visninger.', result: '+40% visninger', stars: 5 },
            { name: 'Kristine M.', biz: 'Bilverksted', quote: 'Automatisk påminnelse om EU-kontroll og service har gitt oss en jevn strøm av bookinger. Kundene elsker det.', result: '+35% gjenkjøp', stars: 5 },
          ] : [
            { name: 'Martin K.', biz: 'Construction', quote: 'We went from losing half our leads to capturing all of them. Revenue increased 25% in three months — without hiring anyone.', result: '+25% revenue', stars: 5 },
            { name: 'Camilla H.', biz: 'Salon & Beauty', quote: 'Customers book around the clock, and we get automatic reminders. No-shows dropped 70% in the first month.', result: '–70% no-shows', stars: 5 },
            { name: 'Lars T.', biz: 'Real Estate', quote: 'Arxon\'s AI phone answering captures all interested parties — even those who call at 10 PM on Sunday. We\'ve never booked so many viewings.', result: '+40% viewings', stars: 5 },
            { name: 'Kristine M.', biz: 'Auto Workshop', quote: 'Automatic reminders for inspections and service have given us a steady stream of bookings. Customers love it.', result: '+35% repeat', stars: 5 },
          ]).map((t, i) => (
            <motion.div key={i}
              variants={staggerChild}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`glass-card p-6 md:p-8${i >= 2 ? ' hidden md:block' : ''}`}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={14} fill={gold} color={gold} />)}
              </div>
              <p className="text-[14px] leading-relaxed mb-5 italic" style={{ color: 'rgba(244,241,235,0.6)' }}>&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold" style={{ color: '#f4f1eb' }}>{t.name}</div>
                  <div className="text-[12px]" style={{ color: 'rgba(244,241,235,0.55)' }}>{t.biz}</div>
                </div>
                <span className="text-[12px] font-semibold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.15)' }}>
                  {t.result}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
