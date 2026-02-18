import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Home, Sparkles, MapPin, Calculator, Send, Trash2, Menu, X } from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

// ТЕСТ ҮШІН 5 ОРЫН (Егер бұл шықса, қалғанын қосамыз)
const DESTINATIONS = [
  { id: 1, name: "Belukha Peak", cat: "Mountains", reg: "VKO", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", rate: 5.0 },
  { id: 2, name: "Markakol Lake", cat: "Lakes", reg: "VKO", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800", rate: 4.8 },
  { id: 3, name: "Charyn Canyon", cat: "Nature", reg: "Almaty", img: "https://images.unsplash.com/photo-1627564175317-0c9f80721798?w=800", rate: 4.9 },
  { id: 4, name: "Kaindy Lake", cat: "Lakes", reg: "Almaty", img: "https://images.unsplash.com/photo-1589133481730-899f81a17950?w=800", rate: 4.7 },
  { id: 5, name: "Rakhman Springs", cat: "Resort", reg: "VKO", img: "https://images.unsplash.com/photo-1544120190-27950f1f5c61?w=800", rate: 4.6 }
];

export default function App() {
  const [tab, setTab] = useState('home');
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
      setChat([...newHistory, { role: 'assistant', content: "Қате: Сервер жауап бермейді." }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <nav className="flex gap-4 mb-8 bg-slate-800 p-4 rounded-xl overflow-x-auto">
        <button onClick={() => setTab('home')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg">Басты бет</button>
        <button onClick={() => setTab('dest')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg">Орындар</button>
        <button onClick={() => setTab('ai')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg">ИИ Чат</button>
      </nav>

      {tab === 'home' && <h1 className="text-4xl font-bold">Шығыс Қазақстанға қош келдіңіз!</h1>}

      {tab === 'dest' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DESTINATIONS.map(d => (
            <div key={d.id} className="bg-slate-800 p-4 rounded-2xl">
              <img src={d.img} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h3 className="text-xl font-bold">{d.name}</h3>
              <p className="text-blue-400">{d.cat}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'ai' && (
        <div className="max-w-xl mx-auto bg-slate-800 rounded-2xl p-6 h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {chat.map((m, i) => <div key={i} className={`p-3 rounded-xl ${m.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-slate-700'} max-w-[80%]`}>{m.content}</div>)}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 bg-slate-700 p-3 rounded-xl outline-none" placeholder="Сұрақ жазыңыз..." />
            <button onClick={handleSend} className="bg-blue-600 p-3 rounded-xl">{loading ? "..." : "Жіберу"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
