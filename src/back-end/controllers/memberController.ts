
/**
 * Member controller for back-end API
 * This controller handles all member-related operations
 */

import mockApi from "../services/mockApi";

/**
 * Member interface defining member data structure
 */
export interface Member {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  membership_type: string;
  membership_start_date: string;
  membership_end_date?: string;
  status: "active" | "inactive" | "suspended";
  profile_image?: string;
  created_at: string;
  updated_at: string;
  health_information?: {
    medical_conditions?: string[];
    allergies?: string[];
    emergency_contact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  membership_id?: number;
}

/**
 * Interface for creating a new member
 */
export interface CreateMemberData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  membership_type: string;
  status?: "active" | "inactive" | "suspended";
  profile_image?: string;
  health_information?: {
    medical_conditions?: string[];
    allergies?: string[];
    emergency_contact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  membership_id?: number;
}

// Sample data for mocking API responses
const sampleMembers: Member[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
    date_of_birth: "1990-05-15",
    membership_type: "premium",
    membership_start_date: "2023-01-01",
    membership_end_date: "2023-12-31",
    status: "active",
    profile_image: "https://randomuser.me/api/portraits/men/1.jpg",
    created_at: "2023-01-01T08:00:00Z",
    updated_at: "2023-01-01T08:00:00Z",
    health_information: {
      medical_conditions: ["None"],
      allergies: ["None"],
      emergency_contact: {
        name: "Jane Doe",
        relationship: "Spouse",
        phone: "555-987-6543"
      }
    },
    membership_id: 1
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-234-5678",
    address: "456 Oak Ave, Somewhere, USA",
    date_of_birth: "1985-08-20",
    membership_type: "basic",
    membership_start_date: "2023-02-15",
    membership_end_date: "2023-08-15",
    status: "active",
    profile_image: "https://randomuser.me/api/portraits/women/2.jpg",
    created_at: "2023-02-15T09:30:00Z",
    updated_at: "2023-02-15T09:30:00Z",
    health_information: {
      medical_conditions: ["Asthma"],
      allergies: ["Peanuts"],
      emergency_contact: {
        name: "John Smith",
        relationship: "Spouse",
        phone: "555-876-5432"
      }
    },
    membership_id: 2
  }
];

/**
 * Member controller implementation
 * Uses mock API for development and testing purposes
 */
export const memberController = {
  /**
   * Get all members
   * @param token Authentication token
   * @returns Promise resolving to array of members
   */
  getAllMembers: async (token: string): Promise<Member[]> => {
    const response = await mockApi.get("/api/members", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || sampleMembers;
  },

  /**
   * Get member by ID
   * @param token Authentication token
   * @param id Member ID
   * @returns Promise resolving to member or null if not found
   */
  getMemberById: async (token: string, id: number): Promise<Member | null> => {
    try {
      const response = await mockApi.get(`/api/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data || sampleMembers.find(member => member.id === id) || null;
    } catch (error) {
      console.error("Error fetching member by ID:", error);
      return null;
    }
  },

  /**
   * Create a new member
   * @param token Authentication token
   * @param memberData Data for the new member
   * @returns Promise resolving to the created member
   */
  createMember: async (token: string, memberData: CreateMemberData): Promise<Member> => {
    const response = await mockApi.post("/api/members", memberData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // If using mock data, construct a member object
    if (!response.data) {
      const newMember: Member = {
        id: sampleMembers.length + 1,
        ...memberData,
        membership_start_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: memberData.status || "active"
      };
      sampleMembers.push(newMember);
      return newMember;
    }
    
    return response.data;
  },

  /**
   * Update a member
   * @param token Authentication token
   * @param id Member ID
   * @param memberData Updated member data
   * @returns Promise resolving to the updated member
   */
  updateMember: async (token: string, id: number, memberData: Partial<CreateMemberData>): Promise<Member | null> => {
    try {
      const response = await mockApi.put(`/api/members/${id}`, memberData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // If using mock data, update the member
      if (!response.data) {
        const index = sampleMembers.findIndex(member => member.id === id);
        if (index !== -1) {
          sampleMembers[index] = {
            ...sampleMembers[index],
            ...memberData,
            updated_at: new Date().toISOString()
          };
          return sampleMembers[index];
        }
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating member:", error);
      return null;
    }
  },

  /**
   * Delete a member
   * @param token Authentication token
   * @param id Member ID
   * @returns Promise resolving to boolean indicating success
   */
  deleteMember: async (token: string, id: number): Promise<boolean> => {
    try {
      await mockApi.delete(`/api/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // If using mock data, remove the member
      const index = sampleMembers.findIndex(member => member.id === id);
      if (index !== -1) {
        sampleMembers.splice(index, 1);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting member:", error);
      return false;
    }
  }
};
