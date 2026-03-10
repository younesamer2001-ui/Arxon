'use client'

import { motion } from 'framer-motion'
import { Star, Quote, TrendingUp, Zap, Shield, Clock } from 'lucide-react'
import { gold, goldRgb } from '@/lib/constants'
import { useLanguage } from '@/lib/language-context'
import { AnimCounter } from './AnimCounter'

const sAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const avatarColors = ['#efc07b', '#4ade80', '#60a5fa', '#f472b6']
const statIcons = [TrendingUp, Shield, Zap, Clock]

function TestimonialCard({ t, i }: { t: { name: string; biz: string; quote: string; result: string; stars: number }; i: number }) {
  return (
    <div
      className="relative group rounded-2xl overflow-hidden flex-shrink-0 w-[320px] md:w-[380px]"
      style={{
        background: 'rgba(13, 26, 45, 0.5)',
        border: `1px solid rgba(${goldRgb},0.08)`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Gold left border accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ background: `linear-gradient(180deg, ${gold}, rgba(${goldRgb},0.08))` }} />

      <div className="relative z-10 p-6 pl-7">
        {/* Quote icon + stars */}
        <div className="flex items-center justify-between mb-4">
          <Quote size={18} style={{ color: `rgba(${goldRgb},0.25)` }} />
          <div className="flex gap-0.5">
            {Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={11} fill={gold} color={gold} />)}
          </div>
        </div>

        <p className="text-[13px] leading-relaxed mb-5 italic" style={{ color: 'rgba(244,241,235,0.65)' }}>
          &ldquo;{t.quote}&rdquo;
        </p>

        {/* Result badge */}
        <div className="mb-4">
          <span className="text-[13px] font-bold px-3.5 py-1.5 rounded-full"
            style={{ background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.15)' }}>
            {t.result}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px mb-4" style={{ background: 'rgba(244,241,235,0.05)' }} />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-bold"
            style={{ background: `${avatarColors[i % 4]}15`, border: `1.5px solid ${avatarColors[i % 4]}40`, color: avatarColors[i % 4] }}>
            {t.name.charAt(0)}
          </div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: '#f4f1eb' }}>{t.name}</div>
            <div className="text-[11px]" style={{ color: 'rgba(244,241,235,0.45)' }}>{t.biz}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AuthoritySection() {
  const { lang } = useLanguage()
  const no = lang === 'no'

  const stats = no ? [
    { val: 200, suffix: '+', label: 'Automatiseringer' },
    { val: 5, suffix: '', label: 'Bransjer dekket' },
    { val: 85, suffix: '%', label: 'Raskere oppfølging' },
    { val: 24, suffix: '/7', label: 'AI tilgjengelig' },
  ] : [
    { val: 200, suffix: '+', label: 'Automations' },
    { val: 5, suffix: '', label: 'Industries covered' },
    { val: 85, suffix: '%', label: 'Faster follow-up' },
    { val: 24, suffix: '/7', label: 'AI available' },
  ]

  const testimonials = no ? [
    { name: 'Martin K.', biz: 'Bygg & Håndverk', quote: 'Vi gikk fra å miste halvparten av leads til å fange alle. Omsetningen økte 25% på tre måneder — uten å ansette noen.', result: '+25% omsetning', stars: 5 },
    { name: 'Camilla H.', biz: 'Salong & Skjønnhet', quote: 'Kundene booker selv døgnet rundt, og vi får påminnelser automatisk. No-shows gikk ned 70% på første måned.', result: '–70% no-shows', stars: 5 },
    { name: 'Lars T.', biz: 'Eiendomsmegling', quote: 'Arxon sin AI-telefonsvarer fanger opp alle interessenter — selv de som ringer kl. 22 på søndag. Vi har aldri booket så mange visninger.', result: '+40% visninger', stars: 5 },
    { name: 'Kristine M.', biz: 'Bilverksted', quote: 'Automatisk påminnelse om EU-kontroll og service har gitt oss en jevn strøm av bookinger. Kundene elsker det.', result: '+35% gjenkjøp', stars: 5 },
  ] : [
    { name: 'Martin K.', biz: 'Construction', quote: 'We went from losing half our leads to capturing all of them. Revenue increased 25% in three months — without hiring anyone.', result: '+25% revenue', stars: 5 },
    { name: 'Camilla H.', biz: 'Salon & Beauty', quote: 'Customers book around the clock, and we get automatic reminders. No-shows dropped 70% in the first month.', result: '–70% no-shows', stars: 5 },
    { name: 'Lars T.', biz: 'Real Estate', quote: 'Arxon\'s AI phone answering captures all interested parties — even those who call at 10 PM on Sunday. We\'ve never booked so many viewings.', result: '+40% viewings', stars: 5 },
    { name: 'Kristine M.', biz: 'Auto Workshop', quote: 'Automatic reminders for inspections and service have given us a steady stream of bookings. Customers love it.', result: '+35% repeat', stars: 5 },
  ]

  return (
    <section className="relative py-16 md:py-32 overflow-hidden" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      {/* Marquee keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 35s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Gold ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse, rgba(${goldRgb},0.04), transparent 70%)`, filter: 'blur(60px)' }} />

      <div className="relative max-w-5xl mx-auto px-5">
        {/* Section heading */}
        <motion.div {...sAnim} className="text-center mb-12 md:mb-16">
          <p className="text-[12px] uppercase tracking-[0.2em] mb-3 font-medium" style={{ color: gold }}>
            {no ? 'Resultater som teller' : 'Results that matter'}
          </p>
          <h2 className="text-[28px] md:text-[44px] font-bold tracking-tight" style={{ color: '#f4f1eb' }}>
            {no ? 'Det fungerer for' : 'It works for'} <span className="text-gradient-gold">{no ? 'andre' : 'others'}</span>
          </h2>
        </motion.div>

        {/* Stats row with icons */}
        <motion.div {...sAnim} className="mb-14 md:mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {stats.map((s, i) => {
              const Icon = statIcons[i]
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.85, y: 16 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, type: 'spring', stiffness: 150, damping: 15 }}
                  whileHover={{ y: -3, scale: 1.02, transition: { duration: 0.2 } }}
                  className="relative group text-center py-6 px-4 rounded-2xl overflow-hidden cursor-default"
                  style={{
                    background: 'rgba(13, 26, 45, 0.5)',
                    border: `1px solid rgba(${goldRgb},0.1)`,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Top gold line */}
                  <div className="absolute top-0 left-[20%] right-[20%] h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />

                  <div className="flex justify-center mb-2">
                    <Icon size={18} style={{ color: `rgba(${goldRgb},0.5)` }} />
                  </div>
                  <div className="text-[28px] md:text-[38px] font-extrabold text-gradient-gold leading-none">
                    <AnimCounter target={s.val} suffix={s.suffix} />
                  </div>
                  <div className="text-[11px] tracking-wider uppercase mt-2 font-medium" style={{ color: 'rgba(244,241,235,0.45)' }}>{s.label}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Testimonials marquee — full width, breaks out of container */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #050510, transparent)' }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #050510, transparent)' }} />

        <div className="marquee-track flex gap-5" style={{ width: 'max-content' }}>
          {/* Duplicate testimonials for seamless loop */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={i} t={t} i={i} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
