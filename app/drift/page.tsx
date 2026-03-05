'use client'
import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Clock, Bot, Shield, BarChart3, CheckCircle2, ChevronDown, Sparkles, Phone, FileText,
  Lock, Users, Zap, Database, Bell, Settings, Mail, Clipboard, TrendingUp, AlertTriangle, Calendar
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
   DRIFT & RAPPORTERING PAGE
   ══════════════════════════════════════════════════ */
export default function DriftPage() {
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
      num: '01', icon: Clipboard, title: 'Driftskartlegging',
      desc: 'Vi analyserer arbeidsflytene dine, verktøyene du bruker og de manuelle prosessene som tar mest tid.',
      detail: 'Vi identifiserer de 20% av oppgavene som tar 80% av tiden og automatiserer dem. Vi ser på e-posthåndtering, møteplanlegging, tidsrapportering, fakturabehandling, kundeoppfølging og alt annet som krever manuelt arbeid. Resultatet er en prioritert liste over automatiseringer som gir størst innvirkning.',
    },
    {
      num: '02', icon: Mail, title: 'E-post → oppgave-automatisering',
      desc: 'E-poster konverteres automatisk til oppgaver i Notion, Trello, Asana eller ditt prosjektverktøy.',
      detail: 'AI-en leser e-posten, identifiserer handling, frist og prioritet, og oppretter oppgaven automatisk. Hvis e-posten er fra en kunde som trenger hjelp, opprettes en supportoppgave. Hvis det er en finansiell rapport, opprettes en oppgave til økonomiteamet. Alt skjer uten at noen må kopiere og lime inn informasjon manuelt.',
    },
    {
      num: '03', icon: Phone, title: 'Zoom AI-møteassistent',
      desc: 'AI-en deltar i møtene dine, tar notater, identifiserer oppgaver og sender sammendrag.',
      detail: 'Etter hvert møte får deltakerne et strukturert sammendrag med beslutninger, oppgaver og neste steg. Hvis møtet handler om produktforbedringer, opprettes automatisk oppgaver i backloggen. Hvis det diskuteres budsjett, registreres det automatisk i regnskapet. Alt transkriberes og søkbart senere.',
    },
    {
      num: '04', icon: TrendingUp, title: 'KPI-varslingssystem',
      desc: 'Sanntidsvarsler når viktige KPIer endrer seg — omsetning, konvertering, kostnader eller kundetilfredshet.',
      detail: 'Du definerer terskelverdier og AI-en overvåker kontinuerlig, med varsler via e-post, SMS eller Slack. Hvis omsetningen faller under 80% av målsetningen, varsler systemet automatisk. Hvis kundetilfredshet er under 4/5, eskalerer det til ledelsen. Alt oppstilles i et dashboard med historiske trender.',
    },
    {
      num: '05', icon: Bell, title: 'Daglig AI-digest',
      desc: 'Hver morgen får du en samlet oversikt over alt viktig fra forrige dag.',
      detail: 'E-poster, oppgavestatus, KPI-endringer, nye leads og kommende møter — alt i én oppsummering. Systemet prioriterer automatisk og setter de viktigste punktene øverst. Du bruker 5 minutter på å lese digesten i stedet for 60 minutter på å manuelt sjekke 10 ulike verktøy.',
    },
  ] : [
    {
      num: '01', icon: Clipboard, title: 'Operations Mapping',
      desc: 'We analyze your workflows, the tools you use, and the manual processes that take the most time.',
      detail: 'We identify the 20% of tasks taking 80% of your time and automate them. We review email handling, meeting scheduling, time tracking, invoice processing, customer follow-up, and everything requiring manual work. The result is a prioritized list of automations with the greatest impact.',
    },
    {
      num: '02', icon: Mail, title: 'Email → Task Automation',
      desc: 'Emails are automatically converted to tasks in Notion, Trello, Asana, or your project tool.',
      detail: 'The AI reads the email, identifies the action, deadline, and priority, and creates the task automatically. If the email is from a customer needing help, a support task is created. If it\'s a financial report, a task is created for the finance team. Everything happens without manual copy-paste.',
    },
    {
      num: '03', icon: Phone, title: 'Zoom AI Meeting Assistant',
      desc: 'The AI joins your meetings, takes notes, identifies tasks, and sends summaries.',
      detail: 'After each meeting, participants receive a structured summary with decisions, tasks, and next steps. If the meeting discusses product improvements, tasks are automatically created in the backlog. If budget is discussed, it\'s automatically recorded in accounting. Everything is transcribed and searchable later.',
    },
    {
      num: '04', icon: TrendingUp, title: 'KPI Alert System',
      desc: 'Real-time alerts when important KPIs change — revenue, conversion, costs, or customer satisfaction.',
      detail: 'You define thresholds and the AI continuously monitors, with alerts via email, SMS, or Slack. If revenue falls below 80% of target, the system automatically alerts. If customer satisfaction is below 4/5, it escalates to management. Everything is displayed in a dashboard with historical trends.',
    },
    {
      num: '05', icon: Bell, title: 'Daily AI Digest',
      desc: 'Every morning you get a consolidated overview of everything important from yesterday.',
      detail: 'Emails, task status, KPI changes, new leads, and upcoming meetings — all in one summary. The system automatically prioritizes and places the most important items first. You spend 5 minutes reading the digest instead of 60 minutes manually checking 10 different tools.',
    },
  ]

  const driftFlowSteps = lang === 'no' ? [
    { icon: Mail, text: 'E-post mottas med oppgave', sub: 'AI leser innholdet og identifiserer handling' },
    { icon: CheckCircle2, text: 'Oppgave opprettes automatisk', sub: 'I Notion/Trello/Asana med frist og prioritet' },
    { icon: Phone, text: 'Møte gjennomføres med AI', sub: 'Notater, oppgaver og beslutninger registreres' },
    { icon: AlertTriangle, text: 'KPI-endring oppdages', sub: 'AI varsler deg om viktige avvik i sanntid' },
    { icon: FileText, text: 'Daglig digest genereres', sub: 'Samlet oversikt over alt viktig fra forrige dag' },
    { icon: BarChart3, text: 'Månedlig rapport lages', sub: 'Trender, innsikt og anbefalinger for neste periode' },
  ] : [
    { icon: Mail, text: 'Email received with task', sub: 'AI reads content and identifies action' },
    { icon: CheckCircle2, text: 'Task created automatically', sub: 'In Notion/Trello/Asana with deadline and priority' },
    { icon: Phone, text: 'Meeting conducted with AI', sub: 'Notes, tasks, and decisions recorded' },
    { icon: AlertTriangle, text: 'KPI change detected', sub: 'AI alerts you about important deviations in real-time' },
    { icon: FileText, text: 'Daily digest generated', sub: 'Consolidated overview of everything important from yesterday' },
    { icon: BarChart3, text: 'Monthly report created', sub: 'Trends, insights, and recommendations for next period' },
  ]

  const automationItems = lang === 'no' ? [
    'E-post → oppgave (Notion/Trello)',
    'Zoom AI-møteassistent',
    'KPI-varslingssystem',
    'Daglig AI bedriftsdigest',
    'Prosjektstatus-oppdatering',
    'Tidssporing-automatisering',
    'Frist-påminnelser',
    'Ressursallokering',
    'Automatisk rapportgenerering',
    'Slack/Teams-integrasjon',
    'Dokumentklassifisering',
    'Kontraktsovervåkning',
    'Leverandør-oppfølging',
    'Inventar-varsler',
    'Onboarding-automatisering',
    'Ferieoversikt og planlegging',
    'Møteplanlegging-AI',
    'Utgiftshåndtering',
    'Reisebestilling-assistent',
    'SLA-overvåkning',
    'Kvalitetskontroll-sjekklister',
    'Risiko-varsling',
    'Prosessdokumentasjon',
    'Kompetansekartlegging',
    'Benchmarking-rapporter',
  ] : [
    'Email → Task (Notion/Trello)',
    'Zoom AI Meeting Assistant',
    'KPI Alert System',
    'Daily AI Business Digest',
    'Project Status Updates',
    'Time Tracking Automation',
    'Deadline Reminders',
    'Resource Allocation',
    'Automatic Report Generation',
    'Slack/Teams Integration',
    'Document Classification',
    'Contract Monitoring',
    'Vendor Follow-up',
    'Inventory Alerts',
    'Onboarding Automation',
    'Holiday Overview & Planning',
    'AI Meeting Scheduling',
    'Expense Management',
    'Travel Booking Assistant',
    'SLA Monitoring',
    'Quality Control Checklists',
    'Risk Alerts',
    'Process Documentation',
    'Competency Mapping',
    'Benchmarking Reports',
  ]

  const faqItems = lang === 'no' ? [
    { q: 'Hvilke prosjektverktøy støttes?', a: 'Notion, Trello, Asana, Monday.com, Jira, ClickUp og mange flere. Vi tilpasser oss ditt eksisterende verktøy. Hvis du bruker et verktøy vi ikke har standard-integrasjon til, kan vi bruke API-ene til å bygge en custom løsning.' },
    { q: 'Hvordan fungerer Zoom AI-møteassistenten?', a: 'AI-en deltar som en stille deltaker i møtet, transkriberer alt, identifiserer oppgaver og sender et strukturert sammendrag etter møtet. Den oppfatter også stemningene i møtet og kan flagge hvis det virker som at noen er uenige eller usikre.' },
    { q: 'Kan jeg tilpasse KPI-varslene?', a: 'Ja, du definerer selv hvilke KPIer som er viktige og ved hvilke terskelverdier du vil bli varslet. Du kan også velge hvordan du vil motta varslene — e-post, SMS, Slack, Teams eller en push-notifikasjon i dashboardet.' },
    { q: 'Hva inneholder den daglige digesten?', a: 'Nye e-poster som krever handling, oppgavestatus, KPI-endringer, nye leads, dagens møter og eventuelle hastevarsler. Den genereres automatisk hver morgen kl. 07.00 og kan tilpasses til å vise bare det som er relevant for deg.' },
    { q: 'Fungerer dette med norske bedriftsverktøy?', a: 'Ja, vi integrerer med norske verktøy som Tripletex, Fiken, og alle internasjonale verktøy som brukes i Norge. Vi kan også integrere med legacy-systemer via API eller fil-import.' },
  ] : [
    { q: 'Which project tools are supported?', a: 'Notion, Trello, Asana, Monday.com, Jira, ClickUp, and many more. We adapt to your existing tool. If you use a tool without standard integration, we can use APIs to build a custom solution.' },
    { q: 'How does the Zoom AI Meeting Assistant work?', a: 'The AI joins as a silent participant, transcribes everything, identifies tasks, and sends a structured summary after the meeting. It also senses the meeting mood and can flag if disagreements or uncertainties appear.' },
    { q: 'Can I customize the KPI alerts?', a: 'Yes, you define which KPIs matter and at which thresholds to be alerted. You can also choose how to receive alerts — email, SMS, Slack, Teams, or a push notification in the dashboard.' },
    { q: 'What\'s included in the daily digest?', a: 'New emails requiring action, task status, KPI changes, new leads, today\'s meetings, and urgent alerts. It\'s automatically generated each morning at 7 AM and can be customized to show only what\'s relevant to you.' },
    { q: 'Does this work with Norwegian business tools?', a: 'Yes, we integrate with Norwegian tools like Tripletex, Fiken, and all international tools used in Norway. We can also integrate with legacy systems via API or file import.' },
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
          <Clock size={14} />
          {lang === 'no' ? 'Drift & Rapportering' : 'Operations & Reporting'}
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
          {lang === 'no' ? (
            <>Automatiser <span style={{ color: gold }}>driften</span> og få full oversikt</>
          ) : (
            <>Automate <span style={{ color: gold }}>operations</span> and get full visibility</>
          )}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.65 }}>
          {lang === 'no'
            ? 'E-poster blir til oppgaver, Zoom-møter får AI-notater, KPI-varsler holder deg oppdatert, og daglig AI-digest samler alt viktig. 25 automatiseringer for smidigere drift.'
            : 'Emails become tasks, Zoom meetings get AI notes, KPI alerts keep you updated, and daily AI digest collects everything important. 25 automations for smoother operations.'}
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
            ? 'Vi tar oss av all oppsettet — fra analyse av arbeidsflytene dine til go-live med 25 automatiseringer.'
            : 'We handle all setup — from analyzing your workflows to go-live with 25 automations.'}
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {setupSteps.map((step, i) => (
            <SetupStep key={i} step={step} i={i} lang={lang} />
          ))}
        </div>
      </section>

      {/* ── HOW AI IMPROVES OPERATIONS ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 60px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 36 }}>
          {lang === 'no' ? 'Hvordan AI effektiviserer driften' : 'How AI optimizes operations'}
        </motion.h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {driftFlowSteps.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: i < driftFlowSteps.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
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
          {lang === 'no' ? '25 automatiseringer inkludert' : '25 automations included'}
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
            {lang === 'no' ? 'Klar for smartere drift?' : 'Ready for smarter operations?'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px', lineHeight: 1.6 }}>
            {lang === 'no'
              ? 'Start med en gratis kartlegging og se hvor mange timer driftsteamet kan spare hver dag.'
              : 'Start with a free discovery and see how many hours your operations team can save daily.'}
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
