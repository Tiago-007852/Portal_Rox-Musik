import { Post, SiteConfig, Category } from "./types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "afro-house", nome: "AFRO HOUSE", cor: "#ff6b35" },
  { id: "kizombaria", nome: "KIZOMBA", cor: "#9b59b6" },
  { id: "zoukland", nome: "ZOUK", cor: "#e74c3c" },
  { id: "album", nome: "ÁLBUM", cor: "#00e5a0" },
  { id: "mixtape", nome: "MIXTAPE", cor: "#f39c12" },
  { id: "ep", nome: "EP", cor: "#3498db" },
  { id: "rap", nome: "RAP", cor: "#9c88ff" },
  { id: "kuduro", nome: "KUDURO", cor: "#f5cd79" },
  { id: "love", nome: "LOVE", cor: "#fd79a8" }
];

export const DEFAULT_CONFIG: SiteConfig = {
  siteName: "ROX-MUSIK",
  slogan: "O Blog da Banda",
  email: "nelmariotanganica@gmail.com",
  telefone: "+244 940358125",
  facebook: "https://web.facebook.com/nelmariorox",
  instagram: "https://www.instagram.com/nelmariorox482",
  youtube: "https://www.youtube.com/@portalrox-musicoblogdaband216",
  whatsapp: "https://wa.me/message/WPKRMCXWDWYJI1",
  pinterest: "https://br.pinterest.com/nelmariotanganica",
  accentColor: "#00e5a0"
};

export const SEED_POSTS: Post[] = [
  {
    id: "1",
    titulo: "Noite de Luanda",
    artista: "Dj Nelinho feat. Roxy",
    categoria: "AFRO HOUSE",
    capa: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60",
    descricao: "O mais novo hit de Afro House directo de Luanda. Produção de alta qualidade com batidas africanas e sintetizadores envolventes.",
    linkDownload: "https://example.com/download/noite-de-luanda",
    destaque: true,
    data: "2025-01-15",
    downloads: 1420
  },
  {
    id: "2",
    titulo: "Saudade do Mussulo",
    artista: "Nelson Tanga",
    categoria: "KIZOMBA",
    capa: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60",
    descricao: "Uma kizomba romântica e envolvente sobre as praias calmas do Mussulo. Ideal para dançar coladinho.",
    linkDownload: "https://example.com/download/saudade-mussulo",
    destaque: false,
    data: "2025-01-10",
    downloads: 980
  },
  {
    id: "3",
    titulo: "Zouk da Madrugada",
    artista: "Grupo Harmony",
    categoria: "ZOUK",
    capa: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60",
    descricao: "Zouk suave e apaixonante para as noites calientes de fim de semana.",
    linkDownload: "https://example.com/download/zouk-madrugada",
    destaque: false,
    data: "2025-01-08",
    downloads: 750
  },
  {
    id: "4",
    titulo: "Renascença — Album Completo",
    artista: "Rox Music Band",
    categoria: "ÁLBUM",
    capa: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=60",
    descricao: "Álbum completo com 12 faixas. Tracklist:\n1. Intro\n2. Força\n3. Luanda Noite\n4. Caminhos\n5. Ritmo do Guetto\n6. Sem Parar\n7. Semba no Pé\n8. Sonhos de Menino\n9. Amor Rox\n10. Angola em Nós\n11. Kuduro Beats\n12. Outro",
    linkDownload: "https://example.com/download/album-renascenca",
    destaque: false,
    data: "2025-01-05",
    downloads: 2450
  },
  {
    id: "5",
    titulo: "Mixtape Verão 2025",
    artista: "Dj Mamona",
    categoria: "MIXTAPE",
    capa: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?w=500&auto=format&fit=crop&q=60",
    descricao: "A melhor mixtape do verão com os maiores hits de Afro House, Kuduro, Afro Beats e Amapiano compilados pelo talentoso Dj Mamona.",
    linkDownload: "https://example.com/download/mixtape-verao",
    destaque: false,
    data: "2024-12-28",
    downloads: 3120
  },
  {
    id: "6",
    titulo: "Primeiros Passos EP",
    artista: "Young Rox",
    categoria: "EP",
    capa: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=60",
    descricao: "EP de estreia com 5 faixas inéditas mostrando a versatilidade do novo talento Young Rox.",
    linkDownload: "https://example.com/download/primeiros-passos",
    destaque: false,
    data: "2024-12-20",
    downloads: 650
  },
  {
    id: "7",
    titulo: "Sunset Afro",
    artista: "DJ Luanda",
    categoria: "AFRO HOUSE",
    capa: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60",
    descricao: "Vibes de pôr do sol com o melhor do Afro House modernista.",
    linkDownload: "https://example.com/download/sunset-afro",
    destaque: false,
    data: "2024-12-18",
    downloads: 1100
  },
  {
    id: "8",
    titulo: "Amor Proibido",
    artista: "Carla Morena",
    categoria: "KIZOMBA",
    capa: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=60",
    descricao: "Kizomba de dança com letra sensual e apaixonante.",
    linkDownload: "https://example.com/download/amor-proibido",
    destaque: false,
    data: "2024-12-15",
    downloads: 1300
  },
  {
    id: "9",
    titulo: "Tropical Beats",
    artista: "House Crew",
    categoria: "AFRO HOUSE",
    capa: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=60",
    descricao: "Batidas tropicais e quentes para fazer tremer as pistas de Angola.",
    linkDownload: "https://example.com/download/tropical-beats",
    destaque: false,
    data: "2024-12-10",
    downloads: 870
  },
  {
    id: "10",
    titulo: "Ondas do Mar",
    artista: "Zouk Stars",
    categoria: "ZOUK",
    capa: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=60",
    descricao: "Zouk relaxante tocado nas praias quentes de Benguela.",
    linkDownload: "https://example.com/download/ondas-do-mar",
    destaque: false,
    data: "2024-12-05",
    downloads: 610
  },
  {
    id: "11",
    titulo: "Colectânea 2024",
    artista: "Vários Artistas",
    categoria: "ÁLBUM",
    capa: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=60",
    descricao: "Os melhores hits lançados e produzidos em terras angolanas em 2024.",
    linkDownload: "https://example.com/download/colectanea-2024",
    destaque: false,
    data: "2024-11-30",
    downloads: 1890
  },
  {
    id: "12",
    titulo: "Night Tape Vol.3",
    artista: "DJ Night",
    categoria: "MIXTAPE",
    capa: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?w=500&auto=format&fit=crop&q=60",
    descricao: "Terceiro volume da aclamada série de mixtapes noturnas feitas pelo renomado DJ Night.",
    linkDownload: "https://example.com/download/night-tape-3",
    destaque: false,
    data: "2024-11-25",
    downloads: 2050
  }
];
