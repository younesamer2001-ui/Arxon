'use client'

import { useState, useEffect } from 'react'
import { 
  Users, Phone, Activity, Calendar, Zap, TrendingUp, 
  Clock, AlertCircle, CheckCircle, RefreshCw, ChevronDown,
  CreditCard, BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react'

// Types
interface Stats {
  total_customers: number
  total_revenue_nok: number
  monthly_recurring_nok: number
  total_cost_saved_nok: number
  total_workflows: number
  active_workflows: number
  failed_workflows: number
  onboarding_pending: number
  onboarding_in_progress: number
  onboarding_completed: number
  total_calls: number
  total_duration_seconds: number
  avg_call_duration_seconds: number
  total_orders: number
  pending_orders: number
  active_orders: number
}

interface Order {
  id: string
  customer_email: string
  customer_name: string
  company_name: string
  setup_total: number
  monthly_total: number
  status: string
  onboarding_step: string
  onboarding_status: string
  created_at: string
  automations: { automation_name: string; status: string }[]
}

interface OnboardingItem {
  id: string
  customer_id: string
  step_key: string
  step_name: string
  status: string
  created_at: string
  customers: { company_name: string; email: string }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [onboarding, setOnboarding] = useState<OnboardingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState<'oversikt' | 'bestillinger' | 'onboarding'>('oversikt')

  // Auto-refresh hvert 30. sekund
  useEffect(() => {
    fetchAllData()
    const interval = setInterval(fetchAllData, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchAllData() {
    try {
      const [statsRes, ordersRes, onboardingRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/orders?limit=50'),
        fetch('/api/admin/onboarding')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        if (statsData.success) setStats(statsData.stats)
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        if (ordersData.success) setOrders(ordersData.orders)
      }

      if (onboardingRes.ok) {
        const onboardingData = await onboardingRes.json()
        if (onboardingData.success) setOnboarding(onboardingData.onboarding)
      }

      setLastUpdate(new Date())
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  function formatCurrency(nok: number) {
    return new Intl.NumberFormat('nb-NO', { 
      style: 'currency', 
      currency: 'NOK',
      maximumFractionDigits: 0 
    }).format(nok)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Laster dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Sist oppdatert: {lastUpdate.toLocaleTimeString('nb-NO')} 
              <span className="text-green-400 ml-2">● Live</span>
            </p>
          </div>
          <button 
            onClick={fetchAllData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Oppdater
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Omsetning */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Total omsetning</span>
                <CreditCard className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(stats.total_revenue_nok)}</p>
              <p className="text-sm text-gray-500 mt-1">
                MRR: {formatCurrency(stats.monthly_recurring_nok)}/mnd
              </p>
            </div>

            {/* Kunder */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Aktive kunder</span>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-2xl font-bold">{stats.total_customers}</p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.active_orders} aktive ordrer
              </p>
            </div>

            {/* Samtaler */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">AI-samtaler</span>
                <Phone className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-2xl font-bold">{stats.total_calls}</p>
              <p className="text-sm text-gray-500 mt-1">
                Gj.snitt: {formatDuration(stats.avg_call_duration_seconds)}
              </p>
            </div>

            {/* Kostnadsbesparelse */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Kostnadsbesparelse</span>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(stats.total_cost_saved_nok)}</p>
              <p className="text-sm text-gray-500 mt-1">
                For kundene
              </p>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Workflows */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Automatiseringer</span>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-3xl font-bold">{stats.active_workflows}</p>
                  <p className="text-sm text-green-400">Aktive</p>
                </div>
                {stats.failed_workflows > 0 && (
                  <div>
                    <p className="text-3xl font-bold text-red-400">{stats.failed_workflows}</p>
                    <p className="text-sm text-red-400">Feil</p>
                  </div>
                )}
              </div>
            </div>

            {/* Onboarding Pipeline */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Onboarding</span>
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.onboarding_pending}</p>
                  <p className="text-xs text-yellow-400">Venter</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{stats.onboarding_in_progress}</p>
                  <p className="text-xs text-blue-400">Pågår</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-400">{stats.onboarding_completed}</p>
                  <p className="text-xs text-green-400">Ferdig</p>
                </div>
              </div>
            </div>

            {/* Total samtaletid */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Total samtaletid</span>
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-3xl font-bold">
                {Math.floor(stats.total_duration_seconds / 3600)}t {(stats.total_duration_seconds % 3600) / 60}m
              </p>
              <p className="text-sm text-gray-500 mt-1">
                AI har besvart
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-1 bg-gray-900/50 rounded-xl p-1">
          {[
            { key: 'oversikt', label: 'Siste aktivitet' },
            { key: 'bestillinger', label: 'Bestillinger' },
            { key: 'onboarding', label: 'Onboarding' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'oversikt' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Siste bestillinger</h2>
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.company_name || order.customer_name}</p>
                  <p className="text-sm text-gray-400">{order.customer_email}</p>
                  <div className="flex gap-2 mt-2">
                    {order.automations.map((auto, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                        {auto.automation_name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(order.setup_total / 100)}</p>
                  <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bestillinger' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">Kunde</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">Automatiseringer</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-400">Oppsett</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-400">Månedlig</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-400">Status</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-400">Onboarding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.company_name || order.customer_name}</p>
                      <p className="text-sm text-gray-400">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {order.automations.map((auto, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                            {auto.automation_name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {formatCurrency(order.setup_total / 100)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400">
                      {formatCurrency(order.monthly_total / 100)}/mnd
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.onboarding_status)}`}>
                        {order.onboarding_step}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'onboarding' && (
          <div className="space-y-4">
            {onboarding.slice(0, 20).map(item => (
              <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.customers?.company_name || 'Ukjent'}</p>
                  <p className="text-sm text-gray-400">{item.customers?.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 capitalize">{item.step_key.replace(/_/g, ' ')}</span>
                  <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('nb-NO')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
