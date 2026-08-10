import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32 }) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="object-contain"
      >
        {/* Top left facet */}
        <path d="M50 10 L10 45 L50 45 Z" fill="#b86111" />
        {/* Top right facet */}
        <path d="M50 10 L90 45 L50 45 Z" fill="#d47e30" />
        {/* Bottom left facet */}
        <path d="M10 45 L50 90 L50 45 Z" fill="#914c00" />
        {/* Bottom right facet */}
        <path d="M90 45 L50 90 L50 45 Z" fill="#b86111" />
      </svg>
      <span className="font-headline font-bold text-2xl tracking-tight text-[#914c00]">
        Rhinestoone
      </span>
    </div>
  );
};
