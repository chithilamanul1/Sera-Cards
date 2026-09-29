'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SparklesIcon, ArrowRightIcon, LockIcon, MailIcon, UserIcon, PhoneIcon, GlobeIcon } from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cardSlug: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSlugChange = (val: string) => {
    const sanitized = val.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);
    setForm((prev) => ({ ...prev, cardSlug: sanitized }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          cardSlug: form.cardSlug || form.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account.');
      }

      // Success -> Redirect to Customer Portal
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';
  const previewSlug = form.cardSlug || (form.name ? form.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14) : 'yourname');

  return (
    <div className="min-h-screen w-full bg-ink-950 font-sans text-white antialiased flex flex-col justify-between">
      <Nav />

      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-ink-900/80 p-6 sm:p-10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/25 bg-accent-500/[0.08] px-3.5 py-1 text-xs font-semibold text-accent-400">
              <SparklesIcon className="h-3.5 w-3.5" />
              GoSera Free Account
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Create Your Digital Identity
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Set up your profile, customize your NFC card link, and start capturing leads.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-purple-500/10 p-4 text-sm text-purple-300 border border-purple-500/20">
              {error}
            </div>
          )}

          {/* Google Sign-Up Button */}
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
            Sign up with Google
          </a>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0e0e12] px-3 text-xs uppercase tracking-wider text-white/40 absolute font-semibold">
              or register with email
            </span>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Kasun Perera"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="kasun@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Phone / WhatsApp */}
            <div>
              <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                Phone / WhatsApp Number
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+94 77 123 4567"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Card Subdomain Slug */}
            <div>
              <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                Your Preferred Card Link
              </label>
              <div className="flex items-stretch overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-accent-500 transition-colors">
                <div className="flex items-center pl-3.5 text-white/30">
                  <GlobeIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={form.cardSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder={form.name ? form.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14) : 'yourname'}
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-white/20 outline-none"
                />
                <span className="flex items-center border-l border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-accent-400 select-none">
                  .{rootDomain}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/40">
                Your live card: <span className="font-mono text-accent-400">https://{previewSlug}.{rootDomain}</span>
              </p>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                  Confirm *
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                  <input
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:border-accent-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_0_30px_-8px_rgba(168,85,247,0.8)] transition-all hover:bg-accent-400 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Creating your account...' : 'Create My Free Account'}
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.07] text-center text-sm text-white/50">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-accent-400 hover:underline">
              Sign In
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
