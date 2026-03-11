'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getCustomer, updateCustomer } from '@/lib/dashboard'
import { gold, goldRgb, fonts } from '@/lib/constants'
import { Building2, Mail, Bell, Save, Check, Loader2 } from 'lucide-react'

interface SettingsForm {
  companyName: string
  contactName: string
  phone: string
  website: string
  notifyEmail: boolean
  notifySms: boolean
  notifyNewLead: boolean
  notifyMissedCall: boolean
  notifyBooking: boolean
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<SettingsForm>({
    companyName: '',
    contactName: '',
    phone: '',
    website: '',
    notifyEmail: true,
    notifySms: false,
    notifyNewLead: true,
    notifyMissedCall: true,
    notifyBooking: true,
  })

  useEffect(() => {
    if (!user) return
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const customer = await getCustomer()
        if (!customer || cancelled) { setLoading(false); return }
        setCustomerId(customer.id)
        setForm(prev => ({
          ...prev,
          companyName: customer.company_name || '',
          contactName: customer.contact_name || '',
          phone: customer.phone || '',
          website: customer.website || '',
          notifyEmail: customer.notify_email ?? true,
          notifySms: customer.notify_sms ?? false,
          notifyNewLead: customer.notify_new_lead ?? true,
          notifyMissedCall: customer.notify_missed_call ?? true,
          notifyBooking: customer.notify_booking ?? true,
        }))
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user])

  const handleSave = async () => {
    if (!customerId) return
    setSaving(true)
    try {
      await updateCustomer(customerId, {
        company_name: form.companyName,
        contact_name: form.contactName,
        phone: form.phone,
        website: form.website,
        notify_email: form.notifyEmail,
        notify_sms: form.notifySms,
        notify_new_lead: form.notifyNewLead,
        notify_missed_call: form.notifyMissedCall,
        notify_booking: form.notifyBooking,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)', color: '#f0f0f0',
    fontSize: 14, outline: 'none', fontFamily: fonts.body,
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500,
    display: 'block', marginBottom: 6,
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 640, fontFamily: fonts.body }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 24px' }}>
          Administrer bedriftsprofil og varslingsinnstillinger
        </p>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '24px', marginBottom: 16,
          }}>
            <div style={{ height: 18, width: '30%', background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 20 }} />
            <div style={{ height: 40, width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 12 }} />
            <div style={{ height: 40, width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, fontFamily: fonts.body }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 24px' }}>
        Administrer bedriftsprofil og varslingsinnstillinger
      </p>

      {/* Company info */}
      <section style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '24px', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Building2 size={18} color={gold} />
          <h3 style={{ color: '#f0f0f0', fontSize: 15, fontWeight: 600, margin: 0 }}>Bedriftsinformasjon</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Bedriftsnavn</label>
            <input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Kontaktperson</label>
            <input value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Telefon</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+47 ..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Nettside</label>
              <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://..." style={inputStyle} />
            </div>
          </div>
        </div>
      </section>

      {/* Email */}
      <section style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '24px', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Mail size={18} color={gold} />
          <h3 style={{ color: '#f0f0f0', fontSize: 15, fontWeight: 600, margin: 0 }}>Konto</h3>
        </div>
        <div>
          <label style={labelStyle}>E-post (innlogging)</label>
          <input value={user?.email || ''} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 6 }}>
            Kontakt support@arxon.no for å endre e-postadresse
          </p>
        </div>
      </section>

      {/* Notifications */}
      <section style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '24px', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Bell size={18} color={gold} />
          <h3 style={{ color: '#f0f0f0', fontSize: 15, fontWeight: 600, margin: 0 }}>Varsler</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'notifyNewLead' as const, label: 'Nye leads', desc: 'Få varsel når en ny lead er kvalifisert' },
            { key: 'notifyMissedCall' as const, label: 'Tapte anrop', desc: 'Bli varslet om anrop som ikke ble besvart' },
            { key: 'notifyBooking' as const, label: 'Nye bookinger', desc: 'Varsel når et møte er booket automatisk' },
          ].map(n => (
            <div key={n.key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{n.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{n.desc}</div>
              </div>
              <button
                onClick={() => setForm({ ...form, [n.key]: !form[n.key] })}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none',
                  background: form[n.key] ? gold : 'rgba(255,255,255,0.1)',
                  cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute', top: 3,
                  left: form[n.key] ? 23 : 3,
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.notifyEmail} onChange={e => setForm({ ...form, notifyEmail: e.target.checked })}
                style={{ accentColor: gold }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>E-post</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.notifySms} onChange={e => setForm({ ...form, notifySms: e.target.checked })}
                style={{ accentColor: gold }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>SMS</span>
            </label>
          </div>
        </div>
      </section>

      {/* Save button */}
      <button onClick={handleSave} disabled={saving || !customerId} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', padding: '14px',
        borderRadius: 10, border: 'none',
        background: saved ? '#4ade80' : `linear-gradient(135deg, ${gold}, #d4a85a)`,
        color: saved ? '#fff' : '#0f1b27',
        fontWeight: 700, fontSize: 15,
        cursor: saving || !customerId ? 'not-allowed' : 'pointer',
        opacity: saving || !customerId ? 0.6 : 1,
        fontFamily: fonts.body,
        transition: 'all 0.2s',
      }}>
        {saved ? <><Check size={18} /> Lagret!</> : saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Lagrer...</> : <><Save size={16} /> Lagre endringer</>}
      </button>
    </div>
  )
}
