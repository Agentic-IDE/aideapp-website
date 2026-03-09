import { NAV_LINKS } from '../../constants/content'

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-100 flex items-center justify-end"
      style={{
        padding: '20px 48px',
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <ul className="nav-links flex items-center gap-8 list-none">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="no-underline transition-colors"
              style={{
                color: link.cta ? 'var(--bg)' : 'var(--muted)',
                fontSize: 12,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                ...(link.cta
                  ? {
                      background: 'var(--accent)',
                      padding: '8px 20px',
                      borderRadius: 6,
                      fontWeight: 600,
                    }
                  : {}),
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
