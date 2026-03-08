'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Phone, Mail, Loader2 } from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'

const gold = '#efc07b'
const goldRgb = '239,192,123'
const bgDark = '#050510'

export default function BekreftelseOrdrePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: bgDark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={48} color={gold} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    }>
      <BekreftelseOrdre />
    </Suspense>
  )
}

function BekreftelseOrdre() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    // If we have a session_id, the checkout was successful
    if (sessionId) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }, [sessionId])

  return (
    <>
      <Nav />
      <div style={{
        minHeight: '100vh',
        background: bgDark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 20px 80px',
      }}>
        {status === 'loading' && (
          <div style={{ textAlign: 'center' }}>
            <Loader2 size={48} color={gold} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 16 }}>Bekrefter bestillingen din...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{
            maxWidth: 560,
            textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '48px 32px',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: `rgba(${goldRgb},0.1)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <CheckCircle2 size={36} color={gold} />
            </div>

            <h1 style={{
              fontSize: 28, fontWeight: 700, color: '#fff',
              marginBottom: 12,
            }}>
              Takk for bestillingen!
            </h1>

            <p style={{
              fontSize: 16, color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6, marginBottom: 32,
            }}>
              Vi har mottatt din bestilling og starter implementeringen umiddelbart.
              Du vil motta en bekreftelse på e-post innen kort tid.
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: '20px 24px',
              marginBottom: 32,
              textAlign: 'left',
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: gold, marginBottom: 12 }}>
                Hva skjer nå?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { step: '1', text: 'Du mottar en bekreftelse på e-post' },
                  { step: '2', text: 'Vårt team tar kontakt for å starte oppsettet' },
                  { step: '3', text: 'Implementering ferdig innen 2-5 virkedager' },
                  { step: '4', text: 'Automatiseringene dine er live!' },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: `rgba(${goldRgb},0.15)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: gold, flexShrink: 0,
                    }}>
                      {item.step}
                    </div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 24px', borderRadius: 10,
                background: gold, color: bgDark,
                fontWeight: 600, fontSize: 14, textDecoration: 'none',
              }}>
                Tilbake til forsiden <ArrowRight size={14} />
              </Link>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                marginTop: 8,
              }}>
                <a href="tel:+4778896386" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none',
                }}>
                  <Phone size={13} /> +47 788 96 386
                </a>
                <a href="mailto:kontakt@arxon.no" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none',
                }}>
                  <Mail size={13} /> kontakt@arxon.no
                </a>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
              Noe gikk galt
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
              Vi kunne ikke bekrefte bestillingen din. Prøv igjen eller ta kontakt med oss.
            </p>
            <Link href="/pakkebygger" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 24px', borderRadius: 10,
              background: gold, color: bgDark,
              fontWeight: 600, fontSize: 14, textDecoration: 'none',
            }}>
              Tilbake til pakkebygger <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
      <Footer />

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
