import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
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
  Search,
  Filter,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  Lock,
  Unlock,
  Activity,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Save,
  X,
  Plus
} from "lucide-react";

interface MobileFeatureManagementEnhancedProps {
  onPageChange?: (page: string) => void;
  onBack?: () => void;
}

export const MobileFeatureManagementEnhanced: React.FC<MobileFeatureManagementEnhancedProps> = ({ 
  onPageChange,
  onBack 
}) => {
  const { user } = useAuth();
  const { toggleFeature, isFeatureEnabled, updateRoleFeature } = useFeatures();
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Permission check - only admins can access
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <div className="text-center p-6 max-w-sm w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Only administrators can access feature management.
          </p>
          <Button onClick={() => onPageChange?.("dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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

  const handleFeatureToggle = async (featureId: string, enabled: boolean, targetRole?: UserRole) => {
    setIsLoading(true);
    setHasChanges(true);
    
    try {
      const featureName = FEATURES[featureId]?.name || featureId;
      
      if (targetRole) {
        await updateRoleFeature(featureId, targetRole, enabled);
        toast.success(`${featureName} ${enabled ? 'enabled' : 'disabled'} for ${targetRole}s`, {
          icon: enabled ? "🟢" : "🔴",
          description: `This change only affects ${targetRole} users. Other roles are unaffected.`,
        });
      } else {
        await toggleFeature(featureId, enabled);
        toast.success(`${featureName} ${enabled ? 'enabled' : 'disabled'}`, {
          icon: enabled ? "🟢" : "🔴",
        });
      }
      
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to update feature settings", {
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFeatureEnabledForRole = (featureId: string, role: UserRole): boolean => {
    return ROLE_FEATURE_CONFIG[role]?.[featureId]?.enabled ?? false;
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
      case "admin": return "bg-destructive/10 text-destructive border-destructive/20";
      case "teacher": return "bg-primary/10 text-primary border-primary/20";
      case "student": return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save changes
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      toast.success("All changes saved successfully!", {
        icon: "💾",
      });
    } catch (error) {
      toast.error("Failed to save changes", {
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setRefreshKey(prev => prev + 1);
      toast.success("Features refreshed", {
        icon: "🔄",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get all features once - moved before any useMemo calls
  const allFeatures = Object.values(FEATURES);

  // Memoize filtering to prevent expensive recalculations
  const filteredFeatures = useMemo(() => {
    return allFeatures.filter(feature => {
      // Search filter
      const matchesSearch = !searchQuery || 
        feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Role filter - always show all features in single-role mode
      const matchesRole = true;
      
      // Enabled filter
      let matchesEnabled = true;
      if (showOnlyEnabled) {
        if (selectedRole === "all") {
          matchesEnabled = feature.roles.some(role => isFeatureEnabledForRole(feature.id, role));
        } else {
          const role = selectedRole as UserRole;
          matchesEnabled = feature.roles.includes(role) && isFeatureEnabledForRole(feature.id, role);
        }
      }
      
      return matchesSearch && matchesRole && matchesEnabled;
    });
  }, [searchQuery, selectedRole, showOnlyEnabled, refreshKey]);

  // Memoize expensive calculations to prevent performance issues
  const stats = useMemo(() => {
    if (selectedRole === "all") {
      const total = allFeatures.length;
      const enabled = allFeatures.filter(f => 
        !f.beta && f.roles.some(role => isFeatureEnabledForRole(f.id, role))
      ).length;
      const beta = allFeatures.filter(f => f.beta).length;
      const disabled = allFeatures.filter(f => 
        !f.beta && !f.roles.some(role => isFeatureEnabledForRole(f.id, role))
      ).length;
      
      return { total, enabled, beta, disabled };
    } else {
      const role = selectedRole as UserRole;
      const total = allFeatures.length;
      const enabled = allFeatures.filter(f => 
        !f.beta && f.roles.includes(role) && isFeatureEnabledForRole(f.id, role)
      ).length;
      const beta = allFeatures.filter(f => f.beta && f.roles.includes(role)).length;
      const disabled = allFeatures.filter(f => 
        !f.beta && f.roles.includes(role) && !isFeatureEnabledForRole(f.id, role)
      ).length;
      
      return { total, enabled, beta, disabled };
    }
  }, [selectedRole, allFeatures, refreshKey]);

  const { total: totalFeatures, enabled: enabledFeatures, beta: betaFeatures, disabled: disabledFeatures } = stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Enhanced Header */}
      <motion.div 
        className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border/50 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={onBack || (() => onPageChange?.("dashboard"))}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center hover:from-primary/20 hover:to-secondary/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </motion.button>
            <div>
              <motion.h1 
                className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Feature Management
              </motion.h1>
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Configure system features & permissions ⚙️
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasChanges && (
              <motion.button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="px-3 py-2 bg-gradient-to-r from-chart-4 to-primary text-white rounded-lg text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Save className="w-3 h-3" />
                Save
              </motion.button>
            )}
            <motion.button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 w-9 h-9 rounded-lg bg-gradient-to-br from-accent/10 to-chart-4/10 hover:from-accent/20 hover:to-chart-4/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`h-4 w-4 text-accent ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="p-4 pb-24 space-y-6">
        {/* Enhanced Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-0 bg-gradient-to-br from-chart-4/10 to-chart-4/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-10 h-10 mx-auto mb-2 rounded-xl bg-chart-4/20 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="w-5 h-5 text-chart-4" />
                </motion.div>
                <div className="text-xl font-bold text-chart-4">{enabledFeatures}</div>
                <div className="text-xs text-chart-4">Active Features</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((enabledFeatures / totalFeatures) * 100).toFixed(0)}% enabled
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-0 bg-gradient-to-br from-primary/10 to-secondary/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/20 flex items-center justify-center"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Star className="w-5 h-5 text-primary" />
                </motion.div>
                <div className="text-xl font-bold text-primary">{betaFeatures}</div>
                <div className="text-xs text-primary">Beta Features</div>
                <div className="text-xs text-muted-foreground mt-1">Coming soon 🚀</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-0 bg-gradient-to-br from-destructive/10 to-destructive/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-10 h-10 mx-auto mb-2 rounded-xl bg-destructive/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Lock className="w-5 h-5 text-destructive" />
                </motion.div>
                <div className="text-xl font-bold text-destructive">{disabledFeatures}</div>
                <div className="text-xs text-destructive">Disabled</div>
                <div className="text-xs text-muted-foreground mt-1">Ready to enable</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-0 bg-gradient-to-br from-chart-5/10 to-accent/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-10 h-10 mx-auto mb-2 rounded-xl bg-chart-5/20 flex items-center justify-center"
                  animate={{ 
                    y: [0, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Activity className="w-5 h-5 text-chart-5" />
                </motion.div>
                <div className="text-xl font-bold text-chart-5">{totalFeatures}</div>
                <div className="text-xs text-chart-5">Total Features</div>
                <div className="text-xs text-muted-foreground mt-1">Full system</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search features by name or description... 🔍"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-gradient-to-r from-background to-background/50 border-primary/20 focus:border-primary/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["all", "admin", "teacher", "student"] as const).map((role) => (
              <motion.button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4 py-2 font-medium transition-all duration-300 flex items-center gap-1 ${
                  selectedRole === role
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 hover:from-primary/20 hover:to-secondary/20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {role !== "all" && getRoleIcon(role as UserRole)}
                {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}s
              </motion.button>
            ))}
          </div>

          {/* Toggle Filter */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Show only enabled features</span>
            </div>
            <Switch
              checked={showOnlyEnabled}
              onCheckedChange={setShowOnlyEnabled}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background border-border"
            />
          </div>
        </motion.div>

        {/* Role-Based Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 bg-gradient-to-br from-muted/20 to-muted/5 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {selectedRole === "all" ? "Role-Based Access Overview" : `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Feature Summary`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedRole === "all" ? (
                // Show all roles when in "all" mode
                (["admin", "teacher", "student"] as UserRole[]).map(role => {
                  const roleFeatures = allFeatures.filter(f => f.roles.includes(role));
                  const enabledCount = roleFeatures.filter(f => isFeatureEnabledForRole(f.id, role)).length;
                  const percentage = Math.round((enabledCount / roleFeatures.length) * 100);
                  
                  return (
                    <motion.div 
                      key={role} 
                      className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-background/50 to-background/20"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getRoleColor(role).replace('border-', 'border ')}`}>
                          {getRoleIcon(role)}
                        </div>
                        <div>
                          <span className="text-sm capitalize font-semibold">{role}s</span>
                          <div className="text-xs text-muted-foreground">
                            {enabledCount} of {roleFeatures.length} features enabled
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${
                              percentage >= 80 ? 'bg-chart-4' :
                              percentage >= 60 ? 'bg-accent' : 'bg-destructive'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                        <Badge className={`text-xs border ${getRoleColor(role)} min-w-[3rem] justify-center`}>
                          {percentage}%
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                // Show detailed breakdown for the selected role
                (() => {
                  const role = selectedRole as UserRole;
                  const availableFeatures = allFeatures.filter(f => f.roles.includes(role));
                  const enabledFeatures = availableFeatures.filter(f => isFeatureEnabledForRole(f.id, role));
                  const unavailableFeatures = allFeatures.filter(f => !f.roles.includes(role));
                  
                  return (
                    <div className="space-y-3">
                      <motion.div 
                        className={`p-4 rounded-xl ${getRoleColor(role).replace('text-', 'bg-').replace('border-', 'border-')} bg-opacity-10`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-3 rounded-xl ${getRoleColor(role)}`}>
                            {getRoleIcon(role)}
                          </div>
                          <div>
                            <span className="text-lg capitalize font-bold">{role}s</span>
                            <div className="text-sm text-muted-foreground">
                              Feature access summary
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-2 bg-chart-4/10 rounded-lg border border-chart-4/20">
                            <div className="text-lg font-bold text-chart-4">{enabledFeatures.length}</div>
                            <div className="text-xs text-chart-4">Enabled</div>
                          </div>
                          <div className="text-center p-2 bg-destructive/10 rounded-lg border border-destructive/20">
                            <div className="text-lg font-bold text-destructive">{availableFeatures.length - enabledFeatures.length}</div>
                            <div className="text-xs text-destructive">Disabled</div>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded-lg border border-border">
                            <div className="text-lg font-bold text-muted-foreground">{unavailableFeatures.length}</div>
                            <div className="text-xs text-muted-foreground">N/A</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })()
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Features Configuration
                </CardTitle>
                <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                  <Activity className="w-3 h-3 mr-1" />
                  {filteredFeatures.length} features
                </Badge>
              </div>
              <div className="mt-2 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {selectedRole === "all" ? "Multi-Role Management" : `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Focus Mode`}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedRole === "all" 
                    ? "Manage features across all user roles. Each feature shows controls for all applicable roles."
                    : `Showing all features with ${selectedRole}-specific controls. Changes only affect ${selectedRole} users.`
                  }
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence>
                {filteredFeatures.map((feature, index) => (
                  <motion.div 
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      (() => {
                        const isEnabled = selectedRole === "all" 
                          ? feature.roles.some(role => isFeatureEnabledForRole(feature.id, role))
                          : feature.roles.includes(selectedRole as UserRole) && isFeatureEnabledForRole(feature.id, selectedRole as UserRole);
                        
                        return isEnabled
                          ? "bg-gradient-to-r from-chart-4/5 to-primary/5 border-chart-4/20" 
                          : "bg-gradient-to-r from-muted/50 to-muted/30 border-border";
                      })()
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Feature Header */}
                      <div className="flex items-start gap-3">
                        <motion.div 
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            (() => {
                              const isEnabled = selectedRole === "all" 
                                ? feature.roles.some(role => isFeatureEnabledForRole(feature.id, role))
                                : feature.roles.includes(selectedRole as UserRole) && isFeatureEnabledForRole(feature.id, selectedRole as UserRole);
                              
                              return isEnabled
                                ? "bg-gradient-to-br from-chart-4/20 to-primary/20"
                                : "bg-gradient-to-br from-muted to-muted/80";
                            })()
                          }`}
                          whileHover={{ rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          {getFeatureIcon(feature.id)}
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm">{feature.name}</h4>
                              {feature.beta && (
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Beta
                                </Badge>
                              )}
                              {feature.enterprise && (
                                <Badge className="bg-chart-5/10 text-chart-5 border-chart-5/20 text-xs">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Pro
                                </Badge>
                              )}
                            </div>
                            {(() => {
                              if (selectedRole === "all") {
                                const enabledRoles = feature.roles.filter(role => isFeatureEnabledForRole(feature.id, role)).length;
                                const totalRoles = feature.roles.length;
                                const badgeClass = enabledRoles === totalRoles
                                  ? "bg-chart-4/10 text-chart-4 border-chart-4/20"
                                  : enabledRoles > 0
                                  ? "bg-accent/10 text-accent border-accent/20"
                                  : "bg-destructive/10 text-destructive border-destructive/20";
                                
                                return (
                                  <Badge variant="outline" className={`text-xs ${badgeClass}`}>
                                    {enabledRoles}/{totalRoles} roles
                                  </Badge>
                                );
                              } else {
                                const role = selectedRole as UserRole;
                                const isAvailable = feature.roles.includes(role);
                                const isEnabled = isAvailable && isFeatureEnabledForRole(feature.id, role);
                                
                                const badgeClass = !isAvailable 
                                  ? "bg-muted text-muted-foreground border-border"
                                  : isEnabled
                                  ? "bg-chart-4/10 text-chart-4 border-chart-4/20"
                                  : "bg-destructive/10 text-destructive border-destructive/20";
                                
                                const text = !isAvailable ? "Not Available" : isEnabled ? "Enabled" : "Disabled";
                                
                                return (
                                  <Badge variant="outline" className={`text-xs ${badgeClass}`}>
                                    {text}
                                  </Badge>
                                );
                              }
                            })()}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{feature.description}</p>
                          
                          {/* Available for roles or role-specific status */}
                          <div className="flex flex-wrap gap-1">
                            {selectedRole === "all" ? (
                              // Show all roles when in "all" mode
                              feature.roles.map(role => (
                                <Badge 
                                  key={role} 
                                  variant="outline"
                                  className={`text-xs ${getRoleColor(role)} flex items-center gap-1`}
                                >
                                  {getRoleIcon(role)}
                                  {role}
                                </Badge>
                              ))
                            ) : (
                              // Show role-specific status when in single-role mode
                              <Badge 
                                variant="outline"
                                className={`text-xs ${
                                  feature.roles.includes(selectedRole as UserRole)
                                    ? getRoleColor(selectedRole as UserRole)
                                    : "bg-gray-50 text-gray-600 border-gray-200"
                                } flex items-center gap-1`}
                              >
                                {getRoleIcon(selectedRole as UserRole)}
                                {feature.roles.includes(selectedRole as UserRole) ? "Available" : "Not Available"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Role-specific Controls */}
                      <div className="pl-2 border-l-2 border-muted space-y-2">
                        <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {selectedRole === "all" ? "Access Control" : `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Access`}
                        </div>
                        
                        {selectedRole === "all" ? (
                          // Multi-role mode: Show all roles for this feature
                          feature.roles.map(role => {
                            const isEnabled = isFeatureEnabledForRole(feature.id, role);
                            return (
                              <motion.div 
                                key={role} 
                                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 ${
                                  isEnabled 
                                    ? `${getRoleColor(role).replace('text-', 'bg-').replace('border-', 'border-')} bg-opacity-10` 
                                    : "bg-muted/20 border-muted"
                                }`}
                                whileHover={{ scale: 1.01 }}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className={`p-1.5 rounded-md ${getRoleColor(role)}`}>
                                    {getRoleIcon(role)}
                                  </div>
                                  <div>
                                    <span className="text-sm capitalize font-medium">{role}s</span>
                                    <div className="text-xs text-muted-foreground">
                                      {isEnabled ? "✓ Enabled" : "✗ Disabled"}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={isEnabled && !feature.beta}
                                    onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked, role)}
                                    disabled={feature.beta || isLoading}
                                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background border-border"
                                  />
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          // Single-role mode: Show only the selected role
                          (() => {
                            const role = selectedRole as UserRole;
                            const isAvailable = feature.roles.includes(role);
                            const isEnabled = isAvailable && isFeatureEnabledForRole(feature.id, role);
                            
                            return (
                              <motion.div 
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                                  isEnabled 
                                    ? getRoleColor(role)
                                    : isAvailable
                                    ? "bg-muted/20 border-border"
                                    : "bg-destructive/5 border-destructive/20"
                                }`}
                                whileHover={{ scale: isAvailable ? 1.01 : 1 }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    isAvailable ? getRoleColor(role) : "bg-muted text-muted-foreground border-border"
                                  }`}>
                                    {getRoleIcon(role)}
                                  </div>
                                  <div>
                                    <span className="text-base capitalize font-semibold">{role}s Access</span>
                                    <div className="text-sm text-muted-foreground">
                                      {!isAvailable 
                                        ? "❌ Not available for this role"
                                        : isEnabled 
                                        ? "✅ Feature enabled" 
                                        : "⭕ Feature disabled"
                                      }
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {isAvailable && (
                                    <Switch
                                      checked={isEnabled && !feature.beta}
                                      onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked, role)}
                                      disabled={feature.beta || isLoading}
                                      className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background border-border"
                                    />
                                  )}
                                  {!isAvailable && (
                                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                                      N/A
                                    </Badge>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })()
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredFeatures.length === 0 && (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-muted-foreground">No features found matching your criteria</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters 🔍</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 bg-gradient-to-br from-chart-4/10 to-primary/10 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-chart-4" />
                <span className="text-sm font-medium text-chart-4">
                  {selectedRole === "all" ? "Multi-role feature management!" : `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}-focused management!`}
                </span>
                <Sparkles className="w-4 h-4 text-chart-4" />
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedRole === "all" 
                  ? "Configure features independently for admins, teachers, and students ✨"
                  : `Manage all features specifically for ${selectedRole} users ✨`
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Floating Save Button */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div 
            className="fixed bottom-20 left-4 right-4 z-10"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <motion.button 
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-chart-4 to-primary text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save All Changes
                  <CheckCircle className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};