import { HERO } from '../../constants/content'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { HeroIdeMockup } from './HeroIdeMockup'

export function HeroSection() {
  return (
    <div
      className="relative z-1 flex flex-col justify-center"
      style={{
        minHeight: '100vh',
        padding: '140px 48px 80px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <Badge>{HERO.badge}</Badge>
      <h1
        style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 800,
          lineHeight: 0.93,
          letterSpacing: '-0.04em',
          marginBottom: 32,
          animation: 'fu 0.6s 0.1s ease both',
        }}
      >
        {HERO.titleLines[0]}
        <br />
        <em style={{ fontStyle: 'normal', color: 'var(--text)' }}>{HERO.titleLines[1]}</em>
        <br />
        {HERO.titleLines[2]}
      </h1>
      <p
        style={{
          fontSize: 15,
          color: 'var(--muted)',
          maxWidth: 540,
          lineHeight: 1.85,
          marginBottom: 12,
          animation: 'fu 0.6s 0.2s ease both',
        }}
      >
        {HERO.subtitle}
      </p>
      <p
        style={{
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--text)',
          marginBottom: 48,
          animation: 'fu 0.6s 0.25s ease both',
        }}
      >
        Built for devs, by devs.
      </p>
      <div
        className="flex gap-4 flex-wrap"
        style={{ animation: 'fu 0.6s 0.3s ease both' }}
      >
        <Button href={HERO.primaryCta.href}>{HERO.primaryCta.label}</Button>
        <Button variant="ghost" href={HERO.ghostCta.href}>{HERO.ghostCta.label}</Button>
      </div>
      <HeroIdeMockup />
    </div>
  )
}
