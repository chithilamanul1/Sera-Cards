'use client'

import React from 'react'
import { specs } from '../data/content'

export function TechSpecs() {
  return (
    <section aria-labelledby="specs-title" className="border-t border-white/[0.07] py-20 lg:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="specs-title" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Technical specifications.
          </h2>
          <p className="text-sm text-white/40">Tested to 100,000+ taps</p>
        </div>

        <dl className="mt-12 grid gap-10 border-t border-white/[0.07] pt-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {specs.map((spec) => (
            <div key={spec.label} className="flex flex-col">
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-accent-400">{spec.label}</dt>
              <dd className="mt-3 flex flex-1 flex-col">
                <span className="text-lg font-medium text-white">{spec.value}</span>
                <span className="mt-3 text-sm leading-relaxed text-white/50">{spec.body}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
