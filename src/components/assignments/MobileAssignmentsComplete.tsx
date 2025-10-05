import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useAssignmentsWithSearch } from "../../hooks/useSchoolData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";
import {
  BookOpen,
  Calendar as CalendarIcon,
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
  BookOpenCheck,
  GraduationCap,
  Target,
  Calendar as CalTime,
  Save,
  X
} from "lucide-react";

// Format date helper function
const formatDateForDisplay = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date for picker display
const formatDateForPicker = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

import { Assignment } from "../../services/mockData";

interface MobileAssignmentsCompleteProps {
  onPageChange?: (page: string) => void;
  onBack?: () => void;
}

const subjects = ["All", "Mathematics", "Physics", "English", "Chemistry", "History"];
const statusOptions = ["All", "active", "draft", "closed"];
const typeOptions = ["homework", "project", "quiz", "exam"];

export const MobileAssignmentsComplete: React.FC<MobileAssignmentsCompleteProps> = ({ 
  onPageChange,
  onBack 
}) => {
  const { user } = useAuth();
  const {
    filteredItems: assignments = [],
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    create,
    update,
    remove,
    refetch
  } = useAssignmentsWithSearch();

  const [currentView, setCurrentView] = useState<"overview" | "list" | "details" | "create" | "submission">("overview");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Form state for creating/editing assignments
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: "",
    dueDate: "",
    maxPoints: 100,
    type: "homework" as const,
    status: "active" as const
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      classId: "",
      dueDate: "",
      maxPoints: 100,
      type: "homework",
      status: "active"
    });
  };

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Reset states on unmount
      setSelectedAssignment(null);
      setIsCreateDialogOpen(false);
      setCurrentView("overview");
    };
  }, []);

  const handleCreateAssignment = async () => {
    if (!user || !formData.title || !formData.description || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await create({
        ...formData,
        teacherId: user.id
      });
      
      toast.success("Assignment created successfully!");
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to create assignment");
      console.error("Error creating assignment:", error);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      await remove(assignmentId);
      toast.success("Assignment deleted successfully!");
      if (currentView === "details") {
        setCurrentView("list");
      }
      refetch();
    } catch (error) {
      toast.error("Failed to delete assignment");
      console.error("Error deleting assignment:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary border-primary/20";
      case "draft":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "closed":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "homework":
        return "bg-chart-1/10 text-foreground border-border";
      case "project":
        return "bg-chart-5/10 text-foreground border-border";
      case "quiz":
        return "bg-accent/10 text-accent border-accent/20";
      case "exam":
        return "bg-chart-3/10 text-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4 xs:p-6 safe-area-top safe-area-bottom">
        <div className="text-center max-w-sm w-full">
          <div className="w-8 h-8 xs:w-10 xs:h-10 border-2 xs:border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4 xs:mb-6"></div>
          <p className="text-muted-foreground text-base xs:text-lg">
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <div className="text-center p-6 max-w-sm w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Failed to Load</h3>
          <p className="text-muted-foreground mb-4 text-sm">{error}</p>
          <Button onClick={refetch} className="w-full">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Overview
  if (currentView === "overview") {
    const activeCount = (assignments || []).filter(a => a.status === "active").length;
    const draftCount = (assignments || []).filter(a => a.status === "draft").length;
    const closedCount = (assignments || []).filter(a => a.status === "closed").length;
    const totalSubmissions = (assignments || []).reduce((sum, a) => sum + (a.submissionsCount || 0), 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="px-6 pt-8 pb-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 md:gap-4 mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Assignments</h1>
            <p className="text-muted-foreground text-sm md:text-base">Track and manage assignments</p>
          </div>
          {user?.role === "teacher" && (
            <Button 
              size="sm" 
              className="rounded-full w-8 h-8 md:w-10 md:h-10 p-0"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/20 hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <BookOpenCheck className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-primary" />
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">{activeCount}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-secondary/10 to-secondary/20 hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <Edit className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-secondary" />
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-secondary">{draftCount}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Drafts</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-chart-1/10 to-chart-1/20 hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <Users className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" style={{ color: 'var(--chart-1)' }} />
              <div className="text-xl md:text-2xl lg:text-3xl font-bold" style={{ color: 'var(--chart-1)' }}>{totalSubmissions}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Submissions</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-accent/10 to-accent/20 hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6 text-center">
              <Target className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-accent" />
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-accent">{closedCount}</div>
              <div className="text-xs md:text-sm text-muted-foreground">Closed</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4"
        >
          <Card 
            className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentView("list")}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <BookOpen className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2 text-primary" />
              <div className="font-semibold text-sm md:text-base">View All</div>
              <div className="text-xs md:text-sm text-muted-foreground">Browse assignments</div>
            </CardContent>
          </Card>
          
          {user?.role === "teacher" && (
            <Card 
              className="border-0 bg-gradient-to-br from-secondary/5 to-accent/5 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <CardContent className="p-4 md:p-6 text-center">
                <Plus className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2 text-secondary" />
                <div className="font-semibold text-sm md:text-base">Create New</div>
                <div className="text-xs md:text-sm text-muted-foreground">Add assignment</div>
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
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="font-semibold text-base md:text-lg">Recent Assignments</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("list")}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {(assignments || []).slice(0, 3).map((assignment, index) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setCurrentView("details");
                  }}
                >
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm md:text-base mb-1 line-clamp-1">{assignment.title}</h4>
                          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-2">
                            <span>{assignment.maxPoints} pts</span>
                            <span>•</span>
                            <span>{assignment.submissionsCount || 0} submissions</span>
                          </div>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex gap-1">
                              <Badge variant="outline" className={`text-xs ${getStatusColor(assignment.status)}`}>
                                {assignment.status}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getTypeColor(assignment.type)}`}>
                                {assignment.type}
                              </Badge>
                            </div>
                            <div className="text-xs md:text-sm text-muted-foreground">
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

        {/* Create Assignment Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Create Assignment</DialogTitle>
              <DialogDescription className="text-sm md:text-base">
                Create a new assignment for your students with title, description, and due date.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 md:space-y-5">
              <div>
                <Label htmlFor="title" className="text-sm md:text-base">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Assignment title"
                  className="h-10 md:h-12 text-sm md:text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm md:text-base">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Assignment description"
                  rows={3}
                  className="text-sm md:text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="type" className="text-sm md:text-base">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger className="h-10 md:h-12 text-sm md:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="points" className="text-sm md:text-base">Max Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPoints: parseInt(e.target.value) || 100 }))}
                  min="1"
                  max="1000"
                  className="h-10 md:h-12 text-sm md:text-base"
                />
              </div>
              
              <div>
                <Label className="text-sm md:text-base">Due Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-10 md:h-12 text-sm md:text-base"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      {selectedDate ? formatDateForPicker(selectedDate) : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) {
                          setFormData(prev => ({ ...prev, dueDate: date.toISOString().split('T')[0] }));
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex gap-2 md:gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1 h-10 md:h-12 text-sm md:text-base"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAssignment}
                  className="flex-1 h-10 md:h-12 text-sm md:text-base"
                  disabled={!formData.title || !formData.description || !formData.dueDate}
                >
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    );
  }

  // List View
  if (currentView === "list") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="px-6 pt-8 pb-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 md:gap-4 mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("overview")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">All Assignments</h1>
            <p className="text-sm md:text-base text-muted-foreground">{(assignments || []).length} assignments</p>
          </div>
          {user?.role === "teacher" && (
            <Button 
              size="sm" 
              className="rounded-full w-8 h-8 md:w-10 md:h-10 p-0"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 md:pl-12 h-12 md:h-14 text-sm md:text-base"
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
            {statusOptions.map((status) => (
              <Button
                key={status}
                variant={filters.status === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, status: status === "All" ? undefined : status }))}
                className="whitespace-nowrap flex-shrink-0"
              >
                {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {typeOptions.map((type) => (
              <Button
                key={type}
                variant={filters.type === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, type: filters.type === type ? undefined : type }))}
                className="whitespace-nowrap flex-shrink-0"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Assignments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        >
          <AnimatePresence>
            {(assignments || []).map((assignment, index) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setCurrentView("details");
                  }}
                >
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm md:text-base line-clamp-2 flex-1">{assignment.title}</h3>
                            {user?.role === "teacher" && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-1 ml-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAssignment(assignment.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-2">
                            <span>{assignment.maxPoints} points</span>
                            <span>•</span>
                            <span>{assignment.submissionsCount || 0} submissions</span>
                          </div>
                          
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3">
                            {assignment.description}
                          </p>

                          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <div className="flex gap-1">
                              <Badge variant="outline" className={`text-xs ${getStatusColor(assignment.status)}`}>
                                {assignment.status}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getTypeColor(assignment.type)}`}>
                                {assignment.type}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                              <CalendarIcon className="h-3 w-3 md:h-4 md:w-4" />
                              <span>{formatDate(assignment.dueDate)}</span>
                            </div>
                            
                            <div className={`text-xs md:text-sm px-2 py-1 rounded-full ${
                              daysUntilDue <= 1 ? 'bg-destructive/10 text-destructive' :
                              daysUntilDue <= 3 ? 'bg-accent/10 text-accent' :
                              'bg-primary/10 text-primary'
                            }`}>
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
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {(assignments || []).length === 0 && (
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
                setFilters({});
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Create Assignment Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">Create Assignment</DialogTitle>
              <DialogDescription className="text-sm md:text-base">
                Create a new assignment for your students with title, description, and due date.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 md:space-y-5">
              <div>
                <Label htmlFor="title" className="text-sm md:text-base">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Assignment title"
                  className="h-10 md:h-12 text-sm md:text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm md:text-base">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Assignment description"
                  rows={3}
                  className="text-sm md:text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="type" className="text-sm md:text-base">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger className="h-10 md:h-12 text-sm md:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="points" className="text-sm md:text-base">Max Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPoints: parseInt(e.target.value) || 100 }))}
                  min="1"
                  max="1000"
                  className="h-10 md:h-12 text-sm md:text-base"
                />
              </div>
              
              <div>
                <Label className="text-sm md:text-base">Due Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-10 md:h-12 text-sm md:text-base"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      {selectedDate ? formatDateForPicker(selectedDate) : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) {
                          setFormData(prev => ({ ...prev, dueDate: date.toISOString().split('T')[0] }));
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex gap-2 md:gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1 h-10 md:h-12 text-sm md:text-base"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAssignment}
                  className="flex-1 h-10 md:h-12 text-sm md:text-base"
                  disabled={!formData.title || !formData.description || !formData.dueDate}
                >
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    );
  }

  // Assignment Details View
  if (currentView === "details" && selectedAssignment) {
    const daysUntilDue = getDaysUntilDue(selectedAssignment.dueDate);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="px-6 pt-8 pb-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 md:gap-4 mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("list")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold line-clamp-2">{selectedAssignment.title}</h1>
            <p className="text-sm md:text-base text-muted-foreground capitalize">{selectedAssignment.type}</p>
          </div>
          {user?.role === "teacher" && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => handleDeleteAssignment(selectedAssignment.id)}
            >
              <Trash2 className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          )}
        </motion.div>

        {/* Assignment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Status and Due Date */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-2">
                  <Badge variant="outline" className={`text-xs md:text-sm ${getStatusColor(selectedAssignment.status)}`}>
                    {selectedAssignment.status}
                  </Badge>
                  <Badge variant="outline" className={`text-xs md:text-sm ${getTypeColor(selectedAssignment.type)}`}>
                    {selectedAssignment.type}
                  </Badge>
                </div>
                <div className={`text-sm md:text-base px-3 py-1 rounded-full ${
                  daysUntilDue <= 1 ? 'bg-destructive/10 text-destructive' :
                  daysUntilDue <= 3 ? 'bg-accent/10 text-accent' :
                  'bg-primary/10 text-primary'
                }`}>
                  {daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                   daysUntilDue === 0 ? "Due today" : 
                   `${Math.abs(daysUntilDue)} days overdue`}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-2">Description</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {selectedAssignment.description}
                </p>
              </div>

              {/* Assignment Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div>
                  <h4 className="font-medium text-sm md:text-base mb-1">Points</h4>
                  <p className="text-sm md:text-base text-muted-foreground">{selectedAssignment.maxPoints} pts</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm md:text-base mb-1">Due Date</h4>
                  <p className="text-sm md:text-base text-muted-foreground">{formatDate(selectedAssignment.dueDate)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm md:text-base mb-1">Type</h4>
                  <p className="text-sm md:text-base text-muted-foreground capitalize">{selectedAssignment.type}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm md:text-base mb-1">Submissions</h4>
                  <p className="text-sm md:text-base text-muted-foreground">{selectedAssignment.submissionsCount || 0}</p>
                </div>
              </div>

              {/* Progress for Teachers */}
              {user?.role === "teacher" && (
                <div>
                  <div className="flex items-center justify-between text-sm md:text-base mb-2">
                    <span>Submission Progress</span>
                    <span>{selectedAssignment.submissionsCount || 0}/25</span>
                  </div>
                  <Progress value={((selectedAssignment.submissionsCount || 0) / 25) * 100} className="h-2 md:h-3" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 md:gap-4"
        >
          {user?.role === "student" ? (
            <>
              <Button 
                className="flex-1 h-12 md:h-14" 
                disabled={selectedAssignment.status === "closed"}
                onClick={() => {
                  if (onPageChange) {
                    onPageChange(`assignment-student-${selectedAssignment.id}`);
                  }
                }}
              >
                <Upload className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="text-sm md:text-base">Submit Work</span>
              </Button>
              <Button variant="outline" className="flex-1 h-12 md:h-14">
                <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="text-sm md:text-base">Download</span>
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="flex-1 h-12 md:h-14"
                onClick={() => {
                  // Navigate to submission tracker
                  if (onPageChange) {
                    onPageChange(`assignment-submissions-${selectedAssignment.id}`);
                  }
                }}
              >
                <Users className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="text-sm md:text-base">View Submissions</span>
              </Button>
              <Button variant="outline" className="flex-1 h-12 md:h-14">
                <GraduationCap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="text-sm md:text-base">Grade</span>
              </Button>
            </>
          )}
        </motion.div>
        </div>
      </div>
    );
  }

  return null;
};