import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import {
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Calendar,
  Send,
  Save
} from "lucide-react";

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'late' | 'pending';
  content: string;
  attachments?: string[];
  grade?: number;
  feedback?: string;
  submissionType: 'text' | 'file' | 'both';
}

interface AssignmentSubmissionTrackerProps {
  assignmentId: string;
  assignmentTitle: string;
  onBack: () => void;
}

export const AssignmentSubmissionTracker: React.FC<AssignmentSubmissionTrackerProps> = ({
  assignmentId,
  assignmentTitle,
  onBack
}) => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [currentView, setCurrentView] = useState<"list" | "details" | "grade">("list");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");

  // Mock submissions data
  const mockSubmissions: Submission[] = [
    {
      id: "sub-1",
      studentId: "3",
      studentName: "Jane Student",
      assignmentId,
      submittedAt: "2025-01-20T14:30:00Z",
      status: "submitted",
      content: "I have completed the assignment following all the requirements. Please find my work attached.",
      submissionType: "both",
      attachments: ["assignment_solution.pdf", "supporting_document.docx"]
    },
    {
      id: "sub-2",
      studentId: "4",
      studentName: "Bob Wilson",
      assignmentId,
      submittedAt: "2025-01-19T16:45:00Z",
      status: "graded",
      content: "Here is my assignment submission. I worked hard on this and included all required components.",
      submissionType: "text",
      grade: 85,
      feedback: "Good work! Your analysis was thorough, but consider adding more examples next time."
    },
    {
      id: "sub-3",
      studentId: "5",
      studentName: "Alice Brown",
      assignmentId,
      submittedAt: "2025-01-21T10:15:00Z",
      status: "late",
      content: "Sorry for the late submission. I had some technical difficulties but managed to complete the work.",
      submissionType: "file",
      attachments: ["late_assignment.pdf"]
    }
  ];

  useEffect(() => {
    // Simulate loading submissions with shorter timeout
    setLoading(true);
    const timer = setTimeout(() => {
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [assignmentId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-primary/10 text-primary border-primary/20";
      case "graded":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "late":
        return "bg-accent/10 text-accent border-accent/20";
      case "pending":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission || !grade) {
      toast.error("Please enter a grade");
      return;
    }

    try {
      // Update submission with grade and feedback
      const updatedSubmissions = submissions.map(sub =>
        sub.id === selectedSubmission.id
          ? { ...sub, grade: parseInt(grade), feedback, status: 'graded' as const }
          : sub
      );
      setSubmissions(updatedSubmissions);
      
      toast.success("Grade submitted successfully!");
      setCurrentView("list");
      setFeedback("");
      setGrade("");
    } catch (error) {
      toast.error("Failed to submit grade");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4 xs:p-6 safe-area-top safe-area-bottom">
        <div className="text-center max-w-sm w-full">
          <div className="w-8 h-8 xs:w-10 xs:h-10 border-2 xs:border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4 xs:mb-6"></div>
          <p className="text-muted-foreground text-base xs:text-lg">
            Loading submissions...
          </p>
        </div>
      </div>
    );
  }

  // Submissions List
  if (currentView === "list") {
    const submittedCount = submissions.filter(s => s.status === "submitted" || s.status === "graded").length;
    const gradedCount = submissions.filter(s => s.status === "graded").length;
    const lateCount = submissions.filter(s => s.status === "late").length;
    const totalStudents = 25; // Mock total

    return (
      <div className="p-4 xs:p-6 pb-24 space-y-4 xs:space-y-6 max-w-sm xs:max-w-md mx-auto safe-area-top safe-area-bottom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 xs:gap-4 mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5 xs:h-6 xs:w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-base xs:text-lg font-bold line-clamp-2">{assignmentTitle}</h1>
            <p className="text-muted-foreground">Submission Tracking</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 xs:grid-cols-3 gap-3 xs:gap-4"
        >
          <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/20 hover:shadow-md transition-shadow">
            <CardContent className="p-3 xs:p-4 text-center">
              <Upload className="h-5 w-5 xs:h-6 xs:w-6 mx-auto mb-1 text-primary" />
              <div className="text-base xs:text-lg font-bold text-primary">{submittedCount}</div>
              <div className="text-xs xs:text-sm text-muted-foreground">Submitted</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-secondary/10 to-secondary/20 hover:shadow-md transition-shadow">
            <CardContent className="p-3 xs:p-4 text-center">
              <CheckCircle className="h-5 w-5 xs:h-6 xs:w-6 mx-auto mb-1 text-secondary" />
              <div className="text-base xs:text-lg font-bold text-secondary">{gradedCount}</div>
              <div className="text-xs xs:text-sm text-muted-foreground">Graded</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-accent/10 to-accent/20 hover:shadow-md transition-shadow">
            <CardContent className="p-3 xs:p-4 text-center">
              <Clock className="h-5 w-5 xs:h-6 xs:w-6 mx-auto mb-1 text-accent" />
              <div className="text-base xs:text-lg font-bold text-accent">{lateCount}</div>
              <div className="text-xs xs:text-sm text-muted-foreground">Late</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 xs:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Submission Progress</span>
                <span className="text-muted-foreground">{submittedCount}/{totalStudents}</span>
              </div>
              <Progress value={(submittedCount / totalStudents) * 100} className="h-2 xs:h-2.5" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Submissions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-base xs:text-lg mb-3 xs:mb-4">Submissions</h3>
          <div className="space-y-3 xs:space-y-4">
            {submissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
                onClick={() => {
                  setSelectedSubmission(submission);
                  setCurrentView("details");
                }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4 xs:p-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 xs:w-12 xs:h-12">
                      <AvatarFallback>
                        {submission.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm xs:text-base">{submission.studentName}</h4>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </Badge>
                      </div>
                      
                      <p className="text-xs xs:text-sm text-muted-foreground line-clamp-2 mb-2">
                        {submission.content}
                      </p>
                      
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-xs xs:text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 xs:h-4 xs:w-4" />
                          <span>{formatDate(submission.submittedAt)}</span>
                        </div>
                        
                        {submission.grade && (
                          <div className="flex items-center gap-1 text-xs xs:text-sm">
                            <Star className="h-3 w-3 xs:h-4 xs:w-4 text-accent" />
                            <span className="font-medium">{submission.grade}%</span>
                          </div>
                        )}
                      </div>
                      
                      {submission.attachments && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                            <FileText className="h-3 w-3 md:h-4 md:w-4" />
                            <span>{submission.attachments.length} attachments</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Submission Details
  if (currentView === "details" && selectedSubmission) {
    return (
      <div className="p-4 xs:p-6 pb-24 space-y-4 xs:space-y-6 max-w-sm xs:max-w-md mx-auto safe-area-top safe-area-bottom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 xs:gap-4 mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("list")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5 xs:h-6 xs:w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-base xs:text-lg font-bold">{selectedSubmission.studentName}</h1>
            <p className="text-muted-foreground">Submission Details</p>
          </div>
          {!selectedSubmission.grade && (
            <Button 
              size="sm"
              onClick={() => setCurrentView("grade")}
              className="h-9 xs:h-10"
            >
              Grade
            </Button>
          )}
        </motion.div>

        {/* Submission Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 xs:p-6 space-y-4 xs:space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(selectedSubmission.submittedAt)}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-base xs:text-lg mb-2">Submission Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedSubmission.content}
                </p>
              </div>

              {selectedSubmission.attachments && (
                <div>
                  <h3 className="font-semibold text-base xs:text-lg mb-2">Attachments</h3>
                  <div className="space-y-2">
                    {selectedSubmission.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 xs:p-3 bg-muted rounded-lg">
                        <FileText className="h-4 w-4 xs:h-5 xs:w-5 text-muted-foreground" />
                        <span className="flex-1">{attachment}</span>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Download className="h-4 w-4 xs:h-5 xs:w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSubmission.grade && (
                <div>
                  <h3 className="font-semibold text-base xs:text-lg mb-2">Grade & Feedback</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 xs:h-5 xs:w-5 text-accent" />
                    <span className="font-medium text-base xs:text-lg">{selectedSubmission.grade}%</span>
                  </div>
                  {selectedSubmission.feedback && (
                    <p className="text-muted-foreground bg-muted p-3 xs:p-4 rounded-lg">
                      {selectedSubmission.feedback}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Grade Submission
  if (currentView === "grade" && selectedSubmission) {
    return (
      <div className="p-4 xs:p-6 pb-24 space-y-4 xs:space-y-6 max-w-sm xs:max-w-md mx-auto safe-area-top safe-area-bottom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 xs:gap-4 mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("details")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5 xs:h-6 xs:w-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-base xs:text-lg font-bold">Grade Submission</h1>
            <p className="text-muted-foreground">{selectedSubmission.studentName}</p>
          </div>
        </motion.div>

        {/* Grading Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 xs:space-y-6"
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 xs:p-6 space-y-4 xs:space-y-6">
              <div>
                <label className="font-medium mb-2 block">Grade (0-100)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Enter grade"
                  className="h-10 xs:h-12"
                />
              </div>

              <div>
                <label className="font-medium mb-2 block">Feedback (Optional)</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback to the student..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView("details")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGradeSubmission}
              className="flex-1"
              disabled={!grade}
            >
              <Save className="w-4 h-4 mr-2" />
              Submit Grade
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};