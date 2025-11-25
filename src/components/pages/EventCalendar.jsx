import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { eventService } from "@/services/api/eventService";
import { dropZoneService } from "@/services/api/dropZoneService";
import { userService } from "@/services/api/userService";
import { roleService } from "@/services/api/roleService";
import { addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek, subMonths } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import TextArea from "@/components/atoms/TextArea";
import Input from "@/components/atoms/Input";

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [dropZones, setDropZones] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewMode, setViewMode] = useState("month");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    eventType: "",
    startDateTime: "",
    endDateTime: "",
    dropZoneId: "",
    description: "",
    requiredRoles: []
  });

  const eventTypes = [
    "Training",
    "Recreation", 
    "Competition",
    "Demo",
    "Special Event"
  ];

  const roleOptions = [
    "Super Admin",
    "Admin", 
    "Event Manager",
    "Tandem Instructor",
    "AFF Instructor",
    "Tandem Photographer",
    "Jump Leader",
    "Drop Zone Leader"
  ];

const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [eventsData, dropZonesData, usersData, rolesData] = await Promise.all([
        eventService.getAll(),
        dropZoneService.getAll(),
        userService.getAll(),
        roleService.getAll()
      ]);
      
      setEvents(eventsData);
      setDropZones(dropZonesData);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError("Failed to load calendar data. Please try again.");
      toast.error("Error loading calendar data");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.eventType || !formData.startDateTime || !formData.dropZoneId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingEvent) {
        await eventService.update(editingEvent.Id, formData);
        toast.success("Event updated successfully");
      } else {
        await eventService.create(formData);
        toast.success("Event created successfully");
      }
      
      setShowCreateModal(false);
      setEditingEvent(null);
      setFormData({
        title: "",
        eventType: "",
        startDateTime: "",
        endDateTime: "",
        dropZoneId: "",
        description: "",
        requiredRoles: []
      });
      loadData();
    } catch (err) {
      toast.error("Failed to save event");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await eventService.delete(eventId);
      toast.success("Event deleted successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      eventType: event.eventType,
      startDateTime: format(new Date(event.startDateTime), "yyyy-MM-dd'T'HH:mm"),
      endDateTime: format(new Date(event.endDateTime), "yyyy-MM-dd'T'HH:mm"),
      dropZoneId: event.dropZoneId.toString(),
      description: event.description || "",
      requiredRoles: event.requiredRoles || []
    });
    setShowCreateModal(true);
  };

  const getEventTypeColor = (type) => {
    const colors = {
      "Training": "bg-green-100 border-l-green-500 text-green-800",
      "Recreation": "bg-blue-100 border-l-blue-500 text-blue-800", 
      "Competition": "bg-purple-100 border-l-purple-500 text-purple-800",
      "Demo": "bg-orange-100 border-l-orange-500 text-orange-800",
      "Special Event": "bg-pink-100 border-l-pink-500 text-pink-800"
    };
    return colors[type] || "bg-gray-100 border-l-gray-500 text-gray-800";
  };

const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday = 1
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const getCurrentDay = () => {
    return [startOfDay(currentDate)];
  };

  const getCalendarDays = () => {
    switch (viewMode) {
      case "week":
        return getWeekDays();
      case "day":
        return getCurrentDay();
      default:
        return getDaysInMonth();
    }
  };

  const getEventsForDate = (date) => {
    let filteredEvents = events.filter(event => 
      isSameDay(new Date(event.startDateTime), date)
    );
    
    if (eventTypeFilter !== "all") {
      filteredEvents = filteredEvents.filter(event => 
        event.eventType === eventTypeFilter
      );
    }
    
    return filteredEvents;
  };

  const getEventTypes = () => {
    const types = [...new Set(events.map(event => event.eventType))];
    return types.filter(type => type); // Remove any null/undefined types
  };

  const formatViewTitle = () => {
    switch (viewMode) {
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
      case "day":
        return format(currentDate, "MMMM d, yyyy");
      default:
        return format(currentDate, "MMMM yyyy");
    }
  };

  if (loading) {
    return <Loading variant="calendar" />;
  }

  if (error) {
    return <ErrorView title="Calendar Error" message={error} onRetry={loadData} />;
  }
const days = getCalendarDays();
  const availableEventTypes = getEventTypes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 gradient-text">Event Calendar</h1>
          <p className="text-slate-600 mt-2">Schedule and manage skydiving events</p>
        </div>
        <div className="flex items-center gap-3">
<Button 
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Create Event
          </Button>
        </div>
      </div>

{/* Calendar Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          {/* Navigation and Title */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1));
                  else if (viewMode === "week") setCurrentDate(addDays(currentDate, -7));
                  else setCurrentDate(addDays(currentDate, -1));
                }}
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-bold text-slate-900 min-w-0 text-center sm:text-left">
                {formatViewTitle()}
              </h2>
              <Button
                onClick={() => {
                  if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
                  else if (viewMode === "week") setCurrentDate(addDays(currentDate, 7));
                  else setCurrentDate(addDays(currentDate, 1));
                }}
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              >
                <ApperIcon name="ChevronRight" className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              onClick={() => setCurrentDate(new Date())}
              variant="secondary"
              size="sm"
              className="px-4 py-2 text-sm font-medium"
            >
              Today
            </Button>
          </div>

          {/* View Controls and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Event Type Filter */}
            <Select
              value={eventTypeFilter}
              onValueChange={setEventTypeFilter}
              className="min-w-[140px]"
>
              <option value="all">All Events</option>
              {availableEventTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </Select>

            {/* View Mode Selector */}
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {["month", "week", "day"].map((mode) => (
                <Button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  variant={viewMode === mode ? "primary" : "ghost"}
                  size="sm"
                  className={`px-4 py-2 text-sm font-medium capitalize transition-all ${
                    viewMode === mode 
                      ? "bg-white shadow-sm border border-slate-200" 
                      : "hover:bg-slate-100 border-transparent"
                  }`}
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        {viewMode === "month" && (
          <>

        {/* Calendar Grid */}
<div className="grid grid-cols-7 gap-1 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-slate-700 bg-slate-50 rounded-lg">
                  {day}
                </div>
          ))}
        </div>

<div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div
                    key={index}
                    className={`min-h-[110px] p-2 border border-slate-200 rounded-lg transition-all duration-200 cursor-pointer ${
                      isSameMonth(day, currentDate) 
                        ? "bg-white hover:bg-slate-50 hover:border-slate-300" 
                        : "bg-slate-50/50 text-slate-400"
                    } ${isToday ? "ring-2 ring-primary-400 bg-primary-50/50" : ""}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={`text-sm font-semibold mb-2 ${
                      isToday ? "text-primary-600" : "text-slate-700"
                    }`}>
                      {format(day, "d")}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.Id}
className={`text-xs p-1.5 rounded-md border-l-2 ${getEventTypeColor(event.eventType)} cursor-pointer hover:shadow-sm transition-all`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                          title={event.title}
                        >
                          <div className="truncate font-medium text-slate-800">{event.title}</div>
                          <div className="truncate text-slate-600 opacity-80">
                            {format(new Date(event.startDateTime), "HH:mm")}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-slate-500 pl-1 font-medium">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Week View */}
        {viewMode === "week" && (
          <>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const dayDate = days[index];
                const isToday = isSameDay(dayDate, new Date());
                
                return (
                  <div key={day} className={`p-3 text-center rounded-lg ${
                    isToday ? "bg-primary-100 text-primary-800" : "bg-slate-50 text-slate-700"
                  }`}>
                    <div className="text-xs font-medium text-slate-600 mb-1">{day}</div>
                    <div className={`text-lg font-bold ${isToday ? "text-primary-700" : "text-slate-800"}`}>
                      {format(dayDate, "d")}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div
                    key={index}
                    className={`min-h-[300px] p-3 border border-slate-200 rounded-lg transition-all cursor-pointer ${
                      isToday ? "ring-2 ring-primary-400 bg-primary-50/50" : "bg-white hover:bg-slate-50 hover:border-slate-300"
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="space-y-2">
{dayEvents.map((event) => (
                        <div
                          key={event.Id}
                          className={`text-sm p-2 rounded-md border-l-3 ${getEventTypeColor(event.eventType)} cursor-pointer hover:shadow-sm transition-all`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                          title={event.title}
                        >
                          <div className="font-medium text-slate-800 mb-1">{event.title}</div>
                          <div className="text-xs text-slate-600">
                            {format(new Date(event.startDateTime), "HH:mm")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Day View */}
        {viewMode === "day" && (
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-slate-800">
                  {format(currentDate, "d")}
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-800">
                    {format(currentDate, "EEEE")}
                  </div>
                  <div className="text-sm text-slate-600">
                    {format(currentDate, "MMMM yyyy")}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {getEventsForDate(currentDate).length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No events scheduled for this day
                  </div>
                ) : (
                  getEventsForDate(currentDate).map((event) => (
                    <div
key={event.Id}
                      className={`p-4 rounded-lg border-l-4 ${getEventTypeColor(event.eventType)} cursor-pointer hover:shadow-sm transition-all bg-white border border-slate-200`}
                      onClick={() => handleEditEvent(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-1">{event.title}</h3>
                          <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Clock" className="w-4 h-4" />
                              {format(new Date(event.startDateTime), "HH:mm")}
                            </div>
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Tag" className="w-4 h-4" />
                              {event.eventType}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

{events.length === 0 && (
        <Empty
          icon="Calendar"
          title="No Events Scheduled"
          message="Create your first event to start managing your skydiving operations calendar."
          actionLabel="Create Event"
          onAction={() => setShowCreateModal(true)}
        />
      )}

{/* Create/Edit Event Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingEvent(null);
          setFormData({
            title: "",
            eventType: "",
            startDateTime: "",
            endDateTime: "",
            dropZoneId: "",
            description: "",
            requiredRoles: []
          });
        }}
        title={editingEvent ? "Edit Event" : "Create New Event"}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
              required
            />
            
            <Select
              label="Event Type"
              value={formData.eventType}
              onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
              required
            >
              <option value="">Select event type</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Start Date & Time"
              type="datetime-local"
              value={formData.startDateTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startDateTime: e.target.value }))}
              required
            />
            
            <Input
              label="End Date & Time"
              type="datetime-local"
              value={formData.endDateTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endDateTime: e.target.value }))}
            />
          </div>

          <Select
            label="Drop Zone"
            value={formData.dropZoneId}
            onChange={(e) => setFormData(prev => ({ ...prev, dropZoneId: e.target.value }))}
            required
          >
            <option value="">Select drop zone</option>
            {dropZones.filter(dz => dz.status === "active").map(dz => (
              <option key={dz.Id} value={dz.Id}>{dz.name}</option>
            ))}
          </Select>

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Event description (optional)"
            rows={3}
          />

<div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button 
              onClick={handleCreateEvent}
              variant="primary"
              className="flex-1"
            >
              {editingEvent ? "Update Event" : "Create Event"}
            </Button>
            <Button 
              onClick={() => {
                setShowCreateModal(false);
                setEditingEvent(null);
              }}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
            {editingEvent && (
              <Button 
                onClick={() => {
                  handleDeleteEvent(editingEvent.Id);
                  setShowCreateModal(false);
                  setEditingEvent(null);
                }}
                variant="danger"
                size="icon"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
);
};

export default EventCalendar;