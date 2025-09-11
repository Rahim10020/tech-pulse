// components/ui/Input.js - Composant Input de base
'use client';

import { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  className = '',
  label,
  error,
  type = 'text',
  icon,
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === 'password';
  const shouldShowToggle = isPasswordType && showPasswordToggle;
  const inputType = shouldShowToggle && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          type={inputType}
          className={clsx(
            'input-field',
            error && 'input-error',
            icon && 'pl-10',
            shouldShowToggle && 'pr-10',
            className
          )}
          {...props}
        />
        {shouldShowToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };