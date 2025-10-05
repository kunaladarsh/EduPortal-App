import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
import { toast } from "sonner@2.0.3";
import {
  Plus,
  MessageCircle,
  Camera,
  FileText,
  Users,
  Calendar,
  ClipboardList,
  Bell,
  BookOpen,
  X,
  Upload,
  Edit,
} from "lucide-react";

interface QuickActionsFABProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const QuickActionsFAB: React.FC<QuickActionsFABProps> = ({
  currentPage,
  onPageChange,
}) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatures();
  const [isExpanded, setIsExpanded] = useState(false);

  const getQuickActions = () => {
    const actions = [];

    switch (user?.role) {
      case "admin":
        actions.push(
          { id: "add-announcement", label: "Announcement", icon: Bell, action: () => handleQuickAction("announcements") },
          { id: "add-class", label: "New Class", icon: Users, action: () => handleQuickAction("classes") },
          { id: "add-user", label: "Add User", icon: Users, action: () => handleQuickAction("user-management") },
          { id: "reports", label: "Reports", icon: FileText, action: () => handleQuickAction("reports") },
        );
        break;

      case "teacher":
        actions.push(
          { id: "take-attendance", label: "Attendance", icon: ClipboardList, action: () => handleQuickAction("attendance") },
          { id: "add-grade", label: "Add Grade", icon: Edit, action: () => handleQuickAction("grades") },
          { id: "new-announcement", label: "Announce", icon: Bell, action: () => handleQuickAction("announcements") },
          { id: "schedule-event", label: "Schedule", icon: Calendar, action: () => handleQuickAction("calendar") },
        );
        break;

      case "student":
        actions.push(
          { id: "upload-assignment", label: "Upload", icon: Upload, action: () => handleUpload() },
          { id: "send-message", label: "Message", icon: MessageCircle, action: () => handleQuickAction("messages") },
          { id: "view-schedule", label: "Schedule", icon: Calendar, action: () => handleQuickAction("calendar") },
          { id: "library", label: "Library", icon: BookOpen, action: () => handleQuickAction("library") },
        );
        break;
    }

    return actions.filter(action => {
      const featureMap: Record<string, string> = {
        "announcements": "announcements",
        "classes": "classes",
        "user-management": "user_management",
        "reports": "reports",
        "attendance": "attendance",
        "grades": "grades",
        "calendar": "calendar",
        "messages": "messages",
        "library": "library",
      };
      
      const requiredFeature = featureMap[action.action.toString().split('"')[1]];
      return !requiredFeature || isFeatureEnabled(requiredFeature);
    }).slice(0, 4); // Limit to 4 actions for better UX
  };

  const handleQuickAction = (page: string) => {
    setIsExpanded(false);
    onPageChange(page);
    toast.success(`Opening ${page.replace('-', ' ')}...`);
  };

  const handleUpload = () => {
    setIsExpanded(false);
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.txt';
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        toast.success(`${files.length} file(s) selected for upload`);
        // Here you would handle the actual file upload
      }
    };
    
    input.click();
  };

  const quickActions = getQuickActions();

  if (quickActions.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 lg:hidden z-40">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, staggerChildren: 0.1 }}
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                onClick={action.action}
                className="flex items-center gap-3 bg-card/95 backdrop-blur-xl text-card-foreground px-4 py-3 rounded-2xl shadow-lg border border-border/50 hover:bg-accent/10 transition-all duration-200 min-w-[140px] group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-primary-foreground transition-all duration-300 hover:scale-110"
        style={{
          background: "linear-gradient(135deg, var(--primary), var(--secondary))"
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isExpanded ? 45 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </motion.div>
      </motion.button>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/30"
        animate={{
          scale: isExpanded ? [1, 1.5, 1] : 1,
          opacity: isExpanded ? [0.3, 0, 0.3] : 0.3,
        }}
        transition={{ duration: 0.6, repeat: isExpanded ? Infinity : 0 }}
      />
    </div>
  );
};