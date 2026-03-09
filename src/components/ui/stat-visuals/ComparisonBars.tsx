export function ComparisonBars() {
  const amber = '#FF6B35'
  const blue = '#4A9EFF'

  const categories = [
    { label: 'Logic errors', ai: 175, human: 100, mult: '1.75x' },
    { label: 'Maintainability', ai: 164, human: 100, mult: '1.64x' },
    { label: 'Security', ai: 157, human: 100, mult: '1.57x' },
    { label: 'Readability', ai: 240, human: 80, mult: '3.0x' },
  ]

  const barH = 16
  const pairGap = 4
  const rowGap = 20
  const startY = 24
  const barStartX = 120
  const maxBarW = 260
  const maxVal = 260

  return (
    <svg viewBox="0 0 440 220" fill="none" style={{ width: '100%' }}>
      {/* Column headers */}
      <text x={barStartX} y="14" fontSize="9" fill={amber} fontFamily="var(--fm)" opacity="0.7">AI-generated</text>
      <text x={barStartX} y="14" fontSize="9" fill={blue} fontFamily="var(--fm)" opacity="0.5" dx="90">Human-written</text>

      {categories.map((cat, i) => {
        const y = startY + i * (barH * 2 + pairGap + rowGap)
        const aiW = (cat.ai / maxVal) * maxBarW
        const humanW = (cat.human / maxVal) * maxBarW

        return (
          <g key={cat.label}>
            {/* Row divider */}
            {i > 0 && (
              <line
                x1={barStartX}
                y1={y - rowGap / 2}
                x2={barStartX + maxBarW + 10}
                y2={y - rowGap / 2}
                stroke="var(--muted)"
                strokeOpacity="0.06"
              />
            )}

            {/* Category label */}
            <text
              x="8"
              y={y + barH + pairGap / 2}
              fontSize="11"
              fill="var(--muted)"
              fontFamily="var(--fm)"
              dominantBaseline="middle"
            >
              {cat.label}
            </text>

            {/* AI bar */}
            <rect
              x={barStartX}
              y={y}
              width={aiW}
              height={barH}
              rx="3"
              fill={amber}
              opacity="0.75"
            />

            {/* Human bar */}
            <rect
              x={barStartX}
              y={y + barH + pairGap}
              width={humanW}
              height={barH}
              rx="3"
              fill={blue}
              opacity="0.35"
            />

            {/* Multiplier label */}
            <text
              x={barStartX + aiW + 10}
              y={y + barH / 2 + 1}
              fontSize="12"
              fill={amber}
              fontFamily="var(--fd)"
              fontWeight="700"
              dominantBaseline="middle"
              opacity="0.9"
            >
              {cat.mult}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
