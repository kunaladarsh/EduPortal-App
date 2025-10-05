import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Settings,
  Clock,
  Bell,
  Mail,
  Shield,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Save,
  ArrowLeft,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Timer,
  Target,
  Award,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceSettingsProps {
  onBack: () => void;
}

interface AttendanceConfig {
  autoMarkingEnabled: boolean;
  lateThresholdMinutes: number;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  parentNotificationsEnabled: boolean;
  attendanceReportFrequency: 'daily' | 'weekly' | 'monthly';
  minimumAttendancePercentage: number;
  gracePeriodsEnabled: boolean;
  gracePeriodMinutes: number;
  weekendClassesEnabled: boolean;
  holidayClassesEnabled: boolean;
  attendanceRewardsEnabled: boolean;
  perfectAttendanceReward: number;
  attendanceImprovementReward: number;
}

export const AttendanceSettings: React.FC<AttendanceSettingsProps> = ({
  onBack,
}) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [config, setConfig] = useState<AttendanceConfig>({
    autoMarkingEnabled: true,
    lateThresholdMinutes: 15,
    notificationsEnabled: true,
    emailNotificationsEnabled: false,
    parentNotificationsEnabled: true,
    attendanceReportFrequency: 'weekly',
    minimumAttendancePercentage: 75,
    gracePeriodsEnabled: true,
    gracePeriodMinutes: 5,
    weekendClassesEnabled: false,
    holidayClassesEnabled: false,
    attendanceRewardsEnabled: true,
    perfectAttendanceReward: 100,
    attendanceImprovementReward: 50,
  });

  const handleConfigChange = (key: keyof AttendanceConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Attendance settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setConfig({
      autoMarkingEnabled: true,
      lateThresholdMinutes: 15,
      notificationsEnabled: true,
      emailNotificationsEnabled: false,
      parentNotificationsEnabled: true,
      attendanceReportFrequency: 'weekly',
      minimumAttendancePercentage: 75,
      gracePeriodsEnabled: true,
      gracePeriodMinutes: 5,
      weekendClassesEnabled: false,
      holidayClassesEnabled: false,
      attendanceRewardsEnabled: true,
      perfectAttendanceReward: 100,
      attendanceImprovementReward: 50,
    });
    toast.success('Settings reset to defaults');
  };

  const settingSections = [
    {
      id: 'general',
      title: 'General Settings',
      icon: <Settings className="w-5 h-5" />,
      settings: [
        {
          key: 'autoMarkingEnabled',
          label: 'Auto-marking',
          description: 'Automatically mark students present when they enter class',
          type: 'switch',
          value: config.autoMarkingEnabled,
        },
        {
          key: 'lateThresholdMinutes',
          label: 'Late Threshold',
          description: 'Minutes after class start to mark as late',
          type: 'number',
          value: config.lateThresholdMinutes,
          min: 1,
          max: 60,
        },
        {
          key: 'minimumAttendancePercentage',
          label: 'Minimum Attendance',
          description: 'Required attendance percentage for students',
          type: 'number',
          value: config.minimumAttendancePercentage,
          min: 50,
          max: 100,
          suffix: '%',
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      settings: [
        {
          key: 'notificationsEnabled',
          label: 'Push Notifications',
          description: 'Send notifications for attendance updates',
          type: 'switch',
          value: config.notificationsEnabled,
        },
        {
          key: 'emailNotificationsEnabled',
          label: 'Email Notifications',
          description: 'Send email alerts for attendance issues',
          type: 'switch',
          value: config.emailNotificationsEnabled,
        },
        {
          key: 'parentNotificationsEnabled',
          label: 'Parent Notifications',
          description: 'Notify parents of attendance issues',
          type: 'switch',
          value: config.parentNotificationsEnabled,
        },
        {
          key: 'attendanceReportFrequency',
          label: 'Report Frequency',
          description: 'How often to send attendance reports',
          type: 'select',
          value: config.attendanceReportFrequency,
          options: [
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ],
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced Settings',
      icon: <Shield className="w-5 h-5" />,
      settings: [
        {
          key: 'gracePeriodsEnabled',
          label: 'Grace Periods',
          description: 'Allow short grace periods for late arrivals',
          type: 'switch',
          value: config.gracePeriodsEnabled,
        },
        {
          key: 'gracePeriodMinutes',
          label: 'Grace Period Duration',
          description: 'Minutes of grace period for late students',
          type: 'number',
          value: config.gracePeriodMinutes,
          min: 1,
          max: 15,
          disabled: !config.gracePeriodsEnabled,
        },
        {
          key: 'weekendClassesEnabled',
          label: 'Weekend Classes',
          description: 'Enable attendance tracking on weekends',
          type: 'switch',
          value: config.weekendClassesEnabled,
        },
        {
          key: 'holidayClassesEnabled',
          label: 'Holiday Classes',
          description: 'Enable attendance tracking on holidays',
          type: 'switch',
          value: config.holidayClassesEnabled,
        },
      ],
    },
    {
      id: 'rewards',
      title: 'Rewards & Recognition',
      icon: <Award className="w-5 h-5" />,
      settings: [
        {
          key: 'attendanceRewardsEnabled',
          label: 'Attendance Rewards',
          description: 'Enable reward system for good attendance',
          type: 'switch',
          value: config.attendanceRewardsEnabled,
        },
        {
          key: 'perfectAttendanceReward',
          label: 'Perfect Attendance Points',
          description: 'Points awarded for perfect monthly attendance',
          type: 'number',
          value: config.perfectAttendanceReward,
          min: 0,
          max: 500,
          disabled: !config.attendanceRewardsEnabled,
        },
        {
          key: 'attendanceImprovementReward',
          label: 'Improvement Points',
          description: 'Points for attendance improvement',
          type: 'number',
          value: config.attendanceImprovementReward,
          min: 0,
          max: 200,
          disabled: !config.attendanceRewardsEnabled,
        },
      ],
    },
  ];

  const renderSettingControl = (setting: any) => {
    switch (setting.type) {
      case 'switch':
        return (
          <Switch
            checked={setting.value}
            onCheckedChange={(checked) => handleConfigChange(setting.key, checked)}
            disabled={setting.disabled}
          />
        );
      
      case 'number':
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={setting.value}
              onChange={(e) => handleConfigChange(setting.key, parseInt(e.target.value))}
              min={setting.min}
              max={setting.max}
              disabled={setting.disabled}
              className="w-20"
            />
            {setting.suffix && (
              <span className="text-sm text-muted-foreground">{setting.suffix}</span>
            )}
          </div>
        );
      
      case 'select':
        return (
          <Select
            value={setting.value}
            onValueChange={(value) => handleConfigChange(setting.key, value)}
            disabled={setting.disabled}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Attendance Settings</h1>
              <p className="text-sm text-muted-foreground">
                Configure attendance tracking and notifications
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
            {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-card via-card/95 to-primary/5 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium text-green-600">Auto-marking</div>
              <p className="text-xs text-green-600">Active</p>
            </div>
            
            <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Bell className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium text-blue-600">Notifications</div>
              <p className="text-xs text-blue-600">Enabled</p>
            </div>
            
            <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <Timer className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium text-orange-600">Late Threshold</div>
              <p className="text-xs text-orange-600">{config.lateThresholdMinutes} minutes</p>
            </div>
            
            <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Target className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium text-purple-600">Min. Attendance</div>
              <p className="text-xs text-purple-600">{config.minimumAttendancePercentage}%</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => {
          // Hide advanced sections unless showAdvanced is true
          if ((section.id === 'advanced' || section.id === 'rewards') && !showAdvanced) {
            return null;
          }

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + sectionIndex * 0.1 }}
            >
              <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <motion.div
                      key={setting.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + sectionIndex * 0.1 + settingIndex * 0.05 }}
                      className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50"
                    >
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{setting.label}</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {setting.description}
                        </p>
                      </div>
                      
                      <div className="ml-4">
                        {renderSettingControl(setting)}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 pt-4 sticky bottom-4"
      >
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isSaving}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
        
        <Button
          variant="outline"
          disabled={isSaving}
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Settings
        </Button>
        
        <Button
          className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Timer className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </motion.div>

      {/* Advanced Settings Toggle */}
      {!showAdvanced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-4"
        >
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(true)}
            className="text-sm text-muted-foreground"
          >
            <Eye className="w-4 h-4 mr-2" />
            Show Advanced Settings
          </Button>
        </motion.div>
      )}
    </div>
  );
};