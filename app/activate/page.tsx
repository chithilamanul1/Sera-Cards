'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import {
  Sparkles,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

function ActivateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCode = searchParams.get('code') || '';
  const [code, setCode] = useState(initialCode);
  const [verifying, setVerifying] = useState(false);
  const [cardStatus, setCardStatus] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    slug: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'seranex.lk';

  // Verify code on mount or when code changes
  useEffect(() => {
    if (initialCode) {
      verifyCode(initialCode);
    }
  }, [initialCode]);

  const verifyCode = async (targetCode: string) => {
    if (!targetCode.trim()) return;
    setVerifying(true);
    try {
      const res = await fetch(`/api/activate?code=${encodeURIComponent(targetCode.trim())}`);
      const data = await res.json();
      if (res.ok && data.valid) {
        setCardStatus(data);
        if (data.status === 'UNCLAIMED') {
          toast.success('Genuine Sera NFC Hardware Verified!', { id: 'code-check' });
        }
      } else {
        setCardStatus({ valid: false, error: data.error || 'Invalid code' });
      }
    } catch {
      setCardStatus({ valid: false, error: 'Could not verify code' });
    } finally {
      setVerifying(false);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);
    setForm((prev) => ({ ...prev, slug: val }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const suggestedSlug = val.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug ? prev.slug : suggestedSlug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Please enter your card activation code.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          ...form,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Activation failed');
      }

      toast.success('Card Activated! Welcome to Sera Cards.', { duration: 4000 });
      setTimeout(() => {
        router.push(data.redirect || '/dashboard');
      }, 1200);
    } catch (err: any) {
      toast.error(err.message || 'Failed to activate card');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <Badge variant="purple" className="mb-3 px-3 py-1 font-semibold text-xs tracking-wide">
          <Zap className="h-3.5 w-3.5 mr-1 text-amber-400" />
          Hardware Activation Portal
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Activate Your Physical Sera Card
        </h1>
        <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
          Tap or enter the activation code printed on your packaging or card to claim your digital profile in under 60 seconds.
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-md">
        <CardHeader className="p-6 pb-4 border-b border-zinc-800/80">
          <CardTitle className="text-lg font-bold flex items-center justify-between">
            <span>Card Activation & Identity Setup</span>
            {cardStatus?.valid && cardStatus.status === 'UNCLAIMED' && (
              <Badge variant="success" className="text-[11px] font-semibold">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified Hardware
              </Badge>
            )}
            {cardStatus?.valid && cardStatus.status === 'ACTIVATED' && (
              <Badge variant="amber" className="text-[11px] font-semibold">
                Already Activated (@{cardStatus.assignedSlug})
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Link this physical chip to your personal or business microsite
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Activation Code Input */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-zinc-300">
                1. Activation Serial Code *
              </Label>
              <div className="flex gap-2">
                <Input
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setCode(val);
                  }}
                  onBlur={() => verifyCode(code)}
                  placeholder="e.g. SERA-7001"
                  className="font-mono text-sm tracking-wider uppercase bg-zinc-950 border-zinc-800 text-amber-300"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => verifyCode(code)}
                  disabled={verifying}
                  className="shrink-0"
                >
                  {verifying ? 'Checking...' : 'Verify'}
                </Button>
              </div>

              {cardStatus && !cardStatus.valid && (
                <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {cardStatus.error}
                </p>
              )}
            </div>

            {/* Profile Slug / Subdomain Handle */}
            <div className="space-y-1.5 pt-2">
              <Label className="text-xs uppercase tracking-wider text-zinc-300">
                2. Choose Your Subdomain Handle *
              </Label>
              <div className="flex rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 focus-within:border-purple-500">
                <input
                  type="text"
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="yourname"
                  className="w-full px-3.5 py-2.5 bg-transparent text-white font-mono text-sm outline-none"
                  required
                />
                <span className="px-3.5 flex items-center text-xs font-mono text-purple-400 bg-zinc-900 border-l border-zinc-800 select-none">
                  .{rootDomain}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Your live card address: <strong className="text-purple-300 font-mono">https://{form.slug || 'yourname'}.{rootDomain}</strong>
              </p>
            </div>

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Your Full Name *</Label>
                <div className="relative">
                  <User className="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    required
                    value={form.name}
                    onChange={handleNameChange}
                    placeholder="Kosala Fernando"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">WhatsApp / Phone *</Label>
                <div className="relative">
                  <Phone className="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0771169108"
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Account Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Email Address *</Label>
                <div className="relative">
                  <Mail className="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="kosala@gmail.com"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300">Create Password *</Label>
                <div className="relative">
                  <Lock className="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="purple"
                size="lg"
                disabled={submitting || (cardStatus?.status === 'ACTIVATED')}
                className="w-full font-bold shadow-lg text-sm"
              >
                {submitting ? 'Claiming & Activating Card...' : '⚡ Activate Card & Launch Profile'}
              </Button>
            </div>

            {cardStatus?.status === 'ACTIVATED' && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-xs text-amber-300">
                This card has already been activated. Looking to update your profile?{' '}
                <a href="/login" className="font-bold underline text-white ml-1">
                  Log in here &rarr;
                </a>
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="p-6 pt-0 border-t border-zinc-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            256-bit encrypted dynamic identity
          </span>
          <span>
            Already have an account?{' '}
            <a href="/login" className="text-purple-400 hover:underline font-semibold">
              Sign In
            </a>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      <Nav />
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6">
        <Toaster position="top-right" />
        <Suspense fallback={<div className="text-center text-zinc-500 py-20">Loading activation...</div>}>
          <ActivateForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
