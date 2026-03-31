import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Navbar } from '../layout/Navbar'
import { getAuthSession } from '../../services/auth'
import { useToast } from '../ui/Toast'
import { getSubscription, openBillingPortal, formatTierName, tierColor, type SubscriptionInfo } from '../../services/billing'

const API_BASE = import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002'

interface OrgInfo { id: string; name: string; member_count: number; your_role: string }
interface Member { user_id: string; email: string; name: string | null; role: string }
interface OrgTeam { id: string; name: string }
interface Invitation { id: string; email: string; role: string; expires_at: string }

const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 16 }
const inputStyle: React.CSSProperties = { padding: '8px 12px', fontSize: 13, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' as const }
const smallBtnStyle: React.CSSProperties = { padding: '6px 14px', fontSize: 11, fontWeight: 600, borderRadius: 6, border: 'none', background: 'var(--accent)', color: 'var(--bg)', cursor: 'pointer' }
const dangerBtnStyle: React.CSSProperties = { ...smallBtnStyle, background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }

export function OrgDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const session = getAuthSession()

  const [org, setOrg] = useState<OrgInfo | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [orgTeams, setOrgTeams] = useState<OrgTeam[]>([])
  const [pendingInvites, setPendingInvites] = useState<Invitation[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [newTeamName, setNewTeamName] = useState('')
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchParams] = useSearchParams()

  const isAdmin = org?.your_role === 'admin'
  const hasActiveSubscription = subscription &&
    subscription.tier !== 'basic' &&
    ['active', 'trialing'].includes(subscription.status)

  // Show billing success toast
  useEffect(() => {
    if (searchParams.get('billing') === 'success') {
      showToast('Subscription activated!', 'success')
      window.history.replaceState({}, '', `/account/org/${id}`)
    }
  }, [searchParams])

  const fetchAll = async () => {
    if (!session || !id) { navigate('/login'); return }
    const headers = { Authorization: `Bearer ${session.token}` }
    try {
      const [orgRes, membersRes, teamsRes] = await Promise.all([
        fetch(`${API_BASE}/v1/orgs/${id}`, { headers }),
        fetch(`${API_BASE}/v1/orgs/${id}/members`, { headers }),
        fetch(`${API_BASE}/v1/orgs/${id}/teams`, { headers }),
      ])
      if (!orgRes.ok) { navigate('/account'); return }
      setOrg(await orgRes.json())
      setMembers(await membersRes.json())
      setOrgTeams(await teamsRes.json())

      const invRes = await fetch(`${API_BASE}/v1/orgs/${id}/invitations`, { headers })
      if (invRes.ok) setPendingInvites(await invRes.json())

      // Fetch subscription status
      const sub = await getSubscription(session.token, id)
      if (sub) setSubscription(sub)
    } catch { showToast('Failed to load organization', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [id])

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !session || !id) return
    setSending(true)
    try {
      const res = await fetch(`${API_BASE}/v1/orgs/${id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      })
      if (res.ok) { setInviteEmail(''); showToast(`Invitation sent to ${inviteEmail.trim()}`); fetchAll() }
      else { const d = await res.json(); showToast(d.error || 'Failed', 'error') }
    } catch { showToast('Network error', 'error') }
    finally { setSending(false) }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!session || !id) return
    const res = await fetch(`${API_BASE}/v1/orgs/${id}/members/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) { showToast('Role updated'); fetchAll() }
    else showToast('Failed to update role', 'error')
  }

  const handleRemoveMember = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name} from this organization?`)) return
    if (!session || !id) return
    const res = await fetch(`${API_BASE}/v1/orgs/${id}/members/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.token}` },
    })
    if (res.ok) { showToast('Member removed'); fetchAll() }
    else showToast('Failed to remove', 'error')
  }

  const handleRevokeInvite = async (inviteId: string) => {
    if (!session || !id) return
    const res = await fetch(`${API_BASE}/v1/orgs/${id}/invitations/${inviteId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.token}` },
    })
    if (res.ok) { showToast('Invitation revoked'); fetchAll() }
    else showToast('Failed to revoke', 'error')
  }

  const handleCreateTeamUnderOrg = async () => {
    if (!newTeamName.trim() || !session || !id) return
    const res = await fetch(`${API_BASE}/v1/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ name: newTeamName.trim(), org_id: id }),
    })
    if (res.ok) { setNewTeamName(''); showToast(`Team "${newTeamName.trim()}" created`); fetchAll() }
    else showToast('Failed to create team', 'error')
  }

  const handleDeleteOrg = async () => {
    if (!confirm('Delete this organization? All teams, members, and data will be permanently removed.')) return
    if (!session || !id) return
    const res = await fetch(`${API_BASE}/v1/orgs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.token}` },
    })
    if (res.ok) { showToast('Organization deleted'); navigate('/account') }
    else showToast('Failed to delete', 'error')
  }

  return (
    <div className="relative z-1" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '120px 16px 60px' }}>
        <Link to="/account" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', marginBottom: 16, display: 'block' }}>← Back to account</Link>

        {loading && <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 40 }}>Loading...</div>}

        {org && (
          <>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 20, color: 'var(--text)', margin: 0 }}>{org.name}</h2>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--muted)', textTransform: 'uppercase' }}>{org.your_role}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0 0' }}>{org.member_count} member{org.member_count !== 1 ? 's' : ''}</p>
            </div>

            {/* Subscription */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: 16, color: 'var(--text)', margin: 0 }}>Subscription</h3>
                {subscription && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                    ...tierColor(subscription.tier), textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {formatTierName(subscription.tier)}
                  </span>
                )}
              </div>

              {subscription?.status === 'past_due' && (
                <div style={{ padding: '8px 12px', borderRadius: 6, background: '#ef44441a', border: '1px solid #ef4444', color: '#ef4444', fontSize: 12, marginBottom: 12 }}>
                  Payment failed. Please update your billing information.
                </div>
              )}

              {subscription?.status === 'trialing' && subscription.trial_end && (
                <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, margin: '0 0 8px' }}>
                  Free trial ends {new Date(subscription.trial_end).toLocaleDateString()}
                </p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seats</span>
                  <p style={{ fontSize: 14, color: 'var(--text)', margin: '2px 0 0', fontWeight: 500 }}>
                    {subscription?.seat_count || members.length} / {subscription?.seat_limit === 9999 ? 'Unlimited' : subscription?.seat_limit || 1}
                  </p>
                </div>
                {subscription?.current_period_end && (
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Renews</span>
                    <p style={{ fontSize: 14, color: 'var(--text)', margin: '2px 0 0', fontWeight: 500 }}>
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {!hasActiveSubscription && (
                <div style={{ padding: '12px 16px', borderRadius: 8, background: 'var(--surface2)', border: '1px solid var(--border)', marginBottom: 12 }}>
                  <p style={{ fontSize: 13, color: 'var(--text)', margin: '0 0 8px', fontWeight: 500 }}>
                    Subscribe to unlock team creation, member invites, and collaboration features.
                  </p>
                  <Link to="/pricing" style={{ ...smallBtnStyle, textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                    Choose a Plan
                  </Link>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                {hasActiveSubscription && isAdmin && (
                  <button
                    onClick={() => session && id && openBillingPortal(session.token, id).catch(e => showToast(e.message, 'error'))}
                    style={smallBtnStyle}
                  >
                    Manage Billing
                  </button>
                )}
              </div>

              {subscription?.cancel_at_period_end && (
                <p style={{ fontSize: 11, color: '#f59e0b', margin: '8px 0 0' }}>
                  Cancels at end of billing period
                </p>
              )}
            </div>

            {/* Teams under org */}
            <div style={cardStyle}>
              <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: 16, color: 'var(--text)', margin: '0 0 12px' }}>Teams</h3>
              {orgTeams.length === 0 && <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 12px' }}>No teams in this organization yet.</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {orgTeams.map(t => (
                  <Link key={t.id} to={`/account/team/${t.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--surface2)', textDecoration: 'none', color: 'inherit' }}>
                    <span style={{ fontSize: 13, color: 'var(--text)' }}>{t.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>→</span>
                  </Link>
                ))}
              </div>
              {isAdmin && hasActiveSubscription && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" placeholder="New team name" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreateTeamUnderOrg()} style={{ ...inputStyle, flex: 1 }} />
                  <button onClick={handleCreateTeamUnderOrg} disabled={!newTeamName.trim()} style={{ ...smallBtnStyle, opacity: !newTeamName.trim() ? 0.5 : 1 }}>Create</button>
                </div>
              )}
              {isAdmin && !hasActiveSubscription && (
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                  <Link to="/pricing" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Upgrade</Link> to create teams.
                </p>
              )}
            </div>

            {/* Members */}
            <div style={cardStyle}>
              <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: 16, color: 'var(--text)', margin: '0 0 12px' }}>Members</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {members.map(m => (
                  <div key={m.user_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--surface2)' }}>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{m.name || m.email}</div>
                      {m.name && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{m.email}</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isAdmin && hasActiveSubscription && m.user_id !== session?.userId ? (
                        <>
                          <select value={m.role} onChange={e => handleChangeRole(m.user_id, e.target.value)} style={{ ...inputStyle, padding: '4px 8px', fontSize: 11 }}>
                            <option value="member">member</option>
                            <option value="admin">admin</option>
                          </select>
                          <button onClick={() => handleRemoveMember(m.user_id, m.name || m.email)} style={{ ...dangerBtnStyle, padding: '4px 8px', fontSize: 10 }}>Remove</button>
                        </>
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--muted)', textTransform: 'uppercase' }}>{m.role}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invite */}
            {isAdmin && hasActiveSubscription && (
              <div style={cardStyle}>
                <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 600, fontSize: 16, color: 'var(--text)', margin: '0 0 12px' }}>Invite Member</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="email" placeholder="Email address" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInvite()} style={{ ...inputStyle, flex: 1 }} />
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ ...inputStyle, width: 90 }}>
                    <option value="member">member</option>
                    <option value="admin">admin</option>
                  </select>
                  <button onClick={handleInvite} disabled={sending || !inviteEmail.trim()} style={{ ...smallBtnStyle, opacity: sending ? 0.5 : 1 }}>
                    {sending ? '...' : 'Send'}
                  </button>
                </div>

                {pendingInvites.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                      {pendingInvites.map(inv => (
                        <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', borderRadius: 6, background: 'var(--surface2)' }}>
                          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{inv.email} ({inv.role})</span>
                          <button onClick={() => handleRevokeInvite(inv.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, cursor: 'pointer' }}>Revoke</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delete org */}
            {isAdmin && (
              <button onClick={handleDeleteOrg} style={{ ...dangerBtnStyle, width: '100%', padding: '11px 0', fontSize: 13 }}>
                Delete Organization
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
