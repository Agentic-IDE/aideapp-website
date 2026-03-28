import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setAuthCookie } from '../../services/auth'

/**
 * OAuth callback page. Receives token, refresh, userId from URL params
 * after Google/GitHub OAuth redirect. Stores session and redirects home.
 */
export function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const refresh = searchParams.get('refresh')
    const userId = searchParams.get('userId')

    if (!token || !userId) {
      setError('Authentication failed. Missing token or user ID.')
      return
    }

    // Fetch user email from the /me endpoint
    const apiBase = import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002'
    fetch(`${apiBase}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user?.email) {
          setAuthCookie(data.user.email, token, userId)
          navigate('/')
        } else {
          setError('Could not verify account. Please try again.')
        }
      })
      .catch(() => {
        // Even if /me fails, we have the token — store it and redirect
        setAuthCookie('user', token, userId)
        navigate('/')
      })
  }, [searchParams, navigate])

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', padding: 32 }}>
          <p style={{ color: '#ef4444', fontSize: 14 }}>{error}</p>
          <a href="/login" style={{ color: 'var(--accent)', fontSize: 13, marginTop: 12, display: 'inline-block' }}>
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>Signing you in...</p>
    </div>
  )
}
