import type { ModeCardContent } from '../../types'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { FdeMockup } from './mockups/FdeMockup'
import { IdeMockup } from './mockups/IdeMockup'
import { ArchitectMockup } from './mockups/ArchitectMockup'

const MOCKUP_MAP = {
  fde: FdeMockup,
  ide: IdeMockup,
  architect: ArchitectMockup,
} as const

interface ModeCardProps {
  mode: ModeCardContent
}

export function ModeCard({ mode }: ModeCardProps) {
  const ref = useIntersectionObserver()
  const MockupComponent = MOCKUP_MAP[mode.mockup]

  return (
    <div
      ref={ref}
      className="fade-up mode-card"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${mode.color}`,
        borderRadius: 16,
        padding: '48px 56px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 48,
        alignItems: 'center',
        transition: 'border-color 0.3s',
      }}
    >
      <div>
        <div
          className="inline-flex items-center gap-2"
          style={{
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: mode.color,
            marginBottom: 20,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: mode.color }} />
          {mode.tagFull}
        </div>
        <div
          style={{
            fontFamily: 'var(--fd)',
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: 16,
            lineHeight: 1.1,
            whiteSpace: 'pre-line',
          }}
        >
          {mode.title}
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 24 }}>
          {mode.description}
        </p>
        <div className="flex flex-col gap-2.5">
          {mode.features.map((feat) => (
            <div
              key={feat}
              className="flex items-start gap-3"
              style={{ fontSize: 12, color: 'var(--muted)' }}
            >
              <span style={{ color: mode.color, fontSize: 11, flexShrink: 0, marginTop: 2 }}>→</span>
              {feat}
            </div>
          ))}
        </div>
      </div>
      <MockupComponent />
    </div>
  )
}
