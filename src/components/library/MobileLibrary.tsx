import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  Star,
  Users,
  FileText,
  BookmarkPlus,
  TrendingUp,
  Calendar,
  ArrowRight,
  PlayCircle,
  Image,
  FileVideo,
  Headphones,
  Archive,
} from "lucide-react";
import { ImageWithFallback } from "../edu/ImageWithFallback";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  cover?: string;
  rating: number;
  pages: number;
  borrowed: boolean;
  dueDate?: string;
  format: "book" | "ebook" | "audiobook" | "video";
  description: string;
  availability: "available" | "borrowed" | "reserved";
  borrowedBy?: string;
}

interface MobileLibraryProps {
  onPageChange?: (page: string) => void;
}

const mockBooks: Book[] = [
  {
    id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Classic Literature",
    rating: 4.8,
    pages: 376,
    borrowed: true,
    dueDate: "2024-10-15",
    format: "book",
    description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
    availability: "borrowed",
    borrowedBy: "current-user"
  },
  {
    id: "2",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic Literature",
    rating: 4.5,
    pages: 180,
    borrowed: false,
    format: "ebook",
    description: "A classic American novel about the Jazz Age and the decline of the American Dream.",
    availability: "available"
  },
  {
    id: "3",
    title: "Introduction to Physics",
    author: "Dr. Sarah Johnson",
    category: "Science",
    rating: 4.2,
    pages: 520,
    borrowed: false,
    format: "book",
    description: "Comprehensive introduction to fundamental physics concepts with practical examples.",
    availability: "available"
  },
  {
    id: "4",
    title: "Digital Marketing Essentials",
    author: "Marketing Institute",
    category: "Business",
    rating: 4.6,
    pages: 0,
    borrowed: false,
    format: "video",
    description: "Complete video course on modern digital marketing strategies and tools.",
    availability: "available"
  },
  {
    id: "5",
    title: "Mindfulness Meditation",
    author: "Wellness Academy",
    category: "Health & Wellness",
    rating: 4.7,
    pages: 0,
    borrowed: false,
    format: "audiobook",
    description: "Guided meditation sessions for stress relief and mental clarity.",
    availability: "available"
  },
  {
    id: "6",
    title: "Advanced Mathematics",
    author: "Prof. Michael Chen",
    category: "Mathematics",
    rating: 4.3,
    pages: 780,
    borrowed: false,
    format: "book",
    description: "Advanced mathematical concepts for university-level students.",
    availability: "reserved"
  }
];

const categories = ["All", "Classic Literature", "Science", "Mathematics", "Business", "Health & Wellness"];
const formats = ["All", "book", "ebook", "audiobook", "video"];

export const MobileLibrary: React.FC<MobileLibraryProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [viewMode, setViewMode] = useState<"browse" | "borrowed" | "search">("browse");

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    const matchesFormat = selectedFormat === "All" || book.format === selectedFormat;
    
    if (viewMode === "borrowed") {
      return book.borrowed && book.borrowedBy === "current-user";
    }
    
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const borrowedBooks = mockBooks.filter(book => book.borrowed && book.borrowedBy === "current-user");

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "book": return <BookOpen className="h-4 w-4" />;
      case "ebook": return <FileText className="h-4 w-4" />;
      case "audiobook": return <Headphones className="h-4 w-4" />;
      case "video": return <FileVideo className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case "book": return "bg-blue-50 text-blue-600 border-blue-200";
      case "ebook": return "bg-green-50 text-green-600 border-green-200";
      case "audiobook": return "bg-purple-50 text-purple-600 border-purple-200";
      case "video": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available": return "bg-green-50 text-green-600 border-green-200";
      case "borrowed": return "bg-red-50 text-red-600 border-red-200";
      case "reserved": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // Browse Mode
  if (viewMode === "browse") {
    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold mb-2">Digital Library</h1>
          <p className="text-muted-foreground">Discover and borrow educational resources</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-xl font-bold text-primary">{mockBooks.length}</div>
              <div className="text-xs text-muted-foreground">Total Books</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-secondary" />
              <div className="text-xl font-bold text-secondary">{borrowedBooks.length}</div>
              <div className="text-xs text-muted-foreground">Borrowed</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-accent/5 to-accent/10">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-accent" />
              <div className="text-xl font-bold text-accent">
                {mockBooks.filter(b => b.availability === "available").length}
              </div>
              <div className="text-xs text-muted-foreground">Available</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search books, authors..."
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
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {/* Category Filter */}
          <div>
            <div className="text-sm font-medium mb-2">Category</div>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Format Filter */}
          <div>
            <div className="text-sm font-medium mb-2">Format</div>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {formats.map((format) => (
                <Button
                  key={format}
                  variant={selectedFormat === format ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFormat(format)}
                  className="whitespace-nowrap flex-shrink-0 capitalize"
                >
                  {format === "All" ? "All" : (
                    <div className="flex items-center gap-1">
                      {getFormatIcon(format)}
                      {format}
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* View Mode Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2"
        >
          <Button
            variant={viewMode === "browse" ? "default" : "outline"}
            onClick={() => setViewMode("browse")}
            className="flex-1"
          >
            Browse All
          </Button>
          <Button
            variant={viewMode === "borrowed" ? "default" : "outline"}
            onClick={() => setViewMode("borrowed")}
            className="flex-1"
          >
            My Books ({borrowedBooks.length})
          </Button>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {/* Book Cover */}
                      <div className="w-16 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {book.cover ? (
                          <ImageWithFallback
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          getFormatIcon(book.format)
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
                            <p className="text-xs text-muted-foreground mb-1">{book.author}</p>
                            <div className="flex items-center gap-1 mb-2">
                              {renderStars(book.rating)}
                              <span className="text-xs text-muted-foreground ml-1">
                                {book.rating}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge className={`text-xs border ${getFormatColor(book.format)}`}>
                            {getFormatIcon(book.format)}
                            <span className="ml-1 capitalize">{book.format}</span>
                          </Badge>
                          <Badge className={`text-xs border ${getAvailabilityColor(book.availability)}`}>
                            {book.availability === "available" && <Eye className="h-3 w-3 mr-1" />}
                            {book.availability === "borrowed" && <Clock className="h-3 w-3 mr-1" />}
                            {book.availability === "reserved" && <BookmarkPlus className="h-3 w-3 mr-1" />}
                            {book.availability}
                          </Badge>
                        </div>

                        {/* Action Button */}
                        <div className="flex gap-2">
                          {book.availability === "available" && (
                            <Button size="sm" className="flex-1 h-8 text-xs">
                              <Download className="h-3 w-3 mr-1" />
                              Borrow
                            </Button>
                          )}
                          {book.borrowed && book.borrowedBy === "current-user" && (
                            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Read
                            </Button>
                          )}
                          {book.availability === "reserved" && (
                            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" disabled>
                              Reserved
                            </Button>
                          )}
                        </div>

                        {/* Due Date for borrowed books */}
                        {book.borrowed && book.borrowedBy === "current-user" && book.dueDate && (
                          <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                            <div className="flex items-center gap-1 text-yellow-600">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(book.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {book.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No Books Found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedFormat("All");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  // Borrowed Books Mode
  if (viewMode === "borrowed") {
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
            onClick={() => setViewMode("browse")}
            className="p-2"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">My Borrowed Books</h1>
            <p className="text-sm text-muted-foreground">{borrowedBooks.length} books</p>
          </div>
        </motion.div>

        {/* Borrowed Books List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {borrowedBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {/* Book Cover */}
                      <div className="w-16 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getFormatIcon(book.format)}
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                        
                        {/* Due Date */}
                        {book.dueDate && (
                          <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                            <div className="flex items-center gap-1 text-yellow-600">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(book.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 h-8 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            {book.format === "audiobook" ? "Listen" : 
                             book.format === "video" ? "Watch" : "Read"}
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 text-xs">
                            Return
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {borrowedBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No Borrowed Books</h3>
            <p className="text-muted-foreground text-sm mb-4">
              You haven't borrowed any books yet. Browse the library to get started.
            </p>
            <Button onClick={() => setViewMode("browse")}>
              Browse Library
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  return null;
};