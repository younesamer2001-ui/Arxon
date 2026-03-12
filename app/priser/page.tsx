'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Shield, ArrowRight, Bot, Phone, CalendarDays, BarChart3, Clock } from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { PRICING, formatKr } from '@/lib/pricing'
import { useLanguage } from '@/lib/language-context'
import { useCalBooking } from '@/lib/useCalBooking'

const gold = '#efc07b'
const goldRgb = '239,192,123'
const bgDark = '#050510'
const cardBg = 'rgba(255,255,255,0.03)'

type BillingMode = 'monthly' | 'annual'

export default function PriserPage() {
  const { lang } = useLanguage()
  const no = lang === 'no'
  const [billing, setBilling] = useState<BillingMode>('annual')
  const openBooking = useCalBooking()

  const calculatePrice = (monthlyBase: number) => {
    return billing === 'annual'
      ? Math.round(monthlyBase * (1 - PRICING.annualDiscount))
      : monthlyBase
  }

  const tiers = [
    {
      name: no ? 'Basis' : 'Basic',
      desc: no ? 'Kom i gang med AI-automatisering' : 'Get started with AI automation',
      price: calculatePrice(PRICING.tiers['Lav'].monthly),
      setupFee: PRICING.tiers['Lav'].setup,
      features: no ? [
        'Én enkel AI-automasjon',
        'Standard maler og oppsett',
        'E-post support',
        'Ukentlig datarapport',
      ] : [
        'One simple AI automation',
        'Standard templates and setup',
        'Email support',
        'Weekly data report',
      ],
      icon: Clock,
      href: '/pakkebygger',
      cta: no ? 'Velg Basis' : 'Select Basic',
      highlighted: false,
    },
    {
      name: no ? 'Pro' : 'Pro',
      desc: no ? 'Mest populær for voksende bedrifter' : 'Most popular for growing businesses',
      price: calculatePrice(PRICING.tiers['Middels'].monthly),
      setupFee: PRICING.tiers['Middels'].setup,
      features: no ? [
        'Inntil 3 AI-automasjoner',
        'Avansert system-integrasjon (CRM/Booking)',
        'Skreddersydd AI-trening',
        'Prioritert support via telefon',
        'Månedlig optimalisering',
      ] : [
        'Up to 3 AI automations',
        'Advanced system integration (CRM/Booking)',
        'Custom AI training',
        'Priority phone support',
        'Monthly optimization',
      ],
      icon: Zap,
      href: '/pakkebygger',
      cta: no ? 'Velg Pro' : 'Select Pro',
      highlighted: true,
      badge: no ? 'Anbefalt' : 'Recommended',
    },
    {
      name: no ? 'Premium' : 'Premium',
      desc: no ? 'Maksimal effekt for etablerte aktører' : 'Maximum impact for established players',
      price: calculatePrice(PRICING.tiers['Høy'].monthly),
      setupFee: PRICING.tiers['Høy'].setup,
      features: no ? [
        'Komplett AI-system (5+ automasjoner)',
        'Dype fagsystem-integrasjoner',
        'Proaktiv overvåking og skalering',
        'Dedikert kontaktperson',
        'Kvartalsvise strategimøter',
      ] : [
        'Complete AI system (5+ automations)',
        'Deep industry system integrations',
        'Proactive monitoring and scaling',
        'Dedicated account manager',
        'Quarterly strategy meetings',
      ],
      icon: Shield,
      href: '/pakkebygger',
      cta: no ? 'Velg Premium' : 'Select Premium',
      highlighted: false,
    },
    {
      name: no ? 'Skreddersydd' : 'Custom',
      desc: no ? 'Bygg nøyaktig det bedriften trenger' : 'Build exactly what your business needs',
      price: 'Skreddersydd',
      setupFee: 'Skreddersydd',
      features: no ? [
        'Full kontroll over automasjonene',
        'Velg fra alle tilgjengelige løsninger',
        'Kvantumsrabatt ved flere valg',
        'Tilpasset kompleksitetsnivå',
        'Gratis AI-rådgivningsmøte',
      ] : [
        'Full control over automations',
        'Choose from all available solutions',
        'Volume discounts applied automatically',
        'Tailored complexity levels',
        'Free AI consultation meeting',
      ],
      icon: Bot,
      isCustom: true,
      href: '/pakkebygger',
      cta: no ? 'Bygg din egen pakke' : 'Build your own package',
      highlighted: false,
    }
  ]

  return (
    <div style={{ background: bgDark, minHeight: '100vh', color: '#f4f1eb' }}>
      <Nav />

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 40px', textAlign: 'center' }}>
        <motion.div
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
           style={{
             display: 'inline-flex', alignItems: 'center', gap: 8,
             background: `rgba(${goldRgb},0.08)`, border: `1px solid rgba(${goldRgb},0.15)`,
             borderRadius: 24, padding: '6px 16px', fontSize: 13, color: gold,
             marginBottom: 20, fontWeight: 500,
           }}
        >
          <Sparkles size={14} /> {no ? 'Gjennomsiktige priser. Ingen skjulte kostnader.' : 'Transparent pricing. No hidden fees.'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 700, marginBottom: 16, lineHeight: 1.1 }}
        >
          {no ? 'Invester i fremtiden. ' : 'Invest in the future. '}<br/><span style={{ color: gold }}>{no ? 'Kutt repeterende oppgaver.' : 'Cut repetitive tasks.'}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.6 }}
        >
          {no ? 'Velg pakken som passer bedriftens ambisjonsnivå. Bytt mellom pakkene når behovet endrer seg.' : 'Choose the package that fits your company\'s ambitions. Switch packages as your needs change.'}
        </motion.p>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 60 }}
        >
          <div style={{
            display: 'inline-flex', background: 'rgba(255,255,255,0.04)',
            borderRadius: 12, padding: 4, position: 'relative'
          }}>
            <button
               onClick={() => setBilling('monthly')}
               style={{
                 padding: '12px 24px', borderRadius: 8, border: 'none',
                 background: billing === 'monthly' ? `rgba(${goldRgb},0.15)` : 'transparent',
                 color: billing === 'monthly' ? gold : 'rgba(255,255,255,0.5)',
                 fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                 transition: 'all 0.2s', zIndex: 1
               }}
            >
              {no ? 'Månedlig' : 'Monthly'}
            </button>
            <button
               onClick={() => setBilling('annual')}
               style={{
                 padding: '12px 24px', borderRadius: 8, border: 'none',
                 background: billing === 'annual' ? `rgba(${goldRgb},0.15)` : 'transparent',
                 color: billing === 'annual' ? gold : 'rgba(255,255,255,0.5)',
                 fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                 transition: 'all 0.2s', zIndex: 1, position: 'relative'
               }}
            >
              {no ? 'Årlig' : 'Annual'}
              <span style={{
                position: 'absolute', top: -10, right: -10,
                background: '#4ade80', color: bgDark, fontSize: 11, fontWeight: 700,
                padding: '2px 8px', borderRadius: 12,
              }}>
                -20%
              </span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: 24, alignItems: 'stretch' 
        }}>
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              style={{
                position: 'relative',
                background: tier.highlighted ? `rgba(${goldRgb},0.08)` : cardBg,
                border: `1px solid ${tier.highlighted ? `rgba(${goldRgb},0.4)` : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 20,
                padding: '32px 24px',
                display: 'flex', flexDirection: 'column',
                transform: tier.highlighted ? 'scale(1.02)' : 'none',
                zIndex: tier.highlighted ? 10 : 1,
              }}
            >
              {tier.badge && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: gold, color: bgDark, fontSize: 12, fontWeight: 700,
                  padding: '4px 16px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1
                }}>
                  {tier.badge}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: tier.highlighted ? `rgba(${goldRgb},0.2)` : `rgba(255,255,255,0.05)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <tier.icon size={22} color={tier.highlighted ? gold : 'rgba(255,255,255,0.8)'} />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 700 }}>{tier.name}</h3>
              </div>

              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24, minHeight: 42 }}>
                {tier.desc}
              </p>

              <div style={{ marginBottom: 32, flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  {tier.isCustom ? (
                    <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{tier.price}</span>
                  ) : (
                    <>
                      <span style={{ fontSize: 36, fontWeight: 800, color: tier.highlighted ? gold : '#fff' }}>
                        {formatKr(tier.price as number)}
                      </span>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>/{no ? 'mnd' : 'mo'}</span>
                    </>
                  )}
                </div>
                {!tier.isCustom && billing === 'monthly' && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                    {no ? 'Faktureres månedlig' : 'Billed monthly'}
                  </div>
                )}
                {!tier.isCustom && billing === 'annual' && (
                  <div style={{ fontSize: 13, color: '#4ade80', marginTop: 4, fontWeight: 500 }}>
                    {no ? `Spar ${formatKr(PRICING.tiers[tier.name === 'Basis' ? 'Lav' : tier.name === 'Pro' ? 'Middels' : 'Høy'].monthly * 12 * 0.20)} i året` : `Save ${formatKr(PRICING.tiers[tier.name === 'Basis' ? 'Lav' : tier.name === 'Pro' ? 'Middels' : 'Høy'].monthly * 12 * 0.20)} a year`}
                  </div>
                )}
                
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                  {no ? 'Oppsettkostnad:' : 'Setup fee:'} <span style={{ color: '#fff', fontWeight: 500 }}>{tier.isCustom ? tier.setupFee : formatKr(tier.setupFee as number)}</span>
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                {tier.features.map((feature, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <Check size={16} color={tier.highlighted ? gold : '#4ade80'} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{feature}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto' }}>
                {tier.isCustom ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <Link href={tier.href} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        width: '100%', padding: '14px', borderRadius: 12,
                        background: `rgba(${goldRgb},0.15)`, color: gold,
                        fontWeight: 600, textDecoration: 'none', border: `1px solid rgba(${goldRgb},0.3)`,
                        transition: 'all 0.2s'
                      }}>
                        {tier.cta} <ArrowRight size={16} />
                      </Link>
                      <button onClick={openBooking} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        width: '100%', padding: '14px', borderRadius: 12,
                        background: 'transparent', color: '#fff',
                        fontWeight: 500, border: '1px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.2s', cursor: 'pointer'
                      }}
                      data-cal-namespace="gratis-ai-konsultasjon"
                      data-cal-link="arxon/gratis-ai-konsultasjon"
                      data-cal-config='{"layout":"month_view"}'>
                         <CalendarDays size={16} /> {no ? 'Book møte' : 'Book meeting'}
                      </button>
                    </div>
                ) : (
                  <Link href={tier.href} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    width: '100%', padding: '16px', borderRadius: 12,
                    background: tier.highlighted ? gold : 'rgba(255,255,255,0.06)',
                    color: tier.highlighted ? bgDark : '#fff',
                    fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
                    border: tier.highlighted ? 'none' : '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {tier.cta} <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ / Trust section */}
      <section style={{ maxWidth: 800, margin: '0 auto 80px', padding: '0 24px' }}>
         <div style={{
          background: cardBg, borderRadius: 20, padding: '40px',
          border: `1px solid rgba(${goldRgb},0.08)`, display: 'flex',
          flexDirection: 'column', gap: 24
         }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>{no ? 'Ofte stilte spørsmål' : 'Frequently asked questions'}</h2>
            
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 20 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: gold, marginBottom: 8 }}>
                {no ? 'Hva inkluderer oppsettkostnaden?' : 'What does the setup fee include?'}
              </h4>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                {no ? 'Oppsettkostnaden dekker integrasjon av AI-enheten(e) i dine systemer (CRM, kalender), treningsdata basert på din bedrift, teknisk kvalitetssikring, og GDPR-dokumentasjon før lansering.' : 'The setup fee covers integration of the AI unit(s) into your systems (CRM, calendar), training data based on your company, technical QA, and GDPR documentation prior to launch.'}
              </p>
            </div>

            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 20 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: gold, marginBottom: 8 }}>
                {no ? 'Er det bindingstid?' : 'Is there a commitment period?'}
              </h4>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                {no ? 'På våre månedlige planer er det ingen bindingstid; du kan kansellere når som helst. For årlige planer gir vi 20% rabatt, og pengene-tilbake-garanti ved oppstart i opptil 14 dager.' : 'On our monthly plans, there is no commitment period; you can cancel anytime. For annual plans, we provide a 20% discount and a 14-day money-back guarantee after activation.'}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: gold, marginBottom: 8 }}>
                {no ? 'Hva skjer hvis jeg trenger flere automasjoner?' : 'What happens if I need more automations?'}
              </h4>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                {no ? 'Du kan enkelt oppgradere din plan (fra Lav til Middels, for eksempel), eller benytte deg av Pakkebyggeren til å legge til skreddersydde utvidelser.' : 'You can easily upgrade your plan (from Basic to Pro, for example), or use the Package Builder to add custom extensions alongside your active plan.'}
              </p>
            </div>

         </div>
      </section>

      <Footer />
    </div>
  )
}
