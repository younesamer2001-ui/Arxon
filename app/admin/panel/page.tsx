'use client'

import { useState, useEffect } from 'react'
import { Shield, Users, Package, Zap, RefreshCw, CheckCircle, Clock, AlertTriangle, XCircle, Search } from 'lucide-react'

interface Order {
  id: string
  customer_email: string
  customer_name: string
  company_name: string
  industry: string
  automations: { name: string; key: string; monthly: number }[]
  setup_total: number
  monthly_total: number
  billing_mode: string
  status: string
  created_at: string
}

interface Workflow {
  id: string
  order_id: string
  customer_email: string
  automation_name: string
  automation_key: string
  workflow_status: string
  health_status: string
  n8n_workflow_id: string | null
  n8n_workflow_url: string | null
  error_message: string | null
}

interface Integration {
  id: string
  order_id: string
  customer_email: string
  service: string
  status: string
  connected_at: string | null
}

interface Stats {
  totalOrders: number
  activeWorkflows: number
  pendingSetup: number
  connectedIntegrations: number
  totalRevenue: number
  monthlyRevenue: number
}

const ADMIN_PASSWORD = 'arxon2024admin'

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [activeTab, setActiveTab] = useState('oversikt')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (authenticated) fetchAllData()
  }, [authenticated])

  async function fetchAllData() {
    setLoading(true)
    try {
      const [ordersRes, workflowsRes, integrationsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/workflows'),
        fetch('/api/admin/integrations')
      ])
      const ordersData = await ordersRes.json()
      const workflowsData = await workflowsRes.json()
      const integrationsData = await integrationsRes.json()

      setOrders(ordersData.orders || [])
      setWorkflows(workflowsData.workflows || [])
      setIntegrations(integrationsData.integrations || [])

      const totalRevenue = (ordersData.orders || []).reduce((sum: number, o: Order) => sum + (o.setup_total || 0), 0)
      const monthlyRevenue = (ordersData.orders || []).reduce((sum: number, o: Order) => sum + (o.monthly_total || 0), 0)
      setStats({
        totalOrders: (ordersData.orders || []).length,
        activeWorkflows: (workflowsData.workflows || []).filter((w: Workflow) => w.workflow_status === 'active').length,
        pendingSetup: (workflowsData.workflows || []).filter((w: Workflow) => w.workflow_status === 'pending').length,
        connectedIntegrations: (integrationsData.integrations || []).filter((i: Integration) => i.status === 'connected').length,
        totalRevenue,
        monthlyRevenue
      })
    } catch (err) {
      console.error('Feil ved henting av data:', err)
    }
    setLoading(false)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setError('')
    } else {
      setError('Feil passord')
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'active': case 'connected': case 'completed': return 'text-green-400 bg-green-400/10'
      case 'pending': case 'waiting': return 'text-yellow-400 bg-yellow-400/10'
      case 'error': case 'failed': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'active': case 'connected': case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': case 'waiting': return <Clock className="w-4 h-4" />
      case 'error': case 'failed': return <XCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(amount)
  }

  const tabs = [
    { key: 'oversikt', label: 'Oversikt', icon: Package },
    { key: 'bestillinger', label: 'Bestillinger', icon: Users },
    { key: 'arbeidsflyter', label: 'Arbeidsflyter', icon: Zap },
    { key: 'integrasjoner', label: 'Integrasjoner', icon: RefreshCw }
  ]

  const filteredOrders = orders.filter(o =>
    o.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-gray-400 mb-4">Skriv inn admin-passordet for tilgang.</p>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passord" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 mb-4 focus:outline-none focus:border-blue-500" />
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Logg inn</button>
        </form>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Laster admin-data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold">Arxon Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="S\u00f8k kunde..." className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-64" />
            </div>
            <button onClick={fetchAllData} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Oppdater data">
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Oversikt Tab */}
        {activeTab === 'oversikt' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Totale bestillinger', value: stats.totalOrders, icon: Users, color: 'blue' },
                { label: 'Aktive arbeidsflyter', value: stats.activeWorkflows, icon: Zap, color: 'green' },
                { label: 'Venter p\u00e5 oppsett', value: stats.pendingSetup, icon: Clock, color: 'yellow' },
                { label: 'Tilkoblede integrasjoner', value: stats.connectedIntegrations, icon: RefreshCw, color: 'purple' },
                { label: 'Total omsetning', value: formatCurrency(stats.totalRevenue), icon: Package, color: 'emerald' },
                { label: 'M\u00e5nedlig inntekt', value: formatCurrency(stats.monthlyRevenue), icon: Package, color: 'cyan' }
              ].map((card, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">{card.label}</span>
                    <card.icon className={`w-5 h-5 text-${card.color}-400`} />
                  </div>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Siste bestillinger</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">{order.company_name || order.customer_name}</p>
                      <p className="text-sm text-gray-400">{order.customer_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.setup_total)}</p>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-gray-500 text-center py-4">Ingen bestillinger enn\u00e5</p>}
              </div>
            </div>
          </div>
        )}

        {/* Bestillinger Tab */}
        {activeTab === 'bestillinger' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold">Alle bestillinger ({filteredOrders.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Kunde</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Bedrift</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Bransje</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Automatiseringer</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase">Oppsett</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase">M\u00e5nedlig</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Dato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">{order.company_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{order.industry}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(order.automations || []).map((a, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded">{a.name}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">{formatCurrency(order.setup_total)}</td>
                      <td className="px-6 py-4 text-right text-sm">{formatCurrency(order.monthly_total)}/mnd</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && <p className="text-gray-500 text-center py-8">Ingen bestillinger funnet</p>}
            </div>
          </div>
        )}

        {/* Arbeidsflyter Tab */}
        {activeTab === 'arbeidsflyter' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold">Arbeidsflyter ({workflows.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Automatisering</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Kunde</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Helse</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">n8n</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Feil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {workflows.map(wf => (
                    <tr key={wf.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm">{wf.automation_name}</p>
                        <p className="text-xs text-gray-500">{wf.automation_key}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{wf.customer_email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(wf.workflow_status)}`}>
                          {getStatusIcon(wf.workflow_status)}
                          {wf.workflow_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(wf.health_status)}`}>
                          {wf.health_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {wf.n8n_workflow_url ? (
                          <a href={wf.n8n_workflow_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">\u00c5pne</a>
                        ) : (
                          <span className="text-gray-500">Ikke koblet</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-400">{wf.error_message || '\u2014'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {workflows.length === 0 && <p className="text-gray-500 text-center py-8">Ingen arbeidsflyter funnet</p>}
            </div>
          </div>
        )}

        {/* Integrasjoner Tab */}
        {activeTab === 'integrasjoner' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold">Integrasjoner ({integrations.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Tjeneste</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Kunde</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">Tilkoblet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {integrations.map(int => (
                    <tr key={int.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm capitalize">{int.service}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{int.customer_email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(int.status)}`}>
                          {getStatusIcon(int.status)}
                          {int.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {int.connected_at ? formatDate(int.connected_at) : 'Ikke tilkoblet'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {integrations.length === 0 && <p className="text-gray-500 text-center py-8">Ingen integrasjoner funnet</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
