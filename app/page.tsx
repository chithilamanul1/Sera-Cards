export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50 font-sans">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
          Sera Cards
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          Dynamic digital business card engine.
        </p>
        <div className="mt-8">
          <a href="/admin" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors border border-zinc-800 px-4 py-2 rounded-full">
            Staff Login
          </a>
        </div>
      </div>
    </div>
  );
}
