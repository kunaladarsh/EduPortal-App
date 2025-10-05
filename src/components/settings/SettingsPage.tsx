import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../contexts/AuthContext';
import { useAppConfig } from '../../contexts/AppConfigContext';
import { FeatureToggle } from './FeatureToggle';
import { toast } from 'sonner@2.0.3';
import {
  Settings,
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Database,
  HelpCircle,
  RefreshCw,
  Paintbrush,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { config: appConfig, refreshConfig, isLoading: configLoading } = useAppConfig();
  const [activeSection, setActiveSection] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    theme: 'system',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    attendanceReminders: true,
    gradeUpdates: true,
    announcementAlerts: true,
    weeklyReports: false,
    marketingEmails: false,
  });

  // Privacy & Security
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'class',
    showEmail: false,
    showPhone: false,
    dataSharing: false,
    twoFactorAuth: false,
  });

  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    autoLogout: '30',
  });

  const handleSaveSettings = (section: string) => {
    // In a real app, this would save to backend
    toast.success(`${section} settings saved successfully!`);
  };

  const handleExportData = () => {
    // In a real app, this would export user data
    toast.success('Data export initiated. You will receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    // In a real app, this would show confirmation dialog and delete account
    toast.error('Account deletion requires additional confirmation.');
  };

  const handleRefreshAppConfig = async () => {
    setIsRefreshing(true);
    try {
      await refreshConfig();
      toast.success('App configuration refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh app configuration');
    } finally {
      setIsRefreshing(false);
    }
  };

  const settingSections = [
    { id: 'general', label: 'General', icon: Settings },
    ...(user?.role === 'admin' ? [{ id: 'branding', label: 'App Configuration', icon: Paintbrush }] : []),
    { id: 'features', label: 'Features', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account preferences and application settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Features Settings */}
            {activeSection === 'features' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FeatureToggle />
              </motion.div>
            )}

            {/* General Settings */}
            {activeSection === 'general' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      General Settings
                    </CardTitle>
                    <CardDescription>
                      Configure your basic application preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={generalSettings.language} onValueChange={(value) => 
                          setGeneralSettings({ ...generalSettings, language: value })
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={generalSettings.timezone} onValueChange={(value) => 
                          setGeneralSettings({ ...generalSettings, timezone: value })
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                            <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                            <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                            <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select value={generalSettings.dateFormat} onValueChange={(value) => 
                          setGeneralSettings({ ...generalSettings, dateFormat: value })
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={generalSettings.theme} onValueChange={(value) => 
                          setGeneralSettings({ ...generalSettings, theme: value })
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveSettings('General')}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* App Configuration Settings (Admin Only) */}
            {activeSection === 'branding' && user?.role === 'admin' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Paintbrush className="h-5 w-5" />
                      App Configuration
                    </CardTitle>
                    <CardDescription>
                      Manage app branding, colors, and theme settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <Paintbrush className="h-4 w-4" />
                      <AlertDescription>
                        Changes to app configuration require fetching the latest settings from the API. 
                        Click "Refresh Configuration" to load the most recent settings.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Current Configuration</h4>
                        
                        <div className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-center gap-3">
                            {appConfig.logoUrl ? (
                              <img 
                                src={appConfig.logoUrl} 
                                alt="App logo"
                                className="w-8 h-8 rounded object-contain"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                                <Paintbrush className="h-4 w-4 text-primary-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{appConfig.appName}</p>
                              <p className="text-sm text-muted-foreground">Application Name</p>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Primary Color:</span>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded border"
                                  style={{ backgroundColor: appConfig.primaryColor }}
                                />
                                <span className="font-mono">{appConfig.primaryColor}</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span>Secondary Color:</span>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded border"
                                  style={{ backgroundColor: appConfig.secondaryColor }}
                                />
                                <span className="font-mono">{appConfig.secondaryColor}</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span>Accent Color:</span>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded border"
                                  style={{ backgroundColor: appConfig.accentColor }}
                                />
                                <span className="font-mono">{appConfig.accentColor}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Actions</h4>
                        
                        <div className="space-y-3">
                          <Button 
                            onClick={handleRefreshAppConfig}
                            disabled={isRefreshing || configLoading}
                            className="w-full"
                          >
                            {isRefreshing ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Refreshing...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh Configuration
                              </>
                            )}
                          </Button>
                          
                          <p className="text-xs text-muted-foreground">
                            This will fetch the latest app configuration from the API and apply new branding, colors, and logo.
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">API Configuration</h5>
                          <p className="text-xs text-muted-foreground">
                            App configuration is managed through the API. To update branding:
                          </p>
                          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                            <li>• Update your API configuration</li>
                            <li>• Click "Refresh Configuration"</li>
                            <li>• Changes will apply immediately</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Settings
                    </CardTitle>
                    <CardDescription>
                      Control how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <Label>Email Notifications</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            <Label>Push Notifications</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Receive browser push notifications
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium">Notification Types</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Attendance Reminders</Label>
                            <Switch
                              checked={notificationSettings.attendanceReminders}
                              onCheckedChange={(checked) => 
                                setNotificationSettings({ ...notificationSettings, attendanceReminders: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Grade Updates</Label>
                            <Switch
                              checked={notificationSettings.gradeUpdates}
                              onCheckedChange={(checked) => 
                                setNotificationSettings({ ...notificationSettings, gradeUpdates: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Announcement Alerts</Label>
                            <Switch
                              checked={notificationSettings.announcementAlerts}
                              onCheckedChange={(checked) => 
                                setNotificationSettings({ ...notificationSettings, announcementAlerts: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Weekly Reports</Label>
                            <Switch
                              checked={notificationSettings.weeklyReports}
                              onCheckedChange={(checked) => 
                                setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label>Marketing Emails</Label>
                            <Switch
                              checked={notificationSettings.marketingEmails}
                              onCheckedChange={(checked) => 
                                setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveSettings('Notification')}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Privacy & Security */}
            {activeSection === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription>
                      Manage your privacy settings and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Profile Visibility</Label>
                        <Select value={privacySettings.profileVisibility} onValueChange={(value) => 
                          setPrivacySettings({ ...privacySettings, profileVisibility: value })
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="class">Class Members Only</SelectItem>
                            <SelectItem value="teachers">Teachers Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-medium">Contact Information</h4>
                        
                        <div className="flex items-center justify-between">
                          <Label>Show Email Address</Label>
                          <Switch
                            checked={privacySettings.showEmail}
                            onCheckedChange={(checked) => 
                              setPrivacySettings({ ...privacySettings, showEmail: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label>Show Phone Number</Label>
                          <Switch
                            checked={privacySettings.showPhone}
                            onCheckedChange={(checked) => 
                              setPrivacySettings({ ...privacySettings, showPhone: checked })
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-medium">Data & Analytics</h4>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Data Sharing for Analytics</Label>
                            <p className="text-sm text-muted-foreground">
                              Help improve the platform with anonymous usage data
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.dataSharing}
                            onCheckedChange={(checked) => 
                              setPrivacySettings({ ...privacySettings, dataSharing: checked })
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-medium">Security</h4>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {privacySettings.twoFactorAuth && (
                              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                            )}
                            <Switch
                              checked={privacySettings.twoFactorAuth}
                              onCheckedChange={(checked) => 
                                setPrivacySettings({ ...privacySettings, twoFactorAuth: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveSettings('Privacy')}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Account Settings */}
            {activeSection === 'account' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Account Security
                    </CardTitle>
                    <CardDescription>
                      Manage your password and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={accountSettings.currentPassword}
                            onChange={(e) => setAccountSettings({ ...accountSettings, currentPassword: e.target.value })}
                            placeholder="Enter current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={accountSettings.newPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, newPassword: e.target.value })}
                          placeholder="Enter new password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={accountSettings.confirmPassword}
                          onChange={(e) => setAccountSettings({ ...accountSettings, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="autoLogout">Auto Logout (minutes)</Label>
                        <Select value={accountSettings.autoLogout} onValueChange={(value) => 
                          setAccountSettings({ ...accountSettings, autoLogout: value })
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveSettings('Account')}>
                        <Save className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Data & Storage */}
            {activeSection === 'data' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data Management
                    </CardTitle>
                    <CardDescription>
                      Export your data or manage your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Export Your Data</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Download a copy of all your data including grades, attendance, and profile information.
                        </p>
                        <Button onClick={handleExportData} variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Storage Usage</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Profile Data</span>
                            <span>2.3 MB</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Uploaded Files</span>
                            <span>15.7 MB</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Cache</span>
                            <span>8.2 MB</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>26.2 MB</span>
                          </div>
                        </div>
                      </div>

                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Danger Zone:</strong> The following actions are irreversible. Please proceed with caution.
                        </AlertDescription>
                      </Alert>

                      <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Delete Account</h4>
                        <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button onClick={handleDeleteAccount} variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Help & Support */}
            {activeSection === 'help' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Help & Support
                    </CardTitle>
                    <CardDescription>
                      Get help and find resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg text-center">
                        <h4 className="font-medium mb-2">Documentation</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Browse our comprehensive guides and tutorials
                        </p>
                        <Button variant="outline" className="w-full">
                          View Docs
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg text-center">
                        <h4 className="font-medium mb-2">Contact Support</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get help from our support team
                        </p>
                        <Button variant="outline" className="w-full">
                          Contact Us
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg text-center">
                        <h4 className="font-medium mb-2">Community Forum</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connect with other users and share tips
                        </p>
                        <Button variant="outline" className="w-full">
                          Join Forum
                        </Button>
                      </div>

                      <div className="p-4 border rounded-lg text-center">
                        <h4 className="font-medium mb-2">Feature Requests</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Suggest new features or improvements
                        </p>
                        <Button variant="outline" className="w-full">
                          Submit Idea
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Application Information</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Version</span>
                          <span>1.2.3</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Updated</span>
                          <span>January 20, 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Build</span>
                          <span>2025.01.20.1</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};