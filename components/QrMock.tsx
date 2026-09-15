import React from 'react'

const SIZE = 25

function isFinder(r: number, c: number): boolean {
  const zones = [
    [0, 0],
    [0, SIZE - 7],
    [SIZE - 7, 0],
  ]
  return zones.some(([zr, zc]) => {
    const dr = r - zr!
    const dc = c - zc!
    if (dr < 0 || dc < 0 || dr > 6 || dc > 6) return false
    const ring = Math.max(Math.abs(dr - 3), Math.abs(dc - 3))
    return ring !== 2
  })
}

function inFinderBox(r: number, c: number): boolean {
  const zones = [
    [0, 0],
    [0, SIZE - 7],
    [SIZE - 7, 0],
  ]
  return zones.some(([zr, zc]) => r >= zr! && r <= zr! + 6 && c >= zc! && c <= zc! + 6)
}

function noise(r: number, c: number): boolean {
  const v = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453
  return v - Math.floor(v) > 0.47
}

const modules: { r: number; c: number }[] = []
for (let r = 0; r < SIZE; r++) {
  for (let c = 0; c < SIZE; c++) {
    if (inFinderBox(r, c)) {
      if (isFinder(r, c)) modules.push({ r, c })
    } else if (noise(r, c)) {
      modules.push({ r, c })
    }
  }
}

interface QrMockProps {
  color: string
  background: string
  className?: string
}

export function QrMock({ color, background, className }: QrMockProps) {
  return (
    <svg
      aria-hidden
      viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`}
      className={className}
      shapeRendering="crispEdges"
    >
      <rect x={-1} y={-1} width={SIZE + 2} height={SIZE + 2} fill={background} />
      {modules.map((m) => (
        <rect key={`${m.r}-${m.c}`} x={m.c} y={m.r} width={1} height={1} fill={color} />
      ))}
    </svg>
  )
}
