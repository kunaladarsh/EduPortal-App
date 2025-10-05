import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useAppConfig } from "../../contexts/AppConfigContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Menu,
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Smartphone,
  ChevronRight,
  MessageCircle,
  Calendar,
  BookOpen,
  Award,
  Users,
  ClipboardList,
} from "lucide-react";

interface MobileHeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentPage,
  onPageChange,
}) => {
  const { user, logout } = useAuth();
  const { config } = useAppConfig();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getPageTitle = (page: string) => {
    const titles: Record<string, string> = {
      dashboard: "Home",
      classes: "Classes",
      teacher_classes: "My Classes", 
      grades: "Grades",
      attendance: "Attendance",
      calendar: "Calendar",
      assignments: "Assignments",
      library: "Library",
      messages: "Messages",
      announcements: "Announcements",
      profile: "Profile",
      settings: "Settings",
      notifications: "Notifications",
      reports: "Reports",
      documents: "Documents",
    };
    return titles[page] || "SmartClass Pro";
  };

  const getNotificationCount = () => {
    // Mock notification count - in real app this would come from context/API
    return 3;
  };

  const menuItems = [
    { id: "notifications", label: "Notifications", icon: Bell, badge: getNotificationCount() },
    { id: "messages", label: "Messages", icon: MessageCircle, badge: 2 },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "library", label: "Library", icon: BookOpen },
    ...(user?.role === "teacher" || user?.role === "student" ? [
      { id: "grades", label: "Grades", icon: Award },
    ] : []),
    ...(user?.role === "teacher" ? [
      { id: "attendance", label: "Attendance", icon: ClipboardList },
      { id: "teacher_classes", label: "My Classes", icon: Users },
    ] : []),
    ...(user?.role === "student" ? [
      { id: "assignments", label: "Assignments", icon: ClipboardList },
    ] : []),
    ...(user?.role === "admin" ? [
      { id: "classes", label: "Class Management", icon: Users },
      { id: "reports", label: "Reports", icon: ClipboardList },
    ] : []),
  ];



  return (
    <motion.header 
      className="sticky top-0 z-50 lg:hidden bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between px-4 py-3 safe-area-top">
        {/* Menu Button */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-6 pb-4 border-b">
              <div className="flex items-center gap-3">
                {config.logoUrl && (
                  <img 
                    src={config.logoUrl} 
                    alt={config.appName}
                    className="w-8 h-8 rounded-lg"
                  />
                )}
                <div className="text-left">
                  <SheetTitle className="text-lg">{config.appName}</SheetTitle>
                  <SheetDescription className="text-sm">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Portal
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* User Profile Section */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  onPageChange("profile");
                }}
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start h-12 px-3"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onPageChange(item.id);
                    }}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 px-2 py-1 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setIsMenuOpen(false);
                  onPageChange("settings");
                }}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Page Title */}
        <div className="flex-1 text-center">
          <motion.h1 
            className="font-semibold text-lg truncate"
            key={currentPage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {getPageTitle(currentPage)}
          </motion.h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Dark Mode Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2"
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <motion.div
              key={isDarkMode ? 'dark' : 'light'}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </motion.div>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 relative"
            onClick={() => onPageChange("notifications")}
          >
            <Bell className="h-5 w-5" />
            {getNotificationCount() > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {getNotificationCount()}
              </motion.div>
            )}
          </Button>
        </div>
      </div>
    </motion.header>
  );
};