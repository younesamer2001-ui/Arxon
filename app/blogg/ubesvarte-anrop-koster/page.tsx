'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
const gold = '#c9a96e';
const goldRgb = '201,169,110';
const bg = '#050510';

export default function UbesvarteAnropPage() {
  const [langToggle, setLangToggle] = useState('no');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          background-color: ${bg};
          color: #e0e0e0;
          font-family: 'DM Sans', sans-serif;
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(${goldRgb}, 0.1);
          position: sticky;
          top: 0;
          background: rgba(5, 5, 16, 0.95);
          backdrop-filter: blur(10px);
          z-index: 100;
        }

        .nav-left {
          display: flex;
          gap: 3rem;
          align-items: center;
        }

        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: ${gold};
          text-decoration: none;
          letter-spacing: -0.5px;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .nav-links a {
          text-decoration: none;
          color: #e0e0e0;
          font-size: 0.95rem;
          transition: color 0.3s ease;
          position: relative;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: ${gold};
          transition: width 0.3s ease;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .lang-toggle {
          background: rgba(${goldRgb}, 0.1);
          border: 1px solid ${gold};
          color: ${gold};
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }

        .lang-toggle:hover {
          background: ${gold};
          color: ${bg};
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: ${gold};
          text-decoration: none;
          margin-bottom: 2rem;
          font-size: 0.95rem;
          transition: gap 0.3s ease;
        }

        .back-link:hover {
          gap: 1rem;
        }

        .article-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .article-header {
          margin-bottom: 3rem;
        }

        .breadcrumb {
          font-size: 0.85rem;
          color: ${gold};
          margin-bottom: 1rem;
        }

        .article-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          color: #fff;
        }

        .article-meta {
          display: flex;
          gap: 2rem;
          font-size: 0.9rem;
          color: #a0a0a0;
          margin-bottom: 2rem;
        }

        .article-meta span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .hero-image {
          width: 100%;
          height: 400px;
          background: linear-gradient(135deg, rgba(${goldRgb}, 0.15) 0%, rgba(${goldRgb}, 0.05) 100%);
          border-radius: 8px;
          margin-bottom: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(${goldRgb}, 0.2);
          color: ${gold};
          font-size: 0.95rem;
        }

        .article-content {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .main-article {
          line-height: 1.8;
        }

        .main-article h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: #fff;
        }

        .main-article h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: ${gold};
        }

        .main-article p {
          margin-bottom: 1.5rem;
          color: #d0d0d0;
          font-size: 1rem;
        }

        .main-article strong {
          color: ${gold};
          font-weight: 700;
        }

        .stat-highlight {
          background: rgba(${goldRgb}, 0.08);
          border-left: 4px solid ${gold};
          padding: 1.5rem;
          margin: 2rem 0;
          border-radius: 4px;
          font-style: italic;
          color: #e0e0e0;
        }

        .sidebar {
          position: sticky;
          top: 120px;
          height: fit-content;
        }

        .stats-box {
          background: rgba(${goldRgb}, 0.1);
          border: 1px solid ${gold};
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .stats-box h4 {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: ${gold};
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .stat-item {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(${goldRgb}, 0.2);
        }

        .stat-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: ${gold};
          font-family: 'DM Sans', sans-serif;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #a0a0a0;
          margin-top: 0.5rem;
        }

        .cta-card {
          background: linear-gradient(135deg, rgba(${goldRgb}, 0.15) 0%, rgba(${goldRgb}, 0.05) 100%);
          border: 1px solid ${gold};
          border-radius: 8px;
          padding: 2.5rem;
          text-align: center;
          margin-top: 3rem;
        }

        .cta-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #fff;
        }

        .cta-card p {
          font-size: 1rem;
          color: #d0d0d0;
          margin-bottom: 1.5rem;
        }

        .cta-button {
          display: inline-block;
          background: ${gold};
          color: ${bg};
          padding: 1rem 2.5rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s ease;
          border: 2px solid ${gold};
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }

        .cta-button:hover {
          background: transparent;
          color: ${gold};
        }

        .source-note {
          font-size: 0.8rem;
          color: #808080;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(${goldRgb}, 0.1);
        }

        @media (max-width: 768px) {
          .nav {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .nav-left {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }

          .nav-links {
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }

          .nav-links a {
            font-size: 0.9rem;
          }

          .article-container {
            padding: 1.5rem 1rem;
          }

          .article-title {
            font-size: 1.8rem;
          }

          .article-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .sidebar {
            position: static;
            top: auto;
          }

          .hero-image {
            height: 250px;
          }

          .article-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .main-article h2 {
            font-size: 1.4rem;
          }

          .main-article h3 {
            font-size: 1.1rem;
          }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-left">
          <Link href="/" className="nav-logo">
            Arxon
          </Link>
          <ul className="nav-links">
            <li><Link href="/">Hjem</Link></li>
            <li><Link href="/mobilsvarer">Mobilsvarer</Link></li>
            <li><Link href="/blogg">Blogg</Link></li>
            <li><Link href="/om-oss">Om oss</Link></li>
          </ul>
        </div>
        <button
          className="lang-toggle"
          onClick={() => setLangToggle(langToggle === 'no' ? 'en' : 'no')}
        >
          {langToggle === 'no' ? 'EN' : 'NO'}
        </button>
      </nav>

      <div className="article-container">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Link href="/blogg" className="back-link">
            ← Tilbake til blogg
          </Link>

          <div className="article-header">
            <div className="breadcrumb">BLOGG / TELEFONI</div>
            <motion.h1 className="article-title" variants={itemVariants}>
              Hvor mye koster ubesvarte anrop norske bedrifter?
            </motion.h1>
            <div className="article-meta">
              <span>📅 21. februar 2026</span>
              <span>⏱️ 7 min lesing</span>
              <span>✍️ Arxon</span>
            </div>
          </div>

          <motion.div className="hero-image" variants={itemVariants} style={{ flexDirection: 'column', gap: '1.5rem', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            {/* Background decorative elements */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, rgba(${goldRgb}, 0.08) 0%, transparent 70%)` }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: `radial-gradient(circle, rgba(${goldRgb}, 0.05) 0%, transparent 70%)` }} />

            {/* Phone icon */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ filter: `drop-shadow(0 0 20px rgba(${goldRgb}, 0.3))` }}>
                <circle cx="28" cy="28" r="28" fill={`rgba(${goldRgb}, 0.1)`} />
                <circle cx="28" cy="28" r="20" fill={`rgba(${goldRgb}, 0.08)`} stroke={gold} strokeWidth="1" strokeDasharray="4 4" />
                <path d="M22 20c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2V20z" stroke={gold} strokeWidth="1.5" fill="none" />
                <circle cx="28" cy="34" r="1.5" fill={gold} />
                <line x1="25" y1="22" x2="31" y2="22" stroke={`rgba(${goldRgb}, 0.4)`} strokeWidth="1" />
                {/* Missed call waves */}
                <path d="M36 18c2 2 2 5 0 7" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
                <path d="M39 15c3.5 3.5 3.5 9 0 12.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
              </svg>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
              {[
                { num: '62%', label: 'ubesvarte anrop', color: '#ef4444' },
                { num: '85%', label: 'ringer ikke igjen', color: '#f59e0b' },
                { num: '13 000 kr', label: 'tapt per anrop', color: gold },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', minWidth: '120px' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.num}</div>
                  <div style={{ fontSize: '0.8rem', color: '#a0a0a0', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Subtitle */}
            <div style={{ fontSize: '0.85rem', color: '#808080', position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '400px' }}>
              Norske bedrifter taper millioner hvert år på telefoner som ingen svarer
            </div>
          </motion.div>

          <div className="article-content">
            <motion.article className="main-article" variants={itemVariants}>
              <p>
                En telefon som ringer og ringer uten å få svar. En potensiell kunde som gir opp og ringer konkurrenten i stedet.
                For norske bedrifter er dette daglig virkelighet, og kostnadene ved ubesvarte anrop er langt større enn mange
                innser. Når du ikke klarer å svare på det som kan være ditt viktigste kommunikasjonskanal, mister du ikke bare
                denne ene muligheten – du mister også fremtidlige kjøp, anbefalinger og omdømme.
              </p>

              <h2>Kundens første kontakt avgjør alt</h2>
              <p>
                Når noen ringer din bedrift, er det ikke tilfeldig. De har valgt deg fordi de har behov, og de forventer å få
                hjelp. Ifølge data fra IPFone vil <strong>85 prosent av anropene ikke forsøkes på nytt</strong> hvis de ikke blir
                besvart første gang. Det betyr at hver eneste ubesvart samtale representerer en potensielt tapt kunde.
              </p>

              <p>
                For tjenesteytingsbedrifter som elektrikere, rørleggere, og renovasjonsselskaper er situasjonen særlig kritisk.
                Disse bedriftene rapporterer at de mister hele <strong>62 prosent av innkommende anrop</strong>, noe som kan skyldes
                at de er ute på oppdrag eller helt enkelt ikke har ressurser til å håndtere alle samtalene som kommer inn.
              </p>

              <div className="stat-highlight">
                "Et ubesvart anrop til en tjenesteytingsbedrift koster i gjennomsnitt 13 000 kr – målt som tapt
                inntekt, ressursinvestering, og potensielle fremtidsverdier fra en kunde som aldri vendte tilbake."
              </div>

              <h2>Hva er den samlede kostnaden for norske SMB-er?</h2>
              <p>
                For å forstå skalaen på problemet, må vi se på dataene fra Dialora.ai, som viser at gjennomsnittlige små og
                mellomstore bedrifter (SMB-er) i OECD-land mister rundt <strong>1,4 millioner kr årlig</strong> på grunn av ubesvarte
                anrop. I norsk kontekst, hvor SMB-sektoren genererer omkring <strong>700 milliarder kr i årlig verdiskapning</strong>,
                er dette betydelig.
              </p>

              <p>
                Tallet blir enda mer slående når vi ser på det faktiske svarprosentene. Ifølge bransjebenchmark-data blir kun
                <strong>37,8 prosent av samtaler faktisk besvart</strong> ved første kontakt. Det betyr at nærmere 6 av 10 anrop
                som kommer inn ikke får en menneskelig respons. For bedrifter som er avhengig av kundekontakt – og det er stort
                sett alle – blir dette en kjempemessig tapsmotor.
              </p>

              <h3>Hvorfor blir så mange anrop ubesvart?</h3>
              <p>
                Det finnes flere årsaker til dette fenomenet. For det første er det ofte en ressursproblem: bedriftens telefoniansvarlig
                er opptatt med andre oppgaver, eller den eller de ansatte som skal håndtere telefonen er ikke tilgjengelig. For det
                andre kan det være at bedriften simpelthen ikke har budsjett til å ansette dedikert kundeservicepersonell. Og for det
                tredje – som ofte er tilfelle for tjenesteytere – er personalet ute hos kunder, og kan derfor ikke svare på telefonen.
              </p>

              <p>
                Den moderne arbeidsplassen og pandemien har også ændret dynamikken. Mange bedrifter jobber hybrid eller spredt over
                flere lokasjoner, noe som gjør det vanskeligere å håndtere en sentral telefoniløsning. Resultat: ubesvarte anrop.
              </p>

              <h2>Konsekvensene går dypere enn tall</h2>
              <p>
                Når en kunde ikke får svar, oppstår flere problemer samtidig. Først og fremst er det den direkte inntektstapet fra
                den enkelte transaksjon. En kunde som ringer for å bestille en tjeneste og får besked om at linjen er opptatt eller
                har ingen svar, vil i de fleste tilfeller finne konkurrenten i stedet.
              </p>

              <p>
                Men det er mer enn bare den tapte omsetningen. Det er også omdømmeskaden. Når folk ringer og ikke får svar, deler
                de ofte sine frustrasjoner på sosiale medier eller forteller det videre til venner og kollegaer. En negativ kundeopplevelse
                ved første kontakt kan koste deg mye mer enn den ene ordren.
              </p>

              <p>
                Og så er det ressurskostnaden ved å måtte oppfølge eller følge opp potensielle kunder som kanskje aldri ringer igjen.
                Hvis du kunne svart når de ringte første gang, ville du spare både tid og penger.
              </p>

              <h2>AI-drevet telefonsvarer: løsningen for norske bedrifter</h2>
              <p>
                I stedet for å la ubesvarte anrop bli til tapte kunder, kan moderne bedrifter implementere AI-drevet telefonsvarer som
                håndterer innkommende samtaler 24/7. Disse systemene kan:
              </p>

              <p>
                For det første kan de svare på hvert eneste anrop, uavhengig av tiden på døgnet. Hvis en kunde ringer klokken tre om
                natten eller på en fredag kveld, blir de møtt med en høflig, profesjonell respons i stedet for tomhetens uro.
              </p>

              <p>
                For det andre kan de kvalifisere anropet ved å stille spørsmål og samle informasjon, slik at du vet nøyaktig hva
                kunden ønsker når du returnerer oppringningen.
              </p>

              <p>
                For det tredje kan de omdirigere anrop basert på innhold. Hvis det er en akutt situasjon, kan systemet umiddelbart
                ringe ut til relevant personell eller SMS-varsle dem. Hvis det er en rutineforespørsel, kan informasjonen lagres og
                håndteres senere på en effektiv måte.
              </p>

              <p>
                Alt dette betyr at du ikke bare mister færre kunder – du får også bedre data om hva kundene dine vil, noe som hjelper
                deg å forbedre tjenestene dine.
              </p>

              <h2>Konklusjon: Ikke la ubesvarte anrop bli dine viktigste konkurrenter</h2>
              <p>
                Ubesvarte anrop koster norske bedrifter enormt mye penger og muligheter hvert eneste år. Med et gjennomsnittlig tap på
                1,4 millioner kr per SMB, og kun 37,8 prosent av anrop som besvares, er det klart at dette er et område hvor selv små
                forbedringer kan ha stor innvirkning.
              </p>

              <p>
                De gode nyhetene er at løsningen finnes og er tilgjengelig i dag. Ved å implementere en intelligent telefonsvarer som
                bruker AI til å håndtere anrop når du ikke kan, kan du gjenvinne enorme mengder tapt inntekt, forbedre kundetilfredsheten
                og frigjøre ressurser til kjernebedriften din.
              </p>

              <p>
                Det handler ikke bare om å svare på telefonene. Det handler om å svare på kundenes behov når det spiller seg av – uavhengig
                av tid og sted.
              </p>
            </motion.article>

            <motion.aside className="sidebar" variants={itemVariants}>
              <div className="stats-box">
                <h4>Nøkkeltall</h4>

                <div className="stat-item">
                  <div className="stat-number">1,4M kr</div>
                  <div className="stat-label">Årlig tap per SMB</div>
                </div>

                <div className="stat-item">
                  <div className="stat-number">37,8%</div>
                  <div className="stat-label">Besvarte anrop (industri)</div>
                </div>

                <div className="stat-item">
                  <div className="stat-number">85%</div>
                  <div className="stat-label">Ringer ikke igjen</div>
                </div>

                <div className="stat-item">
                  <div className="stat-number">62%</div>
                  <div className="stat-label">Ubesvarte anrop (service)</div>
                </div>

                <div className="stat-item">
                  <div className="stat-number">13 000 kr</div>
                  <div className="stat-label">Kost per ubesvart anrop</div>
                </div>

                <div className="stat-item">
                  <div className="stat-number">700 mrd kr</div>
                  <div className="stat-label">Årlig SME verdiskapning</div>
                </div>
              </div>
            </motion.aside>
          </div>

          <motion.div className="cta-card" variants={itemVariants}>
            <h3>Klar for å gjenvinne dine tapte anrop?</h3>
            <p>
              Få en personlig kartlegging av hvor mange kunder du mister hver måned på grunn av ubesvarte anrop.
              Helt gratis, helt uforpliktende.
            </p>
            <Link href="/kartlegging" className="cta-button">
              Start kartlegging
            </Link>
          </motion.div>

          <div className="source-note">
            <strong>Kilder:</strong> Dialora.ai industristudier (2025), IPFone telefonsvarestatistikk,
            bransjebenchmark for anropbehandling. Tall for norsk SME-sektor basert på SSB og Innovasjons Norge data.
          </div>
        </motion.div>
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
              <a href="/mobilsvarer" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>AI Mobilsvarer</a>
              <a href="/pakkebygger" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Priser</a>
              <a href="/kartlegging" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Gratis kartlegging</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Kontakt</span>
              <a href="mailto:kontakt@arxon.no" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>kontakt@arxon.no</a>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Oslo, Norge</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Juridisk</span>
              <a href="/personvern" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Personvern</a>
              <a href="/vilkar" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Vilkår for bruk</a>
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
