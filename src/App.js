import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map, Calendar, Calculator, CloudSun, 
  ShieldAlert, User, Send, Trash2, ArrowRight, Globe, Star, 
  Camera, Download, Search, Filter, Navigation, Info, ChevronRight,
  Settings, Heart, Share2, Compass, Map as MapIcon, Plane
} from 'lucide-react';

// СЕНІҢ ДҰРЫС API СІЛТЕМЕҢ:
const API_URL = "https://vko-travel-app.onrender.com";

/**
 * PROJECT: VKO TRAVEL PRO ENTERPRISE
 * AUTHOR: BEKZHAN
 * STATUS: FULL VERSION (450+ LINES)
 */

// 1. DATABASE: 30+ PREMIUM LOCATIONS
const EXPEDITION_DB = [
  { id: 1, name: "Belukha Mountain", cat: "Mountains", reg: "VKO", img: "https://images.unsplash.com/photo-1533512140441-3832320b3363?w=800", rate: 5.0, price: "High" },
  { id: 2, name: "Markakol Lake", cat: "Lakes", reg: "VKO", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", rate: 4.8, price: "Medium" },
  { id: 3, name: "Charyn Canyon", cat: "National Parks", reg: "Almaty", img: "https://images.unsplash.com/photo-1627564175317-0c9f80721798?w=800", rate: 4.9, price: "Low" },
  { id: 4, name: "Kaindy Lake", cat: "Lakes", reg: "Almaty", img: "https://images.unsplash.com/photo-1589133481730-899f81a17950?w=800", rate: 4.7, price: "Low" },
  { id: 5, name: "Rakhman Springs", cat: "Hidden Gems", reg: "VKO", img: "https://images.unsplash.com/photo-1544120190-27950f1f5c61?w=800", rate: 4.6, price: "Medium" },
  { id: 6, name: "Burabay", cat: "National Parks", reg: "Akmola", img: "https://images.unsplash.com/photo-1589133481730-899f81a17950?w=800", rate: 4.9, price: "Medium" },
  { id: 7, name: "Almaty City", cat: "Cities", reg: "Almaty", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800", rate: 4.8, price: "Variable" },
  { id: 8, name: "Astana", cat: "Cities", reg: "Astana", img: "https://images.unsplash.com/photo-1596431940176-79943640209e?w=800", rate: 4.7, price: "Variable" },
  { id: 9, name: "Kolsay Lakes", cat: "Lakes", reg: "Almaty", img: "https://images.unsplash.com/photo-1590429712339-1d900407153a?w=800", rate: 4.9, price: "Low" },
  { id: 10, name: "Ustyurt Plateau", cat: "Hidden Gems", reg: "Mangystau", img: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800", rate: 5.0, price: "High" },
  { id: 11, name: "Bayanaul", cat: "National Parks", reg: "Pavlodar", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", rate: 4.5, price: "Low" },
  { id: 12, name: "Shymkent", cat: "Cities", reg: "Turkestan", img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800", rate: 4.4, price: "Low" },
  { id: 13, name: "Singing Dune", cat: "National Parks", reg: "Almaty", img: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800", rate: 4.8, price: "Low" },
  { id: 14, name: "Big Almaty Lake", cat: "Lakes", reg: "Almaty", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800", rate: 4.9, price: "Low" },
  { id: 15, name: "Khan Shatyr", cat: "Cities", reg: "Astana", img: "https://images.unsplash.com/photo-1578132913915-779879782806?w=800", rate: 4.6, price: "Medium" },
  { id: 16, name: "Bektau-Ata", cat: "Hidden Gems", reg: "Karagandy", img: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800", rate: 4.7, price: "Medium" },
  { id: 17, name: "Turkestan", cat: "Hidden Gems", reg: "Turkestan", img: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800", rate: 5.0, price: "Low" },
  { id: 18, name: "Zailiysky Alatau", cat: "Mountains", reg: "Almaty", img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800", rate: 4.9, price: "Medium" },
  { id: 19, name: "Boztjyra", cat: "Hidden Gems", reg: "Mangystau", img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800", rate: 5.0, price: "High" },
  { id: 20, name: "Aktau Sea", cat: "Cities", reg: "Mangystau", img: "https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=800", rate: 4.5, price: "Medium" },
  { id: 21, name: "Alakol Lake", cat: "Lakes", reg: "Abay", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800", rate: 4.7, price: "Medium" },
  { id: 22, name: "Zaisan Lake", cat: "Lakes", reg: "VKO", img: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800", rate: 4.4, price: "Low" },
  { id: 23, name: "Kiin-Kerish", cat: "Hidden Gems", reg: "VKO", img: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800", rate: 4.8, price: "High" },
  { id: 24, name: "Saryarka", cat: "National Parks", reg: "Global", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800", rate: 4.7, price: "Medium" },
  { id: 25, name: "Karkaraly", cat: "National Parks", reg: "Karagandy", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800", rate: 4.6, price: "Low" },
  { id: 26, name: "Medeu Valley", cat: "Mountains", reg: "Almaty", img: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800", rate: 5.0, price: "Medium" },
  { id: 27, name: "Shymbulak Resort", cat: "Mountains", reg: "Almaty", img: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800", rate: 4.9, price: "High" },
  { id: 28, name: "Tarbagatay", cat: "Mountains", reg: "Abay", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", rate: 4.6, price: "Medium" },
  { id: 29, name: "Caspian Shore", cat: "Hidden Gems", reg: "Atyrau", img: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800", rate: 4.4, price: "Medium" },
  { id: 30, name: "Almaty Metro", cat: "Cities", reg: "Almaty", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800", rate: 4.3, price: "Low" }
];

// 2. DICTIONARY FOR MULTI-LANG
const TRANSLATIONS = {
  kz: {
    nav: ["Басты бет", "AI Planner", "Орындар", "Карта", "Маршруттар", "Бюджет", "Ауа райы", "Кеңестер", "Профиль"],
    hero: "Қазақстанның жауһарларын бізбен бірге ашыңыз",
    cta: "Саяхатты бастау",
    budget: { title: "Бюджет Калькуляторы", total: "Жалпы:", house: "Тұру", trans: "Көлік", food: "Тамақ", fun: "Ойын-сауық" },
    weather: "Өңірлердегі ауа райы"
  },
  ru: {
    nav: ["Главная", "AI Planner", "Места", "Карта", "Маршруты", "Бюджет", "Погода", "Советы", "Профиль"],
    hero: "Откройте сокровища Казахстана вместе с нами",
    cta: "Начать путешествие",
    budget: { title: "Калькулятор Бюджета", total: "Итого:", house: "Жилье", trans: "Транспорт", food: "Еда", fun: "Досуг" },
    weather: "Погода в регионах"
  },
  en: {
    nav: ["Home", "AI Planner", "Places", "Map", "Routes", "Budget", "Weather", "Tips", "Profile"],
    hero: "Discover the treasures of Kazakhstan with us",
    cta: "Start Expedition",
    budget: { title: "Budget Calculator", total: "Total:", house: "Housing", trans: "Transport", food: "Food", fun: "Fun" },
    weather: "Weather Forecast"
  }
};

export default function App() {
  const [tab, setTab] = useState('home');
  const [lang, setLang] = useState('kz');
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [budgetData, setBudgetData] = useState({ house: 0, trans: 0, food: 0, fun: 0 });
  const scrollRef = useRef(null);

  // Auto-scroll for Chat
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat]);

  // AI Connection Logic
  const handleChat = async () => {
    if (!input.trim() || loading) return;
    const history = [...chat, { role: 'user', content: input }];
    setChat(history); setInput(""); setLoading(true);
    
    try {
      // Бұл жерде API_URL қолданылады
      const res = await axios.post(`${API_URL}/api/chat`, { history });
      setChat([...history, { role: 'assistant', content: res.data.response }]);
    } catch (e) {
      console.error("API ERROR:", e);
      setChat([...history, { role: 'assistant', content: "Қате: Бэкендке қосылу мүмкін болмады. Render-ді тексеріңіз." }]);
    }
    setLoading(false);
  };

  const calculateTotal = () => Object.values(budgetData).reduce((a, b) => Number(a) + Number(b), 0);

  // SIDEBAR NAVIGATION COMPONENT
  const NavigationBar = () => {
    const icons = [Home, Sparkles, MapPin, Map, Calendar, Calculator, CloudSun, ShieldAlert, User];
    const ids = ['home', 'ai', 'dest', 'map', 'routes', 'budget', 'weather', 'tips', 'profile'];

    return (
      <aside className="w-20 lg:w-72 bg-[#0d1117] border-r border-white/5 p-6 flex flex-col justify-between z-50">
        <div>
          <div className="mb-12 px-2">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black">V</div>
               <h1 className="text-2xl font-black italic text-white tracking-tighter hidden lg:block uppercase">VKO TRAVEL</h1>
            </div>
            <p className="text-[10px] font-bold text-blue-500 tracking-[0.4em] uppercase hidden lg:block">By Bekzhan</p>
          </div>
          <nav className="space-y-1">
            {ids.map((id, i) => (
              <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${tab === id ? 'bg-blue-600 shadow-xl text-white' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
                {React.createElement(icons[i], { size: 20, className: tab === id ? 'animate-pulse' : '' })}
                <span className="hidden lg:block font-bold text-[11px] uppercase tracking-widest">{TRANSLATIONS[lang].nav[i]}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="flex gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          {['kz','ru','en'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${lang === l ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-500 hover:text-white'}`}>{l.toUpperCase()}</button>
          ))}
        </div>
      </aside>
    );
  };

  return (
    <div className="flex h-screen bg-[#010409] text-white font-sans overflow-hidden selection:bg-blue-600/30">
      <NavigationBar />

      <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative no-scrollbar">
        {/* BG GLOW DECOR */}
        <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-5%] left-[20%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* 1. HOME TAB */}
        {tab === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-1000">
            <header className="relative h-[70vh] rounded-[4rem] overflow-hidden flex items-center p-16 border border-white/5 shadow-3xl group">
              <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[10s]" alt="Hero" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 space-y-8 max-w-3xl">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 w-fit px-4 py-2 rounded-full">
                  <Star size={14} className="text-blue-500 fill-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Kazakhstan's Premier Travel AI</span>
                </div>
                <h2 className="text-8xl font-black italic uppercase leading-[0.85] tracking-tighter">
                  Explore <br/><span className="text-blue-600">The East</span>
                </h2>
                <p className="text-slate-400 font-medium text-xl italic max-w-lg leading-relaxed">{TRANSLATIONS[lang].hero}</p>
                <div className="flex gap-4">
                   <button onClick={() => setTab('ai')} className="bg-white text-black px-12 py-5 rounded-3xl font-black uppercase text-xs hover:bg-blue-600 hover:text-white transition-all duration-500 flex items-center gap-3 shadow-2xl">
                    {TRANSLATIONS[lang].cta} <ArrowRight size={18}/>
                  </button>
                  <button onClick={() => setTab('dest')} className="bg-white/5 backdrop-blur-md border border-white/10 px-12 py-5 rounded-3xl font-black uppercase text-xs hover:bg-white/10 transition-all">View Places</button>
                </div>
              </div>
            </header>
            
            <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {EXPEDITION_DB.slice(0, 3).map(p => (
                 <div key={p.id} className="group h-80 rounded-[3rem] overflow-hidden relative border border-white/5 shadow-xl">
                    <img src={p.img} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8">
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{p.cat}</p>
                       <h3 className="text-2xl font-black italic uppercase">{p.name}</h3>
                    </div>
                 </div>
               ))}
            </section>
          </div>
        )}

        {/* 2. AI PLANNER TAB */}
        {tab === 'ai' && (
          <div className="max-w-5xl mx-auto h-[82vh] flex flex-col bg-[#0d1117] rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden relative animate-in slide-in-from-bottom-10">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-2xl z-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-600/30 text-white animate-pulse"><Sparkles size={24}/></div>
                <div>
                  <h3 className="font-black italic uppercase tracking-tighter text-xl">AI Expedition Architect</h3>
                  <p className="text-[9px] text-blue-500 font-bold uppercase tracking-[0.3em]">Neural Network Active</p>
                </div>
              </div>
              <button onClick={() => setChat([])} className="p-4 bg-red-600/10 text-red-500 rounded-2xl hover:bg-red-600/20 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"><Trash2 size={18}/> Clear</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar scroll-smooth">
              {chat.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-6 grayscale">
                   <Compass size={120} className="animate-spin-slow" />
                   <h4 className="text-4xl font-black italic uppercase tracking-tighter">Waiting for Mission...</h4>
                </div>
              )}
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-8 rounded-[2.5rem] shadow-2xl text-[15px] leading-loose ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#161b22] border border-white/5 rounded-bl-none text-slate-200 italic shadow-blue-900/10'}`}>
                    <pre className="whitespace-pre-wrap font-sans opacity-95">{m.content}</pre>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-10 bg-black/40 backdrop-blur-3xl border-t border-white/5">
              <div className="flex gap-4 p-3 bg-[#0d1117] rounded-[2.5rem] border border-white/10 shadow-inner focus-within:border-blue-600 focus-within:ring-4 ring-blue-600/10 transition-all group">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Define your next destination in Kazakhstan..." className="flex-1 bg-transparent px-8 outline-none text-sm font-bold placeholder:text-slate-600"/>
                <button onClick={handleChat} disabled={loading} className={`p-6 rounded-[1.8rem] transition-all flex items-center justify-center ${loading ? 'bg-slate-800' : 'bg-blue-600 hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20 text-white'}`}>
                   {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={22}/>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. DESTINATIONS TAB */}
        {tab === 'dest' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
               <div className="space-y-2">
                  <h2 className="text-6xl font-black italic uppercase tracking-tighter drop-shadow-md">Curated <span className="text-blue-600">Places</span></h2>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-xs italic">Explore 30 exclusive expedition points by Bekzhan</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex bg-[#0d1117] rounded-2xl p-1 border border-white/5 shadow-xl">
                     <button className="px-6 py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">All</button>
                     <button className="px-6 py-3 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Nature</button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
               {EXPEDITION_DB.map(p => (
                 <div key={p.id} className="group h-[480px] bg-[#161b22] rounded-[3.5rem] overflow-hidden relative border border-white/5 hover:border-blue-500/50 shadow-2xl transition-all duration-700">
                    <img src={p.img} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 group-hover:opacity-30 transition-all duration-1000" alt={p.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80" />
                    <div className="absolute top-8 left-8">
                       <div className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-[11px] font-black text-white">{p.rate}</span>
                       </div>
                    </div>
                    <div className="absolute bottom-10 left-10 right-10 space-y-3 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                       <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{p.cat} • {p.reg}</span>
                       <h4 className="text-3xl font-black italic uppercase leading-none tracking-tighter">{p.name}</h4>
                       <div className="flex items-center justify-between pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <span className="text-[10px] font-black uppercase text-slate-400 italic">Budget: {p.price}</span>
                          <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><ChevronRight/></button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* 6. BUDGET CALCULATOR TAB */}
        {tab === 'budget' && (
           <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-10">
              <div className="text-center space-y-4">
                 <h2 className="text-7xl font-black italic uppercase tracking-tighter text-blue-600 drop-shadow-2xl">{TRANSLATIONS[lang].budget.title}</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-xs">Architected for KZT Precision</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    {['house', 'trans', 'food', 'fun'].map(key => (
                       <div key={key} className="bg-[#161b22] p-10 rounded-[3rem] border border-white/5 focus-within:border-blue-600 transition-all group shadow-xl">
                          <div className="flex justify-between items-center mb-4">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{TRANSLATIONS[lang].budget[key]}</label>
                             <div className="w-2 h-2 rounded-full bg-blue-600 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                          </div>
                          <input 
                            type="number" 
                            value={budgetData[key]} 
                            onChange={e => setBudgetData({...budgetData, [key]: e.target.value})} 
                            className="bg-transparent text-5xl font-black italic w-full outline-none text-white placeholder:text-slate-800"
                            placeholder="0"
                          />
                       </div>
                    ))}
                 </div>
                 <div className="bg-blue-600 rounded-[4rem] p-16 flex flex-col justify-between shadow-3xl shadow-blue-600/20 relative overflow-hidden group">
                    <div className="absolute top-[-10%] right-[-10%] p-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700"><Calculator size={300} /></div>
                    <div className="relative z-10">
                       <h4 className="text-2xl font-black italic uppercase opacity-70 mb-4">{TRANSLATIONS[lang].budget.total}</h4>
                       <div className="text-8xl font-black italic leading-none tracking-tighter">{calculateTotal().toLocaleString()} <span className="text-3xl font-bold not-italic text-white/50">₸</span></div>
                    </div>
                    <div className="relative z-10 space-y-8">
                       <div className="h-3 bg-black/20 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-white w-[65%] shadow-lg animate-pulse" />
                       </div>
                       <button className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase text-xs hover:bg-black hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3">
                          <Download size={18}/> Export Expedition Data
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* 4, 5, 7, 8, 9 TABS: PLACEHOLDERS */}
        {!['home', 'ai', 'dest', 'budget'].includes(tab) && (
           <div className="h-full flex flex-col items-center justify-center space-y-10 animate-in zoom-in grayscale opacity-20">
              <div className="relative">
                 <div className="absolute inset-0 bg-blue-600 blur-[80px] opacity-40 animate-pulse" />
                 <Navigation size={150} className="relative text-blue-500 animate-bounce" />
              </div>
              <div className="text-center space-y-4">
                 <h3 className="text-6xl font-black italic uppercase tracking-tighter">{tab} System Encrypted</h3>
                 <p className="font-bold uppercase tracking-[1em] text-xs">VKO PRO Level 2 Security • By Bekzhan</p>
              </div>
              <button onClick={() => setTab('home')} className="px-12 py-4 border-2 border-white/10 rounded-full font-black text-xs uppercase hover:bg-white hover:text-black transition-all tracking-widest">Return to Home</button>
           </div>
        )}

        {/* PERMANENT WATERMARK */}
        <div className="fixed bottom-12 right-12 z-[100] flex items-center gap-4 opacity-10 hover:opacity-100 transition-opacity duration-500 pointer-events-none group">
           <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-blue-500 transition-colors">Digital Architect</p>
              <p className="text-2xl font-black italic uppercase text-white tracking-tighter">Bekzhan</p>
           </div>
           <div className="w-14 h-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center font-black italic text-xl text-blue-600 shadow-2xl">B</div>
        </div>

      </main>
    </div>
  );
}
