import { FOOTER } from '../../constants/content'

export function Footer() {
  return (
    <footer
      className="relative z-1 flex items-center justify-between"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '40px 48px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 16, color: 'var(--muted)' }}>
        {FOOTER.company}
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{FOOTER.right}</div>
    </footer>
  )
}
