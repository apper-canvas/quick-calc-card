import eventsData from "@/services/mockData/events.json";

let events = [...eventsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const eventService = {
  async getAll() {
    await delay(300);
    return events.map(event => ({ ...event }));
  },

  async getById(id) {
    await delay(200);
    const event = events.find(e => e.Id === parseInt(id));
    return event ? { ...event } : null;
  },

  async create(eventData) {
    await delay(400);
    const newEvent = {
      ...eventData,
      Id: Math.max(...events.map(e => e.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    events.push(newEvent);
    return { ...newEvent };
  },

  async update(id, eventData) {
    await delay(350);
    const index = events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) return null;
    
    events[index] = {
      ...events[index],
      ...eventData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...events[index] };
  },

  async delete(id) {
    await delay(250);
    const index = events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) return false;
    
    events.splice(index, 1);
    return true;
  },

  async getByDropZone(dropZoneId) {
    await delay(300);
    return events
      .filter(event => event.dropZoneId === parseInt(dropZoneId))
      .map(event => ({ ...event }));
  },

  async getByDateRange(startDate, endDate) {
    await delay(300);
    return events
      .filter(event => {
        const eventDate = new Date(event.startDateTime);
        return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
      })
      .map(event => ({ ...event }));
  },

  async getUpcoming(limit = 10) {
    await delay(250);
    const now = new Date();
    return events
      .filter(event => new Date(event.startDateTime) >= now)
      .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
      .slice(0, limit)
      .map(event => ({ ...event }));
  }
};