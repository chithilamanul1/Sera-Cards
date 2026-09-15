'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { RotateCcwIcon } from 'lucide-react'
import { getMaterial } from '../data/materials'
import { CardFaceContent } from './CardFaceContent'
import type { CardConfig } from '../types/card'

interface CardFlipProps {
  config: CardConfig
}

const SPRING = { stiffness: 260, damping: 26, mass: 0.6 }

export function CardFlip({ config }: CardFlipProps) {
  const material = getMaterial(config.materialId)
  const reduce = useReducedMotion()
  const [flipped, setFlipped] = useState(false)
  const frame = useRef<HTMLDivElement>(null)

  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), SPRING)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), SPRING)
  const glareX = useSpring(useTransform(px, [-0.5, 0.5], [18, 82]), SPRING)
  const glareY = useSpring(useTransform(py, [-0.5, 0.5], [12, 88]), SPRING)
  const frontGlare = useMotionTemplate`radial-gradient(60% 80% at ${glareX}% ${glareY}%, rgba(255,255,255,${material.glare}) 0%, rgba(255,255,255,0) 70%)`
  const backGlare = useMotionTemplate`radial-gradient(60% 80% at ${glareX}% ${glareY}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 70%)`

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return
    const rect = frame.current?.getBoundingClientRect()
    if (!rect) return
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <div className="flex flex-col items-center">
      <div
        ref={frame}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="w-full max-w-[460px] px-1 [perspective:1400px]"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="preserve-3d relative aspect-[1.586/1] w-full"
        >
          <motion.div
            className="preserve-3d absolute inset-0"
            style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY }}
          >
            <div className="backface-hidden absolute inset-0 overflow-hidden rounded-[20px] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.9)]">
              <CardFaceContent config={config} side="front" glare={frontGlare} />
            </div>
            <div className="backface-hidden absolute inset-0 overflow-hidden rounded-[20px] [transform:rotateY(180deg)]">
              <CardFaceContent config={config} side="back" glare={backGlare} />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-7 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/70 transition-colors duration-150 ease-smooth hover:border-white/20 hover:text-white"
        >
          <RotateCcwIcon className="h-3.5 w-3.5" aria-hidden />
          {flipped ? 'Show front' : 'Show back (QR & contacts)'}
        </button>
        <p className="hidden text-xs text-white/35 sm:block">Move your cursor over the card</p>
      </div>
    </div>
  )
}
