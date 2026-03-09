import { AppMockup, MOCK } from './AppMockup'

const domains = [
  { name: 'Architecture', score: 82, color: '#00f0ff' },
  { name: 'Service Layer', score: 71, color: '#a855f7' },
  { name: 'Error Handling', score: 65, color: '#f038a0' },
  { name: 'Tests', score: 88, color: '#00f0aa' },
  { name: 'Coverage', score: 76, color: '#ffd700' },
  { name: 'Code Style', score: 91, color: '#4da6ff' },
]

const issues = [
  {
    severity: 'critical' as const,
    title: 'Circular dependency in auth module',
    color: '#ff4444',
    rec: 'Extract shared types into a dedicated module',
  },
  {
    severity: 'medium' as const,
    title: 'Missing error boundaries in 12 controllers',
    color: '#ffd700',
    rec: 'Wrap controller handlers with errorBoundary()',
  },
  {
    severity: 'low' as const,
    title: 'Inconsistent naming in utils/',
    color: '#4da6ff',
    rec: 'Apply camelCase convention across utility files',
  },
]

export function FdeMockup() {
  return (
    <AppMockup>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: `1px solid ${MOCK.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: MOCK.accent, fontSize: 10 }}>◆</span>
          <span style={{ fontSize: 8, color: MOCK.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>FDE Deep Dive</span>
        </div>
        <span style={{ fontSize: 7, color: MOCK.muted }}>my-project/src</span>
      </div>

      <div style={{ padding: 12 }}>
        {/* Health score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#ffd700' }}>78%</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 7, color: MOCK.muted, marginBottom: 3 }}>OVERALL HEALTH</div>
            <div style={{ height: 4, background: MOCK.dim, borderRadius: 2 }}>
              <div style={{ width: '78%', height: '100%', background: '#ffd700', borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* Domain grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 10 }}>
          {domains.map((d) => (
            <div key={d.name} style={{ background: MOCK.surface, borderRadius: 4, padding: '5px 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 7, color: MOCK.muted, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
              <span style={{ fontSize: 8, fontWeight: 600, color: d.color }}>{d.score}</span>
            </div>
          ))}
        </div>

        {/* Issues */}
        <div style={{ fontSize: 7, color: MOCK.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Issues</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {issues.map((issue) => (
            <div key={issue.title} style={{ background: `${issue.color}0a`, border: `1px solid ${issue.color}20`, borderRadius: 4, padding: '5px 7px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: issue.color, flexShrink: 0 }} />
                <span style={{ fontSize: 8, flex: 1 }}>{issue.title}</span>
                <span style={{
                  fontSize: 6,
                  padding: '1px 4px',
                  borderRadius: 3,
                  background: `${issue.color}20`,
                  color: issue.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {issue.severity}
                </span>
              </div>
              <div style={{ borderLeft: `2px solid ${MOCK.green}`, paddingLeft: 6, fontSize: 7, color: MOCK.muted }}>
                {issue.rec}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppMockup>
  )
}
