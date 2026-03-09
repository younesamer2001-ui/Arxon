'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Notification {
  id: string
  order_id: string
  customer_email: string
  type: string
  title: string
  message: string
  read: boolean
  metadata: Record<string, unknown>
  created_at: string
}

function VarslerContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    if (email) fetchNotifications()
  }, [email, filter])

  async function fetchNotifications() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ email })
      if (filter === 'unread') params.set('unread', 'true')
      const res = await fetch(`/api/notifications?${params}`)
      const data = await res.json()
      if (res.ok) {
        setNotifications(data.notifications || [])
        setUnreadCount(data.unread_count || 0)
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: id })
      })
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  async function markAllAsRead() {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mark_all_read: true, customer_email: email })
      })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  function getIcon(type: string) {
    switch (type) {
      case 'all_integrations_connected': return '✅'
      case 'workflow_activated': return '⚡'
      case 'workflow_error': return '⚠️'
      case 'payment_received': return '💳'
      case 'welcome': return '👋'
      case 'integration_connected': return '🔗'
      default: return '🔔'
    }
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Akkurat nå'
    if (mins < 60) return `${mins} min siden`
    if (hours < 24) return `${hours} timer siden`
    if (days < 7) return `${days} dager siden`
    return date.toLocaleDateString('nb-NO')
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Ingen e-post oppgitt. Legg til ?email=din@epost.no i URL-en.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Varsler</h1>
            <p className="text-gray-400 text-sm mt-1">
              {unreadCount > 0 ? `${unreadCount} ulest${unreadCount > 1 ? 'e' : ''} varsel` : 'Ingen uleste varsler'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Merk alle som lest
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Uleste
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-900 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-800 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔔</div>
            <p className="text-gray-400">
              {filter === 'unread' ? 'Ingen uleste varsler' : 'Ingen varsler ennå'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`rounded-xl p-4 transition-all cursor-pointer ${
                  n.read
                    ? 'bg-gray-900/50 border border-gray-800/50'
                    : 'bg-gray-900 border border-gray-700 hover:border-blue-600/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{getIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${n.read ? 'text-gray-400' : 'text-white'}`}>
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${n.read ? 'text-gray-500' : 'text-gray-300'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTime(n.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function VarslerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Laster varsler...</p>
      </div>
    }>
      <VarslerContent />
    </Suspense>
  )
}
