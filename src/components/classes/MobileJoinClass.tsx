import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  ArrowLeft, Search, Users, BookOpen,
  UserPlus, Hash, Globe, Clock,
  Star, MapPin, Calendar
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { toast } from "sonner";

interface MobileJoinClassProps {
  onBack: () => void;
  onClassJoined: (classData: any) => void;
}

export const MobileJoinClass: React.FC<MobileJoinClassProps> = ({ 
  onBack, 
  onClassJoined 
}) => {
  const { user } = useAuth();
  const [searchCode, setSearchCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mock available classes for discovery
  const availableClasses = [
    {
      id: "discover1",
      name: "Introduction to Biology",
      subject: "Biology",
      teacher: "Dr. Sarah Wilson",
      description: "Explore the fundamentals of life sciences",
      students: 45,
      maxStudents: 50,
      color: "#10B981",
      rating: 4.8,
      schedule: "Tue, Thu - 10:00 AM",
      room: "Lab 101",
      code: "BIO101",
      isPublic: true,
      assignments: 8,
      announcements: 2
    },
    {
      id: "discover2",
      name: "Digital Art Fundamentals",
      subject: "Art",
      teacher: "Prof. Michael Chen",
      description: "Learn digital art techniques and design principles",
      students: 28,
      maxStudents: 30,
      color: "#FB7185",
      rating: 4.9,
      schedule: "Mon, Wed - 2:00 PM",
      room: "Art Studio",
      code: "ART201",
      isPublic: true,
      assignments: 5,
      announcements: 1
    },
    {
      id: "discover3",
      name: "Python Programming",
      subject: "Computer Science",
      teacher: "Dr. Alex Kumar",
      description: "Master Python programming from basics to advanced",
      students: 67,
      maxStudents: 75,
      color: "#0EA5E9",
      rating: 4.7,
      schedule: "Mon, Wed, Fri - 11:00 AM",
      room: "Computer Lab",
      code: "CS101",
      isPublic: true,
      assignments: 12,
      announcements: 3
    }
  ];

  const handleSearch = async (code: string) => {
    if (!code.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API search
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results = availableClasses.filter(cls => 
        cls.code.toLowerCase().includes(code.toLowerCase()) ||
        cls.name.toLowerCase().includes(code.toLowerCase()) ||
        cls.subject.toLowerCase().includes(code.toLowerCase())
      );
      
      setSearchResults(results);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinClass = async (classData: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const joinedClass = {
        ...classData,
        role: "student",
        grade: undefined,
        lastActivity: "Just joined"
      };

      onClassJoined(joinedClass);
    } catch (error) {
      toast.error("Failed to join class");
    } finally {
      setIsLoading(false);
    }
  };

  const renderClassCard = (cls: any, index: number) => (
    <motion.div
      key={cls.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="border-0 shadow-sm">
        <div 
          className="h-3 w-full rounded-t-lg"
          style={{ backgroundColor: cls.color }}
        />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base mb-1">{cls.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{cls.subject}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {cls.code}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3 mt-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {cls.teacher.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{cls.teacher}</p>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-muted-foreground">{cls.rating}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {cls.description}
          </p>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="font-semibold text-sm">{cls.students}</div>
              <div className="text-xs text-muted-foreground">Students</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="font-semibold text-sm">{cls.assignments}</div>
              <div className="text-xs text-muted-foreground">Assignments</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="font-semibold text-sm">{cls.announcements}</div>
              <div className="text-xs text-muted-foreground">Updates</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              {cls.schedule}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 mr-1" />
              {cls.room}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-xs text-muted-foreground">
              {cls.students}/{cls.maxStudents} enrolled
            </div>
            <Button
              size="sm"
              onClick={() => handleJoinClass(cls)}
              disabled={isLoading || cls.students >= cls.maxStudents}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              Join
            </Button>
          </div>

          {cls.students >= cls.maxStudents && (
            <Badge variant="destructive" className="w-full justify-center">
              Class Full
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
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
            <h1 className="text-lg font-semibold">Join Class</h1>
            <p className="text-sm text-muted-foreground">Find and join classes</p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Join with Class Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Code or Name</label>
                <div className="flex gap-2">
                  <Input
                    value={searchCode}
                    onChange={(e) => {
                      setSearchCode(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Enter class code (e.g., MATH101)"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleSearch(searchCode)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Clock className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter a class code or search by class name
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Results ({searchResults.length})
              </h3>
              {searchResults.map((cls, index) => renderClassCard(cls, index))}
            </div>
          </motion.div>
        )}

        {/* Discover Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: searchResults.length > 0 ? 0.2 : 0.1 }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Discover Classes
              </h3>
              <Badge variant="outline" className="text-xs">
                {availableClasses.length} available
              </Badge>
            </div>
            
            <div className="space-y-3">
              {availableClasses.map((cls, index) => renderClassCard(cls, index))}
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {searchCode && searchResults.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No classes found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No classes match your search. Try a different code or browse available classes above.
            </p>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-0 bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Need Help?
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ask your teacher for the class code</li>
                <li>• Browse public classes in the discover section</li>
                <li>• Class codes are usually 6 characters (e.g., MATH01)</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom spacing for mobile */}
        <div className="h-20" />
      </div>
    </div>
  );
};