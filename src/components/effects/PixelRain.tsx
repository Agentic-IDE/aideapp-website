import { useEffect, useRef } from 'react'
import { PARTICLE_COLORS } from '../../constants/theme'
import type { RainDrop } from '../../types'

const SLANT_ANGLE = 15 * (Math.PI / 180)
const SLANT_DX = Math.tan(SLANT_ANGLE)

function createDrop(width: number, height: number, randomY = false): RainDrop {
  return {
    x: Math.random() * (width + height * SLANT_DX) - height * SLANT_DX,
    y: randomY ? Math.random() * height : -Math.random() * 20,
    size: 1.5 + Math.random() * 1.5,
    speed: 0.4 + Math.random() * 1.8,
    opacity: 0.08 + Math.random() * 0.3,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  }
}

interface PixelRainProps {
  initialDrops?: RainDrop[]
}

export function PixelRain({ initialDrops }: PixelRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let drops: RainDrop[] = []

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }

    function init() {
      resize()
      if (initialDrops && initialDrops.length > 0) {
        const count = Math.min(initialDrops.length, 50)
        drops = initialDrops.slice(0, count).map((d) => ({ ...d }))
      } else {
        const count = 30 + Math.floor(Math.random() * 20)
        drops = Array.from({ length: count }, () =>
          createDrop(canvas!.width, canvas!.height, true),
        )
      }
    }

    function frame() {
      const w = canvas!.width
      const h = canvas!.height

      // Fade trail with site bg color
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx!.fillRect(0, 0, w, h)

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]
        ctx!.fillStyle = `${d.color} ${d.opacity})`
        const drawX = d.x + d.y * SLANT_DX
        ctx!.fillRect(drawX, d.y, d.size, d.size)
        d.y += d.speed
        if (d.y > h) {
          drops[i] = createDrop(w, h)
        }
      }

      animId = requestAnimationFrame(frame)
    }

    init()
    animId = requestAnimationFrame(frame)

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [initialDrops])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
