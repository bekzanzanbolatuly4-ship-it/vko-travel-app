import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map, Calendar, Calculator, CloudSun, ShieldAlert, User, 
  Send, Trash2, ArrowRight, Globe, Zap, Search, ChevronRight, Star, Info
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
      setChatHistory([...newHistory, { role: 'assistant', content: res.data.response || "Қате: жауап келмеді." }]);
    } catch (e) {
      setChatHistory([...newHistory, { role: 'assistant', content: "Қате: сервермен байланыс жоқ." }]);
    } finally {
      setLoading(false);
    }
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group ${
        activeTab === id 
        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105' 
        : 'hover:bg-white/5 text-slate-400 hover:text-white'
      }`}>
      <Icon size={22} className={activeTab === id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
      <span className="font-bold text-sm hidden lg:block tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden font-sans">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700"></div>

      {/* SIDEBAR */}
      <aside className="w-20 lg:w-72 bg-slate-900/40 border-r border-white/5 backdrop-blur-3xl p-6 flex flex-col z-50">
        <div className="flex items-center gap-4 px-2 mb-12">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <Globe className="text-white" size={24} />
          </div>
          <div className="hidden lg:block leading-none">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400">VKO PRO</h1>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mt-1 block">By Bekzhan</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
          <NavItem id="home" icon={Home} label="Басты бет" />
          <NavItem id="planner" icon={Sparkles} label="AI Planner" />
          <NavItem id="destinations" icon={MapPin} label="Destinations" />
          <NavItem id="budget" icon={Calculator} label="Budget Planner" />
          <NavItem id="profile" icon={User} label="Profile" />
        </nav>

        <div className="mt-8 p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-center">
          <p className="text-[10px] font-black text-blue-400 tracking-widest uppercase italic">VKO PROJECT 2026</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 no-scrollbar">
          
          {/* HOME PAGE */}
          {activeTab === 'home' && (
            <div className="max-w-6xl mx-auto space-y-24 animate-in fade-in duration-1000">
              <div className="relative h-[65vh] rounded-[4rem] overflow-hidden flex items-center px-12 lg:px-20 border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2000" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5s]" 
                  alt="KZ Nature" 
                />
                <div className="relative z-20 max-w-3xl space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold uppercase italic">
                    <Star size={14} fill="currentColor"/> National Expedition 2026
                  </div>
                  <h2 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">Кел, <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">Қазақстанды</span> зерттейік.</h2>
                  <button onClick={() => setActiveTab('planner')} className="bg-white text-black px-12 py-5 rounded-3xl font-black text-xl flex items-center gap-4 hover:bg-blue-600 hover:text-white hover:scale-105 transition-all shadow-2xl">
                    Жоспарлауды бастау <ArrowRight size={28} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {['Таулар', 'Көлдер', 'Қалалар'].map((item) => (
                  <div key={item} className="p-10 bg-slate-900/40 border border-white/5 rounded-[3rem] backdrop-blur-3xl hover:border-blue-500/50 transition-all group cursor-pointer relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all"></div>
                    <h4 className="text-3xl font-black mb-4 group-hover:text-blue-500 transition-colors uppercase italic tracking-tighter">{item}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed italic">Ең эксклюзивті маршруттар мен таңғажайып локациялар жинағы.</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI PLANNER */}
          {activeTab === 'planner' && (
            <div className="max-w-4xl mx-auto h-[82vh] flex flex-col bg-slate-900/60 border border-white/10 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
              <header className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Sparkles className="text-white" size={20} />
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-widest italic">AI Expedition Guide</h3>
                </div>
                <button onClick={() => setChatHistory([])} className="p-3 hover:bg-red-500/20 rounded-2xl text-slate-500 hover:text-red-400 transition-all">
                  <Trash2 size={20}/>
                </button>
              </header>
              
              <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
                    <Zap size={60} className="text-blue-500" />
                    <p className="font-black uppercase tracking-widest italic">Қайда барғыңыз келеді? (Мысалы: Алматы 3 күн)</p>
                  </div>
                )}
                {chatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[85%] p-7 rounded-[2.5rem] text-sm leading-relaxed shadow-xl ${
                      m.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none' 
                      : 'bg-slate-800/80 border border-white/10 rounded-tl-none backdrop-blur-md'
                    }`}>
                      <p className="italic font-medium">{m.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2 p-4 bg-white/5 rounded-full w-20 justify-center animate-pulse">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full delay-75"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full delay-150"></div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              <div className="p-8 bg-black/20 backdrop-blur-xl border-t border-white/5">
                <div className="flex gap-4 p-2 bg-slate-900/90 rounded-[2.5rem] border border-white/10 focus-within:ring-2 ring-blue-500/50 transition-all shadow-inner">
                  <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && onSend()} 
                    placeholder="Маршрут, бюджет немесе локация сұраңыз..." 
                    className="flex-1 bg-transparent px-8 py-4 outline-none text-sm font-bold placeholder:text-slate-600"
                  />
                  <button onClick={onSend} className="bg-blue-600 p-5 rounded-[2rem] hover:bg-blue-500 hover:scale-105 transition-all shadow-lg shadow-blue-600/40">
                    <Send size={22} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DESTINATIONS */}
          {activeTab === 'destinations' && (
            <div className="max-w-6xl mx-auto space-y-16 animate-in zoom-in duration-700">
              <h3 className="text-5xl font-black tracking-tighter italic uppercase leading-none">Explore <span className="text-blue-500">Destinations</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { name: 'Charyn Canyon', img: 'https://images.unsplash.com/photo-1627564175317-0c9f80721798?q=80&w=1000' },
                  { name: 'Kaindy Lake', img: 'https://images.unsplash.com/photo-1589133481730-899f81a17950?q=80&w=1000' },
                  { name: 'Mangystau', img: 'https://images.unsplash.com/photo-1628151970267-336c1e9389c5?q=80&w=1000' }
                ].map(loc => (
                  <div key={loc.name} className="h-[500px] bg-slate-900 rounded-[3.5rem] overflow-hidden relative group cursor-pointer border border-white/5 hover:border-blue-500 transition-all shadow-2xl">
                    <img src={loc.img} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000" alt={loc.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-12 left-10">
                      <h4 className="text-4xl font-black italic mb-4 uppercase tracking-tighter drop-shadow-lg">{loc.name}</h4>
                      <div className="flex items-center gap-3 text-blue-400 text-xs font-black uppercase tracking-widest group-hover:gap-5 transition-all">
                        Толығырақ <ChevronRight size={18}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BUDGET TAB */}
          {activeTab === 'budget' && (
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="bg-slate-900/60 p-16 rounded-[4.5rem] border border-white/10 space-y-12 backdrop-blur-xl">
                <h3 className="text-5xl font-black italic tracking-tighter uppercase">Budget <br/><span className="text-blue-500">Planner</span></h3>
                <div className="space-y-8">
                  {['Тұру (Hotel)', 'Көлік (Transport)', 'Тамақтану (Food)'].map(label => (
                    <div key={label} className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] px-2">{label}</label>
                      <input type="number" placeholder="0 ₸" className="w-full bg-black/30 border border-white/5 p-6 rounded-[2rem] font-black text-2xl outline-none focus:border-blue-500 transition-all shadow-inner" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-16 rounded-[4.5rem] flex flex-col justify-between shadow-[0_20px_50px_rgba(37,99,235,0.3)]">
                <div>
                  <p className="font-black text-blue-100 text-xs uppercase tracking-[0.4em] mb-4 opacity-70">Total Estimated</p>
                  <h2 className="text-9xl font-black italic tracking-tighter">0<span className="text-3xl tracking-normal ml-3 italic text-blue-200">₸</span></h2>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md">
                    <p className="text-[11px] font-bold leading-relaxed italic opacity-80 uppercase">"By Bekzhan tip: Саяхатқа шықпас бұрын соманың 15%-ын төтенше жағдайларға сақтап қойыңыз."</p>
                  </div>
                  <button className="w-full bg-white text-blue-600 py-7 rounded-[2rem] font-black text-xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                    Есепті сақтау
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PLACEHOLDER FOR OTHER TABS */}
          {!['home', 'planner', 'destinations', 'budget'].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center space-y-10 animate-pulse opacity-40">
              <Search size={120} strokeWidth={1} className="text-blue-500" />
              <h3 className="text-4xl font-black uppercase italic tracking-tighter">{activeTab} Section</h3>
              <p className="font-black uppercase tracking-[0.4em] text-[10px] text-blue-400">Under Development by Bekzhan</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
