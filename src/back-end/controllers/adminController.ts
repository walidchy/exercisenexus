
/**
 * Admin controller for back-end API
 * This controller handles all admin-related operations
 */

import { mockApi } from "../services/mockApi";

/**
 * Admin interface defining admin data structure
 */
export interface Admin {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "manager";
  permissions: string[];
  last_login?: string;
  phone?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  status: "active" | "inactive";
}

/**
 * Interface for creating a new admin
 */
export interface CreateAdminData {
  name: string;
  email: string;
  role: "super_admin" | "admin" | "manager";
  permissions: string[];
  phone?: string;
  profile_image?: string;
  status?: "active" | "inactive";
}

// Sample data for mocking API responses
const sampleAdmins: Admin[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "super_admin",
    permissions: ["manage_users", "manage_trainers", "manage_activities", "manage_settings"],
    last_login: "2023-07-15T08:30:00Z",
    phone: "555-765-4321",
    profile_image: "https://randomuser.me/api/portraits/men/41.jpg",
    created_at: "2022-01-01T00:00:00Z",
    updated_at: "2023-07-15T08:30:00Z",
    status: "active"
  },
  {
    id: 2,
    name: "Manager User",
    email: "manager@example.com",
    role: "manager",
    permissions: ["manage_trainers", "manage_activities"],
    last_login: "2023-07-14T16:45:00Z",
    phone: "555-876-5432",
    profile_image: "https://randomuser.me/api/portraits/women/41.jpg",
    created_at: "2022-03-15T09:00:00Z",
    updated_at: "2023-07-14T16:45:00Z",
    status: "active"
  }
];

// Sample data for users pending verification
const pendingVerifications = [
  {
    id: 101,
    name: "New Member",
    email: "new.member@example.com",
    role: "member",
    registration_date: "2023-07-10T14:20:00Z",
  },
  {
    id: 102,
    name: "New Trainer",
    email: "new.trainer@example.com",
    role: "trainer",
    registration_date: "2023-07-11T09:15:00Z",
  }
];

/**
 * Admin controller implementation
 * Uses mock API for development and testing purposes
 */
export const adminController = {
  /**
   * Get all admins
   * @param token Authentication token
   * @returns Promise resolving to array of admins
   */
  getAllAdmins: async (token: string): Promise<Admin[]> => {
    const response = await mockApi.get("/api/admins", token);
    return response.data || sampleAdmins;
  },

  /**
   * Get admin by ID
   * @param token Authentication token
   * @param id Admin ID
   * @returns Promise resolving to admin or null if not found
   */
  getAdminById: async (token: string, id: number): Promise<Admin | null> => {
    try {
      const response = await mockApi.get(`/api/admins/${id}`, token);
      return response.data || sampleAdmins.find(admin => admin.id === id) || null;
    } catch (error) {
      console.error("Error fetching admin by ID:", error);
      return null;
    }
  },

  /**
   * Create a new admin
   * @param token Authentication token
   * @param adminData Data for the new admin
   * @returns Promise resolving to the created admin
   */
  createAdmin: async (token: string, adminData: CreateAdminData): Promise<Admin> => {
    const response = await mockApi.post("/api/admins", adminData, token);
    
    // If using mock data, construct an admin object
    if (!response.data) {
      const newAdmin: Admin = {
        id: sampleAdmins.length + 1,
        ...adminData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: adminData.status || "active"
      };
      sampleAdmins.push(newAdmin);
      return newAdmin;
    }
    
    return response.data;
  },

  /**
   * Update an admin
   * @param token Authentication token
   * @param id Admin ID
   * @param adminData Updated admin data
   * @returns Promise resolving to the updated admin
   */
  updateAdmin: async (token: string, id: number, adminData: Partial<CreateAdminData>): Promise<Admin | null> => {
    try {
      const response = await mockApi.put(`/api/admins/${id}`, adminData, token);
      
      // If using mock data, update the admin
      if (!response.data) {
        const index = sampleAdmins.findIndex(admin => admin.id === id);
        if (index !== -1) {
          sampleAdmins[index] = {
            ...sampleAdmins[index],
            ...adminData,
            updated_at: new Date().toISOString()
          };
          return sampleAdmins[index];
        }
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating admin:", error);
      return null;
    }
  },

  /**
   * Delete an admin
   * @param token Authentication token
   * @param id Admin ID
   * @returns Promise resolving to boolean indicating success
   */
  deleteAdmin: async (token: string, id: number): Promise<boolean> => {
    try {
      await mockApi.delete(`/api/admins/${id}`, token);
      
      // If using mock data, remove the admin
      const index = sampleAdmins.findIndex(admin => admin.id === id);
      if (index !== -1) {
        sampleAdmins.splice(index, 1);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting admin:", error);
      return false;
    }
  },
  
  /**
   * Verify a user
   * @param token Authentication token
   * @param userId User ID to verify
   * @returns Promise resolving to boolean indicating success
   */
  verifyUser: async (token: string, userId: number): Promise<boolean> => {
    try {
      await mockApi.patch(`/api/users/${userId}/verify`, {}, token);
      
      // If using mock data, remove from pending verifications
      const index = pendingVerifications.findIndex(user => user.id === userId);
      if (index !== -1) {
        pendingVerifications.splice(index, 1);
      }
      
      return true;
    } catch (error) {
      console.error("Error verifying user:", error);
      return false;
    }
  },
  
  /**
   * Get users pending verification
   * @param token Authentication token
   * @returns Promise resolving to array of unverified users
   */
  getPendingVerifications: async (token: string): Promise<any[]> => {
    const response = await mockApi.get("/api/users/pending-verification", token);
    return response.data || pendingVerifications;
  }
};
