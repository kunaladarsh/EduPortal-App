import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {  
  Users, CheckCircle, XCircle, Clock, AlertCircle,
  Search, Filter, Calendar, Save, Send, RotateCcw,
  TrendingUp, TrendingDown, Minus, Plus, Settings,
  ArrowLeft, ArrowRight, User, Target, Zap, Timer,
  BookOpen, GraduationCap, Award, Star, Coffee,
  Sun, Moon, Smartphone, Eye, EyeOff, ChevronDown,
  ChevronUp, Play, Pause, Square, FastForward
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  avatar?: string;
  attendanceRate: number;
  lastAttendance: 'present' | 'absent' | 'late' | 'excused' | null;
  streak: number;
  totalClasses: number;
  presentClasses: number;
  tags: string[];
}

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timestamp: string;
  note?: string;
  mood?: 'happy' | 'neutral' | 'sad';
}

interface ClassSession {
  id: string;
  name: string;
  subject: string;
  room: string;
  startTime: string;
  endTime: string;
  date: string;
  totalStudents: number;
  expectedAttendance: number;
}

interface OptimizedAttendanceSystemProps {
  onBack?: () => void;
  onComplete?: (data: AttendanceRecord[]) => void;
  classData?: ClassSession;
}

export const OptimizedAttendanceSystem: React.FC<OptimizedAttendanceSystemProps> = ({
  onBack,
  onComplete,
  classData = {
    id: 'class-1',
    name: 'Advanced Mathematics',
    subject: 'Calculus & Linear Algebra',
    room: 'Room 204A',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    date: new Date().toLocaleDateString(),
    totalStudents: 32,
    expectedAttendance: 28
  }
}) => {
  const { user } = useAuth();
  
  // ========== STATE MANAGEMENT ==========
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'marked' | 'pending' | 'present' | 'absent' | 'late'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'attendance' | 'streak'>('name');
  const [currentView, setCurrentView] = useState<'grid' | 'list' | 'quick'>('quick');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [quickMarkMode, setQuickMarkMode] = useState<'present' | 'absent' | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [sessionStartTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [smartSuggestions, setSmartSuggestions] = useState(true);
  
  // ========== MOCK DATA INITIALIZATION ==========
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Emma Thompson',
        rollNumber: 'CS001',
        email: 'emma@school.edu',
        attendanceRate: 95,
        lastAttendance: 'present',
        streak: 12,
        totalClasses: 40,
        presentClasses: 38,
        tags: ['excellent', 'consistent']
      },
      {
        id: '2', 
        name: 'Liam Rodriguez',
        rollNumber: 'CS002',
        email: 'liam@school.edu',
        attendanceRate: 78,
        lastAttendance: 'late',
        streak: 2,
        totalClasses: 40,
        presentClasses: 31,
        tags: ['improving']
      },
      {
        id: '3',
        name: 'Sophia Chen',
        rollNumber: 'CS003', 
        email: 'sophia@school.edu',
        attendanceRate: 88,
        lastAttendance: 'present',
        streak: 7,
        totalClasses: 40,
        presentClasses: 35,
        tags: ['good']
      },
      {
        id: '4',
        name: 'Noah Johnson',
        rollNumber: 'CS004',
        email: 'noah@school.edu',
        attendanceRate: 92,
        lastAttendance: 'present', 
        streak: 8,
        totalClasses: 40,
        presentClasses: 37,
        tags: ['excellent']
      },
      {
        id: '5',
        name: 'Isabella Martinez',
        rollNumber: 'CS005',
        email: 'isabella@school.edu',
        attendanceRate: 65,
        lastAttendance: 'absent',
        streak: 0,
        totalClasses: 40,
        presentClasses: 26,
        tags: ['needs-attention']
      },
      {
        id: '6',
        name: 'Ethan Davis',
        rollNumber: 'CS006',
        email: 'ethan@school.edu',
        attendanceRate: 85,
        lastAttendance: 'present',
        streak: 5,
        totalClasses: 40,
        presentClasses: 34,
        tags: ['good']
      }
    ];
    setStudents(mockStudents);
  }, []);

  // ========== REAL-TIME CLOCK ==========
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds
    return () => clearInterval(timer);
  }, []);

  // ========== COMPUTED VALUES ==========
  const sessionDuration = useMemo(() => {
    const diffMs = currentTime.getTime() - sessionStartTime.getTime();
    const minutes = Math.floor(diffMs / 60000);
    return minutes;
  }, [currentTime, sessionStartTime]);

  const filteredStudents = useMemo(() => {
    let filtered = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const attendanceRecord = attendance.get(student.id);
      
      switch (filterStatus) {
        case 'marked':
          return matchesSearch && attendanceRecord;
        case 'pending':
          return matchesSearch && !attendanceRecord;
        case 'present':
          return matchesSearch && attendanceRecord?.status === 'present';
        case 'absent':
          return matchesSearch && attendanceRecord?.status === 'absent';
        case 'late':
          return matchesSearch && attendanceRecord?.status === 'late';
        default:
          return matchesSearch;
      }
    });

    // Sort students
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'attendance':
          return b.attendanceRate - a.attendanceRate;
        case 'streak':
          return b.streak - a.streak;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [students, searchQuery, filterStatus, sortBy, attendance]);

  const attendanceStats = useMemo(() => {
    const total = students.length;
    const marked = attendance.size;
    const pending = total - marked;
    const present = Array.from(attendance.values()).filter(a => a.status === 'present').length;
    const absent = Array.from(attendance.values()).filter(a => a.status === 'absent').length;
    const late = Array.from(attendance.values()).filter(a => a.status === 'late').length;
    const excused = Array.from(attendance.values()).filter(a => a.status === 'excused').length;
    
    const attendanceRate = marked > 0 ? ((present + late + excused) / marked * 100) : 0;
    const completionRate = (marked / total * 100);
    
    return {
      total,
      marked,
      pending,
      present,
      absent,
      late,
      excused,
      attendanceRate,
      completionRate
    };
  }, [students, attendance]);

  // ========== CORE FUNCTIONS ==========
  const markAttendance = useCallback((studentId: string, status: AttendanceRecord['status'], note?: string) => {
    const newRecord: AttendanceRecord = {
      studentId,
      status,
      timestamp: new Date().toISOString(),
      note
    };

    setAttendance(prev => {
      const updated = new Map(prev);
      updated.set(studentId, newRecord);
      return updated;
    });

    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.success(`${student.name} marked as ${status}`, {
        description: autoSave ? 'Auto-saved' : 'Remember to save manually'
      });
    }
  }, [students, autoSave]);

  const bulkMarkAttendance = useCallback((studentIds: string[], status: AttendanceRecord['status']) => {
    const timestamp = new Date().toISOString();
    
    setAttendance(prev => {
      const updated = new Map(prev);
      studentIds.forEach(studentId => {
        updated.set(studentId, {
          studentId,
          status,
          timestamp,
        });
      });
      return updated;
    });

    toast.success(`Marked ${studentIds.length} students as ${status}`, {
      description: `Bulk action completed`
    });
  }, []);

  const smartMarkAll = useCallback(() => {
    const studentsToMark = students.filter(student => {
      if (attendance.has(student.id)) return false;
      
      // Smart suggestions based on attendance patterns
      if (smartSuggestions && student.attendanceRate > 90) {
        return true; // High performers likely present
      }
      
      return false;
    });

    if (studentsToMark.length > 0) {
      bulkMarkAttendance(studentsToMark.map(s => s.id), 'present');
      toast.info(`Smart-marked ${studentsToMark.length} likely present students`, {
        description: 'Based on attendance patterns'
      });
    }
  }, [students, attendance, smartSuggestions, bulkMarkAttendance]);

  const handleSubmit = async () => {
    if (attendance.size === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const attendanceData = Array.from(attendance.values()).map(record => ({
        ...record,
        sessionDuration,
        classData: classData.id
      }));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Attendance submitted successfully!`, {
        description: `${attendance.size} students • ${attendanceStats.attendanceRate.toFixed(1)}% present`
      });

      onComplete?.(attendanceData);
    } catch (error) {
      toast.error('Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== STATUS HELPERS ==========
  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'absent': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'late': return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'excused': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-3 h-3" />;
      case 'absent': return <XCircle className="w-3 h-3" />;
      case 'late': return <Clock className="w-3 h-3" />;
      case 'excused': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const getAttendanceTag = (rate: number) => {
    if (rate >= 90) return { label: 'Excellent', color: 'bg-green-500/10 text-green-700' };
    if (rate >= 80) return { label: 'Good', color: 'bg-blue-500/10 text-blue-700' };
    if (rate >= 70) return { label: 'Average', color: 'bg-orange-500/10 text-orange-700' };
    return { label: 'Needs Attention', color: 'bg-red-500/10 text-red-700' };
  };

  // ========== RENDER FUNCTIONS ==========
  const renderQuickActions = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-3 mb-4"
    >
      <Button
        variant="outline"
        onClick={() => bulkMarkAttendance(filteredStudents.filter(s => !attendance.has(s.id)).map(s => s.id), 'present')}
        disabled={filteredStudents.filter(s => !attendance.has(s.id)).length === 0}
        className="h-12 gap-2 bg-green-500/5 border-green-500/20 hover:bg-green-500/10"
      >
        <CheckCircle className="w-4 h-4 text-green-600" />
        <div className="text-left">
          <div className="font-medium text-sm">Mark All Present</div>
          <div className="text-xs text-muted-foreground">
            {filteredStudents.filter(s => !attendance.has(s.id)).length} pending
          </div>
        </div>
      </Button>

      <Button
        variant="outline"
        onClick={smartMarkAll}
        disabled={students.filter(s => !attendance.has(s.id) && s.attendanceRate > 90).length === 0}
        className="h-12 gap-2 bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10"
      >
        <Zap className="w-4 h-4 text-blue-600" />
        <div className="text-left">
          <div className="font-medium text-sm">Smart Mark</div>
          <div className="text-xs text-muted-foreground">
            {students.filter(s => !attendance.has(s.id) && s.attendanceRate > 90).length} suggested
          </div>
        </div>
      </Button>
    </motion.div>
  );

  const renderSessionInfo = () => (
    <Card className="mb-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{classData.name}</h3>
              <p className="text-xs text-muted-foreground">{classData.subject}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            Session: {sessionDuration}m
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{classData.room} • {classData.startTime} - {classData.endTime}</span>
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );

  const renderStatsCards = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-3 mb-4"
    >
      <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Present Rate</p>
              <p className="text-lg font-bold text-green-700">
                {attendanceStats.attendanceRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Completion</p>
              <p className="text-lg font-bold text-blue-700">
                {attendanceStats.completionRate.toFixed(0)}%
              </p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <Progress value={attendanceStats.completionRate} className="h-1 mt-2" />
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStudentCard = (student: Student) => {
    const attendanceRecord = attendance.get(student.id);
    const attendanceTag = getAttendanceTag(student.attendanceRate);
    const isSelected = selectedStudents.has(student.id);

    return (
      <motion.div
        key={student.id}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileTap={{ scale: 0.98 }}
        className="mb-3"
      >
        <Card className={`overflow-hidden transition-all duration-200 ${
          attendanceRecord ? 'bg-muted/20 border-muted' : 'hover:shadow-md'
        } ${isSelected ? 'ring-2 ring-primary/50' : ''}`}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-sm">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm truncate">{student.name}</h3>
                    {student.streak > 5 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        <Star className="w-2.5 h-2.5 mr-1" />
                        {student.streak}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{student.rollNumber}</span>
                    <span>•</span>
                    <Badge className={`${attendanceTag.color} text-xs px-1.5 py-0.5`}>
                      {student.attendanceRate}%
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {attendanceRecord && (
                  <Badge className={`${getStatusColor(attendanceRecord.status)} text-xs px-2 py-1 mr-1`}>
                    {getStatusIcon(attendanceRecord.status)}
                    <span className="ml-1 capitalize">{attendanceRecord.status}</span>
                  </Badge>
                )}
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={attendanceRecord?.status === 'present' ? 'default' : 'outline'}
                    onClick={() => markAttendance(student.id, 'present')}
                    className="h-8 w-8 p-0"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={attendanceRecord?.status === 'late' ? 'default' : 'outline'}
                    onClick={() => markAttendance(student.id, 'late')}
                    className="h-8 w-8 p-0"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={attendanceRecord?.status === 'absent' ? 'default' : 'outline'}
                    onClick={() => markAttendance(student.id, 'absent')}
                    className="h-8 w-8 p-0"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderControls = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 mb-4"
    >
      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-32 h-10">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="marked">Marked</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort and View Options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="streak">Streak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="h-8 px-2"
          >
            {showStats ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
              className="scale-75"
            />
            <span>Auto-save</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ========== MAIN RENDER ==========
  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack} className="h-8 w-8 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <h1 className="font-bold text-lg">Take Attendance</h1>
            <p className="text-sm text-muted-foreground">
              {filteredStudents.length} of {students.length} students
            </p>
          </div>
        </div>
        
        <Badge variant="outline" className="text-xs">
          <Timer className="w-3 h-3 mr-1" />
          Live Session
        </Badge>
      </motion.div>

      {/* Session Info */}
      {renderSessionInfo()}

      {/* Stats Cards */}
      {showStats && renderStatsCards()}

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Controls */}
      {renderControls()}

      {/* Students List */}
      <motion.div layout className="space-y-2 mb-4">
        <AnimatePresence mode="popLayout">
          {filteredStudents.map(student => renderStudentCard(student))}
        </AnimatePresence>
      </motion.div>

      {/* Footer Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t"
      >
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAttendance(new Map());
              toast.success('Attendance reset');
            }}
            disabled={attendance.size === 0}
            className="h-10 px-4"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button
            className="flex-1 h-10 bg-gradient-to-r from-primary to-primary/80"
            onClick={handleSubmit}
            disabled={attendance.size === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Timer className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit ({attendance.size}/{students.length})
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};