import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Home, Sparkles, MapPin, Calculator, CloudSun, ShieldAlert, 
  User, Send, Trash2, ArrowRight, Star, ChevronRight, Menu, X 
} from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

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
  const [tab, setTab] = useState('home');
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [budget, setBudget] = useState({ home: 0, food: 0, trans: 0, fun: 0 });
  
  const scrollRef = useRef(null);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const newHistory = [...chat, { role: 'user', content: input }];
    setChat(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat`, { history: newHistory });
      setChat([...newHistory, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setChat([...newHistory, { role: 'assistant', content: "Қате: Байланыс үзілді. Серверді тексеріңіз." }]);
    }
    setLoading(false);
  };
  const NavLink = ({ id, icon: Icon, text }) => (
    <button onClick={() => { setTab(id); setIsMenuOpen(false); }} className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${tab === id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
      <Icon size={20} /> <span className="font-bold text-[10px] uppercase tracking-widest">{text}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#010409] text-white overflow-hidden font-sans">
      <aside className={`fixed lg:relative z-50 inset-y-0 left-0 w-72 bg-[#0d1117] border-r border-white/5 p-6 transform transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="mb-12 flex justify-between items-center px-2">
          <div className="leading-none">
            <h1 className="text-2xl font-black text-blue-500 italic uppercase">VKO PRO</h1>
            <p className="text-[8px] font-bold text-slate-500 tracking-[0.3em]">BY BEKZHAN</p>
          </div>
          <button className="lg:hidden" onClick={() => setIsMenuOpen(false)}><X/></button>
        </div>
        <nav className="space-y-2">
          <NavLink id="home" icon={Home} text="Басты бет" />
          <NavLink id="ai" icon={Sparkles} text="AI Ассистент" />
          <NavLink id="dest" icon={MapPin} text="Орындар" />
          <NavLink id="budget" icon={Calculator} text="Бюджет" />
          <NavLink id="weather" icon={CloudSun} text="Ауа райы" />
          <NavLink id="safety" icon={ShieldAlert} text="Қауіпсіздік" />
          <NavLink id="profile" icon={User} text="Профиль" />
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative no-scrollbar">
        <button className="lg:hidden mb-6 p-3 bg-white/5 rounded-xl" onClick={() => setIsMenuOpen(true)}><Menu/></button>

        {tab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <header className="relative h-[65vh] rounded-[3.5rem] overflow-hidden flex items-center p-12 border border-white/5 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Hero" />
              <div className="relative z-10 space-y-6 max-w-2xl">
                <h2 className="text-7xl lg:text-8xl font-black italic uppercase leading-none tracking-tighter">Explore <br/><span className="text-blue-600">Qazaqstan</span></h2>
                <p className="text-slate-400 text-lg font-medium italic">Шығыс Қазақстанның жауһарларын AI көмегімен бірге ашыңыз.</p>
                <button onClick={() => setTab('ai')} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-xl">Сапарды бастау <ArrowRight size={16}/></button>
              </div>
            </header>
          </div>
        )}

        {tab === 'ai' && (
          <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-[#0d1117] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3"><Sparkles className="text-blue-500" /> <span className="font-black uppercase italic tracking-widest text-xs">Travel AI</span></div>
              <button onClick={() => setChat([])} className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-all"><Trash2 size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-black/10">
              {chat.length === 0 && <div className="h-full flex flex-col items-center justify-center opacity-10 italic font-black uppercase text-center"><Star size={80} className="mb-6 animate-pulse"/> Қай жерге барғыңыз келеді?</div>}
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-xl ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#161b22] text-slate-200 border border-white/5 rounded-bl-none'}`}>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed italic">{m.content}</pre>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            <div className="p-6 bg-black/30 border-t border-white/5">
              <div className="flex gap-4 p-2 bg-[#0d1117] rounded-3xl border border-white/10 focus-within:border-blue-600 transition-all shadow-inner">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Мысалы: Катонқарағайға 3 күндік жоспар..." className="flex-1 bg-transparent px-6 outline-none font-bold text-sm" />
                <button onClick={handleSend} disabled={loading} className={`p-5 rounded-2xl transition-all ${loading ? 'bg-slate-800' : 'bg-blue-600 hover:scale-105 shadow-lg'}`}>
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20}/>}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'dest' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter">Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {DESTINATIONS.map(d => (
                <div key={d.id} className="bg-[#161b22] rounded-[3rem] overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all group shadow-xl hover:-translate-y-2 duration-500">
                  <div className="h-48 relative overflow-hidden">
                    <img src={d.img} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={d.name} />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-black italic border border-white/10">⭐ {d.rate}</div>
                  </div>
                  <div className="p-8 space-y-3">
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{d.reg} • {d.cat}</p>
                    <h4 className="font-black italic uppercase text-xl leading-none">{d.name}</h4>
                    <button className="w-full mt-6 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all border border-white/5">Толығырақ</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'budget' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-700">
            <h2 className="text-7xl font-black italic uppercase text-center text-blue-600 tracking-tighter">Budget</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                {Object.keys(budget).map(k => (
                  <div key={k} className="bg-[#161b22] p-8 rounded-[2.5rem] border border-white/5 shadow-lg">
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">{k} (₸)</label>
                    <input type="number" value={budget[k]} onChange={e => setBudget({...budget, [k]: e.target.value})} className="bg-transparent text-5xl font-black italic w-full outline-none text-white" />
                  </div>
                ))}
              </div>
              <div className="bg-blue-600 rounded-[4rem] p-12 flex flex-col justify-between shadow-[0_0_50px_rgba(37,99,235,0.3)]">
                <div>
                  <h4 className="text-2xl font-black italic opacity-60 uppercase tracking-tighter">Total Sum</h4>
                  <div className="text-8xl font-black italic leading-none my-4">{(+budget.home + +budget.food + +budget.trans + +budget.fun).toLocaleString()} ₸</div>
                </div>
                <button className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase text-xs hover:bg-black hover:text-white transition-all shadow-2xl">Есепті сақтау</button>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-12 right-12 opacity-5 text-9xl font-black italic pointer-events-none select-none uppercase tracking-tighter">Bekzhan</div>
      </main>
    </div>
  );
}
