import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_CLOUD_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3002'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      // Redirect back to app with tokens
      window.location.href = `agenticide://auth-callback?token=${data.token}&refresh=${data.refresh_token}&userId=${data.user.id}`
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)', fontFamily: 'var(--fd)' }}>
              Sign In
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
              Welcome back to Agentic IDE
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface2)] focus:outline-none focus:border-[var(--accent)]"
                style={{ color: 'var(--text)' }}
                placeholder="you@example.com"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface2)] focus:outline-none focus:border-[var(--accent)]"
                style={{ color: 'var(--text)' }}
                placeholder="Your password"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--muted)' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
