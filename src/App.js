import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map, Calendar, Calculator, CloudSun, ShieldAlert, User, 
  Send, Trash2, ArrowRight, Globe, Zap, Search, ChevronRight, Star, Download, Heart
} from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('kz'); // Тілдік режим: kz, ru, en
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Тілдер жинағы
  const t = {
    kz: { title: "VKO PRO", by: "By Bekzhan", home: "Басты бет", ai: "AI Planner", dest: "Орындар", map: "Карта", routes: "Маршруттар", budget: "Бюджет", weather: "Ауа райы", tips: "Кеңестер", profile: "Профиль" },
    ru: { title: "VKO PRO", by: "By Bekzhan", home: "Главная", ai: "AI Planner", dest: "Места", map: "Карта", routes: "Маршруты", budget: "Бюджет", weather: "Погода", tips: "Советы", profile: "Профиль" },
    en: { title: "VKO PRO", by: "By Bekzhan", home: "Home", ai: "AI Planner", dest: "Places", map: "Map", routes: "Routes", budget: "Budget", weather: "Weather", tips: "Tips", profile: "Profile" }
  };

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

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
      setChatHistory([...newHistory, { role: 'assistant', content: "Error connecting to AI server." }]);
    } finally { setLoading(false); }
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
        activeTab === id ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-400 hover:bg-white/5'
      }`}>
      <Icon size={20} />
      <span className="font-bold text-sm hidden lg:block">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-slate-900/50 border-r border-white/5 p-5 flex flex-col z-50">
        <div className="mb-10 px-2">
          <h1 className="text-2xl font-black italic text-blue-500 tracking-tighter uppercase">{t[lang].title}</h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">{t[lang].by}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          <NavItem id="home" icon={Home} label={t[lang].home} />
          <NavItem id="ai" icon={Sparkles} label={t[lang].ai} />
          <NavItem id="dest" icon={MapPin} label={t[lang].dest} />
          <NavItem id="map" icon={Map} label={t[lang].map} />
          <NavItem id="routes" icon={Calendar} label={t[lang].routes} />
          <NavItem id="budget" icon={Calculator} label={t[lang].budget} />
          <NavItem id="weather" icon={CloudSun} label={t[lang].weather} />
          <NavItem id="tips" icon={ShieldAlert} label={t[lang].tips} />
          <NavItem id="profile" icon={User} label={t[lang].profile} />
        </nav>

        {/* Language Switcher */}
        <div className="mt-4 flex gap-2 bg-white/5 p-1 rounded-lg">
          {['kz', 'ru', 'en'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`flex-1 text-[10px] font-bold p-2 rounded ${lang === l ? 'bg-blue-600' : ''}`}>{l.toUpperCase()}</button>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        
        {/* 1. HOME */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="relative h-96 rounded-[3rem] overflow-hidden flex items-center px-12 border border-white/10">
              <img src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1200" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-6xl font-black italic uppercase leading-none">Explore <br/><span className="text-blue-500">Kazakhstan</span></h2>
                <button onClick={() => setActiveTab('ai')} className="bg-white text-black px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:scale-105 transition-all">Plan My Trip <ArrowRight/></button>
              </div>
            </div>
          </div>
        )}

        {/* 2. AI PLANNER */}
        {activeTab === 'ai' && (
          <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-slate-900/80 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <span className="font-black text-xs uppercase tracking-widest text-blue-500 flex items-center gap-2"><Sparkles size={16}/> AI Planner</span>
              <div className="flex gap-4">
                <button className="text-slate-400 hover:text-white"><Download size={20}/></button>
                <button onClick={() => setChatHistory([])}><Trash2 size={20} className="text-slate-500 hover:text-red-500"/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-2xl whitespace-pre-wrap shadow-lg ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-white/5'}`}>{m.content}</div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            <div className="p-6 bg-black/40 flex gap-4">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} placeholder="Ask AI for route..." className="flex-1 bg-slate-800 p-4 rounded-xl outline-none border border-white/5" />
              <button onClick={onSend} className="bg-blue-600 p-4 rounded-xl hover:bg-blue-500"><Send size={20}/></button>
            </div>
          </div>
        )}

        {/* 3. DESTINATIONS */}
        {activeTab === 'dest' && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {['Mountains', 'Lakes', 'National Parks', 'Cities', 'Hidden Gems'].map(cat => (
                <button key={cat} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full whitespace-nowrap hover:bg-blue-600">{cat}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-64 bg-slate-800 rounded-3xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-60" />
                  <img src={`https://images.unsplash.com/photo-${1500000000000 + i*1000000}?w=600`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <h4 className="absolute bottom-6 left-6 z-20 font-black italic uppercase">Location {i}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INTERACTIVE MAP */}
        {activeTab === 'map' && (
          <div className="h-full bg-slate-800 rounded-[3rem] border border-white/10 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-30 bg-[url('https://static.vecteezy.com/system/resources/previews/010/160/533/original/world-map-background-free-vector.jpg')] bg-cover"></div>
             <div className="relative z-10 text-center space-y-4">
               <Map size={80} className="mx-auto text-blue-500" />
               <h3 className="text-2xl font-black italic">Interactive Map Coming Soon</h3>
               <button onClick={() => setActiveTab('ai')} className="bg-blue-600 px-6 py-3 rounded-xl font-bold">Go to AI Planner</button>
             </div>
          </div>
        )}

        {/* 6. BUDGET PLANNER */}
        {activeTab === 'budget' && (
          <div className="max-w-2xl mx-auto bg-slate-900/80 p-10 rounded-[3rem] border border-white/10 space-y-8 animate-in slide-in-from-bottom-10">
             <h3 className="text-3xl font-black italic text-blue-500 uppercase">Budget Calculator</h3>
             {['Living', 'Transport', 'Food', 'Events'].map(item => (
               <div key={item} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                 <span className="font-bold">{item}</span>
                 <input type="number" placeholder="0 ₸" className="bg-transparent text-right outline-none font-black text-blue-500" />
               </div>
             ))}
             <div className="pt-6 border-t border-white/10 flex justify-between text-2xl font-black italic">
               <span>Total:</span>
               <span className="text-blue-500">0 ₸</span>
             </div>
          </div>
        )}

        {/* PLACEHOLDER FOR OTHERS */}
        {!['home', 'ai', 'dest', 'map', 'budget'].includes(activeTab) && (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
            <Zap size={60} />
            <h3 className="text-2xl font-black italic uppercase tracking-widest">{activeTab} section under construction</h3>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
