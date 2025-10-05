import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
import { FEATURES, ROLE_FEATURE_CONFIG } from "../../config/features";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export const FeatureTestDebug: React.FC = () => {
  const { user } = useAuth();
  const { isFeatureEnabled, getFeatureStatus } = useFeatures();

  if (!user) {
    return <div>No user logged in</div>;
  }

  const featureStatus = getFeatureStatus();
  const userRole = user.role;

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Feature Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>User:</strong> {user.name} ({user.role})</p>
            <p><strong>User ID:</strong> {user.id}</p>
            
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Feature Status for {userRole}:</h4>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(FEATURES).map(([featureId, feature]) => {
                  const isEnabled = isFeatureEnabled(featureId);
                  const roleConfig = ROLE_FEATURE_CONFIG[userRole]?.[featureId];
                  const hasRole = feature.roles.includes(userRole);
                  
                  return (
                    <div key={featureId} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{feature.name}</span>
                        <div className="text-xs text-muted-foreground">
                          ID: {featureId} | Roles: {feature.roles.join(', ')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={hasRole ? "default" : "secondary"}>
                          {hasRole ? "Has Role" : "No Role"}
                        </Badge>
                        <Badge variant={roleConfig?.enabled ? "default" : "destructive"}>
                          {roleConfig?.enabled ? "Role Enabled" : "Role Disabled"}
                        </Badge>
                        <Badge variant={isEnabled ? "default" : "destructive"}>
                          {isEnabled ? "Final: Enabled" : "Final: Disabled"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Raw Feature Config:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(featureStatus, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};