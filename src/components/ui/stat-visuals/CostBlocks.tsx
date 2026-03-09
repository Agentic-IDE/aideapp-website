export function CostBlocks() {
  const blue = '#4A9EFF'
  const amber = '#FF6B35'

  // Waterfall chart
  const baseY = 168
  const barW = 56
  const waterfallX = 10

  const planned = { h: 100, label: 'Planned\nAI spend' }
  const additions = [
    { label: 'Legacy\nremediation', h: 28, color: amber, opacity: 0.5 },
    { label: 'Timeline\nextension', h: 22, color: amber, opacity: 0.65 },
    { label: 'Integration\nfailures', h: 20, color: amber, opacity: 0.8 },
  ]

  const plannedTop = baseY - planned.h
  let runningTop = plannedTop

  // Sub-stats
  const subStats = [
    { label: '29% of AI budgets\nconsumed by debt', pct: 29 },
    { label: '15–22% longer\ntimelines', pct: 20 },
    { label: '53% outcomes derailed\nby legacy integration', pct: 53 },
  ]

  return (
    <svg viewBox="0 0 520 280" fill="none" style={{ width: '100%' }}>
      {/* Section label */}
      <text x={waterfallX} y="14" fontSize="10" fill="var(--muted)" fontFamily="var(--fm)" opacity="0.6" fontWeight="600">
        COST WATERFALL
      </text>

      {/* Planned bar */}
      <rect x={waterfallX} y={plannedTop} width={barW} height={planned.h} rx="4" fill={blue} opacity="0.35" />
      <text x={waterfallX + barW / 2} y={plannedTop + planned.h / 2 - 4} fontSize="9" fill="var(--text)" fontFamily="var(--fm)" textAnchor="middle" opacity="0.8">
        Planned
      </text>
      <text x={waterfallX + barW / 2} y={plannedTop + planned.h / 2 + 8} fontSize="9" fill="var(--text)" fontFamily="var(--fm)" textAnchor="middle" opacity="0.6">
        AI spend
      </text>

      {/* Additive bars */}
      {additions.map((add, i) => {
        const x = waterfallX + (i + 1) * (barW + 16)
        const top = runningTop - add.h
        const prevX = waterfallX + i * (barW + 16) + barW

        const el = (
          <g key={add.label}>
            {/* Bridge */}
            <line x1={prevX} y1={runningTop} x2={x} y2={runningTop} stroke="var(--muted)" strokeOpacity="0.2" strokeDasharray="2 2" />
            {/* Bar */}
            <rect x={x} y={top} width={barW} height={add.h} rx="4" fill={add.color} opacity={add.opacity} />
            {/* Label */}
            {add.label.split('\n').map((line, li) => (
              <text key={li} x={x + barW / 2} y={top - 14 + li * 12} fontSize="9" fill="var(--muted)" fontFamily="var(--fm)" textAnchor="middle" opacity="0.8">
                {line}
              </text>
            ))}
          </g>
        )

        runningTop = top
        return el
      })}

      {/* Bracket showing hidden cost */}
      {(() => {
        const bracketX = waterfallX + 4 * (barW + 16) - 6
        return (
          <g>
            <line x1={bracketX} y1={runningTop} x2={bracketX} y2={plannedTop} stroke={amber} strokeOpacity="0.5" strokeWidth="1.5" />
            <line x1={bracketX - 3} y1={runningTop} x2={bracketX + 3} y2={runningTop} stroke={amber} strokeOpacity="0.5" strokeWidth="1.5" />
            <line x1={bracketX - 3} y1={plannedTop} x2={bracketX + 3} y2={plannedTop} stroke={amber} strokeOpacity="0.5" strokeWidth="1.5" />
            <text x={bracketX + 10} y={(runningTop + plannedTop) / 2 - 2} fontSize="13" fill={amber} fontFamily="var(--fd)" fontWeight="700" opacity="0.9">
              $120M+
            </text>
            <text x={bracketX + 10} y={(runningTop + plannedTop) / 2 + 12} fontSize="9" fill="var(--muted)" fontFamily="var(--fm)" opacity="0.6">
              hidden cost / year
            </text>
          </g>
        )
      })()}

      {/* Baseline */}
      <line x1={waterfallX} y1={baseY} x2={waterfallX + 4 * (barW + 16)} y2={baseY} stroke="var(--muted)" strokeOpacity="0.12" />

      {/* Divider */}
      <line x1={waterfallX} y1="195" x2="510" y2="195" stroke="var(--muted)" strokeOpacity="0.1" />

      {/* Sub-stats section */}
      <text x={waterfallX} y="215" fontSize="10" fill="var(--muted)" fontFamily="var(--fm)" opacity="0.6" fontWeight="600">
        KEY FINDINGS
      </text>

      {subStats.map((stat, i) => {
        const x = i * 172 + waterfallX
        const y = 232
        const barW2 = 140
        const lines = stat.label.split('\n')
        return (
          <g key={stat.label}>
            {lines.map((line, li) => (
              <text key={li} x={x} y={y + li * 12} fontSize="9" fill="var(--muted)" fontFamily="var(--fm)" opacity="0.7">
                {line}
              </text>
            ))}
            {/* Track */}
            <rect x={x} y={y + lines.length * 12 + 2} width={barW2} height="8" rx="2" fill="var(--muted)" opacity="0.1" />
            {/* Fill */}
            <rect x={x} y={y + lines.length * 12 + 2} width={barW2 * (stat.pct / 100)} height="8" rx="2" fill={amber} opacity="0.6" />
          </g>
        )
      })}
    </svg>
  )
}
