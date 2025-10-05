import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "../../contexts/NavigationContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Eye,
  MoreHorizontal,
  ArrowLeft,
  Download,
  Upload,
  UserPlus,
  UserMinus,
  Settings,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  TrendingUp,
  Activity,
  Shield,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  lastActive: string;
  classes?: string[];
  subjects?: string[];
  grade?: string;
  avatar?: string;
}

interface MobileUserManagementProps {
  onPageChange: (page: string) => void;
}

interface NewUserForm {
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  grade?: string;
  subjects?: string[];
  password: string;
  confirmPassword: string;
}

export const MobileUserManagement: React.FC<MobileUserManagementProps> = ({
  onPageChange,
}) => {
  const { user } = useAuth();
  const { goBack } = useNavigation();
  const [currentView, setCurrentView] = useState<"overview" | "users" | "details" | "add-user" | "edit-user">("overview");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: "",
    email: "",
    role: "student",
    grade: "",
    subjects: [],
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserForm, setEditUserForm] = useState<NewUserForm>({
    name: "",
    email: "",
    role: "student",
    grade: "",
    subjects: [],
    password: "",
    confirmPassword: "",
  });

  // Mock data - In real app, this would come from a state management system
  const [mockUsers, setMockUsers] = useState<User[]>([
    {
      id: "u1",
      name: "Alice Johnson",
      email: "alice.johnson@school.edu",
      role: "teacher",
      status: "active",
      joinDate: "2023-09-01",
      lastActive: "2 hours ago",
      subjects: ["Mathematics", "Physics"],
      classes: ["10A", "11B", "12C"]
    },
    {
      id: "u2",
      name: "Bob Smith",
      email: "bob.smith@school.edu",
      role: "student",
      status: "active",
      joinDate: "2023-09-15",
      lastActive: "1 day ago",
      grade: "Grade 10",
      classes: ["10A"]
    },
    {
      id: "u3",
      name: "Carol Davis",
      email: "carol.davis@school.edu",
      role: "teacher",
      status: "active",
      joinDate: "2023-08-20",
      lastActive: "5 hours ago",
      subjects: ["English", "Literature"],
      classes: ["9A", "10B"]
    },
    {
      id: "u4",
      name: "David Wilson",
      email: "david.wilson@school.edu",
      role: "student",
      status: "inactive",
      joinDate: "2023-09-10",
      lastActive: "1 week ago",
      grade: "Grade 11"
    }
  ]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <ShieldCheck className="w-4 h-4" />;
      case "teacher": return <GraduationCap className="w-4 h-4" />;
      case "student": return <Users className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-50 text-red-600 border-red-200";
      case "teacher": return "bg-blue-50 text-blue-600 border-blue-200";
      case "student": return "bg-green-50 text-green-600 border-green-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-50 text-green-600 border-green-200";
      case "inactive": return "bg-gray-50 text-gray-600 border-gray-200";
      case "suspended": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-3 h-3" />;
      case "inactive": return <XCircle className="w-3 h-3" />;
      case "suspended": return <AlertTriangle className="w-3 h-3" />;
      default: return <XCircle className="w-3 h-3" />;
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === "active").length,
    teachers: mockUsers.filter(u => u.role === "teacher").length,
    students: mockUsers.filter(u => u.role === "student").length,
    admins: mockUsers.filter(u => u.role === "admin").length,
  };

  const availableSubjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "Literature", 
    "History", "Geography", "Computer Science", "Art", "Music", "Physical Education"
  ];

  const availableGrades = [
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
    "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"
  ];

  const validateForm = (isEdit: boolean = false): boolean => {
    const errors: Record<string, string> = {};
    const formData = isEdit ? editUserForm : newUserForm;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    } else if (!isEdit && mockUsers.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
      errors.email = "This email is already registered";
    } else if (isEdit && mockUsers.some(u => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== editingUser?.id)) {
      errors.email = "This email is already registered";
    }

    // Password validation - only required for new users or if changing password
    if (!isEdit) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    } else if (isEdit && formData.password) {
      // If editing and password is provided, validate it
      if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (formData.role === "student" && !formData.grade) {
      errors.grade = "Grade is required for students";
    }

    if (formData.role === "teacher" && (!formData.subjects || formData.subjects.length === 0)) {
      errors.subjects = "At least one subject is required for teachers";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateForm(false)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newUser: User = {
        id: `u${Date.now()}`,
        name: newUserForm.name,
        email: newUserForm.email,
        role: newUserForm.role,
        status: "active",
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: "Just now",
        grade: newUserForm.role === "student" ? newUserForm.grade : undefined,
        subjects: newUserForm.role === "teacher" ? newUserForm.subjects : undefined,
        classes: []
      };

      setMockUsers(prev => [newUser, ...prev]);
      
      // Reset form
      setNewUserForm({
        name: "",
        email: "",
        role: "student",
        grade: "",
        subjects: [],
        password: "",
        confirmPassword: "",
      });
      setFormErrors({});
      
      toast.success(`${newUserForm.role.charAt(0).toUpperCase() + newUserForm.role.slice(1)} account created successfully!`);
      setCurrentView("users");
    } catch (error) {
      toast.error("Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!validateForm(true) || !editingUser) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update the user in the mock data
      setMockUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? {
              ...u,
              name: editUserForm.name,
              email: editUserForm.email,
              role: editUserForm.role,
              grade: editUserForm.role === "student" ? editUserForm.grade : undefined,
              subjects: editUserForm.role === "teacher" ? editUserForm.subjects : undefined,
              lastActive: "Just now"
            }
          : u
      ));

      // Update selectedUser if it's the same user being edited
      if (selectedUser?.id === editingUser.id) {
        setSelectedUser(prev => prev ? {
          ...prev,
          name: editUserForm.name,
          email: editUserForm.email,
          role: editUserForm.role,
          grade: editUserForm.role === "student" ? editUserForm.grade : undefined,
          subjects: editUserForm.role === "teacher" ? editUserForm.subjects : undefined,
          lastActive: "Just now"
        } : null);
      }
      
      // Reset form and state
      setEditingUser(null);
      setEditUserForm({
        name: "",
        email: "",
        role: "student",
        grade: "",
        subjects: [],
        password: "",
        confirmPassword: "",
      });
      setFormErrors({});
      
      toast.success("User updated successfully!");
      setCurrentView("users");
    } catch (error) {
      toast.error("Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    const targetUser = mockUsers.find(u => u.id === userId);
    if (!targetUser) return;

    if (action === "suspended" || action === "activated") {
      setMockUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, status: action === "suspended" ? "suspended" : "active" }
          : u
      ));
      toast.success(`User ${action} successfully!`);
    } else if (action === "edit") {
      // Set up edit mode
      setEditingUser(targetUser);
      setEditUserForm({
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        grade: targetUser.grade || "",
        subjects: targetUser.subjects || [],
        password: "",
        confirmPassword: "",
      });
      setFormErrors({});
      setCurrentView("edit-user");
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4"
      >
        <Card className="border-0 bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{userStats.total}</div>
            <div className="text-xs text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-sky-50">
          <CardContent className="p-4 text-center">
            <GraduationCap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{userStats.teachers}</div>
            <div className="text-xs text-muted-foreground">Teachers</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{userStats.students}</div>
            <div className="text-xs text-muted-foreground">Students</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button
          className="h-16 flex-col gap-2 bg-gradient-to-br from-primary to-secondary"
          onClick={() => setCurrentView("add-user")}
        >
          <UserPlus className="w-6 h-6" />
          <span className="text-sm">Add User</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-16 flex-col gap-2"
          onClick={() => setCurrentView("users")}
        >
          <Users className="w-6 h-6" />
          <span className="text-sm">Manage Users</span>
        </Button>
      </motion.div>

      {/* Quick Actions Row 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button
          variant="outline"
          className="h-16 flex-col gap-2"
          onClick={() => toast.success("Bulk import feature coming soon!")}
        >
          <Upload className="w-6 h-6" />
          <span className="text-sm">Bulk Import</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-16 flex-col gap-2"
          onClick={() => toast.success("Export feature coming soon!")}
        >
          <Download className="w-6 h-6" />
          <span className="text-sm">Export Data</span>
        </Button>
      </motion.div>

      {/* Recent Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Users</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("users")}
          >
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {mockUsers.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{user.name}</h4>
                      <div className="text-xs text-muted-foreground">
                        {user.email} • {user.lastActive}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={`text-xs border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </Badge>
                      <Badge className={`text-xs border ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1">{user.status}</span>
                      </Badge>
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

  const renderUsers = () => (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-base">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={`text-xs border ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1 capitalize">{user.role}</span>
                        </Badge>
                        <Badge className={`text-xs border ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1 capitalize">{user.status}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-3">
                      Joined {new Date(user.joinDate).toLocaleDateString()} • Active {user.lastActive}
                    </div>
                    
                    {user.subjects && (
                      <div className="mb-3">
                        <div className="text-xs font-medium mb-1">Subjects:</div>
                        <div className="flex flex-wrap gap-1">
                          {user.subjects.map(subject => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {user.grade && (
                      <div className="mb-3">
                        <Badge variant="outline" className="text-xs">
                          {user.grade}
                        </Badge>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSelectedUser(user);
                          setCurrentView("details");
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction("edit", user.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={user.status === "active" ? "destructive" : "default"}
                        onClick={() => handleUserAction(user.status === "active" ? "suspended" : "activated", user.id)}
                      >
                        {user.status === "active" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-semibold mb-2">No users found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );

  const renderUserDetails = () => {
    if (!selectedUser) return null;

    return (
      <div className="space-y-6">
        {/* User Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={selectedUser.avatar} />
            <AvatarFallback className="text-2xl">
              {selectedUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
          <p className="text-muted-foreground">{selectedUser.email}</p>
          <div className="flex justify-center gap-2 mt-3">
            <Badge className={`border ${getRoleColor(selectedUser.role)}`}>
              {getRoleIcon(selectedUser.role)}
              <span className="ml-1 capitalize">{selectedUser.role}</span>
            </Badge>
            <Badge className={`border ${getStatusColor(selectedUser.status)}`}>
              {getStatusIcon(selectedUser.status)}
              <span className="ml-1 capitalize">{selectedUser.status}</span>
            </Badge>
          </div>
        </motion.div>

        {/* User Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Join Date:</span>
                <span>{new Date(selectedUser.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Active:</span>
                <span>{selectedUser.lastActive}</span>
              </div>
              {selectedUser.grade && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grade:</span>
                  <span>{selectedUser.grade}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academic Information */}
          {(selectedUser.subjects || selectedUser.classes) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedUser.subjects && (
                  <div>
                    <span className="text-muted-foreground text-sm">Subjects:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUser.subjects.map(subject => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedUser.classes && selectedUser.classes.length > 0 && (
                  <div>
                    <span className="text-muted-foreground text-sm">Classes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUser.classes.map(className => (
                        <Badge key={className} variant="outline" className="text-xs">
                          {className}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleUserAction("edit", selectedUser.id)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit User
            </Button>
            
            <Button
              className="w-full"
              variant={selectedUser.status === "active" ? "destructive" : "default"}
              onClick={() => {
                handleUserAction(selectedUser.status === "active" ? "suspended" : "activated", selectedUser.id);
                setSelectedUser(prev => prev ? { ...prev, status: prev.status === "active" ? "suspended" : "active" } : null);
              }}
            >
              {selectedUser.status === "active" ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Suspend User
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Activate User
                </>
              )}
            </Button>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => toast.success("Reset password email sent!")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Reset Password
            </Button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderAddUser = () => (
    <div className="space-y-6">
      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input
              placeholder="Enter full name"
              value={newUserForm.name}
              onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
              className={formErrors.name ? "border-destructive" : ""}
            />
            {formErrors.name && (
              <p className="text-sm text-destructive mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
              className={formErrors.email ? "border-destructive" : ""}
            />
            {formErrors.email && (
              <p className="text-sm text-destructive mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Select
              value={newUserForm.role}
              onValueChange={(value: "admin" | "teacher" | "student") => 
                setNewUserForm(prev => ({ 
                  ...prev, 
                  role: value,
                  grade: value === "student" ? prev.grade : "",
                  subjects: value === "teacher" ? prev.subjects : []
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Role-specific fields */}
        {newUserForm.role === "student" && (
          <div className="space-y-4">
            <h3 className="font-semibold">Student Information</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Grade Level</label>
              <Select
                value={newUserForm.grade}
                onValueChange={(value) => setNewUserForm(prev => ({ ...prev, grade: value }))}
              >
                <SelectTrigger className={formErrors.grade ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {availableGrades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.grade && (
                <p className="text-sm text-destructive mt-1">{formErrors.grade}</p>
              )}
            </div>
          </div>
        )}

        {newUserForm.role === "teacher" && (
          <div className="space-y-4">
            <h3 className="font-semibold">Teaching Information</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Subjects (Select multiple)</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                {availableSubjects.map(subject => (
                  <div key={subject} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={subject}
                      checked={newUserForm.subjects?.includes(subject) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewUserForm(prev => ({
                            ...prev,
                            subjects: [...(prev.subjects || []), subject]
                          }));
                        } else {
                          setNewUserForm(prev => ({
                            ...prev,
                            subjects: (prev.subjects || []).filter(s => s !== subject)
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <label htmlFor={subject} className="text-sm">{subject}</label>
                  </div>
                ))}
              </div>
              {formErrors.subjects && (
                <p className="text-sm text-destructive mt-1">{formErrors.subjects}</p>
              )}
            </div>
          </div>
        )}

        {/* Password fields */}
        <div className="space-y-4">
          <h3 className="font-semibold">Account Security</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              placeholder="Enter password"
              value={newUserForm.password}
              onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
              className={formErrors.password ? "border-destructive" : ""}
            />
            {formErrors.password && (
              <p className="text-sm text-destructive mt-1">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm password"
              value={newUserForm.confirmPassword}
              onChange={(e) => setNewUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={formErrors.confirmPassword ? "border-destructive" : ""}
            />
            {formErrors.confirmPassword && (
              <p className="text-sm text-destructive mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setCurrentView("overview");
              setNewUserForm({
                name: "",
                email: "",
                role: "student",
                grade: "",
                subjects: [],
                password: "",
                confirmPassword: "",
              });
              setFormErrors({});
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
            onClick={handleCreateUser}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create User
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );

  const renderEditUser = () => (
    <div className="space-y-6">
      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input
              placeholder="Enter full name"
              value={editUserForm.name}
              onChange={(e) => setEditUserForm(prev => ({ ...prev, name: e.target.value }))}
              className={formErrors.name ? "border-destructive" : ""}
            />
            {formErrors.name && (
              <p className="text-sm text-destructive mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={editUserForm.email}
              onChange={(e) => setEditUserForm(prev => ({ ...prev, email: e.target.value }))}
              className={formErrors.email ? "border-destructive" : ""}
            />
            {formErrors.email && (
              <p className="text-sm text-destructive mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Select
              value={editUserForm.role}
              onValueChange={(value: "admin" | "teacher" | "student") => 
                setEditUserForm(prev => ({ 
                  ...prev, 
                  role: value,
                  grade: value === "student" ? prev.grade : "",
                  subjects: value === "teacher" ? prev.subjects : []
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Role-specific fields */}
        {editUserForm.role === "student" && (
          <div className="space-y-4">
            <h3 className="font-semibold">Student Information</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Grade Level</label>
              <Select
                value={editUserForm.grade}
                onValueChange={(value) => setEditUserForm(prev => ({ ...prev, grade: value }))}
              >
                <SelectTrigger className={formErrors.grade ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {availableGrades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.grade && (
                <p className="text-sm text-destructive mt-1">{formErrors.grade}</p>
              )}
            </div>
          </div>
        )}

        {editUserForm.role === "teacher" && (
          <div className="space-y-4">
            <h3 className="font-semibold">Teaching Information</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Subjects (Select multiple)</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                {availableSubjects.map(subject => (
                  <div key={subject} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-${subject}`}
                      checked={editUserForm.subjects?.includes(subject) || false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditUserForm(prev => ({
                            ...prev,
                            subjects: [...(prev.subjects || []), subject]
                          }));
                        } else {
                          setEditUserForm(prev => ({
                            ...prev,
                            subjects: (prev.subjects || []).filter(s => s !== subject)
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <label htmlFor={`edit-${subject}`} className="text-sm">{subject}</label>
                  </div>
                ))}
              </div>
              {formErrors.subjects && (
                <p className="text-sm text-destructive mt-1">{formErrors.subjects}</p>
              )}
            </div>
          </div>
        )}

        {/* Password fields - Optional for edit */}
        <div className="space-y-4">
          <h3 className="font-semibold">Change Password (Optional)</h3>
          <p className="text-sm text-muted-foreground">Leave blank to keep current password</p>
          
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password (optional)"
              value={editUserForm.password}
              onChange={(e) => setEditUserForm(prev => ({ ...prev, password: e.target.value }))}
              className={formErrors.password ? "border-destructive" : ""}
            />
            {formErrors.password && (
              <p className="text-sm text-destructive mt-1">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={editUserForm.confirmPassword}
              onChange={(e) => setEditUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={formErrors.confirmPassword ? "border-destructive" : ""}
            />
            {formErrors.confirmPassword && (
              <p className="text-sm text-destructive mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              // Use the navigation context which handles Android back button properly
              const handled = goBack();
              if (!handled) {
                // Fallback
                setCurrentView("users");
                setEditingUser(null);
                setEditUserForm({
                  name: "",
                  email: "",
                  role: "student",
                  grade: "",
                  subjects: [],
                  password: "",
                  confirmPassword: "",
                });
                setFormErrors({});
              }
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
            onClick={handleUpdateUser}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Update User
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );

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
              onClick={() => {
                // Use the navigation context which handles Android back button properly
                const handled = goBack();
                if (!handled) {
                  // Fallback navigation
                  if (currentView === "overview") {
                    onPageChange("dashboard");
                  } else if (currentView === "add-user") {
                    setCurrentView("overview");
                    setFormErrors({});
                  } else if (currentView === "edit-user") {
                    setCurrentView("users");
                    setEditingUser(null);
                    setFormErrors({});
                  } else if (currentView === "details") {
                    setCurrentView("users");
                    setSelectedUser(null);
                  } else {
                    setCurrentView("overview");
                  }
                }
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {currentView === "overview" ? "User Management" :
                 currentView === "users" ? "All Users" : 
                 currentView === "add-user" ? "Add New User" : 
                 currentView === "edit-user" ? "Edit User" : "User Details"}
              </h1>
              <p className="text-sm text-muted-foreground">Manage school users and permissions</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
            {userStats.total} users
          </Badge>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 pb-24">
        <AnimatePresence mode="wait">
          {currentView === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderOverview()}
            </motion.div>
          )}
          
          {currentView === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderUsers()}
            </motion.div>
          )}
          
          {currentView === "add-user" && (
            <motion.div
              key="add-user"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderAddUser()}
            </motion.div>
          )}

          {currentView === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderUserDetails()}
            </motion.div>
          )}

          {currentView === "edit-user" && (
            <motion.div
              key="edit-user"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderEditUser()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};