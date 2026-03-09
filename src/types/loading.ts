export type Phase = 'rain' | 'converge' | 'planet' | 'disperse'

export interface Particle {
  x: number
  y: number
  speed: number
  size: number
  opacity: number
  color: string
  sphereLat: number
  sphereLon: number
  tx: number
  ty: number
}

export interface RainDrop {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
}
