'use client'
import { useLanguage } from '@/lib/language-context'
import { motion } from 'framer-motion'
import { FileText, CreditCard, Shield, Clock, Scale, AlertTriangle, UserCheck, BookOpen, Gavel, RefreshCw } from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, globalStyles } from '@/lib/constants'

export default function VilkarPage() {
  const { lang } = useLanguage()
  const no = lang === 'no'
  const fadeUp = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } }
  const updated = '8. mars 2026'
  const updatedEn = 'March 8, 2026'

  const sections = no ? [
    { icon: <FileText size={20} />, title: '1. Om tjenesten', content: 'Arxon leverer AI-basert telefonsvarer og automatiseringsløsninger for norske bedrifter. Tjenesten inkluderer AI-drevet samtalebehandling, automatiserte arbeidsflyter og integrasjoner med eksisterende systemer.\n\nDisse vilkårene gjelder for alle tjenester levert av Arxon via arxon.no og tilknyttede plattformer.' },
    { icon: <Scale size={20} />, title: '2. Avtaleinngåelse og angrerett', content: 'Avtalen anses inngått når du fullfører bestillingen og mottar ordrebekreftelse.\n\nEtter angrerettloven har forbrukere 14 dagers angrerett fra avtaleinngåelsen. Angreretten bortfaller dersom du uttrykkelig har samtykket til at tjenesten starter før angrefristen utløper, og du har bekreftet at du er kjent med at angreretten bortfaller (angrerettloven § 22).\n\nFor å benytte angreretten, kontakt oss på kontakt@arxon.no innen fristen.' },
    { icon: <CreditCard size={20} />, title: '3. Priser og betaling', content: 'Alle priser er oppgitt i NOK og inkluderer merverdiavgift der det er påkrevd. Betaling skjer via Stripe.\n\nVed forsinket betaling påløper forsinkelsesrente i henhold til forsinkelsesrenteloven. Vi sender betalingspåminnelse minst 14 dager før inkasso iverksettes.\n\nPrisendringer varsles minst 30 dager i forveien og gjelder fra neste faktureringsperiode.' },
    { icon: <RefreshCw size={20} />, title: '4. Abonnement og oppsigelse', content: 'Abonnementer løper månedlig eller årlig, avhengig av valgt plan.\n\nI henhold til digitalytelsesloven § 6 kan forbrukere si opp løpende avtaler med én måneds varsel etter en eventuell minimumsperiode. Bindingstiden er maksimalt 6 måneder for forbrukere.\n\nVed oppsigelse beholder du tilgang ut inneværende betalte periode. Dine data kan eksporteres innen 30 dager etter opphør.' },
    { icon: <Clock size={20} />, title: '5. Levering og kvalitet', content: 'Tjenesten leveres som en digital ytelse og er tilgjengelig umiddelbart etter aktivering.\n\nArxon tilstreber 99,5 % oppetid, men garanterer ikke uavbrutt tilgang. Planlagt vedlikehold varsles minst 48 timer i forveien.\n\nVi forplikter oss til å levere tjenesten i samsvar med avtalen og gjeldende standarder for digitale ytelser (digitalytelsesloven kap. 3).' },
    { icon: <AlertTriangle size={20} />, title: '6. Ansvarsbegrensning', content: 'Arxon er ikke ansvarlig for:\n\n• Indirekte tap, følgeskader eller tap av fortjeneste\n• Feil eller unøyaktigheter i AI-genererte svar – AI-tjenesten er et hjelpemiddel, ikke en erstatning for faglig rådgivning\n• Tap som skyldes force majeure, inkludert nedetid hos underleverandører\n• Handlinger tredjeparter foretar basert på AI-generert innhold\n\nVårt samlede erstatningsansvar er begrenset til beløpet du har betalt de siste 12 månedene. Denne begrensningen gjelder ikke ved grov uaktsomhet eller forsett.' },
    { icon: <UserCheck size={20} />, title: '7. Brukerens plikter', content: 'Som bruker er du ansvarlig for:\n\n• At informasjonen du oppgir er korrekt og oppdatert\n• Å holde påloggingsinformasjon konfidensiell\n• At bruken av tjenesten er i samsvar med gjeldende lovverk\n• Å ikke misbruke tjenesten til ulovlige eller skadelige formål\n• Å varsle oss umiddelbart ved uautorisert tilgang til din konto' },
    { icon: <BookOpen size={20} />, title: '8. Immaterielle rettigheter', content: 'Alt innhold, design, kode og teknologi på arxon.no tilhører Arxon eller våre lisensgivere.\n\nDu beholder eierskap til egne data du laster opp eller genererer gjennom tjenesten. Arxon har en begrenset lisens til å behandle disse dataene for å levere tjenesten.\n\nAI-generert innhold levert til deg kan brukes fritt i din virksomhet, men Arxon påtar seg ikke ansvar for innholdets nøyaktighet.' },
    { icon: <Gavel size={20} />, title: '9. Tvister og lovvalg', content: 'Disse vilkårene er underlagt norsk lov.\n\nVed uenighet forsøkes først en minnelig løsning. Forbrukere kan klage til Forbrukertilsynet (forbrukertilsynet.no) eller bruke EU-kommisjonens klageportal for netthandel (ec.europa.eu/odr).\n\nVerneting er Arxons forretningsadresse, med mindre annet følger av ufravikelig lovgivning.' },
    { icon: <RefreshCw size={20} />, title: '10. Endringer', content: 'Vi forbeholder oss retten til å endre disse vilkårene. Vesentlige endringer varsles minst 30 dager i forveien via e-post eller på nettsiden.\n\nFortsatt bruk etter ikrafttredelse anses som aksept av endringene. Ved vesentlige endringer som er til ulempe for deg, har du rett til å si opp avtalen.' },
  ] : [
    { icon: <FileText size={20} />, title: '1. About the Service', content: 'Arxon provides AI-based receptionist and automation solutions for Norwegian businesses. The service includes AI-powered call handling, automated workflows, and integrations with existing systems.\n\nThese terms apply to all services delivered by Arxon through arxon.no and associated platforms.' },
    { icon: <Scale size={20} />, title: '2. Agreement and Withdrawal', content: 'The agreement is considered entered into when you complete the order and receive an order confirmation.\n\nUnder the Norwegian Right of Withdrawal Act, consumers have a 14-day withdrawal period from the date of agreement. The right of withdrawal lapses if you have expressly consented to the service starting before the withdrawal period expires and have confirmed awareness that the withdrawal right is forfeited (§ 22).\n\nTo exercise your right of withdrawal, contact us at kontakt@arxon.no within the deadline.' },
    { icon: <CreditCard size={20} />, title: '3. Prices and Payment', content: 'All prices are stated in NOK and include VAT where applicable. Payment is processed via Stripe.\n\nLate payments incur interest in accordance with the Norwegian Late Payment Interest Act. A payment reminder is sent at least 14 days before debt collection proceedings.\n\nPrice changes are notified at least 30 days in advance and apply from the next billing period.' },
    { icon: <RefreshCw size={20} />, title: '4. Subscription and Cancellation', content: 'Subscriptions run monthly or annually, depending on the selected plan.\n\nPursuant to the Norwegian Digital Services Act § 6, consumers may cancel ongoing agreements with one month\'s notice after any minimum period. The maximum binding period for consumers is 6 months.\n\nUpon cancellation, you retain access through the current paid period. Your data can be exported within 30 days after termination.' },
    { icon: <Clock size={20} />, title: '5. Delivery and Quality', content: 'The service is delivered as a digital product and is available immediately upon activation.\n\nArxon aims for 99.5% uptime but does not guarantee uninterrupted access. Planned maintenance is notified at least 48 hours in advance.\n\nWe commit to delivering the service in accordance with the agreement and applicable standards for digital services (Digital Services Act, Chapter 3).' },
    { icon: <AlertTriangle size={20} />, title: '6. Limitation of Liability', content: 'Arxon is not liable for:\n\n• Indirect losses, consequential damages, or loss of profit\n• Errors or inaccuracies in AI-generated responses – the AI service is a tool, not a substitute for professional advice\n• Losses caused by force majeure, including downtime at sub-processors\n• Actions taken by third parties based on AI-generated content\n\nOur total liability is limited to the amount you have paid in the last 12 months. This limitation does not apply in cases of gross negligence or intent.' },
    { icon: <UserCheck size={20} />, title: '7. User Obligations', content: 'As a user, you are responsible for:\n\n• Ensuring the information you provide is accurate and up to date\n• Keeping login credentials confidential\n• Using the service in compliance with applicable laws\n• Not misusing the service for illegal or harmful purposes\n• Notifying us immediately of any unauthorized access to your account' },
    { icon: <BookOpen size={20} />, title: '8. Intellectual Property', content: 'All content, design, code, and technology on arxon.no belongs to Arxon or our licensors.\n\nYou retain ownership of your own data uploaded or generated through the service. Arxon has a limited license to process this data to deliver the service.\n\nAI-generated content delivered to you may be used freely in your business, but Arxon assumes no responsibility for the accuracy of such content.' },
    { icon: <Gavel size={20} />, title: '9. Disputes and Governing Law', content: 'These terms are governed by Norwegian law.\n\nIn case of disagreement, an amicable resolution is attempted first. Consumers may file complaints with the Norwegian Consumer Authority (forbrukertilsynet.no) or use the EU Commission\'s online dispute resolution platform (ec.europa.eu/odr).\n\nJurisdiction is at Arxon\'s registered business address, unless otherwise required by mandatory legislation.' },
    { icon: <RefreshCw size={20} />, title: '10. Changes', content: 'We reserve the right to modify these terms. Material changes are notified at least 30 days in advance via email or on the website.\n\nContinued use after the effective date is considered acceptance of the changes. In case of material changes to your disadvantage, you have the right to terminate the agreement.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: bg, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles()}</style>
      <Nav />

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '140px 24px 80px' }}>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(${goldRgb},0.08)`, border: `1px solid rgba(${goldRgb},0.15)`, borderRadius: 999, padding: '8px 18px', marginBottom: 20 }}>
            <FileText size={14} style={{ color: gold }} />
            <span style={{ color: gold, fontSize: 13, fontWeight: 500 }}>{no ? 'Vilkår' : 'Terms of Service'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#fff', marginBottom: 16 }}>
            {no ? 'Brukervilkår' : 'Terms of Service'}
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
            {no ? 'Spørsmål om vilkårene? Kontakt oss på ' : 'Questions about our terms? Contact us at '}
            <a href="mailto:kontakt@arxon.no" style={{ color: gold, textDecoration: 'none' }}>kontakt@arxon.no</a>
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
