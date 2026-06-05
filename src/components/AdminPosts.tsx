import React, { useState } from "react";
import { Post, Category } from "../types";
import { PlusCircle, Edit, Trash2, Search, ArrowLeft, Image as ImageIcon, Sparkles, Check, ExternalLink } from "lucide-react";

interface AdminPostsProps {
  posts: Post[];
  categories: Category[];
  onCreatePost: (post: Omit<Post, "id">) => void;
  onUpdatePost: (id: string, updated: Partial<Post>) => void;
  onDeletePost: (id: string) => void;
  config: { accentColor: string };
}

export default function AdminPosts({
  posts,
  categories,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  config
}: AdminPostsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [titulo, setTitulo] = useState("");
  const [artista, setArtista] = useState("");
  const [produtor, setProdutor] = useState("");
  const [categoria, setCategoria] = useState(categories[0]?.nome || "AFRO HOUSE");
  const [capa, setCapa] = useState("");
  const [descricao, setDescricao] = useState("");
  const [linkDownload, setLinkDownload] = useState("");
  const [destaque, setDestaque] = useState(false);
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);

  // General Filter
  const [searchTable, setSearchTable] = useState("");
  const [filterCategory, setFilterCategory] = useState("TODAS");

  const handleOpenNew = () => {
    setEditingPost(null);
    setTitulo("");
    setArtista("");
    setProdutor("");
    setCategoria(categories[0]?.nome || "AFRO HOUSE");
    setCapa("");
    setDescricao("");
    setLinkDownload("");
    setDestaque(false);
    setData(new Date().toISOString().split("T")[0]);
    setIsFormOpen(true);
  };

  const handleStartEdit = (post: Post) => {
    setEditingPost(post);
    setTitulo(post.titulo);
    setArtista(post.artista);
    setProdutor(post.produtor || "");
    setCategoria(post.categoria);
    setCapa(post.capa);
    setDescricao(post.descricao);
    setLinkDownload(post.linkDownload);
    setDestaque(post.destaque);
    setData(post.data);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !artista.trim() || !linkDownload.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    if (descricao.length > 1000) {
      alert("A descrição ou tracklist excede o limite máximo de 1000 caracteres.");
      return;
    }

    if (capa.trim() && !capa.trim().startsWith("http://") && !capa.trim().startsWith("https://")) {
      alert("Por favor, insira um URL de imagem válido (começando com http:// ou https://).");
      return;
    }

    const postData = {
      titulo,
      artista,
      produtor: produtor.trim() || undefined,
      categoria,
      capa: capa.trim() || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop",
      descricao,
      linkDownload,
      destaque,
      data
    };

    setSaving(true);

    setTimeout(() => {
      if (editingPost) {
        onUpdatePost(editingPost.id, postData);
      } else {
        onCreatePost(postData);
      }
      setSaving(false);
      setIsFormOpen(false);
      setEditingPost(null);
    }, 400);
  };

  const handleDeleteClick = (id: string, title: string) => {
    const confirmDel = window.confirm(`Tens a certeza que desejas eliminar o lançamento "${title}"?`);
    if (confirmDel) {
      onDeletePost(id);
    }
  };

  // Filter lists
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.titulo.toLowerCase().includes(searchTable.toLowerCase()) ||
      post.artista.toLowerCase().includes(searchTable.toLowerCase());
    const matchesCategory =
      filterCategory === "TODAS" || post.categoria.toUpperCase() === filterCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const getDownloadServiceBadge = () => {
    if (!linkDownload.trim()) return null;
    try {
      const urlStr = linkDownload.trim();
      const currentUrl = urlStr.startsWith("http://") || urlStr.startsWith("https://") ? urlStr : `https://${urlStr}`;
      const host = new URL(currentUrl).hostname.toLowerCase();
      if (host.includes("mediafire")) {
        return { name: "MediaFire", style: "bg-orange-500/10 text-orange-400 border border-orange-500/20" };
      } else if (host.includes("onedrive") || host.includes("1drv.ms") || host.includes("live.com") || host.includes("sharepoint")) {
        return { name: "OneDrive", style: "bg-blue-500/10 text-blue-400 border border-blue-500/20" };
      } else if (host.includes("spotify")) {
        return { name: "Spotify", style: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" };
      } else if (host.includes("youtube") || host.includes("youtu.be")) {
        return { name: "YouTube", style: "bg-red-500/10 text-red-500 border border-red-500/20" };
      } else if (host.includes("drive.google")) {
        return { name: "Drive", style: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" };
      } else {
        return { name: "Link Externo", style: "bg-zinc-500/10 text-zinc-400 border border-zinc-700" };
      }
    } catch (e) {
      return { name: "Link Externo", style: "bg-zinc-500/10 text-zinc-400 border border-zinc-700" };
    }
  };

  const serviceBadge = getDownloadServiceBadge();

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Form View overlay/replacement */}
      {isFormOpen ? (
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6.5 max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
            <h3 className="text-md font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Sparkles className="text-[#00e5a0]" style={{ color: config.accentColor }} />
              {editingPost ? "Editar Lançamento" : "Novo Lançamento / Post"}
            </h3>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#1a1a1a] text-xs text-[#aaaaaa] hover:text-white hover:bg-[#222] transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Voltar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Título de música */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                  Título da Música/Álbum *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Noite de Luanda"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Nome do artista */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                  Nome do Artista *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: DJ Nelinho"
                  value={artista}
                  onChange={(e) => setArtista(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Produtor */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                  Produtor (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: DJ Nelinho, Beat by Mamona"
                  value={produtor}
                  onChange={(e) => setProdutor(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Categoria list */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                  Categoria *
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-2.5 py-2.5 rounded focus:outline-none focus:border-emerald-400 font-bold uppercase tracking-wide"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.nome}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data de publicação */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                  Data de Publicação
                </label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400 font-mono font-bold"
                />
              </div>

              {/* Is destaque banner checkbox */}
              <div className="flex items-center h-full pt-4">
                <label className="relative flex items-center gap-2.5 cursor-pointer text-xs font-bold text-white uppercase select-none">
                  <input
                    type="checkbox"
                    checked={destaque}
                    onChange={(e) => setDestaque(e.target.checked)}
                    className="w-4.5 h-4.5 accent-emerald-400 rounded cursor-pointer"
                  />
                  <span>Destaque (Hero Banner)</span>
                </label>
              </div>
            </div>

            {/* URL da imagem de capa */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-0.5">
                URL da Imagem de Capa
              </label>
              <input
                type="url"
                placeholder="Ex: https://images.unsplash.com/... ou Imgur URL"
                value={capa}
                onChange={(e) => setCapa(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400 font-mono"
              />
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">
                👉 Cole o URL completo de uma imagem de blog ou deixe em branco para preencher com capa padrão.
              </p>
              {capa.trim() && (
                <div className="p-3 bg-black/40 rounded border border-[#2a2a2a] flex items-center gap-3 w-max">
                  <img
                    src={capa}
                    alt="Preview de Capa"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                    className="w-12 h-12 object-cover rounded border border-[#2a2a2a]"
                  />
                  <span className="text-[10px] text-zinc-400 uppercase font-bold font-mono">Pré-visualização</span>
                </div>
              )}
            </div>

            {/* Link download / Streaming */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                Link de Download / Streaming *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="Ex: Cole link do OneDrive, MediaFire, Spotify, YouTube..."
                  value={linkDownload}
                  onChange={(e) => setLinkDownload(e.target.value)}
                  className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400 font-mono"
                />
                {linkDownload.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      const urlStr = linkDownload.trim();
                      const testUrl = urlStr.startsWith("http://") || urlStr.startsWith("https://") ? urlStr : `https://${urlStr}`;
                      window.open(testUrl, '_blank');
                    }}
                    className="p-2 bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] hover:border-zinc-500 text-zinc-300 hover:text-white rounded transition-colors cursor-pointer"
                    title="Testar Link de Download"
                  >
                    <ExternalLink size={14} />
                  </button>
                )}
              </div>
              {serviceBadge && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[9px] text-[#aaaaaa] uppercase font-black tracking-widest">Serviço:</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded leading-none ${serviceBadge.style}`}>
                    {serviceBadge.name}
                  </span>
                </div>
              )}
            </div>

            {/* Descrição / Tracklist text box */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                Descrição ou Tracklist (Álbuns/EPs)
              </label>
              <textarea
                rows={4}
                placeholder="Descrição literária, letras ou tracklist completa das músicas..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400 font-sans"
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
                  Suporta notas do produtor e tracklist.
                </span>
                <span className={`text-[10px] font-mono font-black uppercase tracking-wider ${
                  descricao.length > 1000 ? "text-red-500" : descricao.length > 800 ? "text-orange-500" : "text-zinc-500"
                }`}>
                  {descricao.length} / 1000 caracteres
                </span>
              </div>
            </div>

            {/* Submition controls */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={saving || descricao.length > 1000}
                className="font-display font-black tracking-widest text-[#0a0a0a] bg-[#00e5a0] text-xs py-3 px-6 rounded-lg uppercase transition-all cursor-pointer hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: config.accentColor }}
              >
                {saving ? "A guardar..." : editingPost ? "Actualizar Lançamento" : "Inserir Lançamento"}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleCancel}
                className="font-display font-medium tracking-widest text-[#aaaaaa] bg-transparent border border-[#2a2a2a] text-xs py-3 px-6 rounded-lg uppercase hover:text-white hover:bg-[#1a1a1a] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Regular Management Table List */
        <div className="space-y-5">
          {/* Header row with Add post button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black font-display tracking-widest text-white uppercase flex items-center gap-2">
                <PlusCircle className="text-[#00e5a0]" style={{ color: config.accentColor }} />
                Gerir Artigos e Posts
              </h2>
              <p className="text-[#aaaaaa] text-xs">Adicione, edite ou remova lançamentos musicais</p>
            </div>

            <button
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg bg-[#00e5a0] text-black text-xs font-black uppercase tracking-wider hover:bg-emerald-300 transition-all cursor-pointer"
              style={{ backgroundColor: config.accentColor }}
            >
              <PlusCircle size={15} /> Novo Lançamento
            </button>
          </div>

          {/* Table Toolbar controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#111] p-4 rounded-xl border border-[#2a2a2a]">
            {/* Search Input inline */}
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaaaaa]" />
              <input
                type="text"
                placeholder="Pesquisar por título ou artista..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Category filter dropdown */}
            <div className="w-full sm:w-48 flex items-center gap-2">
              <span className="text-[10px] text-[#aaaaaa] font-bold uppercase tracking-wider">Filtrar:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-2 py-2 rounded focus:outline-none uppercase font-bold tracking-wide cursor-pointer"
              >
                <option value="TODAS">TODAS</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container element */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#2a2a2a] text-[10px] text-[#aaaaaa] uppercase tracking-widest bg-[#181818] font-black">
                    <th className="py-4.5 px-4 w-12 text-center">Capa</th>
                    <th className="py-4.5 px-4 font-bold">Título</th>
                    <th className="py-4.5 px-4 font-bold">Artista</th>
                    <th className="py-4.5 px-4 font-bold">Categoria</th>
                    <th className="py-4.5 px-4 font-bold">Data</th>
                    <th className="py-4.5 px-4 font-bold text-center">Destaque</th>
                    <th className="py-4.5 px-4 font-bold text-right w-24">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-[#1a1a1a]/40 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <img
                          src={post.capa}
                          alt={post.titulo}
                          className="w-9 h-9 object-cover rounded border border-[#2a2a2a] mx-auto"
                        />
                      </td>
                      <td className="py-3 px-4 font-bold text-white truncate max-w-[150px]">
                        {post.titulo}
                      </td>
                      <td className="py-3 px-4 text-zinc-300 truncate max-w-[120px]">
                        {post.artista}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="text-[9px] font-black uppercase px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: categories.find(c => c.nome.toUpperCase() === post.categoria.toUpperCase())?.cor + "15",
                            color: categories.find(c => c.nome.toUpperCase() === post.categoria.toUpperCase())?.cor
                          }}
                        >
                          {post.categoria}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-400 font-bold">{post.data}</td>
                      <td className="py-3 px-4 text-center">
                        {post.destaque ? (
                          <span
                            className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-[#00e5a0]"
                            style={{ color: config.accentColor, backgroundColor: `${config.accentColor}15` }}
                          >
                            <Check size={10} strokeWidth={3} /> SIM
                          </span>
                        ) : (
                          <span className="text-zinc-600 font-bold">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(post)}
                            className="p-2 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 hover:text-white transition-all cursor-pointer"
                            title="Editar"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(post.id, post.titulo)}
                            className="p-2 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer"
                            title="Remover"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#aaaaaa] font-medium font-sans">
                        Nenhum post corresponde à pesquisa.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
