import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Home, Star, MessageSquare, MapPin, Send, Sparkles, 
  Compass, Search, Menu, X, ChevronRight, Award, 
  Map as MapIcon, Plane, Camera, Info, Wind, Map
} from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

function App() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Сәлем! Мен Қазақстан бойынша сіздің кәсіби ИИ-көмекшіңізбін. Қай өңірге саяхат жоспарлаймыз?' }
  ]);
  const [input, setInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const chatEndRef = useRef(null);

  // Деректерді алу
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/places`);
        setPlaces(Array.isArray(res.data) ? res.data : []);
        setFilteredPlaces(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Деректерді жүктеу қатесі");
      }
    };
    fetchPlaces();
  }, []);

  // Чатты төмен айналдыру
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ИИ-мен сөйлесу (Жақсартылған логика)
  const handleChat = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && input.trim()) {
      const userMsg = { role: 'user', text: input };
      setChatHistory(prev => [...prev, userMsg]);
      const currentInput = input;
      setInput("");
      setIsAiLoading(true);

      try {
        const res = await axios.post(`${API_URL}/api/chat`, { message: currentInput });
        setChatHistory(prev => [...prev, { role: 'ai', text: res.data.response }]);
      } catch (err) {
        setChatHistory(prev => [...prev, { role: 'ai', text: "Кешіріңіз, байланыс үзілді. Серверді тексеріңіз." }]);
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden">
      
      {/* 1. Навигациялық панель */}
      <aside className="w-24 md:w-64 bg-[#1e293b]/50 border-r border-slate-800 backdrop-blur-xl flex flex-col transition-all duration-500">
        <div className="p-8 flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
            <Compass className="text-white" size={28} />
          </div>
          <span className="hidden md:block font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">VKO TRAVEL</span>
        </div>

        <nav className="flex-1 px-4 space-y-3">
          {[
            { id: 'home', icon: Home, label: 'Басты бет' },
            { id: 'explore', icon: MapIcon, label: 'Жерлер' },
            { id: 'chat', icon: MessageSquare, label: 'ИИ Көмекші' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-blue-600 shadow-xl shadow-blue-900/40 text-white translate-x-1' 
                  : 'hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              <item.icon size={22} />
              <span className="hidden md:block font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Негізгі контент */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
        
        {/* Хедер */}
        <header className="h-24 flex items-center justify-between px-10 z-10">
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Қайда барғыңыз келеді?"
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-md transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">System Active</span>
            </div>
          </div>
        </header>

        {/* Контент ауыстырғыш */}
        <div className="flex-1 overflow-y-auto p-10">
          
          {activeTab === 'home' && (
            <div className="space-y-16">
              <div className="relative h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt="Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
                <div className="absolute bottom-16 left-16 max-w-3xl">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-blue-300 text-sm font-bold mb-6">
                    <Wind size={16} /> ЕРКІНДІК СЕНІҢ ҚОЛЫҢДА
                  </div>
                  <h1 className="text-7xl font-black mb-8 leading-[1.1] tracking-tight">Қазақстанның <br/><span className="text-blue-500">Мұзтауын</span> аш</h1>
                  <button 
                    onClick={() => setActiveTab('explore')}
                    className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-2xl"
                  >
                    Зерттеуді бастау
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPlaces.map((place) => (
                <div 
                  key={place.id}
                  className="group bg-slate-900/40 rounded-[2.5rem] border border-slate-800/50 overflow-hidden hover:border-blue-500/50 transition-all duration-500 cursor-pointer backdrop-blur-sm"
                  onClick={() => setSelectedPlace(place)}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-6 right-6 bg-slate-950/80 backdrop-blur-xl px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" /> 5.0
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-4">
                      <MapPin size={16} /> Шығыс Қазақстан
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{place.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-8">{place.desc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 font-bold flex items-center gap-1 hover:gap-3 transition-all">Толығырақ <ChevronRight size={18}/></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-slate-900/80 rounded-[3rem] border border-slate-800 backdrop-blur-2xl shadow-2xl overflow-hidden">
              <div className="p-8 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="bg-blue-600 p-4 rounded-[1.2rem] rotate-3">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl tracking-tight">AI Kazakhstan Guide</h3>
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Online • Llama 3.3 Turbo</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm leading-loose ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/20' 
                        : 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-slate-700 backdrop-blur-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex gap-2 p-6 bg-slate-800/40 w-24 rounded-full justify-center animate-pulse">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-8 bg-slate-900/50">
                <div className="flex gap-4 p-2 bg-slate-800/50 rounded-3xl border border-slate-700 focus-within:border-blue-500/50 transition-all shadow-inner">
                  <input 
                    type="text"
                    placeholder="Саяхат жоспарын сұраңыз..."
                    className="flex-1 bg-transparent border-none px-6 focus:outline-none text-sm font-medium"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleChat}
                  />
                  <button 
                    onClick={handleChat}
                    className="bg-blue-600 hover:bg-blue-500 p-5 rounded-2xl transition-all shadow-lg active:scale-90"
                  >
                    <Send size={22} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Модальдік терезе (Толық ақпарат) */}
        {selectedPlace && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0f172a]/95 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-slate-900 w-full max-w-6xl rounded-[4rem] border border-slate-800 overflow-hidden flex flex-col md:flex-row h-[80vh] shadow-3xl">
              <div className="md:w-1/2 h-full relative">
                <img src={selectedPlace.image} className="w-full h-full object-cover" alt={selectedPlace.name} />
                <button 
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-10 left-10 bg-black/40 backdrop-blur-md p-4 rounded-full hover:bg-white hover:text-black transition-all"
                >
                  <X size={28} />
                </button>
              </div>
              <div className="md:w-1/2 p-16 overflow-y-auto">
                <h2 className="text-6xl font-black mb-8 tracking-tighter">{selectedPlace.name}</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-12">{selectedPlace.desc}</p>
                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                      <Star size={14} /> Қонақ үйлер
                    </span>
                    <ul className="space-y-2">
                      {selectedPlace.hotels?.map((h, i) => <li key={i} className="text-sm text-slate-300 font-bold flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>{h}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <Plane size={14} /> Турлар
                    </span>
                    <ul className="space-y-2">
                      {selectedPlace.tours?.map((t, i) => <li key={i} className="text-sm text-slate-300 font-bold flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>{t}</li>)}
                    </ul>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedPlace(null); setActiveTab('chat'); }}
                  className="w-full py-6 bg-blue-600 rounded-[2rem] font-black text-xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40"
                >
                  ИИ-мен жоспарлау
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
