'use client'

import React from 'react'
import { CheckIcon, GlobeIcon } from 'lucide-react'
import { materials } from '../data/materials'
import { brand } from '../data/content'
import { CardSide } from './CardSide'
import { SectionHeading } from './SectionHeading'
import type { CardConfigApi } from '../hooks/useCardConfig'

interface CustomizerProps {
  api: CardConfigApi
}

const inputClass =
  'focus-ring mt-2 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-white placeholder-white/30 transition-colors duration-150 ease-smooth hover:border-white/20 focus:border-gold-500'

export function Customizer({ api }: CustomizerProps) {
  const { config, setBusiness, setTagline, setName, setTitle, setSlug, setMaterial } = api

  return (
    <section
      id="customize"
      aria-labelledby="customize-title"
      className="relative overflow-hidden border-t border-white/[0.07] bg-ink-900/40 py-20 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gold-500/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          id="customize-title"
          align="center"
          title="Design it now. See it instantly."
          lead="Type your details, pick your finish, and watch the card update live. What you build here is exactly what we print and ship."
        />

        <div className="mt-14 grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="order-1 space-y-8 lg:order-none">
            <figure>
              <CardSide config={config} side="front" className="w-full max-w-[460px]" />
              <figcaption className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/35">
                Front
                <span aria-hidden className="h-px flex-1 bg-white/[0.08]" />
              </figcaption>
            </figure>
            <figure>
              <CardSide config={config} side="back" className="w-full max-w-[460px]" />
              <figcaption className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/35">
                Back — dynamic QR & contacts
                <span aria-hidden className="h-px flex-1 bg-white/[0.08]" />
              </figcaption>
            </figure>
          </div>

          <form
            className="order-2 space-y-6 rounded-2xl border border-white/[0.07] bg-ink-950/70 p-6 sm:p-8 lg:order-none"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="card-business" className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                  Brand wordmark <span className="normal-case tracking-normal text-white/25">(front)</span>
                </label>
                <input
                  id="card-business"
                  type="text"
                  value={config.business}
                  onChange={(e) => setBusiness(e.target.value)}
                  placeholder="SERANEX"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="card-tagline" className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                  Tagline <span className="normal-case tracking-normal text-white/25">(front)</span>
                </label>
                <input
                  id="card-tagline"
                  type="text"
                  value={config.tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Web & Software Solutions"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="card-name" className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                  Full name <span className="normal-case tracking-normal text-white/25">(back)</span>
                </label>
                <input
                  id="card-name"
                  type="text"
                  value={config.name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Chithila Manul"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="card-title" className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                  Designation <span className="normal-case tracking-normal text-white/25">(back)</span>
                </label>
                <input
                  id="card-title"
                  type="text"
                  value={config.title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Founder & CEO"
                  className={inputClass}
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">Material</legend>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {materials.map((m) => {
                  const active = m.id === config.materialId
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMaterial(m.id)}
                      aria-pressed={active}
                      className={`focus-ring flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-[border-color,background-color,transform] duration-150 ease-smooth active:scale-[0.98] ${
                        active
                          ? 'border-gold-500 bg-gold-500/[0.08]'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                      }`}
                    >
                      <span
                        aria-hidden
                        className="h-7 w-7 shrink-0 rounded-full ring-1 ring-white/15"
                        style={m.swatch}
                      />
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-white/80">{m.name}</span>
                      {active ? <CheckIcon className="h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden /> : null}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="card-slug" className="text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                Your sub-page address
              </label>
              <div className="mt-2 flex items-stretch overflow-hidden rounded-xl border border-white/10 bg-ink-900 transition-colors duration-150 ease-smooth focus-within:border-gold-500">
                <input
                  id="card-slug"
                  type="text"
                  value={config.slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="yourname"
                  aria-describedby="slug-hint"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                />
                <span className="flex items-center gap-1.5 border-l border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-gold-400">
                  <GlobeIcon className="h-3.5 w-3.5" aria-hidden />.{brand.domain}
                </span>
              </div>
              <p id="slug-hint" className="mt-2 font-mono text-xs text-white/40">
                {config.slug || 'yourname'}.{brand.domain} — live the day your card arrives.
              </p>
            </div>

            <a
              href="#pricing"
              className="focus-ring inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink-950 transition-[transform,background-color] duration-150 ease-smooth hover:bg-gold-400 active:scale-[0.98]"
            >
              Continue to order
            </a>
          </form>
        </div>
      </div>
    </section>
  )
}
