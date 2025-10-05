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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight,
  ArrowLeft, Search, Bell, BookOpen, Video, FileText, Award,
  Coffee, AlertCircle, GraduationCap, Home, Edit, Trash2, Share2,
  Download, Filter, Settings, Star, Globe, Repeat, Zap, Target
} from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  endTime?: string;
  location?: string;
  type: "class" | "exam" | "meeting" | "event" | "holiday" | "assignment" | "break" | "personal";
  color: string;
  attendees?: string[];
  organizer?: string;
  isOnline?: boolean;
  reminder?: boolean;
  isRecurring?: boolean;
  priority: "low" | "medium" | "high";
  status: "confirmed" | "tentative" | "cancelled";
  attachments?: string[];
  notes?: string;
  createdBy?: string;
  canEdit?: boolean;
}

interface MobileCalendarEnhancedProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileCalendarEnhanced: React.FC<MobileCalendarEnhancedProps> = ({
  onPageChange,
  onBack
}) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"month" | "week" | "day" | "agenda" | "create" | "edit">("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState<"calendar" | "timeline" | "list">("calendar");
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock events data with comprehensive information
  const mockEvents: Event[] = [
    {
      id: "1",
      title: "Advanced Mathematics",
      description: "Calculus and differential equations lecture",
      date: "2024-01-22",
      time: "09:00",
      endTime: "10:30",
      location: "Room 101",
      type: "class",
      color: "bg-blue-500",
      attendees: ["student1", "student2", "student3"],
      organizer: "Ms. Johnson",
      reminder: true,
      priority: "medium",
      status: "confirmed",
      createdBy: "teacher1",
      canEdit: true
    },
    {
      id: "2",
      title: "Physics Lab Practical Exam",
      description: "Comprehensive practical examination on motion, forces, and energy",
      date: "2024-01-23",
      time: "14:00",
      endTime: "16:00",
      location: "Physics Laboratory",
      type: "exam",
      color: "bg-red-500",
      attendees: ["student1", "student2"],
      organizer: "Dr. Smith",
      reminder: true,
      priority: "high",
      status: "confirmed",
      notes: "Bring calculator and lab notebook",
      createdBy: "teacher2",
      canEdit: true
    },
    {
      id: "3",
      title: "Parent-Teacher Conference",
      description: "Quarterly progress discussion and feedback session",
      date: "2024-01-24",
      time: "15:00",
      endTime: "17:00",
      location: "Conference Room A",
      type: "meeting",
      color: "bg-purple-500",
      attendees: ["parent1", "parent2"],
      organizer: "Administration",
      reminder: true,
      priority: "medium",
      status: "confirmed",
      createdBy: "admin1",
      canEdit: false
    },
    {
      id: "4",
      title: "Online Chemistry Session",
      description: "Organic chemistry fundamentals and molecular structures",
      date: "2024-01-22",
      time: "11:00",
      endTime: "12:30",
      type: "class",
      color: "bg-green-500",
      attendees: ["student1", "student3"],
      organizer: "Dr. Brown",
      isOnline: true,
      reminder: true,
      priority: "medium",
      status: "confirmed",
      createdBy: "teacher3",
      canEdit: true
    },
    {
      id: "5",
      title: "Literature Essay Due",
      description: "Shakespeare analysis essay submission deadline",
      date: "2024-01-25",
      time: "23:59",
      type: "assignment",
      color: "bg-orange-500",
      organizer: "Mr. Wilson",
      reminder: true,
      priority: "high",
      status: "confirmed",
      notes: "Submit via online portal",
      createdBy: "teacher4",
      canEdit: false
    },
    {
      id: "6",
      title: "Science Fair Exhibition",
      description: "Annual student science project showcase",
      date: "2024-01-26",
      time: "10:00",
      endTime: "15:00",
      location: "Main Auditorium",
      type: "event",
      color: "bg-cyan-500",
      attendees: ["student1", "student2", "student3"],
      organizer: "Science Department",
      reminder: true,
      priority: "medium",
      status: "confirmed",
      createdBy: "admin2",
      canEdit: false
    }
  ];

  const eventTypes = [
    { value: "all", label: "All Events" },
    { value: "class", label: "Classes" },
    { value: "exam", label: "Exams" },
    { value: "meeting", label: "Meetings" },
    { value: "event", label: "Events" },
    { value: "assignment", label: "Assignments" },
    { value: "personal", label: "Personal" }
  ];

  const priorityColors = {
    low: "text-green-600 bg-green-50 border-green-200",
    medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    high: "text-red-600 bg-red-50 border-red-200"
  };

  const statusColors = {
    confirmed: "text-green-600 bg-green-50 border-green-200",
    tentative: "text-yellow-600 bg-yellow-50 border-yellow-200",
    cancelled: "text-red-600 bg-red-50 border-red-200"
  };

  const today = new Date();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Calendar calculation functions
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays: (Date | null)[] = [];
  
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day));
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return mockEvents.filter(event => event.date === dateStr);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "class": return <BookOpen className="h-4 w-4" />;
      case "exam": return <FileText className="h-4 w-4" />;
      case "meeting": return <Users className="h-4 w-4" />;
      case "event": return <Award className="h-4 w-4" />;
      case "holiday": return <Home className="h-4 w-4" />;
      case "assignment": return <AlertCircle className="h-4 w-4" />;
      case "break": return <Coffee className="h-4 w-4" />;
      case "personal": return <Star className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "class": return "bg-blue-50 text-blue-600 border-blue-200";
      case "exam": return "bg-red-50 text-red-600 border-red-200";
      case "meeting": return "bg-purple-50 text-purple-600 border-purple-200";
      case "event": return "bg-green-50 text-green-600 border-green-200";
      case "holiday": return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "assignment": return "bg-orange-50 text-orange-600 border-orange-200";
      case "break": return "bg-gray-50 text-gray-600 border-gray-200";
      case "personal": return "bg-pink-50 text-pink-600 border-pink-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction: number) => {
    setSelectedDate(new Date(currentYear, currentMonth + direction, 1));
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  const navigateDay = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || event.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const handleCreateEvent = () => {
    toast.success("Event created successfully!");
    setCurrentView("month");
  };

  const handleEditEvent = () => {
    toast.success("Event updated successfully!");
    setIsEditing(false);
    setShowEventDialog(false);
  };

  const handleDeleteEvent = () => {
    toast.success("Event deleted successfully!");
    setShowEventDialog(false);
    setSelectedEvent(null);
  };

  const renderEventForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          placeholder="Enter event title"
          defaultValue={selectedEvent?.title}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Event description..."
          rows={3}
          defaultValue={selectedEvent?.description}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            defaultValue={selectedEvent?.date || formatDate(selectedDate)}
          />
        </div>
        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            defaultValue={selectedEvent?.time}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            defaultValue={selectedEvent?.endTime}
          />
        </div>
        <div>
          <Label htmlFor="type">Type *</Label>
          <Select defaultValue={selectedEvent?.type || "class"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.slice(1).map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Event location or online"
          defaultValue={selectedEvent?.location}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select defaultValue={selectedEvent?.priority || "medium"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={selectedEvent?.status || "confirmed"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="tentative">Tentative</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="reminder" defaultChecked={selectedEvent?.reminder} />
        <Label htmlFor="reminder">Set reminder notification</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="online" defaultChecked={selectedEvent?.isOnline} />
        <Label htmlFor="online">Online event</Label>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes..."
          rows={2}
          defaultValue={selectedEvent?.notes}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            setCurrentView("month");
            setIsEditing(false);
            setSelectedEvent(null);
          }}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-gradient-to-r from-primary to-secondary"
          onClick={isEditing ? handleEditEvent : handleCreateEvent}
        >
          {isEditing ? "Update" : "Create"} Event
        </Button>
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div className="space-y-6">
      {/* Month Navigation */}
      <Card className="border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(-1)}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(1)}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={index} className="h-20" />;
                }

                const isToday = formatDate(date) === formatDate(today);
                const dayEvents = getEventsForDate(date);
                
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.95 }}
                    className={`h-20 p-1 border border-border rounded-lg cursor-pointer transition-colors
                      ${isToday ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}
                    `}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className={`text-sm font-medium mb-1 
                      ${isToday ? 'text-primary' : 'text-foreground'}
                    `}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded truncate ${event.color} text-white`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setShowEventDialog(true);
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getEventsForDate(today).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No events scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getEventsForDate(today).map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventDialog(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getEventIcon(event.type)}
                      <span className="font-medium">{event.title}</span>
                    </div>
                    <Badge className={getTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                      {event.endTime && ` - ${event.endTime}`}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAgendaView = () => (
    <div className="space-y-4">
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Events Found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedType !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "No events scheduled. Create your first event!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 0.98 }}
          >
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent 
                className="p-4"
                onClick={() => {
                  setSelectedEvent(event);
                  setShowEventDialog(true);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge className={priorityColors[event.priority]}>
                    {event.priority}
                  </Badge>
                </div>

                {event.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {event.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                    {event.endTime && ` - ${event.endTime}`}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                  )}
                  {event.organizer && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.organizer}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    {event.isOnline && (
                      <Badge variant="outline" className="text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    )}
                    {event.reminder && (
                      <Badge variant="outline" className="text-xs">
                        <Bell className="h-3 w-3 mr-1" />
                        Reminder
                      </Badge>
                    )}
                    {event.isRecurring && (
                      <Badge variant="outline" className="text-xs">
                        <Repeat className="h-3 w-3 mr-1" />
                        Recurring
                      </Badge>
                    )}
                  </div>
                  <Badge className={statusColors[event.status]}>
                    {event.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Calendar</h1>
              <p className="text-sm text-muted-foreground">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setCurrentView("create")}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Tabs */}
        <Tabs value={currentView} onValueChange={(value: any) => setCurrentView(value)}>
          <TabsList className="w-full mx-4 mb-4">
            <TabsTrigger value="month" className="flex-1">Month</TabsTrigger>
            <TabsTrigger value="agenda" className="flex-1">Agenda</TabsTrigger>
            <TabsTrigger value="create" className="flex-1">Create</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        <AnimatePresence mode="wait">
          {currentView === "month" && (
            <motion.div
              key="month"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderMonthView()}
            </motion.div>
          )}
          {currentView === "agenda" && (
            <motion.div
              key="agenda"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {renderAgendaView()}
            </motion.div>
          )}
          {currentView === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Create New Event</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderEventForm()}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEvent && getEventIcon(selectedEvent.type)}
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription>
              View event details and manage your calendar entry
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getTypeColor(selectedEvent.type)}>
                  {selectedEvent.type}
                </Badge>
                <Badge className={priorityColors[selectedEvent.priority]}>
                  {selectedEvent.priority}
                </Badge>
              </div>

              {selectedEvent.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(selectedEvent.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {selectedEvent.time}
                  {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                </div>
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {selectedEvent.location}
                  </div>
                )}
                {selectedEvent.organizer && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {selectedEvent.organizer}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedEvent.isOnline && (
                  <Badge variant="outline" className="text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                )}
                {selectedEvent.reminder && (
                  <Badge variant="outline" className="text-xs">
                    <Bell className="h-3 w-3 mr-1" />
                    Reminder
                  </Badge>
                )}
                {selectedEvent.isRecurring && (
                  <Badge variant="outline" className="text-xs">
                    <Repeat className="h-3 w-3 mr-1" />
                    Recurring
                  </Badge>
                )}
              </div>

              {selectedEvent.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.notes}
                  </p>
                </div>
              )}

              {selectedEvent.canEdit && (
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(true);
                      setCurrentView("create");
                      setShowEventDialog(false);
                    }}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteEvent}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};