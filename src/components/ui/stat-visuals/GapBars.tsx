export function GapBars() {
  const blue = '#4A9EFF'
  const amber = '#FF6B35'

  const baselineX = 280
  const barH = 20
  const rowGap = 12
  const startY = 24

  const forecasts = [
    { label: 'ML Experts', value: '−38%', width: 152, color: blue, opacity: 0.4 },
    { label: 'Economists', value: '−39%', width: 156, color: blue, opacity: 0.35 },
    { label: 'Devs predicted', value: '−24%', width: 96, color: blue, opacity: 0.55 },
    { label: 'Actual measured', value: '+19%', width: 76, color: amber, opacity: 0.85, dir: 1 },
  ]

  const subStats = [
    { label: '75% got slower', pct: 75 },
    { label: '56% AI code rejected', pct: 56 },
    { label: '9% time reviewing AI output', pct: 9 },
  ]

  return (
    <svg viewBox="0 0 520 280" fill="none" style={{ width: '100%' }}>
      {/* Section label */}
      <text x="10" y="14" fontSize="10" fill="var(--muted)" fontFamily="var(--fm)" opacity="0.6" fontWeight="600">
        FORECAST vs REALITY
      </text>

      {/* Baseline */}
      <line x1={baselineX} y1={startY} x2={baselineX} y2={startY + 4 * (barH + rowGap) - rowGap + 4} stroke="var(--muted)" strokeOpacity="0.25" strokeDasharray="3 3" />
      <text x={baselineX} y={startY - 4} fontSize="8" fill="var(--muted)" fontFamily="var(--fm)" textAnchor="middle" opacity="0.5">
        No change
      </text>

      {forecasts.map((row, i) => {
        const y = startY + i * (barH + rowGap)
        const isReality = row.dir === 1
        const barX = isReality ? baselineX : baselineX - row.width

        return (
          <g key={row.label}>
            {/* Label */}
            <text
              x="10"
              y={y + barH / 2 + 1}
              fontSize="11"
              fill={isReality ? amber : 'var(--muted)'}
              fontFamily="var(--fm)"
              dominantBaseline="middle"
              opacity={isReality ? 0.95 : 0.7}
            >
              {row.label}
            </text>

            {/* Bar */}
            <rect
              x={barX}
              y={y}
              width={row.width}
              height={barH}
              rx="3"
              fill={row.color}
              opacity={row.opacity}
            />

            {/* Value */}
            <text
              x={isReality ? baselineX + row.width + 8 : baselineX - row.width - 8}
              y={y + barH / 2 + 1}
              fontSize="12"
              fill={isReality ? amber : blue}
              fontFamily="var(--fd)"
              fontWeight="700"
              textAnchor={isReality ? 'start' : 'end'}
              dominantBaseline="middle"
              opacity={isReality ? 1 : 0.7}
            >
              {row.value}
            </text>
          </g>
        )
      })}

      {/* Direction labels */}
      <text x={baselineX - 60} y={startY + 4 * (barH + rowGap) + 8} fontSize="8" fill={blue} fontFamily="var(--fm)" textAnchor="middle" opacity="0.4">
        ← Faster
      </text>
      <text x={baselineX + 60} y={startY + 4 * (barH + rowGap) + 8} fontSize="8" fill={amber} fontFamily="var(--fm)" textAnchor="middle" opacity="0.4">
        Slower →
      </text>

      {/* Divider */}
      <line x1="10" y1="180" x2="510" y2="180" stroke="var(--muted)" strokeOpacity="0.1" />

      {/* Section label */}
      <text x="10" y="200" fontSize="10" fill="var(--muted)" fontFamily="var(--fm)" opacity="0.6" fontWeight="600">
        KEY FINDINGS
      </text>

      {/* Sub-stats as progress bars */}
      {subStats.map((stat, i) => {
        const y = 214 + i * 22
        const barW = 180
        return (
          <g key={stat.label}>
            <text x="10" y={y + 6} fontSize="10" fill="var(--muted)" fontFamily="var(--fm)" opacity="0.7" dominantBaseline="middle">
              {stat.label}
            </text>
            {/* Track */}
            <rect x="220" y={y - 4} width={barW} height="10" rx="2" fill="var(--muted)" opacity="0.1" />
            {/* Fill */}
            <rect x="220" y={y - 4} width={barW * (stat.pct / 100)} height="10" rx="2" fill={amber} opacity="0.6" />
            {/* Percentage */}
            <text x={220 + barW + 8} y={y + 6} fontSize="10" fill={amber} fontFamily="var(--fm)" opacity="0.7" dominantBaseline="middle">
              {stat.pct}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}
