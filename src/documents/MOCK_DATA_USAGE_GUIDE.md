# Mock Data Usage Guide

This guide shows how to use the centralized mock data system in `/services/mockData.ts` for consistent data handling across all components.

## Overview

✅ **All mock data is centralized** in `/services/mockData.ts`  
✅ **Components call functions** to get/post data  
✅ **No hardcoded data** in components  
✅ **API simulation** with realistic delays and error handling  
✅ **Consistent data structures** across the entire app  

## Quick Start

### 1. Import the Functions You Need

```typescript
import {
  getAllAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAllMessages,
  sendMessage,
  markMessageAsRead
} from '../../services/mockData';
```

### 2. Use Async/Await Pattern

```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const assignments = await getAllAssignments();
      setData(assignments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, []);
```

### 3. Handle Loading, Error, and Success States

```typescript
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <DataDisplay data={data} />;
```

## Available API Functions

### Dashboard & Analytics
- `getDashboardStats(userRole, userId?)`
- `getStudentDashboard(studentId)`
- `getTeacherDashboard(teacherId)`

### Classes Management
- `getAllClasses()`
- `getClassById(classId)`
- `createClass(classData)`
- `updateClass(classId, updates)`
- `deleteClass(classId)`

### Attendance Management
- `markAttendance(classId, studentId, status, date?)`
- `getAttendanceByDateRange(classId, startDate, endDate)`
- `getAttendanceStatistics(classId, period)`

### Grades Management
- `createGrade(gradeData)`
- `updateGrade(gradeId, updates)`
- `deleteGrade(gradeId)`
- `getGradeAnalytics(classId)`

### Assignments Management
- `getAllAssignments(classId?)`
- `createAssignment(assignmentData)`
- `updateAssignment(assignmentId, updates)`
- `deleteAssignment(assignmentId)`

### Calendar & Events
- `createEvent(eventData)`
- `updateEvent(eventId, updates)`
- `deleteEvent(eventId)`
- `getEventsByDateRange(startDate, endDate)`

### Messaging System
- `getAllMessages(userId)`
- `sendMessage(messageData)`
- `markMessageAsRead(messageId)`
- `deleteMessage(messageId)`

### Library Management
- `getAllBooks()`
- `searchBooks(query, category?)`
- `borrowBook(bookId, userId)`
- `returnBook(bookId)`

### Wallet & Transactions
- `getWalletBalance(userId)`
- `getWalletTransactions(userId, limit?)`
- `addWalletTransaction(transactionData)`

### Services & Requests
- `getAllServiceRequests(userId?)`
- `createServiceRequest(requestData)`
- `updateServiceRequest(requestId, updates)`

### Reports & Analytics
- `getAllReports(type?)`
- `generateReport(reportData)`

### Announcements
- `createAnnouncement(announcementData)`
- `updateAnnouncement(announcementId, updates)`
- `deleteAnnouncement(announcementId)`

### Notifications
- `createNotification(notificationData)`
- `markNotificationAsRead(notificationId)`
- `markAllNotificationsAsRead(userId)`

## Example Component Patterns

### 1. Basic Data Loading Component

```typescript
import React, { useState, useEffect } from 'react';
import { getAllAssignments, Assignment } from '../../services/mockData';

export const AssignmentsList: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAssignments();
      setAssignments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading assignments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {assignments.map(assignment => (
        <div key={assignment.id}>
          <h3>{assignment.title}</h3>
          <p>{assignment.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### 2. Create/Update/Delete Operations

```typescript
import React, { useState } from 'react';
import { createAssignment, updateAssignment, deleteAssignment } from '../../services/mockData';

export const AssignmentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAssignment = await createAssignment({
        ...formData,
        classId: 'class-1',
        teacherId: 'teacher-1',
        type: 'homework'
      });
      console.log('Created:', newAssignment);
      // Update UI state
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  const handleUpdate = async (assignmentId: string, updates: any) => {
    try {
      const updated = await updateAssignment(assignmentId, updates);
      console.log('Updated:', updated);
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const handleDelete = async (assignmentId: string) => {
    try {
      await deleteAssignment(assignmentId);
      console.log('Deleted assignment');
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Assignment title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
      />
      <input
        type="date"
        value={formData.dueDate}
        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
      />
      <button type="submit">Create Assignment</button>
    </form>
  );
};
```

### 3. Real-time Updates with Refresh

```typescript
import React, { useState, useEffect } from 'react';
import { getAllMessages, sendMessage, markMessageAsRead } from '../../services/mockData';

export const MessagingComponent: React.FC = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadMessages();
    // Set up periodic refresh
    const interval = setInterval(loadMessages, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getAllMessages('current-user-id');
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const messageData = await sendMessage({
        senderId: 'current-user-id',
        senderName: 'Current User',
        receiverId: 'recipient-id',
        receiverName: 'Recipient',
        subject: 'New Message',
        content: newMessage,
        priority: 'normal'
      });
      
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  return (
    <div>
      <div>
        {messages.map(message => (
          <div key={message.id} onClick={() => !message.read && handleMarkAsRead(message.id)}>
            <h4>{message.subject}</h4>
            <p>{message.content}</p>
            <small>{message.read ? 'Read' : 'Unread'}</small>
          </div>
        ))}
      </div>
      
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};
```

### 4. Error Handling with Retry

```typescript
import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/mockData';

export const DashboardWithRetry: React.FC = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats('student', 'user-123');
      setStats(data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      setError(err.message);
      // Auto-retry up to 3 times
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadDashboardStats();
        }, 1000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, [retryCount]);

  const handleManualRetry = () => {
    setRetryCount(0);
    loadDashboardStats();
  };

  if (loading) return <div>Loading dashboard...</div>;
  
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={handleManualRetry}>Retry</button>
        {retryCount > 0 && <p>Retry attempt {retryCount}/3</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard Statistics</h2>
      <p>Total Students: {stats.totalStudents}</p>
      <p>Attendance Rate: {stats.attendanceRate}%</p>
      <button onClick={loadDashboardStats}>Refresh</button>
    </div>
  );
};
```

## Best Practices

### 1. Always Handle Three States
- **Loading**: Show loading indicators
- **Error**: Display error messages with retry options
- **Success**: Render the data

### 2. Use Consistent Error Handling
```typescript
try {
  const data = await apiFunction();
  // Handle success
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  setError(errorMessage);
}
```

### 3. Provide User Feedback
```typescript
import { toast } from "sonner@2.0.3";

const handleCreate = async () => {
  try {
    await createAssignment(data);
    toast.success("Assignment created successfully!");
  } catch (error) {
    toast.error("Failed to create assignment");
  }
};
```

### 4. Keep UI State in Sync
```typescript
const handleUpdate = async (id: string, updates: any) => {
  try {
    const updated = await updateAssignment(id, updates);
    // Update local state immediately
    setAssignments(prev => 
      prev.map(item => item.id === id ? updated : item)
    );
  } catch (error) {
    // Handle error
  }
};
```

### 5. Use TypeScript Types
```typescript
import { Assignment, Class, Student } from '../../services/mockData';

const [assignments, setAssignments] = useState<Assignment[]>([]);
const [selectedClass, setSelectedClass] = useState<Class | null>(null);
```

## Migration from Hardcoded Data

### Before (Hardcoded):
```typescript
const mockData = [
  { id: '1', title: 'Assignment 1' },
  { id: '2', title: 'Assignment 2' }
];

export const Component = () => {
  return (
    <div>
      {mockData.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};
```

### After (Centralized):
```typescript
import { getAllAssignments } from '../../services/mockData';

export const Component = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllAssignments();
        setAssignments(data);
      } catch (error) {
        console.error('Failed to load assignments:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {assignments.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};
```

## API Simulation Features

The mock data service includes realistic API simulation:

- **Automatic delays** (200-500ms) to simulate network latency
- **Random failures** (5% chance) to test error handling  
- **Consistent data updates** across function calls
- **TypeScript types** for all data structures
- **Realistic data relationships** between entities

## Example Components

Check out these example components that demonstrate proper usage:

1. `/components/assignments/MobileAssignmentsWithMockData.tsx` - Complete CRUD operations
2. `/components/messaging/MobileMessagingWithMockData.tsx` - Real-time messaging with state management

These examples show:
- ✅ Proper async/await patterns
- ✅ Loading and error state handling  
- ✅ CRUD operations with UI updates
- ✅ TypeScript usage
- ✅ User feedback with toast notifications
- ✅ Realistic data simulation

## Next Steps

1. **Replace hardcoded data** in existing components
2. **Use the API functions** instead of static arrays
3. **Add proper error handling** with user feedback
4. **Implement loading states** for better UX
5. **Test error scenarios** using the built-in failure simulation

The centralized mock data system makes your app more maintainable, realistic, and easier to eventually migrate to real APIs!

## Custom Hooks for Easy Integration

We've also created custom hooks to make using the mock data system even easier:

### Available Hooks

**`/hooks/useApiData.ts`**
- `useApiData<T>()` - Generic hook for API data fetching with loading, error, and retry logic
- `useCrudOperations<T>()` - Hook for managing CRUD operations with optimistic updates
- `useListData<T>()` - Hook for managing lists with search, filter, and pagination

**`/hooks/useSchoolData.ts`**
- `useDashboardData()` - Role-based dashboard data
- `useClasses()` / `useClassesWithSearch()` - Classes management
- `useAssignments()` / `useAssignmentsWithSearch()` - Assignments with search
- `useMessaging()` - Messaging system with send/read functionality
- `useLibrary()` - Library with book borrowing
- `useWallet()` - Digital wallet with transactions
- `useServiceRequests()` - Service request management
- `useReports()` - Report generation and management
- `useNotifications()` - Notification system

### Hook Usage Examples

```typescript
// Simple data fetching
const { data, loading, error, refetch } = useDashboardData();

// CRUD operations with search
const { 
  items, 
  loading, 
  error, 
  create, 
  update, 
  remove,
  searchQuery,
  setSearchQuery,
  filters,
  updateFilter
} = useAssignmentsWithSearch();

// Messaging with actions
const { 
  messages, 
  loading, 
  sendMessage, 
  markAsRead, 
  deleteMessage 
} = useMessaging();

// Wallet with transactions
const { 
  balance, 
  transactions, 
  addTransaction, 
  loading 
} = useWallet();
```

### Complete Component Example with Hooks

```typescript
import React from 'react';
import { useAssignmentsWithSearch } from '../hooks/useSchoolData';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const MyComponent: React.FC = () => {
  const {
    items: assignments,
    loading,
    error,
    create,
    searchQuery,
    setSearchQuery,
    updateFilter
  } = useAssignmentsWithSearch();

  const handleCreateAssignment = async () => {
    await create({
      title: 'New Assignment',
      description: 'Assignment description',
      classId: 'class-1',
      teacherId: 'teacher-1',
      dueDate: '2025-02-01',
      maxPoints: 100,
      type: 'homework'
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Input
        placeholder="Search assignments..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <Button onClick={handleCreateAssignment}>
        Create Assignment
      </Button>

      {assignments.map(assignment => (
        <div key={assignment.id}>
          <h3>{assignment.title}</h3>
          <p>{assignment.description}</p>
        </div>
      ))}
    </div>
  );
};
```

## Example Components

Check out these complete example components that demonstrate the centralized system:

1. **`/components/assignments/MobileAssignmentsWithMockData.tsx`** - Complete CRUD with search
2. **`/components/messaging/MobileMessagingWithMockData.tsx`** - Real-time messaging
3. **`/components/library/MobileLibraryWithMockData.tsx`** - Library with book management  
4. **`/components/wallet/MobileWalletWithMockData.tsx`** - Digital wallet with transactions
5. **`/components/demo/MockDataSystemDemo.tsx`** - Comprehensive live demonstration

## Live Demo

Access the **Mock Data System Demo** from the admin dashboard to see all functionality in action with:
- ✅ Live data operations
- ✅ CRUD demonstrations  
- ✅ Search and filtering
- ✅ Error handling
- ✅ Real-time updates
- ✅ Role-based data access

The system is production-ready and provides a solid foundation for any data-driven application!