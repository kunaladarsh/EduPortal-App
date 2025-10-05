import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Timer,
  Save,
  ArrowLeft,
  RotateCcw,
  Send,
  Eye,
  EyeOff,
  Settings,
  Calendar,
  BookOpen,
  MapPin,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

interface TakeAttendanceModernProps {
  onBack: () => void;
  onComplete: (attendanceData: AttendanceRecord[]) => void;
  classData?: {
    id: string;
    name: string;
    subject: string;
    teacher: string;
    room: string;
    time: string;
    date: string;
  };
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  avatar?: string;
  previousAttendance?: number; // percentage
}

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timestamp: string;
  note?: string;
}

export const TakeAttendanceModern: React.FC<TakeAttendanceModernProps> = ({
  onBack,
  onComplete,
  classData = {
    id: '1',
    name: 'Mathematics 101',
    subject: 'Advanced Calculus',
    teacher: 'Dr. Sarah Johnson',
    room: 'Room 204',
    time: '10:00 AM - 11:30 AM',
    date: new Date().toLocaleDateString(),
  },
}) => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'late' | 'pending'>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('math101');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [lastManualSave, setLastManualSave] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Available classes for selection
  const availableClasses = [
    { id: 'math101', name: 'Mathematics 101', subject: 'Advanced Calculus' },
    { id: 'phy201', name: 'Physics 201', subject: 'Mechanics' },
    { id: 'chem301', name: 'Chemistry 301', subject: 'Organic Chemistry' },
    { id: 'bio102', name: 'Biology 102', subject: 'Cell Biology' },
  ];

  // Mock student data - replace with actual data fetching
  useEffect(() => {
    const mockStudents: Student[] = [
      { id: '1', name: 'Alice Johnson', rollNumber: 'MAT001', email: 'alice@school.edu', previousAttendance: 95 },
      { id: '2', name: 'Bob Smith', rollNumber: 'MAT002', email: 'bob@school.edu', previousAttendance: 87 },
      { id: '3', name: 'Carol Williams', rollNumber: 'MAT003', email: 'carol@school.edu', previousAttendance: 92 },
      { id: '4', name: 'David Brown', rollNumber: 'MAT004', email: 'david@school.edu', previousAttendance: 78 },
      { id: '5', name: 'Eva Davis', rollNumber: 'MAT005', email: 'eva@school.edu', previousAttendance: 89 },
      { id: '6', name: 'Frank Miller', rollNumber: 'MAT006', email: 'frank@school.edu', previousAttendance: 91 },
      { id: '7', name: 'Grace Wilson', rollNumber: 'MAT007', email: 'grace@school.edu', previousAttendance: 94 },
      { id: '8', name: 'Henry Taylor', rollNumber: 'MAT008', email: 'henry@school.edu', previousAttendance: 82 },
    ];
    setStudents(mockStudents);
  }, []);

  const markAttendance = (studentId: string, status: AttendanceRecord['status']) => {
    const newRecord: AttendanceRecord = {
      studentId,
      status,
      timestamp: new Date().toISOString(),
    };

    setAttendance(prev => {
      const updated = new Map(prev);
      updated.set(studentId, newRecord);
      return updated;
    });

    // Track unsaved changes when auto-save is disabled
    if (!autoSave) {
      setHasUnsavedChanges(true);
    }

    const student = students.find(s => s.id === studentId);
    if (autoSave) {
      toast.success(`${student?.name} marked ${status}`, {
        description: 'Auto-saved'
      });
    } else {
      toast.success(`${student?.name} marked ${status}`, {
        description: 'Remember to save manually'
      });
    }
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = Array.from(attendance.values()).filter(a => a.status === 'present').length;
    const absent = Array.from(attendance.values()).filter(a => a.status === 'absent').length;
    const late = Array.from(attendance.values()).filter(a => a.status === 'late').length;
    const excused = Array.from(attendance.values()).filter(a => a.status === 'excused').length;
    const pending = total - (present + absent + late + excused);

    return { total, present, absent, late, excused, pending };
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const studentAttendance = attendance.get(student.id);
    
    switch (filterStatus) {
      case 'present':
        return studentAttendance?.status === 'present';
      case 'absent':
        return studentAttendance?.status === 'absent';
      case 'late':
        return studentAttendance?.status === 'late';
      case 'pending':
        return !studentAttendance;
      default:
        return true;
    }
  });

  const handleSubmit = async () => {
    if (attendance.size === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    setIsSubmitting(true);
    
    // Show progress toast
    const loadingToast = toast.loading('Saving attendance...', {
      description: `Processing ${attendance.size} student records`
    });

    try {
      // Enhanced submission process
      const attendanceData = Array.from(attendance.entries()).map(([studentId, data]) => {
        const student = students.find(s => s.id === studentId);
        return {
          studentId,
          studentName: student?.name || 'Unknown',
          rollNumber: student?.rollNumber || '',
          status: data.status,
          timestamp: data.timestamp,
          date: selectedDate,
          classId: selectedClass,
          className: classData.name,
          subject: classData.subject
        };
      });

      // Simulate progressive save with progress updates
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.loading('Validating attendance data...', { id: loadingToast });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.loading('Saving to database...', { id: loadingToast });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.loading('Finalizing submission...', { id: loadingToast });
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // Calculate submission summary
      const presentCount = attendanceData.filter(a => a.status === 'present').length;
      const absentCount = attendanceData.filter(a => a.status === 'absent').length;
      const lateCount = attendanceData.filter(a => a.status === 'late').length;
      const excusedCount = attendanceData.filter(a => a.status === 'excused').length;
      const attendanceRate = ((presentCount + lateCount) / attendanceData.length * 100).toFixed(1);

      // Success feedback with detailed summary
      toast.success('Attendance submitted successfully!', {
        id: loadingToast,
        description: `${attendanceData.length} students • ${attendanceRate}% attendance rate`,
        duration: 4000
      });

      // Show detailed breakdown in a separate toast
      setTimeout(() => {
        toast.info('Attendance Summary', {
          description: `Present: ${presentCount} • Absent: ${absentCount} • Late: ${lateCount} • Excused: ${excusedCount}`,
          duration: 5000
        });
      }, 500);

      // Call completion handler
      onComplete(attendanceData);
      
    } catch (error) {
      console.error('Attendance submission error:', error);
      toast.error('Failed to submit attendance', {
        id: loadingToast,
        description: 'Please check your connection and try again',
        duration: 4000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = getAttendanceStats();
  const completionPercentage = ((stats.total - stats.pending) / stats.total) * 100;

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'absent':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'late':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'excused':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4" />;
      case 'absent':
        return <XCircle className="w-4 h-4" />;
      case 'late':
        return <Clock className="w-4 h-4" />;
      case 'excused':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-3 xs:p-4 space-y-4 xs:space-y-6 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 xs:space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 xs:gap-3 min-w-0">
            <Button variant="ghost" size="sm" onClick={onBack} className="h-9 w-9 p-0 shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg xs:text-xl font-semibold truncate">Take Attendance</h1>
              <p className="text-xs xs:text-sm text-muted-foreground truncate">{classData.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 xs:gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="h-9 w-9 p-0">
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Date and Class Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    <div>
                      <div className="font-medium">{cls.name}</div>
                      <div className="text-xs text-muted-foreground">{cls.subject}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Class Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-border/50">
                <CardContent className="p-3 xs:p-4">
                  <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-3 xs:gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="w-4 h-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Subject</p>
                        <p className="text-sm font-medium truncate">{availableClasses.find(c => c.id === selectedClass)?.subject || classData.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-4 h-4 text-secondary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Room</p>
                        <p className="text-sm font-medium truncate">{classData.room}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <Clock className="w-4 h-4 text-accent shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="text-sm font-medium truncate">{classData.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <Calendar className="w-4 h-4 text-chart-4 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium truncate">{new Date(selectedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-card via-card/95 to-primary/5 border-border/50">
          <CardHeader className="pb-3 xs:pb-4">
            <CardTitle className="flex items-center justify-between text-base xs:text-lg">
              <span className="flex items-center gap-2 min-w-0">
                <Users className="w-4 xs:w-5 h-4 xs:h-5 text-primary shrink-0" />
                <span className="truncate">Attendance Progress</span>
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-xs">
                  {stats.total - stats.pending}/{stats.total} done
                </Badge>
                {!autoSave && hasUnsavedChanges && (
                  <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/20 animate-pulse">
                    <Timer className="w-2.5 h-2.5 mr-1" />
                    Unsaved
                  </Badge>
                )}
                {!autoSave && lastManualSave && !hasUnsavedChanges && attendance.size > 0 && (
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle className="w-2.5 h-2.5 mr-1" />
                    Saved
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 xs:space-y-4 pt-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Progress</span>
                <span>{completionPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-3 xs:grid-cols-5 gap-2 xs:gap-3">
              <div className="text-center p-2 xs:p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-3 xs:w-4 h-3 xs:h-4 text-green-600" />
                  <span className="font-bold text-green-600 text-sm xs:text-base">{stats.present}</span>
                </div>
                <p className="text-xs text-green-600">Present</p>
              </div>
              
              <div className="text-center p-2 xs:p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle className="w-3 xs:w-4 h-3 xs:h-4 text-red-600" />
                  <span className="font-bold text-red-600 text-sm xs:text-base">{stats.absent}</span>
                </div>
                <p className="text-xs text-red-600">Absent</p>
              </div>
              
              <div className="text-center p-2 xs:p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-3 xs:w-4 h-3 xs:h-4 text-orange-600" />
                  <span className="font-bold text-orange-600 text-sm xs:text-base">{stats.late}</span>
                </div>
                <p className="text-xs text-orange-600">Late</p>
              </div>
              
              <div className="text-center p-2 xs:p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 xs:block hidden">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertCircle className="w-3 xs:w-4 h-3 xs:h-4 text-blue-600" />
                  <span className="font-bold text-blue-600 text-sm xs:text-base">{stats.excused}</span>
                </div>
                <p className="text-xs text-blue-600">Excused</p>
              </div>
              
              <div className="text-center p-2 xs:p-3 bg-gray-500/10 rounded-lg border border-gray-500/20 xs:block hidden">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Timer className="w-3 xs:w-4 h-3 xs:h-4 text-gray-600" />
                  <span className="font-bold text-gray-600 text-sm xs:text-base">{stats.pending}</span>
                </div>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>

            {/* Mobile-only row for excused and pending */}
            <div className="grid grid-cols-2 gap-2 xs:hidden">
              <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertCircle className="w-3 h-3 text-blue-600" />
                  <span className="font-bold text-blue-600 text-sm">{stats.excused}</span>
                </div>
                <p className="text-xs text-blue-600">Excused</p>
              </div>
              
              <div className="text-center p-2 bg-gray-500/10 rounded-lg border border-gray-500/20">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Timer className="w-3 h-3 text-gray-600" />
                  <span className="font-bold text-gray-600 text-sm">{stats.pending}</span>
                </div>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        
        {/* Filter Buttons - Stack on mobile */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
              className="h-8 px-3 text-xs xs:text-sm"
            >
              All ({students.length})
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
              className="h-8 px-3 text-xs xs:text-sm"
            >
              Pending ({stats.pending})
            </Button>
            <Button
              variant={filterStatus === 'present' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('present')}
              className="h-8 px-3 text-xs xs:text-sm bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
            >
              Present ({stats.present})
            </Button>
            
            {/* Mark All Present Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newAttendance = new Map();
                students.forEach(student => {
                  newAttendance.set(student.id, { status: 'present', timestamp: new Date() });
                });
                setAttendance(newAttendance);
                toast.success(`All ${students.length} students marked as present`);
              }}
              className="h-8 px-3 text-xs xs:text-sm bg-green-500/5 text-green-700 border-green-500/30 hover:bg-green-500/10 ml-auto"
            >
              <UserCheck className="w-3 xs:w-4 h-3 xs:h-4 mr-1" />
              <span className="hidden xs:inline">Mark All Present</span>
              <span className="xs:hidden">All Present</span>
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
            <Button
              variant={filterStatus === 'absent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('absent')}
              className="h-8 px-3 text-xs xs:text-sm bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20"
            >
              Absent ({stats.absent})
            </Button>
            <Button
              variant={filterStatus === 'late' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('late')}
              className="h-8 px-3 text-xs xs:text-sm bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20"
            >
              Late ({stats.late})
            </Button>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={autoSave ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoSave(!autoSave)}
                className="flex items-center gap-1.5 h-8 px-3 text-xs xs:text-sm transition-all duration-200"
              >
                {autoSave ? (
                  <CheckCircle className="w-3 xs:w-4 h-3 xs:h-4" />
                ) : (
                  <Settings className="w-3 xs:w-4 h-3 xs:h-4" />
                )}
                <span className="hidden xs:inline">
                  {autoSave ? "Auto-save ON" : "Auto-save OFF"}
                </span>
                <span className="xs:hidden">
                  {autoSave ? "Auto" : "Manual"}
                </span>
              </Button>

              {/* Manual Save Button - Only show when auto-save is disabled and there's attendance data */}
              {!autoSave && attendance.size > 0 && (
                <Button
                  variant={hasUnsavedChanges ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    // Manual save functionality
                    const attendanceData = Array.from(attendance.entries()).map(([studentId, data]) => {
                      const student = students.find(s => s.id === studentId);
                      return {
                        studentId,
                        studentName: student?.name || 'Unknown',
                        status: data.status,
                        timestamp: data.timestamp,
                        date: selectedDate
                      };
                    });
                    
                    const saveTime = new Date();
                    setLastManualSave(saveTime);
                    setHasUnsavedChanges(false);
                    
                    toast.success(`Attendance saved for ${attendance.size} students`, {
                      description: `Saved at ${saveTime.toLocaleTimeString()}`,
                      duration: 3000
                    });
                  }}
                  className={`flex items-center gap-1.5 h-8 px-3 text-xs xs:text-sm transition-all duration-200 ${
                    hasUnsavedChanges 
                      ? 'bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-white border-0 animate-pulse' 
                      : 'bg-muted/50 text-muted-foreground border-border/50'
                  }`}
                  disabled={!hasUnsavedChanges && attendance.size === 0}
                >
                  <Save className={`w-3 xs:w-4 h-3 xs:h-4 ${hasUnsavedChanges ? 'text-white' : 'text-muted-foreground'}`} />
                  <span className="hidden xs:inline">
                    {hasUnsavedChanges ? 'Save Now' : lastManualSave ? 'Saved' : 'Save'}
                  </span>
                  <span className="xs:hidden">
                    {hasUnsavedChanges ? 'Save' : 'Saved'}
                  </span>
                  {hasUnsavedChanges && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse ml-1" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Student List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2 xs:space-y-3"
      >
        <AnimatePresence>
          {filteredStudents.map((student, index) => {
            const studentAttendance = attendance.get(student.id);
            
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-gradient-to-r from-card via-card/95 to-card/90 border-border/50 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-3 xs:p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
                        <Avatar className="w-8 xs:w-10 h-8 xs:h-10 shrink-0">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-xs xs:text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm xs:text-base truncate">{student.name}</h3>
                          <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm text-muted-foreground">
                            <span className="truncate">{student.rollNumber}</span>
                            <span>•</span>
                            <span className="truncate">{student.previousAttendance}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {studentAttendance && (
                          <Badge className={`${getStatusColor(studentAttendance.status)} border text-xs hidden xs:flex`}>
                            {getStatusIcon(studentAttendance.status)}
                            <span className="ml-1 capitalize">{studentAttendance.status}</span>
                          </Badge>
                        )}
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={studentAttendance?.status === 'present' ? 'default' : 'outline'}
                            onClick={() => markAttendance(student.id, 'present')}
                            className="h-7 xs:h-8 w-7 xs:w-8 p-0"
                          >
                            <CheckCircle className="w-3 xs:w-4 h-3 xs:h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant={studentAttendance?.status === 'late' ? 'default' : 'outline'}
                            onClick={() => markAttendance(student.id, 'late')}
                            className="h-7 xs:h-8 w-7 xs:w-8 p-0"
                          >
                            <Clock className="w-3 xs:w-4 h-3 xs:h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant={studentAttendance?.status === 'absent' ? 'default' : 'outline'}
                            onClick={() => markAttendance(student.id, 'absent')}
                            className="h-7 xs:h-8 w-7 xs:w-8 p-0"
                          >
                            <XCircle className="w-3 xs:w-4 h-3 xs:h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile status badge */}
                    {studentAttendance && (
                      <div className="xs:hidden mt-2 pt-2 border-t border-border/50">
                        <Badge className={`${getStatusColor(studentAttendance.status)} border text-xs`}>
                          {getStatusIcon(studentAttendance.status)}
                          <span className="ml-1 capitalize">{studentAttendance.status}</span>
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Footer Actions - Fixed at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 p-3 xs:p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 safe-area-bottom"
      >
        <div className="flex gap-2 xs:gap-3 max-w-6xl mx-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAttendance(new Map());
              toast.success('Attendance reset');
            }}
            disabled={attendance.size === 0}
            className="h-9 px-3 xs:px-4"
          >
            <RotateCcw className="w-4 h-4 xs:mr-2" />
            <span className="hidden xs:inline">Reset</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Save as draft logic
              toast.success('Attendance saved as draft');
            }}
            disabled={attendance.size === 0}
            className="h-9 px-3 xs:px-4"
          >
            <Save className="w-4 h-4 xs:mr-2" />
            <span className="hidden xs:inline">Save Draft</span>
          </Button>
          
          <Button
            className="flex-1 h-9 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            onClick={() => {
              // Enhanced submit with validation
              if (attendance.size === 0) {
                toast.error('Please mark attendance for at least one student before submitting');
                return;
              }
              
              // Check if all students have been marked
              const unmarkedStudents = students.length - attendance.size;
              if (unmarkedStudents > 0) {
                toast.warning(`${unmarkedStudents} students still pending. Submit anyway?`, {
                  action: {
                    label: 'Submit',
                    onClick: () => handleSubmit()
                  }
                });
              } else {
                handleSubmit();
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Timer className="w-4 h-4 mr-2 animate-spin" />
                <span className="hidden xs:inline">Submitting...</span>
                <span className="xs:hidden">...</span>
              </>
            ) : attendance.size === 0 ? (
              <>
                <Send className="w-4 h-4 mr-2 opacity-50" />
                <span className="hidden xs:inline">Mark Students to Submit</span>
                <span className="xs:hidden">Mark Students</span>
              </>
            ) : attendance.size === students.length ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="hidden xs:inline">Submit All Attendance ✓</span>
                <span className="xs:hidden">Submit All ✓</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                <span className="hidden xs:inline">Submit Attendance ({attendance.size}/{students.length})</span>
                <span className="xs:hidden">Submit ({attendance.size}/{students.length})</span>
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};