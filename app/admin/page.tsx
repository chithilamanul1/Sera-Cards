'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type Card = {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export default function AdminDashboard() {
  const [secret, setSecret] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [slug, setSlug] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'serenex.lk';

  // Check session storage on mount
  useEffect(() => {
    const savedSecret = sessionStorage.getItem('adminSecret');
    if (savedSecret) {
      setSecret(savedSecret);
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch cards when authenticated
  useEffect(() => {
    if (isAuthenticated && secret) {
      fetchCards();
    }
  }, [isAuthenticated, secret]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cards', {
        headers: { 'x-admin-secret': secret },
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Invalid admin secret');
          handleLogout();
          return;
        }
        throw new Error('Failed to fetch cards');
      }
      
      const data = await res.json();
      setCards(data);
    } catch (error) {
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) {
      sessionStorage.setItem('adminSecret', secret);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminSecret');
    setSecret('');
    setIsAuthenticated(false);
    setCards([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim() || !htmlContent.trim()) {
      toast.error('Slug and HTML content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ slug, html_content: htmlContent }),
      });

      if (!res.ok) throw new Error('Failed to save card');
      
      toast.success('Card deployed successfully!');
      setSlug('');
      setHtmlContent('');
      fetchCards();
    } catch (error) {
      toast.error('Failed to deploy card');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret },
      });

      if (!res.ok) throw new Error('Failed to delete card');
      
      toast.success('Card deleted');
      setCards(cards.filter(c => c.id !== id));
    } catch (error) {
      toast.error('Failed to delete card');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <h1 className="text-2xl font-bold mb-6 text-center">Sera Cards Admin</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Admin Secret</label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-100"
                placeholder="Enter password..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12">
      <Toaster position="top-right" toastOptions={{ style: { background: '#27272a', color: '#fff' } }} />
      
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Sera Cards Engine
          </h1>
          <p className="text-zinc-400 mt-1">Manage dynamic digital business cards</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <section className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">Deploy New Card</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Slug (Client Name)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="e.g. pradeep"
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-100 placeholder-zinc-600 font-mono text-sm"
                required
              />
              {slug && (
                <div className="mt-2 flex flex-col gap-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    https://{slug}.{rootDomain}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                    https://{rootDomain}/c/{slug}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Raw HTML Content</label>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="<!DOCTYPE html>\n<html>\n  <body>...</body>\n</html>"
                className="w-full h-64 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-300 font-mono text-sm resize-y"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
            >
              {isSubmitting ? 'Deploying...' : 'Deploy Card'}
            </button>
          </form>
        </section>

        {/* Right Column: Table */}
        <section className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
            <span>Active Cards</span>
            <span className="text-sm bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full">{cards.length} Total</span>
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-sm text-zinc-500">
                  <th className="pb-3 font-medium">Slug</th>
                  <th className="pb-3 font-medium">Links</th>
                  <th className="pb-3 font-medium">Updated</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading && cards.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-500">Loading cards...</td>
                  </tr>
                ) : cards.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-500">No cards deployed yet.</td>
                  </tr>
                ) : (
                  cards.map((card) => (
                    <tr key={card.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="py-4 font-mono text-emerald-400">{card.slug}</td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          <a href={`http://${card.slug}.${rootDomain}:3000`} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white truncate max-w-[200px]">
                            {card.slug}.{rootDomain}
                          </a>
                        </div>
                      </td>
                      <td className="py-4 text-zinc-500">
                        {new Date(card.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 rounded bg-red-400/10 hover:bg-red-400/20 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
