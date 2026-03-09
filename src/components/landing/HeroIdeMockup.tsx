import { useState, useEffect, useRef } from 'react'
import { MOCK } from './mockups/AppMockup'
import { ANIMATED_TERMINAL_SCRIPT } from '../../constants/content'
import type { AnimatedTerminalLine } from '../../types'

const COLOR_MAP: Record<AnimatedTerminalLine['color'], string> = {
  prompt: MOCK.muted,
  command: MOCK.text,
  output: MOCK.muted,
  success: MOCK.green,
  warning: '#ffd700',
  info: MOCK.accent,
  blank: 'transparent',
}

const tabs = [
  { name: 'fde-session', color: MOCK.green, active: true },
  { name: 'auth-refactor', color: '#ff4444', active: false },
  { name: 'api-layer', color: '#ffd700', active: false },
]

const SKILL_NAMES = [
  'clean-architecture',
  'test-generation',
  'doc-gen',
  'security-audit',
  'perf-optimizer',
]

const AGENT_NAMES = ['Refactor Agent', 'Test Agent', 'Doc Agent']

const INITIAL_AGENT_STATES: Record<string, { status: string; color: string }> = {
  'Refactor Agent': { status: 'Idle', color: '#ffd700' },
  'Test Agent': { status: 'Idle', color: MOCK.muted },
  'Doc Agent': { status: 'Queued', color: MOCK.muted },
}

interface LogEntry {
  time: string
  source: string
  sourceColor: string
  text: string
}

const INITIAL_LOG: LogEntry = { time: '14:31', source: 'boot', sourceColor: MOCK.accent, text: 'FDE session initialized' }

export function HeroIdeMockup() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [activeSkills, setActiveSkills] = useState<Set<string>>(new Set())
  const [agentStates, setAgentStates] = useState(INITIAL_AGENT_STATES)
  const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>([INITIAL_LOG])
  const terminalRef = useRef<HTMLDivElement>(null)

  // Animation loop
  useEffect(() => {
    if (visibleCount >= ANIMATED_TERMINAL_SCRIPT.length) {
      const timer = setTimeout(() => {
        setVisibleCount(0)
        setActiveSkills(new Set())
        setAgentStates(INITIAL_AGENT_STATES)
        setVisibleLogs([INITIAL_LOG])
      }, 1200)
      return () => clearTimeout(timer)
    }

    const line = ANIMATED_TERMINAL_SCRIPT[visibleCount]
    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1)

      if (line.sideEffect) {
        const fx = line.sideEffect
        if (fx.type === 'skill_activate') {
          setActiveSkills((prev) => new Set([...prev, fx.skillName]))
        } else if (fx.type === 'agent_status') {
          setAgentStates((prev) => ({
            ...prev,
            [fx.agentName]: { status: fx.status, color: fx.color },
          }))
        } else if (fx.type === 'log_entry') {
          setVisibleLogs((prev) => [...prev, fx])
        }
      }
    }, line.delay)
    return () => clearTimeout(timer)
  }, [visibleCount])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [visibleCount])

  return (
    <div
      style={{
        marginTop: 64,
        background: MOCK.bg,
        border: `1px solid ${MOCK.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
        fontFamily: MOCK.font,
        fontSize: 11,
        color: MOCK.text,
        lineHeight: 1.5,
        animation: 'fu 0.6s 0.4s ease both',
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: `1px solid ${MOCK.border}`, background: MOCK.surface }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: MOCK.accent, fontSize: 14 }}>◆</span>
          <span style={{ fontSize: 10, color: MOCK.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Agentic IDE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: MOCK.bg, borderRadius: 10, padding: '3px 10px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: MOCK.green }} />
          <span style={{ fontSize: 9, color: MOCK.muted }}>dev-user</span>
        </div>
      </div>

      {/* Tab row */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${MOCK.border}` }}>
        {tabs.map((tab) => (
          <div key={tab.name} style={{
            padding: '6px 14px',
            fontSize: 9,
            color: tab.active ? MOCK.text : MOCK.muted,
            borderRight: `1px solid ${MOCK.border}`,
            background: tab.active ? MOCK.surface : 'transparent',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: tab.color }} />
            {tab.name}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 100px', minHeight: 200 }}>
        {/* Sidebar - Skills */}
        <div style={{ borderRight: `1px solid ${MOCK.border}`, padding: '10px 8px' }}>
          <div style={{ fontSize: 8, color: MOCK.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Skills</div>
          {SKILL_NAMES.map((name) => {
            const isActive = activeSkills.has(name)
            return (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5 }}>
                <span style={{
                  width: 9, height: 9, borderRadius: 2,
                  border: `1px solid ${isActive ? MOCK.accent : MOCK.dim}`,
                  background: isActive ? `${MOCK.accent}30` : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 6, color: MOCK.accent,
                  transition: 'all 0.3s ease',
                }}>
                  {isActive ? '✓' : ''}
                </span>
                <span style={{
                  fontSize: 8,
                  color: isActive ? MOCK.text : MOCK.muted,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease',
                }}>
                  {name}
                </span>
                <span style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: isActive ? MOCK.green : MOCK.dim,
                  marginLeft: 'auto', flexShrink: 0,
                  transition: 'background 0.3s ease',
                }} />
              </div>
            )
          })}
        </div>

        {/* Terminal area */}
        <div
          ref={terminalRef}
          style={{ padding: '10px 16px', maxHeight: 200, overflow: 'hidden' }}
        >
          {ANIMATED_TERMINAL_SCRIPT.slice(0, visibleCount).map((line, i) => (
            <div key={i} style={{ fontSize: 10, color: COLOR_MAP[line.color], marginBottom: 1 }}>
              {line.color === 'command' && line.text.startsWith('❯') ? (
                <>
                  <span style={{ color: MOCK.muted }}>❯</span>
                  <span style={{ color: MOCK.text }}>{line.text.slice(1)}</span>
                </>
              ) : (
                line.text || '\u00A0'
              )}
            </div>
          ))}
          <div style={{ fontSize: 10 }}>
            <span style={{ color: MOCK.muted }}>❯</span>{' '}
            <span
              style={{
                display: 'inline-block',
                width: 7,
                height: 13,
                background: MOCK.accent,
                verticalAlign: 'middle',
                animation: 'blink 1s step-end infinite',
              }}
            />
          </div>
        </div>

        {/* Agents panel */}
        <div style={{ borderLeft: `1px solid ${MOCK.border}`, padding: '10px 8px' }}>
          <div style={{ fontSize: 8, color: MOCK.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Agents</div>
          {AGENT_NAMES.map((name) => {
            const state = agentStates[name]
            return (
              <div key={name} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: state.color, flexShrink: 0,
                    transition: 'background 0.4s ease',
                    animation: state.status === 'Running' ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  }} />
                  <span style={{ fontSize: 8, color: MOCK.text }}>{name}</span>
                </div>
                <div style={{ fontSize: 7, color: MOCK.muted, marginLeft: 10, marginTop: 1 }}>{state.status}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Command log */}
      <div style={{ borderTop: `1px solid ${MOCK.border}`, padding: '6px 16px', background: MOCK.surface }}>
        {visibleLogs.map((log, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, fontSize: 8,
            animation: i > 0 ? 'fu 0.4s ease both' : undefined,
          }}>
            <span style={{ color: MOCK.dim }}>{log.time}</span>
            <span style={{
              fontSize: 7,
              padding: '1px 5px',
              borderRadius: 3,
              background: `${log.sourceColor}18`,
              color: log.sourceColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {log.source}
            </span>
            <span style={{ color: MOCK.muted }}>{log.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
