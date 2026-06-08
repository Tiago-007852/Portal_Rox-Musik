import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldAlert, KeyRound, LogIn } from "lucide-react";
import { SiteConfig } from "../types";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  config: SiteConfig;
}

export default function AdminLogin({ onLoginSuccess, config }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const metaEnv = (import.meta as any).env;
      const allowedUser = (metaEnv && metaEnv.VITE_ADMIN_USER) || "admin";
      const allowedPass = (metaEnv && metaEnv.VITE_ADMIN_PASS) || "roxmusik2025";
      
      const isSystemAdmin = username === allowedUser && password === allowedPass;
      const isStefanyAdmin = username === "Stefany do Santos" && password === "Stefany-admin";

      if (isSystemAdmin || isStefanyAdmin) {
        onLoginSuccess();
      } else {
        setError("Utilizador ou Senha inválidos. Tente novamente.");
        setLoading(false);
      }
    }, 600);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user?.email || "";
      const allowedEmails = ["tiagopw07@gmail.com", "nelmariotanganica@gmail.com", "estefaniatinguita@gmail.com"];
      
      // Let any verified user through, or check for specific admin email list for extra safety
      if (allowedEmails.includes(email.toLowerCase()) || result.user?.emailVerified) {
        onLoginSuccess();
      } else {
        setError(`A conta ${email} não tem permissões de administrador de escrita.`);
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erro de autenticação com o provedor Google.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#00e5a0]/30 transition-all shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="inline-flex p-3 bg-emerald-500/10 rounded-xl mb-4 text-[#00e5a0]" style={{ color: config.accentColor, backgroundColor: `${config.accentColor}15` }}>
            <KeyRound size={28} />
          </div>
          <h2 className="text-2xl font-black font-display tracking-widest text-white uppercase">
            ROX-ADMIN
          </h2>
          <p className="text-[#aaaaaa] text-xs mt-1 uppercase tracking-wider font-semibold">
            Portal Control Center — Inicie Sessão
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5 animate-shake">
            <ShieldAlert size={16} className="shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* 1. Google Authentication Action Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-zinc-200 transition-all font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-lg flex items-center justify-center gap-2.5 shadow-md cursor-pointer select-none"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 10.285zm0-10.285C5.48 0 0 5.480 0 12.24s5.48 12.24 12.24 12.24 12.24-5.48 12.24-12.24S19 0 12.24 0zm0 21.085c-4.887 0-8.845-3.959-8.845-8.845s3.958-8.845 8.845-8.845c2.4 0 4.543.882 6.2 2.457l-2.457 2.457c-.982-.942-2.28-1.514-3.743-1.514-3.15 0-5.714 2.564-5.714 5.714s2.564 5.714 5.714 5.714c3.313 0 5.174-2.029 5.457-4.143H12.24V10.285h9.057c.1.514.172 1.057.172 1.686 0 5.514-3.686 9.114-9.23 9.114z"/>
            </svg>
            Entrar com Conta Google
          </button>
        </div>

        {/* Divider standard OR style */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-b border-[#2a2a2a]/80" />
          <span className="text-[9px] text-[#555555] uppercase font-bold tracking-widest leading-none">OU</span>
          <div className="flex-1 border-b border-[#2a2a2a]/80" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <div>
            <label className="block text-[11px] font-black tracking-widest uppercase text-[#aaaaaa] mb-2">
              Utilizador
            </label>
            <input
              type="text"
              required
              placeholder="Ex: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black tracking-widest uppercase text-[#aaaaaa] mb-2">
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Introduza a sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white pl-4 pr-10 py-3 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-display font-black tracking-widest text-[#0a0a0a] py-3.5 px-4 rounded-lg text-xs uppercase transition-all duration-250 cursor-pointer disabled:opacity-50 relative overflow-hidden flex items-center justify-center gap-1.5"
            style={{ backgroundColor: config.accentColor }}
          >
            <LogIn size={14} />
            {loading ? "A Autenticar..." : "Aceder com Credenciais"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#1e1e1e] pt-6">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
            ROX-MUSIK • SECURE PORTAL
          </p>
        </div>
      </div>
    </div>
  );
}

