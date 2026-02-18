import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map, Calendar, Calculator, 
  CloudSun, ShieldAlert, User, Send, Trash2, ChevronRight, 
  Download, Star, Search, Globe, Filter, Moon, Sun
} from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

const App = () => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('home');
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const chatEndRef = useRef(null);

  // --- AUTO SCROLL ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  // --- AI CHAT LOGIC ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { role: 'user', content: input };
    const newHistory = [...chatHistory, userMsg];
    
    setChatHistory(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, { history: newHistory });
      setChatHistory([...newHistory, { role: 'assistant', content: res.data.response }]);
    } catch (e) {
      setChatHistory([...newHistory, { role: 'assistant', content: "Error: Сервермен байланыс жоқ." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI COMPONENTS ---
  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
        activeTab === id 
        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 translate-x-2' 
        : 'hover:bg-white/5 text-slate-400 hover:text-white'
      }`}
    >
      <Icon size={22} strokeWidth={2.5} />
      <span className="font-bold text-sm hidden lg:block tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'} overflow-hidden transition-colors duration-500`}>
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className={`w-20 lg:w-72 ${isDarkMode ? 'bg-slate-900/40' : 'bg-white'} border-r border-white/5 backdrop-blur-3xl p-6 flex flex-col z-50`}>
        <div className="flex items-center gap-4 px-2 mb-12">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
            <Globe className="text-white" size={24} />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-black tracking-tighter italic uppercase leading-none">VKO PRO</h1>
            <span className="text-[10px] text-blue-500 font-black tracking-[0.3em]">VERSION 2.0</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          <NavItem id="home" icon={Home} label="1. Басты бет" />
          <NavItem id="planner" icon={Sparkles} label="2. AI Planner" />
          <NavItem id="destinations" icon={MapPin} label="3. Destinations" />
          <NavItem id="map" icon={Map} label="4. Interactive Map" />
          <NavItem id="routes" icon={Calendar} label="5. Ready Routes" />
          <NavItem id="budget" icon={Calculator} label="6. Budget Planner" />
          <NavItem id="weather" icon={CloudSun} label="7. Weather & Seasons" />
          <NavItem id="tips" icon={ShieldAlert} label="8. Travel Tips" />
          <NavItem id="profile" icon={User} label="9. Profile" />
        </nav>

        <div className="mt-6 space-y-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full p-4 bg-white/5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="hidden lg:block text-xs font-bold uppercase">Түнгі режим</span>
          </button>
          <div className="p-4 bg-blue-600/10 rounded-3xl border border-blue-500/20">
            <p className="text-[9px] text-center font-black text-blue-500 tracking-widest uppercase italic">Developed by Bekzhan</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* BACKGROUND EFFECTS */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        </div>

        {/* CONTENT SWITCHER */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 scroll-smooth no-scrollbar">
          
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="max-w-6xl mx-auto space-y-20 animate-in fade-in duration-1000">
              <div className="relative h-[65vh] rounded-[4rem] overflow-hidden flex items-center px-16 shadow-2xl border border-white/5">
                <img src="https://images.unsplash.com/photo-1516245556508-7d60d4ff0f39?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[3s]" alt="KZ Nature" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                <div className="relative z-10 max-w-3xl">
                  <div className="inline-block px-4 py-2 bg-blue-600 text-xs font-black rounded-full mb-6 tracking-widest uppercase">Welcome to Kazakhstan</div>
                  <h2 className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">Сенің <br/><span className="text-blue-500">Экспедицияң</span> <br/>Осы жерден басталады.</h2>
                  <div className="flex gap-4">
                    <button onClick={() => setActiveTab('planner')} className="bg-white text-black px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center gap-3">
                      Plan My Trip <ChevronRight size={24} />
                    </button>
                    <button className="bg-white/10 backdrop-blur-md px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all border border-white/10">Зерттеу</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {['Алматы', 'Астана', 'ШҚО', 'Маңғыстау'].map((city) => (
                  <div key={city} className="group relative h-80 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-xl hover:border-blue-500 transition-all cursor-pointer">
                    <img src={`https://source.unsplash.com/600x800/?${city},nature`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={city} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8">
                      <h4 className="text-2xl font-black">{city}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Көруге міндетті</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AI PLANNER */}
          {activeTab === 'planner' && (
            <div className="max-w-5xl mx-auto h-[82vh] flex flex-col bg-slate-900/40 border border-white/10 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-700">
              <header className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center animate-pulse">
                    <Sparkles className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">AI Travel Guide</h3>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Powered by Llama 3.3</p>
                  </div>
                </div>
                <button onClick={() => setChatHistory([])} className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all">
                  <Trash2 size={20}/>
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30 italic">
                    <Zap size={48} className="text-blue-500" />
                    <p className="text-sm font-bold uppercase tracking-widest text-center">Мысалы: "Маған Алматыдағы 3 күндік тур <br/> бюджеттік деңгейде керек"</p>
                  </div>
                )}
                {chatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-8 rounded-[2.5rem] shadow-xl text-sm leading-relaxed ${
                      m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-800/80 border border-white/5 rounded-tl-none'
                    }`}>
                      <pre className="whitespace-pre-wrap font-sans text-sm">{m.content}</pre>
                      {m.role === 'assistant' && (
                        <div className="mt-6 pt-4 border-t border-white/5 flex gap-4">
                          <button className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 hover:text-white transition-all"><Download size={14}/> PDF ретінде сақтау</button>
                          <button className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 hover:text-white transition-all"><Star size={14}/> Таңдаулыға қосу</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/50 p-6 rounded-[2rem] rounded-tl-none animate-pulse flex gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <footer className="p-8 bg-black/20 backdrop-blur-xl border-t border-white/5">
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  {['🏔 ШҚО тур', '💰 Бюджеттік Астана', '🌲 Ұлттық парктер', '🚗 Көлік жалдау'].map(t => (
                    <button key={t} onClick={() => setInput(t)} className="whitespace-nowrap px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase hover:bg-blue-600 transition-all">{t}</button>
                  ))}
                </div>
                <div className="flex gap-4 p-2 bg-slate-800/50 rounded-[2.5rem] border border-white/10 focus-within:ring-2 ring-blue-600/50 transition-all">
                  <input 
                    value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Сұрағыңды жаз: (Қайда? Қанша күнге? Бюджет?)"
                    className="flex-1 bg-transparent px-8 py-4 outline-none text-sm font-medium"
                  />
                  <button onClick={handleSend} className="bg-blue-600 p-5 rounded-[2rem] hover:bg-blue-500 transition-all shadow-xl active:scale-95">
                    <Send size={24} className="text-white" />
                  </button>
                </div>
              </footer>
            </div>
          )}

          {/* TAB 3: DESTINATIONS */}
          {activeTab === 'destinations' && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
              <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                  <h3 className="text-5xl font-black italic tracking-tighter uppercase">Места для <br/> Экспедиций</h3>
                  <p className="text-slate-400 mt-4 font-medium italic">Қазақстанның әр түкпірінен жиналған топ-локациялар.</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex bg-slate-900 border border-white/5 rounded-2xl p-2">
                    <button className="px-6 py-3 bg-blue-600 rounded-xl text-xs font-black uppercase">Барлығы</button>
                    <button className="px-6 py-3 hover:text-blue-500 transition-all text-xs font-black uppercase">Таулар</button>
                    <button className="px-6 py-3 hover:text-blue-500 transition-all text-xs font-black uppercase">Көлдер</button>
                  </div>
                </div>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {['Mountains', 'Lakes', 'National Parks', 'Cities', 'Hidden Gems', 'Ancient Sites'].map(cat => (
                  <div key={cat} className="h-[450px] bg-slate-900 rounded-[3rem] border border-white/5 p-10 flex flex-col justify-end group cursor-pointer hover:border-blue-500 transition-all relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-all" />
                    <div className="w-16 h-1 bg-blue-600 mb-6 group-hover:w-full transition-all duration-700"></div>
                    <h4 className="text-4xl font-black italic tracking-tighter leading-none mb-4">{cat}</h4>
                    <p className="text-slate-500 text-sm font-medium italic mb-8 uppercase tracking-widest">Зерттеуді бастау</p>
                    <button className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <ChevronRight size={28} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: BUDGET PLANNER */}
          {activeTab === 'budget' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
              <h3 className="text-5xl font-black italic text-center uppercase">Budget <span className="text-blue-500 italic lowercase tracking-tight">calculator</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 p-12 rounded-[3.5rem] border border-white/5 space-y-8 backdrop-blur-3xl">
                  {['Тұратын жер', 'Транспорт', 'Тамақтану', 'Экскурсиялар'].map(item => (
                    <div key={item} className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">{item}</label>
                      <input type="number" placeholder="0 ₸" className="w-full bg-black/20 border border-white/5 p-5 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-xl" />
                    </div>
                  ))}
                </div>
                <div className="bg-blue-600 p-12 rounded-[3.5rem] flex flex-col justify-between shadow-2xl shadow-blue-600/30">
                  <div className="space-y-2">
                    <p className="font-black text-blue-200 uppercase tracking-widest text-xs">Жалпы есеп</p>
                    <h2 className="text-7xl font-black italic tracking-tighter italic">0 <span className="text-3xl tracking-normal">₸</span></h2>
                  </div>
                  <div className="space-y-4">
                    <button className="w-full bg-white text-blue-600 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Сақтау</button>
                    <p className="text-[10px] text-blue-200 text-center font-bold italic">ИИ-мен бірге бюджетті оңтайландыру</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC FALLBACK FOR OTHER TABS */}
          {['map', 'routes', 'weather', 'tips', 'profile'].includes(activeTab) && (
            <div className="h-[70vh] flex flex-col items-center justify-center space-y-8 animate-pulse">
              <div className="w-32 h-32 bg-blue-600/10 rounded-full flex items-center justify-center">
                <Search className="text-blue-500" size={60} />
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">{activeTab} section</h3>
                <p className="text-slate-500 font-bold italic tracking-widest uppercase text-xs">Under Construction by Bekzhan</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
