import axios from 'axios';
import { API_BASE_URL, getHeaders, handleApiError, USE_MOCK_DATA, MOCK_DATA } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Helper function to simulate API delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 800));

// API functions
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      // Mock authentication logic
      const mockUsers = {
        "member@example.com": {
          id: 1,
          name: "John Member",
          email: "member@example.com",
          role: "member",
          is_verified: true,
          token: "mock-token-member"
        },
        "trainer@example.com": {
          id: 2,
          name: "Jane Trainer",
          email: "trainer@example.com",
          role: "trainer",
          is_verified: true,
          token: "mock-token-trainer"
        },
        "admin@example.com": {
          id: 3,
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          is_verified: true,
          token: "mock-token-admin"
        }
      };
      
      const user = mockUsers[email as keyof typeof mockUsers];
      
      if (user && password === "password") {
        return { user, token: user.token };
      }
      
      throw new Error("Invalid credentials");
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return { message: "User registered successfully. Awaiting account verification." };
    }
    
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: async (token: string) => {
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return { success: true };
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      if (token === "mock-token-member") {
        return {
          id: 1,
          name: "John Member",
          email: "member@example.com",
          role: "member",
          is_verified: true
        };
      } else if (token === "mock-token-trainer") {
        return {
          id: 2,
          name: "Jane Trainer",
          email: "trainer@example.com",
          role: "trainer",
          is_verified: true
        };
      } else if (token === "mock-token-admin") {
        return {
          id: 3,
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          is_verified: true
        };
      }
      
      throw new Error("Invalid token");
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return MOCK_DATA.activities;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      const activity = MOCK_DATA.activities.find(a => a.id === activityId);
      if (!activity) throw new Error("Activity not found");
      return activity;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Simulate creating a new activity
      const newActivity = {
        id: MOCK_DATA.activities.length + 1,
        ...activityData,
        schedules: []
      };
      
      return newActivity;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Find the activity and simulate update
      const activityIndex = MOCK_DATA.activities.findIndex(a => a.id === activityId);
      if (activityIndex === -1) throw new Error("Activity not found");
      
      const updatedActivity = {
        ...MOCK_DATA.activities[activityIndex],
        ...activityData
      };
      
      return updatedActivity;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return { success: true };
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Find the activity
      const activity = MOCK_DATA.activities.find(a => a.id === activityId);
      if (!activity) throw new Error("Activity not found");
      
      // Create new schedule
      const newSchedule = {
        id: Math.max(...activity.schedules.map(s => s.id), 0) + 1,
        ...scheduleData
      };
      
      return newSchedule;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Find the activity
      const activity = MOCK_DATA.activities.find(a => a.id === activityId);
      if (!activity) throw new Error("Activity not found");
      
      // Find the schedule
      const scheduleIndex = activity.schedules.findIndex(s => s.id === scheduleId);
      if (scheduleIndex === -1) throw new Error("Schedule not found");
      
      // Update schedule
      const updatedSchedule = {
        ...activity.schedules[scheduleIndex],
        ...scheduleData
      };
      
      return updatedSchedule;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return { success: true };
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      if (status === 'all') {
        return MOCK_DATA.bookings;
      }
      
      return MOCK_DATA.bookings.filter(booking => booking.status === status);
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Simulate creating a new booking
      const newBooking = {
        id: MOCK_DATA.bookings.length + 1,
        user_id: 1, // Assuming the current user
        status: "confirmed",
        booked_at: new Date().toISOString(),
        ...bookingData
      };
      
      return newBooking;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Find the booking
      const bookingIndex = MOCK_DATA.bookings.findIndex(b => b.id === bookingId);
      if (bookingIndex === -1) throw new Error("Booking not found");
      
      // Update booking status
      const updatedBooking = {
        ...MOCK_DATA.bookings[bookingIndex],
        status: "cancelled",
        cancellation_reason: reason
      };
      
      return updatedBooking;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Find the booking
      const bookingIndex = MOCK_DATA.bookings.findIndex(b => b.id === bookingId);
      if (bookingIndex === -1) throw new Error("Booking not found");
      
      // Update booking status
      const updatedBooking = {
        ...MOCK_DATA.bookings[bookingIndex],
        status: "completed"
      };
      
      return updatedBooking;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return MOCK_DATA.membershipPlans;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return MOCK_DATA.userMembership;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Find the plan
      const plan = MOCK_DATA.membershipPlans.find(p => p.id === planId);
      if (!plan) throw new Error("Membership plan not found");
      
      // Simulate subscription
      const subscription = {
        id: 1,
        user_id: 1,
        membership_plan_id: planId,
        payment_method: paymentMethod,
        status: "active",
        start_date: new Date().toISOString(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        auto_renew: true
      };
      
      return subscription;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      let filteredUsers = [...MOCK_DATA.users];
      
      if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
      }
      
      if (verified !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.isVerified === verified);
      }
      
      return filteredUsers;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Find the user
      const userIndex = MOCK_DATA.users.findIndex(u => u.id === userId);
      if (userIndex === -1) throw new Error("User not found");
      
      // Update user verification status
      const updatedUser = {
        ...MOCK_DATA.users[userIndex],
        isVerified: true
      };
      
      return updatedUser;
    }
    
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

  rejectUser: async (token: string, userId: number) => {
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Find the user
      const userIndex = MOCK_DATA.users.findIndex(u => u.id === userId);
      if (userIndex === -1) throw new Error("User not found");
      
      // Update user status to rejected
      const updatedUser = {
        ...MOCK_DATA.users[userIndex],
        isVerified: false,
        status: "rejected"
      };
      
      return updatedUser;
    }
    
    try {
      const response = await apiClient.patch(`/users/${userId}/reject`, {}, {
        headers: getHeaders(token)
      });
      return response.data;
    } catch (error) {
      console.error('Reject user error:', error);
      throw error;
    }
  },

  // Profile management
  updateUserProfile: async (token: string, profileData: any) => {
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return { ...profileData, id: 1 };
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Mock trainer availability
      return [
        { day: "Monday", start_time: "09:00", end_time: "17:00" },
        { day: "Tuesday", start_time: "09:00", end_time: "17:00" },
        { day: "Wednesday", start_time: "09:00", end_time: "17:00" },
        { day: "Thursday", start_time: "09:00", end_time: "17:00" },
        { day: "Friday", start_time: "09:00", end_time: "17:00" }
      ];
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return availabilityData;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return {
        booking_id: bookingId,
        check_in_time: new Date().toISOString(),
        check_out_time: null
      };
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return {
        booking_id: bookingId,
        check_in_time: "2023-06-15T10:00:00",
        check_out_time: checkOutTime
      };
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return MOCK_DATA.notifications;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return { success: true };
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      return MOCK_DATA.equipment;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      let settings = [...MOCK_DATA.settings];
      
      if (group) {
        settings = settings.filter(setting => setting.group === group);
      }
      
      return settings;
    }
    
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
    if (USE_MOCK_DATA) {
      await simulateApiDelay();
      
      // Find the setting
      const settingIndex = MOCK_DATA.settings.findIndex(s => s.key === key);
      if (settingIndex === -1) throw new Error("Setting not found");
      
      // Update setting
      const updatedSetting = {
        ...MOCK_DATA.settings[settingIndex],
        value
      };
      
      return updatedSetting;
    }
    
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
