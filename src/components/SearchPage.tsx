import React, { useState, useEffect } from "react";
import { Post, Category } from "../types";
import { Calendar, ArrowDownToLine, Search, HelpCircle, Music } from "lucide-react";

interface SearchPageProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  posts: Post[];
  categories: Category[];
  onPostClick: (id: string) => void;
  config: { accentColor: string };
}

export default function SearchPage({
  searchQuery,
  setSearchQuery,
  posts,
  categories,
  onPostClick,
  config,
}: SearchPageProps) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debouncing search query input with a 250ms delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Filter core posts in real time using debouncedQuery
  const results = debouncedQuery.trim()
    ? posts.filter((post) => {
        const query = debouncedQuery.toLowerCase();
        return (
          post.titulo.toLowerCase().includes(query) ||
          post.artista.toLowerCase().includes(query) ||
          post.categoria.toLowerCase().includes(query)
        );
      })
    : [];

  const topSuggestions = ["Kizomba", "Afro House", "Dj Nelinho", "Mixtape Verão"];

  return (
    <div className="space-y-8 animate-fade-in font-sans min-h-[50vh]">
      
      {/* Large central search bar input wrapper */}
      <div className="max-w-2xl mx-auto text-center space-y-4 py-6">
        <h2 className="text-xl sm:text-2xl font-black font-display tracking-widest text-white uppercase flex items-center justify-center gap-2">
          <Search className="text-[#00e5a0]" style={{ color: config.accentColor }} />
          Pesquisar Lançamentos
        </h2>
        <p className="text-[#aaaaaa] text-xs">Escreva abaixo o título, artista ou estilo para encontrar no blog</p>
        
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="Digite aqui para procurar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-[#2a2a2a] text-sm text-white px-5 py-3 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all text-center placeholder-zinc-500 font-semibold"
            autoFocus
          />
        </div>

        {/* Dynamic prompt suggestions tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 pt-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#aaaaaa]">Sugestões:</span>
          {topSuggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => setSearchQuery(sug)}
              className="px-2.5 py-1 rounded bg-[#111] border border-[#2a2a2a] text-[#aaaaaa] hover:border-[#aaa] hover:text-white text-[10px] font-semibold transition-all cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Results rendering layout */}
      <div className="space-y-5">
        <div className="border-b border-[#2a2a2a] pb-2 text-xs font-semibold uppercase text-zinc-400">
          Resultados Obtidos ({results.length})
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((post) => {
              const catInfo = categories.find((c) => c.nome.toUpperCase() === post.categoria.toUpperCase());
              const accentColorVal = catInfo ? catInfo.cor : config.accentColor;

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
                    <span
                      className="absolute top-2 left-2 text-[8px] font-bold px-2 py-0.5 rounded uppercase text-white shadow animate-fade-in"
                      style={{ backgroundColor: accentColorVal }}
                    >
                      {post.categoria}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between flex-1 gap-1">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors min-h-[2.5rem] line-clamp-2"
                          style={{ '--hover-color': accentColorVal } as React.CSSProperties}>
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
                        style={{ color: accentColorVal }}
                        title="Baixar / Ouvir diretamente"
                      >
                        <ArrowDownToLine size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 space-y-2.5">
            {searchQuery.trim() ? (
              <>
                <HelpCircle className="mx-auto text-zinc-650" size={32} />
                <h3 className="text-sm text-[#aaaaaa] font-semibold">Nenhum resultado encontrado</h3>
                <p className="text-xs text-zinc-500">
                  Verifique se o nome do artista ou música está correto, ou tente procurar por um género como "Kizomba" ou "Zouk".
                </p>
              </>
            ) : (
              <>
                <Music className="mx-auto text-zinc-700" size={32} />
                <h3 className="text-xs text-[#aaaaaa] uppercase font-black tracking-widest">Aguardando Termos de Busca</h3>
                <p className="text-xs text-zinc-550 max-w-sm mx-auto">
                  Por favor digite no campo acima para iniciarmos a procura em tempo real pela discografia do portal.
                </p>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
