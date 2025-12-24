
import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    playAudio();

    const handleFirstInteraction = () => {
      if (!isPlaying && audio) {
        audio.play().then(() => {
          setIsPlaying(true);
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('touchstart', handleFirstInteraction);
        }).catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isPlaying]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[60]">
      <audio 
        ref={audioRef} 
        loop 
        autoPlay
        preload="auto"
        src="musics/music.mp3" 
      />
      <button 
        onClick={toggleMusic}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all border-2 active:scale-90 ${
          isPlaying 
            ? 'bg-red-600 border-yellow-400 rotate-12 scale-110' 
            : 'bg-white/10 border-white/20'
        }`}
      >
        <span className="text-xl">
          {isPlaying ? '🎶' : '🔇'}
        </span>
        {isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
