'use client'
import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Zap, BarChart3, Users, MessageSquare, Database,
  Bell, Target, Mail, Phone, Settings, Search, TrendingUp,
  ChevronDown, Sparkles
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, globalStyles } from '@/lib/constants'

/* ── FAQ Accordion ── */
function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          background: open === i ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
          border: `1px solid ${open === i ? `rgba(${goldRgb},0.15)` : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 14, overflow: 'hidden', transition: 'all 0.3s',
        }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '18px 22px', background: 'transparent', border: 'none', color: '#f0f0f0',
            fontSize: 15, fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans',sans-serif",
          }}>
            {item.q}
            <ChevronDown size={18} style={{ color: gold, transition: 'transform 0.3s', transform: open === i ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0, marginLeft: 12 }} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                <div style={{ padding: '0 22px 18px', fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{item.a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════
   LEAD GENERATION PAGE
   ══════════════════════════════════════════════════ */
export default function LeadGeneringPage() {
  const { lang } = useLanguage()
  const router = useRouter()

  const fadeUp = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55 },
  }

  /* ── Content ── */
  const setupSteps = lang === 'no' ? [
    {
      num: '01', icon: Search, title: 'Kartlegging av salgsflyt',
      desc: 'Vi analyserer din nåværende salgsprosess, lead-kilder og konverteringsrater. Hvor mange leads får du i dag? Hvor faller de av?',
      detail: 'Vi ser på hele salgstrakten — fra første kontaktpunkt til signert avtale — og identifiserer hvor leads faller av. Vi kartlegger også dine ideelle kundeprofilikull (ICP) — hvem er dine beste kunder i dag? Hva har de til felles? Denne informasjonen brukes til å lage AI-scrapere som finner mennesker akkurat som dem.',
    },
    {
      num: '02', icon: Zap, title: 'AI lead-scraping oppsett',
      desc: 'Vi konfigurerer automatisk innhenting av leads fra Google Maps, LinkedIn og Facebook. Systemet samler inn kandidater som matcher din ideelle kundeprofil.',
      detail: 'Systemet bruker AI til å finne bedrifter som matcher din ideelle kundeprofil basert på bransje, størrelse og lokasjon. For eksempel: Hvis du selger bokføringssoftware til små bedrifter i Oslo, scraperen finne alle tannleger, advokater og frisører i Oslo med 2–10 ansatte. Alt skjer 24/7 uten at du gjør noe.',
    },
    {
      num: '03', icon: Target, title: 'BANT-scoring og prioritering',
      desc: 'AI-en scorer alle leads basert på Budget, Authority, Need og Timeline. Hver lead får en automatisk score som hjelper salgsteamet å fokusere på de beste mulighetene.',
      detail: 'Hver lead får en automatisk score (0–100) basert på hvor godt de passer inn i din ideelle kundeprofil. Vi spør: Har de budsjett? Hvem tar avgjørelser? Trenger de det du selger? Og hvor raskt må de løse problemet? Leads med høyeste score prioriteres automatisk.',
    },
    {
      num: '04', icon: Bell, title: 'Speed-to-lead auto-respons',
      desc: 'Nye leads får automatisk svar innen sekunder — e-post, SMS eller WhatsApp. Forskning viser at leads kontaktet innen 5 minutter er 21x mer sannsynlig å konvertere.',
      detail: 'Når en ny lead oppdages, sender systemet automatisk en personalisert e-post innen sekunder. Hvis de svarer ja til et møte, booker systemet automatisk på en ledig time i kalenderen din. Dette kalles «speed-to-lead» og er en av de viktigste faktorene for konvertering.',
    },
    {
      num: '05', icon: Database, title: 'CRM-integrasjon og rapportering',
      desc: 'Alle leads synkroniseres automatisk til CRM-et ditt med full historikk. Dashboard med konverteringsrater og pipeline-verdi oppdateres i sanntid.',
      detail: 'Vi kobler til HubSpot, Salesforce, Pipedrive, Monday eller ditt eksisterende system. Hver lead som oppdages, blir automatisk lagt inn som en ny kontakt med sin BANT-score og kilder. Du får et dashboard som viser hvor mange leads som er inn denne uken, hvor mange som har sagt ja til møte, og hvor mye pipeline-verdi som bygges hver dag.',
    },
  ] : [
    {
      num: '01', icon: Search, title: 'Sales Process Mapping',
      desc: 'We analyze your current sales process, lead sources, and conversion rates. How many leads do you get today? Where do they drop off?',
      detail: 'We review your entire sales funnel — from first contact to signed contract — and identify where leads fall off. We also map your Ideal Customer Profile (ICP) — who are your best customers today? What do they have in common? This information is used to create AI scrapers that find people just like them.',
    },
    {
      num: '02', icon: Zap, title: 'AI Lead Scraping Setup',
      desc: 'We configure automatic lead collection from Google Maps, LinkedIn, and Facebook. The system gathers candidates matching your ideal customer profile.',
      detail: 'The system uses AI to find businesses matching your ICP based on industry, size, and location. For example: if you sell accounting software to small businesses in Oslo, the scraper finds all dentists, lawyers, and hairdressers in Oslo with 2–10 employees. Everything runs 24/7 without you doing anything.',
    },
    {
      num: '03', icon: Target, title: 'BANT Scoring & Prioritization',
      desc: 'The AI scores all leads based on Budget, Authority, Need, and Timeline. Each lead gets an automatic score helping your sales team focus on the best opportunities.',
      detail: 'Each lead receives an automatic score (0–100) based on how well they fit your ICP. We ask: Do they have budget? Who makes decisions? Do they need what you sell? How quickly must they solve the problem? Highest-scoring leads are automatically prioritized.',
    },
    {
      num: '04', icon: Bell, title: 'Speed-to-Lead Auto-Response',
      desc: 'New leads receive automatic replies within seconds — email, SMS, or WhatsApp. Research shows leads contacted within 5 minutes are 21x more likely to convert.',
      detail: 'When a new lead is discovered, the system automatically sends a personalized email within seconds. If they say yes to a meeting, the system automatically books an available time in your calendar. This is called "speed-to-lead" and is one of the most important conversion factors.',
    },
    {
      num: '05', icon: Database, title: 'CRM Integration & Reporting',
      desc: 'All leads sync automatically to your CRM with full history. Dashboard with conversion rates and pipeline value updates in real-time.',
      detail: 'We connect to HubSpot, Salesforce, Pipedrive, Monday, or your existing system. Every discovered lead is automatically added as a new contact with its BANT score and sources. You get a dashboard showing weekly new leads, meeting confirmations, and daily pipeline value building.',
    },
  ]

  const automationItems = lang === 'no' ? [
    'Google Maps lead-scraper',
    'LinkedIn lead-pipeline',
    'Facebook lead-ads integrasjon',
    'AI lead-scoring (BANT)',
    'Speed-to-lead auto-respons',
    'E-post drip-kampanjer',
    'SMS oppfølging',
    'WhatsApp business-meldinger',
    'CRM auto-sync',
    'Lead-beriking med AI',
    'Automatisk møtebooking',
    'Pipeline-rapportering',
    'Konverteringsanalyse',
    'Lead-dupliserings-sjekk',
    'Territorie-fordeling',
    'Win/loss-analyse',
    'Fornyelsespåminnelser',
    'Referral-tracking',
    'Proposal-generering',
    'ROI-dashboard',
  ] : [
    'Google Maps lead scraper',
    'LinkedIn lead pipeline',
    'Facebook lead ads integration',
    'AI lead scoring (BANT)',
    'Speed-to-lead auto-response',
    'Email drip campaigns',
    'SMS follow-up',
    'WhatsApp business messages',
    'CRM auto-sync',
    'Lead enrichment with AI',
    'Automatic meeting booking',
    'Pipeline reporting',
    'Conversion analysis',
    'Lead deduplication',
    'Territory distribution',
    'Win/loss analysis',
    'Renewal reminders',
    'Referral tracking',
    'Proposal generation',
    'ROI dashboard',
  ]

  const leadFlowSteps = lang === 'no' ? [
    { icon: Search, text: 'Lead oppdages', sub: 'Google Maps / LinkedIn / Facebook — AI scanner kontinuerlig for nye potensielle kunder' },
    { icon: Sparkles, text: 'AI beriker profilen', sub: 'Firmanavn, kontaktperson, e-post, telefon og bransje hentes automatisk' },
    { icon: Target, text: 'BANT-scoring kjøres', sub: 'Lead prioriteres basert på budsjett, beslutningsmyndighet, behov og tidsramme' },
    { icon: Mail, text: 'Auto-respons sendes', sub: 'Personalisert e-post eller SMS sendes innen sekunder' },
    { icon: Database, text: 'Lead legges i CRM', sub: 'Full profil med score og kontakthistorikk synkroniseres' },
    { icon: Bell, text: 'Salgsteam varsles', sub: 'Varme leads flagges for umiddelbar oppfølging' },
  ] : [
    { icon: Search, text: 'Lead discovered', sub: 'Google Maps / LinkedIn / Facebook — AI continuously scans for new potential customers' },
    { icon: Sparkles, text: 'AI enriches profile', sub: 'Company name, contact person, email, phone, and industry automatically extracted' },
    { icon: Target, text: 'BANT scoring runs', sub: 'Lead prioritized based on budget, authority, need, and timeline' },
    { icon: Mail, text: 'Auto-response sent', sub: 'Personalized email or SMS sent within seconds' },
    { icon: Database, text: 'Lead added to CRM', sub: 'Full profile with score and contact history synced' },
    { icon: Bell, text: 'Sales team alerted', sub: 'Warm leads flagged for immediate follow-up' },
  ]

  const faqItems = lang === 'no' ? [
    { q: 'Hvor kommer leadsene fra?', a: 'Vi henter leads fra Google Maps, LinkedIn, Facebook og andre kilder basert på din ideelle kundeprofil. Alt skjer automatisk og i tråd med GDPR. Vi bruker kun offentlig tilgjengelig informasjon og korrekt håndtering av personopplysninger.' },
    { q: 'Hva er BANT-scoring?', a: 'BANT står for Budget, Authority, Need og Timeline. AI-en vurderer hver lead på disse fire kriteriene for å prioritere de mest lovende mulighetene. En lead med høy score betyr at de sannsynligvis har penger, beslutningsmyndighet, faktisk behov, og trenger løsningen nå.' },
    { q: 'Kan dere koble til CRM-et vårt?', a: 'Ja, vi integrerer med alle store CRM-systemer: HubSpot, Salesforce, Pipedrive, Monday, og mange flere. Vi tilpasser oss ditt eksisterende system og sikrer at alle leads flyter automatisk inn med full informasjon.' },
    { q: 'Hvor raskt svarer auto-responsen?', a: 'Innen sekunder. Speed-to-lead er kritisk — forskning viser at sjansen for konvertering faller 80% etter de første 5 minuttene. Vår system reagerer øyeblikkelig når en ny lead oppdages.' },
    { q: 'Er lead-scrapingen lovlig?', a: 'Ja, vi henter kun offentlig tilgjengelig informasjon og følger GDPR fullt ut. Vi bruker aldri data som krever samtykke uten å ha det. Alle datakilder er transparente og lovlige. Vi hjelper også deg med å være GDPR-kompatibel når du sender follow-up.' },
  ] : [
    { q: 'Where do the leads come from?', a: 'We gather leads from Google Maps, LinkedIn, Facebook, and other sources based on your ideal customer profile. Everything is automatic and GDPR compliant. We use only publicly available information with proper data handling.' },
    { q: 'What is BANT scoring?', a: 'BANT stands for Budget, Authority, Need, and Timeline. The AI evaluates each lead on these four criteria to prioritize the most promising opportunities. A high-scoring lead means they likely have budget, decision authority, actual need, and require the solution now.' },
    { q: 'Can you connect to our CRM?', a: 'Yes, we integrate with all major CRM systems: HubSpot, Salesforce, Pipedrive, Monday, and many more. We adapt to your existing system and ensure all leads flow in automatically with complete information.' },
    { q: 'How fast is the auto-response?', a: 'Within seconds. Speed-to-lead is critical — research shows conversion chance drops 80% after the first 5 minutes. Our system responds instantly when a new lead is discovered.' },
    { q: 'Is lead scraping legal?', a: 'Yes, we collect only publicly available information and comply fully with GDPR. We never use data requiring consent without having it. All data sources are transparent and legal. We also help you stay GDPR-compliant when sending follow-ups.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: `${bg}`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles()}</style>

      <Nav />

      {/* ── HERO ── */}
      <motion.section {...fadeUp} style={{ maxWidth: 800, margin: '0 auto', padding: '50px 24px 40px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: `radial-gradient(ellipse, rgba(${goldRgb},0.05) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', borderRadius: 30, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.15)`, fontSize: 13, color: gold, marginBottom: 24 }}>
          <Zap size={14} />
          {lang === 'no' ? 'Lead-generering & Salg' : 'Lead Generation & Sales'}
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
          {lang === 'no' ? (
            <>Fang flere leads — <span style={{ color: gold }}>automatisk</span></>
          ) : (
            <>Capture more leads — <span style={{ color: gold }}>automatically</span></>
          )}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.65 }}>
          {lang === 'no'
            ? 'Fra Google Maps og LinkedIn-scraping til automatisk BANT-scoring og speed-to-lead respons. 20 automatiseringer som fyller pipelinen din uten manuelt arbeid.'
            : 'From Google Maps and LinkedIn scraping to automatic BANT scoring and speed-to-lead response. 20 automations that fill your pipeline without manual work.'}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          <button onClick={() => router.push('/kartlegging')} style={{
            background: gold, color: bg, border: 'none', borderRadius: 14, padding: '16px 36px',
            fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
            boxShadow: `0 8px 32px rgba(${goldRgb},0.25)`,
          }}>
            {lang === 'no' ? 'Få gratis analyse' : 'Get free analysis'}
            <ArrowRight size={16} style={{ display: 'inline', marginLeft: 8, verticalAlign: 'middle' }} />
          </button>
        </motion.div>
      </motion.section>

      {/* ── HOW IT WORKS: SETUP ── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
          {lang === 'no' ? 'Slik setter vi det opp' : 'How we set it up'}
        </motion.h2>
        <motion.p {...fadeUp} style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 15, marginBottom: 48, maxWidth: 520, margin: '0 auto 48px' }}>
          {lang === 'no'
            ? 'Vi tar oss av all oppsettet — fra analyse av salgsflyt til go-live med 20 automatiseringer.'
            : 'We handle all setup — from sales process analysis to go-live with 20 automations.'}
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {setupSteps.map((step, i) => (
            <SetupStep key={i} step={step} i={i} lang={lang} />
          ))}
        </div>
      </section>

      {/* ── WHAT HAPPENS WHEN A NEW LEAD COMES IN ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 60px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 36 }}>
          {lang === 'no' ? 'Hva skjer når en ny lead kommer inn?' : 'What happens when a new lead comes in?'}
        </motion.h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {leadFlowSteps.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: i < leadFlowSteps.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.icon size={18} color={gold} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{item.text}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{item.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── AUTOMATIONS INCLUDED ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 60px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 36 }}>
          {lang === 'no' ? '20 automatiseringer inkludert' : '20 automations included'}
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {automationItems.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
                padding: '16px 14px', fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4,
                textAlign: 'center', transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                ;(e.currentTarget as HTMLElement).style.borderColor = `rgba(${goldRgb},0.2)`
                ;(e.currentTarget as HTMLElement).style.color = '#f0f0f0'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
              }}>
              {item}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: 650, margin: '0 auto', padding: '40px 24px 60px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>
          {lang === 'no' ? 'Ofte stilte spørsmål' : 'Frequently asked questions'}
        </motion.h2>
        <motion.div {...fadeUp}>
          <FAQ items={faqItems} />
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <motion.section {...fadeUp} style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(${goldRgb},0.06) 0%, rgba(${goldRgb},0.02) 100%)`,
          border: `1px solid rgba(${goldRgb},0.15)`, borderRadius: 24, padding: '48px 32px',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 700, marginBottom: 12 }}>
            {lang === 'no' ? 'Klar for flere leads?' : 'Ready for more leads?'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px', lineHeight: 1.6 }}>
            {lang === 'no'
              ? 'Start med en gratis kartlegging og se hvor mange qualified leads du kan generere hver dag.'
              : 'Start with a free discovery and see how many qualified leads you can generate each day.'}
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

/* ── Setup Step with expand/collapse ── */
function SetupStep({ step, i, lang }: { step: any; i: number; lang: string }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      style={{
        background: expanded ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
        border: `1px solid ${expanded ? `rgba(${goldRgb},0.15)` : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 18, padding: '24px', transition: 'all 0.3s', cursor: 'pointer',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: `rgba(${goldRgb},0.15)`, lineHeight: 1 }}>{step.num}</div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <step.icon size={20} color={gold} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <h3 style={{ fontSize: 17, fontWeight: 600 }}>{step.title}</h3>
            <ChevronDown size={16} style={{ color: gold, transition: 'transform 0.3s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0 }} />
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, marginBottom: expanded ? 16 : 0 }}>{step.desc}</p>
          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                <div style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65,
                  padding: '14px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 10,
                  borderLeft: `2px solid rgba(${goldRgb},0.2)`,
                }}>
                  <span style={{ color: gold, fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    {lang === 'no' ? 'TEKNISK DETALJ:' : 'TECHNICAL DETAILS:'}
                  </span>
                  {step.detail}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
