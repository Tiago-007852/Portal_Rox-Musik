import React from "react";
import { Post, Category } from "../types";
import { PlusCircle, Music, Calendar, Award, Layers, Sparkles, MessageSquare } from "lucide-react";

interface AdminDashboardProps {
  posts: Post[];
  categories: Category[];
  setActiveTab: (tab: string) => void;
  onEditPost: (id: string, post: Post) => void;
  config: { accentColor: string };
}

export default function AdminDashboard({
  posts,
  categories,
  setActiveTab,
  onEditPost,
  config
}: AdminDashboardProps) {
  
  // Sort posts by publish date (newest first)
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  const lastPostAdded = recentPosts[0];

  // Post counts per category
  const categoryCounts = categories.map((cat) => {
    const count = posts.filter((p) => p.categoria.toUpperCase() === cat.nome.toUpperCase()).length;
    return { ...cat, count };
  });

  // Top category
  const sortedCategories = [...categoryCounts].sort((a, b) => b.count - a.count);
  const topCategoryName = sortedCategories[0]?.count > 0 ? sortedCategories[0].nome : "Nenhuma";
  const topCategoryColor = sortedCategories[0]?.count > 0 ? sortedCategories[0].cor : "#555";

  const maxCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Greetings */}
      <div className="p-6 bg-gradient-to-r from-zinc-900 to-[#111] rounded-2xl border border-[#2a2a2a] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-black font-display text-white tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="text-[#00e5a0]" style={{ color: config.accentColor }} />
              Painel de Controlo
            </h2>
            <p className="text-[#aaaaaa] text-xs">Acompanhamento central de lances, capas, cliques e dados do portal</p>
          </div>
          <button
            onClick={() => setActiveTab("posts")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#00e5a0] text-black text-[11px] font-black uppercase tracking-wider hover:bg-emerald-300 transition-all cursor-pointer"
            style={{ backgroundColor: config.accentColor }}
          >
            <PlusCircle size={15} /> Novo Lançamento
          </button>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-indigo-500/15 text-indigo-400 rounded-lg">
            <Layers size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-[#aaaaaa] uppercase tracking-wider">Lançamentos</p>
            <p className="text-lg font-black text-white font-mono mt-0.5">{posts.length}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-purple-500/15 text-purple-400 rounded-lg">
            <Award size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-[#aaaaaa] uppercase tracking-wider">Top Categoria</p>
            <p className="text-xs font-black text-white truncate uppercase mt-1 flex items-center gap-1.5" style={{ color: topCategoryColor }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: topCategoryColor }} />
              {topCategoryName}
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-red-400/15 text-red-400 rounded-lg">
            <Music size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-[#aaaaaa] uppercase tracking-wider">Artigo Recente</p>
            <p className="text-xs font-bold text-white truncate mt-1">
              {lastPostAdded ? lastPostAdded.titulo : "Nenhum"}
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-500/15 text-amber-500 rounded-lg">
            <Calendar size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-[#aaaaaa] uppercase tracking-wider">Mês Actual</p>
            <p className="text-xs font-extrabold text-white mt-1 uppercase">
              {(() => {
                const formatted = new Intl.DateTimeFormat('pt-PT', { month: 'long', year: 'numeric' }).format(new Date());
                return formatted.charAt(0).toUpperCase() + formatted.slice(1);
              })()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Widget: Recent Posts (Col span 3) */}
        <div className="md:col-span-3 bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-black tracking-widest uppercase text-white flex items-center justify-between">
            <span>Mais Recentes</span>
            <button onClick={() => setActiveTab("posts")} className="text-[10px] text-[#aaaaaa] hover:text-white uppercase font-bold tracking-widest transition-colors font-mono">
              Ver Todos →
            </button>
          </h3>

          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="p-3 bg-[#1a1a1a]/55 hover:bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] flex items-center justify-between gap-3 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={post.capa}
                    alt={post.titulo}
                    className="w-10 h-10 object-cover rounded border border-[#2a2a2a] shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{post.titulo}</h4>
                    <p className="text-[10px] text-[#aaaaaa] truncate mt-0.5">{post.artista}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider"
                    style={{
                      backgroundColor: categories.find(c => c.nome.toUpperCase() === post.categoria.toUpperCase())?.cor + "20",
                      color: categories.find(c => c.nome.toUpperCase() === post.categoria.toUpperCase())?.cor
                    }}
                  >
                    {post.categoria}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-zinc-500 hidden sm:inline">{post.data}</span>
                </div>
              </div>
            ))}

            {recentPosts.length === 0 && (
              <p className="text-xs text-[#aaaaaa] text-center py-6 font-medium">Nenhum post disponível. Adicione um clicando acima!</p>
            )}
          </div>
        </div>

        {/* Right Widget: Category Distribution (Col span 2) */}
        <div className="md:col-span-2 bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-black tracking-widest uppercase text-white pb-1">
            Distribuição de Volume
          </h3>

          <div className="space-y-3 pt-1">
            {categoryCounts.map((cat) => {
              const barPct = (cat.count / maxCount) * 100;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-zinc-300 flex items-center gap-2">
                      <span className="w-2.5 h-1.5 rounded-full" style={{ backgroundColor: cat.cor }} />
                      {cat.nome}
                    </span>
                    <span className="text-zinc-400 font-mono text-[10px]">{cat.count} posts</span>
                  </div>
                  <div className="h-2.5 bg-[#1a1a1a] rounded-full border border-[#2a2a2a] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${barPct}%`,
                        backgroundColor: cat.cor
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
