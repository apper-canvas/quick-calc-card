import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/molecules/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { dropZoneService } from "@/services/api/dropZoneService";

const DropZones = () => {
  const [dropZones, setDropZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDropZone, setEditingDropZone] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    country: "United States",
    timezone: "America/New_York",
    status: "active"
  });

  const timezones = [
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "America/Phoenix", label: "Arizona Time" },
    { value: "America/Anchorage", label: "Alaska Time" },
    { value: "Pacific/Honolulu", label: "Hawaii Time" }
  ];

  const countries = [
    "United States",
    "Canada", 
    "United Kingdom",
    "Australia",
    "New Zealand",
    "Germany",
    "France",
    "Spain",
    "Other"
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
const dropZonesData = await dropZoneService.getAll();
      setDropZones(dropZonesData);
    } catch (err) {
      setError("Failed to load drop zones data. Please try again.");
      toast.error("Error loading drop zones data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDropZone = async () => {
    if (!formData.name || !formData.code || !formData.address || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.code.length < 3 || formData.code.length > 4) {
      toast.error("Drop zone code must be 3-4 characters");
      return;
    }

    try {
      if (editingDropZone) {
        await dropZoneService.update(editingDropZone.Id, formData);
        toast.success("Drop zone updated successfully");
      } else {
        await dropZoneService.create(formData);
        toast.success("Drop zone created successfully");
      }
      
      setShowCreateModal(false);
      setEditingDropZone(null);
      setFormData({
        name: "",
        code: "",
        address: "",
        city: "",
        country: "United States",
        timezone: "America/New_York",
        status: "active"
      });
      loadData();
    } catch (err) {
      toast.error("Failed to save drop zone");
    }
  };

  const handleDeleteDropZone = async (dropZoneId) => {
    const dropZone = dropZones.find(dz => dz.Id === dropZoneId);
    if (dropZone?.activeUsers > 0 || dropZone?.upcomingEvents > 0) {
      toast.error("Cannot delete drop zone with active users or events");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this drop zone?")) return;
    
    try {
      await dropZoneService.delete(dropZoneId);
      toast.success("Drop zone deleted successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to delete drop zone");
    }
  };

  const handleEditDropZone = (dropZone) => {
    setEditingDropZone(dropZone);
    setFormData({
      name: dropZone.name,
      code: dropZone.code,
      address: dropZone.address,
      city: dropZone.city,
      country: dropZone.country,
      timezone: dropZone.timezone,
      status: dropZone.status
    });
    setShowCreateModal(true);
  };

  const filteredDropZones = dropZones.filter(dz => {
    const matchesSearch = 
      dz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dz.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dz.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || dz.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: dropZones.length,
    active: dropZones.filter(dz => dz.status === "active").length,
    totalUsers: dropZones.reduce((sum, dz) => sum + dz.activeUsers, 0),
    totalEvents: dropZones.reduce((sum, dz) => sum + dz.upcomingEvents, 0)
  };

  if (loading) {
    return <Loading variant="cards" />;
  }

  if (error) {
    return <ErrorView title="Drop Zones Error" message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 gradient-text">Drop Zone Management</h1>
          <p className="text-slate-600 mt-2">Manage your skydiving locations and facilities</p>
        </div>
        <div className="flex items-center gap-3">
<Button 
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="MapPin" className="w-4 h-4" />
            Add Drop Zone
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Locations"
          value={stats.total}
          icon="MapPin"
          iconColor="primary"
        />
        <StatCard
          title="Active Locations"
          value={stats.active}
          icon="CheckCircle"
          iconColor="success"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="Users"
          iconColor="sky"
        />
        <StatCard
          title="Upcoming Events"
          value={stats.totalEvents}
          icon="Calendar"
          iconColor="amber"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search drop zones..."
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>

          <div className="text-sm text-slate-600 flex items-center">
            Showing {filteredDropZones.length} of {dropZones.length} locations
          </div>
        </div>
      </div>

      {/* Drop Zones Grid */}
      {filteredDropZones.length === 0 ? (
        <Empty
          icon="MapPin"
          title="No Drop Zones Found"
          message={searchTerm ? "No drop zones match your search criteria." : "Add your first drop zone location to get started."}
          actionLabel={searchTerm ? "Clear Search" : "Add Drop Zone"}
          onAction={searchTerm ? () => setSearchTerm("") : () => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDropZones.map((dropZone) => (
            <div key={dropZone.Id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-sky-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{dropZone.name}</h3>
                      <Badge 
                        variant={dropZone.status === "active" ? "success" : "default"}
                        className="bg-white/20 text-white"
                      >
                        {dropZone.code}
                      </Badge>
                    </div>
                    <p className="text-primary-100">{dropZone.city}, {dropZone.country}</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
<Button
                      onClick={() => handleEditDropZone(dropZone)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteDropZone(dropZone.Id)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      disabled={dropZone.activeUsers > 0 || dropZone.upcomingEvents > 0}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-2">
                  <ApperIcon name="MapPin" className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="text-sm text-slate-600">
                    {dropZone.address}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ApperIcon name="Clock" className="w-4 h-4 text-slate-400" />
                  <div className="text-sm text-slate-600">
                    {timezones.find(tz => tz.value === dropZone.timezone)?.label || dropZone.timezone}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800 gradient-text">
                      {dropZone.activeUsers}
                    </div>
                    <div className="text-sm text-slate-500">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800 gradient-text">
                      {dropZone.upcomingEvents}
                    </div>
                    <div className="text-sm text-slate-500">Upcoming Events</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Badge 
                    variant={dropZone.status === "active" ? "success" : "default"}
                    className="w-full justify-center"
                  >
                    {dropZone.status === "active" ? (
                      <>
                        <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
                        Operational
                      </>
                    ) : (
                      <>
                        <ApperIcon name="XCircle" className="w-3 h-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Drop Zone Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingDropZone(null);
          setFormData({
            name: "",
            code: "",
            address: "",
            city: "",
            country: "United States",
            timezone: "America/New_York",
            status: "active"
          });
        }}
        title={editingDropZone ? "Edit Drop Zone" : "Add New Drop Zone"}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Drop Zone Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter drop zone name"
              required
            />
            
            <Input
              label="Code (3-4 characters)"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="e.g., BSDZ"
              maxLength={4}
              required
            />
          </div>

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Enter street address"
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              placeholder="Enter city"
              required
            />
            
            <Select
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            >
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Timezone"
              value={formData.timezone}
              onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
            >
              {timezones.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </Select>

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button 
              onClick={handleCreateDropZone}
              variant="primary"
              className="flex-1"
            >
              {editingDropZone ? "Update Drop Zone" : "Create Drop Zone"}
            </Button>
            <Button 
              onClick={() => {
                setShowCreateModal(false);
                setEditingDropZone(null);
              }}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DropZones;