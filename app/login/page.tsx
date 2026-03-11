'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signIn, signUp, signInWithGoogle, signInWithMicrosoft, sendMagicLink } from '@/lib/auth'
import { gold, goldRgb, bg, fonts } from '@/lib/constants'
import { 
  Mail, Lock, ArrowRight, Eye, EyeOff, Shield, CheckCircle, 
  Users, Zap, Sparkles, Building2, ArrowLeft, Loader2, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Icons
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function MicrosoftIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21">
      <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
      <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
      <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
    </svg>
  )
}

// Stats component
function LiveStats() {
  const [stats, setStats] = useState({ customers: 127, hours: 2847, automations: 340 })
  
  useEffect(() => {
    // Simulate live counter
    const interval = setInterval(() => {
      setStats(prev => ({
        customers: prev.customers,
        hours: prev.hours + Math.floor(Math.random() * 3),
        automations: prev.automations
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-8 mt-8">
      <div>
        <div className="text-3xl font-bold text-white">{stats.customers}+</div>
        <div className="text-sm text-white/50">Norske bedrifter</div>
      </div>
      <div>
        <div className="text-3xl font-bold text-white">{stats.hours.toLocaleString()}</div>
        <div className="text-sm text-white/50">Timer spart</div>
      </div>
      <div>
        <div className="text-3xl font-bold text-white">{stats.automations}+</div>
        <div className="text-sm text-white/50">Automatiseringer</div>
      </div>
    </div>
  )
}

// Testimonial carousel
const testimonials = [
  {
    quote: "Arxon har spart oss 15 timer i uken på manuell fakturering",
    author: "Thomas Berg",
    company: "Byggmester AS",
    role: "Daglig leder"
  },
  {
    quote: "Vi mistet aldri et leads igjen etter vi fikk AI-telefonsvarer",
    author: "Lena Solberg",
    company: "Eiendomsmegler 1",
    role: "Selger"
  },
  {
    quote: "ROI på under 2 uker. Dette er fremtiden for små bedrifter",
    author: "Marius Olsen",
    company: "Rørlegger & Sønn",
    role: "Eier"
  }
]

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 max-w-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-white/80 text-lg italic mb-4">"{testimonials[current].quote}"</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold">
              {testimonials[current].author[0]}
            </div>
            <div>
              <div className="text-white font-medium">{testimonials[current].author}</div>
              <div className="text-white/50 text-sm">{testimonials[current].role}, {testimonials[current].company}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  
  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [microsoftLoading, setMicrosoftLoading] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'password' | 'magic'>('password')

  // Check for magic link token
  useEffect(() => {
    const token = searchParams.get('magic_token')
    if (token) {
      handleMagicToken(token)
    }
  }, [])

  async function handleMagicToken(token: string) {
    setLoading(true)
    try {
      const { error } = await signIn('magic', token)
      if (error) throw error
      router.push(redirectTo)
    } catch (err: any) {
      setError('Innloggingslenken er utløpt eller ugyldig')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isSignUp) {
        if (password.length < 6) {
          setError('Passord må være minst 6 tegn')
          setLoading(false)
          return
        }
        const { error: authError } = await signUp(email, password)
        if (authError) throw authError
        // Auto sign in after signup
        const { error: signInError } = await signIn(email, password)
        if (signInError) throw signInError
        
        // Track signup
        await fetch('/api/track', {
          method: 'POST',
          body: JSON.stringify({ event: 'signup', email })
        })
      } else {
        const { error: authError } = await signIn(email, password)
        if (authError) {
          if (authError.message.includes('Invalid login')) {
            throw new Error('Feil e-post eller passord')
          }
          throw authError
        }
      }
      router.push(redirectTo)
    } catch (err: any) {
      setError(err.message || 'Noe gikk galt')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setError('Vennligst skriv inn e-post')
      return
    }
    setMagicLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await sendMagicLink(email)
      if (error) throw error
      setSuccess(`Innloggingslenke sendt til ${email}`)
      // Track
      await fetch('/api/track', {
        method: 'POST',
        body: JSON.stringify({ event: 'magic_link_sent', email })
      })
    } catch (err: any) {
      setError(err.message || 'Kunne ikke sende lenke')
    } finally {
      setMagicLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      const { error } = await signInWithGoogle(redirectTo)
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Google-innlogging feilet')
      setGoogleLoading(false)
    }
  }

  const handleMicrosoft = async () => {
    setMicrosoftLoading(true)
    setError('')
    try {
      const { error } = await signInWithMicrosoft(redirectTo)
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Microsoft-innlogging feilet')
      setMicrosoftLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        ::selection { background: rgba(239,192,123,0.3); }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>

      {/* Left side - Value Proposition */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">Arxon</span>
          </Link>

          {/* Main headline */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Automatiser det som
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              {" "}bremser bedriften din
            </span>
          </h1>

          <p className="text-xl text-white/60 mb-8 max-w-lg">
            Logg inn for å se dine AI-automatiseringer, spore besparelser, og administrere kundekontakter.
          </p>

          {/* Live stats */}
          <LiveStats />

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white/70">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white/70">ISO 27001</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/70">120+ bedrifter</span>
            </div>
          </div>

          {/* Testimonial */}
          <TestimonialCarousel />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">Arxon</span>
          </div>

          <div className="bg-[#111827]/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            {/* Back button */}
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbake til forsiden
            </Link>

            <h2 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? 'Opprett konto' : 'Logg inn'}
            </h2>
            <p className="text-white/50 text-sm mb-6">
              {isSignUp 
                ? 'Start din 14-dagers gratis prøveperiode' 
                : 'Velkommen tilbake! Fortsett der du slapp.'}
            </p>

            {/* Error/Success messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
                >
                  <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SSO Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleMicrosoft}
                disabled={microsoftLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                {microsoftLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MicrosoftIcon size={20} />
                )}
                {microsoftLoading ? 'Kobler til...' : 'Fortsett med Microsoft'}
              </button>

              <button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <GoogleIcon size={20} />
                )}
                {googleLoading ? 'Kobler til...' : 'Fortsett med Google'}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs uppercase tracking-wider">eller med e-post</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6">
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'password' 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Passord
              </button>
              <button
                onClick={() => setActiveTab('magic')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'magic' 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-1" />
                Magic Link
              </button>
            </div>

            {/* Form */}
            {activeTab === 'password' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="din@bedrift.no"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-500/50 transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={isSignUp ? 'Lag et passord (minst 6 tegn)' : 'Ditt passord'}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {!isSignUp && (
                  <div className="flex justify-end">
                    <Link 
                      href="/auth/reset-password" 
                      className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      Glemt passord?
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'Opprett konto' : 'Logg inn'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="din@bedrift.no"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-500/50 transition-colors"
                  />
                </div>

                <button
                  onClick={handleMagicLink}
                  disabled={magicLoading || !email}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {magicLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Send innloggingslenke
                    </>
                  )}
                </button>

                <p className="text-sm text-white/40 text-center">
                  Vi sender deg en e-post med en sikker innloggingslenke. 
                  Ingen passord nødvendig!
                </p>
              </div>
            )}

            {/* Toggle sign up/in */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-white/50">
                {isSignUp ? 'Har du allerede en konto?' : 'Har du ikke en konto?'}{' '}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess('') }}
                  className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
                >
                  {isSignUp ? 'Logg inn' : 'Opprett konto'}
                </button>
              </p>
            </div>

            {/* Help link */}
            <div className="mt-4 text-center">
              <Link 
                href="/kundeservice" 
                className="text-sm text-white/30 hover:text-white/50 transition-colors"
              >
                Trenger du hjelp? Kontakt oss
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/30">
            <Link href="/personvern" className="hover:text-white/50 transition-colors">Personvern</Link>
            <Link href="/vilkar" className="hover:text-white/50 transition-colors">Vilkår</Link>
            <Link href="/kundeservice" className="hover:text-white/50 transition-colors">Hjelp</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
