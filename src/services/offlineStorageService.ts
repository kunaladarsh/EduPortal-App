// Offline Storage Service for PWA functionality
import { openDB, IDBPDatabase, IDBPTransaction } from 'idb';

const DB_NAME = 'ClassroomAppDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  ATTENDANCE: 'attendance',
  GRADES: 'grades',
  ANNOUNCEMENTS: 'announcements',
  CLASSES: 'classes',
  PROFILE: 'profile',
  CALENDAR: 'calendar',
  PENDING_SYNC: 'pendingSync'
} as const;

interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
  timestamp: number;
  synced: boolean;
}

interface GradeRecord {
  id: string;
  studentId: string;
  classId: string;
  assignmentId: string;
  grade: number;
  maxGrade: number;
  timestamp: number;
  synced: boolean;
}

interface AnnouncementRecord {
  id: string;
  title: string;
  content: string;
  authorId: string;
  classId?: string;
  timestamp: number;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

interface ClassRecord {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  students: string[];
  schedule: {
    day: string;
    time: string;
  }[];
  timestamp: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: 'class' | 'assignment' | 'exam' | 'event';
  classId?: string;
  timestamp: number;
}

interface PendingSyncItem {
  id: string;
  type: 'attendance' | 'grades' | 'announcement';
  data: any;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  timestamp: number;
  retries: number;
}

class OfflineStorageService {
  private db: IDBPDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction) {
          console.log('Upgrading database from', oldVersion, 'to', newVersion);

          // Attendance store
          if (!db.objectStoreNames.contains(STORES.ATTENDANCE)) {
            const attendanceStore = db.createObjectStore(STORES.ATTENDANCE, { keyPath: 'id' });
            attendanceStore.createIndex('classId', 'classId');
            attendanceStore.createIndex('date', 'date');
            attendanceStore.createIndex('studentId', 'studentId');
            attendanceStore.createIndex('synced', 'synced');
          }

          // Grades store
          if (!db.objectStoreNames.contains(STORES.GRADES)) {
            const gradesStore = db.createObjectStore(STORES.GRADES, { keyPath: 'id' });
            gradesStore.createIndex('studentId', 'studentId');
            gradesStore.createIndex('classId', 'classId');
            gradesStore.createIndex('synced', 'synced');
          }

          // Announcements store
          if (!db.objectStoreNames.contains(STORES.ANNOUNCEMENTS)) {
            const announcementsStore = db.createObjectStore(STORES.ANNOUNCEMENTS, { keyPath: 'id' });
            announcementsStore.createIndex('classId', 'classId');
            announcementsStore.createIndex('timestamp', 'timestamp');
            announcementsStore.createIndex('priority', 'priority');
          }

          // Classes store
          if (!db.objectStoreNames.contains(STORES.CLASSES)) {
            const classesStore = db.createObjectStore(STORES.CLASSES, { keyPath: 'id' });
            classesStore.createIndex('teacherId', 'teacherId');
            classesStore.createIndex('subject', 'subject');
          }

          // Profile store
          if (!db.objectStoreNames.contains(STORES.PROFILE)) {
            db.createObjectStore(STORES.PROFILE, { keyPath: 'userId' });
          }

          // Calendar store
          if (!db.objectStoreNames.contains(STORES.CALENDAR)) {
            const calendarStore = db.createObjectStore(STORES.CALENDAR, { keyPath: 'id' });
            calendarStore.createIndex('date', 'date');
            calendarStore.createIndex('type', 'type');
            calendarStore.createIndex('classId', 'classId');
          }

          // Pending sync store
          if (!db.objectStoreNames.contains(STORES.PENDING_SYNC)) {
            const pendingSyncStore = db.createObjectStore(STORES.PENDING_SYNC, { keyPath: 'id' });
            pendingSyncStore.createIndex('type', 'type');
            pendingSyncStore.createIndex('timestamp', 'timestamp');
          }
        },
      });

      console.log('Offline storage initialized successfully');
    } catch (error) {
      console.error('Failed to initialize offline storage:', error);
      throw error;
    }
  }

  // Attendance methods
  async saveAttendance(record: AttendanceRecord): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.put(STORES.ATTENDANCE, record);
      console.log('Attendance record saved offline:', record.id);

      // Add to pending sync if not synced
      if (!record.synced) {
        await this.addToPendingSync({
          id: `attendance-${record.id}`,
          type: 'attendance',
          data: record,
          endpoint: '/api/attendance',
          method: 'POST',
          timestamp: Date.now(),
          retries: 0
        });
      }
    } catch (error) {
      console.error('Failed to save attendance record:', error);
      throw error;
    }
  }

  async getAttendanceByClass(classId: string): Promise<AttendanceRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const records = await this.db.getAllFromIndex(STORES.ATTENDANCE, 'classId', classId);
      return records;
    } catch (error) {
      console.error('Failed to get attendance records:', error);
      return [];
    }
  }

  async getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const records = await this.db.getAllFromIndex(STORES.ATTENDANCE, 'date', date);
      return records;
    } catch (error) {
      console.error('Failed to get attendance by date:', error);
      return [];
    }
  }

  // Grades methods
  async saveGrade(record: GradeRecord): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.put(STORES.GRADES, record);
      console.log('Grade record saved offline:', record.id);

      if (!record.synced) {
        await this.addToPendingSync({
          id: `grades-${record.id}`,
          type: 'grades',
          data: record,
          endpoint: '/api/grades',
          method: 'POST',
          timestamp: Date.now(),
          retries: 0
        });
      }
    } catch (error) {
      console.error('Failed to save grade record:', error);
      throw error;
    }
  }

  async getGradesByStudent(studentId: string): Promise<GradeRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const records = await this.db.getAllFromIndex(STORES.GRADES, 'studentId', studentId);
      return records;
    } catch (error) {
      console.error('Failed to get grades by student:', error);
      return [];
    }
  }

  async getGradesByClass(classId: string): Promise<GradeRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const records = await this.db.getAllFromIndex(STORES.GRADES, 'classId', classId);
      return records;
    } catch (error) {
      console.error('Failed to get grades by class:', error);
      return [];
    }
  }

  // Announcements methods
  async saveAnnouncement(record: AnnouncementRecord): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.put(STORES.ANNOUNCEMENTS, record);
      console.log('Announcement saved offline:', record.id);
    } catch (error) {
      console.error('Failed to save announcement:', error);
      throw error;
    }
  }

  async getAnnouncements(): Promise<AnnouncementRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const records = await this.db.getAll(STORES.ANNOUNCEMENTS);
      return records.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to get announcements:', error);
      return [];
    }
  }

  async getAnnouncementsByClass(classId: string): Promise<AnnouncementRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const records = await this.db.getAllFromIndex(STORES.ANNOUNCEMENTS, 'classId', classId);
      return records.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to get announcements by class:', error);
      return [];
    }
  }

  // Classes methods
  async saveClass(record: ClassRecord): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.put(STORES.CLASSES, record);
      console.log('Class saved offline:', record.id);
    } catch (error) {
      console.error('Failed to save class:', error);
      throw error;
    }
  }

  async getClasses(): Promise<ClassRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const records = await this.db.getAll(STORES.CLASSES);
      return records;
    } catch (error) {
      console.error('Failed to get classes:', error);
      return [];
    }
  }

  async getClassesByTeacher(teacherId: string): Promise<ClassRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const records = await this.db.getAllFromIndex(STORES.CLASSES, 'teacherId', teacherId);
      return records;
    } catch (error) {
      console.error('Failed to get classes by teacher:', error);
      return [];
    }
  }

  // Calendar methods
  async saveCalendarEvent(event: CalendarEvent): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.put(STORES.CALENDAR, event);
      console.log('Calendar event saved offline:', event.id);
    } catch (error) {
      console.error('Failed to save calendar event:', error);
      throw error;
    }
  }

  async getCalendarEvents(date?: string): Promise<CalendarEvent[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      if (date) {
        const records = await this.db.getAllFromIndex(STORES.CALENDAR, 'date', date);
        return records;
      } else {
        const records = await this.db.getAll(STORES.CALENDAR);
        return records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
    } catch (error) {
      console.error('Failed to get calendar events:', error);
      return [];
    }
  }

  // Profile methods
  async saveProfile(userId: string, profile: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.put(STORES.PROFILE, { userId, ...profile });
      console.log('Profile saved offline:', userId);
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    }
  }

  async getProfile(userId: string): Promise<any | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const profile = await this.db.get(STORES.PROFILE, userId);
      return profile || null;
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
  }

  // Pending sync methods
  async addToPendingSync(item: PendingSyncItem): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.put(STORES.PENDING_SYNC, item);
      console.log('Added to pending sync:', item.id);

      // Register background sync if available
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register(`${item.type}-sync`);
      }
    } catch (error) {
      console.error('Failed to add to pending sync:', error);
      throw error;
    }
  }

  async getPendingSyncItems(type?: string): Promise<PendingSyncItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      if (type) {
        const items = await this.db.getAllFromIndex(STORES.PENDING_SYNC, 'type', type);
        return items;
      } else {
        const items = await this.db.getAll(STORES.PENDING_SYNC);
        return items.sort((a, b) => a.timestamp - b.timestamp);
      }
    } catch (error) {
      console.error('Failed to get pending sync items:', error);
      return [];
    }
  }

  async removePendingSyncItem(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.delete(STORES.PENDING_SYNC, id);
      console.log('Removed from pending sync:', id);
    } catch (error) {
      console.error('Failed to remove pending sync item:', error);
      throw error;
    }
  }

  // Utility methods
  async clearStore(storeName: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.clear(storeName);
      console.log('Cleared store:', storeName);
    } catch (error) {
      console.error('Failed to clear store:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const storeNames = Object.values(STORES);
      await Promise.all(storeNames.map(store => this.clearStore(store)));
      console.log('All offline data cleared');
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }

  async getStorageSize(): Promise<{ [key: string]: number }> {
    if (!this.db) throw new Error('Database not initialized');

    const sizes: { [key: string]: number } = {};

    try {
      for (const storeName of Object.values(STORES)) {
        const records = await this.db.getAll(storeName);
        sizes[storeName] = records.length;
      }
      return sizes;
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return {};
    }
  }
}

// Export singleton instance
export const offlineStorageService = new OfflineStorageService();

// Initialize on import
offlineStorageService.init().catch(console.error);