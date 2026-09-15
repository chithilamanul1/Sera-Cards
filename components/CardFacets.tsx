import React from 'react'

/**
 * Low-poly faceted texture. Pure SVG — no client hooks needed.
 */
const W = 300
const H = 190
const COLS = 6
const ROWS = 4

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

interface Facet {
  points: string
  weight: number
}

const grid: { x: number; y: number }[][] = Array.from({ length: ROWS + 1 }, (_, r) =>
  Array.from({ length: COLS + 1 }, (_, c) => {
    const edge = r === 0 || c === 0 || r === ROWS || c === COLS
    const jitterX = edge ? 0 : (pseudoRandom(r * 31 + c) - 0.5) * (W / COLS) * 0.7
    const jitterY = edge ? 0 : (pseudoRandom(r * 57 + c * 13) - 0.5) * (H / ROWS) * 0.7
    return {
      x: (c * W) / COLS + jitterX,
      y: (r * H) / ROWS + jitterY,
    }
  }),
)

const facets: Facet[] = []
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const a = grid[r][c]
    const b = grid[r][c + 1]
    const d = grid[r + 1][c]
    const e = grid[r + 1][c + 1]
    const flip = pseudoRandom(r * 7 + c * 3) > 0.5
    const pair = flip
      ? [
          [a, b, d],
          [b, e, d],
        ]
      : [
          [a, b, e],
          [a, e, d],
        ]
    pair.forEach((tri, i) => {
      facets.push({
        points: tri.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
        weight: pseudoRandom(r * 19 + c * 11 + i * 5),
      })
    })
  }
}

interface CardFacetsProps {
  tone: 'dark' | 'light'
}

export function CardFacets({ tone }: CardFacetsProps) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {facets.map((facet, i) => {
        const lift = facet.weight > 0.5
        const amount = Math.abs(facet.weight - 0.5) * 2
        const fill =
          tone === 'dark'
            ? lift
              ? `rgba(255,255,255,${(amount * 0.1).toFixed(3)})`
              : `rgba(0,0,0,${(amount * 0.42).toFixed(3)})`
            : lift
              ? `rgba(255,255,255,${(amount * 0.85).toFixed(3)})`
              : `rgba(15,20,28,${(amount * 0.07).toFixed(3)})`
        return <polygon key={i} points={facet.points} fill={fill} />
      })}
    </svg>
  )
}
