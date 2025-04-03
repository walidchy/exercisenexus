
import { api as backendApi } from "../../back-end/services/api";

/**
 * Re-export the API service from the backend
 * This allows the frontend to use the same API service
 * while maintaining a clear separation of concerns
 */
export const api = backendApi;

/**
 * This file serves as a bridge between the frontend and backend
 * It allows us to change the backend implementation without affecting the frontend
 * For example, we could switch from mock data to a real API without changing any frontend code
 */
