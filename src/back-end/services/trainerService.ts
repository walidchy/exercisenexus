
import { api } from "./api";

export interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  specialization: string;
  rating: number;
  status: string;
  clients: number;
}

export const trainerService = {
  getTrainers: async (token: string): Promise<Trainer[]> => {
    try {
      const response = await api.getUsers(token, "trainer");
      // Transform the data to match our Trainer interface
      return response.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "+1 (555) 123-4567",
        joinDate: user.joined_date || "2022-05-15",
        specialization: user.specialties?.join(", ") || "General Fitness",
        rating: user.rating || 4.5,
        status: user.status || "Active",
        clients: user.clients || Math.floor(Math.random() * 20) + 5
      }));
    } catch (error) {
      console.error("Error fetching trainers:", error);
      throw error;
    }
  },

  addTrainer: async (token: string, trainerData: Omit<Trainer, "id" | "joinDate" | "clients">): Promise<Trainer> => {
    try {
      // In a real app, we would call the API to create a trainer
      // For now, we'll just return a mock trainer with the data
      return {
        id: Math.floor(Math.random() * 1000) + 100,
        ...trainerData,
        joinDate: new Date().toISOString().split('T')[0],
        clients: 0
      };
    } catch (error) {
      console.error("Error adding trainer:", error);
      throw error;
    }
  },

  updateTrainer: async (token: string, trainerId: number, trainerData: Partial<Trainer>): Promise<Trainer> => {
    try {
      // In a real app, we would call the API to update the trainer
      // For now, we'll just return a mock updated trainer
      return {
        id: trainerId,
        name: trainerData.name || "",
        email: trainerData.email || "",
        phone: trainerData.phone || "",
        joinDate: trainerData.joinDate || new Date().toISOString().split('T')[0],
        specialization: trainerData.specialization || "",
        rating: trainerData.rating || 4.5,
        status: trainerData.status || "Active",
        clients: trainerData.clients || 0
      };
    } catch (error) {
      console.error("Error updating trainer:", error);
      throw error;
    }
  },

  deleteTrainer: async (token: string, trainerId: number): Promise<void> => {
    try {
      // In a real app, we would call the API to delete the trainer
      // For now, we'll just return a success
      return;
    } catch (error) {
      console.error("Error deleting trainer:", error);
      throw error;
    }
  }
};
