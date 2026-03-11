'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { gold, goldRgb, fonts } from '@/lib/constants'
import { useAuth } from '@/lib/auth-context'
import { getCustomer, getCustomerAutomations, submitIntakeForm } from '@/lib/dashboard'
import {
  FileText, ArrowLeft, ArrowRight, Building2, Globe, Users,
  MessageSquare, Loader2, CheckCircle2, AlertTriangle, Link2,
  Send
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Form field definitions                                             */
/* ------------------------------------------------------------------ */

interface FormField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'multi-select'
  placeholder?: string
  options?: { value: string; label: string }[]
  required?: boolean
  description?: string
}

const formFields: FormField[] = [
  {
    key: 'business_description',
    label: 'Beskriv bedriften din',
    type: 'textarea',
    placeholder: 'Hva gjør bedriften din? Hvilke produkter/tjenester tilbyr dere?',
    required: true,
    description: 'Gi oss en kort beskrivelse så vi kan tilpasse automatiseringene.',
  },
  {
    key: 'industry',
    label: 'Bransje',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Velg bransje...' },
      { value: 'eiendom', label: 'Eiendom & eiendomsmegling' },
      { value: 'bilforhandler', label: 'Bilforhandler / verksted' },
      { value: 'restaurant', label: 'Restaurant / café' },
      { value: 'hotell', label: 'Hotell / overnatting' },
      { value: 'salong', label: 'Frisør / salong / spa' },
      { value: 'helse', label: 'Helse & velvære' },
      { value: 'bygg', label: 'Bygg & anlegg' },
      { value: 'regnskap', label: 'Regnskap / revisjon' },
      { value: 'it', label: 'IT & teknologi' },
      { value: 'konsulent', label: 'Konsulentvirksomhet' },
      { value: 'ehandel', label: 'E-handel / nettbutikk' },
      { value: 'annet', label: 'Annet' },
    ],
  },
  {
    key: 'team_size',
    label: 'Antall ansatte',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Velg...' },
      { value: '1', label: 'Bare meg (1 person)' },
      { value: '2-5', label: '2–5 ansatte' },
      { value: '6-20', label: '6–20 ansatte' },
      { value: '21-50', label: '21–50 ansatte' },
      { value: '50+', label: 'Over 50 ansatte' },
    ],
  },
  {
    key: 'current_tools',
    label: 'Hvilke verktøy bruker dere i dag?',
    type: 'textarea',
    placeholder: 'F.eks. Tripletex, Fiken, Google Kalender, Outlook, Excel...',
    description: 'List opp de viktigste systemene dere bruker til daglig.',
  },
  {
    key: 'pain_points',
    label: 'Hva er de største utfordringene i dag?',
    type: 'textarea',
    placeholder: 'F.eks. For mye manuelt arbeid, glemmer å følge opp kunder, dobbeltbooking...',
    required: true,
    description: 'Hjelp oss å forstå hva som tar mest tid og energi.',
  },
  {
    key: 'goals',
    label: 'Hva ønsker du å oppnå med automatisering?',
    type: 'textarea',
    placeholder: 'F.eks. Spare tid på fakturering, aldri gå glipp av et lead, bedre kundeoppfølging...',
    description: 'Beskriv drømmesituasjonen din.',
  },
  {
    key: 'website',
    label: 'Nettside (valgfritt)',
    type: 'text',
    placeholder: 'https://www.dinbedrift.no',
  },
  {
    key: 'phone_preference',
    label: 'Foretrukket kontaktmåte',
    type: 'select',
    options: [
      { value: '', label: 'Velg...' },
      { value: 'email', label: 'E-post' },
      { value: 'phone', label: 'Telefon' },
      { value: 'both', label: 'Begge' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Integration options                                                */
/* ------------------------------------------------------------------ */

const integrationOptions = [
  { key: 'tripletex', name: 'Tripletex', category: 'Regnskap' },
  { key: 'fiken', name: 'Fiken', category: 'Regnskap' },
  { key: 'vipps', name: 'Vipps', category: 'Betaling' },
  { key: 'google_calendar', name: 'Google Kalender', category: 'Kalender' },
  { key: 'outlook', name: 'Outlook', category: 'Kalender' },
  { key: 'hubspot', name: 'HubSpot', category: 'CRM' },
  { key: 'mailchimp', name: 'Mailchimp', category: 'E-post' },
  { key: 'sendgrid', name: 'SendGrid', category: 'E-post' },
  { key: 'twilio', name: 'Twilio', category: 'SMS' },
  { key: 'slack', name: 'Slack', category: 'Kommunikasjon' },
  { key: 'facebook', name: 'Facebook', category: 'Sosiale medier' },
  { key: 'instagram', name: 'Instagram', category: 'Sosiale medier' },
  { key: 'google_business', name: 'Google Business', category: 'Anmeldelser' },
  { key: 'booking_com', name: 'Booking.com', category: 'Booking' },
  { key: 'airbnb', name: 'Airbnb', category: 'Booking' },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function KartleggingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [customer, setCustomer] = useState<any>(null)
  const [automations, setAutomations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSection, setCurrentSection] = useState(0)

  // Form state
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const cust = await getCustomer()
        if (!cust) { setLoading(false); return }
        setCustomer(cust)
        const autoRes = await getCustomerAutomations(cust.id)
        setAutomations(autoRes.data || [])
      } catch (err) {
        console.error('Failed to load customer data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const updateAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const toggleIntegration = (key: string) => {
    setSelectedIntegrations(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const isFormValid = () => {
    return formFields
      .filter(f => f.required)
      .every(f => answers[f.key]?.trim())
  }

  const handleSubmit = async () => {
    if (!isFormValid()) return

    setSubmitting(true)
    setError(null)

    try {
      const result = await submitIntakeForm(answers, selectedIntegrations, notes || undefined)

      if (result.error) {
        setError(result.error)
        setSubmitting(false)
        return
      }

      setSubmitted(true)
      // Redirect back to onboarding after 2s
      setTimeout(() => router.push('/dashboard/onboarding'), 2000)
    } catch (err: any) {
      setError(err.message || 'Noe gikk galt. Prøv igjen.')
      setSubmitting(false)
    }
  }

  // Sections for multi-step feel
  const sections = [
    { title: 'Om bedriften', fields: formFields.slice(0, 3), icon: Building2 },
    { title: 'Verktøy & utfordringer', fields: formFields.slice(3, 6), icon: Users },
    { title: 'Detaljer', fields: formFields.slice(6), icon: Globe },
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={32} style={{ color: gold, animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={{
        fontFamily: fonts.body, color: '#e2e8f0',
        display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 500 }}>
          <CheckCircle2 size={56} style={{ color: '#10b981', marginBottom: 20 }} />
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            Takk for informasjonen!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6 }}>
            Vi har mottatt kartleggingsskjemaet ditt og begynner å sette opp automatiseringene.
            Du blir sendt tilbake til oppsett-oversikten nå.
          </p>
          <Loader2 size={20} style={{ color: gold, animation: 'spin 1s linear infinite', marginTop: 20 }} />
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div style={{ fontFamily: fonts.body, color: '#e2e8f0', textAlign: 'center', padding: '60px 20px' }}>
        <AlertTriangle size={48} style={{ color: '#64748b', marginBottom: 16 }} />
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Ingen kundedata funnet</h2>
        <p style={{ color: '#94a3b8', fontSize: 15 }}>
          Kontakt oss på <a href="mailto:kontakt@arxon.no" style={{ color: gold }}>kontakt@arxon.no</a> hvis du trenger hjelp.
        </p>
      </div>
    )
  }

  const section = sections[currentSection]
  const SectionIcon = section.icon

  return (
    <div style={{ fontFamily: fonts.body, color: '#e2e8f0', maxWidth: 720, margin: '0 auto' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .kartlegging-input {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 12px 16px; color: #e2e8f0; font-size: 15px;
          font-family: ${fonts.body}; outline: none; transition: all 0.2s;
        }
        .kartlegging-input:focus { border-color: ${gold}; box-shadow: 0 0 0 2px rgba(${goldRgb},0.15); }
        .kartlegging-input::placeholder { color: #64748b; }
        textarea.kartlegging-input { min-height: 100px; resize: vertical; }
        select.kartlegging-input { appearance: none; cursor: pointer; }
        .int-chip {
          padding: 8px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03); cursor: pointer; display: flex;
          align-items: center; gap: 8px; font-size: 14px; color: #94a3b8; transition: all 0.2s;
        }
        .int-chip:hover { border-color: rgba(${goldRgb},0.3); color: #e2e8f0; }
        .int-chip.selected { border-color: ${gold}; background: rgba(${goldRgb},0.1); color: ${gold}; }
        .btn-gold {
          background: ${gold}; color: #080c14; border: none; padding: 12px 28px;
          border-radius: 10px; font-weight: 600; cursor: pointer; display: flex;
          align-items: center; gap: 8px; font-size: 15px; transition: all 0.3s;
        }
        .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(${goldRgb},0.3); }
        .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-outline {
          background: transparent; color: #94a3b8; border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 24px; border-radius: 10px; font-weight: 500; cursor: pointer;
          display: flex; align-items: center; gap: 8px; font-size: 15px; transition: all 0.2s;
        }
        .btn-outline:hover { border-color: rgba(255,255,255,0.2); color: #e2e8f0; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <a
          href="/dashboard/onboarding"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: '#94a3b8', fontSize: 14, textDecoration: 'none', marginBottom: 16,
          }}
        >
          <ArrowLeft size={16} />
          Tilbake til oppsett
        </a>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '16px 0 0' }}>
          <FileText size={28} style={{ display: 'inline', marginRight: 10, color: gold }} />
          Kartleggingsskjema
        </h1>
        <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 15, margin: '8px 0 0' }}>
          Fortell oss om bedriften din så vi kan tilpasse automatiseringene perfekt.
        </p>
      </div>

      {/* Purchased automations summary */}
      {automations.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 28,
        }}>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>
            Automatiseringer som skal settes opp:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {automations.map((a: any) => (
              <div key={a.id} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: `rgba(${goldRgb},0.08)`, color: gold,
                border: `1px solid rgba(${goldRgb},0.2)`,
              }}>
                {a.automation_name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress steps */}
      <div style={{ display: 'flex', gap: 0, alignItems: 'center', marginBottom: 32 }}>
        {sections.map((s, i) => (
          <div key={s.title} style={{ display: 'flex', alignItems: 'center', flex: i < sections.length - 1 ? 1 : 0 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                background: i < currentSection ? gold : i === currentSection ? `rgba(${goldRgb},0.2)` : 'rgba(255,255,255,0.06)',
                color: i < currentSection ? '#080c14' : i === currentSection ? gold : '#64748b',
                border: i === currentSection ? `2px solid ${gold}` : 'none',
                cursor: i <= currentSection ? 'pointer' : 'default',
                transition: 'all 0.3s',
              }}
              onClick={() => { if (i <= currentSection) setCurrentSection(i) }}
            >
              {i < currentSection ? <CheckCircle2 size={16} /> : <s.icon size={16} />}
            </div>
            {i < sections.length - 1 && (
              <div style={{
                height: 2, flex: 1, minWidth: 12,
                background: i < currentSection ? gold : 'rgba(255,255,255,0.08)',
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
        {sections.map((s, i) => (
          <div key={s.title} style={{
            fontSize: 12, color: i <= currentSection ? gold : '#64748b',
            textAlign: 'center', flex: 1,
          }}>
            {s.title}
          </div>
        ))}
      </div>

      {/* Section content */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 32,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
          paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: `rgba(${goldRgb},0.1)`, color: gold,
          }}>
            <SectionIcon size={20} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{section.title}</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              Steg {currentSection + 1} av {sections.length}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {section.fields.map(field => (
            <div key={field.key}>
              <label style={{
                display: 'block', fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6,
              }}>
                {field.label}
                {field.required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
              </label>
              {field.description && (
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
                  {field.description}
                </div>
              )}

              {field.type === 'text' && (
                <input
                  type="text"
                  className="kartlegging-input"
                  value={answers[field.key] || ''}
                  onChange={e => updateAnswer(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  className="kartlegging-input"
                  value={answers[field.key] || ''}
                  onChange={e => updateAnswer(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}

              {field.type === 'select' && (
                <select
                  className="kartlegging-input"
                  value={answers[field.key] || ''}
                  onChange={e => updateAnswer(field.key, e.target.value)}
                >
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        {/* Integration selector on the last section */}
        {currentSection === sections.length - 1 && (
          <div style={{ marginTop: 32 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
              <Link2 size={16} style={{ display: 'inline', marginRight: 8 }} />
              Hvilke integrasjoner bruker du? (valgfritt)
            </label>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
              Velg tjenestene du allerede bruker, så kobler vi dem til automatiseringene dine.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {integrationOptions.map(int => (
                <div
                  key={int.key}
                  className={`int-chip ${selectedIntegrations.includes(int.key) ? 'selected' : ''}`}
                  onClick={() => toggleIntegration(int.key)}
                >
                  {selectedIntegrations.includes(int.key) ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <div style={{
                      width: 14, height: 14, borderRadius: 4,
                      border: '1.5px solid rgba(255,255,255,0.2)',
                    }} />
                  )}
                  {int.name}
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={{ marginTop: 24 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
                <MessageSquare size={16} style={{ display: 'inline', marginRight: 8 }} />
                Ekstra notater (valgfritt)
              </label>
              <textarea
                className="kartlegging-input"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Er det noe annet vi bør vite?"
                style={{ minHeight: 80 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          marginTop: 16, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontSize: 14,
        }}>
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 24,
        paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          className="btn-outline"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          style={{ visibility: currentSection > 0 ? 'visible' : 'hidden' }}
        >
          <ArrowLeft size={16} />
          Forrige
        </button>

        {currentSection < sections.length - 1 ? (
          <button
            className="btn-gold"
            onClick={() => setCurrentSection(currentSection + 1)}
          >
            Neste
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            className="btn-gold"
            onClick={handleSubmit}
            disabled={submitting || !isFormValid()}
          >
            {submitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Sender...
              </>
            ) : (
              <>
                <Send size={16} />
                Send inn kartlegging
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
