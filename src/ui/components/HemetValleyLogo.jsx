import React from 'react';
import hemetValleyLogoImg from '../../assets/hemet_valley_logo_clean.png';

const HemetValleyLogo = ({ className = "w-12 h-12", watermark = false }) => {
  return (
    <img 
      src={hemetValleyLogoImg} 
      alt="Weapons of Mass Construction Logo" 
      className={`${className} transition-all duration-300 object-cover object-center aspect-square rounded-full ${
        watermark 
          ? "opacity-5 pointer-events-none select-none" 
          : "hover:scale-105 border border-zinc-800"
      }`}
    />
  );
};

export default HemetValleyLogo;
