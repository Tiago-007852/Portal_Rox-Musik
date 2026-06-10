import React, { useState } from "react";
import { Category, Post } from "../types";
import { Edit, Save, X, Palette, CirclePlus } from "lucide-react";

interface AdminCategoriesProps {
  categories: Category[];
  posts: Post[];
  onUpdateCategory: (id: string, updated: Partial<Category>) => void;
  config: { accentColor: string };
}

export default function AdminCategories({
  categories,
  posts,
  onUpdateCategory,
  config
}: AdminCategoriesProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editCor, setEditCor] = useState("");

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditNome(cat.nome);
    setEditCor(cat.cor);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    if (!editNome.trim()) return;
    onUpdateCategory(id, { nome: editNome.toUpperCase(), cor: editCor });
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-black font-display tracking-widest text-white uppercase flex items-center gap-2">
          <Palette className="text-[#00e5a0]" style={{ color: config.accentColor }} />
          Gerir Categorias
        </h2>
        <p className="text-[#aaaaaa] text-xs">Ajuste os rótulos e as respectivas cores de destaque</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Category list */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden divide-y divide-[#2a2a2a]">
          {categories.map((cat) => {
            const count = posts.filter((p) => p.categoria.toUpperCase() === cat.nome.toUpperCase()).length;
            const isEditing = editingId === cat.id;

            return (
              <div key={cat.id} className="p-4 flex items-center justify-between gap-4">
                {isEditing ? (
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editNome}
                        onChange={(e) => setEditNome(e.target.value)}
                        className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white px-3 py-1.5 rounded text-xs uppercase"
                        placeholder="Nome da Categoria"
                      />
                      <input
                        type="color"
                        value={editCor}
                        onChange={(e) => setEditCor(e.target.value)}
                        className="w-10 h-7 bg-transparent cursor-pointer border-0 p-0"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-2.5 py-1 text-[11px] uppercase tracking-wide bg-[#222] text-[#aaa] rounded hover:bg-[#333] flex items-center gap-1 font-semibold"
                      >
                        <X size={12} /> Cancelar
                      </button>
                      <button
                        onClick={() => saveEdit(cat.id)}
                        className="px-2.5 py-1 text-[11px] uppercase tracking-wide text-black bg-emerald-400 rounded hover:bg-emerald-300 flex items-center gap-1 font-semibold"
                        style={{ backgroundColor: config.accentColor }}
                      >
                        <Save size={12} /> Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Item View */}
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full border border-black/25" style={{ backgroundColor: cat.cor }} />
                      <div>
                        <h4 className="text-xs font-black text-white">{cat.nome}</h4>
                        <p className="text-[10px] text-[#aaaaaa] font-mono mt-0.5">{count} posts publicados</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#aaaaaa] border border-[#2a2a2a] px-2 py-0.5 rounded-full font-mono font-bold bg-[#1a1a1a]">
                        ID: {cat.id}
                      </span>
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 hover:text-white hover:border-emerald-500/20 transition-all cursor-pointer"
                        title="Editar Categoria"
                      >
                        <Edit size={13} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Informative Card */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black tracking-widest uppercase text-white mb-3">Estilo Visual Personalizado</h3>
            <p className="text-[#aaaaaa] text-xs leading-relaxed">
              Mudar as cores nesta secção actualiza instantaneamente os badges e deques decorativos em toda a plataforma.
              Isto permite-lhe definir uma hierarquia visual única baseada na categoria musical:
            </p>
            <div className="mt-4 space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2.5 text-xs text-white">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.cor }} />
                  <span className="font-semibold text-[11px]">{cat.nome}</span>
                  <span className="text-[#aaaaaa] text-[10px] font-mono">({cat.cor})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#1c1c1c] text-[10px] text-zinc-500 uppercase font-mono">
            O blog da banda • Rox-Musik Control Center
          </div>
        </div>
      </div>
    </div>
  );
}
