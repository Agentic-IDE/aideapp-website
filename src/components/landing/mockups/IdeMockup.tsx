import { AppMockup, MOCK } from './AppMockup'

const tabs = [
  { name: 'auth-refactor', color: '#00f0aa', status: 'idle' },
  { name: 'api-layer', color: '#ff4444', status: 'coding' },
  { name: 'perf-fix', color: '#ffd700', status: 'waiting' },
]

const skills = [
  { name: 'clean-architecture', active: true },
  { name: 'test-generation', active: true },
  { name: 'doc-gen', active: false },
  { name: 'security-audit', active: true },
  { name: 'perf-optimizer', active: false },
]

const agents = [
  { name: 'Refactor Agent', status: 'Running', color: '#00f0aa' },
  { name: 'Test Agent', status: 'Idle', color: '#ffd700' },
  { name: 'Doc Agent', status: 'Queued', color: MOCK.muted },
]

const terminalLines = [
  { text: '14:32 [clean-arch]  Injected layer boundary', color: MOCK.accent },
  { text: '14:33 [test-gen]    Generated 12 test cases', color: MOCK.green },
  { text: '14:34 [security]    No vulnerabilities found', color: MOCK.green },
  { text: '14:35 [refactor]    Extracting service layer...', color: '#ffd700' },
  { text: '❯ _', color: MOCK.text },
]

export function IdeMockup() {
  return (
    <AppMockup>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', borderBottom: `1px solid ${MOCK.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: MOCK.accent, fontSize: 10 }}>◆</span>
          <span style={{ fontSize: 8, color: MOCK.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Agentic IDE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: MOCK.surface, borderRadius: 8, padding: '2px 6px' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: MOCK.green }} />
          <span style={{ fontSize: 7, color: MOCK.muted }}>dev-user</span>
        </div>
      </div>

      {/* Tab row */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${MOCK.border}` }}>
        {tabs.map((tab, i) => (
          <div key={tab.name} style={{
            padding: '5px 10px',
            fontSize: 7,
            color: i === 1 ? MOCK.text : MOCK.muted,
            borderRight: `1px solid ${MOCK.border}`,
            background: i === 1 ? MOCK.surface : 'transparent',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: tab.color }} />
            {tab.name}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 80px', minHeight: 140 }}>
        {/* Sidebar - Skills */}
        <div style={{ borderRight: `1px solid ${MOCK.border}`, padding: '8px 6px' }}>
          <div style={{ fontSize: 7, color: MOCK.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Skills</div>
          {skills.map((s) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
              <span style={{
                width: 7, height: 7, borderRadius: 2, border: `1px solid ${MOCK.dim}`,
                background: s.active ? `${MOCK.accent}30` : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 5, color: MOCK.accent,
              }}>
                {s.active ? '✓' : ''}
              </span>
              <span style={{ fontSize: 6.5, color: s.active ? MOCK.text : MOCK.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.name}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: s.active ? MOCK.green : MOCK.dim, marginLeft: 'auto', flexShrink: 0 }} />
            </div>
          ))}
        </div>

        {/* Terminal area */}
        <div style={{ padding: '8px 10px' }}>
          {terminalLines.map((line, i) => (
            <div key={i} style={{ fontSize: 7.5, color: line.color, marginBottom: 2 }}>{line.text}</div>
          ))}
        </div>

        {/* Agents panel */}
        <div style={{ borderLeft: `1px solid ${MOCK.border}`, padding: '8px 6px' }}>
          <div style={{ fontSize: 7, color: MOCK.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Agents</div>
          {agents.map((a) => (
            <div key={a.name} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <span style={{ fontSize: 7, color: MOCK.text }}>{a.name}</span>
              </div>
              <div style={{ fontSize: 6, color: MOCK.muted, marginLeft: 8, marginTop: 1 }}>{a.status}</div>
            </div>
          ))}
        </div>
      </div>
    </AppMockup>
  )
}
