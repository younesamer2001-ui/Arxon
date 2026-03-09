'use client'

import { useState } from 'react'
import { gold, goldRgb, fonts } from '@/lib/constants'
import {
  HelpCircle, MessageCircle, Phone, Mail, FileText,
  ChevronDown, ChevronUp, ExternalLink, Clock, CheckCircle,
  BookOpen, Zap, Shield, Users
} from 'lucide-react'

const faqs = [
  {
    q: 'Hvordan fungerer AI-telefonsvarer?',
    a: 'Arxon sin AI-telefonsvarer svarer automatisk på innkommende anrop til bedriften din. Den kan kvalifisere leads, booke møter, og gi informasjon til kundene dine — alt basert på instruksjonene du gir den.'
  },
  {
    q: 'Kan jeg tilpasse hva AI-en sier?',
    a: 'Ja! Du kan tilpasse hilsen, tone, svar på vanlige spørsmål, og når den skal videresende til en ekte person. Gå til Oppsett-siden for å konfigurere dette.'
  },
  {
    q: 'Hva skjer når AI-en ikke kan svare?',
    a: 'Hvis AI-en møter et spørsmål den ikke kan håndtere, kan den enten ta en beskjed, videresende til ditt mobilnummer, eller sende en varsel via e-post/SMS.'
  },
  {
    q: 'Hvordan ser jeg samtalehistorikken?',
    a: 'Gå til Anrop-siden i dashboardet. Der finner du full samtalelogg med transkripsjoner, utfall-tags, og AI-oppsummering av hvert anrop.'
  },
  {
    q: 'Kan jeg integrere med mitt CRM?',
    a: 'Ja, Arxon støtter integrasjon med flere CRM-systemer via n8n-automatisering. Gå til Integrasjoner for å sette opp tilkoblinger.'
  },
  {
    q: 'Hva koster tjenesten?',
    a: 'Se vår prisside på arxon.no for oppdaterte priser. Du kan også se din besparelse i Besparelser-dashboardet.'
  },
]

const guides = [
  { icon: Zap, title: 'Kom i gang', desc: 'Sett opp AI-telefonsvarer på 5 minutter', link: '#' },
  { icon: Phone, title: 'Tilpass telefonsvarer', desc: 'Konfigurer hilsen, svar og videresending', link: '#' },
  { icon: Users, title: 'Lead-håndtering', desc: 'Forstå hvordan leads fanges og kategoriseres', link: '#' },
  { icon: Shield, title: 'Sikkerhet og personvern', desc: 'GDPR-compliance og datahåndtering', link: '#' },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setMessage('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontFamily: fonts.heading, fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
        Hjelp & Support
      </h1>
      <p style={{ color: '#999', marginBottom: 32, fontSize: 15 }}>
        Finn svar, lær mer om Arxon, eller ta kontakt med oss.
      </p>

      {/* Quick help cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: 20, textAlign: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: `rgba(${goldRgb}, 0.12)`, display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
          }}>
            <Mail size={20} color={gold} />
          </div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>E-post</div>
          <div style={{ color: '#999', fontSize: 13 }}>support@arxon.no</div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: 20, textAlign: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'rgba(59,130,246,0.12)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
          }}>
            <Phone size={20} color='#3b82f6' />
          </div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Telefon</div>
          <div style={{ color: '#999', fontSize: 13 }}>+47 22 12 34 56</div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: 20, textAlign: 'center',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'rgba(34,197,94,0.12)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
          }}>
            <Clock size={20} color='#22c55e' />
          </div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Responstid</div>
          <div style={{ color: '#999', fontSize: 13 }}>Innen 2 timer</div>
        </div>
      </div>

      {/* Guides */}
      <h2 style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <BookOpen size={20} color={gold} /> Guider
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 40 }}>
        {guides.map((g, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 14,
            cursor: 'pointer', transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = `rgba(${goldRgb}, 0.3)`)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `rgba(${goldRgb}, 0.1)`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <g.icon size={18} color={gold} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{g.title}</div>
              <div style={{ color: '#999', fontSize: 12 }}>{g.desc}</div>
            </div>
            <ExternalLink size={14} color='#666' style={{ marginLeft: 'auto', flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <HelpCircle size={20} color={gold} /> Vanlige spørsmål
      </h2>
      <div style={{ marginBottom: 40 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, marginBottom: 8, overflow: 'hidden',
            background: openFaq === i ? 'rgba(255,255,255,0.03)' : 'transparent',
          }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                width: '100%', background: 'none', border: 'none', color: 'white',
                padding: '14px 16px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', cursor: 'pointer', fontSize: 14,
                fontWeight: 500, textAlign: 'left',
              }}
            >
              {faq.q}
              {openFaq === i ? <ChevronUp size={16} color='#999' /> : <ChevronDown size={16} color='#999' />}
            </button>
            {openFaq === i && (
              <div style={{ padding: '0 16px 14px', color: '#aaa', fontSize: 13, lineHeight: 1.6 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact form */}
      <h2 style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <MessageCircle size={20} color={gold} /> Send oss en melding
      </h2>
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: 24, marginBottom: 40,
      }}>
        {sent ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#22c55e', fontSize: 15 }}>
            <CheckCircle size={20} />
            Meldingen din er sendt! Vi svarer innen 2 timer.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Beskriv hva du trenger hjelp med..."
              rows={4}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                padding: 12, color: 'white', fontSize: 14, resize: 'vertical',
                fontFamily: fonts.body, outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = gold)}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
            <button
              type="submit"
              disabled={!message.trim()}
              style={{
                marginTop: 12, padding: '10px 24px', background: gold,
                color: '#000', border: 'none', borderRadius: 8,
                fontWeight: 600, fontSize: 14, cursor: message.trim() ? 'pointer' : 'not-allowed',
                opacity: message.trim() ? 1 : 0.5,
              }}
            >
              Send melding
            </button>
          </form>
        )}
      </div>

      {/* Status */}
      <div style={{
        background: `rgba(${goldRgb}, 0.05)`, border: `1px solid rgba(${goldRgb}, 0.15)`,
        borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%', background: '#22c55e',
          boxShadow: '0 0 8px rgba(34,197,94,0.5)',
        }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Alle systemer operative</div>
          <div style={{ color: '#999', fontSize: 12 }}>AI-telefonsvarer, booking og lead-kvalifisering kjører normalt.</div>
        </div>
      </div>
    </div>
  )
}
