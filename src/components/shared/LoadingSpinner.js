// components/LoadingSpinner.js - Composant de chargement
export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-gray-900 ${sizeClasses[size]} ${className}`}></div>
  );
}