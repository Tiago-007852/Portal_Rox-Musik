# 🎵 ROX-MUSIK — Portal Premium de Lançamentos Musicais

Bem-vindo ao **ROX-MUSIK**, um portal e web app de música contemporâneo, responsivo e de altíssimo polimento visual. O design foi concebido com base na identidade **Vibrant Palette** (Paleta Vibrante) para entregar uma experiência imersiva e moderna para os amantes de ritmos africanos e eletrónicos como Kizomba, Afro House, Zouk, e compilados exclusivos.

Este portal combina um feed público limpo e focado no usuário para navegação e downloads de faixas com um **Rox Admin Center** seguro e completo para produtores, bandas e moderadores controlarem o portal por inteiro.

---

## ✨ Recursos Principais (Features)

### 🌍 Canas de Visualização Pública (User Experience)
*   **Página Inicial Premium (Home)**:
    *   **Banner de Grande Destaque**: Espaço de alta visibilidade com efeitos de destaque e acesso rápido com clique único para ouvir ou baixar o lançamento principal da semana.
    *   **Grade de Últimos Lançamentos**: Feed esteticamente distribuído em grelha responsiva (bento style) com capas quadradas, distintivos coloridos inteligentes de acordo com cada categoria e botões interativos para download.
*   **Navegação Dinâmica por Género**: Filtro por canais temáticos (ex: Kizomba, Afro House, Zouk, Álbuns, Mixtapes), com mudança adaptativa da cor de destaque do site para cada estilo escolhido.
*   **Detalhe de Lançamento Único (PostPage)**:
    *   Exposição da capa do trabalho em alta resolução.
    *   Ficha técnica detalhada (artista, data, produtor, etc.) e espaço formatado para notas e descrição das canções.
    *   Botão CTA (Call-to-Action) proeminente e flutuante para download do ficheiro.
    *   **Secção "Podes Gostar Também"**: Algoritmo reativo que sugere de forma automática até 4 canções semelhantes e do mesmo género que o usuário está visualizando.
*   **Campanha Social Integrada**: Dock de partilha integrada com ações diretas para WhatsApp, Facebook, Twitter (X) e cópia rápida do link do portal com confirmação visual dinâmica.
*   **Motor de Procura Avançada**:
    *   Pesquisa indexada em tempo real por artista, título ou estilo musical.
    *   Tags inteligentes com termos de sugestão recomendados (ex: Kizomba, DJ Nelinho).

### 🔒 Rox Admin Center (Painel Administrativo)
Acesso reservado para gestão através de painel blindado com controlo total das informações:
*   **Dashboard Executivo**: Métricas chave com cartões de contagem (músicas inseridas, categorias configuradas, total simulado de downloads) e feed descritivo de últimas atividades.
*   **Gerir Músicas (Controlo CRUD)**: Formulário elegante para registar novos lançamentos, carregar links de imagens de capa, adicionar canais de download e definir qual música será exibida como o "Destaque Estelar" na página principal do blog.
*   **Gestão de Géneros e Cores**: Permite gerir as categorias do site e configurar a cor hexadecimal de realce que personalizará os distintivos e detalhes visuais em tempo real por todo o portal.
*   **Galeria Multimédia**: Mural focado na exibição dos álbuns e artes de capas de todos os itens guardados no banco.
*   **Módulo Estatístico Avançado**: Exposição em tempo real dos ranqueamentos dos artistas com mais lançamentos e um top gráfico de popularidade.
*   **Configurações do Site**: Painel para editar as redes sociais globais do portal (Facebook, Instagram, YouTube, WhatsApp da banda) bem como os contactos de email e telefone.

---

## 🛠️ Tecnologias Utilizadas (Tech Stack)

*   **⚡ React 19 && TypeScript**: Engine de desenvolvimento com segurança estática de dados, separando lógica de componentes e garantindo tipagem rígida inteligente para estruturas como `Post`, `Category`, e `SiteConfig`.
*   **🎨 Tailwind CSS v4.0**: Styling moderno e otimizado com variáveis de tema personalizadas, sistema flexbox/grid robusto, além de esquemas de cores de alto contraste e utilização abundante de espaço negativo.
*   **🌟 Motion (motion/react)**: Gestão de transições estéticas extremamente fluidas para efeitos de troca de páginas e entrada nas listas de músicas.
*   **📦 Lucide-React**: Conjunto de ícones vetoriais modernos, de traços limpos e altamente intuitivos em todos os botões e utilitários.
*   **💾 LocalStorage Persistence Engine**: Motor de persistência offline nativo do navegador para armazenar de modo persistente todos os álbuns, categorias, downloads simulados organizados e ajustes gerais do site configurados pelo administrador.
*   **🚀 Vite**: Ferramenta de build de última geração que viabiliza tempos de compilação quase instantâneos e ótima performance.

---

## 🚀 Como Iniciar o Projeto Localmente

Antes de começar, verifique se possui o [Node.js](https://nodejs.org/) instalado em seu computador.

### 1. Clonar o Diretório e Instalar Dependências
No terminal do projeto, execute o comando abaixo para realizar o setup inicial das bibliotecas listadas no `package.json`:
```bash
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento
Rode o script de desenvolvimento para habilitar o servidor local do Vite:
```bash
npm run dev
```
O projeto estará disponível para visualização no link:  
👉 **`http://localhost:3000`**

### 3. Compilar para Produção (Build)
Para compilar e otimizar toda a estrutura estática para publicação em servidores de produção:
```bash
npm run build
```

---

## 📖 Instruções de Uso

### Como Utilizar como Visitante:
1.  **Explorar Músicas**: Use as opções do menu no topo (Header) para filtrar lançamentos por género ou clique no botão de pesquisa para procurar sua música favorita instantaneamente.
2.  **Visualizar e Baixar**: Selecione um card musical para ser direcionado à página de detalhe. Ali, clique em **"Baixar Música / Ouvir Streaming"** para avançar para a hiperligação de destino. O sistema contabilizará um download automaticamente na área do ranking!
3.  **Partilhar**: No fim da ficha técnica, selecione um canal social para enviar a canção ou copie o link direto para a sua área de transferência.

### Como Aceder e Utilizar o Painel Administrativo:
1.  **Fazer Login**: Clique no robô ou no botão com ícone de engrenagem/chave (conforme o layout) do portal ou mude a hash para `#/admin` na barra de endereço.
2.  **Credenciais de Acesso**: Use as credenciais administrativas simuladas de administrador configuradas na plataforma para efetuar login na barra segura de segurança (Admin Login).
3.  **Modificar Informações**: Adicione um novo post através do separador *"Gerir Posts"* ou mude as cores globais de realce das categorias na secção *"Categorias"* para ver a alteração ser renderizada instantaneamente.
