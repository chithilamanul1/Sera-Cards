'use client'

import React from 'react'
import { CheckIcon, XIcon } from 'lucide-react'
import { comparison } from '../data/content'
import { SectionHeading } from './SectionHeading'

export function Comparison() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="border-t border-white/[0.07] py-20 lg:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          id="compare-title"
          title="Traditional paper cards vs. Sera Cards."
          lead="A box of 500 printed cards is a fixed snapshot of one moment in your career. A Sera Card is one card, kept current for years."
        />

        <div className="mt-14 hidden overflow-hidden rounded-2xl border border-white/[0.07] md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Paper business cards compared with Sera Cards</caption>
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                <th scope="col" className="w-[22%] px-6 py-4 text-xs font-medium uppercase tracking-[0.16em] text-white/40">
                  Feature
                </th>
                <th scope="col" className="w-[39%] px-6 py-4 text-sm font-medium text-white/50">
                  Paper business card
                </th>
                <th scope="col" className="w-[39%] bg-gold-500/[0.05] px-6 py-4 text-sm font-semibold text-gold-400">
                  Sera Card
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-white/[0.05] last:border-0">
                  <th scope="row" className="px-6 py-6 align-top text-sm font-medium text-white">
                    {row.feature}
                  </th>
                  <td className="px-6 py-6 align-top text-sm leading-relaxed text-white/45">
                    <span className="flex gap-3">
                      <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-white/25" aria-hidden />
                      {row.paper}
                    </span>
                  </td>
                  <td className="bg-gold-500/[0.04] px-6 py-6 align-top text-sm leading-relaxed text-white/75">
                    <span className="flex gap-3">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                      {row.sera}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-12 space-y-4 md:hidden">
          {comparison.map((row) => (
            <li key={row.feature} className="rounded-2xl border border-white/[0.07] p-5">
              <p className="text-sm font-medium text-white">{row.feature}</p>
              <div className="mt-4 space-y-3">
                <p className="flex gap-3 text-sm leading-relaxed text-white/45">
                  <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-white/25" aria-hidden />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.14em] text-white/30">Paper</span>
                    {row.paper}
                  </span>
                </p>
                <p className="flex gap-3 rounded-xl bg-gold-500/[0.05] p-3 text-sm leading-relaxed text-white/75">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.14em] text-gold-400/70">Sera</span>
                    {row.sera}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
