/**
 * API service for the frontend that bridges to the backend implementation
 */

import { 
  api, 
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

import { trainerController } from "../../back-end/controllers/trainerController";
import { memberController } from "../../back-end/controllers/memberController";
import { adminController } from "../../back-end/controllers/adminController";

/**
 * Export the API service
 * Re-export from the main API service and use Laravel endpoints
 */
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
  updateUserProfile: usersApi.updateProfile,
  
  getNotifications: notificationsApi.getNotifications,
  markNotificationAsRead: notificationsApi.markAsRead,
  
  getEquipment: equipmentApi.getEquipment,
  
  getSettings: settingsApi.getSettings,
  updateSetting: settingsApi.updateSetting,
  
  // Keep controller references for backward compatibility
  trainers: trainerController,
  members: memberController,
  admins: adminController
};

// Export types from the back-end controllers for backward compatibility
export type { Trainer, CreateTrainerData } from "../../back-end/controllers/trainerController";
export type { Member, CreateMemberData } from "../../back-end/controllers/memberController";
export type { Admin, CreateAdminData } from "../../back-end/controllers/adminController";
