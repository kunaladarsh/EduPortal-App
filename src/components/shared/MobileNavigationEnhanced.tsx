import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
import { useAppConfig } from "../../contexts/AppConfigContext";
import image_352647a5c8277d52c493b807da35b9cb4eccd186 from 'src/assets/352647a5c8277d52c493b807da35b9cb4eccd186.png';
import { 
  Home, BookOpen, Users, Calendar, MessageSquare, 
  BarChart3, Settings, Bell, Award, Clock, Search,
  Menu, X, ChevronRight, User, LogOut
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { ImageWithFallback } from "../edu/ImageWithFallback";

interface MobileNavigationEnhancedProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  action: string;
  enabled: boolean;
  badge?: string;
  color?: string;
}

export const MobileNavigationEnhanced: React.FC<MobileNavigationEnhancedProps> = ({ 
  currentPage, 
  onPageChange 
}) => {
  const { user, logout } = useAuth();
  const { isFeatureEnabled } = useFeatures();
  const { config } = useAppConfig();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(currentPage);

  useEffect(() => {
    setActiveTab(currentPage);
  }, [currentPage]);

  const getBottomNavItems = (): NavItem[] => {
    return [
      {
        id: "dashboard",
        title: "Home",
        icon: <Home className="w-5 h-5" />,
        action: "dashboard",
        enabled: true,
        color: "primary"
      },
      {
        id: "attendance",
        title: "Attendance",
        icon: <Clock className="w-5 h-5" />,
        action: "attendance",
        enabled: isFeatureEnabled("attendance"),
        color: "secondary"
      },
      {
        id: "grades",
        title: "Grades",
        icon: <Award className="w-5 h-5" />,
        action: "grades",
        enabled: isFeatureEnabled("grades"),
        color: "accent"
      },
      {
        id: "messages",
        title: "Messages",
        icon: <MessageSquare className="w-5 h-5" />,
        action: "messages",
        enabled: isFeatureEnabled("messages"),
        badge: "3",
        color: "green"
      }
    ].filter(item => item.enabled);
  };

  const getMenuItems = (): NavItem[] => {
    const allItems = [
      {
        id: "calendar",
        title: "Calendar",
        icon: <Calendar className="w-5 h-5" />,
        action: "calendar",
        enabled: isFeatureEnabled("calendar")
      },
      {
        id: "announcements",
        title: "Announcements",
        icon: <Bell className="w-5 h-5" />,
        action: "announcements",
        enabled: isFeatureEnabled("announcements"),
        badge: "2"
      },
      {
        id: "assignments",
        title: "Assignments",
        icon: <BookOpen className="w-5 h-5" />,
        action: "assignments",
        enabled: isFeatureEnabled("assignments")
      },
      {
        id: "classes",
        title: user?.role === "teacher" ? "My Classes" : "Classes",
        icon: <Users className="w-5 h-5" />,
        action: "my-classes",
        enabled: true // Always available to show coming soon state
      },
      {
        id: "reports",
        title: "Reports",
        icon: <BarChart3 className="w-5 h-5" />,
        action: "reports",
        enabled: isFeatureEnabled("reports") && (user?.role === "admin" || user?.role === "teacher")
      }
    ];

    return allItems.filter(item => item.enabled);
  };

  const handleNavigation = (action: string) => {
    setActiveTab(action);
    onPageChange(action);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  const bottomNavItems = getBottomNavItems();
  const menuItems = getMenuItems();

  const getPageTitle = (currentTab: string): string => {
    if (currentTab === "dashboard") return "Home";
    if (currentTab === "attendance") return "Attendance";
    if (currentTab === "grades") return "Grades";
    if (currentTab === "messages") return "Messages";
    if (currentTab === "calendar") return "Calendar";
    if (currentTab === "announcements") return "Announcements";
    if (currentTab === "assignments") return "Assignments";
    if (currentTab === "classes" || currentTab === "teacher_classes" || currentTab === "my-classes") return "My Classes";
    if (currentTab === "reports") return "Reports";
    return "edu";
  };

  return (
    <>
      {/* Top Header */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/50 safe-area-top"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center justify-between flex-1 px-3">
            {/* Left side rectangular logo container */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <ImageWithFallback
                  src={config.logoUrl}
                  alt={`${config.appName} Logo`}
                  className="h-10 max-w-32 object-contain shadow-md"
                  fallback={
                    <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary flex items-center justify-center rounded-lg shadow-md">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                  }
                />
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background shadow-sm"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Center page title */}
            <motion.div 
              className="text-center min-w-0 flex-1 px-4"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h1 className="text-sm font-semibold truncate text-foreground">
                {getPageTitle(activeTab)}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {config.appName}
              </p>
            </motion.div>

            {/* Right side spacer to balance layout */}
            <div className="w-12"></div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full hover:bg-primary/10"
              onClick={() => handleNavigation("search")}
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full relative hover:bg-primary/10"
              onClick={() => handleNavigation("notifications")}
            >
              <Bell className="w-5 h-5" />
              <motion.div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border/50 safe-area-bottom"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-around py-2">
          {bottomNavItems.map((item) => (
            <motion.button
              key={item.id}
              className={`flex flex-col items-center p-3 rounded-xl transition-all relative ${
                activeTab === item.action 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => handleNavigation(item.action)}
              whileTap={{ scale: 0.95 }}
            >
              {activeTab === item.action && (
                <motion.div
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  layoutId="activeTab"
                  transition={{ duration: 0.3 }}
                />
              )}
              <div className="relative z-10">
                {item.icon}
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1 relative z-10">{item.title}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 left-0 bottom-0 w-80 bg-card/95 backdrop-blur-lg border-r border-border/50 z-50 safe-area-top"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.3, type: "spring", damping: 20 }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      {/* Full Dynamic App Logo */}
                      <motion.div 
                        className="relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ImageWithFallback
                          src={config.logoUrl}
                          alt={`${config.appName} Logo`}
                          className="h-12 max-w-24 object-contain shadow-lg"
                          fallback={
                            <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary flex items-center justify-center rounded-lg shadow-lg">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                          }
                        />
                        {/* Active Status Indicator */}
                        <motion.div 
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-accent/80 rounded-full border-2 border-background shadow-lg"
                          animate={{ 
                            scale: [1, 1.15, 1],
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                      
                      {/* Dynamic App Name & Tagline */}
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <h2 className="text-lg font-semibold text-foreground leading-tight mb-0.5">
                          {config.appName}
                        </h2>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                          Main Menu
                        </p>
                      </motion.div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-9 h-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                        {user?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {menuItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          activeTab === item.action
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleNavigation(item.action)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Settings and Profile */}
                  <div className="space-y-2">
                    <motion.button
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all"
                      onClick={() => handleNavigation("profile")}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </motion.button>

                    <motion.button
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all"
                      onClick={() => handleNavigation("settings")}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.35 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border/50">
                  <motion.button
                    className="w-full flex items-center space-x-3 p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                    onClick={handleLogout}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.4 }}
                    whileHover={{ x: 4 }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};