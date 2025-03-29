
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

  // Get all users (for admin)
  getUsers: async (token: string, role?: string) => {
    try {
      const url = role 
        ? `${API_BASE_URL}/users?role=${role}` 
        : `${API_BASE_URL}/users`;
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
};
