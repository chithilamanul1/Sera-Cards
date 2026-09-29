'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockIcon, MailIcon, ArrowRightIcon, SparklesIcon } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

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
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased flex flex-col justify-between">
      <Nav />

      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
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

          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

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
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_0_30px_-8px_rgba(18,185,129,0.8)] transition-all hover:bg-accent-400 active:scale-[0.98] disabled:opacity-50"
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
      </main>

      <Footer />
    </div>
  );
}
