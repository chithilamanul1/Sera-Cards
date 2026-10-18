'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Zap,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  QrCode,
  RefreshCw,
  Lock,
  ShieldCheck,
  Check,
  X,
  CreditCard,
  Wifi,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NfcCardWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  name?: string;
  customUrl?: string;
  onSuccess?: () => void;
}

export function NfcCardWriterModal({
  isOpen,
  onClose,
  slug,
  name,
  customUrl,
  onSuccess,
}: NfcCardWriterModalProps) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
  const targetUrl = customUrl || `https://${slug ? `${slug}.${rootDomain}` : rootDomain}`;

  const [hasWebNfc, setHasWebNfc] = useState<boolean | null>(null);
  const [writeState, setWriteState] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'webnfc' | 'qr' | 'manual'>('webnfc');
  const [makeReadOnly, setMakeReadOnly] = useState(false);
  const [cardSerial, setCardSerial] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Check Web NFC capability on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = 'NDEFReader' in window;
      setHasWebNfc(supported);
      if (!supported) {
        setActiveTab('qr');
      } else {
        setActiveTab('webnfc');
      }
    }
  }, [isOpen]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setWriteState('IDLE');
      setErrorMessage('');
      setCardSerial(null);
    }
  }, [isOpen]);

  // Synthesize positive audio feedback
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.12); // A5

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  };

  const handleStartWrite = async () => {
    setWriteState('SCANNING');
    setErrorMessage('');

    if (typeof window === 'undefined' || !('NDEFReader' in window)) {
      setWriteState('ERROR');
      setErrorMessage('Web NFC is not supported in this browser. Please use Chrome on an Android smartphone.');
      return;
    }

    try {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const NDEFReaderClass = (window as any).NDEFReader;
      const ndef = new NDEFReaderClass();

      // Write NDEF URL record
      await ndef.write(
        {
          records: [
            {
              recordType: 'url',
              data: targetUrl,
            },
          ],
        },
        { signal: abortController.signal, overwrite: true }
      );

      // Trigger tactile haptics & audio chime
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([80, 40, 120]);
      }
      playChime();

      setWriteState('SUCCESS');
      toast.success('Physical NFC Card Programmed Successfully!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setWriteState('IDLE');
        return;
      }
      console.error('NFC Write Error:', err);
      setWriteState('ERROR');
      if (err.name === 'NotAllowedError') {
        setErrorMessage('NFC permission was denied. Please allow NFC access in your browser site permissions.');
      } else if (err.name === 'NotReadableError') {
        setErrorMessage('Could not read or write NFC chip. Please hold the card still against the NFC antenna.');
      } else if (err.name === 'NetworkError') {
        setErrorMessage('Tag connection was lost. Ensure the card is flush against the phone.');
      } else {
        setErrorMessage(err.message || 'Failed to program NFC tag. Make sure NFC is toggled ON in your phone settings.');
      }
    }
  };

  const handleCancelScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setWriteState('IDLE');
  };

  const handleSimulateWrite = () => {
    setWriteState('SCANNING');
    setTimeout(() => {
      playChime();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([80, 40, 120]);
      }
      setWriteState('SUCCESS');
      toast.success('Physical NFC Card Programmed (Simulation Mode)!');
      if (onSuccess) onSuccess();
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[94dvh] overflow-y-auto touch-scroll rounded-3xl border border-white/10 bg-[#111317] p-5 sm:p-7 shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500/10 text-accent-400 border border-accent-500/25 shadow-sm">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Sera NFC Card Placer & Writer
              </h3>
              <span className="rounded-full bg-accent-500/20 text-accent-300 border border-accent-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                1-Tap NDEF
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Program blank NTAG213 / NTAG215 / NTAG216 physical chips in 0.2s
            </p>
          </div>
        </div>

        {/* Target Payload Card */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-accent-400">
              Payload to Write
            </span>
            <span className="text-[11px] font-mono text-white/40">
              {name ? `Client: ${name}` : 'NFC URL Record'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 bg-ink-950/80 rounded-xl border border-white/10 p-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <ExternalLink className="h-4 w-4 text-accent-400 shrink-0" />
              <span className="font-mono text-xs sm:text-sm text-white font-bold truncate">
                {targetUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-lg p-1.5 text-white/50 hover:text-white hover:bg-white/10 transition"
              title="Copy URL"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="mt-5 grid grid-cols-3 gap-1.5 bg-white/[0.03] border border-white/10 p-1 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('webnfc')}
            className={`py-2 px-2 rounded-xl text-center transition ${
              activeTab === 'webnfc'
                ? 'bg-accent-500 text-ink-950 font-bold shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            ⚡ 1-Tap NFC
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`py-2 px-2 rounded-xl text-center transition ${
              activeTab === 'qr'
                ? 'bg-accent-500 text-ink-950 font-bold shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            📱 Phone Bridge QR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`py-2 px-2 rounded-xl text-center transition ${
              activeTab === 'manual'
                ? 'bg-accent-500 text-ink-950 font-bold shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            🛠️ NFC Tools App
          </button>
        </div>

        {/* ─── TAB 1: NATIVE WEB NFC ─── */}
        {activeTab === 'webnfc' && (
          <div className="mt-5">
            {writeState === 'IDLE' && (
              <div className="text-center py-4">
                <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-accent-500/10 animate-ping opacity-75" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-accent-500/20 to-purple-500/30 border border-accent-500/40 text-accent-400 shadow-xl">
                    <Wifi className="h-9 w-9 rotate-90" />
                  </div>
                </div>

                <h4 className="text-base font-bold text-white">Ready to Program NFC Card</h4>
                <p className="text-xs text-white/55 max-w-sm mx-auto mt-1 leading-relaxed">
                  Click the button below, then hold any physical Sera Card, blank NTAG215 card, or keyfob to the back of your phone.
                </p>

                {hasWebNfc === false && (
                  <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-200/90 leading-relaxed">
                      <strong>Web NFC capability not detected on this browser.</strong> Native 1-Tap NFC writing runs on Google Chrome on Android smartphones. You can test in <em>Simulation Mode</em> or scan the <strong>Phone Bridge QR</strong> tab with your Android phone!
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={hasWebNfc ? handleStartWrite : handleSimulateWrite}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent-500 py-3.5 px-4 text-sm font-bold text-ink-950 hover:bg-accent-400 transition active:scale-[0.98] shadow-lg shadow-accent-500/25"
                  >
                    <Zap className="h-4 w-4" />
                    {hasWebNfc ? 'Activate NFC & Hold Card to Phone' : 'Simulate NFC Programming (Test)'}
                  </button>
                </div>
              </div>
            )}

            {writeState === 'SCANNING' && (
              <div className="text-center py-6">
                <div className="relative mx-auto w-28 h-28 mb-5 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full border-2 border-accent-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: 0.3, ease: 'easeInOut' }}
                    className="absolute inset-2 rounded-full border-2 border-accent-400/60"
                  />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-500 text-ink-950 shadow-2xl">
                    <Smartphone className="h-10 w-10 animate-bounce" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/20 border border-accent-500/40 text-accent-300 text-xs font-bold mb-2">
                  <span className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
                  NFC Antenna Active — Waiting for Card
                </div>

                <h4 className="text-lg font-bold text-white">Tap Card to Phone Now</h4>
                <p className="text-xs text-white/60 max-w-sm mx-auto mt-1 leading-relaxed">
                  Hold the physical NFC card flush against the top-center or back of your phone. Do not move the card until confirmation appears.
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCancelScan}
                    className="rounded-xl border border-white/10 px-5 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/5 transition"
                  >
                    Cancel Scan
                  </button>
                </div>
              </div>
            )}

            {writeState === 'SUCCESS' && (
              <div className="text-center py-6 animate-in zoom-in-95">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-xl mb-4">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-2">
                  <Check className="h-3.5 w-3.5" /> Chip Encoded & Ready
                </div>

                <h4 className="text-xl font-bold text-white">Card Successfully Programmed!</h4>
                <p className="text-xs text-white/60 max-w-sm mx-auto mt-1.5 leading-relaxed">
                  The NFC chip has been flashed with your dynamic link. When tapped on any iPhone or Android phone in the world, it will instantly load this profile!
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 px-4 text-xs font-semibold text-white hover:bg-white/10 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-accent-400" />
                    Test Live URL in Browser
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setWriteState('IDLE');
                      handleStartWrite();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent-500 py-3 px-4 text-xs font-bold text-ink-950 hover:bg-accent-400 transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Write Another Card
                  </button>
                </div>
              </div>
            )}

            {writeState === 'ERROR' && (
              <div className="text-center py-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mb-3">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-white">NFC Write Failed</h4>
                <p className="text-xs text-red-300/80 max-w-sm mx-auto mt-1 leading-relaxed">
                  {errorMessage}
                </p>

                <div className="mt-5 flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setWriteState('IDLE')}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/70 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleStartWrite}
                    className="rounded-xl bg-accent-500 px-5 py-2.5 text-xs font-bold text-ink-950 hover:bg-accent-400"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: PHONE BRIDGE QR (SCAN FROM ANDROID TO OPEN WRITER ON PHONE) ─── */}
        {activeTab === 'qr' && (
          <div className="mt-5 text-center py-3">
            <h4 className="text-sm font-bold text-white">Scan to Open 1-Tap Writer on Your Phone</h4>
            <p className="text-xs text-white/50 max-w-sm mx-auto mt-1">
              If you are sitting at your desktop PC or using an iPhone, scan this QR code with an Android smartphone to open this card's 1-tap NFC writer directly!
            </p>

            {/* QR Mock / Real QR code */}
            <div className="my-5 flex justify-center">
              <div className="p-3 bg-white rounded-2xl shadow-xl border border-white/10">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    targetUrl
                  )}`}
                  alt="NFC Target QR"
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-accent-400 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Direct URL: {targetUrl}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleSimulateWrite}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-accent-500/40 bg-accent-500/10 py-3 text-xs font-bold text-accent-300 hover:bg-accent-500/20 transition"
              >
                <Zap className="h-3.5 w-3.5" />
                Simulate Successful Write on this Device
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 3: MANUAL NFC TOOLS APP INSTRUCTIONS ─── */}
        {activeTab === 'manual' && (
          <div className="mt-5 space-y-4 text-xs text-white/70">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2.5">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-accent-400" />
                Using the Free "NFC Tools" App (iOS & Android)
              </h4>
              <ol className="space-y-2 list-decimal list-inside text-white/60">
                <li>
                  Download the free <strong className="text-white">NFC Tools</strong> app from Google Play Store or Apple App Store.
                </li>
                <li>
                  Open the app and select <strong className="text-white">Write</strong> &rarr; <strong className="text-white">Add a record</strong>.
                </li>
                <li>
                  Choose <strong className="text-white">URL / URI</strong> and paste your profile link:
                  <div className="mt-1 flex items-center gap-2 bg-ink-950 p-2 rounded-lg font-mono text-[11px] text-accent-300">
                    <span className="truncate">{targetUrl}</span>
                    <button onClick={handleCopy} className="text-white/40 hover:text-white">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </li>
                <li>
                  Tap <strong className="text-white">Write / 28 Bytes</strong> and touch your physical card to the phone.
                </li>
              </ol>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-white/40">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Compatible with standard NXP NTAG213, NTAG215, NTAG216, and Mifare chips.</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
