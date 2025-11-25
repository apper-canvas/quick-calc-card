import dropZonesData from "@/services/mockData/dropZones.json";

let dropZones = [...dropZonesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dropZoneService = {
  async getAll() {
    await delay(300);
    return dropZones.map(dz => ({ ...dz }));
  },

  async getById(id) {
    await delay(200);
const dropZone = dropZones.find(dz => dz.Id === parseInt(id));
    return dropZone ? { ...dropZone } : null;
  },

  async create(dropZoneData) {
    await delay(400);
    const newDropZone = {
      ...dropZoneData,
Id: Math.max(...dropZones.map(dz => dz.Id)) + 1,
      activeUsers: 0,
      status: dropZoneData.status || 'pending',
      upcomingEvents: 0,
      createdAt: new Date().toISOString()
    };
    dropZones.push(newDropZone);
    return { ...newDropZone };
  },

  async update(id, dropZoneData) {
    await delay(350);
    const index = dropZones.findIndex(dz => dz.Id === parseInt(id));
if (index === -1) return null;
    dropZones[index] = {
      ...dropZones[index],
      ...dropZoneData,
      Id: parseInt(id)
    };
    return { ...dropZones[index] };
  },

  async delete(id) {
await delay(250);
    const index = dropZones.findIndex(dz => dz.Id === parseInt(id));
    if (index === -1) return false;
    
    dropZones.splice(index, 1);
    return true;
  },

  async getActive() {
    await delay(250);
    return dropZones
      .filter(dz => dz.status === "active")
      .map(dz => ({ ...dz }));
  }
};