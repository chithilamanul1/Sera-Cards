'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockIcon, MailIcon, ArrowRightIcon, SparklesIcon, AlertCircleIcon } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const oauthError = searchParams.get('error');

  const errorMessage =
    error ||
    (oauthError === 'google_not_configured'
      ? 'Google Sign-In will be active once GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET are set in Vercel.'
      : oauthError === 'google_failed'
      ? 'Google sign-in was cancelled or encountered an error. Please try again.'
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      const destination = redirectTarget || data.redirect || (data.role === 'ADMIN' ? '/admin' : '/dashboard');
      router.push(destination);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-ink-900/80 p-6 sm:p-10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/25 bg-accent-500/[0.08] px-3.5 py-1 text-xs font-semibold text-accent-400">
          <SparklesIcon className="h-3.5 w-3.5" />
          GoSera Portal
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Sign in to manage your digital card, leads, or admin dashboard.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-xl bg-purple-500/10 p-4 text-sm text-purple-300 border border-purple-500/20 flex items-start gap-2.5">
          <AlertCircleIcon className="h-5 w-5 shrink-0 text-purple-400 mt-0.5" />
          <span>{errorMessage}</span>
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
          or with email
        </span>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <MailIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
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
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_0_30px_-8px_rgba(168,85,247,0.8)] transition-all hover:bg-accent-400 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/[0.07] text-center text-sm text-white/50">
        Don't have an account yet?{' '}
        <a href="/register" className="font-semibold text-accent-400 hover:underline">
          Create Free Account
        </a>
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
