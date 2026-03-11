'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { gold, goldRgb, bg, fonts } from '@/lib/constants'
import { useAuth } from '@/lib/auth-context'
import {
  LayoutDashboard, Phone, Users, CalendarCheck, Settings,
  Link2, Menu, X, ChevronRight, Zap, Package, Bell, Activity, HelpCircle, Shield
} from 'lucide-react'

const ADMIN_EMAILS = ['kontakt@arxon.no']

function getSidebarSections(userEmail: string | undefined) {
  const kontoLinks = [
    { href: '/dashboard/varsler', label: 'Varsler', icon: Bell },
    { href: '/dashboard/support', label: 'Support', icon: HelpCircle },
    { href: '/dashboard/innstillinger', label: 'Innstillinger', icon: Settings },
  ]

  if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
    kontoLinks.push({ href: '/dashboard/admin', label: 'Admin', icon: Shield })
  }

  return [
    {
      label: null,
      links: [
        { href: '/dashboard', label: 'Oversikt', icon: LayoutDashboard },
        { href: '/dashboard/besparelser', label: 'Aktivitet', icon: Activity },
      ]
    },
    {
      label: 'Aktivitet',
      links: [
        { href: '/dashboard/anrop', label: 'Anrop', icon: Phone },
        { href: '/dashboard/leads', label: 'Leads', icon: Users },
        { href: '/dashboard/bookinger', label: 'Bookinger', icon: CalendarCheck },
      ]
    },
    {
      label: 'System',
      links: [
        { href: '/dashboard/automatiseringer', label: 'Automatiseringer', icon: Zap },
        { href: '/dashboard/integrasjoner', label: 'Integrasjoner', icon: Link2 },
        { href: '/dashboard/onboarding', label: 'Oppsett', icon: Package },
      ]
    },
    {
      label: 'Konto',
      links: kontoLinks,
    },
  ]
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const sidebarSections = getSidebarSections(user?.email ?? undefined)

  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.replace('/login')
    return null
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c14',
      fontFamily: fonts.body,
      display: 'flex',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        ::selection { background: rgba(${goldRgb},0.3); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .dash-link { transition: all 0.15s ease; }
        .dash-link:hover { background: rgba(255,255,255,0.05) !important; }
        @media (max-width: 768px) {
          .dash-sidebar { display: none !important; }
          .dash-sidebar.open { display: flex !important; position: fixed !important; top: 0; left: 0; bottom: 0; z-index: 100; }
          .dash-overlay { display: block !important; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`dash-sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{
        width: 240,
        background: '#0a0f1a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Image src="/arxon-icon.png" alt="Arxon" width={28} height={28} />
            <span style={{
              color: '#f0f0f0', fontSize: 15, fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
            }}>Arxon</span>
          </Link>
          {mobileMenuOpen && (
            <button onClick={() => setMobileMenuOpen(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            }}>
              <X size={20} color="rgba(255,255,255,0.5)" />
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {sidebarSections.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: section.label ? 8 : 0 }}>
              {section.label && (
                <div style={{
                  padding: '16px 14px 6px',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: fonts.body
                }}>
                  {section.label}
                </div>
              )}
              {section.links.map(link => {
                const active = isActive(link.href)
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="dash-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      borderRadius: 10,
                      fontSize: 14,
                      fontFamily: fonts.body,
                      color: active ? gold : 'rgba(255,255,255,0.65)',
                      background: active ? 'rgba(' + goldRgb + ',0.10)' : 'transparent',
                      fontWeight: active ? 600 : 400,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={18} style={{ opacity: active ? 1 : 0.5 }} />
                    {link.label}
                    {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User info */}
        <div style={{
          padding: '16px 14px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontSize: 12, color: 'rgba(255,255,255,0.35)',
            overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', flex: 1, minWidth: 0,
          }}>
            {user?.email || ''}
          </div>
          <button
            onClick={() => signOut()}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, color: 'rgba(255,255,255,0.25)',
              padding: '2px 6px', flexShrink: 0,
            }}
            title="Logg ut"
          >
            Logg ut
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="dash-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            display: 'none',
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 99,
          }}
        />
      )}

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 56,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 16,
          flexShrink: 0,
        }}>
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, padding: 6, cursor: 'pointer',
              display: 'none',
            }}
            className="show-mob-btn"
          >
            <Menu size={20} color="rgba(255,255,255,0.6)" />
          </button>
          <style>{`@media (max-width: 768px) { .show-mob-btn { display: flex !important; } }`}</style>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h2 style={{ color: '#f0f0f0', fontSize: 16, fontWeight: 600, margin: 0 }}>
            {sidebarSections.flatMap(s => s.links).find(l => isActive(l.href))?.label || 'Dashboard'}
          </h2>
          <Link href="/dashboard/varsler" style={{ position: 'relative', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            <Bell size={20} />
          </Link>
        </div>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

