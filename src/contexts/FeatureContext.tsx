import React, { createContext, useContext, ReactNode } from 'react';
import { 
  FeatureConfig, 
  UserRole, 
  isFeatureEnabled, 
  getEnabledFeatures,
  getNavigationFeatures,
  getBottomNavFeatures,
  enableFeature,
  disableFeature,
  toggleFeature,
  getFeatureStatus
} from '../config/features';
import { useAuth } from './AuthContext';

interface FeatureContextType {
  // Feature checking
  isFeatureEnabled: (featureId: string) => boolean;
  getEnabledFeatures: () => FeatureConfig[];
  getNavigationFeatures: () => FeatureConfig[];
  getBottomNavFeatures: () => FeatureConfig[];
  
  // Feature management (admin only)
  enableFeature: (featureId: string, userRole?: UserRole) => void;
  disableFeature: (featureId: string, userRole?: UserRole) => void;
  toggleFeature: (featureId: string, targetRoleOrEnabled?: UserRole | boolean) => void;
  updateRoleFeature: (featureId: string, role: UserRole, enabled: boolean) => Promise<void>;
  
  // Debug/admin
  getFeatureStatus: () => any;
  
  // Current user role
  userRole: UserRole | null;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

interface FeatureProviderProps {
  children: ReactNode;
}

export const FeatureProvider: React.FC<FeatureProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const userRole = user?.role as UserRole || null;

  const contextValue: FeatureContextType = {
    isFeatureEnabled: (featureId: string) => {
      if (!userRole) return false;
      return isFeatureEnabled(featureId, userRole);
    },
    
    getEnabledFeatures: () => {
      if (!userRole) return [];
      return getEnabledFeatures(userRole);
    },
    
    getNavigationFeatures: () => {
      if (!userRole) return [];
      return getNavigationFeatures(userRole);
    },
    
    getBottomNavFeatures: () => {
      if (!userRole) return [];
      return getBottomNavFeatures(userRole);
    },
    
    enableFeature: (featureId: string, targetRole?: UserRole) => {
      const roleToUpdate = targetRole || userRole;
      if (roleToUpdate && (user?.role === 'admin' || roleToUpdate === userRole)) {
        enableFeature(featureId, roleToUpdate);
      }
    },
    
    disableFeature: (featureId: string, targetRole?: UserRole) => {
      const roleToUpdate = targetRole || userRole;
      if (roleToUpdate && (user?.role === 'admin' || roleToUpdate === userRole)) {
        disableFeature(featureId, roleToUpdate);
      }
    },
    
    toggleFeature: (featureId: string, targetRoleOrEnabled?: UserRole | boolean) => {
      if (typeof targetRoleOrEnabled === 'boolean') {
        // Legacy behavior: toggle for current user's role
        if (userRole && (user?.role === 'admin' || userRole === user?.role)) {
          if (targetRoleOrEnabled) {
            enableFeature(featureId, userRole);
          } else {
            disableFeature(featureId, userRole);
          }
        }
      } else {
        // New behavior: toggle for specific role
        const roleToUpdate = targetRoleOrEnabled || userRole;
        if (roleToUpdate && user?.role === 'admin') {
          toggleFeature(featureId, roleToUpdate);
        }
      }
    },

    updateRoleFeature: async (featureId: string, role: UserRole, enabled: boolean) => {
      if (user?.role === 'admin') {
        if (enabled) {
          enableFeature(featureId, role);
        } else {
          disableFeature(featureId, role);
        }
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    },
    
    getFeatureStatus,
    userRole,
  };

  return (
    <FeatureContext.Provider value={contextValue}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatures = (): FeatureContextType => {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  return context;
};

// Hook for checking if specific feature is enabled
export const useFeatureEnabled = (featureId: string): boolean => {
  const { isFeatureEnabled } = useFeatures();
  return isFeatureEnabled(featureId);
};

// Hook for getting navigation items
export const useNavigationFeatures = () => {
  const { getNavigationFeatures } = useFeatures();
  return getNavigationFeatures();
};

// Hook for getting bottom navigation items
export const useBottomNavFeatures = () => {
  const { getBottomNavFeatures } = useFeatures();
  return getBottomNavFeatures();
};