'use client'

import React from 'react'
import { MailIcon, MapPinIcon } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] py-12">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <a href="/" className="inline-block">
              <img src="/logo-white.png" alt="GoSera" className="h-9 sm:h-10 w-auto object-contain" />
            </a>
            <p className="mt-2 text-sm text-white/40 max-w-xs">
              The smart NFC business card and digital networking platform for Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">Product</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="/teams" className="hover:text-white transition-colors">For Teams</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">Plans</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                <li><a href="/pricing" className="hover:text-white transition-colors">GoSera Basic (Free)</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">GoSera Pro</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">GoSera Teams</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">Contact</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                <li className="flex items-center gap-2">
                  <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-white/30" />
                  Colombo, Sri Lanka
                </li>
                <li className="flex items-center gap-2">
                  <MailIcon className="h-3.5 w-3.5 shrink-0 text-white/30" />
                  <a href="mailto:hello@seranex.lk" className="hover:text-white transition-colors">hello@seranex.lk</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-8 sm:flex-row">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Seranex · GoSera. All rights reserved.</p>
          <p className="text-xs text-white/30">NFC smart networking platform · seranex.lk</p>
        </div>
      </div>
    </footer>
  )
}
