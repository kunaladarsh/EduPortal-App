// Minimal debug component - only shows when needed
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Eye, EyeOff, Palette } from 'lucide-react';

export const MinimalDebug: React.FC = () => {
  const { currentTheme, isDarkMode, availableThemes } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development or when specifically enabled
  if (process.env.NODE_ENV === 'production' && !isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsVisible(true)}
          className="rounded-full w-10 h-10 p-0"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Theme Debug
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <EyeOff className="w-3 h-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs">
            <div className="font-medium">Current Theme:</div>
            <div className="text-muted-foreground">{currentTheme?.name || 'Loading...'}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isDarkMode ? "default" : "secondary"} className="text-xs">
              {isDarkMode ? 'Dark' : 'Light'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {availableThemes.length} themes
            </Badge>
          </div>

          {currentTheme && (
            <div className="flex gap-1">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: isDarkMode ? currentTheme.dark.primary : currentTheme.light.primary }}
                title="Primary"
              />
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: isDarkMode ? currentTheme.dark.secondary : currentTheme.light.secondary }}
                title="Secondary"
              />
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: isDarkMode ? currentTheme.dark.accent : currentTheme.light.accent }}
                title="Accent"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};