
import axios from 'axios';
import { API_BASE_URL, getHeaders, handleApiError } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// API functions
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    try {
      console.log(`Attempting to login to ${API_BASE_URL}/login`);
      const response = await apiClient.post('/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: async (token: string) => {
    try {
      const response = await apiClient.post('/logout', {}, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // We still want to clear local state even if the API call fails
      return { success: true };
    }
  },
  
  // User
  getCurrentUser: async (token: string) => {
    try {
      const response = await apiClient.get('/user', {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
  
  // Activities
  getActivities: async (token: string, params?: any) => {
    try {
      const response = await apiClient.get('/activities', {
        headers: getHeaders(token),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Get activities error:', error);
      throw error;
    }
  },

  getActivity: async (token: string, activityId: number) => {
    try {
      const response = await apiClient.get(`/activities/${activityId}`, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Get activity error:', error);
      throw error;
    }
  },

  createActivity: async (token: string, activityData: any) => {
    try {
      const response = await apiClient.post('/activities', activityData, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Create activity error:', error);
      throw error;
    }
  },

  updateActivity: async (token: string, activityId: number, activityData: any) => {
    try {
      const response = await apiClient.put(`/activities/${activityId}`, activityData, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Update activity error:', error);
      throw error;
    }
  },

  deleteActivity: async (token: string, activityId: number) => {
    try {
      const response = await apiClient.delete(`/activities/${activityId}`, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Delete activity error:', error);
      throw error;
    }
  },

  // Activity Schedules
  addActivitySchedule: async (token: string, activityId: number, scheduleData: any) => {
    try {
      const response = await apiClient.post(`/activities/${activityId}/schedules`, scheduleData, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Add activity schedule error:', error);
      throw error;
    }
  },

  updateActivitySchedule: async (token: string, activityId: number, scheduleId: number, scheduleData: any) => {
    try {
      const response = await apiClient.put(`/activities/${activityId}/schedules/${scheduleId}`, scheduleData, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Update activity schedule error:', error);
      throw error;
    }
  },

  deleteActivitySchedule: async (token: string, activityId: number, scheduleId: number) => {
    try {
      const response = await apiClient.delete(`/activities/${activityId}/schedules/${scheduleId}`, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Delete activity schedule error:', error);
      throw error;
    }
  },
  
  // Bookings
  getBookings: async (token: string, status = 'all') => {
    try {
      const response = await apiClient.get(`/bookings?status=${status}`, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Get bookings error:', error);
      throw error;
    }
  },
  
  createBooking: async (token: string, bookingData: any) => {
    try {
      const response = await apiClient.post('/bookings', bookingData, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },
  
  cancelBooking: async (token: string, bookingId: number, reason?: string) => {
    try {
      const response = await apiClient.patch(`/bookings/${bookingId}/cancel`, 
        { cancellation_reason: reason },
        { headers: getHeaders(token) }
      );
      return response.data;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  },

  completeBooking: async (token: string, bookingId: number) => {
    try {
      const response = await apiClient.patch(`/bookings/${bookingId}/complete`, {}, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Complete booking error:', error);
      throw error;
    }
  },
  
  // Memberships
  getMembershipPlans: async (token: string) => {
    try {
      const response = await apiClient.get('/membership-plans', {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Get membership plans error:', error);
      throw error;
    }
  },
  
  getUserMembership: async (token: string) => {
    try {
      const response = await apiClient.get('/my-membership', {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Get user membership error:', error);
      throw error;
    }
  },
  
  subscribe: async (token: string, planId: number, paymentMethod: string) => {
    try {
      const response = await apiClient.post('/subscribe', 
        { membership_plan_id: planId, payment_method: paymentMethod },
        { headers: getHeaders(token) }
      );
      return response.data;
    } catch (error) {
      console.error('Subscribe error:', error);
      throw error;
    }
  },

  // User management (for admin)
  getUsers: async (token: string, role?: string, verified?: boolean) => {
    try {
      const params: any = {};
      if (role) params.role = role;
      if (verified !== undefined) params.verified = verified.toString();
      
      const response = await apiClient.get('/users', {
        headers: getHeaders(token),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  // User verification for admin
  verifyUser: async (token: string, userId: number) => {
    try {
      const response = await apiClient.patch(`/users/${userId}/verify`, {}, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Verify user error:', error);
      throw error;
    }
  },

  // Profile management
  updateUserProfile: async (token: string, profileData: any) => {
    try {
      const response = await apiClient.put('/profile', profileData, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Trainer availability
  getTrainerAvailability: async (token: string, trainerId: number) => {
    try {
      const response = await apiClient.get(`/trainers/${trainerId}/availability`, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Get trainer availability error:', error);
      throw error;
    }
  },

  updateTrainerAvailability: async (token: string, availabilityData: any) => {
    try {
      const response = await apiClient.post('/trainer/availability', availabilityData, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Update trainer availability error:', error);
      throw error;
    }
  },

  // Attendance tracking
  markAttendance: async (token: string, bookingId: number) => {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/attendance`, 
        { check_in_time: new Date().toISOString() },
        { headers: getHeaders(token) }
      );
      return response.data;
    } catch (error) {
      console.error('Mark attendance error:', error);
      throw error;
    }
  },

  updateAttendance: async (token: string, bookingId: number, checkOutTime: string) => {
    try {
      const response = await apiClient.patch(`/bookings/${bookingId}/attendance`, 
        { check_out_time: checkOutTime },
        { headers: getHeaders(token) }
      );
      return response.data;
    } catch (error) {
      console.error('Update attendance error:', error);
      throw error;
    }
  },

  // Notifications
  getNotifications: async (token: string) => {
    try {
      const response = await apiClient.get('/notifications', {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  markNotificationAsRead: async (token: string, notificationId: number) => {
    try {
      const response = await apiClient.patch(`/notifications/${notificationId}/read`, {}, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },

  // Equipment management
  getEquipment: async (token: string) => {
    try {
      const response = await apiClient.get('/equipment', {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Get equipment error:', error);
      throw error;
    }
  },

  // Settings
  getSettings: async (token: string, group?: string) => {
    try {
      const params = group ? { group } : {};
      const response = await apiClient.get('/settings', {
        headers: getHeaders(token),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Get settings error:', error);
      throw error;
    }
  },

  updateSetting: async (token: string, key: string, value: any) => {
    try {
      const response = await apiClient.put(`/settings/${key}`, { value }, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Update setting error:', error);
      throw error;
    }
  },
};
