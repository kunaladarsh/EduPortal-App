import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  ArrowLeft, Calendar as CalendarIcon, Clock, Users, CheckCircle, XCircle, 
  BookOpen, Save, RefreshCw, Search, Filter, AlertCircle,
  User, Target, Edit, MoreVertical, History,
  Calendar, TrendingUp, BarChart3
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  class: string;
  avatar?: string;
  phone?: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  subject: string;
  class: string;
  status: "present" | "absent" | "late" | "excused";
  timeIn?: string;
  timeOut?: string;
  notes?: string;
  markedBy: string;
  markedAt: string;
  lastModified?: string;
}

interface ClassSession {
  id: string;
  className: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  studentsCount: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  status: "completed" | "ongoing" | "scheduled";
  location: string;
}

interface MobileTeacherAttendanceEditProps {
  session?: ClassSession;
  onBack: () => void;
  onSave?: (attendanceData: any) => void;
  onPageChange?: (page: string) => void;
}

// Mock data
const mockStudents: Student[] = [
  { id: "1", name: "Alice Johnson", email: "alice.j@school.edu", enrollmentNumber: "STU001", class: "10A", phone: "+1234567890" },
  { id: "2", name: "Bob Smith", email: "bob.s@school.edu", enrollmentNumber: "STU002", class: "10A", phone: "+1234567891" },
  { id: "3", name: "Carol Davis", email: "carol.d@school.edu", enrollmentNumber: "STU003", class: "10A", phone: "+1234567892" },
  { id: "4", name: "David Wilson", email: "david.w@school.edu", enrollmentNumber: "STU004", class: "10A", phone: "+1234567893" },
];

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "att_001", studentId: "1", studentName: "Alice Johnson", date: "2024-01-22", subject: "Mathematics",
    class: "10A", status: "present", timeIn: "09:05", markedBy: "Ms. Johnson", markedAt: "2024-01-22T09:05:00Z"
  },
  {
    id: "att_002", studentId: "2", studentName: "Bob Smith", date: "2024-01-22", subject: "Mathematics",
    class: "10A", status: "late", timeIn: "09:15", notes: "Traffic jam", markedBy: "Ms. Johnson", markedAt: "2024-01-22T09:15:00Z"
  },
  {
    id: "att_003", studentId: "3", studentName: "Carol Davis", date: "2024-01-22", subject: "Mathematics",
    class: "10A", status: "absent", markedBy: "Ms. Johnson", markedAt: "2024-01-22T09:30:00Z"
  },
];

export const MobileTeacherAttendanceEdit: React.FC<MobileTeacherAttendanceEditProps> = ({ 
  session, 
  onBack,
  onSave,
  onPageChange 
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("records");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get unique classes and subjects for filters
  const uniqueClasses = [...new Set(attendanceRecords.map(r => r.class))];
  const uniqueSubjects = [...new Set(attendanceRecords.map(r => r.subject))];

  // Filter records based on current filters
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesDate = !selectedDate || record.date === selectedDate.toISOString().split('T')[0];
    const matchesClass = selectedClass === "all" || record.class === selectedClass;
    const matchesSubject = selectedSubject === "all" || record.subject === selectedSubject;
    const matchesSearch = !searchQuery || 
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.class.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDate && matchesClass && matchesSubject && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-50 text-green-600 border-green-200";
      case "absent": return "bg-red-50 text-red-600 border-red-200";
      case "late": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "excused": return "bg-blue-50 text-blue-600 border-blue-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return <CheckCircle className="h-4 w-4" />;
      case "absent": return <XCircle className="h-4 w-4" />;
      case "late": return <Clock className="h-4 w-4" />;
      case "excused": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleEditRecord = (record: AttendanceRecord) => {
    setEditingRecord({ ...record });
  };

  const handleSaveRecord = async () => {
    if (!editingRecord) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.id === editingRecord.id 
          ? { ...editingRecord, lastModified: new Date().toISOString() }
          : record
      )
    );
    
    setEditingRecord(null);
    setIsLoading(false);
    toast.success("Attendance record updated successfully!");
    
    if (onSave) {
      onSave(attendanceRecords);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAttendanceRecords(prev => prev.filter(record => record.id !== recordId));
    setIsLoading(false);
    toast.success("Attendance record deleted successfully!");
  };

  const getAttendanceStats = () => {
    const total = filteredRecords.length;
    const present = filteredRecords.filter(r => r.status === "present").length;
    const absent = filteredRecords.filter(r => r.status === "absent").length;
    const late = filteredRecords.filter(r => r.status === "late").length;
    const excused = filteredRecords.filter(r => r.status === "excused").length;
    
    return { total, present, absent, late, excused };
  };

  const stats = getAttendanceStats();

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
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Edit Attendance</h1>
              <p className="text-sm text-muted-foreground">
                {session ? `${session.subject} - ${session.className}` : "Manage attendance records"}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info("Export feature coming soon!")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                      <div className="text-sm text-green-600">Present</div>
                      <div className="text-xs text-muted-foreground">
                        {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                      </div>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                      <div className="text-sm text-red-600">Absent</div>
                      <div className="text-xs text-muted-foreground">
                        {stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0}%
                      </div>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                      <div className="text-sm text-yellow-600">Late</div>
                      <div className="text-xs text-muted-foreground">
                        {stats.total > 0 ? Math.round((stats.late / stats.total) * 100) : 0}%
                      </div>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                      <div className="text-sm text-blue-600">Total</div>
                      <div className="text-xs text-muted-foreground">Records</div>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Records Tab */}
          <TabsContent value="records" className="space-y-4">
            {/* Filters */}
            <Card className="border-0">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students, subjects, or classes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {uniqueClasses.map(cls => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {uniqueSubjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Records List */}
            <div className="space-y-3">
              {filteredRecords.length === 0 ? (
                <Card className="border-0">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">No records found</h3>
                    <p className="text-muted-foreground text-sm">
                      Try adjusting your filters or search terms.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredRecords.map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${record.studentName}`} />
                            <AvatarFallback>
                              {record.studentName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium truncate">{record.studentName}</h4>
                              <Badge className={`text-xs border ${getStatusColor(record.status)}`}>
                                {getStatusIcon(record.status)}
                                <span className="ml-1 capitalize">{record.status}</span>
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {record.subject} • Class {record.class} • {record.date}
                            </div>
                            {record.timeIn && (
                              <div className="text-xs text-muted-foreground">
                                Time: {record.timeIn}
                              </div>
                            )}
                            {record.notes && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Note: {record.notes}
                              </div>
                            )}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditRecord(record)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteRecord(record.id)}
                                className="text-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Record Dialog */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg p-6 w-full max-w-sm"
          >
            <h3 className="font-semibold mb-4">Edit Attendance</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Student</label>
                <p className="text-sm text-muted-foreground">{editingRecord.studentName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={editingRecord.status} onValueChange={(value: any) => 
                  setEditingRecord(prev => prev ? { ...prev, status: value } : null)
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={editingRecord.notes || ""}
                  onChange={(e) => setEditingRecord(prev => 
                    prev ? { ...prev, notes: e.target.value } : null
                  )}
                  placeholder="Add any notes..."
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={handleSaveRecord} disabled={isLoading} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setEditingRecord(null)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};