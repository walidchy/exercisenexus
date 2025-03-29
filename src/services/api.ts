
import { API_BASE_URL, getHeaders, handleApiError } from '../config/api';

// Error handler for fetch calls
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => {
      return { message: 'Something went wrong' };
    });
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// API functions
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    try {
      console.log(`Attempting to login to ${API_BASE_URL}/login`);
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Logout error:', error);
      // We still want to clear local state even if the API call fails
      return { success: true };
    }
  },
  
  // User
  getCurrentUser: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
  
  // Activities
  getActivities: async (token: string, params?: any) => {
    try {
      let url = `${API_BASE_URL}/activities`;
      if (params) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value as string);
        });
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get activities error:', error);
      throw error;
    }
  },

  getActivity: async (token: string, activityId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get activity error:', error);
      throw error;
    }
  },

  createActivity: async (token: string, activityData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(activityData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Create activity error:', error);
      throw error;
    }
  },

  updateActivity: async (token: string, activityId: number, activityData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(activityData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update activity error:', error);
      throw error;
    }
  },

  deleteActivity: async (token: string, activityId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Delete activity error:', error);
      throw error;
    }
  },

  // Activity Schedules
  addActivitySchedule: async (token: string, activityId: number, scheduleData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}/schedules`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(scheduleData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Add activity schedule error:', error);
      throw error;
    }
  },

  updateActivitySchedule: async (token: string, activityId: number, scheduleId: number, scheduleData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}/schedules/${scheduleId}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(scheduleData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update activity schedule error:', error);
      throw error;
    }
  },

  deleteActivitySchedule: async (token: string, activityId: number, scheduleId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Delete activity schedule error:', error);
      throw error;
    }
  },
  
  // Bookings
  getBookings: async (token: string, status = 'all') => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings?status=${status}`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get bookings error:', error);
      throw error;
    }
  },
  
  createBooking: async (token: string, bookingData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(bookingData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },
  
  cancelBooking: async (token: string, bookingId: number, reason?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify({ cancellation_reason: reason }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  },

  completeBooking: async (token: string, bookingId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/complete`, {
        method: 'PATCH',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Complete booking error:', error);
      throw error;
    }
  },
  
  // Memberships
  getMembershipPlans: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/membership-plans`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get membership plans error:', error);
      throw error;
    }
  },
  
  getUserMembership: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/my-membership`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get user membership error:', error);
      throw error;
    }
  },
  
  subscribe: async (token: string, planId: number, paymentMethod: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ 
          membership_plan_id: planId,
          payment_method: paymentMethod
        }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Subscribe error:', error);
      throw error;
    }
  },

  // User management (for admin)
  getUsers: async (token: string, role?: string, verified?: boolean) => {
    try {
      let url = `${API_BASE_URL}/users`;
      const params = new URLSearchParams();
      
      if (role) {
        params.append('role', role);
      }
      
      if (verified !== undefined) {
        params.append('verified', verified.toString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  // User verification for admin
  verifyUser: async (token: string, userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/verify`, {
        method: 'PATCH',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Verify user error:', error);
      throw error;
    }
  },

  // Profile management
  updateUserProfile: async (token: string, profileData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(profileData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Trainer availability
  getTrainerAvailability: async (token: string, trainerId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainers/${trainerId}/availability`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get trainer availability error:', error);
      throw error;
    }
  },

  updateTrainerAvailability: async (token: string, availabilityData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trainer/availability`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(availabilityData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update trainer availability error:', error);
      throw error;
    }
  },

  // Attendance tracking
  markAttendance: async (token: string, bookingId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/attendance`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ check_in_time: new Date().toISOString() }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Mark attendance error:', error);
      throw error;
    }
  },

  updateAttendance: async (token: string, bookingId: number, checkOutTime: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/attendance`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify({ check_out_time: checkOutTime }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update attendance error:', error);
      throw error;
    }
  },

  // Notifications
  getNotifications: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  markNotificationAsRead: async (token: string, notificationId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },

  // Equipment management
  getEquipment: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get equipment error:', error);
      throw error;
    }
  },

  // Settings
  getSettings: async (token: string, group?: string) => {
    try {
      let url = `${API_BASE_URL}/settings`;
      if (group) {
        url += `?group=${group}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(token),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get settings error:', error);
      throw error;
    }
  },

  updateSetting: async (token: string, key: string, value: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({ value }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update setting error:', error);
      throw error;
    }
  },
};
