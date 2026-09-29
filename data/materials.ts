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
    face: {
      backgroundColor: '#090a0d',
      backgroundImage: 'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 75%)',
    },
    ink: '#ffffff',
    inkMuted: 'rgba(255,255,255,0.72)',
    backFace: {
      backgroundColor: '#090a0d',
      backgroundImage: 'radial-gradient(ellipse at 50% 75%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 75%)',
    },
    backInk: '#ffffff',
    backInkMuted: 'rgba(255,255,255,0.72)',
    edge: 'rgba(255,255,255,0.12)',
    glare: 0.22,
    swatch: { backgroundColor: '#090a0d' },
  },
  {
    id: 'custom',
    name: 'Full Custom Print PVC',
    price: 5000,
    badge: 'Enterprise & Pro',
    description: 'Custom printed with your own company logo, custom branding & colors on both sides.',
    face: {
      backgroundColor: '#060d0a',
      backgroundImage: 'radial-gradient(ellipse at 50% 25%, rgba(16,185,129,0.09) 0%, rgba(0,0,0,0) 75%)',
    },
    ink: '#10b981',
    inkMuted: 'rgba(255,255,255,0.85)',
    backFace: {
      backgroundColor: '#060d0a',
      backgroundImage: 'radial-gradient(ellipse at 50% 75%, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 75%)',
    },
    backInk: '#ffffff',
    backInkMuted: 'rgba(16,185,129,0.75)',
    edge: 'rgba(16,185,129,0.3)',
    glare: 0.28,
    swatch: { backgroundColor: '#10b981' },
  },
]

export function getMaterial(id: MaterialId): Material {
  return materials.find((m) => m.id === id) ?? materials[0]
}
