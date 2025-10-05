import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  UserCheck,
  UserX,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Timer,
  Calendar,
  BookOpen,
  MapPin,
  ArrowLeft,
  Send,
  Filter,
  Zap,
  Target,
  TrendingUp,
  Activity,
  Star,
  Award,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
  Save,
  Download,
  Share,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatar?: string;
  grade: string;
  previousAttendance: number;
  isPresent?: boolean;
  status?: 'present' | 'absent' | 'late' | 'excused';
  streak?: number;
  lastSeen?: string;
}

interface ClassData {
  id: string;
  name: string;
  subject: string;
  room: string;
  time: string;
  totalStudents: number;
}

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  percentage: number;
}

// Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    rollNumber: 'CS-001',
    grade: 'A',
    previousAttendance: 95,
    streak: 15,
    lastSeen: '2 days ago',
  },
  {
    id: '2',
    name: 'Bob Smith',
    rollNumber: 'CS-002',
    grade: 'B+',
    previousAttendance: 88,
    streak: 8,
    lastSeen: 'Yesterday',
  },
  {
    id: '3',
    name: 'Carol Davis',
    rollNumber: 'CS-003',
    grade: 'A-',
    previousAttendance: 92,
    streak: 12,
    lastSeen: 'Today',
  },
  {
    id: '4',
    name: 'David Wilson',
    rollNumber: 'CS-004',
    grade: 'B',
    previousAttendance: 76,
    streak: 3,
    lastSeen: '1 week ago',
  },
  {
    id: '5',
    name: 'Eva Brown',
    rollNumber: 'CS-005',
    grade: 'A',
    previousAttendance: 98,
    streak: 20,
    lastSeen: 'Today',
  },
  {
    id: '6',
    name: 'Frank Miller',
    rollNumber: 'CS-006',
    grade: 'C+',
    previousAttendance: 68,
    streak: 1,
    lastSeen: '3 days ago',
  },
];

const mockClassData: ClassData = {
  id: 'cs101',
  name: 'Computer Science 101',
  subject: 'Introduction to Programming',
  room: 'Lab A-205',
  time: '09:00 AM - 10:30 AM',
  totalStudents: 28,
};

interface UserFriendlyAttendanceProps {
  onBack?: () => void;
}

export const UserFriendlyAttendance: React.FC<UserFriendlyAttendanceProps> = ({
  onBack,
}) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'overview' | 'take' | 'history'>('overview');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'late' | 'pending'>('all');
  const [attendance, setAttendance] = useState<Map<string, { status: string; timestamp: Date }>>(new Map());
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [classData] = useState<ClassData>(mockClassData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter students based on search and status
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'pending') return matchesSearch && !attendance.has(student.id);
    
    const studentAttendance = attendance.get(student.id);
    return matchesSearch && studentAttendance?.status === filterStatus;
  });

  // Calculate stats
  const stats: AttendanceStats = {
    present: Array.from(attendance.values()).filter(a => a.status === 'present').length,
    absent: Array.from(attendance.values()).filter(a => a.status === 'absent').length,
    late: Array.from(attendance.values()).filter(a => a.status === 'late').length,
    excused: Array.from(attendance.values()).filter(a => a.status === 'excused').length,
    total: students.length,
    percentage: (Array.from(attendance.values()).filter(a => a.status === 'present').length / students.length) * 100,
  };

  const pending = students.length - attendance.size;

  // Mark attendance
  const markAttendance = (studentId: string, status: string) => {
    setAttendance(prev => {
      const newAttendance = new Map(prev);
      newAttendance.set(studentId, { status, timestamp: new Date() });
      return newAttendance;
    });

    // Visual feedback
    toast.success(`Marked ${students.find(s => s.id === studentId)?.name} as ${status}`);
  };

  // Quick mark all present
  const markAllPresent = () => {
    const newAttendance = new Map();
    students.forEach(student => {
      newAttendance.set(student.id, { status: 'present', timestamp: new Date() });
    });
    setAttendance(newAttendance);
    toast.success('All students marked as present');
  };

  // Submit attendance
  const handleSubmit = async () => {
    if (attendance.size === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Attendance submitted for ${attendance.size} students`);
      setCurrentView('overview');
    } catch (error) {
      toast.error('Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'absent': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'late': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'excused': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-3 h-3" />;
      case 'absent': return <XCircle className="w-3 h-3" />;
      case 'late': return <Clock className="w-3 h-3" />;
      case 'excused': return <AlertCircle className="w-3 h-3" />;
      default: return <Timer className="w-3 h-3" />;
    }
  };

  // Render overview
  const renderOverview = () => (
    <div className="space-y-4">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">Good morning, {user?.name}!</h2>
                <p className="text-sm text-muted-foreground">Ready to take attendance?</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Activity className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <div className="text-lg font-bold text-primary">{classData.totalStudents}</div>
                <div className="text-xs text-muted-foreground">Total Students</div>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <div className="text-lg font-bold text-secondary">{new Date().toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-xs text-muted-foreground">Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="w-4 h-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => setCurrentView('take')}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Take Attendance Now
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('history')}
                className="h-10"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View History
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Reports feature coming soon')}
                className="h-10"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Class Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="w-4 h-4 text-secondary" />
              Current Class
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subject</span>
                <span className="text-sm font-medium">{classData.subject}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Room</span>
                <span className="text-sm font-medium">{classData.room}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="text-sm font-medium">{classData.time}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4 text-accent" />
              Student Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-green-500/5 rounded-lg border border-green-500/10">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-green-500/10 text-green-600">
                    {mockStudents[4].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{mockStudents[4].name}</p>
                  <p className="text-xs text-muted-foreground">20-day attendance streak!</p>
                </div>
                <Star className="w-4 h-4 text-green-600" />
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-orange-500/5 rounded-lg border border-orange-500/10">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-orange-500/10 text-orange-600">
                    {mockStudents[5].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{mockStudents[5].name}</p>
                  <p className="text-xs text-muted-foreground">Needs attention - Low attendance</p>
                </div>
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  // Render take attendance
  const renderTakeAttendance = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView('overview')} className="h-9 w-9 p-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Take Attendance</h2>
            <p className="text-sm text-muted-foreground">{new Date(selectedDate).toLocaleDateString()}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="h-9 w-9 p-0"
        >
          {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-br from-card via-card/95 to-primary/5 border-border/50">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <Badge variant="outline">
                {attendance.size}/{students.length} completed
              </Badge>
            </div>
            <Progress value={(attendance.size / students.length) * 100} className="h-2" />
            
            <div className="grid grid-cols-3 gap-2 xs:grid-cols-5">
              <div className="text-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-sm font-bold text-green-600">{stats.present}</div>
                <div className="text-xs text-green-600">Present</div>
              </div>
              <div className="text-center p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="text-sm font-bold text-red-600">{stats.absent}</div>
                <div className="text-xs text-red-600">Absent</div>
              </div>
              <div className="text-center p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="text-sm font-bold text-orange-600">{stats.late}</div>
                <div className="text-xs text-orange-600">Late</div>
              </div>
              <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 xs:block hidden">
                <div className="text-sm font-bold text-blue-600">{stats.excused}</div>
                <div className="text-xs text-blue-600">Excused</div>
              </div>
              <div className="text-center p-2 bg-gray-500/10 rounded-lg border border-gray-500/20 xs:block hidden">
                <div className="text-sm font-bold text-gray-600">{pending}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
            </div>
            
            {/* Mobile-only row for remaining stats */}
            <div className="grid grid-cols-2 gap-2 xs:hidden">
              <div className="text-center p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-sm font-bold text-blue-600">{stats.excused}</div>
                <div className="text-xs text-blue-600">Excused</div>
              </div>
              <div className="text-center p-2 bg-gray-500/10 rounded-lg border border-gray-500/20">
                <div className="text-sm font-bold text-gray-600">{pending}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="space-y-3">
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

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllPresent}
            className="h-8 px-3 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            All Present
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAttendance(new Map())}
            disabled={attendance.size === 0}
            className="h-8 px-3 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
          <Button
            variant={isQuickMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsQuickMode(!isQuickMode)}
            className="h-8 px-3 text-xs"
          >
            <Zap className="w-3 h-3 mr-1" />
            Quick Mode
          </Button>
        </div>

        {/* Filters */}
        {showAdvanced && (
          <div className="flex flex-wrap gap-1.5">
            {['all', 'pending', 'present', 'absent', 'late'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status as any)}
                className="h-8 px-3 text-xs capitalize"
              >
                {status} ({status === 'all' ? students.length : 
                  status === 'pending' ? pending :
                  status === 'present' ? stats.present :
                  status === 'absent' ? stats.absent :
                  status === 'late' ? stats.late : 0})
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Student List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredStudents.map((student, index) => {
            const studentAttendance = attendance.get(student.id);
            
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card className="bg-gradient-to-r from-card via-card/95 to-card/90 border-border/50 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="w-10 h-10 shrink-0">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm truncate">{student.name}</h3>
                            {student.streak && student.streak > 10 && (
                              <Badge className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-600 border-amber-500/20 text-xs px-1.5 py-0.5">
                                <Star className="w-2.5 h-2.5 mr-1" />
                                {student.streak}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{student.rollNumber}</span>
                            <span>•</span>
                            <span>{student.previousAttendance}%</span>
                            {showAdvanced && (
                              <>
                                <span>•</span>
                                <span>{student.lastSeen}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isQuickMode ? (
                          // Quick mode - single tap toggle
                          <Button
                            size="sm"
                            variant={studentAttendance?.status === 'present' ? 'default' : 'outline'}
                            onClick={() => {
                              const newStatus = studentAttendance?.status === 'present' ? 'absent' : 'present';
                              markAttendance(student.id, newStatus);
                            }}
                            className="h-8 px-3 text-xs"
                          >
                            {studentAttendance?.status === 'present' ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Present
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Mark
                              </>
                            )}
                          </Button>
                        ) : (
                          // Normal mode - individual buttons
                          <>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === 'present' ? 'default' : 'outline'}
                              onClick={() => markAttendance(student.id, 'present')}
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === 'late' ? 'default' : 'outline'}
                              onClick={() => markAttendance(student.id, 'late')}
                              className="h-8 w-8 p-0"
                            >
                              <Clock className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === 'absent' ? 'default' : 'outline'}
                              onClick={() => markAttendance(student.id, 'absent')}
                              className="h-8 w-8 p-0"
                            >
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Status badge for mobile */}
                    {studentAttendance && (
                      <div className="mt-2 pt-2 border-t border-border/50">
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
      </div>
    </div>
  );

  // Render history
  const renderHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('overview')} className="h-9 w-9 p-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Attendance History</h2>
          <p className="text-sm text-muted-foreground">View past attendance records</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">History View</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Attendance history feature is coming soon!
            </p>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-3 xs:p-4 space-y-4 max-w-6xl mx-auto pb-20">
      <AnimatePresence mode="wait">
        {currentView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {renderOverview()}
          </motion.div>
        )}
        
        {currentView === 'take' && (
          <motion.div
            key="take"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTakeAttendance()}
          </motion.div>
        )}
        
        {currentView === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {renderHistory()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Footer Actions - Only show during take attendance */}
      {currentView === 'take' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-3 xs:p-4 bg-background/95 backdrop-blur-sm border-t border-border/50 safe-area-bottom"
        >
          <div className="flex gap-2 xs:gap-3 max-w-6xl mx-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success('Attendance saved as draft')}
              disabled={attendance.size === 0}
              className="h-9 px-3 xs:px-4"
            >
              <Save className="w-4 h-4 xs:mr-2" />
              <span className="hidden xs:inline">Save Draft</span>
            </Button>
            
            <Button
              className="flex-1 h-9 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={handleSubmit}
              disabled={attendance.size === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Timer className="w-4 h-4 mr-2 animate-spin" />
                  <span className="hidden xs:inline">Submitting...</span>
                  <span className="xs:hidden">...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  <span className="hidden xs:inline">Submit Attendance ({attendance.size})</span>
                  <span className="xs:hidden">Submit ({attendance.size})</span>
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};