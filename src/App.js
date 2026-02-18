import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Home, Sparkles, Compass, Send, Trash2, Zap, AlertCircle, MapPin, Globe } from 'lucide-react';

const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || "https://vko-travel-app.onrender.com",
  timeout: 35000,
};

const App = () => {
  const [activeTab, setActiveTab] = useState('planner');
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isAiLoading]);

  const handleChat = async () => {
    const text = input.trim();
    if (!text || isAiLoading) return;

    setError(null);
    const newHistory = [...chatHistory, { role: 'user', content: text }];
    setChatHistory(newHistory);
    setInput("");
    setIsAiLoading(true);

    try {
      const response = await axios.post(`${API_CONFIG.baseURL}/api/chat`, 
        { history: newHistory },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setChatHistory(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (err) {
      setError("Байланыс үзілді. Серверді тексеріңіз немесе қайта байқап көріңіз.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] text-slate-200 overflow-hidden font-sans relative">
      
      {/* АНИМАЦИЯЛЫҚ ФОН (ART) */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-bounce"></div>
      </div>

      {/* SIDEBAR */}
      <aside className="w-20 md:w-72 bg-slate-900/40 border-r border-white/5 backdrop-blur-2xl p-6 flex flex-col z-20">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
            <Globe className="text-white animate-spin-slow" size={24} />
          </div>
          <span className="hidden md:block font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">VKO PRO</span>
        </div>
        
        <nav className="flex-1 space-y-3">
          {[
            { id: 'home', icon: Home, label: 'Басты бет' },
            { id: 'planner', icon: Sparkles, label: 'AI Planner' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-1' : 'hover:bg-white/5 text-slate-400'}`}
            >
              <tab.icon size={20} />
              <b className="hidden md:block text-sm">{tab.label}</b>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-2xl border border-blue-500/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 italic">By Bekzhan</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <h2 className="text-sm font-bold tracking-widest uppercase opacity-70">AI Expedition Guide</h2>
          </div>
          <button onClick={() => setChatHistory([])} className="p-2 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all">
            <Trash2 size={20}/>
          </button>
        </header>

        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scrollbar-hide">
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40">
              <Compass size={80} strokeWidth={1} className="text-blue-500 animate-spin-slow" />
              <h3 className="text-xl font-light tracking-[0.2em] uppercase">Саяхатқа дайынсыз ба?</h3>
            </div>
          )}

          {chatHistory.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[85%] md:max-w-[70%] p-6 rounded-[2.5rem] ${
                m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-2xl shadow-blue-600/20' 
                : 'bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-tl-none'
              }`}>
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}

          {isAiLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] rounded-tl-none w-2/3 space-y-4">
                <div className="h-2 bg-blue-500/20 rounded w-full"></div>
                <div className="h-2 bg-blue-500/20 rounded w-5/6"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-500/20 border border-red-500/50 px-6 py-2 rounded-full text-red-400 text-xs flex items-center gap-2 backdrop-blur-xl animate-bounce">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* INPUT AREA */}
        <footer className="p-6 md:p-10">
          <div className="max-w-4xl mx-auto flex gap-4 bg-slate-900/80 border border-white/10 p-3 rounded-[3rem] backdrop-blur-2xl shadow-2xl focus-within:border-blue-500/50 transition-all">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChat()}
              className="flex-1 bg-transparent px-6 py-3 outline-none text-sm md:text-base"
              placeholder="Қазақстанның қай жеріне барғыңыз келеді?"
            />
            <button 
              onClick={handleChat}
              disabled={isAiLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 p-4 rounded-full transition-all shadow-lg active:scale-95"
            >
              <Send size={20} className="text-white" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
