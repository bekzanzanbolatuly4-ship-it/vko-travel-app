import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map, Calendar, Calculator, CloudSun, ShieldAlert, User, 
  Send, Trash2, ArrowRight, Globe, Zap, Search, ChevronRight, Star
} from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory, loading]);

  const onSend = async () => {
    if (!input.trim() || loading) return;
    const newHistory = [...chatHistory, { role: 'user', content: input }];
    setChatHistory(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, { history: newHistory });
      setChatHistory([...newHistory, { role: 'assistant', content: res.data.response }]);
    } catch (e) {
      setChatHistory([...newHistory, { role: 'assistant', content: "Қате: Сервер қосылмаған." }]);
    } finally { setLoading(false); }
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeTab === id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}>
      <Icon size={20} />
      <span className="font-bold text-sm hidden lg:block">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-72 bg-slate-900/50 border-r border-white/5 p-6 flex flex-col">
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="p-3 bg-blue-600 rounded-xl shadow-blue-600/20 shadow-lg"><Globe size={24}/></div>
          <div className="hidden lg:block leading-none">
            <h1 className="text-xl font-black italic">VKO PRO</h1>
            <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">By Bekzhan</span>
          </div>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          <NavItem id="home" icon={Home} label="1. Басты бет" />
          <NavItem id="planner" icon={Sparkles} label="2. AI Planner" />
          <NavItem id="destinations" icon={MapPin} label="3. Көрікті жерлер" />
          <NavItem id="map" icon={Map} label="4. Карта" />
          <NavItem id="budget" icon={Calculator} label="5. Бюджет" />
          <NavItem id="profile" icon={User} label="6. Профиль" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative">
        {activeTab === 'home' && (
          <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-1000">
            <div className="relative h-[60vh] rounded-[3rem] overflow-hidden flex items-center px-12 border border-white/10 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1516245556508-7d60d4ff0f39?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-40 -z-10" alt="Nature" />
              <div className="max-w-2xl space-y-6">
                <h2 className="text-7xl font-black leading-none italic uppercase">Зертте <br/><span className="text-blue-500">Қазақстанды</span></h2>
                <button onClick={() => setActiveTab('planner')} className="bg-white text-black px-10 py-5 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl">Бастау <ArrowRight/></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {['Таулар', 'Көлдер', 'Дала'].map(t => (
                <div key={t} className="p-10 bg-slate-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl">
                  <h3 className="text-2xl font-black italic uppercase text-blue-500">{t}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'planner' && (
          <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-slate-900/60 border border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <span className="font-black text-xs uppercase tracking-widest text-blue-500 flex items-center gap-2"><Sparkles size={16}/> AI Expedition Agent</span>
              <button onClick={() => setChatHistory([])}><Trash2 size={20} className="text-slate-500 hover:text-red-500"/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-6 no-scrollbar">
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm leading-relaxed shadow-lg ${m.role === 'user' ? 'bg-blue-600 rounded-tr-none' : 'bg-slate-800/80 border border-white/5 rounded-tl-none'}`}>
                    <pre className="whitespace-pre-wrap font-sans italic">{m.content}</pre>
                  </div>
                </div>
              ))}
              {loading && <div className="animate-pulse bg-slate-800 w-16 h-8 rounded-full ml-4"></div>}
              <div ref={scrollRef} />
            </div>
            <div className="p-8 bg-black/20">
              <div className="flex gap-4 p-2 bg-slate-800 rounded-[2rem] border border-white/10">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} placeholder="Сұрақ қойыңыз..." className="flex-1 bg-transparent px-6 outline-none text-sm font-bold"/>
                <button onClick={onSend} className="bg-blue-600 p-4 rounded-2xl hover:bg-blue-500 transition-all"><Send size={20}/></button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'destinations' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in zoom-in duration-700">
            {['Charyn', 'Kolsay', 'Kaindy'].map(loc => (
              <div key={loc} className="h-96 rounded-[3rem] bg-slate-900 overflow-hidden relative group border border-white/10">
                <img src={`https://source.unsplash.com/600x800/?${loc},nature`} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000" alt={loc} />
                <div className="absolute bottom-10 left-10"><h3 className="text-3xl font-black italic uppercase">{loc}</h3></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
