import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer: React.FC = () => {
  // Start with true to satisfy "default the music.mp3 will play"
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userInteracted = useRef(false);

  // Sync the audio element with the isPlaying state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Autoplay was likely prevented by the browser
          console.debug("Autoplay prevented, waiting for user interaction.");
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle the first user interaction to start the music if it's supposed to be playing
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (userInteracted.current) return;
      userInteracted.current = true;
      
      // If we intended to play but were blocked, try playing now
      setIsPlaying(true);
      
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Strictly toggle the state
    setIsPlaying(prev => !prev);
    if ('vibrate' in navigator) navigator.vibrate(15);
  };

  return (
    <div className="fixed top-6 right-6 z-[60]">
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        src="musics/music.mp3" 
      />
      <button 
        onClick={toggleMusic}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all border-2 active:scale-90 ${
          isPlaying 
            ? 'bg-rose-600 border-amber-400 rotate-12 scale-110 shadow-[0_0_20px_rgba(225,29,72,0.5)]' 
            : 'bg-white/5 border-white/10 opacity-60'
        }`}
        aria-label={isPlaying ? "Mute Music" : "Unmute Music"}
      >
        <span className="text-xl filter drop-shadow-sm">
          {isPlaying ? '🎶' : '🔇'}
        </span>
        
        {/* Visual feedback for playing state */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping pointer-events-none"></div>
        )}
      </button>
      
      {/* Visual Indicator for when music is blocked by browser */}
      {!isPlaying && !userInteracted.current && (
        <div className="absolute top-14 right-0 bg-black/60 backdrop-blur-md text-[8px] text-white/50 px-2 py-1 rounded-full whitespace-nowrap uppercase tracking-widest pointer-events-none animate-pulse">
          Tap anywhere for music
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;