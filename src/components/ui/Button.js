// components/ui/Button.js - Composant Button corrigé
'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Button = forwardRef(({
  className = '',
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  isLoading = false,
  loadingText = 'Loading...',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-500',
    outline: 'border border-gray-200 bg-transparent hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className,
        isLoading && 'cursor-not-allowed opacity-75'
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };