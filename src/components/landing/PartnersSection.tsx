import { useEffect, useRef, useState, useCallback } from 'react'
import { Section } from '../layout/Section'
import { SectionLabel } from '../layout/SectionLabel'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
interface PartnerSlide {
  title: string
  text: string
  detail: string
  logo: string
  logoAlt: string
}

const SLIDES: PartnerSlide[] = [
  {
    title: 'Microsoft for Startups',
    text: 'We joined the Microsoft for Startups program in less than a week of our incorporation date.',
    detail:
      'We met with a Microsoft scout, got recommended to join, and were accepted the same day. Moving fast is in our DNA — and Microsoft recognized that from day one.',
    logo: '/microsoft-for-startups-badge.png',
    logoAlt: 'Proud to collaborate with Microsoft for Startups',
  },
]

export function PartnersSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const isTransitioning = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (SLIDES.length <= 1) return
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
    }, 12000)
  }, [])

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
      const next = ((index % SLIDES.length) + SLIDES.length) % SLIDES.length
      setCurrentIndex(next)
      startTimer()
      setTimeout(() => {
        isTransitioning.current = false
      }, 400)
    },
    [startTimer],
  )

  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex])
  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex])

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

  const observerRef = useIntersectionObserver()

  return (
    <Section id="partners">
      <SectionLabel>Our Supporters</SectionLabel>

      <div ref={observerRef}>
      <div className="fade-up" style={{ outline: 'none', position: 'relative' }}>
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
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
            {SLIDES.map((slide) => (
              <div
                key={slide.title}
                className="carousel-slide"
                style={{
                  flex: '0 0 100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '48px 56px',
                  minHeight: 340,
                  gap: 48,
                }}
              >
                {/* Left: text */}
                <div
                  style={{
                    flex: '0 0 50%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--fd)',
                      fontSize: 28,
                      fontWeight: 700,
                      color: 'var(--text)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                    }}
                  >
                    {slide.title}
                  </span>
                  <p
                    style={{
                      fontSize: 15,
                      color: 'var(--text)',
                      lineHeight: 1.6,
                      opacity: 0.9,
                    }}
                  >
                    {slide.text}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--muted)',
                      lineHeight: 1.6,
                    }}
                  >
                    {slide.detail}
                  </p>
                </div>

                {/* Right: logo */}
                <div
                  style={{
                    flex: '1 1 50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 0,
                  }}
                >
                  <img
                    src={slide.logo}
                    alt={slide.logoAlt}
                    style={{
                      width: '100%',
                      maxWidth: 520,
                      objectFit: 'contain',
                      borderRadius: 12,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Nav zones — only show if multiple slides */}
          {SLIDES.length > 1 && (
            <>
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
                <span className="carousel-arrow">&lsaquo;</span>
              </div>
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
                <span className="carousel-arrow">&rsaquo;</span>
              </div>
            </>
          )}
        </div>

        {/* Dots — only show if multiple slides */}
        {SLIDES.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20 }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === currentIndex ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </Section>
  )
}
