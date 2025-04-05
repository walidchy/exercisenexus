import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, MoreHorizontal, Pencil, Trash } from "lucide-react";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trainerService, Trainer } from "@/back-end/services/trainerService";
import { useAuth } from "@/front-end/hooks/useAuth";

const trainerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  specialization: z.string().min(2, {
    message: "Specialization must be at least 2 characters.",
  }),
  rating: z.number().min(0).max(5),
  status: z.enum(["Active", "Inactive", "Suspended"]),
});

type TrainerFormValues = z.infer<typeof trainerSchema>;

const Trainers = () => {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  
  const queryClient = useQueryClient();

  const { data: trainers = [], isLoading, error } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      if (!user?.token) {
        throw new Error("Authentication token is missing");
      }
      return trainerService.getTrainers(user.token);
    },
    enabled: !!user?.token,
  });

  const addTrainerMutation = useMutation({
    mutationFn: (newTrainer: TrainerFormValues) => {
      if (!user?.token) {
        throw new Error("Authentication token is missing");
      }
      return trainerService.addTrainer(user.token, newTrainer);
    },
    onSuccess: () => {
      toast.success("Trainer added successfully!");
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to add trainer: ${error.message}`);
    },
  });

  const updateTrainerMutation = useMutation({
    mutationFn: (updatedTrainer: Partial<Trainer> & { id: number }) => {
      if (!user?.token) {
        throw new Error("Authentication token is missing");
      }
      return trainerService.updateTrainer(user.token, updatedTrainer.id, updatedTrainer);
    },
    onSuccess: () => {
      toast.success("Trainer updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      setIsEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to update trainer: ${error.message}`);
    },
  });

  const deleteTrainerMutation = useMutation({
    mutationFn: (trainerId: number) => {
      if (!user?.token) {
        throw new Error("Authentication token is missing");
      }
      return trainerService.deleteTrainer(user.token, trainerId);
    },
    onSuccess: () => {
      toast.success("Trainer deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      setIsDeleteDialogOpen(false);
      setSelectedTrainer(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete trainer: ${error.message}`);
    },
  });

  const addTrainerForm = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialization: "",
      rating: 0,
      status: "Active" as const,
    },
  });

  const editTrainerForm = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      name: selectedTrainer?.name || "",
      email: selectedTrainer?.email || "",
      phone: selectedTrainer?.phone || "",
      specialization: selectedTrainer?.specialization || "",
      rating: selectedTrainer?.rating || 0,
      status: (selectedTrainer?.status as "Active" | "Inactive" | "Suspended") || "Active",
    },
    values: {
      name: selectedTrainer?.name || "",
      email: selectedTrainer?.email || "",
      phone: selectedTrainer?.phone || "",
      specialization: selectedTrainer?.specialization || "",
      rating: selectedTrainer?.rating || 0,
      status: (selectedTrainer?.status as "Active" | "Inactive" | "Suspended") || "Active",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (selectedTrainer) {
      editTrainerForm.reset({
        name: selectedTrainer.name,
        email: selectedTrainer.email,
        phone: selectedTrainer.phone,
        specialization: selectedTrainer.specialization,
        rating: selectedTrainer.rating,
        status: selectedTrainer.status as "Active" | "Inactive" | "Suspended",
      });
    }
  }, [selectedTrainer, editTrainerForm]);

  const handleAddTrainer = (values: TrainerFormValues) => {
    addTrainerMutation.mutate(values);
  };

  const handleUpdateTrainer = (values: TrainerFormValues) => {
    if (selectedTrainer) {
      updateTrainerMutation.mutate({ id: selectedTrainer.id, ...values });
    }
  };

  const handleDeleteTrainer = () => {
    if (selectedTrainer) {
      deleteTrainerMutation.mutate(selectedTrainer.id);
    }
  };

  if (isLoading) return <div>Loading trainers...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trainers</h1>
            <p className="text-muted-foreground">
              Manage your gym's trainers and their profiles.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Trainer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Trainer</DialogTitle>
                <DialogDescription>
                  Create a new trainer profile.
                </DialogDescription>
              </DialogHeader>
              <Form {...addTrainerForm}>
                <form onSubmit={addTrainerForm.handleSubmit(handleAddTrainer)} className="space-y-4">
                  <FormField
                    control={addTrainerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Trainer Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addTrainerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Trainer Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addTrainerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Trainer Phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addTrainerForm.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Input placeholder="Trainer Specialization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addTrainerForm.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Trainer Rating"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addTrainerForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Add Trainer</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trainers List</CardTitle>
            <CardDescription>
              View and manage all trainers in your gym.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                      <TableCell>{trainer.name}</TableCell>
                      <TableCell>{trainer.email}</TableCell>
                      <TableCell>{trainer.phone}</TableCell>
                      <TableCell>{trainer.specialization}</TableCell>
                      <TableCell>{trainer.rating}</TableCell>
                      <TableCell>
                        <Badge variant={
                          trainer.status === "Active" ? "default" : 
                          trainer.status === "Inactive" ? "secondary" : "destructive"
                        }>
                          {trainer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              setSelectedTrainer(trainer);
                              setIsEditDialogOpen(true);
                            }}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedTrainer(trainer);
                              setIsDeleteDialogOpen(true);
                            }}>
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Trainer</DialogTitle>
              <DialogDescription>
                Update trainer profile.
              </DialogDescription>
            </DialogHeader>
            <Form {...editTrainerForm}>
              <form onSubmit={editTrainerForm.handleSubmit(handleUpdateTrainer)} className="space-y-4">
                <FormField
                  control={editTrainerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Trainer Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTrainerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Trainer Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTrainerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Trainer Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTrainerForm.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="Trainer Specialization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTrainerForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Trainer Rating"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTrainerForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Update Trainer</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Trainer</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this trainer? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteTrainer}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AnimatedLayout>
  );
};

export default Trainers;
