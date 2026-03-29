import { useState } from 'react'
import { Navbar } from '../layout/Navbar'
import { getAuthSession } from '../../services/auth'

const API_BASE = import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002'

const tiers = [
  {
    name: 'Basic',
    price: 'Free',
    period: '',
    description: 'For individual developers',
    features: ['1 user', 'Local skills only', 'Self-evolving skills', 'Community skill import'],
    plan: null,
    cta: 'Get Started',
    ctaLink: '/signup',
  },
  {
    name: 'Starter',
    price: '$12',
    period: '/user/month',
    description: 'For solo developers who want cloud sync',
    features: ['Up to 3 users', 'Cloud hosted skills', 'Portable across devices', '1GB storage'],
    plan: 'starter',
    cta: 'Upgrade',
    highlight: false,
  },
  {
    name: 'Team',
    price: '$28',
    period: '/dev/month',
    description: 'For engineering teams',
    features: ['Up to 25 users', 'Team skill sync', 'MCP integration', 'Shared org profiles', 'Invite system', '5GB storage', 'Skill plan audit'],
    plan: 'team',
    cta: 'Upgrade',
    highlight: true,
  },
  {
    name: 'Organization',
    price: 'From $199',
    period: '/month',
    description: 'For companies with multiple teams',
    features: ['Starter: up to 3 teams — $199/mo', 'Growth: up to 8 teams — $399/mo', 'Scale: up to 20 teams — $699/mo', 'Dedicated DB per team', 'Cross-team skill sharing', 'Org analytics dashboard', 'Priority support'],
    plan: 'org_starter',
    cta: 'Contact Us',
    ctaLink: '/contact',
  },
]

export function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (plan: string) => {
    const session = getAuthSession()
    if (!session) {
      window.location.href = '/signup'
      return
    }
    setLoading(plan)
    try {
      const res = await fetch(`${API_BASE}/v1/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ plan, quantity: 1 }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to create checkout session')
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="relative z-1" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '120px 16px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 32, color: 'var(--text)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Pricing
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', maxWidth: 500, margin: '0 auto' }}>
            GitHub for Agents — host, version, and distribute AI agent profiles to your team.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {tiers.map(tier => (
            <div key={tier.name} style={{
              background: 'var(--surface)',
              border: `1px solid ${tier.highlight ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: 18, color: 'var(--text)', margin: '0 0 4px' }}>{tier.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>{tier.description}</p>
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 28, color: 'var(--text)' }}>{tier.price}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{tier.period}</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', flex: 1 }}>
                {tier.features.map(f => (
                  <li key={f} style={{ fontSize: 12, color: 'var(--muted)', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                    {f}
                  </li>
                ))}
              </ul>

              {tier.ctaLink ? (
                <a href={tier.ctaLink} style={{
                  display: 'block', textAlign: 'center', padding: '10px 0', fontSize: 13, fontWeight: 600, borderRadius: 8,
                  border: tier.highlight ? 'none' : '1px solid var(--border)',
                  background: tier.highlight ? 'var(--accent)' : 'transparent',
                  color: tier.highlight ? 'var(--bg)' : 'var(--muted)',
                  textDecoration: 'none', cursor: 'pointer',
                }}>
                  {tier.cta}
                </a>
              ) : (
                <button
                  onClick={() => tier.plan && handleUpgrade(tier.plan)}
                  disabled={loading === tier.plan}
                  style={{
                    width: '100%', padding: '10px 0', fontSize: 13, fontWeight: 600, borderRadius: 8,
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
      </div>
    </div>
  )
}
