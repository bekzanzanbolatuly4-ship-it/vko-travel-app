import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map, Calendar, Calculator, 
  CloudSun, ShieldAlert, User, Send, Trash2, ChevronRight, 
  Globe, Zap, Filter, Search, ArrowRight, Info, CheckCircle
} from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

const App = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('home');
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // --- NAVIGATION CONFIG ---
  const menuItems = useMemo(() => [
    { id: 'home', icon: Home, label: '1. Home' },
    { id: 'planner', icon: Sparkles, label: '2. AI Planner' },
    { id: 'destinations', icon: MapPin, label: '3. Destinations' },
    { id: 'map', icon: Map, label: '4. Interactive Map' },
    { id: 'routes', icon: Calendar, label: '5. Ready Routes' },
    { id: 'budget', icon: Calculator, label: '6. Budget Planner' },
    { id: 'weather', icon: CloudSun, label: '7. Weather & Seasons' },
    { id: 'tips', icon: ShieldAlert, label: '8. Travel Tips' },
    { id: 'profile', icon: User, label: '9. Profile' }
  ], []);

  // --- HELPERS ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    setError(null);
    const newHistory = [...chatHistory, { role: 'user', content: trimmedInput }];
    setChatHistory(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, { history: newHistory });
      setChatHistory([...newHistory, { role: 'assistant', content: response.data.response }]);
    } catch (err) {
      setError("Байланыс қатесі. Бэкенд қосулы екенін тексеріңіз.");
      setChatHistory(prev => prev.slice(0, -1)); // Соңғы хабарламаны өшіру
    } finally {
      setIsLoading(true); // Жасанды кідіріс үшін емес, нақты процесс үшін
      setIsLoading(false);
    }
  };

  // --- RENDER FUNCTIONS ---
  const renderHome = () => (
    <div className="max-w-6xl mx-auto space-y-20 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="relative h-[65vh] rounded-[3.5rem] overflow-hidden flex items-center px-12 lg:px-20 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/40 to-transparent z-10" />
        <img src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="KZ Nature" />
        <div className="relative z-20 max-w-2xl">
          <span className="inline-block py-2 px-4 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-pulse">By Bekzhan</span>
          <h2 className="text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">КЕЛЕҢІЗ, <br/><span className="text-blue-500 italic">ҚАЗАҚСТАНДЫ</span> <br/>ЗЕРТТЕЙІК.</h2>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('planner')} className="bg-white text-black px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all">
              Бастау <ArrowRight size={24} />
            </button>
            <button onClick={() => setActiveTab('destinations')} className="bg-white/10 backdrop-blur-md px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all border border-white/10">Локациялар</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['Таулар', 'Көлдер', 'Қалалар'].map(item => (
          <div key={item} className="p-10 bg-slate-900/40 border border-white/5 rounded-[3rem] backdrop-blur-3xl hover:border-blue-500/50 transition-all group">
            <h4 className="text-3xl font-black mb-4 group-hover:text-blue-500 transition-colors">{item}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">Қазақстанның ең танымал {item} бойынша эксклюзивті маршруттар мен кеңестер.</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlanner = () => (
    <div className="max-w-4xl mx-auto h-[82vh] flex flex-col bg-slate-900/60 border border-white/10 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl overflow-hidden">
      <header className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-blue-600/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest leading-none">AI Expedition Guide</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Designed by Bekzhan</p>
          </div>
        </div>
        <button onClick={() => setChatHistory([])} className="p-3 hover:bg-red-500/10 rounded-2xl text-slate-500 hover:text-red-400 transition-all">
          <Trash2 size={20}/>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
            <Zap size={48} className="text-blue-500" />
            <div className="text-center space-y-2">
               <p className="font-black uppercase tracking-[0.2em]">Қайда барғыңыз келеді?</p>
               <p className="text-xs italic">Мысалы: "3 күндік бюджеттік Алматы туры"</p>
            </div>
          </div>
        )}
        {chatHistory.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-8 rounded-[2.5rem] text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-2xl shadow-blue-600/20' : 'bg-slate-800/80 border border-white/10 rounded-tl-none'
            }`}>
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">{m.content}</pre>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800/50 p-6 rounded-[2rem] rounded-tl-none flex gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <footer className="p-8 bg-black/20 backdrop-blur-2xl">
        {error && <div className="mb-4 text-center text-xs text-red-400 font-bold bg-red-400/10 py-2 rounded-xl">{error}</div>}
        <div className="flex gap-4 p-2 bg-slate-800/50 rounded-[2.5rem] border border-white/10 focus-within:ring-2 ring-blue-600/50 transition-all">
          <input 
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Сұрағыңды жаз..."
            className="flex-1 bg-transparent px-8 py-4 outline-none text-sm font-medium"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-blue-600 p-5 rounded-[2rem] hover:bg-blue-500 transition-all shadow-xl disabled:opacity-50">
            <Send size={24} className="text-white" />
          </button>
        </div>
      </footer>
    </div>
  );

  const renderDestinations = () => (
    <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <h3 className="text-5xl font-black tracking-tighter italic uppercase leading-none">Explore <br/> <span className="text-blue-500">Destinations</span></h3>
        <div className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl border border-white/5 text-[10px] font-black uppercase">
          <button className="px-6 py-3 bg-blue-600 rounded-xl">All</button>
          <button className="px-6 py-3 hover:bg-white/5 rounded-xl transition-all">Top 10</button>
          <button className="px-6 py-3 hover:bg-white/5 rounded-xl transition-all">Hidden</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {['Charyn Canyon', 'Kaindy Lake', 'Burabay', 'Mangystau', 'Altay', 'Astana Expo'].map(loc => (
          <div key={loc} className="h-[400px] bg-slate-900 rounded-[3rem] overflow-hidden relative group cursor-pointer border border-white/5 hover:border-blue-500 transition-all">
            <img src={`https://source.unsplash.com/600x800/?${loc},nature`} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt={loc} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10">
              <h4 className="text-3xl font-black italic mb-2 tracking-tighter uppercase">{loc}</h4>
              <button className="flex items-center gap-2 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                Details <ChevronRight size={14}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBudget = () => (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
       <div className="bg-slate-900/60 p-16 rounded-[4rem] border border-white/10 space-y-10">
          <h3 className="text-4xl font-black italic tracking-tighter uppercase">Budget <br/><span className="text-blue-500">Calculator</span></h3>
          <div className="space-y-6">
            {['Flights', 'Hotel', 'Food', 'Fun'].map(label => (
              <div key={label} className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">{label}</label>
                <input type="number" placeholder="0 ₸" className="w-full bg-black/20 border border-white/5 p-5 rounded-2xl font-bold text-xl outline-none focus:border-blue-500 transition-all" />
              </div>
            ))}
          </div>
       </div>
       <div className="bg-blue-600 p-16 rounded-[4rem] flex flex-col justify-between shadow-2xl shadow-blue-600/30">
          <div>
            <p className="font-black text-blue-100 text-xs uppercase tracking-widest mb-2 opacity-60">Total Estimated</p>
            <h2 className="text-8xl font-black italic tracking-tighter">0<span className="text-3xl tracking-normal ml-2 italic text-blue-200">₸</span></h2>
          </div>
          <div className="space-y-4">
             <div className="p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-md">
                <p className="text-xs font-bold leading-relaxed italic">"By Bekzhan tip: Always carry cash when traveling to remote areas like Charyn or Kolsai."</p>
             </div>
             <button className="w-full bg-white text-blue-600 py-6 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Get AI Analysis</button>
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-20 lg:w-72 bg-slate-900/50 border-r border-white/5 backdrop-blur-3xl p-6 flex flex-col z-50">
        <div className="flex items-center gap-4 px-2 mb-12">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
            <Globe className="text-white animate-spin-slow" size={24} />
          </div>
          <div className="hidden lg:block leading-none">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">VKO PRO</h1>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">By Bekzhan</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 translate-x-2' 
                : 'hover:bg-white/5 text-slate-500 hover:text-white'
              }`}
            >
              <item.icon size={22} strokeWidth={2.5} />
              <span className="font-bold text-sm hidden lg:block tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 p-5 bg-blue-600/10 rounded-3xl border border-blue-500/20 text-center">
          <p className="text-[9px] font-black text-blue-500 tracking-[0.2em] uppercase italic">Engineering Excellence</p>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_#020617_100%)]" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" />
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 no-scrollbar">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'planner' && renderPlanner()}
          {activeTab === 'destinations' && renderDestinations()}
          {activeTab === 'budget' && renderBudget()}
          {!['home', 'planner', 'destinations', 'budget'].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 animate-pulse opacity-40">
              <Search size={80} strokeWidth={1} className="text-blue-500" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase tracking-widest mb-1 italic">{activeTab} Section</h3>
                <p className="text-xs font-bold uppercase tracking-[0.3em]">Building with ❤️ by Bekzhan</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
