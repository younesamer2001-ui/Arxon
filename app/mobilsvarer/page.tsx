'use client'
import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Phone, Bot, Shield, BarChart3, CheckCircle2,
  ChevronDown, Sparkles, MessageSquare, Clock, FileText, Lock,
  Users, Zap, ArrowUpRight, Server, Database, Bell,
  Settings, Headphones, BookOpen
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
   MOBILSVARER PAGE
   ══════════════════════════════════════════════════ */
export default function MobilsvarerPage() {
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
      num: '01', icon: Headphones, title: 'Befaring og tilpasning',
      desc: 'Vi starter med en kort samtale for å forstå bedriften din — åpningstider, typiske henvendelser, og hva som er viktig for deg. Basert på dette tilpasser vi AI-mobilsvareren til å snakke akkurat slik du ønsker, med riktig tone og bransjekunnskap.',
      detail: 'Vi setter opp et dedikert bedriftsnummer eller kobler oss på ditt eksisterende nummer via en sikker videresending. Teknisk sett bruker vi det som heter en «skybasert telefonsentral» — det betyr at samtaler rutes trygt gjennom internett til vår AI-plattform, uten at du trenger å installere noe.',
    },
    {
      num: '02', icon: Bot, title: 'AI-en lærer din bedrift',
      desc: 'Vi trener AI-assistenten med informasjon om dine tjenester, priser, vanlige spørsmål, og hvordan du vil at kunder skal bli håndtert. AI-en svarer på norsk (og engelsk om ønskelig) og følger dine regler.',
      detail: 'AI-en bruker avansert språkteknologi for å forstå hva kunden egentlig spør om — selv om de formulerer seg ulikt. Den kan kvalifisere henvendelser ("Haster det?", "Hvilket postnummer?"), booke møter direkte i kalenderen din, og sende deg et sammendrag på SMS eller e-post.',
    },
    {
      num: '03', icon: Database, title: 'Kobling til dine systemer',
      desc: 'Vi kobler AI-mobilsvareren til systemene du allerede bruker. Det kan være et regneark, et bookingsystem, et CRM, eller en kalender — vi tilpasser oss din arbeidsflyt, ikke omvendt.',
      detail: 'Bak kulissene bruker vi automatiseringsverktøy som kobler telefonsystemet til kunderegisteret ditt. For eksempel: Når en ny kunde ringer, oppretter systemet automatisk en rad i kundelisten din med navn, nummer, hva de spurte om, og når de ringte. Alt skjer automatisk — du trenger ikke gjøre noe manuelt.',
    },
    {
      num: '04', icon: Bell, title: 'Varsler og oppfølging',
      desc: 'Etter hver samtale får du et varsel — via SMS, e-post, eller begge deler. Sammendraget inkluderer hvem som ringte, hva de spurte om, og hva AI-en svarte. Du har alltid full kontroll.',
      detail: 'Vi setter opp automatiske arbeidsflytersom kan følge opp kunder for deg. For eksempel: Send en SMS til kunden med bekreftelse etter booking, send en påminnelse 24 timer før avtalen, eller flagg hastesaker som krever at du ringer tilbake umiddelbart.',
    },
    {
      num: '05', icon: Settings, title: 'Testing og go-live',
      desc: 'Før vi går live, tester vi systemet grundig med realistiske samtaler. Du kan lytte til testsamtaler og gi tilbakemeldinger. Først når du er 100% fornøyd, slår vi det på.',
      detail: 'Etter go-live overvåker vi systemet den første uken for å finjustere. Du har en dedikert kontaktperson som kan gjøre endringer raskt — for eksempel oppdatere åpningstider, legge til nye tjenester, eller justere hvordan AI-en håndterer spesifikke henvendelser.',
    },
  ] : [
    {
      num: '01', icon: Headphones, title: 'Assessment & Customization',
      desc: 'We start with a brief call to understand your business — hours, typical inquiries, and what matters to you. Based on this, we customize the AI answering service to speak exactly as you want.',
      detail: 'We set up a dedicated number or connect to your existing one via secure forwarding. Technically, we use a cloud-based phone system — calls are securely routed through the internet to our AI platform without you installing anything.',
    },
    {
      num: '02', icon: Bot, title: 'AI Learns Your Business',
      desc: 'We train the AI with your services, prices, common questions, and how you want customers handled. The AI speaks Norwegian and English and follows your rules.',
      detail: 'The AI uses advanced language technology to understand what the customer is really asking. It can qualify inquiries, book appointments directly in your calendar, and send you a summary via SMS or email.',
    },
    {
      num: '03', icon: Database, title: 'System Integration',
      desc: 'We connect the AI to the systems you already use — a spreadsheet, booking system, CRM, or calendar. We adapt to your workflow, not the other way around.',
      detail: 'Behind the scenes, we use automation tools that connect the phone system to your customer database. When a new customer calls, the system automatically creates an entry with their name, number, question, and call time.',
    },
    {
      num: '04', icon: Bell, title: 'Notifications & Follow-up',
      desc: 'After each call, you get a notification — via SMS, email, or both. The summary includes who called, what they asked, and what the AI replied. You always have full control.',
      detail: 'We set up automated workflows that can follow up for you. For example: send a booking confirmation SMS, a 24-hour reminder, or flag urgent cases requiring your immediate callback.',
    },
    {
      num: '05', icon: Settings, title: 'Testing & Go-live',
      desc: 'Before going live, we test the system thoroughly with realistic calls. You can listen to test calls and give feedback. Only when you\'re 100% satisfied do we switch it on.',
      detail: 'After go-live, we monitor the first week to fine-tune. You have a dedicated contact who can make changes quickly — update hours, add services, or adjust how the AI handles specific inquiries.',
    },
  ]

  const legalPoints = lang === 'no' ? [
    {
      icon: Shield, title: 'GDPR og Personopplysningsloven',
      desc: 'All behandling av personopplysninger følger GDPR (via EØS-avtalen) og norsk Personopplysningslov (2018). Vi har dokumentert behandlingsgrunnlag for alle data vi håndterer — typisk «berettiget interesse» (GDPR Art. 6(1)(f)) for innkommende forretningssamtaler.',
    },
    {
      icon: Phone, title: 'Ekomloven — Transparens ved samtale',
      desc: 'I henhold til Ekomloven og GDPR Art. 22 informeres alle som ringer om at de snakker med en AI-assistent. Innringere kan alltid be om å bli satt over til et menneske. Vi tar ikke opp samtaler uten forhåndsinformasjon og gyldig grunnlag.',
    },
    {
      icon: Lock, title: 'Databehandleravtale (DPA)',
      desc: 'Vi inngår alltid en skriftlig databehandleravtale (GDPR Art. 28) med alle kunder. Denne regulerer nøyaktig hvordan vi behandler data, hvilke sikkerhetstiltak vi bruker, og dine rettigheter som behandlingsansvarlig.',
    },
    {
      icon: Database, title: 'Data lagres i EØS',
      desc: 'All kundedata lagres kryptert på servere innenfor EØS. Vi overfører aldri personopplysninger utenfor EØS uten godkjente overføringsmekanismer (GDPR Art. 46). Datatilsynets retningslinjer for skylagring følges.',
    },
    {
      icon: FileText, title: 'Innsyn og sletting',
      desc: 'Dine kunder har rett til innsyn, retting og sletting av sine data (GDPR Art. 15–17). Vi har automatiserte rutiner for å håndtere slike forespørsler innen lovens frister, og data slettes automatisk etter avtalt oppbevaringstid.',
    },
    {
      icon: BookOpen, title: 'Markedsføringsloven',
      desc: 'Kontaktinformasjon fra samtaler brukes kun til det opprinnelige formålet — aldri til uønsket markedsføring. Vi respekterer Reservasjonsregisteret og Markedsføringsloven § 15 fullt ut.',
    },
  ] : [
    {
      icon: Shield, title: 'GDPR & Data Protection Act',
      desc: 'All personal data processing follows GDPR (via EEA agreement) and the Norwegian Data Protection Act (2018). We have documented legal basis for all data — typically "legitimate interest" (GDPR Art. 6(1)(f)) for inbound business calls.',
    },
    {
      icon: Phone, title: 'Transparency During Calls',
      desc: 'Per the Electronic Communications Act and GDPR Art. 22, all callers are informed they\'re speaking with an AI assistant. Callers can always request to be transferred to a human. We never record without prior notice and valid legal basis.',
    },
    {
      icon: Lock, title: 'Data Processing Agreement',
      desc: 'We always sign a written DPA (GDPR Art. 28) with all clients. This regulates exactly how we process data, our security measures, and your rights as data controller.',
    },
    {
      icon: Database, title: 'Data Stored in EEA',
      desc: 'All data is encrypted and stored on servers within the EEA. We never transfer personal data outside the EEA without approved transfer mechanisms (GDPR Art. 46).',
    },
    {
      icon: FileText, title: 'Access & Deletion Rights',
      desc: 'Your customers have the right to access, rectify, and delete their data (GDPR Art. 15–17). We have automated routines to handle such requests within legal deadlines.',
    },
    {
      icon: BookOpen, title: 'Marketing Control Act',
      desc: 'Contact information from calls is only used for the original purpose — never for unsolicited marketing. We fully respect the Marketing Exclusion Register.',
    },
  ]

  const faqItems = lang === 'no' ? [
    { q: 'Hva er egentlig en AI-mobilsvarer?', a: 'Det er en intelligent telefonassistent som svarer samtaler for bedriften din — 24/7, på norsk. Tenk på det som en veldig dyktig resepsjonist som aldri er syk, aldri tar pause, og kan håndtere flere samtaler samtidig. Den forstår hva kunden spør om, gir relevante svar, og logger alt automatisk.' },
    { q: 'Trenger jeg å kjøpe nytt utstyr eller bytte telefonsystem?', a: 'Nei. Vi kobler oss på ditt eksisterende telefonnummer via en sikker videresending i skyen. Du trenger ikke installere noe, og ditt nåværende nummer og mobilabonnement forblir uendret.' },
    { q: 'Hvordan vet AI-en hva den skal si?', a: 'Vi programmer AI-en med informasjon om bedriften din — tjenester, priser, åpningstider, vanlige spørsmål, og regler for hvordan kunder skal håndteres. Den lærer seg tonen og stilen din. Du kan oppdatere denne informasjonen når som helst.' },
    { q: 'Hva hvis kunden vil snakke med et menneske?', a: 'AI-en informerer alltid at den er en AI-assistent. Hvis kunden ber om å snakke med et menneske, setter den over samtalen til deg eller kollegaene dine umiddelbart. Dette er også et lovkrav vi selvfølgelig følger (GDPR Art. 22).' },
    { q: 'Er det trygt med tanke på personvern?', a: 'Absolutt. Vi følger GDPR, norsk Personopplysningslov, og Datatilsynets retningslinjer. All data lagres kryptert i EØS, vi inngår databehandleravtale med alle kunder, og innringere informeres alltid om databehandlingen. Vi tar personvern like alvorlig som du gjør.' },
    { q: 'Hva koster det?', a: 'Prisen avhenger av volum og kompleksitet. Start en gratis kartlegging for å få et tilpasset prisestimat for din bedrift — det tar bare 2 minutter og er helt uforpliktende.' },
    { q: 'Hvor lang tid tar oppsettet?', a: 'Typisk er mobilsvareren oppe og kjører innen ca. 14 virkedager fra signering. Vi bruker tiden på å programmere AI-en med din bedriftsinformasjon og teste grundig sammen med deg før vi går live.' },
  ] : [
    { q: 'What exactly is an AI phone answering service?', a: 'It\'s an intelligent phone assistant that answers calls for your business 24/7 in Norwegian and English. Think of it as a highly skilled receptionist who never calls in sick, never takes breaks, and can handle multiple calls simultaneously.' },
    { q: 'Do I need new equipment or a new phone system?', a: 'No. We connect to your existing phone number via secure cloud forwarding. You don\'t need to install anything, and your current number remains unchanged.' },
    { q: 'How does the AI know what to say?', a: 'We program the AI with your business information — services, prices, hours, FAQs, and customer handling rules. It learns your tone and style. You can update this information at any time.' },
    { q: 'What if the customer wants to speak to a human?', a: 'The AI always identifies itself as an AI assistant. If the customer requests a human, it transfers the call immediately. This is also a legal requirement we follow (GDPR Art. 22).' },
    { q: 'Is it safe regarding privacy?', a: 'Absolutely. We follow GDPR, Norwegian data protection law, and Datatilsynet\'s guidelines. All data is encrypted and stored in the EEA, we sign a DPA with all clients, and callers are always informed about data processing.' },
    { q: 'What does it cost?', a: 'Pricing depends on volume and complexity. Start a free discovery to get a tailored estimate for your business — it only takes 2 minutes.' },
    { q: 'How long does setup take?', a: 'Typically about 14 business days from signing. We use this time to program the AI with your business information and test thoroughly with you before going live.' },
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
          <Phone size={14} />
          {lang === 'no' ? 'AI Mobilsvarer' : 'AI Phone Answering'}
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
          {lang === 'no' ? (
            <>Aldri gå glipp av en <span style={{ color: gold }}>henvendelse</span> igjen</>
          ) : (
            <>Never miss a <span style={{ color: gold }}>customer call</span> again</>
          )}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.65 }}>
          {lang === 'no'
            ? 'Vår AI-mobilsvarer tar imot samtaler for bedriften din 24/7 — på norsk og engelsk. Den kvalifiserer henvendelser, booker avtaler, og sender deg et sammendrag etter hver samtale. Alt i tråd med norsk lov.'
            : 'Our AI answering service handles calls for your business 24/7 — in Norwegian and English. It qualifies inquiries, books appointments, and sends you a summary after each call. Fully compliant with Norwegian law.'}
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

      {/* ── WHAT HAPPENS DURING A CALL ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 60px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 36 }}>
          {lang === 'no' ? 'Hva skjer når en kunde ringer?' : 'What happens when a customer calls?'}
        </motion.h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {(lang === 'no' ? [
            { icon: Phone, text: 'Kunden ringer ditt bedriftsnummer', sub: 'Samtalen rutes automatisk til AI-plattformen' },
            { icon: Bot, text: 'AI-en svarer på norsk (eller engelsk)', sub: 'Identifiserer seg som AI-assistent — transparent og lovpålagt' },
            { icon: MessageSquare, text: 'Forstår hva kunden trenger', sub: 'Kvalifiserer henvendelsen, svarer på spørsmål, booker om nødvendig' },
            { icon: Database, text: 'Logger alt automatisk', sub: 'Navn, nummer, spørsmål og svar lagres kryptert i ditt kunderegistersystem' },
            { icon: Bell, text: 'Du får et sammendrag', sub: 'SMS og/eller e-post med full oversikt — innen sekunder' },
            { icon: Users, text: 'Automatisk oppfølging (valgfritt)', sub: 'Booking-bekreftelse, påminnelser, eller hastevarsling til deg' },
          ] : [
            { icon: Phone, text: 'Customer calls your business number', sub: 'The call is automatically routed to the AI platform' },
            { icon: Bot, text: 'AI answers in Norwegian (or English)', sub: 'Identifies itself as an AI assistant — transparent and legally required' },
            { icon: MessageSquare, text: 'Understands what the customer needs', sub: 'Qualifies the inquiry, answers questions, books if needed' },
            { icon: Database, text: 'Logs everything automatically', sub: 'Name, number, question and response stored encrypted in your CRM system' },
            { icon: Bell, text: 'You get a summary', sub: 'SMS and/or email with full overview — within seconds' },
            { icon: Users, text: 'Automatic follow-up (optional)', sub: 'Booking confirmation, reminders, or urgent notification to you' },
          ]).map((item, i) => (
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

      {/* ── LEGAL COMPLIANCE ── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 60px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 10 }}>
          {lang === 'no' ? 'Fullt lovpålagt — ingen snarveier' : 'Fully compliant — no shortcuts'}
        </motion.h2>
        <motion.p {...fadeUp} style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 14, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          {lang === 'no'
            ? 'Personvern er ikke et ekstra valg — det er innebygd i alt vi gjør.'
            : "Privacy isn't an add-on — it's built into everything we do."}
        </motion.p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {legalPoints.map((pt, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16,
                padding: '24px 20px', transition: 'border-color 0.2s',
              }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(${goldRgb},0.06)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <pt.icon size={18} color={gold} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{pt.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{pt.desc}</p>
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
            {lang === 'no' ? 'Klar for AI-mobilsvarer?' : 'Ready for AI phone answering?'}
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
