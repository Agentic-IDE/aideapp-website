export function DonutChart() {
  const amber = '#FF6B35'
  const blue = '#4A9EFF'

  const radius = 80
  const strokeWidth = 18
  const cx = 160
  const cy = 95
  const circumference = 2 * Math.PI * radius
  const filled = circumference * 0.86

  return (
    <svg viewBox="0 0 320 240" fill="none" style={{ width: '100%' }}>
      {/* Background ring */}
      <circle
        cx={cx} cy={cy} r={radius}
        stroke={blue} strokeWidth={strokeWidth} opacity="0.15"
        fill="none"
      />
      {/* Filled arc */}
      <circle
        cx={cx} cy={cy} r={radius}
        stroke={amber} strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${filled} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        opacity="0.85"
      />
      {/* Center percentage */}
      <text
        x={cx} y={cy - 4}
        fontSize="32"
        fill={amber}
        fontFamily="var(--fd)"
        textAnchor="middle"
        fontWeight="700"
        letterSpacing="-0.03em"
        dominantBaseline="middle"
      >
        86%
      </text>
      <text
        x={cx} y={cy + 20}
        fontSize="10"
        fill="var(--muted)"
        fontFamily="var(--fm)"
        textAnchor="middle"
        opacity="0.5"
      >
        of executives
      </text>

      {/* Legend dots */}
      <circle cx="108" cy="198" r="4" fill={amber} opacity="0.85" />
      <text x="118" y="201" fontSize="10" fill="var(--muted)" fontFamily="var(--fm)" opacity="0.6">
        Tech debt limits AI ROI
      </text>

      <circle cx="108" cy="220" r="4" fill={blue} opacity="0.3" />
      <text x="118" y="223" fontSize="10" fill="var(--muted)" fontFamily="var(--fm)" opacity="0.6">
        No constraint reported
      </text>
    </svg>
  )
}
