import React from 'react';

const Card = ({
  children,
  brackets = false,
  glowing = false,
  className = '',
  numberBadge = null,
  ...props
}) => {
  const baseStyles = 'bg-[#111111] border border-zinc-800 p-8 relative transition-all duration-300';
  
  const glowingStyle = glowing ? 'border-zinc-700 shadow-[0_0_25px_rgba(245,158,11,0.05)]' : 'hover:border-zinc-600';

  return (
    <div className={`${baseStyles} ${glowingStyle} ${className}`} {...props}>
      {/* Corner industrial brackets decoration */}
      {brackets && (
        <>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500 -mt-0.5 -ml-0.5"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500 -mt-0.5 -mr-0.5"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500 -mb-0.5 -ml-0.5"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500 -mb-0.5 -mr-0.5"></div>
        </>
      )}

      {/* Number badge on top-right */}
      {numberBadge && (
        <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-500 p-2 font-mono text-xs font-bold group-hover:bg-amber-500 group-hover:text-black transition-colors">
          {numberBadge}
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;