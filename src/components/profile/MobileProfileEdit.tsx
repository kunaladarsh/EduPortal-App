import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Users,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface MobileProfileEditProps {
  onPageChange?: (page: string) => void;
  onBack?: () => void;
}

export const MobileProfileEdit: React.FC<MobileProfileEditProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
    studentId: user?.studentId || "",
    teacherId: user?.teacherId || "",
    department: user?.department || "",
    grade: user?.grade || "",
    institution: user?.institution || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (formData.phone && !/^[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCompletionPercentage = () => {
    const requiredFields = ["name", "email"];
    const optionalFields = ["phone", "address", "bio"];
    const roleFields = user?.role === "student" 
      ? ["studentId", "grade", "institution"]
      : user?.role === "teacher"
      ? ["teacherId", "department"]
      : [];
    
    const allFields = [...requiredFields, ...optionalFields, ...roleFields];
    const filledFields = allFields.filter(field => {
      const value = formData[field as keyof typeof formData];
      return value && value.toString().trim() !== "";
    });
    
    return Math.round((filledFields.length / allFields.length) * 100);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }
    
    setIsLoading(true);
    try {
      let avatarUrl = user?.avatar;
      if (avatarPreview) {
        avatarUrl = avatarPreview;
      }
      
      await updateUser({ 
        ...formData, 
        avatar: avatarUrl 
      });
      
      toast.success("Profile updated successfully!");
      onBack?.() || onPageChange?.("profile");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack || (() => onPageChange?.("profile"))}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">Update your personal information</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="px-4"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </motion.div>

      {/* Profile Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Profile Completion</span>
              <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Complete your profile to get the most out of the platform
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage src={avatarPreview || user?.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {formData.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                </label>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{formData.name || "Your Name"}</h3>
                <Badge variant="outline" className="capitalize">
                  {user?.role}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Tap the camera icon to update your photo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                Full Name
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                Email Address
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-20 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Role-Specific Information */}
      {user?.role && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {user.role === "student" ? (
                  <GraduationCap className="h-5 w-5" />
                ) : user.role === "teacher" ? (
                  <Briefcase className="h-5 w-5" />
                ) : (
                  <Users className="h-5 w-5" />
                )}
                {user.role === "student" ? "Academic Information" : 
                 user.role === "teacher" ? "Professional Information" : 
                 "Administrative Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.role === "student" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-sm font-medium">Student ID</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange("studentId", e.target.value)}
                      placeholder="Enter your student ID"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="grade" className="text-sm font-medium">Grade</Label>
                      <Input
                        id="grade"
                        value={formData.grade}
                        onChange={(e) => handleInputChange("grade", e.target.value)}
                        placeholder="e.g., 10th"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution" className="text-sm font-medium">Institution</Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={(e) => handleInputChange("institution", e.target.value)}
                        placeholder="School name"
                      />
                    </div>
                  </div>
                </>
              )}

              {user.role === "teacher" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="teacherId" className="text-sm font-medium">Teacher ID</Label>
                    <Input
                      id="teacherId"
                      value={formData.teacherId}
                      onChange={(e) => handleInputChange("teacherId", e.target.value)}
                      placeholder="Enter your teacher ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};