'use client'
import { useLanguage } from '@/lib/language-context'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, TrendingUp, Bot, Shield, BarChart3, CheckCircle2, ChevronDown,
  Sparkles, Phone, Clock, FileText, Lock, Users, Zap, Database, Bell, Settings,
  Pen, Globe, Mail, Search, Eye
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, fadeUp, globalStyles } from '@/lib/constants'

export default function MarkedsforingPage() {
  const { lang } = useLanguage()
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const router = useRouter()

  const setupSteps = lang === 'no' ? [
    {
      title: 'Merkevare og tonekartlegging',
      desc: 'Vi analyserer merkevaren din, tone of voice, målgruppe og innholdsstrategi.',
      detail: 'AI-en lærer å skrive som deg — med riktig tone, bransjekunnskap og budskap.',
    },
    {
      title: 'Innholdskalender-oppsett',
      desc: 'Vi setter opp en automatisert innholdskalender for LinkedIn, Instagram og blogg.',
      detail: 'AI-en genererer innholdsforslag basert på bransjetrender, sesong og din forretningsstrategi.',
    },
    {
      title: 'SEO-pipeline',
      desc: 'Automatisk keyword-research, innholdsproduksjon og publisering optimalisert for søkemotorer.',
      detail: 'AI-en finner søkeord med høy trafikk og lav konkurranse, skriver SEO-optimaliserte artikler og publiserer dem.',
    },
    {
      title: 'Sosiale medier-automatisering',
      desc: 'Google-anmeldelser konverteres til sosiale medier-poster, og innhold publiseres automatisk.',
      detail: 'Positive anmeldelser blir til anbefalinger på LinkedIn og Instagram. Innhold tilpasses format for hver plattform.',
    },
    {
      title: 'Merkeovervåkning og analyse',
      desc: 'AI overvåker omtaler av merkevaren din og konkurrenter på nett.',
      detail: 'Du får varsler om nye omtaler, sentiment-analyse og konkurranseanalyse i sanntid.',
    },
  ] : [
    {
      title: 'Brand & Tone Mapping',
      desc: 'We analyze your brand, voice, audience and content strategy.',
      detail: 'The AI learns to write like you — with the right tone, industry knowledge and messaging.',
    },
    {
      title: 'Content Calendar Setup',
      desc: 'We set up an automated content calendar for LinkedIn, Instagram and blog.',
      detail: 'The AI generates content suggestions based on industry trends, seasonality and your business strategy.',
    },
    {
      title: 'SEO Pipeline',
      desc: 'Automatic keyword research, content production and publishing optimized for search engines.',
      detail: 'The AI finds high-traffic, low-competition keywords, writes SEO-optimized articles and publishes them.',
    },
    {
      title: 'Social Media Automation',
      desc: 'Google reviews converted to social media posts, and content published automatically.',
      detail: 'Positive reviews become recommendations on LinkedIn and Instagram. Content adapted for each platform.',
    },
    {
      title: 'Brand Monitoring & Analytics',
      desc: 'AI monitors mentions of your brand and competitors online.',
      detail: 'You get real-time alerts about new mentions, sentiment analysis and competitive intelligence.',
    },
  ]

  const howItWorks = lang === 'no' ? [
    { num: '1', title: 'AI analyserer bransjetrender', desc: 'Skanner nyheter, konkurrenter og søketrender' },
    { num: '2', title: 'Innholdsforslag genereres', desc: 'Emner og vinkler tilpasset din strategi' },
    { num: '3', title: 'AI skriver utkast', desc: 'Bloggpost, LinkedIn-innlegg eller sosiale medier-post' },
    { num: '4', title: 'Innhold tilpasses per plattform', desc: 'Format, lengde og tone optimaliseres' },
    { num: '5', title: 'Automatisk publisering', desc: 'Innhold publiseres til riktig tid for maks rekkevidde' },
    { num: '6', title: 'Analyse og optimalisering', desc: 'Engasjement og trafikk måles for kontinuerlig forbedring' },
  ] : [
    { num: '1', title: 'AI analyzes industry trends', desc: 'Scans news, competitors and search trends' },
    { num: '2', title: 'Content suggestions generated', desc: 'Topics and angles tailored to your strategy' },
    { num: '3', title: 'AI writes draft', desc: 'Blog post, LinkedIn post or social media content' },
    { num: '4', title: 'Content adapted per platform', desc: 'Format, length and tone optimized' },
    { num: '5', title: 'Automatic publishing', desc: 'Content published at the right time for max reach' },
    { num: '6', title: 'Analysis & optimization', desc: 'Engagement and traffic measured for continuous improvement' },
  ]

  const automations = lang === 'no' ? [
    'AI SEO-blogginnhold',
    'AI LinkedIn-postgenerator',
    'Instagram innholdsgenerering',
    'Google Reviews → sosiale medier',
    'Merkeovervåkning',
    'Keyword-research automation',
    'Innholdskalender-AI',
    'Automatisk publisering',
    'Hashtag-optimalisering',
    'Konkurrentanalyse',
    'E-post nyhetsbrev-AI',
    'Landing page-generering',
    'A/B-testing av innhold',
    'Bildegenerering med AI',
    'Engasjementsanalyse',
    'Trendspotting',
    'Innholdsrepurposing',
    'ROI-rapportering',
  ] : [
    'AI SEO Blog Content',
    'AI LinkedIn Post Generator',
    'Instagram Content Generation',
    'Google Reviews → Social Media',
    'Brand Monitoring',
    'Keyword Research Automation',
    'AI Content Calendar',
    'Automatic Publishing',
    'Hashtag Optimization',
    'Competitor Analysis',
    'Email Newsletter AI',
    'Landing Page Generation',
    'A/B Testing Content',
    'AI Image Generation',
    'Engagement Analytics',
    'Trend Spotting',
    'Content Repurposing',
    'ROI Reporting',
  ]

  const faqs = lang === 'no' ? [
    {
      q: 'Blir innholdet unikt?',
      a: 'Ja, AI-en genererer originalt innhold basert på din merkevare og bransje. Alt er plagiatfritt og tilpasset din tone.',
    },
    {
      q: 'Kan jeg redigere innhold før publisering?',
      a: 'Absolutt. Du kan velge full autopilot eller sette opp godkjenning for alt innhold.',
    },
    {
      q: 'Hvilke plattformer støttes?',
      a: 'LinkedIn, Instagram, Facebook, blogg (WordPress/Webflow), og e-post nyhetsbrev. Flere plattformer kan legges til.',
    },
    {
      q: 'Hvordan håndteres Google-anmeldelser?',
      a: 'Positive anmeldelser konverteres automatisk til sosiale medier-poster med kundens tillatelse og riktig formatering.',
    },
    {
      q: 'Hva med bilder og grafikk?',
      a: 'AI genererer tilpassede bilder og grafikk for hvert innlegg, basert på merkevaren din.',
    },
  ] : [
    {
      q: 'Is the content unique?',
      a: 'Yes, the AI generates original content based on your brand and industry. Everything is plagiarism-free and tailored to your tone.',
    },
    {
      q: 'Can I edit content before publishing?',
      a: 'Absolutely. You can choose full autopilot or set up approval for all content.',
    },
    {
      q: 'Which platforms are supported?',
      a: 'LinkedIn, Instagram, Facebook, blog (WordPress/Webflow), and email newsletters. More platforms can be added.',
    },
    {
      q: 'How are Google reviews handled?',
      a: 'Positive reviews are automatically converted to social media posts with customer permission and proper formatting.',
    },
    {
      q: 'What about images and graphics?',
      a: 'AI generates custom images and graphics for each post, based on your brand.',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: `${bg}`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles()}</style>
      <Nav />

      {/* Hero */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 40px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 30, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.15)`, fontSize: 13, color: gold, marginBottom: 24 }}>
          <TrendingUp size={14} />
          {lang === 'no' ? 'Markedsføring & Innhold' : 'Marketing & Content'}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
          {lang === 'no' ? (<>AI-generert <span style={{ color: gold }}>innhold</span> på autopilot</>) : (<>AI-generated <span style={{ color: gold }}>content</span> on autopilot</>)}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
          style={{ fontSize: 'clamp(15px, 2.2vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 680, margin: '0 auto', lineHeight: 1.6 }}>
          {lang === 'no'
            ? 'LinkedIn-poster, blogginnhold, SEO-pipeline, Google-anmeldelser til sosiale medier og merkeovervåkning. 18 automatiseringer som bygger merkevaren din mens du fokuserer på kjernevirksomheten.'
            : 'LinkedIn posts, blog content, SEO pipeline, Google reviews to social media and brand monitoring. 18 automations that build your brand while you focus on your core business.'}
        </motion.p>
      </section>

      {/* Setup Steps */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px 60px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>
          {lang === 'no' ? 'Slik setter vi det opp' : 'How we set it up'}
        </motion.h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {setupSteps.map((step, i) => (
            <motion.div key={i} {...fadeUp}>
              <button
                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', background: expandedStep === i ? `rgba(${goldRgb},0.08)` : 'rgba(255,255,255,0.02)',
                  border: expandedStep === i ? `1px solid rgba(${goldRgb},0.2)` : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: '20px 24px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s'
                }}>
                <div>
                  <div style={{ fontSize: 12, color: `rgba(${goldRgb},0.6)`, fontWeight: 700, marginBottom: 6 }}>STEG {String(i + 1).padStart(2, '0')}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '6px 0 0', lineHeight: 1.5 }}>{step.desc}</p>
                </div>
                <ChevronDown size={20} color={gold} style={{ marginLeft: 16, flexShrink: 0, transform: expandedStep === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              <AnimatePresence>
                {expandedStep === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      overflow: 'hidden', background: `rgba(${goldRgb},0.04)`, borderRadius: '0 0 14px 14px',
                      borderLeft: `1px solid rgba(${goldRgb},0.2)`, borderRight: `1px solid rgba(${goldRgb},0.2)`,
                      borderBottom: `1px solid rgba(${goldRgb},0.2)`, borderTop: 'none'
                    }}>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0, padding: '16px 24px' }}>
                      {step.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How AI Creates Content */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>
          {lang === 'no' ? 'Hvordan AI lager innhold' : 'How AI creates content'}
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {howItWorks.map((item, i) => (
            <motion.div key={i} {...fadeUp} style={{
              padding: '28px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, textAlign: 'center'
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: `rgba(${goldRgb},0.1)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                fontSize: 20, fontWeight: 700, color: gold
              }}>
                {item.num}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 18 Automations */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>
          {lang === 'no' ? '18 innebygde automatiseringer' : '18 built-in automations'}
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {automations.map((auto, i) => (
            <motion.div key={i} {...fadeUp} style={{
              padding: '16px 18px', background: `rgba(${goldRgb},0.04)`, border: `1px solid rgba(${goldRgb},0.1)`,
              borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10
            }}>
              <CheckCircle2 size={18} color={gold} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>{auto}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '60px 24px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>
          {lang === 'no' ? 'Ofte stilte spørsmål' : 'Frequently asked questions'}
        </motion.h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} {...fadeUp}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', background: expandedFaq === i ? `rgba(${goldRgb},0.08)` : 'rgba(255,255,255,0.02)',
                  border: expandedFaq === i ? `1px solid rgba(${goldRgb},0.2)` : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: '16px 20px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s'
                }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#f0f0f0' }}>{faq.q}</h3>
                <ChevronDown size={18} color={gold} style={{ marginLeft: 12, flexShrink: 0, transform: expandedFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              <AnimatePresence>
                {expandedFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      overflow: 'hidden', background: `rgba(${goldRgb},0.04)`, borderRadius: '0 0 12px 12px',
                      borderLeft: `1px solid rgba(${goldRgb},0.2)`, borderRight: `1px solid rgba(${goldRgb},0.2)`,
                      borderBottom: `1px solid rgba(${goldRgb},0.2)`, borderTop: 'none'
                    }}>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0, padding: '14px 20px' }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '60px 24px 80px', textAlign: 'center' }}>
        <motion.div {...fadeUp} style={{
          background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.15)`, borderRadius: 18, padding: '40px 28px',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 3.5vw, 28px)', fontWeight: 700, marginBottom: 14, fontStyle: 'italic' }}>
            {lang === 'no' ? 'Klar for innhold på autopilot?' : 'Ready for content on autopilot?'}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 24 }}>
            {lang === 'no'
              ? 'La oss analysere merkevaren din og sette opp dine første 18 automatiseringer.'
              : 'Let us analyze your brand and set up your first 18 automations.'}
          </p>
          <button onClick={() => router.push('/kartlegging')} style={{
            background: gold, color: bg, border: 'none', borderRadius: 14, padding: '16px 36px',
            fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            {lang === 'no' ? 'Start gratis kartlegging' : 'Start free assessment'}
            <ArrowRight size={15} style={{ display: 'inline', marginLeft: 8, verticalAlign: 'middle' }} />
          </button>
        </motion.div>
      </section>

      <Footer minimal />
    </div>
  )
}
