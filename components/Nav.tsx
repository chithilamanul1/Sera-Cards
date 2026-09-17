'use client'

import React, { useEffect, useState } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'

const links = [
  { href: '#how', label: 'How it works' },
  { href: '#customize', label: 'Customize' },
  { href: '#compare', label: 'Compare' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200 ease-smooth ${
        scrolled ? 'border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5 sm:px-8">
        <a href="#top" className="focus-ring flex items-baseline gap-2 rounded-sm">
          <span className="text-lg font-semibold tracking-tightest text-white">SERA</span>
          <span className="text-[11px] uppercase tracking-[0.28em] text-accent-400">Cards</span>
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focus-ring rounded-sm text-sm text-white/55 transition-colors duration-150 ease-smooth hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#pricing"
            className="focus-ring hidden rounded-full bg-accent-500 px-4 py-2 text-sm font-medium text-ink-950 transition-[transform,background-color] duration-150 ease-smooth hover:bg-accent-400 active:scale-[0.97] sm:inline-flex"
          >
            Order now
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="focus-ring rounded-full border border-white/10 p-2 text-white/70 transition-colors duration-150 ease-smooth hover:text-white lg:hidden"
          >
            {open ? <XIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/[0.07] bg-ink-950/95 backdrop-blur-xl lg:hidden">
          <nav aria-label="Sections" className="mx-auto flex max-w-content flex-col px-5 py-2 sm:px-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-sm border-b border-white/[0.05] py-3 text-sm text-white/70 last:border-0"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
