
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Clock, Users } from "lucide-react";
import mockApi from "@/services/mockApi";
import { toast } from "sonner";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = [
  "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", 
  "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00",
  "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", 
  "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00"
];

interface ScheduleItem {
  id: number;
  day: string;
  time: string;
  activity: string;
  participants: number;
  location: string;
}

interface ScheduleData {
  currentWeek: string;
  previousWeek: string;
  nextWeek: string;
  nextTwoWeeks: string;
  scheduleData: ScheduleItem[];
}

export default function Schedule() {
  const [selectedWeek, setSelectedWeek] = useState<string>("current");
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const response = await mockApi.get('/trainer/schedule');
        setScheduleData(response.data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        toast.error("Failed to load schedule data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchedule();
  }, []);
  
  const getScheduleForDay = (day: string) => {
    if (!scheduleData) return [];
    return scheduleData.scheduleData.filter(item => item.day === day);
  };

  const renderTimeSlot = (day: string, time: string) => {
    if (!scheduleData) return null;
    
    const schedule = scheduleData.scheduleData.find(item => item.day === day && item.time === time);
    
    if (!schedule) {
      return (
        <div className="h-full border border-dashed border-border rounded-md flex items-center justify-center p-2">
          <Button variant="ghost" className="h-full w-full text-muted-foreground text-xs">+</Button>
        </div>
      );
    }
    
    return (
      <div className="h-full bg-primary/5 border border-primary/10 rounded-md p-2 flex flex-col">
        <h4 className="font-medium text-sm">{schedule.activity}</h4>
        <p className="text-xs text-muted-foreground">{schedule.location}</p>
        <div className="flex items-center gap-1 mt-1">
          <Users size={12} className="text-muted-foreground" />
          <span className="text-xs">{schedule.participants}</span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <AnimatedLayout>
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Loading schedule data...</p>
        </div>
      </AnimatedLayout>
    );
  }

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <div className="flex items-center gap-2">
            <Select defaultValue="current" onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous">Previous Week</SelectItem>
                <SelectItem value="current">Current Week</SelectItem>
                <SelectItem value="next">Next Week</SelectItem>
                <SelectItem value="next2">Two Weeks Ahead</SelectItem>
              </SelectContent>
            </Select>
            <Button>Add Session</Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>
              Your training sessions for the week of{" "}
              {selectedWeek === "previous" ? scheduleData?.previousWeek : 
               selectedWeek === "current" ? scheduleData?.currentWeek : 
               selectedWeek === "next" ? scheduleData?.nextWeek : scheduleData?.nextTwoWeeks}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-2 overflow-x-auto min-w-[800px]">
              {/* Header row */}
              <div className="flex items-center justify-center p-2 font-medium text-muted-foreground">
                <Clock size={14} className="mr-1" />
                Time
              </div>
              {weekDays.map((day) => (
                <div key={day} className="text-center font-medium p-2">
                  {day}
                </div>
              ))}
              
              {/* Time slots */}
              {timeSlots.map((time) => (
                <React.Fragment key={time}>
                  <div className="p-2 text-xs text-muted-foreground">
                    {time}
                  </div>
                  {weekDays.map((day) => (
                    <div key={`${day}-${time}`} className="h-16">
                      {renderTimeSlot(day, time)}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Sessions</CardTitle>
              <CardDescription>
                Your scheduled sessions for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getScheduleForDay("Monday").length > 0 ? (
                <div className="space-y-4">
                  {getScheduleForDay("Monday").map((session) => (
                    <div key={session.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <h4 className="font-medium">{session.activity}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{session.participants} participants</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Details</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No sessions scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>
                Your scheduled sessions for the next days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduleData?.scheduleData.filter(session => session.day !== "Monday").slice(0, 3).map((session) => (
                  <div key={session.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <h4 className="font-medium">{session.activity}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="font-medium text-primary">{session.day}</span>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{session.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Details</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedLayout>
  );
}
