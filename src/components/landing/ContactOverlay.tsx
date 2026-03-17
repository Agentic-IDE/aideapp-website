import { useEffect, useRef, useState } from 'react'
import { getParticleColors } from '../../constants/theme'
import type { ContactStatus } from '../../hooks/useContactForm'

const PARTICLE_COUNT = 60

interface Particle {
  x: number
  y: number
  speed: number
  size: number
  opacity: number
  color: string
  sphereLat: number
  sphereLon: number
}

interface ContactOverlayProps {
  status: ContactStatus
}

export function ContactOverlay({ status }: ContactOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resultOpacity = useRef(0)
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const prevStatus = useRef(status)

  // Track visibility and fade-out
  useEffect(() => {
    if (status !== 'idle' && !visible) {
      setFading(false)
      setVisible(true)
    }
    if (status === 'idle' && prevStatus.current !== 'idle') {
      // Start fade-out
      setFading(true)
    }
    prevStatus.current = status
  }, [status, visible])

  // Unmount after fade-out transition
  useEffect(() => {
    if (!fading) return
    const timer = setTimeout(() => {
      setVisible(false)
      setFading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [fading])

  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect()
      canvas!.width = rect.width
      canvas!.height = rect.height
    }
    resize()

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      speed: 1 + Math.random() * 3,
      size: 1.5 + Math.random() * 1.5,
      opacity: 0.15 + Math.random() * 0.4,
      color: (() => { const c = getParticleColors(); return c[Math.floor(Math.random() * c.length)]; })(),
      sphereLat: Math.acos(2 * Math.random() - 1),
      sphereLon: Math.random() * Math.PI * 2,
    }))

    let rotation = 0
    const startTime = Date.now()

    function spherePos(p: Particle, radius: number, rot: number, cx: number, cy: number) {
      const x3d = radius * Math.sin(p.sphereLat) * Math.cos(p.sphereLon + rot)
      const z3d = radius * Math.sin(p.sphereLat) * Math.sin(p.sphereLon + rot)
      const y3d = radius * Math.cos(p.sphereLat)
      const scale = 1 + z3d / (radius * 3)
      return { x: cx + x3d * scale, y: cy + y3d * scale, z: z3d, scale }
    }

    function drawResult(w: number, h: number) {
      resultOpacity.current = Math.min(resultOpacity.current + 0.04, 1)
      const alpha = resultOpacity.current
      const cx = w / 2
      const cy = h / 2

      if (status === 'success') {
        // Green checkmark
        ctx!.strokeStyle = `rgba(0, 240, 170, ${alpha})`
        ctx!.lineWidth = 3
        ctx!.lineCap = 'round'
        ctx!.beginPath()
        ctx!.moveTo(cx - 16, cy - 2)
        ctx!.lineTo(cx - 4, cy + 10)
        ctx!.lineTo(cx + 18, cy - 12)
        ctx!.stroke()

        ctx!.fillStyle = `rgba(0, 240, 170, ${alpha * 0.9})`
        ctx!.font = "600 14px 'Space Grotesk', sans-serif"
        ctx!.textAlign = 'center'
        ctx!.fillText('Message received', cx, cy + 36)
      } else if (status === 'error') {
        // Red X
        ctx!.strokeStyle = `rgba(255, 68, 68, ${alpha})`
        ctx!.lineWidth = 3
        ctx!.lineCap = 'round'
        ctx!.beginPath()
        ctx!.moveTo(cx - 12, cy - 14)
        ctx!.lineTo(cx + 12, cy + 10)
        ctx!.moveTo(cx + 12, cy - 14)
        ctx!.lineTo(cx - 12, cy + 10)
        ctx!.stroke()

        ctx!.fillStyle = `rgba(255, 68, 68, ${alpha * 0.9})`
        ctx!.font = "600 14px 'Space Grotesk', sans-serif"
        ctx!.textAlign = 'center'
        ctx!.fillText('Something went wrong', cx, cy + 36)
      }
    }

    function frame() {
      const w = canvas!.width
      const h = canvas!.height
      const elapsed = Date.now() - startTime
      const cx = w / 2
      const cy = h / 2
      const radius = Math.min(w, h) * 0.12

      ctx!.fillStyle = 'rgba(10, 10, 10, 0.95)'
      ctx!.fillRect(0, 0, w, h)

      if (status === 'loading') {
        resultOpacity.current = 0
        const convergeT = Math.min(elapsed / 1200, 1)
        const ease = convergeT * convergeT * (3 - 2 * convergeT)
        rotation += 0.012

        const sorted = particles
          .map((p) => {
            const target = spherePos(p, radius, rotation, cx, cy)
            p.x += (target.x - p.x) * ease * 0.1
            p.y += (target.y - p.y) * ease * 0.1
            if (convergeT < 1) p.y += p.speed * (1 - ease)
            return { p, ...target }
          })
          .sort((a, b) => a.z - b.z)

        for (const { p, z, scale } of sorted) {
          const depthOpacity = 0.2 + 0.8 * ((z + radius) / (2 * radius))
          const dotSize = (p.size * 0.6 + 0.5) * scale
          ctx!.fillStyle = `${p.color} ${depthOpacity * ease + p.opacity * (1 - ease)})`
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, Math.max(dotSize, 0.5), 0, Math.PI * 2)
          ctx!.fill()
        }
      } else {
        // Disperse particles outward
        for (const p of particles) {
          p.x += (Math.random() - 0.5) * 2
          p.y += p.speed * 0.5
          p.opacity *= 0.97
          ctx!.fillStyle = `${p.color} ${p.opacity})`
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
          ctx!.fill()
        }
        drawResult(w, h)
      }

      animId = requestAnimationFrame(frame)
    }

    animId = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(animId)
  }, [status, visible])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 16,
        overflow: 'hidden',
        zIndex: 10,
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        animation: fading ? undefined : 'fu 0.3s ease',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
