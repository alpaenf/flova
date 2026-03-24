'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function SplashScreen() {
  const [phase, setPhase] = useState<'visible' | 'fadeout' | 'done'>('visible')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress bar
    const startTime = Date.now()
    const duration = 1800 // ms

    const tick = () => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / duration) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        requestAnimationFrame(tick)
      }
    }
    requestAnimationFrame(tick)

    // Start fade-out after duration
    const fadeTimer = setTimeout(() => setPhase('fadeout'), duration + 100)
    // Remove from DOM after fade completes
    const doneTimer = setTimeout(() => setPhase('done'), duration + 700)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className="splash-root"
      style={{
        opacity: phase === 'fadeout' ? 0 : 1,
        transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Background blobs */}
      <div className="splash-blob splash-blob-1" />
      <div className="splash-blob splash-blob-2" />

      {/* Center content */}
      <div className="splash-center">
        {/* Pulsing ring */}
        <div className="splash-ring" />
        <div className="splash-ring splash-ring-2" />

        {/* Logo box */}
        <div className="splash-logo-box">
          <Image
            src="/logo.png"
            alt="FLOVA"
            width={160}
            height={52}
            className="splash-logo"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="splash-tagline">Service Bottleneck Detection</p>

        {/* Progress bar */}
        <div className="splash-bar-wrap">
          <div
            className="splash-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
