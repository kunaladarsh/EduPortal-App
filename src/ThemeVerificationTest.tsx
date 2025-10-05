import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from './contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Sparkles, Palette, Check, RefreshCw } from 'lucide-react';

export const ThemeVerificationTest: React.FC = () => {
  const { 
    availableThemes, 
    currentTheme, 
    isLoading, 
    applyTheme,
    isDarkMode,
    toggleDarkMode
  } = useTheme();

  const [testResults, setTestResults] = useState<{
    totalThemes: number;
    newThemes: number;
    modernThemes: string[];
    hasBeautifulThemes: boolean;
  }>({
    totalThemes: 0,
    newThemes: 0,
    modernThemes: [],
    hasBeautifulThemes: false
  });

  useEffect(() => {
    if (availableThemes.length > 0) {
      // Count new modern themes (those with "modern-" prefix)
      const modernThemes = availableThemes
        .filter(theme => theme.id.startsWith('modern-'))
        .map(theme => theme.name);

      // Check for some of our beautiful new themes
      const beautifulThemeNames = [
        'Lavender & Mint',
        'Coral & Teal', 
        'Sunset Dreams',
        'Aurora Borealis',
        'Cherry Blossom',
        'Deep Sea',
        'Cosmic Nebula',
        'Rose Quartz Serenity'
      ];

      const hasBeautifulThemes = beautifulThemeNames.some(name => 
        availableThemes.some(theme => theme.name === name)
      );

      setTestResults({
        totalThemes: availableThemes.length,
        newThemes: modernThemes.length,
        modernThemes,
        hasBeautifulThemes
      });
    }
  }, [availableThemes]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="h-4 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Test Results Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            Theme System Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{testResults.totalThemes}</div>
              <p className="text-sm text-muted-foreground">Total Themes</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-secondary">{testResults.newThemes}</div>
              <p className="text-sm text-muted-foreground">New Modern Themes</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            {testResults.hasBeautifulThemes ? (
              <Badge variant="default" className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Beautiful themes loaded successfully!
              </Badge>
            ) : (
              <Badge variant="destructive">
                Beautiful themes not found
              </Badge>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Current Theme:</p>
            <Badge variant="outline">{currentTheme?.name || 'None'}</Badge>
          </div>

          <Button 
            onClick={toggleDarkMode} 
            variant="outline" 
            className="w-full"
          >
            Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
          </Button>
        </CardContent>
      </Card>

      {/* Modern Themes Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            New Beautiful Themes ({testResults.newThemes})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableThemes
              .filter(theme => theme.id.startsWith('modern-'))
              .slice(0, 8) // Show first 8 new themes
              .map(theme => {
                const colors = isDarkMode ? theme.dark : theme.light;
                const isCurrent = currentTheme?.id === theme.id;
                
                return (
                  <motion.div
                    key={theme.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isCurrent ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => applyTheme(theme.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-sm">{theme.name}</h4>
                          {isCurrent && (
                            <Badge variant="default" size="sm">
                              <Check className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {theme.description}
                        </p>

                        {/* Color Preview */}
                        <div className="grid grid-cols-5 gap-1">
                          <div
                            className="aspect-square rounded-sm border"
                            style={{ backgroundColor: colors.primary }}
                            title="Primary"
                          />
                          <div
                            className="aspect-square rounded-sm border"
                            style={{ backgroundColor: colors.secondary }}
                            title="Secondary"
                          />
                          <div
                            className="aspect-square rounded-sm border"
                            style={{ backgroundColor: colors.accent }}
                            title="Accent"
                          />
                          <div
                            className="aspect-square rounded-sm border"
                            style={{ backgroundColor: colors.background }}
                            title="Background"
                          />
                          <div
                            className="aspect-square rounded-sm border"
                            style={{ backgroundColor: colors.card }}
                            title="Card"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Theme List Debug */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All Available Themes (Debug)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableThemes.map((theme, index) => (
              <div 
                key={theme.id} 
                className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs"
              >
                <span>{index + 1}. {theme.name}</span>
                <Badge variant="outline" className="text-xs">
                  {theme.id}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};