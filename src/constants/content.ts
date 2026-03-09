import type { NavLink, StatItem, ModeCardContent, TerminalLine, AnimatedTerminalLine } from '../types'

export const NAV_LINKS: NavLink[] = [
  { label: 'Mission', href: '#mission' },
  { label: 'Platform', href: '#modes' },
  { label: 'YC S26', href: '#yc' },
  { label: 'Request Access', href: '#waitlist', cta: true },
]

export const HERO = {
  badge: 'Now in private beta',
  titleLines: ['The IDE that', 'fixes itself', 'as you build.'],
  subtitle:
    'Agentic IDE is the first AI-native development platform with three modes — recover from debt, build with intelligence, and architect without compromise.',
  primaryCta: { label: 'Request Early Access →', href: '#waitlist' },
  ghostCta: { label: 'See the platform', href: '#modes' },
}

export const TERMINAL_LINES: TerminalLine[] = [
  { text: '❯ aide fde init ./src', color: 'command' },
  { text: '  Scanning codebase patterns...', color: 'output' },
  { text: '  ⚠ 47 structural issues across 23 files', color: 'warning' },
  { text: '  ↳ Missing abstraction layers, 12% test coverage', color: 'output' },
  { text: '', color: 'blank' },
  { text: '  AI FDE: What are your architecture standards?', color: 'info' },
  { text: '  > Clean architecture, domain-driven, full e2e coverage', color: 'command' },
  { text: '', color: 'blank' },
  { text: '  Generating safe refactor plan...', color: 'output' },
  { text: '  ✓ Skill injected: clean-architecture-v3', color: 'success' },
  { text: '  ✓ Refactoring 23 files → layered domain structure', color: 'success' },
  { text: '  ✓ E2E tests: 89/89 passing — coverage 12% → 84%', color: 'success' },
  { text: '', color: 'blank' },
]

export const TERMINAL_TITLE = 'aide fde — analyzing workspace'

export const ANIMATED_TERMINAL_SCRIPT: AnimatedTerminalLine[] = [
  // Phase 1: Init
  { text: '❯ aide fde init ./src', color: 'command', delay: 400 },
  { text: '  Connecting to Claude API...', color: 'output', delay: 600 },
  { text: '  Scanning codebase — 847 files indexed', color: 'output', delay: 700,
    sideEffect: { type: 'log_entry', time: '14:32', source: 'boot', sourceColor: '#00f0ff', text: 'Codebase scan started — 847 files' } },
  { text: '  ⚠ 47 structural issues across 23 files', color: 'warning', delay: 800 },
  { text: '  ↳ Missing abstraction layers, 12% test coverage', color: 'output', delay: 500 },
  { text: '', color: 'blank', delay: 300 },
  // Phase 2: AI Conversation
  { text: '  AI: What are your architecture standards?', color: 'info', delay: 700 },
  { text: '  > Clean architecture, domain-driven, full e2e coverage', color: 'command', delay: 1000 },
  { text: '', color: 'blank', delay: 300 },
  // Phase 3: Skill Injection
  { text: '  Generating refactor plan...', color: 'output', delay: 700 },
  { text: '  ✓ Skill injected: clean-architecture-v3', color: 'success', delay: 600,
    sideEffect: { type: 'skill_activate', skillName: 'clean-architecture' } },
  { text: '  ✓ Skill injected: test-generation', color: 'success', delay: 500,
    sideEffect: { type: 'skill_activate', skillName: 'test-generation' } },
  { text: '  ✓ Skill injected: security-audit', color: 'success', delay: 500,
    sideEffect: { type: 'skill_activate', skillName: 'security-audit' } },
  { text: '', color: 'blank', delay: 300,
    sideEffect: { type: 'log_entry', time: '14:33', source: 'skills', sourceColor: '#a855f7', text: '3 skills injected into session' } },
  // Phase 4: Agent Spawn
  { text: '  Spawning refactor agents...', color: 'output', delay: 600,
    sideEffect: { type: 'agent_status', agentName: 'Refactor Agent', status: 'Running', color: '#00f0aa' } },
  { text: '  Spawning test agents...', color: 'output', delay: 500,
    sideEffect: { type: 'agent_status', agentName: 'Test Agent', status: 'Running', color: '#00f0aa' } },
  // Phase 5: Results
  { text: '  ✓ Refactoring 23 files → layered domain structure', color: 'success', delay: 900,
    sideEffect: { type: 'log_entry', time: '14:34', source: 'terminal', sourceColor: '#00f0aa', text: 'Refactor complete — 23 files restructured' } },
  { text: '  ✓ E2E tests: 89/89 passing', color: 'success', delay: 700,
    sideEffect: { type: 'agent_status', agentName: 'Test Agent', status: 'Done', color: '#00f0aa' } },
  { text: '  ✓ Coverage: 12% → 84%', color: 'success', delay: 500 },
  // Hold before loop
  { text: '', color: 'blank', delay: 2500 },
]

export const MISSION = {
  title: "AI writes code faster than ever. It's also breaking it faster than ever.",
  text: 'AI tools have removed the natural friction that kept technical debt manageable. Code duplication has surged 10x, AI-generated code ships 1.7x more defects, and 86% of executives say tech debt is already constraining their AI investments. The result: teams are shipping faster but drowning in maintenance.',
  stats: [
    {
      value: '1.7x',
      label: 'More defects in AI-generated code',
      source: 'CodeRabbit, 2025',
      visual: 'comparison',
      quote: 'AI-generated code produces 1.7x more issues than human-written code across 470 pull requests.',
      analysis: 'Logic errors appear at 1.75x the rate, readability issues at 3x, and concurrency bugs at nearly 8x. The speed gains from AI coding assistants come with a hidden quality cost.',
    },
    {
      value: '10x',
      label: 'Increase in code duplication',
      source: 'GitClear, 2025',
      visual: 'rising',
      quote: 'Code duplication has surged to 12.3% of all changed lines — a 10x increase since AI tool adoption.',
      analysis: 'Meanwhile, refactored code collapsed from 24% to under 10%. Developers are copy-pasting AI suggestions instead of building proper abstractions.',
    },
    {
      value: '86%',
      label: 'Of execs say tech debt limits AI ROI',
      source: 'IBM, 2025',
      visual: 'donut',
      quote: '86% of executives say technical debt is already constraining their AI initiatives.',
      analysis: '69% believe tech debt will make some AI projects financially untenable. Yet organizations that factor debt into planning achieve 29% higher ROI.',
    },
    {
      value: '19%',
      label: 'Slower despite feeling faster',
      source: 'METR Study, 2025',
      visual: 'gap',
      quote: 'Developers believed AI made them 20% faster. Measured results showed they were 19% slower.',
      analysis: 'In a study of 16 developers across 246 tasks, 75% performed worse with AI. Developers spent 9% of their time just reviewing and rejecting AI suggestions — with a 56% rejection rate.',
    },
    {
      value: '$120M+',
      label: 'Hidden annual tech debt cost per enterprise',
      source: 'IBM, 2025',
      visual: 'cost',
      quote: 'For a $20B enterprise, tech debt adds over $120M per year in hidden AI implementation costs.',
      analysis: 'Tech debt consumes up to 29% of AI budgets and extends timelines by 15–22%. A 30-month project becomes 36 months. 53% of executives say legacy integration already derailed AI outcomes.',
    },
  ] satisfies StatItem[],
}

export const MODES_HEADER = {
  label: 'The Platform',
  title: 'Three modes.\nEvery phase.',
  subtitle:
    "Whether you're starting fresh, maintaining a healthy codebase, or recovering from years of debt — AIDE has a dedicated agent for it.",
}

export const MODE_CARDS: ModeCardContent[] = [
  {
    id: 'fde',
    tag: 'AI FDE',
    tagFull: 'AI FDE — Field Development Engineer',
    color: 'var(--accent)',
    title: 'Recover from\nexisting debt.',
    description:
      'AI FDE scans your codebase, holds a conversation to understand your architecture standards, then performs a full code review and executes refactors — with e2e tests at every step so nothing breaks.',
    features: [
      'Conversational intake — describe your standards in plain English',
      'Architecture-aligned refactors across the entire codebase',
      'E2E tests generated and run before every change',
      'Tech debt heat map — visualize debt density across your repo',
      'Skill health monitoring — skills stay current as code evolves',
    ],
    mockup: 'fde',
    terminalTitle: 'AI FDE Session',
    terminal: [
      { text: 'AI FDE: Tell me your architecture goals.', color: 'info' },
      { text: '> Domain-driven, clean layers, no circular deps', color: 'command' },
      { text: '', color: 'blank' },
      { text: 'Analyzing 847 files...', color: 'output' },
      { text: '⚠ 23 circular deps found', color: 'warning' },
      { text: '⚠ 41 business logic leaks in controllers', color: 'warning' },
      { text: '', color: 'blank' },
      { text: '✓ Safe plan ready — 0 breaking changes', color: 'success' },
      { text: '✓ Coverage will increase 12% → 84%', color: 'success' },
    ],
  },
  {
    id: 'ide',
    tag: 'AI IDE',
    tagFull: 'AI IDE — Intelligent Development Environment',
    color: 'var(--accent)',
    title: 'Build without\naccumulating debt.',
    description:
      'A terminal IDE with skill profiles, branch isolation per session, and agentic assistance built in. Multiple agents can work in parallel across branches without conflicts.',
    features: [
      'Terminal instance spawner with isolated skill profiles',
      'Automatic folder cloning — each session in its own branch',
      'Skill output logs — full visibility into every agent action',
      'Multi-agent parallel workflows across branches',
      'Container support for safe, reproducible environments',
    ],
    mockup: 'ide',
    terminalTitle: 'IDE Session Manager',
    terminal: [
      { text: 'Active sessions:', color: 'output' },
      { text: '● session-1  feat/auth-refactor    3 skills', color: 'success' },
      { text: '● session-2  feat/api-layer         2 skills', color: 'success' },
      { text: '● session-3  fix/performance         agents running', color: 'warning' },
      { text: '', color: 'blank' },
      { text: '14:32 [clean-arch]  Injected layer boundary', color: 'command' },
      { text: '14:33 [doc-gen]     Updated 8 function docs', color: 'command' },
      { text: '14:34 [test-gen]    Generated 12 new cases', color: 'success' },
    ],
  },
  {
    id: 'arch',
    tag: 'AI Architect',
    tagFull: 'AI Architect — New Project Mode',
    color: 'var(--accent)',
    title: 'Start every project\nthe right way.',
    description:
      'AI Architect uses enhanced plan mode and agent teams to generate starting architecture, skill profiles, and full implementation plans — so you never accumulate debt from day one.',
    features: [
      'Architecture designed before a single line is written',
      'Agent teams collaborate on domain model and API contracts',
      'Custom skill profiles generated per project type',
      'Full implementation plan with milestones and checkpoints',
      'Cross-platform and containerized from the start',
    ],
    mockup: 'architect',
    terminalTitle: 'Architect Plan Mode',
    terminal: [
      { text: 'Project: SaaS API Platform', color: 'output' },
      { text: '', color: 'blank' },
      { text: 'Spawning architect agents...', color: 'command' },
      { text: '✓ Agent 1: Domain model designed', color: 'success' },
      { text: '✓ Agent 2: API contract defined', color: 'success' },
      { text: '✓ Agent 3: Infrastructure plan ready', color: 'success' },
      { text: '', color: 'blank' },
      { text: '6 skill profiles generated', color: 'output' },
      { text: '→ Scaffolding in clean state', color: 'warning' },
    ],
  },
]

export const YC = {
  title: 'Targeting\nYC Summer 2026.',
  description:
    "We're building Agentic IDE to be the standard development platform for the agentic era. Looking for investors, advisors, and design partners who see where software development is going.",
  primaryCta: { label: 'Get Early Access →', href: '#waitlist' },
  ghostCta: { label: 'Talk to us', href: 'mailto:hello@aideapp.dev' },
  badge: {
    logo: 'YC',
    label: 'Applying to',
    season: 'Summer 2026',
  },
}

export const WAITLIST = {
  label: 'Early Access',
  title: 'Stop paying the\ntech debt tax.',
  subtitle: "Join engineering teams getting early access. We're onboarding selectively.",
  buttonLabel: 'Join Waitlist →',
  successLabel: "✓ You're on the list",
  note: 'No spam. Early access invites sent in order of signup.',
}

export const FOOTER = {
  company: 'Agentic IDE Inc.',
  right: 'aideapp.dev · © 2026',
}
