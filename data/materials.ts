import type { CSSProperties } from 'react'
import type { MaterialId } from '../types/card'

export interface Material {
  id: MaterialId
  name: string
  price: number
  badge: string
  description: string
  category: 'epic' | 'premium' | 'luxury'
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
  // ─── EPIC RANGE ───
  {
    id: 'epic_black',
    name: 'Epic Matte Black',
    price: 2500,
    badge: 'Epic Minimalist',
    description: 'Stealth black matte composite with bold high-contrast laser-printed white typography.',
    category: 'epic',
    face: {
      backgroundColor: '#090a0d',
      backgroundImage: 'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 75%)',
    },
    ink: '#ffffff',
    inkMuted: 'rgba(255,255,255,0.72)',
    backFace: {
      backgroundColor: '#090a0d',
      backgroundImage: 'radial-gradient(ellipse at 50% 75%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 75%)',
    },
    backInk: '#ffffff',
    backInkMuted: 'rgba(255,255,255,0.72)',
    edge: 'rgba(255,255,255,0.14)',
    glare: 0.22,
    swatch: { backgroundColor: '#090a0d', border: '1px solid #27272a' },
  },
  {
    id: 'epic_white',
    name: 'Epic Matte White',
    price: 2500,
    badge: 'Epic Minimalist',
    description: 'Pure Arctic white matte composite with razor-sharp black typography and IP68 waterproofing.',
    category: 'epic',
    face: {
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%)',
    },
    ink: '#09090b',
    inkMuted: 'rgba(9,9,11,0.65)',
    backFace: {
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(ellipse at 50% 80%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%)',
    },
    backInk: '#09090b',
    backInkMuted: 'rgba(9,9,11,0.65)',
    edge: 'rgba(0,0,0,0.15)',
    glare: 0.16,
    swatch: { backgroundColor: '#ffffff', border: '1px solid #cbd5e1' },
  },
  {
    id: 'metal_black',
    name: 'Metal Epic Black',
    price: 8500,
    badge: 'Solid Metal 22g',
    description: 'Heavy surgical-grade stainless steel with anodized stealth black finish & precision laser etch.',
    category: 'epic',
    face: {
      backgroundColor: '#0f1013',
      backgroundImage: 'linear-gradient(135deg, #18191d 0%, #0c0d0f 50%, #1e1f24 100%)',
    },
    ink: '#f1f5f9',
    inkMuted: 'rgba(241,245,249,0.7)',
    backFace: {
      backgroundColor: '#0f1013',
      backgroundImage: 'linear-gradient(135deg, #18191d 0%, #0c0d0f 50%, #1e1f24 100%)',
    },
    backInk: '#f1f5f9',
    backInkMuted: 'rgba(241,245,249,0.7)',
    edge: 'rgba(255,255,255,0.28)',
    glare: 0.35,
    swatch: { background: 'linear-gradient(135deg, #27272a, #09090b)', border: '1px solid #52525b' },
  },
  {
    id: 'metal_silver',
    name: 'Metal Epic Silver',
    price: 8500,
    badge: 'Brushed Steel 22g',
    description: 'Solid 304 surgical stainless steel with directional brush grain and deep laser-cut branding.',
    category: 'epic',
    face: {
      backgroundColor: '#e2e8f0',
      backgroundImage: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 25%, #f8fafc 50%, #94a3b8 75%, #e2e8f0 100%)',
    },
    ink: '#0f172a',
    inkMuted: 'rgba(15,23,42,0.75)',
    backFace: {
      backgroundColor: '#e2e8f0',
      backgroundImage: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 25%, #f8fafc 50%, #94a3b8 75%, #e2e8f0 100%)',
    },
    backInk: '#0f172a',
    backInkMuted: 'rgba(15,23,42,0.75)',
    edge: 'rgba(255,255,255,0.45)',
    glare: 0.42,
    swatch: { background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)', border: '1px solid #cbd5e1' },
  },

  // ─── PREMIUM RANGE ───
  {
    id: 'matte',
    name: 'Premium Matte Black',
    price: 3500,
    badge: 'Best Seller',
    description: 'Matte black PVC card with your official company logo, contact info, and dynamic QR.',
    category: 'premium',
    face: {
      backgroundColor: '#090a0d',
      backgroundImage: 'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 75%)',
    },
    ink: '#ffffff',
    inkMuted: 'rgba(255,255,255,0.72)',
    backFace: {
      backgroundColor: '#090a0d',
      backgroundImage: 'radial-gradient(ellipse at 50% 75%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 75%)',
    },
    backInk: '#ffffff',
    backInkMuted: 'rgba(255,255,255,0.72)',
    edge: 'rgba(255,255,255,0.14)',
    glare: 0.22,
    swatch: { backgroundColor: '#090a0d', border: '1px solid #27272a' },
  },
  {
    id: 'premium_white',
    name: 'Premium Matte White',
    price: 3500,
    badge: 'Corporate Clean',
    description: 'Clean Arctic white card featuring your full-size black company logo and digital credentials.',
    category: 'premium',
    face: {
      backgroundColor: '#ffffff',
      backgroundImage: 'radial-gradient(ellipse at 50% 25%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%)',
    },
    ink: '#09090b',
    inkMuted: 'rgba(9,9,11,0.68)',
    backFace: {
      backgroundColor: '#ffffff',
      backgroundImage: 'radial-gradient(ellipse at 50% 75%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%)',
    },
    backInk: '#09090b',
    backInkMuted: 'rgba(9,9,11,0.68)',
    edge: 'rgba(0,0,0,0.14)',
    glare: 0.16,
    swatch: { backgroundColor: '#ffffff', border: '1px solid #cbd5e1' },
  },

  // ─── LUXURY CUSTOM RANGE ───
  {
    id: 'custom',
    name: 'Color Custom UV Pro',
    price: 4500,
    badge: 'Full Color UV',
    description: 'Full-bleed custom background artwork and embossed color logos on both front & back.',
    category: 'luxury',
    face: {
      backgroundColor: '#0d0614',
      backgroundImage: 'linear-gradient(135deg, #1e102d 0%, #0d0614 50%, #2a113e 100%)',
    },
    ink: '#c084fc',
    inkMuted: 'rgba(255,255,255,0.85)',
    backFace: {
      backgroundColor: '#0d0614',
      backgroundImage: 'linear-gradient(135deg, #1e102d 0%, #0d0614 50%, #2a113e 100%)',
    },
    backInk: '#ffffff',
    backInkMuted: 'rgba(192,132,252,0.75)',
    edge: 'rgba(168,85,247,0.35)',
    glare: 0.28,
    swatch: { background: 'linear-gradient(135deg, #a855f7, #ec4899)', border: '1px solid #c084fc' },
  },
  {
    id: 'gold',
    name: '24K Mirror Gold Metal',
    price: 12500,
    badge: 'VIP 24K Gold',
    description: 'Heavy 25g electroplated 24K mirror gold metal card with diamond-precision laser engraving.',
    category: 'luxury',
    face: {
      backgroundColor: '#ca8a04',
      backgroundImage: 'linear-gradient(135deg, #fef08a 0%, #eab308 30%, #ca8a04 60%, #fef08a 85%, #a16207 100%)',
    },
    ink: '#1c1917',
    inkMuted: 'rgba(28,25,23,0.75)',
    backFace: {
      backgroundColor: '#ca8a04',
      backgroundImage: 'linear-gradient(135deg, #fef08a 0%, #eab308 30%, #ca8a04 60%, #fef08a 85%, #a16207 100%)',
    },
    backInk: '#1c1917',
    backInkMuted: 'rgba(28,25,23,0.75)',
    edge: 'rgba(234,179,8,0.5)',
    glare: 0.45,
    swatch: { background: 'linear-gradient(135deg, #fef08a, #ca8a04)', border: '1px solid #eab308' },
  },
]

export function getMaterial(id: MaterialId): Material {
  // Alias mappings
  if (id === 'color_custom') return materials.find((m) => m.id === 'custom') || materials[0];
  if (id === 'metal_gold') return materials.find((m) => m.id === 'gold') || materials[0];
  if (id === 'silver') return materials.find((m) => m.id === 'metal_silver') || materials[0];
  if (id === 'premium_black') return materials.find((m) => m.id === 'matte') || materials[0];
  return materials.find((m) => m.id === id) ?? materials[0]
}
