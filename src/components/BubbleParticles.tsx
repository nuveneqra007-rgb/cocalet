import { useEffect, useRef } from 'react'

/**
 * ====================================================
 * ADAPTIVE WEBGL PARTICLE SYSTEM — "Liquid Energy"
 * ====================================================
 * - Uses WebGL for GPU-accelerated rendering
 * - Adaptive particle count (drops if FPS < 50)
 * - Mouse interaction: repulsion + glow attraction
 * - Organic motion with wobble + inertia physics
 * - Zero React re-renders (100% ref-based)
 * - Automatically handles resize + DPI scaling
 */

// Vertex shader — positions particles as GL_POINTS with variable size
const VERT_SHADER = `
  attribute vec2 a_position;
  attribute float a_size;
  attribute float a_opacity;
  attribute float a_hue;
  varying float v_opacity;
  varying float v_hue;
  uniform vec2 u_resolution;

  void main() {
    // Convert pixel coords to clip space (-1 to 1)
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace.x, -clipSpace.y, 0.0, 1.0);
    gl_PointSize = a_size;
    v_opacity = a_opacity;
    v_hue = a_hue;
  }
`

// Fragment shader — renders each particle as a soft radial gradient with color
const FRAG_SHADER = `
  precision mediump float;
  varying float v_opacity;
  varying float v_hue;

  void main() {
    // Distance from center of point (0..1)
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    // Soft radial falloff
    float alpha = smoothstep(0.5, 0.0, dist) * v_opacity;
    
    // Color mixing: red-to-gold based on hue varying
    vec3 coreColor = mix(
      vec3(0.90, 0.11, 0.17),  // Coke red
      vec3(0.96, 0.69, 0.26),  // Gold
      v_hue
    );
    
    // Add a subtle white center highlight
    vec3 finalColor = mix(coreColor, vec3(1.0), smoothstep(0.15, 0.0, dist) * 0.4);

    gl_FragColor = vec4(finalColor, alpha);
  }
`

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseSize: number
  opacity: number
  baseOpacity: number
  hue: number       // 0 = red, 1 = gold
  wobblePhase: number
  wobbleSpeed: number
  speedY: number
  life: number
  maxLife: number
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  return program
}

export default function BubbleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Try WebGL, fall back to 2D canvas
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    })

    // If WebGL is not available, use canvas 2D fallback
    if (!gl) {
      return fallback2D(canvas, mouseRef)
    }

    // ========= WebGL Setup =========
    const vs = createShader(gl, gl.VERTEX_SHADER, VERT_SHADER)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG_SHADER)
    if (!vs || !fs) return

    const program = createProgram(gl, vs, fs)
    if (!program) return

    gl.useProgram(program)

    // Attribute locations
    const aPosition = gl.getAttribLocation(program, 'a_position')
    const aSize = gl.getAttribLocation(program, 'a_size')
    const aOpacity = gl.getAttribLocation(program, 'a_opacity')
    const aHue = gl.getAttribLocation(program, 'a_hue')
    const uResolution = gl.getUniformLocation(program, 'u_resolution')

    // Buffers
    const posBuffer = gl.createBuffer()
    const sizeBuffer = gl.createBuffer()
    const opacityBuffer = gl.createBuffer()
    const hueBuffer = gl.createBuffer()

    // ========= Adaptive Particle System =========
    const isMobile = window.innerWidth < 768
    const BASE_COUNT = isMobile ? 80 : 200
    let maxParticles = BASE_COUNT
    let particles: Particle[] = []

    const dpr = Math.min(window.devicePixelRatio, 2)

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()

    const createParticle = (randomY = false): Particle => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : h + Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0,
        size: Math.random() * 3 + 1.5,
        baseSize: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.35 + 0.1,
        baseOpacity: Math.random() * 0.35 + 0.1,
        hue: Math.random() * 0.3,  // mostly red, some gold
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.015 + 0.008,
        speedY: Math.random() * 1.2 + 0.3,
        life: 0,
        maxLife: 600 + Math.random() * 400,
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true))
    }

    // FPS monitoring for adaptive system
    let lastTime = performance.now()
    let frameCount = 0
    let currentFPS = 60
    const FPS_SAMPLE_RATE = 30

    // Mouse tracking (passive, no re-renders)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
    }
    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }
    // Touch support for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
        mouseRef.current.active = true
      }
    }
    const handleTouchEnd = () => {
      mouseRef.current.active = false
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('resize', resize, { passive: true })

    // ========= Animation Loop =========
    const posData = new Float32Array(maxParticles * 2)
    const sizeData = new Float32Array(maxParticles)
    const opacityData = new Float32Array(maxParticles)
    const hueData = new Float32Array(maxParticles)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE) // Additive blending for glow

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      // FPS measurement
      frameCount++
      const now = performance.now()
      if (frameCount >= FPS_SAMPLE_RATE) {
        currentFPS = (FPS_SAMPLE_RATE * 1000) / (now - lastTime)
        lastTime = now
        frameCount = 0

        // Adaptive: reduce particles if FPS drops
        if (currentFPS < 45 && maxParticles > 40) {
          maxParticles = Math.max(40, maxParticles - 20)
          particles = particles.slice(0, maxParticles)
        } else if (currentFPS > 55 && maxParticles < BASE_COUNT) {
          maxParticles = Math.min(BASE_COUNT, maxParticles + 10)
        }
      }

      const w = canvas.width / dpr
      const mouse = mouseRef.current

      // Update particles
      let activeCount = 0
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.life++

        // Wobble (organic sway)
        p.wobblePhase += p.wobbleSpeed
        p.vx += Math.sin(p.wobblePhase) * 0.02
        p.vy -= p.speedY * 0.016  // Rise up

        // Apply inertia / damping
        p.vx *= 0.98
        p.vy *= 0.99

        // Mouse interaction — repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const distSq = dx * dx + dy * dy
          const REPULSE_RADIUS = 120
          const REPULSE_SQ = REPULSE_RADIUS * REPULSE_RADIUS

          if (distSq < REPULSE_SQ && distSq > 1) {
            const dist = Math.sqrt(distSq)
            const force = (1 - dist / REPULSE_RADIUS) * 2.5
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
            // Brightens near mouse
            p.opacity = Math.min(0.8, p.baseOpacity + force * 0.15)
            p.size = p.baseSize + force * 1.5
          } else {
            p.opacity += (p.baseOpacity - p.opacity) * 0.05
            p.size += (p.baseSize - p.size) * 0.05
          }
        } else {
          p.opacity += (p.baseOpacity - p.opacity) * 0.03
          p.size += (p.baseSize - p.size) * 0.03
        }

        p.x += p.vx
        p.y += p.vy

        // Life-based fade
        const lifeFade = p.life > p.maxLife - 60
          ? 1 - (p.life - (p.maxLife - 60)) / 60
          : Math.min(1, p.life / 30)

        // Recycle if off-screen or expired
        if (p.y < -20 || p.x < -20 || p.x > w + 20 || p.life > p.maxLife) {
          particles[i] = createParticle(false)
          continue
        }

        // Write to typed arrays (in DPR-scaled coords)
        posData[activeCount * 2] = p.x * dpr
        posData[activeCount * 2 + 1] = p.y * dpr
        sizeData[activeCount] = p.size * dpr
        opacityData[activeCount] = p.opacity * lifeFade
        hueData[activeCount] = p.hue
        activeCount++
      }

      // Add new particles if under limit
      while (particles.length < maxParticles) {
        particles.push(createParticle(false))
      }

      // ====== Render ======
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(uResolution, canvas.width, canvas.height)

      // Upload position data
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, posData.subarray(0, activeCount * 2), gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(aPosition)
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

      // Upload size data
      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, sizeData.subarray(0, activeCount), gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(aSize)
      gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0)

      // Upload opacity data
      gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, opacityData.subarray(0, activeCount), gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(aOpacity)
      gl.vertexAttribPointer(aOpacity, 1, gl.FLOAT, false, 0, 0)

      // Upload hue data
      gl.bindBuffer(gl.ARRAY_BUFFER, hueBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, hueData.subarray(0, activeCount), gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(aHue)
      gl.vertexAttribPointer(aHue, 1, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.POINTS, 0, activeCount)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}

/**
 * Canvas 2D fallback for devices without WebGL
 */
function fallback2D(
  canvas: HTMLCanvasElement,
  mouseRef: React.RefObject<{ x: number; y: number; active: boolean }>
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let animId = 0
  const bubbles: { x: number; y: number; r: number; vy: number; vx: number; o: number; w: number; ws: number }[] = []
  const MAX = 60

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  for (let i = 0; i < MAX; i++) {
    bubbles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1,
      vy: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.35 + 0.1,
      w: Math.random() * Math.PI * 2,
      ws: Math.random() * 0.02 + 0.01,
    })
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const mouse = mouseRef.current

    for (const b of bubbles) {
      b.w += b.ws
      b.x += b.vx + Math.sin(b.w) * 0.3
      b.y -= b.vy

      // Mouse repulsion
      if (mouse && mouse.active) {
        const dx = b.x - mouse.x
        const dy = b.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100 && dist > 1) {
          const force = (1 - dist / 100) * 2
          b.x += (dx / dist) * force
          b.y += (dy / dist) * force
        }
      }

      if (b.y < -10) {
        b.y = canvas.height + 10
        b.x = Math.random() * canvas.width
      }

      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
      g.addColorStop(0, `rgba(255, 42, 59, ${b.o})`)
      g.addColorStop(0.5, `rgba(230, 29, 43, ${b.o * 0.5})`)
      g.addColorStop(1, 'rgba(230, 29, 43, 0)')
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    }
    animId = requestAnimationFrame(animate)
  }
  animate()

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  }
}
