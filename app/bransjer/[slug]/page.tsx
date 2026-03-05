'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, ArrowLeft, CheckCircle2, Clock, Zap, AlertTriangle,
  ChevronDown, ArrowUpDown, SortAsc, Star, Phone,
  Hammer, Scissors, Scale, UtensilsCrossed, Home, HeartPulse,
  ShoppingCart, Calculator, UserSearch, Car, Target, Palette,
  GraduationCap, Monitor, Dumbbell, CalendarDays, Plane, Landmark,
  Megaphone, Truck, Heart, Mic, Cloud, Building2, ShieldCheck, Briefcase,
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { getIndustryBySlug, Automation } from '@/lib/industries'
import { useLanguage } from '@/lib/language-context'

const gold = '#efc07b'
const goldRgb = '239,192,123'
const bgDark = '#050510'
const cardBg = 'rgba(255,255,255,0.03)'

const iconMap: Record<string, any> = {
  Hammer, Scissors, Scale, UtensilsCrossed, Home, HeartPulse,
  ShoppingCart, Calculator, UserSearch, Car, Target, Palette,
  GraduationCap, Monitor, Dumbbell, CalendarDays, Plane, Landmark,
  Megaphone, Truck, Heart, Mic, Cloud, Building2, ShieldCheck, Briefcase,
}

const complexityColor: Record<string, string> = {
  'Lav': '#4ade80',
  'Middels': '#fbbf24',
  'Høy': '#f87171',
}

const complexityIcon: Record<string, any> = {
  'Lav': Zap,
  'Middels': Clock,
  'Høy': AlertTriangle,
}

const complexityOrder: Record<string, number> = { 'Høy': 3, 'Middels': 2, 'Lav': 1 }

type SortMode = 'complexity' | 'alpha'

function sortAutomations(items: Automation[], mode: SortMode): Automation[] {
  return [...items].sort((a, b) => {
    if (mode === 'complexity') {
      const diff = (complexityOrder[b.complexity] || 0) - (complexityOrder[a.complexity] || 0)
      if (diff !== 0) return diff
      return a.name.localeCompare(b.name, 'nb')
    }
    return a.name.localeCompare(b.name, 'nb')
  })
}

function AutoCard({ auto, index, defaultOpen }: { auto: Automation; index: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen || false)
  const CIcon = complexityIcon[auto.complexity] || Zap
  const cColor = complexityColor[auto.complexity] || '#fbbf24'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.5) }}
      style={{
        background: cardBg,
        borderRadius: 14,
        border: `1px solid rgba(${goldRgb},${open ? '0.2' : '0.08'})`,
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: open ? `0 4px 24px rgba(0,0,0,0.25)` : 'none',
        overflow: 'hidden',
      }}
      className="auto-card"
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, color: '#f4f1eb', fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <CheckCircle2 size={16} color={gold} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {auto.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {auto.complexity && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, color: cColor, fontWeight: 500,
              background: `${cColor}15`, borderRadius: 20, padding: '3px 10px',
              whiteSpace: 'nowrap',
            }}>
              <CIcon size={12} /> {auto.complexity}
            </span>
          )}
          <ChevronDown
            size={16} color="rgba(255,255,255,0.4)"
            style={{ transition: 'transform 0.3s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      <div style={{ maxHeight: open ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
        <div style={{ padding: '0 20px 16px', borderTop: `1px solid rgba(${goldRgb},0.06)` }}>
          {auto.desc && (
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '12px 0 0', lineHeight: 1.6 }}>
              {auto.desc}
            </p>
          )}
          {auto.benefit && (
            <p style={{
              fontSize: 13, color: `rgba(${goldRgb},0.85)`, margin: '10px 0 0',
              lineHeight: 1.5, fontStyle: 'italic',
              padding: '10px 14px', borderRadius: 10,
              background: `rgba(${goldRgb},0.06)`,
            }}>
              {auto.benefit}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function IndustryPage() {
  const params = useParams()
  const slug = params.slug as string
  const industry = getIndustryBySlug(slug)
  const { lang } = useLanguage()
  const no = lang === 'no'
  const [sortMode, setSortMode] = useState<SortMode>('complexity')
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!industry) {
    return (
      <div style={{ background: bgDark, minHeight: '100vh', color: '#f4f1eb' }}>
        <Nav />
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, marginBottom: 16 }}>{no ? 'Bransje ikke funnet' : 'Industry not found'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>{no ? 'Vi fant ikke denne bransjen.' : 'We could not find this industry.'}</p>
          <Link href="/bransjer" style={{ color: gold, textDecoration: 'underline' }}>{no ? 'Tilbake til bransjer' : 'Back to industries'}</Link>
        </div>
      </div>
    )
  }

  const Icon = iconMap[industry.icon] || Briefcase
  const sorted = sortAutomations(industry.automations, sortMode)

  // Quick wins = 3 easiest automations (Lav complexity)
  const quickWins = industry.automations
    .filter(a => a.complexity === 'Lav')
    .slice(0, 3)

  // If less than 3 Lav, fill with Middels
  if (quickWins.length < 3) {
    const middels = industry.automations.filter(a => a.complexity === 'Middels')
    quickWins.push(...middels.slice(0, 3 - quickWins.length))
  }

  return (
    <div style={{ background: bgDark, minHeight: '100vh', color: '#f4f1eb' }}>
      <Nav />

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>
        <Link href="/bransjer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = gold}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          <ArrowLeft size={14} /> {no ? 'Alle bransjer' : 'All industries'}
        </Link>
      </div>

      {/* Hero */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 20px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{
            width: 64, height: 64, borderRadius: 16,
            background: `rgba(${goldRgb},0.1)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Icon size={32} color={gold} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(26px, 5vw, 38px)', fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}
        >
          {industry.count} AI-løsninger for <span style={{ color: gold }}>{industry.title}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 20 }}
        >
          {industry.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        >
          <Link href="/kartlegging" className="cta-shimmer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 12, fontWeight: 600,
            fontSize: 14, textDecoration: 'none', color: bgDark,
          }}>
            {no ? 'Gratis kartlegging for' : 'Free mapping for'} {industry.title.toLowerCase()} <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 8px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
            }}>
              <Star size={16} color={gold} />
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                {no ? 'Raskeste gevinster' : 'Quick wins'}
              </h2>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                {no ? '— Enklest å komme i gang med' : '— Easiest to get started'}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 12,
            }}>
              {quickWins.map((auto, i) => (
                <div key={auto.name} style={{
                  background: `rgba(${goldRgb},0.04)`,
                  border: `1px solid rgba(${goldRgb},0.12)`,
                  borderRadius: 14, padding: '18px 16px',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={14} color="#4ade80" />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{auto.name}</span>
                  </div>
                  {auto.desc && (
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
                      {auto.desc}
                    </p>
                  )}
                  {auto.benefit && (
                    <p style={{
                      fontSize: 12, color: `rgba(${goldRgb},0.75)`, margin: 0,
                      lineHeight: 1.4, fontStyle: 'italic',
                    }}>
                      {auto.benefit}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Divider */}
      <div style={{ maxWidth: 900, margin: '32px auto 0', padding: '0 24px' }}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
      </div>

      {/* Sort + Legend */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12, marginBottom: 14,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
            {no ? 'Alle' : 'All'} {industry.count} {no ? 'automatiseringer' : 'automations'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setSortMode('complexity')}
              style={{
                background: sortMode === 'complexity' ? `rgba(${goldRgb},0.15)` : `rgba(255,255,255,0.04)`,
                border: `1px solid ${sortMode === 'complexity' ? `rgba(${goldRgb},0.3)` : 'rgba(255,255,255,0.08)'}`,
                color: sortMode === 'complexity' ? gold : 'rgba(255,255,255,0.55)',
                borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 0.2s',
              }}
            >
              <ArrowUpDown size={12} /> {no ? 'Kompleksitet' : 'Complexity'}
            </button>
            <button
              onClick={() => setSortMode('alpha')}
              style={{
                background: sortMode === 'alpha' ? `rgba(${goldRgb},0.15)` : `rgba(255,255,255,0.04)`,
                border: `1px solid ${sortMode === 'alpha' ? `rgba(${goldRgb},0.3)` : 'rgba(255,255,255,0.08)'}`,
                color: sortMode === 'alpha' ? gold : 'rgba(255,255,255,0.55)',
                borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 0.2s',
              }}
            >
              <SortAsc size={12} /> {no ? 'A → Å' : 'A → Z'}
            </button>
          </div>
        </div>

        {/* Complexity legend */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10, padding: '10px 16px',
          display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{no ? 'Kompleksitet:' : 'Complexity:'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
            <Zap size={11} color="#4ade80" />
            <span style={{ color: '#4ade80', fontWeight: 500 }}>{no ? 'Lav' : 'Low'}</span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>— {no ? 'Noen timer' : 'A few hours'}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
            <Clock size={11} color="#fbbf24" />
            <span style={{ color: '#fbbf24', fontWeight: 500 }}>{no ? 'Middels' : 'Medium'}</span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>— {no ? '1–5 dager' : '1-5 days'}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
            <AlertTriangle size={11} color="#f87171" />
            <span style={{ color: '#f87171', fontWeight: 500 }}>{no ? 'Høy' : 'High'}</span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>— {no ? '3–7 dager' : '3-7 days'}</span>
          </span>
        </div>
      </section>

      {/* Automations list */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map((auto, i) => (
            <AutoCard key={auto.name + i} auto={auto} index={i} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <div style={{
          background: `linear-gradient(135deg, ${cardBg}, rgba(${goldRgb},0.06))`,
          borderRadius: 20, padding: '48px 32px',
          border: `1px solid rgba(${goldRgb},0.12)`,
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
            {no ? 'Klar for å automatisere?' : 'Ready to automate?'}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 24, lineHeight: 1.6 }}>
            {no ? `Få en gratis kartlegging og se nøyaktig hvilke av disse ${industry.count} løsningene\nsom gir mest verdi for din bedrift — det tar under 2 minutter.` : `Get a free mapping and see exactly which of these ${industry.count} solutions\ngive the most value for your business — it takes under 2 minutes.`}
          </p>
          <Link href="/kartlegging" className="cta-shimmer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 12, fontWeight: 600,
            fontSize: 15, textDecoration: 'none', color: bgDark,
          }}>
            {no ? 'Start gratis kartlegging' : 'Start free mapping'} <ArrowRight size={16} />
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 14 }}>
            {no ? 'Ingen forpliktelser · Svar innen 24 timer' : 'No commitment · Response within 24 hours'}
          </p>
        </div>
      </section>

      {/* Sticky bottom CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: `linear-gradient(to top, ${bgDark} 70%, transparent)`,
        padding: '24px 24px 20px',
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16,
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: showSticky ? 1 : 0,
        transform: showSticky ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: showSticky ? 'auto' : 'none',
        zIndex: 50,
      }}>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Phone size={14} color={gold} />
          {no ? 'Gratis kartlegging' : 'Free mapping'}
        </span>
        <Link href="/kartlegging" className="cta-shimmer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '10px 24px', borderRadius: 10, fontWeight: 600,
          fontSize: 14, textDecoration: 'none', color: bgDark,
        }}>
          {no ? 'Start nå' : 'Start now'} <ArrowRight size={14} />
        </Link>
      </div>

      <Footer />

      <style jsx global>{`
        .auto-card:hover {
          border-color: rgba(${goldRgb}, 0.2) !important;
        }
      `}</style>
    </div>
  )
}
