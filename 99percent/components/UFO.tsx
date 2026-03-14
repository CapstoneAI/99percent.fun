'use client'
import { useEffect, useRef } from 'react'

export default function UFO() {
  const ufoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ufo = ufoRef.current
    if (!ufo) return

    let angle = 0
    let frame: number

    const animate = () => {
      angle += 0.003
      const radiusX = window.innerWidth * 0.42
      const radiusY = window.innerHeight * 0.28
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      const x = centerX + radiusX * Math.cos(angle)
      const y = centerY + radiusY * Math.sin(angle)

      // prospettiva: scala in base alla posizione verticale
      const scale = 0.5 + 0.5 * ((Math.sin(angle) + 1) / 2)
      const opacity = 0.4 + 0.5 * ((Math.sin(angle) + 1) / 2)

      ufo.style.left = x + 'px'
      ufo.style.top = y + 'px'
      ufo.style.transform = `translate(-50%, -50%) scale(${scale})`
      ufo.style.opacity = String(opacity)
      ufo.style.zIndex = Math.sin(angle) > 0 ? '1' : '-1'

      frame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div ref={ufoRef} style={{
      position: 'fixed',
      pointerEvents: 'none',
      width: 64,
      height: 28,
    }}>
      {/* corpo UFO SVG */}
      <svg width="64" height="28" viewBox="0 0 64 28" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ufoBody" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#aad4f5"/>
            <stop offset="60%" stopColor="#4a90c4"/>
            <stop offset="100%" stopColor="#1a3a5c"/>
          </radialGradient>
          <radialGradient id="ufoGlow" cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor="#29d4f5" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#29d4f5" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {/* glow sotto */}
        <ellipse cx="32" cy="24" rx="24" ry="6" fill="url(#ufoGlow)"/>
        {/* corpo principale */}
        <ellipse cx="32" cy="16" rx="30" ry="8" fill="url(#ufoBody)"/>
        {/* cupola */}
        <ellipse cx="32" cy="14" rx="14" ry="8" fill="#c8e8f8" opacity="0.9"/>
        <ellipse cx="32" cy="13" rx="10" ry="5" fill="#e8f6ff" opacity="0.6"/>
        {/* luci lampeggianti */}
        <circle cx="12" cy="17" r="2" fill="#29d4f5" opacity="0.9"/>
        <circle cx="32" cy="20" r="2" fill="#7f77dd" opacity="0.9"/>
        <circle cx="52" cy="17" r="2" fill="#29d4f5" opacity="0.9"/>
        <circle cx="22" cy="19" r="1.5" fill="#ffffff" opacity="0.7"/>
        <circle cx="42" cy="19" r="1.5" fill="#ffffff" opacity="0.7"/>
      </svg>
    </div>
  )
}
