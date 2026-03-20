import { useEffect, useState, useCallback, useMemo } from 'react'
import { HERO } from '../../constants/content'
import { Button } from '../ui/Button'
import { HeroIdeMockup } from './HeroIdeMockup'

type Platform = 'mac' | 'windows' | 'linux'

const PLATFORM_LABELS: Record<Platform, string> = {
  mac: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
}

function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('win')) return 'windows'
  if (ua.includes('linux')) return 'linux'
  return 'mac'
}
const SUPPORTERS = [
  { name: 'Microsoft for Startups', logo: '/microsoft-for-startups-badge.png' },
]

function SupporterSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SUPPORTERS.length)
  }, [])

  useEffect(() => {
    if (SUPPORTERS.length <= 1) return
    const timer = setInterval(advance, 4000)
    return () => clearInterval(timer)
  }, [advance])

  return (
    <div
      className="hero-supporters"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: '24px 20px',
        flex: '0 1 auto',
        animation: 'fu 0.6s 0.35s ease both',
      }}
    >
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {SUPPORTERS.map((s) => (
            <div
              key={s.name}
              style={{
                flex: '0 0 100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={s.logo}
                alt={s.name}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  objectFit: 'contain',
                  borderRadius: 12,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <span
        style={{
          fontFamily: 'var(--fd)',
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
        }}
      >
        Our Supporters
      </span>
      {SUPPORTERS.length > 1 && (
        <div style={{ display: 'flex', gap: 8 }}>
          {SUPPORTERS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i === currentIndex ? 'var(--text)' : 'var(--muted)',
                opacity: i === currentIndex ? 1 : 0.3,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function DownloadButtons() {
  const platform = useMemo(() => detectPlatform(), [])
  const otherPlatforms = (['mac', 'windows', 'linux'] as Platform[]).filter((p) => p !== platform)
  const [downloadCount, setDownloadCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/downloads')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.total > 100) setDownloadCount(data.total)
      })
      .catch(() => {})
  }, [])

  return (
    <div style={{ animation: 'fu 0.6s 0.3s ease both' }}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: 12,
        }}
      >
        Free early demo
      </p>
      <div className="flex gap-4 flex-wrap items-center">
        <Button href={`/api/download?platform=${platform}`}>
          Download for {PLATFORM_LABELS[platform]}
        </Button>
        <Button variant="ghost" href={HERO.ghostCta.href}>{HERO.ghostCta.label}</Button>
        {downloadCount !== null && (
          <span
            style={{
              fontSize: 13,
              color: 'var(--muted)',
              fontFamily: 'var(--fm)',
            }}
          >
            {downloadCount.toLocaleString()} downloads
          </span>
        )}
      </div>
      <p
        style={{
          marginTop: 12,
          fontSize: 12,
          color: 'var(--muted)',
        }}
      >
        Also available for{' '}
        {otherPlatforms.map((p, i) => (
          <span key={p}>
            {i > 0 && ' · '}
            <a
              href={`/api/download?platform=${p}`}
              style={{
                color: 'var(--muted)',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              {PLATFORM_LABELS[p]}
            </a>
          </span>
        ))}
      </p>
      <p
        style={{
          marginTop: 8,
          fontSize: 11,
          color: 'var(--muted)',
          opacity: 0.7,
        }}
      >
        By downloading, you agree to our{' '}
        <a href="/terms" style={{ color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Terms of Service</a>,{' '}
        <a href="/privacy" style={{ color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Privacy Policy</a>, and{' '}
        <a href="/eula" style={{ color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>EULA</a>.
      </p>
      {platform === 'mac' && (
        <p
          style={{
            marginTop: 12,
            fontSize: 12,
            color: 'var(--muted)',
            lineHeight: 1.6,
            padding: '10px 12px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            maxWidth: 540,
          }}
        >
          <strong style={{ color: 'var(--text)' }}>macOS note:</strong>{' '}
          macOS may block the app since it's not from the App Store. To fix this, go to{' '}
          <span style={{ fontFamily: 'var(--fm)' }}>System Settings → Privacy & Security</span>, scroll to "Security", and click{' '}
          <strong>"Open Anyway"</strong>.
        </p>
      )}
    </div>
  )
}

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 48,
          flexWrap: 'nowrap',
        }}
      >
        {/* Left: hero content */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
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
          <DownloadButtons />
        </div>

        {/* Right: Supported by logos */}
        <SupporterSlideshow />
      </div>

      <HeroIdeMockup />
    </div>
  )
}
