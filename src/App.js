import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Star, Hotel, Utensils, MessageSquare, Layers, Menu, ChevronLeft, Send, Sparkles, MapPin, Award } from 'lucide-react';
import { load } from '@2gis/mapgl';

const App = () => {
  const [lang, setLang] = useState('kz');
  const [activeTab, setActiveTab] = useState('welcome');
  const [places, setPlaces] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [mapMode, setMapMode] = useState('c05f771b-3f00-48e3-8515-2f63e6918f52');
  
  const mapInstance = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    axios.get('https://vko-travel-app.onrender.com/')
      .then(res => setPlaces(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPlaces([]));
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, isAiLoading]);

  // КАРТА ЛОГИКАСЫ
  useEffect(() => {
    if (activeTab === 'map') {
      const initMap = async () => {
        const container = document.getElementById('map-container');
        if (!container || mapInstance.current) return;
        const mapgl = await load();
        mapInstance.current = new mapgl.Map('map-container', {
          center: [82.61, 49.95], 
          zoom: 12, 
          pitch: 45,
          key: '73ad6843-cc94-45d4-8e38-51d1ac9a92d8', 
          style: mapMode
        });
        new mapgl.ZoomControl(mapInstance.current, { position: 'topRight' });
        places.forEach(p => {
          if(p.lon) new mapgl.Marker(mapInstance.current, { coordinates: [p.lon, p.lat], label: { text: p.name } });
        });
      };
      setTimeout(initMap, 300);
    } else if (mapInstance.current) {
      mapInstance.current.destroy();
      mapInstance.current = null;
    }
  }, [activeTab, mapMode, places]);

  const handleChat = async (e) => {
    const input = document.getElementById('chat-input');
    if ((e.key === 'Enter' || e.type === 'click') && input.value.trim()) {
      const msg = input.value;
      setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
      input.value = '';
      setIsAiLoading(true);
      try {
        const res = await axios.post('https://vko-travel-app.onrender.com/', { message: msg, lang: lang });
        setChatHistory(prev => [...prev, { role: 'ai', text: res.data.reply }]);
      } catch {
        setChatHistory(prev => [...prev, { role: 'ai', text: "Байланыс үзілді..." }]);
      } finally { setIsAiLoading(false); }
    }
  };

  const t = {
    kz: { name: "VKO TRAVEL", creator: "Жанболатұлы Бекжан", slogan: "Шығыс маржанына саяхат", desc: "Алтайдың асқақ таулары мен Марқакөлдің мөлдір суын бізбен бірге ашыңыз.", home: "Басты бет", map: "Карта", places: "Көрікті жерлер", tours: "Турлар", hotels: "Отельдер", food: "Мейрамханалар", chat: "AI Ассистент", btn: "Бастау", ask: "Сұрақ қойыңыз..." },
    ru: { name: "VKO TRAVEL", creator: "Жанболатұлы Бекжан", slogan: "Жемчужина Востока", desc: "Откройте величие Алтая и кристальные воды Маркаколя вместе с нами.", home: "Главная", map: "Карта", places: "Места", tours: "Туры", hotels: "Отели", food: "Рестораны", chat: "AI Гид", btn: "Начать", ask: "Задайте вопрос..." },
    en: { name: "VKO TRAVEL", creator: "Zhanbolatuly Bekzhan", slogan: "Pearl of the East", desc: "Discover the majesty of Altai and the crystal waters of Markakol.", home: "Home", map: "Map", places: "Sightseeing", tours: "Tours", hotels: "Hotels", food: "Restaurants", chat: "AI Assistant", btn: "Explore", ask: "Ask anything..." }
  }[lang];

  return (
    <div style={layoutStyle}>
      {/* SIDEBAR */}
      <motion.aside animate={{ width: isSidebarOpen ? '280px' : '0px' }} style={sidebarStyle}>
        <div style={{ padding: '30px', width: '280px', opacity: isSidebarOpen ? 1 : 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={logoContainer}><Sparkles color="#38bdf8" size={24} /><h1 style={logoText}>{t.name}</h1></div>
          
          <div style={langSwitcher}>
            {['kz', 'ru', 'en'].map(l => <button key={l} onClick={() => setLang(l)} style={langBtn(lang === l)}>{l.toUpperCase()}</button>)}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <NavBtn label={t.home} icon={Home} act={activeTab === 'welcome'} onClick={() => setActiveTab('welcome')} />
            <NavBtn label={t.map} icon={Layers} act={activeTab === 'map'} onClick={() => setActiveTab('map')} />
            <NavBtn label={t.places} icon={Star} act={activeTab === 'places'} onClick={() => setActiveTab('places')} />
            <NavBtn label={t.tours} icon={Compass} act={activeTab === 'tours'} onClick={() => setActiveTab('tours')} />
            <NavBtn label={t.hotels} icon={Hotel} act={activeTab === 'hotels'} onClick={() => setActiveTab('hotels')} />
            <NavBtn label={t.food} icon={Utensils} act={activeTab === 'food'} onClick={() => setActiveTab('food')} />
            <NavBtn label={t.chat} icon={MessageSquare} act={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          </nav>

          {/* CREATOR SIGNATURE */}
          <div style={creatorBox}>
            <Award size={16} color="#38bdf8" />
            <span>by {t.creator}</span>
          </div>
        </div>
      </motion.aside>

      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={toggleBtn}>
        {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>

      <main style={{ ...mainContent, marginLeft: isSidebarOpen ? '280px' : '0px' }}>
        <AnimatePresence mode="wait">
          
          {activeTab === 'welcome' && (
            <motion.div key="w" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={heroSection}>
              <div style={heroOverlay}></div>
              <div style={heroContent}>
                <h2 style={heroTitle}>{t.slogan}</h2>
                <p style={heroDesc}>{t.desc}</p>
                <button onClick={() => setActiveTab('places')} style={heroPrimaryBtn}>{t.btn}</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
            <div key="m" style={{ height: '100%' }}>
              <div style={mapControls}>
                <button onClick={() => setMapMode('c05f771b-3f00-48e3-8515-2f63e6918f52')} style={modeBtn}>3D Mode</button>
                <button onClick={() => setMapMode('sputnik')} style={modeBtn}>Satellite</button>
              </div>
              <div id="map-container" style={mapStyles}></div>
            </div>
          )}

          {activeTab === 'chat' && (
            <motion.div key="c" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={aiContainer}>
              <div style={aiHeader}><div style={aiStatus}></div><h3>{t.chat} (Llama 3.3 Turbo)</h3></div>
              <div style={chatBody}>
                {chatHistory.map((m, i) => <div key={i} style={m.role === 'user' ? userMsg : aiMsg}>{m.text}</div>)}
                {isAiLoading && (
                  <motion.div style={aiMsg} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <div style={{display:'flex', gap:'5px'}}>
                        <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                        Ойланып жатыр...
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={inputArea}>
                <input id="chat-input" onKeyDown={handleChat} placeholder={t.ask} style={aiInput} />
                <button onClick={handleChat} style={sendBtn}><Send size={20} /></button>
              </div>
            </motion.div>
          )}

          {['places', 'tours', 'hotels', 'food'].includes(activeTab) && (
            <div style={gridStyle}>
              {places.map(p => (
                <motion.div whileHover={{ y: -10 }} key={p.id} style={cardStyle}>
                  <img src={p.image} style={cardImg} alt="" />
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ color: '#38bdf8', marginBottom: '10px' }}>{p.name}</h3>
                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                        {activeTab === 'food' ? p.restaurants?.join(', ') : 
                         activeTab === 'hotels' ? p.hotels?.join(', ') : 
                         activeTab === 'tours' ? p.tours?.join(' → ') : p.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

// --- STYLES (КӨШІРУГЕ ЫҢҒАЙЛЫ) ---
const layoutStyle = { display: 'flex', minHeight: '100vh', background: '#050a15', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' };
const sidebarStyle = { background: '#0a0f1d', borderRight: '1px solid rgba(56, 189, 248, 0.1)', position: 'fixed', height: '100vh', zIndex: 100, overflow: 'hidden' };
const logoContainer = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' };
const logoText = { fontSize: '22px', fontWeight: '900', color: '#fff' };
const langSwitcher = { display: 'flex', gap: '5px', marginBottom: '25px', background: '#161d2f', padding: '5px', borderRadius: '12px' };
const langBtn = (act) => ({ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: act ? '#38bdf8' : 'transparent', color: act ? '#000' : '#94a3b8', fontWeight: 'bold', fontSize: '11px' });
const toggleBtn = { position: 'fixed', top: '25px', left: '20px', zIndex: 1001, background: '#38bdf8', border: 'none', borderRadius: '12px', width: '40px', height: '40px', cursor: 'pointer', color: '#000' };
const creatorBox = { marginTop: '20px', padding: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' };
const mainContent = { flex: 1, padding: '40px', transition: '0.3s' };
const heroSection = { height: '85vh', borderRadius: '40px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', background: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80") center/cover' };
const heroOverlay = { position: 'absolute', inset: 0, background: 'rgba(5, 10, 21, 0.75)' };
const heroContent = { position: 'relative', zIndex: 1, maxWidth: '800px', padding: '0 20px' };
const heroTitle = { fontSize: '56px', fontWeight: '900', color: '#fff', marginBottom: '20px' };
const heroDesc = { fontSize: '18px', color: '#cbd5e1', marginBottom: '30px' };
const heroPrimaryBtn = { padding: '15px 40px', background: '#38bdf8', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' };
const aiContainer = { background: '#0a0f1d', height: '85vh', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const aiHeader = { padding: '20px', background: 'rgba(56, 189, 248, 0.05)', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' };
const aiStatus = { width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' };
const chatBody = { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' };
const userMsg = { alignSelf: 'flex-end', background: '#38bdf8', color: '#000', padding: '12px 20px', borderRadius: '20px 20px 0 20px', maxWidth: '75%', fontWeight: '500' };
const aiMsg = { alignSelf: 'flex-start', background: '#161d2f', color: '#e2e8f0', padding: '15px 25px', borderRadius: '20px 20px 20px 0', maxWidth: '85%', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'pre-wrap', lineHeight: '1.6' };
const inputArea = { padding: '20px', display: 'flex', gap: '10px', background: '#0a0f1d' };
const aiInput = { flex: 1, background: '#161d2f', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '15px', padding: '15px', color: '#fff', outline: 'none' };
const sendBtn = { width: '55px', background: '#38bdf8', border: 'none', borderRadius: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' };
const mapStyles = { width: '100%', height: '85vh', borderRadius: '30px', border: '1px solid #38bdf8' };
const mapControls = { marginBottom: '10px', display: 'flex', gap: '10px' };
const modeBtn = { padding: '8px 18px', background: '#0a0f1d', color: '#fff', border: '1px solid #38bdf8', borderRadius: '10px', cursor: 'pointer', fontSize: '12px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' };
const cardStyle = { background: '#0a0f1d', borderRadius: '25px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' };
const cardImg = { width: '100%', height: '220px', objectFit: 'cover' };

const NavBtn = ({ label, icon: Icon, act, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', background: act ? 'rgba(56, 189, 248, 0.15)' : 'transparent', color: act ? '#38bdf8' : '#64748b', transition: '0.2s' }}>
    <Icon size={18} /> <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{label}</span>
  </div>
);

export default App;


