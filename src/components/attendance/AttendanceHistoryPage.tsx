import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceHistoryPageProps {
  onBack: () => void;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  className: string;
  subject: string;
  teacher: string;
  time: string;
  note?: string;
}

export const AttendanceHistoryPage: React.FC<AttendanceHistoryPageProps> = ({
  onBack,
}) => {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const itemsPerPage = 10;

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockRecords: AttendanceRecord[] = [
      {
        id: '1',
        studentId: 'st001',
        studentName: 'Alice Johnson',
        date: '2024-01-15',
        status: 'present',
        className: 'Mathematics 101',
        subject: 'Advanced Calculus',
        teacher: 'Dr. Sarah Johnson',
        time: '09:00 AM',
      },
      {
        id: '2',
        studentId: 'st002',
        studentName: 'Bob Smith',
        date: '2024-01-15',
        status: 'late',
        className: 'Mathematics 101',
        subject: 'Advanced Calculus',
        teacher: 'Dr. Sarah Johnson',
        time: '09:00 AM',
        note: 'Arrived 10 minutes late',
      },
      {
        id: '3',
        studentId: 'st003',
        studentName: 'Carol Williams',
        date: '2024-01-15',
        status: 'absent',
        className: 'Physics 201',
        subject: 'Mechanics',
        teacher: 'Prof. Mike Chen',
        time: '11:00 AM',
        note: 'Medical emergency',
      },
      {
        id: '4',
        studentId: 'st004',
        studentName: 'David Brown',
        date: '2024-01-14',
        status: 'present',
        className: 'Chemistry 301',
        subject: 'Organic Chemistry',
        teacher: 'Dr. Lisa Wang',
        time: '02:00 PM',
      },
      {
        id: '5',
        studentId: 'st005',
        studentName: 'Eva Davis',
        date: '2024-01-14',
        status: 'excused',
        className: 'Biology 102',
        subject: 'Cell Biology',
        teacher: 'Dr. John Miller',
        time: '10:00 AM',
        note: 'Approved absence for family event',
      },
      // Add more mock records for pagination demo
      ...Array.from({ length: 25 }, (_, i) => ({
        id: `${i + 6}`,
        studentId: `st${String(i + 6).padStart(3, '0')}`,
        studentName: `Student ${i + 6}`,
        date: new Date(2024, 0, 13 - (i % 7)).toISOString().split('T')[0],
        status: ['present', 'absent', 'late', 'excused'][i % 4] as any,
        className: ['Mathematics 101', 'Physics 201', 'Chemistry 301', 'Biology 102'][i % 4],
        subject: ['Advanced Calculus', 'Mechanics', 'Organic Chemistry', 'Cell Biology'][i % 4],
        teacher: ['Dr. Sarah Johnson', 'Prof. Mike Chen', 'Dr. Lisa Wang', 'Dr. John Miller'][i % 4],
        time: ['09:00 AM', '11:00 AM', '02:00 PM', '10:00 AM'][i % 4],
      })),
    ];
    setRecords(mockRecords);
  }, []);

  // Filter records based on search and filters
  useEffect(() => {
    let filtered = records;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(record =>
        record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(record => record.date === selectedDate);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [records, searchQuery, selectedStatus, selectedDate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'excused':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'absent':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'late':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'excused':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const csvContent = [
        ['Name', 'Date', 'Status', 'Class', 'Subject', 'Teacher', 'Time', 'Note'],
        ...filteredRecords.map(record => [
          record.studentName,
          record.date,
          record.status,
          record.className,
          record.subject,
          record.teacher,
          record.time,
          record.note || '',
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-history-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Attendance history exported to CSV');
    } catch (error) {
      toast.error('Failed to export attendance history');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Attendance history exported to PDF');
    } catch (error) {
      toast.error('Failed to export attendance history');
    } finally {
      setIsExporting(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'excused', label: 'Excused' },
  ];

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Attendance History</h1>
              <p className="text-sm text-muted-foreground">
                View and export attendance records
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, class, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="Filter by date"
          />
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-card via-card/95 to-primary/5 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{filteredRecords.length}</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {filteredRecords.filter(r => r.status === 'present').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Present</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {filteredRecords.filter(r => r.status === 'absent').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Absent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {filteredRecords.filter(r => r.status === 'late').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Late</p>
                </div>
              </div>
              
              {filteredRecords.length > 0 && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-card via-card/95 to-card/90 border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {currentRecords.map((record, index) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-border/50 hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={record.studentAvatar} />
                              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-xs">
                                {record.studentName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{record.studentName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(record.status)} border`}>
                            {getStatusIcon(record.status)}
                            <span className="ml-1 capitalize">{record.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{record.className}</TableCell>
                        <TableCell className="text-muted-foreground">{record.subject}</TableCell>
                        <TableCell className="text-muted-foreground">{record.teacher}</TableCell>
                        <TableCell>{record.time}</TableCell>
                        <TableCell>
                          {record.note ? (
                            <span className="text-sm text-muted-foreground">{record.note}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground/50">—</span>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} results
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-2">...</span>
                  <Button
                    variant={currentPage === totalPages ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 p-0"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};