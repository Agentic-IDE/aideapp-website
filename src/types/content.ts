export interface ModeCardContent {
  id: string
  tag: string
  tagFull: string
  color: string
  title: string
  description: string
  features: string[]
  mockup: 'fde' | 'ide' | 'architect'
  terminal: TerminalLine[]
  terminalTitle: string
}

export interface TerminalLine {
  text: string
  color: 'prompt' | 'command' | 'output' | 'success' | 'warning' | 'info' | 'blank'
}

export interface StatItem {
  value: string
  label: string
  source?: string
  visual?: 'comparison' | 'rising' | 'donut' | 'gap' | 'cost'
  quote?: string
  analysis?: string
}

export interface NavLink {
  label: string
  href: string
  cta?: boolean
}

export type SideEffect =
  | { type: 'skill_activate'; skillName: string }
  | { type: 'agent_status'; agentName: string; status: string; color: string }
  | { type: 'log_entry'; time: string; source: string; sourceColor: string; text: string }

export interface AnimatedTerminalLine {
  text: string
  color: TerminalLine['color']
  delay: number
  sideEffect?: SideEffect
}
