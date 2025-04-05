
/**
 * Trainer Controller
 * Handles business logic for trainer-related operations
 */

// Define Trainer type
export interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  joinDate: string;
  rating: number;
  status: "Active" | "Inactive" | "Suspended";
  clients: number;
}

// Mock data for development
const mockTrainers: Trainer[] = [
  {
    id: 1,
    name: "Alex Rodriguez",
    email: "alex.r@example.com",
    phone: "555-111-2222",
    specialization: "Weight Training",
    joinDate: "2022-11-10",
    rating: 4.8,
    status: "Active",
    clients: 15
  },
  {
    id: 2,
    name: "Jessica Chen",
    email: "jessica.c@example.com",
    phone: "555-222-3333",
    specialization: "Yoga",
    joinDate: "2023-01-05",
    rating: 4.9,
    status: "Active",
    clients: 20
  },
  {
    id: 3,
    name: "Marcus Johnson",
    email: "marcus.j@example.com",
    phone: "555-333-4444",
    specialization: "Cardio",
    joinDate: "2022-08-15",
    rating: 4.5,
    status: "Inactive",
    clients: 8
  },
  {
    id: 4,
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    phone: "555-444-5555",
    specialization: "Pilates",
    joinDate: "2023-02-20",
    rating: 4.7,
    status: "Active",
    clients: 12
  },
  {
    id: 5,
    name: "William Taylor",
    email: "william.t@example.com",
    phone: "555-555-6666",
    specialization: "CrossFit",
    joinDate: "2022-10-01",
    rating: 4.6,
    status: "Suspended",
    clients: 5
  }
];

// Interface for creating a new trainer
export interface CreateTrainerData {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  rating: number;
  status: "Active" | "Inactive" | "Suspended";
}

/**
 * Get all trainers
 * @param token Authentication token
 * @returns Promise resolving to array of trainers
 */
export const getAllTrainers = async (token: string): Promise<Trainer[]> => {
  // In a real implementation, validate token and fetch from database
  // For now, just return mock data
  return mockTrainers;
};

/**
 * Get trainer by ID
 * @param token Authentication token
 * @param id Trainer ID
 * @returns Promise resolving to trainer or null if not found
 */
export const getTrainerById = async (token: string, id: number): Promise<Trainer | null> => {
  const trainer = mockTrainers.find(t => t.id === id);
  return trainer || null;
};

/**
 * Create a new trainer
 * @param token Authentication token
 * @param trainerData Data for the new trainer
 * @returns Promise resolving to the created trainer
 */
export const createTrainer = async (token: string, trainerData: CreateTrainerData): Promise<Trainer> => {
  // In a real implementation, validate token and insert into database
  const newTrainer: Trainer = {
    id: mockTrainers.length + 1,
    joinDate: new Date().toISOString().split('T')[0],
    clients: 0, // New trainers start with 0 clients
    ...trainerData
  };
  
  // In a real app, we would add to database
  mockTrainers.push(newTrainer);
  
  return newTrainer;
};

/**
 * Update a trainer
 * @param token Authentication token
 * @param id Trainer ID
 * @param trainerData Updated trainer data
 * @returns Promise resolving to the updated trainer
 */
export const updateTrainer = async (token: string, id: number, trainerData: Partial<CreateTrainerData>): Promise<Trainer | null> => {
  const trainerIndex = mockTrainers.findIndex(t => t.id === id);
  
  if (trainerIndex === -1) {
    return null;
  }
  
  const updatedTrainer = {
    ...mockTrainers[trainerIndex],
    ...trainerData
  };
  
  mockTrainers[trainerIndex] = updatedTrainer;
  
  return updatedTrainer;
};

/**
 * Delete a trainer
 * @param token Authentication token
 * @param id Trainer ID
 * @returns Promise resolving to boolean indicating success
 */
export const deleteTrainer = async (token: string, id: number): Promise<boolean> => {
  const trainerIndex = mockTrainers.findIndex(t => t.id === id);
  
  if (trainerIndex === -1) {
    return false;
  }
  
  mockTrainers.splice(trainerIndex, 1);
  
  return true;
};

export const trainerController = {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
};
