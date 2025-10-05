import React from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { useFeatures } from "../../contexts/FeatureContext";
import { FEATURES } from "../../config/features";
import { toast } from "sonner@2.0.3";
import { Settings, Eye, EyeOff, Info } from "lucide-react";

export const FeatureToggle: React.FC = () => {
  const { userRole, isFeatureEnabled, toggleFeature } = useFeatures();

  if (!userRole) return null;

  const userFeatures = Object.values(FEATURES).filter(feature => 
    feature.roles.includes(userRole)
  );

  const handleToggle = (featureId: string) => {
    toggleFeature(featureId);
    const isEnabled = isFeatureEnabled(featureId);
    toast.success(`${FEATURES[featureId].name} ${isEnabled ? 'disabled' : 'enabled'}`);
  };

  const getFeatureIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      Home: "🏠",
      User: "👤",
      Settings: "⚙️",
      Bell: "🔔",
      ClipboardList: "📋",
      Award: "🏆",
      UserCheck: "✅",
      Calendar: "📅",
      MessageSquare: "💬",
      BookOpen: "📖",
      BookMarked: "📚",
      HardDrive: "💾",
      GraduationCap: "🎓",
      BarChart3: "📊",
      Bot: "🤖",
      Video: "📹"
    };
    
    return iconMap[iconName] || "🔧";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Available Features
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage which features are enabled for your account
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {userFeatures.length === 0 ? (
          <div className="text-center py-8">
            <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No configurable features available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userFeatures.map((feature) => {
              const isEnabled = isFeatureEnabled(feature.id);
              const canToggle = !['dashboard', 'profile', 'settings'].includes(feature.id); // Core features can't be disabled
              
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    isEnabled 
                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" 
                      : "bg-muted/50 border-border"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {getFeatureIcon(feature.icon)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{feature.name}</h3>
                        {feature.beta && (
                          <Badge variant="secondary" className="text-xs">
                            Beta
                          </Badge>
                        )}
                        {!feature.enabled && (
                          <Badge variant="outline" className="text-xs">
                            Globally Disabled
                          </Badge>
                        )}
                        {!canToggle && (
                          <Badge variant="outline" className="text-xs">
                            Core Feature
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isEnabled ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => handleToggle(feature.id)}
                      disabled={!canToggle || !feature.enabled}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Feature Notes:</p>
              <ul className="space-y-1 text-xs">
                <li>• Core features (Dashboard, Profile, Settings) cannot be disabled</li>
                <li>• Changes take effect immediately</li>
                <li>• Some features may require administrator approval</li>
                <li>• Beta features are experimental and may have limited functionality</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};