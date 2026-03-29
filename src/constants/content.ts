import type { NavLink, StatItem, ModeCardContent, TerminalLine, AnimatedTerminalLine } from '../types'

export const NAV_LINKS: NavLink[] = [
  { label: 'Mission', href: '#mission' },
  { label: 'Platform', href: '#modes' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Download', href: '#', cta: true },
]

export const HERO = {
  badge: 'Now in public beta',
  titleLines: ['GitHub for', 'AI agents.'],
  subtitle:
    'Host, version, and distribute AI agent profiles to your entire team. Skills, configs, MCP servers — one platform, every developer.',
  primaryCta: { label: 'Get Started Free →', href: '/signup' },
  ghostCta: { label: 'See pricing', href: '/pricing' },
}

export const TERMINAL_LINES: TerminalLine[] = [
  { text: '❯ aide profile sync --org arena-ai', color: 'command' },
  { text: '  Connecting to aideapp.dev...', color: 'output' },
  { text: '  ✓ Synced 3 profiles from Arena AI', color: 'success' },
  { text: '  ↳ backend-standards (12 skills)', color: 'output' },
  { text: '  ↳ frontend-quality (8 skills)', color: 'output' },
  { text: '  ↳ security-compliance (6 skills)', color: 'output' },
  { text: '', color: 'blank' },
  { text: '  MCP server configured → claude mcp add aide-skills', color: 'info' },
  { text: '  ✓ Skills active in all new sessions', color: 'success' },
  { text: '  ✓ 1.2M tokens saved this week across 14 developers', color: 'success' },
  { text: '', color: 'blank' },
]

export const TERMINAL_TITLE = 'aide — profile sync'

export const ANIMATED_TERMINAL_SCRIPT: AnimatedTerminalLine[] = [
  // Phase 1: Profile sync
  { text: '❯ aide profile sync --org arena-ai', color: 'command', delay: 400 },
  { text: '  Connecting to aideapp.dev...', color: 'output', delay: 600 },
  { text: '  Authenticated as nick@arena.ai', color: 'output', delay: 700,
    sideEffect: { type: 'log_entry', time: '14:32', source: 'sync', sourceColor: '#00f0ff', text: 'Profile sync started' } },
  { text: '  Fetching org profiles...', color: 'output', delay: 800 },
  { text: '', color: 'blank', delay: 300 },
  // Phase 2: Profiles loaded
  { text: '  ✓ backend-standards v7 (12 skills)', color: 'success', delay: 600,
    sideEffect: { type: 'skill_activate', skillName: 'clean-architecture' } },
  { text: '  ✓ frontend-quality v4 (8 skills)', color: 'success', delay: 500,
    sideEffect: { type: 'skill_activate', skillName: 'test-generation' } },
  { text: '  ✓ security-compliance v2 (6 skills)', color: 'success', delay: 500,
    sideEffect: { type: 'skill_activate', skillName: 'security-audit' } },
  { text: '', color: 'blank', delay: 300,
    sideEffect: { type: 'log_entry', time: '14:33', source: 'profiles', sourceColor: '#a855f7', text: '3 profiles synced — 26 skills active' } },
  // Phase 3: MCP configured
  { text: '  Configuring MCP server...', color: 'output', delay: 600,
    sideEffect: { type: 'agent_status', agentName: 'MCP Server', status: 'Running', color: '#00f0aa' } },
  { text: '  ✓ aide-skills MCP server active', color: 'success', delay: 500 },
  { text: '', color: 'blank', delay: 300 },
  // Phase 4: Impact
  { text: '  Team stats this week:', color: 'info', delay: 700,
    sideEffect: { type: 'log_entry', time: '14:34', source: 'analytics', sourceColor: '#00f0aa', text: 'Weekly report generated' } },
  { text: '  ✓ 1.2M tokens saved across 14 developers', color: 'success', delay: 700,
    sideEffect: { type: 'agent_status', agentName: 'MCP Server', status: 'Done', color: '#00f0aa' } },
  { text: '  ✓ Code review time: 5 days → 1.5 days', color: 'success', delay: 500 },
  { text: '  ✓ 0 profile drift — all devs on latest', color: 'success', delay: 500 },
  // Hold before loop
  { text: '', color: 'blank', delay: 2500 },
]

export const MISSION = {
  title: 'Your AI agent identity, everywhere.',
  text: 'Every developer configures their AI agents differently — skills, CLAUDE.md files, MCP servers, compliance rules. Without a platform, teams fragment. New devs spend days setting up. Knowledge stays locked in individual machines. Agentic IDE gives every developer the same agent superpowers, managed centrally, distributed automatically.',
  stats: [
    {
      value: '1M+',
      label: 'Tokens saved per user per week',
      source: 'Agentic IDE telemetry',
      visual: 'rising',
      quote: 'Users save over 1 million tokens in their first week by using curated skill profiles.',
      analysis: 'Skills teach AI agents your codebase patterns, reducing hallucination and redundant context. The result: fewer tokens wasted on wrong answers.',
    },
    {
      value: '5x',
      label: 'Faster code review with shared profiles',
      source: 'Enterprise case study',
      visual: 'comparison',
      quote: 'Code review time dropped from 1 week to 1-2 days after deploying shared agent profiles.',
      analysis: 'When every developer\'s AI agent knows the team\'s architecture standards, reviews focus on logic — not style, patterns, or missing tests.',
    },
    {
      value: '30s',
      label: 'New developer onboarding',
      source: 'Profile sync',
      visual: 'gap',
      quote: 'New team members get the full agent environment in 30 seconds via automatic profile sync.',
      analysis: 'No more "ask Sarah for her config." Profiles sync every 30 seconds from the cloud, keeping every developer on the same page.',
    },
    {
      value: '99%',
      label: 'Margin on hosted profiles',
      source: 'Cost structure',
      visual: 'donut',
      quote: 'Near-zero infrastructure cost — skills run locally on developer machines.',
      analysis: 'Unlike cloud-compute AI products, profile hosting is pure metadata. The value is in the curation and distribution, not the compute.',
    },
  ] satisfies StatItem[],
}

export const MODES_HEADER = {
  label: 'The Platform',
  title: 'Host. Share.\nDistribute.',
  subtitle:
    'Manage your AI agent profiles in one place. Distribute skills, configs, and MCP servers to every developer on your team — automatically.',
}

export const MODE_CARDS: ModeCardContent[] = [
  {
    id: 'profiles',
    tag: 'Profiles',
    tagFull: 'Profile Hosting — Your Agent Identity',
    color: 'var(--accent)',
    title: 'Host your\nagent identity.',
    description:
      'Publish versioned profiles containing skills, CLAUDE.md configs, and tool setups. Every profile is an immutable snapshot that can be rolled back, diffed, and audited.',
    features: [
      'Versioned profiles with full diff history',
      'Skills, CLAUDE.md, and MCP configs in one package',
      'Polymorphic ownership — user, team, or org scoped',
      'Publish via API key or web dashboard',
      'Webhook notifications on profile changes',
    ],
    mockup: 'fde',
    terminalTitle: 'Profile Publishing',
    terminal: [
      { text: '❯ aide publish --profile backend-standards', color: 'command' },
      { text: '  Publishing to Arena AI org...', color: 'output' },
      { text: '', color: 'blank' },
      { text: '  + 2 skills added (api-security, error-handling)', color: 'success' },
      { text: '  ~ 1 skill modified (clean-architecture)', color: 'warning' },
      { text: '  Version 7 published', color: 'success' },
      { text: '', color: 'blank' },
      { text: '  Webhook fired → profile.published', color: 'info' },
      { text: '  14 developers will sync in < 30s', color: 'success' },
    ],
  },
  {
    id: 'teams',
    tag: 'Teams',
    tagFull: 'Team Management — Shared Standards',
    color: 'var(--accent)',
    title: 'One team,\none standard.',
    description:
      'Create organizations and teams. Invite members, assign roles, and ensure every developer has the same agent configuration. New hires get the full setup in 30 seconds.',
    features: [
      'Organization and team hierarchy',
      'Role-based access (admin, member)',
      'Email invitations with 7-day token expiry',
      'Automatic profile sync every 30 seconds',
      'Seat-based billing with Stripe',
    ],
    mockup: 'ide',
    terminalTitle: 'Team Sync',
    terminal: [
      { text: 'Org: Arena AI (Growth plan)', color: 'output' },
      { text: '  Teams: backend, frontend, platform', color: 'output' },
      { text: '  Members: 47/200 seats used', color: 'output' },
      { text: '', color: 'blank' },
      { text: '  Last sync: 12 seconds ago', color: 'success' },
      { text: '  All 47 developers on profile v7', color: 'success' },
      { text: '  0 drift detected', color: 'success' },
    ],
  },
  {
    id: 'mcp',
    tag: 'MCP',
    tagFull: 'MCP Distribution — Connect Any IDE',
    color: 'var(--accent)',
    title: 'Distribute via\nMCP servers.',
    description:
      'Profiles are distributed as MCP servers that connect to Claude, Cursor, Copilot, and any MCP-compatible IDE. One command to configure, automatic updates forever.',
    features: [
      'MCP server per profile — works with any compatible IDE',
      'API key authentication for secure access',
      'Real-time session heartbeats and analytics',
      'Skill adoption tracking across your org',
      'Container isolation for safe, reproducible environments',
    ],
    mockup: 'architect',
    terminalTitle: 'MCP Configuration',
    terminal: [
      { text: '❯ claude mcp add aide-skills -- \\', color: 'command' },
      { text: '    npx @aide/skills-mcp \\', color: 'command' },
      { text: '    --api-key sk_... --profile backend', color: 'command' },
      { text: '', color: 'blank' },
      { text: '  ✓ MCP server configured', color: 'success' },
      { text: '  ✓ 12 skills loaded from Arena AI', color: 'success' },
      { text: '  ✓ Auto-updates enabled', color: 'success' },
      { text: '', color: 'blank' },
      { text: '  Ready — skills active in next session', color: 'info' },
    ],
  },
]


export const FOOTER = {
  company: 'Agentic IDE Inc.',
  right: 'aideapp.dev · © 2026',
}
