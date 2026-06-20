import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  variant = 'amber', // 'amber', 'charcoal', 'outline', 'black'
  className = '',
  to = null,
  onClick = null,
  type = 'button',
  disabled = false,
  ...props
}) => {
  const baseStyles = 'font-header uppercase tracking-wider font-bold transition-all duration-300 rounded-none cursor-pointer inline-flex items-center justify-center gap-2 text-center';

  const variants = {
    amber: 'bg-amber-500 text-black hover:bg-white hover:text-black',
    charcoal: 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800',
    outline: 'bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-700',
    black: 'bg-zinc-950 hover:bg-amber-500 text-zinc-300 hover:text-black border border-zinc-800 block',
  };

  const buttonClasses = `${baseStyles} ${variants[variant] || variants.amber} ${className}`;

  if (to) {
    return (
      <Link 
        to={to} 
        className={buttonClasses}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;