import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  href?: string
  children: ReactNode
}

export function Button({ variant = 'primary', href, children, style, ...props }: ButtonProps) {
  const base = {
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
    transition: 'transform 0.2s, opacity 0.2s',
    ...(variant === 'primary'
      ? {
          background: 'var(--accent)',
          color: 'var(--bg)',
          padding: '14px 32px',
          fontFamily: 'var(--fd)',
          fontSize: 15,
          fontWeight: 700,
        }
      : {
          background: 'transparent',
          color: 'var(--muted)',
          border: '1px solid var(--border)',
          padding: '14px 32px',
          fontFamily: 'var(--fm)',
          fontSize: 13,
        }),
    ...style,
  } as React.CSSProperties

  if (href) {
    return (
      <a href={href} style={base}>
        {children}
      </a>
    )
  }

  return (
    <button style={base} {...props}>
      {children}
    </button>
  )
}
