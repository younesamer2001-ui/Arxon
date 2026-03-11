'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Globe, LogIn, Menu, X } from 'lucide-react'
import { gold, goldRgb, bg, fonts } from '@/lib/constants'
import { useLanguage } from '@/lib/language-context'

interface NavProps {
  /** Use sticky nav with blur backdrop (like landing/pricing). Default: false (relative) */
  sticky?: boolean
}

export default function Nav({ sticky = false }: NavProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang } = useLanguage()

  const links = lang === 'no'
    ? [
        { href: '/tjenester', label: 'Tjenester' },
        { href: '/bransjer', label: 'Bransjer' },
        { href: '/integrasjoner', label: 'Integrasjoner' },
        { href: '/priser', label: 'Priser' },
        { href: '/om-oss', label: 'Om oss' },
      ]
    : [
        { href: '/tjenester', label: 'Services' },
        { href: '/bransjer', label: 'Industries' },
        { href: '/integrasjoner', label: 'Integrations' },
        { href: '/priser', label: 'Pricing' },
        { href: '/om-oss', label: 'About us' },
      ]

  const navStyle: React.CSSProperties = sticky
    ? {
        background: 'rgba(5,5,16,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid rgba(${goldRgb},0.1)`,
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }
    : {
        position: 'relative',
        zIndex: 10,
        maxWidth: 1100,
        margin: '0 auto',
        padding: '16px 24px',
      }

  const innerStyle: React.CSSProperties = sticky
    ? { maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }
    : { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }

  return (
    <>
      <nav style={navStyle}>
        <div style={innerStyle}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Image src="/arxon-icon.png" alt="Arxon" width={sticky ? 28 : 34} height={sticky ? 28 : 34} priority />
            <span style={{
              fontFamily: fonts.body,
              fontSize: sticky ? 16 : 20,
              fontWeight: 700,
              letterSpacing: sticky ? '2px' : '3px',
              textTransform: 'uppercase' as const,
              color: '#f0f0f0',
            }}>Arxon</span>
          </Link>
          <div className="hide-mob" style={{ display: 'flex', alignItems: 'center', gap: sticky ? 24 : 20 }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{
                color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13,
                transition: 'color 0.2s', fontFamily: fonts.body,
                outline: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.color = gold}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              onFocus={e => {
                e.currentTarget.style.outline = '2px solid #efc07b'
                e.currentTarget.style.outlineOffset = '4px'
              }}
              onBlur={e => {
                e.currentTarget.style.outline = 'none'
              }}
              >{l.label}</Link>
            ))}
            <button onClick={() => setLang(lang === 'no' ? 'en' : 'no')} style={{
              background: 'transparent',
              border: `1px solid rgba(${goldRgb},0.2)`,
              color: gold,
              borderRadius: sticky ? 6 : 8,
              padding: sticky ? '4px 10px' : '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: fonts.body,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={e => {
              e.currentTarget.style.outline = '2px solid #efc07b'
              e.currentTarget.style.outlineOffset = '2px'
            }}
            onBlur={e => {
              e.currentTarget.style.outline = 'none'
            }}
            >
              <Globe size={12} />
              {lang === 'no' ? 'EN' : 'NO'}
            </button>
            <Link href="/login" style={{
              color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 13,
              fontFamily: fonts.body, display: 'flex', alignItems: 'center', gap: 5,
              transition: 'color 0.2s', outline: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.color = gold}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
            onFocus={e => {
              e.currentTarget.style.outline = '2px solid #efc07b'
              e.currentTarget.style.outlineOffset = '4px'
            }}
            onBlur={e => {
              e.currentTarget.style.outline = 'none'
            }}
            >
              <LogIn size={14} />
              {lang === 'no' ? 'Logg inn' : 'Log in'}
            </Link>
            <button onClick={() => router.push('/kartlegging')} className="cta-shimmer" style={{
              color: bg, border: 'none', borderRadius: 10, padding: '8px 20px',
              fontWeight: 600, fontSize: sticky ? 13 : 14, cursor: 'pointer', fontFamily: fonts.body,
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={e => {
              e.currentTarget.style.outline = '2px solid #efc07b'
              e.currentTarget.style.outlineOffset = '2px'
            }}
            onBlur={e => {
              e.currentTarget.style.outline = 'none'
            }}
            >
              {lang === 'no' ? 'Start kartlegging' : 'Start assessment'}
              <ArrowRight size={13} style={{ display: 'inline', marginLeft: 6, verticalAlign: 'middle' }} />
            </button>
          </div>
          <div className="show-mob" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setLang(lang === 'no' ? 'en' : 'no')} style={{
              background: 'none', border: `1px solid rgba(${goldRgb},0.2)`, borderRadius: 6,
              padding: '4px 10px', color: gold, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body,
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={e => {
              e.currentTarget.style.outline = '2px solid #efc07b'
              e.currentTarget.style.outlineOffset = '2px'
            }}
            onBlur={e => {
              e.currentTarget.style.outline = 'none'
            }}
            >
              {lang === 'no' ? 'EN' : 'NO'}
            </button>
            <button onClick={() => router.push('/kartlegging')} className="cta-shimmer" style={{
              color: bg, border: 'none', borderRadius: 8, padding: '7px 16px',
              fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: fonts.body,
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={e => {
              e.currentTarget.style.outline = '2px solid #efc07b'
              e.currentTarget.style.outlineOffset = '2px'
            }}
            onBlur={e => {
              e.currentTarget.style.outline = 'none'
            }}
            >Start</button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={e => {
              e.currentTarget.style.outline = '2px solid #efc07b'
              e.currentTarget.style.outlineOffset = '2px'
            }}
            onBlur={e => {
              e.currentTarget.style.outline = 'none'
            }}
            >
              {menuOpen ? <X size={20} color="rgba(255,255,255,0.7)" /> : <Menu size={20} color="rgba(255,255,255,0.7)" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 95,
          background: 'rgba(5,5,16,0.98)', padding: '80px 24px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <button onClick={() => setMenuOpen(false)} style={{
            position: 'absolute', top: 20, right: 20, background: 'none',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 7,
            cursor: 'pointer', display: 'flex',
          }}>
            <X size={20} color="rgba(255,255,255,0.7)" />
          </button>
          {links.map(l => (
            <button key={l.href} onClick={() => { setMenuOpen(false); router.push(l.href) }} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
              fontSize: 18, fontWeight: 500, cursor: 'pointer', fontFamily: fonts.body,
              textAlign: 'left', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>{l.label}</button>
          ))}
          <button onClick={() => { setMenuOpen(false); router.push('/login') }} style={{
            background: 'none', border: `1px solid rgba(${goldRgb},0.25)`, borderRadius: 10,
            color: gold, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: fonts.body,
            textAlign: 'center', padding: '14px 0', marginTop: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <LogIn size={18} />
            {lang === 'no' ? 'Logg inn' : 'Log in'}
          </button>
        </div>
      )}
    </>
  )
}
