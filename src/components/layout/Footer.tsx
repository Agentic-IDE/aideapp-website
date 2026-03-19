import { FOOTER } from '../../constants/content'

export function Footer() {
  const linkStyle = {
    color: 'var(--muted)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  }

  return (
    <footer
      className="relative z-1"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '40px 48px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 16, color: 'var(--muted)' }}>
          {FOOTER.company}
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
          <a href="/terms" style={linkStyle}>Terms</a>
          <a href="/privacy" style={linkStyle}>Privacy</a>
          <a href="/eula" style={linkStyle}>EULA</a>
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{FOOTER.right}</div>
      </div>
    </footer>
  )
}
