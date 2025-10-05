import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Calendar, Clock, MapPin, Users, CheckCircle2, 
  XCircle, AlertCircle, Navigation, Smartphone,
  Wifi, Battery, Signal, Camera, QrCode,
  TrendingUp, Activity, Target, Zap, Star,
  Timer, Bell, Settings, RefreshCw, Share2
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MobilePageContent } from "../shared/MobilePageContent";
import { toast } from "sonner@2.0.3";

// Import centralized attendance data
import { useAttendance } from "../../hooks/useSchoolData";
import { getAllClasses, getClassById } from "../../services/mockData";

interface MobileAttendanceTrackerProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

interface ClassSession {
  id: string;
  subject: string;
  teacher: string;
  teacherAvatar?: string;
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed" | "missed";
  attendanceStatus?: "present" | "absent" | "late";
  checkInTime?: string;
  checkInMethod?: "qr" | "location" | "manual";
  studentsPresent?: number;
  totalStudents?: number;
}

interface AttendanceMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  available: boolean;
  accuracy: number;
}

export const MobileAttendanceTracker: React.FC<MobileAttendanceTrackerProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTracking, setIsTracking] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [qrScannerActive, setQrScannerActive] = useState(false);
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt");

  const todaySessions: ClassSession[] = [
    {
      id: "1",
      subject: "Mathematics",
      teacher: "Ms. Sarah Johnson",
      teacherAvatar: "/avatars/teacher1.jpg",
      startTime: "09:00",
      endTime: "10:30",
      duration: "1h 30m",
      location: "Room 101",
      status: "completed",
      attendanceStatus: "present",
      checkInTime: "09:05",
      checkInMethod: "qr",
      studentsPresent: 28,
      totalStudents: 30
    },
    {
      id: "2",
      subject: "Physics",
      teacher: "Dr. Robert Chen",
      teacherAvatar: "/avatars/teacher2.jpg",
      startTime: "11:00",
      endTime: "12:30",
      duration: "1h 30m",
      location: "Laboratory A",
      status: "ongoing",
      studentsPresent: 25,
      totalStudents: 28
    },
    {
      id: "3",
      subject: "Chemistry",
      teacher: "Dr. Emily Davis",
      teacherAvatar: "/avatars/teacher3.jpg",
      startTime: "14:00",
      endTime: "15:30",
      duration: "1h 30m",
      location: "Laboratory B",
      status: "upcoming",
      studentsPresent: 0,
      totalStudents: 25
    },
    {
      id: "4",
      subject: "English Literature",
      teacher: "Mr. James Wilson",
      teacherAvatar: "/avatars/teacher4.jpg",
      startTime: "16:00",
      endTime: "17:30",
      duration: "1h 30m",
      location: "Room 205",
      status: "upcoming",
      studentsPresent: 0,
      totalStudents: 32
    }
  ];

  const attendanceMethods: AttendanceMethod[] = [
    {
      id: "qr",
      name: "QR Code Scan",
      icon: <QrCode className="w-6 h-6" />,
      description: "Scan classroom QR code",
      available: true,
      accuracy: 98
    },
    {
      id: "location",
      name: "Location Based",
      icon: <Navigation className="w-6 h-6" />,
      description: "Auto-detect classroom location",
      available: locationPermission === "granted",
      accuracy: 92
    },
    {
      id: "manual",
      name: "Manual Check-in",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Teacher verification required",
      available: true,
      accuracy: 100
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Request location permission on component mount
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission("granted"),
        () => setLocationPermission("denied")
      );
    }
  }, []);

  const getCurrentSession = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    return todaySessions.find(session => {
      const startTime = session.startTime;
      const endTime = session.endTime;
      return currentTimeString >= startTime && currentTimeString <= endTime;
    });
  };

  const getUpcomingSession = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    return todaySessions.find(session => {
      return session.startTime > currentTimeString;
    });
  };

  const getStatusColor = (status: ClassSession["status"]) => {
    switch (status) {
      case "ongoing": return "bg-green-100 text-green-800 border-green-300";
      case "upcoming": return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed": return "bg-gray-100 text-gray-800 border-gray-300";
      case "missed": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getAttendanceStatusColor = (status?: ClassSession["attendanceStatus"]) => {
    switch (status) {
      case "present": return "text-green-600";
      case "late": return "text-yellow-600";
      case "absent": return "text-red-600";
      default: return "text-gray-500";
    }
  };

  const getAttendanceIcon = (status?: ClassSession["attendanceStatus"]) => {
    switch (status) {
      case "present": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "late": return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "absent": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Timer className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMethodIcon = (method?: ClassSession["checkInMethod"]) => {
    switch (method) {
      case "qr": return <QrCode className="w-3 h-3" />;
      case "location": return <Navigation className="w-3 h-3" />;
      case "manual": return <Smartphone className="w-3 h-3" />;
      default: return null;
    }
  };

  const handleCheckIn = async (sessionId: string, method: string) => {
    setIsTracking(true);
    setSelectedMethod(method);

    // Simulate check-in process
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (method === "qr") {
      setQrScannerActive(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setQrScannerActive(false);
    }

    toast.success("Successfully checked in!");
    setIsTracking(false);
    setSelectedMethod(null);
  };

  const handleLocationRequest = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission("granted");
          toast.success("Location access granted!");
        },
        (error) => {
          setLocationPermission("denied");
          toast.error("Location access denied");
        }
      );
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const currentSession = getCurrentSession();
  const upcomingSession = getUpcomingSession();

  return (
    <MobilePageContent
      title="Attendance Tracker"
      onBack={onBack}
      rightAction={
        <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full">
          <Settings className="w-4 h-4" />
        </Button>
      }
    >
      <div className="p-4 space-y-6">
        {/* Current Time & Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {currentSession ? (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Activity className="w-4 h-4 mr-1" />
                  In Session - {currentSession.subject}
                </Badge>
              ) : upcomingSession ? (
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  <Timer className="w-4 h-4 mr-1" />
                  Next: {upcomingSession.subject} at {formatTime(upcomingSession.startTime)}
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                  <Clock className="w-4 h-4 mr-1" />
                  No Classes Today
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Check-In (if in session) */}
        {currentSession && !currentSession.attendanceStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-green-800 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Check-In Available
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <h3 className="font-medium text-green-800">{currentSession.subject}</h3>
                  <p className="text-sm text-green-600">
                    {currentSession.teacher} • {currentSession.location}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {formatTime(currentSession.startTime)} - {formatTime(currentSession.endTime)}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {attendanceMethods.filter(method => method.available).map((method) => (
                    <Button
                      key={method.id}
                      variant="outline"
                      className="h-16 bg-white hover:bg-green-50 border-green-200"
                      onClick={() => handleCheckIn(currentSession.id, method.id)}
                      disabled={isTracking}
                    >
                      {isTracking && selectedMethod === method.id ? (
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs">Checking in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="text-green-600">{method.icon}</div>
                          <div className="text-left">
                            <div className="font-medium text-green-800">{method.name}</div>
                            <div className="text-xs text-green-600">{method.description}</div>
                          </div>
                          <Badge variant="outline" className="ml-auto text-xs border-green-300 text-green-700">
                            {method.accuracy}%
                          </Badge>
                        </div>
                      )}
                    </Button>
                  ))}
                </div>

                {locationPermission === "denied" && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLocationRequest}
                      className="text-green-700 border-green-300"
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Enable Location for Auto Check-in
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* QR Scanner Modal */}
        <AnimatePresence>
          {qrScannerActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full text-center"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Scanning QR Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Point your camera at the classroom QR code
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5 }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Today's Classes</h3>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {todaySessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="bg-card rounded-xl p-4 border border-border/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={session.teacherAvatar} />
                    <AvatarFallback>
                      {session.teacher.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{session.subject}</h4>
                    <p className="text-sm text-muted-foreground">{session.teacher}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                  {session.attendanceStatus && (
                    <div className="flex items-center space-x-1">
                      {getAttendanceIcon(session.attendanceStatus)}
                      <span className={`text-xs ${getAttendanceStatusColor(session.attendanceStatus)}`}>
                        {session.attendanceStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{session.location}</span>
                    </div>
                  </div>
                  {session.checkInMethod && (
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      {getMethodIcon(session.checkInMethod)}
                      <span>{session.checkInTime}</span>
                    </div>
                  )}
                </div>

                {session.status === "ongoing" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Class Progress</span>
                      <span className="font-medium">
                        {session.studentsPresent}/{session.totalStudents} present
                      </span>
                    </div>
                    <Progress 
                      value={(session.studentsPresent! / session.totalStudents!) * 100} 
                      className="h-2" 
                    />
                  </div>
                )}
              </div>

              {session.status === "upcoming" && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Bell className="w-4 h-4 mr-1" />
                      Set Reminder
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-xs text-muted-foreground">Streak Days</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">A+</div>
              <div className="text-xs text-muted-foreground">Grade</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MobilePageContent>
  );
};