'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Basculer le thème"
    >
      <motion.div
        className="flex items-center justify-center w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-md"
        animate={{
          x: theme === 'dark' ? 24 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-teal-500" />
        ) : (
          <Sun className="w-3 h-3 text-orange-500" />
        )}
      </motion.div>

      {/* Icons de fond */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun className="w-3 h-3 text-orange-500 opacity-50" />
        <Moon className="w-3 h-3 text-teal-400 opacity-50" />
      </div>
    </motion.button>
  );
}
