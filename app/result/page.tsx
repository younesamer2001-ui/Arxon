'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import {
  CheckCircle2, Sparkles, Clock, TrendingUp, Zap, ArrowRight,
  Star, Loader2, Shield, Phone, BarChart3
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, fadeUp, globalStyles } from '@/lib/constants'

function ResultPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { lang } = useLanguage()
  const sessionId = searchParams.get('session')
  const langParam = (searchParams.get('lang') || 'no') as 'no' | 'en'

  const [recommendation, setRecommendation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }
    const load = async () => {
      const { data } = await supabase
        .from('discovery_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (data?.final_recommendation) {
        try {
          setRecommendation(JSON.parse(data.final_recommendation))
        } catch {
          setRecommendation(data.final_recommendation)
        }
      }
      setLoading(false)
    }
    load()
  }, [sessionId])

  const tx = lang === 'no' ? {
    loading: 'Laster analyse...',
    noResult: 'Ingen analyse funnet. Start en ny kartlegging for \u00e5 f\u00e5 din analyse.',
    startNew: 'Start kartlegging',
    successTitle: 'Analysen din er klar!',
    successDesc: 'Vi har analysert bedriften din og laget en skreddersydd anbefaling.',
    resultTitle: 'Din AI-analyse',
    primarySolution: 'Prim\u00e6r l\u00f8sning',
    impact: 'Forventet effekt',
    timeline: 'Tidsramme',
    investment: 'Estimert investering',
    addons: 'Valgfrie tillegg',
    nextSteps: 'Neste steg',
    tierTitle: 'Anbefalt pakkeniv\u00e5',
    ctaTitle: 'Klar for neste steg?',
    ctaDesc: 'Se alle pakker og priser, eller book en samtale for \u00e5 diskutere analysen din.',
    ctaPriser: 'Se priser og pakker',
    ctaBook: 'Book en samtale',
    guarantee: ['Ingen bindingstid', 'GDPR-sikret', 'Norsk datasenter'],
  } : {
    loading: 'Loading analysis...',
    noResult: 'No analysis found. Start a new assessment to get your analysis.',
    startNew: 'Start assessment',
    successTitle: 'Your analysis is ready!',
    successDesc: 'We\u2019ve analyzed your business and created a tailored recommendation.',
    resultTitle: 'Your AI analysis',
    primarySolution: 'Primary solution',
    impact: 'Expected impact',
    timeline: 'Timeline',
    investment: 'Estimated investment',
    addons: 'Optional add-ons',
    nextSteps: 'Next steps',
    tierTitle: 'Recommended package tier',
    ctaTitle: 'Ready for the next step?',
    ctaDesc: 'See all packages and pricing, or book a call to discuss your analysis.',
    ctaPriser: 'See pricing and packages',
    ctaBook: 'Book a call',
    guarantee: ['No lock-in', 'GDPR compliant', 'Norwegian data center'],
  }

  /* Determine tier from recommendation */
  const tierName = recommendation?.recommended_tier || recommendation?.recommendedTier || null
  const tierMap: Record<string, { color: string; icon: any; no: string; en: string }> = {
    'Starter': { color: '#6ee7b7', icon: Phone, no: 'Starter', en: 'Starter' },
    'Profesjonell': { color: gold, icon: Zap, no: 'Profesjonell', en: 'Professional' },
    'Professional': { color: gold, icon: Zap, no: 'Profesjonell', en: 'Professional' },
    'Vekst': { color: '#a78bfa', icon: TrendingUp, no: 'Vekst', en: 'Growth' },
    'Growth': { color: '#a78bfa', icon: TrendingUp, no: 'Vekst', en: 'Growth' },
  }
  const tier = tierName ? tierMap[tierName] || null : null

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: `${bg}`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{globalStyles()}</style>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={32} color={gold} style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>{tx.loading}</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  if (!recommendation) {
    return (
      <div style={{ minHeight: '100vh', background: `${bg}`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
        <style>{globalStyles()}</style>
        <Nav />
        <section style={{ maxWidth: 600, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
          <Sparkles size={40} color={gold} style={{ marginBottom: 20 }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 12 }}>{tx.noResult}</h1>
          <button onClick={() => router.push('/kartlegging')} className="cta-shimmer" style={{
            color: bg, border: 'none', borderRadius: 12, padding: '14px 32px',
            fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 24,
          }}>
            {tx.startNew} <ArrowRight size={14} style={{ display: 'inline', marginLeft: 6, verticalAlign: 'middle' }} />
          </button>
        </section>
        <Footer />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: `${bg}`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles()}</style>
      <Nav />

      {/* Success banner */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 20px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 30, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', fontSize: 13, color: '#4ade80', marginBottom: 24 }}>
          <CheckCircle2 size={14} />
          {tx.successTitle}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>
          {tx.resultTitle}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
          style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
          {tx.successDesc}
        </motion.p>
      </section>

      {/* Recommended tier badge */}
      {tier && (
        <section style={{ maxWidth: 500, margin: '0 auto', padding: '20px 24px 10px' }}>
          <motion.div {...fadeUp} style={{
            background: `linear-gradient(135deg, rgba(${goldRgb},0.06) 0%, rgba(${goldRgb},0.02) 100%)`,
            border: `1px solid rgba(${goldRgb},0.15)`, borderRadius: 16, padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${goldRgb},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <tier.icon size={22} color={tier.color} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 4 }}>{tx.tierTitle}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: tier.color }}>{lang === 'no' ? tier.no : tier.en}</div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Main recommendation */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '30px 24px' }}>
        {/* Executive summary */}
        {recommendation.executive_summary && (
          <motion.div {...fadeUp} style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 18, padding: '28px 28px', marginBottom: 20,
          }}>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
              {recommendation.executive_summary}
            </p>
          </motion.div>
        )}

        {/* Primary solution */}
        {recommendation.primary_solution && (
          <motion.div {...fadeUp} style={{
            background: `linear-gradient(135deg, rgba(${goldRgb},0.05) 0%, rgba(${goldRgb},0.01) 100%)`,
            border: `1px solid rgba(${goldRgb},0.12)`, borderRadius: 18, padding: '28px 28px', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Zap size={20} color={gold} />
              <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{tx.primarySolution}</h2>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: gold, marginBottom: 8 }}>{recommendation.primary_solution.name}</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 8 }}>{recommendation.primary_solution.description}</p>
            {recommendation.primary_solution.how_it_works && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{recommendation.primary_solution.how_it_works}</p>
            )}
          </motion.div>
        )}

        {/* Expected impact */}
        {recommendation.expected_impact && recommendation.expected_impact.length > 0 && (
          <motion.div {...fadeUp} style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 18, padding: '28px 28px', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <TrendingUp size={20} color="#4ade80" />
              <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{tx.impact}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recommendation.expected_impact.map((impact: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircle2 size={16} color="#4ade80" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{impact}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Timeline & Investment */}
        {(recommendation.timeline || recommendation.investment) && (
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {recommendation.timeline && (
              <motion.div {...fadeUp} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: '22px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Clock size={16} color="rgba(255,255,255,0.4)" />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' as const }}>{tx.timeline}</span>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#f0f0f0' }}>{recommendation.timeline}</p>
              </motion.div>
            )}
            {recommendation.investment && (
              <motion.div {...fadeUp} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: '22px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <BarChart3 size={16} color="rgba(255,255,255,0.4)" />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' as const }}>{tx.investment}</span>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: gold }}>{recommendation.investment}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Add-ons */}
        {recommendation.add_ons && recommendation.add_ons.length > 0 && (
          <motion.div {...fadeUp} style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 18, padding: '28px 28px', marginBottom: 20,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>{tx.addons}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recommendation.add_ons.map((addon: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <ArrowRight size={14} color={gold} style={{ flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <span style={{ fontWeight: 600, color: '#f0f0f0', fontSize: 14 }}>{addon.name}</span>
                    {addon.description && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}> \u2014 {addon.description}</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next steps from AI */}
        {recommendation.next_steps && (
          <motion.div {...fadeUp} style={{
            background: `linear-gradient(135deg, rgba(${goldRgb},0.06) 0%, rgba(${goldRgb},0.01) 100%)`,
            border: `1px solid rgba(${goldRgb},0.12)`, borderRadius: 18, padding: '28px 28px', marginBottom: 20,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: gold, marginBottom: 10 }}>{tx.nextSteps}</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{recommendation.next_steps}</p>
          </motion.div>
        )}

        {/* Priority score */}
        {recommendation.priority_score && (
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {Array.from({ length: Math.min(recommendation.priority_score, 10) }).map((_, i) => (
                <Star key={i} size={16} color="#facc15" fill="#facc15" />
              ))}
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>{recommendation.priority_score}/10</span>
            </div>
          </motion.div>
        )}
      </section>

      {/* CTA section */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '20px 24px 70px', textAlign: 'center' }}>
        <motion.div {...fadeUp} style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20, padding: '40px 32px',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 28px)', fontWeight: 700, marginBottom: 10 }}>
            {tx.ctaTitle}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, marginBottom: 28, maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.6 }}>
            {tx.ctaDesc}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/pakkebygger')} className="cta-shimmer" style={{
              color: bg, border: 'none', borderRadius: 12, padding: '14px 32px',
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>
              {tx.ctaPriser} <ArrowRight size={14} style={{ display: 'inline', marginLeft: 6, verticalAlign: 'middle' }} />
            </button>
            <button onClick={() => router.push('/kartlegging')} style={{
              background: `rgba(${goldRgb},0.08)`, border: `1px solid rgba(${goldRgb},0.2)`,
              color: gold, borderRadius: 12, padding: '14px 32px',
              fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}>
              {tx.ctaBook}
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 24 }}>
            {tx.guarantee.map((item, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Shield size={12} color={gold} /> {item}</span>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color="#c9a96e" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  )
}
