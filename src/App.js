import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map, Calendar, Calculator, CloudSun, ShieldAlert, User, 
  Send, Trash2, ArrowRight, Globe, Zap, Search, Info, ChevronRight, Star
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

  useEffect(() => { scrollToBottom(); }, [chatHistory, loading, scrollToBottom]);

  const onSend = async () => {
    if (!input.trim() || loading) return;
    const newHistory = [...chatHistory, { role: 'user', content: input }];
    setChatHistory(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, { history: newHistory }, { timeout: 30000 });
      if(res.data.response) {
        setChatHistory([...newHistory, { role: 'assistant', content: res.data.response }]);
      } else {
        setChatHistory([...newHistory, { role: 'assistant', content: "Қате: бос жауап." }]);
      }
    } catch (e) {
      setChatHistory([...newHistory, { role: 'assistant', content: "Қате: сервер жауап бермеді." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if(window.confirm("Чатты тазалау керек пе?")) setChatHistory([]);
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group ${activeTab === id ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}>
      <Icon size={22} className={`${activeTab === id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
      <span className="font-bold text-sm hidden lg:block tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-72 bg-slate-900/40 border-r border-white/5 backdrop-blur-3xl p-6 flex flex-col z-50">
        <div className="flex items-center gap-4 px-2 mb-12">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-[0_0_25px_rgba(37,99,235,0.3)]">
            <Globe className="text-white animate-spin-slow" size={24} />
          </div>
          <div className="hidden lg:block leading-none">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">VKO PRO</h1>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mt-1 block">By Bekzhan</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-1">
          <NavItem id="home" icon={Home} label="1. Басты бет" />
          <NavItem id="planner" icon={Sparkles} label="2. AI Planner" />
          <NavItem id="destinations" icon={MapPin} label="3. Destinations" />
          <NavItem id="map" icon={Map} label="4. Interactive Map" />
          <NavItem id="routes" icon={Calendar} label="5. Ready Routes" />
          <NavItem id="budget" icon={Calculator} label="6. Budget Planner" />
          <NavItem id="weather" icon={CloudSun} label="7. Weather" />
          <NavItem id="tips" icon={ShieldAlert} label="8. Travel Tips" />
          <NavItem id="profile" icon={User} label="9. Profile" />
        </nav>

        <div className="mt-8 p-5 bg-gradient-to-b from-blue-600/20 to-transparent rounded-[2rem] border border-blue-500/20 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <p className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase italic group-hover:scale-110 transition-transform">Engineering Excellence</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700"></div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12 no-scrollbar">
          
          {/* HOME */}
          {activeTab === 'home' && (
            <div className="max-w-6xl mx-auto space-y-24 animate-in fade-in slide-in-from-top-4 duration-1000">
              <div className="relative h-[70vh] rounded-[4rem] overflow-hidden flex items-center px-12 lg:px-24 border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1516245556508-7d60d4ff0f39?q=80&w=2000" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" 
                  alt="KZ Nature" 
                />
                <div className="relative z-20 max-w-2xl space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold tracking-widest uppercase italic">
                    <Star size={12} fill="currentColor"/> National Expedition 2026
                  </div>
                  <h2 className="text-7xl lg:text-9xl font-black leading-[0.85] tracking-tighter uppercase italic">Кел, <br/><span className="text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">Қазақстанды</span> <br/> зерттейік.</h2>
                  <div className="flex flex-wrap gap-6 pt-4">
                    <button onClick={() => setActiveTab('planner')} className="bg-white text-black px-14 py-6 rounded-3xl font-black text-xl flex items-center gap-4 hover:bg-blue-600 hover:text-white hover:scale-105 transition-all shadow-2xl">
                      Бастау <ArrowRight size={28} />
                    </button>
                    <button onClick={() => setActiveTab('destinations')} className="bg-white/5 backdrop-blur-md px-12 py-6 rounded-3xl font-black text-xl border border-white/10 hover:bg-white/10 transition-all">
                      Локациялар
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {['Таулар', 'Көлдер', 'Далалар'].map((item, idx) => (
                  <div key={item} className="group relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[3rem] transition-all hover:scale-105">
                    <div className="h-full p-10 bg-[#0a0f1d] rounded-[2.9rem] backdrop-blur-3xl space-y-6">
                      <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Zap size={30} />
                      </div>
                      <h4 className="text-4xl font-black italic tracking-tighter uppercase">{item}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium italic">Қазақстанның ең таңдаулы {item.toLowerCase()} бойынша эксклюзивті маршруттар.</p>
                      <div className="pt-4 flex items-center text-blue-500 text-xs font-black uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        Зерттеу <ChevronRight size={14}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI PLANNER */}
          {activeTab === 'planner' && (
            <div className="max-w-4xl mx-auto h-[82vh] flex flex-col bg-slate-900/40 border border-white/10 rounded-[4rem] backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-bottom-12 duration-700">
              <header className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 animate-bounce">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-widest italic">Expedition Agent</h3>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">Powered by Llama 3.3</p>
                  </div>
                </div>
                <button onClick={clearChat} className="p-4 hover:bg-red-500/10 rounded-2xl text-slate-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20">
                  <Trash2 size={22}/>
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar scroll-smooth">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-40">
                    <div className="p-8 bg-blue-600/5 rounded-full border border-blue-500/10">
                      <Zap size={60} className="text-blue-500" />
                    </div>
                    <div className="text-center space-y-3">
                      <p className="font-black text-2xl uppercase tracking-tighter italic">Қайда аттанамыз?</p>
                      <p className="text-sm font-medium italic text-slate-400">Мысалы: "3 күндік Алматы-Көлсай бюджеттік туры"</p>
                    </div>
                  </div>
                )}
                {chatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}>
                    <div className={`max-w-[85%] p-8 rounded-[2.5rem] shadow-2xl relative group ${
                      m.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none' 
                      : 'bg-[#1e293b]/80 border border-white/5 rounded-tl-none backdrop-blur-md'
                    }`}>
                      <div className="absolute top-[-10px] left-[-10px] opacity-0 group-hover:opacity-100 transition-opacity">
                         <Info size={16} className="text-blue-400"/>
                      </div>
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed italic font-medium">{m.content}</pre>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/50 px-8 py-5 rounded-[2rem] rounded-tl-none border border-white/5 flex gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              <footer className="p-10 bg-black/40 backdrop-blur-2xl border-t border-white/5">
                <div className="flex gap-5 p-3 bg-[#0f172a] rounded-[2.5rem] border border-white/10 focus-within:ring-2 ring-blue-500/50 focus-within:border-blue-500/50 transition-all shadow-inner">
                  <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && onSend()} 
                    placeholder="Маршрут, бюджет немесе локация сұраңыз..." 
                    className="flex-1 bg-transparent px-8 py-4 outline-none text-sm font-bold placeholder:text-slate-600"
                  />
                  <button 
                    onClick={onSend} 
                    className="bg-blue-600 p-5 rounded-[2rem] hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  >
                    <Send size={24} className="text-white" />
                  </button>
                </div>
              </footer>
            </div>
          )}

          {/* DESTINATIONS */}
          {activeTab === 'destinations' && (
            <div className="max-w-6xl mx-auto space-y-16 animate-in zoom-in duration-700">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
                <h3 className="text-6xl font-black tracking-tighter italic uppercase leading-none">Explore <br/> <span className="text-blue-500 italic">Destinations</span></h3>
                <div className="flex gap-3 bg-slate-900/50 p-2 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest">
                  <button className="px-6 py-3 bg-blue-600 rounded-xl shadow-lg">Барлығы</button>
                  <button className="px-6 py-3 hover:bg-white/5 rounded-xl transition-all">Танымал</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[
                  { name: 'Charyn Canyon', img: 'https://images.unsplash.com/photo-1627564175317-0c9f80721798?q=80&w=1000' },
                  { name: 'Kaindy Lake', img: 'https://images.unsplash.com/photo-1589133481730-899f81a17950?q=80&w=1000' },
                  { name: 'Mangystau', img: 'https://images.unsplash.com/photo-1628151970267-336c1e9389c5?q=80&w=1000' }
                ].map(loc => (
                  <div key={loc.name} className="h-[550px] bg-slate-900 rounded-[3.5rem] overflow-hidden relative group cursor-pointer border border-white/5 hover:border-blue-500 transition-all shadow-2xl">
                    <img 
                      src={loc.img} 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-80 transition-all duration-1000" 
                      alt={loc.name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                    <div className="absolute bottom-12 left-10 right-10 space-y-4">
                      <h4 className="text-4xl font-black italic mb-2 uppercase tracking-tighter drop-shadow-lg">{loc.name}</h4>
                      <button className="flex items-center gap-3 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] group-hover:gap-5 transition-all">
                        Толығырақ <ChevronRight size={16}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BUDGET TAB */}
          {activeTab === 'budget' && (
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="bg-slate-900/40 p-16 rounded-[4.5rem] border border-white/10 space-y-12 backdrop-blur-xl">
                <div className="space-y-2">
                  <h3 className="text-5xl font-black italic tracking-tighter uppercase">Budget <br/><span className="text-blue-500">Calculator</span></h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic">Саяхат шығындарын алдын-ала есептеңіз</p>
                </div>
                <div className="space-y-8">
                  {['Тұру (Hotel)', 'Көлік (Transport)', 'Тамақтану (Food)'].map(label => (
                    <div key={label} className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] px-2">{label}</label>
                      <input 
                        type="number" 
                        placeholder="0 ₸" 
                        className="w-full bg-black/40 border border-white/5 p-6 rounded-[2rem] font-black text-2xl outline-none focus:border-blue-500 focus:bg-black/60 transition-all shadow-inner placeholder:text-slate-800" 
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-16 rounded-[4.5rem] flex flex-col justify-between shadow-[0_20px_60px_rgba(37,99,235,0.3)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                   <Calculator size={150} />
                </div>
                <div className="relative z-10">
                  <p className="font-black text-blue-100 text-xs uppercase tracking-[0.4em] mb-4 opacity-70 italic">Жалпы есептелген сома</p>
                  <h2 className="text-9xl font-black italic tracking-tighter">0<span className="text-3xl tracking-normal ml-3 italic text-blue-200 uppercase">₸</span></h2>
                </div>
                <div className="space-y-6 relative z-10">
                   <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10 backdrop-blur-md">
                      <p className="text-[11px] font-bold leading-relaxed italic text-blue-50 uppercase tracking-wider">
                        "By Bekzhan tip: Саяхатқа шықпас бұрын соманың 15%-ын төтенше жағдайларға сақтап қойыңыз."
                      </p>
                   </div>
                   <button className="w-full bg-white text-blue-600 py-7 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">
                     Есепті AI-ға жіберу
                   </button>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS */}
          {['map', 'routes', 'weather', 'tips', 'profile'].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center space-y-10 animate-pulse">
              <div className="relative">
                <Search size={120} strokeWidth={1} className="text-blue-500 opacity-20" />
                <Zap size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-black uppercase italic tracking-tighter">{activeTab} Section</h3>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[2px] w-12 bg-blue-500/30"></div>
                  <p className="font-black uppercase tracking-[0.4em] text-[10px] text-blue-400">Under Construction by Bekzhan</p>
                  <div className="h-[2px] w-12 bg-blue-500/30"></div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
