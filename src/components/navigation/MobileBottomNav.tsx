import React from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
import {
  Home,
  Users,
  ClipboardList,
  MessageSquare,
  BookOpen,
  Bell,
  GraduationCap,
  UserCheck,
  Award,
  Calendar,
  BarChart3,
  User,
  Settings,
  BookMarked,
  FileText,
  HardDrive,
} from "lucide-react";

interface MobileBottomNavProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onPageChange,
}) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatures();

  const getBottomNavItems = (role: string) => {
    const baseItems = [
      { id: "dashboard", label: "Home", icon: Home },
    ];

    switch (role) {
      case "admin":
        return [
          ...baseItems,
          { id: "classes", label: "Classes", icon: GraduationCap },
          { id: "library", label: "Library", icon: BookMarked },
          { id: "messages", label: "Messages", icon: MessageSquare },
          { id: "profile", label: "Profile", icon: User },
        ];

      case "teacher":
        return [
          ...baseItems,
          { id: "teacher_classes", label: "Classes", icon: Users },
          { id: "grades", label: "Grades", icon: Award },
          { id: "attendance", label: "Attendance", icon: UserCheck },
          { id: "calendar", label: "Calendar", icon: Calendar },
        ];

      case "student":
        return [
          ...baseItems,
          { id: "assignments", label: "Tasks", icon: ClipboardList },
          { id: "grades", label: "Grades", icon: Award },
          { id: "library", label: "Library", icon: BookMarked },
          { id: "profile", label: "Profile", icon: User },
        ];

      default:
        return baseItems;
    }
  };

  const navItems = getBottomNavItems(user?.role || "student").filter(item => 
    isFeatureEnabled(item.id) || item.id === "dashboard" || item.id === "profile"
  );

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 lg:hidden z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-2xl">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/10 to-transparent pointer-events-none" />
        
        <div className="relative px-2 py-2 safe-area-bottom">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {navItems.map((item, index) => {
              const isActive = currentPage === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 min-w-0 flex-1 max-w-[80px] ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {/* Active background with gradient */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, var(--primary), var(--secondary))"
                      }}
                      layoutId="activeNavTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <div className="relative">
                      <item.icon className="h-5 w-5" />
                      
                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-2 h-2 bg-primary-foreground rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      )}
                    </div>
                    
                    <span className="text-xs font-medium truncate w-full text-center">
                      {item.label}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Home indicator for newer iPhones */}
        <div className="flex justify-center pb-2">
          <div className="w-36 h-1 bg-border/30 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};