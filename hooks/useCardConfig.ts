'use client'

import { useCallback, useRef, useState } from 'react'
import type { CardConfig, MaterialId } from '../types/card'

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20)
}

const initial: CardConfig = {
  business: 'SERANEX',
  tagline: 'Web & Software Solutions',
  name: 'Chithila Manul',
  title: 'Founder & CEO',
  slug: 'chithila',
  materialId: 'matte',
}

export interface CardConfigApi {
  config: CardConfig
  setBusiness: (value: string) => void
  setTagline: (value: string) => void
  setName: (value: string) => void
  setTitle: (value: string) => void
  setSlug: (value: string) => void
  setMaterial: (id: MaterialId) => void
}

export function useCardConfig(): CardConfigApi {
  const [config, setConfig] = useState<CardConfig>(initial)
  const slugTouched = useRef(false)

  const setBusiness = useCallback((value: string) => {
    setConfig((prev) => ({ ...prev, business: value.slice(0, 14) }))
  }, [])

  const setTagline = useCallback((value: string) => {
    setConfig((prev) => ({ ...prev, tagline: value.slice(0, 34) }))
  }, [])

  const setName = useCallback((value: string) => {
    setConfig((prev) => ({
      ...prev,
      name: value.slice(0, 26),
      slug: slugTouched.current ? prev.slug : slugify(value.split(' ')[0] ?? ''),
    }))
  }, [])

  const setTitle = useCallback((value: string) => {
    setConfig((prev) => ({ ...prev, title: value.slice(0, 30) }))
  }, [])

  const setSlug = useCallback((value: string) => {
    slugTouched.current = true
    setConfig((prev) => ({ ...prev, slug: slugify(value) }))
  }, [])

  const setMaterial = useCallback((materialId: MaterialId) => {
    setConfig((prev) => ({ ...prev, materialId }))
  }, [])

  return { config, setBusiness, setTagline, setName, setTitle, setSlug, setMaterial }
}
