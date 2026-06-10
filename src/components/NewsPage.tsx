import React, { useState, useEffect } from "react";
import { Post, SiteConfig, Category } from "../types";
import { Calendar, User, ArrowRight, MessageSquare, Newspaper, Tv, ChevronLeft, ChevronRight } from "lucide-react";

interface NewsPageProps {
  tipo: "noticia" | "entretenimento";
  posts: Post[];
  config: SiteConfig;
  onPostClick: (id: string) => void;
  navigate: (routeName: string, param?: string) => void;
}

export default function NewsPage({
  tipo,
  posts,
  config,
  onPostClick,
  navigate,
}: NewsPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [tipo]);

  // Filter posts of correct type
  const filteredPosts = posts.filter((p) => p.tipo === tipo);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  // Find featured post of this type (or fallback to latest)
  const featuredPost = filteredPosts.find((p) => p.destaque) || filteredPosts[0];
  const listItems = featuredPost 
    ? filteredPosts.filter((p) => p.id !== featuredPost.id) 
    : filteredPosts;

  const currentListItems = listItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalListPages = Math.ceil(listItems.length / itemsPerPage);

  const titleText = tipo === "noticia" ? "Notícias ROX" : "Entretenimento";
  const subtitleText = 
    tipo === "noticia" 
      ? "Fique por dentro das novidades, lançamentos e informações do mundo da música" 
      : "Entrevistas, tendências, fofocas e bastidores dos teus artistas favoritos";

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      
      {/* Editorial Header */}
      <div className="border-b border-[#2a2a2a] pb-6 space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-900 border border-[#2a2a2a]" style={{ color: config.accentColor }}>
            {tipo === "noticia" ? <Newspaper size={20} /> : <Tv size={20} />}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-tighter text-white">
            {titleText}
          </h1>
        </div>
        <p className="text-zinc-400 text-xs sm:text-sm">
          {subtitleText}
        </p>
      </div>

      {/* Featured Big Article Card */}
      {featuredPost && currentPage === 1 && (
        <div 
          onClick={() => onPostClick(featuredPost.id)}
          className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#111111] border border-[#2a2a2a] hover:border-zinc-700 rounded-2xl overflow-hidden transition-all duration-300"
        >
          {/* Cover Section */}
          <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-[#181818] relative">
            <img 
              src={featuredPost.capa} 
              alt={featuredPost.titulo} 
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
            />
            <span 
              className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded shadow"
              style={{ backgroundColor: config.accentColor, color: "#000" }}
            >
              Destaque
            </span>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {featuredPost.data}
                </span>
                {featuredPost.autor && (
                  <span className="flex items-center gap-1 border-l border-zinc-800 pl-3">
                    <User size={12} /> {featuredPost.autor}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-display text-white uppercase group-hover:text-emerald-400 transition-colors leading-snug"
                style={{ "--hover-color": config.accentColor } as React.CSSProperties}>
                {featuredPost.titulo}
              </h2>

              {featuredPost.subtitulo && (
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans line-clamp-3">
                  {featuredPost.subtitulo}
                </p>
              )}

              <p className="text-zinc-500 text-xs font-sans line-clamp-2">
                {featuredPost.descricao}
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest" style={{ color: config.accentColor }}>
                Ler Artigo Completo <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid list */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#aaaaaa] border-b border-[#2a2a2a] pb-2 flex items-center gap-2">
          Mais Publicações
        </h3>

        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#111] rounded-2xl border border-[#2a2a2a]">
            <p className="text-zinc-500 text-xs font-mono">Sem publicações de {tipo === "noticia" ? "notícias" : "entretenimento"} no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentListItems.map((post) => (
              <div 
                key={post.id}
                onClick={() => onPostClick(post.id)}
                className="group cursor-pointer bg-[#111111] border border-[#2a2a2a] hover:border-zinc-800 rounded-xl overflow-hidden flex flex-col sm:flex-row transition-all duration-300 gap-4 p-3"
              >
                {/* Thumb Cover */}
                <div className="w-full sm:w-32 aspect-video sm:aspect-square shrink-0 rounded-lg overflow-hidden bg-[#181818]">
                  <img 
                    src={post.capa} 
                    alt={post.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop";
                    }}
                  />
                </div>

                {/* Article Info */}
                <div className="flex-1 flex flex-col justify-between py-1 space-y-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 text-[9px] text-zinc-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> {post.data}
                      </span>
                      {post.autor && (
                        <span className="flex items-center gap-1 border-l border-zinc-800 pl-2">
                          <User size={10} /> {post.autor}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold uppercase text-white group-hover:text-emerald-400 transition-colors line-clamp-2"
                      style={{ "--hover-color": config.accentColor } as React.CSSProperties}>
                      {post.titulo}
                    </h4>

                    {post.subtitulo && (
                      <p className="text-[11px] text-zinc-400 font-sans line-clamp-1">
                        {post.subtitulo}
                      </p>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-zinc-500 group-hover:text-white transition-colors">
                    Ler tudo <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination bar */}
        {totalListPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded bg-[#111]/80 border border-[#2a2a2a] text-[#aaaaaa] disabled:opacity-40 hover:text-white hover:bg-[#1a1a1a] transition-all cursor-pointer disabled:pointer-events-none"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalListPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 font-display font-black text-xs rounded transition-all cursor-pointer ${
                  currentPage === i + 1
                    ? "text-black font-extrabold"
                    : "bg-[#111]/85 border border-[#2a2a2a] text-[#aaaaaa] hover:text-white hover:bg-[#1a1a1a]"
                }`}
                style={currentPage === i + 1 ? { backgroundColor: config.accentColor } : {}}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalListPages, p + 1))}
              disabled={currentPage === totalListPages}
              className="p-2 rounded bg-[#111]/80 border border-[#2a2a2a] text-[#aaaaaa] disabled:opacity-40 hover:text-white hover:bg-[#1a1a1a] transition-all cursor-pointer disabled:pointer-events-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
