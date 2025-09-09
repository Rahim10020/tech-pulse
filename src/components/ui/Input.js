// components/ui/Input.js - Composant Input de base
'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({
  className = '',
  label,
  error,
  type = 'text',
  icon,
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
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            'input-field',
            error && 'input-error',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };