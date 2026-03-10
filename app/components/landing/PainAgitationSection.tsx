'use client'

import { motion } from 'framer-motion'
import { PhoneOff, Clock, TrendingUp } from 'lucide-react'
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

export function PainAgitationSection() {
  const { lang } = useLanguage()
  const no = lang === 'no'

  return (
    <section className="py-14 md:py-28" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      <div className="max-w-4xl mx-auto px-5">
        <motion.div {...sAnim} className="text-center mb-10 md:mb-14">
          <h2 className="text-[28px] md:text-[42px] font-bold tracking-tight mb-4" style={{ color: '#f4f1eb' }}>
            {no ? 'Kjenner du deg igjen?' : 'Sound familiar?'}
          </h2>
          <p className="text-[15px] max-w-lg mx-auto" style={{ color: 'rgba(244,241,235,0.6)' }}>
            {no ? 'De fleste norske bedrifter taper kunder hver eneste dag uten å vite det.' : 'Most businesses lose customers every single day without knowing it.'}
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-3 gap-6" {...staggerContainer}>
          {(no ? [
            { icon: <PhoneOff size={24} />, title: 'Ubesvarte anrop', pain: 'Hver gang telefonen ringer uten svar, mister du en potensiell kunde.', agitate: 'Det koster deg 15 000–25 000 kr/mnd i tapte inntekter.' },
            { icon: <Clock size={24} />, title: 'Timer på manuelt arbeid', pain: 'Booking, oppfølging, fakturering — alt gjøres for hånd.', agitate: '15–20 timer i uken forsvinner til oppgaver AI kan gjøre på sekunder.' },
            { icon: <TrendingUp size={24} />, title: 'Konkurrenter automatiserer', pain: 'Mens du gjør ting manuelt, har konkurrentene allerede AI.', agitate: 'De fanger kundene dine mens du er opptatt med admin.' },
          ] : [
            { icon: <PhoneOff size={24} />, title: 'Missed calls', pain: 'Every time the phone rings without an answer, you lose a potential customer.', agitate: 'It costs you 15,000–25,000 NOK/month in lost revenue.' },
            { icon: <Clock size={24} />, title: 'Hours on manual work', pain: 'Booking, follow-up, invoicing — all done by hand.', agitate: '15–20 hours per week disappear on tasks AI can do in seconds.' },
            { icon: <TrendingUp size={24} />, title: 'Competitors are automating', pain: 'While you do things manually, your competitors already have AI.', agitate: 'They capture your customers while you\'re busy with admin.' },
          ]).map((item, i) => (
            <motion.div key={i}
              variants={staggerChild}
              className="glass-card p-6 md:p-8 group hover-lift"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(239,69,69,0.08)', border: '1px solid rgba(239,69,69,0.15)' }}>
                <span style={{ color: '#ef4545' }}>{item.icon}</span>
              </div>
              <h3 className="text-[16px] font-bold mb-2" style={{ color: '#f4f1eb' }}>{item.title}</h3>
              <p className="text-[14px] leading-relaxed mb-2" style={{ color: 'rgba(244,241,235,0.7)' }}>{item.pain}</p>
              <p className="text-[13px] font-medium" style={{ color: '#ef4545' }}>{item.agitate}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...sAnim} className="text-center mt-12">
          <p className="text-[18px] font-semibold" style={{ color: gold }}>
            {no ? 'Det finnes en bedre måte.' : 'There\'s a better way.'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
