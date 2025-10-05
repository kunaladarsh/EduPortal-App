export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  classId?: string; // For students and teachers
  assignedClasses?: string[]; // For teachers (multiple classes)
}

export interface Class {
  id: string;
  name: string;
  teacherId?: string;
  teacherName?: string;
  students: Student[];
  subject?: string;
  description?: string;
  grade?: string;
  room?: string;
  schedule?: string;
  studentCount?: number;
  createdAt?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  classId: string;
  phone?: string;
  address?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  grade?: string;
  rollNumber?: string;
  enrollmentDate?: string;
  status?: 'active' | 'inactive';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent';
  markedBy: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  classId: string;
  createdBy: string;
  createdAt: string;
  authorName: string;
}

export interface Grade {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  title: string;
  score: number;
  maxScore: number;
  date: string;
  teacherId: string;
  category: 'quiz' | 'exam' | 'assignment' | 'project';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'class' | 'exam' | 'holiday' | 'meeting' | 'event';
  classId?: string;
  createdBy: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  userId: string;
  actionUrl?: string;
}

export interface UserProfile extends User {
  profilePicture?: string;
  phone?: string;
  address?: string;
  dateJoined: string;
  lastLogin: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    emailUpdates: boolean;
  };
}