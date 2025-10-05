import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext'; 
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Sparkles, Palette, Check, RefreshCw, ArrowLeft, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ThemeVerificationPageProps {
  onBack?: () => void;
}

export const ThemeVerificationPage: React.FC<ThemeVerificationPageProps> = ({
  onBack
}) => {
  const { 
    availableThemes, 
    currentTheme, 
    isLoading, 
    applyTheme,
    isDarkMode,
    toggleDarkMode,
    refreshThemes
  } = useTheme();

  const [testResults, setTestResults] = useState<{
    totalThemes: number;
    newThemes: number;
    modernThemes: string[];
    hasBeautifulThemes: boolean;
    beautifulThemesFound: string[];
  }>({
    totalThemes: 0,
    newThemes: 0,
    modernThemes: [],
    hasBeautifulThemes: false,
    beautifulThemesFound: []
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
        'Rose Quartz Serenity',
        'Golden Hour',
        'Peacock Elegance'
      ];

      const beautifulThemesFound = beautifulThemeNames.filter(name => 
        availableThemes.some(theme => theme.name === name)
      );

      const hasBeautifulThemes = beautifulThemesFound.length > 0;

      setTestResults({
        totalThemes: availableThemes.length,
        newThemes: modernThemes.length,
        modernThemes,
        hasBeautifulThemes,
        beautifulThemesFound
      });
    }
  }, [availableThemes]);

  const handleTestTheme = async (themeId: string) => {
    try {
      const success = await applyTheme(themeId);
      if (success) {
        const theme = availableThemes.find(t => t.id === themeId);
        toast.success(`✨ Applied ${theme?.name}!`, {
          description: 'Theme colors updated successfully'
        });
      }
    } catch (error) {
      toast.error('Failed to apply theme');
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshThemes();
      toast.success('Themes refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh themes');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Theme Verification</h2>
            <p className="text-sm text-muted-foreground">
              Testing beautiful color themes
            </p>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>System Status</span>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
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
              <p className="text-sm text-muted-foreground">New Beautiful Themes</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center">
              {testResults.hasBeautifulThemes ? (
                <Badge variant="default" className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Beautiful themes loaded! ({testResults.beautifulThemesFound.length})
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Beautiful themes not found
                </Badge>
              )}
            </div>

            {testResults.beautifulThemesFound.length > 0 && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Found themes:</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {testResults.beautifulThemesFound.slice(0, 5).map(name => (
                    <Badge key={name} variant="outline" className="text-xs">
                      {name}
                    </Badge>
                  ))}
                  {testResults.beautifulThemesFound.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{testResults.beautifulThemesFound.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Current Theme:</p>
            <Badge variant="outline" className="text-sm">
              {currentTheme?.name || 'None'}
            </Badge>
            <div>
              <Button 
                onClick={toggleDarkMode} 
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beautiful Themes Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            New Beautiful Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {availableThemes
              .filter(theme => theme.id.startsWith('modern-'))
              .slice(0, 6) // Show first 6 new themes
              .map((theme, index) => {
                const colors = isDarkMode ? theme.dark : theme.light;
                const isCurrent = currentTheme?.id === theme.id;
                
                return (
                  <motion.div
                    key={theme.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isCurrent ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleTestTheme(theme.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-sm">{theme.name}</h4>
                          <div className="flex items-center gap-2">
                            {isCurrent && (
                              <Badge variant="default" size="sm">
                                <Check className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTestTheme(theme.id);
                              }}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {theme.description}
                        </p>

                        {/* Color Preview */}
                        <div className="grid grid-cols-6 gap-1">
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
                          <div
                            className="aspect-square rounded-sm border"
                            style={{ backgroundColor: colors.chart1 }}
                            title="Chart"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>

          {testResults.newThemes > 6 && (
            <div className="text-center mt-4">
              <Badge variant="outline">
                +{testResults.newThemes - 6} more beautiful themes available
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Theme Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'modern-lavender-mint', name: 'Lavender & Mint' },
              { id: 'modern-coral-teal', name: 'Coral & Teal' },
              { id: 'modern-sunset-gradient', name: 'Sunset Dreams' },
              { id: 'modern-aurora-borealis', name: 'Aurora Borealis' },
            ].map(theme => {
              const themeExists = availableThemes.some(t => t.id === theme.id);
              return (
                <Button
                  key={theme.id}
                  variant={themeExists ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => themeExists && handleTestTheme(theme.id)}
                  disabled={!themeExists}
                  className="text-xs"
                >
                  {themeExists ? (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      {theme.name}
                    </>
                  ) : (
                    `${theme.name} (Not Found)`
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};