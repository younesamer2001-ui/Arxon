'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Sparkles, Star, Building2, Clock, Filter, Eye, CheckCircle2, XCircle, MessageSquare, AlertCircle } from 'lucide-react'

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  reviewed: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  discussing: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

const statusLabels: Record<string, { no: string; en: string }> = {
  new: { no: 'Ny', en: 'New' },
  reviewed: { no: 'Gjennomgått', en: 'Reviewed' },
  discussing: { no: 'Under diskusjon', en: 'Discussing' },
  accepted: { no: 'Akseptert', en: 'Accepted' },
  rejected: { no: 'Avvist', en: 'Rejected' },
}

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'arxon2024'

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [authed, setAuthed] = useState(false)
  const [passInput, setPassInput] = useState('')
  const [passError, setPassError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('arxon_admin')
      if (saved === 'true') setAuthed(true)
    }
  }, [])

  const handleLogin = () => {
    if (passInput === ADMIN_PASS) {
      setAuthed(true)
      setPassError(false)
      sessionStorage.setItem('arxon_admin', 'true')
    } else {
      setPassError(true)
    }
  }

  useEffect(() => {
    if (authed) loadSubmissions()
  }, [filter, authed])

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '40px 36px', maxWidth: 380, width: '100%', textAlign: 'center' }}>
          <div style={{ margin: '0 auto 16px', width: 40, height: 40 }}><Image src="/arxon-icon.png" alt="Arxon" width={40} height={40} /></div>
          <h2 style={{ color: '#f0f0f0', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Admin</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>Skriv inn passord for å fortsette</p>
          <input
            type="password"
            value={passInput}
            onChange={e => { setPassInput(e.target.value); setPassError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Passord"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 10, border: `1px solid ${passError ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
              background: 'rgba(255,255,255,0.04)', color: '#f0f0f0', fontSize: 15, outline: 'none', marginBottom: 12,
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          {passError && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>Feil passord</p>}
          <button onClick={handleLogin} style={{
            width: '100%', padding: '12px', borderRadius: 10, border: 'none',
            background: '#c9a96e', color: '#0a0a0f', fontWeight: 700, fontSize: 15, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}>Logg inn</button>
        </div>
      </div>
    )
  }

  const loadSubmissions = async () => {
    setLoading(true)
    let query = supabase
      .from('submissions')
      .select('*, discovery_sessions(*), businesses(*)')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error loading submissions:', error)
    } else {
      setSubmissions(data || [])
    }
    setLoading(false)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase
      .from('submissions')
      .update({ status: newStatus, reviewed_at: new Date().toISOString() })
      .eq('id', id)
    loadSubmissions()
    if (selectedSubmission?.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus })
    }
  }

  const updateNotes = async (id: string, notes: string) => {
    await supabase
      .from('submissions')
      .update({ team_notes: notes })
      .eq('id', id)
  }

  const stats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    discussing: submissions.filter(s => s.status === 'discussing').length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
  }

  return (
    <div className="min-h-screen" style={{ background: '#050510' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-brand-500" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <div className="text-sm text-gray-500">Arxon</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: Building2, color: 'text-gray-600' },
            { label: 'Nye', value: stats.new, icon: AlertCircle, color: 'text-blue-600' },
            { label: 'Under diskusjon', value: stats.discussing, icon: MessageSquare, color: 'text-purple-600' },
            { label: 'Akseptert', value: stats.accepted, icon: CheckCircle2, color: 'text-green-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-gray-500" />
          {['all', 'new', 'reviewed', 'discussing', 'accepted', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === f
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {f === 'all' ? 'Alle' : statusLabels[f]?.no || f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Submission list */}
          <div className="md:col-span-2 space-y-3">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Laster...</div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Ingen innsendinger ennå
              </div>
            ) : (
              submissions.map((sub) => {
                const report = sub.full_report || {}
                const rec = sub.discovery_sessions?.final_recommendation
                let parsed: any = {}
                try { parsed = rec ? JSON.parse(rec) : {} } catch {}

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className={`bg-white dark:bg-gray-900 rounded-xl p-5 border cursor-pointer transition-all hover:shadow-md ${
                      selectedSubmission?.id === sub.id
                        ? 'border-brand-500 ring-2 ring-brand-200'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {report.business?.company || sub.businesses?.company_name || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-500">{report.business?.email || sub.businesses?.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {parsed.priority_score && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium">{parsed.priority_score}/10</span>
                          </div>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[sub.status]}`}>
                          {statusLabels[sub.status]?.no || sub.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{report.profile?.industry || '—'}</span>
                      <span>{report.profile?.size || '—'}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(sub.created_at).toLocaleDateString('no-NO')}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Detail panel */}
          <div className="md:col-span-1">
            {selectedSubmission ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 sticky top-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Detaljer
                </h3>

                {/* Status buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['new', 'reviewed', 'discussing', 'accepted', 'rejected'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedSubmission.id, s)}
                      className={`px-2 py-1 rounded text-xs font-medium transition ${
                        selectedSubmission.status === s
                          ? statusColors[s]
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                      }`}
                    >
                      {statusLabels[s]?.no}
                    </button>
                  ))}
                </div>

                {/* Report data */}
                <div className="space-y-3 text-sm">
                  {selectedSubmission.full_report?.profile && (
                    <>
                      <div>
                        <span className="text-gray-500">Bransje:</span>
                        <p className="font-medium">{selectedSubmission.full_report.profile.industry}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Størrelse:</span>
                        <p className="font-medium">{selectedSubmission.full_report.profile.size}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Utfordring:</span>
                        <p className="font-medium">{selectedSubmission.full_report.profile.challenge}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Budsjett:</span>
                        <p className="font-medium">{selectedSubmission.full_report.profile.budget}</p>
                      </div>
                    </>
                  )}

                  {selectedSubmission.full_report?.discovery_answers && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-500 font-medium">Svar ({selectedSubmission.full_report.discovery_answers.length}):</span>
                      <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                        {selectedSubmission.full_report.discovery_answers.map((a: any, i: number) => (
                          <div key={i} className="text-xs">
                            <p className="text-gray-600 dark:text-gray-400">{a.question}</p>
                            <p className="font-medium text-brand-600">{a.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Team notes */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    Team-notater:
                  </label>
                  <textarea
                    defaultValue={selectedSubmission.team_notes || ''}
                    onBlur={(e) => updateNotes(selectedSubmission.id, e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Legg til notater..."
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 text-center text-gray-500">
                <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Velg en innsending for å se detaljer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
