
import React, { useState, useEffect } from 'react';

const SnowflakeIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${active ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]' : 'text-slate-400 opacity-70'}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="20" y1="12" x2="4" y2="12" />
    <polyline points="10 4 12 6 14 4" />
    <polyline points="10 20 12 18 14 20" />
    <polyline points="20 10 18 12 20 14" />
    <polyline points="4 10 6 12 4 14" />
    <line x1="19" y1="5" x2="5" y2="19" />
    <line x1="19" y1="19" x2="5" y2="5" />
  </svg>
);

const TreeIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${active ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'text-slate-400 opacity-70'}`} fill="currentColor">
    <path d="M12 2L4.5 13H6.5L3 18H21L17.5 13H19.5L12 2Z" />
    <rect x="10" y="18" width="4" height="4" fill="#3E2723" />
  </svg>
);

const GiftIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${active ? 'text-rose-400 drop-shadow-[0_0_6px_rgba(251,113,133,0.8)]' : 'text-slate-400 opacity-70'}`} fill="currentColor">
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <rect x="2" y="4" width="20" height="4" rx="1" />
    <rect x="11" y="4" width="2" height="17" fill="white" fillOpacity="0.3" />
    <path d="M12 4C12 4 12 1 10 1C8 1 8 4 12 4Z" />
    <path d="M12 4C12 4 12 1 14 1C16 1 16 4 12 4Z" />
  </svg>
);

const MailIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className={`w-5 h-5 ${active ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'text-slate-400 opacity-70'}`} fill="currentColor">
    <path d="M3 8L12 13L21 8V19H3V8Z" />
    <path d="M21 5H3L12 10L21 5Z" />
  </svg>
);

const MobileNav: React.FC = () => {
  const [activeId, setActiveId] = useState('hero');

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if ('vibrate' in navigator) navigator.vibrate(10);
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const sections = ['hero', 'tree', 'gifts', 'letter'];
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: 'hero', component: SnowflakeIcon, label: 'HOME' },
    { id: 'tree', component: TreeIcon, label: 'DECOR' },
    { id: 'gifts', component: GiftIcon, label: 'GIFTS' },
    { id: 'letter', component: MailIcon, label: 'SANTA' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-[280px]">
      <div className="relative bg-[#050a14]/70 backdrop-blur-2xl border border-white/20 rounded-full py-2 px-2 flex justify-between items-center shadow-[0_15px_30px_-5px_rgba(0,0,0,0.8)]">
        
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          const IconComponent = item.component;
          
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative z-10 flex flex-col items-center justify-center flex-1 py-1 outline-none group rounded-full transition-all ${isActive ? 'bg-white/10' : ''}`}
            >
              <div className={isActive ? 'opacity-100 scale-105' : 'opacity-70 group-hover:opacity-90'}>
                <IconComponent active={isActive} />
              </div>
              
              <span className={`text-[7.5px] tracking-[0.1em] font-black mt-0.5 transition-opacity ${
                isActive ? 'text-white opacity-100' : 'text-white/20 opacity-0 group-hover:opacity-50'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Subtle floor glow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-3 bg-white/5 blur-xl rounded-full pointer-events-none"></div>
    </nav>
  );
};

export default MobileNav;
