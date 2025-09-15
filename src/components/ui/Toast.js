import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * A toast notification component that displays messages with auto-dismiss functionality.
 *
 * @param {Object} props - The component props
 * @param {string} props.message - The message to display
 * @param {'success'|'error'|'warning'|'info'} [props.type='info'] - The toast type affecting styling
 * @param {number} [props.duration=5000] - Duration in milliseconds before auto-dismiss
 * @param {Function} props.onClose - Callback when the toast is closed
 * @returns {JSX.Element} The toast element
 */
export default function Toast({
  message,
  type = 'info',
  duration = 5000,
  onClose
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attendre la fin de l'animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
      <div className={`flex items-center p-4 rounded-lg border ${bgColors[type]} shadow-lg min-w-[300px]`}>
        {icons[type]}
        <span className="ml-3 text-sm font-medium text-gray-900 flex-1">
          {message}
        </span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}