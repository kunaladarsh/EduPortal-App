import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { 
  ArrowLeft, Users, CheckCircle, XCircle, Clock, AlertCircle,
  Search, Filter, Download, Calendar, MapPin, BookOpen, 
  TrendingUp, BarChart3, Eye, Edit, RefreshCw, Target,
  User, Phone, Mail, Home, Star, Award, Heart, Flame
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatar?: string;
  email?: string;
  phone?: string;
  status: "present" | "absent" | "late" | "excused";
  checkInTime?: string;
  note?: string;
  attendanceRate: number;
  streak: number;
}

interface AttendanceSession {
  id: string;
  className: string;
  subject: string;
  date: string;
  time: string;
  endTime: string;
  duration: string;
  location: string;
  teacher: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
  lastUpdated: string;
  students: Student[];
}

interface MobileAttendanceDetailsProps {
  classId: string;
  session?: AttendanceSession;
  onBack: () => void;
  onEdit?: () => void;
  onPageChange?: (page: string) => void;
}

export const MobileAttendanceDetails: React.FC<MobileAttendanceDetailsProps> = ({
  classId,
  session,
  onBack,
  onEdit,
  onPageChange
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "present" | "absent" | "late" | "excused">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);

  // Mock data - in real app, this would fetch based on classId
  useEffect(() => {
    const mockSession: AttendanceSession = {
      id: classId,
      className: "Class 10A",
      subject: "Mathematics",
      date: new Date().toISOString().split('T')[0],
      time: "09:00 AM",
      endTime: "09:50 AM",
      duration: "50 min",
      location: "Room 101",
      teacher: user?.name || "Mr. Johnson",
      totalStudents: 32,
      presentCount: 29,
      absentCount: 2,
      lateCount: 1,
      excusedCount: 0,
      attendanceRate: 90.6,
      lastUpdated: "2 hours ago",
      students: [
        {
          id: "s001",
          name: "Alice Johnson",
          rollNumber: "10A01",
          avatar: "/api/placeholder/32/32",
          email: "alice@school.edu",
          phone: "+1234567890",
          status: "present",
          checkInTime: "09:02 AM",
          attendanceRate: 95.2,
          streak: 15
        },
        {
          id: "s002",
          name: "Bob Smith",
          rollNumber: "10A02",
          avatar: "/api/placeholder/32/32",
          email: "bob@school.edu",
          phone: "+1234567891",
          status: "present",
          checkInTime: "09:01 AM",
          attendanceRate: 88.7,
          streak: 3
        },
        {
          id: "s003",
          name: "Charlie Brown",
          rollNumber: "10A03",
          avatar: "/api/placeholder/32/32",
          email: "charlie@school.edu",
          phone: "+1234567892",
          status: "late",
          checkInTime: "09:15 AM",
          note: "Bus was delayed",
          attendanceRate: 82.4,
          streak: 0
        },
        {
          id: "s004",
          name: "Diana Prince",
          rollNumber: "10A04",
          avatar: "/api/placeholder/32/32",
          email: "diana@school.edu",
          phone: "+1234567893",
          status: "absent",
          attendanceRate: 91.3,
          streak: 0
        },
        {
          id: "s005",
          name: "Edward Norton",
          rollNumber: "10A05",
          avatar: "/api/placeholder/32/32",
          email: "edward@school.edu",
          phone: "+1234567894",
          status: "present",
          checkInTime: "08:58 AM",
          attendanceRate: 97.1,
          streak: 22
        },
        // Add more mock students...
        ...Array.from({ length: 27 }, (_, i) => ({
          id: `s${String(i + 6).padStart(3, '0')}`,
          name: `Student ${i + 6}`,
          rollNumber: `10A${String(i + 6).padStart(2, '0')}`,
          avatar: "/api/placeholder/32/32",
          email: `student${i + 6}@school.edu`,
          phone: `+123456${String(i + 789).padStart(4, '0')}`,
          status: Math.random() > 0.85 ? (Math.random() > 0.5 ? "absent" : "late") : "present" as "present" | "absent" | "late",
          checkInTime: Math.random() > 0.85 ? undefined : `09:${String(Math.floor(Math.random() * 10)).padStart(2, '0')} AM`,
          attendanceRate: 75 + Math.random() * 25,
          streak: Math.floor(Math.random() * 30)
        }))
      ]
    };
    
    setCurrentSession(session || mockSession);
  }, [classId, session, user?.name]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success("Attendance data refreshed", {
      icon: "🔄",
    });
  };

  const handleExport = () => {
    toast.success("Attendance data exported successfully", {
      icon: "📄",
    });
  };

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-700 border-green-200";
      case "absent": return "bg-red-100 text-red-700 border-red-200";
      case "late": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "excused": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case "present": return <CheckCircle className="w-4 h-4" />;
      case "absent": return <XCircle className="w-4 h-4" />;
      case "late": return <Clock className="w-4 h-4" />;
      case "excused": return <AlertCircle className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const filteredStudents = currentSession?.students?.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading attendance details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <motion.div 
        className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border/50 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center hover:from-primary/20 hover:to-secondary/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </motion.button>
            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Attendance Details
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentSession.className} • {currentSession.subject}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="text-xs px-3 h-8 bg-gradient-to-r from-accent/5 to-chart-4/5 hover:from-accent/10 hover:to-chart-4/10 border-accent/20"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 w-8 h-8 rounded-lg bg-gradient-to-br from-secondary/10 to-primary/10 hover:from-secondary/20 hover:to-primary/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`h-4 w-4 text-secondary ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="p-4 pb-24 space-y-6">
        {/* Session Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(currentSession.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentSession.time} - {currentSession.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{currentSession.location}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {currentSession.attendanceRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Attendance Rate</div>
                  <div className="flex items-center justify-end gap-1 text-xs text-chart-4 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Great!</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Progress value={currentSession.attendanceRate} className="h-2" />
              </div>
              
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="text-center p-2 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-lg">
                  <div className="text-sm font-bold text-green-600">{currentSession.presentCount}</div>
                  <div className="text-xs text-green-600">Present</div>
                </div>
                <div className="text-center p-2 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/20 rounded-lg">
                  <div className="text-sm font-bold text-yellow-600">{currentSession.lateCount}</div>
                  <div className="text-xs text-yellow-600">Late</div>
                </div>
                <div className="text-center p-2 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-800/20 rounded-lg">
                  <div className="text-sm font-bold text-red-600">{currentSession.absentCount}</div>
                  <div className="text-xs text-red-600">Absent</div>
                </div>
                <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/20 dark:to-sky-800/20 rounded-lg">
                  <div className="text-sm font-bold text-blue-600">{currentSession.excusedCount}</div>
                  <div className="text-xs text-blue-600">Excused</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50"
            />
          </div>
          <div className="flex gap-1">
            {["all", "present", "absent", "late"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status as any)}
                className="px-3 h-10 text-xs capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleExport}
            variant="outline"
            className="flex-1 bg-gradient-to-r from-secondary/5 to-primary/5 hover:from-secondary/10 hover:to-primary/10 border-secondary/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => onPageChange?.("attendance-analytics")}
            variant="outline"
            className="flex-1 bg-gradient-to-r from-accent/5 to-chart-4/5 hover:from-accent/10 hover:to-chart-4/10 border-accent/20"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </motion.div>

        {/* Students List Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Students ({filteredStudents.length})
          </h3>
          <Badge variant="outline" className="text-xs bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <Target className="w-3 h-3 mr-1" />
            {currentSession.totalStudents} enrolled
          </Badge>
        </motion.div>

        {/* Students List */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatePresence>
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-card to-card/80">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">{student.name}</h4>
                            {student.streak > 10 && (
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  {student.streak}
                                </Badge>
                              </motion.div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                          {student.checkInTime && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Clock className="w-3 h-3" />
                              <span>Check-in: {student.checkInTime}</span>
                            </div>
                          )}
                          {student.note && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              Note: {student.note}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <Badge className={`text-xs border ${getStatusColor(student.status)}`}>
                          {getStatusIcon(student.status)}
                          <span className="ml-1 capitalize">{student.status}</span>
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {student.attendanceRate.toFixed(1)}% rate
                        </div>
                        {student.streak > 0 && (
                          <div className="flex items-center gap-1 text-xs text-chart-4">
                            <Flame className="w-3 h-3" />
                            <span>{student.streak} streak</span>
                          </div>
                        )}
                      </div>
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
                <Users className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <p className="text-muted-foreground">No students found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter</p>
            </motion.div>
          )}
        </motion.div>

        {/* Summary Footer */}
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 bg-gradient-to-br from-chart-4/10 to-green-100/50 dark:from-chart-4/20 dark:to-green-900/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-chart-4" />
                <span className="text-sm font-medium text-chart-4">
                  Last updated: {currentSession.lastUpdated}
                </span>
                <Heart className="w-4 h-4 text-chart-4" />
              </div>
              <p className="text-xs text-muted-foreground">
                Keep tracking for better insights! 📊
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};