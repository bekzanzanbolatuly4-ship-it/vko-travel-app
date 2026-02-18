import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Home, Star, MessageSquare, MapPin, Send, Sparkles, 
  Compass, Search, Menu, X, ChevronRight, Award, 
  Map as MapIcon, Plane, Camera, Info
} from 'lucide-react';

// СЕРВЕР СІЛТЕМЕСІ
const API_URL = "https://vko-travel-app.onrender.com";

function App() {
  // --- STATE-ТЕР ---
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Сәлем! Мен Шығыс Қазақстан бойынша сіздің жеке гидіңізбін. Қайда саяхаттағыңыз келеді?' }
  ]);
  const [input, setInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'explore', 'chat'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const chatEndRef = useRef(null);

  // --- МӘЛІМЕТТЕРДІ ЖҮКТЕУ ---
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/places`);
        const data = Array.isArray(res.data) ? res.data : [];
        setPlaces(data);
        setFilteredPlaces(data);
      } catch (err) {
        console.error("Backend-пен байланыс орнату мүмкін болмады:", err);
      }
    };
    fetchPlaces();
  }, []);

  // --- ІЗДЕУ ЛОГИКАСЫ ---
  useEffect(() => {
    const results = places.filter(place =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlaces(results);
  }, [searchQuery, places]);

  // --- ЧАТТЫ ТӨМЕНГЕ ЖЫЛЖЫТУ ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // --- ИИ-МЕН СӨЙЛЕСУ ---
  const handleChat = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && input.trim()) {
      const userMsg = { role: 'user', text: input };
      setChatHistory(prev => [...prev, userMsg]);
      const tempInput = input;
      setInput("");
      setIsAiLoading(true);

      try {
        const res = await axios.post(`${API_URL}/api/chat`, { message: tempInput });
        setChatHistory(prev => [...prev, { role: 'ai', text: res.data.response }]);
      } catch (err) {
        setChatHistory(prev => [...prev, { role: 'ai', text: "Кешіріңіз, байланыс үзілді. Серверді тексеріңіз." }]);
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* 1. SIDEBAR (НАВИГАЦИЯ) */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Compass className="text-white" size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">VKO Travel</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'home', icon: Home, label: 'Басты бет' },
            { id: 'explore', icon: MapIcon, label: 'Көрікті жерлер' },
            { id: 'chat', icon: MessageSquare, label: 'ИИ Ассистент' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 hover:bg-slate-800 rounded-lg text-slate-500"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Жерлерді іздеу..."
              className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-300">Сервер: Live</span>
            </div>
            <button className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors">
              <Star size={20} className="text-yellow-500" />
            </button>
          </div>
        </header>

        {/* CONTENT SWITCHER */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {activeTab === 'home' && (
            <div className="space-y-12">
              <section className="relative h-[400px] rounded-3xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-10 left-10 max-w-2xl">
                  <div className="flex items-center gap-2 text-blue-400 mb-4">
                    <Sparkles size={20} />
                    <span className="uppercase tracking-widest text-sm font-bold">Жаңа бағытты аш</span>
                  </div>
                  <h1 className="text-5xl font-black mb-6 leading-tight">Шығыс Қазақстанның <br/>таңғажайып табиғаты</h1>
                  <button 
                    onClick={() => setActiveTab('explore')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all"
                  >
                    Саяхатты бастау <ChevronRight size={20} />
                  </button>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all">
                  <Plane className="text-blue-500 mb-4" size={32} />
                  <h3 className="text-xl font-bold mb-2">Ыңғайлы Турлар</h3>
                  <p className="text-slate-400 text-sm">Барлық бағыттар бойынша дайын маршруттар мен гидтер қызметі.</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all">
                  <Camera className="text-emerald-500 mb-4" size={32} />
                  <h3 className="text-xl font-bold mb-2">Фото-Локациялар</h3>
                  <p className="text-slate-400 text-sm">Ең әдемі суреттер мен видеолар түсіретін жасырын нүктелер.</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 hover:border-purple-500/50 transition-all">
                  <Award className="text-purple-500 mb-4" size={32} />
                  <h3 className="text-xl font-bold mb-2">Үздік қонақ үйлер</h3>
                  <p className="text-slate-400 text-sm">Саяхатшылардың пікірі бойынша ең жоғары рейтингті демалыс орындары.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlaces.map((place) => (
                <div 
                  key={place.id}
                  className="bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 group hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 cursor-pointer"
                  onClick={() => setSelectedPlace(place)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={place.image} 
                      alt={place.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.9
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase mb-2">
                      <MapPin size={14} /> {place.location || 'ШҚО'}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{place.name}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">{place.desc}</p>
                    <div className="flex gap-2">
                      {place.hotels?.slice(0, 2).map((h, i) => (
                        <span key={i} className="text-[10px] bg-slate-800 px-2 py-1 rounded-lg text-slate-300">🏨 {h}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-6 bg-slate-800/50 border-b border-slate-700 flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Llama 3.3 Turbo Ассистент</h3>
                  <p className="text-xs text-green-400 font-medium tracking-wide">Желіде • Саяхат бойынша кеңесші</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-3xl ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 p-4 rounded-3xl rounded-tl-none border border-slate-700">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-6 bg-slate-800/30 border-t border-slate-700">
                <div className="flex gap-4">
                  <input 
                    id="chat-input"
                    type="text"
                    placeholder="Сұрақ қойыңыз (мысалы: Рахман қайнарына қалай баруға болады?)"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleChat}
                  />
                  <button 
                    onClick={handleChat}
                    className="bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20"
                  >
                    <Send size={24} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL (PLACE DETAILS) */}
        {selectedPlace && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 w-full max-w-5xl rounded-[3rem] border border-slate-800 overflow-hidden flex h-[600px] shadow-3xl">
              <div className="w-1/2 relative">
                <img src={selectedPlace.image} className="w-full h-full object-cover" alt={selectedPlace.name} />
                <button 
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-6 left-6 bg-slate-950/50 p-3 rounded-full hover:bg-slate-950 transition-all"
                >
                  <ChevronRight className="rotate-180" size={24} />
                </button>
              </div>
              <div className="w-1/2 p-12 overflow-y-auto">
                <div className="flex items-center gap-2 text-blue-400 font-bold mb-4 uppercase tracking-widest text-xs">
                  <MapPin size={16} /> {selectedPlace.location || 'Шығыс Қазақстан'}
                </div>
                <h2 className="text-4xl font-black mb-6">{selectedPlace.name}</h2>
                <p className="text-slate-400 leading-loose mb-8">{selectedPlace.desc}</p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 font-bold mb-3 text-slate-200 uppercase text-xs tracking-widest">
                      <Star size={14} className="text-yellow-500" /> Танымал орындар
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlace.hotels?.map((h, i) => (
                        <span key={i} className="bg-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300 border border-slate-700">{h}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 font-bold mb-3 text-slate-200 uppercase text-xs tracking-widest">
                      <Info size={14} className="text-blue-500" /> Турлар
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlace.tours?.map((t, i) => (
                        <span key={i} className="bg-blue-900/20 px-4 py-2 rounded-xl text-xs text-blue-300 border border-blue-800/50">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => { setSelectedPlace(null); setActiveTab('chat'); }}
                  className="w-full mt-10 bg-slate-100 text-slate-950 py-4 rounded-2xl font-bold hover:bg-white transition-all shadow-xl"
                >
                  ИИ-ден толығырақ сұрау
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
