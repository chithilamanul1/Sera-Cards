'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockIcon, MailIcon, ArrowRightIcon, SparklesIcon, AlertCircleIcon, XIcon, Building2, User } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const oauthError = searchParams.get('error');

  const [activeTab, setActiveTab] = useState<'personal' | 'teams'>(() => {
    if (searchParams.get('tab') === 'teams' || redirectTarget?.includes('teams')) {
      return 'teams';
    }
    return 'personal';
  });

  const errorMessage =
    error ||
    (oauthError === 'google_not_configured'
      ? 'Google Sign-In Setup: In Vercel, ensure GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET have the "Production" checkbox checked, and click Redeploy. You can still sign in with credentials below.'
      : oauthError === 'google_token_failed'
      ? 'Google Token Exchange Error: Please verify that GOOGLE_CLIENT_SECRET in Vercel matches your Google Cloud Console Client credentials.'
      : oauthError === 'google_failed'
      ? 'Google sign-in was cancelled or encountered an error. Please try again.'
      : oauthError === 'google_profile_failed'
      ? 'Could not retrieve your profile from Google. Please try again.'
      : oauthError
      ? 'Authentication error. Please sign in with your email and password.'
      : '');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          redirect: activeTab === 'teams' ? '/teams/portal' : redirectTarget,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      const destination =
        (activeTab === 'teams' ? '/teams/portal' : null) ||
        redirectTarget ||
        data.redirect ||
        (data.role === 'ADMIN' ? '/admin' : '/dashboard');

      router.push(destination);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-white/10 bg-ink-900/80 p-5 sm:p-10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="text-center mb-6">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold ${
            activeTab === 'teams'
              ? 'border-sky-500/30 bg-sky-500/10 text-sky-400'
              : 'border-accent-500/25 bg-accent-500/[0.08] text-accent-400'
          }`}
        >
          {activeTab === 'teams' ? (
            <>
              <Building2 className="h-3.5 w-3.5 text-sky-400" />
              GoSera Enterprise Hub
            </>
          ) : (
            <>
              <SparklesIcon className="h-3.5 w-3.5" />
              GoSera Portal
            </>
          )}
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
          {activeTab === 'teams' ? 'Corporate Fleet Hub' : 'Welcome Back'}
        </h1>
        <p className="mt-2 text-sm text-white/50">
          {activeTab === 'teams'
            ? 'Sign in to manage company card fleets, pooled leads, and organization brand locks.'
            : 'Sign in to manage your digital card, leads, or admin dashboard.'}
        </p>
      </div>

      {/* Segmented Mode Switcher */}
      <div className="grid grid-cols-2 p-1 bg-white/[0.04] border border-white/10 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('personal');
            setError('');
          }}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'personal'
              ? 'bg-accent-500 text-ink-950 shadow-md font-bold'
              : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          Personal Card
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('teams');
            setError('');
          }}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'teams'
              ? 'bg-sky-500 text-zinc-950 shadow-md font-bold'
              : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          Enterprise Teams
        </button>
      </div>

      {/* Enterprise Demo Auto-Fill helper */}
      {activeTab === 'teams' && (
        <div className="mb-6 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-xs">
          <div className="flex items-center justify-between text-sky-300 font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Apex Capital Partners Demo
            </span>
            <span className="text-[10px] bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/30 text-sky-200">
              1-Click Fill
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mb-2.5">
            Test as Managing Director Kasun Jayawardena (Corporate B2B Fleet):
          </p>
          <button
            type="button"
            onClick={() => {
              setEmail('kasun.j@apexcapital.lk');
              setPassword('apex1234');
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-500 py-2 px-3 text-xs font-bold text-zinc-950 hover:bg-sky-400 transition active:scale-[0.98] shadow-sm"
          >
            Auto-Fill Credentials (kasun.j@apexcapital.lk)
          </button>
        </div>
      )}

      {errorMessage && !errorDismissed && (
        <div className="mb-6 rounded-xl bg-purple-500/10 p-4 text-sm text-purple-300 border border-purple-500/20 flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <AlertCircleIcon className="h-5 w-5 shrink-0 text-purple-400 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorDismissed(true)}
            className="text-white/40 hover:text-white transition p-1"
            title="Dismiss message"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}


      {/* Google OAuth Login Button */}
      <a
        href="/api/auth/google"
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.05] py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.1] active:scale-[0.98] shadow-sm mb-6"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        Sign in with Google
      </a>

      <div className="relative flex items-center justify-center my-6">
        <div className="border-t border-white/10 w-full" />
        <span className="bg-[#0e0e12] px-3 text-xs uppercase tracking-wider text-white/40 absolute font-semibold">
          or sign in with credentials
        </span>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
            {activeTab === 'teams' ? 'Corporate Work Email' : 'Email Address or Mobile Number'}
          </label>
          <div className="relative">
            <MailIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === 'teams' ? 'kasun.j@apexcapital.lk' : 'you@company.com or 0728382638'}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-ink-950 transition-all active:scale-[0.98] disabled:opacity-50 ${
            activeTab === 'teams'
              ? 'bg-sky-500 hover:bg-sky-400 shadow-[0_0_30px_-8px_rgba(14,165,233,0.8)]'
              : 'bg-accent-500 hover:bg-accent-400 shadow-[0_0_30px_-8px_rgba(168,85,247,0.8)]'
          }`}
        >
          {loading ? 'Authenticating...' : activeTab === 'teams' ? 'Sign In to Enterprise Fleet' : 'Sign In to Card Portal'}
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/[0.07] space-y-3 text-center text-sm text-white/50">
        <div>
          Don't have an account yet?{' '}
          <a href="/register" className="font-semibold text-accent-400 hover:underline">
            Create Free Account
          </a>
        </div>
        <div className="pt-2">
          {activeTab === 'personal' ? (
            <button
              type="button"
              onClick={() => {
                setActiveTab('teams');
                setError('');
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 py-2.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20 transition-all"
            >
              🏢 Switch to Enterprise Fleet Portal Sign In &rarr;
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setActiveTab('personal');
                setError('');
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-semibold text-white/70 hover:bg-white/[0.08] transition-all"
            >
              👤 Switch to Individual Card Portal Sign In &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased flex flex-col justify-between">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-ink-900/80 p-10 text-center text-white/50">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent-400 border-t-transparent mb-3" />
              Loading portal sign in...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
