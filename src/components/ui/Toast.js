'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    info: <Info className="w-5 h-5 text-teal-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-teal-50 border-teal-200'
  };

  const progressColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-teal-500'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative"
        >
          <div className={`flex items-start p-4 rounded-xl border ${bgColors[type]} backdrop-blur-md shadow-xl min-w-[320px] max-w-md overflow-hidden`}>
            {/* Icon with animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            >
              {icons[type]}
            </motion.div>

            {/* Message */}
            <div className="ml-3 flex-1">
              <span className="text-sm font-semibold text-gray-900 block leading-relaxed">
                {message}
              </span>
            </div>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Progress bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className={`absolute bottom-0 left-0 h-1 ${progressColors[type]}`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}