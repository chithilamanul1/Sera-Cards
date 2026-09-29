import React from 'react'


interface CardFacetsProps {
  tone: 'dark' | 'light'
}

export function CardFacets({ tone }: CardFacetsProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
      style={{
        backgroundImage:
          tone === 'dark'
            ? 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 80%, rgba(255,255,255,0.06) 0%, transparent 70%)',
      }}
    />
  )
}
