import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Navbar } from '../layout/Navbar'
import { getAuthSession } from '../../services/auth'
import { useToast } from '../ui/Toast'

const API_BASE = import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002'

export function InviteAcceptPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [error, setError] = useState('')
  const [accepting, setAccepting] = useState(true)

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setError('Invalid invitation link.'); setAccepting(false); return }

    const session = getAuthSession()
    if (!session) {
      // Not logged in — redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent(`/invite/accept?token=${token}`)}`)
      return
    }

    // Accept the invitation
    fetch(`${API_BASE}/v1/invitations/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
      body: JSON.stringify({ token }),
    })
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          showToast(`You joined ${data.name}!`)
          navigate(`/account?joined=${encodeURIComponent(data.name)}`)
        } else {
          setError(data.error || 'Failed to accept invitation.')
          setAccepting(false)
        }
      })
      .catch(() => { setError('Network error.'); setAccepting(false) })
  }, [searchParams, navigate, showToast])

  return (
    <div className="relative z-1" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '0 16px' }}>
        <div style={{ textAlign: 'center' }}>
          {accepting && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Accepting invitation...</p>}
          {error && (
            <>
              <p style={{ color: '#ef4444', fontSize: 14, marginBottom: 12 }}>{error}</p>
              <a href="/account" style={{ color: 'var(--accent)', fontSize: 13 }}>Go to your account</a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
