import { useEffect, useRef } from 'react'

export function useIntersectionObserver(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold },
    )

    el.querySelectorAll('.fade-up').forEach((child) => obs.observe(child))
    if (el.classList.contains('fade-up')) obs.observe(el)

    return () => obs.disconnect()
  }, [threshold])

  return ref
}
