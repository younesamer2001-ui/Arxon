'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { fonts } from '@/lib/constants'
import { allIntegrations, automationToIntegrations } from './components/integrations-catalog'
import { IntegrationState, IntegrationDef } from './components/types'
import { LoadingState } from './components/LoadingState'
import { EmptyState } from './components/EmptyState'
import { IntegrationCard } from './components/IntegrationCard'
import { SecurityInfo } from './components/SecurityInfo'
import { ConnectionStatus } from './components/ConnectionStatus'
import { SupportFooter } from './components/SupportFooter'
import { supabase } from '@/lib/supabase'

export default function IntegrationsPage() {
  const [purchasedAutomations, setPurchasedAutomations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [integrationState, setIntegrationState] = useState<Record<string, IntegrationState>>({})
  const [orderId, setOrderId] = useState<string | null>(null)
  const [customerEmail, setCustomerEmail] = useState<string | null>(null)
  const [savingService, setSavingService] = useState<string | null>(null)

  // Fetch real purchased automations from Supabase orders table
  useEffect(() => {
    async function fetchOrderData() {
      try {
        // Get order_id from URL params or localStorage
        const params = new URLSearchParams(window.location.search)
        let oid = params.get('order_id')

        if (!oid) {
          // Try localStorage for returning customers
          oid = localStorage.getItem('arxon_order_id')
        }

        if (!oid) {
          // Fallback: find most recent paid order
          const { data: orders, error } = await supabase
            .from('orders')
            .select('id, customer_email, automations, status')
            .in('status', ['setup_paid', 'active', 'trialing'])
            .order('created_at', { ascending: false })
            .limit(1)

          if (error) throw error
          if (orders && orders.length > 0) {
            oid = orders[0].id
          }
        }

        if (!oid) {
          setLoading(false)
          return
        }

        // Fetch the order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('id, customer_email, automations, status, industry')
          .eq('id', oid)
          .single()

        if (orderError || !order) {
          console.error('Order not found:', orderError)
          setLoading(false)
          return
        }

        setOrderId(order.id)
        setCustomerEmail(order.customer_email)
        localStorage.setItem('arxon_order_id', order.id)

        // Extract automation names from the JSONB array
        const automations = (order.automations as any[]) || []
        const autoNames = automations.map((a: any) => {
          if (typeof a === 'string') return a
          return a.name || a.id || ''
        }).filter(Boolean)

        setPurchasedAutomations(autoNames)

        // Fetch existing integration states from DB
        const res = await fetch(`/api/integrations?order_id=${order.id}`)
        const { integrations: savedIntegrations } = await res.json()

        // Build integration state from saved data
        if (savedIntegrations && savedIntegrations.length > 0) {
          const stateFromDb: Record<string, IntegrationState> = {}
          savedIntegrations.forEach((saved: any) => {
            const def = allIntegrations.find(i => i.service === saved.service)
            if (!def) return
            stateFromDb[saved.service] = {
              fields: saved.credentials || Object.fromEntries(def.fields.map(f => [f.key, ''])),
              status: saved.status as 'pending' | 'connected' | 'error',
              showSecrets: {},
              saving: false,
              saved: saved.status === 'connected',
            }
          })
          setIntegrationState(stateFromDb)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching order data:', err)
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [])

  // Determine which integrations to show based on purchases
  const requiredServices = new Set<string>()
  purchasedAutomations.forEach(auto => {
    const normalizedAuto = auto.toLowerCase().trim()
    const services = automationToIntegrations[normalizedAuto] || automationToIntegrations[auto] || []
    services.forEach(s => requiredServices.add(s))
  })

  const activeIntegrations = allIntegrations.filter(i => requiredServices.has(i.service))

  // Initialize integration state for new services not yet in DB
  useEffect(() => {
    if (activeIntegrations.length === 0) return

    setIntegrationState(prev => {
      const newState = { ...prev }
      activeIntegrations.forEach(i => {
        if (!newState[i.service]) {
          newState[i.service] = {
            fields: Object.fromEntries(i.fields.map(f => [f.key, ''])),
            status: 'pending' as const,
            showSecrets: {},
            saving: false,
            saved: false,
          }
        }
      })
      return newState
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchasedAutomations])

  const updateField = (service: string, key: string, value: string) => {
    setIntegrationState(prev => ({
      ...prev,
      [service]: { ...prev[service], fields: { ...prev[service].fields, [key]: value }, saved: false },
    }))
  }

  const toggleSecret = (service: string, key: string) => {
    setIntegrationState(prev => ({
      ...prev,
      [service]: { ...prev[service], showSecrets: { ...prev[service].showSecrets, [key]: !prev[service].showSecrets[key] } },
    }))
  }

  // Save integration credentials to Supabase via API
  const handleSave = useCallback(async (service: string) => {
    if (!orderId || !customerEmail) return

    const state = integrationState[service]
    const def = allIntegrations.find(i => i.service === service)!
    const allFilled = def.fields.every(f => state.fields[f.key]?.trim())

    setIntegrationState(prev => ({ ...prev, [service]: { ...prev[service], saving: true } }))
    setSavingService(service)

    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          customer_email: customerEmail,
          service,
          credentials: state.fields,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to save')
      }

      setIntegrationState(prev => ({
        ...prev,
        [service]: {
          ...prev[service],
          saving: false,
          saved: true,
          status: allFilled ? 'connected' : 'pending',
        },
      }))
    } catch (err) {
      console.error('Save integration error:', err)
      setIntegrationState(prev => ({
        ...prev,
        [service]: { ...prev[service], saving: false, status: 'error' },
      }))
    } finally {
      setSavingService(null)
    }
  }, [orderId, customerEmail, integrationState])

  // Disconnect integration via API
  const handleDisconnect = useCallback(async (service: string) => {
    if (!orderId) return

    const def = allIntegrations.find(i => i.service === service)!

    try {
      // Get the integration ID first
      const res = await fetch(`/api/integrations?order_id=${orderId}`)
      const { integrations } = await res.json()
      const existing = integrations?.find((i: any) => i.service === service)

      if (existing) {
        await fetch(`/api/integrations?id=${existing.id}&order_id=${orderId}`, {
          method: 'DELETE',
        })
      }

      setIntegrationState(prev => ({
        ...prev,
        [service]: {
          fields: Object.fromEntries(def.fields.map(f => [f.key, ''])),
          status: 'pending',
          showSecrets: {},
          saving: false,
          saved: false,
        },
      }))
    } catch (err) {
      console.error('Disconnect error:', err)
    }
  }, [orderId])

  const statusBadge = (status: string) => {
    if (status === 'connected')
      return { bg: 'rgba(74,222,128,0.12)', color: '#4ade80', icon: CheckCircle2, label: 'Tilkoblet' }
    if (status === 'error')
      return { bg: 'rgba(248,113,113,0.12)', color: '#f87171', icon: AlertCircle, label: 'Feil' }
    return { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', icon: Clock, label: 'Venter p\u00e5 oppsett' }
  }

  const connectedCount = Object.values(integrationState).filter(s => s.status === 'connected').length

  // Loading state
  if (loading) {
    return <LoadingState />
  }

  // Empty state: no purchased automations
  if (activeIntegrations.length === 0) {
    return <EmptyState />
  }

  // Active integrations (post-purchase)
  return (
    <div style={{ maxWidth: 800, fontFamily: fonts.body }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>
          Fullf\u00f8r oppsettet for \u00e5 aktivere dine kj\u00f8pte automatiseringer
        </p>
        <ConnectionStatus connectedCount={connectedCount} totalCount={activeIntegrations.length} />
      </div>

      {/* Security Info */}
      <SecurityInfo />

      {/* Integration Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {activeIntegrations.map(integ => {
          const state = integrationState[integ.service]
          if (!state) return null

          const badge = statusBadge(state.status)
          const relatedAutomations = purchasedAutomations.filter(auto => {
            const normalizedAuto = auto.toLowerCase().trim()
            return (automationToIntegrations[normalizedAuto] || automationToIntegrations[auto] || []).includes(integ.service)
          })

          return (
            <IntegrationCard
              key={integ.service}
              integ={integ}
              state={state}
              relatedAutomations={relatedAutomations}
              onUpdateField={updateField}
              onToggleSecret={toggleSecret}
              onSave={handleSave}
              onDisconnect={handleDisconnect}
              statusBadge={badge}
            />
          )
        })}
      </div>

      {/* Support Footer */}
      <SupportFooter />
    </div>
  )
}
