import React, { useState } from "react";
import { Post, Category } from "../types";
import { PlusCircle, Edit, Trash2, Search, ArrowLeft, Image as ImageIcon, Sparkles, Check, ExternalLink, Upload } from "lucide-react";

interface AdminPostsProps {
  posts: Post[];
  categories: Category[];
  onCreatePost: (post: Omit<Post, "id">) => void;
  onUpdatePost: (id: string, updated: Partial<Post>) => void;
  onDeletePost: (id: string) => void;
  config: { accentColor: string };
  cloudAuth?: boolean;
}

export default function AdminPosts({
  posts,
  categories,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  config,
  cloudAuth = false
}: AdminPostsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [tipo, setTipo] = useState<"musica" | "noticia" | "entretenimento">("musica");
  const [titulo, setTitulo] = useState("");
  const [artista, setArtista] = useState("");
  const [produtor, setProdutor] = useState("");
  const [categoria, setCategoria] = useState(categories[0]?.nome || "AFRO HOUSE");
  const [capa, setCapa] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [linkDownload, setLinkDownload] = useState("");
  const [destaque, setDestaque] = useState(false);
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);

  // General Filter
  const [searchTable, setSearchTable] = useState("");
  const [filterCategory, setFilterCategory] = useState("TODAS");

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
          setCapa(compressedBase64);
        }
        setUploadingImage(false);
      };
      img.onerror = () => {
        setUploadingImage(false);
        alert("Erro ao carregar a imagem para processamento.");
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadingImage(false);
      alert("Erro ao ler o ficheiro.");
    };
    reader.readAsDataURL(file);
  };

  const handleOpenNew = () => {
    setEditingPost(null);
    setTipo("musica");
    setTitulo("");
    setArtista("");
    setProdutor("");
    setCategoria(categories[0]?.nome || "AFRO HOUSE");
    setCapa("");
    setSubtitulo("");
    setAutor("");
    setConteudo("");
    setDescricao("");
    setLinkDownload("");
    setDestaque(false);
    setData(new Date().toISOString().split("T")[0]);
    setIsFormOpen(true);
  };

  const handleStartEdit = (post: Post) => {
    setEditingPost(post);
    setTipo(post.tipo || "musica");
    setTitulo(post.titulo);
    setArtista(post.artista);
    setProdutor(post.produtor || "");
    setCategoria(post.categoria);
    setCapa(post.capa);
    setSubtitulo(post.subtitulo || "");
    setAutor(post.autor || "");
    setConteudo(post.conteudo || "");
    setDescricao(post.descricao);
    setLinkDownload(post.linkDownload || "");
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
    
    const isMusic = tipo === "musica";
    
    if (isMusic) {
      if (!titulo.trim() || !artista.trim() || !linkDownload.trim()) {
        alert("Por favor, preencha todos os campos obrigatórios (*): Título, Artista e Link de Download.");
        return;
      }
    } else {
      if (!titulo.trim()) {
        alert("Por favor, preencha o Título do Post/Artigo (*).");
        return;
      }
      if (!conteudo.trim() && !descricao.trim()) {
        alert("Por favor, insira o Conteúdo Completo do Artigo (*).");
        return;
      }
    }

    if (descricao.length > 1000) {
      alert("A descrição excede o limite máximo de 1000 caracteres.");
      return;
    }

    if (capa.trim() && !capa.trim().startsWith("http://") && !capa.trim().startsWith("https://") && !capa.trim().startsWith("data:image/")) {
      alert("Por favor, insira um URL de imagem válido ou faça upload.");
      return;
    }

    const postData = {
      titulo,
      artista: artista.trim() || "Diversos",
      produtor: isMusic ? (produtor.trim() || undefined) : undefined,
      categoria,
      capa: capa.trim() || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop",
      descricao: isMusic ? descricao : (subtitulo || descricao || conteudo.slice(0, 150) + "..."),
      linkDownload: linkDownload.trim(),
      destaque,
      data,
      tipo,
      subtitulo: isMusic ? undefined : subtitulo.trim(),
      autor: isMusic ? undefined : autor.trim(),
      conteudo: isMusic ? undefined : conteudo.trim()
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
            
            {/* Seletor de Tipo de Post */}
            <div className="bg-[#181818] p-3.5 rounded-xl border border-[#2a2a2a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="block text-[10px] uppercase font-black tracking-widest text-[#aaaaaa]">Foco do Conteúdo</span>
                <span className="text-[11px] text-zinc-400 font-sans">Selecione o tipo de publicação que deseja criar</span>
              </div>
              <div className="flex bg-black/40 p-1.5 rounded-lg border border-[#2a2a2a] w-full sm:w-auto">
                {(["musica", "noticia", "entretenimento"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className="flex-1 sm:flex-none text-center px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    style={{
                      color: tipo === t ? config.accentColor : "#aaaaaa",
                      backgroundColor: tipo === t ? `${config.accentColor}15` : "transparent"
                    }}
                  >
                    {t === "musica" ? "Música" : t === "noticia" ? "Notícia" : "Entretenimento"}
                  </button>
                ))}
              </div>
            </div>

            {/* CONDITIONAL CONTROLS */}
            {tipo === "musica" ? (
              /* MUSIC FIELDS FORM DESIGN */
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
            ) : (
              /* NEWS / ENTERTAINMENT FIELDS DESIGN */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Título do artigo */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                      Título da Matéria / Artigo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Novo Álbum de Anselmo Ralph a caminho"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Artista relacionado */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                      Artista / Assunto (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Anselmo Ralph"
                      value={artista}
                      onChange={(e) => setArtista(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Autor / Fonte */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                      Autor / Fonte (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Redação ROX"
                      value={autor}
                      onChange={(e) => setAutor(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Subtítulo / Lead */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                    Subtítulo / Lead do Artigo (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Uma frase marcante resumindo a notícia que aparece sob o título..."
                    value={subtitulo}
                    onChange={(e) => setSubtitulo(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            )}

            {/* COMMON FIELDS SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Categoria list */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                  Categoria *
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-2.5 py-2.5 rounded focus:outline-none focus:border-emerald-400 font-bold uppercase tracking-wide cursor-pointer"
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
                    className="w-4.5 h-4.5 rounded cursor-pointer"
                    style={{ accentColor: config.accentColor }}
                  />
                  <span>Destaque (Hero Banner)</span>
                </label>
              </div>
            </div>

            {/* URL da imagem de capa */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-0.5">
                Capa / Imagem de Destaque
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Ex: https://... ou faça upload usando o botão ao lado"
                  value={capa}
                  onChange={(e) => setCapa(e.target.value)}
                  className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400 font-mono"
                />
                
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-zinc-300 hover:text-white hover:bg-[#252525] hover:border-[#383838] rounded cursor-pointer select-none font-bold transition-all shrink-0">
                  <Upload size={14} className={uploadingImage ? "animate-spin text-emerald-400" : ""} />
                  {uploadingImage ? "A carregar..." : "Carregar Foto"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">
                👉 Cole um URL ou clique em <strong>Carregar Foto</strong> para escolher um arquivo do seu dispositivo. Ele será redimensionado automaticamente.
              </p>
              {capa.trim() && (
                <div className="p-3 bg-black/40 rounded border border-[#2a2a2a] flex items-center justify-between gap-3 w-max max-w-full">
                  <div className="flex items-center gap-3">
                    <img
                      src={capa}
                      alt="Preview de Capa"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                      className="w-12 h-12 object-cover rounded border border-[#2a2a2a]"
                    />
                    <div>
                      <span className="block text-[10px] text-zinc-400 uppercase font-bold font-mono">Pré-visualização</span>
                      <span className="block text-[9px] text-zinc-550 max-w-[200px] truncate">{capa.startsWith("data:") ? "Foto Carregada (Base64)" : capa}</span>
                    </div>
                  </div>
                  {capa.startsWith("data:") && (
                    <button
                      type="button"
                      onClick={() => setCapa("")}
                      className="text-[9px] text-red-400 hover:text-red-300 font-bold uppercase transition-colors px-2 py-1 rounded bg-[#201010]"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* CONDITIONAL ACTION LINKS & CONTENT TEXTAREAS */}
            {tipo === "musica" ? (
              /* MUSIC LINK AND DESCRIPTION WORKFLOW */
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1 font-sans">
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
              </div>
            ) : (
              /* ARTICLES DESCRIPTION/CONTENT WORKFLOW */
              <div className="space-y-4 animate-fade-in">
                {/* Optional extern link for more info */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                    Link de Referência / Fonte Adicional (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Link de uma matéria de referência ou post de rede social..."
                    value={linkDownload}
                    onChange={(e) => setLinkDownload(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                {/* Conteúdo completo */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                    Conteúdo Completo do Artigo / Matéria *
                  </label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Escreva a notícia detalhadamente..."
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-3 rounded focus:outline-none focus:border-emerald-400 font-sans leading-relaxed"
                  />
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
                    📖 Este texto será renderizado detalhadamente na página do artigo. Use quebras de linha para formatar os parágrafos.
                  </p>
                </div>
              </div>
            )}

            {/* Submition controls */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={saving || (tipo === "musica" && descricao.length > 1000)}
                className="font-display font-black tracking-widest text-[#0a0a0a] bg-[#00e5a0] text-xs py-3 px-6 rounded-lg uppercase transition-all cursor-pointer hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: config.accentColor }}
              >
                {saving ? "A guardar..." : editingPost ? "Actualizar Post" : "Publicar Artigo"}
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

          {/* Sync Status Indicator */}
          <div className="flex items-center justify-end gap-2 px-1">
            {cloudAuth ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                Sincronizado na Nuvem
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shadow-sm shadow-orange-400/50" />
                Apenas em Cache Local (Sem Autenticação)
              </div>
            )}
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
                        <div className="flex flex-col">
                          <span className="truncate">{post.titulo}</span>
                          {post.tipo && post.tipo !== "musica" && (
                            <span className="text-[8px] uppercase tracking-widest font-black" style={{ color: config.accentColor }}>
                              {post.tipo === "noticia" ? "Notícia" : "Entretenimento"}
                            </span>
                          )}
                        </div>
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
