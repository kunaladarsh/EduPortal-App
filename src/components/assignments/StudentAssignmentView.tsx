import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { toast } from "sonner";
import {
  Upload,
  Download,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Send,
  Paperclip,
  Trash2,
  Eye
} from "lucide-react";
import { Assignment } from "../../services/mockData";

interface StudentAssignmentViewProps {
  assignment: Assignment;
  onBack: () => void;
}

export const StudentAssignmentView: React.FC<StudentAssignmentViewProps> = ({
  assignment,
  onBack
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);

  // Mock submission status
  const mockSubmissionStatus = {
    submitted: false,
    submittedAt: null,
    grade: null,
    feedback: null,
    status: 'pending' as const
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files]);
      toast.success(`${files.length} file(s) attached`);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  const handleSubmission = async () => {
    if (!submissionText.trim() && attachedFiles.length === 0) {
      toast.error("Please add content or attach files before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setHasSubmitted(true);
      setShowSubmissionDialog(false);
      toast.success("Assignment submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const isOverdue = daysUntilDue < 0;
  const isDueToday = daysUntilDue === 0;

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
          <h1 className="text-base xs:text-lg font-bold line-clamp-2">{assignment.title}</h1>
          <p className="text-muted-foreground capitalize">{assignment.type}</p>
        </div>
      </motion.div>

      {/* Assignment Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 xs:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Badge variant="outline" className={`${getStatusColor(assignment.status)}`}>
                  {assignment.status}
                </Badge>
                <Badge variant="outline" className={`${getTypeColor(assignment.type)}`}>
                  {assignment.type}
                </Badge>
              </div>
              
              <div className={`text-sm px-3 py-1 rounded-full ${
                isOverdue ? 'bg-destructive/10 text-destructive' :
                isDueToday ? 'bg-accent/10 text-accent' :
                daysUntilDue <= 3 ? 'bg-accent/10 text-accent' :
                'bg-primary/10 text-primary'
              }`}>
                {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` :
                 isDueToday ? "Due today" :
                 `${daysUntilDue} days left`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Points</h4>
                <p className="text-sm text-muted-foreground">{assignment.maxPoints} pts</p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Due Date</h4>
                <p className="text-sm text-muted-foreground">{formatDate(assignment.dueDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Assignment Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Assignment Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {assignment.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Submission Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Submission Status</h3>
            
            {hasSubmitted || mockSubmissionStatus.submitted ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Submitted</span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Submitted on: {formatDate(new Date().toISOString())}</p>
                </div>

                {mockSubmissionStatus.grade && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Grade</span>
                      <span className="text-lg font-bold text-green-600">
                        {mockSubmissionStatus.grade}%
                      </span>
                    </div>
                    {mockSubmissionStatus.feedback && (
                      <div>
                        <p className="text-sm font-medium mb-1">Feedback</p>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                          {mockSubmissionStatus.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-yellow-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Not Submitted</span>
                </div>
                
                {assignment.status === "closed" ? (
                  <p className="text-sm text-muted-foreground">
                    This assignment is no longer accepting submissions.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You can submit your work until the due date.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        {!hasSubmitted && !mockSubmissionStatus.submitted && assignment.status === "active" && (
          <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Upload className="w-4 h-4 mr-2" />
                Submit Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle>Submit Assignment</DialogTitle>
                <DialogDescription>
                  Complete your work and submit your assignment for grading.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Submission</label>
                  <Textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Type your submission here or attach files below..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Attachments</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach Files
                  </Button>
                </div>

                {attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Attached Files:</label>
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm flex-1 truncate">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="p-1 h-auto"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSubmissionDialog(false)}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmission}
                    className="flex-1"
                    disabled={isSubmitting || (!submissionText.trim() && attachedFiles.length === 0)}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </motion.div>
    </div>
  );
};