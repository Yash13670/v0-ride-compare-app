"use client"

import { useEffect, useRef } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const layerRefs = useRef<HTMLDivElement[]>([])
  const rafRef = useRef<number | null>(null)
  const motionRef = useRef({ x: 0, y: 0 })

  // Default image layers (replace these with real photos in `public/backgrounds`)
  const imageLayers = [
    "/backgrounds/bg1.svg",
    "/backgrounds/bg2.svg",
    "/backgrounds/bg3.svg",
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const particles: { x: number; y: number; r: number; vx: number; vy: number; hue: number }[] = []
    const particleCount = Math.max(24, Math.floor((w * h) / 120000))

    function initParticles() {
      particles.length = 0
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: (i / particleCount) * w + (Math.random() - 0.5) * 200,
          y: Math.random() * h,
          r: 2 + Math.random() * 5,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          hue: 180 + Math.random() * 140,
        })
      }
    }

    initParticles()

    function frame() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx + (motionRef.current.x * 0.02)
        p.y += p.vy + (motionRef.current.y * 0.02)
        if (p.x < -80) p.x = w + 80
        if (p.x > w + 80) p.x = -80
        if (p.y < -80) p.y = h + 80
        if (p.y > h + 80) p.y = -80

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 10)
        grd.addColorStop(0, `hsla(${p.hue},70%,65%,0.10)`)
        grd.addColorStop(1, `hsla(${p.hue},70%,65%,0)`)
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 10, 0, Math.PI * 2)
        ctx.fill()
      }
      rafRef.current = requestAnimationFrame(frame)
    }

    frame()

    function onResize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      initParticles()
    }

    window.addEventListener("resize", onResize)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  // Motion / parallax handling
  useEffect(() => {
    let lastX = 0
    let lastY = 0

    function updateLayers() {
      // Smooth motion using a simple easing
      lastX += (motionRef.current.x - lastX) * 0.08
      lastY += (motionRef.current.y - lastY) * 0.08

      layerRefs.current.forEach((el, idx) => {
        if (!el) return
        const depth = (idx + 1) / Math.max(1, layerRefs.current.length)
        const tx = -lastX * 0.02 * (depth * 8)
        const ty = -lastY * 0.02 * (depth * 6)
        const rot = (lastX * 0.0008) * (depth * 6)
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${1 - depth * 0.02})`
      })

      requestAnimationFrame(updateLayers)
    }

    const handleMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      motionRef.current.x = (e.clientX - cx) / Math.max(1, cx)
      motionRef.current.y = (e.clientY - cy) / Math.max(1, cy)
    }

    const handleTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      motionRef.current.x = (t.clientX - cx) / Math.max(1, cx)
      motionRef.current.y = (t.clientY - cy) / Math.max(1, cy)
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      // gamma: left-right tilt [-90,90], beta: front-back tilt [-180,180]
      motionRef.current.x = (e.gamma ?? 0) / 90
      motionRef.current.y = (e.beta ?? 0) / 180
    }

    window.addEventListener("mousemove", handleMouse)
    window.addEventListener("touchmove", handleTouch, { passive: true })
    window.addEventListener("deviceorientation", handleOrientation)

    const raf = requestAnimationFrame(updateLayers)

    return () => {
      window.removeEventListener("mousemove", handleMouse)
      window.removeEventListener("touchmove", handleTouch)
      window.removeEventListener("deviceorientation", handleOrientation)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Canvas for subtle particle blobs */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Responsive photo layers: adjust order and images in `imageLayers` above */}
      <div className="absolute inset-0 -z-20">
        {imageLayers.map((src, idx) => (
          <div
            key={src}
            ref={(el) => {
              if (!el) return
              layerRefs.current[idx] = el
            }}
            className={`absolute pointer-events-none transition-transform duration-500 will-change-transform`} 
            style={{
              left: `${idx * 6}%`,
              top: `${idx * 4}%`,
              width: `calc(100% - ${idx * 12}%)`,
              height: `calc(100% - ${idx * 8}%)`,
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.55 - idx * 0.12,
              filter: "saturate(0.95) blur(6px)",
              transform: "translate3d(0,0,0)",
            }}
          />
        ))}
      </div>

      {/* Floating SVG blobs (kept) */}
      <svg className="absolute -left-36 -top-24 w-96 h-96 opacity-30 animate-float" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="blur1">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
        <g filter="url(#blur1)">
          <path d="M300 50C380 50 520 90 540 170C560 250 520 360 440 420C360 480 200 520 120 460C40 400 20 230 100 150C180 70 220 50 300 50Z" fill="rgba(99,102,241,0.12)" />
        </g>
      </svg>

      <svg className="absolute -right-28 bottom-10 w-80 h-80 opacity-25 animate-float" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animationDelay: "1s" }}>
        <defs>
          <filter id="blur2">
            <feGaussianBlur stdDeviation="36" />
          </filter>
        </defs>
        <g filter="url(#blur2)">
          <path d="M280 40C360 30 520 90 540 170C560 250 500 360 420 420C340 480 180 520 100 460C20 400 10 240 90 150C170 60 200 50 280 40Z" fill="rgba(16,185,129,0.08)" />
        </g>
      </svg>

      {/* Floating icons for vibe (kept) */}
      <div className="absolute left-1/4 top-40 opacity-80 animate-float" style={{ animationDelay: "0.6s" }}>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">🚗</div>
      </div>

      <div className="absolute right-1/4 top-60 opacity-80 animate-float" style={{ animationDelay: "1.2s" }}>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">🏍️</div>
      </div>
    </div>
  )
}
