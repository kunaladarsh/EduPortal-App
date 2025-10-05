import React, { useState, useEffect } from "react";
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
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ImageWithFallback } from "../edu/ImageWithFallback";
import { MobilePageContent } from "../shared/MobilePageContent";
import { toast } from "sonner@2.0.3";

// Use centralized library hook
import { useLibrary } from "../../hooks/useSchoolData";

interface MobileLibraryProps {
  onPageChange?: (page: string) => void;
  onBack?: () => void;
}

export const MobileLibraryWithMockData: React.FC<MobileLibraryProps> = ({
  onPageChange,
  onBack,
}) => {
  const { user } = useAuth();
  const { books, loading, error, refetch, searchBooks, borrowBook, returnBook } = useLibrary();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookDetails, setShowBookDetails] = useState(false);

  // Get unique categories from books
  const categories = Array.from(new Set(books.map(book => book.category)));

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const results = await searchBooks(searchQuery, selectedCategory === "all" ? undefined : selectedCategory);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle borrow book
  const handleBorrowBook = async (bookId: string) => {
    if (!user) {
      toast.error("Please log in to borrow books");
      return;
    }

    try {
      await borrowBook(bookId, user.id);
      toast.success("Book borrowed successfully!");
      refetch(); // Refresh the books list
    } catch (err) {
      console.error("Borrow failed:", err);
      toast.error("Failed to borrow book. Please try again.");
    }
  };

  // Handle return book
  const handleReturnBook = async (bookId: string) => {
    try {
      await returnBook(bookId);
      toast.success("Book returned successfully!");
      refetch(); // Refresh the books list
    } catch (err) {
      console.error("Return failed:", err);
      toast.error("Failed to return book. Please try again.");
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'ebook': return <FileText className="w-4 h-4" />;
      case 'audiobook': return <Headphones className="w-4 h-4" />;
      case 'video': return <FileVideo className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getStatusColor = (available: boolean, borrowedBy?: string) => {
    if (borrowedBy === user?.id) return 'bg-blue-500';
    if (!available) return 'bg-red-500';
    return 'bg-green-500';
  };

  const getStatusText = (available: boolean, borrowedBy?: string) => {
    if (borrowedBy === user?.id) return 'Your Book';
    if (!available) return 'Borrowed';
    return 'Available';
  };

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
          <h3 className="text-lg font-semibold mb-2">Loading Library</h3>
          <p className="text-muted-foreground">Fetching available books...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <MobilePageContent
      title="Library"
      onBack={onBack}
      className="pb-20"
    >
      {/* Error Message */}
      {error && (
        <motion.div
          className="mx-4 mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Refresh
          </Button>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50 p-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              size="sm"
            >
              {isSearching ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="whitespace-nowrap"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{books.length}</p>
                <p className="text-sm text-muted-foreground">Total Books</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {books.filter(b => b.available).length}
                </p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Borrowed Books Section */}
      {user && (
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Your Borrowed Books
          </h3>
          <div className="space-y-3">
            {books
              .filter(book => book.borrowedBy === user.id)
              .map((book) => (
                <Card key={book.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                        {getFormatIcon('book')}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{book.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Due: {book.dueDate || 'N/A'}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleReturnBook(book.id)}
                      >
                        Return
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            
            {books.filter(book => book.borrowedBy === user.id).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No books currently borrowed</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Books Grid */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {searchQuery ? `Search Results (${filteredBooks.length})` : 'All Books'}
          </h3>
          <Badge variant="outline">
            {filteredBooks.length} books
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Book Cover/Icon */}
                      <div className="w-16 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        {book.coverImage ? (
                          <ImageWithFallback
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          getFormatIcon('book')
                        )}
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-base line-clamp-2 mb-1">
                              {book.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              by {book.author}
                            </p>
                          </div>
                          
                          <Badge 
                            className={`${getStatusColor(book.available, book.borrowedBy)} text-white border-none ml-2`}
                          >
                            {getStatusText(book.available, book.borrowedBy)}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {book.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{book.category}</span>
                          </div>
                          {book.isbn && (
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>ISBN: {book.isbn}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {book.borrowedBy === user?.id ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReturnBook(book.id)}
                              className="flex-1"
                            >
                              <ArrowRight className="w-4 h-4 mr-2" />
                              Return Book
                            </Button>
                          ) : book.available ? (
                            <Button
                              size="sm"
                              onClick={() => handleBorrowBook(book.id)}
                              className="flex-1"
                            >
                              <BookmarkPlus className="w-4 h-4 mr-2" />
                              Borrow
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Not Available
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBook(book);
                              setShowBookDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredBooks.length === 0 && !loading && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Books Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "No books match your search criteria. Try different keywords."
                  : "No books available in the library yet."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Book Details Modal */}
      <AnimatePresence>
        {showBookDetails && selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBookDetails(false)}
          >
            <motion.div
              className="w-full bg-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Book Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBookDetails(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-24 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    {selectedBook.coverImage ? (
                      <ImageWithFallback
                        src={selectedBook.coverImage}
                        alt={selectedBook.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      getFormatIcon('book')
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{selectedBook.title}</h3>
                    <p className="text-muted-foreground mb-2">by {selectedBook.author}</p>
                    <Badge className={`${getStatusColor(selectedBook.available, selectedBook.borrowedBy)} text-white border-none`}>
                      {getStatusText(selectedBook.available, selectedBook.borrowedBy)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedBook.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-muted-foreground">{selectedBook.category}</p>
                  </div>
                  {selectedBook.isbn && (
                    <div>
                      <span className="font-medium">ISBN:</span>
                      <p className="text-muted-foreground">{selectedBook.isbn}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  {selectedBook.borrowedBy === user?.id ? (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handleReturnBook(selectedBook.id);
                        setShowBookDetails(false);
                      }}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Return Book
                    </Button>
                  ) : selectedBook.available ? (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handleBorrowBook(selectedBook.id);
                        setShowBookDetails(false);
                      }}
                    >
                      <BookmarkPlus className="w-4 h-4 mr-2" />
                      Borrow Book
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      variant="outline"
                      disabled
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Not Available
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowBookDetails(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobilePageContent>
  );
};