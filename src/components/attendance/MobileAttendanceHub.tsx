import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Calendar, TrendingUp, BookOpen, Clock, Target,
  PlayCircle, PauseCircle, Settings, ArrowRight, Plus,
  CheckCircle, XCircle, AlertCircle, BarChart3, PieChart,
  Award, Star, Zap, Coffee, Sun, Moon, Smartphone,
  Filter, Search, Download, Upload, RefreshCw, Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { OptimizedAttendanceSystem } from './OptimizedAttendanceSystem';
import { AttendanceDashboardPro } from './AttendanceDashboardPro';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../contexts/AuthContext';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  badge?: string;
}

interface RecentSession {
  id: string;
  className: string;
  date: string;
  studentsPresent: number;
  totalStudents: number;
  attendanceRate: number;
  status: 'completed' | 'in-progress' | 'upcoming';
}

interface AttendanceAlert {
  id: string;
  type: 'low-attendance' | 'missing-session' | 'improvement' | 'streak';
  title: string;
  description: string;
  actionText: string;
  severity: 'low' | 'medium' | 'high';
}

export const MobileAttendanceHub: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'hub' | 'take' | 'dashboard' | 'analytics'>('hub');
  const [todaysSessions] = useState(3);
  const [averageAttendance] = useState(87.5);
  const [totalStudents] = useState(156);
  const [activeStreaks] = useState(23);

  // Mock data for recent sessions
  const [recentSessions] = useState<RecentSession[]>([
    {
      id: '1',
      className: 'Advanced Mathematics',
      date: '2 hours ago',
      studentsPresent: 28,
      totalStudents: 32,
      attendanceRate: 87.5,
      status: 'completed'
    },
    {
      id: '2',
      className: 'Physics Advanced',
      date: 'Yesterday, 2:00 PM',
      studentsPresent: 26,
      totalStudents: 28,
      attendanceRate: 92.9,
      status: 'completed'
    },
    {
      id: '3',
      className: 'Organic Chemistry',
      date: 'Tomorrow, 10:00 AM',
      studentsPresent: 0,
      totalStudents: 25,
      attendanceRate: 0,
      status: 'upcoming'
    }
  ]);

  // Mock attendance alerts
  const [alerts] = useState<AttendanceAlert[]>([
    {
      id: '1',
      type: 'low-attendance',
      title: 'Low Attendance Alert',
      description: 'Chemistry class attendance dropped to 68% this week',
      actionText: 'View Details',
      severity: 'high'
    },
    {
      id: '2',
      type: 'streak',
      title: 'Perfect Attendance Streak!',
      description: 'Emma Thompson reached 15 days perfect attendance',
      actionText: 'Celebrate',
      severity: 'low'
    }
  ]);

  const quickActions: QuickAction[] = [
    {
      id: 'take-attendance',
      title: 'Take Attendance',
      description: 'Start a new session',
      icon: <PlayCircle className="w-5 h-5" />,
      color: 'bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20',
      action: () => setCurrentView('take'),
      badge: '3 pending'
    },
    {
      id: 'view-reports',
      title: 'Analytics',
      description: 'View insights & trends',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20',
      action: () => setCurrentView('analytics')
    },
    {
      id: 'students',
      title: 'Student Records',
      description: 'Manage attendance history',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20',
      action: () => toast.info('Student records view coming soon!')
    },
    {
      id: 'settings',
      title: 'Attendance Settings',
      description: 'Configure preferences',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20',
      action: () => toast.info('Settings coming soon!')
    }
  ];

  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">Attendance Hub</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name || 'Teacher'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 xs:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-3 text-center">
            <Calendar className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold text-primary">{todaysSessions}</p>
            <p className="text-xs text-muted-foreground">Today's Sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="p-3 text-center">
            <Target className="w-4 h-4 mx-auto mb-1 text-green-600" />
            <p className="text-lg font-bold text-green-700">{averageAttendance}%</p>
            <p className="text-xs text-muted-foreground">Avg Attendance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-3 text-center">
            <Users className="w-4 h-4 mx-auto mb-1 text-blue-600" />
            <p className="text-lg font-bold text-blue-700">{totalStudents}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
          <CardContent className="p-3 text-center">
            <Star className="w-4 h-4 mx-auto mb-1 text-orange-600" />
            <p className="text-lg font-bold text-orange-700">{activeStreaks}</p>
            <p className="text-xs text-muted-foreground">Active Streaks</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderQuickActions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`${action.color} hover:shadow-md transition-all duration-200 cursor-pointer`}
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/50 rounded-lg">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{action.title}</h3>
                      {action.badge && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderRecentSessions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Sessions</h2>
        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {recentSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-sm transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    session.status === 'completed' ? 'bg-green-500/10' :
                    session.status === 'in-progress' ? 'bg-blue-500/10' :
                    'bg-orange-500/10'
                  }`}>
                    <BookOpen className={`w-4 h-4 ${
                      session.status === 'completed' ? 'text-green-600' :
                      session.status === 'in-progress' ? 'text-blue-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1">{session.className}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{session.date}</span>
                      {session.status === 'completed' && (
                        <>
                          <span>•</span>
                          <span>{session.studentsPresent}/{session.totalStudents} present</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {session.status === 'completed' && (
                    <Badge className={`
                      ${session.attendanceRate >= 90 ? 'bg-green-500/10 text-green-700' :
                        session.attendanceRate >= 80 ? 'bg-blue-500/10 text-blue-700' :
                        'bg-orange-500/10 text-orange-700'} text-xs mb-1
                    `}>
                      {session.attendanceRate}%
                    </Badge>
                  )}
                  
                  <div>
                    <Badge variant="outline" className={`text-xs ${
                      session.status === 'completed' ? 'text-green-600' :
                      session.status === 'in-progress' ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {session.status === 'completed' ? 'Completed' :
                       session.status === 'in-progress' ? 'In Progress' :
                       'Upcoming'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const renderAlerts = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <h2 className="text-lg font-semibold mb-4">Attendance Alerts</h2>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card 
            key={alert.id} 
            className={`border-l-4 ${
              alert.severity === 'high' ? 'border-l-red-500 bg-red-500/5' :
              alert.severity === 'medium' ? 'border-l-orange-500 bg-orange-500/5' :
              'border-l-green-500 bg-green-500/5'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  alert.severity === 'high' ? 'bg-red-500/10' :
                  alert.severity === 'medium' ? 'bg-orange-500/10' :
                  'bg-green-500/10'
                }`}>
                  {alert.type === 'low-attendance' && (
                    <AlertCircle className={`w-4 h-4 ${
                      alert.severity === 'high' ? 'text-red-600' : 'text-orange-600'
                    }`} />
                  )}
                  {alert.type === 'streak' && (
                    <Award className="w-4 h-4 text-green-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1">{alert.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                  <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                    {alert.actionText}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const renderHub = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4"
    >
      {renderHeader()}
      {renderQuickActions()}
      {renderRecentSessions()}
      {renderAlerts()}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentView === 'hub' && renderHub()}
        
        {currentView === 'take' && (
          <OptimizedAttendanceSystem
            key="take-attendance"
            onBack={() => setCurrentView('hub')}
            onComplete={() => {
              toast.success('Attendance submitted successfully!');
              setCurrentView('hub');
            }}
          />
        )}
        
        {currentView === 'analytics' && (
          <AttendanceDashboardPro key="dashboard" />
        )}
      </AnimatePresence>
    </div>
  );
};