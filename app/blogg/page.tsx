'use client'
import { useLanguage } from '@/lib/language-context'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, ArrowUpRight, BookOpen } from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, fadeUp, globalStyles } from '@/lib/constants'

const articles = [
  {
    slug: 'ubesvarte-anrop-koster',
    title: 'Hvor mye koster ubesvarte anrop norske bedrifter?',
    titleEn: 'How much do missed calls cost Norwegian businesses?',
    excerpt: 'Norske SMB-er taper potensielt hundretusenvis av kroner årlig på telefoner som ingen svarer. Vi ser på tallene.',
    excerptEn: 'Norwegian SMEs potentially lose hundreds of thousands of NOK annually on unanswered phones. We look at the numbers.',
    date: '2026-02-21',
    readTime: '5 min',
    tag: 'Innsikt',
    tagEn: 'Insight',
  },
  {
    slug: 'ai-norge-2025',
    title: 'Norge leder AI-revolusjonen i Europa — hva betyr det for din bedrift?',
    titleEn: 'Norway leads the AI revolution in Europe — what does it mean for your business?',
    excerpt: 'Med 46% AI-adopsjon er Norge nummer 1 i Europa. Slik kan du utnytte denne trenden for å få et konkurransefortrinn.',
    excerptEn: 'With 46% AI adoption, Norway is #1 in Europe. Here\'s how you can leverage this trend for a competitive edge.',
    date: '2026-02-21',
    readTime: '6 min',
    tag: 'Trender',
    tagEn: 'Trends',
  },
  {
    slug: 'gdpr-ai-telefon',
    title: 'GDPR og AI-telefonsvar: Alt du trenger å vite',
    titleEn: 'GDPR and AI phone answering: Everything you need to know',
    excerpt: 'Kan du bruke AI til å svare telefonen og samtidig følge GDPR? Ja — her er hvordan vi gjør det trygt og lovlig.',
    excerptEn: 'Can you use AI to answer phones while following GDPR? Yes — here\'s how we do it safely and legally.',
    date: '2026-02-21',
    readTime: '7 min',
    tag: 'Juridisk',
    tagEn: 'Legal',
  },
]

export default function BlogPage() {
  const { lang } = useLanguage()

  return (
    <div style={{ minHeight: '100vh', background: `${bg}`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles()}</style>
      <Nav />

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 40px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 30, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.15)`, fontSize: 13, color: gold, marginBottom: 24 }}>
          <BookOpen size={14} />
          {lang === 'no' ? 'Arxon Blogg' : 'Arxon Blog'}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5vw, 46px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
          {lang === 'no' ? (<>Innsikt om <span style={{ color: gold }}>AI og norsk næringsliv</span></>) : (<>Insights on <span style={{ color: gold }}>AI and Norwegian business</span></>)}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
          style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
          {lang === 'no' ? 'Praktiske artikler om AI-automatisering, tapt omsetning og digitalisering for norske bedrifter.' : 'Practical articles on AI automation, lost revenue and digitalization for Norwegian businesses.'}
        </motion.p>
      </section>

      <section style={{ maxWidth: 750, margin: '0 auto', padding: '0 24px 80px' }}>
        {articles.map((article, i) => (
          <Link key={i} href={`/blogg/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <motion.article {...fadeUp}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 18, padding: '32px 28px', marginBottom: 16, cursor: 'pointer',
                transition: 'all 0.3s', position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${goldRgb},0.2)`; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: gold, background: `rgba(${goldRgb},0.08)`, padding: '3px 10px', borderRadius: 6, fontWeight: 600 }}>
                  {lang === 'no' ? article.tag : article.tagEn}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} />{article.readTime}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                  {new Date(article.date).toLocaleDateString(lang === 'no' ? 'nb-NO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 600, fontFamily: "'Playfair Display', serif", marginBottom: 8, lineHeight: 1.3 }}>
                {lang === 'no' ? article.title : article.titleEn}
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 12 }}>
                {lang === 'no' ? article.excerpt : article.excerptEn}
              </p>
              <span style={{ fontSize: 13, color: gold, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                {lang === 'no' ? 'Les artikkelen' : 'Read article'} <ArrowUpRight size={14} />
              </span>
            </motion.article>
          </Link>
        ))}
      </section>

      <Footer minimal />
    </div>
  )
}
