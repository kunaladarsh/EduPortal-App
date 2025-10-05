import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import {
  Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight,
  ArrowLeft, Search, Bell, BookOpen, Video, FileText, Award,
  Coffee, AlertCircle, Settings, Star, Edit, Trash2, Share2,
  Download, Filter, MoreVertical, Repeat, Globe, Zap, Target,
  CheckCircle, X, Calendar as CalendarIcon, ListTodo, Grid3X3
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  endTime?: string;
  location?: string;
  type: "class" | "exam" | "meeting" | "event" | "holiday" | "assignment" | "break" | "personal" | "deadline";
  color: string;
  attendees?: { id: string; name: string; role: string; status: "accepted" | "declined" | "pending" }[];
  organizer?: string;
  isOnline?: boolean;
  reminder?: { enabled: boolean; minutes: number };
  isRecurring?: boolean;
  recurringPattern?: "daily" | "weekly" | "monthly";
  priority: "low" | "medium" | "high" | "urgent";
  status: "confirmed" | "tentative" | "cancelled" | "completed";
  attachments?: { name: string; url: string }[];
  notes?: string;
  createdBy?: string;
  canEdit?: boolean;
  tags?: string[];
  meetingUrl?: string;
  isAllDay?: boolean;
}

interface CalendarSettings {
  weekStartsOn: number; // 0 = Sunday, 1 = Monday
  timeFormat: "12" | "24";
  defaultView: "month" | "week" | "day" | "agenda";
  showWeekends: boolean;
  defaultReminder: number; // minutes
  colorTheme: "default" | "minimal" | "vibrant";
}

interface MobileCalendarProfessionalProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileCalendarProfessional: React.FC<MobileCalendarProfessionalProps> = ({ onPageChange, onBack }) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showReminders, setShowReminders] = useState(false);

  // Settings
  const [settings, setSettings] = useState<CalendarSettings>({
    weekStartsOn: 1, // Monday
    timeFormat: "12",
    defaultView: "month",
    showWeekends: true,
    defaultReminder: 15,
    colorTheme: "default"
  });

  // Mock events data with comprehensive information
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Mathematics Class",
      description: "Advanced Calculus - Chapter 5: Integration Techniques",
      date: "2024-01-25",
      time: "09:00",
      endTime: "10:30",
      location: "Room 101",
      type: "class",
      color: "#3B82F6",
      attendees: [
        { id: "1", name: "John Doe", role: "Student", status: "accepted" },
        { id: "2", name: "Jane Smith", role: "Student", status: "accepted" }
      ],
      organizer: "Prof. Wilson",
      isOnline: false,
      reminder: { enabled: true, minutes: 15 },
      isRecurring: true,
      recurringPattern: "weekly",
      priority: "medium",
      status: "confirmed",
      notes: "Bring calculator and textbook Chapter 5",
      createdBy: "Prof. Wilson",
      canEdit: user?.role === "teacher" || user?.role === "admin",
      tags: ["math", "calculus", "regular"],
      isAllDay: false
    },
    {
      id: "2",
      title: "Physics Exam",
      description: "Midterm examination covering chapters 1-8",
      date: "2024-01-26",
      time: "14:00",
      endTime: "16:00",
      location: "Examination Hall",
      type: "exam",
      color: "#EF4444",
      organizer: "Dr. Johnson",
      reminder: { enabled: true, minutes: 60 },
      priority: "high",
      status: "confirmed",
      notes: "Bring ID card and allowed calculators only",
      createdBy: "Dr. Johnson",
      canEdit: user?.role === "teacher" || user?.role === "admin",
      tags: ["physics", "exam", "midterm"],
      isAllDay: false
    },
    {
      id: "3",
      title: "Team Meeting",
      description: "Project discussion and planning session",
      date: "2024-01-27",
      time: "11:00",
      endTime: "12:00",
      location: "Conference Room A",
      type: "meeting",
      color: "#10B981",
      isOnline: true,
      meetingUrl: "https://meet.example.com/team-meeting",
      reminder: { enabled: true, minutes: 10 },
      priority: "medium",
      status: "confirmed",
      attendees: [
        { id: "3", name: "Alice Brown", role: "Team Lead", status: "accepted" },
        { id: "4", name: "Bob Wilson", role: "Developer", status: "pending" }
      ],
      notes: "Prepare progress reports",
      createdBy: "Alice Brown",
      canEdit: true,
      tags: ["meeting", "project", "team"],
      isAllDay: false
    },
    {
      id: "4",
      title: "Assignment Due",
      description: "Chemistry Lab Report submission deadline",
      date: "2024-01-28",
      time: "23:59",
      type: "deadline",
      color: "#F59E0B",
      reminder: { enabled: true, minutes: 1440 }, // 24 hours
      priority: "urgent",
      status: "confirmed",
      notes: "Submit via online portal",
      createdBy: "System",
      canEdit: false,
      tags: ["assignment", "chemistry", "deadline"],
      isAllDay: false
    },
    {
      id: "5",
      title: "School Holiday",
      description: "Winter break begins",
      date: "2024-01-29",
      time: "00:00",
      type: "holiday",
      color: "#8B5CF6",
      priority: "low",
      status: "confirmed",
      createdBy: "Administration",
      canEdit: user?.role === "admin",
      tags: ["holiday", "break"],
      isAllDay: true
    }
  ]);

  // Event type configurations
  const eventTypes = {
    class: { label: "Class", color: "#3B82F6", icon: BookOpen },
    exam: { label: "Exam", color: "#EF4444", icon: Award },
    meeting: { label: "Meeting", color: "#10B981", icon: Users },
    event: { label: "Event", color: "#8B5CF6", icon: Calendar },
    holiday: { label: "Holiday", color: "#6366F1", icon: Coffee },
    assignment: { label: "Assignment", color: "#F59E0B", icon: FileText },
    break: { label: "Break", color: "#06B6D4", icon: Coffee },
    personal: { label: "Personal", color: "#EC4899", icon: Star },
    deadline: { label: "Deadline", color: "#F59E0B", icon: AlertCircle }
  };

  const priorities = {
    low: { label: "Low", color: "#10B981" },
    medium: { label: "Medium", color: "#F59E0B" },
    high: { label: "High", color: "#EF4444" },
    urgent: { label: "Urgent", color: "#DC2626" }
  };

  // Form state for adding/editing events
  const [eventForm, setEventForm] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    type: "class",
    color: "#3B82F6",
    priority: "medium",
    reminder: { enabled: true, minutes: settings.defaultReminder },
    isRecurring: false,
    isOnline: false,
    isAllDay: false,
    notes: ""
  });

  // Calendar navigation
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  // Get filtered events based on search and category
  const getFilteredEvents = () => {
    return events.filter(event => {
      const matchesSearch = searchQuery === "" || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || event.type === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Handle event creation/editing
  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.date || !eventForm.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    const eventToSave: Event = {
      id: editingEvent?.id || Date.now().toString(),
      title: eventForm.title!,
      description: eventForm.description,
      date: eventForm.date!,
      time: eventForm.time!,
      endTime: eventForm.endTime,
      location: eventForm.location,
      type: eventForm.type as Event["type"],
      color: eventForm.color!,
      priority: eventForm.priority as Event["priority"],
      status: "confirmed",
      reminder: eventForm.reminder,
      isRecurring: eventForm.isRecurring,
      isOnline: eventForm.isOnline,
      isAllDay: eventForm.isAllDay,
      notes: eventForm.notes,
      createdBy: user?.name || "Unknown",
      canEdit: true,
      tags: eventForm.title!.toLowerCase().split(" ")
    };

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? eventToSave : e));
      toast.success("Event updated successfully");
    } else {
      setEvents([...events, eventToSave]);
      toast.success("Event created successfully");
    }

    setIsAddingEvent(false);
    setEditingEvent(null);
    setEventForm({
      title: "",
      description: "",
      date: "",
      time: "",
      endTime: "",
      location: "",
      type: "class",
      color: "#3B82F6",
      priority: "medium",
      reminder: { enabled: true, minutes: settings.defaultReminder },
      isRecurring: false,
      isOnline: false,
      isAllDay: false,
      notes: ""
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    setSelectedEvent(null);
    toast.success("Event deleted successfully");
  };

  // Generate calendar days for month view
  const generateCalendarDays = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startOfWeek = new Date(startOfMonth);
    const endOfWeek = new Date(endOfMonth);

    // Adjust for week start preference
    const weekStart = settings.weekStartsOn;
    startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() - weekStart + 7) % 7));
    endOfWeek.setDate(endOfWeek.getDate() + ((weekStart - endOfWeek.getDay() - 1 + 7) % 7));

    const days = [];
    const currentDateIterator = new Date(startOfWeek);

    while (currentDateIterator <= endOfWeek) {
      if (settings.showWeekends || (currentDateIterator.getDay() !== 0 && currentDateIterator.getDay() !== 6)) {
        days.push(new Date(currentDateIterator));
      }
      currentDateIterator.setDate(currentDateIterator.getDate() + 1);
    }

    return days;
  };

  const formatTime = (time: string) => {
    if (settings.timeFormat === "24") return time;
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get upcoming events for reminders
  const getUpcomingEvents = () => {
    const now = new Date();
    const upcoming = events.filter(event => {
      const eventDate = new Date(`${event.date}T${event.time}`);
      const timeDiff = eventDate.getTime() - now.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      return minutesDiff > 0 && minutesDiff <= (event.reminder?.minutes || 15) && event.reminder?.enabled;
    });
    return upcoming.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 bg-white/20 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-lg font-semibold">Calendar Pro</h1>
            <p className="text-white/80 text-sm">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReminders(true)}
              className="p-2 bg-white/20 rounded-xl relative"
            >
              <Bell className="w-5 h-5" />
              {getUpcomingEvents().length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="p-2 bg-white/20 rounded-xl"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex bg-white/20 rounded-xl p-1">
            {["month", "week", "day", "agenda"].map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  view === viewType ? "bg-white text-primary" : "text-white/80"
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingEvent(true)}
            className="bg-white text-primary px-4 py-2 rounded-xl font-medium"
          >
            <Plus className="w-4 h-4 mr-1 inline" />
            Add Event
          </motion.button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32 h-10">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(eventTypes).map(([key, type]) => (
                <SelectItem key={key} value={key}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-4">
        {view === "month" && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateMonth("prev")}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <h2 className="text-xl font-bold">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateMonth("next")}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => {
                  if (!settings.showWeekends && (index === 0 || index === 6)) return null;
                  return (
                    <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600">
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        min-h-20 p-2 rounded-lg cursor-pointer transition-all
                        ${isToday ? 'bg-primary text-white' : 'hover:bg-gray-50'}
                        ${!isCurrentMonth ? 'opacity-40' : ''}
                        ${selectedDate?.toDateString() === day.toDateString() ? 'ring-2 ring-primary' : ''}
                      `}
                    >
                      <div className="font-medium text-sm mb-1">{day.getDate()}</div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="text-xs p-1 rounded text-white truncate"
                            style={{ backgroundColor: event.color }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {view === "agenda" && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="w-5 h-5" />
                Agenda View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredEvents()
                  .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
                  .map((event) => {
                    const EventIcon = eventTypes[event.type]?.icon || Calendar;
                    const isUpcoming = new Date(`${event.date}T${event.time}`) > new Date();
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border-l-4 bg-white/50 hover:bg-white/80 transition-all cursor-pointer ${
                          isUpcoming ? 'border-primary' : 'border-gray-300'
                        }`}
                        style={{ borderLeftColor: event.color }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: event.color }}
                          >
                            <EventIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{event.title}</h3>
                              <Badge 
                                className="text-xs"
                                style={{ backgroundColor: priorities[event.priority].color + '20', color: priorities[event.priority].color }}
                              >
                                {priorities[event.priority].label}
                              </Badge>
                            </div>
                            {event.description && (
                              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(event.time)}
                                {event.endTime && ` - ${formatTime(event.endTime)}`}
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </div>
                              )}
                              {event.isOnline && (
                                <div className="flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  Online
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedEvent.color }}
                >
                  {React.createElement(eventTypes[selectedEvent.type]?.icon || Calendar, { className: "w-4 h-4" })}
                </div>
                <div>
                  <DialogTitle>{selectedEvent.title}</DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      className="text-xs"
                      style={{ backgroundColor: priorities[selectedEvent.priority].color + '20', color: priorities[selectedEvent.priority].color }}
                    >
                      {priorities[selectedEvent.priority].label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {eventTypes[selectedEvent.type]?.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <DialogDescription>
                View event details, manage reminders, and edit or delete the event
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedEvent.description && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Description</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Date</h4>
                  <p className="text-sm text-gray-600">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Time</h4>
                  <p className="text-sm text-gray-600">
                    {formatTime(selectedEvent.time)}
                    {selectedEvent.endTime && ` - ${formatTime(selectedEvent.endTime)}`}
                  </p>
                </div>
              </div>
              
              {selectedEvent.location && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Location</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                </div>
              )}
              
              {selectedEvent.organizer && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Organizer</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.organizer}</p>
                </div>
              )}
              
              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Attendees</h4>
                  <div className="space-y-1">
                    {selectedEvent.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between text-sm">
                        <span>{attendee.name} ({attendee.role})</span>
                        <Badge 
                          variant={attendee.status === "accepted" ? "default" : "outline"}
                          className="text-xs"
                        >
                          {attendee.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedEvent.notes && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Notes</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.notes}</p>
                </div>
              )}
              
              {selectedEvent.meetingUrl && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Meeting Link</h4>
                  <a 
                    href={selectedEvent.meetingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                {selectedEvent.canEdit && (
                  <Button 
                    onClick={() => {
                      setEditingEvent(selectedEvent);
                      setEventForm(selectedEvent);
                      setSelectedEvent(null);
                      setIsAddingEvent(true);
                    }}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {selectedEvent.canEdit && (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Event Modal */}
      {isAddingEvent && (
        <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
              <DialogDescription>
                {editingEvent ? "Make changes to your event" : "Create a new calendar event"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Event title"
                  value={eventForm.title || ""}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Event description"
                  value={eventForm.description || ""}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={eventForm.date || ""}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={eventForm.type} onValueChange={(value) => setEventForm({...eventForm, type: value as Event["type"], color: eventTypes[value as keyof typeof eventTypes]?.color || "#3B82F6"})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(eventTypes).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {React.createElement(type.icon, { className: "w-4 h-4" })}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="time">Start Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={eventForm.time || ""}
                    onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={eventForm.endTime || ""}
                    onChange={(e) => setEventForm({...eventForm, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Event location"
                  value={eventForm.location || ""}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={eventForm.priority} onValueChange={(value) => setEventForm({...eventForm, priority: value as Event["priority"]})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorities).map(([key, priority]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: priority.color }}
                          />
                          {priority.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="all-day">All Day Event</Label>
                  <Switch
                    id="all-day"
                    checked={eventForm.isAllDay || false}
                    onCheckedChange={(checked) => setEventForm({...eventForm, isAllDay: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="online">Online Event</Label>
                  <Switch
                    id="online"
                    checked={eventForm.isOnline || false}
                    onCheckedChange={(checked) => setEventForm({...eventForm, isOnline: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="recurring">Recurring Event</Label>
                  <Switch
                    id="recurring"
                    checked={eventForm.isRecurring || false}
                    onCheckedChange={(checked) => setEventForm({...eventForm, isRecurring: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reminder">Enable Reminder</Label>
                  <Switch
                    id="reminder"
                    checked={eventForm.reminder?.enabled || false}
                    onCheckedChange={(checked) => setEventForm({
                      ...eventForm, 
                      reminder: { enabled: checked, minutes: eventForm.reminder?.minutes || 15 }
                    })}
                  />
                </div>
              </div>
              
              {eventForm.reminder?.enabled && (
                <div>
                  <Label htmlFor="reminder-minutes">Reminder (minutes before)</Label>
                  <Select 
                    value={eventForm.reminder.minutes.toString()} 
                    onValueChange={(value) => setEventForm({
                      ...eventForm, 
                      reminder: { enabled: true, minutes: parseInt(value) }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="1440">1 day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes"
                  value={eventForm.notes || ""}
                  onChange={(e) => setEventForm({...eventForm, notes: e.target.value})}
                  rows={2}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveEvent} className="flex-1">
                  {editingEvent ? "Update Event" : "Create Event"}
                </Button>
                <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Calendar Settings</DialogTitle>
              <DialogDescription>
                Customize your calendar preferences
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Week Starts On</Label>
                <Select 
                  value={settings.weekStartsOn.toString()} 
                  onValueChange={(value) => setSettings({...settings, weekStartsOn: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Time Format</Label>
                <Select 
                  value={settings.timeFormat} 
                  onValueChange={(value) => setSettings({...settings, timeFormat: value as "12" | "24"})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 Hour</SelectItem>
                    <SelectItem value="24">24 Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Default View</Label>
                <Select 
                  value={settings.defaultView} 
                  onValueChange={(value) => setSettings({...settings, defaultView: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="agenda">Agenda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Show Weekends</Label>
                <Switch
                  checked={settings.showWeekends}
                  onCheckedChange={(checked) => setSettings({...settings, showWeekends: checked})}
                />
              </div>
              
              <div>
                <Label>Default Reminder</Label>
                <Select 
                  value={settings.defaultReminder.toString()} 
                  onValueChange={(value) => setSettings({...settings, defaultReminder: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button onClick={() => setShowSettings(false)} className="flex-1">
                  Save Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reminders Modal */}
      {showReminders && (
        <Dialog open={showReminders} onOpenChange={setShowReminders}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upcoming Reminders</DialogTitle>
              <DialogDescription>
                Events with active reminders
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3">
              {getUpcomingEvents().length > 0 ? (
                getUpcomingEvents().map((event) => {
                  const eventDate = new Date(`${event.date}T${event.time}`);
                  const now = new Date();
                  const timeDiff = eventDate.getTime() - now.getTime();
                  const minutesUntil = Math.round(timeDiff / (1000 * 60));
                  
                  return (
                    <div key={event.id} className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: event.color }}
                        >
                          {React.createElement(eventTypes[event.type]?.icon || Calendar, { className: "w-4 h-4" })}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-orange-600">
                            Starts in {minutesUntil} minutes
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming reminders</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};