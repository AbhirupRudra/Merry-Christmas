import React, { useState, useEffect, useMemo } from 'react';
import Snowfall from './components/Snowfall';
import ChristmasTree from './components/ChristmasTree';
import GiftBox from './components/GiftBox';
import SantaSleigh from './components/SantaSleigh';
import MusicPlayer from './components/MusicPlayer';
import MobileNav from './components/MobileNav';
import SectionWrapper from './components/SectionWrapper';
import HeroVisuals from './components/HeroVisuals';
import { GIFT_MESSAGES } from './constants';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';

const App: React.FC = () => {
  const [letterContent, setLetterContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const performAutoLogin = async () => {
      try {
        await signInWithEmailAndPassword(auth, "abhiruprudra@gmail.com", "159753");
        setIsAuthed(true);
      } catch {
        setIsAuthed(false);
      }
    };
    performAutoLogin();
    if (localStorage.getItem('santa_letter_sent') === 'true') setIsSent(true);
  }, []);

  const selectedQuotes = useMemo(() => {
    const shuffled = [...GIFT_MESSAGES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, []);

  const handleSendLetter = async () => {
    if (!letterContent.trim() || !isAuthed) return;
    setIsSending(true);
    
    const audio = new Audio('musics/wish_sent.mp3');
    audio.play().catch(() => {});
    
    try {
      const wishDocRef = doc(db, 'users', 'yQICBVFWRPNzdK9Cb27Jkxlr7452');
      await setDoc(wishDocRef, {
        wishes: arrayUnion({ text: letterContent, timestamp: new Date().toISOString(), anonymous: true })
      }, { merge: true });

      localStorage.setItem('santa_letter_sent', 'true');
      setIsSent(true);
      setLetterContent('');
    } catch {
      alert("Oops! Reindeer lost their way.");
    } finally {
      setIsSending(false);
    }
  };

  const handleResetLetter = () => {
    localStorage.removeItem('santa_letter_sent');
    setIsSent(false);
  };

  return (
    <div className="bg-[#020617] h-screen w-full relative overflow-hidden text-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed top-6 left-6 z-[70] flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
        <div className={`w-1.5 h-1.5 rounded-full ${isAuthed ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></div>
        <span className="text-[8px] uppercase tracking-[0.2em] font-black text-white/50">{isAuthed ? 'North Pole Link Active' : 'Connecting...'}</span>
      </div>

      <Snowfall />
      <SantaSleigh />
      <MusicPlayer />
      <MobileNav />

      <div className="snap-container">
        <SectionWrapper id="hero"><HeroVisuals /></SectionWrapper>
        <SectionWrapper id="tree">
          <div className="bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl border border-white/10 rounded-[4rem] p-10 text-center shadow-2xl relative group">
            <h2 className="text-5xl text-emerald-400 mb-2 festive-font">The Curio Tree</h2>
            <p className="text-white/20 text-[10px] mb-8 uppercase tracking-[0.4em] font-bold">Touch ornaments to hear them</p>
            <div className="scale-110 py-4"><ChristmasTree /></div>
          </div>
        </SectionWrapper>
        <SectionWrapper id="gifts">
          <div className="flex flex-col items-center w-full pb-10 -mt-24">
            <h2 className="text-5xl text-amber-300 festive-font mb-4">Enchanted Gifts</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 px-4 py-4">
              <GiftBox color="#991B1B" ribbonColor="#FBBF24" message={selectedQuotes[0]} />
              <GiftBox color="#065F46" ribbonColor="#F8FAFC" message={selectedQuotes[1]} />
              <GiftBox color="#1E3A8A" ribbonColor="#EAB308" message={selectedQuotes[2]} />
              <GiftBox color="#581C87" ribbonColor="#F3E8FF" message={selectedQuotes[3]} />
            </div>
          </div>
        </SectionWrapper>
        <SectionWrapper id="letter">
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 shadow-inner relative overflow-hidden w-full max-w-sm mx-auto flex flex-col min-h-[450px]">
            <h3 className="text-5xl text-rose-500 mb-8 festive-font text-center">Spirit Post</h3>
            {isSent ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center animate-pop-in pb-10">
                <div className="flex justify-end w-full"> 
                  <div className="text-7xl mb-8 animate-bounce-slow drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">✨✉️</div>
                </div>
                <h4 className="text-4xl text-amber-200 font-bold mb-3 tracking-wide">Delivered!</h4>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-12">Santa has received your message</p>
                <button 
                  onClick={handleResetLetter} 
                  className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase tracking-[0.4em] font-black"
                >
                  Write A new
                </button>
              </div>
            ) : (
              <div className={`flex-1 flex flex-col transition-all duration-700 ${isSending ? 'opacity-30 blur-sm' : 'opacity-100'}`}>
                <textarea 
                  value={letterContent} 
                  onChange={(e) => setLetterContent(e.target.value)} 
                  placeholder="Whisper your heart's desire..." 
                  className="w-full bg-black/50 border border-white/5 rounded-[2.5rem] p-8 text-white placeholder-white/10 focus:outline-none focus:border-rose-500/30 transition-all resize-none text-base flex-1 min-h-[200px] leading-relaxed shadow-2xl" 
                />
                <button 
                  onClick={handleSendLetter} 
                  disabled={!letterContent.trim() || isSending || !isAuthed} 
                  className="w-full mt-8 py-5 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-full font-black text-xl flex items-center justify-center gap-4 disabled:opacity-20 active:scale-95 transition-transform"
                >
                  {isSending ? (
                    <span className="animate-spin text-2xl">❄️</span>
                  ) : (
                    <>
                      <span className="tracking-widest uppercase text-sm">Send Wish</span>
                      <span className="text-2xl">🎅</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
};

export default App;