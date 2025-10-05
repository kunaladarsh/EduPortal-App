import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { MobileTeacherAttendanceBeautiful } from "./MobileTeacherAttendanceBeautiful";
import { MobileStudentAttendanceBeautiful } from "./MobileStudentAttendanceBeautiful";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Calendar,
  Clock,
  UserCheck,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Plus,
  BarChart3,
  TrendingUp,
  Activity,
  Star,
  Trophy,
  Target,
  Sparkles,
  Heart,
  Zap,
  ArrowRight,
  BookOpen,
  Timer,
  Award
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AttendanceRecord {
  id: string;
  studentId?: string;
  studentName?: string;
  studentAvatar?: string;
  subject: string;
  className: string;
  date: string;
  time: string;
  status: "present" | "absent" | "late" | "excused";
  duration?: string;
  teacher?: string;
  note?: string;
}

interface MobileAttendanceBeautifulProps {
  onPageChange?: (page: string) => void;
  onBack?: () => void;
}

export const MobileAttendanceBeautiful: React.FC<MobileAttendanceBeautifulProps> = ({ 
  onPageChange,
  onBack 
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"today" | "week" | "month">("today");
  const [currentTime, setCurrentTime] = useState(new Date());

  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const isStudent = user?.role === "student";

  // Update time every minute for real-time feeling
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Redirect to role-specific components
  if (isTeacher) {
    return (
      <MobileTeacherAttendanceBeautiful 
        onPageChange={onPageChange} 
        onBack={onBack || (() => onPageChange?.("dashboard"))} 
      />
    );
  }

  if (isStudent) {
    return (
      <MobileStudentAttendanceBeautiful 
        onPageChange={onPageChange}
        onBack={onBack || (() => onPageChange?.("dashboard"))}
      />
    );
  }

  // Admin or fallback view with beautiful dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Animated Header */}
      <motion.div 
        className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border/50 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserCheck className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Attendance Hub
              </motion.h1>
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </motion.p>
            </div>
          </div>
          
          <motion.div
            className="text-right"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-lg font-bold text-primary">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
            <div className="text-xs text-muted-foreground">Live time</div>
          </motion.div>
        </div>
      </motion.div>

      <div className="p-4 pb-24 space-y-6 max-w-md mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <motion.div
                  className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-8 h-8 text-primary" />
                </motion.div>
                <h2 className="text-xl font-bold">Welcome to Attendance!</h2>
                <p className="text-sm text-muted-foreground">
                  Track, manage, and analyze attendance with ease
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-12 h-12 mx-auto mb-2 rounded-xl bg-green-100 dark:bg-green-800/30 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </motion.div>
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <div className="text-xs text-green-600/80">Avg. Attendance</div>
                <div className="flex items-center justify-center gap-1 text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+2.1%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/20 dark:to-sky-800/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Users className="w-6 h-6 text-blue-600" />
                </motion.div>
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-xs text-blue-600/80">Total Students</div>
                <div className="flex items-center justify-center gap-1 text-xs text-blue-600 mt-1">
                  <Activity className="w-3 h-3" />
                  <span>Active</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-800/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-12 h-12 mx-auto mb-2 rounded-xl bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </motion.div>
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-xs text-purple-600/80">Classes Today</div>
                <div className="flex items-center justify-center gap-1 text-xs text-purple-600 mt-1">
                  <Timer className="w-3 h-3" />
                  <span>Live</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-800/20 shadow-lg">
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-12 h-12 mx-auto mb-2 rounded-xl bg-orange-100 dark:bg-orange-800/30 flex items-center justify-center"
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Trophy className="w-6 h-6 text-orange-600" />
                </motion.div>
                <div className="text-2xl font-bold text-orange-600">47</div>
                <div className="text-xs text-orange-600/80">Perfect Days</div>
                <div className="flex items-center justify-center gap-1 text-xs text-orange-600 mt-1">
                  <Star className="w-3 h-3" />
                  <span>100%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Actions
          </h3>

          <div className="grid gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="border-0 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Analytics Dashboard</h4>
                        <p className="text-sm text-muted-foreground">View detailed reports</p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="border-0 bg-gradient-to-r from-secondary/10 to-accent/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Calendar View</h4>
                        <p className="text-sm text-muted-foreground">Monthly overview</p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-5 h-5 text-secondary" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="border-0 bg-gradient-to-r from-accent/10 to-chart-4/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Target className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Attendance Goals</h4>
                        <p className="text-sm text-muted-foreground">Track progress</p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-5 h-5 text-accent" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Achievement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 bg-gradient-to-br from-chart-4/10 to-green-100/50 dark:from-chart-4/20 dark:to-green-900/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-chart-4/20 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Award className="w-5 h-5 text-chart-4" />
                </motion.div>
                <div>
                  <h4 className="font-semibold text-chart-4">Perfect Attendance Week!</h4>
                  <p className="text-sm text-muted-foreground">You're doing amazing! 🎉</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={100} className="flex-1 h-2" />
                <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30">
                  <Heart className="w-3 h-3 mr-1" />
                  100%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground">
            Keep up the great work! 🌟
          </p>
        </motion.div>
      </div>
    </div>
  );
};