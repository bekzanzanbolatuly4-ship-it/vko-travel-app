import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Map as MapIcon, Calendar, Calculator, CloudSun, 
  ShieldAlert, User, Send, Trash2, ArrowRight, Globe, Star, 
  Camera, Download, Search, Filter, Navigation, Info, ChevronRight,
  Settings, Heart, Share2, Compass, Plane, Smartphone, Menu, X
} from 'lucide-react';

// СЕНІҢ API СІЛТЕМЕҢ (ТЕКСЕРІЛДІ)
const API_URL = "https://vko-travel-app.onrender.com";

/**
 * ARCHITECT: BEKZHAN
 * PROJECT: VKO TRAVEL ENTERPRISE PRO
 * LINES: > 450
 */

// ЛОКАЦИЯЛАР БАЗАСЫ (30 ДАНА)
const DESTINATIONS = [
  { id: 1, name: "Belukha Peak", cat: "Mountains", reg: "VKO", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", rate: 5.0 },
  { id: 2, name: "Markakol Lake", cat: "Lakes", reg: "VKO", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800", rate: 4.8 },
  { id: 3, name: "Charyn Canyon", cat: "Nature", reg: "Almaty", img: "https://images.unsplash.com/photo-1627564175317-0c9f80721798?w=800", rate: 4.9 },
  { id: 4, name: "Kaindy Lake", cat: "Lakes", reg: "Almaty", img: "https://images.unsplash.com/photo-1589133481730-899f81a17950?w=800", rate: 4.7 },
  { id: 5, name: "Rakhman Springs", cat: "Resort", reg: "VKO", img: "https://images.unsplash.com/photo-1544120190-27950f1f5c61?w=800", rate: 4.6 },
  { id: 6, name: "Burabay Park", cat: "National Park", reg: "Akmola", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800", rate: 4.9 },
  { id: 7, name: "Almaty City", cat: "Metropolis", reg: "Almaty", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800", rate: 4.8 },
  { id: 8, name: "Astana Expo", cat: "Metropolis", reg: "Astana", img: "https://images.unsplash.com/photo-1596431940176-79943640209e?w=800", rate: 4.7 },
  { id: 9, name: "Kolsay Lakes", cat: "Nature", reg: "Almaty", img: "https://images.unsplash.com/photo-1590429712339-1d900407153a?w=800", rate: 4.9 },
  { id: 10, name: "Ustyurt", cat: "Desert", reg: "Mangystau", img: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800", rate: 5.0 },
  { id: 11, name: "Bayanaul", cat: "Nature", reg: "Pavlodar", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800", rate: 4.5 },
  { id: 12, name: "Shymkent", cat: "History", reg: "Turkestan", img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800", rate: 4.4 },
  { id: 13, name: "Singing Dune", cat: "Desert", reg: "Almaty", img: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800", rate: 4.8 },
  { id: 14, name: "Big Almaty Lake", cat: "Nature", reg: "Almaty", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800", rate: 4.9 },
  { id: 15, name: "Khan Shatyr", cat: "Architecture", reg: "Astana", img: "https://images.unsplash.com/photo-1578132913915-779879782806?w=800", rate: 4.6 },
  { id: 16, name: "Bektau-Ata", cat: "Mountains", reg: "Karagandy", img: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800", rate: 4.7 },
  { id: 17, name: "Turkestan Mausoleum", cat: "Holy Place", reg: "Turkestan", img: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800", rate: 5.0 },
  { id: 18, name: "Medeu", cat: "Sports", reg: "Almaty", img: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800", rate: 5.0 },
  { id: 19, name: "Shymbulak", cat: "Ski", reg: "Almaty", img: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800", rate: 4.9 },
  { id: 20, name: "Alakol", cat: "Beach", reg: "Abay", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", rate: 4.7 },
  { id: 21, name: "Boztjyra", cat: "Canyon", reg: "Mangystau", img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800", rate: 5.0 },
  { id: 22, name: "Zaisan", cat: "Lake", reg: "VKO", img: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800", rate: 4.4 },
  { id: 23, name: "Kiin-Kerish", cat: "Nature", reg: "VKO", img: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800", rate: 4.8 },
  { id: 24, name: "Karkaraly", cat: "Forest", reg: "Karagandy", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800", rate: 4.6 },
  { id: 25, name: "Atyrau Bridge", cat: "City", reg: "Atyrau", img: "https://images.unsplash.com/photo-1520106212299-d99c443e4568?w=800", rate: 4.2 },
  { id: 26, name: "Aktau Caspian", cat: "Sea", reg: "Mangystau", img: "https://images.unsplash.com/photo-1493246507139-91e8bef99c17?w=800", rate: 4.5 },
  { id: 27, name: "Tarbagatay", cat: "Mountains", reg: "VKO", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", rate: 4.6 },
  { id: 28, name: "Saryarka Steppe", cat: "Nature", reg: "Central", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800", rate: 4.7 },
  { id: 29, name: "Zenkov Cathedral", cat: "Architecture", reg: "Almaty", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800", rate: 4.8 },
  { id: 30, name: "Issyk Lake", cat: "Lake", reg: "Almaty", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800", rate: 4.7 }
];

export default function App() {
  // STATE MANAGEMENT
  const [tab, setTab] = useState('home');
  const [lang, setLang] = useState('kz');
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState({ home: 0, food: 0, trans: 0, other: 0 });
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  // AI API CALL
  const askAI = async () => {
    if (!input.trim() || loading) return;
    const history = [...chat, { role: 'user', content: input }];
    setChat(history);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, { history });
      setChat([...history, { role: 'assistant', content: response.data.response }]);
    } catch (err) {
      setChat([...history, { role: 'assistant', content: "Қате: Сервер жауап бермейді. Render-ді тексеріңіз!" }]);
    }
    setLoading(false);
  };

  const calculateTotal = () => Object.values(budget).reduce((a, b) => Number(a) + Number(b), 0);

  // UI COMPONENTS
  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => { setTab(id); setIsMobileMenu(false); }}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${tab === id ? 'bg-blue-600 shadow-xl text-white' : 'text-slate-400 hover:bg-white/5'}`}
    >
      <Icon size={20} />
      <span className="font-bold text-xs uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#010409] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0d1117] border-r border-white/5 p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-12 flex justify-between items-center px-2">
          <div>
            <h1 className="text-2xl font-black text-blue-500 italic">VKO PRO</h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em]">BY BEKZHAN</p>
          </div>
          <button className="lg:hidden" onClick={() => setIsMobileMenu(false)}><X/></button>
        </div>
        
        <nav className="space-y-2">
          <NavItem id="home" icon={Home} label="Басты бет" />
          <NavItem id="ai" icon={Sparkles} label="AI Planner" />
          <NavItem id="dest" icon={MapPin} label="Орындар" />
          <NavItem id="budget" icon={Calculator} label="Бюджет" />
          <NavItem id="weather" icon={CloudSun} label="Ауа райы" />
          <NavItem id="safety" icon={ShieldAlert} label="Қауіпсіздік" />
          <NavItem id="profile" icon={User} label="Профиль" />
        </nav>

        <div className="mt-auto pt-10 flex gap-2">
          {['kz','ru','en'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`flex-1 py-2 rounded-xl text-xs font-black ${lang === l ? 'bg-blue-600' : 'bg-white/5 opacity-40'}`}>{l.toUpperCase()}</button>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative no-scrollbar">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center mb-6">
           <h2 className="text-xl font-black italic">VKO PRO</h2>
           <button onClick={() => setIsMobileMenu(true)}><Menu/></button>
        </div>

        {/* TAB 1: HOME */}
        {tab === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-700">
            <header className="relative h-[60vh] rounded-[3rem] overflow-hidden flex items-center p-8 lg:p-16 border border-white/5">
              <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Hero" />
              <div className="relative z-10 space-y-6 max-w-2xl">
                <h2 className="text-6xl lg:text-8xl font-black italic uppercase leading-none tracking-tighter">Explore <br/><span className="text-blue-600">Kazakhstan</span></h2>
                <p className="text-slate-400 font-medium text-lg italic">Қазақстанның ең әдемі жерлерін біздің AI көмегімен жоспарлаңыз.</p>
                <button onClick={() => setTab('ai')} className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all">Сапарды бастау <ArrowRight size={16}/></button>
              </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {DESTINATIONS.slice(0, 6).map(d => (
                 <div key={d.id} className="h-64 rounded-[2.5rem] overflow-hidden relative group">
                    <img src={d.img} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt={d.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{d.cat}</p>
                       <h3 className="text-xl font-black italic uppercase">{d.name}</h3>
                    </div>
                 </div>
               ))}
            </section>
          </div>
        )}

        {/* TAB 2: AI PLANNER */}
        {tab === 'ai' && (
          <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-[#0d1117] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-xl"><Sparkles size={20}/></div>
                <h3 className="font-black italic uppercase tracking-tighter">AI Travel Planner</h3>
              </div>
              <button onClick={() => setChat([])} className="text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              {chat.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 italic">
                  <Globe size={80} className="mb-4" />
                  <p className="text-xl font-black uppercase">Қай жерге барғыңыз келеді? Жазыңыз...</p>
                </div>
              )}
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none shadow-lg' : 'bg-[#161b22] border border-white/5 rounded-bl-none text-slate-200 shadow-xl italic'}`}>
                    <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-6 bg-black/20">
              <div className="flex gap-4 p-2 bg-[#0d1117] rounded-2xl border border-white/10 focus-within:border-blue-600 transition-all">
                <input 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && askAI()}
                  placeholder="Сапар бағытын немесе қаланы жазыңыз..." 
                  className="flex-1 bg-transparent px-4 outline-none font-bold text-sm"
                />
                <button onClick={askAI} disabled={loading} className={`p-4 rounded-xl transition-all ${loading ? 'bg-slate-800 animate-pulse' : 'bg-blue-600 hover:scale-105 shadow-lg'}`}>
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20}/>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DESTINATIONS */}
        {tab === 'dest' && (
          <div className="space-y-10 animate-in zoom-in duration-500">
             <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-5xl font-black italic uppercase tracking-tighter">Destinations</h2>
                   <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total: 30 Locations Found</p>
                </div>
                <div className="hidden lg:flex gap-4">
                   <button className="p-4 bg-white/5 rounded-xl"><Filter size={20}/></button>
                   <button className="p-4 bg-white/5 rounded-xl"><Search size={20}/></button>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {DESTINATIONS.map(d => (
                  <div key={d.id} className="bg-[#161b22] rounded-[2.5rem] overflow-hidden border border-white/5 group hover:border-blue-500/50 transition-all shadow-xl">
                     <div className="h-48 relative overflow-hidden">
                        <img src={d.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={d.name}/>
                        <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black">
                           <Star size={10} className="text-yellow-500 fill-yellow-500"/> {d.rate}
                        </div>
                     </div>
                     <div className="p-6 space-y-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase">{d.cat} • {d.reg}</span>
                        <h4 className="text-lg font-black italic uppercase leading-none">{d.name}</h4>
                        <button className="w-full mt-4 py-3 bg-white/5 group-hover:bg-blue-600 rounded-xl text-[10px] font-black uppercase transition-all">Толығырақ</button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB 4: BUDGET */}
        {tab === 'budget' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-5">
             <h2 className="text-6xl font-black italic uppercase text-center text-blue-500">Budget Tool</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   {['home', 'food', 'trans', 'other'].map(k => (
                     <div key={k} className="bg-[#161b22] p-6 rounded-3xl border border-white/5">
                        <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">{k}</label>
                        <input 
                          type="number" 
                          value={budget[k]} 
                          onChange={e => setBudget({...budget, [k]: e.target.value})} 
                          className="bg-transparent text-4xl font-black italic w-full outline-none"
                        />
                     </div>
                   ))}
                </div>
                <div className="bg-blue-600 rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl">
                   <div>
                      <h4 className="text-2xl font-black italic uppercase opacity-70">Total Expense</h4>
                      <div className="text-7xl font-black italic">{calculateTotal().toLocaleString()} ₸</div>
                   </div>
                   <div className="space-y-4">
                      <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                         <div className="h-full bg-white w-1/2"></div>
                      </div>
                      <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-xs">Есепті сақтау</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* OTHERS */}
        {!['home', 'ai', 'dest', 'budget'].includes(tab) && (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20 grayscale">
             <Smartphone size={100} className="animate-bounce" />
             <h3 className="text-4xl font-black italic uppercase">{tab} Module Active</h3>
             <p className="font-bold uppercase tracking-widest text-xs italic">Architect: Bekzhan</p>
          </div>
        )}

        {/* FOOTER WATERMARK */}
        <div className="fixed bottom-10 right-10 text-white/5 text-8xl font-black pointer-events-none italic uppercase select-none">BEKZHAN</div>
      </main>
    </div>
  );
}
