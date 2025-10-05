// Dark Mode Demo Component - Showcases the light/dark mode toggle functionality
import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Moon,
  Sun,
  Sparkles,
  Palette,
  Eye,
  Check,
  Info,
  Zap,
} from 'lucide-react';

interface DarkModeDemoProps {
  onBack?: () => void;
}

export const DarkModeDemo: React.FC<DarkModeDemoProps> = ({ onBack }) => {
  const { isDarkMode, toggleDarkMode, currentTheme } = useTheme();

  const demoCards = [
    {
      title: 'Primary Colors',
      description: 'Main brand colors',
      content: (
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <div className="h-16 rounded-lg bg-primary" />
            <p className="text-xs text-center text-muted-foreground">Primary</p>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-lg bg-secondary" />
            <p className="text-xs text-center text-muted-foreground">Secondary</p>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-lg bg-accent" />
            <p className="text-xs text-center text-muted-foreground">Accent</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Background Colors',
      description: 'Surface and card colors',
      content: (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="h-16 rounded-lg bg-background border-2 border-border" />
            <p className="text-xs text-center text-muted-foreground">Background</p>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-lg bg-card border-2 border-border" />
            <p className="text-xs text-center text-muted-foreground">Card</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Text Colors',
      description: 'Foreground and muted text',
      content: (
        <div className="space-y-2">
          <p className="text-foreground">Primary foreground text</p>
          <p className="text-muted-foreground">Muted foreground text</p>
          <p className="text-primary">Primary colored text</p>
          <p className="text-secondary">Secondary colored text</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 safe-area-top safe-area-bottom">
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            {onBack && (
              <Button variant="ghost" onClick={onBack}>
                ← Back
              </Button>
            )}
            <div className="flex-1" />
          </div>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              {isDarkMode ? (
                <Moon className="w-8 h-8 text-white" />
              ) : (
                <Sun className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold">Dark Mode Demo</h1>
            <p className="text-muted-foreground">
              Toggle between light and dark themes
            </p>
          </div>
        </motion.div>

        {/* Dark Mode Toggle Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Theme Mode</CardTitle>
                    <CardDescription>
                      Currently in {isDarkMode ? 'Dark' : 'Light'} Mode
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {currentTheme?.name || 'Default Theme'}
                </Badge>
                <Badge variant="outline">
                  <Check className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Theme changes are saved automatically and will persist across sessions.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={isDarkMode ? 'outline' : 'default'}
                  onClick={() => !isDarkMode && toggleDarkMode()}
                  className="w-full"
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </Button>
                <Button
                  variant={isDarkMode ? 'default' : 'outline'}
                  onClick={() => isDarkMode && toggleDarkMode()}
                  className="w-full"
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Color Preview Cards */}
        <div className="space-y-4">
          {demoCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>{card.content}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Automatic Persistence</p>
                  <p className="text-sm text-muted-foreground">
                    Your theme preference is saved automatically
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="font-medium">System Detection</p>
                  <p className="text-sm text-muted-foreground">
                    Follows your device's color scheme by default
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Palette className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Smooth Transitions</p>
                  <p className="text-sm text-muted-foreground">
                    Beautiful animations when switching themes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button
            variant="outline"
            onClick={toggleDarkMode}
            className="h-auto py-4 flex-col gap-2"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
            <span className="text-sm">Toggle Theme</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="h-auto py-4 flex-col gap-2"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-sm">Test Persistence</span>
          </Button>
        </motion.div>

        {/* Info Text */}
        <div className="text-center text-sm text-muted-foreground pb-8">
          <p>Try toggling the theme and refreshing the page.</p>
          <p>Your preference will be remembered! ✨</p>
        </div>
      </div>
    </div>
  );
};
