'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, Search, Shield, Zap, Clock, Phone,
  Hammer, Scissors, Scale, UtensilsCrossed, Home, HeartPulse,
  ShoppingCart, Calculator, UserSearch, Car, Target, Palette,
  GraduationCap, Monitor, Dumbbell, CalendarDays, Plane, Landmark,
  Megaphone, Truck, Heart, Mic, Cloud, Building2, ShieldCheck, Briefcase,
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { industries } from '@/lib/industries'
import { useLanguage } from '@/lib/language-context'

const gold = '#efc07b'
const goldRgb = '239,192,123'
const bgDark = '#0f1b27'
const cardBg = '#16213e'

const iconMap: Record<string, any> = {
  Hammer, Scissors, Scale, UtensilsCrossed, Home, HeartPulse,
  ShoppingCart, Calculator, UserSearch, Car, Target, Palette,
  GraduationCap, Monitor, Dumbbell, CalendarDays, Plane, Landmark,
  Megaphone, Truck, Heart, Mic, Cloud, Building2, ShieldCheck, Briefcase,
}

// 75+ is the site-wide standard; per-industry .count fields reflect that industry's specific automations
const totalAutomations = 75

export default function BransjerPage() {
  const [search, setSearch] = useState('')
  const { lang } = useLanguage()
  const no = lang === 'no'

  const filtered = industries.filter(ind =>
    ind.title.toLowerCase().includes(search.toLowerCase()) ||
    ind.subtitle.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ background: bgDark, minHeight: '100vh', color: '#f4f1eb' }}>
      <Nav />

      {/* Hero */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `rgba(${goldRgb},0.08)`, border: `1px solid rgba(${goldRgb},0.15)`,
            borderRadius: 24, padding: '6px 16px', fontSize: 13, color: gold,
            marginBottom: 20, fontWeight: 500,
          }}
        >
          <Zap size={14} /> {totalAutomations}+ {no ? 'automatiseringer på tvers av' : 'automations across'} {industries.length} {no ? 'bransjer' : 'industries'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, marginBottom: 16, lineHeight: 1.2 }}
        >
          {no ? 'Finn løsningene som passer' : 'Find solutions that fit'} <span style={{ color: gold }}>{no ? 'din bransje' : 'your industry'}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.6 }}
        >
          {no ? 'Velg din bransje og se nøyaktig hvilke AI-automatiseringer som sparer deg tid og penger — helt gratis.' : 'Select your industry and see exactly which AI automations save you time and money — completely free.'}
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: cardBg, borderRadius: 12, padding: '14px 20px',
            border: `1px solid rgba(${goldRgb},0.15)`, maxWidth: 440, margin: '0 auto',
          }}
        >
          <Search size={18} color={gold} />
          <input
            type="text"
            placeholder={no ? 'Søk etter din bransje...' : 'Search for your industry...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'none', border: 'none', outline: 'none', color: '#f4f1eb',
              fontSize: 15, flex: 1, fontFamily: 'inherit',
            }}
          />
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{
            display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap',
            marginTop: 28, fontSize: 13, color: 'rgba(255,255,255,0.4)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={13} color="rgba(255,255,255,0.35)" /> {no ? 'Gratis kartlegging' : 'Free mapping'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={13} color="rgba(255,255,255,0.35)" /> {no ? 'Ferdig på ca. 14 dager' : 'Done in ~14 days'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Phone size={13} color="rgba(255,255,255,0.35)" /> {no ? 'Norsk support' : 'English support'}
          </span>
        </motion.div>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {filtered.map((ind, i) => {
            const Icon = iconMap[ind.icon] || Briefcase
            return (
              <motion.div
                key={ind.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.5) }}
              >
                <Link href={`/bransjer/${ind.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div
                    className="bransje-card"
                    style={{
                      background: cardBg,
                      borderRadius: 14,
                      padding: '22px 20px',
                      border: `1px solid rgba(${goldRgb},0.12)`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      height: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: `rgba(${goldRgb},0.1)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={22} color={gold} />
                      </div>
                      <span style={{
                        fontSize: 12, color: gold,
                        background: `rgba(${goldRgb},0.08)`, borderRadius: 20,
                        padding: '4px 10px', fontWeight: 500,
                      }}>
                        {ind.count} {no ? 'løsninger' : 'solutions'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f4f1eb', margin: 0 }}>
                      {ind.title}
                    </h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                      {ind.subtitle}
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      color: bgDark, fontSize: 13, fontWeight: 600,
                      background: gold, borderRadius: 8, padding: '8px 16px',
                      marginTop: 4, justifyContent: 'center',
                      transition: 'opacity 0.2s',
                    }}>
                      {no ? 'Se løsninger' : 'View solutions'} <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)' }}>
              {no ? `Ingen bransjer matcher «${search}». Prøv et annet søkeord.` : `No industries match "${search}". Try a different search term.`}
            </p>
          </div>
        )}
      </section>

      {/* Mid-page CTA */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '20px 24px 80px', textAlign: 'center' }}>
        <div style={{
          background: `linear-gradient(135deg, ${cardBg}, rgba(${goldRgb},0.06))`,
          borderRadius: 20, padding: '48px 32px',
          border: `1px solid rgba(${goldRgb},0.12)`,
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
            {no ? 'Finner du ikke din bransje?' : "Can't find your industry?"}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 24, lineHeight: 1.6 }}>
            {no ? 'Vi tilpasser løsningene til din bedrift uansett bransje.\nStart en gratis kartlegging — det tar under 2 minutter.' : 'We customize solutions to your business regardless of industry.\nStart a free mapping — it takes under 2 minutes.'}
          </p>
          <Link href="/kartlegging" className="cta-shimmer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 12, fontWeight: 600,
            fontSize: 15, textDecoration: 'none', color: bgDark,
          }}>
            {no ? 'Start gratis kartlegging' : 'Start free mapping'} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .bransje-card:hover {
          border-color: rgba(${goldRgb}, 0.25) !important;
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}
