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
    { icon: <Database size={20} />, title: '2. Hvilke opplysninger vi samler inn', content: 'Vi samler inn følgende kategorier av personopplysninger:\n\n• Kontaktinformasjon: Navn, e-postadresse, telefonnummer (ved registrering og bookinger)\n• Betalingsinformasjon: Kortinformasjon behandles direkte av Stripe – vi lagrer aldri fullstendige kortnummer\n• Samtaledata fra AI-tjenester: Opptak og transkripsjoner fra AI-telefonsamtaler via Vapi/OpenAI\n• Tekniske data: IP-adresse, nettlesertype, enhetsinfo, besøkstidspunkt\n• Brukerinnstillinger: Språkpreferanser og tjenestevalg' },
    { icon: <Eye size={20} />, title: '3. Formål og rettslig grunnlag', content: 'Vi behandler opplysningene for:\n\n• Levering av tjenester (GDPR art. 6(1)(b)): Oppfylle avtalen om AI-telefonsvarer og automatisering\n• Samtykke (art. 6(1)(a)): Markedsføring og nyhetsbrev – kun med ditt aktive samtykke\n• Rettslig forpliktelse (art. 6(1)(c)): Bokføringsloven krever lagring av fakturadata i 5 år\n• Berettiget interesse (art. 6(1)(f)): Feilsøking, sikkerhet og forbedring av tjenestene' },
    { icon: <Server size={20} />, title: '4. AI-spesifikk behandling', content: 'AI-samtaler via Vapi/OpenAI behandles som følger:\n\n• Opptak lagres midlertidig for transkripsjon og analyse\n• Samtaledata brukes til å forbedre svarene og tjenesteleveransen\n• Du kan be om sletting av samtaledata når som helst\n• OpenAI fungerer som databehandler under vår databehandleravtale\n• AI-genererte svar er automatiserte, men ingen juridisk bindende beslutninger tas uten menneskelig kontroll' },
    { icon: <Globe size={20} />, title: '5. Deling og overføring av data', content: 'Vi deler opplysninger med følgende underleverandører (databehandlere):\n\n• Stripe (betalingsbehandling) – EU/US, SCCs\n• Vercel (hosting) – EU/US, SCCs\n• Supabase (database) – EU-region\n• Cal.com (booking) – EU/US, SCCs\n• Vapi/OpenAI (AI-samtaler) – US, SCCs og DPA\n• Google Workspace (e-post) – EU/US, SCCs\n\nAlle overføringer til land utenfor EØS skjer med standard personvernbestemmelser (SCCs) i henhold til GDPR kap. V.' },
    { icon: <Clock size={20} />, title: '6. Lagringstid', content: '• Kontaktinformasjon: Så lenge kundeforholdet varer, pluss 12 måneder\n• Betalingsdata: 5 år (bokføringsloven)\n• AI-samtaledata: Maks 90 dager, med mindre du ber om tidligere sletting\n• Tekniske logger: 30 dager\n• Markedsføringssamtykke: Til samtykket trekkes tilbake' },
    { icon: <Shield size={20} />, title: '7. Dine rettigheter', content: 'Etter GDPR art. 15–22 har du rett til:\n\n• Innsyn: Be om kopi av alle opplysninger vi har om deg\n• Retting: Korrigere uriktige opplysninger\n• Sletting: Få opplysninger slettet («retten til å bli glemt»)\n• Begrensning: Begrense behandlingen i visse situasjoner\n• Dataportabilitet: Motta dine data i et maskinlesbart format\n• Innsigelse: Protestere mot behandling basert på berettiget interesse\n\nSend forespørsler til kontakt@arxon.no. Vi svarer innen 30 dager.' },
    { icon: <Eye size={20} />, title: '8. Informasjonskapsler (cookies)', content: 'Vi bruker kun nødvendige informasjonskapsler for at nettsiden skal fungere. Vi bruker ingen tredjeparts sporings- eller analysecookies. Språkpreferanser lagres lokalt i nettleseren din (localStorage).' },
    { icon: <Lock size={20} />, title: '9. Sikkerhet', content: 'Vi beskytter dine data med:\n\n• Kryptering i transit (TLS/SSL) og i hvile\n• Tilgangskontroll med rollebaserte rettigheter\n• Regelmessig sikkerhetsgjennomgang av systemer og underleverandører\n• Hendelseshåndtering og varsling ved eventuelle brudd, i henhold til GDPR art. 33–34' },
    { icon: <Mail size={20} />, title: '10. Klager', content: 'Du har rett til å klage til Datatilsynet (datatilsynet.no) dersom du mener vi behandler personopplysningene dine i strid med regelverket.\n\nKontakt oss først på kontakt@arxon.no – vi ønsker å løse eventuelle bekymringer direkte.' },
  ] : [
    { icon: <UserCheck size={20} />, title: '1. Data Controller', content: 'Arxon, org. no. [pending], kontakt@arxon.no, is the data controller for personal data collected through arxon.no and related services. Privacy inquiries can be directed to kontakt@arxon.no.' },
    { icon: <Database size={20} />, title: '2. Data We Collect', content: 'We collect the following categories of personal data:\n\n• Contact information: Name, email address, phone number (during registration and bookings)\n• Payment information: Card details are processed directly by Stripe – we never store complete card numbers\n• AI conversation data: Recordings and transcriptions from AI phone calls via Vapi/OpenAI\n• Technical data: IP address, browser type, device info, visit timestamps\n• User preferences: Language settings and service selections' },
    { icon: <Eye size={20} />, title: '3. Purposes and Legal Basis', content: 'We process data for:\n\n• Service delivery (GDPR Art. 6(1)(b)): Fulfilling the agreement for AI receptionist and automation services\n• Consent (Art. 6(1)(a)): Marketing and newsletters – only with your active consent\n• Legal obligation (Art. 6(1)(c)): Norwegian Bookkeeping Act requires invoice data retention for 5 years\n• Legitimate interest (Art. 6(1)(f)): Troubleshooting, security, and service improvements' },
    { icon: <Server size={20} />, title: '4. AI-Specific Processing', content: 'AI conversations via Vapi/OpenAI are processed as follows:\n\n• Recordings are temporarily stored for transcription and analysis\n• Conversation data is used to improve responses and service delivery\n• You may request deletion of conversation data at any time\n• OpenAI acts as a data processor under our Data Processing Agreement\n• AI-generated responses are automated, but no legally binding decisions are made without human oversight' },
    { icon: <Globe size={20} />, title: '5. Data Sharing and Transfers', content: 'We share data with the following sub-processors:\n\n• Stripe (payment processing) – EU/US, SCCs\n• Vercel (hosting) – EU/US, SCCs\n• Supabase (database) – EU region\n• Cal.com (booking) – EU/US, SCCs\n• Vapi/OpenAI (AI conversations) – US, SCCs and DPA\n• Google Workspace (email) – EU/US, SCCs\n\nAll transfers outside the EEA use Standard Contractual Clauses (SCCs) per GDPR Chapter V.' },
    { icon: <Clock size={20} />, title: '6. Retention Periods', content: '• Contact information: Duration of customer relationship plus 12 months\n• Payment data: 5 years (Norwegian Bookkeeping Act)\n• AI conversation data: Maximum 90 days, unless earlier deletion is requested\n• Technical logs: 30 days\n• Marketing consent: Until consent is withdrawn' },
    { icon: <Shield size={20} />, title: '7. Your Rights', content: 'Under GDPR Articles 15–22, you have the right to:\n\n• Access: Request a copy of all data we hold about you\n• Rectification: Correct inaccurate data\n• Erasure: Have your data deleted ("right to be forgotten")\n• Restriction: Restrict processing in certain situations\n• Data portability: Receive your data in a machine-readable format\n• Object: Object to processing based on legitimate interest\n\nSend requests to kontakt@arxon.no. We respond within 30 days.' },
    { icon: <Eye size={20} />, title: '8. Cookies', content: 'We only use essential cookies required for the website to function. We do not use any third-party tracking or analytics cookies. Language preferences are stored locally in your browser (localStorage).' },
    { icon: <Lock size={20} />, title: '9. Security', content: 'We protect your data with:\n\n• Encryption in transit (TLS/SSL) and at rest\n• Access control with role-based permissions\n• Regular security reviews of systems and sub-processors\n• Incident handling and notification in case of breaches, per GDPR Art. 33–34' },
    { icon: <Mail size={20} />, title: '10. Complaints', content: 'You have the right to file a complaint with the Norwegian Data Protection Authority (datatilsynet.no) if you believe we process your personal data in violation of regulations.\n\nPlease contact us first at kontakt@arxon.no – we want to resolve any concerns directly.' },
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
            {no ? 'Personvernerklæring' : 'Privacy Policy'}
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
            {no ? 'Spørsmål om personvern? Kontakt oss på ' : 'Privacy questions? Contact us at '}
            <a href="mailto:kontakt@arxon.no" style={{ color: gold, textDecoration: 'none' }}>kontakt@arxon.no</a>
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
