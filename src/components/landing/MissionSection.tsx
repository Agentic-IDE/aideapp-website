import { MISSION } from '../../constants/content'
import { Section } from '../layout/Section'
import { SectionLabel } from '../layout/SectionLabel'
import { StatBlock } from '../ui/StatBlock'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

export function MissionSection() {
  const ref = useIntersectionObserver()

  return (
    <Section id="mission">
      <SectionLabel>Mission</SectionLabel>
      <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        <h2
          className="fade-up"
          style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(24px, 3.5vw, 44px)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: 780,
          }}
        >
          {MISSION.title}
        </h2>
        <p
          className="fade-up"
          style={{
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            color: 'var(--muted)',
            lineHeight: 1.7,
            maxWidth: 720,
            transitionDelay: '0.1s',
          }}
        >
          {MISSION.text}
        </p>
        <StatBlock stats={MISSION.stats} />
      </div>
    </Section>
  )
}
