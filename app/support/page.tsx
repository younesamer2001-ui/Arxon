'use client'
import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { motion } from 'framer-motion'
import { Headphones, Mail, Phone, Clock, ChevronDown, MessageSquare, HelpCircle, ArrowRight, Shield, FileText } from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, globalStyles, PHONE_NUMBER } from '@/lib/constants'

function SupportFAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12, overflow: 'hidden',
      transition: 'border-color 0.2s',
      ...(open ? { borderColor: `rgba(${goldRgb},0.2)` } : {}),
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 22px', background: 'none', border: 'none', color: '#fff',
        fontSize: 15, fontWeight: 500, cursor: 'pointer', textAlign: 'left', gap: 12,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {q}
        <ChevronDown size={18} style={{ color: gold, transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0 }} />
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
        <div style={{ padding: '0 22px 18px', color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.75 }}>{a}</div>
      </div>
    </div>
  )
}

export default function SupportPage() {
  const { lang } = useLanguage()
  const no = lang === 'no'
  const fadeUp = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } }

  const channels = no ? [
    { icon: <Mail size={24} />, title: 'E-post', desc: 'Send oss en melding – vi svarer innen 24 timer på hverdager.', action: 'kontakt@arxon.no', href: 'mailto:kontakt@arxon.no' },
    { icon: <Phone size={24} />, title: 'Telefon', desc: 'Ring oss direkte i åpningstiden.', action: PHONE_NUMBER, href: `tel:${PHONE_NUMBER}` },
    { icon: <MessageSquare size={24} />, title: 'Chat', desc: 'Snakk med oss via chatten på nettsiden.', action: 'Start chat', href: '#' },
  ] : [
    { icon: <Mail size={24} />, title: 'Email', desc: 'Send us a message – we respond within 24 hours on business days.', action: 'kontakt@arxon.no', href: 'mailto:kontakt@arxon.no' },
    { icon: <Phone size={24} />, title: 'Phone', desc: 'Call us directly during business hours.', action: PHONE_NUMBER, href: `tel:${PHONE_NUMBER}` },
    { icon: <MessageSquare size={24} />, title: 'Chat', desc: 'Talk to us via the website chat.', action: 'Start chat', href: '#' },
  ]

  const faqs = no ? [
    { q: 'Hvor lang tid tar det å sette opp Arxon?', a: 'De fleste kunder er oppe og går innen 24–48 timer. Vi hjelper deg med oppsettet slik at alt fungerer sømløst med din virksomhet.' },
    { q: 'Kan jeg prøve tjenesten før jeg binder meg?', a: 'Ja! Vi tilbyr en gratis demo og gjennomgang slik at du kan se hvordan Arxon fungerer for din bedrift før du bestemmer deg.' },
    { q: 'Hvem eier dataene mine?', a: 'Du eier alle dine data. Vi behandler dem kun for å levere tjenesten, og du kan eksportere eller slette dem når som helst. Se vår personvernerklæring for detaljer.' },
    { q: 'Er det bindingstid?', a: 'For forbrukere er bindingstiden maksimalt 6 måneder i henhold til digitalytelsesloven. Du kan deretter si opp med én måneds varsel.' },
    { q: 'Hvordan håndterer Arxon GDPR?', a: 'Vi er fullt GDPR-kompatible. Alle data behandles i henhold til personopplysningsloven, med databehandleravtaler for alle underleverandører og SCCs for overføringer utenfor EØS.' },
    { q: 'Hva skjer hvis AI-en svarer feil?', a: 'AI-tjenesten er et hjelpemiddel og erstatter ikke faglig rådgivning. Vi jobber kontinuerlig med å forbedre nøyaktigheten, og du kan justere innstillingene for din bedrift.' },
    { q: 'Kan jeg endre plan underveis?', a: 'Ja, du kan oppgradere eller nedgradere planen din når som helst. Endringer trer i kraft fra neste faktureringsperiode.' },
    { q: 'Hva er responstiden for support?', a: 'Vi svarer på e-post innen 24 timer på hverdager. Telefonsupport er tilgjengelig mandag til fredag 09:00–17:00.' },
  ] : [
    { q: 'How long does it take to set up Arxon?', a: 'Most customers are up and running within 24–48 hours. We help you with the setup so everything works seamlessly with your business.' },
    { q: 'Can I try the service before committing?', a: 'Yes! We offer a free demo and walkthrough so you can see how Arxon works for your business before you decide.' },
    { q: 'Who owns my data?', a: 'You own all your data. We only process it to deliver the service, and you can export or delete it at any time. See our privacy policy for details.' },
    { q: 'Is there a binding period?', a: 'For consumers, the maximum binding period is 6 months under the Digital Services Act. You can then cancel with one month\'s notice.' },
    { q: 'How does Arxon handle GDPR?', a: 'We are fully GDPR compliant. All data is processed in accordance with the Norwegian Personal Data Act, with data processing agreements for all sub-processors and SCCs for transfers outside the EEA.' },
    { q: 'What happens if the AI gives a wrong answer?', a: 'The AI service is a tool and does not replace professional advice. We continuously work to improve accuracy, and you can adjust settings for your business.' },
    { q: 'Can I change my plan along the way?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect from the next billing period.' },
    { q: 'What is the support response time?', a: 'We respond to emails within 24 hours on business days. Phone support is available Monday to Friday 09:00–17:00.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: bg, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles()}</style>
      <Nav />

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '140px 24px 80px' }}>
        {/* Header */}
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(${goldRgb},0.08)`, border: `1px solid rgba(${goldRgb},0.15)`, borderRadius: 999, padding: '8px 18px', marginBottom: 20 }}>
            <Headphones size={14} style={{ color: gold }} />
            <span style={{ color: gold, fontSize: 13, fontWeight: 500 }}>{no ? 'Kundestøtte' : 'Customer Support'}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#fff', marginBottom: 16 }}>
            {no ? 'Hvordan kan vi hjelpe?' : 'How can we help?'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            {no ? 'Vi er her for å hjelpe deg. Velg den kanalen som passer deg best.' : 'We\'re here to help. Choose the channel that suits you best.'}
          </p>
        </motion.div>

        {/* Contact Channels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 48 }}>
          {channels.map((c, i) => (
            <motion.a key={i} href={c.href} {...fadeUp} transition={{ duration: 0.55, delay: i * 0.08 }}
              style={{ display: 'block', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24, textDecoration: 'none', transition: 'border-color 0.2s' }}>
              <div style={{ color: gold, marginBottom: 14 }}>{c.icon}</div>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{c.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 14 }}>{c.desc}</p>
              <span style={{ color: gold, fontSize: 14, fontWeight: 500 }}>{c.action}</span>
            </motion.a>
          ))}
        </div>

        {/* Business Hours */}
        <motion.div {...fadeUp} style={{ background: `rgba(${goldRgb},0.04)`, border: `1px solid rgba(${goldRgb},0.1)`, borderRadius: 14, padding: '20px 24px', marginBottom: 48, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Clock size={20} style={{ color: gold, flexShrink: 0 }} />
          <div>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>{no ? 'Åpningstider' : 'Business Hours'}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>
              {no ? 'Mandag–Fredag: 09:00–17:00 (CET) • E-post besvares innen 24 timer' : 'Monday–Friday: 09:00–17:00 (CET) • Emails answered within 24 hours'}
            </p>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div {...fadeUp}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <HelpCircle size={20} style={{ color: gold }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#fff', margin: 0 }}>
              {no ? 'Vanlige spørsmål' : 'Frequently Asked Questions'}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((f, i) => <SupportFAQ key={i} q={f.q} a={f.a} />)}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div {...fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 48 }}>
          <a href="/personvern" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 20px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <Shield size={18} style={{ color: gold }} />
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{no ? 'Personvernerklæring' : 'Privacy Policy'}</span>
            <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }} />
          </a>
          <a href="/vilkar" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 20px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, textDecoration: 'none', transition: 'border-color 0.2s' }}>
            <FileText size={18} style={{ color: gold }} />
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{no ? 'Brukervilkår' : 'Terms of Service'}</span>
            <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }} />
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
