import React from "react";
import { Facebook, Instagram, Youtube, Phone, Mail, Pin, MessageSquare } from "lucide-react";
import { SiteConfig, Category } from "../types";
import { motion } from "motion/react";

interface FooterProps {
  config: SiteConfig;
  categories: Category[];
  navigate: (routeName: string, param?: string) => void;
}

export default function Footer({ config, categories, navigate }: FooterProps) {
  return (
    <footer className="bg-[#0b0b0b] border-t border-[#2a2a2a] pt-14 pb-8 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Column 1: Sobre o Portal */}
          <div>
            <h4 className="text-xl font-black font-display tracking-widest text-white mb-4 uppercase">
              <span style={{ color: config.accentColor }}>R</span>
              OX-MUSIK
            </h4>
            <p className="text-[#aaaaaa] leading-relaxed mb-4 text-xs">
              {config.slogan} — O maior e mais influente portal de novidades e lançamentos musicais em Angola. 
              Trazendo o melhor do Kuduro, Kizomba, Afro House, Zouk, Álbuns, Mixtapes e EPs directamente das ruas de Luanda para o mundo.
            </p>
            {/* Social Circle Links */}
            <div className="flex items-center space-x-3">
              <a
                href={config.facebook}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#aaaaaa] hover:text-white hover:bg-[#1877F2] flex items-center justify-center transition-all hover:scale-105"
              >
                <Facebook size={16} />
              </a>
              <a
                href={config.instagram}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#aaaaaa] hover:text-white hover:bg-gradient-to-tr hover:from-orange-500 hover:to-pink-500 flex items-center justify-center transition-all hover:scale-105"
              >
                <Instagram size={16} />
              </a>
              <a
                href={config.youtube}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#aaaaaa] hover:text-white hover:bg-[#FF0000] flex items-center justify-center transition-all hover:scale-105"
              >
                <Youtube size={16} />
              </a>
              <a
                href={config.whatsapp}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#aaaaaa] hover:text-white hover:bg-[#25D366] flex items-center justify-center transition-all hover:scale-105"
              >
                <MessageSquare size={16} />
              </a>
              <a
                href={config.pinterest}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#aaaaaa] hover:text-white hover:bg-[#E60023] flex items-center justify-center transition-all hover:scale-105"
              >
                <Pin size={16} className="rotate-45" />
              </a>
            </div>
          </div>

          {/* Column 2: Links Rápidos */}
          <div>
            <h5 className="text-xs font-black tracking-widest uppercase text-white mb-4.5 flex items-center gap-2">
              <span className="w-1 h-3 rounded-full" style={{ backgroundColor: config.accentColor }}></span>
              Navegação e Géneros
            </h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <button
                onClick={() => navigate("home")}
                className="text-left text-[#aaaaaa] hover:text-white transition-colors py-0.5"
              >
                Início (Home)
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate("category", cat.nome)}
                  className="text-left text-[#aaaaaa] hover:text-white transition-colors py-0.5 flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: cat.cor }} />
                  {cat.nome}
                </button>
              ))}
              <button
                onClick={() => navigate("admin")}
                className="text-left text-[#aaaaaa] hover:text-white transition-colors py-0.5"
              >
                Painel Admin
              </button>
            </div>
          </div>

          {/* Column 3: Contacto */}
          <div className="space-y-4 text-xs">
            <h5 className="text-xs font-black tracking-widest uppercase text-white flex items-center gap-2">
              <span className="w-1 h-3 rounded-full" style={{ backgroundColor: config.accentColor }}></span>
              Contacto Direto
            </h5>
            <p className="text-[#aaaaaa] leading-relaxed">
              Trabalha com promoções musicais, entrevistas ou parcerias? Entre em contacto connosco agora mesmo.
            </p>
            <div className="space-y-2.5">
              <a href={`mailto:${config.email}`} className="flex items-center gap-2 text-[#aaaaaa] hover:text-white transition-colors">
                <Mail size={14} className="text-emerald-400" style={{ color: config.accentColor }} />
                <span className="font-mono">{config.email}</span>
              </a>
              <a href={`tel:${config.telefone}`} className="flex items-center gap-2 text-[#aaaaaa] hover:text-white transition-colors">
                <Phone size={14} className="text-[#ff6b35]" />
                <span className="font-mono">{config.telefone}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-[#1c1c1c] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[11px] text-[#aaaaaa] font-medium leading-relaxed uppercase tracking-wider">
            © 2025 <span className="text-white font-bold">{config.siteName}</span> — Todos os direitos reservados
          </p>
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase flex items-center gap-1.5 justify-center md:justify-end">
            <span>Desenvolvido por</span>
            <span className="[perspective:1000px] inline-block">
              <motion.a
                href="https://portofolio007.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{
                  scale: 1.1,
                  rotateX: 18,
                  rotateY: -18,
                  translateZ: 20,
                  color: "#ffffff",
                  boxShadow: `0px 12px 24px rgba(0,0,0,0.85), 0px 0px 20px ${(config.accentColor || "#00e5a0")}45`,
                }}
                whileTap={{
                  scale: 0.93,
                  rotateX: 0,
                  rotateY: 0,
                  translateZ: 0,
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.9)",
                }}
                transition={{ type: "spring", stiffness: 380, damping: 14 }}
                className="text-zinc-400 font-extrabold bg-[#131313] border border-[#2a2a2a]/90 px-3 py-1.5 rounded-lg cursor-pointer transition-all inline-block hover:border-zinc-500 select-none relative overflow-hidden group"
              >
                {/* 3D layer for absolute gloss sweep reflection */}
                <motion.span 
                  className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-25 pointer-events-none"
                  style={{ transform: "translateZ(5px)" }}
                  initial={{ left: "-150%" }}
                  whileHover={{ left: "150%" }}
                  transition={{ duration: 0.85, ease: "easeOut" }}
                />

                {/* Ambient glow border following site color accents */}
                <span 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-white/10"
                  style={{ transform: "translateZ(2px)" }}
                />

                {/* Floating 3D Text segment */}
                <span 
                  className="relative inline-block leading-none tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" 
                  style={{ transform: "translateZ(14px)" }}
                >
                  António Miguel
                </span>
              </motion.a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
