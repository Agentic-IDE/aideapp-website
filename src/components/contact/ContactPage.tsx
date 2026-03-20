import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'
import { useContactForm } from '../../hooks/useContactForm'

const containerStyle = { maxWidth: 800, margin: '0 auto', padding: '140px 48px 80px' }
const h1Style = { fontFamily: 'var(--fd)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 } as const
const pStyle = { fontSize: 15, lineHeight: 1.85, color: 'var(--muted)', marginBottom: 32 } as const

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  fontSize: 14,
  fontFamily: 'var(--fm)',
  color: 'var(--text)',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  outline: 'none',
  transition: 'border-color 0.2s',
} as const

const MESSAGE_LIMIT = 150

export function ContactPage() {
  const { email, setEmail, message, setMessage, status, handleSubmit } = useContactForm()

  return (
    <>
      <Navbar />
      <div className="relative z-1" style={containerStyle}>
        <h1 style={h1Style}>Contact</h1>
        <p style={pStyle}>Have a question or feedback? Send us a message and we'll get back to you.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Message
            </label>
            <textarea
              required
              placeholder="What's on your mind?"
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= MESSAGE_LIMIT) setMessage(e.target.value)
              }}
              maxLength={MESSAGE_LIMIT}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
            />
            <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right', marginTop: 4, fontFamily: 'var(--fm)' }}>
              {message.length}/{MESSAGE_LIMIT}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            style={{
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--bg)',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 8,
              cursor: status === 'loading' || status === 'success' ? 'default' : 'pointer',
              opacity: status === 'loading' || status === 'success' ? 0.6 : 1,
              transition: 'opacity 0.2s',
              alignSelf: 'flex-start',
            }}
          >
            {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
          </button>

          {status === 'error' && (
            <p style={{ fontSize: 13, color: '#e74c3c' }}>Something went wrong. Please try again.</p>
          )}
          {status === 'success' && (
            <p style={{ fontSize: 13, color: '#2ecc71' }}>Message sent successfully.</p>
          )}
        </form>
      </div>
      <Footer />
    </>
  )
}
