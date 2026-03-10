'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, signUp } from '@/lib/auth'
import { gold, goldRgb, bg, fonts } from '@/lib/constants'
import { Mail, Lock, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        if (password.length < 6) {
          setError('Passord må være minst 6 tegn')
          setLoading(false)
          return
        }
        const { error: authError } = await signUp(email, password)
        if (authError) throw authError
        // After signup, sign in immediately
        const { error: signInError } = await signIn(email, password)
        if (signInError) throw signInError
      } else {
        const { error: authError } = await signIn(email, password)
        if (authError) {
          if (authError.message.includes('Invalid login')) {
            throw new Error('Feil e-post eller passord')
          }
          throw authError
        }
      }
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Noe gikk galt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: fonts.body,
      padding: '24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        ::selection { background: rgba(${goldRgb},0.3); }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px ${bg} inset !important;
          -webkit-text-fill-color: #f0f0f0 !important;
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: 420 }}>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 14,
          marginBottom: 32, transition: 'color 0.2s',
        }}>
          <ArrowLeft size={16} />
          Tilbake til forsiden
        </Link>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '40px 32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Image src="/arxon-icon.png" alt="Arxon" width={32} height={32} />
            <span style={{ color: '#f0f0f0', fontSize: 18, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Arxon
            </span>
          </div>

          <h1 style={{ color: '#f0f0f0', fontSize: 24, fontWeight: 700, margin: '24px 0 8px' }}>
            {isSignUp ? 'Opprett konto' : 'Logg inn'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28 }}>
            {isSignUp
              ? 'Lag en konto for å se dashboardet ditt'
              : 'Logg inn for å se dashboardet ditt'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.25)',
              }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="din@epost.no"
                required
                style={{
                  width: '100%', padding: '14px 16px 14px 44px',
                  borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)', color: '#f0f0f0',
                  fontSize: 15, outline: 'none', fontFamily: fonts.body,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.25)',
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Passord"
                required
                minLength={6}
                style={{
                  width: '100%', padding: '14px 48px 14px 44px',
                  borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)', color: '#f0f0f0',
                  fontSize: 15, outline: 'none', fontFamily: fonts.body,
                  boxSizing: 'border-box',
                }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: 'rgba(255,255,255,0.3)',
              }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>
            )}

            <button type="submit" disabled={loading || !email || !password} style={{
              padding: '14px',
              borderRadius: 10,
              border: 'none',
              background: loading ? 'rgba(239,192,123,0.5)' : `linear-gradient(135deg, ${gold}, #d4a85a)`,
              color: bg,
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: fonts.body,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}>
              {loading ? 'Vennligst vent...' : (isSignUp ? 'Opprett konto' : 'Logg inn')}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div style={{
            marginTop: 24, paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              {isSignUp ? 'Har du allerede en konto?' : 'Har du ikke en konto?'}{' '}
              <button onClick={() => { setIsSignUp(!isSignUp); setError('') }} style={{
                background: 'none', border: 'none', color: gold,
                cursor: 'pointer', fontWeight: 600, fontSize: 14,
                fontFamily: fonts.body,
              }}>
                {isSignUp ? 'Logg inn' : 'Opprett konto'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
