import React, { useState, useRef, useEffect } from 'react';

const SantaCharacter: React.FC = () => {
  const [isTalking, setIsTalking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioData, setAudioData] = useState({ volume: 0, scale: 1 });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const cachedBufferRef = useRef<AudioBuffer | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Pre-fetch and decode the local audio file for zero-lag playback
  const preFetchAudio = async () => {
    try {
      // Ensuring the audio file "musics/santa_greeting.mp3" is loaded locally
      const response = await fetch('musics/santa_greeting.mp3');
      if (!response.ok) throw new Error("Audio file not found at musics/santa_greeting.mp3");
      
      const arrayBuffer = await response.arrayBuffer();
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Native browser decoding for standard MP3/WAV/AAC
      const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      cachedBufferRef.current = buffer;
      setIsLoading(false);
    } catch (error) {
      console.error("Santa failed to load local greeting:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    preFetchAudio();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const startAnalysis = (source: AudioBufferSourceNode) => {
    if (!audioContextRef.current) return;
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.5;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const update = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const avg = sum / dataArray.length;
      
      setAudioData({ 
        volume: avg,
        scale: 1 + (avg / 250) 
      });
      animationFrameRef.current = requestAnimationFrame(update);
    };
    update();
  };

  const handleClick = async () => {
    // Check if we are already playing or if data isn't ready
    if (isTalking || !cachedBufferRef.current || !audioContextRef.current) return;

    // Browser policy: Resume context on user interaction
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    setIsTalking(true);
    const source = audioContextRef.current.createBufferSource();
    source.buffer = cachedBufferRef.current;
    source.connect(audioContextRef.current.destination);
    
    startAnalysis(source);
    
    source.onended = () => {
      setIsTalking(false);
      setAudioData({ volume: 0, scale: 1 });
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    source.start(0);
    
    // Haptic feedback for tap
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  return (
    <div 
      className="relative w-80 h-[500px] cursor-pointer group select-none flex items-center justify-center transition-all duration-500 touch-manipulation"
      onClick={handleClick}
    >
      {/* Dynamic Ambient Glow */}
      <div className={`absolute inset-0 bg-red-600/10 blur-[100px] rounded-full transition-opacity duration-1000 ${isTalking ? 'opacity-100 scale-125' : 'opacity-0 scale-100'}`}></div>

      <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-[0_45px_90px_rgba(0,0,0,0.8)]">
        <defs>
          <radialGradient id="faceGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFE0BD" />
            <stop offset="80%" stopColor="#F5B08C" />
            <stop offset="100%" stopColor="#E5906C" />
          </radialGradient>
          <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D41E3D" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
          <linearGradient id="lensGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#333" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
          <filter id="beardShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
            <feMerge> 
              <feMergeNode />
              <feMergeNode in="SourceGraphic" /> 
            </feMerge>
          </filter>
        </defs>

        {/* Shadow Floor */}
        <ellipse cx="200" cy="470" rx="140" ry="14" fill="black" opacity="0.4" />

        {/* Body & Belly (Reactive to volume) */}
        <g style={{ transform: `scaleX(${1 + audioData.volume / 900}) translateY(${-audioData.volume / 12}px)`, transformOrigin: 'center bottom' }}>
          <path d="M100,450 Q200,495 300,450 L325,220 Q200,170 75,220 Z" fill="url(#suitGrad)" />
          <path d="M185,220 L215,220 L215,468 Q200,480 185,468 Z" fill="#FDFDFD" />
          <rect x="80" y="380" width="240" height="42" fill="#111" rx="6" />
          <rect x="155" y="365" width="90" height="72" fill="#FFD700" rx="12" stroke="#B8860B" strokeWidth="3" />
          <rect x="175" y="382" width="50" height="38" fill="#222" rx="4" />
        </g>

        {/* Arms (Animated during speech) */}
        <g className={isTalking ? 'animate-talk-arms' : 'animate-idle-arms'} style={{ transformOrigin: 'center 240px' }}>
          {/* Left Arm */}
          <path d="M120,240 L50,320 L85,345 L155,265 Z" fill="#C41E3A" stroke="#700" strokeWidth="1" />
          <circle cx="55" cy="335" r="24" fill="#1A1A1A" />
          
          {/* Right Arm */}
          <path d="M280,240 L350,320 L315,345 L245,265 Z" fill="#C41E3A" stroke="#700" strokeWidth="1" />
          <circle cx="345" cy="335" r="24" fill="#1A1A1A" />
        </g>

        {/* Head Complex */}
        <g style={{ transform: `translateY(${-audioData.volume / 6}px)` }}>
          <circle cx="200" cy="150" r="72" fill="url(#faceGrad)" />
          
          {/* Layered Beard */}
          <g filter="url(#beardShadow)">
            <path d="M120,150 Q120,300 200,340 Q280,300 280,150 L200,195 Z" fill="white" />
            <path d="M135,155 Q135,280 200,315 Q265,280 265,155 L200,185 Z" fill="#F8F8F8" />
            <path d="M150,165 Q150,260 200,285 Q250,260 250,165 L200,180 Z" fill="#F0F0F0" />
          </g>

          {/* Aviator Sunglasses */}
          <g transform="translate(150, 120)">
            <path d="M0,5 Q25,0 50,5 L50,25 Q25,35 0,25 Z" fill="url(#lensGrad)" />
            <path d="M50,15 L60,15" stroke="#D4AF37" strokeWidth="3" />
            <path d="M60,5 Q85,0 110,5 L110,25 Q85,35 60,25 Z" fill="url(#lensGrad)" />
            <path d="M10,10 L25,8" stroke="white" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
            <path d="M70,10 L85,8" stroke="white" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
          </g>

          {/* Rosy Cheeks */}
          <circle cx="150" cy="170" r="20" fill="#FF7F7F" opacity="0.25" />
          <circle cx="250" cy="170" r="20" fill="#FF7F7F" opacity="0.25" />

          {/* Mouth (Lip-Synced) */}
          <ellipse 
            cx="200" 
            cy="210" 
            rx={16 + audioData.volume / 5} 
            ry={4 + audioData.volume / 3} 
            fill="#400" 
          />
          
          {/* Mustache */}
          <path d="M150,195 Q200,185 250,195 Q200,225 150,195" fill="white" stroke="#EEE" strokeWidth="0.5" />
          <ellipse cx="200" cy="170" rx="16" ry="11" fill="#F5B08C" stroke="#D5906C" strokeWidth="0.5" />

          {/* Tilted Hat */}
          <g transform="rotate(-10, 200, 110)">
            <path d="M130,110 Q200,-50 270,110 Z" fill="url(#suitGrad)" />
            <rect x="120" y="85" width="160" height="38" rx="19" fill="white" />
            <circle cx="200" cy="0" r="30" fill="white" />
          </g>
        </g>

        {isLoading ? (
          <text x="200" y="495" textAnchor="middle" fill="white" className="text-[10px] uppercase tracking-[0.4em] opacity-40 animate-pulse">Prepping Sleigh...</text>
        ) : !isTalking && (
          <text x="200" y="495" textAnchor="middle" fill="white" className="text-[14px] font-black tracking-[0.6em] uppercase opacity-40 animate-pulse">Tap Santa</text>
        )}
      </svg>

      <style>{`
        @keyframes idle-arms { 0%, 100% { transform: rotate(0deg) translateY(0); } 50% { transform: rotate(1deg) translateY(-4px); } }
        @keyframes talk-arms { 0%, 100% { transform: scale(1.02) translateY(-8px); } 50% { transform: scale(1) translateY(0); } }
        .animate-idle-arms { animation: idle-arms 5s ease-in-out infinite; }
        .animate-talk-arms { animation: talk-arms 0.25s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default SantaCharacter;