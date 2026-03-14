'use client'
import { useEffect, useRef } from 'react'

export default function Starfield() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ''

    const count = 120
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      const size = Math.random() * 2.5 + 0.5
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        --duration: ${Math.random() * 4 + 2}s;
        --drift: ${Math.random() * 10 + 6}s;
        --delay: -${Math.random() * 8}s;
        opacity: ${Math.random() * 0.6 + 0.1};
      `
      container.appendChild(star)
    }
  }, [])

  return <div ref={containerRef} className="stars-container" />
}
