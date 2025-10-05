// Mobile theme settings component for dynamic theme management
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeConfig } from '../../constants/theme';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import {
  Palette,
  Moon,
  Sun,
  Check,
  Sparkles,
  RefreshCw,
  Eye,
  Settings,
  Crown,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface MobileThemeSettingsProps {
  onClose?: () => void;
  showAdminFeatures?: boolean;
}

export const MobileThemeSettings: React.FC<MobileThemeSettingsProps> = ({
  onClose,
  showAdminFeatures = false,
}) => {
  const {
    currentTheme,
    availableThemes,
    isLoading,
    error,
    isDarkMode,
    toggleDarkMode,
    applyTheme,
    refreshThemes,
    isThemeUpdateInProgress,
  } = useTheme();
  
  const { user } = useAuth();
  const [selectedThemeId, setSelectedThemeId] = useState(currentTheme?.id || '');
  const [previewMode, setPreviewMode] = useState(false);

  // Handle theme selection
  const handleThemeSelect = useCallback(async (themeId: string) => {
    try {
      setSelectedThemeId(themeId);
      
      if (previewMode) {
        // Just preview without saving
        const theme = availableThemes.find(t => t.id === themeId);
        if (theme) {
          toast.info(`Previewing ${theme.name}`);
        }
      } else {
        // Apply and save theme
        const success = await applyTheme(themeId);
        if (success) {
          const theme = availableThemes.find(t => t.id === themeId);
          toast.success(`Applied ${theme?.name || 'theme'}`);
        } else {
          toast.error('Failed to apply theme');
          setSelectedThemeId(currentTheme?.id || '');
        }
      }
    } catch (error) {
      console.error('Error selecting theme:', error);
      toast.error('Failed to change theme');
      setSelectedThemeId(currentTheme?.id || '');
    }
  }, [applyTheme, availableThemes, currentTheme?.id, previewMode]);

  // Handle refresh themes
  const handleRefreshThemes = useCallback(async () => {
    try {
      await refreshThemes();
      toast.success('Themes refreshed');
    } catch (error) {
      toast.error('Failed to refresh themes');
    }
  }, [refreshThemes]);

  // Render theme preview card
  const renderThemeCard = useCallback((theme: ThemeConfig) => {
    const isSelected = selectedThemeId === theme.id;
    const isCurrent = currentTheme?.id === theme.id;
    const colors = isDarkMode ? theme.dark : theme.light;

    return (
      <motion.div
        key={theme.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={`relative cursor-pointer transition-all duration-200 ${
            isSelected
              ? 'ring-2 ring-primary shadow-lg transform scale-[1.02]'
              : 'hover:shadow-md'
          }`}
          onClick={() => handleThemeSelect(theme.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{theme.name}</CardTitle>
              <div className="flex items-center gap-2">
                {theme.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
                {isCurrent && (
                  <Badge variant="default" className="text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </div>
            {theme.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {theme.description}
              </p>
            )}
          </CardHeader>

          <CardContent className="pt-0">
            {/* Color preview */}
            <div className="grid grid-cols-5 gap-1 mb-3">
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

            {/* Theme actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewMode(true);
                  handleThemeSelect(theme.id);
                  setTimeout(() => setPreviewMode(false), 3000);
                }}
              >
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }, [selectedThemeId, currentTheme?.id, isDarkMode, handleThemeSelect]);

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton key={j} className="aspect-square" />
                  ))}
                </div>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Theme Settings</h2>
            <p className="text-sm text-muted-foreground">
              Customize your app appearance
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshThemes}
            disabled={isThemeUpdateInProgress}
          >
            <RefreshCw className={`w-4 h-4 ${isThemeUpdateInProgress ? 'animate-spin' : ''}`} />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Done
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Dark Mode Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                {isDarkMode ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark appearance
                </p>
              </div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Current Theme Info */}
      {currentTheme && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Current Theme</p>
                <p className="text-sm text-muted-foreground">
                  {currentTheme.name}
                </p>
              </div>
              {currentTheme.isDefault && (
                <Badge variant="secondary">Default</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Available Themes</h3>
          <Badge variant="outline" className="text-xs">
            {availableThemes.length} themes
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {availableThemes.map(renderThemeCard)}
          </AnimatePresence>
        </div>
      </div>

      {/* Admin Features */}
      {showAdminFeatures && user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Admin Theme Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full">
              Create Custom Theme
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Theme Management
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Theme Update Progress */}
      {isThemeUpdateInProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-20 left-4 right-4 z-50"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium">Updating theme...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};