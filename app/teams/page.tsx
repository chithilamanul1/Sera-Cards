'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  UsersIcon,
  UserMinusIcon,
  BarChart3Icon,
  SparklesIcon,
  CheckIcon,
  SendIcon,
} from 'lucide-react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

const ease = [0.23, 1, 0.32, 1] as const

const benefits = [
  {
    icon: ShieldCheckIcon,
    title: 'Total Administrative Control',
    body: 'Manage 5 or 500 employees from one centralized hub. Lock down profile templates to ensure everyone uses the correct corporate logo, brand colors, and approved links.',
  },
  {
    icon: UsersIcon,
    title: 'Instantly Onboard & Offboard',
    body: 'Hired someone new? Assign them a card instantly. Employee leaving? Deactivate their physical card with one click and re-route their digital profile so you never lose a client connection.',
  },
  {
    icon: BarChart3Icon,
    title: 'Enterprise Lead Generation',
    body: 'Every tap acts as a lead generation event. Gather analytics on which team members are networking the most and export captured contact data directly to your CRM as a CSV.',
  },
  {
    icon: UserMinusIcon,
    title: 'Centralized Brand Protection',
    body: 'Lock down brand templates so ex-employees cannot misuse company branding. Every team member automatically follows your approved design and messaging standards.',
  },
]

const employeeOptions = ['1–5 employees', '6–20 employees', '21–50 employees', '51–100 employees', '100+ employees']

export default function TeamsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    employees: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = [
      `*GOSERA TEAMS ENQUIRY*`,
      `---`,
      `*Name:* ${form.name}`,
      `*Email:* ${form.email}`,
      `*Company:* ${form.company}`,
      `*Employees:* ${form.employees}`,
      `*Phone:* ${form.phone}`,
      form.message ? `*Message:* ${form.message}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    const url = `https://wa.me/94728382638?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased">
      <Nav />
      <main className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 lg:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-accent-500/[0.07] blur-[150px]"
          />
          <div className="relative mx-auto max-w-content px-5 sm:px-8">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease }}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1.5 pr-3 text-[11px] uppercase tracking-[0.16em] text-white/55 mb-8"
              >
                <UsersIcon className="h-3.5 w-3.5 text-accent-400" aria-hidden />
                GoSera Teams
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05, ease }}
                className="text-[2.8rem] font-semibold leading-[1.04] tracking-tightest text-white sm:text-6xl lg:text-[3.8rem]"
              >
                Modernize Your{' '}
                <span className="text-accent-400">Entire Workforce.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1, ease }}
                className="mt-6 max-w-xl text-base leading-relaxed text-white/55"
              >
                Equip your team with smart business cards, control your corporate branding, and track exactly how your sales force is networking in the field.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15, ease }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_0_40px_-10px_rgba(18,185,129,0.8)] hover:bg-accent-400 transition-colors active:scale-[0.97]"
                >
                  Request a Demo
                </a>
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white hover:border-white/30 hover:bg-white/[0.06] transition-all active:scale-[0.97]"
                >
                  View Team Pricing
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-t border-white/[0.07] py-16 lg:py-24">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="mx-auto max-w-xl mb-12">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Built for companies that take networking seriously.</h2>
              <p className="mt-3 text-sm text-white/50">GoSera Teams gives HR and sales leadership full control while giving employees a polished, professional digital presence.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.28, delay: i * 0.05, ease }}
                  className="flex gap-5 rounded-2xl border border-white/[0.07] bg-ink-900/50 p-6 hover:border-white/20 transition-colors"
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-accent-400">
                    <b.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{b.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Plan highlight */}
        <section className="border-t border-white/[0.07] bg-ink-900/30 py-16 lg:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="overflow-hidden rounded-3xl border border-accent-500/25 bg-ink-950 shadow-[0_0_100px_-50px_rgba(18,185,129,0.8)]">
              <div className="p-8 sm:p-12">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-xl">
                    <span className="text-[11px] uppercase tracking-[0.28em] text-accent-400">GoSera Teams Plan</span>
                    <h3 className="mt-3 text-3xl font-semibold tracking-tightest text-white">LKR 4,800 / user / year</h3>
                    <p className="mt-3 text-sm text-white/55">Minimum 3 users. Hardware purchased separately. Includes full Pro features for every employee plus centralized management tools.</p>
                    <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                      {[
                        'Centralized Admin Dashboard',
                        'Company Template Locking',
                        'Team Analytics & ROI Tracking',
                        'CRM Export (CSV)',
                        'Instant Employee Onboarding',
                        'Card Deactivation for Ex-Employees',
                        'Dedicated Account Manager',
                        'Priority Support',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-white/65">
                          <CheckIcon className="h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-3 lg:min-w-[200px]">
                    <a
                      href="#contact"
                      className="flex items-center justify-center rounded-xl bg-accent-500 py-3.5 px-6 text-sm font-semibold text-ink-950 hover:bg-accent-400 transition-colors active:scale-[0.98]"
                    >
                      Request a Demo
                    </a>
                    <a
                      href="/pricing"
                      className="flex items-center justify-center rounded-xl border border-white/12 py-3.5 px-6 text-sm text-white hover:bg-white/[0.05] transition-colors"
                    >
                      Compare All Plans
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="border-t border-white/[0.07] py-16 lg:py-24">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Request a Demo</h2>
              <p className="mt-3 text-sm text-white/50">
                Fill in your details and we will reach out within one business day to set up a live demo for your team.
              </p>

              {submitted ? (
                <div className="mt-10 rounded-2xl border border-accent-500/25 bg-accent-500/[0.07] p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/20 text-accent-400">
                    <CheckIcon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">Request Sent!</h3>
                  <p className="mt-2 text-sm text-white/55">
                    Your message has been sent to our WhatsApp. We will get back to you within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-white/60">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Priya Jayawardena"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60">Corporate Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@company.com"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-white/60">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="e.g. Acme Pvt Ltd"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60">Number of Employees *</label>
                      <select
                        required
                        value={form.employees}
                        onChange={(e) => setForm({ ...form, employees: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-3 text-sm text-white focus:border-accent-500 focus:outline-none transition-colors"
                      >
                        <option value="" disabled>Select team size</option>
                        {employeeOptions.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +94 77 123 4567"
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60">Message (Optional)</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your team's needs..."
                      className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 py-3.5 text-sm font-semibold text-ink-950 hover:bg-accent-400 transition-colors active:scale-[0.98] shadow-[0_0_30px_-8px_rgba(18,185,129,0.7)]"
                  >
                    <SendIcon className="h-4 w-4" />
                    Send via WhatsApp
                  </button>
                  <p className="text-center text-xs text-white/30">Clicking the button opens WhatsApp with your details pre-filled.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
