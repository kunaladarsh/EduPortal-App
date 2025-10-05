// import image_352647a5c8277d52c493b807da35b9cb4eccd186 from 'edu:asset/352647a5c8277d52c493b807da35b9cb4eccd186.png';
const image_352647a5c8277d52c493b807da35b9cb4eccd186 = "src/assets/352647a5c8277d52c493b807da35b9cb4eccd186.png"; // Use a valid static asset path or placeholder
// App Configuration Service
export interface AppConfig {
  appName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  borderColor: string;
  // Dark mode variants
  darkPrimaryColor: string;
  darkSecondaryColor: string;
  darkAccentColor: string;
  darkBackgroundColor: string;
  darkCardColor: string;
  darkTextColor: string;
  darkBorderColor: string;
}

// Default configuration (fallback)
export const defaultAppConfig: AppConfig = {
  appName: "EduPortal",
  logoUrl: "/logo.png",
  primaryColor: "#7C3AED",
  secondaryColor: "#0EA5E9",
  accentColor: "#FB7185",
  backgroundColor: "#F8FAFC",
  cardColor: "#EDE9FE",
  textColor: "#334155",
  borderColor: "#CBD5E1",
  // Dark mode
  darkPrimaryColor: "#8B5CF6",
  darkSecondaryColor: "#0EA5E9",
  darkAccentColor: "#FB7185",
  darkBackgroundColor: "#0F172A",
  darkCardColor: "#1E293B",
  darkTextColor: "#F1F5F9",
  darkBorderColor: "#475569",
};

// Mock API response (replace with real API call)
const mockApiResponse: AppConfig = {
  appName: "EduPortal",
  logoUrl: image_352647a5c8277d52c493b807da35b9cb4eccd186,
  primaryColor: "#6366F1",
  secondaryColor: "#06B6D4",
  accentColor: "#F59E0B",
  backgroundColor: "#FAFAFA",
  cardColor: "#F3F4F6",
  textColor: "#111827",
  borderColor: "#D1D5DB",
  // Dark mode
  darkPrimaryColor: "#818CF8",
  darkSecondaryColor: "#22D3EE",
  darkAccentColor: "#FBBF24",
  darkBackgroundColor: "#0F172A",
  darkCardColor: "#1F2937",
  darkTextColor: "#F9FAFB",
  darkBorderColor: "#374151",
};

// Simulate API call with minimal delay to prevent timeout issues
export const fetchAppConfig = async (): Promise<AppConfig> => {
  try {
    // Reduced delay to prevent timeout issues (was 1500ms, now 300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // TODO: Replace with actual API call
    // const response = await fetch('/api/app-config');
    // const config = await response.json();
    // return config;

    // For now, return mock data
    return mockApiResponse;
  } catch (error) {
    console.error("Failed to fetch app configuration:", error);
    // Return default config on error
    return defaultAppConfig;
  }
};

// Apply theme colors to CSS custom properties
export const applyThemeColors = (config: AppConfig) => {
  const root = document.documentElement;

  // Light mode colors
  root.style.setProperty("--primary", config.primaryColor);
  root.style.setProperty("--secondary", config.secondaryColor);
  root.style.setProperty("--accent", config.accentColor);
  root.style.setProperty(
    "--background",
    config.backgroundColor,
  );
  root.style.setProperty("--card", config.cardColor);
  root.style.setProperty("--foreground", config.textColor);
  root.style.setProperty("--card-foreground", config.textColor);
  root.style.setProperty("--border", config.borderColor);

  // Update chart colors to match theme
  root.style.setProperty("--chart-1", config.primaryColor);
  root.style.setProperty("--chart-2", config.secondaryColor);
  root.style.setProperty("--chart-3", config.accentColor);

  // Sidebar colors
  root.style.setProperty("--sidebar", config.backgroundColor);
  root.style.setProperty(
    "--sidebar-foreground",
    config.textColor,
  );
  root.style.setProperty(
    "--sidebar-primary",
    config.primaryColor,
  );
  root.style.setProperty(
    "--sidebar-border",
    config.borderColor,
  );

  // Ring color for focus states
  root.style.setProperty("--ring", config.primaryColor);

  // Create a style element for dark mode if it doesn't exist
  let darkModeStyle = document.getElementById(
    "dark-mode-colors",
  );
  if (!darkModeStyle) {
    darkModeStyle = document.createElement("style");
    darkModeStyle.id = "dark-mode-colors";
    document.head.appendChild(darkModeStyle);
  }

  // Dark mode colors
  darkModeStyle.textContent = `
    .dark {
      --primary: ${config.darkPrimaryColor};
      --secondary: ${config.darkSecondaryColor};
      --accent: ${config.darkAccentColor};
      --background: ${config.darkBackgroundColor};
      --card: ${config.darkCardColor};
      --foreground: ${config.darkTextColor};
      --card-foreground: ${config.darkTextColor};
      --border: ${config.darkBorderColor};
      --chart-1: ${config.darkPrimaryColor};
      --chart-2: ${config.darkSecondaryColor};
      --chart-3: ${config.darkAccentColor};
      --sidebar: ${config.darkCardColor};
      --sidebar-foreground: ${config.darkTextColor};
      --sidebar-primary: ${config.darkPrimaryColor};
      --sidebar-border: ${config.darkBorderColor};
      --ring: ${config.darkPrimaryColor};
    }
  `;
};

// Generate lighter and darker shades of a color
export const generateColorShades = (baseColor: string) => {
  // This is a simplified version - you might want to use a color manipulation library
  const hex = baseColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Generate lighter shade (add 20% white)
  const lighter = {
    r: Math.min(255, Math.round(r + (255 - r) * 0.2)),
    g: Math.min(255, Math.round(g + (255 - g) * 0.2)),
    b: Math.min(255, Math.round(b + (255 - b) * 0.2)),
  };

  // Generate darker shade (subtract 20%)
  const darker = {
    r: Math.max(0, Math.round(r * 0.8)),
    g: Math.max(0, Math.round(g * 0.8)),
    b: Math.max(0, Math.round(b * 0.8)),
  };

  return {
    lighter: `#${lighter.r.toString(16).padStart(2, "0")}${lighter.g.toString(16).padStart(2, "0")}${lighter.b.toString(16).padStart(2, "0")}`,
    base: baseColor,
    darker: `#${darker.r.toString(16).padStart(2, "0")}${darker.g.toString(16).padStart(2, "0")}${darker.b.toString(16).padStart(2, "0")}`,
  };
};