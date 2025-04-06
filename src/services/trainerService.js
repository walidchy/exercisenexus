
import { api } from "./api";

export const trainerService = {
  getTrainers: async (token) => {
    try {
      const response = await api.getUsers("trainer");
      // Transform the data to match our Trainer interface
      return response.map((user) => ({
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

  addTrainer: async (trainerData) => {
    try {
      // In a real app, we would call the API to create a trainer
      const response = await api.client.post('/trainers', trainerData);
      return response.data.data;
    } catch (error) {
      console.error("Error adding trainer:", error);
      throw error;
    }
  },

  updateTrainer: async (trainerId, trainerData) => {
    try {
      // Call the API to update the trainer
      const response = await api.client.put(`/trainers/${trainerId}`, trainerData);
      return response.data.data;
    } catch (error) {
      console.error("Error updating trainer:", error);
      throw error;
    }
  },

  deleteTrainer: async (trainerId) => {
    try {
      // Call the API to delete the trainer
      await api.client.delete(`/trainers/${trainerId}`);
      return;
    } catch (error) {
      console.error("Error deleting trainer:", error);
      throw error;
    }
  }
};
