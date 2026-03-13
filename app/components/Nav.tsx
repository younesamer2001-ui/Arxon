'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Globe, LogIn, Menu, X } from 'lucide-react'
import { gold, goldRgb, bg, fonts } from '@/lib/constants'
import { useLanguage } from '@/lib/language-context'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu-1'

interface NavProps {
  sticky?: boolean
}

export default function Nav({ sticky = false }: NavProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang } = useLanguage()

  const serviceItems = lang === 'no'
    ? [
        { href: '/tjenester', title: 'AI Receptionist', description: 'Intelligente voice-agenter som kvalifiserer leads.' },
        { href: '/tjenester', title: 'AI Chat Assistant', description: 'Automatiser support og øk konverteringen.' },
        { href: '/tjenester', title: 'Workflow Automations', description: 'Koble systemer og fjern manuelt arbeid.' },
      ]
    : [
        { href: '/tjenester', title: 'AI Receptionist', description: 'Intelligent voice agents that qualify leads.' },
        { href: '/tjenester', title: 'AI Chat Assistant', description: 'Automate support and boost conversions.' },
        { href: '/tjenester', title: 'Workflow Automations', description: 'Connect systems and eliminate manual work.' },
      ]

  const servicesLabel = lang === 'no' ? 'Tjenester' : 'Services'

  const staticLinks = lang === 'no'
    ? [
        { href: '/bransjer', label: 'Bransjer' },
        { href: '/integrasjoner', label: 'Integrasjoner' },
        { href: '/priser', label: 'Priser' },
        { href: '/om-oss', label: 'Om oss' },
      ]
    : [
        { href: '/bransjer', label: 'Industries' },
        { href: '/integrasjoner', label: 'Integrations' },
        { href: '/priser', label: 'Pricing' },
        { href: '/om-oss', label: 'About us' },
      ]

  return (
    <>
      <nav
        style={{
          background: '#000',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 90,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 52,
          }}
        >
          {/* Left: Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Image src="/arxon-icon.png" alt="Arxon" width={28} height={28} priority />
            <span
              style={{
                fontFamily: fonts.body,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#fff',
              }}
            >
              Arxon
            </span>
          </Link>

          {/* Center: Navigation Menu */}
          <div className="hide-mob" style={{ display: 'flex', alignItems: 'center' }}>
            <NavigationMenu>
              <NavigationMenuList>
                {/* Frameworks — has dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent text-white/70 hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white data-[popup-open]:bg-white/5 data-[popup-open]:text-white text-[13px]"
                  >
                    {servicesLabel}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[340px] gap-1 p-1">
                      {serviceItems.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink
                            render={<Link href={item.href} />}
                            className="hover:bg-white/5 focus:bg-white/5 rounded-md text-white/90"
                          >
                            <div className="text-sm font-medium leading-none text-white">{item.title}</div>
                            <p className="text-white/50 line-clamp-2 text-xs leading-snug">{item.description}</p>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Static links */}
                {staticLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink
                      render={
                        <Link
                          href={link.href}
                          className={navigationMenuTriggerStyle({
                            className: 'bg-transparent text-white/70 hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white text-[13px]',
                          })}
                        />
                      }
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>

              <NavigationMenuPositioner>
                <NavigationMenuPopup className="bg-[#111] border border-white/10 shadow-2xl" />
              </NavigationMenuPositioner>
            </NavigationMenu>
          </div>

          {/* Right: CTA + mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="hide-mob"
              onClick={() => router.push('/kartlegging')}
              style={{
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                padding: '8px 20px',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: fonts.body,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#222')}
            >
              {lang === 'no' ? 'Book a Consultation' : 'Book a Consultation'}
            </button>

            {/* Mobile hamburger */}
            <div className="show-mob" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => router.push('/kartlegging')}
                style={{
                  background: '#222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 999,
                  padding: '7px 16px',
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: fonts.body,
                }}
              >
                Book
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  padding: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {menuOpen ? <X size={20} color="rgba(255,255,255,0.7)" /> : <Menu size={20} color="rgba(255,255,255,0.7)" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 95,
            background: 'rgba(0,0,0,0.98)',
            padding: '80px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: 7,
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={20} color="rgba(255,255,255,0.7)" />
          </button>
          {[
            { href: '/tjenester', label: servicesLabel },
            ...staticLinks,
          ].map((l) => (
            <button
              key={l.href + l.label}
              onClick={() => {
                setMenuOpen(false)
                router.push(l.href)
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 18,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: fonts.body,
                textAlign: 'left',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
