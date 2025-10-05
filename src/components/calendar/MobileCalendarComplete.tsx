import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { useFeatures } from "../../contexts/FeatureContext";
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
import { ScrollArea } from "../ui/scroll-area";
import {
  Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight,
  ArrowLeft, Search, Bell, BookOpen, Video, FileText, Award,
  Coffee, AlertCircle, Settings, Star, Edit, Trash2, Share2,
  Download, Filter, MoreVertical, Repeat, CheckCircle, X,
  CalendarDays, List, Grid, Zap, Target, Home, TrendingUp, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

// Import centralized calendar hook
import { useEventsWithSearch } from "../../hooks/useSchoolData";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  endTime?: string;
  location?: string;
  type: "class" | "exam" | "meeting" | "event" | "holiday" | "assignment" | "deadline" | "personal";
  priority: "low" | "medium" | "high" | "urgent";
  status: "confirmed" | "tentative" | "cancelled" | "completed";
  organizer?: string;
  attendees?: number;
  isOnline?: boolean;
  reminder?: boolean;
  isRecurring?: boolean;
  notes?: string;
  canEdit?: boolean;
  color?: string;
}

interface MobileCalendarCompleteProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export const MobileCalendarComplete: React.FC<MobileCalendarCompleteProps> = ({ 
  onPageChange, 
  onBack 
}) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useFeatures();
  
  // Use centralized events data
  const { 
    items: events, 
    loading, 
    error, 
    create, 
    update, 
    remove,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    refetch
  } = useEventsWithSearch();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">("month");
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: "event",
    priority: "medium",
    status: "confirmed",
    reminder: true,
    isRecurring: false
  });

  // Enhanced events data with UI properties
  const enhancedEvents = events.map(event => ({
    ...event,
    priority: "medium" as const,
    status: "confirmed" as const,
    organizer: user?.name || "Organizer",
    attendees: Math.floor(Math.random() * 30) + 5,
    isOnline: Math.random() > 0.5,
    reminder: true,
    canEdit: user?.role !== "student",
    color: ["#7C3AED", "#F59E0B", "#10B981", "#EF4444", "#3B82F6"][Math.floor(Math.random() * 5)]
  }));

  // Add loading state
  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
          <h3 className="text-lg font-semibold mb-2">Loading Calendar</h3>
          <p className="text-muted-foreground">Fetching your events...</p>
        </motion.div>
      </div>
    );
  }

  // Sample fallback events data for enhanced UI features
  const sampleEvents: Event[] = [
    {
      id: "1",
      title: "Mathematics Class",
      description: "Advanced Calculus - Chapter 5",
      date: "2024-01-15",
      time: "09:00",
      endTime: "10:30",
      location: "Room 101",
      type: "class",
      priority: "high",
      status: "confirmed",
      organizer: "Prof. Johnson",
      attendees: 30,
      isOnline: false,
      reminder: true,
      canEdit: user?.role !== "student",
      color: "#7C3AED"
    },
    {
      id: "2",
      title: "Physics Exam",
      description: "Mid-term examination covering chapters 1-6",
      date: "2024-01-18",
      time: "14:00",
      endTime: "16:00",
      location: "Exam Hall A",
      type: "exam",
      priority: "urgent",
      status: "confirmed",
      organizer: "Prof. Smith",
      attendees: 45,
      isOnline: false,
      reminder: true,
      canEdit: user?.role !== "student",
      color: "#EF4444"
    },
    {
      id: "3",
      title: "Parent-Teacher Meeting",
      description: "Discuss student progress and upcoming events",
      date: "2024-01-20",
      time: "16:00",
      endTime: "18:00",
      location: "Conference Room",
      type: "meeting",
      priority: "medium",
      status: "confirmed",
      organizer: "Admin",
      attendees: 20,
      isOnline: true,
      reminder: true,
      canEdit: user?.role === "admin",
      color: "#0EA5E9"
    },
    {
      id: "4",
      title: "Science Project Deadline",
      description: "Submit final reports for the science project",
      date: "2024-01-22",
      time: "23:59",
      location: "Online Submission",
      type: "deadline",
      priority: "high",
      status: "confirmed",
      isOnline: true,
      reminder: true,
      canEdit: user?.role !== "student",
      color: "#F59E0B"
    },
    {
      id: "5",
      title: "Winter Break",
      description: "School holiday - Winter vacation",
      date: "2024-01-25",
      time: "00:00",
      endTime: "23:59",
      type: "holiday",
      priority: "low",
      status: "confirmed",
      canEdit: user?.role === "admin",
      color: "#10B981"
    }
  ];

  const getEventTypeIcon = (type: Event["type"]) => {
    switch (type) {
      case "class": return BookOpen;
      case "exam": return FileText;
      case "meeting": return Users;
      case "event": return Calendar;
      case "holiday": return Coffee;
      case "assignment": return Edit;
      case "deadline": return AlertCircle;
      case "personal": return Star;
      default: return Calendar;
    }
  };

  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "class": return "bg-primary text-primary-foreground";
      case "exam": return "bg-destructive text-destructive-foreground";
      case "meeting": return "bg-secondary text-secondary-foreground";
      case "event": return "bg-accent text-accent-foreground";
      case "holiday": return "bg-green-500 text-white";
      case "assignment": return "bg-orange-500 text-white";
      case "deadline": return "bg-red-500 text-white";
      case "personal": return "bg-purple-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: Event["priority"]) => {
    switch (priority) {
      case "urgent": return "border-l-4 border-red-500";
      case "high": return "border-l-4 border-orange-500";
      case "medium": return "border-l-4 border-blue-500";
      case "low": return "border-l-4 border-green-500";
      default: return "border-l-4 border-gray-500";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const filterEvents = (events: Event[]) => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (eventFilter !== "all") {
      filtered = filtered.filter(event => event.type === eventFilter);
    }

    return filtered;
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title!,
      description: newEvent.description,
      date: newEvent.date!,
      time: newEvent.time!,
      endTime: newEvent.endTime,
      location: newEvent.location,
      type: newEvent.type as Event["type"],
      priority: newEvent.priority as Event["priority"],
      status: newEvent.status as Event["status"],
      organizer: user?.name,
      reminder: newEvent.reminder,
      isRecurring: newEvent.isRecurring,
      notes: newEvent.notes,
      canEdit: true,
      color: newEvent.color || "#7C3AED"
    };

    setEvents([...events, event]);
    setNewEvent({
      type: "event",
      priority: "medium",
      status: "confirmed",
      reminder: true,
      isRecurring: false
    });
    setShowCreateEvent(false);
    toast.success("Event created successfully!");
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setNewEvent(event);
    setShowCreateEvent(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    setShowEventDialog(false);
    toast.success("Event deleted successfully!");
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-border/30" />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          className={`h-24 border border-border/30 p-1 cursor-pointer transition-colors
            ${isToday ? 'bg-primary/10 border-primary/50' : ''}
            ${isSelected ? 'bg-secondary/10 border-secondary/50' : ''}
            hover:bg-muted/50`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm mb-1
            ${isToday ? 'bg-primary text-primary-foreground' : ''}
            ${isSelected ? 'bg-secondary text-secondary-foreground' : ''}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
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
    }

    return days;
  };

  const renderAgendaView = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingEvents = events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4 p-4">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground">
                You have no events scheduled for the next week
              </p>
            </div>
          ) : (
            upcomingEvents.map(event => {
              const Icon = getEventTypeIcon(event.type);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 ${getPriorityColor(event.priority)}`}
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventDialog(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(event.date))}
                        </p>
                      </div>
                    </div>
                    <Badge variant={event.priority === "urgent" ? "destructive" : "secondary"}>
                      {event.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(event.time)}</span>
                      {event.endTime && <span>- {formatTime(event.endTime)}</span>}
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      {event.isOnline && (
                        <Badge variant="outline" className="text-xs">
                          <Video className="w-3 h-3 mr-1" />
                          Online
                        </Badge>
                      )}
                      {event.reminder && (
                        <Badge variant="outline" className="text-xs">
                          <Bell className="w-3 h-3 mr-1" />
                          Reminder
                        </Badge>
                      )}
                    </div>
                    {event.attendees && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{event.attendees}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Calendar</h1>
              <p className="text-sm text-muted-foreground">
                {formatDate(currentDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2"
            >
              <Filter className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateEvent(true)}
              className="p-2"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Select value={eventFilter} onValueChange={setEventFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="class">Classes</SelectItem>
                    <SelectItem value="exam">Exams</SelectItem>
                    <SelectItem value="meeting">Meetings</SelectItem>
                    <SelectItem value="assignment">Assignments</SelectItem>
                    <SelectItem value="deadline">Deadlines</SelectItem>
                    <SelectItem value="holiday">Holidays</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
          <TabsList className="w-full mx-4 mb-4">
            <TabsTrigger value="month" className="flex-1">
              <Grid className="w-4 h-4 mr-1" />
              Month
            </TabsTrigger>
            <TabsTrigger value="agenda" className="flex-1">
              <List className="w-4 h-4 mr-1" />
              Agenda
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Calendar Navigation */}
      {viewMode === "month" && (
        <div className="flex items-center justify-between p-4 bg-card/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-medium">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Calendar Content */}
      <div className="pb-20">
        {viewMode === "month" ? (
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendarGrid()}
            </div>
          </div>
        ) : (
          renderAgendaView()
        )}
      </div>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedEvent && (
                <>
                  {React.createElement(getEventTypeIcon(selectedEvent.type), { className: "w-5 h-5" })}
                  <span>{selectedEvent.title}</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              View event details and manage your calendar entry
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getEventTypeColor(selectedEvent.type)}>
                  {selectedEvent.type}
                </Badge>
                <Badge variant={selectedEvent.priority === "urgent" ? "destructive" : "secondary"}>
                  {selectedEvent.priority}
                </Badge>
              </div>

              {selectedEvent.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{formatDate(new Date(selectedEvent.date))}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{formatTime(selectedEvent.time)}</span>
                  {selectedEvent.endTime && <span>- {formatTime(selectedEvent.endTime)}</span>}
                </div>
                {selectedEvent.location && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
                {selectedEvent.organizer && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedEvent.organizer}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {selectedEvent.isOnline && (
                  <Badge variant="outline" className="text-xs">
                    <Video className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                )}
                {selectedEvent.reminder && (
                  <Badge variant="outline" className="text-xs">
                    <Bell className="w-3 h-3 mr-1" />
                    Reminder
                  </Badge>
                )}
                {selectedEvent.isRecurring && (
                  <Badge variant="outline" className="text-xs">
                    <Repeat className="w-3 h-3 mr-1" />
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
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEvent(selectedEvent)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Event Dialog */}
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent ? "Update event details" : "Add a new event to your calendar"}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-96">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newEvent.title || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Event description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newEvent.endTime || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEvent.location || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Event location"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) => setNewEvent({ ...newEvent, type: value as Event["type"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newEvent.priority}
                    onValueChange={(value) => setNewEvent({ ...newEvent, priority: value as Event["priority"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reminder">Reminder</Label>
                  <Switch
                    id="reminder"
                    checked={newEvent.reminder}
                    onCheckedChange={(checked) => setNewEvent({ ...newEvent, reminder: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="recurring">Recurring</Label>
                  <Switch
                    id="recurring"
                    checked={newEvent.isRecurring}
                    onCheckedChange={(checked) => setNewEvent({ ...newEvent, isRecurring: checked })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newEvent.notes || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>
            </div>
          </ScrollArea>

          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateEvent(false);
                setSelectedEvent(null);
                setNewEvent({
                  type: "event",
                  priority: "medium",
                  status: "confirmed",
                  reminder: true,
                  isRecurring: false
                });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateEvent} className="flex-1">
              {selectedEvent ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};