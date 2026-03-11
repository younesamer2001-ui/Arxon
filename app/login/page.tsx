'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, signUp, signInWithGoogle } from '@/lib/auth'
import { gold, goldRgb, bg, fonts } from '@/lib/constants'
import { Mail, Lock, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react'

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
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

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      const { error: authError } = await signInWithGoogle()
      if (authError) throw authError
      // Redirect happens via Supabase OAuth — browser navigates to Google
    } catch (err: any) {
      setError(err.message || 'Google-innlogging feilet')
      setGoogleLoading(false)
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
        .google-btn:hover { background: rgba(255,255,255,0.12) !important; }
        .google-btn:active { transform: scale(0.98); }
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

          {/* Google sign-in button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="google-btn"
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: '#f0f0f0',
              fontSize: 15,
              fontWeight: 500,
              fontFamily: fonts.body,
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transition: 'all 0.2s',
              opacity: googleLoading ? 0.6 : 1,
            }}
          >
            {googleLoading ? (
              'Kobler til Google...'
            ) : (
              <>
                <GoogleIcon size={20} />
                {isSignUp ? 'Registrer med Google' : 'Logg inn med Google'}
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            margin: '20px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              eller
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

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
