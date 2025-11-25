import rolesData from "@/services/mockData/roles.json";

let roles = [...rolesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const roleService = {
  async getAll() {
    await delay(250);
    return roles.map(role => ({ ...role }));
  },

  async getById(id) {
    await delay(200);
const role = roles.find(r => r.Id === parseInt(id));
    return role ? { ...role } : null;
  },

  async create(roleData) {
    await delay(400);
    const newRole = {
      ...roleData,
Id: Math.max(...roles.map(r => r.Id)) + 1,
      userCount: 0,
      level: roleData.level || 1,
      permissions: roleData.permissions || [],
      isSystemRole: false,
      createdAt: new Date().toISOString()
    };
    roles.push(newRole);
    return { ...newRole };
  },

  async update(id, roleData) {
    await delay(350);
    const index = roles.findIndex(r => r.Id === parseInt(id));
    if (index === -1) return null;
roles[index] = {
      ...roles[index],
      ...roleData,
      Id: parseInt(id)
    };
    return { ...roles[index] };
  },

  async delete(id) {
    await delay(250);
const index = roles.findIndex(r => r.Id === parseInt(id));
    if (index === -1) return false;
    
    // Prevent deletion of system roles
    if (roles[index].isSystemRole) return false;
    
    roles.splice(index, 1);
    return true;
  }
};