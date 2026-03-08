'use client'
import { useLanguage } from '@/lib/language-context'
import { motion } from 'framer-motion'
import { Shield, Mail, Clock, Database, Eye, Trash2, Lock, Server, Globe, UserCheck } from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, globalStyles } from '@/lib/constants'

export default function PersonvernPage() {
  const { lang } = useLanguage()
  const no = lang === 'no'
  const fadeUp = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } }
  const updated = '8. mars 2026'
  const updatedEn = 'March 8, 2026'

  const sections = no ? [
    { icon: <UserCheck size={20} />, title: '1. Behandlingsansvarlig', content: 'Arxon, org.nr. [kommer], kontakt@arxon.no, er behandlingsansvarlig for personopplysninger som samles inn via arxon.no og tilknyttede tjenester. Henvendelser om personvern kan rettes til kontakt@arxon.no.' },
    { icon: <Database size={20} />, title: '2. Hvilke opplysninger vi samler inn', content: 'Vi samler inn fÃ¸lgende kategorier av personopplysninger:\n\nâ¢ Kontaktinformasjon: Navn, e-postadresse, telefonnummer (ved registrering og bookinger)\nâ¢ Betalingsinformasjon: Kortinformasjon behandles direkte av Stripe â vi lagrer aldri fullstendige kortnummer\nâ¢ Samtaledata fra AI-tjenester: Opptak og transkripsjoner fra AI-telefonsamtaler via Vapi/OpenAI\nâ¢ Tekniske data: IP-adresse, nettlesertype, enhetsinfo, besÃ¸kstidspunkt\nâ¢ Brukerinnstillinger: SprÃ¥kpreferanser og tjenestevalg' },
    { icon: <Eye size={20} />, title: '3. FormÃ¥l og rettslig grunnlag', content: 'Vi behandler opplysningene for:\n\nâ¢ Levering av tjenester (GDPR art. 6(1)(b)): Oppfylle avtalen om AI-telefonsvarer og automatisering\nâ¢ Samtykke (art. 6(1)(a)): MarkedsfÃ¸ring og nyhetsbrev â kun med ditt aktive samtykke\nâ¢ Rettslig forpliktelse (art. 6(1)(c)): BokfÃ¸ringsloven krever lagring av fakturadata i 5 Ã¥r\nâ¢ Berettiget interesse (art. 6(1)(f)): FeilsÃ¸king, sikkerhet og forbedring av tjenestene' },
    { icon: <Server size={20} />, title: '4. AI-spesifikk behandling', content: 'AI-samtaler via Vapi/OpenAI behandles som fÃ¸lger:\n\nâ¢ Opptak lagres midlertidig for transkripsjon og analyse\nâ¢ Samtaledata brukes til Ã¥ forbedre svarene og tjenesteleveransen\nâ¢ Du kan be om sletting av samtaledata nÃ¥r som helst\nâ¢ OpenAI fungerer som databehandler under vÃ¥r databehandleravtale\nâ¢ AI-genererte svar er automatiserte, men ingen juridisk bindende beslutninger tas uten menneskelig kontroll' },
    { icon: <Globe size={20} />, title: '5. Deling og overfÃ¸ring av data', content: 'Vi deler opplysninger med fÃ¸lgende underleverandÃ¸rer (databehandlere):\n\nâ¢ Stripe (betalingsbehandling) â EU/US, SCCs\nâ¢ Vercel (hosting) â EU/US, SCCs\nâ¢ Supabase (database) â EU-region\nâ¢ Cal.com (booking) â EU/US, SCCs\nâ¢ Vapi/OpenAI (AI-samtaler) â US, SCCs og DPA\nâ¢ Google Workspace (e-post) â EU/US, SCCs\n\nAlle overfÃ¸ringer til land utenfor EÃS skjer med standard personvernbestemmelser (SCCs) i henhold til GDPR kap. V.' },
    { icon: <Clock size={20} />, title: '6. Lagringstid', content: 'â¢ Kontaktinformasjon: SÃ¥ lenge kundeforholdet varer, pluss 12 mÃ¥neder\nâ¢ Betalingsdata: 5 Ã¥r (bokfÃ¸ringsloven)\nâ¢ AI-samtaledata: Maks 90 dager, med mindre du ber om tidligere sletting\nâ¢ Tekniske logger: 30 dager\nâ¢ MarkedsfÃ¸ringssamtykke: Til samtykket trekkes tilbake' },
    { icon: <Shield size={20} />, title: '7. Dine rettigheter', content: 'Etter GDPR art. 15â22 har du rett til:\n\nâ¢ Innsyn: Be om kopi av alle opplysninger vi har om deg\nâ¢ Retting: Korrigere uriktige opplysninger\nâ¢ Sletting: FÃ¥ opplysninger slettet (Â«retten til Ã¥ bli glemtÂ»)\nâ¢ Begrensning: Begrense behandlingen i visse situasjoner\nâ¢ Dataportabilitet: Motta dine data i et maskinlesbart format\nâ¢ Innsigelse: Protestere mot behandling basert pÃ¥ berettiget interesse\n\nSend forespÃ¸rsler til kontakt@arxon.no. Vi svarer innen 30 dager.' },
    { icon: <Eye size={20} />, title: '8. Informasjonskapsler (cookies)', content: 'Vi bruker kun nÃ¸dvendige informasjonskapsler for at nettsiden skal fungere. Vi bruker ingen tredjeparts sporings- eller analysecookies. SprÃ¥kpreferanser lagres lokalt i nettleseren din (localStorage).' },
    { icon: <Lock size={20} />, title: '9. Sikkerhet', content: 'Vi beskytter dine data med:\n\nâ¢ Kryptering i transit (TLS/SSL) og i hvile\nâ¢ Tilgangskontroll med rollebaserte rettigheter\nâ¢ Regelmessig sikkerhetsgjennomgang av systemer og underleverandÃ¸rer\nâ¢ HendelseshÃ¥ndtering og varsling ved eventuelle brudd, i henhold til GDPR art. 33â34' },
    { icon: <Mail size={20} />, title: '10. Klager', content: 'Du har rett til Ã¥ klage til Datatilsynet (datatilsynet.no) dersom du mener vi behandler personopplysningene dine i strid med regelverket.\n\nKontakt oss fÃ¸rst pÃ¥ kontakt@arxon.no â vi Ã¸nsker Ã¥ lÃ¸se eventuelle bekymringer direkte.' },
  ] : [
    { icon: <UserCheck size={20} />, title: '1. Data Controller', content: 'Arxon, org. no. [pending], kontakt@arxon.no, is the data controller for personal data collected through arxon.no and related services. Privacy inquiries can be directed to kontakt@arxon.no.' },
    { icon: <Database size={20} />, title: '2. Data We Collect', content: 'We collect the following categories of personal data:\n\nâ¢ Contact information: Name, email address, phone number (during registration and bookings)\nâ¢ Payment information: Card details are processed directly by Stripe â we never store complete card numbers\nâ¢ AI conversation data: Recordings and transcriptions from AI phone calls via Vapi/OpenAI\nâ¢ Technical data: IP address, browser type, device info, visit timestamps\nâ¢ User preferences: Language settings and service selections' },
    { icon: <Eye size={20} />, title: '3. Purposes and Legal Basis', content: 'We process data for:\n\nâ¢ Service delivery (GDPR Art. 6(1)(b)): Fulfilling the agreement for AI receptionist and automation services\nâ¢ Consent (Art. 6(1)(a)): Marketing and newsletters â only with your active consent\nâ¢ Legal obligation (Art. 6(1)(c)): Norwegian Bookkeeping Act requires invoice data retention for 5 years\nâ¢ Legitimate interest (Art. 6(1)(f)): Troubleshooting, security, and service improvements' },
    { icon: <Server size={20} />, title: '4. AI-Specific Processing', content: 'AI conversations via Vapi/OpenAI are processed as follows:\n\nâ¢ Recordings are temporarily stored for transcription and analysis\nâ¢ Conversation data is used to improve responses and service delivery\nâ¢ You may request deletion of conversation data at any time\nâ¢ OpenAI acts as a data processor under our Data Processing Agreement\nâ¢ AI-generated responses are automated, but no legally binding decisions are made without human oversight' },
    { icon: <Globe size={20} />, title: '5. Data Sharing and Transfers', content: 'We share data with the following sub-processors:\n\nâ¢ Stripe (payment processing) â EU/US, SCCs\nâ¢ Vercel (hosting) â EU/US, SCCs\nâ¢ Supabase (database) â EU region\nâ¢ Cal.com (booking) â EU/US, SCCs\nâ¢ Vapi/OpenAI (AI conversations) â US, SCCs and DPA\nâ¢ Google Workspace (email) â EU/US, SCCs\n\nAll transfers outside the EEA use Standard Contractual Clauses (SCCs) per GDPR Chapter V.' },
    { icon: <Clock size={20} />, title: '6. Retention Periods', content: 'â¢ Contact information: Duration of customer relationship plus 12 months\nâ¢ Payment data: 5 years (Norwegian Bookkeeping Act)\nâ¢ AI conversation data: Maximum 90 days, unless earlier deletion is requested\nâ¢ Technical logs: 30 days\nâ¢ Marketing consent: Until consent is withdrawn' },
    { icon: <Shield size={20} />, title: '7. Your Rights', content: 'Under GDPR Articles 15â22, you have the right to:\n\nâ¢ Access: Request a copy of all data we hold about you\nâ¢ Rectification: Correct inaccurate data\nâ¢ Erasure: Have your data deleted ("right to be forgotten")\nâ¢ Restriction: Restrict processing in certain situations\nâ¢ Data portability: Receive your data in a machine-readable format\nâ¢ Object: Object to processing based on legitimate interest\n\nSend requests to kontakt@arxon.no. We respond within 30 days.' },
    { icon: <Eye size={20} />, title: '8. Cookies', content: 'We only use essential cookies required for the website to function. We do not use any third-party tracking or analytics cookies. Language preferences are stored locally in your browser (localStorage).' },
    { icon: <Lock size={20} />, title: '9. Security', content: 'We protect your data with:\n\nâ¢ Encryption in transit (TLS/SSL) and at rest\nâ¢ Access control with role-based permissions\nâ¢ Regular security reviews of systems and sub-processors\nâ¢ Incident handling and notification in case of breaches, per GDPR Art. 33â34' },
    { icon: <Mail size={20} />, title: '10. Complaints', content: 'You have the right to file a complaint with the Norwegian Data Protection Authority (datatilsynet.no) if you believe we process your personal data in violation of regulations.\n\nPlease contact us first at kontakt@arxon.no â we want to resolve any concerns directly.' },
  ]

  const icons = [<UserCheck size={20} key="uc" />, <Database size={20} key="db" />, <Eye size={20} key="ey" />, <Server size={20} key="sv" />, <Globe size={20} key="gl" />, <Clock size={20} key="cl" />, <Shield size={20} key="sh" />, <Eye size={20} key="ey2" />, <Lock size={20} key="lk" />, <Mail size={20} key="ml" />]

  return (
    <div style={{ minHeight: '100vh', background: bg, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles()}</style>
      <Nav />

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '140px 24px 80px' }}>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(${goldRgb},0.08)`, border: `1px solid rgba(${goldRgb},0.15)`, borderRadius: 999, padding: '8px 18px', marginBottom: 20 }}>
            <Shield size={14} style={{ color: gold }} />
            <span style={{ color: gold, fontSize: 13, fontWeight: 500 }}>{no ? 'Personvern' : 'Privacy Policy'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#fff', marginBottom: 16 }}>
            {no ? 'PersonvernerklÃ¦ring' : 'Privacy Policy'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            {no ? `Sist oppdatert: ${updated}` : `Last updated: ${updatedEn}`}
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {sections.map((s, i) => (
            <motion.div key={i} {...fadeUp} transition={{ duration: 0.55, delay: i * 0.04 }}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '28px 28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ color: gold }}>{s.icon}</div>
                <h2 style={{ fontSize: 17, fontWeight: 600, color: '#fff', margin: 0 }}>{s.title}</h2>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14.5, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{s.content}</div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} style={{ textAlign: 'center', marginTop: 48, padding: '28px', background: `rgba(${goldRgb},0.04)`, border: `1px solid rgba(${goldRgb},0.1)`, borderRadius: 14 }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}>
            {no ? 'SpÃ¸rsmÃ¥l om personvern? Kontakt oss pÃ¥ ' : 'Privacy questions? Contact us at '}
            <a href="mailto:kontakt@arxon.no" style={{ color: gold, textDecoration: 'none' }}>kontakt@arxon.no</a>
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
