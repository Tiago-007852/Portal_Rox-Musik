import React from "react";
import { Post, Category } from "../types";
import { BarChart, TrendingUp, Calendar, Layers, Award } from "lucide-react";

interface AdminStatsProps {
  posts: Post[];
  categories: Category[];
}

export default function AdminStats({ posts, categories }: AdminStatsProps) {
  // Compute counts for each category
  const categoryCounts = categories.map((cat) => {
    const count = posts.filter((p) => p.categoria.toUpperCase() === cat.nome.toUpperCase()).length;
    return {
      nome: cat.nome,
      cor: cat.cor,
      count
    };
  });

  // Most popular category
  const sortedCategories = [...categoryCounts].sort((a, b) => b.count - a.count);
  const topCategoryName = sortedCategories[0]?.count > 0 ? sortedCategories[0].nome : "Nenhuma";
  const topCategoryColor = sortedCategories[0]?.count > 0 ? sortedCategories[0].cor : "#888";

  // Compute posts by month (last 6 months)
  // Let's deduce months dynamically from the posts, or make of the last 6 months list dynamically based on UTC 2026.
  // The system's current time is Nov/Dec 2025 or May 2026 based on metadata (2026-05-26T22:57:16Z)
  // Let's generate last 6 months from 2026-05
  const getMonths = () => {
    const list = [];
    const monthsName = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    // Get current date dynamically
    const currentDate = new Date();
    let year = currentDate.getFullYear();
    let monthIdx = currentDate.getMonth();

    for (let i = 0; i < 6; i++) {
      const display = `${monthsName[monthIdx]} ${year}`;
      const filterStr = `${year}-${String(monthIdx + 1).padStart(2, "0")}`;
      list.push({ display, filterStr, count: 0 });
      monthIdx--;
      if (monthIdx < 0) {
        monthIdx = 11;
        year--;
      }
    }
    return list.reverse(); // chronologically
  };

  const monthsData = getMonths().map((m) => {
    const count = posts.filter((p) => p.data.startsWith(m.filterStr)).length;
    return { ...m, count };
  });

  const topMonth = [...monthsData].sort((a, b) => b.count - a.count)[0];
  const activeMonthName = topMonth && topMonth.count > 0 ? topMonth.display : "Nenhum";

  const maxCategoryCount = Math.max(...categoryCounts.map((c) => c.count), 1);
  const maxMonthCount = Math.max(...monthsData.map((m) => m.count), 1);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black font-display tracking-widest text-white uppercase flex items-center gap-2">
          <BarChart className="text-[#00e5a0]" />
          Estatísticas Operacionais
        </h2>
        <p className="text-[#aaaaaa] text-xs">Acompanhamento de postagens e métricas do portal</p>
      </div>

      {/* Grid: 3 metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total posts */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 flex items-center gap-4">
          <div className="p-3.5 bg-sky-500/10 rounded-xl text-sky-400">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wider">Total de Lançamentos</p>
            <p className="text-2xl font-black text-white font-mono mt-0.5">{posts.length}</p>
          </div>
        </div>

        {/* Top Category */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 rounded-xl text-[#00e5a0]">
            <Award size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wider">Categoria Favorita</p>
            <p className="text-md font-bold text-white uppercase mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: topCategoryColor }} />
              {topCategoryName}
            </p>
          </div>
        </div>

        {/* Most Actionable month */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 flex items-center gap-4">
          <div className="p-3.5 bg-orange-500/10 rounded-xl text-orange-400">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wider">Mês Mais Activo</p>
            <p className="text-md font-bold text-white uppercase mt-1">{activeMonthName}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart 1: Posts per Category (CSS Pure Bar Chart) */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-xs font-black tracking-widest uppercase text-white mb-6 flex items-center gap-2">
            <span className="w-1.5 h-3.5 rounded-full bg-[#00e5a0]" />
            Posts por Categoria
          </h3>
          <div className="space-y-4">
            {categoryCounts.map((cat) => {
              const pct = (cat.count / maxCategoryCount) * 100;
              return (
                <div key={cat.nome} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.cor }} />
                      {cat.nome}
                    </span>
                    <span className="text-[#aaaaaa] font-mono">{cat.count} posts</span>
                  </div>
                  <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#2a2a2a]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.cor,
                        boxShadow: `0 0 8px ${cat.cor}33`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Posts by Month (CSS Line/Trend Column Chart) */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-xs font-black tracking-widest uppercase text-white mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#00e5a0]" />
            Volume Mensal (Últimos 6 meses)
          </h3>
          <div className="h-48 flex items-end justify-between gap-2.5 pt-4">
            {monthsData.map((m) => {
              const heightPct = (m.count / maxMonthCount) * 85; // cap at 85% for display spacing
              return (
                <div key={m.display} className="flex-1 flex flex-col items-center gap-2 text-center h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-[#aaaaaa]">{m.count}</span>
                  <div className="w-full relative group flex justify-center">
                    <div
                      className="w-5 sm:w-8 rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-500 group-hover:to-[#00e5a0] transition-all hover:scale-x-105"
                      style={{ height: `${Math.max(heightPct, 5)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-[#aaaaaa] font-medium uppercase tracking-wider truncate w-full">{m.display.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-center">
        <p className="text-[10px] text-[#aaaaaa] uppercase tracking-wider font-mono">
          📌 Nota: Estatísticas baseadas nos dados locais do seu navegador (localStorage).
        </p>
      </div>
    </div>
  );
}
