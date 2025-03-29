
import { API_BASE_URL, getHeaders } from '../config/api';

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
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
  
  logout: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
  
  // User
  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
  
  // Activities
  getActivities: async (token: string, params?: any) => {
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
  },
  
  // Bookings
  getBookings: async (token: string, status = 'all') => {
    const response = await fetch(`${API_BASE_URL}/bookings?status=${status}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
  
  createBooking: async (token: string, bookingData: any) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  },
  
  cancelBooking: async (token: string, bookingId: number, reason?: string) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify({ cancellation_reason: reason }),
    });
    return handleResponse(response);
  },
  
  // Memberships
  getMembershipPlans: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/membership-plans`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
  
  getUserMembership: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/my-membership`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
  
  subscribe: async (token: string, planId: number, paymentMethod: string) => {
    const response = await fetch(`${API_BASE_URL}/subscribe`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ 
        membership_plan_id: planId,
        payment_method: paymentMethod
      }),
    });
    return handleResponse(response);
  },
};
