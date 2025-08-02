// components/ui/Input.js - Composant Input de base
'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({ 
  className = '',
  label,
  error,
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className={clsx(
          'label',
          error && 'label-error'
        )}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={clsx(
          'input-field',
          error && 'input-error',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };