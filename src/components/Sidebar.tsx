import React from "react";
import { ArrowDownToLine, Phone, Mail, Facebook, Instagram, Youtube, Pin, MessageSquare } from "lucide-react";
import { Post, SiteConfig } from "../types";

interface SidebarProps {
  posts: Post[];
  config: SiteConfig;
  onPostClick: (id: string) => void;
}

export default function Sidebar({ posts, config, onPostClick }: SidebarProps) {
  // Sort posts by download count (descending) and get top 5 - only music posts
  const musicPosts = posts.filter((p) => !p.tipo || p.tipo === "musica");
  const topDownloaded = [...musicPosts]
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 5);

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-8">
      {/* Widget: Mais Baixados */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#aaaaaa] border-b border-[#2a2a2a] pb-2 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-3.5 rounded-sm" style={{ backgroundColor: config.accentColor }}></span>
          Mais Baixados
        </h3>
        <div className="space-y-4">
          {topDownloaded.map((post, idx) => (
            <div
              key={post.id}
              onClick={() => onPostClick(post.id)}
              className="flex items-center gap-4 group cursor-pointer hover:bg-[#1a1a1a]/55 p-1 rounded-lg transition-all"
            >
              {/* Ranking Number */}
              <div className="text-2xl font-black text-[#222222] min-w-[28px] text-center transition-colors group-hover:text-zinc-650"
                style={{
                  color: idx === 0 ? `${config.accentColor}dd` : undefined,
                }}>
                0{idx + 1}
              </div>

              {/* Cover thumbnail */}
              <img
                src={post.capa}
                alt={post.titulo}
                className="w-10 h-10 object-cover rounded-md border border-[#2a2a2a]"
              />

              {/* Post Metadata */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors"
                    style={{ '--hover-color': config.accentColor } as React.CSSProperties}>
                  {post.titulo}
                </h4>
                <p className="text-[10px] text-[#aaaaaa] uppercase truncate">{post.artista}</p>
              </div>

              {/* Downloads Badge */}
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                {post.downloads ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Widget: Redes Sociais */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#aaaaaa] border-b border-[#2a2a2a] pb-2 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-3.5 rounded-sm" style={{ backgroundColor: config.accentColor }}></span>
          Siga-nos
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {/* Facebook */}
          <a
            href={config.facebook}
            target="_blank"
            referrerPolicy="no-referrer"
            className="bg-[#1877F2]/10 text-[#1877F2] text-[10px] font-bold p-2.5 rounded flex items-center justify-center gap-2 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 transition-all text-center leading-none"
          >
            FACEBOOK
          </a>

          {/* Instagram */}
          <a
            href={config.instagram}
            target="_blank"
            referrerPolicy="no-referrer"
            className="bg-pink-500/10 text-pink-500 text-[10px] font-bold p-2.5 rounded flex items-center justify-center gap-2 border border-pink-500/20 hover:bg-pink-500/20 transition-all text-center leading-none"
          >
            INSTAGRAM
          </a>

          {/* YouTube */}
          <a
            href={config.youtube}
            target="_blank"
            referrerPolicy="no-referrer"
            className="bg-[#FF0000]/10 text-[#FF0000] text-[10px] font-bold p-2.5 rounded flex items-center justify-center gap-2 border border-[#FF0000]/20 hover:bg-[#FF0000]/20 transition-all text-center leading-none"
          >
            YOUTUBE
          </a>

          {/* WhatsApp */}
          <a
            href={config.whatsapp}
            target="_blank"
            referrerPolicy="no-referrer"
            className="bg-[#25D366]/10 text-[#25D366] text-[10px] font-bold p-2.5 rounded flex items-center justify-center gap-2 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all text-center leading-none"
          >
            WHATSAPP
          </a>
        </div>
      </div>

      {/* Widget: Contacto */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#aaaaaa] border-b border-[#2a2a2a] pb-2 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-3.5 rounded-sm" style={{ backgroundColor: config.accentColor }}></span>
          Contacto Oficial
        </h3>
        <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a] space-y-1">
          <p className="text-[10px] text-[#aaaaaa] uppercase font-bold tracking-widest leading-none">Contacto Profissional</p>
          <a href={`mailto:${config.email}`} className="block text-xs font-medium text-white hover:underline truncate">
            {config.email}
          </a>
          <a href={`tel:${config.telefone}`} className="block text-sm font-black mt-1 tracking-wider hover:underline" style={{ color: config.accentColor }}>
            {config.telefone}
          </a>
        </div>
      </div>
    </aside>
  );
}
