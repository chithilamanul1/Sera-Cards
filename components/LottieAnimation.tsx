'use client'

import React, { useEffect, useState } from 'react'

interface LottieAnimationProps {
  src?: string
  fallback?: React.ReactNode
  className?: string
  loop?: boolean
  autoplay?: boolean
}

export function LottieAnimation({
  src,
  fallback,
  className = 'h-48 w-48',
  loop = true,
  autoplay = true,
}: LottieAnimationProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    // Check if dotlottie-player is already defined
    if (customElements.get('dotlottie-player')) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs'
    script.type = 'module'
    script.onload = () => setScriptLoaded(true)
    document.head.appendChild(script)
  }, [])

  if (scriptLoaded && src) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* @ts-ignore - custom element */}
        <dotlottie-player
          src={src}
          background="transparent"
          speed="1"
          style={{ width: '100%', height: '100%' }}
          loop={loop}
          autoplay={autoplay}
        />
      </div>
    )
  }

  // Graceful SVG / React fallback
  return <div className={`relative flex items-center justify-center ${className}`}>{fallback}</div>
}
