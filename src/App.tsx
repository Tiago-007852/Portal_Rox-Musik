import { useState, useEffect } from "react";
import { Post, SiteConfig, Category } from "./types";
import { SEED_POSTS, DEFAULT_CONFIG, DEFAULT_CATEGORIES } from "./seedData";
import { motion } from "motion/react";
import {
  testFirebaseConnection,
  fetchSiteConfig,
  saveSiteConfig,
  fetchCategories,
  saveCategory,
  fetchPosts,
  createPostInFirestore,
  updatePostInFirestore,
  deletePostFromFirestore,
  incrementDownloadInFirestore
} from "./firebaseService";

// Public visual blocks
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import CategoryPage from "./components/CategoryPage";
import PostPage from "./components/PostPage";
import SearchPage from "./components/SearchPage";

// Security credential admin gates
import AdminLogin from "./components/AdminLogin";

// Modular Admin subsections
import AdminDashboard from "./components/AdminDashboard";
import AdminPosts from "./components/AdminPosts";
import AdminCategories from "./components/AdminCategories";
import AdminGallery from "./components/AdminGallery";
import AdminStats from "./components/AdminStats";
import AdminSettings from "./components/AdminSettings";

// Icon deck
import { LayoutDashboard, FileText, Palette, Image as ImageIcon, BarChart3, Settings, LogOut, Lock } from "lucide-react";

export default function App() {
  // --- DATABASE / LOCAL PERSISTENCE LOADER ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingDb, setLoadingDb] = useState(true);

  // Theme state logic (persist preference in local storage)
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("rox_theme") as "dark" | "light") || "dark"
  );

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("rox_theme", nextTheme);
  };

  // Routings (Hash style using state)
  const [currentRoute, setCurrentRoute] = useState<{ name: string; param?: string }>({ name: "home" });
  const [routeHistory, setRouteHistory] = useState<{ name: string; param?: string }[]>([]);

  // Securing login state
  const [adminSession, setAdminSession] = useState(false);
  const [adminTab, setAdminTab] = useState("dashboard"); // dashboard, posts, categories, gallery, stats, settings
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto clean toast message after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Initializing collections from Firestore with test connection verified
  useEffect(() => {
    testFirebaseConnection();

    async function loadFirebaseData() {
      try {
        const [loadedConfig, loadedCategories, loadedPosts] = await Promise.all([
          fetchSiteConfig(),
          fetchCategories(),
          fetchPosts()
        ]);
        setConfig(loadedConfig);
        setCategories(loadedCategories);
        setPosts(loadedPosts);
      } catch (err) {
        console.error("Erro ao carregar do Firestore: ", err);
        
        // Offline Fallback to localStorage data
        const storedPosts = localStorage.getItem("rox_posts");
        const storedCategories = localStorage.getItem("rox_categories");
        const storedConfig = localStorage.getItem("rox_config");

        if (storedPosts) setPosts(JSON.parse(storedPosts));
        else setPosts(SEED_POSTS);

        if (storedCategories) setCategories(JSON.parse(storedCategories));
        else setCategories(DEFAULT_CATEGORIES);

        if (storedConfig) setConfig(JSON.parse(storedConfig));
        else setConfig(DEFAULT_CONFIG);
      } finally {
        setLoadingDb(false);
      }
    }

    loadFirebaseData();

    // Check secure admin login sessions
    const sessionActive = localStorage.getItem("rox_admin_session");
    const sessionTime = localStorage.getItem("rox_admin_session_time");
    if (sessionActive === "active") {
      const hours8 = 8 * 60 * 60 * 1000;
      if (sessionTime && Date.now() - Number(sessionTime) > hours8) {
        localStorage.removeItem("rox_admin_session");
        localStorage.removeItem("rox_admin_session_time");
      } else {
        setAdminSession(true);
      }
    }

    // Capture standard anchor hash-routing fallbacks
    const handleHashPath = () => {
      const hash = window.location.hash; // e.g. #/categoria/afro-house
      if (!hash || hash === "#" || hash === "#/" || hash === "#/home") {
        setCurrentRoute({ name: "home" });
      } else if (hash.startsWith("#/categoria/")) {
        const cat = decodeURIComponent(hash.replace("#/categoria/", ""));
        setCurrentRoute({ name: "category", param: cat });
      } else if (hash.startsWith("#/post/")) {
        const id = decodeURIComponent(hash.replace("#/post/", ""));
        setCurrentRoute({ name: "post", param: id });
      } else if (hash === "#/admin") {
        setCurrentRoute({ name: "admin" });
      } else if (hash === "#/404") {
        setCurrentRoute({ name: "not-found" });
      } else {
        setCurrentRoute({ name: "not-found" });
      }
    };

    window.addEventListener("hashchange", handleHashPath);
    handleHashPath(); // runs initially

    return () => window.removeEventListener("hashchange", handleHashPath);
  }, []);

  // --- STATE HANDLERS ---
  const navigate = (routeName: string, param?: string) => {
    // Save history (limited to max 20 entries)
    setRouteHistory((prev) => [...prev.slice(-19), currentRoute]);
    setCurrentRoute({ name: routeName, param });

    // Set matching hashes for address bars
    if (routeName === "home") {
      window.location.hash = "/";
    } else if (routeName === "category" && param) {
      window.location.hash = `/categoria/${param}`;
    } else if (routeName === "post" && param) {
      window.location.hash = `/post/${param}`;
    } else if (routeName === "admin") {
      window.location.hash = "/admin";
    } else if (routeName === "not-found") {
      window.location.hash = "/404";
    }
  };

  const handleBack = () => {
    if (routeHistory.length > 0) {
      const prev = routeHistory[routeHistory.length - 1];
      setRouteHistory((prevList) => prevList.slice(0, -1));
      navigate(prev.name, prev.param);
    } else {
      navigate("home");
    }
  };

  const handlePostClick = async (id: string) => {
    // Increment downloads count in local memory immediately for smooth UX
    const updated = posts.map((p) => {
      if (p.id === id) {
        return { ...p, downloads: (p.downloads || 0) + 1 };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem("rox_posts", JSON.stringify(updated));

    // Persist download hit in Firestore background
    try {
      await incrementDownloadInFirestore(id);
    } catch (err) {
      console.warn("Could not sync download analytics.", err);
    }

    navigate("post", id);
  };

  // Auth logins
  const handleLoginSuccess = () => {
    setAdminSession(true);
    localStorage.setItem("rox_admin_session", "active");
    localStorage.setItem("rox_admin_session_time", String(Date.now()));
  };

  const handleLogout = () => {
    setAdminSession(false);
    localStorage.removeItem("rox_admin_session");
    localStorage.removeItem("rox_admin_session_time");
    navigate("home");
  };

  // --- INTERACTIVE DATABASE CRUD FUNCTIONS ---
  // Save Posts with business rule validation: Only one post can be featured
  const handleCreatePost = async (newPostData: Omit<Post, "id">) => {
    const newId = "post_" + String(Date.now());
    const newPost: Post = {
      ...newPostData,
      id: newId,
      downloads: 0,
    };

    let updatedList = [...posts];
    if (newPost.destaque) {
      // Deselect existing features
      updatedList = updatedList.map((p) => ({ ...p, destaque: false }));
    }

    updatedList = [newPost, ...updatedList];
    setPosts(updatedList);
    localStorage.setItem("rox_posts", JSON.stringify(updatedList));

    try {
      await createPostInFirestore(newPost);
      if (newPost.destaque) {
        // Clear other highlights in background
        const oldFeatured = posts.filter(p => p.destaque && p.id !== newId);
        for (const oldP of oldFeatured) {
          await updatePostInFirestore(oldP.id, { destaque: false });
        }
      }
      setToastMessage("✅ Lançamento guardado com sucesso!");
    } catch (err) {
      setToastMessage("⚠️ Lançamento local ativo, mas erro ao guardar na nuvem.");
    }
  };

  const handleUpdatePost = async (id: string, updatedData: Partial<Post>) => {
    const targetPost = posts.find((p) => p.id === id);
    if (!targetPost) return;

    const merged = { ...targetPost, ...updatedData };
    let updatedList = posts.map((p) => p.id === id ? merged : p);
    
    if (updatedData.destaque) {
      // Ensure only 1 destaque is active
      updatedList = updatedList.map((p) => {
        if (p.id !== id) {
          return { ...p, destaque: false };
        }
        return p;
      });
    }

    setPosts(updatedList);
    localStorage.setItem("rox_posts", JSON.stringify(updatedList));

    try {
      await updatePostInFirestore(id, updatedData);
      if (updatedData.destaque) {
        const oldFeatured = posts.filter(p => p.destaque && p.id !== id);
        for (const oldP of oldFeatured) {
          await updatePostInFirestore(oldP.id, { destaque: false });
        }
      }
      setToastMessage("✅ Lançamento guardado com sucesso!");
    } catch (err) {
      setToastMessage("⚠️ Erro ao atualizar na nuvem.");
    }
  };

  const handleDeletePost = async (id: string) => {
    const updatedList = posts.filter((p) => p.id !== id);
    setPosts(updatedList);
    localStorage.setItem("rox_posts", JSON.stringify(updatedList));

    try {
      await deletePostFromFirestore(id);
      setToastMessage("✅ Post removido do sistema.");
    } catch (err) {
      setToastMessage("⚠️ Erro ao remover da nuvem.");
    }
  };

  const handleUpdateCategory = async (catId: string, updatedData: Partial<Category>) => {
    // Find old cat nome to rename posts category
    const oldCat = categories.find((c) => c.id === catId);

    const updatedCategories = categories.map((cat) => {
      if (cat.id === catId) {
        return { ...cat, ...updatedData };
      }
      return cat;
    });
    setCategories(updatedCategories);
    localStorage.setItem("rox_categories", JSON.stringify(updatedCategories));

    try {
      await saveCategory(catId, updatedData);
      setToastMessage("✅ Categoria atualizada!");
    } catch (err) {
      setToastMessage("⚠️ Erro ao sincronizar categoria.");
    }

    // Rename matching posts category string
    if (oldCat && updatedData.nome) {
      const updatedPosts = posts.map((p) => {
        if (p.categoria.toUpperCase() === oldCat.nome.toUpperCase()) {
          return { ...p, categoria: updatedData.nome!.toUpperCase() };
        }
        return p;
      });
      setPosts(updatedPosts);
      localStorage.setItem("rox_posts", JSON.stringify(updatedPosts));

      try {
        const postsToUpdate = posts.filter(p => p.categoria.toUpperCase() === oldCat.nome.toUpperCase());
        for (const item of postsToUpdate) {
          await updatePostInFirestore(item.id, { categoria: updatedData.nome!.toUpperCase() });
        }
      } catch (err) {
        console.error("Erro ao atualizar categoria dos posts: ", err);
      }
    }
  };

  // Settings
  const handleSaveConfig = async (updatedConfig: SiteConfig) => {
    setConfig(updatedConfig);
    localStorage.setItem("rox_config", JSON.stringify(updatedConfig));

    try {
      await saveSiteConfig(updatedConfig);
      setToastMessage("✅ Configurações salvas!");
    } catch (err) {
      setToastMessage("⚠️ Erro ao salvar configurações na nuvem.");
    }
  };

  const handleResetConfig = async () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.setItem("rox_config", JSON.stringify(DEFAULT_CONFIG));

    try {
      await saveSiteConfig(DEFAULT_CONFIG);
      setToastMessage("✅ Configurações restauradas para o padrão!");
    } catch (err) {
      setToastMessage("⚠️ Erro ao restaurar configurações.");
    }
  };

  // --- VIEW RENDERING LOGIC ---
  const renderPublicPageContent = () => {
    switch (currentRoute.name) {
      case "category":
        return (
          <CategoryPage
            categoryName={currentRoute.param || "AFRO HOUSE"}
            posts={posts}
            categories={categories}
            onPostClick={handlePostClick}
            config={config}
            navigate={navigate}
          />
        );
      case "post":
        const targetPost = posts.find((p) => p.id === currentRoute.param);
        if (!targetPost) {
          return (
            <div className="py-20 text-center space-y-4 font-sans">
              <p className="text-sm text-[#aaaaaa]">Ficheiro ou artigo musical não localizado.</p>
              <button onClick={() => navigate("home")} className="text-xs uppercase font-black text-[#00e5a0]" style={{ color: config.accentColor }}>
                Voltar à Página Inicial
              </button>
            </div>
          );
        }
        return (
          <PostPage
            post={targetPost}
            allPosts={posts}
            categories={categories}
            onBack={handleBack}
            onPostClick={handlePostClick}
            config={config}
          />
        );
      case "search":
        return (
          <SearchPage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            posts={posts}
            categories={categories}
            onPostClick={handlePostClick}
            config={config}
          />
        );
      case "not-found":
        return (
          <div className="py-24 text-center space-y-6 font-sans flex flex-col items-center justify-center min-h-[50vh]">
            <h1 className="text-6xl font-black text-rose-500 tracking-tighter">404</h1>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Página não encontrada</h2>
            <p className="text-zinc-500 text-xs max-w-xs mx-auto">
              O link que tentou aceder está errado ou o conteúdo foi removido pela banda.
            </p>
            <button
              onClick={() => navigate("home")}
              className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#00e5a0] text-black hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-display"
              style={{ backgroundColor: config.accentColor }}
            >
              Voltar ao Início
            </button>
          </div>
        );
      case "home":
      default:
        return (
          <HomePage
            posts={posts}
            categories={categories}
            config={config}
            onPostClick={handlePostClick}
            navigate={navigate}
          />
        );
    }
  };

  const renderAdminPageContent = () => {
    switch (adminTab) {
      case "posts":
        return (
          <AdminPosts
            posts={posts}
            categories={categories}
            onCreatePost={handleCreatePost}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            config={config}
          />
        );
      case "categories":
        return (
          <AdminCategories
            categories={categories}
            posts={posts}
            onUpdateCategory={handleUpdateCategory}
            config={config}
          />
        );
      case "gallery":
        return (
          <AdminGallery
            posts={posts}
            config={config}
          />
        );
      case "stats":
        return (
          <AdminStats
            posts={posts}
            categories={categories}
          />
        );
      case "settings":
        return (
          <AdminSettings
            config={config}
            onSave={handleSaveConfig}
            onReset={handleResetConfig}
          />
        );
      case "dashboard":
      default:
        return (
          <AdminDashboard
            posts={posts}
            categories={categories}
            setActiveTab={setAdminTab}
            onEditPost={handleUpdatePost}
            config={config}
          />
        );
    }
  };

  // Active styles based on site theme accent color state
  const isPublicPage = currentRoute.name !== "admin";

  return (
    <div className={`min-h-screen ${theme} bg-[#0a0a0a] text-white flex flex-col justify-between font-sans selection:bg-emerald-400 selection:text-black`}>
      
      {/* 1. Header fixed layout banner */}
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        config={config}
        categories={categories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* 2. Main content viewport section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loadingDb ? (
          /* Glassmorphic spinner visualizer load state */
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
            <div className="w-10 h-10 border-4 border-[#00e5a0]/25 border-t-[#00e5a0] rounded-full animate-spin" style={{ borderTopColor: config.accentColor }} />
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">Sincronizando com a Nuvem...</p>
          </div>
        ) : isPublicPage ? (
          /* Public layout: Main View + Sidebar (on desktop) */
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <motion.div
                key={currentRoute.name + (currentRoute.param || '')}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {renderPublicPageContent()}
              </motion.div>
            </div>
            
            {/* Show Sidebar on public layouts */}
            <Sidebar
              posts={posts}
              config={config}
              onPostClick={handlePostClick}
            />
          </div>
        ) : (
          /* Admin Center Layout (Private View with Side Navigation) */
          <div>
            {!adminSession ? (
              <AdminLogin onLoginSuccess={handleLoginSuccess} config={config} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Admin Side Control Bar (Col span 3) */}
                <div className="lg:col-span-3 bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden divide-y divide-[#1e1e1e]">
                  <div className="p-5 text-center bg-[#151515] border-b border-[#2a2a2a]">
                    <div className="inline-flex p-2.5 bg-[#00e5a0]/10 text-[#00e5a0] rounded-lg mb-2" style={{ color: config.accentColor }}>
                      <Lock size={20} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Rox Admin Center</h3>
                    <p className="text-[10px] text-[#aaaaaa] font-medium mt-0.5">Sessão Segura Activa</p>
                  </div>

                  <nav className="p-3 space-y-1">
                    {[
                      { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
                      { id: "posts", label: "Gerir Posts", Icon: FileText },
                      { id: "categories", label: "Categorias", Icon: Palette },
                      { id: "gallery", label: "Galeria / Capas", Icon: ImageIcon },
                      { id: "stats", label: "Estatísticas", Icon: BarChart3 },
                      { id: "settings", label: "Configurar Site", Icon: Settings },
                    ].map((item) => {
                      const isActive = adminTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setAdminTab(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-left cursor-pointer ${
                            isActive
                              ? "text-black font-black"
                              : "text-[#aaaaaa] hover:text-white hover:bg-[#1a1a1a]"
                          }`}
                          style={isActive ? { backgroundColor: config.accentColor } : {}}
                        >
                          <item.Icon size={16} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left mt-4 border border-red-500/20 cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Terminar Sessão</span>
                    </button>
                  </nav>
                </div>

                {/* Admin Active Tab Content (Col span 9) */}
                <div className="lg:col-span-9 bg-transparent">
                  {renderAdminPageContent()}
                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* 3. Footer area section */}
      <Footer config={config} categories={categories} navigate={navigate} />

      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          className="fixed bottom-6 right-6 z-50 bg-[#151515] hover:bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl rounded-xl p-4.5 flex items-center gap-2.5 font-sans min-w-[220px]"
        >
          <span className="text-xs font-extrabold text-white leading-none">
            {toastMessage}
          </span>
        </motion.div>
      )}

    </div>
  );
}
