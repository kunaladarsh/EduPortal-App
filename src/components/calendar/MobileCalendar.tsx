import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Filter,
  Search,
  Bell,
  BookOpen,
  GraduationCap,
  Coffee,
  AlertCircle,
  Video,
  FileText,
  Award,
  Home,
} from "lucide-react";
import { Input } from "../ui/input";

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  endTime?: string;
  location?: string;
  type: "class" | "exam" | "meeting" | "event" | "holiday" | "assignment" | "break";
  color: string;
  attendees?: number;
  organizer?: string;
  isOnline?: boolean;
  reminder?: boolean;
}

interface MobileCalendarProps {
  onPageChange?: (page: string) => void;
}

export const MobileCalendar: React.FC<MobileCalendarProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "class" | "exam" | "meeting" | "event">("all");

  // Mock events data
  const mockEvents: Event[] = [
    {
      id: "1",
      title: "Mathematics Class",
      description: "Algebra and Trigonometry",
      date: "2024-01-22",
      time: "09:00",
      endTime: "09:50",
      location: "Room 101",
      type: "class",
      color: "#7C3AED",
      attendees: 25,
      organizer: "Ms. Johnson"
    },
    {
      id: "2",
      title: "Physics Lab",
      description: "Motion and Forces Experiment",
      date: "2024-01-22",
      time: "11:00",
      endTime: "12:30",
      location: "Physics Lab",
      type: "class",
      color: "#0EA5E9",
      attendees: 20,
      organizer: "Dr. Smith",
      isOnline: false
    },
    {
      id: "3",
      title: "Midterm Exam - English",
      description: "Literature and Grammar",
      date: "2024-01-23",
      time: "10:00",
      endTime: "12:00",
      location: "Exam Hall A",
      type: "exam",
      color: "#EF4444",
      attendees: 30,
      organizer: "Mr. Davis"
    },
    {
      id: "4",
      title: "Parent-Teacher Meeting",
      description: "Quarterly Progress Discussion",
      date: "2024-01-24",
      time: "14:00",
      endTime: "16:00",
      location: "Conference Room",
      type: "meeting",
      color: "#10B981",
      attendees: 50,
      organizer: "Administration",
      reminder: true
    },
    {
      id: "5",
      title: "Science Fair",
      description: "Annual Science Project Exhibition",
      date: "2024-01-25",
      time: "09:00",
      endTime: "15:00",
      location: "Main Auditorium",
      type: "event",
      color: "#F59E0B",
      attendees: 200,
      organizer: "Science Department"
    },
    {
      id: "6",
      title: "Winter Break",
      description: "School Holiday",
      date: "2024-01-26",
      time: "00:00",
      endTime: "23:59",
      type: "holiday",
      color: "#8B5CF6",
      organizer: "School Calendar"
    },
    {
      id: "7",
      title: "History Assignment Due",
      description: "World War II Research Paper",
      date: "2024-01-27",
      time: "23:59",
      type: "assignment",
      color: "#FB7185",
      organizer: "Ms. Wilson"
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case "class": return <BookOpen className="h-4 w-4" />;
      case "exam": return <GraduationCap className="h-4 w-4" />;
      case "meeting": return <Users className="h-4 w-4" />;
      case "event": return <Award className="h-4 w-4" />;
      case "holiday": return <Home className="h-4 w-4" />;
      case "assignment": return <FileText className="h-4 w-4" />;
      case "break": return <Coffee className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockEvents.filter(event => event.date === dateStr);
  };

  const getTodayEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return mockEvents.filter(event => event.date === today);
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return mockEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > today && eventDate <= nextWeek;
    }).slice(0, 5);
  };

  const filteredEvents = mockEvents.filter(event => {
    if (selectedFilter !== "all" && event.type !== selectedFilter) return false;
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  const todayEvents = getTodayEvents();
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-sm text-muted-foreground">
            {selectedDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="p-2 w-9 h-9">
            <Bell className="h-4 w-4" />
          </Button>
          <Button size="sm" className="rounded-full p-2 w-10 h-10">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(["month", "week", "day"] as const).map((mode) => (
          <Button
            key={mode}
            variant={viewMode === mode ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode(mode)}
            className="whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4"
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigateDate("prev")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="font-semibold">
          {viewMode === "month" && selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          {viewMode === "week" && `Week of ${formatDate(selectedDate)}`}
          {viewMode === "day" && formatDate(selectedDate)}
        </h2>
        
        <Button variant="ghost" size="sm" onClick={() => navigateDate("next")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
                <div 
                  className="p-1 rounded" 
                  style={{ backgroundColor: `${event.color}20`, color: event.color }}
                >
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(event.time)}</span>
                    {event.location && (
                      <>
                        <span>•</span>
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {event.isOnline && (
                  <Badge variant="outline" className="text-xs">
                    <Video className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {(["all", "class", "exam", "meeting", "event"] as const).map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className="whitespace-nowrap flex-shrink-0 rounded-full text-xs px-4"
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Upcoming Events</h3>
          <span className="text-sm text-muted-foreground">{upcomingEvents.length} events</span>
        </div>

        <AnimatePresence>
          {upcomingEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No upcoming events</p>
            </motion.div>
          ) : (
            upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-lg flex-shrink-0" 
                        style={{ backgroundColor: `${event.color}20`, color: event.color }}
                      >
                        {getEventIcon(event.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{event.title}</h4>
                          <Badge 
                            variant="outline" 
                            className="text-xs ml-2 flex-shrink-0"
                            style={{ borderColor: event.color, color: event.color }}
                          >
                            {event.type}
                          </Badge>
                        </div>
                        
                        {event.description && (
                          <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
                        )}
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(event.time)}
                            {event.endTime && ` - ${formatTime(event.endTime)}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          )}
                          {event.attendees && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees} attendees
                            </span>
                          )}
                          {event.reminder && (
                            <span className="flex items-center gap-1 text-amber-600">
                              <Bell className="h-3 w-3" />
                              Reminder set
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats */}
      <Card className="border-0 bg-gradient-to-r from-chart-2/5 to-chart-3/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-chart-2">
                {mockEvents.filter(e => e.type === "class").length}
              </div>
              <div className="text-xs text-muted-foreground">Classes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-chart-3">
                {mockEvents.filter(e => e.type === "exam").length}
              </div>
              <div className="text-xs text-muted-foreground">Exams</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-chart-1">
                {mockEvents.filter(e => e.type === "assignment").length}
              </div>
              <div className="text-xs text-muted-foreground">Due</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};