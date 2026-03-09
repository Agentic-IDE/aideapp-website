export function RisingBars() {
  const amber = '#FF6B35'
  const blue = '#4A9EFF'

  const years = ['2020', '2021', '2022', '2023', '2024']

  const chartTop = 30
  const chartBottom = 175
  const chartLeft = 60
  const chartRight = 400
  const chartH = chartBottom - chartTop
  const stepX = (chartRight - chartLeft) / (years.length - 1)

  const dupData = [3.1, 4.0, 5.5, 8.3, 12.3]
  const refData = [24.1, 21.0, 16.5, 12.0, 9.5]

  const maxVal = 28
  const toY = (v: number) => chartBottom - (v / maxVal) * chartH
  const toX = (i: number) => chartLeft + i * stepX

  const dupPoints = dupData.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
  const refPoints = refData.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')

  return (
    <svg viewBox="0 0 440 220" fill="none" style={{ width: '100%' }}>
      {/* Y-axis labels */}
      {[0, 5, 10, 15, 20, 25].map((v) => (
        <g key={v}>
          <text x="48" y={toY(v) + 3} fontSize="9" fill="var(--muted)" fontFamily="var(--fm)" textAnchor="end" opacity="0.4">
            {v}%
          </text>
          <line x1={chartLeft} y1={toY(v)} x2={chartRight} y2={toY(v)} stroke="var(--muted)" strokeOpacity="0.06" />
        </g>
      ))}

      {/* X-axis labels */}
      {years.map((yr, i) => (
        <text key={yr} x={toX(i)} y={chartBottom + 18} fontSize="10" fill="var(--muted)" fontFamily="var(--fm)" textAnchor="middle" opacity="0.5">
          {yr}
        </text>
      ))}

      {/* Refactoring line (falling, blue) */}
      <polyline points={refPoints} stroke={blue} strokeWidth="2" strokeOpacity="0.5" fill="none" strokeLinejoin="round" />
      {refData.map((v, i) => (
        <circle key={`r${i}`} cx={toX(i)} cy={toY(v)} r="3" fill={blue} opacity="0.5" />
      ))}

      {/* Duplication line (rising, amber) */}
      <polyline points={dupPoints} stroke={amber} strokeWidth="2.5" strokeOpacity="0.85" fill="none" strokeLinejoin="round" />
      {dupData.map((v, i) => (
        <circle key={`d${i}`} cx={toX(i)} cy={toY(v)} r="3.5" fill={amber} opacity="0.85" />
      ))}

      {/* Crossing annotation */}
      <text x={toX(2.5)} y={toY(12) - 6} fontSize="9" fill={amber} fontFamily="var(--fm)" textAnchor="middle" opacity="0.6">
        AI adoption
      </text>

      {/* End labels */}
      <text x={chartRight + 6} y={toY(dupData[4]) + 3} fontSize="10" fill={amber} fontFamily="var(--fm)" opacity="0.8">
        12.3%
      </text>
      <text x={chartRight + 6} y={toY(refData[4]) + 3} fontSize="10" fill={blue} fontFamily="var(--fm)" opacity="0.6">
        9.5%
      </text>

      {/* Legend */}
      <line x1="60" y1="210" x2="74" y2="210" stroke={amber} strokeWidth="2" strokeOpacity="0.85" />
      <text x="78" y="213" fontSize="9" fill="var(--muted)" fontFamily="var(--fm)" opacity="0.6">Code duplication</text>
      <line x1="200" y1="210" x2="214" y2="210" stroke={blue} strokeWidth="2" strokeOpacity="0.5" />
      <text x="218" y="213" fontSize="9" fill="var(--muted)" fontFamily="var(--fm)" opacity="0.6">Code refactored</text>
    </svg>
  )
}
