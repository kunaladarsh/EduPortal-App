import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
import {
  BookOpen,
  Users,
  Calendar,
  MessageSquare,
  GraduationCap,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Award,
  Clock,
  TrendingUp,
  Star,
  Heart,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";

interface MobileAppHomeProps {
  onPageChange: (page: string) => void;
}

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  gradient: string;
  action: string;
  enabled: boolean;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  color: string;
  enabled: boolean;
}

export const MobileAppHome: React.FC<MobileAppHomeProps> = ({
  onPageChange,
}) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatures();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, [currentTime]);

  const getQuickActions = (): QuickAction[] => {
    let baseActions: QuickAction[] = [];

    switch (user?.role) {
      case "student":
        baseActions = [
          {
            id: "assignments",
            title: "Assignments",
            icon: <BookOpen className="w-6 h-6" />,
            gradient: "from-pink-500 to-pink-600",
            action: "assignments",
            enabled: isFeatureEnabled("assignments"),
          },
          {
            id: "grades",
            title: "My Grades",
            icon: <Award className="w-6 h-6" />,
            gradient: "from-blue-500 to-blue-600",
            action: "grades",
            enabled: isFeatureEnabled("grades"),
          },
          {
            id: "attendance",
            title: "My Attendance",
            icon: <Clock className="w-6 h-6" />,
            gradient: "from-purple-500 to-purple-600",
            action: "student-attendance",
            enabled: isFeatureEnabled("attendance"),
          },
          {
            id: "library",
            title: "Library",
            icon: <BookOpen className="w-6 h-6" />,
            gradient: "from-green-500 to-green-600",
            action: "library",
            enabled: isFeatureEnabled("library"),
          },
        ];
        break;

      case "teacher":
        baseActions = [
          {
            id: "attendance-master",
            title: "Attendance Hub",
            icon: <Clock className="w-6 h-6" />,
            gradient: "from-purple-500 to-purple-600",
            action: "attendance-master",
            enabled: isFeatureEnabled("attendance"),
          },
          {
            id: "beautiful-attendance",
            title: "Take Attendance",
            icon: <Users className="w-6 h-6" />,
            gradient: "from-emerald-500 to-green-600",
            action: "beautiful-attendance",
            enabled: isFeatureEnabled("attendance"),
          },
          {
            id: "my-classes",
            title: "My Classes",
            icon: <BookOpen className="w-6 h-6" />,
            gradient: "from-primary to-purple-600",
            action: "my-classes",
            enabled: true,
          },
          {
            id: "grades",
            title: "Grade Book",
            icon: <Award className="w-6 h-6" />,
            gradient: "from-blue-500 to-blue-600",
            action: "grades",
            enabled: isFeatureEnabled("grades"),
          },
          {
            id: "announcements",
            title: "Announcements",
            icon: <Bell className="w-6 h-6" />,
            gradient: "from-orange-500 to-orange-600",
            action: "announcements",
            enabled: isFeatureEnabled("announcements"),
          },
        ];
        break;

      case "admin":
        baseActions = [
          {
            id: "user-management",
            title: "Manage Users",
            icon: <Users className="w-6 h-6" />,
            gradient: "from-primary to-purple-600",
            action: "user-management",
            enabled: isFeatureEnabled("user_management"),
          },
          {
            id: "theme-showcase",
            title: "Theme Demo",
            icon: <Star className="w-6 h-6" />,
            gradient: "from-pink-500 to-purple-600",
            action: "theme-showcase",
            enabled: true,
          },
          {
            id: "classes",
            title: "Classes",
            icon: <BookOpen className="w-6 h-6" />,
            gradient: "from-green-500 to-green-600",
            action: "classes",
            enabled: isFeatureEnabled("classes"),
          },
          {
            id: "feature-management",
            title: "Settings",
            icon: <Settings className="w-6 h-6" />,
            gradient: "from-orange-500 to-orange-600",
            action: "feature-management",
            enabled: true,
          },

        ];
        break;

      default:
        baseActions = [];
    }

    return baseActions.filter((action) => action.enabled);
  };

  const getFeatures = (): Feature[] => {
    let allFeatures: Feature[] = [];

    // Common features available to all roles
    const commonFeatures: Feature[] = [
      {
        id: "calendar",
        title: "Calendar",
        description: "View schedule and events",
        icon: <Calendar className="w-5 h-5" />,
        action: "calendar",
        color: "purple",
        enabled: isFeatureEnabled("calendar"),
      },
      {
        id: "announcements",
        title: "Announcements",
        description: "Latest updates and news",
        icon: <Bell className="w-5 h-5" />,
        action: "announcements",
        color: "blue",
        enabled: isFeatureEnabled("announcements"),
      },
      {
        id: "library",
        title: "Library",
        description: "Digital resources and books",
        icon: <BookOpen className="w-5 h-5" />,
        action: "library",
        color: "pink",
        enabled: isFeatureEnabled("library"),
      },
    ];

    // Role-specific features
    switch (user?.role) {
      case "student":
        allFeatures = [
          ...commonFeatures,
          {
            id: "messages",
            title: "Messages",
            description: "Chat with teachers and classmates",
            icon: <MessageSquare className="w-5 h-5" />,
            action: "messages",
            color: "green",
            enabled: isFeatureEnabled("messages"),
          },
          {
            id: "documents",
            title: "Documents",
            description: "Access study materials",
            icon: <BookOpen className="w-5 h-5" />,
            action: "documents",
            color: "blue",
            enabled: isFeatureEnabled("documents"),
          },
        ];
        break;

      case "teacher":
        allFeatures = [
          ...commonFeatures,
          {
            id: "classes",
            title: "My Classes",
            description: "Manage your classes",
            icon: <Users className="w-5 h-5" />,
            action: "my-classes",
            color: "purple",
            enabled: true,
          },
          {
            id: "reports",
            title: "Reports",
            description: "Student analytics and insights",
            icon: <BarChart3 className="w-5 h-5" />,
            action: "reports",
            color: "green",
            enabled: isFeatureEnabled("reports"),
          },
          {
            id: "messages",
            title: "Messages",
            description: "Communicate with students",
            icon: <MessageSquare className="w-5 h-5" />,
            action: "messages",
            color: "blue",
            enabled: isFeatureEnabled("messages"),
          },
        ];
        break;

      case "admin":
        allFeatures = [
          ...commonFeatures,
          {
            id: "classes",
            title: "All Classes",
            description: "Manage all classes",
            icon: <Users className="w-5 h-5" />,
            action: "classes",
            color: "purple",
            enabled: isFeatureEnabled("classes"),
          },
          {
            id: "reports",
            title: "System Reports",
            description: "Analytics and insights",
            icon: <BarChart3 className="w-5 h-5" />,
            action: "reports",
            color: "green",
            enabled: isFeatureEnabled("reports"),
          },
          {
            id: "messages",
            title: "Messages",
            description: "System communications",
            icon: <MessageSquare className="w-5 h-5" />,
            action: "messages",
            color: "blue",
            enabled: isFeatureEnabled("messages"),
          },
          {
            id: "theme-showcase",
            title: "Theme Showcase",
            description: "Experience dynamic theming",
            icon: <Star className="w-5 h-5" />,
            action: "theme-showcase",
            color: "pink",
            enabled: true,
          },
        ];
        break;

      default:
        allFeatures = commonFeatures;
    }

    return allFeatures.filter((feature) => feature.enabled);
  };

  const stats = [
    {
      label:
        user?.role === "student"
          ? "Subjects"
          : user?.role === "teacher"
            ? "Classes"
            : "Total Users",
      value:
        user?.role === "student"
          ? "6"
          : user?.role === "teacher"
            ? "4"
            : "256",
      change: "+12%",
      color: "purple",
    },
    {
      label: user?.role === "student" ? "Attendance" : "Active",
      value:
        user?.role === "student"
          ? "94%"
          : user?.role === "teacher"
            ? "92%"
            : "89%",
      change: "+5%",
      color: "blue",
    },
    {
      label:
        user?.role === "student"
          ? "Average Grade"
          : "Completion",
      value: user?.role === "student" ? "A-" : "96%",
      change: "+8%",
      color: "pink",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header with Welcome */}
      <motion.div
        className="px-6 pt-8 pb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                {user?.name.charAt(1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">
                {greeting}
              </p>
              <h1 className="text-lg font-semibold">
                {user?.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>

        {/* Role Badge */}
        <Badge
          variant="secondary"
          className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20"
        >
          <GraduationCap className="w-3 h-3 mr-1" />
          {user?.role.charAt(0).toUpperCase() +
            user?.role.slice(1)}
        </Badge>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="px-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1 + index * 0.1,
              }}
            >
              <div className="text-center">
                <div
                  className="text-2xl font-bold mb-1"
                  style={{
                    color:
                      stat.color === "purple"
                        ? "var(--primary)"
                        : stat.color === "blue"
                          ? "var(--secondary)"
                          : "var(--accent)",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {stat.label}
                </div>
                <div className="flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">
                    {stat.change}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="px-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Quick Actions
          </h2>
          <Zap className="w-5 h-5 text-accent" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {getQuickActions().map((action, index) => (
            <motion.button
              key={action.id}
              className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-4 text-white active:scale-95 transition-transform`}
              onClick={() => onPageChange(action.action)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.2 + index * 0.1,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-lg font-semibold mb-1">
                    {action.title}
                  </div>
                  <div className="text-sm opacity-90">
                    {action.id === "my-classes"
                      ? "Coming Soon"
                      : action.id === "attendance" &&
                          user?.role === "student"
                        ? "View record"
                        : action.id === "attendance" &&
                            user?.role === "teacher"
                          ? "Mark today"
                          : action.id === "grades" &&
                              user?.role === "student"
                            ? "View scores"
                            : action.id === "grades" &&
                                user?.role === "teacher"
                              ? "Grade students"
                              : action.id === "assignments"
                                ? "Due soon"
                                : action.id === "library"
                                  ? "Study resources"
                                  : action.id ===
                                      "announcements"
                                    ? "Post updates"
                                    : action.id ===
                                        "user-management"
                                      ? "Manage staff"
                                      : action.id === "classes"
                                        ? "All courses"
                                        : action.id ===
                                            "reports"
                                          ? "Analytics"
                                          : action.id ===
                                              "feature-management"
                                            ? "System config"
                                            : "Available"}
                  </div>
                </div>
                <div className="opacity-80">{action.icon}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="px-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Features</h2>
          <Star className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-3">
          {getFeatures().map((feature, index) => (
            <motion.button
              key={feature.id}
              className="w-full bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50 active:scale-98 transition-all"
              onClick={() => onPageChange(feature.action)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.3 + index * 0.1,
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      feature.color === "purple"
                        ? "bg-primary/10 text-primary"
                        : feature.color === "blue"
                          ? "bg-secondary/10 text-secondary"
                          : feature.color === "pink"
                            ? "bg-accent/10 text-accent"
                            : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">
                      {feature.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {feature.description}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="px-6 pb-24 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-4 border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium">Need Help?</div>
                <div className="text-sm text-muted-foreground">
                  Access support & settings
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => onPageChange("settings")}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};