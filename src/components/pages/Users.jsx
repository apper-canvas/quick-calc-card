import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userService } from "@/services/api/userService";
import { roleService } from "@/services/api/roleService";
import { dropZoneService } from "@/services/api/dropZoneService";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import Roles from "@/components/pages/Roles";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Toggle from "@/components/atoms/Toggle";
import Input from "@/components/atoms/Input";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [dropZones, setDropZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "active",
roles: [],
    dropZones: []
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [usersData, rolesData, dropZonesData] = await Promise.all([
        userService.getAll(),
        roleService.getAll(),
dropZoneService.getAll()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setDropZones(dropZonesData);
    } catch (err) {
      setError("Failed to load users data. Please try again.");
      toast.error("Error loading users data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.roles.length === 0) {
      toast.error("Please assign at least one role");
      return;
    }

    if (formData.dropZones.length === 0) {
      toast.error("Please assign at least one drop zone");
      return;
    }

    try {
      if (editingUser) {
await userService.update(editingUser.Id, formData);
        toast.success("User updated successfully");
      } else {
await userService.create(formData);
        toast.success("User created successfully");
      }
      
      setShowCreateModal(false);
      setEditingUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        status: "active",
roles: [],
        dropZones: []
      });
      loadData();
    } catch (err) {
      toast.error("Failed to save user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await userService.delete(userId);
      toast.success("User deleted successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      status: user.status,
roles: user.roles || [],
      dropZones: user.dropZones || []
    });
    setShowCreateModal(true);
  };

  const handleRoleToggle = (roleName) => {
setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter(r => r !== roleName)
        : [...prev.roles, roleName]
    }));
  };

const handleDropZoneToggle = (dropZoneName) => {
    setFormData(prev => ({
      ...prev,
      dropZones: prev.dropZones.includes(dropZoneName)
        ? prev.dropZones.filter(dz => dz !== dropZoneName)
        : [...prev.dropZones, dropZoneName]
    }));
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      "Super Admin": "danger",
      "Admin": "primary",
      "Event Manager": "sky",
      "Work Administrator": "amber",
      "Tandem Instructor": "success",
      "AFF Instructor": "purple",
      "Tandem Photographer": "indigo",
      "Jump Leader": "warning",
      "Drop Zone Leader": "primary",
      "Receptionist": "default",
      "Manifestor": "sky"
    };
    return colors[role] || "default";
  };

  const getRoleDisplayName = (roleName) => {
    const role = roles.find(r => r.name === roleName);
    return role?.displayName || roleName;
  };
  const filteredUsers = users.filter(user => {
const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.roles?.includes(roleFilter);

    return matchesSearch && matchesStatus && matchesRole;
  });

  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return <ErrorView title="Users Error" message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 gradient-text">User Management</h1>
          <p className="text-slate-600 mt-2">Manage team members and their roles</p>
        </div>
        <div className="flex items-center gap-3">
<Button 
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="UserPlus" className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users..."
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </Select>
          
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
{roles.map(role => (
              <option key={role.Id} value={role.name}>{role.displayName}</option>
            ))}
          </Select>

          <div className="text-sm text-slate-600 flex items-center">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <Empty
          icon="Users"
          title="No Users Found"
          message={searchTerm ? "No users match your search criteria." : "Add your first team member to get started."}
          actionLabel={searchTerm ? "Clear Search" : "Add User"}
          onAction={searchTerm ? () => setSearchTerm("") : () => setShowCreateModal(true)}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Contact</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Roles</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Drop Zones</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.Id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-slate-600">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-600">
                        <div>{user.email}</div>
                        {user.phone && <div>{user.phone}</div>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
{user.roles?.slice(0, 3).map((role) => (
                          <Badge key={role} variant={getRoleBadgeColor(role)} size="sm">
                            {getRoleDisplayName(role)}
                          </Badge>
                        ))}
                        {user.roles?.length > 3 && (
                          <Badge variant="default" size="sm">
                            +{user.roles.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-600 max-w-xs">
                        {user.dropZones?.slice(0, 2).map((dz, index) => (
                          <div key={index}>{dz}</div>
                        ))}
                        {user.dropZones?.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{user.dropZones.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge 
                        variant={user.status === "active" ? "success" : user.status === "inactive" ? "default" : "warning"}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
<Button
                          onClick={() => handleEditUser(user)}
                          variant="ghost"
                          size="sm"
                          className="text-slate-600 hover:text-slate-800"
                        >
                          <ApperIcon name="Edit2" className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user.Id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingUser(null);
setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            status: "active",
            roles: [],
            dropZones: []
          });
        }}
        title={editingUser ? "Edit User" : "Add New User"}
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="Enter first name"
              required
            />
            
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Enter last name"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
            
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </Select>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Roles <span className="text-red-500">*</span>
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              {roles.map((role) => (
                <label key={role.Id} className="flex items-center gap-2 cursor-pointer">
<div className="flex items-center justify-between w-full">
                    <span className="text-sm text-slate-700">{role.displayName}</span>
                    <Toggle
                      checked={formData.roles.includes(role.name)}
                      onChange={() => handleRoleToggle(role.name)}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Drop Zone Access <span className="text-red-500">*</span>
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              {dropZones.filter(dz => dz.status === "active").map((dropZone) => (
                <label key={dropZone.Id} className="flex items-center gap-2 cursor-pointer">
<div className="flex items-center justify-between w-full">
                    <span className="text-sm text-slate-700">{dropZone.name}</span>
                    <Toggle
                      checked={formData.dropZones.includes(dropZone.name)}
                      onChange={() => handleDropZoneToggle(dropZone.name)}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button 
              onClick={handleCreateUser}
              variant="primary"
              className="flex-1"
            >
              {editingUser ? "Update User" : "Create User"}
            </Button>
<Button 
              onClick={() => {
                setShowCreateModal(false);
                setEditingUser(null);
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

export default Users;