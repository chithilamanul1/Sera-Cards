import type { CSSProperties } from 'react'
import type { MaterialId } from '../types/card'

export interface Material {
  id: MaterialId
  name: string
  price: number
  badge: string
  description: string
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

export const materials: Material[] = [
  {
    id: 'matte',
    name: 'Sera Signature PVC',
    price: 3500,
    badge: 'Popular Choice',
    description: 'Sleek Sera branded card design + 100% custom digital profile on tap.',
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
    id: 'custom',
    name: 'Full Custom Print PVC',
    price: 5000,
    badge: 'Enterprise & Pro',
    description: 'Custom printed with your own company logo, custom branding & colors on both sides.',
    face: { backgroundColor: '#0a1612' },
    ink: '#10b981',
    inkMuted: 'rgba(255,255,255,0.85)',
    backFace: { backgroundColor: '#0e1e19' },
    backInk: '#ffffff',
    backInkMuted: 'rgba(16,185,129,0.75)',
    edge: 'rgba(16,185,129,0.4)',
    glare: 0.35,
    swatch: { backgroundColor: '#10b981' },
  },
]

export function getMaterial(id: MaterialId): Material {
  return materials.find((m) => m.id === id) ?? materials[0]
}
