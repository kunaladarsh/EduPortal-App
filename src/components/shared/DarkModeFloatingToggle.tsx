// Beautiful floating dark mode toggle button
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun, Sparkles } from 'lucide-react';

interface DarkModeFloatingToggleProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  showLabel?: boolean;
}

export const DarkModeFloatingToggle: React.FC<DarkModeFloatingToggleProps> = ({
  position = 'bottom-right',
  className = '',
  showLabel = false,
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4',
  };

  const handleToggle = () => {
    toggleDarkMode();
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-40 ${className}`}>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg whitespace-nowrap"
          >
            <p className="text-xs font-medium">
              {isDarkMode ? 'Dark mode enabled' : 'Light mode enabled'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center overflow-hidden"
        style={{
          background: isDarkMode
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {/* Background Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
          }}
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.8 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Sparkles Effect */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, Math.random() * 40 - 20],
                    y: [0, Math.random() * 40 - 20],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                >
                  <Sparkles
                    className="w-3 h-3"
                    style={{ color: isDarkMode ? '#8b5cf6' : '#fbbf24' }}
                  />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main Icon */}
        <motion.div
          className="relative z-10"
          animate={{
            rotate: isDarkMode ? 0 : 360,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {isDarkMode ? (
            <Moon className="w-6 h-6 text-white" />
          ) : (
            <Sun className="w-6 h-6 text-white" />
          )}
        </motion.div>

        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: isDarkMode ? '#8b5cf6' : '#fbbf24',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.button>

      {/* Label */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, x: position.includes('right') ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: position.includes('right') ? 10 : -10 }}
            className={`absolute top-1/2 -translate-y-1/2 ${
              position.includes('right') ? 'right-16' : 'left-16'
            } px-3 py-1 bg-card border border-border rounded-lg shadow-md whitespace-nowrap`}
          >
            <p className="text-xs font-medium">
              {isDarkMode ? 'Dark' : 'Light'} Mode
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
