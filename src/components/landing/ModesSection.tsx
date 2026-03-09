import { MODES_HEADER, MODE_CARDS } from '../../constants/content'
import { Section } from '../layout/Section'
import { SectionLabel } from '../layout/SectionLabel'
import { ModeCard } from './ModeCard'

export function ModesSection() {
  return (
    <Section id="modes">
      <SectionLabel>{MODES_HEADER.label}</SectionLabel>
      <h2
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
        {MODES_HEADER.title}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: 'var(--muted)',
          maxWidth: 500,
          lineHeight: 1.85,
          marginBottom: 56,
        }}
      >
        {MODES_HEADER.subtitle}
      </p>
      <div className="flex flex-col gap-3">
        {MODE_CARDS.map((mode) => (
          <ModeCard key={mode.id} mode={mode} />
        ))}
      </div>
    </Section>
  )
}
