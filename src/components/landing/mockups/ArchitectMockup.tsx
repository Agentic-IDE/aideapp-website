import { AppMockup, MOCK } from './AppMockup'

const phases = [
  { label: 'Setup', done: true },
  { label: 'Brainstorm', active: true },
  { label: 'Skills', done: false },
  { label: 'Research', done: false },
  { label: 'Build', done: false },
]

const planItems = [
  { text: 'Domain model defined', done: true },
  { text: 'API contracts specified', done: true },
  { text: 'Auth strategy selected', done: false },
  { text: 'DB schema designed', done: false },
  { text: 'CI/CD pipeline planned', done: false },
]

export function ArchitectMockup() {
  return (
    <AppMockup>
      {/* Phase progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '8px 12px', borderBottom: `1px solid ${MOCK.border}` }}>
        {phases.map((p, i) => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: p.done ? MOCK.green : p.active ? MOCK.accent : MOCK.dim,
                border: p.active ? `1px solid ${MOCK.accent}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 5, color: '#000',
              }}>
                {p.done ? '✓' : ''}
              </span>
              <span style={{ fontSize: 6.5, color: p.done || p.active ? MOCK.text : MOCK.muted }}>{p.label}</span>
            </div>
            {i < phases.length - 1 && (
              <div style={{ width: 12, height: 1, background: MOCK.dim, margin: '0 4px' }} />
            )}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', minHeight: 160 }}>
        {/* Chat area */}
        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* AI message */}
          <div style={{ background: MOCK.surface, borderRadius: '6px 6px 6px 2px', padding: '5px 8px', fontSize: 7.5, maxWidth: '85%', color: MOCK.text }}>
            What type of application are you building?
          </div>

          {/* User message */}
          <div style={{
            background: 'transparent', borderRadius: '6px 6px 2px 6px', padding: '5px 8px', fontSize: 7.5,
            maxWidth: '85%', alignSelf: 'flex-end', color: MOCK.text,
            border: `1px solid ${MOCK.accent}30`,
          }}>
            A SaaS API platform with multi-tenant auth
          </div>

          {/* AI message */}
          <div style={{ background: MOCK.surface, borderRadius: '6px 6px 6px 2px', padding: '5px 8px', fontSize: 7.5, maxWidth: '85%', color: MOCK.text }}>
            Great. Should each tenant have isolated databases or shared with row-level security?
          </div>

          {/* User message */}
          <div style={{
            background: 'transparent', borderRadius: '6px 6px 2px 6px', padding: '5px 8px', fontSize: 7.5,
            maxWidth: '85%', alignSelf: 'flex-end', color: MOCK.text,
            border: `1px solid ${MOCK.accent}30`,
          }}>
            Row-level security, shared DB
          </div>

          {/* Typing indicator */}
          <div style={{ display: 'flex', gap: 3, padding: '4px 8px' }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                width: 4, height: 4, borderRadius: '50%', background: MOCK.muted,
                opacity: 0.6,
              }} />
            ))}
          </div>

          {/* Question counter */}
          <div style={{ fontSize: 7, color: MOCK.muted, marginTop: 'auto' }}>Q: 4/10</div>
        </div>

        {/* Plan panel */}
        <div style={{ borderLeft: `1px solid ${MOCK.border}`, padding: '8px 6px' }}>
          <div style={{ fontSize: 7, color: MOCK.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Architecture Plan</div>
          {planItems.map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 4 }}>
              <span style={{
                fontSize: 7, color: item.done ? MOCK.green : MOCK.dim, flexShrink: 0, marginTop: 0,
              }}>
                {item.done ? '✓' : '○'}
              </span>
              <span style={{ fontSize: 6.5, color: item.done ? MOCK.text : MOCK.muted }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </AppMockup>
  )
}
