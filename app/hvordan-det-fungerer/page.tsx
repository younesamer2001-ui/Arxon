'use client'
import { useLanguage } from '@/lib/language-context'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowRight, Phone, Bot, Shield, Mic, Brain,
  Volume2, Calendar, MessageSquare, Database, Zap, CheckCircle2,
  Clock, Lock, Server, Sparkles
} from 'lucide-react'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { gold, goldRgb, bg, fadeUp, globalStyles } from '@/lib/constants'

export default function HowItWorksPage() {
  const { lang } = useLanguage()
  const router = useRouter()

  const pipelineSteps = lang === 'no' ? [
    { icon: Phone, title: 'Anropet kommer inn', desc: 'Kunden ringer bedriften din. Etter et bestemt antall ring (eller umiddelbart) kobles anropet til Arxon sin AI.', detail: 'Fungerer med ditt eksisterende telefonnummer — ingen bytte nødvendig.' },
    { icon: Mic, title: 'Tale til tekst (STT)', desc: 'AI-en lytter til hva kunden sier og konverterer tale til tekst i sanntid — med over 96% nøyaktighet.', detail: 'Støtter norsk, engelsk og flere språk. Håndterer dialekter og bakgrunnsstøy.' },
    { icon: Brain, title: 'AI forstår og tenker', desc: 'En avansert språkmodell (LLM) analyserer kundens forespørsel, sjekker din bedriftsinformasjon, og formulerer et relevant svar.', detail: 'AI-en kjenner dine tjenester, priser, åpningstider og vanlige spørsmål.' },
    { icon: Volume2, title: 'Tekst til tale (TTS)', desc: 'Svaret konverteres til naturlig norsk tale. Kunden hører et menneskelig, profesjonelt svar — ikke en robot.', detail: 'Stemmen kan tilpasses din bedriftsprofil. Naturlig intonasjon og pauser.' },
    { icon: Calendar, title: 'Handling utføres', desc: 'AI-en kan booke en time, sende en SMS-bekreftelse, registrere en henvendelse, eller sette over til riktig person.', detail: 'Kobles til din kalender, bookingsystem og CRM automatisk.' },
    { icon: Database, title: 'Alt logges og rapporteres', desc: 'Samtalen transkriberes og lagres. Du får full oversikt over alle henvendelser, tidspunkter og utfall i et dashboard.', detail: 'GDPR-kompatibel lagring. Data kryptert innen EØS. Eksporter når som helst.' },
  ] : [
    { icon: Phone, title: 'Call comes in', desc: 'Customer calls your business. After a set number of rings (or immediately), the call connects to Arxon AI.', detail: 'Works with your existing phone number — no switching needed.' },
    { icon: Mic, title: 'Speech to Text (STT)', desc: 'AI listens to what the customer says and converts speech to text in real-time — with over 96% accuracy.', detail: 'Supports Norwegian, English and more. Handles dialects and background noise.' },
    { icon: Brain, title: 'AI understands and thinks', desc: 'An advanced language model (LLM) analyzes the request, checks your business info, and formulates a relevant response.', detail: 'AI knows your services, prices, hours and common questions.' },
    { icon: Volume2, title: 'Text to Speech (TTS)', desc: 'The response is converted to natural Norwegian speech. Customer hears a human, professional answer — not a robot.', detail: 'Voice can be customized to your brand. Natural intonation and pauses.' },
    { icon: Calendar, title: 'Action is taken', desc: 'AI can book an appointment, send SMS confirmation, log an inquiry, or transfer to the right person.', detail: 'Connects to your calendar, booking system and CRM automatically.' },
    { icon: Database, title: 'Everything is logged', desc: 'The call is transcribed and stored. You get full overview of all inquiries, times and outcomes in a dashboard.', detail: 'GDPR-compliant storage. Data encrypted within EEA. Export anytime.' },
  ]

  const techSpecs = lang === 'no' ? [
    { icon: Zap, title: 'Svartid under 2 sekunder', desc: 'Fra kundens spørsmål til AI-ens svar — raskere enn de fleste mennesker.' },
    { icon: Shield, title: 'GDPR og EU AI Act-klar', desc: 'All data lagres kryptert innen EØS. Vi følger Datatilsynets retningslinjer.' },
    { icon: Clock, title: 'Oppsett på 5–10 dager', desc: 'Fra kartlegging til live AI-mobilsvarer — grundig, skreddersydd oppsett.' },
    { icon: Lock, title: 'Kryptert ende-til-ende', desc: 'Samtaler og data beskyttes med industristandard kryptering (AES-256).' },
    { icon: Server, title: 'Norsk skyinfrastruktur', desc: 'Data behandles og lagres på europeiske servere for maksimal sikkerhet.' },
    { icon: Bot, title: 'Kontinuerlig læring', desc: 'AI-en blir bedre over tid basert på dine kunder og bedriftens behov.' },
  ] : [
    { icon: Zap, title: 'Response time under 2 seconds', desc: 'From question to AI answer — faster than most humans.' },
    { icon: Shield, title: 'GDPR and EU AI Act ready', desc: 'All data stored encrypted within EEA. Following Datatilsynet guidelines.' },
    { icon: Clock, title: 'Setup in 5–10 days', desc: 'From assessment to live AI answering — thorough, tailored setup.' },
    { icon: Lock, title: 'End-to-end encrypted', desc: 'Calls and data protected with industry standard encryption (AES-256).' },
    { icon: Server, title: 'European cloud infrastructure', desc: 'Data processed and stored on European servers for maximum security.' },
    { icon: Bot, title: 'Continuous learning', desc: 'AI improves over time based on your customers and business needs.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: `${bg}`, color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{globalStyles()}</style>
      <Nav />

      {/* Hero */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 40px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 30, background: `rgba(${goldRgb},0.06)`, border: `1px solid rgba(${goldRgb},0.15)`, fontSize: 13, color: gold, marginBottom: 24 }}>
          <Sparkles size={14} />
          {lang === 'no' ? 'Teknologien bak Arxon' : 'The technology behind Arxon'}
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
          {lang === 'no' ? (<>Hvordan AI-mobilsvareren <span style={{ color: gold }}>faktisk fungerer</span></>) : (<>How the AI phone answering <span style={{ color: gold }}>actually works</span></>)}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
          style={{ fontSize: 'clamp(15px, 2.2vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.6 }}>
          {lang === 'no'
            ? 'Ingen magi — bare smart teknologi. Her er steg-for-steg hva som skjer når en kunde ringer deg.'
            : 'No magic — just smart technology. Here\'s step-by-step what happens when a customer calls you.'}
        </motion.p>
      </section>

      {/* Pipeline Steps */}
      <section style={{ maxWidth: 750, margin: '0 auto', padding: '0 24px 70px' }}>
        {pipelineSteps.map((step, i) => (
          <motion.div key={i} {...fadeUp} style={{ display: 'flex', gap: 24, marginBottom: 40, position: 'relative' }}>
            {/* Vertical line */}
            {i < pipelineSteps.length - 1 && (
              <div style={{ position: 'absolute', left: 27, top: 60, bottom: -40, width: 2, background: `linear-gradient(to bottom, rgba(${goldRgb},0.2), rgba(${goldRgb},0.05))` }} />
            )}
            {/* Step number + icon */}
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `rgba(${goldRgb},0.08)`, border: `1px solid rgba(${goldRgb},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <step.icon size={24} color={gold} />
              </div>
              <span style={{ fontSize: 11, color: `rgba(${goldRgb},0.4)`, fontWeight: 700 }}>STEG {i + 1}</span>
            </div>
            {/* Content */}
            <div style={{ paddingTop: 4 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 8 }}>{step.desc}</p>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <CheckCircle2 size={13} color={gold} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                {step.detail}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Tech Specs Grid */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px 70px' }}>
        <motion.h2 {...fadeUp} style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, textAlign: 'center', marginBottom: 36 }}>
          {lang === 'no' ? 'Tekniske spesifikasjoner' : 'Technical specifications'}
        </motion.h2>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {techSpecs.map((spec, i) => (
            <motion.div key={i} {...fadeUp} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px 20px',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(${goldRgb},0.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <spec.icon size={20} color={gold} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{spec.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{spec.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 650, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <motion.div {...fadeUp} style={{
          background: `linear-gradient(135deg, rgba(${goldRgb},0.06) 0%, rgba(${goldRgb},0.02) 100%)`,
          border: `1px solid rgba(${goldRgb},0.15)`, borderRadius: 24, padding: '48px 32px',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, marginBottom: 12 }}>
            {lang === 'no' ? 'Klar for å se det i praksis?' : 'Ready to see it in practice?'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.6 }}>
            {lang === 'no' ? 'Start en gratis kartlegging og finn ut nøyaktig hvordan AI kan hjelpe din bedrift.' : 'Start a free assessment and find out exactly how AI can help your business.'}
          </p>
          <button onClick={() => router.push('/kartlegging')} style={{
            background: gold, color: bg, border: 'none', borderRadius: 14, padding: '16px 36px',
            fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}>
            {lang === 'no' ? 'Start gratis kartlegging' : 'Start free assessment'}
            <ArrowRight size={16} style={{ display: 'inline', marginLeft: 8, verticalAlign: 'middle' }} />
          </button>
        </motion.div>
      </section>

      <Footer minimal />
    </div>
  )
}
