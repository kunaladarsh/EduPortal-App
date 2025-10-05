import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  CheckCircle, XCircle, Clock, Save, ArrowLeft, Search, 
  User, Check, X, Timer, BookOpen, Users, Target,
  RotateCcw, AlertCircle, Plus, Eye, Sparkles, Heart,
  Star, Award, Zap, Coffee, Sun, Trophy, Flame,
  UserCheck, UserX, Activity, TrendingUp
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { MobilePageContent } from "../shared/MobilePageContent";
import { toast } from "sonner@2.0.3";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatar?: string;
  status: "present" | "absent" | "late" | "not_marked";
  previousAttendance: number;
  streak?: number;
  mood?: "happy" | "neutral" | "sad";
}

interface ClassSession {
  id: string;
  name: string;
  subject: string;
  time: string;
  duration: string;
  location: string;
  studentsCount: number;
}

interface MobileTakeAttendanceBeautifulProps {
  classSession: ClassSession;
  onBack: () => void;
  onComplete: (attendanceData: any) => void;
}

export const MobileTakeAttendanceBeautiful: React.FC<MobileTakeAttendanceBeautifulProps> = ({ 
  classSession, 
  onBack,
  onComplete
}) => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [celebrationMode, setCelebrationMode] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced mock student data with personality
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Alice Johnson",
        rollNumber: "001",
        avatar: "",
        status: "not_marked",
        previousAttendance: 95,
        streak: 12,
        mood: "happy"
      },
      {
        id: "2", 
        name: "Bob Smith",
        rollNumber: "002",
        avatar: "",
        status: "not_marked",
        previousAttendance: 87,
        streak: 3,
        mood: "neutral"
      },
      {
        id: "3",
        name: "Carol Davis", 
        rollNumber: "003",
        avatar: "",
        status: "not_marked",
        previousAttendance: 92,
        streak: 8,
        mood: "happy"
      },
      {
        id: "4",
        name: "David Wilson",
        rollNumber: "004", 
        avatar: "",
        status: "not_marked",
        previousAttendance: 78,
        streak: 0,
        mood: "sad"
      },
      {
        id: "5",
        name: "Emma Thompson",
        rollNumber: "005",
        avatar: "",
        status: "not_marked", 
        previousAttendance: 98,
        streak: 20,
        mood: "happy"
      },
      {
        id: "6",
        name: "Frank Miller",
        rollNumber: "006",
        avatar: "",
        status: "not_marked",
        previousAttendance: 84,
        streak: 5,
        mood: "neutral"
      },
      {
        id: "7",
        name: "Grace Lee",
        rollNumber: "007",
        avatar: "",
        status: "not_marked",
        previousAttendance: 91,
        streak: 7,
        mood: "happy"
      },
      {
        id: "8",
        name: "Henry Chen",
        rollNumber: "008", 
        avatar: "",
        status: "not_marked",
        previousAttendance: 88,
        streak: 4,
        mood: "neutral"
      }
    ];
    setStudents(mockStudents);
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.includes(searchQuery)
  );

  const getAttendanceStats = () => {
    const total = students.length;
    const present = students.filter(s => s.status === "present").length;
    const absent = students.filter(s => s.status === "absent").length; 
    const late = students.filter(s => s.status === "late").length;
    const notMarked = students.filter(s => s.status === "not_marked").length;
    const marked = total - notMarked;
    const progress = total > 0 ? (marked / total) * 100 : 0;
    
    return { total, present, absent, late, notMarked, marked, progress };
  };

  const stats = getAttendanceStats();

  const updateStudentStatus = (studentId: string, status: Student['status']) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        // Add celebration effect for perfect attendance students
        if (status === "present" && student.previousAttendance >= 95) {
          setCelebrationMode(true);
          setTimeout(() => setCelebrationMode(false), 2000);
        }
        return { ...student, status };
      }
      return student;
    }));

    // Fun feedback based on status
    if (status === "present") {
      toast.success("Great! Student marked present 👍", {
        icon: "✅",
      });
    } else if (status === "late") {
      toast.info("Student marked as late ⏰", {
        icon: "🕐",
      });
    } else if (status === "absent") {
      toast.error("Student marked absent 😞", {
        icon: "❌",
      });
    }
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => 
      student.status === "not_marked" ? { ...student, status: "present" } : student
    ));
    toast.success("Wow! Everyone is here today! 🎉", {
      icon: "🌟",
    });
    setCelebrationMode(true);
    setTimeout(() => setCelebrationMode(false), 3000);
  };

  const resetAttendance = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: "not_marked" })));
    toast.success("Attendance reset successfully", {
      icon: "🔄",
    });
  };

  const saveAttendance = async () => {
    if (stats.notMarked > 0) {
      toast.error(`Please mark attendance for ${stats.notMarked} remaining students`, {
        icon: "⚠️",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const attendanceData = {
        sessionId: classSession.id,
        students: students.map(s => ({
          studentId: s.id,
          status: s.status,
          timeMarked: new Date().toISOString()
        })),
        timestamp: new Date().toISOString()
      };
      
      toast.success("Attendance saved successfully! Great job! 🎉", {
        icon: "💾",
      });
      
      // Celebration effect
      setCelebrationMode(true);
      setTimeout(() => {
        onComplete(attendanceData);
      }, 1500);
      
    } catch (error) {
      toast.error("Failed to save attendance. Please try again.", {
        icon: "❌",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case "present": return "bg-green-50 text-green-600 border-green-200";
      case "absent": return "bg-red-50 text-red-600 border-red-200";
      case "late": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "not_marked": return "bg-gray-50 text-gray-600 border-gray-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case "present": return <CheckCircle className="h-4 w-4" />;
      case "absent": return <XCircle className="h-4 w-4" />;
      case "late": return <Clock className="h-4 w-4" />;
      case "not_marked": return <Timer className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case "happy": return "😊";
      case "sad": return "😔";
      default: return "😐";
    }
  };

  const getAttendanceEmoji = (percentage: number) => {
    if (percentage >= 95) return "🌟";
    if (percentage >= 85) return "⭐";
    if (percentage >= 75) return "👍";
    return "📚";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Beautiful Header */}
      <motion.div 
        className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border/50 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center hover:from-primary/20 hover:to-secondary/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </motion.button>
            <div>
              <motion.h1 
                className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Taking Attendance
              </motion.h1>
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {classSession.name} • {classSession.subject}
              </motion.p>
            </div>
          </div>
          
          <motion.button
            onClick={resetAttendance}
            className="p-2 w-9 h-9 rounded-lg bg-gradient-to-br from-accent/10 to-chart-4/10 hover:from-accent/20 hover:to-chart-4/20 transition-all duration-300"
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="h-4 w-4 text-accent" />
          </motion.button>
        </div>
      </motion.div>

      <div className="p-4 pb-24 space-y-6">
        {/* Class Info & Enhanced Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <BookOpen className="h-5 w-5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-base">{classSession.time}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {classSession.location} • {classSession.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {stats.marked}/{stats.total}
                  </div>
                  <div className="text-xs text-muted-foreground">marked</div>
                  <motion.div 
                    className="text-xs text-chart-4 flex items-center gap-1 mt-1"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Activity className="w-3 h-3" />
                    {stats.progress.toFixed(0)}% done
                  </motion.div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Progress</span>
                  <span className="font-bold">{stats.progress.toFixed(0)}% complete</span>
                </div>
                <Progress value={stats.progress} className="h-3" />
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-xs">
                <motion.div 
                  className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-lg font-bold text-green-600">{stats.present}</div>
                  <div className="text-green-600 flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Present
                  </div>
                </motion.div>
                <motion.div 
                  className="text-center p-3 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-lg font-bold text-yellow-600">{stats.late}</div>
                  <div className="text-yellow-600 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    Late
                  </div>
                </motion.div>
                <motion.div 
                  className="text-center p-3 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-800/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-lg font-bold text-red-600">{stats.absent}</div>
                  <div className="text-red-600 flex items-center justify-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Absent
                  </div>
                </motion.div>
                <motion.div 
                  className="text-center p-3 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900/20 dark:to-slate-800/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-lg font-bold text-gray-600">{stats.notMarked}</div>
                  <div className="text-gray-600 flex items-center justify-center gap-1">
                    <Timer className="w-3 h-3" />
                    Pending
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Search */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search students by name or roll number... 🔍"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-gradient-to-r from-background to-background/50 border-primary/20 focus:border-primary/40"
          />
        </motion.div>

        {/* Enhanced Quick Actions */}
        <motion.div 
          className="flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button 
            onClick={markAllPresent}
            disabled={stats.notMarked === 0}
            className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Mark All Present
              <Sparkles className="h-4 w-4" />
            </div>
          </motion.button>
          
          <motion.button 
            onClick={saveAttendance}
            disabled={stats.notMarked > 0 || isSaving}
            className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <Timer className="h-4 w-4 animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Save className="h-4 w-4" />
                Save Attendance
                <Heart className="h-4 w-4" />
              </div>
            )}
          </motion.button>
        </motion.div>

        {/* Students List Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Students ({filteredStudents.length})
          </h3>
          {stats.notMarked > 0 && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge variant="outline" className="text-xs bg-gradient-to-r from-accent/10 to-chart-4/10 border-accent/30">
                <AlertCircle className="w-3 h-3 mr-1" />
                {stats.notMarked} pending
              </Badge>
            </motion.div>
          )}
        </motion.div>

        {/* Beautiful Students List */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatePresence>
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className={`border transition-all duration-300 shadow-lg hover:shadow-xl ${
                  student.status !== "not_marked" 
                    ? "border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5" 
                    : "border-border hover:border-primary/20"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {/* Mood indicator */}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xs border-2 border-background">
                            {getMoodEmoji(student.mood)}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-base">{student.name}</h4>
                            {student.streak! > 10 && (
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Badge className="bg-orange-100 text-orange-600 border-orange-200 text-xs">
                                  <Flame className="w-3 h-3 mr-1" />
                                  {student.streak}🔥
                                </Badge>
                              </motion.div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Roll: {student.rollNumber}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {getAttendanceEmoji(student.previousAttendance)}
                              {student.previousAttendance}% attendance
                            </span>
                          </div>
                          {student.streak! > 0 && (
                            <div className="text-xs text-chart-4 flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3" />
                              {student.streak} day streak!
                            </div>
                          )}
                        </div>
                      </div>

                      <motion.div
                        animate={student.status !== "not_marked" ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Badge className={`text-xs border ${getStatusColor(student.status)} flex-shrink-0`}>
                          {getStatusIcon(student.status)}
                          <span className="ml-1 capitalize">
                            {student.status === "not_marked" ? "Pending" : student.status}
                          </span>
                        </Badge>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <motion.button
                        onClick={() => updateStudentStatus(student.id, "present")}
                        className={`h-10 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1 ${
                          student.status === "present"
                            ? "bg-green-500 text-white shadow-lg"
                            : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Check className="h-3 w-3" />
                        Present
                      </motion.button>
                      
                      <motion.button
                        onClick={() => updateStudentStatus(student.id, "late")}
                        className={`h-10 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1 ${
                          student.status === "late"
                            ? "bg-yellow-500 text-white shadow-lg"
                            : "bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-100"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Clock className="h-3 w-3" />
                        Late
                      </motion.button>
                      
                      <motion.button
                        onClick={() => updateStudentStatus(student.id, "absent")}
                        className={`h-10 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1 ${
                          student.status === "absent"
                            ? "bg-red-500 text-white shadow-lg"
                            : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <X className="h-3 w-3" />
                        Absent
                      </motion.button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredStudents.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <p className="text-muted-foreground">No students found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search 🔍</p>
            </motion.div>
          )}
        </motion.div>

        {/* Floating Save Button */}
        <AnimatePresence>
          {stats.notMarked === 0 && (
            <motion.div 
              className="fixed bottom-20 left-4 right-4 z-10"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <motion.button 
                onClick={saveAttendance}
                disabled={isSaving}
                className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={celebrationMode ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5, repeat: celebrationMode ? Infinity : 0 }}
              >
                {isSaving ? (
                  <>
                    <Timer className="h-5 w-5 animate-spin" />
                    Saving Attendance...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Attendance ({stats.total} students)
                    <Trophy className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Celebration Overlay */}
        <AnimatePresence>
          {celebrationMode && (
            <motion.div
              className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-6xl"
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [0, 360, 720] 
                }}
                transition={{ duration: 2 }}
              >
                🎉
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};