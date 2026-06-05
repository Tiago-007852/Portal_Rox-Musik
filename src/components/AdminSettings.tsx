import React, { useState } from "react";
import { SiteConfig } from "../types";
import { Settings, Save, RotateCcw, CheckCircle, Flame } from "lucide-react";

interface AdminSettingsProps {
  config: SiteConfig;
  onSave: (updated: SiteConfig) => void;
  onReset: () => void;
}

export default function AdminSettings({ config, onSave, onReset }: AdminSettingsProps) {
  const [siteName, setSiteName] = useState(config.siteName);
  const [slogan, setSlogan] = useState(config.slogan);
  const [email, setEmail] = useState(config.email);
  const [telefone, setTelefone] = useState(config.telefone);
  
  // Social states
  const [facebook, setFacebook] = useState(config.facebook);
  const [instagram, setInstagram] = useState(config.instagram);
  const [youtube, setYoutube] = useState(config.youtube);
  const [whatsapp, setWhatsapp] = useState(config.whatsapp);
  const [pinterest, setPinterest] = useState(config.pinterest);
  
  // Color Accent
  const [accentColor, setAccentColor] = useState(config.accentColor);

  const [notif, setNotif] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      siteName,
      slogan,
      email,
      telefone,
      facebook,
      instagram,
      youtube,
      whatsapp,
      pinterest,
      accentColor
    });

    setNotif("Configurações gravadas com sucesso!");
    setTimeout(() => setNotif(""), 2000);
  };

  const handleResetClick = () => {
    const confirmDel = window.confirm("Tens a certeza que desejas repor as configurações e cor para os valores padrão?");
    if (confirmDel) {
      onReset();
      setNotif("Restaurado com sucesso!");
      setTimeout(() => setNotif(""), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div>
        <h2 className="text-xl font-black font-display tracking-widest text-white uppercase flex items-center gap-2">
          <Settings className="text-[#00e5a0]" style={{ color: config.accentColor }} />
          Configurações do Site
        </h2>
        <p className="text-[#aaaaaa] text-xs">Mude o nome do blog, links sociais e a cor de destaque geral</p>
      </div>

      {notif && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#00e5a0] text-xs flex items-center gap-2.5">
          <CheckCircle size={16} />
          <span className="font-semibold">{notif}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core settings */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-black tracking-widest uppercase text-white border-b border-[#2a2a2a] pb-2.5 flex items-center gap-2">
            <Flame size={14} className="text-[#00e5a0]" style={{ color: accentColor }} />
            Identidade do Portal e Visual
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1.5">
                Nome do Site
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-3 py-2 rounded text-xs focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1.5">
                Slogan / Subtítulo
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-3 py-2 rounded text-xs focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1.5">
                Email de Contacto
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-3 py-2 rounded text-xs focus:outline-none focus:border-emerald-400 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1.5">
                Telefone de Contacto
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-3 py-2 rounded text-xs focus:outline-none focus:border-emerald-400 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1.5">
                Cor de Destaque (Accent)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-8 bg-transparent cursor-pointer border-0 p-0"
                />
                <span className="text-xs uppercase font-mono text-[#aaaaaa] font-bold">{accentColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social channels settings */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-black tracking-widest uppercase text-white border-b border-[#2a2a2a] pb-2.5">
            Canais Sociais & Links Externos
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                Link do Facebook
              </label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400 font-mono"
                placeholder="Ex: https://facebook.com/user"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                Link do Instagram
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400 font-mono"
                placeholder="Ex: https://instagram.com/user"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                Link do YouTube (Canal)
              </label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400 font-mono"
                placeholder="Ex: https://youtube.com/c/canal"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                Link / Mensagem do WhatsApp
              </label>
              <input
                type="url"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400 font-mono"
                placeholder="Ex: https://wa.me/message/xyz"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] tracking-widest mb-1">
                Link do Pinterest
              </label>
              <input
                type="url"
                value={pinterest}
                onChange={(e) => setPinterest(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-400 font-mono"
                placeholder="Ex: https://pinterest.com/user"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center gap-3.5">
          <button
            type="submit"
            className="font-display font-black tracking-widest text-[#0a0a0a] bg-[#00e5a0] text-xs py-3 px-6 rounded-lg uppercase flex items-center gap-2.5 transition-all cursor-pointer hover:bg-emerald-300"
            style={{ backgroundColor: accentColor }}
          >
            <Save size={15} /> Gravar Configurações
          </button>

          <button
            type="button"
            onClick={handleResetClick}
            className="font-display font-bold tracking-widest text-zinc-400 bg-transparent py-3 px-5 text-xs rounded-lg uppercase flex items-center gap-2.5 hover:text-white transition-all cursor-pointer border border-[#2a2a2a]"
          >
            <RotateCcw size={15} /> Repor Valores Padrão
          </button>
        </div>
      </form>
    </div>
  );
}
