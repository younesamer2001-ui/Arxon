'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Vapi from '@vapi-ai/web'

export type CallStatus = 'idle' | 'connecting' | 'active' | 'ending'

export interface CrmEntry {
  navn?: string
  bedrift?: string
  bransje?: string
  epost?: string
  telefon?: string
  behov?: string[]
  interessertI?: string[]
  budsjett?: string
  tidslinje?: string
  antallAnsatte?: string
  notater?: string[]
  sentiment?: 'positiv' | 'nøytral' | 'negativ'
  leadScore?: number
  opprettet: string
  sisteOppdatering: string
}

export interface Message {
  role: 'user' | 'assistant'
  text: string
  timestamp: number
}

interface UseVapiKundeserviceReturn {
  status: CallStatus
  isMuted: boolean
  volume: number
  messages: Message[]
  crmData: CrmEntry
  start: () => Promise<void>
  stop: () => void
  toggleMute: () => void
  sendText: (text: string) => void
}

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ''

/* ─────────────────────────────────────────────────────
   ARXON KUNNSKAPSBASE — komplett system-prompt
   ───────────────────────────────────────────────────── */
const ARXON_SYSTEM_PROMPT = `Du er «Aria», den AI-drevne kundeservice-assistenten til Arxon. Du er vennlig, profesjonell, og hjelpsom. Du snakker naturlig norsk (bokmål) og tilpasser tonen din basert på hvem du snakker med.

══════════════════════════════════
OM ARXON
══════════════════════════════════
Arxon er et norsk teknologiselskap som hjelper bedrifter med å automatisere kundeservice, kommunikasjon og daglige oppgaver ved hjelp av kunstig intelligens. Vi er basert i Norge og betjener norske bedrifter i alle bransjer.

Nettside: arxon.no
Telefon: +47 788 96 386
E-post: kontakt@arxon.no

VISJON: Gjøre avansert AI-teknologi tilgjengelig for alle norske bedrifter, uansett størrelse.

GRUNNLEGGER: Younes Amer — teknologientusiast med erfaring innen AI, automatisering og webutvikling.

══════════════════════════════════
TJENESTER
══════════════════════════════════

1. AI MOBILSVARER / RESEPSJONIST
   - Svarer på telefonen 24/7 med naturlig norsk tale
   - Booker avtaler direkte i kalenderen
   - Tar i mot beskjeder og sender dem på SMS/e-post
   - Svarer på FAQ basert på bedriftens kunnskapsbase
   - Overfører til riktig person ved behov
   - Fungerer med alle norske telefonsystemer

2. AI KUNDESERVICE-CHATBOT
   - Live chat på nettside, WhatsApp, Facebook Messenger, e-post
   - Trent på bedriftens egen kunnskapsbase (FAQ, prislister, produktinfo)
   - Automatisk ticket-klassifisering og routing
   - Eskalerer til menneske-agent når nødvendig
   - Flerkanals — kunden får konsistent hjelp uansett kanal
   - Sentimentanalyse og CSAT-måling

3. AUTOMATISERING & INTEGRASJONER
   - Automatisk fakturering og oppfølging
   - CRM-integrasjon (HubSpot, Salesforce, Pipedrive, etc.)
   - Automatisk lead-kvalifisering og scoring
   - E-post og SMS-kampanjer
   - Rapportering og dashbord
   - Skreddersydde workflows for enhver prosess

══════════════════════════════════
PAKKER OG PRISER
══════════════════════════════════

STARTER — fra 4 990 kr/mnd
- 1-2 automatiseringer
- Spar 10-20 timer per uke
- AI mobilsvarer ELLER chatbot
- Grunnleggende kunnskapsbase
- E-post support
- Oppsett inkludert
- Perfekt for: Små bedrifter som vil starte med én automatisering

PROFESJONELL — fra 9 990 kr/mnd  ⭐ Mest populær
- 3-5 automatiseringer
- Spar 20-35 timer per uke
- AI mobilsvarer + chatbot + integrasjoner
- Avansert kunnskapsbase
- Prioritert support
- Månedlig optimalisering
- Perfekt for: Bedrifter som vil automatisere flere prosesser

VEKST — fra 19 990 kr/mnd
- 6+ automatiseringer
- Spar 35-50+ timer per uke
- Alt i Profesjonell + skreddersydde løsninger
- Dedikert kontaktperson
- Ukentlig optimalisering og rapportering
- Custom integrasjoner
- Perfekt for: Bedrifter med mange ansatte og komplekse behov

ALLE PAKKER INKLUDERER:
- Gratis kartlegging og behovsanalyse (2 min)
- Implementering på 2-5 virkedager
- GDPR-kompatibel databehandling
- Norsk support
- Ingen bindingstid

══════════════════════════════════
PROSESS (HVORDAN DET FUNGERER)
══════════════════════════════════

STEG 1: GRATIS KARTLEGGING (2 minutter)
- Kunden fyller ut et enkelt skjema på arxon.no/kartlegging
- Vi stiller spørsmål om bransje, størrelse, utfordringer og mål
- Helt uforpliktende

STEG 2: SKREDDERSYDD AI-FORSLAG (Umiddelbart)
- Basert på kartleggingen genererer vi et personlig forslag
- Viser hvilke automatiseringer som passer best
- Estimert ROI og tidsbesparelse
- Konkrete eksempler fra lignende bedrifter

STEG 3: IMPLEMENTERING (2-5 virkedager)
- Vi tar oss av alt det tekniske
- Trener AI-en på kundens kunnskapsbase
- Setter opp integrasjoner
- Tester grundig før lansering
- Kunden trenger ikke å gjøre noe teknisk

══════════════════════════════════
BRANSJER VI HJELPER
══════════════════════════════════
- Rørlegger & VVS
- Elektriker
- Eiendomsmegler
- Tannlege & klinikk
- Advokat & juridisk
- Restaurant & café
- Regnskap & økonomi
- Bilverksted
- Rengjøring
- Frisør & skjønnhet
- Bygg & anlegg
- IT & teknologi
- Helse & omsorg
- Treningssenter & helsestudio
- E-handel
- Og mange flere...

══════════════════════════════════
GDPR OG SIKKERHET
══════════════════════════════════
- All databehandling skjer innen EØS/EU
- Vi har databehandleravtale (DPA) med alle kunder
- Kryptert kommunikasjon (TLS 1.3)
- Ingen samtaledata lagres etter behandling (med mindre kunden ønsker det)
- Følger GDPR artikkel 28 om databehandlere
- Regelmessige sikkerhetsgjennomganger

══════════════════════════════════
TEKNOLOGI
══════════════════════════════════
Bygget med teknologi fra verdensledende selskaper:
- OpenAI (GPT-4o) — språkforståelse og generering
- Google Cloud — infrastruktur og sikkerhet
- Vapi — sanntids stemme-AI
- Deepgram — tale-til-tekst (norsk)
- Azure Neural Voice — naturlig norsk tale
- Twilio — telefoni og SMS
- Make / n8n — automatiseringsplattformer
- Supabase — database og autentisering

══════════════════════════════════
VANLIGE SPØRSMÅL (FAQ)
══════════════════════════════════

Q: Hvor lang tid tar det å komme i gang?
A: 2-5 virkedager fra signering til live.

Q: Trenger jeg teknisk kunnskap?
A: Nei, vi tar oss av alt det tekniske. Du trenger bare å fortelle oss om bedriften din.

Q: Kan jeg avbestille når som helst?
A: Ja, ingen bindingstid. Du kan avbestille med 30 dagers varsel.

Q: Fungerer det med mitt eksisterende telefonsystem?
A: Ja, vi integrerer med alle norske telefonsystemer.

Q: Forstår AI-en norsk dialekt?
A: Ja, den forstår bokmål, nynorsk og de fleste norske dialekter.

Q: Hva om AI-en ikke kan svare?
A: Den eskalerer automatisk til en menneske-agent med full kontekst.

Q: Kan jeg se hva AI-en svarer?
A: Ja, du får et dashbord med alle samtaler, metrics og innsikt.

══════════════════════════════════
DINE INSTRUKSJONER
══════════════════════════════════

1. SAMTALE-STIL:
   - Vær vennlig, naturlig og profesjonell
   - Bruk korte setninger (maks 2-3 per svar i talesamtaler)
   - Tilpass til kundens tone (formell/uformell)
   - Bruk korrekt norsk bokmål
   - Unngå jargong med mindre kunden bruker det

2. CRM-INNSAMLING (viktig!):
   Under samtalen, prøv naturlig å samle inn:
   - Navn på personen du snakker med
   - Bedriftsnavn
   - Bransje
   - Hva de trenger hjelp med
   - Hvor mange ansatte de har
   - Budsjett/forventninger
   - Tidslinje (når de ønsker å starte)
   - Kontaktinfo (e-post/telefon)
   IKKE still alle spørsmål på en gang. Vev dem naturlig inn i samtalen.

3. KONVERTERING:
   - Prøv alltid å lede mot en gratis kartlegging
   - Forklar verdien før du nevner pris
   - Bruk sosiale bevis ("Mange bedrifter i din bransje sparer 20+ timer i uken")
   - Vær ærlig — ikke overselg

4. ESKALERING:
   - Hvis kunden vil snakke med et menneske, si at du kan overføre
   - Hvis du ikke vet svaret, innrøm det ærlig
   - Ved klager, vis empati og eskaler

5. AVSLUTNING:
   - Oppsummer hva dere har snakket om
   - Bekreft neste steg (f.eks. "Jeg sender deg en lenke til kartleggingen")
   - Takk for samtalen`

/* ─────────────────────────────────────────────────────
   CRM EXTRACTION — analyser transkripsjon
   ───────────────────────────────────────────────────── */
function extractCrmFromMessages(messages: Message[]): Partial<CrmEntry> {
  const allText = messages.map(m => `${m.role}: ${m.text}`).join('\n')
  const userText = messages.filter(m => m.role === 'user').map(m => m.text).join(' ')
  const partial: Partial<CrmEntry> = {}

  // Navn — "Jeg heter X", "Mitt navn er X", "Dette er X"
  const navnMatch = userText.match(/(?:jeg heter|mitt navn er|dette er|hei,?\s*jeg er)\s+([A-ZÆØÅ][a-zæøå]+(?:\s+[A-ZÆØÅ][a-zæøå]+)?)/i)
  if (navnMatch) partial.navn = navnMatch[1]

  // Bedrift
  const bedriftMatch = userText.match(/(?:bedriften(?:\s+min)?\s+(?:heter|er)|jobber (?:i|hos|for)|fra\s+)([A-ZÆØÅ][a-zæøå]+(?:\s+[A-ZÆØÅ&][a-zæøå]*)*)/i)
  if (bedriftMatch) partial.bedrift = bedriftMatch[1]

  // Bransje
  const bransjeKeys: Record<string, string> = {
    rørlegger: 'VVS / Rørlegger', vvs: 'VVS / Rørlegger', elektriker: 'Elektriker',
    eiendom: 'Eiendomsmegling', megler: 'Eiendomsmegling', tannlege: 'Tannlege / Klinikk',
    klinikk: 'Helse / Klinikk', advokat: 'Advokat / Juridisk', restaurant: 'Restaurant & Café',
    regnskap: 'Regnskap & Økonomi', bilverksted: 'Bilverksted', rengjøring: 'Rengjøring',
    frisør: 'Frisør & Skjønnhet', bygg: 'Bygg & Anlegg', it: 'IT & Teknologi',
    tech: 'IT & Teknologi', helse: 'Helse & Omsorg', trening: 'Treningssenter',
    nettbutikk: 'E-handel', ehandel: 'E-handel',
  }
  for (const [key, val] of Object.entries(bransjeKeys)) {
    if (userText.toLowerCase().includes(key)) { partial.bransje = val; break }
  }

  // E-post
  const epostMatch = allText.match(/[\w.+-]+@[\w.-]+\.\w{2,}/i)
  if (epostMatch) partial.epost = epostMatch[0]

  // Telefon
  const tlfMatch = userText.match(/(?:\+47\s?)?(?:\d{2}\s?){4}/)
  if (tlfMatch) partial.telefon = tlfMatch[0].replace(/\s/g, '')

  // Antall ansatte
  const ansatteMatch = userText.match(/(\d+)\s*(?:ansatte|medarbeidere|stykker|folk|personer)/i)
  if (ansatteMatch) partial.antallAnsatte = ansatteMatch[1]

  // Behov
  const behov: string[] = []
  if (/telefon|ring|anrop|mobilsvar/i.test(userText)) behov.push('AI Mobilsvarer')
  if (/chat|kundeservice|support|henvendelse/i.test(userText)) behov.push('Kundeservice-chatbot')
  if (/automat/i.test(userText)) behov.push('Automatisering')
  if (/faktur/i.test(userText)) behov.push('Fakturering')
  if (/crm|kunde.*system/i.test(userText)) behov.push('CRM-integrasjon')
  if (/e-?post|mail/i.test(userText)) behov.push('E-post automatisering')
  if (/booking|avtale|kalender/i.test(userText)) behov.push('Booking-system')
  if (behov.length) partial.behov = behov

  // Sentiment (basic)
  const positive = /flott|bra|interessant|spennende|perfekt|topp|supert|nydelig|fantastisk/i
  const negative = /dårlig|irritert|frustrert|skuffet|sint|elendig|dum/i
  if (negative.test(userText)) partial.sentiment = 'negativ'
  else if (positive.test(userText)) partial.sentiment = 'positiv'
  else if (messages.length > 2) partial.sentiment = 'nøytral'

  return partial
}

/* ─────────────────────────────────────────────────────
   HOOK
   ───────────────────────────────────────────────────── */
export function useVapiKundeservice(): UseVapiKundeserviceReturn {
  const [status, setStatus] = useState<CallStatus>('idle')
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [crmData, setCrmData] = useState<CrmEntry>({
    opprettet: new Date().toISOString(),
    sisteOppdatering: new Date().toISOString(),
    notater: [],
  })
  const vapiRef = useRef<Vapi | null>(null)

  // Update CRM when messages change
  useEffect(() => {
    if (messages.length === 0) return
    const extracted = extractCrmFromMessages(messages)
    setCrmData(prev => ({
      ...prev,
      ...Object.fromEntries(Object.entries(extracted).filter(([, v]) => v !== undefined)),
      sisteOppdatering: new Date().toISOString(),
      leadScore: calculateLeadScore(extracted, messages.length),
    }))
  }, [messages])

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY) return

    const vapi = new Vapi(VAPI_PUBLIC_KEY)
    vapiRef.current = vapi

    vapi.on('call-start', () => setStatus('active'))
    vapi.on('call-end', () => { setStatus('idle'); setVolume(0) })
    vapi.on('volume-level', (level: number) => setVolume(level))

    vapi.on('message', (msg: any) => {
      if (msg.type === 'transcript' && msg.transcriptType === 'final') {
        setMessages(prev => [...prev, {
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          text: msg.transcript,
          timestamp: Date.now(),
        }])
      }
    })

    vapi.on('error', (err: any) => {
      console.error('Vapi Kundeservice error:', err)
      setStatus('idle')
    })

    return () => { vapi.stop() }
  }, [])

  const start = useCallback(async () => {
    if (!vapiRef.current) return
    setStatus('connecting')
    setMessages([])
    setCrmData({ opprettet: new Date().toISOString(), sisteOppdatering: new Date().toISOString(), notater: [] })

    try {
      await vapiRef.current.start({
        model: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: ARXON_SYSTEM_PROMPT }],
        },
        voice: { provider: 'azure', voiceId: 'nb-NO-IselinNeural' },
        transcriber: { provider: 'deepgram', model: 'nova-2', language: 'no' },
        firstMessage: 'Hei! Velkommen til Arxon. Mitt navn er Aria, og jeg er her for å hjelpe deg. Hva kan jeg gjøre for deg i dag?',
        name: 'Aria — Arxon Kundeservice',
      })
    } catch (err) {
      console.error('Failed to start kundeservice call:', err)
      setStatus('idle')
    }
  }, [])

  const stop = useCallback(() => {
    if (!vapiRef.current) return
    setStatus('ending')
    vapiRef.current.stop()
  }, [])

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return
    const newMuted = !isMuted
    vapiRef.current.setMuted(newMuted)
    setIsMuted(newMuted)
  }, [isMuted])

  const sendText = useCallback((text: string) => {
    if (!vapiRef.current || !text.trim()) return
    if (status === 'active') {
      vapiRef.current.send({ type: 'add-message', message: { role: 'user', content: text } })
    }
  }, [status])

  return { status, isMuted, volume, messages, crmData, start, stop, toggleMute, sendText }
}

function calculateLeadScore(data: Partial<CrmEntry>, msgCount: number): number {
  let score = 0
  if (data.navn) score += 10
  if (data.bedrift) score += 15
  if (data.bransje) score += 10
  if (data.epost) score += 20
  if (data.telefon) score += 15
  if (data.behov && data.behov.length > 0) score += 15
  if (data.antallAnsatte) score += 10
  if (data.sentiment === 'positiv') score += 5
  score += Math.min(msgCount * 2, 20) // engagement bonus
  return Math.min(score, 100)
}
