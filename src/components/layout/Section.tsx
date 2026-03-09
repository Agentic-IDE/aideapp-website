import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
}

export function Section({ id, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={className} style={{ padding: '100px 0' }}>
      <div
        className="relative z-1"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}
      >
        {children}
      </div>
    </section>
  )
}
