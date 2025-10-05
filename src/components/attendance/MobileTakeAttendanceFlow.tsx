import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  ArrowLeft, Calendar as CalendarIcon, Clock, Users, CheckCircle, XCircle, 
  BookOpen, MapPin, Save, RefreshCw, Plus, Search, Filter, AlertCircle,
  User, School, Target, Activity, Award, Bell, Phone, Mail, Info,
  ChevronDown, ChevronUp, Timer, Smartphone, Wifi, WifiOff, MessageSquare,
  Clock3, ShieldCheck, UserCheck, UserX, Eye, Download, Share, Star,
  Settings, Zap, FileText, Edit, Camera, QrCode, Volume2, VolumeX,
  MapPinIcon, Loader2
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { Switch } from "../ui/switch";

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  class: string;
  avatar?: string;
  status: "present" | "absent" | "late" | "excused" | "pending";
  timeIn?: string;
  notes?: string;
  isManuallyMarked: boolean;
  phone?: string;
  parentPhone?: string;
  previousAttendanceRate: number;
  recentAbsences: number;
  lastPresent?: string;
  medicalConditions?: string[];
}

interface ClassSession {
  id: string;
  className: string;
  subject: string;
  time: string;
  duration: string;
  studentsCount: number;
  attendanceStatus: "not-started" | "in-progress" | "completed";
  presentCount: number;
  absentCount: number;
  lateCount: number;
  teacher: string;
  location: string;
  date: string;
}

interface MobileTakeAttendanceFlowProps {
  session: ClassSession;
  onBack: () => void;
  onComplete: (attendanceData: any) => void;
  onPageChange: (page: string) => void;
}

export const MobileTakeAttendanceFlow: React.FC<MobileTakeAttendanceFlowProps> = ({
  session,
  onBack,
  onComplete,
  onPageChange
}) => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStep, setCurrentStep] = useState<"setup" | "attendance" | "review" | "complete">("setup");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "pending" | "marked">("all");
  const [bulkAction, setBulkAction] = useState<"present" | "absent" | null>(null);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    notifyParents: true,
    sendSMS: false,
    emailReport: true
  });

  // Initialize students data
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Alice Johnson",
        email: "alice.johnson@student.edu",
        enrollmentNumber: "STU2024001",
        class: session.className,
        avatar: "",
        status: "pending",
        isManuallyMarked: false,
        phone: "+1234567890",
        parentPhone: "+1234567891",
        previousAttendanceRate: 95,
        recentAbsences: 0,
        lastPresent: "2024-01-19",
        medicalConditions: []
      },
      {
        id: "2",
        name: "Bob Smith", 
        email: "bob.smith@student.edu",
        enrollmentNumber: "STU2024002",
        class: session.className,
        avatar: "",
        status: "pending",
        isManuallyMarked: false,
        phone: "+1234567892",
        parentPhone: "+1234567893",
        previousAttendanceRate: 87,
        recentAbsences: 1,
        lastPresent: "2024-01-18",
        medicalConditions: ["Asthma"]
      },
      {
        id: "3",
        name: "Carol Davis",
        email: "carol.davis@student.edu", 
        enrollmentNumber: "STU2024003",
        class: session.className,
        avatar: "",
        status: "pending",
        isManuallyMarked: false,
        phone: "+1234567894",
        parentPhone: "+1234567895",
        previousAttendanceRate: 100,
        recentAbsences: 0,
        lastPresent: "2024-01-19",
        medicalConditions: []
      },
      {
        id: "4",
        name: "David Wilson",
        email: "david.wilson@student.edu",
        enrollmentNumber: "STU2024004", 
        class: session.className,
        avatar: "",
        status: "pending",
        isManuallyMarked: false,
        phone: "+1234567896",
        parentPhone: "+1234567897",
        previousAttendanceRate: 78,
        recentAbsences: 3,
        lastPresent: "2024-01-17",
        medicalConditions: ["Diabetes"]
      },
      {
        id: "5",
        name: "Emma Thompson",
        email: "emma.thompson@student.edu",
        enrollmentNumber: "STU2024005",
        class: session.className,
        avatar: "",
        status: "pending",
        isManuallyMarked: false,
        phone: "+1234567898", 
        parentPhone: "+1234567899",
        previousAttendanceRate: 92,
        recentAbsences: 1,
        lastPresent: "2024-01-19",
        medicalConditions: []
      }
    ];
    setStudents(mockStudents);
  }, [session.className]);

  const getAttendanceStats = () => {
    const total = students.length;
    const present = students.filter(s => s.status === "present").length;
    const absent = students.filter(s => s.status === "absent").length;
    const late = students.filter(s => s.status === "late").length;
    const excused = students.filter(s => s.status === "excused").length;
    const pending = students.filter(s => s.status === "pending").length;
    const marked = total - pending;
    const progress = total > 0 ? (marked / total) * 100 : 0;
    
    return { total, present, absent, late, excused, pending, marked, progress };
  };

  const filteredStudents = students.filter(student => {
    if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !student.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (selectedFilter === "pending" && student.status !== "pending") return false;
    if (selectedFilter === "marked" && student.status === "pending") return false;
    
    return true;
  });

  const updateStudentStatus = (studentId: string, status: Student['status'], notes?: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { 
            ...student, 
            status, 
            notes: notes || student.notes,
            timeIn: status === "present" || status === "late" ? new Date().toLocaleTimeString() : undefined,
            isManuallyMarked: true
          } 
        : student
    ));

    if (autoSave) {
      toast.success(`${status === "present" ? "Marked present" : status === "absent" ? "Marked absent" : `Marked ${status}`}`);
    }
  };

  const applyBulkAction = (action: "present" | "absent") => {
    const pendingStudents = students.filter(s => s.status === "pending");
    setStudents(prev => prev.map(student => 
      student.status === "pending" 
        ? { 
            ...student, 
            status: action,
            timeIn: action === "present" ? new Date().toLocaleTimeString() : undefined,
            isManuallyMarked: true
          } 
        : student
    ));
    
    toast.success(`Marked ${pendingStudents.length} students as ${action}`);
    setBulkAction(null);
  };

  const handleComplete = async () => {
    const stats = getAttendanceStats();
    
    if (stats.pending > 0) {
      toast.error(`Please mark attendance for ${stats.pending} remaining students`);
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate saving attendance
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const attendanceData = {
        sessionId: session.id,
        students: students.map(s => ({
          studentId: s.id,
          status: s.status,
          timeIn: s.timeIn,
          notes: s.notes
        })),
        notes,
        timestamp: new Date().toISOString(),
        notifications: notificationSettings
      };
      
      onComplete(attendanceData);
      toast.success("Attendance saved successfully!");
      
    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  const stats = getAttendanceStats();

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case "present": return "bg-green-50 text-green-600 border-green-200";
      case "absent": return "bg-red-50 text-red-600 border-red-200";
      case "late": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "excused": return "bg-blue-50 text-blue-600 border-blue-200";
      case "pending": return "bg-gray-50 text-gray-600 border-gray-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case "present": return <CheckCircle className="h-3 w-3" />;
      case "absent": return <XCircle className="h-3 w-3" />;
      case "late": return <Clock className="h-3 w-3" />;
      case "excused": return <UserCheck className="h-3 w-3" />;
      case "pending": return <Timer className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getAttendanceRiskLevel = (student: Student) => {
    if (student.previousAttendanceRate < 75) return "high";
    if (student.previousAttendanceRate < 85) return "medium";
    return "low";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      default: return "text-green-600";
    }
  };

  if (currentStep === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4 safe-area-top safe-area-bottom">
        <div className="max-w-md mx-auto pt-4 space-y-4">
          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              
              <h3 className="text-lg font-semibold mb-2">Attendance Completed!</h3>
              <p className="text-muted-foreground mb-4">
                Successfully recorded attendance for {session.className}
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                  <div className="text-xs text-muted-foreground">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                  <div className="text-xs text-muted-foreground">Late</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                  <div className="text-xs text-muted-foreground">Absent</div>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={() => onPageChange("attendance")}
                >
                  View Reports
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onBack}
                >
                  Back to Classes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4 safe-area-top safe-area-bottom">
      <div className="max-w-md mx-auto pt-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 w-9 h-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Take Attendance</h1>
            <p className="text-sm text-muted-foreground">{session.className}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>{new Date().toLocaleDateString()}</div>
            <div>{session.time}</div>
          </div>
        </div>

        {/* Progress */}
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">Progress</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {stats.marked}/{stats.total}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stats.progress.toFixed(0)}% complete
                </div>
              </div>
            </div>
            
            <Progress value={stats.progress} className="mb-3" />
            
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center p-1 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="font-semibold text-green-600">{stats.present}</div>
                <div className="text-green-600">Present</div>
              </div>
              <div className="text-center p-1 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <div className="font-semibold text-yellow-600">{stats.late}</div>
                <div className="text-yellow-600">Late</div>
              </div>
              <div className="text-center p-1 bg-red-50 dark:bg-red-900/20 rounded">
                <div className="font-semibold text-red-600">{stats.absent}</div>
                <div className="text-red-600">Absent</div>
              </div>
              <div className="text-center p-1 bg-gray-50 dark:bg-gray-900/20 rounded">
                <div className="font-semibold text-gray-600">{stats.pending}</div>
                <div className="text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["all", "pending", "marked"] as const).map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4"
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {stats.pending > 0 && (
          <Card className="border-0 bg-gradient-to-r from-accent/5 to-chart-4/5">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyBulkAction("present")}
                  className="flex-1 text-xs"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Mark All Present
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyBulkAction("absent")}
                  className="flex-1 text-xs"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Mark All Absent
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Students List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Students ({filteredStudents.length})</h3>
            {stats.pending > 0 && (
              <Badge variant="outline" className="text-xs">
                {stats.pending} pending
              </Badge>
            )}
          </div>

          <AnimatePresence>
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`border transition-all duration-200 ${
                  student.status !== "pending" 
                    ? "border-primary/20 bg-primary/5" 
                    : "border-border hover:shadow-sm"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{student.name}</h4>
                            {getAttendanceRiskLevel(student) !== "low" && (
                              <Badge variant="outline" className={`text-xs ${getRiskColor(getAttendanceRiskLevel(student))}`}>
                                {getAttendanceRiskLevel(student)} risk
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>#{student.enrollmentNumber}</span>
                            <span>•</span>
                            <span>{student.previousAttendanceRate}% attendance</span>
                            {student.recentAbsences > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-red-600">{student.recentAbsences} recent absences</span>
                              </>
                            )}
                          </div>
                          {student.medicalConditions && student.medicalConditions.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              <span>Medical: {student.medicalConditions.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Badge className={`text-xs border ${getStatusColor(student.status)} flex-shrink-0`}>
                        {getStatusIcon(student.status)}
                        <span className="ml-1 capitalize">
                          {student.status === "pending" ? "Pending" : student.status}
                        </span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-1">
                      <Button
                        variant={student.status === "present" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateStudentStatus(student.id, "present")}
                        className="text-xs h-7"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                      <Button
                        variant={student.status === "late" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateStudentStatus(student.id, "late")}
                        className="text-xs h-7"
                      >
                        <Clock className="h-3 w-3" />
                      </Button>
                      <Button
                        variant={student.status === "absent" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateStudentStatus(student.id, "absent")}
                        className="text-xs h-7"
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                      <Button
                        variant={student.status === "excused" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateStudentStatus(student.id, "excused")}
                        className="text-xs h-7"
                      >
                        <UserCheck className="h-3 w-3" />
                      </Button>
                    </div>

                    {student.timeIn && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Marked at: {student.timeIn}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No students found</p>
            </div>
          )}
        </div>

        {/* Session Notes */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Session Notes (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Textarea
              placeholder="Add any notes about this session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="text-sm">Notify parents of absences</span>
              </div>
              <Switch
                checked={notificationSettings.notifyParents}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, notifyParents: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Email attendance report</span>
              </div>
              <Switch
                checked={notificationSettings.emailReport}
                onCheckedChange={(checked) => 
                  setNotificationSettings(prev => ({ ...prev, emailReport: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Complete Button */}
        <div className="pb-4">
          <Button
            className="w-full"
            size="lg"
            onClick={handleComplete}
            disabled={stats.pending > 0 || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving Attendance...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Complete Attendance
              </>
            )}
          </Button>
          
          {stats.pending > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Please mark attendance for {stats.pending} remaining students
            </p>
          )}
        </div>
      </div>
    </div>
  );
};