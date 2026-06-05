import React, { useState, useEffect } from "react";
import { Post, SiteConfig, Category } from "../types";
import { ArrowDownToLine, Calendar, Music, ArrowRight, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface HomePageProps {
  posts: Post[];
  categories: Category[];
  config: SiteConfig;
  onPostClick: (id: string) => void;
  navigate: (routeName: string, param?: string) => void;
}

export default function HomePage({
  posts,
  categories,
  config,
  onPostClick,
  navigate,
}: HomePageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Reset pagination to first page when component is mounted
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Find featured post
  const featuredPost = posts.find((p) => p.destaque) || posts[0];

  // Latest releases (exclude featured post to avoid duplication, or keep all, let's keep all but sort by newest date)
  const sortedNewest = [...posts].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedNewest.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedNewest.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of list smoothly
    const listEl = document.getElementById("ultimos-lancamentos");
    if (listEl) {
      listEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-12 animate-fade-in font-sans">
      
      {/* 1. HERO SECTION (Post em Destaque) */}
      {featuredPost && (
        <div 
          onClick={() => onPostClick(featuredPost.id)}
          className="relative rounded-2xl overflow-hidden cursor-pointer group border border-[#222] hover:border-emerald-500/20 transition-all shadow-2xl h-[450px] flex items-end"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={featuredPost.capa} 
              alt={featuredPost.titulo} 
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
            />
            {/* Elegant dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          {/* Featured Content details */}
          <div className="relative p-6 sm:p-10 w-full z-10 space-y-4">
            {/* Category badge */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0a0a0a] px-3 py-1 rounded bg-[#00e5a0] shadow-md font-display"
                style={{
                  backgroundColor: categories.find(c => c.nome.toUpperCase() === featuredPost.categoria.toUpperCase())?.cor || config.accentColor
                }}>
                Destaque • {featuredPost.categoria}
              </span>
              <span className="text-[10px] font-mono text-zinc-300 bg-black/40 px-2 py-1 rounded border border-white/5 flex items-center gap-1">
                <Calendar size={11} /> {featuredPost.data}
              </span>
            </div>

            {/* Info and Artiste */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-black font-display text-white tracking-widest uppercase truncate max-w-4xl drop-shadow-md">
                {featuredPost.titulo}
              </h2>
              <p className="text-sm sm:text-lg text-emerald-400 font-semibold drop-shadow" style={{ color: config.accentColor }}>
                {featuredPost.artista}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl line-clamp-2">
              {featuredPost.descricao}
            </p>

            {/* Stream trigger */}
            <div className="pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPostClick(featuredPost.id);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-black bg-[#00e5a0] shadow-lg hover:shadow-[#00e5a0]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                style={{ backgroundColor: config.accentColor }}
              >
                <Play size={13} fill="currentColor" /> Ouvir / Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ÚLTIMOS LANÇAMENTOS SECTION */}
      <div id="ultimos-lancamentos" className="space-y-6 scroll-mt-24">
        <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
          <h3 className="text-lg font-black font-display uppercase tracking-tighter italic flex items-center gap-2" style={{ color: config.accentColor }}>
            Últimos Lançamentos
          </h3>
          <span className="text-[10px] text-[#aaaaaa] font-mono font-bold uppercase tracking-wider bg-[#111] px-2.5 py-1 rounded border border-[#2a2a2a]">
            Página {currentPage} de {totalPages || 1}
          </span>
        </div>

        {/* Dynamic Card Releases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.length === 0 ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[#1a1a1a] p-3 rounded-xl border border-[#2a2a2a] flex flex-col gap-3 animate-pulse"
              >
                <div className="relative aspect-square rounded-lg bg-[#1a1a1a] overflow-hidden">
                  <div className="w-full h-full bg-[#222]" />
                </div>
                <div className="flex flex-col justify-between flex-1 gap-1">
                  <div className="space-y-2">
                    <div className="h-4 bg-[#222] rounded w-3/4 min-h-[1.5rem]" />
                    <div className="h-3 bg-[#222] rounded w-1/2" />
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#2a2a2a]/55 flex justify-between items-center">
                    <div className="h-3 bg-[#222] rounded w-1/4" />
                    <div className="w-4 h-4 bg-[#222] rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            currentPosts.map((post) => {
              const catInfo = categories.find((c) => c.nome.toUpperCase() === post.categoria.toUpperCase());
              const badgeCor = catInfo ? catInfo.cor : config.accentColor;

              return (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post.id)}
                  className="bg-[#1a1a1a] p-3 rounded-xl border border-[#2a2a2a] flex flex-col gap-3 group cursor-pointer hover:border-[#3a3a3a] hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-[#181818]">
                    <img
                      src={post.capa}
                      alt={post.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop";
                      }}
                    />
                    {/* Category overlay badge */}
                    <span
                      className="absolute top-2 left-2 text-[8px] font-bold px-2 py-0.5 rounded uppercase text-white shadow"
                      style={{ backgroundColor: badgeCor }}
                    >
                      {post.categoria}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-col justify-between flex-1 gap-1">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors min-h-[2.5rem] line-clamp-2"
                          style={{ '--hover-color': config.accentColor } as React.CSSProperties}>
                        {post.titulo}
                      </h3>
                      <p className="text-xs text-[#aaaaaa] truncate">{post.artista}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#2a2a2a]/55 flex justify-between items-center text-[#555555]">
                      <span className="text-[9px] font-semibold">{post.data}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = post.linkDownload.trim().startsWith("http://") || post.linkDownload.trim().startsWith("https://") ? post.linkDownload.trim() : `https://${post.linkDownload.trim()}`;
                          window.open(url, "_blank");
                        }}
                        className="text-[#00e5a0] hover:scale-115 transition-transform p-1 rounded hover:bg-white/5 cursor-pointer"
                        style={{ color: config.accentColor }}
                        title="Baixar / Ouvir diretamente"
                      >
                        <ArrowDownToLine size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Standard Pagination panel */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded bg-[#111] border border-[#2a2a2a] text-[#aaaaaa] disabled:opacity-40 hover:text-white hover:bg-[#1a1a1a] transition-all disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`w-9 h-9 font-display font-black text-xs rounded transition-all cursor-pointer ${
                  currentPage === i + 1
                    ? "text-black"
                    : "bg-[#111] border border-[#2a2a2a] text-[#aaaaaa] hover:text-white hover:bg-[#1a1a1a]"
                }`}
                style={currentPage === i + 1 ? { backgroundColor: config.accentColor } : {}}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded bg-[#111] border border-[#2a2a2a] text-[#aaaaaa] disabled:opacity-40 hover:text-white hover:bg-[#1a1a1a] transition-all disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 3. HORIZONTAL SHELF SECTIONS BY CATEGORY */}
      <div className="space-y-12">
        {categories.map((cat) => {
          // Filter posts for this category
          const catPosts = posts
            .filter((p) => p.categoria.toUpperCase() === cat.nome.toUpperCase())
            .slice(0, 6);

          if (catPosts.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-4">
              {/* Category section title */}
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: cat.cor }} />
                  <h3 className="text-sm sm:text-md font-black font-display tracking-widest uppercase text-white">
                    {cat.nome}
                  </h3>
                </div>
                
                <button
                  onClick={() => navigate("category", cat.nome)}
                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer font-mono"
                >
                  Ver Todos <ArrowRight size={11} />
                </button>
              </div>

              {/* Horizontal Scroll Shelves container */}
              <div className="relative">
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-[#2a2a2a] scrollbar-track-transparent">
                  {catPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => onPostClick(post.id)}
                      className="w-40 sm:w-48 shrink-0 bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden cursor-pointer group hover:border-[#383838] transition-all duration-300"
                    >
                      <div className="aspect-square bg-[#1a1a1a] overflow-hidden relative">
                        <img
                          src={post.capa}
                          alt={post.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&auto=format&fit=crop";
                          }}
                        />
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="text-xs font-black text-white truncate uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                          {post.titulo}
                        </h4>
                        <p className="text-[10px] text-[#aaaaaa] truncate font-bold">{post.artista}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
