import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../layout/Navbar'
import { getAuthSession } from '../../services/auth'
import { useToast } from '../ui/Toast'

const API_BASE = import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002'

interface Tier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  plan: string | null
  cta: string
  ctaLink?: string
  highlight?: boolean
  badge?: string
  seatInput?: boolean
  trial?: boolean
}

const tiers: Tier[] = [
  {
    name: 'Basic',
    price: 'Free',
    period: '',
    description: 'For individual developers',
    features: ['1 user', 'Local skills & profiles', 'Self-evolving skills', 'Community skill import', 'Container isolation'],
    plan: null,
    cta: 'Get Started',
    ctaLink: '/signup',
  },
  {
    name: 'Starter',
    price: '$12',
    period: '/user/month',
    description: 'Cloud sync for solo devs & small teams',
    features: ['Per-seat pricing', 'Cloud hosted profiles', 'Portable across devices', 'MCP distribution', 'Profile versioning'],
    plan: 'starter',
    cta: 'Subscribe',
    seatInput: true,
  },
  {
    name: 'Team',
    price: '$560',
    period: '/month',
    description: 'For engineering teams up to 20',
    features: ['20 seats included', 'Team skill sync', 'MCP integration', 'Shared org profiles', 'Invite system', 'Skill audit trail'],
    plan: 'team',
    cta: 'Subscribe',
    highlight: true,
    badge: 'Popular',
  },
  {
    name: 'Org Starter',
    price: '$199',
    period: '/month',
    description: 'For small organizations',
    features: ['Up to 50 seats', 'Up to 3 teams', 'Cross-team skill sharing', 'Org analytics dashboard', 'Priority support'],
    plan: 'org_starter',
    cta: 'Start Free Trial',
    trial: true,
  },
  {
    name: 'Org Growth',
    price: '$399',
    period: '/month',
    description: 'For growing organizations',
    features: ['Up to 200 seats', 'Up to 8 teams', 'Cross-team skill sharing', 'Org analytics dashboard', 'Priority support', 'Custom compliance rules'],
    plan: 'org_growth',
    cta: 'Start Free Trial',
    trial: true,
  },
  {
    name: 'Org Scale',
    price: '$999',
    period: '/month',
    description: 'For large enterprises',
    features: ['Unlimited seats', 'Unlimited teams', 'Cross-team skill sharing', 'Org analytics dashboard', 'Dedicated support', 'Custom compliance rules', 'SSO / SAML (coming soon)'],
    plan: 'org_scale',
    cta: 'Start Free Trial',
    trial: true,
    badge: 'Enterprise',
  },
]

export function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [seatCounts, setSeatCounts] = useState<Record<string, number>>({ starter: 1 })
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleUpgrade = async (plan: string) => {
    const session = getAuthSession()
    if (!session) {
      navigate('/signup')
      return
    }

    // For org-scoped plans, user needs an org. Redirect to account to create one.
    // In the future, this could show an org selector modal.
    setLoading(plan)
    try {
      // Fetch user's orgs to find one to bill
      const orgsRes = await fetch(`${API_BASE}/v1/users/me/orgs`, {
        headers: { Authorization: `Bearer ${session.token}` },
      })
      const orgsData = await orgsRes.json()
      const userOrgs = Array.isArray(orgsData) ? orgsData : []

      if (userOrgs.length === 0) {
        showToast('Create an organization first to subscribe to a plan.', 'info')
        navigate('/account')
        return
      }

      // Use the most recently created org for checkout
      const orgId = userOrgs[userOrgs.length - 1].org_id
      const quantity = seatCounts[plan] || 1

      const res = await fetch(`${API_BASE}/v1/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ org_id: orgId, plan, quantity }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        showToast(data.error || 'Failed to create checkout session', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="relative z-1" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 16px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 36, color: 'var(--text)', margin: '0 0 12px', letterSpacing: '-0.03em' }}>
            Pricing
          </h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            The platform for AI agent profiles. Host, version, and distribute skills to your team via MCP.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {tiers.map(tier => (
            <div key={tier.name} style={{
              background: 'var(--surface)',
              border: `1px solid ${tier.highlight ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 12,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}>
              {tier.badge && (
                <span style={{
                  position: 'absolute', top: -10, right: 12,
                  fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 10,
                  background: 'var(--accent)', color: 'var(--bg)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {tier.badge}
                </span>
              )}

              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: 16, color: 'var(--text)', margin: '0 0 4px' }}>{tier.name}</h3>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>{tier.description}</p>
              </div>

              <div style={{ marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 24, color: 'var(--text)' }}>{tier.price}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{tier.period}</span>
              </div>

              {tier.trial && (
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginBottom: 8 }}>
                  14-day free trial
                </div>
              )}

              {tier.seatInput && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: 'var(--muted)' }}>Seats:</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={seatCounts[tier.plan!] || 1}
                    onChange={e => setSeatCounts(prev => ({ ...prev, [tier.plan!]: Math.max(1, parseInt(e.target.value) || 1) }))}
                    style={{
                      width: 56, padding: '4px 8px', fontSize: 12, borderRadius: 6,
                      border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)',
                      outline: 'none', textAlign: 'center',
                    }}
                  />
                </div>
              )}

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', flex: 1 }}>
                {tier.features.map(f => (
                  <li key={f} style={{ fontSize: 11, color: 'var(--muted)', padding: '3px 0', borderBottom: '1px solid var(--border)' }}>
                    {f}
                  </li>
                ))}
              </ul>

              {tier.ctaLink ? (
                <a href={tier.ctaLink} style={{
                  display: 'block', textAlign: 'center', padding: '9px 0', fontSize: 12, fontWeight: 600, borderRadius: 8,
                  border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)',
                  textDecoration: 'none', cursor: 'pointer',
                }}>
                  {tier.cta}
                </a>
              ) : (
                <button
                  onClick={() => tier.plan && handleUpgrade(tier.plan)}
                  disabled={loading === tier.plan}
                  style={{
                    width: '100%', padding: '9px 0', fontSize: 12, fontWeight: 600, borderRadius: 8,
                    border: tier.highlight ? 'none' : '1px solid var(--border)',
                    background: tier.highlight ? 'var(--accent)' : 'transparent',
                    color: tier.highlight ? 'var(--bg)' : 'var(--muted)',
                    cursor: loading === tier.plan ? 'not-allowed' : 'pointer',
                    opacity: loading === tier.plan ? 0.5 : 1,
                  }}
                >
                  {loading === tier.plan ? 'Loading...' : tier.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48, color: 'var(--muted)', fontSize: 13 }}>
          <p>All plans include profile versioning, MCP distribution, and container isolation.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>
            Questions? <a href="/contact" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Contact us</a>
          </p>
        </div>
      </div>
    </div>
  )
}
