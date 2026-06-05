import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Link2, Copy, Trash2, PlusCircle, CheckCircle } from "lucide-react";
import { Post } from "../types";

interface AdminGalleryProps {
  posts: Post[];
  config: { accentColor: string };
}

export default function AdminGallery({ posts, config }: AdminGalleryProps) {
  const [galleryList, setGalleryList] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Initialize and load custom gallery alongside image URLs currently in use
  useEffect(() => {
    const postCovers = posts.map((p) => p.capa).filter(Boolean);
    const stored = localStorage.getItem("rox_gallery");
    const customImages: string[] = stored ? JSON.parse(stored) : [];
    
    // Combine both unique values
    const combined = Array.from(new Set([...postCovers, ...customImages]));
    setGalleryList(combined);
  }, [posts]);

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const stored = localStorage.getItem("rox_gallery");
    const customImages: string[] = stored ? JSON.parse(stored) : [];
    
    // insert if new
    if (!customImages.includes(newUrl)) {
      const updated = [newUrl, ...customImages];
      localStorage.setItem("rox_gallery", JSON.stringify(updated));
      setGalleryList(Array.from(new Set([...posts.map(p => p.capa), ...updated])));
    }
    setNewUrl("");
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 1500);
    });
  };

  const handleDelete = (url: string) => {
    // Check if image is currently in use
    const usedBy = posts.find((p) => p.capa === url);
    if (usedBy) {
      alert(`Não é possível excluir! Esta imagem está a ser usada no post: "${usedBy.titulo}" de ${usedBy.artista}.`);
      return;
    }

    const confirmDel = window.confirm("Tens a certeza que desejas remover esta imagem da galeria?");
    if (!confirmDel) return;

    const stored = localStorage.getItem("rox_gallery");
    const customImages: string[] = stored ? JSON.parse(stored) : [];
    const updated = customImages.filter((img) => img !== url);
    localStorage.setItem("rox_gallery", JSON.stringify(updated));

    setGalleryList(Array.from(new Set([...posts.map(p => p.capa), ...updated])));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-black font-display tracking-widest text-white uppercase flex items-center gap-2">
          <ImageIcon className="text-[#00e5a0]" style={{ color: config.accentColor }} />
          Galeria de Capas
        </h2>
        <p className="text-[#aaaaaa] text-xs">Adicione e copie URLs de capas de forma cómoda</p>
      </div>

      {/* Input section with URL preview */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
        <h3 className="text-xs font-black tracking-widest uppercase text-white mb-4">Registar Nova Capa</h3>
        <form onSubmit={handleAddImage} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#aaaaaa]">
              URL da Capa
            </label>
            <input
              type="url"
              placeholder="Cole o URL de uma imagem (ex: Unsplash, Imgur, etc.)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-emerald-400 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="font-display font-black tracking-widest text-black bg-[#00e5a0] text-xs py-2.5 px-4 rounded-lg uppercase flex items-center justify-center gap-2 transition-all cursor-pointer h-10 hover:bg-emerald-300"
            style={{ backgroundColor: config.accentColor }}
          >
            <PlusCircle size={15} /> Adicionar
          </button>
        </form>

        {/* Live Preview block if URL is semi-valid */}
        {newUrl.trim() && /^https?:\/\/.+/.test(newUrl) && (
          <div className="mt-4 p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] flex items-center gap-4">
            <img
              src={newUrl}
              alt="Live Preview"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
              className="w-14 h-14 object-cover rounded border border-[#2a2a2a]"
            />
            <div>
              <p className="text-[10px] text-[#00e5a0] font-black uppercase tracking-wider">Pré-visualização Disponível</p>
              <p className="text-[10px] text-zinc-400 truncate max-w-sm font-mono mt-0.5">{newUrl}</p>
            </div>
          </div>
        )}
        <p className="text-[10px] text-zinc-500 mt-2.5">
          ⚠️ Nota: Cole o URL de uma imagem de domínio público (ex: Google, Unsplash, Imgur, Pixabay, etc.) para utilizar nos seus artigos de música.
        </p>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {galleryList.map((url, idx) => {
          const isUsed = posts.some((p) => p.capa === url);
          const isCopied = copiedUrl === url;

          return (
            <div
              key={idx}
              className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden group hover:border-[#2a2a2a]/90 flex flex-col justify-between"
            >
              {/* Cover view */}
              <div className="aspect-square relative bg-[#1c1c1c] overflow-hidden">
                <img
                  src={url}
                  alt="Gallery cover item"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&auto=format&fit=crop";
                  }}
                />
                
                {/* Active cover in use label */}
                {isUsed && (
                  <span className="absolute top-2 left-2 bg-emerald-500/95 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide font-display">
                    Em Uso
                  </span>
                )}
              </div>

              {/* Action deck */}
              <div className="p-3 bg-[#0d0d0d] flex items-center justify-between gap-1 border-t border-[#1c1c1c]">
                <button
                  type="button"
                  onClick={() => handleCopy(url)}
                  className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-emerald-400 hover:text-black hover:border-emerald-400 text-[#aaaaaa] p-2 rounded transition-all flex-1 text-center justify-center border border-[#2a2a2a] text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                  style={isCopied ? { backgroundColor: config.accentColor, color: "black", borderColor: config.accentColor } : {}}
                  title="Copiar URL"
                >
                  {isCopied ? <CheckCircle size={12} /> : <Copy size={11} />}
                  <span>{isCopied ? "Copiado" : "Copiar"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(url)}
                  disabled={isUsed}
                  className={`p-2 rounded border transition-all text-xs cursor-pointer ${
                    isUsed
                      ? "bg-zinc-950 border-zinc-950 text-zinc-700 cursor-not-allowed"
                      : "bg-[#161616] border-[#2a2a2a] text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                  }`}
                  title={isUsed ? "Imagem em uso" : "Remover item"}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
