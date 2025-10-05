import { Class, Student, AttendanceRecord, Announcement, Grade, Event, Notification, UserProfile } from '../types';

export const mockClasses: Class[] = [
  {
    id: 'class-1',
    name: 'Mathematics Grade 10',
    subject: 'Mathematics',
    grade: '10',
    room: 'Room 101',
    schedule: 'Mon, Wed, Fri - 9:00 AM',
    teacherId: '2',
    teacherName: 'John Teacher',
    studentCount: 4,
    createdAt: '2024-09-01T00:00:00Z',
    description: 'Advanced Mathematics course covering algebra, geometry, and trigonometry',
    students: [
      { 
        id: '3', 
        name: 'Jane Student', 
        email: 'student@school.com', 
        classId: 'class-1',
        phone: '+1 (555) 111-1111',
        address: '123 Student Ave, City, State 12345',
        parentName: 'Mary Student',
        parentEmail: 'mary.student@email.com',
        parentPhone: '+1 (555) 111-1112',
        grade: '10',
        rollNumber: '001',
        enrollmentDate: '2024-09-01T00:00:00Z',
        status: 'active'
      },
      { 
        id: '4', 
        name: 'Bob Wilson', 
        email: 'bob@student.com', 
        classId: 'class-1',
        phone: '+1 (555) 222-2222',
        address: '456 Oak St, City, State 12345',
        parentName: 'Robert Wilson Sr.',
        parentEmail: 'robert.wilson@email.com',
        parentPhone: '+1 (555) 222-2223',
        grade: '10',
        rollNumber: '002',
        enrollmentDate: '2024-09-01T00:00:00Z',
        status: 'active'
      },
      { 
        id: '5', 
        name: 'Alice Brown', 
        email: 'alice@student.com', 
        classId: 'class-1',
        phone: '+1 (555) 333-3333',
        address: '789 Pine Rd, City, State 12345',
        parentName: 'Sarah Brown',
        parentEmail: 'sarah.brown@email.com',
        parentPhone: '+1 (555) 333-3334',
        grade: '10',
        rollNumber: '003',
        enrollmentDate: '2024-09-01T00:00:00Z',
        status: 'active'
      },
      { 
        id: '6', 
        name: 'Charlie Davis', 
        email: 'charlie@student.com', 
        classId: 'class-1',
        phone: '+1 (555) 444-4444',
        address: '321 Elm Dr, City, State 12345',
        parentName: 'Michael Davis',
        parentEmail: 'michael.davis@email.com',
        parentPhone: '+1 (555) 444-4445',
        grade: '10',
        rollNumber: '004',
        enrollmentDate: '2024-09-01T00:00:00Z',
        status: 'active'
      },
    ],
  },
  {
    id: 'class-2',
    name: 'Physics Grade 11',
    subject: 'Physics',
    grade: '11',
    room: 'Room 203',
    schedule: 'Tue, Thu - 11:00 AM',
    teacherId: '2',
    teacherName: 'John Teacher',
    studentCount: 3,
    createdAt: '2024-09-01T00:00:00Z',
    description: 'Comprehensive Physics course with laboratory experiments',
    students: [
      { 
        id: '7', 
        name: 'Eva Green', 
        email: 'eva@student.com', 
        classId: 'class-2',
        phone: '+1 (555) 555-5555',
        address: '654 Birch Lane, City, State 12345',
        parentName: 'David Green',
        parentEmail: 'david.green@email.com',
        parentPhone: '+1 (555) 555-5556',
        grade: '11',
        rollNumber: '005',
        enrollmentDate: '2024-09-01T00:00:00Z',
        status: 'active'
      },
      { 
        id: '8', 
        name: 'Frank Miller', 
        email: 'frank@student.com', 
        classId: 'class-2',
        phone: '+1 (555) 666-6666',
        address: '987 Cedar St, City, State 12345',
        parentName: 'Linda Miller',
        parentEmail: 'linda.miller@email.com',
        parentPhone: '+1 (555) 666-6667',
        grade: '11',
        rollNumber: '006',
        enrollmentDate: '2024-09-01T00:00:00Z',
        status: 'active'
      },
      { 
        id: '9', 
        name: 'Grace Lee', 
        email: 'grace@student.com', 
        classId: 'class-2',
        phone: '+1 (555) 777-7777',
        address: '147 Maple Ave, City, State 12345',
        parentName: 'James Lee',
        parentEmail: 'james.lee@email.com',
        parentPhone: '+1 (555) 777-7778',
        grade: '11',
        rollNumber: '007',
        enrollmentDate: '2024-09-01T00:00:00Z',
        status: 'active'
      },
    ],
  },
  {
    id: 'class-3',
    name: 'Chemistry Grade 12',
    subject: 'Chemistry',
    grade: '12',
    room: 'Lab 305',
    schedule: 'Mon, Wed - 2:00 PM',
    teacherId: undefined,
    teacherName: undefined,
    studentCount: 2,
    createdAt: '2024-09-01T00:00:00Z',
    description: 'Advanced Chemistry with organic and inorganic studies',
    students: [
      { 
        id: '10', 
        name: 'Henry Taylor', 
        email: 'henry@student.com', 
        classId: 'class-3',
        phone: '+1 (555) 888-8888',
        address: '258 Willow Ct, City, State 12345',
        parentName: 'Susan Taylor',
        parentEmail: 'susan.taylor@email.com',
        parentPhone: '+1 (555) 888-8889',
        grade: '12',
        rollNumber: '008',
        enrollmentDate: '2024-09-01T00:00:00Z',
        status: 'active'
      },
      { 
        id: '11', 
        name: 'Ivy Johnson', 
        email: 'ivy@student.com', 
        classId: 'class-3',
        phone: '+1 (555) 999-9999',
        address: '369 Spruce Blvd, City, State 12345',
        parentName: 'Kevin Johnson',
        parentEmail: 'kevin.johnson@email.com',
        parentPhone: '+1 (555) 999-9990',
        grade: '12',
        rollNumber: '009',
        enrollmentDate: '2024-09-01T00:00:00Z',
        status: 'active'
      },
    ],
  },
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '3',
    classId: 'class-1',
    date: '2025-01-20',
    status: 'present',
    markedBy: '2',
  },
  {
    id: '2',
    studentId: '4',
    classId: 'class-1',
    date: '2025-01-20',
    status: 'absent',
    markedBy: '2',
  },
  {
    id: '3',
    studentId: '5',
    classId: 'class-1',
    date: '2025-01-20',
    status: 'present',
    markedBy: '2',
  },
  {
    id: '4',
    studentId: '3',
    classId: 'class-1',
    date: '2025-01-19',
    status: 'present',
    markedBy: '2',
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Math Test Next Week',
    content: 'There will be a mathematics test on Friday covering chapters 1-3. Please review your notes and practice problems.',
    classId: 'class-1',
    createdBy: '2',
    createdAt: '2025-01-18T10:00:00Z',
    authorName: 'John Teacher',
  },
  {
    id: '2',
    title: 'Physics Lab Session',
    content: 'Tomorrow we will have a hands-on physics lab session. Please bring your lab notebooks and safety goggles.',
    classId: 'class-2',
    createdBy: '2',
    createdAt: '2025-01-17T14:30:00Z',
    authorName: 'John Teacher',
  },
  {
    id: '3',
    title: 'Holiday Notice',
    content: 'School will be closed next Monday for the national holiday. Classes will resume on Tuesday.',
    classId: 'class-1',
    createdBy: '2',
    createdAt: '2025-01-15T09:00:00Z',
    authorName: 'John Teacher',
  },
];

// Extract all students from classes into a flat array for easier manipulation
export const mockStudents: Student[] = mockClasses.flatMap(cls => cls.students);

// Helper functions to simulate API calls
export const getClassesByTeacher = (teacherId: string): Class[] => {
  return mockClasses.filter(cls => cls.teacherId === teacherId);
};

export const getStudentsByClass = (classId: string): Student[] => {
  const cls = mockClasses.find(c => c.id === classId);
  return cls ? cls.students : [];
};

export const getAttendanceByStudent = (studentId: string): AttendanceRecord[] => {
  return mockAttendance.filter(record => record.studentId === studentId);
};

export const getAttendanceByClass = (classId: string): AttendanceRecord[] => {
  return mockAttendance.filter(record => record.classId === classId);
};

export const getAnnouncementsByClass = (classId: string): Announcement[] => {
  return mockAnnouncements.filter(announcement => announcement.classId === classId);
};

export const getAllTeachers = () => {
  return [
    { id: '2', name: 'John Teacher', email: 'teacher@school.com' },
    { id: '12', name: 'Sarah Wilson', email: 'sarah@teacher.com' },
    { id: '13', name: 'Mike Johnson', email: 'mike@teacher.com' },
  ];
};

// Departments for user management
export interface Department {
  id: string;
  name: string;
  headOfDepartment: string;
  studentCount: number;
  teacherCount: number;
  color: string;
  description?: string;
  established?: string;
}

export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Mathematics',
    headOfDepartment: 'Dr. John Teacher',
    studentCount: 156,
    teacherCount: 8,
    color: 'bg-blue-500',
    description: 'Advanced mathematics curriculum covering algebra, geometry, calculus and statistics',
    established: '2010'
  },
  {
    id: 'dept-2',
    name: 'Physics',
    headOfDepartment: 'Dr. Sarah Wilson',
    studentCount: 134,
    teacherCount: 6,
    color: 'bg-purple-500',
    description: 'Comprehensive physics program with laboratory experiments and theoretical studies',
    established: '2012'
  },
  {
    id: 'dept-3',
    name: 'Chemistry',
    headOfDepartment: 'Dr. Mike Johnson',
    studentCount: 89,
    teacherCount: 5,
    color: 'bg-green-500',
    description: 'Chemistry studies including organic, inorganic, and physical chemistry',
    established: '2015'
  },
  {
    id: 'dept-4',
    name: 'Computer Science',
    headOfDepartment: 'Prof. Lisa Chen',
    studentCount: 203,
    teacherCount: 12,
    color: 'bg-indigo-500',
    description: 'Modern computer science curriculum with programming, algorithms, and software development',
    established: '2018'
  },
  {
    id: 'dept-5',
    name: 'English Literature',
    headOfDepartment: 'Dr. Emily Brown',
    studentCount: 167,
    teacherCount: 7,
    color: 'bg-red-500',
    description: 'English literature and language studies with creative writing components',
    established: '2008'
  }
];

// Extended user interface for comprehensive user management
export interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  departmentId: string;
  departmentName: string;
  phone?: string;
  address?: string;
  dateJoined: string;
  lastActive: string;
  avatar?: string;
  // Student specific
  grade?: string;
  rollNumber?: string;
  enrollmentNumber?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  classesEnrolled?: number;
  // Teacher/Admin specific
  employeeId?: string;
  subject?: string;
  coursesTeaching?: number;
  assignedClasses?: string[];
  permissions: string[];
}

export const mockExtendedUsers: ExtendedUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@school.com',
    role: 'admin',
    status: 'active',
    departmentId: 'dept-admin',
    departmentName: 'Administration',
    phone: '+1 (555) 000-0000',
    address: '1 Main Campus, Education City, EC 12345',
    dateJoined: '2020-01-01',
    lastActive: '5 minutes ago',
    employeeId: 'ADM001',
    permissions: ['all']
  },
  {
    id: '2',
    name: 'John Teacher',
    email: 'teacher@school.com',
    role: 'teacher',
    status: 'active',
    departmentId: 'dept-1',
    departmentName: 'Mathematics',
    phone: '+1 (555) 234-5678',
    address: '456 Teacher Lane, Education City, EC 12345',
    dateJoined: '2024-02-01',
    lastActive: '1 hour ago',
    employeeId: 'TEA001',
    subject: 'Mathematics & Physics',
    coursesTeaching: 4,
    assignedClasses: ['class-1', 'class-2'],
    permissions: ['attendance', 'grades', 'classes', 'announcements']
  },
  {
    id: '12',
    name: 'Sarah Wilson',
    email: 'sarah@teacher.com',
    role: 'teacher',
    status: 'active',
    departmentId: 'dept-2',
    departmentName: 'Physics',
    phone: '+1 (555) 987-6543',
    address: '123 Faculty Drive, Education City, EC 12345',
    dateJoined: '2024-03-15',
    lastActive: '2 hours ago',
    employeeId: 'TEA002',
    subject: 'Physics',
    coursesTeaching: 3,
    assignedClasses: ['class-3'],
    permissions: ['attendance', 'grades', 'classes', 'announcements']
  },
  {
    id: '13',
    name: 'Mike Johnson',
    email: 'mike@teacher.com',
    role: 'teacher',
    status: 'active',
    departmentId: 'dept-3',
    departmentName: 'Chemistry',
    phone: '+1 (555) 456-7890',
    address: '789 Science Blvd, Education City, EC 12345',
    dateJoined: '2023-08-20',
    lastActive: '30 minutes ago',
    employeeId: 'TEA003',
    subject: 'Chemistry',
    coursesTeaching: 2,
    assignedClasses: ['class-4'],
    permissions: ['attendance', 'grades', 'classes', 'announcements']
  },
  {
    id: '3',
    name: 'Jane Student',
    email: 'student@school.com',
    role: 'student',
    status: 'active',
    departmentId: 'dept-1',
    departmentName: 'Mathematics',
    phone: '+1 (555) 345-6789',
    address: '789 Student Street, Education City, EC 12345',
    dateJoined: '2024-09-01',
    lastActive: '3 hours ago',
    grade: '10',
    rollNumber: '001',
    enrollmentNumber: 'STU2024001',
    parentName: 'Mary Student',
    parentEmail: 'mary.student@email.com',
    parentPhone: '+1 (555) 345-6790',
    classesEnrolled: 6,
    permissions: ['assignments', 'grades', 'library', 'calendar']
  },
  {
    id: '4',
    name: 'Bob Wilson',
    email: 'bob@student.com',
    role: 'student',
    status: 'active',
    departmentId: 'dept-1',
    departmentName: 'Mathematics',
    phone: '+1 (555) 222-2222',
    address: '456 Oak St, City, State 12345',
    dateJoined: '2024-09-01',
    lastActive: '1 day ago',
    grade: '10',
    rollNumber: '002',
    enrollmentNumber: 'STU2024002',
    parentName: 'Robert Wilson Sr.',
    parentEmail: 'robert.wilson@email.com',
    parentPhone: '+1 (555) 222-2223',
    classesEnrolled: 6,
    permissions: ['assignments', 'grades', 'library', 'calendar']
  },
  {
    id: '5',
    name: 'Alice Brown',
    email: 'alice@student.com',
    role: 'student',
    status: 'inactive',
    departmentId: 'dept-1',
    departmentName: 'Mathematics',
    phone: '+1 (555) 333-3333',
    address: '789 Pine Rd, City, State 12345',
    dateJoined: '2024-09-01',
    lastActive: '1 week ago',
    grade: '10',
    rollNumber: '003',
    enrollmentNumber: 'STU2024003',
    parentName: 'Sarah Brown',
    parentEmail: 'sarah.brown@email.com',
    parentPhone: '+1 (555) 333-3334',
    classesEnrolled: 5,
    permissions: ['assignments', 'grades', 'library']
  },
  {
    id: '14',
    name: 'Emily Carter',
    email: 'emily@teacher.com',
    role: 'teacher',
    status: 'pending',
    departmentId: 'dept-4',
    departmentName: 'Computer Science',
    phone: '+1 (555) 111-2222',
    address: '321 Tech Avenue, Education City, EC 12345',
    dateJoined: '2024-01-20',
    lastActive: 'Never',
    employeeId: 'TEA004',
    subject: 'Computer Science',
    coursesTeaching: 0,
    permissions: ['grades', 'attendance']
  },
  {
    id: '15',
    name: 'David Kim',
    email: 'david@student.com',
    role: 'student',
    status: 'suspended',
    departmentId: 'dept-4',
    departmentName: 'Computer Science',
    phone: '+1 (555) 444-5555',
    address: '654 Student Plaza, City, State 12345',
    dateJoined: '2023-09-01',
    lastActive: '3 days ago',
    grade: '11',
    rollNumber: '025',
    enrollmentNumber: 'STU2023025',
    parentName: 'Jin Kim',
    parentEmail: 'jin.kim@email.com',
    parentPhone: '+1 (555) 444-5556',
    classesEnrolled: 7,
    permissions: []
  }
];

// Helper functions for user management
export const getAllUsers = (): ExtendedUser[] => {
  return mockExtendedUsers;
};

export const getUsersByDepartment = (departmentId: string): ExtendedUser[] => {
  return mockExtendedUsers.filter(user => user.departmentId === departmentId);
};

export const getUsersByRole = (role: 'admin' | 'teacher' | 'student'): ExtendedUser[] => {
  return mockExtendedUsers.filter(user => user.role === role);
};

export const getUsersByStatus = (status: 'active' | 'inactive' | 'suspended' | 'pending'): ExtendedUser[] => {
  return mockExtendedUsers.filter(user => user.status === status);
};

export const getDepartmentById = (departmentId: string): Department | undefined => {
  return mockDepartments.find(dept => dept.id === departmentId);
};

export const getUserById = (userId: string): ExtendedUser | undefined => {
  return mockExtendedUsers.find(user => user.id === userId);
};

export const mockGrades: Grade[] = [
  {
    id: '1',
    studentId: '3',
    classId: 'class-1',
    subject: 'Mathematics',
    title: 'Chapter 1-3 Test',
    score: 85,
    maxScore: 100,
    date: '2025-01-15',
    teacherId: '2',
    category: 'exam',
  },
  {
    id: '2',
    studentId: '3',
    classId: 'class-1',
    subject: 'Mathematics',
    title: 'Homework Assignment 1',
    score: 92,
    maxScore: 100,
    date: '2025-01-10',
    teacherId: '2',
    category: 'assignment',
  },
  {
    id: '3',
    studentId: '4',
    classId: 'class-1',
    subject: 'Mathematics',
    title: 'Chapter 1-3 Test',
    score: 78,
    maxScore: 100,
    date: '2025-01-15',
    teacherId: '2',
    category: 'exam',
  },
  {
    id: '4',
    studentId: '3',
    classId: 'class-2',
    subject: 'Physics',
    title: 'Lab Report 1',
    score: 95,
    maxScore: 100,
    date: '2025-01-12',
    teacherId: '2',
    category: 'project',
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Mathematics Test',
    description: 'Chapter 1-3 examination',
    date: '2025-01-30',
    time: '10:00',
    type: 'exam',
    classId: 'class-1',
    createdBy: '2',
  },
  {
    id: '2',
    title: 'Physics Lab Session',
    description: 'Hands-on experiment with pendulums',
    date: '2025-01-28',
    time: '14:00',
    type: 'class',
    classId: 'class-2',
    createdBy: '2',
  },
  {
    id: '3',
    title: 'Winter Break',
    description: 'School holiday - no classes',
    date: '2025-02-01',
    time: '00:00',
    type: 'holiday',
    createdBy: '1',
  },
  {
    id: '4',
    title: 'Parent-Teacher Meeting',
    description: 'Quarterly progress discussion',
    date: '2025-02-05',
    time: '15:00',
    type: 'meeting',
    createdBy: '1',
  },
  {
    id: '5',
    title: 'Chemistry Quiz',
    description: 'Periodic table quiz',
    date: '2025-01-25',
    time: '11:00',
    type: 'exam',
    classId: 'class-3',
    createdBy: '2',
  },
  {
    id: '6',
    title: 'Math Tutorial',
    description: 'Extra help session for struggling students',
    date: '2025-01-27',
    time: '16:00',
    type: 'class',
    classId: 'class-1',
    createdBy: '2',
  },
  {
    id: '7',
    title: 'Science Fair',
    description: 'Annual science project exhibition',
    date: '2025-02-10',
    time: '09:00',
    type: 'event',
    createdBy: '1',
  },
  {
    id: '8',
    title: 'Board Meeting',
    description: 'Monthly school board meeting',
    date: '2025-02-03',
    time: '19:00',
    type: 'meeting',
    createdBy: '1',
  },
  {
    id: '9',
    title: 'Sports Day',
    description: 'Annual athletics competition',
    date: '2025-02-15',
    time: '08:00',
    type: 'event',
    createdBy: '1',
  },
  {
    id: '10',
    title: 'Library Workshop',
    description: 'Research skills workshop',
    date: '2025-01-31',
    time: '13:00',
    type: 'event',
    createdBy: '2',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Grade Posted',
    message: 'Your Mathematics test score is now available',
    type: 'info',
    read: false,
    createdAt: '2025-01-20T10:00:00Z',
    userId: '3',
    actionUrl: '/grades',
  },
  {
    id: '2',
    title: 'Attendance Reminder',
    message: 'Please mark attendance for today\'s classes',
    type: 'warning',
    read: false,
    createdAt: '2025-01-20T08:00:00Z',
    userId: '2',
    actionUrl: '/attendance',
  },
  {
    id: '3',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Sunday 2AM-4AM',
    type: 'info',
    read: true,
    createdAt: '2025-01-19T16:00:00Z',
    userId: '1',
  },
];

export const mockUserProfiles: UserProfile[] = [
  {
    id: '1',
    email: 'admin@school.com',
    name: 'Admin User',
    role: 'admin',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 123-4567',
    address: '123 School District Ave, Education City, EC 12345',
    dateJoined: '2024-01-01',
    lastLogin: '2025-01-20T09:00:00Z',
    preferences: {
      theme: 'system',
      notifications: true,
      emailUpdates: true,
    },
  },
  {
    id: '2',
    email: 'teacher@school.com',
    name: 'John Teacher',
    role: 'teacher',
    assignedClasses: ['class-1', 'class-2'],
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 234-5678',
    address: '456 Teacher Lane, Education City, EC 12345',
    dateJoined: '2024-02-01',
    lastLogin: '2025-01-20T08:30:00Z',
    preferences: {
      theme: 'light',
      notifications: true,
      emailUpdates: true,
    },
  },
  {
    id: '3',
    email: 'student@school.com',
    name: 'Jane Student',
    role: 'student',
    classId: 'class-1',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 345-6789',
    address: '789 Student Street, Education City, EC 12345',
    dateJoined: '2024-09-01',
    lastLogin: '2025-01-20T07:45:00Z',
    preferences: {
      theme: 'dark',
      notifications: true,
      emailUpdates: false,
    },
  },
];

// Helper functions for new features
export const getGradesByStudent = (studentId: string): Grade[] => {
  return mockGrades.filter(grade => grade.studentId === studentId);
};

export const getGradesByClass = (classId: string): Grade[] => {
  return mockGrades.filter(grade => grade.classId === classId);
};

export const getEventsByClass = (classId: string): Event[] => {
  return mockEvents.filter(event => event.classId === classId);
};

export const getAllEvents = (): Event[] => {
  return mockEvents;
};

export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => notification.userId === userId);
};

export const getUserProfile = (userId: string): UserProfile | undefined => {
  return mockUserProfiles.find(profile => profile.id === userId);
};

// User Management Functions
export const getAllUserProfiles = () => {
  return mockUserProfiles;
};

export const createUser = (userData: Partial<UserProfile>): UserProfile => {
  const newUser: UserProfile = {
    id: Date.now().toString(),
    email: userData.email || '',
    name: userData.name || '',
    role: userData.role || 'student',
    phone: userData.phone || '',
    address: userData.address || '',
    dateJoined: new Date().toISOString().split('T')[0],
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: 'system',
      notifications: true,
      emailUpdates: true,
    },
    ...userData,
  };
  
  mockUserProfiles.push(newUser);
  return newUser;
};

export const updateUser = (userId: string, updates: Partial<UserProfile>): UserProfile | null => {
  const userIndex = mockUserProfiles.findIndex(user => user.id === userId);
  if (userIndex === -1) return null;
  
  mockUserProfiles[userIndex] = { ...mockUserProfiles[userIndex], ...updates };
  return mockUserProfiles[userIndex];
};

export const deleteUser = (userId: string): boolean => {
  const userIndex = mockUserProfiles.findIndex(user => user.id === userId);
  if (userIndex === -1) return false;
  
  mockUserProfiles.splice(userIndex, 1);
  return true;
};

export const getUserProfilesByRole = (role: 'admin' | 'teacher' | 'student') => {
  return mockUserProfiles.filter(user => user.role === role);
};

// ===================================================================
// COMPREHENSIVE MOCK DATA EXPANSION
// ===================================================================

// Additional Data Types for Complete App Coverage
export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  teacherId: string;
  dueDate: string;
  createdAt: string;
  maxPoints: number;
  type: 'homework' | 'project' | 'quiz' | 'exam';
  status: 'active' | 'draft' | 'closed';
  submissionsCount: number;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  classId?: string;
  category: 'syllabus' | 'notes' | 'assignment' | 'resource';
  downloadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'normal' | 'high';
  attachments?: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: boolean;
  borrowedBy?: string;
  dueDate?: string;
  description: string;
  coverImage?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  category: 'fees' | 'cafeteria' | 'library' | 'transport' | 'supplies';
  timestamp: string;
  balance: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface ServiceRequest {
  id: string;
  userId: string;
  serviceType: 'counseling' | 'medical' | 'technical' | 'transport';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  scheduledAt?: string;
  completedAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface Report {
  id: string;
  title: string;
  type: 'attendance' | 'grades' | 'financial' | 'performance' | 'behavior';
  generatedBy: string;
  generatedAt: string;
  data: any;
  period: string;
  format: 'pdf' | 'csv' | 'excel';
  status: 'ready' | 'generating' | 'failed';
}

// Mock Data Arrays
export const mockAssignments: Assignment[] = [
  {
    id: 'assignment-1',
    title: 'Algebra Problem Set',
    description: 'Complete problems 1-20 from chapter 3. Show all work.',
    classId: 'class-1',
    teacherId: '2',
    dueDate: '2025-02-01',
    createdAt: '2025-01-15T10:00:00Z',
    maxPoints: 100,
    type: 'homework',
    status: 'active',
    submissionsCount: 2
  },
  {
    id: 'assignment-2',
    title: 'Physics Lab Report',
    description: 'Write a detailed report on the pendulum experiment.',
    classId: 'class-2',
    teacherId: '2',
    dueDate: '2025-01-28',
    createdAt: '2025-01-20T14:00:00Z',
    maxPoints: 50,
    type: 'project',
    status: 'active',
    submissionsCount: 1
  },
  {
    id: 'assignment-3',
    title: 'Chemistry Quiz Prep',
    description: 'Study chapters 4-6 for upcoming quiz on periodic table.',
    classId: 'class-3',
    teacherId: '13',
    dueDate: '2025-01-25',
    createdAt: '2025-01-18T09:00:00Z',
    maxPoints: 25,
    type: 'quiz',
    status: 'active',
    submissionsCount: 0
  }
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Mathematics Syllabus 2024-25',
    description: 'Complete curriculum and grading policy for Grade 10 Mathematics',
    fileName: 'math_syllabus_2024.pdf',
    fileSize: '2.3 MB',
    uploadedBy: '2',
    uploadedAt: '2024-09-01T10:00:00Z',
    classId: 'class-1',
    category: 'syllabus',
    downloadCount: 45
  },
  {
    id: 'doc-2',
    title: 'Physics Lab Safety Guidelines',
    description: 'Important safety protocols for all physics laboratory sessions',
    fileName: 'physics_safety.pdf',
    fileSize: '1.8 MB',
    uploadedBy: '2',
    uploadedAt: '2024-09-15T14:30:00Z',
    classId: 'class-2',
    category: 'resource',
    downloadCount: 32
  },
  {
    id: 'doc-3',
    title: 'School Calendar 2024-25',
    description: 'Academic calendar with important dates and holidays',
    fileName: 'school_calendar.pdf',
    fileSize: '1.2 MB',
    uploadedBy: '1',
    uploadedAt: '2024-08-20T12:00:00Z',
    category: 'resource',
    downloadCount: 156
  }
];

// DOCUMENTS API FUNCTIONS
// ===================================================================

export const getAllDocuments = async () => {
  return simulateApiCall(mockDocuments);
};

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: '2',
    senderName: 'John Teacher',
    receiverId: '3',
    receiverName: 'Jane Student',
    subject: 'Great job on your test!',
    content: 'Hi Jane, I wanted to congratulate you on your excellent performance in the recent mathematics test. Keep up the good work!',
    timestamp: '2025-01-20T15:30:00Z',
    read: false,
    priority: 'normal'
  },
  {
    id: 'msg-2',
    senderId: '1',
    senderName: 'Admin User',
    receiverId: '2',
    receiverName: 'John Teacher',
    subject: 'Staff Meeting Reminder',
    content: 'This is a reminder about the monthly staff meeting scheduled for tomorrow at 3:00 PM in the conference room.',
    timestamp: '2025-01-19T16:45:00Z',
    read: true,
    priority: 'high'
  },
  {
    id: 'msg-3',
    senderId: '3',
    senderName: 'Jane Student',
    receiverId: '2',
    receiverName: 'John Teacher',
    subject: 'Question about homework',
    content: 'Hi Mr. Teacher, I have a question about problem #15 in the algebra homework. Could you clarify the approach?',
    timestamp: '2025-01-18T19:20:00Z',
    read: true,
    priority: 'normal'
  }
];

export const mockBooks: Book[] = [
  {
    id: 'book-1',
    title: 'Advanced Mathematics for Beginners',
    author: 'Dr. Sarah Johnson',
    isbn: '978-0123456789',
    category: 'Mathematics',
    available: true,
    description: 'Comprehensive guide to advanced mathematical concepts with practical examples.'
  },
  {
    id: 'book-2',
    title: 'Physics: Fundamentals and Applications',
    author: 'Prof. Michael Chen',
    isbn: '978-0987654321',
    category: 'Physics',
    available: false,
    borrowedBy: '3',
    dueDate: '2025-02-05',
    description: 'Essential physics concepts with laboratory experiments and real-world applications.'
  },
  {
    id: 'book-3',
    title: 'Chemistry in Everyday Life',
    author: 'Dr. Emily Davis',
    isbn: '978-0456789123',
    category: 'Chemistry',
    available: true,
    description: 'Understanding chemical processes in daily life with engaging examples.'
  },
  {
    id: 'book-4',
    title: 'World Literature Anthology',
    author: 'Various Authors',
    isbn: '978-0321654987',
    category: 'Literature',
    available: true,
    description: 'Collection of classic and contemporary literary works from around the world.'
  }
];

export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: 'tx-1',
    userId: '3',
    type: 'debit',
    amount: 12.50,
    description: 'Cafeteria lunch - Chicken sandwich and juice',
    category: 'cafeteria',
    timestamp: '2025-01-20T12:30:00Z',
    balance: 87.50,
    status: 'completed'
  },
  {
    id: 'tx-2',
    userId: '3',
    type: 'credit',
    amount: 100.00,
    description: 'Monthly allowance from parent',
    category: 'fees',
    timestamp: '2025-01-20T08:00:00Z',
    balance: 100.00,
    status: 'completed'
  },
  {
    id: 'tx-3',
    userId: '3',
    type: 'debit',
    amount: 5.00,
    description: 'Library late return fee',
    category: 'library',
    timestamp: '2025-01-19T14:20:00Z',
    balance: 95.00,
    status: 'completed'
  }
];

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: 'service-1',
    userId: '3',
    serviceType: 'counseling',
    title: 'Academic guidance session',
    description: 'Need help with course selection for next semester',
    status: 'pending',
    createdAt: '2025-01-20T10:00:00Z',
    scheduledAt: '2025-01-22T14:00:00Z',
    priority: 'medium'
  },
  {
    id: 'service-2',
    userId: '4',
    serviceType: 'medical',
    title: 'Health checkup',
    description: 'Regular health screening as required',
    status: 'completed',
    createdAt: '2025-01-18T09:30:00Z',
    scheduledAt: '2025-01-19T11:00:00Z',
    completedAt: '2025-01-19T11:30:00Z',
    priority: 'low'
  },
  {
    id: 'service-3',
    userId: '2',
    serviceType: 'technical',
    title: 'Projector not working',
    description: 'Classroom projector in Room 101 is not displaying properly',
    status: 'in-progress',
    createdAt: '2025-01-20T08:45:00Z',
    priority: 'high'
  }
];

export const mockReports: Report[] = [
  {
    id: 'report-1',
    title: 'Monthly Attendance Report - January 2025',
    type: 'attendance',
    generatedBy: '2',
    generatedAt: '2025-01-20T16:00:00Z',
    data: { averageAttendance: 85, totalClasses: 20, studentsAnalyzed: 25 },
    period: 'January 2025',
    format: 'pdf',
    status: 'ready'
  },
  {
    id: 'report-2',
    title: 'Grade Analysis - Mathematics Class 1',
    type: 'grades',
    generatedBy: '2',
    generatedAt: '2025-01-19T14:30:00Z',
    data: { averageGrade: 82, highestGrade: 95, lowestGrade: 65 },
    period: 'December 2024',
    format: 'excel',
    status: 'ready'
  },
  {
    id: 'report-3',
    title: 'Financial Summary Q1 2025',
    type: 'financial',
    generatedBy: '1',
    generatedAt: '2025-01-15T12:00:00Z',
    data: { totalRevenue: 50000, totalExpenses: 35000, profit: 15000 },
    period: 'Q1 2025',
    format: 'pdf',
    status: 'generating'
  }
];

// ===================================================================
// API SIMULATION FUNCTIONS
// ===================================================================

// Simulate API delay and potential errors
async function simulateApiCall<T>(data: T, delay: number = 300): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional API failures (5% chance)
      if (Math.random() < 0.05) {
        reject(new Error('Network error: Unable to connect to server'));
        return;
      }
      resolve(data);
    }, delay);
  });
}

// ===================================================================
// DASHBOARD & ANALYTICS API FUNCTIONS
// ===================================================================

export const getDashboardStats = async (userRole: string, userId?: string) => {
  const stats = {
    totalStudents: mockStudents.length,
    totalTeachers: getAllTeachers().length,
    totalClasses: mockClasses.length,
    attendanceRate: 85, // Calculate from actual data
    pendingAssignments: mockAssignments.filter(a => a.status === 'active').length,
    upcomingEvents: mockEvents.filter(e => new Date(e.date) > new Date()).length,
    newMessages: mockMessages.filter(m => !m.read).length,
    recentActivity: 12
  };

  return simulateApiCall(stats);
};

export const getStudentDashboard = async (studentId: string) => {
  const student = mockStudents.find(s => s.id === studentId);
  const recentGrades = getGradesByStudent(studentId).slice(-5);
  const upcomingAssignments = mockAssignments.filter(a => a.classId === student?.classId).slice(0, 3);
  const recentMessages = mockMessages.filter(m => m.receiverId === studentId).slice(-3);
  
  const dashboard = {
    student,
    recentGrades,
    upcomingAssignments,
    recentMessages,
    attendanceRate: 90, // Calculate from actual data
    averageGrade: 85,
    pendingAssignments: 3
  };

  return simulateApiCall(dashboard);
};

export const getTeacherDashboard = async (teacherId: string) => {
  const classes = getClassesByTeacher(teacherId);
  const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);
  const recentGrades = mockGrades.filter(g => g.teacherId === teacherId).slice(-5);
  const pendingRequests = mockServiceRequests.filter(r => r.status === 'pending').length;

  const dashboard = {
    classes,
    totalStudents,
    recentGrades,
    pendingRequests,
    averageClassAttendance: 88,
    gradesToReview: 8
  };

  return simulateApiCall(dashboard);
};

// ===================================================================
// CLASSES API FUNCTIONS
// ===================================================================

export const getAllClasses = async () => {
  return simulateApiCall(mockClasses);
};

export const getClassById = async (classId: string) => {
  const classData = mockClasses.find(c => c.id === classId);
  if (!classData) throw new Error('Class not found');
  return simulateApiCall(classData);
};

export const createClass = async (classData: Partial<Class>): Promise<Class> => {
  const newClass: Class = {
    id: `class-${Date.now()}`,
    name: classData.name || '',
    subject: classData.subject || '',
    grade: classData.grade || '',
    room: classData.room || '',
    schedule: classData.schedule || '',
    teacherId: classData.teacherId,
    teacherName: classData.teacherName,
    studentCount: 0,
    createdAt: new Date().toISOString(),
    description: classData.description || '',
    students: []
  };
  
  mockClasses.push(newClass);
  return simulateApiCall(newClass);
};

export const updateClass = async (classId: string, updates: Partial<Class>): Promise<Class> => {
  const classIndex = mockClasses.findIndex(c => c.id === classId);
  if (classIndex === -1) throw new Error('Class not found');
  
  mockClasses[classIndex] = { ...mockClasses[classIndex], ...updates };
  return simulateApiCall(mockClasses[classIndex]);
};

export const deleteClass = async (classId: string): Promise<boolean> => {
  const classIndex = mockClasses.findIndex(c => c.id === classId);
  if (classIndex === -1) throw new Error('Class not found');
  
  mockClasses.splice(classIndex, 1);
  return simulateApiCall(true);
};

// ===================================================================
// ATTENDANCE API FUNCTIONS
// ===================================================================

export const markAttendance = async (
  classId: string, 
  studentId: string, 
  status: 'present' | 'absent' | 'late',
  date: string = new Date().toISOString().split('T')[0]
) => {
  const attendanceRecord: AttendanceRecord = {
    id: `attendance-${Date.now()}`,
    studentId,
    classId,
    date,
    status,
    markedBy: '2' // Current user ID in real app
  };
  
  // Remove existing record for same student/class/date
  const existingIndex = mockAttendance.findIndex(
    a => a.studentId === studentId && a.classId === classId && a.date === date
  );
  
  if (existingIndex !== -1) {
    mockAttendance[existingIndex] = attendanceRecord;
  } else {
    mockAttendance.push(attendanceRecord);
  }
  
  return simulateApiCall(attendanceRecord);
};

export const getAttendanceByDateRange = async (
  classId: string,
  startDate: string,
  endDate: string
) => {
  const records = mockAttendance.filter(
    a => a.classId === classId && a.date >= startDate && a.date <= endDate
  );
  return simulateApiCall(records);
};

export const getAttendanceStatistics = async (classId: string, period: string) => {
  const records = getAttendanceByClass(classId);
  const stats = {
    totalClasses: records.length,
    averageAttendance: 85,
    presentCount: records.filter(r => r.status === 'present').length,
    absentCount: records.filter(r => r.status === 'absent').length,
    lateCount: records.filter(r => r.status === 'late').length
  };
  return simulateApiCall(stats);
};

// ===================================================================
// GRADES API FUNCTIONS
// ===================================================================

export const createGrade = async (gradeData: Partial<Grade>): Promise<Grade> => {
  const newGrade: Grade = {
    id: `grade-${Date.now()}`,
    studentId: gradeData.studentId || '',
    classId: gradeData.classId || '',
    subject: gradeData.subject || '',
    title: gradeData.title || '',
    score: gradeData.score || 0,
    maxScore: gradeData.maxScore || 100,
    date: gradeData.date || new Date().toISOString().split('T')[0],
    teacherId: gradeData.teacherId || '',
    category: gradeData.category || 'assignment'
  };
  
  mockGrades.push(newGrade);
  return simulateApiCall(newGrade);
};

export const updateGrade = async (gradeId: string, updates: Partial<Grade>): Promise<Grade> => {
  const gradeIndex = mockGrades.findIndex(g => g.id === gradeId);
  if (gradeIndex === -1) throw new Error('Grade not found');
  
  mockGrades[gradeIndex] = { ...mockGrades[gradeIndex], ...updates };
  return simulateApiCall(mockGrades[gradeIndex]);
};

export const deleteGrade = async (gradeId: string): Promise<boolean> => {
  const gradeIndex = mockGrades.findIndex(g => g.id === gradeId);
  if (gradeIndex === -1) throw new Error('Grade not found');
  
  mockGrades.splice(gradeIndex, 1);
  return simulateApiCall(true);
};

export const getGradeAnalytics = async (classId: string) => {
  const grades = getGradesByClass(classId);
  const analytics = {
    averageGrade: grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / grades.length,
    highestGrade: Math.max(...grades.map(g => g.score / g.maxScore * 100)),
    lowestGrade: Math.min(...grades.map(g => g.score / g.maxScore * 100)),
    totalAssignments: grades.length,
    gradeDistribution: {
      A: grades.filter(g => (g.score / g.maxScore * 100) >= 90).length,
      B: grades.filter(g => (g.score / g.maxScore * 100) >= 80 && (g.score / g.maxScore * 100) < 90).length,
      C: grades.filter(g => (g.score / g.maxScore * 100) >= 70 && (g.score / g.maxScore * 100) < 80).length,
      D: grades.filter(g => (g.score / g.maxScore * 100) >= 60 && (g.score / g.maxScore * 100) < 70).length,
      F: grades.filter(g => (g.score / g.maxScore * 100) < 60).length
    }
  };
  return simulateApiCall(analytics);
};

// ===================================================================
// ASSIGNMENTS API FUNCTIONS
// ===================================================================

export const getAllAssignments = async (classId?: string) => {
  const assignments = classId 
    ? mockAssignments.filter(a => a.classId === classId)
    : mockAssignments;
  return simulateApiCall(assignments);
};

export const createAssignment = async (assignmentData: Partial<Assignment>): Promise<Assignment> => {
  const newAssignment: Assignment = {
    id: `assignment-${Date.now()}`,
    title: assignmentData.title || '',
    description: assignmentData.description || '',
    classId: assignmentData.classId || '',
    teacherId: assignmentData.teacherId || '',
    dueDate: assignmentData.dueDate || '',
    createdAt: new Date().toISOString(),
    maxPoints: assignmentData.maxPoints || 100,
    type: assignmentData.type || 'homework',
    status: assignmentData.status || 'active',
    submissionsCount: 0
  };
  
  mockAssignments.push(newAssignment);
  return simulateApiCall(newAssignment);
};

export const updateAssignment = async (assignmentId: string, updates: Partial<Assignment>): Promise<Assignment> => {
  const assignmentIndex = mockAssignments.findIndex(a => a.id === assignmentId);
  if (assignmentIndex === -1) throw new Error('Assignment not found');
  
  mockAssignments[assignmentIndex] = { ...mockAssignments[assignmentIndex], ...updates };
  return simulateApiCall(mockAssignments[assignmentIndex]);
};

export const deleteAssignment = async (assignmentId: string): Promise<boolean> => {
  const assignmentIndex = mockAssignments.findIndex(a => a.id === assignmentId);
  if (assignmentIndex === -1) throw new Error('Assignment not found');
  
  mockAssignments.splice(assignmentIndex, 1);
  return simulateApiCall(true);
};

// ===================================================================
// CALENDAR & EVENTS API FUNCTIONS
// ===================================================================

export const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
  const newEvent: Event = {
    id: `event-${Date.now()}`,
    title: eventData.title || '',
    description: eventData.description || '',
    date: eventData.date || '',
    time: eventData.time || '',
    type: eventData.type || 'event',
    classId: eventData.classId,
    createdBy: eventData.createdBy || ''
  };
  
  mockEvents.push(newEvent);
  return simulateApiCall(newEvent);
};

export const updateEvent = async (eventId: string, updates: Partial<Event>): Promise<Event> => {
  const eventIndex = mockEvents.findIndex(e => e.id === eventId);
  if (eventIndex === -1) throw new Error('Event not found');
  
  mockEvents[eventIndex] = { ...mockEvents[eventIndex], ...updates };
  return simulateApiCall(mockEvents[eventIndex]);
};

export const deleteEvent = async (eventId: string): Promise<boolean> => {
  const eventIndex = mockEvents.findIndex(e => e.id === eventId);
  if (eventIndex === -1) throw new Error('Event not found');
  
  mockEvents.splice(eventIndex, 1);
  return simulateApiCall(true);
};

export const getEventsByDateRange = async (startDate: string, endDate: string) => {
  const events = mockEvents.filter(e => e.date >= startDate && e.date <= endDate);
  return simulateApiCall(events);
};

// ===================================================================
// MESSAGING API FUNCTIONS
// ===================================================================

export const getAllMessages = async (userId: string) => {
  const messages = mockMessages.filter(m => m.senderId === userId || m.receiverId === userId);
  return simulateApiCall(messages);
};

export const sendMessage = async (messageData: Partial<Message>): Promise<Message> => {
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    senderId: messageData.senderId || '',
    senderName: messageData.senderName || '',
    receiverId: messageData.receiverId || '',
    receiverName: messageData.receiverName || '',
    subject: messageData.subject || '',
    content: messageData.content || '',
    timestamp: new Date().toISOString(),
    read: false,
    priority: messageData.priority || 'normal'
  };
  
  mockMessages.push(newMessage);
  return simulateApiCall(newMessage);
};

export const markMessageAsRead = async (messageId: string): Promise<Message> => {
  const messageIndex = mockMessages.findIndex(m => m.id === messageId);
  if (messageIndex === -1) throw new Error('Message not found');
  
  mockMessages[messageIndex].read = true;
  return simulateApiCall(mockMessages[messageIndex]);
};

export const deleteMessage = async (messageId: string): Promise<boolean> => {
  const messageIndex = mockMessages.findIndex(m => m.id === messageId);
  if (messageIndex === -1) throw new Error('Message not found');
  
  mockMessages.splice(messageIndex, 1);
  return simulateApiCall(true);
};

// ===================================================================
// LIBRARY API FUNCTIONS
// ===================================================================

export const getAllBooks = async () => {
  return simulateApiCall(mockBooks);
};

export const searchBooks = async (query: string, category?: string) => {
  let books = mockBooks.filter(book => 
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase())
  );
  
  if (category) {
    books = books.filter(book => book.category === category);
  }
  
  return simulateApiCall(books);
};

export const borrowBook = async (bookId: string, userId: string): Promise<Book> => {
  const bookIndex = mockBooks.findIndex(b => b.id === bookId);
  if (bookIndex === -1) throw new Error('Book not found');
  if (!mockBooks[bookIndex].available) throw new Error('Book not available');
  
  mockBooks[bookIndex].available = false;
  mockBooks[bookIndex].borrowedBy = userId;
  mockBooks[bookIndex].dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return simulateApiCall(mockBooks[bookIndex]);
};

export const returnBook = async (bookId: string): Promise<Book> => {
  const bookIndex = mockBooks.findIndex(b => b.id === bookId);
  if (bookIndex === -1) throw new Error('Book not found');
  
  mockBooks[bookIndex].available = true;
  delete mockBooks[bookIndex].borrowedBy;
  delete mockBooks[bookIndex].dueDate;
  
  return simulateApiCall(mockBooks[bookIndex]);
};

// ===================================================================
// WALLET API FUNCTIONS
// ===================================================================

export const getWalletBalance = async (userId: string) => {
  const transactions = mockWalletTransactions.filter(t => t.userId === userId);
  const balance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;
  return simulateApiCall({ balance, currency: 'USD' });
};

export const getWalletTransactions = async (userId: string, limit?: number) => {
  const transactions = mockWalletTransactions
    .filter(t => t.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return simulateApiCall(limit ? transactions.slice(0, limit) : transactions);
};

export const addWalletTransaction = async (transactionData: Partial<WalletTransaction>): Promise<WalletTransaction> => {
  const userId = transactionData.userId || '';
  const currentBalance = (await getWalletBalance(userId)).balance;
  
  const newTransaction: WalletTransaction = {
    id: `tx-${Date.now()}`,
    userId,
    type: transactionData.type || 'debit',
    amount: transactionData.amount || 0,
    description: transactionData.description || '',
    category: transactionData.category || 'fees',
    timestamp: new Date().toISOString(),
    balance: transactionData.type === 'credit' 
      ? currentBalance + (transactionData.amount || 0)
      : currentBalance - (transactionData.amount || 0),
    status: 'completed'
  };
  
  mockWalletTransactions.push(newTransaction);
  return simulateApiCall(newTransaction);
};

// ===================================================================
// SERVICES API FUNCTIONS
// ===================================================================

export const getAllServiceRequests = async (userId?: string) => {
  const requests = userId 
    ? mockServiceRequests.filter(r => r.userId === userId)
    : mockServiceRequests;
  return simulateApiCall(requests);
};

export const createServiceRequest = async (requestData: Partial<ServiceRequest>): Promise<ServiceRequest> => {
  const newRequest: ServiceRequest = {
    id: `service-${Date.now()}`,
    userId: requestData.userId || '',
    serviceType: requestData.serviceType || 'technical',
    title: requestData.title || '',
    description: requestData.description || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    priority: requestData.priority || 'medium'
  };
  
  mockServiceRequests.push(newRequest);
  return simulateApiCall(newRequest);
};

export const updateServiceRequest = async (requestId: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> => {
  const requestIndex = mockServiceRequests.findIndex(r => r.id === requestId);
  if (requestIndex === -1) throw new Error('Service request not found');
  
  mockServiceRequests[requestIndex] = { ...mockServiceRequests[requestIndex], ...updates };
  return simulateApiCall(mockServiceRequests[requestIndex]);
};

// ===================================================================
// REPORTS API FUNCTIONS
// ===================================================================

export const getAllReports = async (type?: string) => {
  const reports = type 
    ? mockReports.filter(r => r.type === type)
    : mockReports;
  return simulateApiCall(reports);
};

export const generateReport = async (reportData: Partial<Report>): Promise<Report> => {
  const newReport: Report = {
    id: `report-${Date.now()}`,
    title: reportData.title || '',
    type: reportData.type || 'attendance',
    generatedBy: reportData.generatedBy || '',
    generatedAt: new Date().toISOString(),
    data: reportData.data || {},
    period: reportData.period || '',
    format: reportData.format || 'pdf',
    status: 'generating'
  };
  
  mockReports.push(newReport);
  
  // Simulate report generation delay
  setTimeout(() => {
    newReport.status = 'ready';
  }, 2000);
  
  return simulateApiCall(newReport);
};

// ===================================================================
// ANNOUNCEMENTS API FUNCTIONS
// ===================================================================

export const getAllAnnouncements = async () => {
  return simulateApiCall(mockAnnouncements);
};

export const createAnnouncement = async (announcementData: Partial<Announcement>): Promise<Announcement> => {
  const newAnnouncement: Announcement = {
    id: `announcement-${Date.now()}`,
    title: announcementData.title || '',
    content: announcementData.content || '',
    classId: announcementData.classId,
    createdBy: announcementData.createdBy || '',
    createdAt: new Date().toISOString(),
    authorName: announcementData.authorName || ''
  };
  
  mockAnnouncements.push(newAnnouncement);
  return simulateApiCall(newAnnouncement);
};

export const updateAnnouncement = async (announcementId: string, updates: Partial<Announcement>): Promise<Announcement> => {
  const announcementIndex = mockAnnouncements.findIndex(a => a.id === announcementId);
  if (announcementIndex === -1) throw new Error('Announcement not found');
  
  mockAnnouncements[announcementIndex] = { ...mockAnnouncements[announcementIndex], ...updates };
  return simulateApiCall(mockAnnouncements[announcementIndex]);
};

export const deleteAnnouncement = async (announcementId: string): Promise<boolean> => {
  const announcementIndex = mockAnnouncements.findIndex(a => a.id === announcementId);
  if (announcementIndex === -1) throw new Error('Announcement not found');
  
  mockAnnouncements.splice(announcementIndex, 1);
  return simulateApiCall(true);
};

// ===================================================================
// NOTIFICATIONS API FUNCTIONS
// ===================================================================

export const createNotification = async (notificationData: Partial<Notification>): Promise<Notification> => {
  const newNotification: Notification = {
    id: `notification-${Date.now()}`,
    title: notificationData.title || '',
    message: notificationData.message || '',
    type: notificationData.type || 'info',
    read: false,
    createdAt: new Date().toISOString(),
    userId: notificationData.userId || ''
  };
  
  mockNotifications.push(newNotification);
  return simulateApiCall(newNotification);
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
  if (notificationIndex === -1) throw new Error('Notification not found');
  
  mockNotifications[notificationIndex].read = true;
  return simulateApiCall(mockNotifications[notificationIndex]);
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  mockNotifications
    .filter(n => n.userId === userId && !n.read)
    .forEach(n => n.read = true);
  
  return simulateApiCall(true);
};





