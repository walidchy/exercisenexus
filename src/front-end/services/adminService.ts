
/**
 * Admin service for the frontend
 * Bridges to the backend implementation
 */

import { adminController, Admin, CreateAdminData } from "../../back-end/controllers/adminController";

// Re-export types
export type { Admin, CreateAdminData };

// Admin service functions for frontend
export const adminService = {
  /**
   * Get all admins
   * @param token Authentication token
   * @returns Promise resolving to array of admins
   */
  getAllAdmins: async (token: string): Promise<Admin[]> => {
    return adminController.getAllAdmins(token);
  },

  /**
   * Get admin by ID
   * @param token Authentication token
   * @param id Admin ID
   * @returns Promise resolving to admin or null if not found
   */
  getAdminById: async (token: string, id: number): Promise<Admin | null> => {
    return adminController.getAdminById(token, id);
  },

  /**
   * Create a new admin
   * @param token Authentication token
   * @param adminData Data for the new admin
   * @returns Promise resolving to the created admin
   */
  createAdmin: async (token: string, adminData: CreateAdminData): Promise<Admin> => {
    return adminController.createAdmin(token, adminData);
  },

  /**
   * Update an admin
   * @param token Authentication token
   * @param id Admin ID
   * @param adminData Updated admin data
   * @returns Promise resolving to the updated admin
   */
  updateAdmin: async (token: string, id: number, adminData: Partial<CreateAdminData>): Promise<Admin | null> => {
    return adminController.updateAdmin(token, id, adminData);
  },

  /**
   * Delete an admin
   * @param token Authentication token
   * @param id Admin ID
   * @returns Promise resolving to boolean indicating success
   */
  deleteAdmin: async (token: string, id: number): Promise<boolean> => {
    return adminController.deleteAdmin(token, id);
  },
  
  /**
   * Verify a user
   * @param token Authentication token
   * @param userId User ID to verify
   * @returns Promise resolving to boolean indicating success
   */
  verifyUser: async (token: string, userId: number): Promise<boolean> => {
    return adminController.verifyUser(token, userId);
  },
  
  /**
   * Get users pending verification
   * @param token Authentication token
   * @returns Promise resolving to array of unverified users
   */
  getPendingVerifications: async (token: string): Promise<any[]> => {
    return adminController.getPendingVerifications(token);
  }
};
