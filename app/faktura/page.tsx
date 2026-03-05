'use client'
import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, BarChart3, Bot, Shield, CheckCircle2, ChevronDown, Sparkles,
  Phone, Clock, FileText, Lock, Users, Zap, Database, Bell, Settings,
  CreditCard, Receipt, Mail, Calculator
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
   FAKTURA & ØKONOMI PAGE
   ══════════════════════════════════════════════════ */
export default function FakturaPage() {
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
      num: '01', icon: BarChart3, title: 'Kartlegging av økonomiflyt',
      desc: 'Vi analyserer din nåværende fakturaprosess, betalingsløsninger og regnskapssystem. Målsetning er å forstå hele verdikjeden fra oppdrag og salg til betalt faktura.',
      detail: 'Vi ser på hele flyten fra oppdrag/salg til ferdig betalt faktura og identifiserer flaskehalser. Hvilke fakturaer mottas digitalt eller på papir? Hvor lang tid tar det fra faktura sendt til faktura betalt? Hvem godkjenner, hvem registrerer, og hvor oppstår feil eller forsinkelser?',
    },
    {
      num: '02', icon: Bot, title: 'AI fakturagjenerkjenning',
      desc: 'Vi setter opp AI som automatisk leser og kategoriserer innkommende fakturaer fra e-post. Systemet gjenkjenner leverandør, beløp, forfallsdato og konteringsinformasjon.',
      detail: 'OCR-teknologi kombinert med AI gjenkjenner leverandør, beløp, forfallsdato og konteringsinformasjon. AI-en lærer seg dine leverandører og typiske posteringer. Fakturaer som ankommer via e-post lastes automatisk inn, og du får et sammendrag av det viktigste før du trenger å gjøre noe manuelt.',
    },
    {
      num: '03', icon: CreditCard, title: 'Stripe/betalingsintegrasjon',
      desc: 'Betalinger fra Stripe, Vipps eller andre systemer kobles automatisk til regnskap. Hver transaksjon matches med riktig faktura og bokføres automatisk.',
      detail: 'Hver transaksjon matches med riktig faktura og bokføres automatisk i regnskapssystemet. Du trenger ikke å gjøre manuell registrering av inngåtte betalinger — det skjer helt automatisk når pengene kommer inn.',
    },
    {
      num: '04', icon: Bell, title: 'Purrerutiner og oppfølging',
      desc: 'Automatiske purringer sendes ved forfall med eskalerende påminnelser. Systemet holder oversikt over hvem som skylder hva og når de må betale.',
      detail: 'Første påminnelse sendes 3 dager før forfall, purring ved forfall, og eskalering etter 14 og 30 dager. Alle purringer er tilpasset ditt språk og design. Du kan sette regler for hvem som får purring, og unntak håndteres manuelt hvis nødvendig.',
    },
    {
      num: '05', icon: Settings, title: 'Rapportering og kontroll',
      desc: 'Dashboard med kontantstrøm, utestående fordringer og betalingshistorikk. Du får sanntidsoversikt over økonomisk status med varsler for uregelmessigheter.',
      detail: 'Sanntidsoversikt over økonomisk status med varsler for uregelmessigheter og likviditetsproblemer. Dashboard viser kontantstrøm, utestående fordringer, gjennomsnittlig betalingstid, og andre KPI-er som er viktige for bedriften din. Alt oppdateres i real-time.',
    },
  ] : [
    {
      num: '01', icon: BarChart3, title: 'Cash Flow Assessment',
      desc: 'We analyze your current invoicing process, payment solutions, and accounting system. The goal is to understand the full value chain from orders to paid invoices.',
      detail: 'We examine the entire flow from orders/sales to paid invoices and identify bottlenecks. Which invoices arrive digitally or on paper? How long does it take from invoice sent to invoice paid? Who approves, who registers, and where do errors or delays occur?',
    },
    {
      num: '02', icon: Bot, title: 'AI Invoice Recognition',
      desc: 'We set up AI that automatically reads and categorizes incoming invoices from email. The system recognizes vendor, amount, due date, and accounting information.',
      detail: 'OCR technology combined with AI recognizes vendor, amount, due date, and accounting information. The AI learns your vendors and typical postings. Invoices arriving via email are automatically loaded, and you get a summary of what\'s important before needing to do anything manually.',
    },
    {
      num: '03', icon: CreditCard, title: 'Stripe/Payment Integration',
      desc: 'Payments from Stripe, Vipps or other systems are automatically connected to accounting. Each transaction is matched with the correct invoice and posted automatically.',
      detail: 'Each transaction is matched with the correct invoice and posted automatically in the accounting system. You don\'t need to manually register received payments — it happens completely automatically when money arrives.',
    },
    {
      num: '04', icon: Bell, title: 'Reminder Routines & Follow-up',
      desc: 'Automatic reminders are sent at due date with escalating notifications. The system keeps track of who owes what and when they must pay.',
      detail: 'First reminder sent 3 days before due date, reminder at due date, and escalation after 14 and 30 days. All reminders are customized to your language and design. You can set rules for who gets reminders, and exceptions are handled manually if needed.',
    },
    {
      num: '05', icon: Settings, title: 'Reporting & Control',
      desc: 'Dashboard with cash flow, outstanding receivables, and payment history. You get real-time overview of financial status with alerts for irregularities.',
      detail: 'Real-time overview of financial status with alerts for irregularities and liquidity problems. Dashboard shows cash flow, outstanding receivables, average payment time, and other KPIs important for your business. Everything updates in real-time.',
    },
  ]

  const flowItems = lang === 'no' ? [
    { icon: FileText, text: 'Faktura opprettes eller mottas', sub: 'Automatisk fra oppdrag, eller AI leser innkommende faktura fra e-post' },
    { icon: Bot, text: 'AI klassifiserer og konterer', sub: 'Leverandør, beløp, moms og konto identifiseres' },
    { icon: CheckCircle2, text: 'Godkjenningsflyt kjøres', sub: 'Riktig person får varsling for godkjenning basert på beløp og type' },
    { icon: Calculator, text: 'Bokføring skjer automatisk', sub: 'Fakturaen føres i regnskapssystemet med riktig kontering' },
    { icon: CreditCard, text: 'Betaling og matching', sub: 'Stripe/Vipps-betaling matches automatisk med faktura' },
    { icon: Bell, text: 'Purring ved forfall', sub: 'Automatiske påminnelser sendes til kunder med utestående beløp' },
  ] : [
    { icon: FileText, text: 'Invoice created or received', sub: 'Automatically from orders, or AI reads incoming invoice from email' },
    { icon: Bot, text: 'AI classifies and posts', sub: 'Vendor, amount, VAT and account are identified' },
    { icon: CheckCircle2, text: 'Approval flow runs', sub: 'Right person gets notification for approval based on amount and type' },
    { icon: Calculator, text: 'Posting happens automatically', sub: 'Invoice is entered in the accounting system with correct posting' },
    { icon: CreditCard, text: 'Payment and matching', sub: 'Stripe/Vipps payment is automatically matched with invoice' },
    { icon: Bell, text: 'Reminder at due date', sub: 'Automatic reminders sent to customers with outstanding amounts' },
  ]

  const automations = lang === 'no' ? [
    'AI fakturaprosessering',
    'OCR fakturagjenerkjenning',
    'Automatisk kontering',
    'Stripe → regnskap sync',
    'Vipps-integrasjon',
    'Purreautomatikk',
    'Forfallsvarsler',
    'Kontantstrøm-dashboard',
    'Godkjenningsflyt',
    'Leverandørmatch',
    'Moms-beregning',
    'Kreditnotaer',
    'Utleggshåndtering',
    'Årsoppgjør-forberedelse',
    'Likviditetsvarsler',
  ] : [
    'AI invoice processing',
    'OCR invoice recognition',
    'Automatic posting',
    'Stripe → accounting sync',
    'Vipps integration',
    'Reminder automation',
    'Due date alerts',
    'Cash flow dashboard',
    'Approval workflows',
    'Vendor matching',
    'VAT calculation',
    'Credit notes',
    'Expense management',
    'Year-end preparation',
    'Liquidity alerts',
  ]

  const faqItems = lang === 'no' ? [
    { q: 'Hvilke regnskapssystemer støttes?', a: 'Vi integrerer med Tripletex, Fiken, Visma, PowerOffice, 24SevenOffice og de fleste norske regnskapssystemer. Vi kan også kople til egendefinerte løsninger via API eller filintegrasjon.' },
    { q: 'Kan AI-en lese håndskrevne fakturaer?', a: 'Ja, OCR-teknologien håndterer både digitale og skannede fakturaer, inkludert håndskrevne felt. Vi har høy nøyaktighet, men noen håndskrevne elementer kan kreve manuell kontroll.' },
    { q: 'Er dette trygt med tanke på økonomisk data?', a: 'All data krypteres i transit og i hvile. Vi følger norsk regnskapslov og GDPR for all databehandling. Vi inngår databehandleravtale med alle kunder, og data lagres på servere i EØS.' },
    { q: 'Hva med moms-håndtering?', a: 'AI-en gjenkjenner momsbeløp og fordeler korrekt mellom inngående og utgående moms automatisk. Du kan også sette regler for hvilke kategorier som har hvilken momssats.' },
    { q: 'Kan jeg fortsatt godkjenne fakturaer manuelt?', a: 'Absolutt. Du velger selv hvilke beløpsgrenser som krever manuell godkjenning. Fakturaer over grensen blir sendt til godkjent person, mens mindre beløp bokføres direkte.' },
  ] : [
    { q: 'Which accounting systems are supported?', a: 'We integrate with Tripletex, Fiken, Visma, PowerOffice, 24SevenOffice, and most Norwegian accounting systems. We can also connect to custom solutions via API or file integration.' },
    { q: 'Can the AI read handwritten invoices?', a: 'Yes, OCR technology handles both digital and scanned invoices, including handwritten fields. We have high accuracy, but some handwritten elements may require manual review.' },
    { q: 'Is this safe for financial data?', a: 'All data is encrypted in transit and at rest. We follow Norwegian accounting law and GDPR for all processing. We sign a data processing agreement with all clients, and data is stored on servers in the EEA.' },
    { q: 'What about VAT handling?', a: 'The AI recognizes VAT amounts and automatically distributes them correctly between input and output VAT. You can also set rules for which categories have which VAT rate.' },
    { q: 'Can I still manually approve invoices?', a: 'Absolutely. You choose which amount thresholds require manual approval. Invoices above the threshold are sent to the approver, while smaller amounts are posted directly.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: `${bg}`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles()}</style>

      <Nav />

      {/* ── HERO ── */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 800, margin: '0 auto', padding: '50px 24px 40px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: `radial-gradient(ellipse, rgba(${goldRgb},0.05) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 20px', borderRadius: 30, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.15)`, fontSize: 13, color: gold, marginBottom: 24 }}>
          <BarChart3 size={14} />
          {lang === 'no' ? 'Faktura & Økonomi' : 'Invoicing & Finance'}
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
          {lang === 'no' ? (
            <>Automatiser <span style={{ color: gold }}>fakturering</span> fra A til Å</>
          ) : (
            <>Automate <span style={{ color: gold }}>invoicing</span> from start to finish</>
          )}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.65 }}>
          {lang === 'no'
            ? 'Full-syklus faktura-automatisering fra opprettelse til betaling. AI leser fakturaer fra e-post, kobler Stripe-betalinger til regnskap og sender automatiske purringer. 15 automatiseringer.'
            : 'Full-cycle invoice automation from creation to payment. AI reads invoices from email, connects Stripe payments to accounting and sends automatic reminders. 15 automations.'}
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
            ? 'Vi tar oss av alt det tekniske. Du trenger ikke vite noe om teknologi — bare fortell oss om bedriften din.'
            : 'We handle all the technical work. You don\'t need to know anything about technology — just tell us about your business.'}
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {setupSteps.map((step, i) => (
            <SetupStep key={i} step={step} i={i} lang={lang} />
          ))}
        </div>
      </section>

      {/* ── INVOICE FLOW ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 60px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 36 }}>
          {lang === 'no' ? 'Hva skjer med en faktura?' : 'What happens with an invoice?'}
        </motion.h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {flowItems.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
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

      {/* ── 15 AUTOMATIONS GRID ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 60px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 10 }}>
          {lang === 'no' ? '15 automatiseringer — ferdig satt opp' : '15 automations — ready to go'}
        </motion.h2>
        <motion.p {...fadeUp} style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 14, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          {lang === 'no'
            ? 'Alt fra AI-lesing til rapportering er inkludert i systemet.'
            : 'Everything from AI reading to reporting is included in the system.'}
        </motion.p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {automations.map((auto, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14,
                padding: '16px 14px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
              <CheckCircle2 size={16} color={gold} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{auto}</span>
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
            {lang === 'no' ? 'Klar for automatisert fakturering?' : 'Ready for automated invoicing?'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px', lineHeight: 1.6 }}>
            {lang === 'no'
              ? 'Start med en gratis kartlegging og se hva AI kan gjøre for økonomien din.'
              : 'Start with a free discovery and see what AI can do for your finances.'}
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
                    {lang === 'no' ? 'TEKNISK DETALJ:' : 'TECHNICAL DETAIL:'}
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
