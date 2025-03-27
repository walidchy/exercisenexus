
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Activity, Calendar, Clock, Edit, Trash, Users, Plus } from "lucide-react";
import { toast } from "sonner";

// Mock activities data
const activities = [
  {
    id: 1,
    name: "Yoga Class",
    description: "Relax and improve flexibility with our yoga sessions",
    time: "09:00 - 10:00",
    day: "Monday",
    participants: 12,
    maxParticipants: 20,
    location: "Studio 1",
    level: "Beginner",
    category: "Wellness"
  },
  {
    id: 2,
    name: "HIIT Workout",
    description: "High-intensity interval training for maximum calorie burn",
    time: "18:00 - 19:00",
    day: "Tuesday",
    participants: 18,
    maxParticipants: 25,
    location: "Main Gym",
    level: "Intermediate",
    category: "Cardio"
  },
  {
    id: 3,
    name: "Strength Training",
    description: "Build muscle and strength with our comprehensive program",
    time: "17:00 - 18:30",
    day: "Wednesday",
    participants: 15,
    maxParticipants: 20,
    location: "Weight Room",
    level: "Advanced",
    category: "Strength"
  },
  {
    id: 4,
    name: "Pilates",
    description: "Core strengthening and flexibility exercises",
    time: "10:00 - 11:00",
    day: "Thursday",
    participants: 10,
    maxParticipants: 15,
    location: "Studio 2",
    level: "All Levels",
    category: "Wellness"
  },
  {
    id: 5,
    name: "Cycling",
    description: "Indoor cycling class with high energy music",
    time: "19:00 - 20:00",
    day: "Friday",
    participants: 20,
    maxParticipants: 25,
    location: "Spin Room",
    level: "Intermediate",
    category: "Cardio"
  }
];

export default function Activities() {
  const [filter, setFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [localActivities, setLocalActivities] = useState(activities);
  
  const filteredActivities = localActivities.filter(activity => {
    if (filter === "all") return true;
    return activity.category.toLowerCase() === filter.toLowerCase();
  });

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the API
    toast.success("Activity created successfully!");
    setShowAddDialog(false);
  };

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Activities Management</h1>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Create Activity</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Activity</DialogTitle>
                <DialogDescription>
                  Add a new activity or class to your schedule.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddActivity}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Activity Name</Label>
                    <Input id="name" placeholder="e.g., Yoga Class" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Brief description of the activity" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" placeholder="e.g., Wellness" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="level">Level</Label>
                      <Input id="level" placeholder="e.g., Beginner" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="day">Day</Label>
                      <Input id="day" placeholder="e.g., Monday" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input id="time" placeholder="e.g., 09:00 - 10:00" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="e.g., Studio 1" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxParticipants">Max Participants</Label>
                      <Input id="maxParticipants" type="number" placeholder="e.g., 20" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Activity</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="cardio">Cardio</TabsTrigger>
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
          </TabsList>
          
          <TabsContent value={filter} className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredActivities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden h-full flex flex-col">
                  <CardHeader className="bg-primary/5 pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Activity size={18} className="text-primary" />
                      {activity.name}
                    </CardTitle>
                    <CardDescription>{activity.level} • {activity.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1">
                    <p className="text-sm text-muted-foreground mb-4">
                      {activity.description}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span>{activity.day}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-muted-foreground" />
                        <span>{activity.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users size={16} className="text-muted-foreground" />
                        <span>{activity.participants}/{activity.maxParticipants} participants</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t flex gap-2">
                    <Button variant="outline" className="flex-1 flex items-center gap-2">
                      <Edit size={16} />
                      <span>Edit</span>
                    </Button>
                    <Button variant="destructive" size="icon">
                      <Trash size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedLayout>
  );
}
