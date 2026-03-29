const API_BASE = import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002'

export interface SubscriptionInfo {
  tier: string
  status: string
  seat_limit: number
  seat_count: number
  current_period_start: string | null
  current_period_end: string | null
  trial_end: string | null
  cancel_at_period_end: boolean
}

export async function createCheckoutSession(token: string, orgId: string, plan: string, quantity?: number): Promise<void> {
  const res = await fetch(`${API_BASE}/v1/billing/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ org_id: orgId, plan, quantity: quantity || 1 }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create checkout session')
  if (data.url) window.location.href = data.url
}

export async function getSubscription(token: string, orgId: string): Promise<SubscriptionInfo | null> {
  const res = await fetch(`${API_BASE}/v1/billing/subscription?org_id=${orgId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.json()
}

export async function openBillingPortal(token: string, orgId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/v1/billing/portal?org_id=${orgId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to open billing portal')
  if (data.url) window.location.href = data.url
}

export function formatTierName(tier: string): string {
  const names: Record<string, string> = {
    basic: 'Free',
    starter: 'Starter',
    team: 'Team',
    org_starter: 'Org Starter',
    org_growth: 'Org Growth',
    org_scale: 'Org Scale',
  }
  return names[tier] || tier
}

export function tierColor(tier: string): { bg: string; color: string } {
  if (tier === 'basic' || tier === 'free') return { bg: 'var(--surface2)', color: 'var(--muted)' }
  return { bg: 'var(--accent)', color: 'var(--bg)' }
}
