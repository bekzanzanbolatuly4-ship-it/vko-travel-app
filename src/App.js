import React, { useState } from 'react';
import axios from 'axios';
import { Home, Sparkles, MapPin, Send, Trash2 } from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com"; // Өз сілтемеңді қой

export default function App() {
  const [tab, setTab] = useState('home');
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const newChat = [...chat, { role: 'user', content: input }];
    setChat(newChat); setInput(""); setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/chat`, { history: newChat });
      setChat([...newChat, { role: 'assistant', content: res.data.response }]);
    } catch (e) { alert("Қате! Бэкенд қосулы ма?"); }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans">
      {/* Sidebar */}
      <nav className="w-64 bg-slate-900/50 p-6 border-r border-white/5 space-y-4">
        <h1 className="text-2xl font-black italic text-blue-500 mb-10">VKO PRO</h1>
        <button onClick={() => setTab('home')} className={`w-full flex gap-3 p-4 rounded-xl ${tab === 'home' ? 'bg-blue-600' : 'hover:bg-white/5'}`}><Home/> Басты бет</button>
        <button onClick={() => setTab('ai')} className={`w-full flex gap-3 p-4 rounded-xl ${tab === 'ai' ? 'bg-blue-600' : 'hover:bg-white/5'}`}><Sparkles/> AI Гид</button>
        <button onClick={() => setTab('places')} className={`w-full flex gap-3 p-4 rounded-xl ${tab === 'places' ? 'bg-blue-600' : 'hover:bg-white/5'}`}><MapPin/> Орындар</button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {tab === 'home' && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="relative h-96 rounded-[3rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=1200" className="absolute w-full h-full object-cover opacity-50" alt="Nature"/>
              <div className="relative p-12"><h2 className="text-6xl font-black italic uppercase">Шығыс <br/> Қазақстан</h2></div>
            </div>
          </div>
        )}

        {tab === 'ai' && (
          <div className="bg-slate-900/80 rounded-[2.5rem] h-[80vh] flex flex-col overflow-hidden border border-white/10 shadow-2xl">
            <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl max-w-[80%] whitespace-pre-wrap ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-800'}`}>{m.content}</div>
                </div>
              ))}
              {loading && <p className="text-blue-500 animate-pulse text-xs">AI жауап дайындап жатыр...</p>}
            </div>
            <div className="p-6 bg-black/20 flex gap-4">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Қайда барамыз?" className="flex-1 bg-slate-800 p-4 rounded-2xl outline-none border border-white/5"/>
              <button onClick={send} className="bg-blue-600 p-4 rounded-2xl hover:bg-blue-500"><Send/></button>
              <button onClick={() => setChat([])} className="p-4 bg-red-600/20 text-red-500 rounded-2xl"><Trash2/></button>
            </div>
          </div>
        )}

        {tab === 'places' && (
          <div className="grid grid-cols-2 gap-6 animate-in zoom-in duration-500">
            {['Катонқарағай', 'Марқакөл', 'Рахман қайнары', 'Шарын'].map(p => (
              <div key={p} className="h-60 bg-slate-800 rounded-[2rem] p-8 relative overflow-hidden group">
                <img src={`https://source.unsplash.com/400x300/?${p},nature`} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform" alt={p}/>
                <h3 className="relative text-2xl font-black italic uppercase">{p}</h3>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
