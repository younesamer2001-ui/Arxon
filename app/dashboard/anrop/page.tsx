'use client'

import { useState } from 'react'
import { gold, goldRgb, fonts } from '@/lib/constants'
import { PhoneIncoming, PhoneMissed, Clock, Search, ChevronDown, ChevronUp, Bot, User, Tag, Calendar, ArrowRight } from 'lucide-react'

interface TranscriptLine {
  speaker: 'ai' | 'caller'
  text: string
  time: string
}

interface CallData {
  id: number
  number: string
  name: string
  status: 'answered' | 'missed'
  duration: string
  time: string
  date: string
  summary: string
  sentiment: 'positive' | 'neutral' | 'negative'
  outcome: 'lead' | 'booking' | 'info' | 'missed' | 'spam'
  transcript: TranscriptLine[]
}

const demoCalls: CallData[] = [
  {
    id: 1, number: '+47 912 34 567', name: 'Ole Hansen',
    status: 'answered', duration: '2:34', time: '14:32', date: '28. feb 2026',
    summary: 'Spurte om pris på AI-telefonsvarer for bilverksted. Interessert i pakke med auto-booking.',
    sentiment: 'positive', outcome: 'lead',
    transcript: [
      { speaker: 'ai', text: 'Hei, du har ringt Arxon! Mitt navn er Eirik, din AI-assistent. Hvordan kan jeg hjelpe deg i dag?', time: '0:00' },
      { speaker: 'caller', text: 'Hei! Jeg driver et bilverksted og lurer på hva dere tilbyr.', time: '0:06' },
      { speaker: 'ai', text: 'Så bra! Vi tilbyr AI-telefonsvarer som tar imot alle anrop, kvalifiserer leads og booker møter automatisk. Perfekt for verksteder som ofte er opptatt med hendene.', time: '0:12' },
      { speaker: 'caller', text: 'Det høres interessant ut. Hva koster det?', time: '0:25' },
      { speaker: 'ai', text: 'Vår standardpakke koster 2990 kr per måned og inkluderer ubegrenset med anrop, automatisk booking og CRM-integrasjon. Vil du at jeg setter opp en demo?', time: '0:30' },
      { speaker: 'caller', text: 'Ja, det hadde vært fint. Kan vi ta det neste uke?', time: '0:45' },
      { speaker: 'ai', text: 'Selvfølgelig! Jeg har ledig tirsdag kl. 10 eller onsdag kl. 14. Hva passer best?', time: '0:50' },
      { speaker: 'caller', text: 'Tirsdag kl. 10 fungerer.', time: '1:00' },
      { speaker: 'ai', text: 'Perfekt! Jeg har booket en demo for deg tirsdag kl. 10. Du vil motta en bekreftelse på SMS. Er det noe annet jeg kan hjelpe med?', time: '1:05' },
      { speaker: 'caller', text: 'Nei, det var alt. Takk!', time: '1:18' },
      { speaker: 'ai', text: 'Tusen takk for samtalen, Ole! Vi ses tirsdag. Ha en fin dag!', time: '1:22' },
    ]
  },
  {
    id: 2, number: '+47 987 65 432', name: 'Ukjent',
    status: 'missed', duration: '—', time: '14:15', date: '28. feb 2026',
    summary: 'Ubesvart anrop — AI var opptatt med annet anrop.',
    sentiment: 'neutral', outcome: 'missed',
    transcript: []
  },
  {
    id: 3, number: '+47 456 78 901', name: 'Kari Nordmann',
    status: 'answered', duration: '4:12', time: '13:45', date: '28. feb 2026',
    summary: 'Eksisterende kunde med spørsmål om faktura og utvidelse av tjenester. Ønsker chatbot i tillegg.',
    sentiment: 'positive', outcome: 'lead',
    transcript: [
      { speaker: 'ai', text: 'Hei Kari! Velkommen tilbake til Arxon. Hvordan kan jeg hjelpe deg i dag?', time: '0:00' },
      { speaker: 'caller', text: 'Hei! Jeg har et spørsmål om fakturaen min, og så lurte jeg på om dere har chatbot-løsning også.', time: '0:05' },
      { speaker: 'ai', text: 'Selvfølgelig! La meg sjekke fakturaen din. Kan du bekrefte e-postadressen din?', time: '0:15' },
      { speaker: 'caller', text: 'Ja, det er kari@nordmann.no', time: '0:22' },
      { speaker: 'ai', text: 'Takk! Jeg ser at siste faktura ble sendt 15. februar på 2990 kr. Er det denne du lurer på?', time: '0:28' },
      { speaker: 'caller', text: 'Ja, stemmer. Og hva med chatbot — har dere det?', time: '0:40' },
      { speaker: 'ai', text: 'Vi har en chatbot-modul som kan integreres med nettsiden din. Den håndterer kundespørsmål 24/7 og kan også booke møter direkte. Skal jeg sette opp et møte med teamet vårt for å vise deg?', time: '0:48' },
      { speaker: 'caller', text: 'Ja takk, det hadde vært fint!', time: '1:10' },
    ]
  },
  {
    id: 4, number: '+47 321 54 876', name: 'Erik Bakken',
    status: 'answered', duration: '1:08', time: '12:20', date: '28. feb 2026',
    summary: 'Kort samtale — bekreftet møtetidspunkt for torsdag kl. 10.',
    sentiment: 'neutral', outcome: 'booking',
    transcript: [
      { speaker: 'ai', text: 'Hei, du har ringt Arxon! Hvordan kan jeg hjelpe?', time: '0:00' },
      { speaker: 'caller', text: 'Hei, jeg bare ville bekrefte møtet mitt på torsdag.', time: '0:04' },
      { speaker: 'ai', text: 'La meg sjekke. Ja, du har et møte booket torsdag kl. 10:00. Stemmer det?', time: '0:10' },
      { speaker: 'caller', text: 'Perfekt, da ses vi da!', time: '0:20' },
      { speaker: 'ai', text: 'Flott! Møtet er bekreftet. Ha en fin dag, Erik!', time: '0:24' },
    ]
  },
  {
    id: 5, number: '+47 555 12 345', name: 'Salong Bella',
    status: 'answered', duration: '3:22', time: '11:50', date: '28. feb 2026',
    summary: 'Ny kunde — eier av salong med 5 ansatte. Bruker mye tid på telefon for timebestilling. Kvalifisert lead.',
    sentiment: 'positive', outcome: 'lead',
    transcript: [
      { speaker: 'ai', text: 'Hei, velkommen til Arxon! Mitt navn er Eirik. Hvordan kan jeg hjelpe deg?', time: '0:00' },
      { speaker: 'caller', text: 'Hei! Jeg driver Salong Bella og vi drukner i telefonhenvendelser for timebestilling. Har dere noe som kan hjelpe?', time: '0:05' },
      { speaker: 'ai', text: 'Absolutt! Vi har mange salonger som bruker vår AI-telefonsvarer. Den tar imot bookinger automatisk, sender bekreftelse på SMS, og synkroniserer med kalenderen din. Hvor mange ansatte har dere?', time: '0:18' },
      { speaker: 'caller', text: 'Vi er 5 stykker, og alle bruker tid på å svare telefonen mellom kunder.', time: '0:35' },
      { speaker: 'ai', text: 'Da kan dere spare flere timer om dagen! En av våre salonger rapporterte 80% reduksjon i tapt tid. Vil du se en demo tilpasset salonger?', time: '0:42' },
      { speaker: 'caller', text: 'Ja, veldig gjerne! Når kan vi gjøre det?', time: '1:00' },
    ]
  },
  {
    id: 6, number: '+47 777 88 999', name: 'Ukjent',
    status: 'answered', duration: '0:45', time: '10:30', date: '28. feb 2026',
    summary: 'Feil nummer — samtalen ble avsluttet raskt.',
    sentiment: 'neutral', outcome: 'spam',
    transcript: [
      { speaker: 'ai', text: 'Hei, du har ringt Arxon! Hvordan kan jeg hjelpe?', time: '0:00' },
      { speaker: 'caller', text: 'Eh, dette var visst feil nummer. Beklager!', time: '0:05' },
      { speaker: 'ai', text: 'Ingen problem! Ha en fin dag!', time: '0:10' },
    ]
  },
  {
    id: 7, number: '+47 444 33 222', name: 'Byggmester AS',
    status: 'answered', duration: '5:17', time: '09:15', date: '28. feb 2026',
    summary: 'Stor interesse — byggfirma med 12 ansatte. Taper mange anrop på byggeplasser. Vil ha demo.',
    sentiment: 'positive', outcome: 'lead',
    transcript: [
      { speaker: 'ai', text: 'Hei, velkommen til Arxon! Jeg er Eirik, din AI-assistent. Hva kan jeg hjelpe med?', time: '0:00' },
      { speaker: 'caller', text: 'Hei! Vi er et byggfirma og vi mister masse anrop fordi gutta er ute på byggeplasser. Kan dere hjelpe?', time: '0:06' },
      { speaker: 'ai', text: 'Det er akkurat det vi er best på! Vår AI-telefonsvarer tar imot alle anrop, kvalifiserer forespørsler og sender deg en oppsummering. Ingen tapte kunder. Hvor mange ansatte har dere?', time: '0:18' },
      { speaker: 'caller', text: 'Vi er 12 stykker. Vi taper sikkert 10-15 anrop om dagen.', time: '0:32' },
      { speaker: 'ai', text: 'Med 10-15 tapte anrop daglig kan dere potensielt tape hundretusenvis i omsetning årlig. Vår løsning koster bare 2990 kr/mnd og betaler seg tilbake første uka. Skal jeg sette opp en demo?', time: '0:40' },
      { speaker: 'caller', text: 'Ja! Kan vi gjøre det denne uken?', time: '1:05' },
      { speaker: 'ai', text: 'Absolutt! Jeg har ledig onsdag kl. 14 eller torsdag kl. 10. Hva passer?', time: '1:10' },
      { speaker: 'caller', text: 'Onsdag kl. 14 passer perfekt.', time: '1:20' },
      { speaker: 'ai', text: 'Booket! Du får en bekreftelse på SMS. Kan jeg få navnet ditt og e-post for møteinnkallingen?', time: '1:25' },
    ]
  },
  {
    id: 8, number: '+47 666 55 444', name: 'Reisebyrå Fjord',
    status: 'missed', duration: '—', time: '08:45', date: '27. feb 2026',
    summary: 'Ubesvart — AI ringte tilbake 2 min senere.',
    sentiment: 'neutral', outcome: 'missed',
    transcript: []
  },
]

const outcomeConfig: Record<string, { label: string; bg: string; color: string }> = {
  lead: { label: 'Lead', bg: 'rgba(96,165,250,0.12)', color: '#60a5fa' },
  booking: { label: 'Booking', bg: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  info: { label: 'Info', bg: 'rgba(250,204,21,0.12)', color: '#facc15' },
  missed: { label: 'Tapt', bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
  spam: { label: 'Irrelevant', bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' },
}

export default function CallLogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'answered' | 'missed'>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = demoCalls.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.number.includes(searchQuery)) return false
    return true
  })

  const stats = {
    total: demoCalls.length,
    answered: demoCalls.filter(c => c.status === 'answered').length,
    leads: demoCalls.filter(c => c.outcome === 'lead').length,
    bookings: demoCalls.filter(c => c.outcome === 'booking').length,
  }

  return (
    <div style={{ maxWidth: 900, fontFamily: fonts.body }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 20px' }}>
        Alle innkommende anrop håndtert av AI-telefonsvareren
      </p>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Totalt', value: stats.total, color: gold },
          { label: 'Besvart', value: stats.answered, color: '#4ade80' },
          { label: 'Leads', value: stats.leads, color: '#60a5fa' },
          { label: 'Bookinger', value: stats.bookings, color: '#a78bfa' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '14px 16px', textAlign: 'center',
          }}>
            <div style={{ color: s.color, fontSize: 24, fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Søk på navn eller nummer..."
            style={{ width: '100%', padding: '10px 16px 10px 38px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#f0f0f0', fontSize: 14, outline: 'none', fontFamily: fonts.body, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 3 }}>
          {([['all', 'Alle'], ['answered', 'Besvart'], ['missed', 'Tapte']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setFilterStatus(val)}
              style={{ padding: '8px 14px', borderRadius: 6, border: 'none', background: filterStatus === val ? `rgba(${goldRgb},0.15)` : 'transparent', color: filterStatus === val ? gold : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: fonts.body }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Call list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(call => {
          const expanded = expandedId === call.id
          const oc = outcomeConfig[call.outcome]
          return (
            <div key={call.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${expanded ? `rgba(${goldRgb},0.2)` : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s',
            }}>
              <button onClick={() => setExpandedId(expanded ? null : call.id)}
                style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, fontFamily: fonts.body, textAlign: 'left' }}>
                {call.status === 'missed'
                  ? <PhoneMissed size={16} color="#f87171" />
                  : <PhoneIncoming size={16} color="#4ade80" />
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#f0f0f0', fontSize: 14, fontWeight: 500 }}>{call.name}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{call.number}</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {call.summary}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: oc.bg, color: oc.color }}>{oc.label}</span>
                  {call.duration !== '—' && (
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {call.duration}
                    </span>
                  )}
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>{call.time}</span>
                  {expanded ? <ChevronUp size={16} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.3)" />}
                </div>
              </button>

              {expanded && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* Summary bar */}
                  <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Tag size={13} color={gold} />
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Utfall:</span>
                      <span style={{ color: oc.color, fontSize: 12, fontWeight: 600 }}>{oc.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={13} color="rgba(255,255,255,0.4)" />
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{call.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: call.sentiment === 'positive' ? '#4ade80' : 'rgba(255,255,255,0.3)' }} />
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{call.sentiment === 'positive' ? 'Positiv' : 'Nøytral'}</span>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Bot size={13} /> AI-oppsummering
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{call.summary}</p>
                  </div>

                  {/* Transcript */}
                  {call.transcript.length > 0 && (
                    <div style={{ padding: '16px' }}>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
                        Transkripsjon
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {call.transcript.map((line, i) => (
                          <div key={i} style={{
                            display: 'flex',
                            flexDirection: line.speaker === 'ai' ? 'row' : 'row-reverse',
                            gap: 10, alignItems: 'flex-start',
                          }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: line.speaker === 'ai' ? `rgba(${goldRgb},0.15)` : 'rgba(255,255,255,0.08)',
                            }}>
                              {line.speaker === 'ai'
                                ? <Bot size={14} color={gold} />
                                : <User size={14} color="rgba(255,255,255,0.5)" />
                              }
                            </div>
                            <div style={{
                              maxWidth: '75%',
                              background: line.speaker === 'ai' ? `rgba(${goldRgb},0.06)` : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${line.speaker === 'ai' ? `rgba(${goldRgb},0.1)` : 'rgba(255,255,255,0.06)'}`,
                              borderRadius: line.speaker === 'ai' ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                              padding: '10px 14px',
                            }}>
                              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{line.text}</p>
                              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, marginTop: 4, display: 'block' }}>{line.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {call.transcript.length === 0 && (
                    <div style={{ padding: '30px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                      Ingen transkripsjon tilgjengelig for dette anropet
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            Ingen anrop funnet
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
