import { NAV_LINKS } from '../../constants/content'
import { useTypewriter, type Phrase } from '../../hooks/useTypewriter'

const NAVBAR_PHRASES: Phrase[] = [
  { text: 'Agentic IDE', displayMs: 20000 },
  { text: 'Building the future', displayMs: 10000 },
  { text: 'Augment your agents', displayMs: 10000 },
  { text: 'Shipping at lightning speeds', displayMs: 10000 },
  { text: 'Code with superpowers', displayMs: 10000 },
  { text: 'Your AI pair programmer', displayMs: 10000 },
  { text: 'Debug smarter, ship faster', displayMs: 10000 },
]

export function Navbar() {
  const { displayText, isTyping } = useTypewriter(NAVBAR_PHRASES)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between"
      style={{
        padding: '20px 48px',
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <a
        href="#"
        className="no-underline"
        style={{
          fontFamily: 'var(--fm)',
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          whiteSpace: 'nowrap',
          minWidth: '10ch',
        }}
      >
        {displayText}
        <span
          style={{
            animation: isTyping ? 'none' : 'blink 1s step-end infinite',
            marginLeft: 1,
            fontWeight: 400,
          }}
        >
          |
        </span>
      </a>
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
