import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
import { 
  Search, X, Clock, TrendingUp, BookOpen, Users, 
  Calendar, MessageSquare, Award, Bell, FileText,
  Filter, ArrowRight, Star, Hash
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface MobileSearchInterfaceProps {
  onPageChange: (page: string) => void;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: "page" | "person" | "content" | "assignment" | "announcement";
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: string;
  relevance?: number;
  timestamp?: string;
  avatar?: string;
}

interface SearchCategory {
  title: string;
  results: SearchResult[];
}

export const MobileSearchInterface: React.FC<MobileSearchInterfaceProps> = ({ 
  onPageChange, 
  onClose 
}) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatures();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchCategory[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Attendance Report",
    "Math Assignment",
    "Weekly Schedule"
  ]);
  const [trendingSearches] = useState<string[]>([
    "Exam Schedule",
    "Project Submission",
    "Grade Reports",
    "Parent Meeting"
  ]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        performSearch(searchQuery);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Mock search results based on user role and enabled features
    const allResults: SearchResult[] = [
      // Pages
      {
        id: "attendance-page",
        type: "page",
        title: "Attendance",
        subtitle: "View and manage attendance records",
        icon: <Clock className="w-4 h-4" />,
        action: "attendance",
        relevance: lowerQuery.includes("attendance") ? 1 : 0.3
      },
      {
        id: "grades-page",
        type: "page",
        title: "Grades",
        subtitle: "Student grades and assessments",
        icon: <Award className="w-4 h-4" />,
        action: "grades",
        relevance: lowerQuery.includes("grade") ? 1 : 0.3
      },
      {
        id: "calendar-page",
        type: "page",
        title: "Calendar",
        subtitle: "Events and schedule",
        icon: <Calendar className="w-4 h-4" />,
        action: "calendar",
        relevance: lowerQuery.includes("calendar") || lowerQuery.includes("schedule") ? 1 : 0.3
      },
      {
        id: "assignments-page",
        type: "page",
        title: "Assignments",
        subtitle: "View and submit assignments",
        icon: <BookOpen className="w-4 h-4" />,
        action: "assignments",
        relevance: lowerQuery.includes("assignment") || lowerQuery.includes("homework") ? 1 : 0.3
      },
      // Content
      {
        id: "math-assignment",
        type: "assignment",
        title: "Mathematics Assignment #3",
        subtitle: "Due tomorrow at 11:59 PM",
        icon: <FileText className="w-4 h-4" />,
        action: "assignments",
        relevance: lowerQuery.includes("math") || lowerQuery.includes("assignment") ? 1 : 0.2,
        timestamp: "2 hours ago"
      },
      {
        id: "exam-announcement",
        type: "announcement",
        title: "Mid-term Exam Schedule",
        subtitle: "Important updates about upcoming exams",
        icon: <Bell className="w-4 h-4" />,
        action: "announcements",
        relevance: lowerQuery.includes("exam") || lowerQuery.includes("schedule") ? 1 : 0.2,
        timestamp: "1 day ago"
      },
      // People (if user is teacher/admin)
      ...(user?.role !== "student" ? [
        {
          id: "student-john",
          type: "person" as const,
          title: "John Smith",
          subtitle: "Grade 10 Student",
          icon: <Users className="w-4 h-4" />,
          action: "user-profile",
          relevance: lowerQuery.includes("john") || lowerQuery.includes("smith") ? 1 : 0.1,
          avatar: "/api/placeholder/32/32"
        },
        {
          id: "teacher-jane",
          type: "person" as const,
          title: "Jane Doe",
          subtitle: "English Teacher",
          icon: <Users className="w-4 h-4" />,
          action: "user-profile",
          relevance: lowerQuery.includes("jane") || lowerQuery.includes("doe") ? 1 : 0.1,
          avatar: "/api/placeholder/32/32"
        }
      ] : [])
    ];

    // Filter results based on relevance and enabled features
    const filteredResults = allResults
      .filter(result => {
        // Check feature permissions
        if (result.action === "attendance" && !isFeatureEnabled("attendance")) return false;
        if (result.action === "grades" && !isFeatureEnabled("grades")) return false;
        if (result.action === "calendar" && !isFeatureEnabled("calendar")) return false;
        if (result.action === "assignments" && !isFeatureEnabled("assignments")) return false;
        if (result.action === "announcements" && !isFeatureEnabled("announcements")) return false;
        
        // Check relevance
        return result.relevance && result.relevance > 0.1;
      })
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
      .slice(0, 10);

    // Group results by type
    const categories: SearchCategory[] = [];
    
    const pages = filteredResults.filter(r => r.type === "page");
    if (pages.length > 0) {
      categories.push({ title: "Pages", results: pages });
    }
    
    const content = filteredResults.filter(r => r.type === "assignment" || r.type === "announcement");
    if (content.length > 0) {
      categories.push({ title: "Content", results: content });
    }
    
    const people = filteredResults.filter(r => r.type === "person");
    if (people.length > 0) {
      categories.push({ title: "People", results: people });
    }

    setSearchResults(categories);
  };

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    if (!recentSearches.includes(result.title)) {
      setRecentSearches(prev => [result.title, ...prev.slice(0, 4)]);
    }
    
    onPageChange(result.action);
    onClose();
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center p-4 border-b border-border/50 safe-area-top"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search everything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-12 bg-muted/50 border-0 rounded-2xl text-base"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full"
              onClick={clearSearch}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 px-4"
          onClick={onClose}
        >
          Cancel
        </Button>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-safe">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="searching"
              className="flex items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-muted-foreground">Searching...</p>
              </div>
            </motion.div>
          ) : searchQuery && searchResults.length > 0 ? (
            <motion.div
              key="results"
              className="p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {searchResults.map((category, categoryIndex) => (
                <div key={category.title} className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                    {category.title}
                  </h3>
                  <div className="space-y-2">
                    {category.results.map((result, resultIndex) => (
                      <motion.button
                        key={result.id}
                        className="w-full flex items-center p-3 rounded-xl hover:bg-muted/50 active:scale-98 transition-all"
                        onClick={() => handleResultClick(result)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.2, 
                          delay: categoryIndex * 0.1 + resultIndex * 0.05 
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          {result.type === "person" && result.avatar ? (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={result.avatar} />
                              <AvatarFallback>{result.title.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                              {result.icon}
                            </div>
                          )}
                          <div className="flex-1 text-left">
                            <div className="font-medium">{result.title}</div>
                            {result.subtitle && (
                              <div className="text-sm text-muted-foreground">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {result.timestamp && (
                            <span className="text-xs text-muted-foreground">
                              {result.timestamp}
                            </span>
                          )}
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : searchQuery ? (
            <motion.div
              key="no-results"
              className="flex items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching for something else
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              className="p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-muted-foreground px-2">
                      Recent Searches
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                      onClick={() => setRecentSearches([])}
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <motion.button
                        key={search}
                        className="w-full flex items-center p-3 rounded-xl hover:bg-muted/50 transition-all"
                        onClick={() => handleRecentSearchClick(search)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                      >
                        <Clock className="w-4 h-4 text-muted-foreground mr-3" />
                        <span className="font-medium">{search}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                  Trending
                </h3>
                <div className="space-y-2">
                  {trendingSearches.map((search, index) => (
                    <motion.button
                      key={search}
                      className="w-full flex items-center p-3 rounded-xl hover:bg-muted/50 transition-all"
                      onClick={() => handleRecentSearchClick(search)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <TrendingUp className="w-4 h-4 text-accent mr-3" />
                      <span className="font-medium">{search}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Trending
                      </Badge>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "Scan QR", icon: <Hash className="w-4 h-4" />, action: "scan" },
                    { title: "Voice Search", icon: <Search className="w-4 h-4" />, action: "voice" },
                    { title: "Favorites", icon: <Star className="w-4 h-4" />, action: "favorites" },
                    { title: "Filters", icon: <Filter className="w-4 h-4" />, action: "filters" }
                  ].map((action, index) => (
                    <motion.button
                      key={action.title}
                      className="flex flex-col items-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium">{action.title}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};