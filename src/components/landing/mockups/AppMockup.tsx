interface AppMockupProps {
  children: React.ReactNode
}

export const MOCK = {
  bg: '#000000',
  surface: '#0f0f0f',
  border: '#1a1a1a',
  text: '#d0e8ff',
  muted: '#4a6080',
  dim: '#2a3a55',
  accent: '#00f0ff',
  green: '#00f0aa',
  purple: '#a855f7',
  pink: '#f038a0',
  font: "'JetBrains Mono', monospace",
} as const

export function AppMockup({ children }: AppMockupProps) {
  return (
    <div
      style={{
        background: MOCK.bg,
        border: `1px solid ${MOCK.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
        fontFamily: MOCK.font,
        fontSize: 9,
        color: MOCK.text,
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  )
}
