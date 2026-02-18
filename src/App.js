import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map, Calendar, Calculator, CloudSun, ShieldAlert, User, 
  Send, Trash2, ArrowRight, Globe, Info, Star, Camera, Download
} from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

// 20 СТАБИЛЬДІ ЛОКАЦИЯ
const PLACES = [
  { id: 1, name: "Belukha Mountain", cat: "Mountains", img: "https://images.unsplash.com/photo-1533512140441-3832320b3363?w=800" },
  { id: 2, name: "Markakol Lake", cat: "Lakes", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800" },
  { id: 3, name: "Charyn Canyon", cat: "National Parks", img: "https://images.unsplash.com/photo-1627564175317-0c9f80721798?w=800" },
  { id: 4, name: "Kaindy Lake", cat: "Lakes", img: "https://images.unsplash.com/photo-1589133481730-899f81a17950?w=800" },
  { id: 5, name: "Rakhman Springs", cat: "Hidden Gems", img: "https://images.unsplash.com/photo-1544120190-27950f1f5c61?w=800" },
  { id: 6, name: "Burabay", cat: "National Parks", img: "https://images.unsplash.com/photo-1589133481730-899f81a17950?w=800" },
  { id: 7, name: "Almaty City", cat: "Cities", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800" },
  { id: 8, name: "Astana", cat: "Cities", img: "https://images.unsplash.com/photo-1596431940176-79943640209e?w=800" },
  { id: 9, name: "Kolsay Lakes", cat: "Lakes", img: "https://images.unsplash.com/photo-1590429712339-1d900407153a?w=800" },
  { id: 10, name: "Ustyurt Plateau", cat: "Hidden Gems", img: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800" },
  { id: 11, name: "Bayanaul", cat: "National Parks", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800" },
  { id: 12, name: "Shymkent", cat: "Cities", img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800" },
  { id: 13, name: "Singing Dune", cat: "National Parks", img: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800" },
  { id: 14, name: "Big Almaty Lake", cat: "Lakes", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800" },
  { id: 15, name: "Khan Shatyr", cat: "Cities", img: "https://images.unsplash.com/photo-1578132913915-779879782806?w=800" },
  { id: 16, name: "Bektau-Ata", cat: "Hidden Gems", img: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800" },
  { id: 17, name: "Turkestan", cat: "Cities", img: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800" },
  { id: 18, name: "Zailiysky Alatau", cat: "Mountains", img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800" },
  { id: 19, name: "Boztjyra", cat: "Hidden Gems", img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800" },
  { id: 20, name: "Aktau", cat: "Cities", img: "https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=800" }
];

export default function App() {
  const [tab, setTab] = useState('home');
  const [lang, setLang] = useState('kz');
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const t = {
    kz: { h: "Басты бет", ai: "AI Planner", d: "Орындар", m: "Карта", r: "Дайын маршруттар", b: "Бюджет", w: "Ауа райы", t: "Кеңестер", p: "Профиль" },
    ru: { h: "Главная", ai: "AI Planner", d: "Места", m: "Карта", r: "Готовые маршруты", b: "Бюджет", w: "Погода", t: "Советы", p: "Профиль" },
    en: { h: "Home", ai: "AI Planner", d: "Places", m: "Map", r: "Ready Routes", b: "Budget", w: "Weather", t: "Tips", p: "Profile" }
  };

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat]);

  const send = async () => {
    if (!input.trim()) return;
    const newHistory = [...chat, { role: 'user', content: input }];
    setChat(newHistory); setInput("");
    try {
      const res = await axios.post(`${API_URL}/api/chat`, { history: newHistory });
      setChat([...newHistory, { role: 'assistant', content: res.data.response }]);
    } catch { setChat([...newChat, { role: 'assistant', content: "Server error!" }]); }
  };

  const NavBtn = ({ id, icon: Icon, label }) => (
    <button onClick={() => setTab(id)} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${tab === id ? 'bg-blue-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
      <Icon size={18} /> <span className="hidden lg:block font-bold text-xs uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#010409] text-white font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-[#0d1117] border-r border-white/5 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-2xl font-black italic text-blue-500 uppercase">VKO PRO</h1>
            <p className="text-[9px] font-bold text-slate-500 tracking-[0.4em] uppercase">By Bekzhan</p>
          </div>
          <nav className="space-y-1">
            <NavBtn id="home" icon={Home} label={t[lang].h} />
            <NavBtn id="ai" icon={Sparkles} label={t[lang].ai} />
            <NavBtn id="dest" icon={MapPin} label={t[lang].d} />
            <NavBtn id="map" icon={Map} label={t[lang].m} />
            <NavBtn id="routes" icon={Calendar} label={t[lang].r} />
            <NavBtn id="budget" icon={Calculator} label={t[lang].b} />
            <NavBtn id="weather" icon={CloudSun} label={t[lang].w} />
            <NavBtn id="tips" icon={ShieldAlert} label={t[lang].t} />
            <NavBtn id="profile" icon={User} label={t[lang].p} />
          </nav>
        </div>
        <div className="flex gap-1 bg-black/40 p-1 rounded-lg">
          {['kz','ru','en'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`flex-1 text-[10px] p-2 rounded ${lang === l ? 'bg-blue-600 font-bold' : ''}`}>{l.toUpperCase()}</button>
          ))}
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative">
        {/* WATERMARK */}
        <div className="fixed bottom-10 right-10 text-white/5 text-8xl font-black pointer-events-none uppercase italic">By Bekzhan</div>

        {tab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="relative h-[60vh] rounded-[3rem] overflow-hidden flex items-center p-12 border border-white/5">
              <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="relative z-10 space-y-6 max-w-2xl">
                <h2 className="text-7xl font-black italic uppercase leading-none tracking-tighter">Discover <br/><span className="text-blue-500">Kazakhstan</span></h2>
                <button onClick={() => setTab('ai')} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-sm hover:scale-105 transition-all">Start Expedition</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'dest' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in zoom-in duration-500">
            {PLACES.map(p => (
              <div key={p.id} className="group h-80 bg-[#161b22] rounded-[2rem] overflow-hidden relative border border-white/5">
                <img src={p.img} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-all duration-700" alt={p.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{p.cat}</span>
                  <h3 className="text-xl font-bold italic uppercase leading-tight mt-1">{p.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'ai' && (
          <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-[#161b22] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <span className="font-black text-xs text-blue-500 tracking-widest uppercase">AI Strategic Planner</span>
              <button onClick={() => setChat([])} className="text-slate-500 hover:text-red-500 transition-all"><Trash2 size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-6 no-scrollbar">
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#0d1117] border border-white/5 rounded-bl-none'}`}>
                    <pre className="whitespace-pre-wrap font-sans italic">{m.content}</pre>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-black/20 border-t border-white/5">
              <div className="flex gap-4 p-2 bg-[#0d1117] rounded-2xl border border-white/10">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Where do you want to go?" className="flex-1 bg-transparent px-6 outline-none text-sm font-bold"/>
                <button onClick={send} className="bg-blue-600 p-4 rounded-xl hover:bg-blue-500 transition-all"><Send size={20}/></button>
              </div>
            </div>
          </div>
        )}

        {/* Қалған вкладкаларға арналған Placeholder */}
        {!['home', 'dest', 'ai'].includes(tab) && (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <h3 className="text-5xl font-black italic uppercase tracking-tighter">{tab} Mode Active</h3>
            <p className="font-bold uppercase tracking-[1em] mt-4">By Bekzhan</p>
          </div>
        )}
      </main>
    </div>
  );
}
