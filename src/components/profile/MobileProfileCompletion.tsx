import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Target,
  Star,
  Award,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface MobileProfileCompletionProps {
  onPageChange?: (page: string) => void;
  onBack?: () => void;
}

interface CompletionItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
  action: string;
  points: number;
}

export const MobileProfileCompletion: React.FC<MobileProfileCompletionProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user } = useAuth();

  const getCompletionItems = (): CompletionItem[] => {
    return [
      {
        id: "basic-info",
        title: "Basic Information",
        description: "Add your name, email, and contact details",
        completed: !!(user?.name && user?.email),
        icon: <User className="h-4 w-4" />,
        action: "profile-edit",
        points: 20,
      },
      {
        id: "profile-photo",
        title: "Profile Photo",
        description: "Upload a profile picture to personalize your account",
        completed: !!user?.avatar,
        icon: <Camera className="h-4 w-4" />,
        action: "profile-edit",
        points: 15,
      },
      {
        id: "contact-info",
        title: "Contact Information",
        description: "Add phone number and address",
        completed: !!(user?.phone && user?.address),
        icon: <Phone className="h-4 w-4" />,
        action: "profile-edit",
        points: 10,
      },
      {
        id: "bio",
        title: "Personal Bio",
        description: "Tell others about yourself",
        completed: !!user?.bio,
        icon: <BookOpen className="h-4 w-4" />,
        action: "profile-edit",
        points: 10,
      },
      {
        id: "academic-info",
        title: user?.role === "student" ? "Academic Details" : "Professional Details",
        description: user?.role === "student" 
          ? "Add student ID, grade, and institution"
          : "Add teacher ID, department, and subjects",
        completed: user?.role === "student" 
          ? !!(user?.studentId && user?.grade)
          : !!(user?.teacherId && user?.department),
        icon: user?.role === "student" ? <GraduationCap className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />,
        action: "profile-edit",
        points: 25,
      },
      {
        id: "preferences",
        title: "Notification Preferences",
        description: "Configure your notification settings",
        completed: false, // This would check actual preference settings
        icon: <Mail className="h-4 w-4" />,
        action: "profile-settings",
        points: 10,
      },
    ];
  };

  const completionItems = getCompletionItems();
  const completedItems = completionItems.filter(item => item.completed);
  const totalPoints = completionItems.reduce((sum, item) => sum + item.points, 0);
  const earnedPoints = completedItems.reduce((sum, item) => sum + item.points, 0);
  const completionPercentage = Math.round((earnedPoints / totalPoints) * 100);

  const handleItemAction = (action: string) => {
    if (onPageChange) {
      onPageChange(action);
    }
  };

  const getCompletionLevel = () => {
    if (completionPercentage >= 90) return { level: "Expert", color: "text-purple-600", bg: "bg-purple-50" };
    if (completionPercentage >= 70) return { level: "Advanced", color: "text-blue-600", bg: "bg-blue-50" };
    if (completionPercentage >= 50) return { level: "Intermediate", color: "text-green-600", bg: "bg-green-50" };
    if (completionPercentage >= 25) return { level: "Beginner", color: "text-orange-600", bg: "bg-orange-50" };
    return { level: "Getting Started", color: "text-gray-600", bg: "bg-gray-50" };
  };

  const level = getCompletionLevel();

  return (
    <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack || (() => onPageChange?.("profile"))}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Profile Completion</h1>
          <p className="text-muted-foreground">Complete your profile to unlock all features</p>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Award className="w-10 h-10 text-white" />
            </div>
            <div className="text-3xl font-bold text-primary mb-2">{completionPercentage}%</div>
            <div className="text-sm text-muted-foreground mb-3">Profile Complete</div>
            <Progress value={completionPercentage} className="h-3 mb-4" />
            <Badge className={`${level.bg} ${level.color} border-current`}>
              {level.level}
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      {/* Points Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-lg font-bold text-green-600">{earnedPoints}</div>
            <div className="text-xs text-muted-foreground">Points Earned</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-lg font-bold text-blue-600">{completedItems.length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="text-lg font-bold text-orange-600">{completionItems.length - completedItems.length}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Completion Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Completion Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completionItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`
                  flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer
                  ${item.completed 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                    : 'bg-muted/30 border-border hover:bg-muted/50'
                  }
                `}
                onClick={() => handleItemAction(item.action)}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${item.completed 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {item.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium text-sm ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      +{item.points}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>

                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  ${item.completed 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {item.icon}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 bg-gradient-to-br from-muted/30 to-muted/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5" />
              Benefits of Completing Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Better personalized experience
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Enhanced security and privacy
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Access to all platform features
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Better recommendations and content
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};