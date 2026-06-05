import React, { useState, useEffect } from "react";
import { Post, Category } from "../types";
import { Calendar, ArrowDownToLine, ChevronLeft, ChevronRight, Music } from "lucide-react";

interface CategoryPageProps {
  categoryName: string;
  posts: Post[];
  categories: Category[];
  onPostClick: (id: string) => void;
  config: { accentColor: string };
  navigate: (routeName: string, param?: string) => void;
}

export default function CategoryPage({
  categoryName,
  posts,
  categories,
  onPostClick,
  config,
  navigate,
}: CategoryPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Reset page to 1 whenever category is switched
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryName]);

  const catInfo = categories.find(
    (c) => c.nome.toUpperCase() === categoryName.toUpperCase()
  );
  const activeColor = catInfo ? catInfo.cor : config.accentColor;

  // Filter posts
  const filteredPosts = posts
    .filter((p) => p.categoria.toUpperCase() === categoryName.toUpperCase())
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Category header title banner */}
      <div 
        className="p-8 sm:p-12 rounded-2xl border flex flex-col justify-end min-h-[160px] relative overflow-hidden"
        style={{ 
          backgroundColor: "#111111", 
          borderColor: `${activeColor}20`,
          boxShadow: `inset 0 0 40px -20px ${activeColor}25`
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none" 
             style={{ backgroundColor: `${activeColor}15` }} />
             
        <div className="relative space-y-2">
          <span 
            className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded w-max"
            style={{ backgroundColor: `${activeColor}15`, color: activeColor }}
          >
            Artigos por Categoria
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-widest text-white uppercase">
            {categoryName}
          </h2>
          <p className="text-[#aaaaaa] text-xs">
            Mostrando {filteredPosts.length} lançamentos de {categoryName} disponíveis no portal.
          </p>
        </div>
      </div>

      {/* Main Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentPosts.map((post) => (
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
            </div>

            <div className="flex flex-col justify-between flex-1 gap-1">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors min-h-[2.5rem] line-clamp-2"
                    style={{ '--hover-color': activeColor } as React.CSSProperties}>
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
                  style={{ color: activeColor }}
                  title="Baixar / Ouvir diretamente"
                >
                  <ArrowDownToLine size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-3">
            <Music className="mx-auto text-zinc-600 mb-2.5" size={32} />
            <p className="text-sm text-[#aaaaaa] font-medium font-sans">Ainda não existem lançamentos registados nesta categoria.</p>
            <button
              onClick={() => navigate("home")}
              className="text-xs font-display font-black uppercase text-emerald-400 font-mono tracking-wider"
              style={{ color: activeColor }}
            >
              Voltar ao Início
            </button>
          </div>
        )}
      </div>

      {/* Pagination wrapper */}
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
                  ? "text-black font-extrabold"
                  : "bg-[#111] border border-[#2a2a2a] text-[#aaaaaa] hover:text-white hover:bg-[#1a1a1a]"
              }`}
              style={currentPage === i + 1 ? { backgroundColor: activeColor } : {}}
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
  );
}
