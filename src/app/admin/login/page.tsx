"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Glasses } from "lucide-react";
import { supabase } from "@shared/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/admin");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-pink transform rotate-3 border-2 border-white/20 shadow-[4px_4px_0_rgba(255,0,182,0.3)]" />
            <div className="relative w-12 h-12 bg-[#1a1a1a] border-2 border-white/20 flex items-center justify-center transform -rotate-1">
              <Glasses size={22} className="text-brand-pink" />
            </div>
          </div>
          <div>
            <p className="font-poppins font-black text-xl text-white uppercase tracking-wider leading-none">
              Serena
            </p>
            <p className="font-inter text-[10px] text-brand-pink uppercase tracking-widest">
              Painel Admin
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#1a1a1a] border-4 border-brand-pink shadow-[8px_8px_0_rgba(255,0,182,0.4)] p-8">
          <h1 className="font-poppins font-black text-base text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <Lock size={14} className="text-brand-pink" />
            Entrar no painel
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-poppins text-xs font-bold uppercase tracking-wider text-gray-400">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@serenaglasses.com"
                className="w-full bg-[#0f0f0f] border-2 border-white/20 px-4 py-3 font-inter text-sm text-white placeholder:text-gray-600 outline-none focus:border-brand-pink transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-poppins text-xs font-bold uppercase tracking-wider text-gray-400">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[#0f0f0f] border-2 border-white/20 px-4 py-3 font-inter text-sm text-white placeholder:text-gray-600 outline-none focus:border-brand-pink transition-colors"
              />
            </div>

            {error && (
              <p className="font-poppins text-xs font-semibold text-red-400 border border-red-500/30 bg-red-500/10 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-4 mt-2 font-poppins text-sm font-black uppercase tracking-widest border-4 border-brand-pink bg-brand-pink text-white shadow-[4px_4px_0_rgba(255,255,255,0.1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0_rgba(255,255,255,0.1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
