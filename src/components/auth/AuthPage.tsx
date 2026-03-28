import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../layout/Navbar'
import { setAuthCookie } from '../../services/auth'

const API_BASE = import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002'

type Mode = 'login' | 'signup'

export function AuthPage({ initialMode = 'login' }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const reset = () => { setError(''); setSuccess(''); setPassword(''); setConfirm('') }

  const switchMode = (m: Mode) => { reset(); setMode(m) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'signup') {
      if (password.length < 8) { setError('Password must be at least 8 characters'); return }
      if (password !== confirm) { setError('Passwords do not match'); return }
    }

    setLoading(true)
    try {
      const endpoint = mode === 'signup' ? '/v1/auth/register' : '/v1/auth/login'
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || `${mode === 'signup' ? 'Registration' : 'Login'} failed`); return }

      // Store session in cookie and redirect to home
      setAuthCookie(data.user.email, data.token, data.user.id)
      setSuccess(mode === 'signup' ? 'Account created!' : 'Signed in!')
      setTimeout(() => navigate('/'), 500)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative z-1" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '0 16px' }}>
        <div style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '-0.02em',
              color: 'var(--muted)',
              marginBottom: 12,
            }}>
              Agentic IDE
            </div>
            <h1 style={{
              fontFamily: 'var(--fd)',
              fontWeight: 700,
              fontSize: 22,
              color: 'var(--text)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
              {mode === 'login'
                ? 'Sign in to sync your skills and settings'
                : 'Get started with Agentic IDE'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 14,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--surface2)',
                  color: 'var(--text)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={mode === 'signup' ? 8 : undefined}
                placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Your password'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 14,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--surface2)',
                  color: 'var(--text)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {mode === 'signup' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  placeholder="Repeat password"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: 14,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--surface2)',
                    color: 'var(--text)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {error && (
              <p style={{ fontSize: 12, color: '#ef4444', margin: '0 0 12px' }}>{error}</p>
            )}
            {success && (
              <p style={{ fontSize: 12, color: '#22c55e', margin: '0 0 12px' }}>{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px 0',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 8,
                border: 'none',
                background: 'var(--accent)',
                color: 'var(--bg)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.2s',
                marginTop: 4,
              }}
            >
              {loading
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* OAuth divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* OAuth buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a
              href={`${API_BASE}/v1/auth/google`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '10px 0', fontSize: 13, fontWeight: 500,
                borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--surface2)', color: 'var(--text)',
                textDecoration: 'none', cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
              Continue with Google
            </a>
            <a
              href={`${API_BASE}/v1/auth/github`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '10px 0', fontSize: 13, fontWeight: 500,
                borderRadius: 8, border: '1px solid var(--border)',
                background: 'var(--surface2)', color: 'var(--text)',
                textDecoration: 'none', cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Continue with GitHub
            </a>
          </div>

          {/* Toggle */}
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 20 }}>
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => switchMode('signup')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, fontSize: 12, padding: 0, textDecoration: 'underline' }}>
                  Sign up
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, fontSize: 12, padding: 0, textDecoration: 'underline' }}>
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
