import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  opacity: number
}

interface ParticlesBackgroundProps {
  density?: number
  color?: string
  className?: string
}

export function ParticlesBackground({ 
  density = 50, 
  color = '#FFD700', 
  className = '' 
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationId = useRef<number>(0)
  const particles = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const initParticles = () => {
      particles.current = []
      for (let i = 0; i < density; i++) {
        particles.current.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 100,
          maxLife: 100 + Math.random() * 100,
          size: Math.random() * 2 + 1,
          color: color,
          opacity: Math.random() * 0.5 + 0.2
        })
      }
    }

    initParticles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      particles.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.offsetWidth) {
          particle.vx *= -1
        }
        if (particle.y < 0 || particle.y > canvas.offsetHeight) {
          particle.vy *= -1
        }

        // Reset particle when it dies
        if (particle.life > particle.maxLife) {
          particle.x = Math.random() * canvas.offsetWidth
          particle.y = Math.random() * canvas.offsetHeight
          particle.life = 0
          particle.opacity = Math.random() * 0.5 + 0.2
        }

        // Draw particle
        const alpha = particle.opacity * (1 - particle.life / particle.maxLife)
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${particle.color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
        ctx.fill()

        // Draw connections to nearby particles
        particles.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const connectionAlpha = (1 - distance / 100) * alpha * 0.3
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `${particle.color}${Math.round(connectionAlpha * 255).toString(16).padStart(2, '0')}`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [density, color])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}