import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map, Calendar, Calculator, CloudSun, 
  ShieldAlert, User, Send, Trash2, ArrowRight, Globe, Info, 
  Star, Camera, Download, Share2, Search, Filter, Settings, 
  Bell, Heart, CreditCard, Droplets, Wind, Navigation 
} from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

/**
 * BY BEKZHAN - ENTERPRISE TRAVEL SYSTEM
 * TOTAL LINES: > 450
 */

// 1. DATA: 30+ LOCATIONS
const PLACES_DB = [
  { id: 1, name: "Belukha Mountain", cat: "Mountains", reg: "VKO", img: "https://images.unsplash.com/photo-1533512140441-3832320b3363?w=800", rating: 4.9 },
  { id: 2, name: "Markakol Lake", cat: "Lakes", reg: "VKO", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", rating: 4.8 },
  { id: 3, name: "Charyn Canyon", cat: "National Parks", reg: "Almaty", img: "https://images.unsplash.com/photo-1627564175317-0c9f80721798?w=800", rating: 5.0 },
  { id: 4, name: "Kaindy Lake", cat: "Lakes", reg: "Almaty", img: "https://images.unsplash.com/photo-1589133481730-899f81a17950?w=800", rating: 4.7 },
  { id: 5, name: "Rakhman Springs", cat: "Hidden Gems", reg: "VKO", img: "https://images.unsplash.com/photo-1544120190-27950f1f5c61?w=800", rating: 4.6 },
  { id: 6, name: "Burabay", cat: "National Parks", reg: "Akmola", img: "https://images.unsplash.com/photo-1589133481730-899f81a17950?w=800", rating: 4.9 },
  { id: 7, name: "Almaty City", cat: "Cities", reg: "Almaty", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800", rating: 4.8 },
  { id: 8, name: "Astana", cat: "Cities", reg: "Astana", img: "https://images.unsplash.com/photo-1596431940176-79943640209e?w=800", rating: 4.7 },
  { id: 9, name: "Kolsay Lakes", cat: "Lakes", reg: "Almaty", img: "https://images.unsplash.com/photo-1590429712339-1d900407153a?w=800", rating: 4.9 },
  { id: 10, name: "Ustyurt Plateau", cat: "Hidden Gems", reg: "Mangystau", img: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800", rating: 5.0 },
  { id: 11, name: "Bayanaul", cat: "National Parks", reg: "Pavlodar", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", rating: 4.5 },
  { id: 12, name: "Shymkent", cat: "Cities", reg: "Turkestan", img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800", rating: 4.4 },
  { id: 13, name: "Singing Dune", cat: "National Parks", reg: "Almaty", img: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800", rating: 4.8 },
  { id: 14, name: "Big Almaty Lake", cat: "Lakes", reg: "Almaty", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800", rating: 4.9 },
  { id: 15, name: "Khan Shatyr", cat: "Cities", reg: "Astana", img: "https://images.unsplash.com/photo-1578132913915-779879782806?w=800", rating: 4.6 },
  { id: 16, name: "Bektau-Ata", cat: "Hidden Gems", reg: "Karagandy", img: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800", rating: 4.7 },
  { id: 17, name: "Turkestan Mausoleum", cat: "Hidden Gems", reg: "Turkestan", img: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800", rating: 5.0 },
  { id: 18, name: "Zailiysky Alatau", cat: "Mountains", reg: "Almaty", img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800", rating: 4.9 },
  { id: 19, name: "Boztjyra", cat: "Hidden Gems", reg: "Mangystau", img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800", rating: 5.0 },
  { id: 20, name: "Aktau Caspian Sea", cat: "Cities", reg: "Mangystau", img: "https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=800", rating: 4.5 },
  { id: 21, name: "Alakol Lake", cat: "Lakes", reg: "VKO/Zhetysu", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800", rating: 4.7 },
  { id: 22, name: "Karkaraly", cat: "National Parks", reg: "Karagandy", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800", rating: 4.6 },
  { id: 23, name: "Medeu", cat: "Mountains", reg: "Almaty", img: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800", rating: 5.0 },
  { id: 24, name: "Chimbulak", cat: "Mountains", reg: "Almaty", img: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800", rating: 4.9 },
  { id: 25, name: "Kiin Kerish", cat: "Hidden Gems", reg: "VKO", img: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800", rating: 4.8 },
  { id: 26, name: "Akkol Lake", cat: "Lakes", reg: "Zhambyl", img: "https://images.unsplash.com/photo-1516743611421-42149cab2757?w=800", rating: 4.3 },
  { id: 27, name: "Zaisan Lake", cat: "Lakes", reg: "VKO", img: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800", rating: 4.4 },
  { id: 28, name: "Saryarka Steppe", cat: "National Parks", reg: "Global", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800", rating: 4.7 },
  { id: 29, name: "Tarbagatay Mountains", cat: "Mountains", reg: "Abay", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", rating: 4.6 },
  { id: 30, name: "Atyrau Bridge", cat: "Cities", reg: "Atyrau", img: "https://images.unsplash.com/photo-1520106212299-d99c443e4568?w=800", rating: 4.2 }
];

// 2. TRANSLATIONS OBJECT
const DICT = {
  kz: {
    nav: ["Басты бет", "AI Planner", "Орындар", "Карта", "Маршруттар", "Бюджет", "Ауа райы", "Кеңестер", "Профиль"],
    hero: "Қазақстанды бізбен бірге ашыңыз",
    cta: "Саяхатты бастау",
    budget: { title: "Бюджет Калькуляторы", total: "Жалпы:", living: "Тұру", trans: "Көлік", food: "Тамақ", ent: "Ойын-сауық" },
    weather: { title: "Ауа райы және Сезондар", best: "Ең қолайлы уақыт", current: "Қазіргі климат" }
  },
  ru: {
    nav: ["Главная", "AI Planner", "Места", "Карта", "Маршруты", "Бюджет", "Погода", "Советы", "Профиль"],
    hero: "Откройте Казахстан вместе с нами",
    cta: "Начать путешествие",
    budget: { title: "Калькулятор Бюджета", total: "Итого:", living: "Жилье", trans: "Транспорт", food: "Еда", ent: "Досуг" },
    weather: { title: "Погода и Сезоны", best: "Лучшее время", current: "Текущий климат" }
  },
  en: {
    nav: ["Home", "AI Planner", "Places", "Map", "Routes", "Budget", "Weather", "Tips", "Profile"],
    hero: "Discover Kazakhstan with us",
    cta: "Start Journey",
    budget: { title: "Budget Calculator", total: "Total:", living: "Accommodation", trans: "Transport", food: "Food", ent: "Entertainment" },
    weather: { title: "Weather & Seasons", best: "Best Time", current: "Current Climate" }
  }
};

export default function App() {
  const [tab, setTab] = useState('home');
  const [lang, setLang] = useState('kz');
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [budgetData, setBudgetData] = useState({ living: 0, trans: 0, food: 0, ent: 0 });
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat]);

  const sendToAI = async () => {
    if (!input.trim() || loading) return;
    const history = [...chat, { role: 'user', content: input }];
    setChat(history); setInput(""); setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/chat`, { history });
      setChat([...history, { role: 'assistant', content: res.data.response }]);
    } catch {
      setChat([...history, { role: 'assistant', content: "Server Error. Check Render Backend." }]);
    }
    setLoading(false);
  };

  const calculateTotal = () => Object.values(budgetData).reduce((a, b) => Number(a) + Number(b), 0);

  // NAVIGATION COMPONENT
  const Sidebar = () => {
    const icons = [Home, Sparkles, MapPin, Map, Calendar, Calculator, CloudSun, ShieldAlert, User];
    const keys = ['home', 'ai', 'dest', 'map', 'routes', 'budget', 'weather', 'tips', 'profile'];
    
    return (
      <aside className="w-20 lg:w-72 bg-[#0d1117] border-r border-white/5 flex flex-col justify-between p-6">
        <div>
          <div className="mb-12">
            <h1 className="text-3xl font-black italic text-blue-500 tracking-tighter">VKO PRO</h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.5em] uppercase mt-1">By Bekzhan</p>
          </div>
          <nav className="space-y-2">
            {keys.map((k, i) => (
              <button key={k} onClick={() => setTab(k)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${tab === k ? 'bg-blue-600 shadow-xl shadow-blue-600/20 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                {React.createElement(icons[i], { size: 20 })}
                <span className="hidden lg:block font-bold text-sm uppercase tracking-widest">{DICT[lang].nav[i]}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="flex gap-2 bg-black/40 p-2 rounded-2xl">
          {['kz','ru','en'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${lang === l ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 opacity-50'}`}>{l.toUpperCase()}</button>
          ))}
        </div>
      </aside>
    );
  };

  return (
    <div className="flex h-screen bg-[#010409] text-white font-sans overflow-hidden selection:bg-blue-500/30">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative scroll-smooth no-scrollbar">
        {/* BACKGROUND DECOR */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* 1. HOME TAB */}
        {tab === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-1000">
            <header className="relative h-[65vh] rounded-[4rem] overflow-hidden flex items-center p-16 border border-white/5 group shadow-2xl">
              <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[10s]" alt="Hero" />
              <div className="relative z-10 space-y-8 max-w-3xl">
                <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                  <Star size={14} className="text-blue-500 fill-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Premium Travel Portal v2.0</span>
                </div>
                <h2 className="text-8xl font-black italic uppercase leading-[0.9] tracking-tighter drop-shadow-2xl">
                  {lang === 'kz' ? 'Зертте' : lang === 'ru' ? 'Исследуй' : 'Explore'} <br/>
                  <span className="text-blue-600">Kazakhstan</span>
                </h2>
                <p className="text-slate-400 font-medium max-w-lg leading-relaxed text-lg italic">
                  {DICT[lang].hero}. Сапарды жоспарлаудан бастап, бюджетті есептеуге дейінгі барлық мүмкіндік бір жерде.
                </p>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setTab('ai')} className="bg-white text-black px-10 py-5 rounded-[2rem] font-black uppercase text-sm hover:bg-blue-600 hover:text-white transition-all duration-500 flex items-center gap-3">
                    {DICT[lang].cta} <ArrowRight size={20}/>
                  </button>
                </div>
              </div>
            </header>
          </div>
        )}

        {/* 2. AI PLANNER TAB */}
        {tab === 'ai' && (
          <div className="max-w-5xl mx-auto h-[82vh] flex flex-col bg-[#0d1117] rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-xl z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30"><Sparkles size={24}/></div>
                <div>
                  <h3 className="font-black italic uppercase tracking-tighter">AI Expedition Planner</h3>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Processing via Llama 3.3 70B</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><Download size={20}/></button>
                <button onClick={() => setChat([])} className="p-3 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600/20 transition-all"><Trash2 size={20}/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth">
              {chat.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 italic">
                  <Globe size={60} className="mb-4 text-blue-500" />
                  <p className="text-xl">Қай жерге барғыңыз келеді? <br/> Қаланы немесе бағытты жазыңыз.</p>
                </div>
              )}
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-5`}>
                  <div className={`max-w-[85%] p-8 rounded-[2.5rem] text-[15px] leading-loose shadow-xl ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#161b22] border border-white/5 rounded-bl-none'}`}>
                    <pre className="whitespace-pre-wrap font-sans italic opacity-95">{m.content}</pre>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            <div className="p-10 bg-black/40 backdrop-blur-2xl">
              <div className="flex gap-4 p-3 bg-[#0d1117] rounded-[2rem] border border-white/10 shadow-inner focus-within:border-blue-600 transition-all">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendToAI()} placeholder="Tell me your destination..." className="flex-1 bg-transparent px-6 outline-none text-sm font-bold placeholder:text-slate-600"/>
                <button onClick={sendToAI} disabled={loading} className={`p-5 rounded-2xl transition-all ${loading ? 'bg-slate-800' : 'bg-blue-600 hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20'}`}>
                  {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20}/>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. DESTINATIONS TAB */}
        {tab === 'dest' && (
          <div className="space-y-10 animate-in zoom-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">Destinations</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest mt-2">Explore 30+ locations curated by Bekzhan</p>
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-xl border border-white/5 font-bold text-xs"><Filter size={16}/> Filter</button>
                <button className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20"><Search size={16}/> Explore Map</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {PLACES_DB.map(p => (
                <div key={p.id} className="group h-[450px] bg-[#161b22] rounded-[3rem] overflow-hidden relative border border-white/5 shadow-xl hover:border-blue-500/50 transition-all duration-500">
                  <img src={p.img} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-[1s]" alt={p.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black">{p.rating}</span>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{p.cat} • {p.reg}</span>
                    <h4 className="text-2xl font-black italic uppercase leading-none">{p.name}</h4>
                    <button className="opacity-0 group-hover:opacity-100 mt-4 w-full py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase transition-all duration-500">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. BUDGET PLANNER TAB */}
        {tab === 'budget' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-10">
            <div className="text-center space-y-4">
              <h2 className="text-6xl font-black italic uppercase tracking-tighter text-blue-500">{DICT[lang].budget.title}</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest uppercase italic">Calculate your expedition costs in Tenge (₸)</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                {Object.keys(budgetData).map(key => (
                  <div key={key} className="bg-[#161b22] p-8 rounded-[2.5rem] border border-white/5 focus-within:border-blue-500 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">{DICT[lang].budget[key]}</label>
                      <CreditCard size={18} className="text-blue-500" />
                    </div>
                    <input 
                      type="number" 
                      value={budgetData[key]}
                      onChange={(e) => setBudgetData({...budgetData, [key]: e.target.value})}
                      className="bg-transparent text-4xl font-black italic w-full outline-none text-white placeholder:text-slate-800"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
              <div className="bg-blue-600 rounded-[3rem] p-12 flex flex-col justify-between shadow-2xl shadow-blue-600/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-20"><Calculator size={150} /></div>
                <div className="relative z-10">
                  <h4 className="text-xl font-black italic uppercase opacity-80 mb-2">{DICT[lang].budget.total}</h4>
                  <div className="text-7xl font-black italic leading-none">{calculateTotal().toLocaleString()} <span className="text-2xl">₸</span></div>
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3" />
                  </div>
                  <p className="text-xs font-bold italic opacity-70 italic uppercase">Your budget is optimized for medium level travel</p>
                  <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-xs hover:scale-105 transition-all">Download Report (PDF)</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. WEATHER TAB */}
        {tab === 'weather' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { r: "East", t: "-12°C", i: Wind, s: "Snowy" },
                { r: "South", t: "+5°C", i: CloudSun, s: "Sunny" },
                { r: "West", t: "-2°C", i: Droplets, s: "Rainy" }
              ].map(w => (
                <div key={w.r} className="bg-[#161b22] p-10 rounded-[3rem] border border-white/5 space-y-6">
                  <div className="flex justify-between">
                    <span className="font-black italic text-xl uppercase tracking-tighter text-blue-500">{w.r} Kazakhstan</span>
                    <w.i size={30} className="text-white opacity-50" />
                  </div>
                  <div className="text-6xl font-black italic">{w.t}</div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{w.s} Conditions</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OTHERS: MAP, ROUTES, TIPS, PROFILE - PLACEHOLDERS */}
        {!['home', 'ai', 'dest', 'budget', 'weather'].includes(tab) && (
          <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in">
             <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 animate-pulse" />
                <Navigation size={120} className="relative text-blue-500 animate-bounce" />
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-5xl font-black italic uppercase tracking-tighter">{tab} System Active</h3>
                <p className="font-black text-slate-600 uppercase tracking-[1em]">Development Mode: By Bekzhan</p>
             </div>
             <button onClick={() => setTab('home')} className="px-8 py-3 border border-white/10 rounded-full font-bold text-xs hover:bg-white hover:text-black transition-all">Back to Home</button>
          </div>
        )}

        {/* GLOBAL WATERMARK */}
        <div className="fixed bottom-12 right-12 flex items-center gap-3 opacity-20 pointer-events-none hover:opacity-100 transition-opacity">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest">Architected By</div>
            <div className="text-xl font-black italic uppercase text-blue-500">Bekzhan</div>
          </div>
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-black">B</div>
        </div>
      </main>
    </div>
  );
}
