import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Badge from "@/components/atoms/Badge";
import Toggle from "@/components/atoms/Toggle";
import Modal from "@/components/molecules/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { roleService } from "@/services/api/roleService";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
level: 1,
    permissions: []
  });
const availablePermissions = [
    // Super Admin permissions
    "all", "manage_users", "assign_roles", "create_custom_roles", "manage_dropzones", "approve_dropzones", "make_calendar_public",
    
    // Admin permissions  
    "manage_events", "manage_shifts", "view_reports", "assign_workers", "oversee_operations",
    
    // Event Manager permissions
    "create_events", "edit_events", "delete_events", "view_calendars",
    
    // Work Administrator permissions
    "manage_work_calendar", "approve_shifts", "decline_shifts", "assign_workers",
    
    // Worker permissions
    "view_my_page", "view_schedules", "request_shifts", "edit_my_shifts",
    
    // Tandem Instructor permissions
    "conduct_tandem_jumps", "capture_tandem_media", "manifest_jumpers",
    
    // AFF Instructor permissions
    "conduct_aff_training", "evaluate_students", "sign_logbooks",
    
    // Formation/Group Jump Leader permissions
    "lead_group_jumps", "coordinate_formations", "brief_formations",
    
    // Support roles
    "customer_service", "booking_management", "coordinate_loads", "manifest_operations"
  ];

  const roleHierarchy = {
    "Super Admin": 10,
    "Admin": 8,
    "Event Manager": 6,
    "Work Administrator": 5,
    "Tandem Instructor": 4,
    "AFF Instructor": 4,
    "Formation Leader": 4,
    "Group Jump Leader": 4,
    "Manifest": 3,
    "Customer Service": 3,
    "Worker": 2
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
const rolesData = await roleService.getAll();
      setRoles(rolesData);
    } catch (err) {
      setError("Failed to load roles data. Please try again.");
      toast.error("Error loading roles data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleCreateRole = async () => {
    if (!formData.name || !formData.displayName || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (formData.permissions.length === 0) {
      toast.error("Please assign at least one permission");
      return;
    }

    try {
      const roleData = {
        ...formData,
        level: parseInt(formData.level)
      };

      if (editingRole) {
        await roleService.update(editingRole.Id, roleData);
        toast.success("Role updated successfully");
      } else {
        await roleService.create(roleData);
        toast.success("Role created successfully");
      }
      
      setShowCreateModal(false);
      setEditingRole(null);
      setFormData({
        name: "",
        displayName: "",
        description: "",
        level: 1,
permissions: []
      });
      loadData();
    } catch (err) {
      toast.error("Failed to save role");
    }
  };

const handleDeleteRole = async (roleId) => {
    const role = roles.find(r => r.Id === roleId);
    if (role?.userCount > 0) {
      toast.error("Cannot delete role that is assigned to users");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this role?")) return;
    
    try {
      await roleService.delete(roleId);
      toast.success("Role deleted successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to delete role");
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      level: role.level,
permissions: role.permissions || []
    });
    setShowCreateModal(true);
  };

const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };
const viewPermissions = (role) => {
    setSelectedRole(role);
    setShowPermissionsModal(true);
  };

  const getRoleLevelBadge = (level) => {
    if (level >= 9) return { variant: "primary", text: "Super Admin" };
    if (level >= 7) return { variant: "purple", text: "Admin" };
    if (level >= 5) return { variant: "amber", text: "Manager" };
    if (level >= 3) return { variant: "green", text: "Specialist" };
    return { variant: "slate", text: "Worker" };
  };

  const getPermissionCategory = (permission) => {
    if (permission === "all" || permission.startsWith("manage_") || permission.includes("assign")) return "administrative";
    if (permission.includes("event") || permission.includes("calendar")) return "events";
    if (permission.includes("shift") || permission.includes("work")) return "scheduling";
    if (permission.includes("tandem") || permission.includes("aff") || permission.includes("jump")) return "instruction";
    if (permission.includes("customer") || permission.includes("booking") || permission.includes("manifest")) return "operations";
    return "general";
  };

  const getRoleLevelColor = (level) => {
    if (level >= 9) return "danger";
    if (level >= 7) return "primary";
    if (level >= 5) return "amber";
    if (level >= 3) return "sky";
    return "default";
  };

  const getRoleIcon = (roleName) => {
    const icons = {
      "Super Admin": "Crown",
      "Admin": "Shield",
      "Event Manager": "Calendar",
      "Work Administrator": "ClipboardList",
      "Tandem Instructor": "Users",
      "AFF Instructor": "GraduationCap",
      "Tandem Photographer": "Camera",
      "Jump Leader": "Navigation",
      "Drop Zone Leader": "MapPin",
      "Receptionist": "Phone",
      "Manifestor": "FileText"
    };
    return icons[roleName] || "User";
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading variant="cards" />;
  }

  if (error) {
    return <ErrorView title="Roles Error" message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 gradient-text">Role Management</h1>
          <p className="text-slate-600 mt-2">Define roles and permissions for your team</p>
        </div>
        <div className="flex items-center gap-3">
<Button 
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Shield" className="w-4 h-4" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search roles..."
            className="md:max-w-md"
          />
          <div className="text-sm text-slate-600">
            Showing {filteredRoles.length} of {roles.length} roles
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      {filteredRoles.length === 0 ? (
        <Empty
          icon="Shield"
          title="No Roles Found"
          message={searchTerm ? "No roles match your search criteria." : "Create your first role to start managing permissions."}
          actionLabel={searchTerm ? "Clear Search" : "Create Role"}
          onAction={searchTerm ? () => setSearchTerm("") : () => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRoles.map((role) => (
            <div key={role.Id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                    role.level >= 9 ? "from-red-100 to-red-200" :
                    role.level >= 7 ? "from-primary-100 to-primary-200" :
                    role.level >= 5 ? "from-amber-100 to-amber-200" :
                    role.level >= 3 ? "from-sky-100 to-sky-200" :
                    "from-slate-100 to-slate-200"
                  }`}>
                    <ApperIcon 
                      name={getRoleIcon(role.name)} 
                      className={`w-6 h-6 ${
                        role.level >= 9 ? "text-red-600" :
                        role.level >= 7 ? "text-primary-600" :
                        role.level >= 5 ? "text-amber-600" :
                        role.level >= 3 ? "text-sky-600" :
                        "text-slate-600"
                      }`} 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 gradient-text">{role.displayName}</h3>
                    <Badge variant={getRoleLevelColor(role.level)} size="sm">
                      Level {role.level}
                    </Badge>
                  </div>
                </div>
                
<div className="flex items-center gap-1">
                  <Button
                    onClick={() => viewPermissions(role)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                    title="View Permissions"
                  >
                    <ApperIcon name="Eye" className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleEditRole(role)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-slate-800"
                    disabled={role.isSystemRole}
                  >
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteRole(role.Id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                    disabled={role.userCount > 0 || role.isSystemRole}
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{role.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Assigned Users:</span>
                  <Badge variant="default" size="sm">
                    {role.userCount} users
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Permissions:</span>
                  <Badge variant="sky" size="sm">
                    {role.permissions?.length || 0} permissions
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <Button
                  onClick={() => viewPermissions(role)}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  View Permissions
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Role Modal */}
<Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingRole(null);
          setFormData({
            name: "",
            displayName: "",
            description: "",
            level: 1,
            permissions: []
          });
        }}
        title={editingRole ? "Edit Role" : "Create New Role"}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Role Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., tandem-instructor"
              required
            />
            
            <Input
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="e.g., Tandem Instructor"
              required
            />
          </div>

          <Input
            label="Authority Level"
            type="number"
            min="1"
            max="10"
            value={formData.level}
            onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
            required
          />

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the role's responsibilities"
            rows={3}
            required
          />

<div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Permissions <span className="text-red-500">*</span>
            </label>
            <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-lg p-4 space-y-4">
              {["administrative", "events", "scheduling", "instruction", "operations", "general"].map(category => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-slate-800 capitalize border-b border-slate-200 pb-1">
                    {category} Permissions
                  </h4>
                  <div className="grid gap-2 pl-2">
                    {availablePermissions
                      .filter(permission => getPermissionCategory(permission) === category)
                      .map((permission) => (
<label key={permission} className="flex items-center gap-3 cursor-pointer">
                          <Toggle
                            checked={formData.permissions.includes(permission)}
                            onChange={() => handlePermissionToggle(permission)}
                          />
                          <span className="text-sm text-slate-700">{permission.replace(/_/g, " ")}</span>
                        </label>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button 
              onClick={handleCreateRole}
              variant="primary"
              className="flex-1"
            >
              {editingRole ? "Update Role" : "Create Role"}
            </Button>
            <Button 
              onClick={() => {
                setShowCreateModal(false);
                setEditingRole(null);
              }}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Permissions View Modal */}
      <Modal
        isOpen={showPermissionsModal}
onClose={() => {
          setShowPermissionsModal(false);
          setSelectedRole(null);
        }}
        title={`${selectedRole?.displayName} - Permissions`}
        size="lg"
      >
        {selectedRole && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                selectedRole.level >= 9 ? "from-red-100 to-red-200" :
                selectedRole.level >= 7 ? "from-primary-100 to-primary-200" :
                selectedRole.level >= 5 ? "from-amber-100 to-amber-200" :
                selectedRole.level >= 3 ? "from-sky-100 to-sky-200" :
                "from-slate-100 to-slate-200"
              }`}>
                <ApperIcon 
                  name={getRoleIcon(selectedRole.name)} 
                  className={`w-6 h-6 ${
                    selectedRole.level >= 9 ? "text-red-600" :
                    selectedRole.level >= 7 ? "text-primary-600" :
                    selectedRole.level >= 5 ? "text-amber-600" :
                    selectedRole.level >= 3 ? "text-sky-600" :
                    "text-slate-600"
                  }`} 
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">{selectedRole.displayName}</h4>
                <p className="text-sm text-slate-600">{selectedRole.description}</p>
              </div>
            </div>

            <div>
<div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Badge variant={getRoleLevelBadge(selectedRole.level).variant}>
                    Level {selectedRole.level}
                  </Badge>
                  <span className="text-sm text-slate-600">
                    {selectedRole.permissions?.length || 0} permissions granted
                  </span>
                </div>
                
                {["administrative", "events", "scheduling", "instruction", "operations", "general"].map(category => {
                  const categoryPermissions = selectedRole.permissions?.filter(p => getPermissionCategory(p) === category) || [];
                  if (categoryPermissions.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <h5 className="font-medium text-slate-800 capitalize border-b border-slate-200 pb-1">
                        {category} Permissions
                      </h5>
                      <div className="space-y-2 pl-2">
                        {categoryPermissions.map((permission) => (
                          <div key={permission} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                            <ApperIcon name="Check" className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-slate-700">{permission.replace(/_/g, " ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => setShowPermissionsModal(false)}
                variant="secondary"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Roles;