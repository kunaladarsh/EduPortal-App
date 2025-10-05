import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";

// Import centralized data service
import { getAllDocuments, Document as CentralDocument } from "../../services/mockData";

import {
  FileText,
  Search,
  Filter,
  Download,
  Share,
  Eye,
  Upload,
  FolderOpen,
  Star,
  Clock,
  Users,
  Grid3X3,
  List,
  ArrowUpDown,
  MoreHorizontal,
  FileImage,
  FileVideo,
  File,
  Calendar,
  User,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Copy,
  ArrowLeft,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "doc" | "image" | "video" | "other";
  size: string;
  uploadedBy: string;
  uploadDate: string;
  category: string;
  starred: boolean;
  shared: boolean;
  description?: string;
  downloadCount: number;
}

interface Folder {
  id: string;
  name: string;
  documentCount: number;
  lastModified: string;
  shared: boolean;
}

interface MobileDocumentsProps {
  onPageChange?: (page: string) => void;
}

// Use centralized data - no hardcoded arrays
const generateFolders = (documents: Document[]): Folder[] => {
  const folderCounts = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(folderCounts).map(([category, count], index) => ({
    id: `folder-${index}`,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    documentCount: count,
    lastModified: `${Math.floor(Math.random() * 7)} days ago`,
    shared: Math.random() > 0.5
  }));
};

// Remove all hardcoded documents - will use centralized data
const mockDocuments: Document[] = [];



const categories = ["All", "Assignments", "Lab Reports", "Presentations", "Lecture Notes", "Photos", "Video Lectures"];
const sortOptions = ["Name", "Date", "Size", "Downloads"];

export const MobileDocuments: React.FC<MobileDocumentsProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"overview" | "folders" | "documents" | "starred">("overview");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  // Centralized data state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load documents from centralized service
  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const centralDocs = await getAllDocuments();
      
      // Transform central documents to component format
      const transformedDocs: Document[] = centralDocs.map(doc => ({
        id: doc.id,
        name: doc.fileName,
        type: doc.fileName.endsWith('.pdf') ? 'pdf' : 'other',
        size: doc.fileSize,
        uploadedBy: doc.uploadedBy,
        uploadDate: doc.uploadedAt,
        category: doc.category,
        starred: Math.random() > 0.7, // Random starred status for demo
        shared: Math.random() > 0.5, // Random shared status for demo
        description: doc.description,
        downloadCount: doc.downloadCount
      }));
      
      setDocuments(transformedDocs);
      setFolders(generateFolders(transformedDocs));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    
    if (currentView === "starred") {
      return doc.starred && matchesSearch && matchesCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "doc":
        return <FileText className="h-6 w-6" />;
      case "image":
        return <FileImage className="h-6 w-6" />;
      case "video":
        return <FileVideo className="h-6 w-6" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "text-red-600 bg-red-50 border-red-200";
      case "doc":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "image":
        return "text-green-600 bg-green-50 border-green-200";
      case "video":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Overview
  if (currentView === "overview") {
    return (
      <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold mb-2">Documents</h1>
          <p className="text-muted-foreground">Access and manage your files</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4 text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-xl font-bold text-primary">{mockDocuments.length}</div>
              <div className="text-xs text-muted-foreground">Total Files</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardContent className="p-4 text-center">
              <FolderOpen className="h-6 w-6 mx-auto mb-2 text-secondary" />
              <div className="text-xl font-bold text-secondary">{mockFolders.length}</div>
              <div className="text-xs text-muted-foreground">Folders</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-accent/5 to-accent/10">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-accent" />
              <div className="text-xl font-bold text-accent">
                {mockDocuments.filter(doc => doc.starred).length}
              </div>
              <div className="text-xs text-muted-foreground">Starred</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-chart-4/5 to-chart-4/10">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-chart-4" />
              <div className="text-xl font-bold text-chart-4">
                {mockDocuments.filter(doc => doc.shared).length}
              </div>
              <div className="text-xs text-muted-foreground">Shared</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card 
            className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentView("documents")}
          >
            <CardContent className="p-4 text-center">
              <Grid3X3 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-semibold text-sm">Browse Files</div>
              <div className="text-xs text-muted-foreground">View all documents</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-br from-secondary/5 to-accent/5 cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <div className="font-semibold text-sm">Upload File</div>
              <div className="text-xs text-muted-foreground">Add new document</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {[
            { 
              key: "folders", 
              title: "Folders", 
              subtitle: `${mockFolders.length} folders`, 
              icon: FolderOpen,
              color: "primary"
            },
            { 
              key: "documents", 
              title: "All Documents", 
              subtitle: `${mockDocuments.length} files`, 
              icon: FileText,
              color: "secondary"
            },
            { 
              key: "starred", 
              title: "Starred", 
              subtitle: `${mockDocuments.filter(doc => doc.starred).length} starred files`, 
              icon: Star,
              color: "accent"
            }
          ].map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => setCurrentView(item.key as any)}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${item.color}/10`}>
                      <item.icon className={`h-6 w-6 text-${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Documents</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView("documents")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {mockDocuments.slice(0, 3).map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getFileColor(doc.type)}`}>
                        {getFileIcon(doc.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{formatDate(doc.uploadDate)}</span>
                        </div>
                      </div>
                      {doc.starred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
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

  // Folders View
  if (currentView === "folders") {
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
            onClick={() => setCurrentView("overview")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Folders</h1>
            <p className="text-sm text-muted-foreground">{mockFolders.length} folders</p>
          </div>
          <Button size="sm" className="rounded-full w-8 h-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Folders Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <AnimatePresence>
            {mockFolders.map((folder, index) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => {
                  setSelectedFolder(folder.id);
                  setCurrentView("documents");
                }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FolderOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{folder.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{folder.documentCount} files</span>
                          <span>•</span>
                          <span>{folder.lastModified}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {folder.shared && (
                          <Users className="h-4 w-4 text-muted-foreground" />
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // Documents/Starred View
  if (currentView === "documents" || currentView === "starred") {
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
            onClick={() => setCurrentView("overview")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">
              {currentView === "starred" ? "Starred Files" : "All Documents"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredDocuments.length} files
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="p-2"
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search documents..."
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
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <AnimatePresence>
            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getFileColor(document.type)} flex-shrink-0`}>
                        {getFileIcon(document.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm line-clamp-2 flex-1">{document.name}</h3>
                          <Button variant="ghost" size="sm" className="p-1 ml-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <User className="h-3 w-3" />
                          <span>{document.uploadedBy}</span>
                          <span>•</span>
                          <span>{document.size}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(document.uploadDate)}</span>
                          <span>•</span>
                          <Download className="h-3 w-3" />
                          <span>{document.downloadCount} downloads</span>
                        </div>

                        {document.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                            {document.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {document.category}
                            </Badge>
                            {document.shared && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                Shared
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1"
                            >
                              <Star className={`h-4 w-4 ${document.starred ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1">
                              <Share className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
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
        {filteredDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No Documents Found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {searchQuery ? "Try adjusting your search." : "No documents available in this category."}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  return null;
};