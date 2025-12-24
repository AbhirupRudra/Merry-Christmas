
import React, { useState, useEffect } from 'react';
import { TimeLeft } from '../types';

const Countdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const year = new Date().getFullYear();
    let difference = +new Date(`${year}-12-25T00:00:00`) - +new Date();
    if (difference <= 0) {
      difference = +new Date(`${year + 1}-12-25T00:00:00`) - +new Date();
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg">
      <span className="text-3xl font-bold text-yellow-400 drop-shadow-glow">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
        {label}
      </span>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-[280px] mx-auto">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default Countdown;
