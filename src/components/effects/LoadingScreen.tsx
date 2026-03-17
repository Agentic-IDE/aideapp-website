import { useEffect, useRef, useState, useCallback } from 'react'
import { getParticleColors } from '../../constants/theme'
import type { RainDrop, Particle, Phase } from '../../types'

const PARTICLE_COUNT = 120
const RAIN_DURATION = 1500
const CONVERGE_DURATION = 2000
const PLANET_MIN_DURATION = 1500
const DISPERSE_DURATION = 1200

function getBg() {
  return getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#000000'
}

interface LoadingScreenProps {
  onComplete: (drops: RainDrop[]) => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phaseRef = useRef<Phase>('rain')
  const phaseStartRef = useRef(Date.now())
  const rotationRef = useRef(0)
  const completedRef = useRef(false)
  const [bgOpacity, setBgOpacity] = useState(1)

  const startPhase = useCallback((phase: Phase) => {
    phaseRef.current = phase
    phaseStartRef.current = Date.now()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 1 + Math.random() * 3,
      size: 1.5 + Math.random() * 1.5,
      opacity: 0.15 + Math.random() * 0.4,
      color: (() => { const c = getParticleColors(); return c[Math.floor(Math.random() * c.length)]; })(),
      sphereLat: Math.acos(2 * Math.random() - 1),
      sphereLon: Math.random() * Math.PI * 2,
      tx: 0,
      ty: 0,
    }))

    const slantDx = Math.tan(15 * Math.PI / 180)

    function spherePos(p: Particle, radius: number, rotation: number, cx: number, cy: number) {
      const x3d = radius * Math.sin(p.sphereLat) * Math.cos(p.sphereLon + rotation)
      const z3d = radius * Math.sin(p.sphereLat) * Math.sin(p.sphereLon + rotation)
      const y3d = radius * Math.cos(p.sphereLat)
      const scale = 1 + z3d / (radius * 3)
      return { x: cx + x3d * scale, y: cy + y3d * scale, z: z3d, scale }
    }

    function frame() {
      const w = canvas!.width
      const h = canvas!.height
      const now = Date.now()
      const elapsed = now - phaseStartRef.current
      const phase = phaseRef.current
      const cx = w / 2
      const cy = h / 2 - 40
      const radius = Math.min(w, h) * 0.15

      if (phase === 'disperse') {
        const t = Math.min(elapsed / DISPERSE_DURATION, 1)
        const alpha = 1 - t * t
        ctx!.globalAlpha = alpha
        ctx!.fillStyle = getBg()
        ctx!.fillRect(0, 0, w, h)
        ctx!.globalAlpha = 1
        setBgOpacity(alpha)
      } else {
        ctx!.fillStyle = getBg()
        ctx!.fillRect(0, 0, w, h)
      }

      if (phase === 'rain') {
        for (const p of particles) {
          const drawX = p.x + p.y * slantDx
          ctx!.fillStyle = `${p.color} ${p.opacity})`
          ctx!.fillRect(drawX % w, p.y, p.size, p.size)
          p.y += p.speed
          if (p.y > h) {
            p.y = -Math.random() * 20
            p.x = Math.random() * w
          }
        }
        if (elapsed > RAIN_DURATION) startPhase('converge')
      } else if (phase === 'converge') {
        const t = Math.min(elapsed / CONVERGE_DURATION, 1)
        const ease = t * t * (3 - 2 * t)
        rotationRef.current += 0.008 * ease

        for (const p of particles) {
          const target = spherePos(p, radius, rotationRef.current, cx, cy)
          p.x += (target.x - p.x) * ease * 0.08
          p.y += (target.y - p.y) * ease * 0.08
          p.y += p.speed * (1 - ease)

          const depthOpacity = 0.3 + 0.7 * ((target.z + radius) / (2 * radius))
          const drawOpacity = p.opacity * (1 - ease) + depthOpacity * ease
          const drawSize = p.size * (1 - ease * 0.3) + (p.size * target.scale) * ease * 0.3

          ctx!.fillStyle = `${p.color} ${drawOpacity})`
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, Math.max(drawSize * 0.5, 0.5), 0, Math.PI * 2)
          ctx!.fill()
        }
        if (elapsed > CONVERGE_DURATION) startPhase('planet')
      } else if (phase === 'planet') {
        rotationRef.current += 0.015

        const sorted = particles
          .map((p) => ({ p, ...spherePos(p, radius, rotationRef.current, cx, cy) }))
          .sort((a, b) => a.z - b.z)

        for (const { p, x, y, z, scale } of sorted) {
          const depthOpacity = 0.2 + 0.8 * ((z + radius) / (2 * radius))
          const dotSize = (p.size * 0.6 + 0.5) * scale
          p.x = x
          p.y = y

          ctx!.fillStyle = `${p.color} ${depthOpacity})`
          ctx!.beginPath()
          ctx!.arc(x, y, Math.max(dotSize, 0.5), 0, Math.PI * 2)
          ctx!.fill()
        }

        const gradient = ctx!.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 1.5)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx!.fillStyle = gradient
        ctx!.fillRect(0, 0, w, h)

        if (elapsed > PLANET_MIN_DURATION) {
          // Disperse across full viewport
          for (const p of particles) {
            p.tx = Math.random() * w
            p.ty = Math.random() * h
          }
          startPhase('disperse')
        }
      } else if (phase === 'disperse') {
        const t = Math.min(elapsed / DISPERSE_DURATION, 1)
        const ease = t * t * (3 - 2 * t)

        for (const p of particles) {
          p.x += (p.tx - p.x) * 0.06
          p.y += (p.ty - p.y) * 0.06

          const fadeOpacity = p.opacity * (0.3 + 0.7 * (1 - ease))
          ctx!.fillStyle = `${p.color} ${fadeOpacity})`
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
          ctx!.fill()
        }

        if (t >= 1 && !completedRef.current) {
          completedRef.current = true
          cancelAnimationFrame(animId)
          const drops: RainDrop[] = particles.map((p) => ({
            x: p.x,
            y: p.y,
            size: p.size,
            speed: 0.4 + Math.random() * 1.8,
            opacity: 0.08 + Math.random() * 0.3,
            color: p.color,
          }))
          onComplete(drops)
          return
        }
      }

      animId = requestAnimationFrame(frame)
    }

    animId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [startPhase, onComplete])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: `color-mix(in srgb, var(--bg) ${Math.round(bgOpacity * 100)}%, transparent)`,
        pointerEvents: bgOpacity < 0.1 ? 'none' : 'auto',
        transition: 'background-color 100ms',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
}
