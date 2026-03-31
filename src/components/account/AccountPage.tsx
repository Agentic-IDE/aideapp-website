import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Navbar } from '../layout/Navbar'
import { getAuthSession, clearAuthSession } from '../../services/auth'
import { useToast } from '../ui/Toast'

const API_BASE = import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002'

interface UserProfile {
  id: string
  email: string
  name: string | null
  tier: string
  avatar_url: string | null
  has_google: boolean
  has_github: boolean
  created_at: string
}

interface TeamMembership {
  team_id: string
  team_name: string
  role: string
  org_id: string | null
}

interface OrgMembership {
  org_id: string
  org_name: string
  role: string
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  padding: 24,
  marginBottom: 16,
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const valueStyle: React.CSSProperties = { fontSize: 14, color: 'var(--text)' }

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: 13,
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'var(--surface2)',
  color: 'var(--text)',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const smallBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 6,
  border: 'none',
  background: 'var(--accent)',
  color: 'var(--bg)',
  cursor: 'pointer',
}

export function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [teams, setTeams] = useState<TeamMembership[]>([])
  const [orgs, setOrgs] = useState<OrgMembership[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newOrgName, setNewOrgName] = useState('')
  const [creating, setCreating] = useState<'org' | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()

  const session = getAuthSession()

  // Show toast for query params (linked account, joined team, etc.)
  useEffect(() => {
    const linked = searchParams.get('linked')
    const joined = searchParams.get('joined')
    if (linked) {
      showToast(`${linked.charAt(0).toUpperCase() + linked.slice(1)} account linked!`)
      window.history.replaceState({}, '', '/account')
    }
    if (joined) {
      showToast(`You joined ${joined}!`)
      window.history.replaceState({}, '', '/account')
    }
  }, [searchParams, showToast])

  const fetchData = () => {
    if (!session) { navigate('/login'); return }
    const headers = { Authorization: `Bearer ${session.token}` }

    Promise.all([
      fetch(`${API_BASE}/v1/users/me`, { headers }).then(r => r.ok ? r.json() : Promise.reject(r)),
      fetch(`${API_BASE}/v1/users/me/teams`, { headers }).then(r => r.ok ? r.json() : []),
      fetch(`${API_BASE}/v1/users/me/orgs`, { headers }).then(r => r.ok ? r.json() : []),
    ])
      .then(([userData, teamsData, orgsData]) => {
        setProfile(userData)
        setTeams(Array.isArray(teamsData) ? teamsData : [])
        setOrgs(Array.isArray(orgsData) ? orgsData : [])
      })
      .catch((err) => {
        if (err?.status === 401) { clearAuthSession(); navigate('/login') }
        else setError('Failed to load account data.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleSignOut = () => { clearAuthSession(); navigate('/') }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const handleCreateOrg = async () => {
    if (!newOrgName.trim() || !session) return
    setCreating('org')
    try {
      const res = await fetch(`${API_BASE}/v1/orgs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ name: newOrgName.trim() }),
      })
      if (res.ok) {
        setNewOrgName('')
        showToast('Organization created! Now choose a plan.', 'info')
        navigate('/pricing')
      } else {
        const data = await res.json()
        showToast(data.error || 'Failed to create organization', 'error')
      }
    } catch { showToast('Network error', 'error') }
    finally { setCreating(null) }
  }

  const handleLinkGoogle = () => {
    if (!session) return
    window.location.href = `${API_BASE}/v1/auth/link/google?token=${session.token}`
  }

  const handleLinkGithub = () => {
    if (!session) return
    window.location.href = `${API_BASE}/v1/auth/link/github?token=${session.token}`
  }

  return (
    <div className="relative z-1" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '120px 16px 60px' }}>

        {loading && <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, marginTop: 80 }}>Loading...</div>}
        {error && <div style={{ textAlign: 'center', color: '#ef4444', fontSize: 14, marginTop: 80 }}>{error}</div>}

        {profile && (
          <>
            {/* Profile Card */}
            <div style={cardStyle}>
              <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 20, color: 'var(--text)', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                Your Account
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px 16px', alignItems: 'baseline' }}>
                <span style={labelStyle}>Name</span>
                <span style={valueStyle}>{profile.name || '—'}</span>
                <span style={labelStyle}>Email</span>
                <span style={valueStyle}>{profile.email}</span>
                <span style={labelStyle}>Tier</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                    background: profile.tier === 'free' ? 'var(--surface2)' : 'var(--accent)',
                    color: profile.tier === 'free' ? 'var(--muted)' : 'var(--bg)',
                    textTransform: 'uppercase', letterSpacing: '0.05em', width: 'fit-content',
                  }}>{profile.tier}</span>
                  {profile.tier === 'free' && (
                    <a href="/pricing" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}>Upgrade</a>
                  )}
                </div>
                <span style={labelStyle}>Since</span>
                <span style={valueStyle}>{formatDate(profile.created_at)}</span>
              </div>

              {/* Connected accounts with link buttons */}
              <div style={{ marginTop: 20 }}>
                <span style={{ ...labelStyle, display: 'block', marginBottom: 8 }}>Connected</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {profile.has_google ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid var(--accent)', color: 'var(--text)' }}>
                      ✓ Google
                    </span>
                  ) : (
                    <button onClick={handleLinkGoogle} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid var(--border)', color: 'var(--muted)', background: 'none', cursor: 'pointer' }}>
                      + Link Google
                    </button>
                  )}
                  {profile.has_github ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid var(--accent)', color: 'var(--text)' }}>
                      ✓ GitHub
                    </span>
                  ) : (
                    <button onClick={handleLinkGithub} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid var(--border)', color: 'var(--muted)', background: 'none', cursor: 'pointer' }}>
                      + Link GitHub
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Teams Card */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: 16, color: 'var(--text)', margin: 0, letterSpacing: '-0.01em' }}>Teams</h3>
              </div>

              {teams.length === 0 && <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 12px' }}>No team memberships yet.</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {teams.map((t) => (
                  <Link
                    key={t.team_id}
                    to={`/account/team/${t.team_id}`}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, background: 'var(--surface2)', textDecoration: 'none', color: 'inherit' }}
                  >
                    <span style={{ fontSize: 13, color: 'var(--text)' }}>{t.team_name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.role}</span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>

              {teams.length === 0 && orgs.length > 0 && (
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                  Create teams from your <Link to={`/account/org/${orgs[0].org_id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>organization page</Link>.
                </p>
              )}
            </div>

            {/* Organizations Card */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: 16, color: 'var(--text)', margin: 0, letterSpacing: '-0.01em' }}>Organizations</h3>
              </div>

              {orgs.length === 0 && <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 12px' }}>No organization memberships yet.</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {orgs.map((o) => (
                  <Link
                    key={o.org_id}
                    to={`/account/org/${o.org_id}`}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, background: 'var(--surface2)', textDecoration: 'none', color: 'inherit' }}
                  >
                    <span style={{ fontSize: 13, color: 'var(--text)' }}>{o.org_name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{o.role}</span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="New organization name"
                  value={newOrgName}
                  onChange={e => setNewOrgName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateOrg()}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button onClick={handleCreateOrg} disabled={creating === 'org' || !newOrgName.trim()} style={{ ...smallBtnStyle, opacity: creating === 'org' || !newOrgName.trim() ? 0.5 : 1 }}>
                  {creating === 'org' ? '...' : 'Create'}
                </button>
              </div>
            </div>

            {/* Sign Out */}
            <button onClick={handleSignOut} style={{
              width: '100%', padding: '11px 0', fontSize: 13, fontWeight: 500, borderRadius: 8,
              border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer',
            }}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  )
}
