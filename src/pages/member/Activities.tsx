
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Activity, Calendar, Clock, Users } from "lucide-react";

// Mock activity data
const activities = [
  {
    id: 1,
    name: "Yoga Class",
    description: "Relax and improve flexibility with our yoga sessions",
    trainer: "Sarah Trainer",
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
    trainer: "Mike Johnson",
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
    trainer: "Alex Rodriguez",
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
    trainer: "Emma Wilson",
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
    trainer: "John Smith",
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
  
  const filteredActivities = activities.filter(activity => {
    if (filter === "all") return true;
    return activity.category.toLowerCase() === filter.toLowerCase();
  });

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
          <Button>Book New Activity</Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="cardio">Cardio</TabsTrigger>
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
          </TabsList>
          
          <TabsContent value={filter} className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {filteredActivities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
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
                        <Users size={16} className="text-muted-foreground" />
                        <span>Trainer: {activity.trainer}</span>
                      </div>
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
                  <CardFooter className="pt-0 border-t mt-auto">
                    <Button className="w-full">Book Now</Button>
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
