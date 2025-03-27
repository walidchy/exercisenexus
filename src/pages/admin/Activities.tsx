
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Activity, Calendar, Clock, Download, Edit, Search, Trash, User, Users, Plus } from "lucide-react";
import { toast } from "sonner";

// Mock activities data
const activities = [
  {
    id: 1,
    name: "Yoga Class",
    description: "Relax and improve flexibility with our yoga sessions",
    trainer: "Emma Wilson",
    time: "09:00 - 10:00",
    day: "Monday",
    participants: 12,
    maxParticipants: 20,
    location: "Studio 1",
    level: "Beginner",
    category: "Wellness",
    status: "active"
  },
  {
    id: 2,
    name: "HIIT Workout",
    description: "High-intensity interval training for maximum calorie burn",
    trainer: "Mike Johnson",
    time: "18:00 - 19:00",
    day: "Tuesday",
    participants: 18,
    maxParticipants: 25,
    location: "Main Gym",
    level: "Intermediate",
    category: "Cardio",
    status: "active"
  },
  {
    id: 3,
    name: "Strength Training",
    description: "Build muscle and strength with our comprehensive program",
    trainer: "Alex Rodriguez",
    time: "17:00 - 18:30",
    day: "Wednesday",
    participants: 15,
    maxParticipants: 20,
    location: "Weight Room",
    level: "Advanced",
    category: "Strength",
    status: "active"
  },
  {
    id: 4,
    name: "Pilates",
    description: "Core strengthening and flexibility exercises",
    trainer: "Emma Wilson",
    time: "10:00 - 11:00",
    day: "Thursday",
    participants: 10,
    maxParticipants: 15,
    location: "Studio 2",
    level: "All Levels",
    category: "Wellness",
    status: "active"
  },
  {
    id: 5,
    name: "Cycling",
    description: "Indoor cycling class with high energy music",
    trainer: "John Smith",
    time: "19:00 - 20:00",
    day: "Friday",
    participants: 20,
    maxParticipants: 25,
    location: "Spin Room",
    level: "Intermediate",
    category: "Cardio",
    status: "active"
  },
  {
    id: 6,
    name: "Meditation",
    description: "Mindfulness and meditation for stress relief",
    trainer: "Sophia Lee",
    time: "08:00 - 09:00",
    day: "Saturday",
    participants: 8,
    maxParticipants: 20,
    location: "Studio 3",
    level: "All Levels",
    category: "Wellness",
    status: "inactive"
  },
  {
    id: 7,
    name: "Swimming Class",
    description: "Swimming techniques for all levels",
    trainer: "Daniel Brown",
    time: "16:00 - 17:30",
    day: "Sunday",
    participants: 10,
    maxParticipants: 15,
    location: "Pool",
    level: "All Levels",
    category: "Cardio",
    status: "upcoming"
  }
];

export default function Activities() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  
  const filteredActivities = activities.filter(activity => {
    // Filter by status
    if (filter !== "all" && activity.status !== filter) return false;
    
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        activity.name.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower) ||
        activity.trainer.toLowerCase().includes(searchLower) ||
        activity.category.toLowerCase().includes(searchLower) ||
        activity.level.toLowerCase().includes(searchLower) ||
        activity.location.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the API
    toast.success("Activity created successfully!");
    setShowAddDialog(false);
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Activities Management</h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-1">
              <Download size={16} />
              <span>Export</span>
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus size={16} />
                  <span>Add Activity</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Activity</DialogTitle>
                  <DialogDescription>
                    Add a new activity or class to the schedule.
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
                        <Label htmlFor="trainer">Trainer</Label>
                        <Input id="trainer" placeholder="Select trainer" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="e.g., Studio 1" />
                      </div>
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
                        <Label htmlFor="maxParticipants">Max Participants</Label>
                        <Input id="maxParticipants" type="number" placeholder="e.g., 20" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Input id="status" placeholder="e.g., Active" />
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
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <TabsContent value={filter} className="mt-0">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle>Activity List</CardTitle>
                <CardDescription>
                  Manage all activities from here. Currently showing {filteredActivities.length} activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground">
                        <th className="h-10 px-4 text-left font-medium">Activity</th>
                        <th className="h-10 px-4 text-left font-medium">Trainer</th>
                        <th className="h-10 px-4 text-left font-medium">Schedule</th>
                        <th className="h-10 px-4 text-left font-medium">Location</th>
                        <th className="h-10 px-4 text-left font-medium">Participants</th>
                        <th className="h-10 px-4 text-left font-medium">Status</th>
                        <th className="h-10 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredActivities.map((activity) => (
                        <tr key={activity.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Activity size={18} className="text-primary" />
                              <div>
                                <p className="font-medium">{activity.name}</p>
                                <p className="text-xs text-muted-foreground">{activity.category} • {activity.level}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-1">
                              <User size={14} className="text-muted-foreground" />
                              <span>{activity.trainer}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} className="text-muted-foreground" />
                                <span>{activity.day}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock size={14} className="text-muted-foreground" />
                                <span>{activity.time}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {activity.location}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-1">
                              <Users size={14} className="text-muted-foreground" />
                              <span>{activity.participants}/{activity.maxParticipants}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="outline">
                                <Edit size={16} />
                              </Button>
                              <Button size="icon" variant="outline" className="text-destructive">
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
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedLayout>
  );
}
