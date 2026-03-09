import { WAITLIST } from '../../constants/content'
import { Section } from '../layout/Section'
import { SectionLabel } from '../layout/SectionLabel'
import { useWaitlistForm } from '../../hooks/useWaitlistForm'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

export function WaitlistSection() {
  const { email, setEmail, submitted, loading, error, handleSubmit } = useWaitlistForm()
  const ref = useIntersectionObserver()

  return (
    <Section id="waitlist" className="text-center">
      <div ref={ref}>
        <SectionLabel centered>{WAITLIST.label}</SectionLabel>
        <h2
          className="fade-up"
          style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(36px, 5vw, 58px)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: 20,
            whiteSpace: 'pre-line',
          }}
        >
          {WAITLIST.title}
        </h2>
        <p
          className="fade-up"
          style={{
            fontSize: 14,
            color: 'var(--muted)',
            maxWidth: 500,
            lineHeight: 1.85,
            margin: '0 auto 40px',
          }}
        >
          {WAITLIST.subtitle}
        </p>
        <form
          className="fade-up flex gap-3 justify-center flex-wrap"
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
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '14px 20px',
              fontFamily: 'var(--fm)',
              fontSize: 14,
              color: 'var(--text)',
              width: 300,
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          <button
            type="submit"
            disabled={submitted || loading}
            style={{
              background: submitted ? 'var(--accent)' : 'var(--accent)',
              color: 'var(--bg)',
              border: 'none',
              padding: '14px 32px',
              borderRadius: 8,
              fontFamily: 'var(--fd)',
              fontSize: 15,
              fontWeight: 700,
              cursor: submitted ? 'default' : 'pointer',
              transition: 'transform 0.2s, opacity 0.2s',
            }}
          >
            {submitted ? WAITLIST.successLabel : WAITLIST.buttonLabel}
          </button>
        </form>
        {error && (
          <p style={{ marginTop: 12, fontSize: 12, color: '#FF4444' }}>{error}</p>
        )}
        <p style={{ marginTop: 16, fontSize: 11, color: 'var(--muted)' }}>{WAITLIST.note}</p>
      </div>
    </Section>
  )
}
