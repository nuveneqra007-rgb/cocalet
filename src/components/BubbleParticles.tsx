import { useEffect, useRef } from 'react'

interface Bubble {
  x: number
  y: number
  r: number
  speedY: number
  speedX: number
  opacity: number
  wobble: number
  wobbleSpeed: number
}

export default function BubbleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const bubbles: Bubble[] = []
    const maxBubbles = 60

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const createBubble = () => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        r: Math.random() * 4 + 1,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
      }
    }

    for (let i = 0; i < maxBubbles; i++) {
      const b = createBubble()
      b.y = Math.random() * canvas.height
      bubbles.push(b)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach((b) => {
        b.wobble += b.wobbleSpeed
        b.x += b.speedX + Math.sin(b.wobble) * 0.3
        b.y -= b.speedY

        if (b.y < -10) {
          b.y = canvas.height + 10
          b.x = Math.random() * canvas.width
        }

        const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        gradient.addColorStop(0, `rgba(255, 42, 59, ${b.opacity})`)
        gradient.addColorStop(0.5, `rgba(230, 29, 43, ${b.opacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(230, 29, 43, 0)')

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Highlight
        ctx.beginPath()
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.8})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
