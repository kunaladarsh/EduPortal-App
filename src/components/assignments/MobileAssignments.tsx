import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import {
  BookOpen,
  Calendar,
  Clock,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Star,
  TrendingUp,
  ArrowLeft,
  Send,
  Paperclip,
  MoreHorizontal,
  Timer,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  totalPoints: number;
  status: "pending" | "submitted" | "graded" | "overdue";
  submissionType: "file" | "text" | "both";
  createdBy: string;
  createdAt: string;
  submissions?: number;
  totalStudents?: number;
  averageScore?: number;
  difficulty: "easy" | "medium" | "hard";
  estimated_time: string;
}

interface MobileAssignmentsProps {
  onPageChange?: (page: string) => void;
}

// Import centralized data
import { 
  getAllAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  Assignment as CentralAssignment
} from "../../services/mockData";

// Use centralized data with async loading
const [assignments, setAssignments] = useState<Assignment[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const loadAssignments = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await getAllAssignments();
    
    // Transform centralized assignments to component format
    const transformedData: Assignment[] = data.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      subject: "Mathematics", // From assignment class data
      dueDate: assignment.dueDate,
      dueTime: "23:59",
      totalPoints: assignment.maxPoints,
      status: assignment.status === 'active' ? 'pending' : 'submitted',
      submissionType: "both" as const,
      createdBy: "Teacher",
      createdAt: assignment.createdAt.split('T')[0],
      submissions: assignment.submissionsCount || 0,
      totalStudents: 25,
      difficulty: "medium" as const,
      estimated_time: "2 hours"
    }));
    
    setAssignments(transformedData);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load assignments');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadAssignments();
}, []);

// Remove the old hardcoded mockAssignments array
const mockAssignments: Assignment[] = [];

const subjects = ["All", "Mathematics", "Physics", "English", "Chemistry", "History"];
const statusOptions = ["All", "pending", "submitted", "graded", "overdue"];

export const MobileAssignments: React.FC<MobileAssignmentsProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"overview" | "list" | "details" | "create" | "submission">("overview");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || assignment.subject === selectedSubject;
    const matchesStatus = selectedStatus === "All" || assignment.status === selectedStatus;
    
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "submitted":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "graded":
        return "text-green-600 bg-green-50 border-green-200";
      case "overdue":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "hard":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2024-01-01 ${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Overview
  if (currentView === "overview") {
    const pendingCount = mockAssignments.filter(a => a.status === "pending").length;
    const submittedCount = mockAssignments.filter(a => a.status === "submitted").length;
    const gradedCount = mockAssignments.filter(a => a.status === "graded").length;
    const overdueCount = mockAssignments.filter(a => a.status === "overdue").length;

    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold mb-2">Assignments</h1>
          <p className="text-muted-foreground">Track and manage your assignments</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-4 text-center">
              <Timer className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <div className="text-xl font-bold text-yellow-700">{pendingCount}</div>
              <div className="text-xs text-yellow-600">Pending</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-xl font-bold text-blue-700">{submittedCount}</div>
              <div className="text-xs text-blue-600">Submitted</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-xl font-bold text-green-700">{gradedCount}</div>
              <div className="text-xs text-green-600">Graded</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-xl font-bold text-red-700">{overdueCount}</div>
              <div className="text-xs text-red-600">Overdue</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card 
            className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentView("list")}
          >
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-semibold text-sm">View All</div>
              <div className="text-xs text-muted-foreground">Browse assignments</div>
            </CardContent>
          </Card>
          
          {user?.role === "teacher" && (
            <Card 
              className="border-0 bg-gradient-to-br from-secondary/5 to-accent/5 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setCurrentView("create")}
            >
              <CardContent className="p-4 text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <div className="font-semibold text-sm">Create New</div>
                <div className="text-xs text-muted-foreground">Add assignment</div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Recent Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Assignments</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("list")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {mockAssignments.slice(0, 3).map((assignment, index) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setCurrentView("details");
                  }}
                >
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1 line-clamp-1">{assignment.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>{assignment.subject}</span>
                            <span>•</span>
                            <span>{assignment.totalPoints} pts</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={`text-xs ${getStatusColor(assignment.status)}`}>
                              {assignment.status}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                               daysUntilDue === 0 ? "Due today" : 
                               `${Math.abs(daysUntilDue)} days overdue`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold mb-3">Upcoming Deadlines</h3>
          <div className="space-y-2">
            {mockAssignments
              .filter(assignment => assignment.status === "pending")
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 3)
              .map((assignment, index) => {
                const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                
                return (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{assignment.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(assignment.dueDate)}</span>
                              <span>•</span>
                              <span>{formatTime(assignment.dueTime)}</span>
                            </div>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            daysUntilDue <= 1 ? 'bg-red-100 text-red-600' :
                            daysUntilDue <= 3 ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {daysUntilDue === 0 ? 'Today' : 
                             daysUntilDue === 1 ? 'Tomorrow' : 
                             `${daysUntilDue} days`}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>
      </div>
    );
  }

  // List View
  if (currentView === "list") {
    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("overview")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">All Assignments</h1>
            <p className="text-sm text-muted-foreground">{filteredAssignments.length} assignments</p>
          </div>
          {user?.role === "teacher" && (
            <Button 
              size="sm" 
              className="rounded-full w-8 h-8 p-0"
              onClick={() => setCurrentView("create")}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
                className="whitespace-nowrap flex-shrink-0"
              >
                {subject}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {statusOptions.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className="whitespace-nowrap flex-shrink-0"
              >
                {status}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Assignments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <AnimatePresence>
            {filteredAssignments.map((assignment, index) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setCurrentView("details");
                  }}
                >
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm line-clamp-2 flex-1">{assignment.title}</h3>
                            <Button variant="ghost" size="sm" className="p-1 ml-2">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>{assignment.subject}</span>
                            <span>•</span>
                            <span>{assignment.totalPoints} points</span>
                            <span>•</span>
                            <span>{assignment.createdBy}</span>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {assignment.description}
                          </p>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-1">
                              <Badge variant="outline" className={`text-xs ${getStatusColor(assignment.status)}`}>
                                {assignment.status}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getDifficultyColor(assignment.difficulty)}`}>
                                {assignment.difficulty}
                              </Badge>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              <Timer className="h-3 w-3 inline mr-1" />
                              {assignment.estimated_time}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(assignment.dueDate)} at {formatTime(assignment.dueTime)}</span>
                            </div>
                            
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              daysUntilDue <= 1 ? 'bg-red-100 text-red-600' :
                              daysUntilDue <= 3 ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                               daysUntilDue === 0 ? "Due today" : 
                               `${Math.abs(daysUntilDue)} days overdue`}
                            </div>
                          </div>

                          {user?.role === "teacher" && assignment.submissions && assignment.totalStudents && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Submissions</span>
                                <span>{assignment.submissions}/{assignment.totalStudents}</span>
                              </div>
                              <Progress 
                                value={(assignment.submissions / assignment.totalStudents) * 100} 
                                className="h-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No Assignments Found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {searchQuery ? "Try adjusting your search." : "No assignments match your filters."}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("All");
                setSelectedStatus("All");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  // Assignment Details View
  if (currentView === "details" && selectedAssignment) {
    const daysUntilDue = getDaysUntilDue(selectedAssignment.dueDate);
    
    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("list")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold line-clamp-2">{selectedAssignment.title}</h1>
            <p className="text-sm text-muted-foreground">{selectedAssignment.subject}</p>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Assignment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 space-y-4">
              {/* Status and Due Date */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`${getStatusColor(selectedAssignment.status)}`}>
                  {selectedAssignment.status}
                </Badge>
                <div className={`text-sm px-3 py-1 rounded-full ${
                  daysUntilDue <= 1 ? 'bg-red-100 text-red-600' :
                  daysUntilDue <= 3 ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                   daysUntilDue === 0 ? "Due today" : 
                   `${Math.abs(daysUntilDue)} days overdue`}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedAssignment.description}
                </p>
              </div>

              {/* Assignment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Points</h4>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.totalPoints} pts</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Difficulty</h4>
                  <Badge variant="outline" className={`text-xs ${getDifficultyColor(selectedAssignment.difficulty)}`}>
                    {selectedAssignment.difficulty}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Estimated Time</h4>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.estimated_time}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Submission Type</h4>
                  <p className="text-sm text-muted-foreground capitalize">{selectedAssignment.submissionType}</p>
                </div>
              </div>

              {/* Due Date and Time */}
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-sm">Due Date</h4>
                </div>
                <p className="text-sm">{formatDate(selectedAssignment.dueDate)} at {formatTime(selectedAssignment.dueTime)}</p>
              </div>

              {/* Teacher Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary/10">
                    {selectedAssignment.createdBy.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{selectedAssignment.createdBy}</p>
                  <p className="text-xs text-muted-foreground">
                    Created {formatDate(selectedAssignment.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submission Section */}
        {user?.role === "student" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAssignment.status === "submitted" ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="font-medium text-sm">Assignment Submitted</p>
                    <p className="text-xs text-muted-foreground">Submitted on Jan 22, 2024</p>
                  </div>
                ) : selectedAssignment.status === "graded" ? (
                  <div className="text-center py-4">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="font-medium text-sm">Assignment Graded</p>
                    <p className="text-lg font-bold text-primary">85/100</p>
                    <p className="text-xs text-muted-foreground">Good work! See feedback below.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedAssignment.submissionType !== "file" && (
                      <div>
                        <label className="font-medium text-sm mb-2 block">Text Submission</label>
                        <Textarea 
                          placeholder="Enter your answer here..."
                          className="min-h-[100px]"
                        />
                      </div>
                    )}
                    
                    {selectedAssignment.submissionType !== "text" && (
                      <div>
                        <label className="font-medium text-sm mb-2 block">File Upload</label>
                        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">Upload your files</p>
                          <Button variant="outline" size="sm">
                            <Paperclip className="h-4 w-4 mr-2" />
                            Choose Files
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Teacher Statistics */}
        {user?.role === "teacher" && selectedAssignment.submissions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Submission Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{selectedAssignment.submissions}</div>
                    <div className="text-xs text-muted-foreground">Submitted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground">
                      {selectedAssignment.totalStudents! - selectedAssignment.submissions}
                    </div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Submission Progress</span>
                    <span>{Math.round((selectedAssignment.submissions / selectedAssignment.totalStudents!) * 100)}%</span>
                  </div>
                  <Progress value={(selectedAssignment.submissions / selectedAssignment.totalStudents!) * 100} />
                </div>

                {selectedAssignment.averageScore && (
                  <div className="text-center pt-2 border-t border-border">
                    <div className="text-lg font-bold text-green-600">{selectedAssignment.averageScore}%</div>
                    <div className="text-xs text-muted-foreground">Average Score</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    );
  }

  return null;
};