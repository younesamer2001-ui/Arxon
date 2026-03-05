export interface ServiceAutomation {
  name: string
  desc: string
  benefit: string
  complexity: string
  implTime: string
}

export interface ServiceCategory {
  id: string
  title: string
  icon: string
  desc: string
  automations: ServiceAutomation[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    "id": "booking",
    "icon": "Phone",
    "desc": "AI-telefonsvarer, automatisk booking, ventelister og påminnelser. Aldri miss et anrop igjen.",
    "title": "Booking & Avtaler",
    "automations": [
      {
        "name": "AI-telefonsvarer 24/7",
        "desc": "Svarer alle anrop, booker befaring, sender SMS",
        "benefit": "Fanger 30-50% tapte henvendelser",
        "complexity": "Middels",
        "implTime": "2-5d"
      },
      {
        "name": "AI-telefonsvarer med booking",
        "desc": "Svarer, sjekker ledig tid, booker time",
        "benefit": "Fanger kunder mens du klipper",
        "complexity": "Middels",
        "implTime": "2-5d"
      },
      {
        "name": "AI-telefonsvarer visning/info",
        "desc": "Svarer spørsmål, booker visning, samler kjøperinfo",
        "benefit": "Kvalifiserer interessenter 24/7",
        "complexity": "Middels",
        "implTime": "2-5d"
      },
      {
        "name": "Visningsmatch",
        "desc": "Nye boliger → match mot kjøpere → varsling",
        "benefit": "Kjøpere varsles umiddelbart",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Timeregistrering → faktura",
        "desc": "Timer → auto faktura ved månedsslutt",
        "benefit": "Null glemte timer",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "AI-telefonsvarer verksted",
        "desc": "Registrerer bil/problem, booker verkstedtime",
        "benefit": "AI svarer, mekanikere jobber",
        "complexity": "Middels",
        "implTime": "2-5d"
      },
      {
        "name": "Verksted-kalkyle",
        "desc": "Beskriver problem → AI estimerer pris/tid",
        "benefit": "Raskere tilbud",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "AI-booking med kvalifisering",
        "desc": "Booker → AI stiller spørsmål → du ser svarene",
        "benefit": "Slipper ukvalifiserte samtaler",
        "complexity": "Middels",
        "implTime": "2-5d"
      },
      {
        "name": "AI-telefonsvarer reservasjoner",
        "desc": "Svarer 24/7, sjekker tilgjengelighet, booker",
        "benefit": "Fanger gjester utenfor åpningstid",
        "complexity": "Middels",
        "implTime": "2-5d"
      },
      {
        "name": "Digital selvinnsjekking",
        "desc": "Lenke → nøkkelkode/info sendes automatisk",
        "benefit": "Skalerbar drift",
        "complexity": "Middels",
        "implTime": "1-2d"
      }
    ]
  },
  {
    "id": "leads",
    "icon": "Target",
    "desc": "Fang opp og kvalifiser leads automatisk. Fra første kontakt til signert avtale.",
    "title": "Leads & Salg",
    "automations": [
      {
        "name": "Lead-scraping",
        "desc": "Finner nye kunder fra Finn.no/Google Maps",
        "benefit": "Fyller pipeline automatisk",
        "complexity": "Høy",
        "implTime": "3-5d"
      },
      {
        "name": "Leadskjema → CRM → sekvens",
        "desc": "Nettskjema → CRM → e-postsekvens + varsling",
        "benefit": "Raskere respons, bedre pipeline",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Tapt anrop → AI-oppfølging",
        "desc": "Tapt anrop → AI-sammendrag → CRM + bookinglenke",
        "benefit": "Fanger tapte leads automatisk",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      },
      {
        "name": "Lead-scoring ved visning",
        "desc": "Påmelding → bekreftelse → scorer interesse",
        "benefit": "Bedre konvertering",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "KPI-rapport",
        "desc": "Nøkkeltall (leads, portefølje) i rapport",
        "benefit": "Oversikt for ledelsen",
        "complexity": "Lav",
        "implTime": "2-4t"
      }
    ]
  },
  {
    "id": "kundeoppfolging",
    "icon": "Users",
    "desc": "Hold kundene fornøyde med automatisk oppfølging, purring og anmeldelsesforespørsler.",
    "title": "Kundeoppfølging",
    "automations": [
      {
        "name": "Befaring-påminnelse + rute",
        "desc": "SMS 24t/1t før med Google Maps-lenke",
        "benefit": "Reduserer no-shows 60-80%",
        "complexity": "Lav",
        "implTime": "2-6t"
      },
      {
        "name": "Google-anmeldelse forespørsel",
        "desc": "SMS 3 dager etter jobb med anmeldelses-lenke",
        "benefit": "Dobler anmeldelser automatisk",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Auto-purring og betalingsoppfølging",
        "desc": "Åpne fakturaer → purring → eskalering",
        "benefit": "Bedre likviditet automatisk",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      },
      {
        "name": "Automatisk venteliste",
        "desc": "Fullbooket → venteliste → varsel ved avbestilling",
        "benefit": "Null tapte inntekter",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      },
      {
        "name": "Booking-påminnelse",
        "desc": "SMS 24t/2t før med avbestillingslenke",
        "benefit": "Reduserer no-shows 70%",
        "complexity": "Lav",
        "implTime": "2-6t"
      },
      {
        "name": "Rebestilling-påminnelse",
        "desc": "6 uker etter klipp → 'Tid for ny time?'",
        "benefit": "Automatisk retention",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "NPS → omtaleforespørsel",
        "desc": "Survey etter besøk → ved høy score → Google-omtale",
        "benefit": "Øker synlighet automatisk",
        "complexity": "Lav",
        "implTime": "2-6t"
      },
      {
        "name": "Kundeundersøkelse etter besøk",
        "desc": "SMS-survey 2t etter besøk",
        "benefit": "Fanger misnøye tidlig",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Visningspåminnelse",
        "desc": "SMS 24t/2t før med Maps-lenke",
        "benefit": "Reduserer no-shows",
        "complexity": "Lav",
        "implTime": "2-6t"
      },
      {
        "name": "Interessent-oppfølging",
        "desc": "Etter visning: auto e-post + AI-spørsmål",
        "benefit": "Systematisk oppfølging",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      },
      {
        "name": "Utleie-administrasjon",
        "desc": "Husleie-påminnelse, kontrakter, vedlikehold",
        "benefit": "Utleie på autopilot",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Venteliste-håndtering",
        "desc": "Avbestilling → neste på liste varsles",
        "benefit": "Null inntektstap",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      },
      {
        "name": "Kontraktfornyelse-varsling",
        "desc": "90/60/30 dager før → varsel + tilbud",
        "benefit": "Ingen kunder faller ut",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Service-påminnelse",
        "desc": "Auto-varsel basert på km/tid",
        "benefit": "Jevn inntektsstrøm",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Dekkskifte-påminnelse",
        "desc": "Okt/apr: 'Tid for dekkskifte!' + booking",
        "benefit": "Sesongomsetning sikret",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "EU-kontroll påminnelse",
        "desc": "2mnd/1mnd/2uker før → auto varsel",
        "benefit": "Fyller EU-kontroll-timer",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Google-anmeldelse etter service",
        "desc": "Fornøyd kunde → SMS med anmeldelseslenke",
        "benefit": "Bygger omdømme",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Betaling-påminnelse",
        "desc": "Auto påminnelse + purring ved ubetalt",
        "benefit": "Sikrer inntekt",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Påminnelser før event",
        "desc": "7d, 1d, 2t: program, info, parkering",
        "benefit": "Høyere oppmøte",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Oppfølging etter event",
        "desc": "Takk + bilder + evaluering + neste event",
        "benefit": "Bygger lojalitet",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Booking-bekreftelse + påminnelse",
        "desc": "Auto bekreftelse + SMS 24t før ankomst",
        "benefit": "Reduserer no-shows",
        "complexity": "Lav",
        "implTime": "2-6t"
      },
      {
        "name": "Gjeste-tilbakemelding + omtale",
        "desc": "Survey 24t etter utsjekking → omtaleforespørsel",
        "benefit": "Øker anmeldelser",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Auto-purring betalingsoppfølging",
        "desc": "Fakturaer → purring → eskalering",
        "benefit": "Bedre likviditet",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      },
      {
        "name": "Event-påmelding og påminnelser",
        "desc": "Registrering → bekreftelse → påminnelser",
        "benefit": "Høyere oppmøte",
        "complexity": "Lav",
        "implTime": "2-6t"
      },
      {
        "name": "Churn-forebygging",
        "desc": "Bruksmønster → inaktivitet → auto outreach",
        "benefit": "Redd kunder før churn",
        "complexity": "Høy",
        "implTime": "3-5d"
      },
      {
        "name": "NPS-survey + oppfølging",
        "desc": "Periodisk NPS → lav score → CS outreach",
        "benefit": "Fanger misnøye tidlig",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Husleie-påminnelse + purring",
        "desc": "Auto påminnelse + purring ved ubetalt",
        "benefit": "Bedre likviditet",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Ledigmelding og visning",
        "desc": "Ledig → annonse + booking + oppfølging",
        "benefit": "Raskere utleie",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Fornyelsespåminnelse",
        "desc": "Xd før utløp → påminnelse + fornyelses-lenke",
        "benefit": "Automatisk retention",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Klage-håndtering workflow",
        "desc": "Klage → kategoriseres → eskaleres → oppfølging",
        "benefit": "Kortere behandlingstid",
        "complexity": "Middels",
        "implTime": "1-2d"
      }
    ]
  },
  {
    "id": "markedsforing",
    "icon": "Megaphone",
    "desc": "Automatiser innholdsproduksjon, sosiale medier og e-postkampanjer.",
    "title": "Markedsføring",
    "automations": [
      {
        "name": "Instagram auto-posting",
        "desc": "Bilde → AI caption → auto-post",
        "benefit": "SoMe alltid aktiv",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Dokumentarkiv + oppgave",
        "desc": "E-post-dokumenter → standardisert arkiv + oppgave",
        "benefit": "Bedre sporbarhet",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Instagram innholdsplan",
        "desc": "AI genererer ukentlig plan → auto-poster",
        "benefit": "Synlighet uten SoMe-timer",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "SoMe showcase auto-post",
        "desc": "Nye prosjektbilder → AI-post → SoMe",
        "benefit": "Kontinuerlig synlighet",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Sesongkampanjer",
        "desc": "AI-kampanjer basert på sesong og belegg",
        "benefit": "Fyller lavsesong",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Gjenkjøps-kampanje",
        "desc": "Gjester fra i fjor → invitasjon + rabatt",
        "benefit": "Retention uten oppfølging",
        "complexity": "Lav",
        "implTime": "2-4t"
      }
    ]
  },
  {
    "id": "admin",
    "icon": "Cog",
    "desc": "Fjern manuelt arbeid med automatisert dokumenthåndtering, oppgavestyring og intern varsling.",
    "title": "Admin & Drift",
    "automations": [
      {
        "name": "Automatisk tilbudsforespørsel",
        "desc": "Kunden beskriver jobb → AI lager strukturert forespørsel",
        "benefit": "Sparer 20-30 min per forespørsel",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Prosjektstatus til kunde",
        "desc": "Ukentlig auto-oppdatering til kunden",
        "benefit": "Profesjonelt, kunden slipper ringe",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Materialliste-generator",
        "desc": "AI lager materialliste fra prosjektbeskrivelse",
        "benefit": "Sparer timer på planlegging",
        "complexity": "Høy",
        "implTime": "2-3d"
      },
      {
        "name": "Dokumentarkiv-automasjon",
        "desc": "Dokumenter mottas → standardisert arkivering",
        "benefit": "Bedre sporbarhet, mindre rot",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Produktanbefaling etter besøk",
        "desc": "AI sender produkttips basert på behandling",
        "benefit": "Øker produktsalg 15-25%",
        "complexity": "Middels",
        "implTime": "1d"
      },
      {
        "name": "Bursdagshilsen + tilbud",
        "desc": "Auto-hilsen med rabattkode på bursdag",
        "benefit": "Driver repeatkjøp",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Automatisk boligpresentasjon",
        "desc": "AI genererer boligbeskrivelse fra nøkkeldata",
        "benefit": "Sparer 30-60 min per bolig",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Budvarsel til selger",
        "desc": "Nytt bud → umiddelbar SMS til selger",
        "benefit": "Sanntids oppdatering",
        "complexity": "Lav",
        "implTime": "2-4t"
      },
      {
        "name": "Reparasjonsstatus til kunde",
        "desc": "Auto SMS: diagnostikk → deler → klar",
        "benefit": "Profesjonelt, kunden slipper ringe",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      },
      {
        "name": "Lagerbestilling deler",
        "desc": "Lav lagerstatus → auto bestilling/varsel",
        "benefit": "Aldri tom for deler",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      },
      {
        "name": "Registrering + bekreftelse",
        "desc": "Påmelding → bekreftelse + QR + kalender",
        "benefit": "Profesjonell registrering",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Leverandør-koordinering",
        "desc": "Auto tidslinje-mail til leverandører",
        "benefit": "Alle vet hva/når",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      },
      {
        "name": "Budsjett-tracking",
        "desc": "Kostnader → auto budsjett vs. faktisk",
        "benefit": "Full kostnadskontroll",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      },
      {
        "name": "Vedlikeholdslogg + varsling",
        "desc": "Logger behov → varsler ansatte → sporer",
        "benefit": "Bedre gjesteopplevelse",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      },
      {
        "name": "Lokal opplevelsesguide",
        "desc": "AI-guide med lokale tips til gjester",
        "benefit": "Differensierer fra konkurrentene",
        "complexity": "Middels",
        "implTime": "1d"
      },
      {
        "name": "Vedlikeholdsforespørsel-workflow",
        "desc": "Beboer melder feil → rutes → status-oppdatering",
        "benefit": "Strukturert feilhåndtering",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Beboerportal-varsling",
        "desc": "Viktig info → auto til alle beboere",
        "benefit": "Alle informert",
        "complexity": "Lav",
        "implTime": "2-4t"
      }
    ]
  },
  {
    "id": "rapportering",
    "icon": "BarChart3",
    "desc": "Få ukentlige rapporter og dashboards levert automatisk. Alltid oppdatert, null arbeid.",
    "title": "Rapportering",
    "automations": [
      {
        "name": "Ukentlig inntektsrapport",
        "desc": "Auto-sammendrag: omsetning, kunder, tjenester",
        "benefit": "Full oversikt uten manuelt arbeid",
        "complexity": "Middels",
        "implTime": "2-4t"
      },
      {
        "name": "Ukentlig salgsrapport",
        "desc": "Auto: mest solgt, inntekt, sammenligning",
        "benefit": "Innsikt uten manuell analyse",
        "complexity": "Middels",
        "implTime": "2-4t"
      },
      {
        "name": "Markedsrapport-generering",
        "desc": "AI lager kvartalsvis markedsrapport",
        "benefit": "Posisjonerer deg som ekspert",
        "complexity": "Høy",
        "implTime": "2-3d"
      },
      {
        "name": "Daglig beleggrapport",
        "desc": "Auto: belegg, inntekt, ankomster",
        "benefit": "Oversikt uten manuell sjekk",
        "complexity": "Lav",
        "implTime": "2-4t"
      }
    ]
  },
  {
    "id": "okonomi",
    "icon": "FileText",
    "desc": "Automatisk fakturering ved milepæler, levering eller fullført jobb.",
    "title": "Økonomi & Faktura",
    "automations": [
      {
        "name": "Faktura etter fullført jobb",
        "desc": "Jobb ferdig → AI genererer faktura automatisk",
        "benefit": "Faktura sendes samme dag",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Faktura ved milepæl",
        "desc": "Fase ferdig → auto delfaktura",
        "benefit": "Bedre cashflow",
        "complexity": "Middels",
        "implTime": "1-2d"
      },
      {
        "name": "Faktura etter levering",
        "desc": "Levering bekreftet → auto faktura",
        "benefit": "Bedre likviditet",
        "complexity": "Middels",
        "implTime": "1-2d"
      }
    ]
  },
  {
    "id": "compliance",
    "icon": "ShieldCheck",
    "desc": "Hold deg i tråd med regelverk. Automatisert samtykke-logging og audit trail.",
    "title": "Compliance & GDPR",
    "automations": [
      {
        "name": "GDPR samtykke- og audit-logg",
        "desc": "Loggfører samtykke/avmelding i audit-spor",
        "benefit": "Compliance-risiko redusert",
        "complexity": "Middels",
        "implTime": "0.5-1d"
      }
    ]
  }
]