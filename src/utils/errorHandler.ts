
import { toast } from "sonner";

/**
 * Interface for the standard error response structure
 */
interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  error?: string;
  status?: number;
}

/**
 * Extract error message from various error response formats
 * @param error Error object from API or other sources
 * @returns Formatted error message string
 */
export const extractErrorMessage = (error: any): string => {
  // Handle axios error responses
  if (error.response && error.response.data) {
    const errorData: ErrorResponse = error.response.data;
    
    // Check for formatted message
    if (errorData.message) {
      return errorData.message;
    }
    
    // Check for validation errors
    if (errorData.errors) {
      const errorMessages = Object.values(errorData.errors).flat();
      return errorMessages.join('. ');
    }
    
    // Check for simple error property
    if (errorData.error) {
      return errorData.error;
    }
    
    // Fall back to HTTP status text
    if (error.response.statusText) {
      return `Error: ${error.response.status} ${error.response.statusText}`;
    }
  }
  
  // Handle network errors
  if (error.request && !error.response) {
    return "Network error. Please check your connection.";
  }
  
  // Handle standard Error objects
  if (error.message) {
    return error.message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Default fallback
  return "An unknown error occurred";
};

/**
 * Handle API errors and display appropriate toast notifications
 * @param error Error object from API or other sources
 * @param customMessage Optional custom message to display instead of the extracted one
 */
export const handleApiError = (error: any, customMessage?: string): void => {
  console.error("API Error:", error);
  
  const message = customMessage || extractErrorMessage(error);
  toast.error(message);
};

/**
 * Check if an error is a validation error
 * @param error Error object to check
 * @returns Boolean indicating if this is a validation error
 */
export const isValidationError = (error: any): boolean => {
  return (
    error.response?.status === 422 || 
    (error.response?.data?.errors && Object.keys(error.response.data.errors).length > 0)
  );
};

/**
 * Format validation errors for display in forms
 * @param error Error object from API
 * @returns Record of field names and their error messages
 */
export const formatValidationErrors = (error: any): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  if (error.response?.data?.errors) {
    const { errors } = error.response.data;
    
    // Convert array of errors per field to single error message
    Object.entries(errors).forEach(([field, messages]) => {
      formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages as string;
    });
  }
  
  return formattedErrors;
};
