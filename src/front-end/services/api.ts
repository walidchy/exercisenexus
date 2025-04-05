
/**
 * API service for the frontend that bridges to the backend implementation
 * This allows us to switch between mock data and a real API
 * without changing any frontend code
 */

import { api as backendApi } from "../../back-end/services/api";
import { trainerController, Trainer, CreateTrainerData } from "../../back-end/controllers/trainerController";
import { memberController } from "../../back-end/controllers/memberController";
import { adminController } from "../../back-end/controllers/adminController";

/**
 * Re-export the API service from the backend
 * This allows the frontend to use the same API service
 * while maintaining a clear separation of concerns
 */
export const api = {
  ...backendApi,
  trainers: trainerController,
  members: memberController,
  admins: adminController
};

// Export the trainer service types from the back-end
export type { Trainer, CreateTrainerData };

// Re-export types from member and admin services
export type { Member, CreateMemberData } from "../../back-end/controllers/memberController";
export type { Admin, CreateAdminData } from "../../back-end/controllers/adminController";
