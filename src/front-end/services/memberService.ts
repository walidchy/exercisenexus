
/**
 * Member service for the frontend
 * Bridges to the backend implementation
 */

import { memberController, Member, CreateMemberData } from "../../back-end/controllers/memberController";

// Re-export types
export type { Member, CreateMemberData };

// Member service functions for frontend
export const memberService = {
  /**
   * Get all members
   * @param token Authentication token
   * @returns Promise resolving to array of members
   */
  getAllMembers: async (token: string): Promise<Member[]> => {
    return memberController.getAllMembers(token);
  },

  /**
   * Get member by ID
   * @param token Authentication token
   * @param id Member ID
   * @returns Promise resolving to member or null if not found
   */
  getMemberById: async (token: string, id: number): Promise<Member | null> => {
    return memberController.getMemberById(token, id);
  },

  /**
   * Create a new member
   * @param token Authentication token
   * @param memberData Data for the new member
   * @returns Promise resolving to the created member
   */
  createMember: async (token: string, memberData: CreateMemberData): Promise<Member> => {
    return memberController.createMember(token, memberData);
  },

  /**
   * Update a member
   * @param token Authentication token
   * @param id Member ID
   * @param memberData Updated member data
   * @returns Promise resolving to the updated member
   */
  updateMember: async (token: string, id: number, memberData: Partial<CreateMemberData>): Promise<Member | null> => {
    return memberController.updateMember(token, id, memberData);
  },

  /**
   * Delete a member
   * @param token Authentication token
   * @param id Member ID
   * @returns Promise resolving to boolean indicating success
   */
  deleteMember: async (token: string, id: number): Promise<boolean> => {
    return memberController.deleteMember(token, id);
  }
};
