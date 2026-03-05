'use client';

import { useState } from 'react';
import Link from 'next/link';

function RenderContent({ text }: { text: string }) {
  const paragraphs = text.split('\n\n').filter(p => p.trim());

  return (
    <div>
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();

        // Numbered list (starts with 1. 2. 3. etc)
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split(/\n/).filter(l => l.trim());
          return (
            <ol key={i} style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', color: '#d0d0d0', listStyleType: 'decimal' }}>
              {items.map((item, j) => (
                <li key={j} style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#c9a96e;font-weight:600">$1</strong>') }}
                />
              ))}
            </ol>
          );
        }

        // Bullet list (starts with -)
        if (/^-\s/.test(trimmed)) {
          const items = trimmed.split(/\n/).filter(l => l.trim());
          return (
            <ul key={i} style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', color: '#d0d0d0', listStyleType: 'none' }}>
              {items.map((item, j) => (
                <li key={j} style={{ marginBottom: '0.5rem', lineHeight: 1.7, paddingLeft: '1rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#c9a96e' }}>•</span>
                  <span dangerouslySetInnerHTML={{ __html: item.replace(/^-\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#c9a96e;font-weight:600">$1</strong>') }} />
                </li>
              ))}
            </ul>
          );
        }

        // Regular paragraph with bold support
        return (
          <p key={i} style={{ marginBottom: '1.5rem', lineHeight: 1.8, color: '#d0d0d0' }}
            dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#c9a96e;font-weight:600">$1</strong>') }}
          />
        );
      })}
    </div>
  );
}

export default function GDPRAndAIPhonePage() {
  const [language, setLanguage] = useState<'no' | 'en'>('no');

  const content = {
    no: {
      navItems: [
        { href: '/', label: 'Hjem' },
        { href: '/mobilsvarer', label: 'Mobilsvarer' },
        { href: '/blogg', label: 'Blogg' },
        { href: '/om-oss', label: 'Om oss' },
      ],
      breadcrumb: 'Tilbake til blogg',
      title: 'GDPR og AI-telefonsvar: Alt du trenger å vite',
      subtitle:
        'En fullstendig veiledning om personvernregelverket som gjelder kunstig intelligens i telefonsvarer',
      meta: {
        date: '21. februar 2026',
        readTime: '8 min lesing',
        author: 'Arxon',
      },
      sections: {
        intro:
          'Kunstig intelligens transformerer måten bedrifter håndterer kundeinteraksjoner på. AI-telefonsvar kan redusere saksbehandlingstid, forbedre kundeopplevelses og senke kostnader. Men med denne innovasjonen kommer viktige juridiske forpliktelser – spesielt innen personvern og datavern. Som bedrift som implementerer AI-telefonsvar, må du forstå hvordan GDPR og det nye EU-AI-loven påvirker din drift. Denne artikkelen gir deg en fullstendig veiledning.',
        section1Title: 'GDPR i Norge – Det juridiske grunnlaget',
        section1Content: `Norge er ikke medlemsstat av EU, men er bundet til Europas datavernregelwerk gjennom EØS-avtalen (Europeiske Økonomiske Samarbeidsområde). GDPR ble gjeldende i Norge fra 20. juli 2018, samtidig som i EU-landene.

Norge har også egne datavернregler: Personopplysningsloven, som implementerer GDPR-direktivet inn i norsk lov. Denne loven styrer hvordan organisasjoner behandler personopplysninger om individer som befinner seg eller har tilknytning til Norge.

Datatilsynet (Norwegian Data Protection Authority) er norsk myndighet for databeskyttelse. De er ansvarlige for å håndheve GDPR og Personopplysningsloven, samt å gi veiledning og tilsyn. Datatilsynet har gjentatte ganger understreket viktigheten av å overholde datavernreglene når organisasjoner implementerer nye teknologier.`,
        section2Title: 'Det nye EU-AI-loven – En regulatorisk ramme for Norge',
        section2Content: `Parallelt med GDPR arbeider EU med en omfattende ramme for kunstig intelligens: EU-AI-loven (AI Act). Denne loven skal implementeres gradvis, og antas å tre i kraft i Norge rundt august 2026.

EU-AI-loven etablerer en risikobasert tilnærming til AI-systemer:

**4-lags risikokategorisering:**
1. Minimal risiko: Systemer som ikke har kjent risiko for sikkerhet eller grunnleggende rettigheter
2. Begrenset risiko: Systemer som krever transparens og brukerkunnskap (som chatboter som ikke avslører automatisk)
3. Høy risiko: Systemer som påvirker grunnleggende rettigheter, sysselsetting, eller rettssystemet
4. Uakseptabel risiko: Systemer som skal forbydes fordi de har uakseptabel risiko

AI-telefonsvar som brukes til kundeservice vanligvis klassifiseres som begrenset eller høy risiko, avhengig av:
- Hvor sensitiv data behandles
- Hvorvidt samtaler lagres og behandles
- Hvordan opplysninger brukes videre
- Transparens i systemet

For bedrifter som Arxon betyder dette at strenge krav til dokumentasjon, testing, og overvåking av AI-systemet må oppfylles.`,
        section3Title: 'Samtaleopptakelser som persondata – Sentralt for AI-telefonsvar',
        section3Content: `Når en AI-løsning håndterer telefonsamtaler, skjer noe kritisk fra et personvernperspektiv: opptakene eller den tekstuelle transkripsjonen av samtalene blir klassifisert som persondata.

En samtaleopptaking som inneholder stemme eller navn fra kundinnen er automatisk persondata under GDPR. Dette betyr at organisasjonen som lagrer opptaket er en datakontroller (eller databehandler hvis de har avtale med tredjeparter).

**Juridiske konsekvenser:**
- Du må ha et gyldig juridisk grunnlag for å lagre og behandle opptakene
- Du må oppfylle dataminimeringsprinsippet (bare lagre det du faktisk trenger)
- Du må oppfylle oppbevaringsbegrensninger (slett data når formålet er oppfylt)
- Du må ha klare og transparente retningslinjer for sletting
- Du må innhente uttrykkelig samtykke eller ha juridisk hjemmel

Mange bedrifter gjør kritiske feil her: de lagrer opptakene lengre enn nødvendig, de deler dem med tredjeparter uten juridisk hjemmel, eller de mangler klare sletteprosedyrer.`,
        section4Title: 'Kritiske krav for AI-telefonsvar',
        section4Content: `For å overholde GDPR og forberede deg på EU-AI-loven, må du adressere følgende områder:

**1. Juridisk grunnlag**
Du kan ikke lagre samtaleopptakinger bare fordi det er praktisk. Du må ha ett av disse juridiske grunnlagene:
- Uttrykkelig samtykke fra den enkelte
- Lovlig kontrakt (f.eks. avtale med kunde)
- Lovlig plikter (f.eks. regnskap for selskapet)
- Beskyttelse av vitale interesser
- Offentlig oppgave
- Berettigede interesser (med balansering av personvern)

**2. Dataminimering**
Lagre bare opplysninger som er nødvendige for formålet. Hvis du bare trenger å vite hva kunden spørte om, trenger du kanskje ikke deres navn eller kontaktinformasjon.

**3. Oppbevaringsbegrensninger**
Definer klare retningslinjer for hvor lenge opptakene oppbevares. Hvis en kunde ringer for å spørre om en ordre, lagres opptaket for gjennomgang i 3 måneder, deretter slettes det automatisk.

**4. Sletteprosedyrer**
Implementer automatiserte sletteprosesser slik at gamle opptakinger slettes uten manuell inngripen. Dette reduserer risikoen for brudd.

**5. Klart samtykke**
Hvis du er avhengig av samtykke, må det være:
- Frivillig (ikke tvungent for å få tjenesten)
- Spesifikt (klart hva som samles og hvorfor)
- Informert (personen må forstå)
- Bekreftende (aktivt valg, ikke stilletiende)

**6. Transparente retningslinjer**
Din personvernveiledning må klart forklare:
- Hva du samler inn
- Hvorfor
- Hvor lenge det lagres
- Hvem som har tilgang
- Rettigheter personen har
- Hvordan de kan kontakte deg med spørsmål`,
        section5Title: 'Hvordan Arxon håndterer GDPR og AI-sikkerhet',
        section5Content: `Arxon er designet med datavern fra starten. Her er hvordan vi sikrer at dine AI-telefonsvarer oppfyller de strengeste datavernstandarder:

**1. Kryptert lagring innenfor EØS**
All lagring av samtaleopptakinger og transkripsjoner skjer på krypterte servere lokalisert innenfor EØS. Dette sikrer at dine data aldri forlater det regulatoriske området som GDPR dekker, og oppfyller kravene til datatransmisjon.

**2. GDPR-kompatible databehandleravtaler (DPA)**
Vi inngår formelle databehandleravtaler (Data Processing Agreements) med alle kunder som sikrer at Arxon behandler data utelukkende på dine instruksjoner, og implementerer alle nødvendige sikkerhetstiltak.

**3. Automatisk sletting**
Dine opptakinger slettes automatisk etter den varighet du definerer – standardinnstillingen er 90 dager. Du kan konfigurere dette basert på dine juridiske behov. Ingen manuell inngripen nødvendig.

**4. Ingen deling med tredjeparter**
Vi deler aldri dine opptakinger, transkripsjoner eller metadata med markedsføringsselskaper, analyseplattformer, eller andre tredjepart uten din eksplisitte samtykke og avtale.

**5. Transparent logging**
Du får full tilgang til logger som viser hvem som har tilgang til dine opptakinger og når. Dette sikrer full transparens og revisjonsspor.

**6. Inkludert compliance-dokumentasjon**
Vi gir kunder dokumentasjon som er nødvendig for GDPR-samsvar, inkludert veiledning for RoPA (Records of Processing Activity) som du må vedlikeholde.`,
        section6Title: 'Datatilsynets rolle – Og regulatorisk sandkasse for AI',
        section6Content: `Datatilsynet er ikke bare en kontrollorgan – de er også innovative når det gjelder nye teknologier. I 2024 etablerte Datatilsynet et såkalt "regulatorisk sandkasse"-program for AI-utvikling.

Dette programmet tillater selskaper som Arxon å samarbeide direkte med Datatilsynet for å teste og validere AI-systemer i et mer fleksibelt regelverksramme, før det blir fullt implementert. Målet er å fremme innovasjon mens man sikrer datavern.

Hvis du implementerer AI-løsninger, anbefaler vi:
- Følg Datatilsynets veiledninger og beste praksis
- Hold deg oppdatert på deres nye direktiver
- Vurder å delta i deres sandkasse-programmer hvis du er en innovativt fokusert organisasjon
- Kontakt Datatilsynet hvis du har usikkerhet om hvorvidt dine implementeringer er kompatible`,
        section7Title: 'En praktisk sjekkliste for AI-telefonsvar-implementering',
        section7Content: `Før du implementerer eller oppgrader AI-telefonsvar, gjennomgå denne sjekklisten:`,
        checklistItems: [
          'Dokumenter hvilket juridisk grunnlag du har for samtaleopptakinger',
          'Definer maksimal oppbevaringstid og implementer automatisk sletting',
          'Opprett eller oppdater din personvernveiledning for å reflektere AI-systemet',
          'Innhent samtykke eller bekreftet opt-in hvis det er påkrevd',
          'Implementer dataminimering – lagre bare det du trenger',
          'Etabler en databehandleravtale (DPA) hvis du bruker en leverandør',
          'Sett opp logging og revisjonsspor for all tilgang til opptakinger',
          'Trening av ansatte på datavern og AI-sikkerhet',
          'Gjennomfør en Data Protection Impact Assessment (DPIA) hvis systemet er høy-risiko',
          'Opprett en prosess for å håndtere personvernutfordringer eller klager',
        ],
        section8Title: 'Konklusjon – Innovasjon og ansvar',
        section8Content: `AI-telefonsvar er en kraftig teknologi som kan transformere kundeservice. Men med kraft kommer ansvar. GDPR, Personopplysningsloven, og det kommende EU-AI-loven setter klare standarder for hvordan AI må implementeres ansvarlig.

De beste bedriftene vil ikke se GDPR som en byrde, men som en mulighet til å bygge tillit med kundene sine. Når du kan garantere at personverndata er sikret, at opptakinger slettes automatisk, og at hele systemet er transparent – det differensierer deg fra konkurrentene.

Arxon er designet for å gjøre denne jobben enklere. Vi håndterer kompleksiteten bak kulissene slik at du kan fokusere på å gi utmerket kundeservice.`,
        ctaHeading: 'Klar til å implementere AI-telefonsvar som oppfyller høyeste datavern-standarder?',
        ctaText:
          'La oss hjelpe deg med en kartlegging av dine behov og hvordan Arxon kan støtte din organisasjon.',
        ctaButton: 'Start kartlegging',
        sources: [
          'GDPR, Regulation (EU) 2016/679',
          'Norsk Personopplysningslov (2018)',
          'Datatilsynet - Norwegian Data Protection Authority',
          'EU AI Act (Regulation 2024/1689)',
          'Datatilsynet: AI and the GDPR',
          'EØS-avtalen, Vedlegg XI (databeskyttelse)',
        ],
      },
    },
    en: {
      navItems: [
        { href: '/', label: 'Home' },
        { href: '/mobilsvarer', label: 'AI Answering Service' },
        { href: '/blogg', label: 'Blog' },
        { href: '/om-oss', label: 'About Us' },
      ],
      breadcrumb: 'Back to blog',
      title: 'GDPR and AI Phone Answering: Everything You Need to Know',
      subtitle:
        'A complete guide to data protection regulations affecting artificial intelligence in phone answering services',
      meta: {
        date: 'February 21, 2026',
        readTime: '8 min read',
        author: 'Arxon',
      },
      sections: {
        intro:
          'Artificial intelligence is transforming how businesses handle customer interactions. AI phone answering services can reduce response times, improve customer experience, and lower costs. But with this innovation comes significant legal obligations – particularly regarding privacy and data protection. As a business implementing AI phone answering, you must understand how GDPR and the new EU AI Act affect your operations. This article provides you with a complete guide.',
        section1Title: 'GDPR in Norway – The Legal Foundation',
        section1Content: `Norway is not an EU member state, but is bound to Europe's data protection framework through the EEA Agreement (European Economic Area). GDPR became applicable in Norway from July 20, 2018, the same time as in EU countries.

Norway also has its own data protection rules: the Personal Data Act (Personopplysningsloven), which implements the GDPR directive into Norwegian law. This law governs how organizations process personal data of individuals located in or connected to Norway.

Datatilsynet (Norwegian Data Protection Authority) is Norway's data protection authority. They are responsible for enforcing GDPR and the Personal Data Act, as well as providing guidance and supervision. Datatilsynet has repeatedly emphasized the importance of complying with data protection rules when organizations implement new technologies.`,
        section2Title: 'The New EU AI Act – A Regulatory Framework for Norway',
        section2Content: `In parallel with GDPR, the EU is developing a comprehensive framework for artificial intelligence: the EU AI Act. This law is being implemented gradually and is expected to come into force in Norway around August 2026.

The EU AI Act establishes a risk-based approach to AI systems:

**4-Tier Risk Classification:**
1. Minimal Risk: Systems with no known risk to safety or fundamental rights
2. Limited Risk: Systems requiring transparency and user awareness (such as chatbots that don't automatically disclose their nature)
3. High Risk: Systems affecting fundamental rights, employment, or the justice system
4. Unacceptable Risk: Systems prohibited because they pose unacceptable risks

AI phone answering services used for customer service are typically classified as limited or high risk, depending on:
- How sensitive data is processed
- Whether calls are recorded and processed
- How information is used further
- Transparency in the system

For companies like Arxon, this means strict requirements for documentation, testing, and monitoring of the AI system must be met.`,
        section3Title: 'Call Recordings as Personal Data – Central to AI Phone Answering',
        section3Content: `When an AI solution handles phone calls, something critical happens from a privacy perspective: the recordings or text transcriptions of the calls become classified as personal data.

A call recording containing the voice or name of a customer is automatically personal data under GDPR. This means the organization storing the recording is a data controller (or data processor if they have an agreement with a third party).

**Legal Consequences:**
- You must have a valid legal basis for storing and processing the recordings
- You must comply with the data minimization principle (only store what you actually need)
- You must respect retention limits (delete data when the purpose is fulfilled)
- You must have clear and transparent deletion procedures
- You must obtain explicit consent or have a legal basis

Many businesses make critical mistakes here: they retain recordings longer than necessary, share them with third parties without legal basis, or lack clear deletion procedures.`,
        section4Title: 'Critical Requirements for AI Phone Answering',
        section4Content: `To comply with GDPR and prepare for the EU AI Act, you must address the following areas:

**1. Legal Basis**
You cannot store call recordings simply because it's convenient. You must have one of these legal bases:
- Explicit consent from the individual
- Legitimate contract (e.g., agreement with customer)
- Legal obligations (e.g., company accounting)
- Protection of vital interests
- Public task
- Legitimate interests (with balancing of privacy)

**2. Data Minimization**
Store only information necessary for the purpose. If you only need to know what the customer asked about, you may not need their name or contact information.

**3. Storage Limitations**
Define clear policies for how long recordings are retained. If a customer calls to ask about an order, the recording is stored for review for 3 months, then automatically deleted.

**4. Deletion Procedures**
Implement automated deletion processes so old recordings are deleted without manual intervention. This reduces the risk of breach.

**5. Clear Consent**
If you rely on consent, it must be:
- Voluntary (not required to receive the service)
- Specific (clear what is collected and why)
- Informed (the person must understand)
- Affirmative (active choice, not silence)

**6. Transparent Policies**
Your privacy policy must clearly explain:
- What you collect
- Why
- How long it is stored
- Who has access
- Rights the person has
- How to contact you with questions`,
        section5Title: 'How Arxon Handles GDPR and AI Security',
        section5Content: `Arxon is designed with data protection from the start. Here's how we ensure your AI phone answering services meet the strictest data protection standards:

**1. Encrypted Storage Within the EEA**
All storage of call recordings and transcriptions happens on encrypted servers located within the EEA. This ensures your data never leaves the regulatory area that GDPR covers, and meets data transmission requirements.

**2. GDPR-Compliant Data Processing Agreements (DPA)**
We enter into formal Data Processing Agreements (DPA) with all customers that ensure Arxon processes data only on your instructions, and implements all necessary security measures.

**3. Automatic Deletion**
Your recordings are automatically deleted after the duration you define – the default is 90 days. You can configure this based on your legal needs. No manual intervention required.

**4. No Sharing With Third Parties**
We never share your recordings, transcriptions, or metadata with marketing companies, analytics platforms, or other third parties without your explicit consent and agreement.

**5. Transparent Logging**
You get full access to logs showing who has accessed your recordings and when. This ensures complete transparency and audit trails.

**6. Included Compliance Documentation**
We provide customers with documentation necessary for GDPR compliance, including guidance for RoPA (Records of Processing Activity) that you must maintain.`,
        section6Title: "Datatilsynet's Role – And AI Regulatory Sandbox",
        section6Content: `Datatilsynet is not just a control authority – they are also innovative when it comes to new technologies. In 2024, Datatilsynet established a "regulatory sandbox" program for AI development.

This program allows companies like Arxon to collaborate directly with Datatilsynet to test and validate AI systems in a more flexible regulatory framework, before full implementation. The goal is to promote innovation while ensuring data protection.

If you are implementing AI solutions, we recommend:
- Follow Datatilsynet's guidance and best practices
- Stay updated on their new directives
- Consider participating in their sandbox programs if you are an innovation-focused organization
- Contact Datatilsynet if you are uncertain whether your implementations are compatible`,
        section7Title: 'A Practical Checklist for AI Phone Answering Implementation',
        section7Content: `Before implementing or upgrading AI phone answering, review this checklist:`,
        checklistItems: [
          'Document what legal basis you have for call recordings',
          'Define maximum retention time and implement automatic deletion',
          'Create or update your privacy policy to reflect the AI system',
          'Obtain consent or confirmed opt-in if required',
          'Implement data minimization – store only what you need',
          'Establish a Data Processing Agreement (DPA) if using a vendor',
          'Set up logging and audit trails for all access to recordings',
          'Train employees on data protection and AI security',
          'Conduct a Data Protection Impact Assessment (DPIA) if the system is high-risk',
          'Create a process for handling privacy concerns or complaints',
        ],
        section8Title: 'Conclusion – Innovation and Responsibility',
        section8Content: `AI phone answering is a powerful technology that can transform customer service. But with power comes responsibility. GDPR, the Personal Data Act, and the upcoming EU AI Act set clear standards for how AI must be implemented responsibly.

The best companies will not see GDPR as a burden, but as an opportunity to build trust with their customers. When you can guarantee that personal data is secure, that recordings are automatically deleted, and that the entire system is transparent – that differentiates you from competitors.

Arxon is designed to make this job easier. We handle the complexity behind the scenes so you can focus on delivering excellent customer service.`,
        ctaHeading:
          'Ready to implement AI phone answering that meets the highest data protection standards?',
        ctaText:
          'Let us help you with a needs assessment and how Arxon can support your organization.',
        ctaButton: 'Start assessment',
        sources: [
          'GDPR, Regulation (EU) 2016/679',
          'Norwegian Personal Data Act (2018)',
          'Datatilsynet - Norwegian Data Protection Authority',
          'EU AI Act (Regulation 2024/1689)',
          'Datatilsynet: AI and the GDPR',
          'EEA Agreement, Annex XI (data protection)',
        ],
      },
    },
  };

  const t = content[language];

  return (
    <>
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            background-color: #050510;
            color: #e8e8e8;
            font-family: 'DM Sans', sans-serif;
            line-height: 1.6;
            overflow-x: hidden;
          }

          .nav-container {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(5, 5, 16, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(201, 169, 110, 0.1);
          }

          nav {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.2rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .nav-logo {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            font-weight: 700;
            color: #c9a96e;
            text-decoration: none;
            letter-spacing: 1px;
          }

          .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
            list-style: none;
          }

          .nav-links a {
            color: #e8e8e8;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            transition: color 0.3s ease;
          }

          .nav-links a:hover {
            color: #c9a96e;
          }

          .lang-toggle {
            background: none;
            border: 1px solid #c9a96e;
            color: #c9a96e;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .lang-toggle:hover {
            background: rgba(201, 169, 110, 0.1);
          }

          .article-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 4rem 2rem;
          }

          .breadcrumb {
            display: inline-block;
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid rgba(201, 169, 110, 0.2);
          }

          .breadcrumb a {
            color: #c9a96e;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .breadcrumb a:hover {
            text-decoration: underline;
          }

          .article-header {
            margin-bottom: 3rem;
          }

          h1 {
            font-family: 'Playfair Display', serif;
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 800;
            margin-bottom: 1rem;
            line-height: 1.2;
            color: #ffffff;
          }

          .article-subtitle {
            font-size: 1.25rem;
            color: #b8b8b8;
            margin-bottom: 1.5rem;
            font-weight: 400;
          }

          .article-meta {
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
            color: #888;
            font-size: 0.95rem;
            padding: 1.5rem 0;
            border-top: 1px solid rgba(201, 169, 110, 0.1);
            border-bottom: 1px solid rgba(201, 169, 110, 0.1);
          }

          .article-content {
            margin-top: 3rem;
          }

          .article-content > p {
            margin-bottom: 1.5rem;
            font-size: 1rem;
            line-height: 1.8;
            color: #d0d0d0;
          }

          h2 {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 700;
            margin-top: 3rem;
            margin-bottom: 1.5rem;
            color: #ffffff;
          }

          h3 {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #e8e8e8;
          }

          strong {
            color: #c9a96e;
            font-weight: 600;
          }

          .section {
            margin-bottom: 3rem;
          }

          .section p {
            margin-bottom: 1.5rem;
          }

          .checklist-box {
            background: linear-gradient(135deg, rgba(201, 169, 110, 0.1) 0%, rgba(201, 169, 110, 0.05) 100%);
            border-left: 4px solid #c9a96e;
            padding: 2rem;
            margin: 2rem 0;
            border-radius: 4px;
          }

          .checklist-box h3 {
            color: #c9a96e;
            margin-bottom: 1.5rem;
            font-size: 1.25rem;
          }

          .checklist-box ul {
            list-style: none;
          }

          .checklist-box li {
            padding: 0.75rem 0;
            padding-left: 2rem;
            position: relative;
            color: #d0d0d0;
          }

          .checklist-box li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #c9a96e;
            font-weight: bold;
            font-size: 1.2rem;
          }

          .sources {
            background: rgba(201, 169, 110, 0.05);
            border: 1px solid rgba(201, 169, 110, 0.2);
            padding: 1.5rem;
            border-radius: 4px;
            margin-top: 3rem;
            margin-bottom: 3rem;
          }

          .sources h4 {
            color: #c9a96e;
            margin-bottom: 1rem;
            font-size: 0.95rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .sources ul {
            list-style: none;
          }

          .sources li {
            color: #888;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
          }

          .sources li:before {
            content: '•';
            position: absolute;
            left: 0;
            color: #c9a96e;
          }

          .cta-section {
            background: linear-gradient(135deg, rgba(201, 169, 110, 0.15) 0%, rgba(201, 169, 110, 0.05) 100%);
            border: 1px solid rgba(201, 169, 110, 0.3);
            padding: 3rem;
            border-radius: 8px;
            text-align: center;
            margin-top: 4rem;
          }

          .cta-section h2 {
            color: #ffffff;
            margin-top: 0;
            margin-bottom: 1rem;
          }

          .cta-section p {
            color: #b8b8b8;
            margin-bottom: 2rem;
            font-size: 1.05rem;
          }

          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #c9a96e 0%, #d4b896 100%);
            color: #0a0a0f;
            padding: 1rem 2.5rem;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(201, 169, 110, 0.3);
          }

          @media (max-width: 768px) {
            nav {
              flex-direction: column;
              gap: 1.5rem;
            }

            .nav-links {
              flex-direction: column;
              gap: 1rem;
              width: 100%;
              text-align: center;
            }

            .article-container {
              padding: 2rem 1rem;
            }

            h1 {
              font-size: 1.75rem;
            }

            h2 {
              font-size: 1.5rem;
            }

            .article-meta {
              flex-direction: column;
              gap: 1rem;
            }

            .cta-section {
              padding: 2rem 1.5rem;
            }
          }
        `}</style>
      <div className="nav-container">
          <nav>
            <Link href="/" className="nav-logo">
              ARXON
            </Link>
            <ul className="nav-links">
              {t.navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <button
              className="lang-toggle"
              onClick={() => setLanguage(language === 'no' ? 'en' : 'no')}
            >
              {language === 'no' ? 'English' : 'Norsk'}
            </button>
          </nav>
        </div>

        <div className="article-container">
          <Link href="/blogg" className="breadcrumb">
            ← {t.breadcrumb}
          </Link>

          <article>
            <header className="article-header">
              <h1>{t.title}</h1>
              <p className="article-subtitle">{t.subtitle}</p>
              <div className="article-meta">
                <span>{t.meta.date}</span>
                <span>{t.meta.readTime}</span>
                <span>Av {t.meta.author}</span>
              </div>
            </header>

            <div className="article-content">
              <section className="section">
                <RenderContent text={t.sections.intro} />
              </section>

              <section className="section">
                <h2>{t.sections.section1Title}</h2>
                <RenderContent text={t.sections.section1Content} />
              </section>

              <section className="section">
                <h2>{t.sections.section2Title}</h2>
                <RenderContent text={t.sections.section2Content} />
              </section>

              <section className="section">
                <h2>{t.sections.section3Title}</h2>
                <RenderContent text={t.sections.section3Content} />
              </section>

              <section className="section">
                <h2>{t.sections.section4Title}</h2>
                <RenderContent text={t.sections.section4Content} />
              </section>

              <section className="section">
                <h2>{t.sections.section5Title}</h2>
                <RenderContent text={t.sections.section5Content} />
              </section>

              <section className="section">
                <h2>{t.sections.section6Title}</h2>
                <RenderContent text={t.sections.section6Content} />
              </section>

              <section className="section">
                <h2>{t.sections.section7Title}</h2>
                <RenderContent text={t.sections.section7Content} />
                <div className="checklist-box">
                  <h3>
                    {language === 'no' ? 'GDPR Samsvarsjekkliste' : 'GDPR Compliance Checklist'}
                  </h3>
                  <ul>
                    {t.sections.checklistItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="section">
                <h2>{t.sections.section8Title}</h2>
                <RenderContent text={t.sections.section8Content} />
              </section>

              <div className="sources">
                <h4>{language === 'no' ? 'Kilder og referanser' : 'Sources and References'}</h4>
                <ul>
                  {t.sections.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>

              <div className="cta-section">
                <h2>{t.sections.ctaHeading}</h2>
                <p>{t.sections.ctaText}</p>
                <Link href="/kartlegging" className="cta-button">
                  {t.sections.ctaButton}
                </Link>
              </div>
            </div>
          </article>
        </div>

        {/* Footer */}
        <footer style={{
          maxWidth: 1100, margin: '0 auto', padding: '48px 24px 36px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32, marginBottom: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src="/arxon-icon.png" alt="Arxon" style={{ width: 24, height: 24 }} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Arxon</span>
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
                Intelligent AI-automatisering for norske bedrifter.
              </span>
            </div>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Tjenester</span>
                <Link href="/mobilsvarer" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>AI Mobilsvarer</Link>
                <Link href="/pakkebygger" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Priser</Link>
                <Link href="/kartlegging" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Gratis kartlegging</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Kontakt</span>
                <a href="mailto:kontakt@arxon.no" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>kontakt@arxon.no</a>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Oslo, Norge</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Juridisk</span>
                <Link href="/personvern" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Personvern</Link>
                <Link href="/vilkar" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Vilkår for bruk</Link>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>&copy; {new Date().getFullYear()} Arxon. Alle rettigheter reservert.</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>GDPR-kompatibel · Norsk datasenter</span>
          </div>
        </footer>
    </>
  );
}
