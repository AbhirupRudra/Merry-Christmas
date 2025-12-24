
import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, id }) => {
  return (
    <section id={id} className="snap-section w-full flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <div className="w-full max-w-sm h-full flex flex-col justify-center animate-fade-in">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
