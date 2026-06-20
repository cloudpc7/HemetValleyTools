import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

/**
 * LinkComponent: A highly versatile and robust navigation component.
 * Supports internal React Router routing, external HREFs, custom styling via Tailwind,
 * hover/active states, and fits seamlessly into any design system.
 */
const LinkComponent = ({
  to,
  href,
  children,
  className = '',
  external = false,
  active = false,
  variant = 'default', // 'default', 'nav', 'button', 'underline'
  ...props
}) => {
  // Base styling classes
  let baseStyles = 'transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 rounded';

  // Variant styles combining Tailwind and theme utilities
  const variants = {
    default: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
    nav: `text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium ${
      active ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
    }`,
    button: 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm',
    underline: 'text-gray-900 dark:text-white border-b border-transparent hover:border-gray-900 dark:hover:border-white pb-0.5'
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.default} ${className}`.trim();

  // If external link
  if (external || href) {
    return (
      <a
        href={href || to}
        className={combinedClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  // If internal React Router link
  return (
    <RouterLink to={to} className={combinedClasses} {...props}>
      {children}
    </RouterLink>
  );
};

export default LinkComponent;