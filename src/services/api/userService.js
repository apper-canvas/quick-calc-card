import usersData from "@/services/mockData/users.json";

let users = [...usersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(300);
    return users.map(user => ({ ...user }));
  },

async getById(id) {
    await delay(200);
    const user = users.find(u => u.Id === parseInt(id));
    return user ? { ...user } : null;
  },

async create(userData) {
    await delay(400);
    const newUser = {
      ...userData,
      Id: Math.max(...users.map(u => u.Id)) + 1,
      roles: userData.roles || [],
      dropZones: userData.dropZones || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    return { ...newUser };
  },

async update(id, userData) {
    await delay(350);
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...userData,
      Id: parseInt(id),
      roles: userData.roles || users[index].roles || [],
      dropZones: userData.dropZones || users[index].dropZones || [],
      updatedAt: new Date().toISOString()
    };
    return { ...users[index] };
  },

  async delete(id) {
    await delay(250);
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) return false;
    
    users.splice(index, 1);
    return true;
  },

async getByDropZone(dropZoneId) {
    await delay(300);
    return users
      .filter(user => user.dropZones?.includes(dropZoneId))
      .map(user => ({ ...user }));
  },

async getByRole(roleName) {
    await delay(300);
    return users
      .filter(user => user.roles?.includes(roleName))
      .map(user => ({ ...user }));
  },

  async assignRole(userId, roleName) {
    await delay(250);
    const user = await this.getById(userId);
    if (!user) return null;
    
    if (!user.roles.includes(roleName)) {
      user.roles.push(roleName);
      return await this.update(userId, { roles: user.roles });
    }
    return user;
  },

  async removeRole(userId, roleName) {
    await delay(250);
    const user = await this.getById(userId);
    if (!user) return null;
    
    user.roles = user.roles.filter(role => role !== roleName);
    return await this.update(userId, { roles: user.roles });
}
};