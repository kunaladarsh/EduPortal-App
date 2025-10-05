import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useAppConfig } from "../../contexts/AppConfigContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Info,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Download,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Volume2,
  Lock,
  Eye,
  Database,
  Wifi,
  Battery,
  Bluetooth,
  MapPin,
  Calendar,
  Clock,
  Camera,
  Mic,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { MobilePageContent } from "../shared/MobilePageContent";
import { toast } from "sonner@2.0.3";

interface MobileSettingsProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  label: string;
  description?: string;
  type: "toggle" | "navigation" | "action";
  value?: boolean;
  action?: () => void;
  navigateTo?: string;
  badge?: string;
  danger?: boolean;
}

export const MobileSettings: React.FC<MobileSettingsProps> = ({
  onPageChange,
  onBack
}) => {
  const { user, logout } = useAuth();
  const { config } = useAppConfig();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [settingsState, setSettingsState] = useState({
    notifications: true,
    autoSync: true,
    locationServices: true,
    pushNotifications: true,
    emailNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    biometricAuth: false,
    offlineMode: false,
    dataCompression: true,
    autoBackup: true,
    analyticsTracking: false,
    crashReporting: true,
  });

  const handleToggle = (key: string) => {
    if (key === 'darkMode') {
      toggleDarkMode();
      toast.success(`Dark mode ${!isDarkMode ? 'enabled' : 'disabled'}`);
    } else {
      setSettingsState(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} ${!settingsState[key] ? 'enabled' : 'disabled'}`);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
  };

  const settingsSections: SettingsSection[] = [
    {
      id: "account",
      title: "Account",
      icon: <User className="w-5 h-5" />,
      items: [
        {
          id: "profile",
          label: "Profile Settings",
          description: "Update your personal information",
          type: "navigation",
          navigateTo: "profile-settings"
        },
        {
          id: "security",
          label: "Security & Privacy",
          description: "Manage your account security",
          type: "navigation",
          navigateTo: "security"
        },
        {
          id: "preferences",
          label: "Preferences",
          description: "Customize your experience",
          type: "navigation",
          navigateTo: "preferences"
        }
      ]
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      items: [
        {
          id: "pushNotifications",
          label: "Push Notifications",
          description: "Receive push notifications",
          type: "toggle",
          value: settingsState.pushNotifications
        },
        {
          id: "emailNotifications",
          label: "Email Notifications",
          description: "Receive email updates",
          type: "toggle",
          value: settingsState.emailNotifications
        },
        {
          id: "soundEnabled",
          label: "Sound",
          description: "Play notification sounds",
          type: "toggle",
          value: settingsState.soundEnabled
        },
        {
          id: "vibrationEnabled",
          label: "Vibration",
          description: "Vibrate for notifications",
          type: "toggle",
          value: settingsState.vibrationEnabled
        }
      ]
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: <Palette className="w-5 h-5" />,
      items: [
        {
          id: "darkMode",
          label: "Dark Mode",
          description: "Switch to dark theme",
          type: "toggle",
          value: isDarkMode
        },
        {
          id: "theme",
          label: "Theme Settings",
          description: "Customize colors and layout",
          type: "navigation",
          navigateTo: "theme"
        },
        {
          id: "theme-verification",
          label: "Theme Verification",
          description: "Test beautiful new color themes",
          type: "navigation",
          navigateTo: "theme-verification",
          badge: "NEW"
        },
        {
          id: "language",
          label: "Language",
          description: "Change app language",
          type: "navigation",
          navigateTo: "language",
          badge: "EN"
        }
      ]
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          id: "biometricAuth",
          label: "Biometric Authentication",
          description: "Use fingerprint or face unlock",
          type: "toggle",
          value: settingsState.biometricAuth
        },
        {
          id: "locationServices",
          label: "Location Services",
          description: "Allow location access",
          type: "toggle",
          value: settingsState.locationServices
        },
        {
          id: "analyticsTracking",
          label: "Analytics",
          description: "Help improve the app",
          type: "toggle",
          value: settingsState.analyticsTracking
        },
        {
          id: "dataPrivacy",
          label: "Data Privacy",
          description: "Manage your data",
          type: "navigation",
          navigateTo: "privacy"
        }
      ]
    },
    {
      id: "storage",
      title: "Storage & Sync",
      icon: <Database className="w-5 h-5" />,
      items: [
        {
          id: "autoSync",
          label: "Auto Sync",
          description: "Automatically sync data",
          type: "toggle",
          value: settingsState.autoSync
        },
        {
          id: "offlineMode",
          label: "Offline Mode",
          description: "Work without internet",
          type: "toggle",
          value: settingsState.offlineMode
        },
        {
          id: "autoBackup",
          label: "Auto Backup",
          description: "Backup data automatically",
          type: "toggle",
          value: settingsState.autoBackup
        },
        {
          id: "storageUsage",
          label: "Storage Usage",
          description: "View storage details",
          type: "navigation",
          navigateTo: "storage",
          badge: "2.1 GB"
        }
      ]
    },
    {
      id: "support",
      title: "Support & About",
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        {
          id: "help",
          label: "Help Center",
          description: "Get help and support",
          type: "navigation",
          navigateTo: "help"
        },
        {
          id: "feedback",
          label: "Send Feedback",
          description: "Share your thoughts",
          type: "action",
          action: () => toast.success("Feedback form opened")
        },
        {
          id: "about",
          label: "About",
          description: "App version and info",
          type: "navigation",
          navigateTo: "about",
          badge: "v2.1.0"
        },
        {
          id: "rate",
          label: "Rate App",
          description: "Rate us in the app store",
          type: "action",
          action: () => toast.success("App store opened")
        }
      ]
    },
    ...(user?.role === "admin" ? [{
      id: "admin",
      title: "Administration",
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          id: "feature-management",
          label: "Feature Management",
          description: "Configure system features and permissions",
          type: "navigation" as const,
          navigateTo: "feature-management"
        },
        {
          id: "user-management",
          label: "User Management", 
          description: "Manage users and roles",
          type: "navigation" as const,
          navigateTo: "user-management"
        },
        {
          id: "feature-debug",
          label: "Feature Debug",
          description: "Debug feature configuration",
          type: "navigation" as const,
          navigateTo: "feature-debug",
          badge: "DEBUG"
        }
      ]
    }] : []),
    {
      id: "system",
      title: "System",
      icon: <Settings className="w-5 h-5" />,
      items: [
        {
          id: "dataCompression",
          label: "Data Compression",
          description: "Reduce data usage",
          type: "toggle",
          value: settingsState.dataCompression
        },
        {
          id: "crashReporting",
          label: "Crash Reporting",
          description: "Send crash reports",
          type: "toggle",
          value: settingsState.crashReporting
        },
        {
          id: "clearCache",
          label: "Clear Cache",
          description: "Free up storage space",
          type: "action",
          action: () => toast.success("Cache cleared successfully")
        },
        {
          id: "resetSettings",
          label: "Reset Settings",
          description: "Reset to default settings",
          type: "action",
          action: () => toast.success("Settings reset to default"),
          danger: true
        }
      ]
    }
  ];

  const handleItemAction = (item: SettingsItem) => {
    if (item.type === "toggle") {
      handleToggle(item.id);
    } else if (item.type === "navigation" && item.navigateTo) {
      onPageChange(item.navigateTo);
    } else if (item.type === "action" && item.action) {
      item.action();
    }
  };

  const renderSettingsItem = (item: SettingsItem) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleItemAction(item)}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <h4 className={`font-medium ${item.danger ? 'text-destructive' : ''}`}>
            {item.label}
          </h4>
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {item.description}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {item.type === "toggle" ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Switch
              checked={item.value || false}
              onCheckedChange={() => handleToggle(item.id)}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-secondary"
            />
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ x: 3, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="p-1 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20"
          >
            <ChevronRight className="w-5 h-5 bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  return (
    <MobilePageContent
      title="Settings"
      onBack={onBack}
      rightAction={
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      }
    >
      <div className="p-4 space-y-6">
        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-lg">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{user?.name || 'User'}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange("profile-edit")}
                  className="p-2"
                >
                  <User className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + sectionIndex * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 px-2">
                <div className="text-primary">{section.icon}</div>
                <h3 className="font-semibold text-foreground">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item) => renderSettingsItem(item))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="text-center text-xs text-muted-foreground pt-4"
        >
          <p>Classroom Management System</p>
          <p>Version 2.1.0 • Build 1234</p>
          <p className="mt-2">
            Made with <Heart className="w-3 h-3 inline text-red-500" /> for education
          </p>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="pt-4"
        >
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </MobilePageContent>
  );
};