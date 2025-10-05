// Feature Configuration System
// This file controls which features are enabled for each user role

export interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  roles: UserRole[];
  requiresPermission?: string[];
  beta?: boolean;
}

export type UserRole = "admin" | "teacher" | "student";

export interface RoleFeatures {
  [key: string]: {
    enabled: boolean;
    customPermissions?: string[];
  };
}

// Main feature definitions
export const FEATURES: Record<string, FeatureConfig> = {
  // Core Features (always enabled)
  dashboard: {
    id: "dashboard",
    name: "Dashboard",
    description: "Main overview and statistics",
    icon: "Home",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },
  profile: {
    id: "profile",
    name: "Profile",
    description: "User profile and account settings",
    icon: "User",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },
  settings: {
    id: "settings",
    name: "Settings",
    description: "Application configuration",
    icon: "Settings",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },
  notifications: {
    id: "notifications",
    name: "Notifications",
    description: "System and app notifications",
    icon: "Bell",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },

  // Academic Features
  assignments: {
    id: "assignments",
    name: "Assignments",
    description: "Create, manage, and submit assignments",
    icon: "ClipboardList",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },
  grades: {
    id: "grades",
    name: "Grades",
    description: "Grade management and viewing",
    icon: "Award",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },
  attendance: {
    id: "attendance",
    name: "Attendance",
    description: "Track and manage attendance",
    icon: "UserCheck",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },
  calendar: {
    id: "calendar",
    name: "Calendar",
    description: "Schedule and events management",
    icon: "Calendar",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },

  // Communication Features
  messages: {
    id: "messages",
    name: "Messages",
    description: "Direct messaging and communication",
    icon: "MessageSquare",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },
  announcements: {
    id: "announcements",
    name: "Announcements",
    description: "School and class announcements",
    icon: "BookOpen",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },

  // Resource Management
  library: {
    id: "library",
    name: "Digital Library",
    description: "Educational resources and materials",
    icon: "BookMarked",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },
  documents: {
    id: "documents",
    name: "Documents",
    description: "File management and sharing",
    icon: "HardDrive",
    enabled: true,
    roles: ["admin", "teacher", "student"],
  },

  // Administrative Features
  classes: {
    id: "classes",
    name: "Class Management",
    description: "Manage classes and students",
    icon: "GraduationCap",
    enabled: true,
    roles: ["admin"],
  },
  user_management: {
    id: "user_management",
    name: "User Management",
    description: "Create and manage student and teacher accounts",
    icon: "UserPlus",
    enabled: true,
    roles: ["admin"],
  },
  teacher_classes: {
    id: "teacher_classes",
    name: "My Classes",
    description: "Manage your assigned classes and students",
    icon: "Users",
    enabled: true,
    roles: ["teacher"],
  },
  reports: {
    id: "reports",
    name: "Reports & Analytics",
    description: "Performance reports and analytics",
    icon: "BarChart3",
    enabled: true,
    roles: ["admin", "teacher"],
  },

  // Beta/Experimental Features
  ai_tutor: {
    id: "ai_tutor",
    name: "AI Tutor",
    description: "AI-powered tutoring assistance",
    icon: "Bot",
    enabled: false,
    roles: ["student"],
    beta: true,
  },
  video_calls: {
    id: "video_calls",
    name: "Video Calls",
    description: "Virtual classroom meetings",
    icon: "Video",
    enabled: false,
    roles: ["admin", "teacher", "student"],
    beta: true,
  },
};

// Role-specific feature configurations
// You can customize which features are enabled for each role here
export const ROLE_FEATURE_CONFIG: Record<
  UserRole,
  RoleFeatures
> = {
  admin: {
    // Admin has access to all features by default
    dashboard: { enabled: true },
    profile: { enabled: true },
    settings: { enabled: true },
    notifications: { enabled: true },
    assignments: { enabled: true },
    grades: { enabled: true },
    attendance: { enabled: true },
    calendar: { enabled: true },
    messages: { enabled: true },
    announcements: { enabled: true },
    library: { enabled: true },
    documents: { enabled: true },
    classes: { enabled: true },
    user_management: { enabled: true },
    teacher_classes: { enabled: true },
    reports: { enabled: true },
    ai_tutor: { enabled: false }, // Beta feature
    video_calls: { enabled: false }, // Beta feature
  },
  teacher: {
    // Teacher configuration - customize as needed
    dashboard: { enabled: true },
    profile: { enabled: true },
    settings: { enabled: true },
    notifications: { enabled: true },
    assignments: { enabled: true }, // ENABLED - teachers need assignments
    grades: { enabled: true },
    attendance: { enabled: true },
    calendar: { enabled: true },
    messages: { enabled: true }, // ENABLED - teachers need messaging
    announcements: { enabled: true },
    library: { enabled: true },
    documents: { enabled: true }, // ENABLED - teachers need document management
    reports: { enabled: true },
    teacher_classes: { enabled: true }, // ENABLED - teachers need class management
    ai_tutor: { enabled: true },
    video_calls: { enabled: false },
  },
  student: {
    // Student configuration
    dashboard: { enabled: true },
    profile: { enabled: true },
    settings: { enabled: true },
    notifications: { enabled: true },
    assignments: { enabled: true },
    grades: { enabled: true },
    attendance: { enabled: true },
    calendar: { enabled: true },
    messages: { enabled: true },
    announcements: { enabled: true },
    library: { enabled: true },
    documents: { enabled: false }, // Students typically don't need document management
    ai_tutor: { enabled: false }, // Beta feature
    video_calls: { enabled: false }, // Beta feature
  },
};

// Utility functions
export const isFeatureEnabled = (
  featureId: string,
  userRole: UserRole,
): boolean => {
  const feature = FEATURES[featureId];
  if (!feature || !feature.enabled) return false;

  if (!feature.roles.includes(userRole)) return false;

  const roleConfig = ROLE_FEATURE_CONFIG[userRole][featureId];
  return roleConfig?.enabled ?? false;
};

export const getEnabledFeatures = (
  userRole: UserRole,
): FeatureConfig[] => {
  return Object.values(FEATURES).filter((feature) =>
    isFeatureEnabled(feature.id, userRole),
  );
};

export const getNavigationFeatures = (
  userRole: UserRole,
): FeatureConfig[] => {
  // Features that should appear in navigation
  const navigationFeatures = [
    "dashboard",
    "assignments",
    "grades",
    "attendance",
    "calendar",
    "messages",
    "announcements",
    "library",
    "documents",
    "classes",
    "user_management",
    "teacher_classes",
    "reports",
    "profile",
    "settings",
    "notifications",
  ];

  return getEnabledFeatures(userRole).filter((feature) =>
    navigationFeatures.includes(feature.id),
  );
};

export const getBottomNavFeatures = (
  userRole: UserRole,
): FeatureConfig[] => {
  // Features that should appear in bottom navigation (mobile)
  const mobileNavFeatures: Record<UserRole, string[]> = {
    admin: [
      "dashboard",
      "classes",
      "library",
      "messages",
      "documents",
    ],
    teacher: [
      "dashboard",
      "assignments",
      "teacher_classes",
      "grades",
      "attendance",
    ], // Updated to include assignments and teacher_classes
    student: [
      "dashboard",
      "assignments",
      "library",
      "messages",
      "profile",
    ],
  };

  const roleFeatures = mobileNavFeatures[userRole] || [
    "dashboard",
  ];
  return getEnabledFeatures(userRole).filter((feature) =>
    roleFeatures.includes(feature.id),
  );
};

// Feature management functions (for admin use)
export const enableFeature = (
  featureId: string,
  userRole: UserRole,
): void => {
  if (ROLE_FEATURE_CONFIG[userRole][featureId]) {
    ROLE_FEATURE_CONFIG[userRole][featureId].enabled = true;
  }
};

export const disableFeature = (
  featureId: string,
  userRole: UserRole,
): void => {
  if (ROLE_FEATURE_CONFIG[userRole][featureId]) {
    ROLE_FEATURE_CONFIG[userRole][featureId].enabled = false;
  }
};

export const toggleFeature = (
  featureId: string,
  userRole: UserRole,
): void => {
  if (ROLE_FEATURE_CONFIG[userRole][featureId]) {
    ROLE_FEATURE_CONFIG[userRole][featureId].enabled =
      !ROLE_FEATURE_CONFIG[userRole][featureId].enabled;
  }
};

// Get feature status for debugging
export const getFeatureStatus = () => {
  return {
    features: FEATURES,
    roleConfig: ROLE_FEATURE_CONFIG,
  };
};