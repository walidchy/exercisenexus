/**
 * Trainer controller for back-end API
 * This controller handles all trainer-related operations
 */

import mockApi from "../services/mockApi";

/**
 * Trainer interface defining trainer data structure
 */
export interface Trainer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialties: string[];
  experience_years: number;
  certification: string[];
  availability?: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
  rating?: number;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  status: "active" | "inactive" | "on_leave";
}

/**
 * Interface for creating a new trainer
 */
export interface CreateTrainerData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialties: string[];
  experience_years: number;
  certification: string[];
  availability?: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
  profile_image?: string;
  status?: "active" | "inactive" | "on_leave";
}

// Sample data for mocking API responses
const sampleTrainers: Trainer[] = [
  {
    id: 1,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "555-345-6789",
    bio: "Professional trainer with expertise in strength training and nutrition.",
    specialties: ["Strength Training", "Nutrition", "Weight Loss"],
    experience_years: 8,
    certification: ["NASM CPT", "ACE Nutrition Specialist"],
    availability: [
      { day: "Monday", start_time: "09:00", end_time: "17:00" },
      { day: "Wednesday", start_time: "09:00", end_time: "17:00" },
      { day: "Friday", start_time: "09:00", end_time: "17:00" }
    ],
    rating: 4.8,
    profile_image: "https://randomuser.me/api/portraits/men/22.jpg",
    created_at: "2022-06-15T10:00:00Z",
    updated_at: "2023-01-10T14:30:00Z",
    status: "active"
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "555-456-7890",
    bio: "Yoga instructor and rehabilitation specialist with 6 years experience.",
    specialties: ["Yoga", "Pilates", "Rehabilitation"],
    experience_years: 6,
    certification: ["RYT 200", "ACE Group Fitness"],
    availability: [
      { day: "Tuesday", start_time: "08:00", end_time: "16:00" },
      { day: "Thursday", start_time: "08:00", end_time: "16:00" },
      { day: "Saturday", start_time: "10:00", end_time: "15:00" }
    ],
    rating: 4.9,
    profile_image: "https://randomuser.me/api/portraits/women/22.jpg",
    created_at: "2022-08-20T11:15:00Z",
    updated_at: "2023-02-05T09:45:00Z",
    status: "active"
  }
];

/**
 * Trainer controller implementation
 * Uses mock API for development and testing purposes
 */
export const trainerController = {
  /**
   * Get all trainers
   * @param token Authentication token
   * @returns Promise resolving to array of trainers
   */
  getAllTrainers: async (token: string): Promise<Trainer[]> => {
    const response = await mockApi.get("/api/trainers", token);
    return response.data || sampleTrainers;
  },

  /**
   * Get trainer by ID
   * @param token Authentication token
   * @param id Trainer ID
   * @returns Promise resolving to trainer or null if not found
   */
  getTrainerById: async (token: string, id: number): Promise<Trainer | null> => {
    try {
      const response = await mockApi.get(`/api/trainers/${id}`, token);
      return response.data || sampleTrainers.find(trainer => trainer.id === id) || null;
    } catch (error) {
      console.error("Error fetching trainer by ID:", error);
      return null;
    }
  },

  /**
   * Create a new trainer
   * @param token Authentication token
   * @param trainerData Data for the new trainer
   * @returns Promise resolving to the created trainer
   */
  createTrainer: async (token: string, trainerData: CreateTrainerData): Promise<Trainer> => {
    const response = await mockApi.post("/api/trainers", trainerData, token);
    
    // If using mock data, construct a trainer object
    if (!response.data) {
      const newTrainer: Trainer = {
        id: sampleTrainers.length + 1,
        ...trainerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: trainerData.status || "active"
      };
      sampleTrainers.push(newTrainer);
      return newTrainer;
    }
    
    return response.data;
  },

  /**
   * Update a trainer
   * @param token Authentication token
   * @param id Trainer ID
   * @param trainerData Updated trainer data
   * @returns Promise resolving to the updated trainer
   */
  updateTrainer: async (token: string, id: number, trainerData: Partial<CreateTrainerData>): Promise<Trainer | null> => {
    try {
      const response = await mockApi.put(`/api/trainers/${id}`, trainerData, token);
      
      // If using mock data, update the trainer
      if (!response.data) {
        const index = sampleTrainers.findIndex(trainer => trainer.id === id);
        if (index !== -1) {
          sampleTrainers[index] = {
            ...sampleTrainers[index],
            ...trainerData,
            updated_at: new Date().toISOString()
          };
          return sampleTrainers[index];
        }
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating trainer:", error);
      return null;
    }
  },

  /**
   * Delete a trainer
   * @param token Authentication token
   * @param id Trainer ID
   * @returns Promise resolving to boolean indicating success
   */
  deleteTrainer: async (token: string, id: number): Promise<boolean> => {
    try {
      await mockApi.delete(`/api/trainers/${id}`, token);
      
      // If using mock data, remove the trainer
      const index = sampleTrainers.findIndex(trainer => trainer.id === id);
      if (index !== -1) {
        sampleTrainers.splice(index, 1);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting trainer:", error);
      return false;
    }
  }
};
