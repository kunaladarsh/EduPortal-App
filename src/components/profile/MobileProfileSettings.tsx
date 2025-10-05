import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  ArrowLeft,
  Bell,
  Shield,
  Moon,
  Sun,
  Globe,
  Volume2,
  Eye,
  Lock,
  Settings,
  Smartphone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface MobileProfileSettingsProps {
  onPageChange?: (page: string) => void;
  onBack?: () => void;
}

export const MobileProfileSettings: React.FC<MobileProfileSettingsProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      sms: false,
      assignments: true,
      grades: true,
      announcements: true,
      messages: true,
    },
    privacy: {
      profileVisible: true,
      showOnlineStatus: true,
      allowDirectMessages: true,
    },
    appearance: {
      darkMode: false,
      language: "en",
      timezone: "auto",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
    },
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
    toast.success("Setting updated");
  };

  return (
    <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack || (() => onPageChange?.("profile"))}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences</p>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <Label>Push Notifications</Label>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(value) => handleSettingChange("notifications", "push", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <Label>Email Notifications</Label>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(value) => handleSettingChange("notifications", "email", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <Label>Assignment Updates</Label>
              </div>
              <Switch
                checked={settings.notifications.assignments}
                onCheckedChange={(value) => handleSettingChange("notifications", "assignments", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <Label>Grade Updates</Label>
              </div>
              <Switch
                checked={settings.notifications.grades}
                onCheckedChange={(value) => handleSettingChange("notifications", "grades", value)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <Label>Profile Visible</Label>
              </div>
              <Switch
                checked={settings.privacy.profileVisible}
                onCheckedChange={(value) => handleSettingChange("privacy", "profileVisible", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <Label>Show Online Status</Label>
              </div>
              <Switch
                checked={settings.privacy.showOnlineStatus}
                onCheckedChange={(value) => handleSettingChange("privacy", "showOnlineStatus", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <Label>Allow Direct Messages</Label>
              </div>
              <Switch
                checked={settings.privacy.allowDirectMessages}
                onCheckedChange={(value) => handleSettingChange("privacy", "allowDirectMessages", value)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.appearance.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <Label>Dark Mode</Label>
              </div>
              <Switch
                checked={settings.appearance.darkMode}
                onCheckedChange={(value) => handleSettingChange("appearance", "darkMode", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <Label>Language</Label>
              </div>
              <span className="text-sm text-muted-foreground">English</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <Label>Two-Factor Authentication</Label>
              </div>
              <Switch
                checked={settings.security.twoFactorAuth}
                onCheckedChange={(value) => handleSettingChange("security", "twoFactorAuth", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Session Timeout</Label>
                <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
              </div>
              <span className="text-sm text-muted-foreground">30 min</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};