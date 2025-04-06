
import axios from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to attach the auth token to every request
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('gym_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.token) {
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
api.interceptors.response.use(
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

export default api;

// Auth API
export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  
  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('gym_user');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/user');
    return response.data.data;
  },
  
  forgotPassword: async (email) => {
    await api.post('/forgot-password', { email });
  }
};

// Activities API
export const activitiesApi = {
  getActivities: async (queryParams) => {
    try {
      const url = `/activities${queryParams ? `?${queryParams}` : ''}`;
      const response = await api.get(url);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  },
  
  getActivity: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data.data;
  },
  
  createActivity: async (data) => {
    const response = await api.post('/activities', data);
    return response.data.data;
  },
  
  updateActivity: async (id, data) => {
    const response = await api.put(`/activities/${id}`, data);
    return response.data.data;
  },
  
  deleteActivity: async (id) => {
    await api.delete(`/activities/${id}`);
  }
};

// Bookings API
export const bookingsApi = {
  getBookings: async (queryParams) => {
    const url = `/bookings${queryParams ? `?${queryParams}` : ''}`;
    const response = await api.get(url);
    return response.data.data || [];
  },
  
  createBooking: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data.data;
  },
  
  cancelBooking: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data.data;
  },
  
  completeBooking: async (id) => {
    const response = await api.patch(`/bookings/${id}/complete`);
    return response.data.data;
  }
};

// Memberships API
export const membershipsApi = {
  getMembershipPlans: async () => {
    const response = await api.get('/membership-plans');
    return response.data.data || [];
  },
  
  getUserMembership: async () => {
    const response = await api.get('/my-membership');
    return response.data.data;
  },
  
  subscribe: async (planId, paymentMethod) => {
    const response = await api.post('/subscribe', { 
      plan_id: planId, 
      payment_method: paymentMethod 
    });
    return response.data.data;
  }
};

// Users API
export const usersApi = {
  getUsers: async (role) => {
    const url = role ? `/users?role=${role}` : '/users';
    const response = await api.get(url);
    return response.data.data || [];
  },
  
  verifyUser: async (userId) => {
    const response = await api.patch(`/users/${userId}/verify`);
    return response.data.data;
  },
  
  rejectUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/profile', data);
    return response.data.data;
  }
};

// Trainers API - specific trainer functions
export const trainersApi = {
  getAvailability: async () => {
    const response = await api.get('/trainer/availability');
    return response.data.data || [];
  },
  
  updateAvailability: async (data) => {
    const response = await api.post('/trainer/availability', data);
    return response.data.data;
  }
};

// Members API - specific member functions
export const membersApi = {
  // Add any member-specific functions here
};

// Notifications API
export const notificationsApi = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data.data || [];
  },
  
  markAsRead: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data.data;
  }
};

// Equipment API
export const equipmentApi = {
  getEquipment: async () => {
    const response = await api.get('/equipment');
    return response.data.data || [];
  }
};

// Settings API
export const settingsApi = {
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data.data || [];
  },
  
  updateSetting: async (key, value) => {
    const response = await api.put(`/settings/${key}`, { value });
    return response.data.data;
  }
};
