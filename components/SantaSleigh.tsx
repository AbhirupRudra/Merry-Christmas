
import React from 'react';

const SantaSleigh: React.FC = () => {
  return (
    <div className="fixed top-20 left-0 w-full pointer-events-none z-0">
      <div className="santa-animation text-4xl whitespace-nowrap opacity-60">
        ✨ 🦌 🦌 🦌 🛷 🎅 ☁️
      </div>
      <style>{`
        .santa-animation {
          position: absolute;
          left: -200px;
          animation: fly-across 25s linear infinite;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }
        @keyframes fly-across {
          0% { transform: translateX(-100px) translateY(0); }
          25% { transform: translateX(25vw) translateY(-20px); }
          50% { transform: translateX(50vw) translateY(0); }
          75% { transform: translateX(75vw) translateY(-20px); }
          100% { transform: translateX(110vw) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SantaSleigh;
