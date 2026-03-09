import { useEffect, useRef, useState, useCallback } from 'react'
import type { StatItem } from '../../types'
import { VISUAL_MAP } from './stat-visuals'

interface StatBlockProps {
  stats: StatItem[]
}

function parseNumeric(value: string): { prefix: string; num: number; suffix: string } | null {
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/)
  if (!match) return null
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] }
}

function AnimatedValue({ value, active }: { value: string; active: boolean }) {
  const [display, setDisplay] = useState(value)
  const hasAnimated = useRef(false)

  const animate = useCallback(() => {
    const parsed = parseNumeric(value)
    if (!parsed) {
      setDisplay(value)
      return
    }

    const duration = 1200
    const start = performance.now()
    const isFloat = value.includes('.')
    const decimalPlaces = isFloat ? (value.split('.')[1]?.replace(/[^0-9]/g, '').length ?? 0) : 0

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * parsed!.num

      const formatted = isFloat ? current.toFixed(decimalPlaces) : Math.round(current).toString()
      setDisplay(`${parsed!.prefix}${formatted}${parsed!.suffix}`)

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [value])

  useEffect(() => {
    if (active && !hasAnimated.current) {
      hasAnimated.current = true
      animate()
    }
  }, [active, animate])

  return <span>{display}</span>
}

export function StatBlock({ stats }: StatBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const isTransitioning = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length)
    }, 18000)
  }, [stats.length])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning.current) return
      isTransitioning.current = true
      const next = ((index % stats.length) + stats.length) % stats.length
      setCurrentIndex(next)
      // Reset timer on manual navigation
      startTimer()
      setTimeout(() => {
        isTransitioning.current = false
      }, 400)
    },
    [stats.length, startTimer],
  )

  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex])
  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    },
    [goNext, goPrev],
  )

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = e.changedTouches[0].clientX - touchStartX.current
      if (Math.abs(delta) > 50) {
        delta > 0 ? goPrev() : goNext()
      }
    },
    [goNext, goPrev],
  )

  return (
    <div
      className="fade-up"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ outline: 'none', position: 'relative' }}
    >
      {/* Carousel container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Track */}
        <div
          style={{
            display: 'flex',
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {stats.map((stat, i) => {
            const Visual = stat.visual ? VISUAL_MAP[stat.visual] : null
            return (
              <div
                key={stat.label}
                className="carousel-slide"
                style={{
                  flex: '0 0 100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '48px 56px',
                  minHeight: 420,
                  gap: 48,
                }}
              >
                {/* Left: text column */}
                <div style={{
                  flex: '0 0 38%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  minWidth: 0,
                }}>
                  <span
                    style={{
                      fontFamily: 'var(--fd)',
                      fontSize: 48,
                      fontWeight: 700,
                      color: 'var(--text)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                    }}
                  >
                    <AnimatedValue value={stat.value} active={currentIndex === i} />
                  </span>
                  {stat.quote && (
                    <p style={{
                      fontSize: 15,
                      color: 'var(--text)',
                      lineHeight: 1.5,
                      opacity: 0.9,
                    }}>
                      {stat.quote}
                    </p>
                  )}
                  {stat.analysis && (
                    <p style={{
                      fontSize: 13,
                      color: 'var(--muted)',
                      lineHeight: 1.6,
                    }}>
                      {stat.analysis}
                    </p>
                  )}
                  {stat.source && (
                    <span style={{
                      fontSize: 11,
                      color: 'var(--muted)',
                      opacity: 0.5,
                      marginTop: 4,
                    }}>
                      Source: {stat.source}
                    </span>
                  )}
                </div>

                {/* Right: visualization column */}
                {Visual && (
                  <div style={{
                    flex: '1 1 60%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 0,
                  }}>
                    <div style={{ width: '100%', maxWidth: 520 }}>
                      <Visual />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Left click zone */}
        <div
          className="carousel-zone"
          onClick={goPrev}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 16,
          }}
        >
          <span className="carousel-arrow">‹</span>
        </div>

        {/* Right click zone */}
        <div
          className="carousel-zone"
          onClick={goNext}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 16,
          }}
        >
          <span className="carousel-arrow">›</span>
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20 }}>
        {stats.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === currentIndex ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
