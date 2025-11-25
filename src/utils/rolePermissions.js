// Role-based permission system for SkyOps application

export const PERMISSIONS = {
  // Super Admin permissions
  ALL: "all",
  MANAGE_USERS: "manage_users",
  ASSIGN_ROLES: "assign_roles", 
  CREATE_CUSTOM_ROLES: "create_custom_roles",
  MANAGE_DROPZONES: "manage_dropzones",
  APPROVE_DROPZONES: "approve_dropzones",
  MAKE_CALENDAR_PUBLIC: "make_calendar_public",
  
  // Admin permissions
  MANAGE_EVENTS: "manage_events",
  MANAGE_SHIFTS: "manage_shifts",
  VIEW_REPORTS: "view_reports",
  ASSIGN_WORKERS: "assign_workers",
  OVERSEE_OPERATIONS: "oversee_operations",
  
  // Event Manager permissions
  CREATE_EVENTS: "create_events",
  EDIT_EVENTS: "edit_events",
  DELETE_EVENTS: "delete_events",
  VIEW_CALENDARS: "view_calendars",
  
  // Work Administrator permissions
  MANAGE_WORK_CALENDAR: "manage_work_calendar",
  APPROVE_SHIFTS: "approve_shifts",
  DECLINE_SHIFTS: "decline_shifts",
  
  // Worker permissions
  VIEW_MY_PAGE: "view_my_page",
  VIEW_SCHEDULES: "view_schedules",
  REQUEST_SHIFTS: "request_shifts",
  EDIT_MY_SHIFTS: "edit_my_shifts",
  
  // Specialized worker permissions
  CONDUCT_TANDEM_JUMPS: "conduct_tandem_jumps",
  CONDUCT_AFF_TRAINING: "conduct_aff_training",
  CAPTURE_TANDEM_MEDIA: "capture_tandem_media",
  LEAD_GROUP_JUMPS: "lead_group_jumps",
  COORDINATE_FORMATIONS: "coordinate_formations",
  CUSTOMER_SERVICE: "customer_service",
  BOOKING_MANAGEMENT: "booking_management",
  MANIFEST_JUMPERS: "manifest_jumpers",
  COORDINATE_LOADS: "coordinate_loads"
};

export const ROLE_HIERARCHY = {
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

export const DEFAULT_ROLE_PERMISSIONS = {
  "Super Admin": [
    PERMISSIONS.ALL,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.ASSIGN_ROLES,
    PERMISSIONS.CREATE_CUSTOM_ROLES,
    PERMISSIONS.MANAGE_DROPZONES,
    PERMISSIONS.APPROVE_DROPZONES,
    PERMISSIONS.MAKE_CALENDAR_PUBLIC
  ],
  "Admin": [
    PERMISSIONS.MANAGE_EVENTS,
    PERMISSIONS.MANAGE_SHIFTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.ASSIGN_WORKERS,
    PERMISSIONS.OVERSEE_OPERATIONS,
    PERMISSIONS.VIEW_CALENDARS
  ],
  "Event Manager": [
    PERMISSIONS.CREATE_EVENTS,
    PERMISSIONS.EDIT_EVENTS,
    PERMISSIONS.DELETE_EVENTS,
    PERMISSIONS.VIEW_CALENDARS
  ],
  "Work Administrator": [
    PERMISSIONS.MANAGE_WORK_CALENDAR,
    PERMISSIONS.APPROVE_SHIFTS,
    PERMISSIONS.DECLINE_SHIFTS,
    PERMISSIONS.ASSIGN_WORKERS,
    PERMISSIONS.VIEW_SCHEDULES
  ],
  "Tandem Instructor": [
    PERMISSIONS.VIEW_MY_PAGE,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.REQUEST_SHIFTS,
    PERMISSIONS.EDIT_MY_SHIFTS,
    PERMISSIONS.CONDUCT_TANDEM_JUMPS,
    PERMISSIONS.CAPTURE_TANDEM_MEDIA
  ],
  "AFF Instructor": [
    PERMISSIONS.VIEW_MY_PAGE,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.REQUEST_SHIFTS,
    PERMISSIONS.EDIT_MY_SHIFTS,
    PERMISSIONS.CONDUCT_AFF_TRAINING
  ],
  "Formation Leader": [
    PERMISSIONS.VIEW_MY_PAGE,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.REQUEST_SHIFTS,
    PERMISSIONS.EDIT_MY_SHIFTS,
    PERMISSIONS.LEAD_GROUP_JUMPS,
    PERMISSIONS.COORDINATE_FORMATIONS
  ],
  "Group Jump Leader": [
    PERMISSIONS.VIEW_MY_PAGE,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.REQUEST_SHIFTS,
    PERMISSIONS.EDIT_MY_SHIFTS,
    PERMISSIONS.LEAD_GROUP_JUMPS
  ],
  "Manifest": [
    PERMISSIONS.VIEW_MY_PAGE,
    PERMISSIONS.MANIFEST_JUMPERS,
    PERMISSIONS.COORDINATE_LOADS,
    PERMISSIONS.VIEW_SCHEDULES
  ],
  "Customer Service": [
    PERMISSIONS.VIEW_MY_PAGE,
    PERMISSIONS.CUSTOMER_SERVICE,
    PERMISSIONS.BOOKING_MANAGEMENT
  ],
  "Worker": [
    PERMISSIONS.VIEW_MY_PAGE,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.REQUEST_SHIFTS,
    PERMISSIONS.EDIT_MY_SHIFTS
  ]
};

/**
 * Check if user has specific permission
 * @param {Object} user - User object with roles array
 * @param {string} permission - Permission to check
 * @param {Array} allRoles - Array of all role objects
 * @returns {boolean}
 */
export const hasPermission = (user, permission, allRoles = []) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }

  // Check if user has Super Admin role with "all" permission
  const userRoleObjects = allRoles.filter(role => user.roles.includes(role.name));
  const hasAllPermission = userRoleObjects.some(role => 
    role.permissions && role.permissions.includes(PERMISSIONS.ALL)
  );

  if (hasAllPermission) {
    return true;
  }

  // Check specific permission
  return userRoleObjects.some(role => 
    role.permissions && role.permissions.includes(permission)
  );
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} user - User object with roles array
 * @param {Array} permissions - Array of permissions to check
 * @param {Array} allRoles - Array of all role objects
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions, allRoles = []) => {
  return permissions.some(permission => hasPermission(user, permission, allRoles));
};

/**
 * Get user's role hierarchy level
 * @param {Object} user - User object with roles array
 * @param {Array} allRoles - Array of all role objects
 * @returns {number}
 */
export const getUserRoleLevel = (user, allRoles = []) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return 0;
  }

  const userRoleObjects = allRoles.filter(role => user.roles.includes(role.name));
  return Math.max(...userRoleObjects.map(role => role.level || 0), 0);
};

/**
 * Check if user can manage another user based on role hierarchy
 * @param {Object} manager - Manager user object
 * @param {Object} target - Target user object
 * @param {Array} allRoles - Array of all role objects
 * @returns {boolean}
 */
export const canManageUser = (manager, target, allRoles = []) => {
  const managerLevel = getUserRoleLevel(manager, allRoles);
  const targetLevel = getUserRoleLevel(target, allRoles);
  
  return managerLevel > targetLevel || hasPermission(manager, PERMISSIONS.ALL, allRoles);
};

/**
 * Get all permissions for a user across all their roles
 * @param {Object} user - User object with roles array
 * @param {Array} allRoles - Array of all role objects
 * @returns {Array}
 */
export const getUserPermissions = (user, allRoles = []) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return [];
  }

  const userRoleObjects = allRoles.filter(role => user.roles.includes(role.name));
  const allPermissions = userRoleObjects.reduce((permissions, role) => {
    if (role.permissions && Array.isArray(role.permissions)) {
      return [...permissions, ...role.permissions];
    }
    return permissions;
  }, []);

  return [...new Set(allPermissions)]; // Remove duplicates
};