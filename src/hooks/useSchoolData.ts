import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApiData, useCrudOperations, useListData } from './useApiData';
import {
  // Dashboard
  getDashboardStats,
  getStudentDashboard,
  getTeacherDashboard,
  
  // Classes
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  
  // Assignments
  getAllAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  
  // Attendance
  markAttendance,
  getAttendanceByDateRange,
  getAttendanceStatistics,
  
  // Grades
  createGrade,
  updateGrade,
  deleteGrade,
  getGradeAnalytics,
  
  // Messages
  getAllMessages,
  sendMessage,
  markMessageAsRead,
  deleteMessage,
  
  // Events
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByDateRange,
  
  // Books
  getAllBooks,
  searchBooks,
  borrowBook,
  returnBook,
  
  // Wallet
  getWalletBalance,
  getWalletTransactions,
  addWalletTransaction,
  
  // Services
  getAllServiceRequests,
  createServiceRequest,
  updateServiceRequest,
  
  // Reports
  getAllReports,
  generateReport,
  
  // Announcements
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  
  // Notifications
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  
  // Types
  Assignment,
  Class,
  Message,
  Event,
  Book,
  WalletTransaction,
  ServiceRequest,
  Report,
  Announcement,
  Notification,
} from '../services/mockData';

// Dashboard Hooks
export function useDashboardData() {
  const { user } = useAuth();
  
  return useApiData(async () => {
    if (!user) throw new Error('User not authenticated');
    
    switch (user.role) {
      case 'student':
        return await getStudentDashboard(user.id);
      case 'teacher':
        return await getTeacherDashboard(user.id);
      case 'admin':
        return await getDashboardStats(user.role, user.id);
      default:
        return await getDashboardStats('student');
    }
  }, [user?.id, user?.role]);
}

// Classes Hooks
export function useClasses() {
  return useCrudOperations<Class>(
    getAllClasses,
    createClass,
    updateClass,
    deleteClass
  );
}

export function useClassesWithSearch() {
  const { items, loading, error, refetch } = useClasses();
  
  const searchAndFilter = useListData(
    items,
    (item, query) => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.subject.toLowerCase().includes(query.toLowerCase()) ||
      item.teacherName?.toLowerCase().includes(query.toLowerCase()),
    (item, filters) => {
      if (filters.subject && item.subject !== filters.subject) return false;
      if (filters.grade && item.grade !== filters.grade) return false;
      if (filters.teacher && item.teacherId !== filters.teacher) return false;
      return true;
    },
    (a, b) => a.name.localeCompare(b.name)
  );

  return {
    ...searchAndFilter,
    loading,
    error,
    refetch,
  };
}

// Assignments Hooks
export function useAssignments(classId?: string) {
  const { user } = useAuth();
  
  const fetchAssignments = useCallback(
    () => getAllAssignments(classId),
    [classId]
  );
  
  return useCrudOperations<Assignment>(
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment
  );
}

export function useAssignmentsWithSearch(classId?: string) {
  const { items, loading, error, refetch, create, update, remove } = useAssignments(classId);
  
  const searchAndFilter = useListData(
    items || [],
    (item, query) => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()),
    (item, filters) => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.dueDate && item.dueDate !== filters.dueDate) return false;
      return true;
    },
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    ...searchAndFilter,
    filteredItems: searchAndFilter.allItems || [],
    loading,
    error,
    refetch,
    create,
    update,
    remove,
  };
}

// Messages Hooks
export function useMessages() {
  const { user } = useAuth();
  
  return useApiData(
    () => user ? getAllMessages(user.id) : Promise.resolve([]),
    [user?.id]
  );
}

export function useMessaging() {
  const { user } = useAuth();
  const { data: messages, loading, error, refetch } = useMessages();

  const sendNewMessage = async (messageData: Partial<Message>) => {
    if (!user) throw new Error('User not authenticated');
    
    const result = await sendMessage({
      ...messageData,
      senderId: user.id,
      senderName: user.name,
    });
    
    refetch(); // Refresh messages after sending
    return result;
  };

  const markAsRead = async (messageId: string) => {
    await markMessageAsRead(messageId);
    refetch(); // Refresh messages after marking as read
  };

  const deleteMsg = async (messageId: string) => {
    await deleteMessage(messageId);
    refetch(); // Refresh messages after deleting
  };

  return {
    messages: messages || [],
    loading,
    error,
    refetch,
    sendMessage: sendNewMessage,
    markAsRead,
    deleteMessage: deleteMsg,
  };
}

// Events/Calendar Hooks
export function useEvents() {
  return useCrudOperations<Event>(
    () => getEventsByDateRange(
      new Date().toISOString().split('T')[0],
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    ),
    createEvent,
    updateEvent,
    deleteEvent
  );
}

export function useEventsWithSearch() {
  const { items, loading, error, refetch, create, update, remove } = useEvents();
  
  const searchAndFilter = useListData(
    items,
    (item, query) => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()),
    (item, filters) => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.date && item.date !== filters.date) return false;
      if (filters.classId && item.classId !== filters.classId) return false;
      return true;
    },
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return {
    ...searchAndFilter,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
  };
}

// Library Hooks
export function useLibrary() {
  const { data: books, loading, error, refetch } = useApiData(getAllBooks);

  const searchBooksWithQuery = async (query: string, category?: string) => {
    return await searchBooks(query, category);
  };

  const borrowBookById = async (bookId: string, userId: string) => {
    const result = await borrowBook(bookId, userId);
    refetch(); // Refresh books after borrowing
    return result;
  };

  const returnBookById = async (bookId: string) => {
    const result = await returnBook(bookId);
    refetch(); // Refresh books after returning
    return result;
  };

  return {
    books: books || [],
    loading,
    error,
    refetch,
    searchBooks: searchBooksWithQuery,
    borrowBook: borrowBookById,
    returnBook: returnBookById,
  };
}

// Wallet Hooks
export function useWallet() {
  const { user } = useAuth();
  const [balance, setBalance] = useState({ balance: 1250.50, currency: 'USD' });
  const [transactions, setTransactions] = useState([
    {
      id: 'tx-1',
      userId: user?.id || '1',
      type: 'credit' as const,
      amount: 50.00,
      description: 'Assignment completed',
      category: 'academic',
      timestamp: new Date().toISOString(),
      status: 'completed' as const
    },
    {
      id: 'tx-2',
      userId: user?.id || '1',
      type: 'debit' as const,
      amount: 25.00,
      description: 'Library book rental',
      category: 'fees',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed' as const
    }
  ]);
  const [loading, setLoading] = useState(false);

  const addTransaction = useCallback(async (transactionData: Partial<WalletTransaction>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await addWalletTransaction({
        ...transactionData,
        userId: user.id,
      });
      
      // Update local state
      setTransactions(prev => [result, ...prev]);
      setBalance(prev => ({
        ...prev,
        balance: prev.balance + (result.type === 'credit' ? result.amount : -result.amount)
      }));
      
      return result;
    } catch (err) {
      throw err;
    }
  }, [user]);

  const refetch = useCallback(() => {
    setLoading(false);
  }, []);

  return {
    balance: balance?.balance || 0,
    currency: balance?.currency || 'USD',
    transactions: transactions || [],
    loading,
    addTransaction,
    refetch,
  };
}

// Service Requests Hooks
export function useServiceRequests() {
  const { user } = useAuth();
  
  return useCrudOperations<ServiceRequest>(
    () => user ? getAllServiceRequests(user.id) : Promise.resolve([]),
    createServiceRequest,
    updateServiceRequest
  );
}

// Reports Hooks
export function useReports(type?: string) {
  const { data: reports, loading, error, refetch } = useApiData(
    () => getAllReports(type),
    [type]
  );

  const generateNewReport = async (reportData: Partial<Report>) => {
    const result = await generateReport(reportData);
    refetch(); // Refresh reports after generating
    return result;
  };

  return {
    reports: reports || [],
    loading,
    error,
    refetch,
    generateReport: generateNewReport,
  };
}

// Announcements Hooks
export function useAnnouncements() {
  return useCrudOperations<Announcement>(
    () => Promise.resolve([]), // This would be getAllAnnouncements() in real implementation
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  );
}

// Notifications Hooks
export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Assignment Posted',
      message: 'Mathematics: Complete Chapter 5 exercises',
      type: 'info' as const,
      read: false,
      createdAt: new Date().toISOString(),
      userId: user?.id || '1'
    },
    {
      id: '2', 
      title: 'Grade Updated',
      message: 'Your Physics quiz grade has been updated',
      type: 'info' as const,
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      userId: user?.id || '1'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    // Simulate refetch
    setLoading(false);
  }, []);

  const createNewNotification = useCallback(async (notificationData: Partial<Notification>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await createNotification({
        ...notificationData,
        userId: user.id,
      });
      refetch();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create notification');
      throw err;
    }
  }, [user, refetch]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read');
      throw err;
    }
  }, [user]);

  return {
    notifications: notifications || [],
    loading,
    error,
    refetch,
    createNotification: createNewNotification,
    markAsRead,
    markAllAsRead,
  };
}

// Attendance Hooks
export function useAttendance() {
  const markStudentAttendance = async (
    classId: string,
    studentId: string,
    status: 'present' | 'absent' | 'late',
    date?: string
  ) => {
    return await markAttendance(classId, studentId, status, date);
  };

  const getAttendanceForDateRange = async (
    classId: string,
    startDate: string,
    endDate: string
  ) => {
    return await getAttendanceByDateRange(classId, startDate, endDate);
  };

  const getClassAttendanceStats = async (classId: string, period: string) => {
    return await getAttendanceStatistics(classId, period);
  };

  return {
    markAttendance: markStudentAttendance,
    getAttendanceByDateRange: getAttendanceForDateRange,
    getAttendanceStatistics: getClassAttendanceStats,
  };
}

// Grades Hooks
export function useGrades() {
  const createNewGrade = async (gradeData: Partial<any>) => {
    return await createGrade(gradeData);
  };

  const updateExistingGrade = async (gradeId: string, updates: Partial<any>) => {
    return await updateGrade(gradeId, updates);
  };

  const deleteExistingGrade = async (gradeId: string) => {
    return await deleteGrade(gradeId);
  };

  const getClassGradeAnalytics = async (classId: string) => {
    return await getGradeAnalytics(classId);
  };

  return {
    createGrade: createNewGrade,
    updateGrade: updateExistingGrade,
    deleteGrade: deleteExistingGrade,
    getGradeAnalytics: getClassGradeAnalytics,
  };
}