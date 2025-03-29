
export const API_BASE_URL = 'http://localhost:8000/api';

// Base headers for API requests
export const getHeaders = (token?: string) => {
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
