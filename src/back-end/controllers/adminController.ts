
/**
 * Admin Controller
 * Handles business logic for admin-related operations
 */

// Define Admin type
export interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
  lastActive: string;
  status: "Active" | "Inactive" | "Suspended";
}

// Mock data for development
const mockAdmins: Admin[] = [
  {
    id: 1,
    name: "Robert Williams",
    email: "robert.w@example.com",
    phone: "555-111-0000",
    role: "Super Admin",
    joinDate: "2022-01-15",
    lastActive: "2023-11-20",
    status: "Active"
  },
  {
    id: 2,
    name: "Amanda Clark",
    email: "amanda.c@example.com",
    phone: "555-222-0000",
    role: "Member Manager",
    joinDate: "2022-03-01",
    lastActive: "2023-11-19",
    status: "Active"
  },
  {
    id: 3,
    name: "Kevin Rodriguez",
    email: "kevin.r@example.com",
    phone: "555-333-0000",
    role: "Trainer Manager",
    joinDate: "2022-05-10",
    lastActive: "2023-11-18",
    status: "Active"
  },
  {
    id: 4,
    name: "Lisa Thompson",
    email: "lisa.t@example.com",
    phone: "555-444-0000",
    role: "Facilities Manager",
    joinDate: "2022-07-22",
    lastActive: "2023-11-10",
    status: "Inactive"
  },
  {
    id: 5,
    name: "Daniel Moore",
    email: "daniel.m@example.com",
    phone: "555-555-0000",
    role: "Finance Manager",
    joinDate: "2022-09-05",
    lastActive: "2023-11-15",
    status: "Active"
  }
];

// Interface for creating a new admin
export interface CreateAdminData {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive" | "Suspended";
}

/**
 * Get all admins
 * @param token Authentication token
 * @returns Promise resolving to array of admins
 */
export const getAllAdmins = async (token: string): Promise<Admin[]> => {
  // In a real implementation, validate token and fetch from database
  // For now, just return mock data
  return mockAdmins;
};

/**
 * Get admin by ID
 * @param token Authentication token
 * @param id Admin ID
 * @returns Promise resolving to admin or null if not found
 */
export const getAdminById = async (token: string, id: number): Promise<Admin | null> => {
  const admin = mockAdmins.find(a => a.id === id);
  return admin || null;
};

/**
 * Create a new admin
 * @param token Authentication token
 * @param adminData Data for the new admin
 * @returns Promise resolving to the created admin
 */
export const createAdmin = async (token: string, adminData: CreateAdminData): Promise<Admin> => {
  // In a real implementation, validate token and insert into database
  const newAdmin: Admin = {
    id: mockAdmins.length + 1,
    joinDate: new Date().toISOString().split('T')[0],
    lastActive: new Date().toISOString().split('T')[0],
    ...adminData
  };
  
  // In a real app, we would add to database
  mockAdmins.push(newAdmin);
  
  return newAdmin;
};

/**
 * Update an admin
 * @param token Authentication token
 * @param id Admin ID
 * @param adminData Updated admin data
 * @returns Promise resolving to the updated admin
 */
export const updateAdmin = async (token: string, id: number, adminData: Partial<CreateAdminData>): Promise<Admin | null> => {
  const adminIndex = mockAdmins.findIndex(a => a.id === id);
  
  if (adminIndex === -1) {
    return null;
  }
  
  const updatedAdmin = {
    ...mockAdmins[adminIndex],
    ...adminData,
    lastActive: new Date().toISOString().split('T')[0] // Update last active date
  };
  
  mockAdmins[adminIndex] = updatedAdmin;
  
  return updatedAdmin;
};

/**
 * Delete an admin
 * @param token Authentication token
 * @param id Admin ID
 * @returns Promise resolving to boolean indicating success
 */
export const deleteAdmin = async (token: string, id: number): Promise<boolean> => {
  const adminIndex = mockAdmins.findIndex(a => a.id === id);
  
  if (adminIndex === -1) {
    return false;
  }
  
  mockAdmins.splice(adminIndex, 1);
  
  return true;
};

/**
 * Verify a user (member, trainer)
 * @param token Authentication token
 * @param userId User ID to verify
 * @returns Promise resolving to boolean indicating success
 */
export const verifyUser = async (token: string, userId: number): Promise<boolean> => {
  // In a real implementation, this would update a user's verification status
  return true;
};

/**
 * Reject a user verification request
 * @param token Authentication token
 * @param userId User ID to reject
 * @returns Promise resolving to boolean indicating success
 */
export const rejectUser = async (token: string, userId: number): Promise<boolean> => {
  // In a real implementation, this would reject a user's verification request
  return true;
};

/**
 * Get system statistics
 * @param token Authentication token
 * @returns Promise resolving to system statistics
 */
export const getSystemStats = async (token: string): Promise<Record<string, number>> => {
  return {
    totalMembers: 156,
    activeMembers: 132,
    totalTrainers: 24,
    activeTrainers: 22,
    newMembersToday: 3,
    totalBookings: 478,
    bookingsToday: 42,
    revenue: 12500
  };
};

export const adminController = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  verifyUser,
  rejectUser,
  getSystemStats
};
