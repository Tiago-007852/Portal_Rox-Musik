import React, { useState, useEffect } from "react";
import { Post, Category } from "../types";
import { ArrowDownToLine, Calendar, User, ArrowLeft, Facebook, Share2, Clipboard, ChevronRight } from "lucide-react";

interface PostPageProps {
  post: Post;
  allPosts: Post[];
  categories: Category[];
  onBack: () => void;
  onPostClick: (id: string) => void;
  config: { accentColor: string };
}

export default function PostPage({
  post,
  allPosts,
  categories,
  onBack,
  onPostClick,
  config,
}: PostPageProps) {
  const [copied, setCopied] = useState(false);

  // Scroll to top of the page when the selected post changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [post.id]);

  const catInfo = categories.find(
    (c) => c.nome.toUpperCase() === post.categoria.toUpperCase()
  );
  const badgeColor = catInfo ? catInfo.cor : config.accentColor;

  // Find 4 related posts of SAME category, excluding this active post!
  const relatedPosts = allPosts
    .filter((p) => p.categoria.toUpperCase() === post.categoria.toUpperCase() && p.id !== post.id)
    .slice(0, 4);

  // Sharer links
  const siteUrl = `${window.location.origin}${window.location.pathname}#/post/${post.id}`;
  const shareText = encodeURIComponent(`${post.titulo} de ${post.artista} — Disponível no ROX-MUSIK`);
  const shareUrl = encodeURIComponent(siteUrl);

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const waShareUrl = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
  const twShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      {/* Back button link */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#111] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-xs font-bold uppercase text-[#aaaaaa] hover:text-white transition-all w-max cursor-pointer"
      >
        <ArrowLeft size={14} /> Voltar
      </button>

      {/* Main Single grid info layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cover visualizer (Col Span 5) */}
        <div className="lg:col-span-5 bg-[#111] border border-[#2a2a2a] p-4.5 rounded-2xl">
          <div className="aspect-square rounded-xl overflow-hidden bg-[#161616] border border-[#2a2a2a]">
            <img
              src={post.capa}
              alt={post.titulo}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop";
              }}
            />
          </div>
        </div>

        {/* Lyrical details and specifications (Col Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            {/* Category badge */}
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded"
                style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}
              >
                {post.tipo && post.tipo !== "musica" ? post.tipo.toUpperCase() : post.categoria}
              </span>
              <span className="text-[10px] text-[#aaaaaa] font-mono">
                {post.tipo && post.tipo !== "musica" ? "Publicado em" : "Lançado em"} {post.data}
              </span>
            </div>

            {/* Title & Artist details */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-widest uppercase leading-snug">
                {post.titulo}
              </h1>
              {post.tipo && post.tipo !== "musica" ? (
                <div className="space-y-2 pt-1">
                  {post.artista && (
                    <p className="text-sm text-zinc-300 font-bold">
                      Assunto/Artista: <span style={{ color: config.accentColor }}>{post.artista}</span>
                    </p>
                  )}
                  {post.autor && (
                    <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                      Por: <span className="text-zinc-200 font-bold">{post.autor}</span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-md sm:text-xl font-bold flex items-center gap-1.5 animate-fade-in" style={{ color: config.accentColor }}>
                  <User size={16} />
                  {post.artista}
                </p>
              )}
              {!post.tipo || post.tipo === "musica" ? (
                post.produtor && (
                  <p className="text-[11px] text-zinc-450 uppercase font-black tracking-widest mt-1">
                    Produtor: <span className="text-zinc-300 font-bold">{post.produtor}</span>
                  </p>
                )
              ) : null}
            </div>
          </div>

          {/* News Subtitle if any */}
          {post.tipo && post.tipo !== "musica" && post.subtitulo && (
            <div className="border-l-4 border-emerald-500/50 pl-4 py-1">
              <p className="text-zinc-400 text-xs sm:text-sm font-semibold italic leading-relaxed">
                "{post.subtitulo}"
              </p>
            </div>
          )}

          {/* Description / Content details */}
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5 space-y-3.5">
            <h3 className="text-[10px] font-black tracking-widest uppercase text-[#aaaaaa]">
              {post.tipo && post.tipo !== "musica" ? "Conteúdo da Matéria" : "Descrição / Ficha Técnica"}
            </h3>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
              {post.tipo && post.tipo !== "musica" 
                ? (post.conteudo || post.descricao || "Sem mais detalhes disponíveis para este artigo.") 
                : (post.descricao || "Nenhuma descrição adicional foi fornecida para este trabalho musical.")}
            </p>
          </div>

          {/* BIG Download promotional CTA - ONLY renders if type is music or undefined */}
          {(!post.tipo || post.tipo === "musica") ? (
            <a
              href={post.linkDownload.trim().startsWith("http://") || post.linkDownload.trim().startsWith("https://") ? post.linkDownload.trim() : `https://${post.linkDownload.trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                const url = post.linkDownload.trim().startsWith("http://") || post.linkDownload.trim().startsWith("https://") ? post.linkDownload.trim() : `https://${post.linkDownload.trim()}`;
                window.open(url, "_blank");
              }}
              className="flex items-center justify-center gap-2.5 w-full bg-[#00e5a0] text-black font-display font-black tracking-widest text-xs py-4.5 rounded-xl uppercase hover:scale-[1.01] hover:bg-emerald-300 active:scale-[0.99] transition-all cursor-pointer text-center leading-none"
              style={{ backgroundColor: config.accentColor }}
            >
              <ArrowDownToLine size={16} strokeWidth={2.5} /> Baixar Música / Ouvir Streaming
            </a>
          ) : (
            post.linkDownload && post.linkDownload.trim() !== "" && post.linkDownload !== "#" && (
              <a
                href={post.linkDownload.trim().startsWith("http://") || post.linkDownload.trim().startsWith("https://") ? post.linkDownload.trim() : `https://${post.linkDownload.trim()}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  const url = post.linkDownload.trim().startsWith("http://") || post.linkDownload.trim().startsWith("https://") ? post.linkDownload.trim() : `https://${post.linkDownload.trim()}`;
                  window.open(url, "_blank");
                }}
                className="flex items-center justify-center gap-2 p-3 bg-zinc-900 border border-[#2a2a2a] text-xs font-bold text-zinc-350 hover:text-white hover:bg-zinc-800 transition-all rounded-lg cursor-pointer"
              >
                Visitar Link de Referência / Fonte de Informação
              </a>
            )
          )}

          {/* Share links deck element */}
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5 space-y-3">
            <h4 className="text-[10px] font-black tracking-widest uppercase text-[#aaaaaa] flex items-center gap-1.5">
              <Share2 size={12} /> Partilhar com a Banda
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* WhatsApp sharer */}
              <a
                href={waShareUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex items-center justify-center gap-2 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/15 hover:border-[#25D366]/25 rounded-lg text-[#25D366] text-xs font-semibold cursor-pointer transition-colors"
              >
                WhatsApp
              </a>

              {/* Facebook sharer */}
              <a
                href={fbShareUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex items-center justify-center gap-2 py-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/15 hover:border-[#1877F2]/25 rounded-lg text-[#1877F2] text-xs font-semibold cursor-pointer transition-colors"
              >
                Facebook
              </a>

              {/* Twitter sharer */}
              <a
                href={twShareUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex items-center justify-center gap-2 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/15 hover:border-sky-500/25 rounded-lg text-sky-400 text-xs font-semibold cursor-pointer transition-colors"
              >
                Twitter (X)
              </a>

              {/* Copy links */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 py-2 bg-zinc-900 border border-[#2a2a2a] rounded-lg text-zinc-300 text-xs font-semibold hover:text-white hover:bg-zinc-850 cursor-pointer transition-colors"
                style={copied ? { borderColor: config.accentColor, color: config.accentColor } : {}}
              >
                <Clipboard size={12} /> {copied ? "Copiado!" : "Copiar Link"}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Related Posts: "Podes gostar também" */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#1a1a1a]">
          <h3 className="text-xs font-black tracking-widest uppercase text-white flex items-center gap-2">
            <span className="w-1.5 h-3.5 rounded-full" style={{ backgroundColor: badgeColor }} />
            Podes Gostar Também
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedPosts.map((rPost) => (
              <div
                key={rPost.id}
                onClick={() => onPostClick(rPost.id)}
                className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden cursor-pointer group hover:border-[#383838] transition-all"
              >
                <div className="aspect-square overflow-hidden bg-[#181818] relative">
                  <img
                    src={rPost.capa}
                    alt={rPost.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&auto=format&fit=crop";
                    }}
                  />
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-black text-white truncate uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                    {rPost.titulo}
                  </h4>
                  <p className="text-[10px] text-[#aaaaaa] truncate font-bold">{rPost.artista}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
