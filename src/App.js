import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Home, Sparkles, Compass, Send, Trash2, Zap, AlertCircle } from 'lucide-react';

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
  const abortControllerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isAiLoading, scrollToBottom]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const handleChat = async () => {
    const sanitizedInput = input.trim();
    if (!sanitizedInput || isAiLoading) return;

    // Prevent duplicate user messages if the last message is identical
    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].content === sanitizedInput) {
        if (chatHistory[chatHistory.length - 1].role === 'user') return;
    }

    const userMessage = { role: 'user', content: sanitizedInput };
    const updatedHistory = [...chatHistory, userMessage];

    setError(null);
    setChatHistory(updatedHistory);
    setInput("");
    setIsAiLoading(true);

    // Request Cancellation Logic
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await axios.post(
        `${API_CONFIG.baseURL}/api/chat`,
        { history: updatedHistory },
        { 
          timeout: API_CONFIG.timeout,
          signal: abortControllerRef.current.signal,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const aiResponse = response.data.response;
      if (!aiResponse) throw new Error("Invalid response format");

      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      if (axios.isCancel(err)) return;
      
      const errorMessage = err.response?.data?.detail || "Network error. Please try again later.";
      setError(errorMessage);
      // Remove the failed user message from history to keep it synced
      setChatHistory(prev => prev.slice(0, -1));
      setInput(sanitizedInput); // Restore input for retry
    } finally {
      setIsAiLoading(false);
      abortControllerRef.current = null;
    }
  };

  const clearChat = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your travel history?")) {
      setChatHistory([]);
      setError(null);
    }
  }, []);

  const suggests = useMemo(() => [
    '🏔 Weekend in Almaty', '💰 Budget trip', '🌲 Mountains', '❄ Winter trip'
  ], []);

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden font-sans">
      <aside className="w-72 bg-slate-900/50 border-r border-white/5 backdrop-blur-xl p-6 flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Compass className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter italic">VKO PRO</span>
        </div>
        <nav className="flex-1 space-y-2">
          {['home', 'planner'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === tab ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}
            >
              {tab === 'home' ? <Home size={20}/> : <Sparkles size={20}/>}
              <b className="capitalize">{tab === 'home' ? 'Басты бет' : 'AI Planner'}</b>
            </button>
          ))}
        </nav>
        <div className="p-4 bg-white/5 rounded-3xl text-[10px] text-slate-500 font-bold text-center italic uppercase">
          Developed by Bekzhan
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_#020617_100%)]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 backdrop-blur-md z-10">
          <h2 className="text-xl font-black tracking-tight uppercase">🤖 AI Trip Planner</h2>
          <button 
            onClick={clearChat} 
            disabled={chatHistory.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-bold disabled:opacity-30"
          >
            <Trash2 size={16}/> Clear Chat
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-6">
          {chatHistory.length === 0 && !isAiLoading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Zap size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">Where in Kazakhstan would you like to go?</p>
            </div>
          )}

          {chatHistory.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
              <div className={`max-w-[75%] p-6 rounded-[2rem] shadow-2xl ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-900 border border-white/10 rounded-tl-none'}`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
              </div>
            </div>
          )}

          {isAiLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-white/10 p-6 rounded-[2rem] rounded-tl-none w-[60%] space-y-3 animate-pulse">
                <div className="h-2 bg-slate-800 rounded w-full"></div>
                <div className="h-2 bg-slate-800 rounded w-5/6"></div>
                <div className="h-2 bg-slate-800 rounded w-4/6"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <footer className="p-10 pt-0">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
            {suggests.map(btn => (
              <button 
                key={btn} 
                onClick={() => setInput(btn)} 
                disabled={isAiLoading}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold hover:bg-blue-600 transition-all whitespace-nowrap disabled:opacity-50"
              >
                {btn}
              </button>
            ))}
          </div>
          <div className={`bg-slate-900 border border-white/10 p-2 rounded-[2.5rem] flex items-center shadow-2xl transition-all ${isAiLoading ? 'opacity-50' : 'focus-within:ring-2 ring-blue-500/50'}`}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChat()}
              disabled={isAiLoading}
              className="flex-1 bg-transparent px-6 py-4 outline-none text-sm disabled:cursor-not-allowed"
              placeholder={isAiLoading ? "AI is thinking..." : "Ask about a destination, budget, or itinerary..."}
            />
            <button 
              onClick={handleChat} 
              disabled={isAiLoading || !input.trim()} 
              className="bg-blue-600 p-4 rounded-[2rem] hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg"
            >
              <Send size={20}/>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
