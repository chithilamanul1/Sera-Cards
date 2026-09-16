'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRightIcon, MenuIcon, XIcon } from 'lucide-react'

const links = [
  { href: '#how', label: 'How it works' },
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
        {/* Logo */}
        <a href="#top" className="focus-ring flex items-center gap-2 rounded-sm">
          {/* NFC signal icon */}
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-gold-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
              <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
              <path d="M12.91 4.1a16.1 16.1 0 0 1 0 15.8" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">Sera.</span>
        </a>

        {/* Desktop nav */}
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
          <a
            href="#customize"
            className="focus-ring group inline-flex items-center gap-2 rounded-full border border-gold-500 px-5 py-2 text-sm font-medium text-gold-400 transition-all duration-150 ease-smooth hover:bg-gold-500 hover:text-ink-950"
          >
            Design yours
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
          </a>
        </nav>

        {/* Mobile toggle */}
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
            <a
              href="#customize"
              onClick={() => setOpen(false)}
              className="mt-2 mb-1 inline-flex items-center justify-center gap-2 rounded-full border border-gold-500 px-5 py-2.5 text-sm font-medium text-gold-400"
            >
              Design yours
              <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden />
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
