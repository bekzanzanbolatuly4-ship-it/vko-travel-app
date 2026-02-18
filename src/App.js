import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map, Calendar, Calculator, 
  CloudSun, ShieldAlert, User, Send, Trash2, ArrowRight, Globe, Zap, Search 
} from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [chatHistory, scrollToBottom]);

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
      setChatHistory([...newHistory, { role: 'assistant', content: "Қате: Сервер жауап бермейді." }]);
    } finally { setLoading(false); }
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center gap-4 p-4 rounded-3xl backdrop-blur-lg bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 ${activeTab === id ? 'bg-blue-600/30 text-white shadow-lg shadow-blue-600/40' : 'text-slate-400'}`}
    >
      <Icon size={22} />
      <span className="font-bold text-sm hidden lg:block tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen font-sans text-white bg-gradient-to-b from-[#020617] to-[#0b0f1a] overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-72 bg-slate-900/30 backdrop-blur-3xl border-r border-white/5 p-6 flex flex-col z-50">
        <div className="flex items-center gap-4 px-2 mb-10">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
            <Globe className="text-white" size={24} />
          </div>
          <div className="hidden lg:block leading-none">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">VKO PRO</h1>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">By Bekzhan</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
          <NavItem id="home" icon={Home} label="1. Home" />
          <NavItem id="planner" icon={Sparkles} label="2. AI Planner" />
          <NavItem id="destinations" icon={MapPin} label="3. Destinations" />
          <NavItem id="map" icon={Map} label="4. Map" />
          <NavItem id="routes" icon={Calendar} label="5. Ready Routes" />
          <NavItem id="budget" icon={Calculator} label="6. Budget" />
          <NavItem id="weather" icon={CloudSun} label="7. Weather" />
          <NavItem id="tips" icon={ShieldAlert} label="8. Travel Tips" />
          <NavItem id="profile" icon={User} label="9. Profile" />
        </nav>

        <div className="mt-8 p-5 bg-blue-600/10 rounded-3xl border border-blue-500/20 text-center">
          <p className="text-[9px] font-black text-blue-500 tracking-[0.2em] uppercase italic">Designed by Bekzhan</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-12">

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="max-w-6xl mx-auto space-y-20 animate-in fade-in duration-1000">
              <div className="relative h-[65vh] rounded-[4rem] overflow-hidden flex items-center px-12 lg:px-20 border border-white/10 shadow-2xl backdrop-blur-lg bg-white/5">
                <img src="https://images.unsplash.com/photo-1516245556508-7d60d4ff0f39?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="KZ Nature"/>
                <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/40 to-transparent z-10"/>
                <div className="relative z-20 max-w-2xl">
                  <h2 className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
                    Кел, <span className="text-blue-500">Қазақстанды</span> зерттейік.
                  </h2>
                  <button onClick={() => setActiveTab('planner')} className="bg-white text-black px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-4 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
                    Саяхатты жоспарлау <ArrowRight size={24}/>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['Таулар', 'Көлдер', 'Қалалар'].map(item => (
                  <div key={item} className="p-10 bg-white/5 backdrop-blur-lg border border-white/10 rounded-[3rem] hover:border-blue-500/50 transition-all shadow-lg group cursor-pointer">
                    <h4 className="text-3xl font-black mb-4 group-hover:text-blue-500 transition-colors">{item}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed italic">Сенің экспедицияң осы жерден басталады.</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLANNER TAB */}
          {activeTab === 'planner' && (
            <div className="max-w-4xl mx-auto h-[82vh] flex flex-col bg-white/5 border border-white/10 rounded-[3.5rem] backdrop-blur-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
              <header className="p-8 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="text-blue-500" size={18} /> AI Travel Guide
                </h3>
                <button onClick={() => setChatHistory([])} className="p-3 hover:bg-red-500/20 rounded-2xl text-slate-500 hover:text-red-400 transition-all">
                  <Trash2 size={20}/>
                </button>
              </header>
              <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
                    <Zap size={48} className="text-blue-500"/>
                    <p className="font-black uppercase tracking-widest">Қайда барғыңыз келеді? (Мысалы: Алматы 3 күн)</p>
                  </div>
                )}
                {chatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-8 rounded-[2.5rem] text-sm leading-relaxed shadow-xl ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800/80 border border-white/10 rounded-tl-none'}`}>
                      <pre className="whitespace-pre-wrap font-sans leading-relaxed italic">{m.content}</pre>
                    </div>
                  </div>
                ))}
                {loading && <div className="p-6 bg-slate-800/50 w-24 rounded-full animate-pulse border border-white/5">...</div>}
                <div ref={scrollRef}/>
              </div>
              <div className="p-8 bg-black/20">
                <div className="flex gap-4 p-2 bg-slate-900 rounded-[2.5rem] border border-white/10 focus-within:ring-2 ring-blue-500/50 transition-all">
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} placeholder="Маршрут, бюджет немесе локация сұраңыз..." className="flex-1 bg-transparent px-8 py-4 outline-none text-sm font-medium"/>
                  <button onClick={onSend} className="bg-blue-600 p-5 rounded-[2rem] hover:bg-blue-500 transition-all shadow-lg"><Send size={22}/></button>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS */}
          {!['home','planner'].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 animate-pulse opacity-40">
              <Search size={80} className="text-blue-500" />
              <h3 className="text-3xl font-black uppercase italic tracking-widest">{activeTab} section</h3>
              <p className="font-bold uppercase tracking-widest text-xs">Developed by Bekzhan</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
