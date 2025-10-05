// Dynamic theme context for managing app-wide theming
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  ThemeConfig,
  ThemeColors,
  CSS_VARIABLE_MAP,
  DEFAULT_LIGHT_THEME,
  DEFAULT_DARK_THEME,
  PREDEFINED_THEMES,
  validateThemeColors,
} from '../constants/theme';
import { themeService } from '../services/themeService';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  // Current theme state
  currentTheme: ThemeConfig | null;
  isLoading: boolean;
  error: string | null;
  
  // Available themes
  availableThemes: ThemeConfig[];
  
  // Theme management
  applyTheme: (themeId: string) => Promise<boolean>;
  refreshThemes: () => Promise<void>;
  
  // Dark mode
  isDarkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  toggleDarkMode: () => void;
  
  // Custom theme creation (admin only)
  createCustomTheme: (theme: Omit<ThemeConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ThemeConfig | null>;
  updateTheme: (themeId: string, updates: Partial<ThemeConfig>) => Promise<ThemeConfig | null>;
  deleteTheme: (themeId: string) => Promise<boolean>;
  
  // Theme validation
  validateTheme: (colors: Partial<ThemeColors>) => boolean;
  
  // Real-time theme updates
  isThemeUpdateInProgress: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeId?: string;
  organizationId?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultThemeId = 'default',
  organizationId,
}) => {
  // State management
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig | null>(null);
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check system preference and local storage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme-dark-mode');
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isThemeUpdateInProgress, setIsThemeUpdateInProgress] = useState(false);

  const { user } = useAuth();

  // Apply CSS variables to document root
  const applyCssVariables = useCallback((colors: ThemeColors, isDark: boolean = false) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Apply theme colors to CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = CSS_VARIABLE_MAP[key as keyof ThemeColors];
      if (cssVar && value) {
        root.style.setProperty(cssVar, value);
      }
    });

    // Update dark mode class
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Load initial theme
  const loadInitialTheme = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Configure theme service with user context
      if (user) {
        themeService.config.userId = user.id;
        themeService.config.organizationId = organizationId || 'default-org';
      }

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Theme loading timeout')), 10000)
      );

      // Fetch available themes with fallback and timeout
      let themes: ThemeConfig[];
      try {
        const themesPromise = themeService.fetchAvailableThemes();
        themes = await Promise.race([themesPromise, timeoutPromise]) as ThemeConfig[];
        setAvailableThemes(themes);
      } catch (err) {
        console.warn('Failed to fetch available themes, using predefined themes:', err);
        themes = PREDEFINED_THEMES;
        setAvailableThemes(themes);
      }

      // Determine which theme to use (priority: user > organization > default)
      let themeToApply: ThemeConfig | null = null;

      // Try user preference first (with timeout)
      if (user) {
        try {
          const userThemePromise = themeService.fetchUserTheme();
          const userTheme = await Promise.race([userThemePromise, timeoutPromise]) as ThemeConfig | null;
          if (userTheme) {
            themeToApply = userTheme;
          }
        } catch (err) {
          console.warn('Failed to fetch user theme:', err);
        }
      }

      // Fall back to organization theme (with timeout)
      if (!themeToApply) {
        try {
          console.log('🏢 Attempting to fetch organization theme...');
          const orgThemePromise = themeService.fetchOrganizationTheme();
          const orgTheme = await Promise.race([orgThemePromise, timeoutPromise]) as ThemeConfig;
          if (orgTheme) {
            console.log('✅ Organization theme loaded:', orgTheme.name);
            themeToApply = orgTheme;
          } else {
            console.warn('🚨 Organization theme returned null');
          }
        } catch (err) {
          console.error('🚨 Failed to fetch organization theme:', err);
          // Error is already handled in themeService, continue to fallback
        }
      }

      // Final fallback to default theme
      if (!themeToApply) {
        themeToApply = themes.find(t => t.id === defaultThemeId) || 
                      themes.find(t => t.isDefault) || 
                      themes[0];
      }

      // Ensure we have a valid theme
      if (themeToApply) {
        setCurrentTheme(themeToApply);
        const colors = isDarkMode ? themeToApply.dark : themeToApply.light;
        applyCssVariables(colors, isDarkMode);
        console.log('Applied theme:', themeToApply.name);
      } else {
        throw new Error('No valid theme found');
      }
    } catch (err) {
      console.error('Error loading initial theme:', err);
      setError('Failed to load theme, using default');
      
      // Clear any hanging promises
      if (err instanceof Error && err.message.includes('timeout')) {
        console.warn('⏱️ Theme loading timed out, using emergency fallback');
      }
      
      // Create emergency fallback theme
      const emergencyTheme: ThemeConfig = {
        id: 'emergency-default',
        name: 'Default Theme',
        description: 'Emergency fallback theme',
        light: DEFAULT_LIGHT_THEME,
        dark: DEFAULT_DARK_THEME,
        isDefault: true,
      };
      
      setCurrentTheme(emergencyTheme);
      setAvailableThemes([emergencyTheme]);
      
      const fallbackColors = isDarkMode ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
      applyCssVariables(fallbackColors, isDarkMode);
    } finally {
      setIsLoading(false);
    }
  }, [user, defaultThemeId, isDarkMode, applyCssVariables]);

  // Apply theme by ID
  const applyTheme = useCallback(async (themeId: string): Promise<boolean> => {
    try {
      setIsThemeUpdateInProgress(true);
      setError(null);

      const theme = await themeService.fetchTheme(themeId);
      if (!theme) {
        setError(`Theme '${themeId}' not found`);
        return false;
      }

      // Validate theme before applying
      const colorsToValidate = isDarkMode ? theme.dark : theme.light;
      if (!validateThemeColors(colorsToValidate)) {
        setError('Invalid theme configuration');
        return false;
      }

      // Save user preference if user is logged in
      if (user) {
        await themeService.saveUserThemePreference(themeId);
      }

      // Apply theme
      setCurrentTheme(theme);
      const colors = isDarkMode ? theme.dark : theme.light;
      applyCssVariables(colors, isDarkMode);

      return true;
    } catch (err) {
      console.error('Error applying theme:', err);
      setError('Failed to apply theme');
      return false;
    } finally {
      setIsThemeUpdateInProgress(false);
    }
  }, [user, isDarkMode, applyCssVariables]);

  // Refresh available themes
  const refreshThemes = useCallback(async () => {
    try {
      const themes = await themeService.fetchAvailableThemes();
      setAvailableThemes(themes);
    } catch (err) {
      console.error('Error refreshing themes:', err);
      setError('Failed to refresh themes');
    }
  }, []);

  // Dark mode management
  const setDarkMode = useCallback((enabled: boolean) => {
    setIsDarkMode(enabled);
    localStorage.setItem('theme-dark-mode', JSON.stringify(enabled));
    
    // Apply current theme with new dark mode setting
    if (currentTheme) {
      const colors = enabled ? currentTheme.dark : currentTheme.light;
      applyCssVariables(colors, enabled);
    }
  }, [currentTheme, applyCssVariables]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!isDarkMode);
  }, [isDarkMode, setDarkMode]);

  // Custom theme management (admin only)
  const createCustomTheme = useCallback(async (
    theme: Omit<ThemeConfig, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ThemeConfig | null> => {
    try {
      const newTheme = await themeService.createCustomTheme(theme);
      if (newTheme) {
        await refreshThemes();
      }
      return newTheme;
    } catch (err) {
      console.error('Error creating custom theme:', err);
      setError('Failed to create theme');
      return null;
    }
  }, [refreshThemes]);

  const updateTheme = useCallback(async (
    themeId: string,
    updates: Partial<ThemeConfig>
  ): Promise<ThemeConfig | null> => {
    try {
      const updatedTheme = await themeService.updateTheme(themeId, updates);
      if (updatedTheme) {
        await refreshThemes();
        // If updating current theme, reapply it
        if (currentTheme?.id === themeId) {
          setCurrentTheme(updatedTheme);
          const colors = isDarkMode ? updatedTheme.dark : updatedTheme.light;
          applyCssVariables(colors, isDarkMode);
        }
      }
      return updatedTheme;
    } catch (err) {
      console.error('Error updating theme:', err);
      setError('Failed to update theme');
      return null;
    }
  }, [refreshThemes, currentTheme, isDarkMode, applyCssVariables]);

  const deleteTheme = useCallback(async (themeId: string): Promise<boolean> => {
    try {
      const success = await themeService.deleteTheme(themeId);
      if (success) {
        await refreshThemes();
        // If deleting current theme, switch to default
        if (currentTheme?.id === themeId) {
          await applyTheme(defaultThemeId);
        }
      }
      return success;
    } catch (err) {
      console.error('Error deleting theme:', err);
      setError('Failed to delete theme');
      return false;
    }
  }, [refreshThemes, currentTheme, applyTheme, defaultThemeId]);

  // Theme validation
  const validateTheme = useCallback((colors: Partial<ThemeColors>): boolean => {
    return validateThemeColors(colors);
  }, []);

  // Listen for system dark mode changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set preference
      const storedPreference = localStorage.getItem('theme-dark-mode');
      if (storedPreference === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setDarkMode]);

  // Initialize theme on mount
  useEffect(() => {
    loadInitialTheme();
  }, [loadInitialTheme]);

  // Re-apply theme when dark mode changes
  useEffect(() => {
    if (currentTheme) {
      const colors = isDarkMode ? currentTheme.dark : currentTheme.light;
      applyCssVariables(colors, isDarkMode);
    }
  }, [isDarkMode, currentTheme, applyCssVariables]);

  const contextValue: ThemeContextType = {
    currentTheme,
    isLoading,
    error,
    availableThemes,
    applyTheme,
    refreshThemes,
    isDarkMode,
    setDarkMode,
    toggleDarkMode,
    createCustomTheme,
    updateTheme,
    deleteTheme,
    validateTheme,
    isThemeUpdateInProgress,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for using theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};