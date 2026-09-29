import React from 'react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { ZapIcon, UserCheckIcon, BarChart3Icon, SmartphoneIcon } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: SmartphoneIcon,
    title: 'Get Your Card & Tap',
    body: 'Order your preferred NFC card — Standard PVC, Custom Brand, or Executive Metal. Once it arrives, simply tap it to your smartphone. Our platform instantly launches a secure setup wizard.',
    detail: 'Ships in 3–5 days',
  },
  {
    num: '02',
    icon: ZapIcon,
    title: 'Build Your Engine',
    body: 'Create your account and customize your profile. Add your WhatsApp, social links, motion graphics, and enable Lead Capture mode to start collecting leads instantly.',
    detail: 'Ready in under 60 seconds',
  },
  {
    num: '03',
    icon: UserCheckIcon,
    title: 'Network & Track',
    body: 'Tap your card on any modern smartphone. They get your contact info instantly without downloading an app, and your dashboard logs the interaction, location, and link clicks.',
    detail: '0.2s NFC response',
  },
]

const faqs = [
  {
    q: 'Do I have to pay a yearly fee?',
    a: 'You can use GoSera Basic for free, forever. However, to unlock powerful business tools like WhatsApp routing, Lead Capture, and Analytics, you can upgrade to our Pro or Teams plans. See the pricing page for full details.',
  },
  {
    q: 'Does the other person need an app to view my card?',
    a: 'No. GoSera uses the native NFC protocols built into every modern iOS and Android device. Tapping the card automatically opens your digital profile in their default browser — nothing to download.',
  },
  {
    q: 'What happens if I lose my card?',
    a: 'Your digital profile and captured leads are safely backed up in the cloud. Just order a replacement physical card from your dashboard and link it to your existing profile instantly. Your data is never lost.',
  },
  {
    q: 'Can I update my details after purchasing?',
    a: 'Yes. Your card links to your cloud-hosted GoSera profile. You can update phone numbers, social links, business details, and activate Lead Capture mode at any time without reprinting the physical card.',
  },
  {
    q: 'What about older phones without NFC?',
    a: 'Every GoSera card features a high-contrast dynamic QR code on the back. Scanning it with any camera app opens the exact same digital profile.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased">
      <Nav />
      <main className="pt-24">
        {/* Header */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent-500/[0.07] blur-[140px]"
          />
          <div className="relative mx-auto max-w-content px-5 sm:px-8 text-center">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1.5 pr-3 text-[11px] uppercase tracking-[0.16em] text-white/55 mb-6">
              <BarChart3Icon className="h-3.5 w-3.5 text-accent-400" aria-hidden />
              How GoSera Works
            </span>
            <h1 className="text-4xl font-semibold tracking-tightest text-white sm:text-5xl lg:text-[3.5rem]">
              From Tap to Lead{' '}
              <span className="text-accent-400">in 3 Seconds.</span>
            </h1>
            <p className="mt-5 text-base text-white/55 max-w-xl mx-auto">
              GoSera transforms a single tap into a full lead-generation event. Here is the entire interaction, from first handshake to analytics dashboard entry.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="border-t border-white/[0.07] py-16 lg:py-24">
          <div className="mx-auto max-w-content px-5 sm:px-8">
            <ol className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] lg:grid-cols-3">
              {steps.map((step, i) => (
                <li key={step.title} className="flex flex-col bg-ink-950 p-7 lg:p-9">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-light text-accent-400">{step.num}</span>
                    <span className="rounded-full border border-accent-500/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-accent-400">
                      {step.detail}
                    </span>
                  </div>
                  <div className="mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-accent-500/10 text-accent-400">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/[0.07] bg-ink-900/30 py-16 lg:py-24">
          <div className="mx-auto grid max-w-content gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tightest text-white sm:text-4xl">Questions, answered.</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                Still unsure? Message us on WhatsApp and we will send you a live demo before you buy.
              </p>
              <a
                href="https://wa.me/94728382638?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20GoSera."
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-accent-400 transition-colors active:scale-[0.97]"
              >
                Chat on WhatsApp
              </a>
            </div>
            <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
              {faqs.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5">
                    <span className="text-base font-medium text-white">{item.q}</span>
                    <span className="text-accent-400 text-xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-white/55">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-white/[0.07] py-16 lg:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Ready to start networking smarter?</h2>
            <p className="mt-4 text-sm text-white/50">Choose your hardware and a software plan that fits your goals.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/pricing"
                className="rounded-full bg-accent-500 px-7 py-3.5 text-sm font-semibold text-ink-950 hover:bg-accent-400 transition-colors active:scale-[0.97] shadow-[0_0_40px_-10px_rgba(168,85,247,0.7)]"
              >
                View Pricing
              </a>
              <a
                href="/teams"
                className="rounded-full border border-white/12 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white hover:border-white/30 hover:bg-white/[0.06] transition-all active:scale-[0.97]"
              >
                For Teams & Enterprise
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
