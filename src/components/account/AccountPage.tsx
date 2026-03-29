import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../layout/Navbar'
import { getAuthSession, clearAuthSession } from '../../services/auth'

const API_BASE = import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002'

interface UserProfile {
  id: string
  email: string
  name: string | null
  tier: string
  avatar_url: string | null
  google_id: boolean
  github_id: boolean
  created_at: string
}

interface TeamMembership {
  team: { id: string; name: string }
  role: string
}

interface SkillProfile {
  id: string
  name: string
  latest_version: number
  owner_type: string
  owner_name?: string
  skills_count?: number
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

const valueStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text)',
}

const badgeStyle = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 11,
  padding: '4px 10px',
  borderRadius: 20,
  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
  color: active ? 'var(--text)' : 'var(--muted)',
  opacity: active ? 1 : 0.5,
})

export function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [teams, setTeams] = useState<TeamMembership[]>([])
  const [profiles, setProfiles] = useState<SkillProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const session = getAuthSession()
    if (!session) {
      navigate('/login')
      return
    }

    const headers = { Authorization: `Bearer ${session.token}` }

    Promise.all([
      fetch(`${API_BASE}/v1/auth/me`, { headers }).then(r => r.ok ? r.json() : Promise.reject(r)),
      fetch(`${API_BASE}/v1/users/me/teams`, { headers }).then(r => r.ok ? r.json() : []),
      fetch(`${API_BASE}/v1/users/me/all-profiles`, { headers }).then(r => r.ok ? r.json() : []),
    ])
      .then(([meData, teamsData, profilesData]) => {
        setProfile(meData.user)
        setTeams(Array.isArray(teamsData) ? teamsData : teamsData.teams || [])
        setProfiles(Array.isArray(profilesData) ? profilesData : profilesData.profiles || [])
      })
      .catch((err) => {
        if (err?.status === 401) {
          clearAuthSession()
          navigate('/login')
        } else {
          setError('Failed to load account data.')
        }
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const handleSignOut = () => {
    clearAuthSession()
    navigate('/')
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="relative z-1" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '120px 16px 60px' }}>

        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, marginTop: 80 }}>
            Loading...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: '#ef4444', fontSize: 14, marginTop: 80 }}>
            {error}
          </div>
        )}

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
                <span style={{
                  ...valueStyle,
                  display: 'inline-block',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: profile.tier === 'free' ? 'var(--surface2)' : 'var(--accent)',
                  color: profile.tier === 'free' ? 'var(--muted)' : 'var(--bg)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  width: 'fit-content',
                }}>
                  {profile.tier}
                </span>
                <span style={labelStyle}>Since</span>
                <span style={valueStyle}>{formatDate(profile.created_at)}</span>
              </div>

              {/* Connected accounts */}
              <div style={{ marginTop: 20 }}>
                <span style={{ ...labelStyle, display: 'block', marginBottom: 8 }}>Connected</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={badgeStyle(profile.google_id)}>
                    <svg width="12" height="12" viewBox="0 0 48 48"><path fill={profile.google_id ? '#FFC107' : '#666'} d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/></svg>
                    Google
                  </span>
                  <span style={badgeStyle(profile.github_id)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </span>
                </div>
              </div>
            </div>

            {/* Teams Card */}
            <div style={cardStyle}>
              <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: 16, color: 'var(--text)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                Teams
              </h3>
              {teams.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>No team memberships yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {teams.map((t) => (
                    <div key={t.team.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--surface2)' }}>
                      <span style={{ fontSize: 13, color: 'var(--text)' }}>{t.team.name}</span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: t.role === 'admin' ? 'rgba(255,255,255,0.1)' : 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        {t.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skill Profiles Card */}
            <div style={cardStyle}>
              <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: 16, color: 'var(--text)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                Skill Profiles
              </h3>
              {profiles.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>No published profiles yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {profiles.map((p) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, background: 'var(--surface2)' }}>
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                          v{p.latest_version}{p.skills_count != null ? ` \u00b7 ${p.skills_count} skills` : ''}{p.owner_name ? ` \u00b7 ${p.owner_name}` : ''}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 4,
                        border: '1px solid var(--border)',
                        color: 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        {p.owner_type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                padding: '11px 0',
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--muted)',
                cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  )
}
