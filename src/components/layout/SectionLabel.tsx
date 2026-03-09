interface SectionLabelProps {
  children: string
  centered?: boolean
}

export function SectionLabel({ children, centered }: SectionLabelProps) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        fontSize: 11,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--text)',
        marginBottom: 20,
        ...(centered ? { justifyContent: 'center' } : {}),
      }}
    >
      {!centered && (
        <span style={{ width: 24, height: 1, background: 'var(--muted)', display: 'block' }} />
      )}
      {children}
    </div>
  )
}
