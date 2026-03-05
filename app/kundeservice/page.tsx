'use client'
import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, MessageSquare, Bot, Shield, BarChart3, CheckCircle2,
  ChevronDown, Sparkles, Phone, Clock, FileText, Lock,
  Users, Zap, Database, Bell, Settings, Headphones, Mail, Globe
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
   KUNDESERVICE PAGE
   ══════════════════════════════════════════════════ */
export default function KundeservicePage() {
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
      num: '01', icon: FileText, title: 'Kunnskapsbase-oppsett',
      desc: 'Vi samler inn FAQ, produktinfo, prislister og retningslinjer fra bedriften din. AI-chatboten trenes på ditt eget innhold slik at den gir presise, relevante svar.',
      detail: 'Vi setter opp en sikker dokumentbank der du kan laste opp PDF-er, tekster, og andre ressurser. AI-en indekserer alt dette og bruker det som referanse når den svarer på spørsmål. Du kan oppdatere kunnskapsbasen når som helst — endringar reflekteres umiddelbart i chatboten.',
    },
    {
      num: '02', icon: Globe, title: 'Flerkanals-integrasjon',
      desc: 'Vi kobler chatboten til WhatsApp, e-post, nettside og eventuelle andre kanaler. Kunden får konsistent hjelp uavhengig av hvilken kanal de bruker — alt samles i én oversikt.',
      detail: 'Bak kulissene bruker vi integrerings-API-er for å koble chatboten til dine kanaler. Hver henvendelse — uansett hvor den kommer fra — logges med full kontekst i ditt kundeservicesystem. En kunde som starter på WhatsApp og fortsetter på e-post ser sin egen historie kontinuerlig.',
    },
    {
      num: '03', icon: Database, title: 'Ticket-klassifisering',
      desc: 'AI-en kategoriserer automatisk alle henvendelser etter type, hastegrad og avdeling. Tekniske spørsmål, faktura-henvendelser og klager rutes til riktig person eller team automatisk.',
      detail: 'Vi definerer kategorier som passer din bedrift (f.eks. «Teknisk støtte», «Billing», «Klager», «Salg»). AI-en lærer seg å klassifisere henvendelser basert på innhold og kontekst. Systemet ruter automatisk hver ticket til riktig køe eller person basert på prioritet og avdeling.',
    },
    {
      num: '04', icon: Users, title: 'Eskalering og human-in-the-loop',
      desc: 'Komplekse saker eskaleres automatisk til en menneske-agent med full kontekst. AI-en vet når den ikke kan svare godt nok og overfører sømløst til ditt supportteam med hele samtalehistorikken.',
      detail: 'Vi setter opp regler som bestemmer når en sak skal eskaleres (f.eks. hvis kunden uttrykker frustrasjon, eller hvis spørsmålet krever menneskelig vurdering). Når eskalering skjer, mottar supportagenten hele historikken og kan fortsette samtalen uten at kunden må gjenta seg selv.',
    },
    {
      num: '05', icon: BarChart3, title: 'Analyse og forbedring',
      desc: 'Dashboarder viser responstider, kundetilfredshet og vanlige henvendelsestyper. Vi bruker data til å kontinuerlig forbedre chatbotens svar og identifisere trender i kundebehov.',
      detail: 'Vi gir deg tilgang til et analytics-dashbord som viser metrics som first-response-time, resolution-rate, customer satisfaction (CSAT), og de mest vanlige spørsmålstypene. Disse dataene brukes til å optimalisere chatbotens kjernekunnskap og forbedre prosessene dine over tid.',
    },
  ] : [
    {
      num: '01', icon: FileText, title: 'Knowledge Base Setup',
      desc: 'We collect FAQs, product info, price lists, and guidelines from your business. The AI chatbot is trained on your own content to provide precise, relevant answers.',
      detail: 'We set up a secure document repository where you can upload PDFs, documents, and resources. The AI indexes everything and uses it as reference when answering questions. You can update the knowledge base anytime — changes are reflected immediately.',
    },
    {
      num: '02', icon: Globe, title: 'Multi-Channel Integration',
      desc: 'We connect the chatbot to WhatsApp, email, website, and other channels. Customers get consistent help regardless of channel — everything is collected in one overview.',
      detail: 'Behind the scenes, we use integration APIs to connect the chatbot to your channels. Every inquiry — from any source — is logged with full context. A customer starting on WhatsApp and continuing via email sees their full history continuously.',
    },
    {
      num: '03', icon: Database, title: 'Ticket Classification',
      desc: 'The AI automatically categorizes all inquiries by type, priority, and department. Technical questions, billing inquiries, and complaints are routed automatically.',
      detail: 'We define categories that fit your business (e.g., "Technical Support", "Billing", "Complaints", "Sales"). The AI learns to classify inquiries based on content and context. The system automatically routes each ticket based on priority and department.',
    },
    {
      num: '04', icon: Users, title: 'Escalation & Human-in-the-Loop',
      desc: 'Complex cases are automatically escalated to a human agent with full context. The AI knows when it can\'t answer well enough and transfers seamlessly with full history.',
      detail: 'We set up rules that determine when a case should escalate (e.g., if customer expresses frustration, or if the question requires human judgment). When escalation happens, the support agent receives the full history and can continue without the customer repeating themselves.',
    },
    {
      num: '05', icon: BarChart3, title: 'Analysis & Improvement',
      desc: 'Dashboards show response times, customer satisfaction, and common inquiry types. We use data to continuously improve the chatbot and identify trends.',
      detail: 'We give you access to an analytics dashboard showing metrics like first-response-time, resolution-rate, customer satisfaction (CSAT), and most common question types. This data is used to optimize the chatbot and improve your processes over time.',
    },
  ]

  const flowItems = lang === 'no' ? [
    { icon: Phone, text: 'Kunde sender melding', sub: 'Nettside/WhatsApp/e-post — henvendelsen mottas øyeblikkelig' },
    { icon: Bot, text: 'AI-chatbot svarer umiddelbart', sub: 'Søker i kunnskapsbasen for presist svar' },
    { icon: MessageSquare, text: 'Henvendelsen klassifiseres', sub: 'Type, hastegrad og avdeling identifiseres automatisk' },
    { icon: Zap, text: 'Automatisk løsning eller eskalering', sub: 'Enkle saker løses direkte, komplekse eskaleres' },
    { icon: Database, text: 'Support-ticket opprettes', sub: 'Full historikk logges i ditt system' },
    { icon: Bell, text: 'Oppfølging sendes', sub: 'Kundetilfredshetsmåling og bekreftelse' },
  ] : [
    { icon: Phone, text: 'Customer sends message', sub: 'Website/WhatsApp/email — received immediately' },
    { icon: Bot, text: 'AI chatbot responds instantly', sub: 'Searches knowledge base for precise answer' },
    { icon: MessageSquare, text: 'Inquiry is classified', sub: 'Type, priority, and department identified automatically' },
    { icon: Zap, text: 'Automatic resolution or escalation', sub: 'Simple cases solved directly, complex ones escalated' },
    { icon: Database, text: 'Support ticket created', sub: 'Full history logged in your system' },
    { icon: Bell, text: 'Follow-up sent', sub: 'Customer satisfaction measurement and confirmation' },
  ]

  const automations = lang === 'no' ? [
    'AI kundesupport-chatbot',
    'WhatsApp Business-integrasjon',
    'E-post auto-responder',
    'Nettside live chat',
    'Ticket-klassifisering',
    'Automatisk eskalering',
    'Kunnskapsbase-oppdatering',
    'Kundetilfredshetsmåling (CSAT)',
    'SLA-overvåkning',
    'Flerkanals samling',
    'FAQ auto-generering',
    'Sentiment-analyse',
    'Repeterende spørsmål-filter',
    'Intern varsling',
    'Rapportering og innsikt',
  ] : [
    'AI customer support chatbot',
    'WhatsApp Business integration',
    'Email auto-responder',
    'Website live chat',
    'Ticket classification',
    'Automatic escalation',
    'Knowledge base updates',
    'Customer satisfaction measurement (CSAT)',
    'SLA monitoring',
    'Multi-channel aggregation',
    'FAQ auto-generation',
    'Sentiment analysis',
    'Recurring question filter',
    'Internal notifications',
    'Reporting & insights',
  ]

  const faqItems = lang === 'no' ? [
    { q: 'Forstår chatboten norsk godt?', a: 'Ja, AI-en er trent på norsk språk og forstår dialekter, slang og bransjespesifikke uttrykk. Den kan også svare på engelsk og andre språk hvis bedriften din trenger det.' },
    { q: 'Kan chatboten håndtere klager?', a: 'Den håndterer enkle klager selv, men eskalerer automatisk til en menneske-agent ved komplekse eller sensitive saker. Vi setter regler for hva som skal eskaleres basert på sentimentanalyse og ordvalg.' },
    { q: 'Hvilke kanaler støttes?', a: 'WhatsApp, e-post, nettside (live chat), Facebook Messenger og SMS. Vi kan legge til flere etter behov — det tar vanligvis bare noen timer å koble til en ny kanal.' },
    { q: 'Hva med eksisterende support-system?', a: 'Vi integrerer med Zendesk, Freshdesk, Intercom, HubSpot og de fleste andre supportsystemer. Hvis du bruker noe spesielt, hører vi gjerne fra deg — vi løser det.' },
    { q: 'Hvor raskt svarer chatboten?', a: 'Øyeblikkelig — under 2 sekunder. Kunden slipper å vente i telefonkø eller høre på automatiske navigasjonsmenyer. Hvis saken krever eskalering, blir den rouet til riktig person uten forsinkelse.' },
  ] : [
    { q: 'Does the chatbot understand Norwegian well?', a: 'Yes, the AI is trained on Norwegian language and understands dialects, slang, and industry-specific terminology. It can also respond in English and other languages if your business needs it.' },
    { q: 'Can the chatbot handle complaints?', a: 'It handles simple complaints itself, but automatically escalates to a human agent for complex or sensitive cases. We set rules for what should escalate based on sentiment analysis and language patterns.' },
    { q: 'Which channels are supported?', a: 'WhatsApp, email, website (live chat), Facebook Messenger, and SMS. We can add more as needed — usually just takes a few hours to connect a new channel.' },
    { q: 'What about my existing support system?', a: 'We integrate with Zendesk, Freshdesk, Intercom, HubSpot, and most other support systems. If you use something specialized, let us know — we\'ll make it work.' },
    { q: 'How fast does the chatbot respond?', a: 'Instantly — under 2 seconds. Customers avoid waiting in phone queues or navigating automated menus. If a case needs escalation, it\'s routed to the right person without delay.' },
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
          <MessageSquare size={14} />
          {lang === 'no' ? 'Kundeservice & Kommunikasjon' : 'Customer Service & Communication'}
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
          {lang === 'no' ? (
            <>AI-drevet <span style={{ color: gold }}>kundeservice</span> døgnet rundt</>
          ) : (
            <>AI-powered <span style={{ color: gold }}>customer service</span> around the clock</>
          )}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.65 }}>
          {lang === 'no'
            ? 'Chatbot med kunnskapsbase, flerkanals support på WhatsApp, e-post og nettside, automatisk ticket-klassifisering og human-in-the-loop for komplekse saker. 15 automatiseringer.'
            : 'Chatbot with knowledge base, multi-channel support on WhatsApp, email and web, automatic ticket classification and human-in-the-loop for complex cases. 15 automations.'}
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

      {/* ── WHAT HAPPENS WHEN CUSTOMER CONTACTS ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 60px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 36 }}>
          {lang === 'no' ? 'Hva skjer når en kunde tar kontakt?' : 'What happens when a customer reaches out?'}
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
          {lang === 'no' ? '15 automatiseringer inkludert' : '15 automations included'}
        </motion.h2>
        <motion.p {...fadeUp} style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 14, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          {lang === 'no'
            ? 'Alt du trenger for å automatisere kundeservice — fra chatbot til rapportering.'
            : 'Everything you need to automate customer service — from chatbot to reporting.'}
        </motion.p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {automations.map((automation, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
                padding: '16px 14px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
              <CheckCircle2 size={16} color={gold} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{automation}</span>
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
            {lang === 'no' ? 'Klar for bedre kundeservice?' : 'Ready for better customer service?'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px', lineHeight: 1.6 }}>
            {lang === 'no'
              ? 'Start med en gratis kartlegging og se hva AI kan gjøre for din bedrift.'
              : 'Start with a free discovery and see what AI can do for your business.'}
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
                    {lang === 'no' ? 'TEKNISK FORKLARING:' : 'TECHNICAL DETAILS:'}
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
