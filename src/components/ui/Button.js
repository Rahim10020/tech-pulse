
'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

/**
 * A versatile button component with support for different variants, sizes, loading states, and icons.
 *
 * @param {Object} props - The component props
 * @param {string} [props.className=''] - Additional CSS classes to apply
 * @param {'primary'|'secondary'|'outline'|'ghost'} [props.variant='primary'] - The button style variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - The button size
 * @param {React.ReactNode} props.children - The button content
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.isLoading=false] - Whether to show loading state
 * @param {string} [props.loadingText='Chargement...'] - Text to show when loading
 * @param {React.ReactNode} props.icon - Optional icon to display
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element} The button element
 */
const Button = forwardRef(({
  className = '',
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  isLoading = false,
  loadingText = 'Chargement...',
  icon,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-600 focus:ring-teal-500 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-500 shadow-sm hover:shadow-md',
    outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  };

  const MotionButton = motion.button;

  return (
    <MotionButton
      ref={ref}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
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
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2"
        >
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </motion.span>
      ) : (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2"
        >
          {icon && <motion.span whileHover={{ rotate: [0, -10, 10, 0] }}>{icon}</motion.span>}
          {children}
        </motion.span>
      )}
    </MotionButton>
  );
});

Button.displayName = 'Button';

export { Button };