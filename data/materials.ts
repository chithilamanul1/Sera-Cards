import type { CSSProperties } from 'react'
import type { MaterialId } from '../types/card'

export interface Material {
  id: MaterialId
  name: string
  face: CSSProperties
  ink: string
  inkMuted: string
  backFace: CSSProperties
  backInk: string
  backInkMuted: string
  edge: string
  glare: number
  swatch: CSSProperties
}

const brushed = (base: string, strength: number): CSSProperties => ({
  backgroundColor: base,
  backgroundImage: `repeating-linear-gradient(115deg, rgba(255,255,255,${strength}) 0px, rgba(255,255,255,${strength}) 1px, rgba(0,0,0,${strength * 0.6}) 2px, rgba(0,0,0,${strength * 0.6}) 3px)`,
})

export const materials: Material[] = [
  {
    id: 'matte',
    name: 'Matte Black',
    face: { backgroundColor: '#0d0d10' },
    ink: '#ffffff',
    inkMuted: 'rgba(255,255,255,0.72)',
    backFace: { backgroundColor: '#edeff1' },
    backInk: '#101114',
    backInkMuted: 'rgba(16,17,20,0.68)',
    edge: 'rgba(255,255,255,0.14)',
    glare: 0.16,
    swatch: { backgroundColor: '#0d0d10' },
  },
  {
    id: 'gold',
    name: 'Brushed Gold',
    face: brushed('#7d5f1d', 0.1),
    ink: '#fdf4dd',
    inkMuted: 'rgba(253,244,221,0.75)',
    backFace: { backgroundColor: '#f3e8ca' },
    backInk: '#2a1f05',
    backInkMuted: 'rgba(42,31,5,0.68)',
    edge: 'rgba(255,236,180,0.5)',
    glare: 0.4,
    swatch: brushed('#8d6c23', 0.18),
  },
  {
    id: 'silver',
    name: 'Cyber Silver',
    face: brushed('#6c737a', 0.12),
    ink: '#ffffff',
    inkMuted: 'rgba(255,255,255,0.75)',
    backFace: { backgroundColor: '#f2f4f6' },
    backInk: '#111316',
    backInkMuted: 'rgba(17,19,22,0.66)',
    edge: 'rgba(255,255,255,0.55)',
    glare: 0.45,
    swatch: brushed('#9aa1a8', 0.2),
  },
  {
    id: 'navy',
    name: 'Midnight Navy',
    face: { backgroundColor: '#101c31' },
    ink: '#f3f7ff',
    inkMuted: 'rgba(243,247,255,0.72)',
    backFace: { backgroundColor: '#e7edf8' },
    backInk: '#0c1524',
    backInkMuted: 'rgba(12,21,36,0.66)',
    edge: 'rgba(150,190,255,0.3)',
    glare: 0.22,
    swatch: { backgroundColor: '#101c31' },
  },
]

export function getMaterial(id: MaterialId): Material {
  return materials.find((m) => m.id === id) ?? materials[0]
}
