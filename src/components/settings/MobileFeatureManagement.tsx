import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { FEATURES, ROLE_FEATURE_CONFIG, UserRole } from "../../config/features";
import { toast } from "sonner@2.0.3";
import {
  Settings,
  Shield,
  Users,
  BookOpen,
  Calendar,
  FileText,
  BarChart3,
  MessageSquare,
  Bell,
  Library,
  GraduationCap,
  Award,
  ArrowLeft,
  CheckCircle,
  Info,
  Zap,
  Star,
} from "lucide-react";

interface MobileFeatureManagementProps {
  onPageChange?: (page: string) => void;
}

export const MobileFeatureManagement: React.FC<MobileFeatureManagementProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const { toggleFeature } = useFeatures();
  const [refreshKey, setRefreshKey] = useState(0);

  const getFeatureIcon = (featureId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      dashboard: <BarChart3 className="h-4 w-4" />,
      profile: <Users className="h-4 w-4" />,
      settings: <Settings className="h-4 w-4" />,
      notifications: <Bell className="h-4 w-4" />,
      assignments: <FileText className="h-4 w-4" />,
      grades: <Award className="h-4 w-4" />,
      attendance: <Users className="h-4 w-4" />,
      calendar: <Calendar className="h-4 w-4" />,
      messages: <MessageSquare className="h-4 w-4" />,
      announcements: <Bell className="h-4 w-4" />,
      library: <Library className="h-4 w-4" />,
      documents: <FileText className="h-4 w-4" />,
      classes: <GraduationCap className="h-4 w-4" />,
      user_management: <Users className="h-4 w-4" />,
      teacher_classes: <BookOpen className="h-4 w-4" />,
      reports: <BarChart3 className="h-4 w-4" />,
    };
    return iconMap[featureId] || <Settings className="h-4 w-4" />;
  };

  const handleFeatureToggle = (featureId: string, enabled: boolean, targetRole?: UserRole) => {
    const featureName = FEATURES[featureId]?.name || featureId;
    
    if (targetRole) {
      toggleFeature(featureId, targetRole);
      toast.success(`${featureName} ${enabled ? 'enabled' : 'disabled'} for ${targetRole}s`);
    } else {
      toggleFeature(featureId, enabled);
      toast.success(`${featureName} ${enabled ? 'enabled' : 'disabled'}`);
    }
    setRefreshKey(prev => prev + 1);
  };

  const isFeatureEnabledForRole = (featureId: string, role: UserRole): boolean => {
    return ROLE_FEATURE_CONFIG[role][featureId]?.enabled ?? false;
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin": return <Shield className="h-4 w-4" />;
      case "teacher": return <BookOpen className="h-4 w-4" />;
      case "student": return <GraduationCap className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin": return "bg-red-50 text-red-600 border-red-200";
      case "teacher": return "bg-blue-50 text-blue-600 border-blue-200";
      case "student": return "bg-green-50 text-green-600 border-green-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const allFeatures = Object.values(FEATURES);
  const totalFeatures = allFeatures.length;
  const enabledFeatures = allFeatures.filter(f => !f.beta).length;
  const betaFeatures = allFeatures.filter(f => f.beta).length;

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
          onClick={() => onPageChange?.("dashboard")}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Feature Management</h1>
          <p className="text-muted-foreground">Configure system features and permissions</p>
        </div>
      </motion.div>

      {/* Feature Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-xl font-bold text-green-600">{enabledFeatures}</div>
            <div className="text-xs text-muted-foreground">Active Features</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4 text-center">
            <Info className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-xl font-bold text-blue-600">{betaFeatures}</div>
            <div className="text-xs text-muted-foreground">Beta Features</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-xl font-bold text-purple-600">0</div>
            <div className="text-xs text-muted-foreground">Enterprise</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4 text-center">
            <Settings className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="text-xl font-bold text-orange-600">{totalFeatures}</div>
            <div className="text-xs text-muted-foreground">Total Features</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Role-Based Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 bg-gradient-to-br from-muted/30 to-muted/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Role-Based Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["admin", "teacher", "student"] as UserRole[]).map(role => {
              const roleFeatures = Object.values(FEATURES).filter(f => f.roles.includes(role));
              const enabledCount = roleFeatures.filter(f => isFeatureEnabledForRole(f.id, role)).length;
              return (
                <div key={role} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(role)}
                    <span className="text-sm capitalize font-medium">{role}s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {enabledCount}/{roleFeatures.length}
                    </span>
                    <Badge className={`text-xs border ${getRoleColor(role)}`}>
                      {Math.round((enabledCount / roleFeatures.length) * 100)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Features List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              All Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allFeatures.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getFeatureIcon(feature.id)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{feature.name}</div>
                    <div className="text-xs text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
                <Switch
                  checked={!feature.beta && feature.enabled !== false}
                  onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                  disabled={feature.beta}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};