'use client'

import React from 'react'
import { MailIcon, MapPinIcon } from 'lucide-react'
import { brand } from '../data/content'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] py-12">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold tracking-tightest text-white">SERA</span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-accent-400">Cards</span>
          </div>
          <p className="mt-2 text-sm text-white/40">
            NFC smart business cards by Serenex · {brand.domain}
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/45">
          <li className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-white/30" aria-hidden />
            Colombo, Sri Lanka
          </li>
          <li className="flex items-center gap-2">
            <MailIcon className="h-4 w-4 text-white/30" aria-hidden />
            <a href={`mailto:hello@${brand.domain}`} className="focus-ring rounded-sm hover:text-white">
              hello@{brand.domain}
            </a>
          </li>
          <li>
            <a href="#faq" className="focus-ring rounded-sm hover:text-white">
              FAQ
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
