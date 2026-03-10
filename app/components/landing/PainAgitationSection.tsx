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
  whileInView: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  viewport: { once: true },
}

const staggerChild = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function PainAgitationSection() {
  const { lang } = useLanguage()
  const no = lang === 'no'

  const items = no ? [
    { icon: <PhoneOff size={26} />, title: 'Ubesvarte anrop', pain: 'Hver gang telefonen ringer uten svar, mister du en potensiell kunde.', stat: '25 000 kr', statLabel: 'tapt per måned' },
    { icon: <Clock size={26} />, title: 'Timer på manuelt arbeid', pain: 'Booking, oppfølging, fakturering — alt gjøres for hånd.', stat: '20 timer', statLabel: 'bortkastet per uke' },
    { icon: <TrendingUp size={26} />, title: 'Konkurrenter automatiserer', pain: 'Mens du gjør ting manuelt, har konkurrentene allerede AI.', stat: '3x', statLabel: 'raskere enn deg' },
  ] : [
    { icon: <PhoneOff size={26} />, title: 'Missed calls', pain: 'Every time the phone rings without an answer, you lose a potential customer.', stat: '25,000 kr', statLabel: 'lost per month' },
    { icon: <Clock size={26} />, title: 'Hours on manual work', pain: 'Booking, follow-up, invoicing — all done by hand.', stat: '20 hours', statLabel: 'wasted per week' },
    { icon: <TrendingUp size={26} />, title: 'Competitors are automating', pain: 'While you do things manually, your competitors already have AI.', stat: '3x', statLabel: 'faster than you' },
  ]

  return (
    <section className="relative py-14 md:py-28" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      {/* Subtle red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(239,69,69,0.04), transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative max-w-4xl mx-auto px-5">
        <motion.div {...sAnim} className="text-center mb-10 md:mb-14">
          <h2 className="text-[28px] md:text-[42px] font-bold tracking-tight mb-4" style={{ color: '#f4f1eb' }}>
            {no ? 'Kjenner du deg igjen?' : 'Sound familiar?'}
          </h2>
          <p className="text-[15px] max-w-lg mx-auto" style={{ color: 'rgba(244,241,235,0.6)' }}>
            {no ? 'De fleste norske bedrifter taper kunder hver eneste dag uten å vite det.' : 'Most businesses lose customers every single day without knowing it.'}
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-3 gap-5" {...staggerContainer}>
          {items.map((item, i) => (
            <motion.div key={i}
              variants={staggerChild}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative group rounded-xl overflow-hidden"
              style={{
                background: 'rgba(13, 26, 45, 0.4)',
                border: '1px solid rgba(239,69,69,0.12)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Red gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, #ef4545, rgba(239,69,69,0.4), transparent)' }} />

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 0%, rgba(239,69,69,0.08), transparent 70%)' }} />

              <div className="relative z-10 p-6 md:p-7">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(239,69,69,0.2)]"
                  style={{ background: 'rgba(239,69,69,0.1)', border: '1px solid rgba(239,69,69,0.2)' }}>
                  <span style={{ color: '#ef4545' }}>{item.icon}</span>
                </div>
                <h3 className="text-[16px] font-bold mb-2" style={{ color: '#f4f1eb' }}>{item.title}</h3>
                <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'rgba(244,241,235,0.6)' }}>{item.pain}</p>

                {/* Divider */}
                <div className="h-px mb-4" style={{ background: 'linear-gradient(90deg, rgba(239,69,69,0.2), transparent)' }} />

                {/* Big stat */}
                <div className="text-[24px] md:text-[28px] font-extrabold tracking-tight" style={{ color: '#ef4545' }}>{item.stat}</div>
                <div className="text-[11px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(239,69,69,0.6)' }}>{item.statLabel}</div>
              </div>
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
