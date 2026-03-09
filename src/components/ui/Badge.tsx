interface BadgeProps {
  children: string
}

export function Badge({ children }: BadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-2"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 100,
        padding: '6px 16px',
        fontSize: 11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        width: 'fit-content',
        animation: 'fu 0.6s ease both',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          background: 'var(--accent)',
          borderRadius: '50%',
          animation: 'pulse 2s infinite',
        }}
      />
      {children}
    </div>
  )
}
