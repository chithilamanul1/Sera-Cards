'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SmartphoneIcon,
  SparklesIcon,
  CheckCircle2Icon,
  MessageSquareIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  QrCodeIcon,
  StarIcon,
  SendIcon,
  ShieldCheckIcon,
  Share2Icon,
  LockIcon,
  ChevronDownIcon,
  RadioIcon,
  RotateCcwIcon,
  ZapIcon,
} from 'lucide-react'

export function NfcTapSimulator() {
  const [isTapping, setIsTapping] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'leadCapture' | 'lankaQr' | 'reviews'>('profile')
  const [contactSaved, setContactSaved] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [cardMaterial, setCardMaterial] = useState<'pvc' | 'premium' | 'metal'>('premium')

  const triggerTapSimulation = () => {
    setIsTapping(true)
    setProfileLoaded(false)
    setActiveTab('profile')
    setContactSaved(false)
    setLeadSubmitted(false)

    setTimeout(() => {
      setIsTapping(false)
      setProfileLoaded(true)
    }, 1200)
  }

  const handleSaveContact = () => {
    setContactSaved(true)
    setTimeout(() => setContactSaved(false), 3000)
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!visitorName.trim()) return
    setLeadSubmitted(true)
    setTimeout(() => {
      setLeadSubmitted(false)
      setActiveTab('profile')
      setVisitorName('')
      setVisitorPhone('')
    }, 2500)
  }

  const materialStyles = {
    pvc: {
      bg: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
      border: 'border-white/10',
      accent: 'text-white',
      name: 'Standard Matte PVC',
      chip: '#d4d4d8',
    },
    premium: {
      bg: 'linear-gradient(135deg, #1e102e 0%, #0d0614 100%)',
      border: 'border-accent-500/40',
      accent: 'text-accent-400',
      name: 'Sera Premium Matte',
      chip: '#c084fc',
    },
    metal: {
      bg: 'linear-gradient(135deg, #27272a 0%, #18181b 50%, #3f3f46 100%)',
      border: 'border-zinc-400/40',
      accent: 'text-zinc-200',
      name: 'Executive Metal',
      chip: '#e4e4e7',
    },
  }

  const currentMat = materialStyles[cardMaterial]

  return (
    <div className="relative mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-ink-900/70 p-4 sm:p-8 lg:p-10 shadow-[0_20px_80px_-20px_rgba(168,85,247,0.25)] backdrop-blur-xl">
      {/* Decorative background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-full max-w-3xl -translate-x-1/2 rounded-full bg-accent-500/15 blur-[120px]"
      />

      {/* Header with pill controls */}
      <div className="relative flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-6 text-center sm:flex-row sm:text-left">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-400">
            <RadioIcon className="h-3.5 w-3.5 animate-pulse text-accent-400" />
            Live Interactive Simulator
          </div>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
            See What Happens When You Tap A Phone
          </h3>
          <p className="text-xs text-white/50 sm:text-sm">
            Experience the exact 0.2-second flow your clients experience. No apps to install.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={triggerTapSimulation}
            disabled={isTapping}
            className="flex items-center gap-2 rounded-xl bg-accent-500 px-4 py-2.5 text-xs font-semibold text-ink-950 shadow-[0_0_25px_-5px_rgba(168,85,247,0.8)] transition-all hover:bg-accent-400 active:scale-95 disabled:opacity-50"
          >
            <RotateCcwIcon className={`h-3.5 w-3.5 ${isTapping ? 'animate-spin' : ''}`} />
            {isTapping ? 'Tapping Card...' : 'Tap Card to Phone'}
          </button>
        </div>
      </div>

      {/* Stage: 2-column on desktop (Left: Physical Tap demonstration, Right: Interactive Phone Profile) */}
      <div className="relative mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        
        {/* LEFT COLUMN: Physical NFC Tap Animation (5 cols) */}
        <div className="flex flex-col items-center justify-center lg:col-span-5">
          <div className="relative flex h-[360px] w-full max-w-[340px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-ink-950/80 p-6 shadow-inner">
            
            {/* Top Phone Sensor Target Indicator */}
            <div className="absolute top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/60">
              <ZapIcon className="h-3 w-3 text-accent-400" />
              NFC Contactless Field (Top of Phone)
            </div>

            {/* Glowing NFC Pulse Waves */}
            <AnimatePresence>
              {isTapping && (
                <div className="pointer-events-none absolute top-28 flex items-center justify-center">
                  {[1, 2, 3].map((ring) => (
                    <motion.div
                      key={ring}
                      initial={{ scale: 0.4, opacity: 0.9 }}
                      animate={{ scale: 2.2 + ring * 0.4, opacity: 0 }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: ring * 0.2 }}
                      className="absolute h-36 w-36 rounded-full border border-accent-400/80 bg-accent-500/10 shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Physical Card Mockup */}
            <motion.div
              animate={
                isTapping
                  ? { y: [-20, 25, -5], rotate: [-6, 2, -2], scale: [1, 1.05, 1] }
                  : { y: [0, -8, 0], rotate: [-4, -2, -4] }
              }
              transition={
                isTapping
                  ? { duration: 0.9, ease: 'easeInOut' }
                  : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }
              className={`relative z-10 w-64 rounded-xl border ${currentMat.border} p-4 shadow-2xl transition-all duration-300`}
              style={{ background: currentMat.bg }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-white">GOSERA</span>
                <RadioIcon className={`h-4 w-4 ${currentMat.accent}`} />
              </div>

              {/* Integrated chip graphic */}
              <div
                className="my-4 h-7 w-9 rounded border border-white/20 shadow-inner"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                }}
              />

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-white">Chithila Manul</p>
                <p className="text-[10px] text-white/60">Founder & CEO · Seranex</p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[9px] text-white/40">
                <span>NXP NTAG215 NFC</span>
                <span className={currentMat.accent}>0.2s Tap</span>
              </div>
            </motion.div>

            {/* Phone Silhouette Below Receiving the Tap */}
            <motion.div
              animate={isTapping ? { scale: [1, 1.02, 1], y: [0, -4, 0] } : {}}
              className="mt-4 flex w-52 items-center justify-center rounded-t-2xl border-x border-t border-white/20 bg-ink-900/90 pt-3 pb-1"
            >
              <div className="h-1.5 w-16 rounded-full bg-white/20" />
            </motion.div>

            {/* Notification alert banner popping out during tap */}
            <AnimatePresence>
              {isTapping && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute bottom-5 z-20 flex w-[90%] items-center gap-3 rounded-xl border border-accent-500/40 bg-ink-950/95 p-3 shadow-2xl backdrop-blur-md"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500/20 text-accent-400">
                    <RadioIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-[11px] font-semibold text-white">NFC Tag Detected</p>
                    <p className="truncate text-[10px] text-white/60">Opening chithila.seranex.lk...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Material switcher pills */}
          <div className="mt-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 p-1 text-xs">
            <button
              type="button"
              onClick={() => setCardMaterial('pvc')}
              className={`rounded-full px-3 py-1 font-medium transition-all ${
                cardMaterial === 'pvc' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              Standard PVC
            </button>
            <button
              type="button"
              onClick={() => setCardMaterial('premium')}
              className={`rounded-full px-3 py-1 font-medium transition-all ${
                cardMaterial === 'premium' ? 'bg-accent-500 text-ink-950' : 'text-white/40 hover:text-white'
              }`}
            >
              Premium Matte
            </button>
            <button
              type="button"
              onClick={() => setCardMaterial('metal')}
              className={`rounded-full px-3 py-1 font-medium transition-all ${
                cardMaterial === 'metal' ? 'bg-zinc-300 text-ink-950' : 'text-white/40 hover:text-white'
              }`}
            >
              Executive Metal
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-white/40">
            Selected finish: <span className="font-semibold text-accent-400">{currentMat.name}</span>
          </p>
        </div>

        {/* RIGHT COLUMN: Interactive Smartphone Display (7 cols) */}
        <div className="flex flex-col items-center lg:col-span-7">
          <div className="relative w-full max-w-[390px] rounded-[44px] border-[5px] border-zinc-800 bg-black p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
            
            {/* iPhone Dynamic Island / Speaker */}
            <div className="absolute top-5 left-1/2 z-30 flex h-6 w-28 -translate-x-1/2 items-center justify-between rounded-full bg-black px-2 shadow-sm ring-1 ring-white/10">
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-900" />
              <div className="h-3 w-3 rounded-full bg-accent-500/40 ring-1 ring-accent-400" />
            </div>

            {/* Inner Phone Screen */}
            <div className="relative min-h-[580px] w-full overflow-hidden rounded-[36px] bg-ink-950 text-white">
              
              {/* Native Browser Top Bar */}
              <div className="flex items-center justify-between border-b border-white/10 bg-ink-900/90 px-4 pt-9 pb-2 text-[11px] text-white/60">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-accent-400">
                  <LockIcon className="h-2.5 w-2.5" />
                  chithila.seranex.lk
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-accent-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-accent-400">
                    No App Needed
                  </span>
                </div>
              </div>

              {/* Simulated Loading Transition */}
              <AnimatePresence mode="wait">
                {!profileLoaded ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center"
                  >
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent-400 border-t-transparent" />
                    <p className="mt-4 text-xs font-medium text-white/70">Loading digital identity...</p>
                    <p className="mt-1 text-[10px] text-accent-400">0.2s instant response</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 p-4 pb-6"
                  >
                    {/* Header Banner & Avatar */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-accent-500/20 to-ink-900/60 p-4 text-center">
                      <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-accent-400/80 shadow-lg">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                          alt="Chithila Manul"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="mt-2.5 flex items-center justify-center gap-1.5">
                        <h4 className="text-base font-bold text-white">Chithila Manul</h4>
                        <CheckCircle2Icon className="h-4 w-4 text-accent-400" />
                      </div>
                      <p className="text-xs text-accent-300 font-medium">Founder & CEO · Seranex Solutions</p>
                      <p className="mt-1 text-[11px] text-white/50">Colombo, Sri Lanka · Smart NFC Technology</p>

                      {/* Primary Action Button: Save Contact (.vcf) */}
                      <button
                        type="button"
                        onClick={handleSaveContact}
                        className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 py-2.5 text-xs font-bold text-ink-950 shadow-[0_0_20px_rgba(168,85,247,0.7)] transition-all hover:bg-accent-400 active:scale-98"
                      >
                        {contactSaved ? (
                          <>
                            <CheckCircle2Icon className="h-4 w-4" />
                            Saved to Phone Contacts!
                          </>
                        ) : (
                          <>
                            <Share2Icon className="h-4 w-4" />
                            Save Contact to Phone (.vcf)
                          </>
                        )}
                      </button>
                    </div>

                    {/* Feature Navigation Tabs inside Phone */}
                    <div className="grid grid-cols-4 gap-1 rounded-xl border border-white/10 bg-ink-900/70 p-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className={`rounded-lg py-1.5 font-medium transition-all ${
                          activeTab === 'profile'
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        Links
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('leadCapture')}
                        className={`rounded-lg py-1.5 font-medium transition-all ${
                          activeTab === 'leadCapture'
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        Exchange
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('lankaQr')}
                        className={`rounded-lg py-1.5 font-medium transition-all ${
                          activeTab === 'lankaQr'
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        LankaQR
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('reviews')}
                        className={`rounded-lg py-1.5 font-medium transition-all ${
                          activeTab === 'reviews'
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        5★ Review
                      </button>
                    </div>

                    {/* Tab 1: Quick Action Links */}
                    {activeTab === 'profile' && (
                      <div className="space-y-2">
                        <a
                          href="https://wa.me/94728382638"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-white transition-all hover:bg-emerald-500/20"
                        >
                          <div className="flex items-center gap-2.5">
                            <MessageSquareIcon className="h-4 w-4 text-emerald-400" />
                            <span className="font-medium">Direct WhatsApp Chat</span>
                          </div>
                          <span className="text-[10px] text-emerald-400">1-Tap</span>
                        </a>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => alert('Simulated phone call to 072 838 2638')}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white transition-all hover:bg-white/10"
                          >
                            <PhoneIcon className="h-3.5 w-3.5 text-accent-400" />
                            <span className="truncate">Call Office</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => alert('Simulated email compose to info@seranex.lk')}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white transition-all hover:bg-white/10"
                          >
                            <MailIcon className="h-3.5 w-3.5 text-accent-400" />
                            <span className="truncate">Email Us</span>
                          </button>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] text-white/60">
                          <div className="flex items-center justify-between font-semibold text-white">
                            <span>Services & Portfolio</span>
                            <GlobeIcon className="h-3.5 w-3.5 text-accent-400" />
                          </div>
                          <p className="mt-1 text-[10px] text-white/40">
                            Web Design · Mobile Apps · NFC Card Systems
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Two-Way Lead Capture */}
                    {activeTab === 'leadCapture' && (
                      <div className="rounded-xl border border-accent-500/30 bg-accent-500/5 p-3.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-white">
                          <SparklesIcon className="h-4 w-4 text-accent-400" />
                          Two-Way Contact Exchange
                        </div>
                        <p className="mt-1 text-[10px] text-white/50">
                          The stranger sends their details back to you. Directly delivered to your email and dashboard!
                        </p>

                        {leadSubmitted ? (
                          <div className="mt-4 rounded-lg bg-accent-500/20 p-3 text-center text-xs text-accent-300 border border-accent-500/40">
                            <CheckCircle2Icon className="mx-auto mb-1 h-5 w-5 text-accent-400" />
                            Lead Captured! Sent to your dashboard.
                          </div>
                        ) : (
                          <form onSubmit={handleLeadSubmit} className="mt-3 space-y-2">
                            <input
                              type="text"
                              value={visitorName}
                              onChange={(e) => setVisitorName(e.target.value)}
                              placeholder="Your Name (e.g. Kasun Silva)"
                              className="w-full rounded-lg border border-white/10 bg-ink-950 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:border-accent-400 focus:outline-none"
                            />
                            <input
                              type="tel"
                              value={visitorPhone}
                              onChange={(e) => setVisitorPhone(e.target.value)}
                              placeholder="WhatsApp / Phone Number"
                              className="w-full rounded-lg border border-white/10 bg-ink-950 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:border-accent-400 focus:outline-none"
                            />
                            <button
                              type="submit"
                              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent-500 py-2 text-xs font-semibold text-ink-950 transition-all hover:bg-accent-400"
                            >
                              <SendIcon className="h-3 w-3" />
                              Send My Info to Chithila
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* Tab 3: LankaQR Integration */}
                    {activeTab === 'lankaQr' && (
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                        <p className="text-xs font-semibold text-white">Integrated LankaQR</p>
                        <p className="mt-0.5 text-[10px] text-white/50">Accept payments instantly on the spot</p>
                        <div className="mx-auto my-3 flex h-32 w-32 items-center justify-center rounded-xl bg-white p-2 shadow-md">
                          <QrCodeIcon className="h-full w-full text-black" />
                        </div>
                        <p className="font-mono text-[10px] text-accent-400">Commercial Bank · Acc: 8009214472</p>
                      </div>
                    )}

                    {/* Tab 4: Google Review Booster */}
                    {activeTab === 'reviews' && (
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center">
                        <div className="flex justify-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon key={star} className="h-4 w-4 fill-amber-400" />
                          ))}
                        </div>
                        <p className="mt-2 text-xs font-semibold text-white">5-Star Google Review Booster</p>
                        <p className="mt-1 text-[10px] text-white/50">
                          Route happy clients directly to your official Google review form in 1 tap.
                        </p>
                        <button
                          type="button"
                          onClick={() => alert('Simulated opening Google Review popup')}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-ink-950"
                        >
                          <StarIcon className="h-3 w-3 fill-current" />
                          Leave Review on Google
                        </button>
                      </div>
                    )}

                    <div className="pt-2 text-center text-[9px] text-white/30">
                      Powered by GoSera Smart NFC · No app needed
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Pills Below Simulator */}
      <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <ShieldCheckIcon className="h-4 w-4 text-accent-400" />
          <span>Zero app download required</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <RadioIcon className="h-4 w-4 text-accent-400" />
          <span>Works with 99% of phones</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <SparklesIcon className="h-4 w-4 text-accent-400" />
          <span>Instant two-way lead capture</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <QrCodeIcon className="h-4 w-4 text-accent-400" />
          <span>Dynamic QR fallback backup</span>
        </div>
      </div>
    </div>
  )
}
