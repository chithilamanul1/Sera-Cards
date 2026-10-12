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

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">Product</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                <li><a href="/products" className="hover:text-white transition-colors">Official Card Range</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing &amp; Plans</a></li>
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
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">Legal &amp; Policy</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                <li><a href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/refund" className="hover:text-white transition-colors">Refund &amp; 1-Year Warranty</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">Contact</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                <li className="flex items-center gap-2">
                  <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-white/30" />
                  Seeduwa, Colombo, LK
                </li>
                <li className="flex items-center gap-2">
                  <MailIcon className="h-3.5 w-3.5 shrink-0 text-white/30" />
                  <a href="mailto:info@seranex.lk" className="hover:text-white transition-colors">info@seranex.lk</a>
                </li>
                <li>
                  <a
                    href="https://wa.me/94728382638"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors text-xs font-semibold"
                  >
                    WhatsApp: +94 72 838 2638
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-8 sm:flex-row text-xs text-white/40">
          <p>© {new Date().getFullYear()} Seranex · Sera Cards. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <span>·</span>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <span>·</span>
            <a href="/refund" className="hover:text-white transition-colors">Refund &amp; Warranty Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
