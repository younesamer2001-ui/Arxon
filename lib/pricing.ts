export interface PricingAutomation {
  industry: string
  name: string
  desc: string
  benefit: string
  complexity: 'Lav' | 'Middels' | 'Høy'
  implTime: string
  setupPrice: number
  monthlyPrice: number
  monthlyCost?: number
  category: string
}

export const PRICING = {
  discount: [
    { min: 1, max: 4, rate: 0 },
    { min: 5, max: 9, rate: 0.05 },
    { min: 10, max: 14, rate: 0.10 },
    { min: 15, max: 999, rate: 0.15 },
  ],
  annualDiscount: 0.20,
  tiers: {
    'Lav': { setup: 2850, monthly: 2000 },
    'Middels': { setup: 7600, monthly: 4290 },
    'Høy': { setup: 14250, monthly: 8570 },
  },
} as const

export type TierKey = 'basis' | 'pro' | 'premium'

export interface TierPackage {
  key: TierKey
  name: { no: string; en: string }
  desc: { no: string; en: string }
  pricingTier: keyof typeof PRICING.tiers
  automationCount: string
  features: { no: string[]; en: string[] }
}

export const TIER_PACKAGES: Record<TierKey, TierPackage> = {
  basis: {
    key: 'basis',
    name: { no: 'Basis', en: 'Basic' },
    desc: { no: 'Kom i gang med AI-automatisering', en: 'Get started with AI automation' },
    pricingTier: 'Lav',
    automationCount: '1',
    features: {
      no: [
        'Én enkel AI-automasjon',
        'Standard maler og oppsett',
        'E-post support',
        'Ukentlig datarapport',
      ],
      en: [
        'One simple AI automation',
        'Standard templates and setup',
        'Email support',
        'Weekly data report',
      ],
    },
  },
  pro: {
    key: 'pro',
    name: { no: 'Pro', en: 'Pro' },
    desc: { no: 'Mest populær for voksende bedrifter', en: 'Most popular for growing businesses' },
    pricingTier: 'Middels',
    automationCount: '1–3',
    features: {
      no: [
        'Inntil 3 AI-automasjoner',
        'Avansert system-integrasjon (CRM/Booking)',
        'Skreddersydd AI-trening',
        'Prioritert support via telefon',
        'Månedlig optimalisering',
      ],
      en: [
        'Up to 3 AI automations',
        'Advanced system integration (CRM/Booking)',
        'Custom AI training',
        'Priority phone support',
        'Monthly optimization',
      ],
    },
  },
  premium: {
    key: 'premium',
    name: { no: 'Premium', en: 'Premium' },
    desc: { no: 'Maksimal effekt for etablerte aktører', en: 'Maximum impact for established players' },
    pricingTier: 'Høy',
    automationCount: '5+',
    features: {
      no: [
        'Komplett AI-system (5+ automasjoner)',
        'Dype fagsystem-integrasjoner',
        'Proaktiv overvåking og skalering',
        'Dedikert kontaktperson',
        'Kvartalsvise strategimøter',
      ],
      en: [
        'Complete AI system (5+ automations)',
        'Deep industry system integrations',
        'Proactive monitoring and scaling',
        'Dedicated account manager',
        'Quarterly strategy meetings',
      ],
    },
  },
}

export function getDiscountRate(count: number): number {
  for (const tier of PRICING.discount) {
    if (count >= tier.min && count <= tier.max) return tier.rate
  }
  return 0
}

export function formatKr(n: number): string {
  return n.toLocaleString('nb-NO') + ' kr'
}

export const pricingAutomations: PricingAutomation[] = [
  {
    "industry": "Bygg & Håndverk",
    "name": "AI-telefonsvarer 24/7",
    "desc": "Svarer alle anrop, booker befaring, sender SMS",
    "benefit": "Fanger 30-50% tapte henvendelser",
    "complexity": "Middels",
    "implTime": "2-5d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Booking & Avtaler"
  },
  {
    "industry": "Bygg & Håndverk",
    "name": "Automatisk tilbudsforespørsel",
    "desc": "Kunden beskriver jobb → AI lager strukturert forespørsel",
    "benefit": "Sparer 20-30 min per forespørsel",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Admin & Drift"
  },
  {
    "industry": "Bygg & Håndverk",
    "name": "Befaring-påminnelse + rute",
    "desc": "SMS 24t/1t før med Google Maps-lenke",
    "benefit": "Reduserer no-shows 60-80%",
    "complexity": "Lav",
    "implTime": "2-6t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Bygg & Håndverk",
    "name": "Faktura etter fullført jobb",
    "desc": "Jobb ferdig → AI genererer faktura automatisk",
    "benefit": "Faktura sendes samme dag",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Økonomi & Faktura"
  },
  {
    "industry": "Bygg & Håndverk",
    "name": "Prosjektstatus til kunde",
    "desc": "Ukentlig auto-oppdatering til kunden",
    "benefit": "Profesjonelt, kunden slipper ringe",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Admin & Drift"
  },
  {
    "industry": "Bygg & Håndverk",
    "name": "Google-anmeldelse forespørsel",
    "desc": "SMS 3 dager etter jobb med anmeldelses-lenke",
    "benefit": "Dobler anmeldelser automatisk",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Bygg & Håndverk",
    "name": "Lead-scraping",
    "desc": "Finner nye kunder fra Finn.no/Google Maps",
    "benefit": "Fyller pipeline automatisk",
    "complexity": "Høy",
    "implTime": "3-5d",
    "setupPrice": 14250,
    "monthlyPrice": 8570,
    "monthlyCost": 3000,
    "category": "Leads & Salg"
  },
  {
    "industry": "Bygg & Håndverk",
    "name": "Materialliste-generator",
    "desc": "AI lager materialliste fra prosjektbeskrivelse",
    "benefit": "Sparer timer på planlegging",
    "complexity": "Høy",
    "implTime": "2-3d",
    "setupPrice": 14250,
    "monthlyPrice": 8570,
    "monthlyCost": 3000,
    "category": "Admin & Drift"
  },
  {
    "industry": "Bygg & Håndverk",
    "name": "Leadskjema → CRM → sekvens",
    "desc": "Nettskjema → CRM → e-postsekvens + varsling",
    "benefit": "Raskere respons, bedre pipeline",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Leads & Salg"
  },
  {
    "industry": "Bygg & Håndverk",
    "name": "Tapt anrop → AI-oppfølging",
    "desc": "Tapt anrop → AI-sammendrag → CRM + bookinglenke",
    "benefit": "Fanger tapte leads automatisk",
    "complexity": "Middels",
    "implTime": "0.5-1d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Leads & Salg"
  },
  {
    "industry": "Bygg & Håndverk",
    "name": "Dokumentarkiv-automasjon",
    "desc": "Dokumenter mottas → standardisert arkivering",
    "benefit": "Bedre sporbarhet, mindre rot",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Admin & Drift"
  },
  {
    "industry": "Bygg & Håndverk",
    "name": "Auto-purring og betalingsoppfølging",
    "desc": "Åpne fakturaer → purring → eskalering",
    "benefit": "Bedre likviditet automatisk",
    "complexity": "Middels",
    "implTime": "0.5-1d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Salong & Skjønnhet",
    "name": "AI-telefonsvarer med booking",
    "desc": "Svarer, sjekker ledig tid, booker time",
    "benefit": "Fanger kunder mens du klipper",
    "complexity": "Middels",
    "implTime": "2-5d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Booking & Avtaler"
  },
  {
    "industry": "Salong & Skjønnhet",
    "name": "Automatisk venteliste",
    "desc": "Fullbooket → venteliste → varsel ved avbestilling",
    "benefit": "Null tapte inntekter",
    "complexity": "Middels",
    "implTime": "0.5-1d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Salong & Skjønnhet",
    "name": "Booking-påminnelse",
    "desc": "SMS 24t/2t før med avbestillingslenke",
    "benefit": "Reduserer no-shows 70%",
    "complexity": "Lav",
    "implTime": "2-6t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Salong & Skjønnhet",
    "name": "Produktanbefaling etter besøk",
    "desc": "AI sender produkttips basert på behandling",
    "benefit": "Øker produktsalg 15-25%",
    "complexity": "Middels",
    "implTime": "1d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Admin & Drift"
  },
  {
    "industry": "Salong & Skjønnhet",
    "name": "Instagram auto-posting",
    "desc": "Bilde → AI caption → auto-post",
    "benefit": "SoMe alltid aktiv",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Markedsføring"
  },
  {
    "industry": "Salong & Skjønnhet",
    "name": "Bursdagshilsen + tilbud",
    "desc": "Auto-hilsen med rabattkode på bursdag",
    "benefit": "Driver repeatkjøp",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Admin & Drift"
  },
  {
    "industry": "Salong & Skjønnhet",
    "name": "Rebestilling-påminnelse",
    "desc": "6 uker etter klipp → 'Tid for ny time?'",
    "benefit": "Automatisk retention",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Salong & Skjønnhet",
    "name": "Ukentlig inntektsrapport",
    "desc": "Auto-sammendrag: omsetning, kunder, tjenester",
    "benefit": "Full oversikt uten manuelt arbeid",
    "complexity": "Middels",
    "implTime": "2-4t",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Rapportering"
  },
  {
    "industry": "Salong & Skjønnhet",
    "name": "Leadskjema → CRM → sekvens",
    "desc": "Nettskjema → CRM → e-postsekvens",
    "benefit": "Raskere respons",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Leads & Salg"
  },
  {
    "industry": "Salong & Skjønnhet",
    "name": "NPS → omtaleforespørsel",
    "desc": "Survey etter besøk → ved høy score → Google-omtale",
    "benefit": "Øker synlighet automatisk",
    "complexity": "Lav",
    "implTime": "2-6t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "AI-telefonsvarer visning/info",
    "desc": "Svarer spørsmål, booker visning, samler kjøperinfo",
    "benefit": "Kvalifiserer interessenter 24/7",
    "complexity": "Middels",
    "implTime": "2-5d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Booking & Avtaler"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "Automatisk boligpresentasjon",
    "desc": "AI genererer boligbeskrivelse fra nøkkeldata",
    "benefit": "Sparer 30-60 min per bolig",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Admin & Drift"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "Visningsmatch",
    "desc": "Nye boliger → match mot kjøpere → varsling",
    "benefit": "Kjøpere varsles umiddelbart",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Booking & Avtaler"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "Visningspåminnelse",
    "desc": "SMS 24t/2t før med Maps-lenke",
    "benefit": "Reduserer no-shows",
    "complexity": "Lav",
    "implTime": "2-6t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "Interessent-oppfølging",
    "desc": "Etter visning: auto e-post + AI-spørsmål",
    "benefit": "Systematisk oppfølging",
    "complexity": "Middels",
    "implTime": "0.5-1d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "Budvarsel til selger",
    "desc": "Nytt bud → umiddelbar SMS til selger",
    "benefit": "Sanntids oppdatering",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Admin & Drift"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "Utleie-administrasjon",
    "desc": "Husleie-påminnelse, kontrakter, vedlikehold",
    "benefit": "Utleie på autopilot",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "Markedsrapport-generering",
    "desc": "AI lager kvartalsvis markedsrapport",
    "benefit": "Posisjonerer deg som ekspert",
    "complexity": "Høy",
    "implTime": "2-3d",
    "setupPrice": 14250,
    "monthlyPrice": 8570,
    "monthlyCost": 3000,
    "category": "Rapportering"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "Lead-scoring ved visning",
    "desc": "Påmelding → bekreftelse → scorer interesse",
    "benefit": "Bedre konvertering",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Leads & Salg"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "Leadskjema → CRM → sekvens",
    "desc": "Nettskjema → CRM → e-postsekvens",
    "benefit": "Raskere respons",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Leads & Salg"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "GDPR samtykke- og audit-logg",
    "desc": "Samtykke-logging for eiendomskommunikasjon",
    "benefit": "Compliance-vennlig",
    "complexity": "Middels",
    "implTime": "0.5-1d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Compliance & GDPR"
  },
  {
    "industry": "Eiendomsmegling",
    "name": "Dokumentarkiv-automasjon",
    "desc": "Dokumenter → standardisert arkiv + oppgave",
    "benefit": "Bedre sporbarhet",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Admin & Drift"
  },
  {
    "industry": "Bilverksted & Bilforhandler",
    "name": "AI-telefonsvarer verksted",
    "desc": "Registrerer bil/problem, booker verkstedtime",
    "benefit": "AI svarer, mekanikere jobber",
    "complexity": "Middels",
    "implTime": "2-5d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Booking & Avtaler"
  },
  {
    "industry": "Bilverksted & Bilforhandler",
    "name": "Service-påminnelse",
    "desc": "Auto-varsel basert på km/tid",
    "benefit": "Jevn inntektsstrøm",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Bilverksted & Bilforhandler",
    "name": "Dekkskifte-påminnelse",
    "desc": "Okt/apr: 'Tid for dekkskifte!' + booking",
    "benefit": "Sesongomsetning sikret",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Bilverksted & Bilforhandler",
    "name": "Reparasjonsstatus til kunde",
    "desc": "Auto SMS: diagnostikk → deler → klar",
    "benefit": "Profesjonelt, kunden slipper ringe",
    "complexity": "Middels",
    "implTime": "0.5-1d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Admin & Drift"
  },
  {
    "industry": "Bilverksted & Bilforhandler",
    "name": "Verksted-kalkyle",
    "desc": "Beskriver problem → AI estimerer pris/tid",
    "benefit": "Raskere tilbud",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Booking & Avtaler"
  },
  {
    "industry": "Bilverksted & Bilforhandler",
    "name": "EU-kontroll påminnelse",
    "desc": "2mnd/1mnd/2uker før → auto varsel",
    "benefit": "Fyller EU-kontroll-timer",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Bilverksted & Bilforhandler",
    "name": "Google-anmeldelse etter service",
    "desc": "Fornøyd kunde → SMS med anmeldelseslenke",
    "benefit": "Bygger omdømme",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Bilverksted & Bilforhandler",
    "name": "Lagerbestilling deler",
    "desc": "Lav lagerstatus → auto bestilling/varsel",
    "benefit": "Aldri tom for deler",
    "complexity": "Middels",
    "implTime": "0.5-1d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Admin & Drift"
  },
  {
    "industry": "Bilverksted & Bilforhandler",
    "name": "Leadskjema → CRM → sekvens",
    "desc": "Nettskjema → CRM → e-postsekvens",
    "benefit": "Raskere respons",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Leads & Salg"
  },
  {
    "industry": "Reiseliv & Overnatting",
    "name": "AI-telefonsvarer reservasjoner",
    "desc": "Svarer 24/7, sjekker tilgjengelighet, booker",
    "benefit": "Fanger gjester utenfor åpningstid",
    "complexity": "Middels",
    "implTime": "2-5d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Booking & Avtaler"
  },
  {
    "industry": "Reiseliv & Overnatting",
    "name": "Booking-bekreftelse + påminnelse",
    "desc": "Auto bekreftelse + SMS 24t før ankomst",
    "benefit": "Reduserer no-shows",
    "complexity": "Lav",
    "implTime": "2-6t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Reiseliv & Overnatting",
    "name": "Digital selvinnsjekking",
    "desc": "Lenke → nøkkelkode/info sendes automatisk",
    "benefit": "Skalerbar drift",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Booking & Avtaler"
  },
  {
    "industry": "Reiseliv & Overnatting",
    "name": "Gjeste-tilbakemelding + omtale",
    "desc": "Survey 24t etter utsjekking → omtaleforespørsel",
    "benefit": "Øker anmeldelser",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Kundeoppfølging"
  },
  {
    "industry": "Reiseliv & Overnatting",
    "name": "Sesongkampanjer",
    "desc": "AI-kampanjer basert på sesong og belegg",
    "benefit": "Fyller lavsesong",
    "complexity": "Middels",
    "implTime": "1-2d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Markedsføring"
  },
  {
    "industry": "Reiseliv & Overnatting",
    "name": "Vedlikeholdslogg + varsling",
    "desc": "Logger behov → varsler ansatte → sporer",
    "benefit": "Bedre gjesteopplevelse",
    "complexity": "Middels",
    "implTime": "0.5-1d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Admin & Drift"
  },
  {
    "industry": "Reiseliv & Overnatting",
    "name": "Daglig beleggrapport",
    "desc": "Auto: belegg, inntekt, ankomster",
    "benefit": "Oversikt uten manuell sjekk",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Rapportering"
  },
  {
    "industry": "Reiseliv & Overnatting",
    "name": "Gjenkjøps-kampanje",
    "desc": "Gjester fra i fjor → invitasjon + rabatt",
    "benefit": "Retention uten oppfølging",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Markedsføring"
  },
  {
    "industry": "Reiseliv & Overnatting",
    "name": "Leadskjema → CRM → sekvens",
    "desc": "Nettskjema → CRM → e-postsekvens",
    "benefit": "Raskere respons",
    "complexity": "Lav",
    "implTime": "2-4t",
    "setupPrice": 2850,
    "monthlyPrice": 2000,
    "monthlyCost": 700,
    "category": "Leads & Salg"
  },
  {
    "industry": "Reiseliv & Overnatting",
    "name": "Lokal opplevelsesguide",
    "desc": "AI-guide med lokale tips til gjester",
    "benefit": "Differensierer fra konkurrentene",
    "complexity": "Middels",
    "implTime": "1d",
    "setupPrice": 7600,
    "monthlyPrice": 4290,
    "monthlyCost": 1500,
    "category": "Admin & Drift"
  }
]

export const pricingIndustries = [
  "Bygg & Håndverk",
  "Eiendomsmegling",
  "Salong & Skjønnhet",
  "Bilverksted & Bilforhandler",
  "Reiseliv & Overnatting",
]