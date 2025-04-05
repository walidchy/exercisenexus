
/**
 * API service for the frontend that bridges to the backend implementation
 * This allows us to switch between mock data and a real API
 * without changing any frontend code
 */

import { api as backendApi } from "../../back-end/services/api";

/**
 * Re-export the API service from the backend
 * This allows the frontend to use the same API service
 * while maintaining a clear separation of concerns
 */
export const api = backendApi;
