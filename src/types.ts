export interface Post {
  id: string;
  titulo: string;
  artista: string;
  produtor?: string;
  categoria: string;
  capa: string;
  descricao: string;
  linkDownload: string;
  destaque: boolean;
  data: string;
  downloads?: number; // to support "Mais Baixados"
}

export interface SiteConfig {
  siteName: string;
  slogan: string;
  email: string;
  telefone: string;
  facebook: string;
  instagram: string;
  youtube: string;
  whatsapp: string;
  pinterest: string;
  accentColor: string;
}

export interface Category {
  id: string;
  nome: string;
  cor: string;
}
