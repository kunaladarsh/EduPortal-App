import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Calendar } from "../ui/calendar";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  UserCheck,
  BarChart3,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";
import { getAttendanceByStudent, mockClasses } from "../../services/mockData";

interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  markedBy: string;
}

interface MobileStudentAttendanceProps {
  onPageChange?: (page: string) => void;
}

export const MobileStudentAttendance: React.FC<MobileStudentAttendanceProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"overview" | "calendar" | "history">("overview");
  const [filterPeriod, setFilterPeriod] = useState<"week" | "month" | "all">("month");

  const myClass = mockClasses.find(cls => cls.id === user?.classId);
  const myAttendance = getAttendanceByStudent(user?.id || "");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "text-green-600 bg-green-50 border-green-200";
      case "absent": return "text-red-600 bg-red-50 border-red-200";
      case "late": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "excused": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return <CheckCircle className="h-3 w-3" />;
      case "absent": return <XCircle className="h-3 w-3" />;
      case "late": return <Clock className="h-3 w-3" />;
      case "excused": return <UserCheck className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  // Calculate attendance statistics
  const totalDays = myAttendance.length;
  const presentDays = myAttendance.filter(r => r.status === "present").length;
  const absentDays = myAttendance.filter(r => r.status === "absent").length;
  const lateDays = myAttendance.filter(r => r.status === "late").length;
  const excusedDays = myAttendance.filter(r => r.status === "excused").length;
  const attendanceRate = totalDays > 0 ? ((presentDays + lateDays) / totalDays) * 100 : 0;

  // Filter records based on period
  const filteredRecords = myAttendance.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    
    switch (filterPeriod) {
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return recordDate >= weekAgo;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return recordDate >= monthAgo;
      default:
        return true;
    }
  });

  // Get recent attendance trend
  const recentRecords = myAttendance.slice(-7);
  const recentPresentRate = recentRecords.length > 0 
    ? (recentRecords.filter(r => r.status === "present").length / recentRecords.length) * 100 
    : 0;
  const previousRate = attendanceRate;
  const trendDirection = recentPresentRate > previousRate ? "up" : "down";

  return (
    <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {myClass?.name || "Track your attendance"}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setViewMode(viewMode === "calendar" ? "overview" : "calendar")}
          className="p-2 w-10 h-10"
        >
          {viewMode === "calendar" ? <BarChart3 className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />}
        </Button>
      </div>

      {viewMode === "overview" && (
        <>
          {/* Attendance Overview */}
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">Your Attendance Rate</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{attendanceRate.toFixed(1)}%</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {trendDirection === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span>{Math.abs(recentPresentRate - previousRate).toFixed(1)}% vs last week</span>
                  </div>
                </div>
              </div>
              
              <Progress value={attendanceRate} className="mb-3" />
              
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{presentDays}</div>
                  <div className="text-xs text-green-600">Present</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">{lateDays}</div>
                  <div className="text-xs text-yellow-600">Late</div>
                </div>
                <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-lg font-bold text-red-600">{absentDays}</div>
                  <div className="text-xs text-red-600">Absent</div>
                </div>
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{excusedDays}</div>
                  <div className="text-xs text-blue-600">Excused</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert if attendance is low */}
          {attendanceRate < 75 && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">Low Attendance Warning</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Your attendance is below the required 75%. Please attend classes regularly to avoid academic issues.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Period Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["week", "month", "all"] as const).map((period) => (
              <Button
                key={period}
                variant={filterPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPeriod(period)}
                className="whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4"
              >
                {period === "all" ? "All Time" : `Last ${period.charAt(0).toUpperCase() + period.slice(1)}`}
              </Button>
            ))}
          </div>

          {/* Recent Records */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recent Attendance</h3>
              <span className="text-sm text-muted-foreground">{filteredRecords.length} records</span>
            </div>

            <AnimatePresence>
              {filteredRecords.slice(0, 10).map((record, index) => {
                const classInfo = mockClasses.find(cls => cls.id === record.classId);
                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm mb-1">
                                {classInfo?.name || "Unknown Class"}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{formatDate(new Date(record.date))}</span>
                                <span>•</span>
                                <span>Marked by {record.markedBy}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Badge className={`text-xs border ${getStatusColor(record.status)} flex-shrink-0`}>
                            {getStatusIcon(record.status)}
                            <span className="ml-1 capitalize">{record.status}</span>
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No attendance records found for this period</p>
              </div>
            )}
          </div>

          {/* Weekly Summary */}
          <Card className="border-0 bg-gradient-to-r from-chart-2/5 to-chart-3/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">This Week Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-chart-2">
                    {recentRecords.filter(r => r.status === "present").length}/{recentRecords.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Days Present</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-chart-3">{recentPresentRate.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Weekly Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {viewMode === "calendar" && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Attendance Calendar</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              modifiers={{
                present: myAttendance.filter(r => r.status === "present").map(r => new Date(r.date)),
                absent: myAttendance.filter(r => r.status === "absent").map(r => new Date(r.date)),
                late: myAttendance.filter(r => r.status === "late").map(r => new Date(r.date)),
                excused: myAttendance.filter(r => r.status === "excused").map(r => new Date(r.date))
              }}
              modifiersStyles={{
                present: { backgroundColor: 'rgb(34, 197, 94)', color: 'white' },
                absent: { backgroundColor: 'rgb(239, 68, 68)', color: 'white' },
                late: { backgroundColor: 'rgb(245, 158, 11)', color: 'white' },
                excused: { backgroundColor: 'rgb(59, 130, 246)', color: 'white' }
              }}
            />
            
            {selectedDate && (
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                {(() => {
                  const dayRecord = myAttendance.find(r => 
                    new Date(r.date).toDateString() === selectedDate.toDateString()
                  );
                  
                  if (dayRecord) {
                    const classInfo = mockClasses.find(cls => cls.id === dayRecord.classId);
                    return (
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs border ${getStatusColor(dayRecord.status)}`}>
                          {getStatusIcon(dayRecord.status)}
                          <span className="ml-1 capitalize">{dayRecord.status}</span>
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {classInfo?.name || "Unknown Class"}
                        </span>
                      </div>
                    );
                  } else {
                    return (
                      <p className="text-sm text-muted-foreground">No class scheduled</p>
                    );
                  }
                })()}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span>Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span>Excused</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};