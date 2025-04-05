
// API configuration constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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

// API error handling helper
export const handleApiError = (error: any): string => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    const responseData = error.response.data;
    if (responseData.message) {
      return responseData.message;
    } else if (responseData.errors) {
      // Collect validation errors
      return Object.values(responseData.errors)
        .flat()
        .join(', ');
    }
    return `Server error: ${error.response.status}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your connection.';
  } else {
    // Something happened in setting up the request
    return error.message || 'Unknown error occurred';
  }
};
