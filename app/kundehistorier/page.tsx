'use client'
import { useLanguage } from '@/lib/language-context'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Phone, Bot, Shield, BarChart3, CheckCircle2,
  Star, Users, TrendingUp, Building2, Menu, X, Clock, Zap,
  ArrowUpRight, Sparkles, Quote
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, globalStyles } from '@/lib/constants'

export default function KundehistorierPage() {
  const { lang } = useLanguage()
  const router = useRouter()

  const fadeUp = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55 },
  }

  const stories = lang === 'no' ? [
    {
      name: 'Byggmester Haugen AS',
      industry: 'Bygg & Håndverk',
      person: 'Martin Haugen',
      role: 'Daglig leder',
      avatar: 'MH',
      quote: 'Vi gikk fra å tape 15 henvendelser i uken til null. AI-mobilsvareren har bokstavelig talt forandret hvordan vi driver bedriften.',
      challenge: 'Martin drev et lite byggefirma med 8 ansatte. Telefonen ringte konstant — under møter, på byggeplassen, etter arbeidstid. Han anslo at de tapte minst 15 henvendelser per uke fordi ingen kunne svare. Hver tapt henvendelse var potensielt en jobb verdt 50 000–200 000 kr.',
      solution: 'Vi satte opp AI-mobilsvarer som svarer 24/7 på norsk. AI-en kvalifiserer henvendelser ("Hva slags arbeid trenger du?", "Hvilket postnummer?", "Haster det?"), sender Martin et sammendrag på SMS, og logger alt automatisk i kunderegisteret hans.',
      results: [
        { label: 'Tapte henvendelser', before: '~15/uke', after: '0', color: '#4ade80' },
        { label: 'Responstid', before: '4-8 timer', after: 'Umiddelbart', color: '#4ade80' },
        { label: 'Nye jobber per måned', before: '8-10', after: '14-18', color: '#4ade80' },
        { label: 'Estimert ekstra omsetning', before: '—', after: '+127%', color: gold },
      ],
      timeline: '3 dager fra start til go-live',
    },
    {
      name: 'Salong Lux',
      industry: 'Frisør & Skjønnhet',
      person: 'Lena Kristiansen',
      role: 'Eier og stylist',
      avatar: 'LK',
      quote: 'Uteblivelsene våre gikk ned 40% på første måned. Kundene elsker at de får SMS-påminnelse — og jeg slipper å ringe rundt manuelt.',
      challenge: 'Lena hadde en salong med 4 stylister. Problemet var todelt: hun brukte 1–2 timer daglig på å svare telefon og booke timer, og ca. 20% av bookingene ble no-shows. Hver uteblivelse kostet salongen ca. 800–1 500 kr i tapt inntekt.',
      solution: 'AI-mobilsvareren tar imot alle telefonhenvendelser, booker timer direkte i Lenas kalendersystem, og sender automatiske SMS-påminnelser 24 timer og 2 timer før avtalen. Etter samtalen får Lena en oppsummering med kundens navn og hva de booket.',
      results: [
        { label: 'Uteblivelser (no-shows)', before: '~20%', after: '12%', color: '#4ade80' },
        { label: 'Tid brukt på telefon', before: '1-2 timer/dag', after: '10 min/dag', color: '#4ade80' },
        { label: 'Bookinger per uke', before: '35-40', after: '50-55', color: '#4ade80' },
        { label: 'Frigjort tid per måned', before: '—', after: '+40 timer', color: gold },
      ],
      timeline: '2 dager fra start til go-live',
    },
    {
      name: 'Advokatfirma Holm & Co',
      industry: 'Advokat & Juridisk',
      person: 'Erik Thomassen',
      role: 'Partner',
      avatar: 'ET',
      quote: 'Klientinntak som tok 2 timer tar nå 10 minutter. AI-en samler inn all nødvendig informasjon før vi i det hele tatt har snakket med klienten.',
      challenge: 'Erik er partner i et advokatfirma med 6 advokater. Klientinntak var tidkrevende — assistenten måtte ringe tilbake, stille standardspørsmål, og manuelt føre inn data. Mange potensielle klienter gikk til konkurrenter fordi de ikke fikk rask nok respons.',
      solution: 'AI-mobilsvareren fungerer som en digital inntaksassistent. Den stiller de riktige spørsmålene tilpasset sakstype ("Er dette en sivilsak eller strafferett?", "Har du frist som løper?"), samler kontaktinfo, og oppretter en sak i registeret med all relevant informasjon — klar for advokaten.',
      results: [
        { label: 'Inntakstid per klient', before: '2 timer', after: '10 minutter', color: '#4ade80' },
        { label: 'Konvertering til klient', before: '35%', after: '52%', color: '#4ade80' },
        { label: 'Responstid til ny klient', before: '1-2 dager', after: 'Under 1 minutt', color: '#4ade80' },
        { label: 'Timer spart per uke', before: '—', after: '~15 timer', color: gold },
      ],
      timeline: '5 dager fra start til go-live',
    },
  ] : [
    {
      name: 'Byggmester Haugen AS',
      industry: 'Construction',
      person: 'Martin Haugen',
      role: 'CEO',
      avatar: 'MH',
      quote: 'We went from losing 15 inquiries per week to zero. The AI answering service has literally changed how we run the business.',
      challenge: 'Martin ran a small construction firm with 8 employees. The phone rang constantly — during meetings, on-site, after hours. He estimated losing at least 15 inquiries per week. Each lost inquiry was potentially a job worth NOK 50,000–200,000.',
      solution: 'We set up AI phone answering that responds 24/7 in Norwegian. The AI qualifies inquiries, sends Martin a summary via SMS, and automatically logs everything in his customer database.',
      results: [
        { label: 'Lost inquiries', before: '~15/week', after: '0', color: '#4ade80' },
        { label: 'Response time', before: '4-8 hours', after: 'Immediate', color: '#4ade80' },
        { label: 'New jobs per month', before: '8-10', after: '14-18', color: '#4ade80' },
        { label: 'Est. extra revenue', before: '—', after: '+127%', color: gold },
      ],
      timeline: '3 days from start to go-live',
    },
    {
      name: 'Salon Lux',
      industry: 'Beauty & Hair',
      person: 'Lena Kristiansen',
      role: 'Owner & Stylist',
      avatar: 'LK',
      quote: 'No-shows dropped 40% in the first month. Customers love the SMS reminders — and I don\'t have to call around manually anymore.',
      challenge: 'Lena had a salon with 4 stylists. She spent 1–2 hours daily answering phones and booking appointments, and about 20% of bookings were no-shows, costing NOK 800–1,500 each.',
      solution: 'The AI handles all phone inquiries, books appointments directly in Lena\'s calendar, and sends automatic SMS reminders 24 hours and 2 hours before the appointment.',
      results: [
        { label: 'No-shows', before: '~20%', after: '12%', color: '#4ade80' },
        { label: 'Time on phone', before: '1-2 hrs/day', after: '10 min/day', color: '#4ade80' },
        { label: 'Bookings per week', before: '35-40', after: '50-55', color: '#4ade80' },
        { label: 'Time freed per month', before: '—', after: '+40 hours', color: gold },
      ],
      timeline: '2 days from start to go-live',
    },
    {
      name: 'Holm & Co Law Firm',
      industry: 'Legal',
      person: 'Erik Thomassen',
      role: 'Partner',
      avatar: 'ET',
      quote: 'Client intake that took 2 hours now takes 10 minutes. The AI gathers all necessary information before we even speak to the client.',
      challenge: 'Erik is a partner at a law firm with 6 lawyers. Client intake was time-consuming — the assistant had to call back, ask standard questions, and manually enter data.',
      solution: 'The AI acts as a digital intake assistant. It asks the right questions tailored to case type, collects contact info, and creates a case file with all relevant information — ready for the lawyer.',
      results: [
        { label: 'Intake time per client', before: '2 hours', after: '10 minutes', color: '#4ade80' },
        { label: 'Conversion to client', before: '35%', after: '52%', color: '#4ade80' },
        { label: 'Response time', before: '1-2 days', after: 'Under 1 minute', color: '#4ade80' },
        { label: 'Hours saved per week', before: '—', after: '~15 hours', color: gold },
      ],
      timeline: '5 days from start to go-live',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: `${bg}`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles() + `@media(max-width:768px){.story-grid{grid-template-columns:1fr!important}}`}</style>

      <Nav />

      {/* ── HERO ── */}
      <motion.section {...fadeUp} style={{ maxWidth: 800, margin: '0 auto', padding: '50px 24px 30px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', borderRadius: 30, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.15)`, fontSize: 13, color: gold, marginBottom: 24 }}>
          <Star size={14} />
          {lang === 'no' ? 'Typiske scenarier' : 'Typical Scenarios'}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>
          {lang === 'no' ? (
            <>Slik kan AI hjelpe <span style={{ color: gold }}>din bedrift</span></>
          ) : (
            <>How AI can help <span style={{ color: gold }}>your business</span></>
          )}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
          {lang === 'no'
            ? 'Typiske scenarier som viser hvordan AI-mobilsvarer kan spare tid, fange flere henvendelser, og gi bedre kundeservice.'
            : 'Typical scenarios showing how AI phone answering can save time, capture more inquiries, and provide better customer service.'}
        </motion.p>
      </motion.section>

      {/* ── STORIES ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32, padding: '12px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, fontSize: 12, color: 'rgba(255,255,255,0.35)', maxWidth: 600, margin: '0 auto 32px' }}>
          {lang === 'no'
            ? '📋 Scenariene under er illustrative eksempler basert på typiske utfordringer i norske bedrifter. De representerer ikke faktiske kunder.'
            : '📋 The scenarios below are illustrative examples based on typical challenges in Norwegian businesses. They do not represent actual clients.'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {stories.map((story, i) => (
            <motion.article key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 22, overflow: 'hidden',
              }}>
              {/* Header */}
              <div style={{ padding: '28px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', background: `rgba(${goldRgb},0.1)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 16, color: gold,
                  }}>
                    {story.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>{story.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{story.person} · {story.role}</span>
                      <span style={{ fontSize: 11, color: gold, background: `rgba(${goldRgb},0.06)`, padding: '2px 8px', borderRadius: 6, border: `1px solid rgba(${goldRgb},0.12)` }}>{story.industry}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(j => <Star key={j} size={14} fill={gold} color={gold} />)}
                </div>
              </div>

              {/* Quote */}
              <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <p style={{ fontSize: 16, fontStyle: 'italic', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, position: 'relative', paddingLeft: 20 }}>
                  <span style={{ position: 'absolute', left: 0, top: -2, fontSize: 32, color: `rgba(${goldRgb},0.3)`, fontFamily: "'Playfair Display', serif" }}>"</span>
                  {story.quote}
                </p>
              </div>

              {/* Challenge & Solution */}
              <div className="story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ padding: '22px 28px', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff6b6b' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#ff6b6b', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {lang === 'no' ? 'Utfordring' : 'Challenge'}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{story.challenge}</p>
                </div>
                <div style={{ padding: '22px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: gold }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: gold, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {lang === 'no' ? 'Løsning' : 'Solution'}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{story.solution}</p>
                </div>
              </div>

              {/* Results */}
              <div style={{ padding: '22px 28px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                  {lang === 'no' ? 'Resultater' : 'Results'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  {story.results.map((r, j) => (
                    <div key={j} style={{
                      background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '14px 16px',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{r.label}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>{r.before}</span>
                        <ArrowRight size={12} color="rgba(255,255,255,0.2)" />
                        <span style={{ fontSize: 16, fontWeight: 700, color: r.color }}>{r.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={12} />
                  {story.timeline}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── SUMMARY STATS ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '20px 24px 60px' }}>
        <motion.div {...fadeUp} style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 1,
          background: `rgba(${goldRgb},0.06)`, borderRadius: 18, overflow: 'hidden',
          border: `1px solid rgba(${goldRgb},0.1)`,
        }}>
          {[
            { value: '24/7', label: lang === 'no' ? 'AI-tilgjengelighet' : 'AI availability', sub: lang === 'no' ? 'hele døgnet' : 'around the clock' },
            { value: '3-5', label: lang === 'no' ? 'Dager oppsett' : 'Days setup', sub: lang === 'no' ? 'typisk' : 'typically' },
            { value: '100%', label: lang === 'no' ? 'GDPR-kompatibel' : 'GDPR compliant', sub: lang === 'no' ? 'norsk lov' : 'Norwegian law' },
            { value: '0 kr', label: lang === 'no' ? 'Gratis analyse' : 'Free analysis', sub: lang === 'no' ? 'uforpliktende' : 'no obligations' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '24px 16px', textAlign: 'center', background: bg }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: gold, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{s.sub}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <motion.section {...fadeUp} style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(${goldRgb},0.06) 0%, rgba(${goldRgb},0.02) 100%)`,
          border: `1px solid rgba(${goldRgb},0.15)`, borderRadius: 24, padding: '48px 32px',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 700, marginBottom: 12 }}>
            {lang === 'no' ? 'Bli den neste suksesshistorien' : 'Be the next success story'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px', lineHeight: 1.6 }}>
            {lang === 'no'
              ? 'Start med en gratis kartlegging og se hva AI kan gjøre for akkurat din bedrift.'
              : 'Start with a free discovery and see what AI can do for your specific business.'}
          </p>
          <button onClick={() => router.push('/kartlegging')} style={{
            background: gold, color: bg, border: 'none', borderRadius: 14, padding: '16px 36px',
            fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
            boxShadow: `0 8px 32px rgba(${goldRgb},0.25)`,
          }}>
            {lang === 'no' ? 'Start gratis kartlegging' : 'Start free discovery'}
            <ArrowRight size={16} style={{ display: 'inline', marginLeft: 8, verticalAlign: 'middle' }} />
          </button>
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}
