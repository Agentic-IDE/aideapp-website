import { CTA } from '../../constants/content'
import { Section } from '../layout/Section'
import { SectionLabel } from '../layout/SectionLabel'
import { useContactForm } from '../../hooks/useContactForm'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { ContactOverlay } from './ContactOverlay'

export function YCSection() {
  const ref = useIntersectionObserver()
  const { email, setEmail, message, setMessage, status, handleSubmit } = useContactForm()
  const isDisabled = status === 'loading' || status === 'success'

  return (
    <Section id="cta" className="text-center">
      <div
        ref={ref}
        style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}
      >
        <SectionLabel centered>{CTA.label}</SectionLabel>
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
          {CTA.title}
        </h2>
        <p
          className="fade-up"
          style={{
            fontSize: 14,
            color: 'var(--muted)',
            maxWidth: 500,
            lineHeight: 1.85,
            margin: '0 auto 32px',
          }}
        >
          {CTA.subtitle}
        </p>
        <ul
          className="fade-up"
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 auto 40px',
            maxWidth: 480,
            textAlign: 'left',
          }}
        >
          {CTA.debtItems.map((item) => (
            <li
              key={item}
              style={{
                fontSize: 13,
                color: 'var(--muted)',
                lineHeight: 1.85,
                paddingLeft: 20,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--accent)',
                }}
              >
                →
              </span>
              {item}
            </li>
          ))}
        </ul>
        <div style={{ position: 'relative' }}>
          <ContactOverlay status={status} />
          <form
            className="fade-up flex flex-col gap-3"
            style={{ maxWidth: 400, margin: '0 auto' }}
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isDisabled}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '14px 20px',
                fontFamily: 'var(--fm)',
                fontSize: 14,
                color: 'var(--text)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
            <textarea
              placeholder={CTA.contactPlaceholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isDisabled}
              rows={3}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '14px 20px',
                fontFamily: 'var(--fm)',
                fontSize: 14,
                color: 'var(--text)',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.2s',
              }}
            />
            <button
              type="submit"
              disabled={isDisabled}
              style={{
                background: 'var(--accent)',
                color: 'var(--bg)',
                border: 'none',
                padding: '14px 32px',
                borderRadius: 8,
                fontFamily: 'var(--fd)',
                fontSize: 15,
                fontWeight: 700,
                cursor: isDisabled ? 'default' : 'pointer',
                transition: 'transform 0.2s, opacity 0.2s',
              }}
            >
              {CTA.buttonLabel}
            </button>
          </form>
          <p
            className="fade-up"
            style={{ marginTop: 16, fontSize: 11, color: 'var(--muted)' }}
          >
            {CTA.note}
          </p>
        </div>
      </div>
    </Section>
  )
}
