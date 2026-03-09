import type { TerminalLine } from '../../types'

const COLOR_MAP: Record<TerminalLine['color'], string> = {
  prompt: 'var(--muted)',
  command: 'var(--text)',
  output: 'var(--muted)',
  success: 'var(--text)',
  warning: '#FFB547',
  info: 'var(--text)',
  blank: 'transparent',
}

interface TerminalDemoProps {
  lines: TerminalLine[]
  title: string
}

export function TerminalDemo({ lines, title }: TerminalDemoProps) {
  return (
    <div
      style={{
        marginTop: 64,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        animation: 'fu 0.6s 0.4s ease both',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2"
        style={{
          background: 'var(--surface2)',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--muted)' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--muted)' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--muted)' }} />
        <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--muted)' }}>{title}</span>
      </div>
      {/* Body */}
      <div style={{ padding: '28px 32px', fontSize: 12, lineHeight: 2.1 }}>
        {lines.map((line, i) => (
          <span key={i} style={{ display: 'block', color: COLOR_MAP[line.color] }}>
            {line.color === 'command' && line.text.startsWith('❯') ? (
              <>
                <span style={{ color: 'var(--muted)' }}>❯</span>
                <span style={{ color: 'var(--text)' }}>{line.text.slice(1)}</span>
              </>
            ) : (
              line.text || '\u00A0'
            )}
          </span>
        ))}
        <span style={{ display: 'block' }}>
          <span style={{ color: 'var(--muted)' }}>❯</span>{' '}
          <span
            style={{
              display: 'inline-block',
              width: 7,
              height: 13,
              background: 'var(--text)',
              verticalAlign: 'middle',
              animation: 'blink 1s step-end infinite',
            }}
          />
        </span>
      </div>
    </div>
  )
}
