import React, { useState, useRef } from 'react';

const ChristmasTree: React.FC = () => {
  const [litOrnaments, setLitOrnaments] = useState<Set<number>>(new Set());
  const [lastColor, setLastColor] = useState<string>('gold');
  const [shakingBellIndex, setShakingBellIndex] = useState<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const ornaments = [
    { cx: 100, cy: 150, color: '#FF5252', type: 'bauble' },
    { cx: 70, cy: 135, color: '#FFD700', type: 'snowflake' },
    { cx: 130, cy: 135, color: '#448AFF', type: 'bauble' },
    { cx: 100, cy: 105, color: '#E040FB', type: 'star' },
    { cx: 80, cy: 85, color: '#FFAB40', type: 'bauble' },
    { cx: 120, cy: 85, color: '#FFFFFF', type: 'snowflake' },
    { cx: 100, cy: 55, color: '#64FFDA', type: 'bauble' },
    { cx: 55, cy: 160, color: '#FFD700', type: 'bell' },
    { cx: 145, cy: 160, color: '#FFD700', type: 'bell' },
    { cx: 100, cy: 125, color: '#FFD700', type: 'bell' },
  ];

  const playSynthSound = (type: 'bauble' | 'bell' | 'star') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'bell') {
      // Bell synthesis: FM-like clang
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.8);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      
      // Add a subtle metallic overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2200, now);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      gain2.gain.setValueAtTime(0.1, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc2.start();
      osc2.stop(now + 0.4);

      osc.start();
      osc.stop(now + 0.8);
    } else if (type === 'star') {
      // Star synthesis: Shimmering sweep
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start();
      osc.stop(now + 0.4);
    } else {
      // Ornament synthesis: Clean pluck
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start();
      osc.stop(now + 0.15);
    }
  };

  const playSound = (type: 'bauble' | 'bell' | 'star') => {
    let file = 'musics/ornament_click.mp3';
    if (type === 'bell') file = 'musics/bell_ring.mp3';
    if (type === 'star') file = 'musics/star_magic.mp3';
    
    const audio = new Audio(file);
    audio.volume = 0.9;
    audio.play().catch(() => {
      // If file fails, use synthesis fallback
      playSynthSound(type);
    });
  };

  const toggleOrnament = (index: number) => {
    const orn = ornaments[index];
    const isBell = orn.type === 'bell';
    
    if (isBell) {
      setShakingBellIndex(index);
      setTimeout(() => setShakingBellIndex(null), 500);
      playSound('bell');
    } else {
      const next = new Set(litOrnaments);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      setLitOrnaments(next);
      setLastColor(orn.color);
      playSound('bauble');
    }
    
    if ('vibrate' in navigator) {
      isBell ? navigator.vibrate([30, 40, 30]) : navigator.vibrate(20);
    }
  };

  const isFullyDecorated = litOrnaments.size === ornaments.filter(o => o.type !== 'bell').length;

  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto flex items-center justify-center select-none">
      <div 
        className={`absolute inset-0 pointer-events-none rounded-full blur-[100px] transition-all duration-1000 ${litOrnaments.size > 0 ? 'opacity-30 scale-110' : 'opacity-0 scale-90'}`} 
        style={{ backgroundColor: isFullyDecorated ? 'gold' : lastColor }}
      ></div>

      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]">
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="gold" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="92" y="165" width="16" height="25" fill="#3E2723" rx="2" />
        <polygon points="100,20 25,175 175,175" fill="#0B3D0E" />
        <polygon points="100,35 40,150 160,150" fill="#134D16" />
        <polygon points="100,55 55,120 145,120" fill="#1B5E20" />
        <polygon points="100,75 70,100 130,100" fill="#2E7D32" />

        <path d="M60,155 Q100,145 140,155 M75,125 Q100,115 125,125 M85,95 Q100,85 115,95" fill="none" stroke="rgba(255,215,0,0.3)" strokeWidth="1.5" strokeDasharray="4,6" className="animate-pulse" />

        {[...Array(12)].map((_, i) => (
          <circle key={`light-${i}`} cx={50 + Math.random() * 100} cy={60 + Math.random() * 100} r="1" fill="white" className="animate-twinkle" style={{ animationDelay: `${Math.random() * 3}s` }} />
        ))}
        
        <g 
          className={`cursor-pointer transition-transform duration-500 ${isFullyDecorated ? 'animate-spin-slow' : ''}`}
          onClick={() => playSound('star')}
        >
          {isFullyDecorated && <circle cx="100" cy="22" r="25" fill="url(#starGlow)" className="animate-pulse" />}
          <path d="M100,5 L105,15 L116,15 L108,22 L111,33 L100,27 L89,33 L92,22 L84,15 L95,15 Z" fill="#FFD700" className={`${litOrnaments.size > 0 ? 'animate-pulse' : ''}`} style={{ filter: litOrnaments.size > 0 ? 'drop-shadow(0 0 8px gold)' : 'none' }} />
        </g>

        {ornaments.map((orn, i) => (
          <g key={i} onClick={() => toggleOrnament(i)} className={`cursor-pointer group ${shakingBellIndex === i ? 'animate-shake-bell' : ''}`} style={{ transformOrigin: `${orn.cx}px ${orn.cy - 5}px` }}>
            {(litOrnaments.has(i) || orn.type === 'bell') && (
              <circle cx={orn.cx} cy={orn.cy} r={orn.type === 'bell' ? 14 : 12} fill={orn.color} className={`opacity-20 blur-[6px] ${orn.type === 'bell' ? '' : 'animate-pulse'}`} />
            )}

            {orn.type === 'snowflake' ? (
              <path d={`M${orn.cx-5},${orn.cy} L${orn.cx+5},${orn.cy} M${orn.cx},${orn.cy-5} L${orn.cx},${orn.cy+5}`} stroke={orn.color} strokeWidth="2" className={`transition-all duration-300 ${litOrnaments.has(i) ? 'opacity-100' : 'opacity-40'}`} />
            ) : orn.type === 'star' ? (
              <path d={`M${orn.cx},${orn.cy-5} L${orn.cx+2},${orn.cy-2} L${orn.cx+5},${orn.cy-2} L${orn.cx+3},${orn.cy+1} L${orn.cx+4},${orn.cy+5} L${orn.cx},${orn.cy+3} L${orn.cx-4},${orn.cy+5} L${orn.cx-3},${orn.cy+1} L${orn.cx-5},${orn.cy-2} L${orn.cx-2},${orn.cy-2} Z`} fill={orn.color} className={`transition-all duration-300 ${litOrnaments.has(i) ? 'opacity-100 scale-110' : 'opacity-40 scale-100'}`} />
            ) : orn.type === 'bell' ? (
              <g>
                <path d={`M${orn.cx-6},${orn.cy+5} Q${orn.cx-6},${orn.cy-5} ${orn.cx},${orn.cy-7} Q${orn.cx+6},${orn.cy-5} ${orn.cx+6},${orn.cy+5} L${orn.cx-6},${orn.cy+5} Z`} fill={orn.color} stroke="#DAA520" strokeWidth="0.5" />
                <ellipse cx={orn.cx} cy={orn.cy+5} rx="7" ry="2" fill={orn.color} stroke="#DAA520" strokeWidth="0.5" />
                <circle cx={orn.cx} cy={orn.cy+7} r="2" fill="#DAA520" />
              </g>
            ) : (
              <circle cx={orn.cx} cy={orn.cy} r={litOrnaments.has(i) ? 6 : 4.5} fill={orn.color} className={`transition-all duration-500 shadow-inner ${litOrnaments.has(i) ? 'brightness-125' : 'brightness-50'}`} />
            )}
            {orn.type === 'bauble' && <rect x={orn.cx-1.5} y={orn.cy-8} width="3" height="3" fill="#BDBDBD" className={litOrnaments.has(i) ? 'opacity-100' : 'opacity-0'} />}
          </g>
        ))}
      </svg>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; transform-origin: 100px 25px; }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        @keyframes shake-bell { 0% { transform: rotate(0deg); } 20% { transform: rotate(-20deg); } 40% { transform: rotate(20deg); } 60% { transform: rotate(-15deg); } 80% { transform: rotate(15deg); } 100% { transform: rotate(0deg); } }
        .animate-shake-bell { animation: shake-bell 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
      `}</style>
    </div>
  );
};

export default ChristmasTree;