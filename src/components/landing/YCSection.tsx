import { YC } from '../../constants/content'
import { Section } from '../layout/Section'
import { useContactForm } from '../../hooks/useContactForm'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

export function YCSection() {
  const ref = useIntersectionObserver()
  const { email, setEmail, message, setMessage, submitted, loading, error, handleSubmit } =
    useContactForm()

  return (
    <Section id="yc">
      <div
        ref={ref}
        className="fade-up yc-block"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '56px 64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 48,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 16,
              whiteSpace: 'pre-line',
            }}
          >
            {YC.title}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 440, lineHeight: 1.85 }}>
            {YC.description}
          </p>
          <form
            className="flex flex-col gap-3"
            style={{ marginTop: 32, maxWidth: 400 }}
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitted}
              style={{
                background: 'var(--dim)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '12px 16px',
                fontFamily: 'var(--fm)',
                fontSize: 13,
                color: 'var(--text)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            <textarea
              placeholder={YC.contactPlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submitted}
              rows={3}
              style={{
                background: 'var(--dim)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '12px 16px',
                fontFamily: 'var(--fm)',
                fontSize: 13,
                color: 'var(--text)',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.2s',
              }}
            />
            <button
              type="submit"
              disabled={submitted || loading}
              style={{
                background: 'var(--accent)',
                color: 'var(--bg)',
                border: 'none',
                padding: '12px 28px',
                borderRadius: 8,
                fontFamily: 'var(--fd)',
                fontSize: 14,
                fontWeight: 700,
                cursor: submitted ? 'default' : 'pointer',
                alignSelf: 'flex-start',
                transition: 'transform 0.2s, opacity 0.2s',
              }}
            >
              {submitted ? YC.contactSuccess : YC.contactButton}
            </button>
            {error && (
              <p style={{ fontSize: 12, color: '#FF4444', margin: 0 }}>{error}</p>
            )}
          </form>
        </div>
        {/* YC Badge */}
        <div
          className="shrink-0 text-center"
          style={{
            background: 'var(--dim)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '32px 40px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--fd)',
              fontSize: 48,
              fontWeight: 800,
              color: '#FF6B00',
              display: 'block',
              marginBottom: 8,
            }}
          >
            {YC.badge.logo}
          </span>
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            {YC.badge.label}
          </div>
          <div style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 700, marginTop: 4 }}>
            {YC.badge.season}
          </div>
        </div>
      </div>
    </Section>
  )
}
