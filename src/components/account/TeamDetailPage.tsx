import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Navbar } from '../layout/Navbar'
import { getAuthSession } from '../../services/auth'
import { useToast } from '../ui/Toast'

const API_BASE = import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002'

interface TeamInfo { id: string; name: string; member_count: number; your_role: string; org_id: string | null }
interface Member { user_id: string; email: string; name: string | null; role: string; avatar_url: string | null }
interface Invitation { id: string; email: string; role: string; expires_at: string }

const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 16 }
const inputStyle: React.CSSProperties = { padding: '8px 12px', fontSize: 13, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' as const }
const smallBtnStyle: React.CSSProperties = { padding: '6px 14px', fontSize: 11, fontWeight: 600, borderRadius: 6, border: 'none', background: 'var(--accent)', color: 'var(--bg)', cursor: 'pointer' }
const dangerBtnStyle: React.CSSProperties = { ...smallBtnStyle, background: 'transparent', border: '1px solid #ef4444', color: '#ef4444' }

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const session = getAuthSession()

  const [team, setTeam] = useState<TeamInfo | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [pendingInvites, setPendingInvites] = useState<Invitation[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const isAdmin = team?.your_role === 'admin' || team?.your_role === 'owner'

  const fetchAll = async () => {
    if (!session || !id) { navigate('/login'); return }
    const headers = { Authorization: `Bearer ${session.token}` }
    try {
      const [teamRes, membersRes] = await Promise.all([
        fetch(`${API_BASE}/v1/teams/${id}`, { headers }),
        fetch(`${API_BASE}/v1/teams/${id}/members`, { headers }),
      ])
      if (!teamRes.ok) { navigate('/account'); return }
      setTeam(await teamRes.json())
      setMembers(await membersRes.json())

      // Fetch invitations if admin
      const invRes = await fetch(`${API_BASE}/v1/teams/${id}/invitations`, { headers })
      if (invRes.ok) setPendingInvites(await invRes.json())
    } catch {
      showToast('Failed to load team', 'error')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [id])

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !session || !id) return
    setSending(true)
    try {
      const res = await fetch(`${API_BASE}/v1/teams/${id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      })
      if (res.ok) {
        setInviteEmail('')
        showToast(`Invitation sent to ${inviteEmail.trim()}`)
        fetchAll()
      } else {
        const data = await res.json()
        showToast(data.error || 'Failed to send invite', 'error')
      }
    } catch { showToast('Network error', 'error') }
    finally { setSending(false) }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!session || !id) return
    const res = await fetch(`${API_BASE}/v1/teams/${id}/members/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) { showToast('Role updated'); fetchAll() }
    else showToast('Failed to update role', 'error')
  }

  const handleRemoveMember = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name} from this team?`)) return
    if (!session || !id) return
    const res = await fetch(`${API_BASE}/v1/teams/${id}/members/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.token}` },
    })
    if (res.ok) { showToast('Member removed'); fetchAll() }
    else showToast('Failed to remove member', 'error')
  }

  const handleRevokeInvite = async (inviteId: string) => {
    if (!session || !id) return
    const res = await fetch(`${API_BASE}/v1/teams/${id}/invitations/${inviteId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.token}` },
    })
    if (res.ok) { showToast('Invitation revoked'); fetchAll() }
    else showToast('Failed to revoke', 'error')
  }

  const handleDeleteTeam = async () => {
    if (!confirm('Are you sure you want to delete this team? This cannot be undone.')) return
    if (!session || !id) return
    const res = await fetch(`${API_BASE}/v1/teams/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.token}` },
    })
    if (res.ok) { showToast('Team deleted'); navigate('/account') }
    else showToast('Failed to delete team', 'error')
  }

  return (
    <div className="relative z-1" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '120px 16px 60px' }}>
        <Link to="/account" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', marginBottom: 16, display: 'block' }}>← Back to account</Link>

        {loading && <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 40 }}>Loading...</div>}

        {team && (
          <>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 20, color: 'var(--text)', margin: 0 }}>{team.name}</h2>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--muted)', textTransform: 'uppercase' }}>{team.your_role}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0 0' }}>{team.member_count} member{team.member_count !== 1 ? 's' : ''}</p>
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
                      {isAdmin && m.user_id !== session?.userId ? (
                        <>
                          <select
                            value={m.role}
                            onChange={e => handleChangeRole(m.user_id, e.target.value)}
                            style={{ ...inputStyle, padding: '4px 8px', fontSize: 11 }}
                          >
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
            {isAdmin && (
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

                {/* Pending invitations */}
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

            {/* Delete team */}
            {team.your_role === 'owner' && (
              <button onClick={handleDeleteTeam} style={{ ...dangerBtnStyle, width: '100%', padding: '11px 0', fontSize: 13 }}>
                Delete Team
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
