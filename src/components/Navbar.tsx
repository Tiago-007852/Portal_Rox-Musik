import React, { useState } from "react";
import { Search, Lock, Menu, X, Globe, Music, Sun, Moon } from "lucide-react";
import { SiteConfig, Category } from "../types";

interface NavbarProps {
  currentRoute: { name: string; param?: string };
  navigate: (routeName: string, param?: string) => void;
  config: SiteConfig;
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme?: "dark" | "light";
  toggleTheme?: () => void;
}

export default function Navbar({
  currentRoute,
  navigate,
  config,
  categories,
  searchQuery,
  setSearchQuery,
  theme = "dark",
  toggleTheme,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      navigate("search");
    }
  };

  const handleNavClick = (categoryName: string) => {
    navigate("category", categoryName);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#111111]/95 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("home")}>
            <span 
              className="text-2xl font-black tracking-tighter uppercase font-display flex items-center"
              style={{ color: "#ffffff" }}
            >
              <span style={{ color: config.accentColor }}>R</span>
              OX-MUSIK
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 text-xs font-bold uppercase tracking-widest">
            <button
              onClick={() => navigate("home")}
              className={`transition-colors hover:text-white ${
                currentRoute.name === "home" ? "font-black" : "text-[#aaaaaa]"
              }`}
              style={currentRoute.name === "home" ? { color: config.accentColor } : {}}
            >
              Home
            </button>
            {categories.map((cat) => {
              const belongsToNews = cat.nome.toUpperCase() === "NOTÍCIA" || cat.nome.toUpperCase() === "NOTÍCIAS";
              const belongsToEnt = cat.nome.toUpperCase() === "ENTRETENIMENTO";
              
              const isActive = (currentRoute.name === "category" && currentRoute.param === cat.nome) ||
                               (belongsToNews && currentRoute.name === "noticias") ||
                               (belongsToEnt && currentRoute.name === "entretenimento");
              return (
                <button
                  key={cat.id}
                  onClick={() => handleNavClick(cat.nome)}
                  className={`transition-colors hover:text-white ${
                    isActive ? "font-black" : "text-[#aaaaaa]"
                  }`}
                  style={isActive ? { color: cat.cor } : {}}
                >
                  {cat.nome}
                </button>
              );
            })}
          </nav>

          {/* Actions Desk (Search, Admin trigger, mobile button) */}
          <div className="flex items-center space-x-4">
            {/* Inline Search Bar toggler */}
            <div className="relative flex items-center">
              {showSearchInput && (
                <input
                  type="text"
                  placeholder="Pesquisar música, artista..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-lg px-3 py-1.5 mr-2 text-sm w-44 md:w-56 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-sans"
                  autoFocus
                />
              )}
              <button
                onClick={() => {
                  setShowSearchInput(!showSearchInput);
                  if (!showSearchInput) {
                    navigate("search");
                  }
                }}
                className="text-[#aaaaaa] hover:text-white p-2 rounded-full hover:bg-[#1a1a1a] transition-colors"
                title="Pesquisar"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#aaaaaa] hover:text-white hover:bg-[#1a1a1a] transition-all cursor-pointer relative flex items-center justify-center border border-[#2a2a2a]/20"
              title={theme === "dark" ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
            >
              {theme === "dark" ? (
                <Sun size={17} className="text-amber-400 animate-pulse" />
              ) : (
                <Moon size={17} className="text-indigo-600" />
              )}
            </button>

            {/* Admin discrete lock button */}
            <button
              onClick={() => navigate("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide uppercase transition-all ${
                currentRoute.name === "admin"
                  ? "bg-[#00e5a0] text-black border-[#00e5a0]"
                  : "bg-[#111111] text-[#aaaaaa] border-[#2a2a2a] hover:bg-[#1a1a1a] hover:text-white"
              }`}
              style={currentRoute.name === "admin" ? { backgroundColor: config.accentColor, color: "#000000", borderColor: config.accentColor } : {}}
              title="Painel Admin"
            >
              <Lock size={13} />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-[#aaaaaa] hover:text-white hover:bg-[#1a1a1a] transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d0d] border-b border-[#2a2a2a] px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          <button
            onClick={() => {
              navigate("home");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-white hover:bg-[#1a1a1a]"
          >
            Home
          </button>
          {categories.map((cat) => {
            const belongsToNews = cat.nome.toUpperCase() === "NOTÍCIA" || cat.nome.toUpperCase() === "NOTÍCIAS";
            const belongsToEnt = cat.nome.toUpperCase() === "ENTRETENIMENTO";
            
            const isActive = (currentRoute.name === "category" && currentRoute.param === cat.nome) ||
                             (belongsToNews && currentRoute.name === "noticias") ||
                             (belongsToEnt && currentRoute.name === "entretenimento");
            return (
              <button
                key={cat.id}
                onClick={() => handleNavClick(cat.nome)}
                className="block w-full text-left px-3 py-2.5 rounded-md text-base font-medium hover:bg-[#1a1a1a] transition-all"
                style={{ 
                  borderLeft: `3px solid ${cat.cor}`, 
                  paddingLeft: "12px", 
                  color: isActive ? cat.cor : "#dddddd"
                }}
              >
                {cat.nome}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
