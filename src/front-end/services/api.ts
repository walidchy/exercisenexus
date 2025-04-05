
/**
 * API service for the frontend that bridges to the backend implementation
 */

import { 
  api as apiClient, 
  authApi, 
  activitiesApi, 
  bookingsApi, 
  membershipsApi, 
  usersApi, 
  trainersApi, 
  membersApi, 
  notificationsApi, 
  equipmentApi, 
  settingsApi 
} from "../../services/api";

// Re-export everything from the base api for frontend use
export const api = {
  // Auth methods
  login: authApi.login,
  register: authApi.register,
  logout: authApi.logout,
  getCurrentUser: authApi.getCurrentUser,
  forgotPassword: authApi.forgotPassword,
  
  // General API calls
  getActivities: activitiesApi.getActivities,
  getActivity: activitiesApi.getActivity,
  createActivity: activitiesApi.createActivity,
  updateActivity: activitiesApi.updateActivity,
  deleteActivity: activitiesApi.deleteActivity,
  
  getBookings: bookingsApi.getBookings,
  createBooking: bookingsApi.createBooking,
  cancelBooking: bookingsApi.cancelBooking,
  completeBooking: bookingsApi.completeBooking,
  
  getMembershipPlans: membershipsApi.getMembershipPlans,
  getUserMembership: membershipsApi.getUserMembership,
  subscribe: membershipsApi.subscribe,
  
  getUsers: usersApi.getUsers,
  verifyUser: usersApi.verifyUser,
  rejectUser: usersApi.rejectUser,
  updateUserProfile: usersApi.updateProfile,
  
  getNotifications: notificationsApi.getNotifications,
  markNotificationAsRead: notificationsApi.markAsRead,
  
  getEquipment: equipmentApi.getEquipment,
  
  getSettings: settingsApi.getSettings,
  updateSetting: settingsApi.updateSetting,
  
  // Raw API client for direct access if needed
  client: apiClient
};
