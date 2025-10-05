import React, { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MobileAppHome } from "../dashboard/MobileAppHome";
import { MobileNavigationEnhanced } from "./MobileNavigationEnhanced";
import { MobileQuickActions } from "./MobileQuickActions";
import { MobileSearchInterface } from "./MobileSearchInterface";
import { MobilePageContent } from "./MobilePageContent";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
import { useNavigation } from "../../contexts/NavigationContext";
import { Button } from "../ui/button";
import { Calendar, AlertCircle, RefreshCw } from "lucide-react";

// Lazy load components with reasonable timeout protection to prevent hanging
const createLazyWithTimeout = (importFn: () => Promise<any>, componentName: string, timeout = 5000) => 
  lazy(() => 
    Promise.race([
      importFn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`${componentName} load timeout`)), timeout)
      )
    ]) as Promise<{ default: React.ComponentType<any> }>
  );

const AttendanceHub = createLazyWithTimeout(() => import("../attendance/AttendanceHub").then(m => ({ default: m.AttendanceHub })), "AttendanceHub");
const TakeAttendanceModern = createLazyWithTimeout(() => import("../attendance/TakeAttendanceModern").then(m => ({ default: m.TakeAttendanceModern })), "TakeAttendanceModern");
const AttendanceAnalyticsHub = createLazyWithTimeout(() => import("../attendance/AttendanceAnalyticsHub").then(m => ({ default: m.AttendanceAnalyticsHub })), "AttendanceAnalyticsHub");
const StudentAttendanceHub = createLazyWithTimeout(() => import("../attendance/StudentAttendanceHub").then(m => ({ default: m.StudentAttendanceHub })), "StudentAttendanceHub");
const AttendanceSettings = createLazyWithTimeout(() => import("../attendance/AttendanceSettings").then(m => ({ default: m.AttendanceSettings })), "AttendanceSettings");
const AttendanceHistoryPage = createLazyWithTimeout(() => import("../attendance/AttendanceHistoryPage").then(m => ({ default: m.AttendanceHistoryPage })), "AttendanceHistoryPage");
const AttendanceCalendarView = createLazyWithTimeout(() => import("../attendance/AttendanceCalendarView").then(m => ({ default: m.AttendanceCalendarView })), "AttendanceCalendarView");
const BeautifulAttendanceUI = createLazyWithTimeout(() => import("../attendance/BeautifulAttendanceUI").then(m => ({ default: m.BeautifulAttendanceUI })), "BeautifulAttendanceUI");
const AttendanceMasterDashboard = createLazyWithTimeout(() => import("../attendance/AttendanceMasterDashboard").then(m => ({ default: m.AttendanceMasterDashboard })), "AttendanceMasterDashboard");

const MobileAnnouncementsEnhanced = createLazyWithTimeout(() => import("../announcements/MobileAnnouncementsEnhanced").then(m => ({ default: m.MobileAnnouncementsEnhanced })), "MobileAnnouncementsEnhanced");
const MobileTakeAttendanceFlow = createLazyWithTimeout(() => import("../attendance/MobileTakeAttendanceFlow").then(m => ({ default: m.MobileTakeAttendanceFlow })), "MobileTakeAttendanceFlow");
const MobileAttendanceAnalytics = createLazyWithTimeout(() => import("../attendance/MobileAttendanceAnalytics").then(m => ({ default: m.MobileAttendanceAnalytics })), "MobileAttendanceAnalytics");
const MobileAttendanceTracker = createLazyWithTimeout(() => import("../attendance/MobileAttendanceTracker").then(m => ({ default: m.MobileAttendanceTracker })), "MobileAttendanceTracker");
const MobileAttendanceReports = createLazyWithTimeout(() => import("../attendance/MobileAttendanceReports").then(m => ({ default: m.MobileAttendanceReports })), "MobileAttendanceReports");

const MobileMyClasses = createLazyWithTimeout(() => import("../classes/MobileMyClasses").then(m => ({ default: m.MobileMyClasses })), "MobileMyClasses");
const MobileClassDetailsView = createLazyWithTimeout(() => import("../classes/MobileClassDetailsView").then(m => ({ default: m.MobileClassDetailsView })), "MobileClassDetailsView");

const MobileGradesProfessional = createLazyWithTimeout(() => import("../grades/MobileGradesProfessional").then(m => ({ default: m.MobileGradesProfessional })), "MobileGradesProfessional");
const MobileTeacherGrades = createLazyWithTimeout(() => import("../grades/MobileTeacherGrades").then(m => ({ default: m.MobileTeacherGrades })), "MobileTeacherGrades");
const MobileStudentGrades = createLazyWithTimeout(() => import("../grades/MobileStudentGrades").then(m => ({ default: m.MobileStudentGrades })), "MobileStudentGrades");

const MobileCalendarComplete = createLazyWithTimeout(() => import("../calendar/MobileCalendarComplete").then(m => ({ default: m.MobileCalendarComplete })), "MobileCalendarComplete");

const MobileFeatureManagementEnhanced = createLazyWithTimeout(() => import("../settings/MobileFeatureManagementEnhanced").then(m => ({ default: m.MobileFeatureManagementEnhanced })), "MobileFeatureManagementEnhanced");
const FeatureTestDebug = createLazyWithTimeout(() => import("../settings/FeatureTestDebug").then(m => ({ default: m.FeatureTestDebug })), "FeatureTestDebug");
const MobileUserManagement = createLazyWithTimeout(() => import("../admin/MobileUserManagement").then(m => ({ default: m.MobileUserManagement })), "MobileUserManagement");

const MobileProfileEnhanced = createLazyWithTimeout(() => import("../profile/MobileProfileEnhanced").then(m => ({ default: m.MobileProfileEnhanced })), "MobileProfileEnhanced");
const MobileProfileEdit = createLazyWithTimeout(() => import("../profile/MobileProfileEdit").then(m => ({ default: m.MobileProfileEdit })), "MobileProfileEdit");
const MobileProfileSettings = createLazyWithTimeout(() => import("../profile/MobileProfileSettings").then(m => ({ default: m.MobileProfileSettings })), "MobileProfileSettings");
const MobileProfileCompletion = createLazyWithTimeout(() => import("../profile/MobileProfileCompletion").then(m => ({ default: m.MobileProfileCompletion })), "MobileProfileCompletion");

const MobileSettings = createLazyWithTimeout(() => import("../settings/MobileSettings").then(m => ({ default: m.MobileSettings })), "MobileSettings");
const MobileThemeSettings = createLazyWithTimeout(() => import("../settings/MobileThemeSettings").then(m => ({ default: m.MobileThemeSettings })), "MobileThemeSettings");
const ThemeVerificationPage = createLazyWithTimeout(() => import("../settings/ThemeVerificationPage").then(m => ({ default: m.ThemeVerificationPage })), "ThemeVerificationPage");
const ThemeShowcase = createLazyWithTimeout(() => import("../demo/ThemeShowcase").then(m => ({ default: m.ThemeShowcase })), "ThemeShowcase");
const DarkModeDemo = createLazyWithTimeout(() => import("../demo/DarkModeDemo").then(m => ({ default: m.DarkModeDemo })), "DarkModeDemo");

const MobileNotifications = createLazyWithTimeout(() => import("../notifications/MobileNotifications").then(m => ({ default: m.MobileNotifications })), "MobileNotifications");
const MobileLibrary = createLazyWithTimeout(() => import("../library/MobileLibrary").then(m => ({ default: m.MobileLibrary })), "MobileLibrary");
const MobileMessaging = createLazyWithTimeout(() => import("../messaging/MobileMessaging").then(m => ({ default: m.MobileMessaging })), "MobileMessaging");
const MobileDocuments = createLazyWithTimeout(() => import("../documents/MobileDocuments").then(m => ({ default: m.MobileDocuments })), "MobileDocuments");
const MobileAssignmentsComplete = createLazyWithTimeout(() => import("../assignments/MobileAssignmentsComplete").then(m => ({ default: m.MobileAssignmentsComplete })), "MobileAssignmentsComplete");
const AssignmentSubmissionTracker = lazy(() => import("../assignments/AssignmentSubmissionTracker").then(m => ({ default: m.AssignmentSubmissionTracker })));
const StudentAssignmentView = lazy(() => import("../assignments/StudentAssignmentView").then(m => ({ default: m.StudentAssignmentView })));
const MobileReports = lazy(() => import("../reports/MobileReports").then(m => ({ default: m.MobileReports })));
const MobileWallet = lazy(() => import("../wallet/MobileWallet").then(m => ({ default: m.MobileWallet })));
const MobileServicesHub = lazy(() => import("../services/MobileServicesHub").then(m => ({ default: m.MobileServicesHub })));

interface MobileAppMainProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  pageHistory: string[];
}

// Fast loading component for lazy loading with reasonable timeout
const FastLoader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  const [showTimeout, setShowTimeout] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      console.warn(`FastLoader timeout for: ${message}`);
      setShowTimeout(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);

  if (showTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <div className="text-center p-6 max-w-sm w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Loading Timeout</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            The page is taking too long to load.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh App
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

// Error fallback component
const ErrorFallback: React.FC<{ error?: Error; onRetry?: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
    <div className="text-center p-6 max-w-sm w-full">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Failed to Load</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        {error?.message || "This page couldn't be loaded. Please try again."}
      </p>
      <Button onClick={onRetry || (() => window.location.reload())} className="w-full">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  </div>
);

// Enhanced wrapper component for lazy loaded pages with error boundary
class LazyLoadErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode; onError?: () => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("LazyLoad Error:", error, errorInfo);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} onRetry={() => window.location.reload()} />;
    }

    return this.props.children;
  }
}

// Wrapper component for lazy loaded pages
const LazyPageWrapper: React.FC<{ 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
  onError?: () => void;
  pageName?: string;
}> = ({ children, fallback, onError, pageName = "page" }) => (
  <LazyLoadErrorBoundary fallback={fallback} onError={onError}>
    <Suspense fallback={fallback || <FastLoader message={`Loading ${pageName}...`} />}>
      {children}
    </Suspense>
  </LazyLoadErrorBoundary>
);

export const MobileAppMain: React.FC<MobileAppMainProps> = ({ 
  currentPage, 
  onPageChange,
  pageHistory 
}) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatures();
  const { goBack, canGoBack } = useNavigation();
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const checkFeatureAccess = (featureId: string) => {
    return isFeatureEnabled(featureId);
  };

  const checkRoleAccess = (page: string): boolean => {
    switch (page) {
      case "attendance":
        return checkFeatureAccess("attendance");
      case "announcements":
        return checkFeatureAccess("announcements");
      case "classes":
      case "teacher_classes":
      case "my-classes":
        return user?.role !== "student" || checkFeatureAccess("classes");
      case "grades":
        return checkFeatureAccess("grades");
      case "reports":
        return checkFeatureAccess("reports") && (user?.role === "admin" || user?.role === "teacher");
      case "calendar":
        return checkFeatureAccess("calendar");
      case "library":
        return checkFeatureAccess("library");
      case "assignments":
        return checkFeatureAccess("assignments");
      case "messages":
        return checkFeatureAccess("messages");
      case "documents":
        return checkFeatureAccess("documents");
      case "user-management":
        return user?.role === "admin" && checkFeatureAccess("user_management");
      case "feature-management":
        return user?.role === "admin";
      default:
        return true;
    }
  };

  // Create a back navigation function that uses the new navigation context
  const handleBack = () => {
    const handled = goBack();
    if (!handled) {
      // Fallback to dashboard if no history
      onPageChange("dashboard");
    }
  };

  const handlePageChange = (page: string) => {
    if (page === "search") {
      setIsSearchOpen(true);
      return;
    }
    
    // Check if user has access to the page
    if (!checkRoleAccess(page)) {
      return; // Silently ignore access denied requests
    }
    
    onPageChange(page);
    setIsQuickActionsOpen(false);
  };

  const handleQuickActionsToggle = () => {
    setIsQuickActionsOpen(!isQuickActionsOpen);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const getPageTitle = (page: string): string => {
    const titles: Record<string, string> = {
      "dashboard": "Home",
      "attendance": "Attendance Hub",
      "attendance-hub": "Attendance Hub",
      "take-attendance": "Take Attendance",
      "take-attendance-modern": "Take Attendance",
      "attendance-analytics-hub": "Attendance Analytics",
      "student-attendance": "My Attendance",
      "attendance-settings": "Attendance Settings",
      "mark-attendance": "Mark Attendance",
      "attendance-history": "Attendance History",
      "attendance-calendar": "Attendance Calendar",
      "grades": "Grades", 
      "messages": "Messages",
      "calendar": "Calendar",
      "announcements": "Announcements",
      "assignments": "Assignments",
      "classes": "Classes",
      "teacher_classes": "My Classes",
      "my-classes": "My Classes",
      "reports": "Reports",
      "profile": "Profile",
      "settings": "Settings",
      "theme": "Theme Settings",
      "theme-verification": "Theme Verification",
      "dark-mode-demo": "Dark Mode Demo",
      "notifications": "Notifications",
      "library": "Library",
      "documents": "Documents",
      "wallet": "Wallet",
      "services-hub": "Services",
      "user-management": "User Management",
      "feature-management": "Feature Management",
      "profile-edit": "Edit Profile",
      "profile-settings": "Profile Settings",
      "profile-completion": "Profile Completion",
      "mock-data-demo": "Mock Data System Demo"
    };
    return titles[page] || page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');
  };

  const renderAccessDenied = () => (
    <div className="pt-16 pb-20 flex items-center justify-center min-h-screen">
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-2xl">⛔</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
        <p className="text-muted-foreground mb-4">
          You don't have permission to access this page.
        </p>
        <Button onClick={() => handlePageChange("dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );

  const renderFeatureNotAvailable = (feature: string) => (
    <div className="pt-16 pb-20 flex items-center justify-center min-h-screen">
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl">🔒</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Feature Not Available</h3>
        <p className="text-muted-foreground mb-4">
          The {feature} feature is currently disabled for your role.
        </p>
        {user?.role === "admin" && (
          <Button 
            variant="outline" 
            onClick={() => handlePageChange("feature-management")}
          >
            Manage Features
          </Button>
        )}
        <Button 
          variant="ghost" 
          className="ml-2"
          onClick={() => handlePageChange("dashboard")}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      {currentPage === "dashboard" ? (
        <div className="pt-16 pb-20">
          <MobileAppHome onPageChange={handlePageChange} />
        </div>
      ) : currentPage === "attendance" ? (
        !checkFeatureAccess("attendance") ? 
          renderFeatureNotAvailable("attendance") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Attendance..." />} pageName="Attendance">
            <div className="pt-16 pb-20">
              <AttendanceHub 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("dashboard")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "attendance-hub" ? (
        !checkFeatureAccess("attendance") ? 
          renderFeatureNotAvailable("attendance") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Attendance Hub..." />} pageName="Attendance Hub">
            <div className="pt-16 pb-20">
              <AttendanceHub 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("dashboard")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "take-attendance-modern" ? (
        !checkFeatureAccess("attendance") || user?.role === "student" ? 
          renderAccessDenied() : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Take Attendance..." />} pageName="Take Attendance">
            <div className="pt-16 pb-20">
              <TakeAttendanceModern 
                onBack={() => handlePageChange("attendance")}
                onComplete={(attendanceData) => {
                  console.log("Attendance completed:", attendanceData);
                  handlePageChange("attendance");
                }}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "attendance-analytics-hub" ? (
        !checkFeatureAccess("attendance") || user?.role === "student" ? 
          renderAccessDenied() : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Analytics..." />}>
            <div className="pt-16 pb-20">
              <AttendanceAnalyticsHub 
                onBack={() => handlePageChange("attendance")}
                onPageChange={handlePageChange}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "student-attendance" ? (
        !checkFeatureAccess("attendance") ? 
          renderFeatureNotAvailable("attendance") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Student Attendance..." />}>
            <div className="pt-16 pb-20">
              {user?.role === "student" ? (
                <StudentAttendanceHub 
                  onBack={() => handlePageChange("dashboard")}
                />
              ) : (
                <AttendanceHub 
                  onPageChange={handlePageChange}
                  onBack={() => handlePageChange("dashboard")}
                />
              )}
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "beautiful-attendance" ? (
        !checkFeatureAccess("attendance") ? 
          renderFeatureNotAvailable("attendance") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Beautiful Attendance..." />}>
            <div className="pb-20">
              <BeautifulAttendanceUI />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "attendance-master" ? (
        !checkFeatureAccess("attendance") ? 
          renderFeatureNotAvailable("attendance") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Attendance Master..." />}>
            <div className="pb-20">
              <AttendanceMasterDashboard />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "announcements" ? (
        !checkFeatureAccess("announcements") ? 
          renderFeatureNotAvailable("announcements") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Announcements..." />}>
            <div className="pt-16 pb-20">
              <MobileAnnouncementsEnhanced 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("dashboard")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "take-attendance" ? (
        !checkFeatureAccess("attendance") || user?.role === "student" ? 
          renderAccessDenied() : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Take Attendance..." />}>
            <div className="pt-16 pb-20">
              <MobileTakeAttendanceFlow 
                session={{
                  id: "1",
                  className: "Mathematics 101",
                  subject: "Mathematics",
                  startTime: "09:00 AM",
                  endTime: "10:00 AM",
                  duration: 60,
                  studentsEnrolled: 25,
                  attendanceStatus: "not-started",
                  presentCount: 0,
                  absentCount: 0,
                  lateCount: 0,
                  teacher: user?.name || "Teacher",
                  location: "Room 101",
                  date: new Date().toISOString().split('T')[0]
                }}
                onBack={() => handlePageChange("dashboard")}
                onComplete={(attendanceData) => {
                  // Handle attendance completion
                  console.log("Attendance completed:", attendanceData);
                  handlePageChange("attendance");
                }}
                onPageChange={handlePageChange}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "attendance-analytics" ? (
        !checkFeatureAccess("attendance") ? 
          renderFeatureNotAvailable("attendance") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Analytics..." />}>
            <div className="pt-16 pb-20">
              <MobileAttendanceAnalytics 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("attendance")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "attendance-tracker" ? (
        !checkFeatureAccess("attendance") || user?.role === "student" ? 
          renderAccessDenied() : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Tracker..." />}>
            <div className="pt-16 pb-20">
              <MobileAttendanceTracker 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("attendance")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "attendance-reports" ? (
        !checkFeatureAccess("attendance") ? 
          renderFeatureNotAvailable("attendance") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Reports..." />}>
            <div className="pt-16 pb-20">
              <MobileAttendanceReports 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("attendance")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "attendance-settings" ? (
        !checkFeatureAccess("attendance") || user?.role === "student" ? 
          renderAccessDenied() : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Settings..." />}>
            <div className="pt-16 pb-20">
              <AttendanceSettings 
                onBack={() => handlePageChange("attendance")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "mark-attendance" ? (
        !checkFeatureAccess("attendance") || user?.role === "student" ? 
          renderAccessDenied() : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Mark Attendance..." />}>
            <div className="pt-16 pb-20">
              <TakeAttendanceModern 
                onBack={() => handlePageChange("attendance")}
                onComplete={(attendanceData) => {
                  console.log("Attendance completed:", attendanceData);
                  handlePageChange("attendance");
                }}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "attendance-history" ? (
        !checkFeatureAccess("attendance") ? 
          renderFeatureNotAvailable("attendance") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading History..." />}>
            <div className="pt-16 pb-20">
              <AttendanceHistoryPage 
                onBack={() => handlePageChange("attendance")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "attendance-calendar" ? (
        !checkFeatureAccess("attendance") ? 
          renderFeatureNotAvailable("attendance") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Calendar..." />}>
            <div className="pt-16 pb-20">
              <AttendanceCalendarView 
                onBack={() => handlePageChange("attendance")}
                onPageChange={handlePageChange}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "my-classes" || currentPage === "teacher_classes" || currentPage === "classes" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Classes..." />}>
          <div className="pt-16 pb-20">
            <MobileMyClasses 
              onPageChange={handlePageChange}
              onBack={() => handlePageChange("dashboard")}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "class-details" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Class Details..." />}>
          <div className="pt-16 pb-20">
            <MobileClassDetailsView 
              classData={null} // Pass actual class data here
              onPageChange={handlePageChange}
              onBack={() => handlePageChange("my-classes")}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "grades" ? (
        !checkFeatureAccess("grades") ? 
          renderFeatureNotAvailable("grades") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Grades..." />}>
            <div className="pt-16 pb-20">
              {user?.role === "teacher" || user?.role === "admin" ? (
                <MobileTeacherGrades 
                  onPageChange={handlePageChange}
                  onBack={() => handlePageChange("dashboard")}
                />
              ) : (
                <MobileStudentGrades 
                  onPageChange={handlePageChange}
                  onBack={() => handlePageChange("dashboard")}
                />
              )}
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "calendar" ? (
        isFeatureEnabled("calendar") ? (
          <LazyPageWrapper fallback={<FastLoader message="Loading Calendar..." />}>
            <div className="pt-16 pb-20">
              <MobileCalendarComplete 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("dashboard")}
              />
            </div>
          </LazyPageWrapper>
        ) : (
          <div className="pt-16 pb-20 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Calendar Not Available</h3>
              <p className="text-muted-foreground mb-4">
                The calendar feature is currently disabled for your role.
              </p>
              {user?.role === "admin" && (
                <Button 
                  variant="outline" 
                  onClick={() => handlePageChange("feature-management")}
                >
                  Manage Features
                </Button>
              )}
            </div>
          </div>
        )
      ) : currentPage === "user-management" ? (
        user?.role !== "admin" || !checkFeatureAccess("user_management") ? 
          renderAccessDenied() : (
          <LazyPageWrapper fallback={<FastLoader message="Loading User Management..." />}>
            <div className="pt-16 pb-20">
              <MobileUserManagement onPageChange={handlePageChange} />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "feature-management" ? (
        user?.role !== "admin" ? 
          renderAccessDenied() : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Feature Management..." />}>
            <div className="pt-16 pb-20">
              <MobileFeatureManagementEnhanced 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("dashboard")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "feature-debug" ? (
        user?.role !== "admin" ? 
          renderAccessDenied() : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Debug..." />}>
            <div className="pt-16 pb-20">
              <FeatureTestDebug />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "profile" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Profile..." />}>
          <div className="pt-16 pb-20">
            <MobileProfileEnhanced 
              onPageChange={handlePageChange}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "profile-edit" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Profile Edit..." />}>
          <div className="pt-16 pb-20">
            <MobileProfileEdit 
              onPageChange={handlePageChange}
              onBack={() => handlePageChange("profile")}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "profile-settings" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Profile Settings..." />}>
          <div className="pt-16 pb-20">
            <MobileProfileSettings 
              onPageChange={handlePageChange}
              onBack={() => handlePageChange("profile")}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "profile-completion" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Profile Completion..." />}>
          <div className="pt-16 pb-20">
            <MobileProfileCompletion 
              onPageChange={handlePageChange}
              onBack={() => handlePageChange("profile")}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "settings" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Settings..." />}>
          <div className="pt-16 pb-20">
            <MobileSettings 
              onPageChange={handlePageChange}
              onBack={() => handlePageChange("dashboard")}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "theme" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Theme Settings..." />}>
          <div className="pt-16 pb-20">
            <MobileThemeSettings 
              onClose={() => handlePageChange("settings")}
              showAdminFeatures={user?.role === "admin"}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "theme-verification" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Theme Verification..." />}>
          <div className="pt-16 pb-20">
            <ThemeVerificationPage 
              onBack={() => handlePageChange("settings")}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "theme-showcase" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Theme Showcase..." />}>
          <div className="pt-16 pb-20">
            <ThemeShowcase />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "dark-mode-demo" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Dark Mode Demo..." />}>
          <div className="pt-16 pb-20">
            <DarkModeDemo onBack={() => handlePageChange("settings")} />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "notifications" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Notifications..." />}>
          <div className="pt-16 pb-20">
            <MobileNotifications 
              onPageChange={handlePageChange}
              onBack={() => handlePageChange("dashboard")}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "library" ? (
        !checkFeatureAccess("library") ? 
          renderFeatureNotAvailable("library") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Library..." />}>
            <div className="pt-16 pb-20">
              <MobileLibrary 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("dashboard")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "messages" ? (
        !checkFeatureAccess("messages") ? 
          renderFeatureNotAvailable("messages") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Messages..." />}>
            <div className="pt-16 pb-20">
              <MobileMessaging 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("dashboard")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "documents" ? (
        !checkFeatureAccess("documents") ? 
          renderFeatureNotAvailable("documents") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Documents..." />}>
            <div className="pt-16 pb-20">
              <MobileDocuments 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("dashboard")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "assignments" ? (
        !checkFeatureAccess("assignments") ? 
          renderFeatureNotAvailable("assignments") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Assignments..." />}>
            <div className="pt-16 pb-20">
              <MobileAssignmentsComplete 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("dashboard")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage.startsWith("assignment-submissions-") ? (
        !checkFeatureAccess("assignments") ? 
          renderFeatureNotAvailable("assignments") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Submissions..." />}>
            <div className="pt-16 pb-20">
              <AssignmentSubmissionTracker 
                assignmentId={currentPage.replace("assignment-submissions-", "")}
                assignmentTitle="Assignment Submissions"
                onBack={() => handlePageChange("assignments")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage.startsWith("assignment-student-") ? (
        !checkFeatureAccess("assignments") ? 
          renderFeatureNotAvailable("assignments") : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Assignment..." />}>
            <div className="pt-16 pb-20">
              <StudentAssignmentView 
                assignment={{
                  id: currentPage.replace("assignment-student-", ""),
                  title: "Sample Assignment",
                  description: "This is a sample assignment for demonstration purposes.",
                  classId: "class-1",
                  teacherId: "2",
                  dueDate: "2025-02-01",
                  createdAt: "2025-01-15T10:00:00Z",
                  maxPoints: 100,
                  type: "homework",
                  status: "active",
                  submissionsCount: 0
                }}
                onBack={() => handlePageChange("assignments")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : currentPage === "wallet" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Wallet..." />}>
          <div className="pt-16 pb-20">
            <MobileWallet 
              onPageChange={handlePageChange}
              onBack={() => handlePageChange("dashboard")}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "services-hub" ? (
        <LazyPageWrapper fallback={<FastLoader message="Loading Services..." />}>
          <div className="pt-16 pb-20">
            <MobileServicesHub 
              onPageChange={handlePageChange}
              onBack={() => handlePageChange("dashboard")}
            />
          </div>
        </LazyPageWrapper>
      ) : currentPage === "reports" ? (
        !checkFeatureAccess("reports") || user?.role === "student" ? 
          renderAccessDenied() : (
          <LazyPageWrapper fallback={<FastLoader message="Loading Reports..." />}>
            <div className="pt-16 pb-20">
              <MobileReports 
                onPageChange={handlePageChange}
                onBack={() => handlePageChange("dashboard")}
              />
            </div>
          </LazyPageWrapper>
        )
      ) : (
        <div className="pt-16 pb-20">
          <MobilePageContent
            title={getPageTitle(currentPage)}
            onBack={() => handlePageChange("dashboard")}
          >
            <div className="p-6">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🚧</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    This beautiful {getPageTitle(currentPage).toLowerCase()} interface is currently under development.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The UI components are ready and optimized for mobile. We're working on connecting them to the full feature set.
                  </p>
                </div>
              </div>
            </div>
          </MobilePageContent>
        </div>
      )}

      {/* Navigation */}
      <MobileNavigationEnhanced 
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Quick Actions FAB */}
      <MobileQuickActions
        onPageChange={handlePageChange}
        isOpen={isQuickActionsOpen}
        onToggle={handleQuickActionsToggle}
      />

      {/* Search Interface */}
      <AnimatePresence>
        {isSearchOpen && (
          <MobileSearchInterface
            onPageChange={handlePageChange}
            onClose={handleSearchClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
};