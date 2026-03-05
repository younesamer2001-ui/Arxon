'use client'
import { useLanguage } from '@/lib/language-context'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowRight, Calendar, Phone, Database,
  MessageSquare, CheckCircle2, Link2, Zap, Settings,
  CreditCard, TrendingUp
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, fadeUp, globalStyles } from '@/lib/constants'

export default function IntegrationsPage() {
  const { lang } = useLanguage()
  const router = useRouter()

  const categories = lang === 'no' ? [
    {
      icon: Phone, title: 'Telefoni', desc: 'Fungerer med ditt eksisterende mobilnummer.',
      tools: [
        { name: 'Telenor', desc: 'Norges største teleoperatør — full støtte' },
        { name: 'Telia', desc: 'Videresending og SIP-integrasjon' },
        { name: 'ice', desc: 'Funker med ice sine bedriftsløsninger' },
        { name: 'Twilio Voice', desc: 'Programmerbar tale og SMS' },
        { name: 'Vapi', desc: 'AI-stemmeagent-plattform' },
      ],
    },
    {
      icon: Calendar, title: 'Kalender og booking', desc: 'AI-en booker direkte i kalenderen din.',
      tools: [
        { name: 'Google Calendar', desc: 'Automatisk booking og ledig-tid-sjekk' },
        { name: 'Microsoft Outlook', desc: 'Full kalender-synkronisering' },
        { name: 'Cal.com', desc: 'Open-source booking med full API-kontroll' },
        { name: 'Calendly', desc: 'Koble til din Calendly-lenke' },
        { name: 'Timely', desc: 'Populær blant norske salonger' },
        { name: 'SimplyBook.me', desc: 'Booking for skjønnhet og tjenester' },
      ],
    },
    {
      icon: Database, title: 'CRM og kundehåndtering', desc: 'Alle henvendelser logges automatisk.',
      tools: [
        { name: 'HubSpot', desc: 'Kontakter og deals oppdateres automatisk' },
        { name: 'Pipedrive', desc: 'Nye leads opprettes direkte i pipeline' },
        { name: 'Airtable', desc: 'Fleksibel database for kundedata' },
        { name: 'Google Sheets', desc: 'Enkel kundeoversikt i regneark' },
        { name: 'Notion', desc: 'Kundedatabase og oppfølging' },
      ],
    },
    {
      icon: CreditCard, title: 'Regnskap og betaling', desc: 'Koble til ditt norske regnskapssystem.',
      tools: [
        { name: 'Fiken', desc: 'Perfekt for ENK og små AS' },
        { name: 'Tripletex', desc: '40 000+ norske bedrifter bruker dette' },
        { name: 'PowerOffice', desc: 'Skybasert regnskap for voksende bedrifter' },
        { name: 'Visma eAccounting', desc: 'Norges mest utbredte regnskapssystem' },
        { name: 'Stripe', desc: 'Online betaling og abonnement' },
        { name: 'Vipps', desc: 'Norges populæreste betalingsløsning' },
      ],
    },
    {
      icon: MessageSquare, title: 'Kommunikasjon', desc: 'SMS, e-post og chat — alt integrert.',
      tools: [
        { name: 'Gmail / Google Workspace', desc: 'E-post og varsler automatisk' },
        { name: 'Microsoft 365', desc: 'Outlook, Teams og Office-integrasjon' },
        { name: 'Twilio SMS', desc: 'SMS-varsler til deg og kunder' },
        { name: 'WhatsApp Business', desc: 'Automatiske meldinger til kunder' },
        { name: 'Slack', desc: 'Varsler om nye henvendelser i sanntid' },
        { name: 'Mailchimp', desc: 'Nyhetsbrev og e-postmarkedsføring' },
      ],
    },
    {
      icon: TrendingUp, title: 'Markedsføring', desc: 'Automatiser leads og kampanjer.',
      tools: [
        { name: 'Facebook / Meta', desc: 'Leadskjemaer og automatisk oppfølging' },
        { name: 'Instagram', desc: 'DM-automatisering og innholdspublisering' },
        { name: 'Google Ads', desc: 'Automatisk kampanjeoptimalisering' },
        { name: 'Google My Business', desc: 'Anmeldelser og synlighet' },
      ],
    },
    {
      icon: Zap, title: 'Automatisering og AI', desc: 'Teknologien bak alle arbeidsflytene.',
      tools: [
        { name: 'n8n', desc: 'Vår hovedplattform — 400+ integrasjoner' },
        { name: 'OpenAI / GPT', desc: 'Tekstgenerering, analyse og oppsummering' },
        { name: 'ElevenLabs', desc: 'Realistisk AI-stemme på norsk' },
        { name: 'Google Sheets', desc: 'Automatisk rapportering og oversikt' },
      ],
    },
  ] : [
    {
      icon: Phone, title: 'Telephony', desc: 'Works with your existing mobile number.',
      tools: [
        { name: 'Telenor', desc: 'Norway\'s largest telecom — full support' },
        { name: 'Telia', desc: 'Call forwarding and SIP integration' },
        { name: 'ice', desc: 'Works with ice business solutions' },
        { name: 'Twilio Voice', desc: 'Programmable voice and SMS' },
        { name: 'Vapi', desc: 'AI voice agent platform' },
      ],
    },
    {
      icon: Calendar, title: 'Calendar & Booking', desc: 'AI books directly in your calendar.',
      tools: [
        { name: 'Google Calendar', desc: 'Automatic booking and availability check' },
        { name: 'Microsoft Outlook', desc: 'Full calendar synchronization' },
        { name: 'Cal.com', desc: 'Open-source booking with full API control' },
        { name: 'Calendly', desc: 'Connect your Calendly link' },
        { name: 'Timely', desc: 'Popular among Norwegian salons' },
        { name: 'SimplyBook.me', desc: 'Booking for beauty and services' },
      ],
    },
    {
      icon: Database, title: 'CRM & Customer Management', desc: 'All inquiries logged automatically.',
      tools: [
        { name: 'HubSpot', desc: 'Contacts and deals updated automatically' },
        { name: 'Pipedrive', desc: 'New leads created directly in pipeline' },
        { name: 'Airtable', desc: 'Flexible database for customer data' },
        { name: 'Google Sheets', desc: 'Simple customer overview in spreadsheets' },
        { name: 'Notion', desc: 'Customer database and follow-up' },
      ],
    },
    {
      icon: CreditCard, title: 'Accounting & Payment', desc: 'Connect to your Norwegian accounting system.',
      tools: [
        { name: 'Fiken', desc: 'Perfect for sole proprietors and small companies' },
        { name: 'Tripletex', desc: '40,000+ Norwegian businesses use this' },
        { name: 'PowerOffice', desc: 'Cloud accounting for growing businesses' },
        { name: 'Visma eAccounting', desc: 'Norway\'s most widespread accounting system' },
        { name: 'Stripe', desc: 'Online payments and subscriptions' },
        { name: 'Vipps', desc: 'Norway\'s most popular payment solution' },
      ],
    },
    {
      icon: MessageSquare, title: 'Communication', desc: 'SMS, email and chat — all integrated.',
      tools: [
        { name: 'Gmail / Google Workspace', desc: 'Email and notifications automatically' },
        { name: 'Microsoft 365', desc: 'Outlook, Teams and Office integration' },
        { name: 'Twilio SMS', desc: 'SMS alerts to you and customers' },
        { name: 'WhatsApp Business', desc: 'Automated customer messages' },
        { name: 'Slack', desc: 'Real-time notifications for new inquiries' },
        { name: 'Mailchimp', desc: 'Newsletters and email marketing' },
      ],
    },
    {
      icon: TrendingUp, title: 'Marketing', desc: 'Automate leads and campaigns.',
      tools: [
        { name: 'Facebook / Meta', desc: 'Lead forms and automatic follow-up' },
        { name: 'Instagram', desc: 'DM automation and content publishing' },
        { name: 'Google Ads', desc: 'Automatic campaign optimization' },
        { name: 'Google My Business', desc: 'Reviews and visibility' },
      ],
    },
    {
      icon: Zap, title: 'Automation & AI', desc: 'The technology behind all workflows.',
      tools: [
        { name: 'n8n', desc: 'Our main platform — 400+ integrations' },
        { name: 'OpenAI / GPT', desc: 'Text generation, analysis and summarization' },
        { name: 'ElevenLabs', desc: 'Realistic AI voice in Norwegian' },
        { name: 'Google Sheets', desc: 'Automatic reporting and overview' },
      ],
    },
  ]

  const howItConnects = lang === 'no' ? [
    { icon: Settings, title: 'Du forteller oss hva du bruker', desc: 'I kartleggingen oppgir du hvilke systemer du bruker i dag.' },
    { icon: Link2, title: 'Vi kobler det sammen', desc: 'Vårt team setter opp integrasjonene for deg — du trenger ikke gjøre noe teknisk.' },
    { icon: Zap, title: 'Alt fungerer automatisk', desc: 'AI-en booker, logger og varsler gjennom dine eksisterende systemer.' },
  ] : [
    { icon: Settings, title: 'You tell us what you use', desc: 'In the assessment, you specify which systems you use today.' },
    { icon: Link2, title: 'We connect it', desc: 'Our team sets up integrations for you — no technical work needed from your side.' },
    { icon: Zap, title: 'Everything works automatically', desc: 'AI books, logs and notifies through your existing systems.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: `${bg}`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles()}</style>
      <Nav />

      {/* Hero */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 40px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 30, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.15)`, fontSize: 13, color: gold, marginBottom: 24 }}>
          <Link2 size={14} />
          {lang === 'no' ? 'Integrasjoner' : 'Integrations'}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
          {lang === 'no' ? (<>Fungerer med <span style={{ color: gold }}>verktøyene du allerede bruker</span></>) : (<>Works with <span style={{ color: gold }}>the tools you already use</span></>)}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
          style={{ fontSize: 'clamp(15px, 2.2vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
          {lang === 'no'
            ? 'Arxon kobles til ditt bookingsystem, CRM, kalender og regnskap. Ingen teknisk kunnskap nødvendig — vi setter opp alt for deg.'
            : 'Arxon connects to your booking system, CRM, calendar and accounting. No technical knowledge needed — we set up everything for you.'}
        </motion.p>
      </section>

      {/* How it connects */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px 60px' }}>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {howItConnects.map((step, i) => (
            <motion.div key={i} {...fadeUp} style={{ textAlign: 'center', padding: '28px 20px', background: `rgba(${goldRgb},0.03)`, border: `1px solid rgba(${goldRgb},0.1)`, borderRadius: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `rgba(${goldRgb},0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <step.icon size={22} color={gold} />
              </div>
              <div style={{ fontSize: 11, color: `rgba(${goldRgb},0.5)`, fontWeight: 700, marginBottom: 6 }}>STEG {i + 1}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Integration Categories */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 70px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 36 }}>
          {lang === 'no' ? 'Alle integrasjoner' : 'All integrations'}
        </motion.h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {categories.map((cat, i) => (
            <motion.div key={i} {...fadeUp} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: '28px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `rgba(${goldRgb},0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <cat.icon size={20} color={gold} />
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 2 }}>{cat.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{cat.desc}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {cat.tools.map((tool, j) => (
                  <div key={j} style={{
                    padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={13} color={gold} />{tool.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{tool.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Missing integration? */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 70px', textAlign: 'center' }}>
        <motion.div {...fadeUp} style={{
          background: `rgba(${goldRgb},0.04)`, border: `1px solid rgba(${goldRgb},0.1)`, borderRadius: 18, padding: '32px 28px',
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>
            {lang === 'no' ? 'Bruker du noe vi ikke har listet?' : 'Using something we haven\'t listed?'}
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 20 }}>
            {lang === 'no'
              ? 'Vi bygger stadig nye integrasjoner. Fortell oss hva du bruker i kartleggingen, så finner vi en løsning.'
              : 'We\'re constantly building new integrations. Tell us what you use in the assessment, and we\'ll find a solution.'}
          </p>
          <button onClick={() => router.push('/kartlegging')} style={{
            background: gold, color: bg, border: 'none', borderRadius: 14, padding: '14px 32px',
            fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            {lang === 'no' ? 'Start gratis kartlegging' : 'Start free assessment'}
            <ArrowRight size={15} style={{ display: 'inline', marginLeft: 8, verticalAlign: 'middle' }} />
          </button>
        </motion.div>
      </section>

      <Footer minimal />
    </div>
  )
}
