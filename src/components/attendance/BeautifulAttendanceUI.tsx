import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Calendar, Clock, CheckCircle, XCircle, AlertCircle,
  TrendingUp, TrendingDown, Star, Award, Target, Zap,
  PlayCircle, PauseCircle, RotateCcw, Send, Save, Timer,
  ArrowLeft, ArrowRight, Search, Filter, Settings, Plus,
  BookOpen, GraduationCap, Coffee, Sun, Moon, Smartphone,
  BarChart3, PieChart, Eye, EyeOff, Download, Upload,
  ChevronDown, ChevronUp, Heart, Sparkles, Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
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
  streak: number;
  mood: 'happy' | 'neutral' | 'sad' | 'excellent';
  isPresent?: boolean;
  lastSeen: string;
  achievements: string[];
  performance: 'outstanding' | 'good' | 'average' | 'needs-attention';
}

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timestamp: string;
  note?: string;
  mood?: 'happy' | 'neutral' | 'sad' | 'excellent';
}

interface AttendanceStats {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
  improvementRate: number;
  streakCount: number;
  perfectDays: number;
}

export const BeautifulAttendanceUI: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'overview' | 'take' | 'analytics' | 'students'>('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'streak' | 'rate'>('name');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoSave, setAutoSave] = useState(true);
  const [selectedClass, setSelectedClass] = useState('Advanced Mathematics');

  // Initialize mock students data
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Emma Thompson',
        rollNumber: 'CS001',
        email: 'emma@school.edu',
        attendanceRate: 98,
        streak: 21,
        mood: 'excellent',
        lastSeen: '2 hours ago',
        achievements: ['Perfect Attendance', 'Star Student'],
        performance: 'outstanding'
      },
      {
        id: '2',
        name: 'Liam Rodriguez',
        rollNumber: 'CS002',
        email: 'liam@school.edu',
        attendanceRate: 85,
        streak: 7,
        mood: 'happy',
        lastSeen: '1 day ago',
        achievements: ['Improving'],
        performance: 'good'
      },
      {
        id: '3',
        name: 'Sophia Chen',
        rollNumber: 'CS003',
        email: 'sophia@school.edu',
        attendanceRate: 92,
        streak: 12,
        mood: 'happy',
        lastSeen: '3 hours ago',
        achievements: ['Consistent'],
        performance: 'good'
      },
      {
        id: '4',
        name: 'Noah Johnson',
        rollNumber: 'CS004',
        email: 'noah@school.edu',
        attendanceRate: 76,
        streak: 3,
        mood: 'neutral',
        lastSeen: '2 days ago',
        achievements: [],
        performance: 'average'
      },
      {
        id: '5',
        name: 'Isabella Martinez',
        rollNumber: 'CS005',
        email: 'isabella@school.edu',
        attendanceRate: 58,
        streak: 0,
        mood: 'sad',
        lastSeen: '5 days ago',
        achievements: [],
        performance: 'needs-attention'
      },
      {
        id: '6',
        name: 'Ethan Davis',
        rollNumber: 'CS006',
        email: 'ethan@school.edu',
        attendanceRate: 89,
        streak: 8,
        mood: 'happy',
        lastSeen: '1 hour ago',
        achievements: ['Reliable'],
        performance: 'good'
      }
    ];
    setStudents(mockStudents);
  }, []);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Computed values
  const attendanceStats: AttendanceStats = useMemo(() => {
    const totalStudents = students.length;
    const presentCount = Array.from(attendance.values()).filter(a => a.status === 'present').length;
    const absentCount = Array.from(attendance.values()).filter(a => a.status === 'absent').length;
    const lateCount = Array.from(attendance.values()).filter(a => a.status === 'late').length;
    const attendanceRate = totalStudents > 0 ? ((presentCount + lateCount) / totalStudents * 100) : 0;
    const streakCount = students.filter(s => s.streak > 0).length;
    const perfectDays = students.filter(s => s.attendanceRate >= 95).length;
    
    return {
      totalStudents,
      presentCount,
      absentCount,
      lateCount,
      attendanceRate,
      improvementRate: 12.5,
      streakCount,
      perfectDays
    };
  }, [students, attendance]);

  const filteredStudents = useMemo(() => {
    let filtered = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const attendanceRecord = attendance.get(student.id);
      
      switch (filterStatus) {
        case 'present':
          return matchesSearch && attendanceRecord?.status === 'present';
        case 'absent':
          return matchesSearch && attendanceRecord?.status === 'absent';
        case 'pending':
          return matchesSearch && !attendanceRecord;
        default:
          return matchesSearch;
      }
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'streak':
          return b.streak - a.streak;
        case 'rate':
          return b.attendanceRate - a.attendanceRate;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [students, searchQuery, filterStatus, sortBy, attendance]);

  // Functions
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

    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.success(`${student.name} marked as ${status}`, {
        description: autoSave ? 'Auto-saved' : 'Remember to save manually'
      });
    }
  };

  const startSession = () => {
    setIsSessionActive(true);
    setSessionStartTime(new Date());
    toast.success('Attendance session started!', {
      description: 'Students can now be marked present'
    });
  };

  const endSession = () => {
    setIsSessionActive(false);
    toast.success('Attendance session ended!', {
      description: `Session duration: ${sessionStartTime ? Math.round((Date.now() - sessionStartTime.getTime()) / 60000) : 0} minutes`
    });
  };

  const submitAttendance = () => {
    toast.success(`Attendance submitted for ${attendance.size} students!`, {
      description: `${attendanceStats.attendanceRate.toFixed(1)}% attendance rate`
    });
  };

  // Helper functions
  const getPerformanceColor = (performance: Student['performance']) => {
    switch (performance) {
      case 'outstanding': return 'from-emerald-500/20 to-green-500/10 border-emerald-500/30';
      case 'good': return 'from-blue-500/20 to-cyan-500/10 border-blue-500/30';
      case 'average': return 'from-amber-500/20 to-yellow-500/10 border-amber-500/30';
      case 'needs-attention': return 'from-red-500/20 to-pink-500/10 border-red-500/30';
      default: return 'from-muted/20 to-muted/10 border-muted/30';
    }
  };

  const getMoodEmoji = (mood: Student['mood']) => {
    switch (mood) {
      case 'excellent': return '🌟';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      default: return '😊';
    }
  };

  const getAttendanceIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'excused': return <AlertCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  // Render functions
  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Attendance</h1>
            <p className="text-sm text-muted-foreground">
              {selectedClass} • {currentTime.toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isSessionActive ? "default" : "outline"} className="text-xs">
            {isSessionActive ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live
              </>
            ) : (
              'Inactive'
            )}
          </Badge>
          
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Session Timer */}
      {isSessionActive && sessionStartTime && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4"
        >
          <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Session Active</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{Math.floor((currentTime.getTime() - sessionStartTime.getTime()) / 60000)}m</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={endSession}
                    className="h-6 px-2 text-xs"
                  >
                    End
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Beautiful Stats Cards */}
      <div className="grid grid-cols-2 xs:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 border-emerald-500/20 overflow-hidden relative">
            <CardContent className="p-3 relative z-10">
              <div className="text-center">
                <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <p className="text-lg font-bold text-emerald-700">{attendanceStats.presentCount}</p>
                <p className="text-xs text-emerald-600">Present</p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full -translate-y-8 translate-x-8" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20 overflow-hidden relative">
            <CardContent className="p-3 relative z-10">
              <div className="text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="text-lg font-bold text-blue-700">{attendanceStats.attendanceRate.toFixed(0)}%</p>
                <p className="text-xs text-blue-600">Rate</p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full -translate-y-8 translate-x-8" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/20 overflow-hidden relative">
            <CardContent className="p-3 relative z-10">
              <div className="text-center">
                <Star className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                <p className="text-lg font-bold text-amber-700">{attendanceStats.streakCount}</p>
                <p className="text-xs text-amber-600">Streaks</p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full -translate-y-8 translate-x-8" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/5 border-purple-500/20 overflow-hidden relative">
            <CardContent className="p-3 relative z-10">
              <div className="text-center">
                <Crown className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                <p className="text-lg font-bold text-purple-700">{attendanceStats.perfectDays}</p>
                <p className="text-xs text-purple-600">Perfect</p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full -translate-y-8 translate-x-8" />
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderQuickActions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-6"
    >
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant={isSessionActive ? "outline" : "default"}
          onClick={isSessionActive ? endSession : startSession}
          className={`h-12 gap-2 ${isSessionActive 
            ? 'bg-red-500/10 border-red-500/30 text-red-700 hover:bg-red-500/20' 
            : 'bg-gradient-to-r from-primary to-primary/80'
          }`}
        >
          {isSessionActive ? (
            <>
              <PauseCircle className="w-4 h-4" />
              <span>End Session</span>
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4" />
              <span>Start Session</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            const pendingStudents = students.filter(s => !attendance.has(s.id));
            pendingStudents.forEach(s => markAttendance(s.id, 'present'));
          }}
          disabled={!isSessionActive}
          className="h-12 gap-2 bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
        >
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>Mark All Present</span>
        </Button>
      </div>
    </motion.div>
  );

  const renderControls = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-4"
    >
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-white/50 border-border/50"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="w-28 h-10 bg-white/50">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-32 h-8 text-xs bg-white/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="streak">Streak</SelectItem>
            <SelectItem value="rate">Rate</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Switch
            checked={autoSave}
            onCheckedChange={setAutoSave}
            className="scale-75"
          />
          <span>Auto-save</span>
        </div>
      </div>
    </motion.div>
  );

  const renderStudentCard = (student: Student, index: number) => {
    const attendanceRecord = attendance.get(student.id);
    const performanceColor = getPerformanceColor(student.performance);
    const moodEmoji = getMoodEmoji(student.mood);

    return (
      <motion.div
        key={student.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="mb-3"
      >
        <Card className={`overflow-hidden transition-all duration-300 bg-gradient-to-r ${performanceColor} hover:shadow-lg ${
          attendanceRecord ? 'scale-[0.98] opacity-90' : 'hover:scale-[1.01]'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Avatar with mood */}
              <div className="relative">
                <Avatar className="w-12 h-12 ring-2 ring-white/50">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-medium">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 text-lg">
                  {moodEmoji}
                </div>
              </div>

              {/* Student Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{student.name}</h3>
                  {student.streak > 10 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-amber-500/10 text-amber-700 border-amber-500/20">
                      <Star className="w-2.5 h-2.5 mr-1" />
                      {student.streak}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span>{student.rollNumber}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      student.attendanceRate >= 90 ? 'bg-green-500' :
                      student.attendanceRate >= 80 ? 'bg-blue-500' :
                      student.attendanceRate >= 70 ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <span>{student.attendanceRate}%</span>
                  </div>
                </div>

                {/* Achievements */}
                {student.achievements.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {student.achievements.slice(0, 2).map((achievement, i) => (
                      <Badge key={i} variant="outline" className="text-xs px-1.5 py-0.5">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Attendance Status & Actions */}
              <div className="flex flex-col items-end gap-2">
                {attendanceRecord && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1"
                  >
                    {getAttendanceIcon(attendanceRecord.status)}
                    <span className="text-xs capitalize font-medium">
                      {attendanceRecord.status}
                    </span>
                  </motion.div>
                )}
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={attendanceRecord?.status === 'present' ? 'default' : 'outline'}
                    onClick={() => markAttendance(student.id, 'present')}
                    disabled={!isSessionActive}
                    className="h-7 w-7 p-0"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={attendanceRecord?.status === 'late' ? 'default' : 'outline'}
                    onClick={() => markAttendance(student.id, 'late')}
                    disabled={!isSessionActive}
                    className="h-7 w-7 p-0"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={attendanceRecord?.status === 'absent' ? 'default' : 'outline'}
                    onClick={() => markAttendance(student.id, 'absent')}
                    disabled={!isSessionActive}
                    className="h-7 w-7 p-0"
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

  const renderProgressCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-card via-card/95 to-primary/5 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Session Progress
            <Badge variant="outline" className="text-xs ml-auto">
              {attendance.size}/{students.length} marked
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Completion</span>
              <span>{((attendance.size / students.length) * 100).toFixed(1)}%</span>
            </div>
            <Progress value={(attendance.size / students.length) * 100} className="h-2" />
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <p className="font-semibold text-green-700">{attendanceStats.presentCount}</p>
                <p className="text-green-600">Present</p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-lg">
                <p className="font-semibold text-red-700">{attendanceStats.absentCount}</p>
                <p className="text-red-600">Absent</p>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <p className="font-semibold text-amber-700">{attendanceStats.lateCount}</p>
                <p className="text-amber-600">Late</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4 pb-20">
      {renderHeader()}
      {renderQuickActions()}
      {renderControls()}
      {renderProgressCard()}

      {/* Students List */}
      <motion.div layout className="space-y-2 mb-6">
        <AnimatePresence mode="popLayout">
          {filteredStudents.map((student, index) => renderStudentCard(student, index))}
        </AnimatePresence>
      </motion.div>

      {/* Footer Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/50"
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
            className="flex-1 h-10 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            onClick={submitAttendance}
            disabled={attendance.size === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit ({attendance.size}/{students.length})
          </Button>
        </div>
      </motion.div>
    </div>
  );
};