// Quick Dark Mode Card Component - Can be embedded anywhere
import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent } from '../ui/card';
import { Switch } from '../ui/switch';
import { Moon, Sun } from 'lucide-react';

interface QuickDarkModeCardProps {
  className?: string;
  showDescription?: boolean;
}

export const QuickDarkModeCard: React.FC<QuickDarkModeCardProps> = ({
  className = '',
  showDescription = true,
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              }}
              animate={{
                rotate: isDarkMode ? 0 : 360,
              }}
              transition={{ duration: 0.5 }}
            >
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-white" />
              ) : (
                <Sun className="w-5 h-5 text-white" />
              )}
            </motion.div>
            <div>
              <p className="font-medium">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </p>
              {showDescription && (
                <p className="text-sm text-muted-foreground">
                  {isDarkMode
                    ? 'Easy on the eyes'
                    : 'Bright and clear'}
                </p>
              )}
            </div>
          </div>
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
};
