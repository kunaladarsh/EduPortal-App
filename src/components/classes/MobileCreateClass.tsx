import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  ArrowLeft, Plus, Users, Calendar, Clock, 
  BookOpen, Save, X, Upload, Image,
  Palette, Hash, Globe, Lock
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";

interface MobileCreateClassProps {
  onBack: () => void;
  onClassCreated: (classData: any) => void;
}

export const MobileCreateClass: React.FC<MobileCreateClassProps> = ({ 
  onBack, 
  onClassCreated 
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    code: "",
    schedule: "",
    color: "#7C3AED",
    isPublic: true,
    maxStudents: 30,
    startDate: "",
    endDate: "",
    room: "",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  const subjects = [
    "Mathematics", "Science", "English", "History", "Geography",
    "Physics", "Chemistry", "Biology", "Computer Science", "Art",
    "Music", "Physical Education", "Languages", "Economics", "Psychology"
  ];

  const colors = [
    "#7C3AED", "#0EA5E9", "#FB7185", "#10B981", "#F59E0B",
    "#EF4444", "#8B5CF6", "#06B6D4", "#F97316", "#84CC16"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateClassCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData(prev => ({ ...prev, code }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Class name is required");
      return false;
    }
    if (!formData.subject.trim()) {
      toast.error("Subject is required");
      return false;
    }
    if (!formData.code.trim()) {
      toast.error("Class code is required");
      return false;
    }
    return true;
  };

  const handleCreateClass = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const classData = {
        ...formData,
        teacher: user?.name || "Teacher",
        teacherId: user?.id || "teacher1",
        status: "active",
        students: 0,
        progress: 0,
        assignments: 0,
        announcements: 0,
        lastActivity: "Just created",
        nextClass: "Not scheduled"
      };

      onClassCreated(classData);
    } catch (error) {
      toast.error("Failed to create class");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <motion.div 
        className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border/50 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Create Class</h1>
              <p className="text-sm text-muted-foreground">Set up a new class</p>
            </div>
          </div>
          <Button 
            onClick={handleCreateClass}
            disabled={isLoading}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            {isLoading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Advanced Mathematics"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what this class is about..."
                  className="min-h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room</label>
                  <Input
                    value={formData.room}
                    onChange={(e) => handleInputChange("room", e.target.value)}
                    placeholder="e.g., Room 101"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Students</label>
                  <Input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => handleInputChange("maxStudents", parseInt(e.target.value) || 30)}
                    placeholder="30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Class Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Class Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Code</label>
                <div className="flex gap-2">
                  <Input
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                    placeholder="AUTO-GENERATED"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={generateClassCode}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Class Color</label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleInputChange("color", color)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        formData.color === color ? "border-foreground scale-110" : "border-border"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Public Class</label>
                  <p className="text-xs text-muted-foreground">Allow students to discover and join</p>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule</label>
                <Input
                  value={formData.schedule}
                  onChange={(e) => handleInputChange("schedule", e.target.value)}
                  placeholder="e.g., Mon, Wed, Fri - 9:00 AM"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom spacing for mobile */}
        <div className="h-20" />
      </div>
    </div>
  );
};