import { Navbar } from '../layout/Navbar'
import { Footer } from '../layout/Footer'

interface Release {
  version: string
  date: string
  title: string
  subtitle: string
  description?: string
  features: string[]
}

const RELEASES: Release[] = [
  {
    version: '0.4.6',
    date: 'March 27, 2026',
    title: 'Interactive Dependency Graph',
    subtitle: 'A sprawling force-directed code graph that maps your entire codebase.',
    description:
      'The analysis suite gains its most visual feature yet — an interactive dependency graph powered by d3-force that renders your entire codebase as a network of interconnected nodes. Files appear as circles sized by lines of code, colored by your chosen tech debt dimension. Directory clusters emerge organically, connected by directed edges that reveal architecture violations at a glance. Click any node to see all five dimensions of tech debt, connected files with full paths, and architecture violations.',
    features: [
      'Sprawling force-directed node graph with d3-force simulation',
      '5-dimension color toggle (debt, churn, coupling, complexity, LOC)',
      'Connected node highlighting on selection with full file paths',
      'Directory convex hulls for visual clustering',
      'Drag, zoom, pan, and hover tooltips',
      'Health notification toasts on commit',
    ],
  },
  {
    version: '0.4.5',
    date: 'March 25, 2026',
    title: 'Settings Stability',
    subtitle: 'Fix the black screen that hit some users on the settings page.',
    description:
      'A targeted fix for a rendering issue where GPU-intensive backdrop-blur effects caused a black screen on certain hardware configurations. The settings page now renders reliably across all systems.',
    features: [
      'Fix settings page black screen on certain GPUs',
      'Remove problematic backdrop-blur from settings panels',
      'Improve rendering stability across hardware configurations',
    ],
  },
  {
    version: '0.4.4',
    date: 'March 25, 2026',
    title: 'Provider Detection Reliability',
    subtitle: 'Close all race conditions in provider auto-detection.',
    description:
      'Hotfix release addressing edge cases where the onboarding flow could fail to save provider paths correctly, and race conditions in the provider detection pipeline that caused intermittent detection failures.',
    features: [
      'Fix provider detection race conditions at boot',
      'Fix onboarding flow path saving',
      'Improve provider auto-detection reliability',
    ],
  },
  {
    version: '0.4.3',
    date: 'March 25, 2026',
    title: 'Provider Auto-Detect + Session Capture',
    subtitle: 'Your IDE providers are detected at boot, and session data is captured and synced.',
    description:
      'The app now automatically detects installed AI coding providers (Claude Code, Cursor, Windsurf, etc.) at startup. Session logs are captured, encrypted, and synced for the Session Insights dashboard. Settings are more reliable with a reworked configuration pipeline.',
    features: [
      'Provider auto-detection at boot',
      'Session log capture with encrypted sync',
      'Settings pipeline rework for reliability',
      'Improved provider configuration flow',
    ],
  },
  {
    version: '0.4.0',
    date: 'March 24, 2026',
    title: 'Warm Industrial Design System',
    subtitle: 'A complete visual overhaul with a new dual-temperature design language.',
    description:
      'The entire UI has been rebuilt around the "Warm Industrial" design system — a dual-temperature approach where light mode uses warm beige, orange, and brown tones while dark mode shifts to black, gray, and light blue. Typography upgraded to Satoshi for display, DM Sans for UI, and JetBrains Mono for code.',
    features: [
      'Warm Industrial design system (dual light/dark temperature)',
      'Satoshi + DM Sans + JetBrains Mono typography stack',
      'CLAUDE.md containerization per profile',
      'Onboarding tour timing fix',
      'Glass morphism system for floating elements',
    ],
  },
  {
    version: '0.3.8',
    date: 'March 22, 2026',
    title: 'CI Build Fix',
    subtitle: 'Resolve a variable name collision breaking all CI builds.',
    description:
      'Quick fix for a variable naming conflict in the suggestions module that caused all CI builds to fail across macOS, Windows, and Linux.',
    features: [
      'Fix variable name collision in suggestion commands',
      'Restore CI build stability across all platforms',
    ],
  },
  {
    version: '0.3.7',
    date: 'March 21, 2026',
    title: 'Stability Release',
    subtitle: 'Bug fixes and stability improvements.',
    features: [
      'General stability improvements',
      'Bug fixes across skill management',
    ],
  },
  {
    version: '0.3.5',
    date: 'March 20, 2026',
    title: 'Terminal Fix for Windows',
    subtitle: 'Revert data batching that froze the terminal on Windows.',
    description:
      'A critical fix for Windows users — the PTY data batching optimization introduced in the previous release caused the terminal to freeze. This release reverts to the reliable unbatched approach.',
    features: [
      'Fix terminal freeze on Windows',
      'Revert PTY data batching optimization',
      'Restore terminal reliability across platforms',
    ],
  },
  {
    version: '0.3.4',
    date: 'March 20, 2026',
    title: 'Skill Import Analytics',
    subtitle: 'Track skill imports with GitHub URLs and skill names.',
    features: [
      'Track skill imports with source URLs',
      'Skill name attribution in analytics',
      'Import history tracking',
    ],
  },
  {
    version: '0.3.2',
    date: 'March 19, 2026',
    title: 'First Public Release',
    subtitle: 'The initial edition with skill management, IDE mode, and analytics.',
    description:
      'The first publicly available build. Includes the core skill management system, multi-provider IDE mode with terminal integration, skill import/export, and basic analytics.',
    features: [
      'Skill management (create, edit, organize)',
      'Multi-provider IDE mode with integrated terminal',
      'Skill import/export (GitHub URLs, file system)',
      'Basic analytics (activations, token estimates)',
      'Profile management',
      'Command palette',
      'Theme support (light/dark)',
    ],
  },
]

const containerStyle = { maxWidth: 800, margin: '0 auto', padding: '140px 48px 80px' }
const h1Style = { fontFamily: 'var(--fd)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 } as const
const subtitleStyle = { fontSize: 15, lineHeight: 1.85, color: 'var(--muted)', marginBottom: 48 } as const

export function ChangelogPage() {
  return (
    <>
      <Navbar />
      <div className="relative z-1" style={containerStyle}>
        <h1 style={h1Style}>Changelog</h1>
        <p style={subtitleStyle}>What's new in Agentic IDE.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {RELEASES.map((release, i) => (
            <article
              key={release.version}
              style={{
                paddingTop: i === 0 ? 0 : 32,
                paddingBottom: 32,
                borderBottom: i < RELEASES.length - 1 ? '1px solid var(--border)' : undefined,
              }}
            >
              {/* Date + version */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {release.date}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--fm)',
                    fontSize: 11,
                    color: 'var(--muted)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: '2px 8px',
                  }}
                >
                  v{release.version}
                </span>
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  marginBottom: 4,
                  color: 'var(--text)',
                }}
              >
                {release.title}
              </h2>

              {/* Subtitle */}
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: release.description ? 16 : 12, lineHeight: 1.6 }}>
                {release.subtitle}
              </p>

              {/* Description paragraph */}
              {release.description && (
                <p style={{ fontSize: 14, lineHeight: 1.85, color: 'var(--muted)', marginBottom: 16, opacity: 0.85 }}>
                  {release.description}
                </p>
              )}

              {/* Feature list */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {release.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      fontSize: 13,
                      color: 'var(--muted)',
                      paddingLeft: 16,
                      position: 'relative',
                    }}
                  >
                    <span style={{ position: 'absolute', left: 0, color: 'var(--accent)', opacity: 0.5 }}>-</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
