
/**
 * Trainer service for the frontend
 * Bridges to the backend implementation
 */

import { trainerController, Trainer, CreateTrainerData } from "../../back-end/controllers/trainerController";

// Re-export types
export type { Trainer, CreateTrainerData };

// Trainer service functions for frontend
export const trainerService = {
  /**
   * Get all trainers
   * @param token Authentication token
   * @returns Promise resolving to array of trainers
   */
  getAllTrainers: async (token: string): Promise<Trainer[]> => {
    return trainerController.getAllTrainers(token);
  },

  /**
   * Get trainer by ID
   * @param token Authentication token
   * @param id Trainer ID
   * @returns Promise resolving to trainer or null if not found
   */
  getTrainerById: async (token: string, id: number): Promise<Trainer | null> => {
    return trainerController.getTrainerById(token, id);
  },

  /**
   * Create a new trainer
   * @param token Authentication token
   * @param trainerData Data for the new trainer
   * @returns Promise resolving to the created trainer
   */
  createTrainer: async (token: string, trainerData: CreateTrainerData): Promise<Trainer> => {
    return trainerController.createTrainer(token, trainerData);
  },

  /**
   * Update a trainer
   * @param token Authentication token
   * @param id Trainer ID
   * @param trainerData Updated trainer data
   * @returns Promise resolving to the updated trainer
   */
  updateTrainer: async (token: string, id: number, trainerData: Partial<CreateTrainerData>): Promise<Trainer | null> => {
    return trainerController.updateTrainer(token, id, trainerData);
  },

  /**
   * Delete a trainer
   * @param token Authentication token
   * @param id Trainer ID
   * @returns Promise resolving to boolean indicating success
   */
  deleteTrainer: async (token: string, id: number): Promise<boolean> => {
    return trainerController.deleteTrainer(token, id);
  }
};
