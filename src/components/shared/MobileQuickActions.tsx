import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
import { 
  Plus, X, BookOpen, Users, Calendar, MessageSquare, 
  Bell, FileText, BarChart3, Settings, Clock, Award,
  Camera, Mic, Video, Upload, PenTool, Search
} from "lucide-react";
import { Button } from "../ui/button";

interface MobileQuickActionsProps {
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface Action {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  action: string;
  enabled: boolean;
  primary?: boolean;
}

export const MobileQuickActions: React.FC<MobileQuickActionsProps> = ({ 
  onPageChange, 
  isOpen, 
  onToggle 
}) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatures();

  const getActions = (): Action[] => {
    const primaryActions = [
      {
        id: "new-announcement",
        title: "New Announcement",
        icon: <Bell className="w-5 h-5" />,
        color: "purple",
        action: "announcements",
        enabled: user?.role !== "student" && isFeatureEnabled("announcements"),
        primary: true
      },
      {
        id: "take-attendance",
        title: "Take Attendance",
        icon: <Clock className="w-5 h-5" />,
        color: "blue",
        action: "attendance",
        enabled: user?.role === "teacher" && isFeatureEnabled("attendance"),
        primary: true
      },
      {
        id: "grade-assignment",
        title: "Grade Assignment",
        icon: <Award className="w-5 h-5" />,
        color: "pink",
        action: "grades",
        enabled: user?.role === "teacher" && isFeatureEnabled("grades"),
        primary: true
      },
      {
        id: "new-assignment",
        title: "New Assignment",
        icon: <PenTool className="w-5 h-5" />,
        color: "green",
        action: "assignments",
        enabled: user?.role === "teacher" && isFeatureEnabled("assignments"),
        primary: true
      }
    ];

    const secondaryActions = [
      {
        id: "search",
        title: "Search",
        icon: <Search className="w-4 h-4" />,
        color: "gray",
        action: "search",
        enabled: true,
        primary: false
      },
      {
        id: "calendar",
        title: "Calendar",
        icon: <Calendar className="w-4 h-4" />,
        color: "gray",
        action: "calendar",
        enabled: isFeatureEnabled("calendar"),
        primary: false
      },
      {
        id: "messages",
        title: "Messages",
        icon: <MessageSquare className="w-4 h-4" />,
        color: "gray",
        action: "messages",
        enabled: isFeatureEnabled("messages"),
        primary: false
      },
      {
        id: "documents",
        title: "Documents",
        icon: <FileText className="w-4 h-4" />,
        color: "gray",
        action: "documents",
        enabled: isFeatureEnabled("documents"),
        primary: false
      },
      {
        id: "camera",
        title: "Camera",
        icon: <Camera className="w-4 h-4" />,
        color: "gray",
        action: "camera",
        enabled: true,
        primary: false
      },
      {
        id: "voice-note",
        title: "Voice Note",
        icon: <Mic className="w-4 h-4" />,
        color: "gray",
        action: "voice",
        enabled: true,
        primary: false
      }
    ];

    return [...primaryActions.filter(a => a.enabled), ...secondaryActions.filter(a => a.enabled)];
  };

  const handleActionClick = (action: Action) => {
    onToggle();
    
    // Handle special actions
    if (action.id === "search") {
      // Open search modal or navigate to search
      console.log("Opening search...");
      return;
    }
    
    if (action.id === "camera") {
      // Open camera
      console.log("Opening camera...");
      return;
    }
    
    if (action.id === "voice") {
      // Start voice recording
      console.log("Starting voice recording...");
      return;
    }
    
    // Navigate to page
    onPageChange(action.action);
  };

  const primaryActions = getActions().filter(a => a.primary);
  const secondaryActions = getActions().filter(a => !a.primary);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.div
        className="fixed bottom-20 right-6 z-50"
        animate={{ 
          rotate: isOpen ? 45 : 0,
          scale: isOpen ? 1.1 : 1
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 shadow-lg hover:shadow-xl active:scale-95 transition-all"
          onClick={onToggle}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Actions Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-36 right-6 z-50"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            <div className="bg-card/95 backdrop-blur-lg rounded-2xl border border-border/50 shadow-xl p-4 min-w-[280px]">
              {/* Primary Actions */}
              {primaryActions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    {primaryActions.map((action, index) => (
                      <motion.button
                        key={action.id}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/50 active:scale-95 transition-all ${
                          action.color === "purple" ? "text-primary" :
                          action.color === "blue" ? "text-secondary" :
                          action.color === "pink" ? "text-accent" :
                          action.color === "green" ? "text-green-500" :
                          "text-foreground"
                        }`}
                        onClick={() => handleActionClick(action)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          action.color === "purple" ? "bg-primary/10" :
                          action.color === "blue" ? "bg-secondary/10" :
                          action.color === "pink" ? "bg-accent/10" :
                          action.color === "green" ? "bg-green-500/10" :
                          "bg-muted/50"
                        }`}>
                          {action.icon}
                        </div>
                        <span className="font-medium">{action.title}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Secondary Actions */}
              {secondaryActions.length > 0 && (
                <div>
                  {primaryActions.length > 0 && (
                    <div className="border-t border-border/50 mb-3"></div>
                  )}
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                    Tools
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {secondaryActions.slice(0, 6).map((action, index) => (
                      <motion.button
                        key={action.id}
                        className="flex flex-col items-center p-3 rounded-xl hover:bg-muted/50 active:scale-95 transition-all"
                        onClick={() => handleActionClick(action)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 + index * 0.03 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted/50 mb-1">
                          {action.icon}
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">
                          {action.title}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};