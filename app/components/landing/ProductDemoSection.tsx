'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Zap } from 'lucide-react'
import { gold, goldRgb } from '@/lib/constants'
import { useLanguage } from '@/lib/language-context'
import { PhoneDemo } from './PhoneDemo'
import { WorkflowDemo } from './WorkflowDemo'

const sAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export function ProductDemoSection() {
  const { lang } = useLanguage()
  const no = lang === 'no'

  return (
    <section className="py-14 md:py-28" style={{ borderTop: '1px solid rgba(244,241,235,0.04)' }}>
      <div className="max-w-5xl mx-auto px-5">
        <motion.div {...sAnim} className="text-center mb-10 md:mb-14">
          <h2 className="text-[28px] md:text-[42px] font-bold tracking-tight mb-4" style={{ color: '#f4f1eb' }}>
            {no ? 'Se det i' : 'See it in'} <span className="text-gradient-gold">{no ? 'aksjon' : 'action'}</span>
          </h2>
          <p className="text-[15px] max-w-lg mx-auto" style={{ color: 'rgba(244,241,235,0.6)' }}>
            {no ? 'Fra innkommende anrop til ferdig booking — helt uten manuelt arbeid.' : 'From incoming call to confirmed booking — without any manual work.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div {...sAnim}>
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-full"
                style={{ background: `rgba(${goldRgb},0.08)`, color: gold, border: `1px solid rgba(${goldRgb},0.15)` }}>
                <MessageSquare size={12} /> {no ? 'AI-samtale — live demo' : 'AI conversation — live demo'}
              </span>
            </div>
            <PhoneDemo />
          </motion.div>

          <motion.div {...sAnim} className="hidden md:block">
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-full"
                style={{ background: `rgba(${goldRgb},0.08)`, color: gold, border: `1px solid rgba(${goldRgb},0.15)` }}>
                <Zap size={12} /> {no ? 'Automatisk arbeidsflyt' : 'Automated workflow'}
              </span>
            </div>
            <WorkflowDemo />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
