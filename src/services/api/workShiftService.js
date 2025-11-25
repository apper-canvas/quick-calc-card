import workShiftsData from "@/services/mockData/workShifts.json";

let workShifts = [...workShiftsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const workShiftService = {
  async getAll() {
    await delay(300);
    return workShifts.map(shift => ({ ...shift }));
  },

  async getById(id) {
    await delay(200);
    const shift = workShifts.find(s => s.Id === parseInt(id));
    return shift ? { ...shift } : null;
  },

  async create(shiftData) {
    await delay(400);
    const newShift = {
      ...shiftData,
      Id: Math.max(...workShifts.map(s => s.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    workShifts.push(newShift);
    return { ...newShift };
  },

  async update(id, shiftData) {
    await delay(350);
    const index = workShifts.findIndex(s => s.Id === parseInt(id));
    if (index === -1) return null;
    
    workShifts[index] = {
      ...workShifts[index],
      ...shiftData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...workShifts[index] };
  },

  async delete(id) {
    await delay(250);
    const index = workShifts.findIndex(s => s.Id === parseInt(id));
    if (index === -1) return false;
    
    workShifts.splice(index, 1);
    return true;
  },

  async getByDropZone(dropZoneId) {
    await delay(300);
    return workShifts
      .filter(shift => shift.dropZoneId === parseInt(dropZoneId))
      .map(shift => ({ ...shift }));
  },

  async getByUser(userId) {
    await delay(300);
    return workShifts
      .filter(shift => shift.assignedUserId === parseInt(userId))
      .map(shift => ({ ...shift }));
  },

  async getByStatus(status) {
    await delay(300);
    return workShifts
      .filter(shift => shift.status === status)
      .map(shift => ({ ...shift }));
  },

  async getUpcoming(limit = 10) {
    await delay(250);
    const now = new Date();
    return workShifts
      .filter(shift => new Date(shift.startDateTime) >= now)
      .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
      .slice(0, limit)
      .map(shift => ({ ...shift }));
  }
};