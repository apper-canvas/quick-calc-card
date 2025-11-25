import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { workShiftService } from "@/services/api/workShiftService";
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
import Badge from "@/components/atoms/Badge";
import TextArea from "@/components/atoms/TextArea";
import Input from "@/components/atoms/Input";

const WorkCalendar = () => {
  const [workShifts, setWorkShifts] = useState([]);
  const [dropZones, setDropZones] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
const [selectedDate, setSelectedDate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [viewMode, setViewMode] = useState("month");
  const [formData, setFormData] = useState({
    title: "",
    roleId: "",
    assignedUserId: "",
    dropZoneId: "",
    startDateTime: "",
    endDateTime: "",
    status: "pending",
    notes: ""
  });

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [shiftsData, dropZonesData, usersData, rolesData] = await Promise.all([
        workShiftService.getAll(),
        dropZoneService.getAll(),
        userService.getAll(),
        roleService.getAll()
      ]);
      
      setWorkShifts(shiftsData);
      setDropZones(dropZonesData);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError("Failed to load work calendar data. Please try again.");
      toast.error("Error loading work calendar data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateShift = async () => {
    if (!formData.title || !formData.roleId || !formData.dropZoneId || !formData.startDateTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const shiftData = {
        ...formData,
        roleId: parseInt(formData.roleId),
        dropZoneId: parseInt(formData.dropZoneId),
        assignedUserId: formData.assignedUserId ? parseInt(formData.assignedUserId) : null,
        createdBy: 1 // Mock current user
      };

      if (editingShift) {
        await workShiftService.update(editingShift.Id, shiftData);
        toast.success("Work shift updated successfully");
      } else {
        await workShiftService.create(shiftData);
        toast.success("Work shift created successfully");
      }
      
      setShowCreateModal(false);
      setEditingShift(null);
      setFormData({
        title: "",
        roleId: "",
        assignedUserId: "",
        dropZoneId: "",
        startDateTime: "",
        endDateTime: "",
        status: "pending",
        notes: ""
      });
      loadData();
    } catch (err) {
      toast.error("Failed to save work shift");
    }
  };

  const handleDeleteShift = async (shiftId) => {
    if (!window.confirm("Are you sure you want to delete this work shift?")) return;
    
    try {
      await workShiftService.delete(shiftId);
      toast.success("Work shift deleted successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to delete work shift");
    }
  };

  const handleEditShift = (shift) => {
    setEditingShift(shift);
    setFormData({
      title: shift.title,
      roleId: shift.roleId.toString(),
      assignedUserId: shift.assignedUserId ? shift.assignedUserId.toString() : "",
      dropZoneId: shift.dropZoneId.toString(),
      startDateTime: format(new Date(shift.startDateTime), "yyyy-MM-dd'T'HH:mm"),
      endDateTime: format(new Date(shift.endDateTime), "yyyy-MM-dd'T'HH:mm"),
      status: shift.status,
      notes: shift.notes || ""
    });
    setShowCreateModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      "pending": "warning",
      "confirmed": "success", 
      "completed": "default",
      "cancelled": "danger"
    };
    return colors[status] || "default";
  };

  const getRoleById = (roleId) => {
    return roles.find(role => role.Id === roleId);
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id === userId);
  };

  const getDropZoneById = (dzId) => {
    return dropZones.find(dz => dz.Id === dzId);
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

  const getShiftsForDate = (date) => {
    return workShifts.filter(shift => 
      isSameDay(new Date(shift.startDateTime), date)
    );
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

  const getUnassignedShiftsCount = (date) => {
    return getShiftsForDate(date).filter(shift => !shift.assignedUserId).length;
  };

  const getAvailableUsers = (roleId) => {
    if (!roleId) return [];
    const role = getRoleById(parseInt(roleId));
    if (!role) return [];
    return users.filter(user => 
      user.status === "active" && user.roles.includes(role.name)
    );
  };

  if (loading) {
    return <Loading variant="calendar" />;
  }

  if (error) {
    return <ErrorView title="Work Calendar Error" message={error} onRetry={loadData} />;
  }

const days = getCalendarDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 gradient-text">Work Calendar</h1>
          <p className="text-slate-600 mt-2">Schedule and manage work shifts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Create Shift
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

          {/* View Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
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

        {/* Status Legend */}
        <div className="flex flex-wrap gap-3 mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm">Pending</Badge>
            <span className="text-xs text-slate-600">Needs assignment</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">Confirmed</Badge>
            <span className="text-xs text-slate-600">Worker assigned</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm">Completed</Badge>
            <span className="text-xs text-slate-600">Shift finished</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="danger" size="sm">Cancelled</Badge>
            <span className="text-xs text-slate-600">Shift cancelled</span>
          </div>
        </div>

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
                const dayShifts = getShiftsForDate(day);
                const isToday = isSameDay(day, new Date());
                const unassignedCount = getUnassignedShiftsCount(day);
                
                return (
                  <div
                    key={index}
                    className={`min-h-[130px] p-2 border border-slate-200 rounded-lg transition-all duration-200 cursor-pointer ${
                      isSameMonth(day, currentDate) 
                        ? "bg-white hover:bg-slate-50 hover:border-slate-300" 
                        : "bg-slate-50/50 text-slate-400"
                    } ${isToday ? "ring-2 ring-primary-400 bg-primary-50/50" : ""}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`text-sm font-semibold ${
                        isToday ? "text-primary-600" : "text-slate-700"
                      }`}>
                        {format(day, "d")}
                      </div>
                      {unassignedCount > 0 && (
                        <div className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-medium">
                          {unassignedCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {dayShifts.slice(0, 2).map((shift) => {
                        const role = getRoleById(shift.roleId);
                        const assignedUser = shift.assignedUserId ? getUserById(shift.assignedUserId) : null;
                        
                        return (
                          <div
                            key={shift.Id}
                            className="text-xs p-1.5 rounded-md border border-slate-200 bg-white cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditShift(shift);
                            }}
                            title={shift.title}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="truncate font-medium text-slate-800 text-[11px]">{shift.title}</div>
                              <Badge variant={getStatusColor(shift.status)} size="sm" className="text-[9px] px-1 py-0">
                                {shift.status}
                              </Badge>
                            </div>
                            <div className="text-slate-600 truncate text-[10px] mb-0.5">
                              {role?.displayName || "Unknown Role"}
                            </div>
                            <div className="text-slate-500 text-[10px] flex items-center justify-between">
                              <span>{format(new Date(shift.startDateTime), "HH:mm")}</span>
                              <span className={assignedUser ? "text-green-600" : "text-amber-600"}>
                                {assignedUser ? assignedUser.firstName : "Unassigned"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {dayShifts.length > 2 && (
                        <div className="text-xs text-slate-500 pl-1 font-medium">
                          +{dayShifts.length - 2} more
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
                const unassignedCount = getUnassignedShiftsCount(dayDate);
                
                return (
                  <div key={day} className={`p-3 text-center rounded-lg ${
                    isToday ? "bg-primary-100 text-primary-800" : "bg-slate-50 text-slate-700"
                  }`}>
                    <div className="flex items-center justify-center gap-2">
                      <div>
                        <div className="text-xs font-medium text-slate-600 mb-1">{day}</div>
                        <div className={`text-lg font-bold ${isToday ? "text-primary-700" : "text-slate-800"}`}>
                          {format(dayDate, "d")}
                        </div>
                      </div>
                      {unassignedCount > 0 && (
                        <div className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-medium">
                          {unassignedCount}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayShifts = getShiftsForDate(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div
                    key={index}
                    className={`min-h-[350px] p-3 border border-slate-200 rounded-lg transition-all cursor-pointer ${
                      isToday ? "ring-2 ring-primary-400 bg-primary-50/50" : "bg-white hover:bg-slate-50 hover:border-slate-300"
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="space-y-2">
                      {dayShifts.map((shift) => {
                        const role = getRoleById(shift.roleId);
                        const assignedUser = shift.assignedUserId ? getUserById(shift.assignedUserId) : null;
                        
                        return (
                          <div
                            key={shift.Id}
                            className="text-sm p-2 rounded-md border border-slate-200 bg-white cursor-pointer hover:shadow-sm transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditShift(shift);
                            }}
                            title={shift.title}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-slate-800 text-sm">{shift.title}</div>
                              <Badge variant={getStatusColor(shift.status)} size="sm">
                                {shift.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-600 mb-1">
                              {role?.displayName || "Unknown Role"}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center justify-between">
                              <span>{format(new Date(shift.startDateTime), "HH:mm")}</span>
                              <span className={assignedUser ? "text-green-600 font-medium" : "text-amber-600"}>
                                {assignedUser ? assignedUser.firstName : "Unassigned"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
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
              <div className="flex items-center justify-between">
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
                {getUnassignedShiftsCount(currentDate) > 0 && (
                  <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {getUnassignedShiftsCount(currentDate)} Unassigned
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {getShiftsForDate(currentDate).length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No shifts scheduled for this day
                  </div>
                ) : (
                  getShiftsForDate(currentDate).map((shift) => {
                    const role = getRoleById(shift.roleId);
                    const assignedUser = shift.assignedUserId ? getUserById(shift.assignedUserId) : null;
                    
                    return (
                      <div
                        key={shift.Id}
                        className="p-4 rounded-lg border border-slate-200 cursor-pointer hover:shadow-sm transition-all bg-white"
                        onClick={() => handleEditShift(shift)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-800">{shift.title}</h3>
                              <Badge variant={getStatusColor(shift.status)}>
                                {shift.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{shift.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <ApperIcon name="Clock" className="w-4 h-4" />
                                {format(new Date(shift.startDateTime), "HH:mm")}
                              </div>
                              <div className="flex items-center gap-1">
                                <ApperIcon name="UserCheck" className="w-4 h-4" />
                                {role?.displayName || "Unknown Role"}
                              </div>
                              <div className="flex items-center gap-1">
                                <ApperIcon name="User" className="w-4 h-4" />
                                <span className={assignedUser ? "text-green-600 font-medium" : "text-amber-600"}>
                                  {assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : "Unassigned"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {workShifts.length === 0 && (
        <Empty
          icon="CalendarClock"
          title="No Work Shifts Scheduled"
          message="Create your first work shift to start managing your team schedules."
          actionLabel="Create Shift"
          onAction={() => setShowCreateModal(true)}
        />
      )}

      {/* Create/Edit Shift Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingShift(null);
          setFormData({
            title: "",
            roleId: "",
            assignedUserId: "",
            dropZoneId: "",
            startDateTime: "",
            endDateTime: "",
            status: "pending",
            notes: ""
          });
        }}
        title={editingShift ? "Edit Work Shift" : "Create New Work Shift"}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Shift Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter shift title"
              required
            />
            
            <Select
              label="Role Required"
              value={formData.roleId}
              onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value, assignedUserId: "" }))}
              required
            >
              <option value="">Select role</option>
              {roles.map(role => (
                <option key={role.Id} value={role.Id}>{role.displayName}</option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Assign Worker"
              value={formData.assignedUserId}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedUserId: e.target.value }))}
            >
              <option value="">Unassigned</option>
              {getAvailableUsers(formData.roleId).map(user => (
                <option key={user.Id} value={user.Id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </Select>
            
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
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

          <TextArea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes (optional)"
            rows={3}
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button 
              onClick={handleCreateShift}
              variant="primary"
              className="flex-1"
            >
              {editingShift ? "Update Shift" : "Create Shift"}
            </Button>
            <Button 
              onClick={() => {
                setShowCreateModal(false);
                setEditingShift(null);
              }}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
            {editingShift && (
              <Button 
                onClick={() => {
                  handleDeleteShift(editingShift.Id);
                  setShowCreateModal(false);
                  setEditingShift(null);
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

export default WorkCalendar;