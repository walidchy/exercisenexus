
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { ArrowUpDown, Award, Calendar, Download, FileEdit, Search, Trash, User, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

interface Trainer {
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

export default function Trainers() {
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showViewDialog, setShowViewDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    status: "Active",
    rating: "4.5"
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    status: "",
    rating: ""
  });
  
  // Fetch trainers on component mount
  useEffect(() => {
    fetchTrainers();
  }, []);
  
  const fetchTrainers = async () => {
    try {
      setIsLoading(true);
      // In a real app, we would use the API to fetch trainers
      // For now, we're using the mock data
      if (token) {
        const response = await api.getUsers(token, "trainer");
        // Transform the data to match our Trainer interface
        const formattedTrainers = response.map((user: any) => ({
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
        setTrainers(formattedTrainers);
      }
    } catch (error) {
      console.error("Error fetching trainers:", error);
      toast.error("Failed to load trainers");
      // Fallback to sample data if API fails
      setTrainers([
        {
          id: 1,
          name: "Sarah Miller",
          email: "sarah@example.com",
          phone: "+1 (555) 123-7890",
          joinDate: "2022-05-15",
          specialization: "Strength & Conditioning",
          rating: 4.9,
          status: "Active",
          clients: 20
        },
        {
          id: 2,
          name: "Mike Johnson",
          email: "mike@example.com",
          phone: "+1 (555) 234-5678",
          joinDate: "2022-02-10",
          specialization: "Cardio & HIIT",
          rating: 4.7,
          status: "Active",
          clients: 15
        },
        {
          id: 3,
          name: "Emma Wilson",
          email: "emma@example.com",
          phone: "+1 (555) 345-6789",
          joinDate: "2023-01-20",
          specialization: "Yoga & Pilates",
          rating: 4.8,
          status: "Active",
          clients: 18
        },
        {
          id: 4,
          name: "Alex Rodriguez",
          email: "alex@example.com",
          phone: "+1 (555) 456-7890",
          joinDate: "2022-08-03",
          specialization: "Weight Training",
          rating: 4.6,
          status: "Active",
          clients: 12
        },
        {
          id: 5,
          name: "John Smith",
          email: "john@example.com",
          phone: "+1 (555) 567-8901",
          joinDate: "2022-11-15",
          specialization: "Cycling & Cardio",
          rating: 4.5,
          status: "On Leave",
          clients: 10
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredTrainers = trainers.filter(trainer => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      trainer.name.toLowerCase().includes(searchLower) ||
      trainer.email.toLowerCase().includes(searchLower) ||
      trainer.phone.includes(searchQuery) ||
      trainer.specialization.toLowerCase().includes(searchLower) ||
      trainer.status.toLowerCase().includes(searchLower)
    );
  });
  
  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleAddTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, we'd send this to the API
      const newTrainer = {
        id: trainers.length + 1,
        name: addFormData.name,
        email: addFormData.email,
        phone: addFormData.phone,
        joinDate: new Date().toISOString().split('T')[0],
        specialization: addFormData.specialization,
        rating: parseFloat(addFormData.rating),
        status: addFormData.status,
        clients: 0
      };
      
      // Add to our local state
      setTrainers(prev => [...prev, newTrainer]);
      
      // Reset form
      setAddFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        status: "Active",
        rating: "4.5"
      });
      
      toast.success("Trainer added successfully!");
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error adding trainer:", error);
      toast.error("Failed to add trainer");
    }
  };

  const handleViewTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setShowViewDialog(true);
  };

  const handleEditClick = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setEditFormData({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      specialization: trainer.specialization,
      status: trainer.status,
      rating: String(trainer.rating)
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setShowDeleteDialog(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer) return;
    
    try {
      // Update the trainer in our local state
      const updatedTrainers = trainers.map(trainer => {
        if (trainer.id === selectedTrainer.id) {
          return {
            ...trainer,
            name: editFormData.name,
            email: editFormData.email,
            phone: editFormData.phone,
            specialization: editFormData.specialization,
            status: editFormData.status,
            rating: parseFloat(editFormData.rating)
          };
        }
        return trainer;
      });
      
      setTrainers(updatedTrainers);
      toast.success(`Trainer ${selectedTrainer.name} updated successfully!`);
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating trainer:", error);
      toast.error("Failed to update trainer");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTrainer) return;
    
    try {
      // Remove the trainer from our local state
      setTrainers(prev => prev.filter(trainer => trainer.id !== selectedTrainer.id));
      toast.success(`Trainer ${selectedTrainer.name} deleted successfully!`);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting trainer:", error);
      toast.error("Failed to delete trainer");
    }
  };

  const handleExportData = () => {
    // In a real app, this would generate a CSV/Excel file
    toast.success("Trainer data exported successfully!");
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "on leave":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <AnimatedLayout>
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Loading trainers...</p>
        </div>
      </AnimatedLayout>
    );
  }

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Trainer Management</h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trainers..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-1" onClick={handleExportData}>
              <Download size={16} />
              <span>Export</span>
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <UserPlus size={16} />
                  <span>Add Trainer</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Trainer</DialogTitle>
                  <DialogDescription>
                    Create a new trainer account with basic information.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTrainer}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={addFormData.name}
                        onChange={handleAddFormChange}
                        required 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        value={addFormData.email}
                        onChange={handleAddFormChange}
                        required 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        placeholder="+1 (555) 123-4567" 
                        value={addFormData.phone}
                        onChange={handleAddFormChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input 
                        id="specialization" 
                        placeholder="Strength & Conditioning" 
                        value={addFormData.specialization}
                        onChange={handleAddFormChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Input 
                          id="status" 
                          placeholder="Active" 
                          value={addFormData.status}
                          onChange={handleAddFormChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="rating">Rating</Label>
                        <Input 
                          id="rating" 
                          type="number" 
                          step="0.1" 
                          min="1" 
                          max="5" 
                          placeholder="4.5" 
                          value={addFormData.rating}
                          onChange={handleAddFormChange}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Trainer</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Trainers</CardTitle>
            <CardDescription>
              Manage all gym trainers from here. Currently showing {filteredTrainers.length} trainers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-muted-foreground">
                    <th className="h-10 px-4 text-left font-medium">
                      <div className="flex items-center gap-1">
                        Trainer
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th className="h-10 px-4 text-left font-medium">Join Date</th>
                    <th className="h-10 px-4 text-left font-medium">Specialization</th>
                    <th className="h-10 px-4 text-left font-medium">Status</th>
                    <th className="h-10 px-4 text-left font-medium">Clients</th>
                    <th className="h-10 px-4 text-left font-medium">Rating</th>
                    <th className="h-10 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrainers.map((trainer) => (
                    <tr key={trainer.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {trainer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{trainer.name}</p>
                            <p className="text-xs text-muted-foreground">{trainer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-muted-foreground" />
                          <span>{trainer.joinDate}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {trainer.specialization}
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trainer.status)}`}>
                          {trainer.status}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        {trainer.clients}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1">
                          <Award size={14} className="text-yellow-500" />
                          <span>{trainer.rating}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={() => handleViewTrainer(trainer)}>
                            <User size={16} />
                          </Button>
                          <Button size="icon" variant="outline" onClick={() => handleEditClick(trainer)}>
                            <FileEdit size={16} />
                          </Button>
                          <Button size="icon" variant="outline" className="text-destructive" onClick={() => handleDeleteClick(trainer)}>
                            <Trash size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Trainer Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trainer Details</DialogTitle>
            <DialogDescription>
              Viewing complete information for this trainer.
            </DialogDescription>
          </DialogHeader>
          {selectedTrainer && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
                  {selectedTrainer.name.charAt(0)}
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Full Name</Label>
                <p className="font-medium">{selectedTrainer.name}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Email</Label>
                <p>{selectedTrainer.email}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Phone</Label>
                <p>{selectedTrainer.phone}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Join Date</Label>
                <p>{selectedTrainer.joinDate}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Specialization</Label>
                <p>{selectedTrainer.specialization}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-muted-foreground">Status</Label>
                  <p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTrainer.status)}`}>
                      {selectedTrainer.status}
                    </span>
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-muted-foreground">Rating</Label>
                  <p className="flex items-center gap-1">
                    <Award size={14} className="text-yellow-500" />
                    {selectedTrainer.rating}
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Active Clients</Label>
                <p>{selectedTrainer.clients}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Trainer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Trainer</DialogTitle>
            <DialogDescription>
              Update information for this trainer.
            </DialogDescription>
          </DialogHeader>
          {selectedTrainer && (
            <form onSubmit={handleEditSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={editFormData.name} 
                    onChange={handleEditFormChange} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={editFormData.email} 
                    onChange={handleEditFormChange} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={editFormData.phone} 
                    onChange={handleEditFormChange} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input 
                    id="specialization" 
                    value={editFormData.specialization} 
                    onChange={handleEditFormChange} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Input 
                      id="status" 
                      value={editFormData.status} 
                      onChange={handleEditFormChange} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input 
                      id="rating" 
                      type="number" 
                      step="0.1" 
                      min="1" 
                      max="5" 
                      value={editFormData.rating} 
                      onChange={handleEditFormChange} 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedTrainer?.name}'s account and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatedLayout>
  );
}
