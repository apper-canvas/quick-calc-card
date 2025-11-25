import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { userService } from "@/services/api/userService";
import { eventService } from "@/services/api/eventService";
import { workShiftService } from "@/services/api/workShiftService";
import { dropZoneService } from "@/services/api/dropZoneService";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [workShifts, setWorkShifts] = useState([]);
  const [dropZones, setDropZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [usersData, eventsData, shiftsData, dropZonesData] = await Promise.all([
        userService.getAll(),
        eventService.getUpcoming(5),
        workShiftService.getUpcoming(5),
        dropZoneService.getActive()
      ]);
      
      setUsers(usersData);
      setEvents(eventsData);
      setWorkShifts(shiftsData);
      setDropZones(dropZonesData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading variant="cards" />;
  }

  if (error) {
    return <ErrorView title="Dashboard Error" message={error} onRetry={loadDashboardData} />;
  }

  const activeUsers = users.filter(u => u.status === "active").length;
  const pendingShifts = workShifts.filter(s => s.status === "pending").length;
  const totalDropZones = dropZones.length;
  const upcomingEvents = events.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 gradient-text">Operations Dashboard</h1>
          <p className="text-slate-600 mt-2">Monitor your skydiving operations at a glance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate("/event-calendar")}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Calendar" className="w-4 h-4" />
            View Events
          </Button>
          <Button 
            onClick={() => navigate("/work-calendar")}
            variant="secondary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="CalendarClock" className="w-4 h-4" />
            View Work Schedule
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Users"
          value={activeUsers}
          change="+12% this month"
          changeType="positive"
          icon="Users"
          iconColor="primary"
        />
        <StatCard
          title="Upcoming Events"
          value={upcomingEvents}
          change="+8% this week"
          changeType="positive"
          icon="Calendar"
          iconColor="sky"
        />
        <StatCard
          title="Pending Shifts"
          value={pendingShifts}
          change={pendingShifts > 0 ? "Needs attention" : "All assigned"}
          changeType={pendingShifts > 0 ? "warning" : "positive"}
          icon="CalendarClock"
          iconColor="amber"
        />
        <StatCard
          title="Drop Zones"
          value={totalDropZones}
          change="3 active locations"
          changeType="neutral"
          icon="MapPin"
          iconColor="green"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Upcoming Events</h3>
            </div>
            <Button 
              onClick={() => navigate("/event-calendar")}
              variant="ghost" 
              size="sm"
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No upcoming events</p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.Id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{event.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-slate-600">
                        {format(new Date(event.startDateTime), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 bg-sky-100 text-sky-800 text-xs font-medium rounded-full">
                        {event.eventType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Users" className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{event.assignedUsers?.length || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Work Shifts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="CalendarClock" className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Recent Work Shifts</h3>
            </div>
            <Button 
              onClick={() => navigate("/work-calendar")}
              variant="ghost" 
              size="sm"
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {workShifts.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <ApperIcon name="CalendarClock" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No upcoming shifts</p>
              </div>
            ) : (
              workShifts.map((shift) => (
                <div key={shift.Id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{shift.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-slate-600">
                        {format(new Date(shift.startDateTime), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        shift.status === "confirmed" ? "bg-green-100 text-green-800" :
                        shift.status === "pending" ? "bg-amber-100 text-amber-800" :
                        "bg-slate-100 text-slate-800"
                      }`}>
                        {shift.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600">
                      {shift.assignedUserId ? "Assigned" : "Unassigned"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Drop Zones Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="MapPin" className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Drop Zone Status</h3>
          </div>
          <Button 
            onClick={() => navigate("/drop-zones")}
            variant="ghost" 
            size="sm"
          >
            Manage All
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dropZones.map((dropZone) => (
            <div key={dropZone.Id} className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-800">{dropZone.name}</h4>
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {dropZone.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Active Users:</span>
                  <span className="font-medium">{dropZone.activeUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Upcoming Events:</span>
                  <span className="font-medium">{dropZone.upcomingEvents}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="MapPin" className="w-3 h-3" />
                  <span className="truncate">{dropZone.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-50 to-sky-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button 
            onClick={() => navigate("/event-calendar")}
            variant="primary"
            className="flex items-center justify-center gap-2 h-12"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Create Event
          </Button>
          <Button 
            onClick={() => navigate("/work-calendar")}
            variant="secondary"
            className="flex items-center justify-center gap-2 h-12"
          >
            <ApperIcon name="Clock" className="w-4 h-4" />
            Schedule Shift
          </Button>
          <Button 
            onClick={() => navigate("/users")}
            variant="accent"
            className="flex items-center justify-center gap-2 h-12"
          >
            <ApperIcon name="UserPlus" className="w-4 h-4" />
            Add User
          </Button>
          <Button 
            onClick={() => navigate("/drop-zones")}
            variant="ghost"
            className="flex items-center justify-center gap-2 h-12 border-2 border-slate-300 hover:border-slate-400"
          >
            <ApperIcon name="MapPin" className="w-4 h-4" />
            Manage Locations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;