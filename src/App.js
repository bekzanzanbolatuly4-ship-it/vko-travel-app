import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map, Calendar, Calculator, 
  CloudSun, ShieldAlert, User, Send, Trash2, ChevronRight, 
  Download, Star, Search, Menu, X
} from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const newMsg = { role: 'user', content: input };
    const updatedHistory = [...chatHistory, newMsg];
    setChatHistory(updatedHistory);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, { history: updatedHistory });
      setChatHistory([...updatedHistory, { role: 'assistant', content: res.data.response }]);
    } catch (e) {
      setChatHistory([...updatedHistory, { role: 'assistant', content: "Ошибка соединения с сервером." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Компонент навигации
  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
        activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-white/5 text-slate-400'
      }`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm hidden lg:block">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-72 bg-slate-900/50 border-r border-white/5 backdrop-blur-2xl p-4 flex flex-col z-50">
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
            <MapPin className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tighter hidden lg:block uppercase italic">VKO Travel</h1>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          <SidebarItem id="home" icon={Home} label="1. Home" />
          <SidebarItem id="planner" icon={Sparkles} label="2. AI Planner" />
          <SidebarItem id="destinations" icon={MapPin} label="3. Destinations" />
          <SidebarItem id="map" icon={Map} label="4. Interactive Map" />
          <SidebarItem id="routes" icon={Calendar} label="5. Ready Routes" />
          <SidebarItem id="budget" icon={Calculator} label="6. Budget Planner" />
          <SidebarItem id="weather" icon={CloudSun} label="7. Weather & Seasons" />
          <SidebarItem id="tips" icon={ShieldAlert} label="8. Travel Tips" />
          <SidebarItem id="profile" icon={User} label="9. Profile" />
        </nav>

        <div className="mt-4 p-4 bg-white/5 rounded-2xl text-[10px] text-center font-bold text-slate-500 italic uppercase">
          Developed by Bekzhan
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_#020617_100%)]">
        
        {/* TAB RENDERING */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 scroll-smooth">
          
          {/* 1. HOME */}
          {activeTab === 'home' && (
            <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in duration-700">
              <section className="relative h-[60vh] rounded-[3rem] overflow-hidden flex items-center px-12">
                <img src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-50 -z-10" alt="Almaty" />
                <div className="max-w-2xl">
                  <h2 className="text-6xl lg:text-8xl font-black mb-6 leading-none">ОТКРОЙ <br/><span className="text-blue-500">КАЗАХСТАН</span></h2>
                  <p className="text-xl text-slate-400 mb-8">Персональный ИИ-гид по бескрайним степям и заснеженным горам.</p>
                  <button onClick={() => setActiveTab('planner')} className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 transition-all shadow-xl shadow-blue-600/20">
                    Plan My Trip <ChevronRight />
                  </button>
                </div>
              </section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['Mountains', 'Lakes', 'Steppe'].map(item => (
                  <div key={item} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-blue-500/50 transition-all cursor-pointer">
                    <h3 className="text-2xl font-bold mb-2">{item}</h3>
                    <p className="text-sm text-slate-400">Исследуйте лучшие локации категории {item} в Казахстане.</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. AI PLANNER */}
          {activeTab === 'planner' && (
            <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-slate-900/50 border border-white/5 rounded-[3rem] backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <Sparkles className="text-blue-500" size={18} /> AI Assistant Agent
                </h3>
                <button onClick={() => setChatHistory([])} className="p-2 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all">
                  <Trash2 size={20}/>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                    <p>Напишите: "Хочу план на 3 дня в Алматы бюджетно"</p>
                  </div>
                )}
                {chatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm leading-relaxed ${
                      m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 border border-white/5 rounded-tl-none'
                    }`}>
                      <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                    </div>
                  </div>
                ))}
                {isLoading && <div className="p-6 bg-slate-800 w-24 rounded-full animate-pulse">...</div>}
                <div ref={chatEndRef} />
              </div>
              <div className="p-6 bg-slate-950/50">
                <div className="flex gap-4 p-2 bg-slate-900 rounded-[2rem] border border-white/10">
                  <input 
                    value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ваш запрос (город, бюджет, дни)..."
                    className="flex-1 bg-transparent px-6 outline-none"
                  />
                  <button onClick={handleSend} className="bg-blue-600 p-4 rounded-[1.5rem] hover:bg-blue-500 transition-all">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. DESTINATIONS */}
          {activeTab === 'destinations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in zoom-in duration-500">
              {['Mountains', 'Lakes', 'National Parks', 'Hidden Gems'].map(cat => (
                <div key={cat} className="h-80 bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-end group cursor-pointer hover:border-blue-500 transition-all overflow-hidden relative">
                   <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-all" />
                   <h4 className="text-2xl font-black relative z-10">{cat}</h4>
                   <p className="text-xs text-slate-500 relative z-10">Просмотреть все локации</p>
                </div>
              ))}
            </div>
          )}

          {/* Остальные вкладки (Заглушки) */}
          {['map', 'routes', 'budget', 'weather', 'tips', 'profile'].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center">
                <Search className="text-blue-500 animate-bounce" size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-widest">{activeTab} section</h3>
              <p className="text-slate-500">Данный раздел находится в разработке by Bekzhan.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
