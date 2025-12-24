
import React, { useState } from 'react';

interface GiftBoxProps {
  color: string;
  ribbonColor: string;
  message: string;
}

const GiftBox: React.FC<GiftBoxProps> = ({ color, ribbonColor, message }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setIsOpen(true);
        setShowConfetti(true);
        
        const audio = new Audio('musics/gift_open.mp3');
        audio.volume = 0.4;
        audio.play().catch(() => {});
        
        setTimeout(() => setShowConfetti(false), 3000);
      }, 150);
    } else {
      setIsOpen(false);
    }
    if ('vibrate' in navigator) navigator.vibrate([30, 20, 30]);
  };

  return (
    <div 
      className={`relative w-40 h-40 cursor-pointer group perspective-1000 transition-all duration-300
        ${isShaking ? 'animate-shake' : 'active:scale-95'}`}
      onClick={handleOpen}
    >
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-2 h-2 rounded-sm animate-confetti"
              style={{
                backgroundColor: ['#FFD700', '#FF5252', '#4CAF50', '#FFFFFF', '#FFEB3B', '#00E5FF'][i % 6],
                left: '50%',
                top: '50%',
                '--tx': `${(Math.random() - 0.5) * 240}px`,
                '--ty': `${-Math.random() * 180 - 60}px`,
                '--rot': `${Math.random() * 1080}deg`,
                animationDelay: `${Math.random() * 0.15}s`
              } as any}
            />
          ))}
        </div>
      )}

      <div className={`relative w-full h-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu 
        ${isOpen ? 'translate-y-1 scale-100' : 'hover:scale-105'}
        ${!isOpen ? 'hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]' : ''}
      `}>
        <div 
          className={`absolute top-0 left-0 w-full h-12 z-40 transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) 
            ${isOpen ? '-translate-y-48 -rotate-[120deg] opacity-0 scale-150 blur-[1px]' : 'translate-y-0 rotate-0 opacity-100'}`}
          style={{ backgroundColor: color, filter: 'brightness(1.2)' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-full shadow-sm" style={{ backgroundColor: ribbonColor }}></div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-5 shadow-sm" style={{ backgroundColor: ribbonColor }}></div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-end justify-center">
            <div className="w-8 h-8 rounded-full border-[6px] rotate-[35deg] -mr-1 shadow-md" style={{ borderColor: ribbonColor }}></div>
            <div className="w-8 h-8 rounded-full border-[6px] -rotate-[35deg] -ml-1 shadow-md" style={{ borderColor: ribbonColor }}></div>
          </div>
          <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-black/40 blur-[2px]"></div>
        </div>

        <div 
          className={`absolute bottom-0 left-0 w-full overflow-hidden shadow-2xl transition-all duration-700 rounded-b-2xl border-t-2 border-white/20
            ${isOpen ? 'ring-4 ring-white/30 brightness-110 h-[170px] -translate-y-6 shadow-[0_25px_50px_rgba(0,0,0,0.7)]' : 'h-32 translate-y-0'}`}
          style={{ backgroundColor: color }}
        >
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-6 h-full transition-opacity duration-500 ${isOpen ? 'opacity-10' : 'opacity-90'}`} style={{ backgroundColor: ribbonColor }}></div>
          {isOpen && <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent animate-pulse pointer-events-none z-0"></div>}
          <div className={`absolute inset-0 flex flex-col items-center justify-start px-3 pt-6 pb-2 text-center transition-all duration-1000 delay-200 z-10
            ${isOpen ? 'opacity-100 translate-y-0 scale-100 bg-black/10' : 'opacity-0 translate-y-10 scale-50'}`}>
            <span className="text-[9px] text-yellow-400 uppercase tracking-[0.5em] font-black mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">WISH</span>
            <div className="flex-1 flex items-center justify-center w-full px-1 overflow-visible">
              <p className="text-yellow-50 text-lg leading-[1.2] festive-font font-bold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] animate-pop-and-fade max-h-full">{message}</p>
            </div>
            <div className={`mt-2 w-10 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent rounded-full transition-all duration-700 ${isOpen ? 'scale-x-100' : 'scale-x-0'}`}></div>
          </div>
        </div>
      </div>
      
      <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/60 blur-2xl rounded-full transition-all duration-700
        ${isOpen ? 'opacity-10 scale-[2]' : 'opacity-80 scale-100'}`}></div>

      {!isOpen && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-[10px] uppercase tracking-[0.6em] font-black transition-all group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-bounce-slow whitespace-nowrap z-50">Tap to Open</div>
      )}

      <style>{`
        @keyframes confetti {
          0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
          20% { transform: translate(calc(var(--tx) * 0.2), calc(var(--ty) * 0.2)) scale(1.4) rotate(120deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0); opacity: 0; }
        }
        .animate-confetti { animation: confetti 2s cubic-bezier(0.1, 0.7, 0.1, 1) forwards; }
        @keyframes pop-and-fade {
          from { opacity: 0; transform: scale(0.8) translateY(10px); filter: blur(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .animate-pop-and-fade { animation: pop-and-fade 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        .animate-shake { animation: shake 0.15s ease-in-out infinite; }
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, 0); opacity: 0.5; }
          50% { transform: translate(-50%, -5px); opacity: 1; }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default GiftBox;
