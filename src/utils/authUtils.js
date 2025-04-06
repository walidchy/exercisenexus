
/**
 * Check if a user token is valid or expired
 * @param token JWT token to check
 * @returns Boolean indicating if the token is valid
 */
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Decode JWT to get the payload
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

/**
 * Get user role-based permissions
 * @param role User role (member, trainer, admin)
 * @returns Object containing permission flags
 */
export const getRolePermissions = (role) => {
  const permissions = {
    canViewAdminDashboard: false,
    canViewTrainerDashboard: false,
    canViewMemberDashboard: false,
    canManageUsers: false,
    canManageActivities: false,
    canViewReports: false,
    canBookActivities: false,
    canManageSchedule: false,
  };
  
  switch (role) {
    case 'admin':
      permissions.canViewAdminDashboard = true;
      permissions.canViewTrainerDashboard = true; 
      permissions.canViewMemberDashboard = true;
      permissions.canManageUsers = true;
      permissions.canManageActivities = true;
      permissions.canViewReports = true;
      permissions.canBookActivities = true;
      permissions.canManageSchedule = true;
      break;
      
    case 'trainer':
      permissions.canViewTrainerDashboard = true;
      permissions.canManageActivities = true;
      permissions.canManageSchedule = true;
      break;
      
    case 'member':
      permissions.canViewMemberDashboard = true;
      permissions.canBookActivities = true;
      break;
      
    default:
      // No permissions for guests or invalid roles
      break;
  }
  
  return permissions;
};

/**
 * Check if a user has permission for a specific action
 * @param userRole User's role
 * @param requiredPermission Permission to check
 * @returns Boolean indicating if the user has permission
 */
export const hasPermission = (userRole, requiredPermission) => {
  const permissions = getRolePermissions(userRole);
  return !!permissions[requiredPermission];
};

/**
 * Generate a gravatar URL from an email address
 * @param email User's email address
 * @param size Size of the avatar image in pixels
 * @returns URL to the gravatar image
 */
export const getGravatarUrl = (email, size = 80) => {
  if (!email) return `https://gravatar.com/avatar/?s=${size}&d=mp`;
  
  // Create an MD5 hash of the email (simplified version for demo)
  const md5 = (input) => {
    // This is a placeholder - in a real app you'd use a proper MD5 implementation
    // For demo purposes, we're just using a simplified hash
    return Array.from(input)
      .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0)
      .toString(16)
      .replace(/^-/, '');
  };
  
  const hash = md5(email.trim().toLowerCase());
  return `https://gravatar.com/avatar/${hash}?s=${size}&d=mp`;
};
