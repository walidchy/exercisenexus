
import axios from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to attach the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('gym_user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response && response.status === 401) {
      // Unauthorized, clear token and redirect to login
      localStorage.removeItem('gym_user');
      window.location.href = '/login';
      toast.error('Your session has expired. Please log in again.');
    } else if (response && response.status === 403) {
      // Forbidden
      toast.error('You do not have permission to perform this action.');
    } else if (response && response.status === 404) {
      // Not found
      toast.error('The requested resource was not found.');
    } else if (response && response.status === 422) {
      // Validation error
      const errors = response.data.errors;
      if (errors) {
        Object.values(errors).forEach((errorMsgs) => {
          errorMsgs.forEach((msg) => {
            toast.error(msg);
          });
        });
      } else {
        toast.error('Invalid data submitted. Please check your inputs.');
      }
    } else if (response && response.status >= 500) {
      // Server error
      toast.error('A server error occurred. Please try again later.');
    } else {
      // Network error or unknown error
      toast.error('An error occurred. Please check your connection and try again.');
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post('/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/user');
    return response.data.data;
  },
  
  forgotPassword: async (email) => {
    const response = await apiClient.post('/forgot-password', { email });
    return response.data;
  }
};

// Activities API functions
export const activitiesApi = {
  getActivities: async (params = {}) => {
    const response = await apiClient.get('/activities', { params });
    return response.data.data || [];
  },
  
  getActivity: async (id) => {
    const response = await apiClient.get(`/activities/${id}`);
    return response.data.data;
  },
  
  createActivity: async (activityData) => {
    const response = await apiClient.post('/activities', activityData);
    return response.data.data;
  },
  
  updateActivity: async (id, activityData) => {
    const response = await apiClient.put(`/activities/${id}`, activityData);
    return response.data.data;
  },
  
  deleteActivity: async (id) => {
    const response = await apiClient.delete(`/activities/${id}`);
    return response.data;
  },
  
  addSchedule: async (activityId, scheduleData) => {
    const response = await apiClient.post(`/activities/${activityId}/schedules`, scheduleData);
    return response.data.data;
  },
  
  updateSchedule: async (activityId, scheduleId, scheduleData) => {
    const response = await apiClient.put(`/activities/${activityId}/schedules/${scheduleId}`, scheduleData);
    return response.data.data;
  },
  
  deleteSchedule: async (activityId, scheduleId) => {
    const response = await apiClient.delete(`/activities/${activityId}/schedules/${scheduleId}`);
    return response.data;
  }
};

// Bookings API functions
export const bookingsApi = {
  getBookings: async (params = {}) => {
    const response = await apiClient.get('/bookings', { params });
    return response.data.data || [];
  },
  
  createBooking: async (bookingData) => {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data.data;
  },
  
  getBooking: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data.data;
  },
  
  cancelBooking: async (id, reason) => {
    const response = await apiClient.patch(`/bookings/${id}/cancel`, { cancellation_reason: reason });
    return response.data.data;
  },
  
  completeBooking: async (id) => {
    const response = await apiClient.patch(`/bookings/${id}/complete`);
    return response.data.data;
  }
};

// Memberships API functions
export const membershipsApi = {
  getMembershipPlans: async () => {
    const response = await apiClient.get('/membership-plans');
    return response.data.data || [];
  },
  
  getMembershipPlan: async (id) => {
    const response = await apiClient.get(`/membership-plans/${id}`);
    return response.data.data;
  },
  
  getUserMembership: async () => {
    const response = await apiClient.get('/my-membership');
    return response.data.data;
  },
  
  subscribe: async (planId, paymentMethod) => {
    const response = await apiClient.post('/subscribe', { membership_plan_id: planId, payment_method: paymentMethod });
    return response.data.data;
  }
};

// User management API functions
export const usersApi = {
  getUsers: async (role) => {
    const params = role ? { role } : {};
    const response = await apiClient.get('/users', { params });
    return response.data.data || [];
  },
  
  verifyUser: async (userId) => {
    const response = await apiClient.patch(`/users/${userId}/verify`);
    return response.data.data;
  },
  
  rejectUser: async (userId) => {
    const response = await apiClient.patch(`/users/${userId}/reject`);
    return response.data.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/profile', profileData);
    return response.data.data;
  }
};

// Trainers API functions
export const trainersApi = {
  getTrainers: async (params = {}) => {
    const response = await apiClient.get('/trainers', { params });
    return response.data.data || [];
  },
  
  getTrainer: async (id) => {
    const response = await apiClient.get(`/trainers/${id}`);
    return response.data.data;
  },
  
  createTrainer: async (trainerData) => {
    const response = await apiClient.post('/trainers', trainerData);
    return response.data.data;
  },
  
  updateTrainer: async (id, trainerData) => {
    const response = await apiClient.put(`/trainers/${id}`, trainerData);
    return response.data.data;
  },
  
  deleteTrainer: async (id) => {
    const response = await apiClient.delete(`/trainers/${id}`);
    return response.data;
  },
  
  getAvailability: async () => {
    const response = await apiClient.get('/trainer/availability');
    return response.data.data;
  },
  
  updateAvailability: async (availabilityData) => {
    const response = await apiClient.post('/trainer/availability', availabilityData);
    return response.data.data;
  }
};

// Members API functions
export const membersApi = {
  getMembers: async (params = {}) => {
    const response = await apiClient.get('/members', { params });
    return response.data.data || [];
  },
  
  getMember: async (id) => {
    const response = await apiClient.get(`/members/${id}`);
    return response.data.data;
  },
  
  createMember: async (memberData) => {
    const response = await apiClient.post('/members', memberData);
    return response.data.data;
  },
  
  updateMember: async (id, memberData) => {
    const response = await apiClient.put(`/members/${id}`, memberData);
    return response.data.data;
  },
  
  deleteMember: async (id) => {
    const response = await apiClient.delete(`/members/${id}`);
    return response.data;
  }
};

// Notifications API functions
export const notificationsApi = {
  getNotifications: async () => {
    const response = await apiClient.get('/notifications');
    return response.data.data || [];
  },
  
  markAsRead: async (id) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  }
};

// Equipment API functions
export const equipmentApi = {
  getEquipment: async () => {
    const response = await apiClient.get('/equipment');
    return response.data.data || [];
  }
};

// Settings API functions
export const settingsApi = {
  getSettings: async (group) => {
    const params = group ? { group } : {};
    const response = await apiClient.get('/settings', { params });
    return response.data.data || [];
  },
  
  updateSetting: async (key, value) => {
    const response = await apiClient.put(`/settings/${key}`, { value });
    return response.data.data;
  }
};

// Export the API client
export { apiClient as api };
