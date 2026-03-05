'use client'
import { useLanguage } from '@/lib/language-context'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowRight, Sparkles, Target, Heart, Shield, Users, MapPin,
  Lightbulb, Zap, Clock, BarChart3, Phone
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, fadeUp, globalStyles } from '@/lib/constants'

export default function AboutPage() {
  const { lang } = useLanguage()
  const router = useRouter()

  const values = lang === 'no' ? [
    { icon: Heart, title: 'Ærlighet først', desc: 'Vi anbefaler aldri automatisering hvis det ikke gir nok verdi for din bedrift. Ingen bindingstid, ingen skjulte kostnader.' },
    { icon: Target, title: 'Resultater teller', desc: 'Vi måler suksess i timer du sparer, kunder du fanger opp, og kroner du beholder.' },
    { icon: Shield, title: 'Personvern er ufravikelig', desc: 'GDPR, EU AI Act og Datatilsynets retningslinjer — all data lagres i Norge, og vi tar datasikkerhet på alvor.' },
    { icon: Lightbulb, title: 'Bygget for norske bedrifter', desc: 'Vi forstår det norske markedet, dialekter, regelverk og hvordan norske bedrifter faktisk jobber i hverdagen.' },
  ] : [
    { icon: Heart, title: 'Honesty first', desc: 'We never recommend automation if it won\'t provide enough value for your business. No lock-in, no hidden costs.' },
    { icon: Target, title: 'Results matter', desc: 'We measure success in hours you save, customers you capture, and revenue you keep.' },
    { icon: Shield, title: 'Privacy is non-negotiable', desc: 'GDPR, EU AI Act and Datatilsynet guidelines — all data stored in Norway, and we take data security seriously.' },
    { icon: Lightbulb, title: 'Built for Norwegian businesses', desc: 'We understand the Norwegian market, dialects, regulations, and how Norwegian businesses actually work day to day.' },
  ]

  const stats = lang === 'no' ? [
    { value: '5', label: 'Fokus-bransjer med skreddersydde automatiseringer' },
    { value: '75+', label: 'Ferdige AI-automatiseringer klar til bruk' },
    { value: '#1', label: 'Norge er nr. 1 i Europa på AI-adopsjon' },
  ] : [
    { value: '5', label: 'Focus industries with tailored automations' },
    { value: '75+', label: 'Ready-made AI automations ready to use' },
    { value: '#1', label: 'Norway is #1 in Europe for AI adoption' },
  ]

  const timeline = lang === 'no' ? [
    { icon: Phone, title: 'Det startet med en telefon', desc: 'Vi så at norske bedrifter mistet tusenvis av kroner hver måned på telefoner som ingen svarte. Kunder forsvant til konkurrenter — bare fordi eieren var opptatt.' },
    { icon: Zap, title: 'Fra telefonsvarer til full automatisering', desc: 'AI-mobilsvareren ble starten. Men vi oppdaget raskt at bedrifter trenger mye mer — booking, oppfølging, fakturering, lead-generering, kundeservice. Så vi bygde det.' },
    { icon: BarChart3, title: 'Arxon i dag', desc: '75+ AI-automatiseringer fordelt på 5 fokus-bransjer: bygg, eiendom, salong, bilverksted og reiseliv. Alt skreddersydd, alt ferdig på ca. 14 dager.' },
  ] : [
    { icon: Phone, title: 'It started with a phone call', desc: 'We saw that Norwegian businesses lost thousands of kroner every month on phones nobody answered. Customers disappeared to competitors — just because the owner was busy.' },
    { icon: Zap, title: 'From answering service to full automation', desc: 'The AI phone answering was the start. But we quickly discovered businesses need much more — booking, follow-up, invoicing, lead generation, customer service. So we built it.' },
    { icon: BarChart3, title: 'Arxon today', desc: '75+ AI automations across 5 focus industries: construction, real estate, beauty, auto workshops and hospitality. All custom-built, all ready in approx. 14 days.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${bg} 0%, #0d0d15 50%, ${bg} 100%)`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles()}</style>
      <Nav />

      {/* Hero */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 40px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 30, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.15)`, fontSize: 13, color: gold, marginBottom: 24 }}>
          <Users size={14} />
          {lang === 'no' ? 'Om Arxon' : 'About Arxon'}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
          {lang === 'no'
            ? (<>Vi automatiserer <span style={{ color: gold }}>det kjedelige</span> — så du kan fokusere på det viktige</>)
            : (<>We automate <span style={{ color: gold }}>the boring stuff</span> — so you can focus on what matters</>)}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
          style={{ fontSize: 'clamp(15px, 2.2vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
          {lang === 'no'
            ? 'Arxon bygger skreddersydde AI-automatiseringer for norske bedrifter. Telefoner, booking, oppfølging, fakturering, markedsføring — alt det repetitive som stjeler tiden din.'
            : 'Arxon builds custom AI automations for Norwegian businesses. Phones, booking, follow-up, invoicing, marketing — all the repetitive work that steals your time.'}
        </motion.p>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '20px 24px 60px' }}>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {stats.map((s, i) => (
            <motion.div key={i} {...fadeUp} style={{ textAlign: 'center', padding: '28px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: gold, fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our story timeline */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 70px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 36 }}>
          {lang === 'no' ? 'Historien vår' : 'Our story'}
        </motion.h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {timeline.map((t, i) => (
            <motion.div key={i} {...fadeUp} style={{
              display: 'flex', gap: 20, position: 'relative',
              paddingBottom: i < timeline.length - 1 ? 36 : 0,
            }}>
              {/* Vertical line + icon */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `rgba(${goldRgb},0.08)`,
                  border: `1px solid rgba(${goldRgb},0.15)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <t.icon size={20} color={gold} />
                </div>
                {i < timeline.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: `rgba(${goldRgb},0.1)`, marginTop: 8 }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingTop: 4 }}>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{t.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ maxWidth: 750, margin: '0 auto', padding: '0 24px 60px' }}>
        <motion.div {...fadeUp} style={{
          background: `linear-gradient(135deg, rgba(${goldRgb},0.05) 0%, rgba(${goldRgb},0.01) 100%)`,
          border: `1px solid rgba(${goldRgb},0.12)`, borderRadius: 22, padding: '40px 32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Target size={22} color={gold} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>
              {lang === 'no' ? 'Vår misjon' : 'Our mission'}
            </h2>
          </div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 16 }}>
            {lang === 'no'
              ? 'Å gi norske bedrifter superkrefter gjennom AI-automatisering. Ikke fordi teknologien er kul — men fordi det frigjør tid, reduserer kostnader, og lar deg fokusere på det du faktisk er god på.'
              : 'To give Norwegian businesses superpowers through AI automation. Not because the technology is cool — but because it frees up time, reduces costs, and lets you focus on what you\'re actually good at.'}
          </p>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
            {lang === 'no'
              ? 'Vi tror norske SMB-er fortjener de samme verktøyene som store selskaper. En rørlegger, tannlege eller eiendomsmegler skal kunne gi like god oppfølging som en bedrift med 50 ansatte — uten å jobbe 80-timers uker for å klare det.'
              : 'We believe Norwegian SMEs deserve the same tools as large companies. A plumber, dentist or real estate agent should be able to provide the same follow-up as a company with 50 employees — without working 80-hour weeks to manage it.'}
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 70px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 36 }}>
          {lang === 'no' ? 'Hva vi står for' : 'What we stand for'}
        </motion.h2>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {values.map((v, i) => (
            <motion.div key={i} {...fadeUp} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '28px 24px',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${goldRgb},0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <v.icon size={22} color={gold} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{v.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 70px', textAlign: 'center' }}>
        <motion.div {...fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <MapPin size={18} color={gold} />
          <span style={{ fontSize: 15, fontWeight: 600 }}>{lang === 'no' ? 'Basert i Oslo, Norge' : 'Based in Oslo, Norway'}</span>
        </motion.div>
        <motion.p {...fadeUp} style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          {lang === 'no'
            ? 'Vi er et norsk selskap som betjener norske bedrifter. All data lagres i Norge innen EØS, og vi følger norske lover, GDPR og EU AI Act.'
            : 'We are a Norwegian company serving Norwegian businesses. All data is stored in Norway within the EEA, and we follow Norwegian laws, GDPR and the EU AI Act.'}
        </motion.p>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 650, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <motion.div {...fadeUp} style={{
          background: `linear-gradient(135deg, rgba(${goldRgb},0.06) 0%, rgba(${goldRgb},0.02) 100%)`,
          border: `1px solid rgba(${goldRgb},0.15)`, borderRadius: 24, padding: '48px 32px',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, marginBottom: 12 }}>
            {lang === 'no' ? 'Klar for å automatisere?' : 'Ready to automate?'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28, maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.6 }}>
            {lang === 'no'
              ? 'Start med en gratis kartlegging — vi finner ut hvilke automatiseringer som passer din bedrift. Helt uforpliktende.'
              : 'Start with a free assessment — we\'ll figure out which automations fit your business. Completely non-binding.'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => router.push('/kartlegging')} className="cta-shimmer" style={{
              color: bg, border: 'none', borderRadius: 14, padding: '16px 36px',
              fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>
              {lang === 'no' ? 'Start kartlegging' : 'Start assessment'}
              <ArrowRight size={16} style={{ display: 'inline', marginLeft: 8, verticalAlign: 'middle' }} />
            </button>
            <button onClick={() => router.push('/pakkebygger')} style={{
              background: 'transparent', border: `1px solid rgba(${goldRgb},0.2)`, color: gold, borderRadius: 14, padding: '16px 28px',
              fontWeight: 600, fontSize: 16, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>
              {lang === 'no' ? 'Se priser' : 'See pricing'}
            </button>
          </div>
        </motion.div>
      </section>

      <Footer minimal />
    </div>
  )
}
