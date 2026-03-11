'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { AlertTriangle, CreditCard, Loader2, CheckCircle2, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const gold = '#efc07b'
const goldRgb = '239,192,123'

const TEST_PACKAGES = [
  {
    id: 'mini',
    name: 'Mini-test',
    automations: [
      { name: 'Fakturering', key: 'fakturering', setupPrice: 100, monthlyPrice: 50, complexity: 'basic', industry: 'Generell' },
    ],
    setupTotal: 100,
    monthlyTotal: 50,
  },
  {
    id: 'standard',
    name: 'Standard-test',
    automations: [
      { name: 'Fakturering', key: 'fakturering', setupPrice: 100, monthlyPrice: 50, complexity: 'basic', industry: 'Generell' },
      { name: 'Booking', key: 'booking', setupPrice: 200, monthlyPrice: 100, complexity: 'medium', industry: 'Generell' },
    ],
    setupTotal: 300,
    monthlyTotal: 150,
  },
  {
    id: 'full',
    name: 'Full-test',
    automations: [
      { name: 'Fakturering', key: 'fakturering', setupPrice: 100, monthlyPrice: 50, complexity: 'basic', industry: 'Generell' },
      { name: 'Booking', key: 'booking', setupPrice: 200, monthlyPrice: 100, complexity: 'medium', industry: 'Generell' },
      { name: 'Kundeoppfølging', key: 'kundeoppfølging', setupPrice: 150, monthlyPrice: 75, complexity: 'medium', industry: 'Generell' },
      { name: 'Leadgenerering', key: 'leadgenerering', setupPrice: 250, monthlyPrice: 125, complexity: 'advanced', industry: 'Generell' },
    ],
    setupTotal: 700,
    monthlyTotal: 350,
  },
]

export default function TestStripePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isAdmin = user?.email === 'kontakt@arxon.no'

  async function triggerCheckout(pkg: typeof TEST_PACKAGES[0]) {
    setLoading(pkg.id)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          automations: pkg.automations,
          billingMode: 'monthly',
          setupTotal: pkg.setupTotal,
          monthlyTotal: pkg.monthlyTotal,
          discountRate: 0,
          customerEmail: user?.email || 'test@arxon.no',
          customerName: 'Test Bruker',
          companyName: 'Test Bedrift AS',
          industry: 'Generell',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Checkout feilet')
      }

      if (data.url) {
        setSuccess(`Redirecter til Stripe Checkout...`)
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.message || 'Noe gikk galt')
    } finally {
      setLoading(null)
    }
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
        <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ color: '#fff', marginBottom: 8 }}>Kun for admin</h2>
        <p>Denne testsiden er kun tilgjengelig for admin-kontoen.</p>
        <Link href="/dashboard" style={{ color: gold, marginTop: 16, display: 'inline-block' }}>
          ← Tilbake til dashboard
        </Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link
          href="/dashboard"
          style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}
        >
          <ArrowLeft size={14} /> Tilbake til dashboard
        </Link>
        <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          <CreditCard size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: gold }} />
          Stripe Test Modus
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>
          Test hele kjøpsflyten: Checkout → Webhook → Supabase → Onboarding.
          Bruk Stripe testkort <code style={{ background: 'rgba(239,192,123,0.1)', color: gold, padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>4242 4242 4242 4242</code> med vilkårlig utløpsdato og CVC.
        </p>
      </div>

      {/* Warning banner */}
      <div style={{
        background: 'rgba(234,179,8,0.08)',
        border: '1px solid rgba(234,179,8,0.2)',
        borderRadius: 12,
        padding: '16px 20px',
        marginBottom: 32,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
        <AlertTriangle size={20} color="#eab308" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: '#eab308', lineHeight: 1.6 }}>
          <strong>Viktig:</strong> Sørg for at <code style={{ background: 'rgba(234,179,8,0.15)', padding: '1px 4px', borderRadius: 3 }}>STRIPE_SECRET_KEY</code> i Vercel er en <strong>test-nøkkel</strong> (starter med <code style={{ background: 'rgba(234,179,8,0.15)', padding: '1px 4px', borderRadius: 3 }}>sk_test_</code>).
          Webhook-endepunktet i Stripe Dashboard må peke til <code style={{ background: 'rgba(234,179,8,0.15)', padding: '1px 4px', borderRadius: 3 }}>https://arxon.no/api/stripe/webhook</code>.
        </div>
      </div>

      {/* Test cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TEST_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: 24,
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{pkg.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>
                  {pkg.automations.length} automatisering{pkg.automations.length > 1 ? 'er' : ''}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: gold, fontSize: 18, fontWeight: 700 }}>{pkg.setupTotal} kr</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>oppsett + {pkg.monthlyTotal} kr/mnd</div>
              </div>
            </div>

            {/* Automations list */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {pkg.automations.map((a) => (
                <span
                  key={a.key}
                  style={{
                    background: `rgba(${goldRgb}, 0.08)`,
                    color: gold,
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {a.name}
                </span>
              ))}
            </div>

            <button
              onClick={() => triggerCheckout(pkg)}
              disabled={loading !== null}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: loading === pkg.id ? 'rgba(239,192,123,0.2)' : `rgba(${goldRgb}, 0.1)`,
                color: gold,
                border: `1px solid rgba(${goldRgb}, 0.3)`,
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s',
                opacity: loading !== null && loading !== pkg.id ? 0.4 : 1,
              }}
            >
              {loading === pkg.id ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Oppretter checkout...
                </>
              ) : (
                <>
                  <ExternalLink size={16} />
                  Start test-kjøp
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Error / Success messages */}
      {error && (
        <div style={{
          marginTop: 20,
          padding: '14px 18px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 10,
          color: '#ef4444',
          fontSize: 14,
        }}>
          <strong>Feil:</strong> {error}
        </div>
      )}

      {success && (
        <div style={{
          marginTop: 20,
          padding: '14px 18px',
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 10,
          color: '#22c55e',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      {/* Checklist */}
      <div style={{
        marginTop: 40,
        padding: 24,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
      }}>
        <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Sjekkliste for testing</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Stripe test-nøkkel (sk_test_...) i Vercel env', key: 'key' },
            { label: 'Stripe webhook registrert → arxon.no/api/stripe/webhook', key: 'wh' },
            { label: 'STRIPE_WEBHOOK_SECRET satt i Vercel', key: 'whsec' },
            { label: 'WEBHOOK_SECRET satt i Vercel (for n8n)', key: 'n8nsec' },
            { label: 'N8N_BASE_URL = https://saiai.app.n8n.cloud', key: 'n8n' },
            { label: 'Kjørt phase1-migration.sql i Supabase', key: 'sql' },
          ].map((item) => (
            <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: gold, width: 16, height: 16 }} />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      {/* Stripe test cards reference */}
      <div style={{
        marginTop: 20,
        padding: 24,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
      }}>
        <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Stripe testkort</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { card: '4242 4242 4242 4242', desc: 'Vellykket betaling' },
            { card: '4000 0000 0000 3220', desc: '3D Secure autentisering' },
            { card: '4000 0000 0000 9995', desc: 'Avvist (utilstrekkelige midler)' },
            { card: '4000 0000 0000 0341', desc: 'Avvist (generell feil)' },
          ].map((t) => (
            <div key={t.card} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}>
              <code style={{ color: gold, fontSize: 13, fontFamily: 'monospace' }}>{t.card}</code>
              <span style={{ color: '#64748b', fontSize: 12 }}>{t.desc}</span>
            </div>
          ))}
          <p style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
            Bruk vilkårlig utløpsdato (i fremtiden), CVC og postnummer.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
