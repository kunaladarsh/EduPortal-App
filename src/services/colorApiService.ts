// Comprehensive Color API Service for dynamic theme responses
import { ThemeConfig, ThemeColors } from '../constants/theme';

export interface ColorApiResponse {
  success: boolean;
  data?: ThemeConfig[];
  theme?: ThemeConfig;
  error?: string;
  timestamp: string;
  version: string;
}

export interface OrganizationColorConfig {
  organizationId: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    logo: string[];
  };
  customizations: {
    allowUserThemes: boolean;
    defaultTheme: string;
    availableThemes: string[];
  };
}

export class ColorApiService {
  private baseUrl = '/api/v1/colors';
  private cache = new Map<string, { data: any; expiry: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch all available color themes
   */
  async fetchColorThemes(): Promise<ColorApiResponse> {
    try {
      // Simulate API call with realistic delay
      await this.simulateNetworkDelay();

      const dummyThemes = this.generateDummyThemes();
      
      return {
        success: true,
        data: dummyThemes,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch color themes',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    }
  }

  /**
   * Fetch organization-specific colors
   */
  async fetchOrganizationColors(orgId: string): Promise<ColorApiResponse> {
    try {
      await this.simulateNetworkDelay();

      // Validate organization ID
      if (!orgId || typeof orgId !== 'string') {
        throw new Error('Invalid organization ID provided');
      }

      const orgConfig = this.generateOrganizationTheme(orgId);
      
      if (!orgConfig) {
        throw new Error('Failed to generate organization theme');
      }
      
      return {
        success: true,
        theme: orgConfig,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    } catch (error) {
      console.error('Organization colors API error:', error);
      return {
        success: false,
        error: `Failed to fetch colors for organization ${orgId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    }
  }

  /**
   * Fetch user-specific color preferences
   */
  async fetchUserColorPreferences(userId: string): Promise<ColorApiResponse> {
    try {
      await this.simulateNetworkDelay();

      // 30% chance user has custom preferences
      if (Math.random() > 0.7) {
        const userTheme = this.generateUserTheme(userId);
        return {
          success: true,
          theme: userTheme,
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        };
      }

      return {
        success: true,
        theme: null,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch user preferences for ${userId}`,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    }
  }

  /**
   * Generate dynamic color variations
   */
  async fetchDynamicColors(seed?: string): Promise<ColorApiResponse> {
    try {
      await this.simulateNetworkDelay();

      const dynamicTheme = this.generateDynamicTheme(seed);
      
      return {
        success: true,
        theme: dynamicTheme,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate dynamic colors',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    }
  }

  // Private helper methods

  private async simulateNetworkDelay(): Promise<void> {
    try {
      const delay = 50 + Math.random() * 100; // Much faster: 50-150ms
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.warn('Network delay simulation error:', error);
      // Don't throw, just continue
    }
  }

  private generateDummyThemes(): ThemeConfig[] {
    return [
      // Educational Themes
      {
        id: 'edu-classic',
        name: 'Education Classic',
        description: 'Traditional educational colors promoting focus and learning',
        light: this.createColorPalette('#1E40AF', '#059669', '#0EA5E9', 'light'),
        dark: this.createColorPalette('#3B82F6', '#10B981', '#38BDF8', 'dark'),
      },
      {
        id: 'edu-vibrant',
        name: 'Vibrant Learning',
        description: 'Energetic colors to inspire creativity and engagement',
        light: this.createColorPalette('#7C3AED', '#EC4899', '#F59E0B', 'light'),
        dark: this.createColorPalette('#8B5CF6', '#F472B6', '#FBBF24', 'dark'),
      },
      {
        id: 'edu-nature',
        name: 'Nature Study',
        description: 'Earth tones for environmental and science education',
        light: this.createColorPalette('#16A34A', '#84CC16', '#059669', 'light'),
        dark: this.createColorPalette('#22C55E', '#A3E635', '#10B981', 'dark'),
      },
      
      // Professional Themes
      {
        id: 'pro-corporate',
        name: 'Corporate Professional',
        description: 'Sophisticated colors for professional environments',
        light: this.createColorPalette('#1E3A8A', '#374151', '#6B7280', 'light'),
        dark: this.createColorPalette('#3B82F6', '#4B5563', '#9CA3AF', 'dark'),
      },
      {
        id: 'pro-medical',
        name: 'Medical Care',
        description: 'Clean, trustworthy colors for healthcare education',
        light: this.createColorPalette('#0891B2', '#059669', '#DC2626', 'light'),
        dark: this.createColorPalette('#06B6D4', '#10B981', '#EF4444', 'dark'),
      },
      
      // Accessibility Themes
      {
        id: 'access-high-contrast',
        name: 'High Contrast',
        description: 'Maximum contrast for visual accessibility',
        light: this.createColorPalette('#000000', '#1F2937', '#374151', 'light-high-contrast'),
        dark: this.createColorPalette('#FFFFFF', '#F9FAFB', '#F3F4F6', 'dark-high-contrast'),
      },
      {
        id: 'access-colorblind',
        name: 'Colorblind Friendly',
        description: 'Optimized for color vision deficiency',
        light: this.createColorPalette('#0F4C75', '#2E8B57', '#B8860B', 'light'),
        dark: this.createColorPalette('#4682B4', '#3CB371', '#DAA520', 'dark'),
      },

      // Seasonal Themes
      {
        id: 'seasonal-spring',
        name: 'Spring Fresh',
        description: 'Fresh spring colors for new beginnings',
        light: this.createColorPalette('#22C55E', '#84CC16', '#06B6D4', 'light'),
        dark: this.createColorPalette('#4ADE80', '#A3E635', '#22D3EE', 'dark'),
      },
      {
        id: 'seasonal-autumn',
        name: 'Autumn Warmth',
        description: 'Warm autumn colors for cozy learning',
        light: this.createColorPalette('#EA580C', '#F59E0B', '#DC2626', 'light'),
        dark: this.createColorPalette('#FB923C', '#FBBF24', '#F87171', 'dark'),
      },

      // Custom Brand Themes
      {
        id: 'brand-tech',
        name: 'Tech Innovation',
        description: 'Modern tech-inspired color scheme',
        light: this.createColorPalette('#6366F1', '#8B5CF6', '#EC4899', 'light'),
        dark: this.createColorPalette('#818CF8', '#A78BFA', '#F472B6', 'dark'),
      },
      {
        id: 'brand-creative',
        name: 'Creative Arts',
        description: 'Artistic colors for creative subjects',
        light: this.createColorPalette('#EC4899', '#8B5CF6', '#F59E0B', 'light'),
        dark: this.createColorPalette('#F472B6', '#A78BFA', '#FBBF24', 'dark'),
      },

      // Beautiful Modern Themes
      {
        id: 'modern-lavender-mint',
        name: 'Lavender & Mint',
        description: 'Soft, calming pastels perfect for focus and tranquility',
        light: this.createColorPalette('#8B5CF6', '#10B981', '#06B6D4', 'light'),
        dark: this.createColorPalette('#A78BFA', '#34D399', '#22D3EE', 'dark'),
      },
      {
        id: 'modern-coral-teal',
        name: 'Coral & Teal',
        description: 'Vibrant complementary colors that energize and inspire',
        light: this.createColorPalette('#F97316', '#0D9488', '#EC4899', 'light'),
        dark: this.createColorPalette('#FB923C', '#14B8A6', '#F472B6', 'dark'),
      },
      {
        id: 'modern-sage-terracotta',
        name: 'Sage & Terracotta',
        description: 'Earthy sophistication with natural warmth',
        light: this.createColorPalette('#059669', '#EA580C', '#8B5CF6', 'light'),
        dark: this.createColorPalette('#10B981', '#FB923C', '#A78BFA', 'dark'),
      },
      {
        id: 'modern-indigo-gold',
        name: 'Indigo & Gold',
        description: 'Royal elegance with luxurious golden accents',
        light: this.createColorPalette('#4338CA', '#F59E0B', '#EC4899', 'light'),
        dark: this.createColorPalette('#6366F1', '#FBBF24', '#F472B6', 'dark'),
      },
      {
        id: 'modern-forest-rose-gold',
        name: 'Forest & Rose Gold',
        description: 'Natural luxury combining deep greens with warm metallics',
        light: this.createColorPalette('#166534', '#EA580C', '#0EA5E9', 'light'),
        dark: this.createColorPalette('#22C55E', '#FB923C', '#38BDF8', 'dark'),
      },
      {
        id: 'modern-midnight-aurora',
        name: 'Midnight Aurora',
        description: 'Dark elegance with bright, magical accent colors',
        light: this.createColorPalette('#1E1B4B', '#A855F7', '#06B6D4', 'light'),
        dark: this.createColorPalette('#312E81', '#C084FC', '#22D3EE', 'dark'),
      },
      {
        id: 'modern-sunset-gradient',
        name: 'Sunset Dreams',
        description: 'Warm gradient colors inspired by beautiful sunsets',
        light: this.createColorPalette('#F97316', '#EC4899', '#EAB308', 'light'),
        dark: this.createColorPalette('#FB923C', '#F472B6', '#FDE047', 'dark'),
      },
      {
        id: 'modern-nordic-cool',
        name: 'Nordic Cool',
        description: 'Clean, minimalist colors inspired by Scandinavian design',
        light: this.createColorPalette('#1E40AF', '#64748B', '#06B6D4', 'light'),
        dark: this.createColorPalette('#3B82F6', '#94A3B8', '#22D3EE', 'dark'),
      },
      {
        id: 'modern-cherry-blossom',
        name: 'Cherry Blossom',
        description: 'Delicate pink tones with soft, peaceful accents',
        light: this.createColorPalette('#EC4899', '#F472B6', '#8B5CF6', 'light'),
        dark: this.createColorPalette('#F472B6', '#F9A8D4', '#A78BFA', 'dark'),
      },
      {
        id: 'modern-deep-sea',
        name: 'Deep Sea',
        description: 'Rich oceanic blues and teals for depth and tranquility',
        light: this.createColorPalette('#0F766E', '#0284C7', '#1E40AF', 'light'),
        dark: this.createColorPalette('#14B8A6', '#0EA5E9', '#3B82F6', 'dark'),
      },
      {
        id: 'modern-volcanic',
        name: 'Volcanic Energy',
        description: 'Bold, energetic colors inspired by volcanic landscapes',
        light: this.createColorPalette('#DC2626', '#EA580C', '#7C2D12', 'light'),
        dark: this.createColorPalette('#EF4444', '#FB923C', '#A16207', 'dark'),
      },
      {
        id: 'modern-amethyst-jade',
        name: 'Amethyst & Jade',
        description: 'Precious gemstone colors for sophisticated learning',
        light: this.createColorPalette('#7C3AED', '#059669', '#0284C7', 'light'),
        dark: this.createColorPalette('#8B5CF6', '#10B981', '#0EA5E9', 'dark'),
      },
      {
        id: 'modern-aurora-borealis',
        name: 'Aurora Borealis',
        description: 'Mystical northern lights with shifting color harmonies',
        light: this.createColorPalette('#06B6D4', '#8B5CF6', '#10B981', 'light'),
        dark: this.createColorPalette('#22D3EE', '#A78BFA', '#34D399', 'dark'),
      },
      {
        id: 'modern-golden-hour',
        name: 'Golden Hour',
        description: 'Warm, inspiring colors from the perfect lighting moment',
        light: this.createColorPalette('#F59E0B', '#EA580C', '#DC2626', 'light'),
        dark: this.createColorPalette('#FBBF24', '#FB923C', '#F87171', 'dark'),
      },
      {
        id: 'modern-peacock',
        name: 'Peacock Elegance',
        description: 'Rich, iridescent colors inspired by peacock feathers',
        light: this.createColorPalette('#0F766E', '#1E40AF', '#7C3AED', 'light'),
        dark: this.createColorPalette('#14B8A6', '#3B82F6', '#8B5CF6', 'dark'),
      },
      {
        id: 'modern-rose-quartz',
        name: 'Rose Quartz Serenity',
        description: 'Gentle, healing colors promoting calm and focus',
        light: this.createColorPalette('#F472B6', '#A78BFA', '#06B6D4', 'light'),
        dark: this.createColorPalette('#F9A8D4', '#C4B5FD', '#22D3EE', 'dark'),
      },
      {
        id: 'modern-cosmic-nebula',
        name: 'Cosmic Nebula',
        description: 'Deep space colors with stellar purple and blue tones',
        light: this.createColorPalette('#4C1D95', '#1E40AF', '#7C3AED', 'light'),
        dark: this.createColorPalette('#6D28D9', '#3B82F6', '#8B5CF6', 'dark'),
      },
      {
        id: 'modern-tropical-paradise',
        name: 'Tropical Paradise',
        description: 'Vibrant tropical colors bringing energy and joy',
        light: this.createColorPalette('#059669', '#06B6D4', '#F59E0B', 'light'),
        dark: this.createColorPalette('#10B981', '#22D3EE', '#FBBF24', 'dark'),
      },
      {
        id: 'modern-arctic-frost',
        name: 'Arctic Frost',
        description: 'Cool, crisp colors inspired by pristine arctic landscapes',
        light: this.createColorPalette('#0EA5E9', '#64748B', '#A855F7', 'light'),
        dark: this.createColorPalette('#38BDF8', '#94A3B8', '#C084FC', 'dark'),
      },
      {
        id: 'modern-burgundy-gold',
        name: 'Burgundy & Gold',
        description: 'Classic luxury combination with sophisticated warmth',
        light: this.createColorPalette('#991B1B', '#F59E0B', '#0F766E', 'light'),
        dark: this.createColorPalette('#DC2626', '#FBBF24', '#14B8A6', 'dark'),
      },
    ];
  }

  private createColorPalette(primary: string, secondary: string, accent: string, mode: string): ThemeColors {
    try {
      // Validate input colors
      if (!primary || !secondary || !accent || !mode) {
        throw new Error('Invalid color parameters provided');
      }
      
      const isLight = mode.includes('light');
      const isHighContrast = mode.includes('high-contrast');
      
      if (isHighContrast) {
      return isLight ? {
        background: '#FFFFFF',
        foreground: '#000000',
        card: '#FFFFFF',
        cardForeground: '#000000',
        popover: '#FFFFFF',
        popoverForeground: '#000000',
        primary: primary,
        primaryForeground: '#FFFFFF',
        secondary: secondary,
        secondaryForeground: '#FFFFFF',
        accent: accent,
        accentForeground: '#FFFFFF',
        muted: '#F8F9FA',
        mutedForeground: '#000000',
        destructive: '#DC2626',
        destructiveForeground: '#FFFFFF',
        border: '#000000',
        input: 'transparent',
        inputBackground: '#FFFFFF',
        switchBackground: '#E5E7EB',
        ring: primary,
        chart1: primary,
        chart2: secondary,
        chart3: accent,
        chart4: '#059669',
        chart5: '#DC2626',
        sidebar: '#FFFFFF',
        sidebarForeground: '#000000',
        sidebarPrimary: primary,
        sidebarPrimaryForeground: '#FFFFFF',
        sidebarAccent: '#F8F9FA',
        sidebarAccentForeground: '#000000',
        sidebarBorder: '#000000',
        sidebarRing: primary,
      } : {
        background: '#000000',
        foreground: '#FFFFFF',
        card: '#111111',
        cardForeground: '#FFFFFF',
        popover: '#111111',
        popoverForeground: '#FFFFFF',
        primary: primary,
        primaryForeground: '#000000',
        secondary: secondary,
        secondaryForeground: '#000000',
        accent: accent,
        accentForeground: '#000000',
        muted: '#1F1F1F',
        mutedForeground: '#FFFFFF',
        destructive: '#EF4444',
        destructiveForeground: '#000000',
        border: '#FFFFFF',
        input: '#333333',
        inputBackground: '#333333',
        switchBackground: '#555555',
        ring: primary,
        chart1: primary,
        chart2: secondary,
        chart3: accent,
        chart4: '#10B981',
        chart5: '#F59E0B',
        sidebar: '#000000',
        sidebarForeground: '#FFFFFF',
        sidebarPrimary: primary,
        sidebarPrimaryForeground: '#000000',
        sidebarAccent: '#1F1F1F',
        sidebarAccentForeground: '#FFFFFF',
        sidebarBorder: '#FFFFFF',
        sidebarRing: primary,
      };
    }

    // Regular themes
    return isLight ? {
      background: '#FAFBFC',
      foreground: '#1F2937',
      card: '#FFFFFF',
      cardForeground: '#1F2937',
      popover: '#FFFFFF',
      popoverForeground: '#1F2937',
      primary: primary,
      primaryForeground: '#FFFFFF',
      secondary: secondary,
      secondaryForeground: '#FFFFFF',
      accent: accent,
      accentForeground: '#FFFFFF',
      muted: '#F3F4F6',
      mutedForeground: '#6B7280',
      destructive: '#DC2626',
      destructiveForeground: '#FFFFFF',
      border: '#E5E7EB',
      input: 'transparent',
      inputBackground: '#FFFFFF',
      switchBackground: '#E5E7EB',
      ring: primary,
      chart1: primary,
      chart2: secondary,
      chart3: accent,
      chart4: '#059669',
      chart5: '#F59E0B',
      sidebar: '#F9FAFB',
      sidebarForeground: '#1F2937',
      sidebarPrimary: primary,
      sidebarPrimaryForeground: '#FFFFFF',
      sidebarAccent: '#F3F4F6',
      sidebarAccentForeground: '#1F2937',
      sidebarBorder: '#E5E7EB',
      sidebarRing: primary,
    } : {
      background: '#111827',
      foreground: '#F9FAFB',
      card: '#1F2937',
      cardForeground: '#F9FAFB',
      popover: '#1F2937',
      popoverForeground: '#F9FAFB',
      primary: primary,
      primaryForeground: '#FFFFFF',
      secondary: secondary,
      secondaryForeground: '#FFFFFF',
      accent: accent,
      accentForeground: '#FFFFFF',
      muted: '#374151',
      mutedForeground: '#9CA3AF',
      destructive: '#EF4444',
      destructiveForeground: '#FFFFFF',
      border: '#4B5563',
      input: '#374151',
      inputBackground: '#374151',
      switchBackground: '#4B5563',
      ring: primary,
      chart1: primary,
      chart2: secondary,
      chart3: accent,
      chart4: '#10B981',
      chart5: '#FBBF24',
      sidebar: '#1F2937',
      sidebarForeground: '#F9FAFB',
      sidebarPrimary: primary,
      sidebarPrimaryForeground: '#FFFFFF',
      sidebarAccent: '#374151',
      sidebarAccentForeground: '#F9FAFB',
      sidebarBorder: '#4B5563',
      sidebarRing: primary,
    };
    } catch (error) {
      console.error('Error creating color palette:', error);
      // Return a safe fallback palette
      return {
        background: isLight ? '#FFFFFF' : '#000000',
        foreground: isLight ? '#000000' : '#FFFFFF',
        card: isLight ? '#F8F9FA' : '#1F1F1F',
        cardForeground: isLight ? '#000000' : '#FFFFFF',
        popover: isLight ? '#FFFFFF' : '#1F1F1F',
        popoverForeground: isLight ? '#000000' : '#FFFFFF',
        primary: primary || '#7C3AED',
        primaryForeground: '#FFFFFF',
        secondary: secondary || '#0EA5E9',
        secondaryForeground: '#FFFFFF',
        accent: accent || '#FB7185',
        accentForeground: '#FFFFFF',
        muted: isLight ? '#F1F5F9' : '#374151',
        mutedForeground: isLight ? '#64748B' : '#9CA3AF',
        destructive: '#EF4444',
        destructiveForeground: '#FFFFFF',
        border: isLight ? '#E2E8F0' : '#475569',
        input: 'transparent',
        inputBackground: isLight ? '#FFFFFF' : '#374151',
        switchBackground: isLight ? '#E2E8F0' : '#475569',
        ring: primary || '#7C3AED',
        chart1: primary || '#7C3AED',
        chart2: secondary || '#0EA5E9',
        chart3: accent || '#FB7185',
        chart4: '#10B981',
        chart5: '#F59E0B',
        sidebar: isLight ? '#F8FAFC' : '#1F2937',
        sidebarForeground: isLight ? '#1F2937' : '#F9FAFB',
        sidebarPrimary: primary || '#7C3AED',
        sidebarPrimaryForeground: '#FFFFFF',
        sidebarAccent: isLight ? '#F1F5F9' : '#374151',
        sidebarAccentForeground: isLight ? '#1F2937' : '#F9FAFB',
        sidebarBorder: isLight ? '#E2E8F0' : '#475569',
        sidebarRing: primary || '#7C3AED',
      };
    }
  }

  private generateOrganizationTheme(orgId: string): ThemeConfig {
    try {
      // Generate theme based on organization ID with better handling for default-org
      const orgThemes = [
        { primary: '#1E40AF', secondary: '#059669', accent: '#0EA5E9', name: 'Professional Blue' },
        { primary: '#16A34A', secondary: '#84CC16', accent: '#059669', name: 'Eco Green' },
        { primary: '#EA580C', secondary: '#F59E0B', accent: '#EF4444', name: 'Energy Orange' },
        { primary: '#7C3AED', secondary: '#8B5CF6', accent: '#EC4899', name: 'Innovation Purple' },
        { primary: '#0284C7', secondary: '#0EA5E9', accent: '#06B6D4', name: 'Ocean Blue' },
      ];
      
      // Better hash function for organization ID
      let themeIndex = 0;
      if (orgId === 'default-org' || orgId === 'default') {
        themeIndex = 0; // Always use Professional Blue for default org
      } else {
        // Create a simple hash from the org ID
        let hash = 0;
        for (let i = 0; i < orgId.length; i++) {
          const char = orgId.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        themeIndex = Math.abs(hash) % orgThemes.length;
      }
      
      const selectedTheme = orgThemes[themeIndex];
      
      if (!selectedTheme) {
        throw new Error(`Invalid theme index: ${themeIndex}`);
      }
      
      const lightPalette = this.createColorPalette(selectedTheme.primary, selectedTheme.secondary, selectedTheme.accent, 'light');
      const darkPalette = this.createColorPalette(selectedTheme.primary, selectedTheme.secondary, selectedTheme.accent, 'dark');
      
      if (!lightPalette || !darkPalette) {
        throw new Error('Failed to create color palettes');
      }
      
      return {
        id: `org-${orgId}`,
        name: `${selectedTheme.name} (${orgId})`,
        description: `Custom organization theme for ${orgId}`,
        light: lightPalette,
        dark: darkPalette,
      };
    } catch (error) {
      console.error('Error generating organization theme:', error);
      // Return a safe fallback theme
      return {
        id: `org-${orgId}-fallback`,
        name: 'Default Organization Theme',
        description: `Fallback theme for ${orgId}`,
        light: this.createColorPalette('#1E40AF', '#059669', '#0EA5E9', 'light'),
        dark: this.createColorPalette('#1E40AF', '#059669', '#0EA5E9', 'dark'),
      };
    }
  }

  private generateUserTheme(userId: string): ThemeConfig {
    const userPreferences = [
      { primary: '#EC4899', secondary: '#F472B6', accent: '#FBBF24', name: 'Personal Pink' },
      { primary: '#06B6D4', secondary: '#22D3EE', accent: '#67E8F9', name: 'Cool Cyan' },
      { primary: '#8B5CF6', secondary: '#A78BFA', accent: '#C4B5FD', name: 'Mystic Purple' },
      { primary: '#F59E0B', secondary: '#FBBF24', accent: '#FDE047', name: 'Golden Hour' },
    ];
    
    const prefIndex = parseInt(userId.slice(-1)) % userPreferences.length;
    const selectedPref = userPreferences[prefIndex];
    
    return {
      id: `user-${userId}`,
      name: selectedPref.name,
      description: `Personal theme for user ${userId}`,
      light: this.createColorPalette(selectedPref.primary, selectedPref.secondary, selectedPref.accent, 'light'),
      dark: this.createColorPalette(selectedPref.primary, selectedPref.secondary, selectedPref.accent, 'dark'),
    };
  }

  private generateDynamicTheme(seed?: string): ThemeConfig {
    // Generate colors based on current time or seed
    const now = new Date();
    const timeBasedSeed = seed || `${now.getHours()}-${now.getDate()}`;
    
    // Create colors based on time of day
    const hour = now.getHours();
    let primary, secondary, accent, name, description;
    
    if (hour >= 6 && hour < 12) {
      // Morning - Fresh colors
      primary = '#22C55E';
      secondary = '#84CC16';
      accent = '#06B6D4';
      name = 'Morning Fresh';
      description = 'Energizing morning colors';
    } else if (hour >= 12 && hour < 17) {
      // Afternoon - Professional colors
      primary = '#3B82F6';
      secondary = '#6366F1';
      accent = '#8B5CF6';
      name = 'Afternoon Focus';
      description = 'Professional afternoon theme';
    } else if (hour >= 17 && hour < 20) {
      // Evening - Warm colors
      primary = '#F59E0B';
      secondary = '#EA580C';
      accent = '#EF4444';
      name = 'Evening Warmth';
      description = 'Warm evening colors';
    } else {
      // Night - Dark, calm colors
      primary = '#6366F1';
      secondary = '#8B5CF6';
      accent = '#EC4899';
      name = 'Night Calm';
      description = 'Calming night theme';
    }
    
    return {
      id: `dynamic-${timeBasedSeed}`,
      name: name,
      description: description,
      light: this.createColorPalette(primary, secondary, accent, 'light'),
      dark: this.createColorPalette(primary, secondary, accent, 'dark'),
    };
  }
}

// Export default instance
export const colorApiService = new ColorApiService();