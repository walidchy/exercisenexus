
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Activity, Calendar, Clock, Users, MapPin, Dumbbell, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import mockApi from "@/services/mockApi";

// Define activity interface
interface ActivityType {
  id: number;
  name: string;
  description: string;
  trainer_id: number | null;
  category: string;
  difficulty_level: string;
  duration_minutes: number;
  max_participants: number;
  location: string;
  equipment_needed?: string[];
  trainer?: {
    name: string;
  };
  schedules?: {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    is_recurring: boolean;
    specific_date?: string;
  }[];
}

export default function Activities() {
  const [filter, setFilter] = useState<string>("all");
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch activities from mockApi
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        
        const response = await mockApi.get('/activities');
        
        // Filter by category if needed
        let filteredActivities = response.data;
        if (filter !== "all") {
          filteredActivities = response.data.filter(
            (activity: ActivityType) => activity.category === filter
          );
        }
        
        setActivities(filteredActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
        toast.error("Failed to load activities");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [filter]);

  // Format time from API (HH:MM:SS) to readable format (HH:MM AM/PM)
  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    return `${h % 12 || 12}:${minutes} ${h < 12 ? 'AM' : 'PM'}`;
  };

  // Get schedule display for an activity
  const getScheduleDisplay = (activity: ActivityType) => {
    if (!activity.schedules || activity.schedules.length === 0) {
      return "Flexible schedule";
    }
    
    // Just display the first schedule for simplicity
    const schedule = activity.schedules[0];
    return `${schedule.day_of_week}, ${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`;
  };

  const handleBookActivity = async (activityId: number) => {
    if (!user?.token) {
      toast.error("You must be logged in to book an activity");
      return;
    }
    
    try {
      // Navigate to bookings page with pre-selected activity
      navigate(`/member/bookings?book=${activityId}`);
    } catch (error) {
      console.error("Error navigating to booking:", error);
      toast.error("Failed to process booking");
    }
  };

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
          <Button onClick={() => navigate("/member/bookings")}>View My Bookings</Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="Cardio">Cardio</TabsTrigger>
            <TabsTrigger value="Strength">Strength</TabsTrigger>
            <TabsTrigger value="Wellness">Wellness</TabsTrigger>
          </TabsList>
          
          <TabsContent value={filter} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse">Loading activities...</div>
              </div>
            ) : activities.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {activities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
                    <CardHeader className="bg-primary/5 pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <Activity size={18} className="text-primary" />
                        {activity.name}
                      </CardTitle>
                      <CardDescription>{activity.difficulty_level} • {activity.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 flex-1">
                      <p className="text-sm text-muted-foreground mb-4">
                        {activity.description}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User size={16} className="text-muted-foreground" />
                          <span>Trainer: {activity.trainer?.name || "Any Trainer"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className="text-muted-foreground" />
                          <span>{getScheduleDisplay(activity)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={16} className="text-muted-foreground" />
                          <span>{activity.duration_minutes} minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={16} className="text-muted-foreground" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users size={16} className="text-muted-foreground" />
                          <span>Max participants: {activity.max_participants}</span>
                        </div>
                        {activity.equipment_needed && activity.equipment_needed.length > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <Dumbbell size={16} className="text-muted-foreground" />
                            <span>Equipment: {activity.equipment_needed.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 border-t mt-auto">
                      <Button className="w-full" onClick={() => handleBookActivity(activity.id)}>Book Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No activities found</h3>
                <p className="mt-2 text-muted-foreground">
                  There are no {filter !== "all" ? filter.toLowerCase() : ""} activities available at the moment.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedLayout>
  );
}
