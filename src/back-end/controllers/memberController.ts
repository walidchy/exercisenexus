
/**
 * Member Controller
 * Handles business logic for member-related operations
 */

// Define Member type
export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  membershipType: string;
  status: "Active" | "Inactive" | "Suspended";
}

// Mock data for development
const mockMembers: Member[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    joinDate: "2023-01-15",
    membershipType: "Premium",
    status: "Active"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "555-987-6543",
    joinDate: "2023-02-20",
    membershipType: "Standard",
    status: "Active"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "555-456-7890",
    joinDate: "2023-03-05",
    membershipType: "Basic",
    status: "Inactive"
  },
  {
    id: 4,
    name: "Emily Wilson",
    email: "emily.w@example.com",
    phone: "555-789-0123",
    joinDate: "2023-04-10",
    membershipType: "Premium",
    status: "Active"
  },
  {
    id: 5,
    name: "David Lee",
    email: "david.l@example.com",
    phone: "555-321-6547",
    joinDate: "2023-05-25",
    membershipType: "Standard",
    status: "Suspended"
  }
];

// Interface for creating a new member
export interface CreateMemberData {
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  status: "Active" | "Inactive" | "Suspended";
}

/**
 * Get all members
 * @param token Authentication token
 * @returns Promise resolving to array of members
 */
export const getAllMembers = async (token: string): Promise<Member[]> => {
  // In a real implementation, validate token and fetch from database
  // For now, just return mock data
  return mockMembers;
};

/**
 * Get member by ID
 * @param token Authentication token
 * @param id Member ID
 * @returns Promise resolving to member or null if not found
 */
export const getMemberById = async (token: string, id: number): Promise<Member | null> => {
  const member = mockMembers.find(m => m.id === id);
  return member || null;
};

/**
 * Create a new member
 * @param token Authentication token
 * @param memberData Data for the new member
 * @returns Promise resolving to the created member
 */
export const createMember = async (token: string, memberData: CreateMemberData): Promise<Member> => {
  // In a real implementation, validate token and insert into database
  const newMember: Member = {
    id: mockMembers.length + 1,
    joinDate: new Date().toISOString().split('T')[0],
    ...memberData
  };
  
  // In a real app, we would add to database
  mockMembers.push(newMember);
  
  return newMember;
};

/**
 * Update a member
 * @param token Authentication token
 * @param id Member ID
 * @param memberData Updated member data
 * @returns Promise resolving to the updated member
 */
export const updateMember = async (token: string, id: number, memberData: Partial<CreateMemberData>): Promise<Member | null> => {
  const memberIndex = mockMembers.findIndex(m => m.id === id);
  
  if (memberIndex === -1) {
    return null;
  }
  
  const updatedMember = {
    ...mockMembers[memberIndex],
    ...memberData
  };
  
  mockMembers[memberIndex] = updatedMember;
  
  return updatedMember;
};

/**
 * Delete a member
 * @param token Authentication token
 * @param id Member ID
 * @returns Promise resolving to boolean indicating success
 */
export const deleteMember = async (token: string, id: number): Promise<boolean> => {
  const memberIndex = mockMembers.findIndex(m => m.id === id);
  
  if (memberIndex === -1) {
    return false;
  }
  
  mockMembers.splice(memberIndex, 1);
  
  return true;
};

export const memberController = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
