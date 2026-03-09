import { YC } from '../../constants/content'
import { Section } from '../layout/Section'
import { Button } from '../ui/Button'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

export function YCSection() {
  const ref = useIntersectionObserver()

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
          <div className="flex gap-3 flex-wrap" style={{ marginTop: 32 }}>
            <Button href={YC.primaryCta.href}>{YC.primaryCta.label}</Button>
            <Button variant="ghost" href={YC.ghostCta.href}>{YC.ghostCta.label}</Button>
          </div>
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
