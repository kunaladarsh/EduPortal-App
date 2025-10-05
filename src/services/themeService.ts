// Theme service for fetching and managing dynamic themes
import { ThemeConfig, PREDEFINED_THEMES } from '../constants/theme';
import { colorApiService, ColorApiResponse } from './colorApiService';

export interface ThemeServiceConfig {
  apiEndpoint?: string;
  organizationId?: string;
  userId?: string;
  fallbackTheme?: string;
}

export class ThemeService {
  public config: ThemeServiceConfig;
  private cache: Map<string, ThemeConfig> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(config: ThemeServiceConfig = {}) {
    this.config = {
      apiEndpoint: '/api/themes',
      fallbackTheme: 'default',
      ...config,
    };
  }

  /**
   * Fetch available themes from API
   */
  async fetchAvailableThemes(): Promise<ThemeConfig[]> {
    try {
      // Check cache first
      const cacheKey = 'available-themes';
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached as ThemeConfig[];
      }

      // Use the comprehensive color API service
      const response: ColorApiResponse = await colorApiService.fetchColorThemes();

      if (response.success && response.data) {
        const themes = [...PREDEFINED_THEMES, ...response.data];
        this.setCache(cacheKey, themes);
        console.log(`✅ Loaded ${themes.length} themes from API`);
        return themes;
      } else {
        throw new Error(response.error || 'Failed to fetch themes');
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      console.log('🔄 Falling back to predefined themes');
      // Return predefined themes as fallback
      return PREDEFINED_THEMES;
    }
  }

  /**
   * Fetch a specific theme by ID
   */
  async fetchTheme(themeId: string): Promise<ThemeConfig | null> {
    try {
      // Check cache first
      const cached = this.getFromCache(`theme-${themeId}`);
      if (cached) {
        return cached as ThemeConfig;
      }

      // Simulate API call
      const response = await this.simulateApiCall(`/themes/${themeId}`, {
        organizationId: this.config.organizationId,
      });

      if (response.success) {
        const theme = response.data as ThemeConfig;
        this.setCache(`theme-${themeId}`, theme);
        return theme;
      } else {
        throw new Error(response.error || 'Theme not found');
      }
    } catch (error) {
      console.error(`Error fetching theme ${themeId}:`, error);
      
      // Try to find in predefined themes first
      let theme = PREDEFINED_THEMES.find(t => t.id === themeId);
      
      // If not found, try fetching all available themes
      if (!theme) {
        try {
          const allThemes = await this.fetchAvailableThemes();
          theme = allThemes.find(t => t.id === themeId);
        } catch (err) {
          console.warn('Failed to fetch available themes for fallback:', err);
        }
      }
      
      return theme || null;
    }
  }

  /**
   * Fetch organization's default theme
   */
  async fetchOrganizationTheme(): Promise<ThemeConfig> {
    try {
      // Check cache first
      const cached = this.getFromCache('org-theme');
      if (cached) {
        console.log('📋 Using cached organization theme');
        return cached as ThemeConfig;
      }

      // Use organization-specific color API
      const orgId = this.config.organizationId || 'default-org';
      console.log(`🏢 Fetching organization theme for: ${orgId}`);
      
      const response: ColorApiResponse = await colorApiService.fetchOrganizationColors(orgId);

      if (response.success && response.theme) {
        const theme = response.theme;
        this.setCache('org-theme', theme);
        console.log(`✅ Applied organization theme: ${theme.name}`);
        return theme;
      } else {
        console.warn('🚨 Organization theme API failed:', response.error);
        // Don't throw error, fall through to fallback
      }
    } catch (error) {
      console.error('🚨 Error fetching organization theme:', error);
      // Don't throw error, fall through to fallback
    }

    // Always return a valid theme - fallback to default
    const fallbackTheme = PREDEFINED_THEMES.find(t => t.isDefault) || PREDEFINED_THEMES[0];
    console.log('🔄 Using fallback theme:', fallbackTheme.name);
    this.setCache('org-theme', fallbackTheme); // Cache the fallback too
    return fallbackTheme;
  }

  /**
   * Fetch user's preferred theme
   */
  async fetchUserTheme(): Promise<ThemeConfig | null> {
    try {
      if (!this.config.userId) {
        return null;
      }

      // Check cache first
      const cached = this.getFromCache('user-theme');
      if (cached) {
        return cached as ThemeConfig;
      }

      // Use user-specific color preferences API
      const response: ColorApiResponse = await colorApiService.fetchUserColorPreferences(this.config.userId);

      if (response.success && response.theme) {
        const theme = response.theme;
        this.setCache('user-theme', theme);
        console.log(`👤 Applied user theme: ${theme.name}`);
        return theme;
      }

      console.log('👤 No user theme preferences found');
      return null;
    } catch (error) {
      console.error('Error fetching user theme:', error);
      return null;
    }
  }

  /**
   * Save user theme preference
   */
  async saveUserThemePreference(themeId: string): Promise<boolean> {
    try {
      const response = await this.simulateApiCall('/themes/user', {
        userId: this.config.userId,
        themeId,
      }, 'POST');

      if (response.success) {
        // Clear user theme cache to force refresh
        this.clearCache('user-theme');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error saving user theme preference:', error);
      return false;
    }
  }

  /**
   * Create custom theme (admin only)
   */
  async createCustomTheme(theme: Omit<ThemeConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ThemeConfig | null> {
    try {
      const response = await this.simulateApiCall('/themes', {
        ...theme,
        organizationId: this.config.organizationId,
      }, 'POST');

      if (response.success) {
        const createdTheme = response.data as ThemeConfig;
        this.setCache(`theme-${createdTheme.id}`, createdTheme);
        // Clear available themes cache to include new theme
        this.clearCache('available-themes');
        return createdTheme;
      }

      return null;
    } catch (error) {
      console.error('Error creating custom theme:', error);
      return null;
    }
  }

  /**
   * Update existing theme (admin only)
   */
  async updateTheme(themeId: string, updates: Partial<ThemeConfig>): Promise<ThemeConfig | null> {
    try {
      const response = await this.simulateApiCall(`/themes/${themeId}`, {
        ...updates,
        organizationId: this.config.organizationId,
      }, 'PUT');

      if (response.success) {
        const updatedTheme = response.data as ThemeConfig;
        this.setCache(`theme-${themeId}`, updatedTheme);
        // Clear caches to reflect updates
        this.clearCache('available-themes');
        this.clearCache('org-theme');
        return updatedTheme;
      }

      return null;
    } catch (error) {
      console.error('Error updating theme:', error);
      return null;
    }
  }

  /**
   * Delete theme (admin only)
   */
  async deleteTheme(themeId: string): Promise<boolean> {
    try {
      const response = await this.simulateApiCall(`/themes/${themeId}`, {
        organizationId: this.config.organizationId,
      }, 'DELETE');

      if (response.success) {
        // Clear all related caches
        this.clearCache(`theme-${themeId}`);
        this.clearCache('available-themes');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting theme:', error);
      return false;
    }
  }

  // Cache management
  private getFromCache(key: string): any {
    const expiry = this.cacheExpiry.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  private setCache(key: string, value: any): void {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  private clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
    } else {
      this.cache.clear();
      this.cacheExpiry.clear();
    }
  }

  // Simulate API calls with comprehensive dummy color data
  private async simulateApiCall(
    endpoint: string,
    params: any = {},
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Simulate realistic network delay
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

      // Mock responses based on endpoint with comprehensive color schemes
      if (endpoint === '/themes') {
        if (method === 'GET') {
          return {
            success: true,
            data: [
              ...PREDEFINED_THEMES,
              // Extended mock custom themes with full color palettes
              {
                id: 'custom-corporate',
                name: 'Corporate Blue',
                description: 'Professional corporate theme for business environments',
                light: {
                  background: '#FAFBFF',
                  foreground: '#1E293B',
                  card: '#F1F5F9',
                  cardForeground: '#1E293B',
                  popover: '#FFFFFF',
                  popoverForeground: '#1E293B',
                  primary: '#1E40AF',
                  primaryForeground: '#FFFFFF',
                  secondary: '#64748B',
                  secondaryForeground: '#FFFFFF',
                  accent: '#0EA5E9',
                  accentForeground: '#FFFFFF',
                  muted: '#F8FAFC',
                  mutedForeground: '#64748B',
                  destructive: '#DC2626',
                  destructiveForeground: '#FFFFFF',
                  border: '#E2E8F0',
                  input: 'transparent',
                  inputBackground: '#FFFFFF',
                  switchBackground: '#E2E8F0',
                  ring: '#1E40AF',
                  chart1: '#1E40AF',
                  chart2: '#0EA5E9',
                  chart3: '#64748B',
                  chart4: '#059669',
                  chart5: '#D97706',
                  sidebar: '#F8FAFC',
                  sidebarForeground: '#1E293B',
                  sidebarPrimary: '#1E40AF',
                  sidebarPrimaryForeground: '#FFFFFF',
                  sidebarAccent: '#F1F5F9',
                  sidebarAccentForeground: '#1E293B',
                  sidebarBorder: '#E2E8F0',
                  sidebarRing: '#1E40AF',
                },
                dark: {
                  background: '#0F172A',
                  foreground: '#F1F5F9',
                  card: '#1E293B',
                  cardForeground: '#F1F5F9',
                  popover: '#1E293B',
                  popoverForeground: '#F1F5F9',
                  primary: '#3B82F6',
                  primaryForeground: '#FFFFFF',
                  secondary: '#64748B',
                  secondaryForeground: '#FFFFFF',
                  accent: '#0EA5E9',
                  accentForeground: '#FFFFFF',
                  muted: '#334155',
                  mutedForeground: '#94A3B8',
                  destructive: '#EF4444',
                  destructiveForeground: '#FFFFFF',
                  border: '#475569',
                  input: '#334155',
                  inputBackground: '#334155',
                  switchBackground: '#475569',
                  ring: '#3B82F6',
                  chart1: '#3B82F6',
                  chart2: '#0EA5E9',
                  chart3: '#64748B',
                  chart4: '#10B981',
                  chart5: '#F59E0B',
                  sidebar: '#1E293B',
                  sidebarForeground: '#F1F5F9',
                  sidebarPrimary: '#3B82F6',
                  sidebarPrimaryForeground: '#FFFFFF',
                  sidebarAccent: '#334155',
                  sidebarAccentForeground: '#F1F5F9',
                  sidebarBorder: '#475569',
                  sidebarRing: '#3B82F6',
                },
              },
              {
                id: 'custom-nature',
                name: 'Nature Green',
                description: 'Fresh, natural theme inspired by forests and growth',
                light: {
                  background: '#F9FBF7',
                  foreground: '#1C2B20',
                  card: '#F0F9F0',
                  cardForeground: '#1C2B20',
                  popover: '#FFFFFF',
                  popoverForeground: '#1C2B20',
                  primary: '#16A34A',
                  primaryForeground: '#FFFFFF',
                  secondary: '#059669',
                  secondaryForeground: '#FFFFFF',
                  accent: '#84CC16',
                  accentForeground: '#FFFFFF',
                  muted: '#F7F8F7',
                  mutedForeground: '#6B7280',
                  destructive: '#DC2626',
                  destructiveForeground: '#FFFFFF',
                  border: '#D1D5DB',
                  input: 'transparent',
                  inputBackground: '#FFFFFF',
                  switchBackground: '#D1D5DB',
                  ring: '#16A34A',
                  chart1: '#16A34A',
                  chart2: '#059669',
                  chart3: '#84CC16',
                  chart4: '#22D3EE',
                  chart5: '#FCD34D',
                  sidebar: '#F7F8F7',
                  sidebarForeground: '#1C2B20',
                  sidebarPrimary: '#16A34A',
                  sidebarPrimaryForeground: '#FFFFFF',
                  sidebarAccent: '#F0F9F0',
                  sidebarAccentForeground: '#1C2B20',
                  sidebarBorder: '#D1D5DB',
                  sidebarRing: '#16A34A',
                },
                dark: {
                  background: '#0F1B13',
                  foreground: '#F0F9F0',
                  card: '#1A2E1E',
                  cardForeground: '#F0F9F0',
                  popover: '#1A2E1E',
                  popoverForeground: '#F0F9F0',
                  primary: '#22C55E',
                  primaryForeground: '#FFFFFF',
                  secondary: '#10B981',
                  secondaryForeground: '#FFFFFF',
                  accent: '#84CC16',
                  accentForeground: '#FFFFFF',
                  muted: '#374151',
                  mutedForeground: '#9CA3AF',
                  destructive: '#EF4444',
                  destructiveForeground: '#FFFFFF',
                  border: '#4B5563',
                  input: '#374151',
                  inputBackground: '#374151',
                  switchBackground: '#4B5563',
                  ring: '#22C55E',
                  chart1: '#22C55E',
                  chart2: '#10B981',
                  chart3: '#84CC16',
                  chart4: '#06B6D4',
                  chart5: '#FDE047',
                  sidebar: '#1A2E1E',
                  sidebarForeground: '#F0F9F0',
                  sidebarPrimary: '#22C55E',
                  sidebarPrimaryForeground: '#FFFFFF',
                  sidebarAccent: '#374151',
                  sidebarAccentForeground: '#F0F9F0',
                  sidebarBorder: '#4B5563',
                  sidebarRing: '#22C55E',
                },
              },
              {
                id: 'custom-sunset',
                name: 'Sunset Dreams',
                description: 'Warm, energetic theme with sunset-inspired colors',
                light: {
                  background: '#FFF8F1',
                  foreground: '#451A03',
                  card: '#FEF3E7',
                  cardForeground: '#451A03',
                  popover: '#FFFFFF',
                  popoverForeground: '#451A03',
                  primary: '#EA580C',
                  primaryForeground: '#FFFFFF',
                  secondary: '#F59E0B',
                  secondaryForeground: '#FFFFFF',
                  accent: '#EF4444',
                  accentForeground: '#FFFFFF',
                  muted: '#FEF7ED',
                  mutedForeground: '#92400E',
                  destructive: '#DC2626',
                  destructiveForeground: '#FFFFFF',
                  border: '#FED7AA',
                  input: 'transparent',
                  inputBackground: '#FFFFFF',
                  switchBackground: '#FED7AA',
                  ring: '#EA580C',
                  chart1: '#EA580C',
                  chart2: '#F59E0B',
                  chart3: '#EF4444',
                  chart4: '#EC4899',
                  chart5: '#8B5CF6',
                  sidebar: '#FEF7ED',
                  sidebarForeground: '#451A03',
                  sidebarPrimary: '#EA580C',
                  sidebarPrimaryForeground: '#FFFFFF',
                  sidebarAccent: '#FEF3E7',
                  sidebarAccentForeground: '#451A03',
                  sidebarBorder: '#FED7AA',
                  sidebarRing: '#EA580C',
                },
                dark: {
                  background: '#1C1917',
                  foreground: '#FEF3E7',
                  card: '#292524',
                  cardForeground: '#FEF3E7',
                  popover: '#292524',
                  popoverForeground: '#FEF3E7',
                  primary: '#FB923C',
                  primaryForeground: '#FFFFFF',
                  secondary: '#FBBF24',
                  secondaryForeground: '#FFFFFF',
                  accent: '#F87171',
                  accentForeground: '#FFFFFF',
                  muted: '#44403C',
                  mutedForeground: '#A8A29E',
                  destructive: '#EF4444',
                  destructiveForeground: '#FFFFFF',
                  border: '#57534E',
                  input: '#44403C',
                  inputBackground: '#44403C',
                  switchBackground: '#57534E',
                  ring: '#FB923C',
                  chart1: '#FB923C',
                  chart2: '#FBBF24',
                  chart3: '#F87171',
                  chart4: '#F472B6',
                  chart5: '#A78BFA',
                  sidebar: '#292524',
                  sidebarForeground: '#FEF3E7',
                  sidebarPrimary: '#FB923C',
                  sidebarPrimaryForeground: '#FFFFFF',
                  sidebarAccent: '#44403C',
                  sidebarAccentForeground: '#FEF3E7',
                  sidebarBorder: '#57534E',
                  sidebarRing: '#FB923C',
                },
              },
              {
                id: 'custom-ocean',
                name: 'Deep Ocean',
                description: 'Calming deep blue theme reminiscent of ocean depths',
                light: {
                  background: '#F0F9FF',
                  foreground: '#0C4A6E',
                  card: '#E0F2FE',
                  cardForeground: '#0C4A6E',
                  popover: '#FFFFFF',
                  popoverForeground: '#0C4A6E',
                  primary: '#0284C7',
                  primaryForeground: '#FFFFFF',
                  secondary: '#0EA5E9',
                  secondaryForeground: '#FFFFFF',
                  accent: '#06B6D4',
                  accentForeground: '#FFFFFF',
                  muted: '#F0F9FF',
                  mutedForeground: '#0369A1',
                  destructive: '#DC2626',
                  destructiveForeground: '#FFFFFF',
                  border: '#BAE6FD',
                  input: 'transparent',
                  inputBackground: '#FFFFFF',
                  switchBackground: '#BAE6FD',
                  ring: '#0284C7',
                  chart1: '#0284C7',
                  chart2: '#0EA5E9',
                  chart3: '#06B6D4',
                  chart4: '#22D3EE',
                  chart5: '#67E8F9',
                  sidebar: '#F0F9FF',
                  sidebarForeground: '#0C4A6E',
                  sidebarPrimary: '#0284C7',
                  sidebarPrimaryForeground: '#FFFFFF',
                  sidebarAccent: '#E0F2FE',
                  sidebarAccentForeground: '#0C4A6E',
                  sidebarBorder: '#BAE6FD',
                  sidebarRing: '#0284C7',
                },
                dark: {
                  background: '#0F172A',
                  foreground: '#E0F2FE',
                  card: '#1E293B',
                  cardForeground: '#E0F2FE',
                  popover: '#1E293B',
                  popoverForeground: '#E0F2FE',
                  primary: '#38BDF8',
                  primaryForeground: '#FFFFFF',
                  secondary: '#0EA5E9',
                  secondaryForeground: '#FFFFFF',
                  accent: '#22D3EE',
                  accentForeground: '#FFFFFF',
                  muted: '#334155',
                  mutedForeground: '#94A3B8',
                  destructive: '#EF4444',
                  destructiveForeground: '#FFFFFF',
                  border: '#475569',
                  input: '#334155',
                  inputBackground: '#334155',
                  switchBackground: '#475569',
                  ring: '#38BDF8',
                  chart1: '#38BDF8',
                  chart2: '#0EA5E9',
                  chart3: '#22D3EE',
                  chart4: '#67E8F9',
                  chart5: '#A5F3FC',
                  sidebar: '#1E293B',
                  sidebarForeground: '#E0F2FE',
                  sidebarPrimary: '#38BDF8',
                  sidebarPrimaryForeground: '#FFFFFF',
                  sidebarAccent: '#334155',
                  sidebarAccentForeground: '#E0F2FE',
                  sidebarBorder: '#475569',
                  sidebarRing: '#38BDF8',
                },
              },
            ],
          };
        } else if (method === 'POST') {
          // Simulate creating new theme with random colors
          const colorVariations = [
            { primary: '#7C3AED', secondary: '#0EA5E9', accent: '#FB7185' },
            { primary: '#16A34A', secondary: '#059669', accent: '#84CC16' },
            { primary: '#EA580C', secondary: '#F59E0B', accent: '#EF4444' },
            { primary: '#0284C7', secondary: '#0EA5E9', accent: '#06B6D4' },
            { primary: '#DC2626', secondary: '#EF4444', accent: '#F87171' },
          ];
          const randomColors = colorVariations[Math.floor(Math.random() * colorVariations.length)];
          
          const newTheme: ThemeConfig = {
            ...params,
            id: `custom-${Date.now()}`,
            light: {
              ...PREDEFINED_THEMES[0].light,
              ...randomColors,
              ring: randomColors.primary,
              chart1: randomColors.primary,
              sidebarPrimary: randomColors.primary,
              sidebarRing: randomColors.primary,
            },
            dark: {
              ...PREDEFINED_THEMES[0].dark,
              ...randomColors,
              ring: randomColors.primary,
              chart1: randomColors.primary,
              sidebarPrimary: randomColors.primary,
              sidebarRing: randomColors.primary,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { success: true, data: newTheme };
        }
      }

      if (endpoint.startsWith('/themes/')) {
        const pathParts = endpoint.split('/');
        
        // Handle /themes/organization endpoint
        if (pathParts[2] === 'organization') {
          const defaultTheme = PREDEFINED_THEMES.find(t => t.isDefault);
          return {
            success: true,
            data: defaultTheme || PREDEFINED_THEMES[0],
          };
        }
        
        // Handle /themes/user endpoint
        if (pathParts[2] === 'user') {
          if (method === 'GET') {
            // Simulate user has a preferred theme (20% chance)
            return {
              success: true,
              data: Math.random() > 0.8 ? PREDEFINED_THEMES[1] : null,
            };
          } else if (method === 'POST') {
            return { success: true };
          }
        }
        
        // Handle individual theme by ID
        const themeId = pathParts[2];
        if (themeId && method === 'GET') {
          // First check PREDEFINED_THEMES
          let theme = PREDEFINED_THEMES.find(t => t.id === themeId);
          
          // If not found, check if it's an organization theme
          if (!theme && themeId.startsWith('org-')) {
            try {
              const orgId = themeId.replace('org-', '');
              const orgResponse = await colorApiService.fetchOrganizationColors(orgId);
              if (orgResponse.success && orgResponse.theme) {
                theme = orgResponse.theme;
              }
            } catch (error) {
              console.warn('Failed to fetch organization theme:', error);
            }
          }
          
          // If not found, check if it's a user theme
          if (!theme && themeId.startsWith('user-')) {
            try {
              const userId = themeId.replace('user-', '');
              const userResponse = await colorApiService.fetchUserColorPreferences(userId);
              if (userResponse.success && userResponse.theme) {
                theme = userResponse.theme;
              }
            } catch (error) {
              console.warn('Failed to fetch user theme:', error);
            }
          }
          
          // If still not found, try to get from colorApiService dummy themes
          if (!theme) {
            try {
              const colorApiResponse = await colorApiService.fetchColorThemes();
              if (colorApiResponse.success && colorApiResponse.data) {
                theme = colorApiResponse.data.find((t: ThemeConfig) => t.id === themeId);
              }
            } catch (error) {
              console.warn('Failed to fetch from colorApiService:', error);
            }
          }
          
          if (theme) {
            return { success: true, data: theme };
          }
          return { success: false, error: `Theme with ID '${themeId}' not found` };
        }
        
        if (method === 'PUT') {
          const existingTheme = PREDEFINED_THEMES.find(t => t.id === themeId);
          if (existingTheme) {
            const updatedTheme = {
              ...existingTheme,
              ...params,
              updatedAt: new Date().toISOString(),
            };
            return { success: true, data: updatedTheme };
          }
          return { success: false, error: 'Theme not found' };
        }
        
        if (method === 'DELETE') {
          return { success: true };
        }
      }

      // Fallback for unhandled endpoints
      return { 
        success: false, 
        error: `API endpoint '${endpoint}' with method '${method}' not implemented` 
      };
    } catch (error) {
      console.error('Error in simulateApiCall:', error);
      return { 
        success: false, 
        error: 'Internal API simulation error' 
      };
    }
  }
}

// Default theme service instance
export const themeService = new ThemeService();