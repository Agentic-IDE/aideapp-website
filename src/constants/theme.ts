export const COLORS = {
  bg: '#000000',
  surface: '#0A0A0A',
  surface2: '#111111',
  border: '#1A1A1A',
  accent: '#FFFFFF',
  accent2: '#FFFFFF',
  accent3: '#FFFFFF',
  accent4: '#FFFFFF',
  text: '#FFFFFF',
  muted: '#666666',
  dim: '#1A1A1A',
} as const

export const FONTS = {
  display: "'Space Grotesk', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const

export const PARTICLE_COLORS = [
  'rgba(255, 255, 255,',  // bright white
  'rgba(200, 200, 200,',  // light grey
  'rgba(160, 160, 160,',  // medium grey
  'rgba(120, 120, 120,',  // dim grey
]

const PARTICLE_COLORS_LIGHT = [
  'rgba(0, 0, 0,',
  'rgba(60, 60, 60,',
  'rgba(100, 100, 100,',
  'rgba(140, 140, 140,',
]

export function getParticleColors(): string[] {
  const isDark = document.documentElement.classList.contains('dark')
  return isDark ? PARTICLE_COLORS : PARTICLE_COLORS_LIGHT
}
