import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  CalendarDays,
} from 'lucide-react';

interface AttendanceCalendarViewProps {
  onBack: () => void;
  onPageChange?: (page: string) => void;
}

interface DayAttendance {
  date: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  classes: {
    id: string;
    name: string;
    time: string;
    attendance: number;
  }[];
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  attendance?: DayAttendance;
}

export const AttendanceCalendarView: React.FC<AttendanceCalendarViewProps> = ({
  onBack,
  onPageChange,
}) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayAttendance | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  // Mock attendance data
  const mockAttendanceData: Record<string, DayAttendance> = {
    '2024-01-15': {
      date: '2024-01-15',
      totalStudents: 120,
      present: 110,
      absent: 8,
      late: 2,
      excused: 0,
      classes: [
        { id: '1', name: 'Mathematics 101', time: '09:00 AM', attendance: 95 },
        { id: '2', name: 'Physics 201', time: '11:00 AM', attendance: 88 },
        { id: '3', name: 'Chemistry 301', time: '02:00 PM', attendance: 92 },
      ],
    },
    '2024-01-16': {
      date: '2024-01-16',
      totalStudents: 105,
      present: 98,
      absent: 5,
      late: 2,
      excused: 0,
      classes: [
        { id: '1', name: 'Biology 102', time: '10:00 AM', attendance: 93 },
        { id: '2', name: 'English 201', time: '01:00 PM', attendance: 96 },
      ],
    },
    '2024-01-17': {
      date: '2024-01-17',
      totalStudents: 85,
      present: 75,
      absent: 8,
      late: 2,
      excused: 0,
      classes: [
        { id: '1', name: 'Mathematics 101', time: '09:00 AM', attendance: 88 },
        { id: '2', name: 'Physics 201', time: '11:00 AM', attendance: 85 },
      ],
    },
    '2024-01-18': {
      date: '2024-01-18',
      totalStudents: 95,
      present: 88,
      absent: 4,
      late: 3,
      excused: 0,
      classes: [
        { id: '1', name: 'Chemistry 301', time: '02:00 PM', attendance: 93 },
        { id: '2', name: 'Biology 102', time: '10:00 AM', attendance: 92 },
      ],
    },
    '2024-01-19': {
      date: '2024-01-19',
      totalStudents: 78,
      present: 70,
      absent: 6,
      late: 2,
      excused: 0,
      classes: [
        { id: '1', name: 'English 201', time: '01:00 PM', attendance: 90 },
      ],
    },
  };

  const classes = [
    { id: 'all', name: 'All Classes' },
    { id: 'math101', name: 'Mathematics 101' },
    { id: 'phy201', name: 'Physics 201' },
    { id: 'chem301', name: 'Chemistry 301' },
    { id: 'bio102', name: 'Biology 102' },
    { id: 'eng201', name: 'English 201' },
  ];

  // Generate calendar days
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const isCurrentMonth = date.getMonth() === month;
      
      days.push({
        date,
        isCurrentMonth,
        attendance: mockAttendanceData[dateString],
      });
    }
    
    setCalendarDays(days);
  }, [currentDate]);

  const getAttendanceColor = (attendance?: DayAttendance) => {
    if (!attendance) return 'bg-transparent';
    
    const percentage = (attendance.present / attendance.totalStudents) * 100;
    
    if (percentage >= 95) return 'bg-green-500';
    if (percentage >= 85) return 'bg-green-400';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 65) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getAttendanceLabel = (attendance?: DayAttendance) => {
    if (!attendance) return 'No classes';
    
    const percentage = (attendance.present / attendance.totalStudents) * 100;
    
    if (percentage >= 95) return 'Excellent';
    if (percentage >= 85) return 'Good';
    if (percentage >= 75) return 'Average';
    if (percentage >= 65) return 'Below Average';
    return 'Poor';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDay(null);
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.attendance && day.isCurrentMonth) {
      setSelectedDay(day.attendance);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Attendance Calendar</h1>
              <p className="text-sm text-muted-foreground">
                Monthly view with color-coded attendance indicators
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="text-center p-2 text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className={`
                      relative aspect-square p-2 rounded-lg border cursor-pointer transition-all duration-200
                      ${day.isCurrentMonth 
                        ? 'border-border hover:border-primary/50 hover:shadow-sm' 
                        : 'border-transparent text-muted-foreground/50'
                      }
                      ${day.attendance && day.isCurrentMonth ? 'hover:scale-105' : ''}
                      ${selectedDay?.date === day.date.toISOString().split('T')[0] ? 'ring-2 ring-primary' : ''}
                    `}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="text-sm font-medium">{day.date.getDate()}</div>
                    
                    {day.attendance && day.isCurrentMonth && (
                      <div className="absolute inset-x-1 bottom-1">
                        <div className={`h-1.5 rounded-full ${getAttendanceColor(day.attendance)}`} />
                        <div className="text-xs text-center mt-1 text-muted-foreground">
                          {day.attendance.classes.length}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4"
          >
            <Card className="bg-gradient-to-r from-card via-card/95 to-primary/5 border-border/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Attendance Legend</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Excellent (95%+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-sm">Good (85-94%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Average (75-84%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-sm">Below Avg (65-74%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">Poor (&lt;65%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Day Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {selectedDay ? (
            <>
              <Card className="bg-gradient-to-br from-card via-card/95 to-secondary/5 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-secondary" />
                    {new Date(selectedDay.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-600" />
                      <div className="text-lg font-bold text-green-600">{selectedDay.present}</div>
                      <p className="text-xs text-green-600">Present</p>
                    </div>
                    
                    <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <XCircle className="w-5 h-5 mx-auto mb-1 text-red-600" />
                      <div className="text-lg font-bold text-red-600">{selectedDay.absent}</div>
                      <p className="text-xs text-red-600">Absent</p>
                    </div>
                    
                    <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                      <div className="text-lg font-bold text-orange-600">{selectedDay.late}</div>
                      <p className="text-xs text-orange-600">Late</p>
                    </div>
                    
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <Users className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-lg font-bold text-blue-600">{selectedDay.totalStudents}</div>
                      <p className="text-xs text-blue-600">Total</p>
                    </div>
                  </div>

                  {/* Overall Status */}
                  <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="text-2xl font-bold text-primary">
                      {((selectedDay.present / selectedDay.totalStudents) * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-primary">{getAttendanceLabel(selectedDay)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Classes for the Day */}
              <Card className="bg-gradient-to-br from-card via-card/95 to-accent/5 border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Classes ({selectedDay.classes.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDay.classes.map((cls, index) => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-card/50 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{cls.name}</h4>
                          <p className="text-xs text-muted-foreground">{cls.time}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {cls.attendance}%
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-gradient-to-br from-card via-card/95 to-muted/5 border-border/50">
              <CardContent className="p-8 text-center">
                <CalendarDays className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-medium text-muted-foreground mb-2">Select a Day</h3>
                <p className="text-sm text-muted-foreground">
                  Click on a day with classes to view detailed attendance information
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};