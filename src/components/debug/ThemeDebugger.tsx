// Theme debugging component for development
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  Bug,
  ChevronDown,
  Copy,
  Palette,
  Eye,
  Code,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface ThemeDebuggerProps {
  showInProduction?: boolean;
}

export const ThemeDebugger: React.FC<ThemeDebuggerProps> = ({
  showInProduction = false,
}) => {
  const {
    currentTheme,
    availableThemes,
    isLoading,
    error,
    isDarkMode,
    validateTheme,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('colors');

  // Don't show in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null;
  }

  // Get current CSS variables
  const getCurrentCSSVariables = () => {
    if (typeof window === 'undefined') return {};
    
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const variables: Record<string, string> = {};
    
    // Get all CSS variables
    ['--background', '--foreground', '--primary', '--secondary', '--accent', '--card', '--border', '--muted'].forEach(variable => {
      variables[variable] = computedStyle.getPropertyValue(variable).trim();
    });
    
    return variables;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const cssVariables = getCurrentCSSVariables();
  const currentColors = currentTheme ? (isDarkMode ? currentTheme.dark : currentTheme.light) : null;

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 max-h-96 overflow-y-auto"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Theme Debug
                  {error && <AlertCircle className="w-4 h-4 text-destructive" />}
                  {!error && currentTheme && <CheckCircle className="w-4 h-4 text-green-500" />}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Error Display */}
                {error && (
                  <div className="p-2 rounded bg-destructive/10 text-destructive text-xs">
                    {error}
                  </div>
                )}

                {/* Current Theme Info */}
                {currentTheme && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Theme:</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {currentTheme.name}
                      </Badge>
                      <Badge variant={isDarkMode ? "default" : "outline"} className="text-xs">
                        {isDarkMode ? 'Dark' : 'Light'}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Debug Sections */}
                <div className="space-y-2">
                  {/* Colors Section */}
                  <Collapsible 
                    open={activeSection === 'colors'} 
                    onOpenChange={(open) => setActiveSection(open ? 'colors' : '')}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between h-8">
                        <span className="flex items-center gap-2">
                          <Palette className="w-3 h-3" />
                          Colors
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2">
                      {currentColors && (
                        <div className="grid grid-cols-4 gap-1">
                          {Object.entries(currentColors).slice(0, 8).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div 
                                className="w-6 h-6 rounded border mx-auto mb-1 cursor-pointer"
                                style={{ backgroundColor: value }}
                                onClick={() => copyToClipboard(value)}
                                title={`${key}: ${value}`}
                              />
                              <p className="text-xs truncate">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* CSS Variables Section */}
                  <Collapsible 
                    open={activeSection === 'css'} 
                    onOpenChange={(open) => setActiveSection(open ? 'css' : '')}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between h-8">
                        <span className="flex items-center gap-2">
                          <Code className="w-3 h-3" />
                          CSS Variables
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-2">
                      {Object.entries(cssVariables).map(([key, value]) => (
                        <div 
                          key={key} 
                          className="flex items-center gap-2 p-1 rounded hover:bg-muted/50 cursor-pointer"
                          onClick={() => copyToClipboard(`${key}: ${value}`)}
                        >
                          <div 
                            className="w-3 h-3 rounded border flex-shrink-0"
                            style={{ backgroundColor: value }}
                          />
                          <span className="text-xs font-mono truncate">{key}</span>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Theme Stats */}
                  <Collapsible 
                    open={activeSection === 'stats'} 
                    onOpenChange={(open) => setActiveSection(open ? 'stats' : '')}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between h-8">
                        <span className="flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          Stats
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-2">
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Available Themes:</span>
                          <span>{availableThemes.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Theme Valid:</span>
                          <span>{currentColors && validateTheme(currentColors) ? '✅' : '❌'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mode:</span>
                          <span>{isDarkMode ? 'Dark' : 'Light'}</span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs"
                    onClick={() => copyToClipboard(JSON.stringify(currentColors, null, 2))}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs"
                    onClick={() => window.location.reload()}
                  >
                    <Refresh className="w-3 h-3 mr-1" />
                    Reload
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
      >
        <Bug className="w-5 h-5" />
      </motion.button>
    </div>
  );
};