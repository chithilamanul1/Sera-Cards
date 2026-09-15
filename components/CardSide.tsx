'use client'

import React, { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { getMaterial } from '../data/materials'
import { CardFaceContent } from './CardFaceContent'
import type { CardConfig } from '../types/card'

interface CardSideProps {
  config: CardConfig
  side: 'front' | 'back'
  className?: string
}

const SPRING = { stiffness: 260, damping: 26, mass: 0.6 }

export function CardSide({ config, side, className = '' }: CardSideProps) {
  const material = getMaterial(config.materialId)
  const reduce = useReducedMotion()
  const frame = useRef<HTMLDivElement>(null)

  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), SPRING)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), SPRING)
  const glareX = useSpring(useTransform(px, [-0.5, 0.5], [18, 82]), SPRING)
  const glareY = useSpring(useTransform(py, [-0.5, 0.5], [12, 88]), SPRING)
  const strength = side === 'front' ? material.glare : 0.28
  const glare = useMotionTemplate`radial-gradient(60% 80% at ${glareX}% ${glareY}%, rgba(255,255,255,${strength}) 0%, rgba(255,255,255,0) 70%)`

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
    <div
      ref={frame}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`[perspective:1400px] ${className}`}
    >
      <motion.div
        style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY }}
        className="relative aspect-[1.586/1] w-full overflow-hidden rounded-[20px] shadow-[0_30px_70px_-28px_rgba(0,0,0,0.9)]"
      >
        <CardFaceContent config={config} side={side} glare={glare} />
      </motion.div>
    </div>
  )
}
