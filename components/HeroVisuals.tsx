
import React from 'react';
import SantaCharacter from './SantaCharacter';

const HeroVisuals: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="aurora-1"></div>
        <div className="aurora-2"></div>
      </div>

      {/* Main Interactive Character */}
      <div className="relative z-10 scale-[0.85] md:scale-100 transition-all duration-1000 -mt-10">
        <SantaCharacter />
      </div>

      {/* Hero Text Content */}
      <div className="relative z-10 px-4 -mt-4">
        <span className="block text-amber-200/40 uppercase tracking-[0.8em] text-[10px] font-black mb-2 animate-fade-in-up">
          Peace & Goodwill
        </span>
        
        <h1 className="text-[5rem] md:text-9xl leading-[0.75] festive-font relative group cursor-default">
          <span className="block text-rose-600 drop-shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all group-hover:tracking-wider duration-700">
            Merry
          </span>
          <span className="block text-white group-hover:text-amber-100 transition-colors duration-1000">
            Christmas
          </span>
        </h1>
      </div>

      <style>{`
        .aurora-1, .aurora-2 { 
          position: absolute; width: 250%; height: 100%; top: -50%; left: -50%; filter: blur(100px); animation: aurora 30s linear infinite; 
        }
        .aurora-1 { background: radial-gradient(circle at 50% 50%, rgba(34,197,94,0.1), transparent 70%); }
        .aurora-2 { background: radial-gradient(circle at 50% 50%, rgba(225,29,72,0.06), transparent 70%); animation-duration: 40s; animation-delay: -10s; }
        
        @keyframes aurora { 
          0% { transform: translate(0,0) rotate(0deg); } 
          100% { transform: translate(0,0) rotate(360deg); } 
        }
        
        .animate-fade-in-up { animation: fadeInUp 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes fadeInUp { 
          from { transform: translateY(30px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
      `}</style>
    </div>
  );
};

export default HeroVisuals;
