import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Accessibility,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  MousePointer,
  Keyboard,
  Monitor,
  ZoomIn,
  ZoomOut,
  Contrast,
  Palette,
  Type,
  Settings,
  X,
  RotateCcw,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  audioDescriptions: boolean;
  colorBlindMode: string;
  fontSize: number;
  cursorSize: number;
  focusVisible: boolean;
  autoPlay: boolean;
  animations: boolean;
}

const AccessibilityEnhancements: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    audioDescriptions: false,
    colorBlindMode: 'none',
    fontSize: 100,
    cursorSize: 100,
    focusVisible: true,
    autoPlay: false,
    animations: true
  });

  // Load settings from localStorage
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Failed to parse accessibility settings:', error);
        }
      }
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true, animations: false }));
    }

    // Check if user has high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    if (prefersHighContrast) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    }
    applySettings();
  }, [settings]);

  // Apply accessibility settings to the document
  const applySettings = useCallback(() => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (settings.largeText) {
      root.style.setProperty('--font-size-scale', '1.2');
    } else {
      root.style.setProperty('--font-size-scale', '1');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Font size
    root.style.setProperty('--accessibility-font-scale', `${settings.fontSize / 100}`);
    root.setAttribute('data-accessibility-font-scale', 'true');

    // Cursor size
    root.style.setProperty('--accessibility-cursor-scale', `${settings.cursorSize / 100}`);
    root.setAttribute('data-accessibility-cursor-scale', 'true');

    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible-enhanced');
    } else {
      root.classList.remove('focus-visible-enhanced');
    }

    // Color blind mode
    root.setAttribute('data-colorblind-mode', settings.colorBlindMode);

    // Keyboard navigation
    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-navigation-enhanced');
    } else {
      root.classList.remove('keyboard-navigation-enhanced');
    }

    // Screen reader optimizations
    if (settings.screenReader) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }
  }, [settings]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Alt + A to open accessibility panel
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }

      // Alt + C for high contrast toggle
      if (event.altKey && event.key === 'c') {
        event.preventDefault();
        setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
      }

      // Alt + T for large text toggle
      if (event.altKey && event.key === 't') {
        event.preventDefault();
        setSettings(prev => ({ ...prev, largeText: !prev.largeText }));
      }

      // Alt + M for reduced motion toggle
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      audioDescriptions: false,
      colorBlindMode: 'none',
      fontSize: 100,
      cursorSize: 100,
      focusVisible: true,
      autoPlay: false,
      animations: true
    };
    setSettings(defaultSettings);
  };

  const colorBlindModes = [
    { value: 'none', label: 'None' },
    { value: 'protanopia', label: 'Protanopia (Red-blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
    { value: 'achromatopsia', label: 'Achromatopsia (Color-blind)' }
  ];

  // Floating accessibility button
  const FloatingAccessibilityButton = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-20 left-4 z-50"
    >
      <Button
        onClick={() => setIsVisible(true)}
        size="sm"
        className="rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90 shadow-lg"
        aria-label="Open Accessibility Settings"
      >
        <Accessibility className="w-5 h-5" />
      </Button>
    </motion.div>
  );

  // Skip to content link
  const SkipToContentLink = () => (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
    >
      Skip to main content
    </a>
  );

  return (
    <>
      {/* Skip to content link */}
      <SkipToContentLink />

      {/* Floating accessibility button */}
      <FloatingAccessibilityButton />

      {/* Accessibility panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Accessibility className="w-5 h-5" />
                      Accessibility Settings
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetSettings}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsVisible(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Customize your experience with accessibility features
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Vision Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Vision
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium">High Contrast</label>
                          <p className="text-sm text-muted-foreground">
                            Increase contrast for better visibility
                          </p>
                        </div>
                        <Switch
                          checked={settings.highContrast}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({ ...prev, highContrast: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium">Large Text</label>
                          <p className="text-sm text-muted-foreground">
                            Increase text size for better readability
                          </p>
                        </div>
                        <Switch
                          checked={settings.largeText}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({ ...prev, largeText: checked }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-medium">Font Size: {settings.fontSize}%</label>
                        <Slider
                          value={[settings.fontSize]}
                          onValueChange={(value) =>
                            setSettings(prev => ({ ...prev, fontSize: value[0] }))
                          }
                          min={75}
                          max={150}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-medium">Color Blind Support</label>
                        <Select
                          value={settings.colorBlindMode}
                          onValueChange={(value) =>
                            setSettings(prev => ({ ...prev, colorBlindMode: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {colorBlindModes.map(mode => (
                              <SelectItem key={mode.value} value={mode.value}>
                                {mode.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Motor Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MousePointer className="w-4 h-4" />
                      Motor
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium">Enhanced Focus</label>
                          <p className="text-sm text-muted-foreground">
                            Better visual focus indicators
                          </p>
                        </div>
                        <Switch
                          checked={settings.focusVisible}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({ ...prev, focusVisible: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium">Keyboard Navigation</label>
                          <p className="text-sm text-muted-foreground">
                            Enhanced keyboard navigation support
                          </p>
                        </div>
                        <Switch
                          checked={settings.keyboardNavigation}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({ ...prev, keyboardNavigation: checked }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-medium">Cursor Size: {settings.cursorSize}%</label>
                        <Slider
                          value={[settings.cursorSize]}
                          onValueChange={(value) =>
                            setSettings(prev => ({ ...prev, cursorSize: value[0] }))
                          }
                          min={75}
                          max={200}
                          step={25}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cognitive Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Cognitive
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium">Reduced Motion</label>
                          <p className="text-sm text-muted-foreground">
                            Minimize animations and transitions
                          </p>
                        </div>
                        <Switch
                          checked={settings.reducedMotion}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({ ...prev, reducedMotion: checked, animations: !checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium">Auto-play Content</label>
                          <p className="text-sm text-muted-foreground">
                            Automatically play videos and animations
                          </p>
                        </div>
                        <Switch
                          checked={settings.autoPlay}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({ ...prev, autoPlay: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Screen Reader Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Screen Reader
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium">Screen Reader Mode</label>
                          <p className="text-sm text-muted-foreground">
                            Optimize interface for screen readers
                          </p>
                        </div>
                        <Switch
                          checked={settings.screenReader}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({ ...prev, screenReader: checked }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-medium">Audio Descriptions</label>
                          <p className="text-sm text-muted-foreground">
                            Provide audio descriptions for visual content
                          </p>
                        </div>
                        <Switch
                          checked={settings.audioDescriptions}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({ ...prev, audioDescriptions: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Keyboard Shortcuts */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Keyboard className="w-4 h-4" />
                      Keyboard Shortcuts
                    </h3>

                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Open accessibility panel</span>
                        <Badge variant="outline">Alt + A</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle high contrast</span>
                        <Badge variant="outline">Alt + C</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle large text</span>
                        <Badge variant="outline">Alt + T</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle reduced motion</span>
                        <Badge variant="outline">Alt + M</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </>
  );
};

export default AccessibilityEnhancements;