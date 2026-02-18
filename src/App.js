import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Home, Star, MessageSquare, ChevronLeft, Menu, 
  Send, Sparkles, Award, MapPin, Search, Compass 
} from 'lucide-react';

const API_URL = "https://vko-travel-app.onrender.com";

function App() {
  const [places, setPlaces] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const chatEndRef = useRef(null);

  // СЕРВЕРДЕН МӘЛІМЕТ АЛУ
  useEffect(() => {
    axios.get(`${API_URL}/api/places`)
      .then(res => setPlaces(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPlaces([]));
  }, []);

  // ЧАТТЫ ТӨМЕНГЕ ЖЫЛЖЫТУ
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

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
        setChatHistory(prev => [...prev, { role: 'ai', text: "Байланыс үзілді..." }]);
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Мұнда сенің Sidebar, Карта және барлық Дизайныңды сол қалпында қалдыр */}
      {/* Тек handleChat пен places айнымалыларын жоғарыдағыдай қолдансаң болды */}
      
      {/* МЫСАЛЫ: Суреттерді шығару */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-y-auto">
        {places.map((place, index) => (
          <div key={index} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all">
            <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg">{place.name}</h3>
              <p className="text-slate-400 text-sm mt-1">{place.description}</p>
              <div className="flex items-center mt-3 text-blue-400">
                <MapPin size={16} className="mr-1" />
                <span className="text-xs">{place.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
