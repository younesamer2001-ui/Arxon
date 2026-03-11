import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import { LanguageProvider } from '@/lib/language-context'
import { GeoProvider } from '@/lib/geo-context'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
})

const ChatWidget = dynamic(() => import('./components/ChatWidget'), { ssr: false })
const CookieConsent = dynamic(() => import('./components/CookieConsent'), { ssr: false })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050510',
}

export const metadata: Metadata = {
  title: 'Arxon — AI-telefonsvarer og automatisering for norske bedrifter',
  description: 'Aldri mist en kunde igjen. Arxon sin AI svarer telefonen 24/7, booker møter automatisk og kvalifiserer leads — slik at du kan fokusere på det du gjør best. Gratis kartlegging på 2 minutter.',
  icons: { icon: '/favicon.ico' },
  keywords: ['AI telefonsvarer', 'AI automatisering', 'norsk bedrift', 'AI mobilsvarer', 'automatisk booking', 'lead kvalifisering', 'kundeservice AI', 'chatbot bedrift'],
  authors: [{ name: 'Arxon' }],
  creator: 'Arxon',
  publisher: 'Arxon',
  metadataBase: new URL('https://arxon.no'),
  alternates: {
    canonical: 'https://arxon.no',
  },
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    url: 'https://arxon.no',
    siteName: 'Arxon',
    title: 'Arxon — AI som svarer telefonen og booker kunder for deg',
    description: 'Små bedrifter taper 15 000–25 000 kr/mnd på ubesvarte anrop. Arxon sin AI svarer 24/7, booker møter og kvalifiserer leads automatisk. Start gratis kartlegging.',
    images: [
      {
        url: '/arxon-og.png',
        width: 1200,
        height: 630,
        alt: 'Arxon — Intelligent AI for norske bedrifter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arxon — AI-telefonsvarer for norske bedrifter',
    description: 'AI som svarer telefonen 24/7, booker møter og kvalifiserer leads. Gratis kartlegging på 2 min.',
    images: ['/arxon-og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* JSON-LD structured data: Organization + WebSite + FAQPage */
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Arxon',
    url: 'https://arxon.no',
    logo: 'https://arxon.no/arxon-icon.png',
    description: 'AI-automatisering og telefonsvarer for norske bedrifter',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Oslo',
      addressCountry: 'NO',
    },
    sameAs: [
      'https://linkedin.com/company/arxon',
      'https://instagram.com/arxon.no',
      'https://facebook.com/arxon.no',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'kontakt@arxon.no',
      telephone: '', // TODO: Add phone number when ENK is registered
      contactType: 'customer service',
      availableLanguage: ['Norwegian', 'English'],
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Arxon',
    url: 'https://arxon.no',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Er kartleggingen virkelig gratis?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja, 100% gratis og uforpliktende. Du får en fullstendig AI-analyse med anbefalinger, ROI-beregning og prisestimat uten å betale noe.',
        },
      },
      {
        '@type': 'Question',
        name: 'Hvor lang tid tar kartleggingen?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Selve spørreskjemaet tar 2–3 minutter. AI-en analyserer svarene dine umiddelbart, og du kan se resultatene med en gang.',
        },
      },
      {
        '@type': 'Question',
        name: 'Hva skjer med dataene mine?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All data lagres kryptert innen EØS. Vi følger GDPR og er EU AI Act-klare. Vi deler aldri data med tredjeparter.',
        },
      },
      {
        '@type': 'Question',
        name: 'Trenger jeg teknisk kunnskap?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nei! Vi tar oss av alt teknisk. Spørsmålene handler om din bedrift og dine utfordringer — ikke om teknologi.',
        },
      },
      {
        '@type': 'Question',
        name: 'Hva hvis AI ikke passer for min bedrift?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Da forteller analysen deg det. Vi er ærlige — hvis AI ikke gir nok verdi, anbefaler vi det ikke. Ingen bindinger.',
        },
      },
    ],
  }

  return (
    <html lang="no" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Analytics - DISABLED - TODO: Add GA measurement ID when Google account is created */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', {
                'analytics_storage': 'granted'
              });
              gtag('config', 'G-XXXXXXXXXX', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        /> */}
        {/* Cal.com Embed Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.eu/embed/embed.js", "init");
              Cal("init", "gratis-ai-konsultasjon", {origin:"https://app.cal.eu"});
              Cal.ns["gratis-ai-konsultasjon"]("ui", {"styles":{"branding":{"brandColor":"#c9a96e"}},"hideEventTypeDetails":false,"layout":"month_view"});
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="min-h-screen antialiased" style={{ backgroundColor: '#050510', color: '#f4f1eb' }}>
        <a href="#main-content" className="skip-to-content">Hopp til hovedinnhold</a>
        <AuthProvider>
          <LanguageProvider>
            <GeoProvider>
              <main id="main-content">
                {children}
              </main>
            </GeoProvider>
          </LanguageProvider>
        </AuthProvider>
        <ChatWidget />
        <CookieConsent />
      </body>
    </html>
  )
}
