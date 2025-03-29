
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Calendar, Clock, FileX, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import { format } from "date-fns";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define interfaces
interface ActivityType {
  id: number;
  name: string;
  trainer_id: number | null;
  location: string;
  trainer?: {
    name: string;
  };
  schedules?: {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
  }[];
}

interface Booking {
  id: number;
  activity: ActivityType;
  date: string;
  status: "upcoming" | "completed" | "canceled";
  cancellation_reason?: string;
  schedule?: {
    start_time: string;
    end_time: string;
  };
}

interface BookingFormState {
  activityId: number | null;
  date: Date | undefined;
  scheduleId: number | null;
}

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showBookDialog, setShowBookDialog] = useState<boolean>(false);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loadingActivities, setLoadingActivities] = useState<boolean>(false);
  const [bookingFormState, setBookingFormState] = useState<BookingFormState>({
    activityId: null,
    date: undefined,
    scheduleId: null,
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if we were redirected from the activities page with a pre-selected activity
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const bookActivityId = queryParams.get('book');
    
    if (bookActivityId) {
      // Pre-select the activity and open the booking dialog
      setBookingFormState(prev => ({
        ...prev,
        activityId: parseInt(bookActivityId),
      }));
      setShowBookDialog(true);
      
      // Remove the query parameter from the URL
      navigate('/member/bookings', { replace: true });
    }
  }, [location, navigate]);
  
  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.token) return;
      
      try {
        setIsLoading(true);
        const data = await api.getBookings(user.token);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);
  
  // Fetch activities (for booking form)
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.token || !showBookDialog) return;
      
      try {
        setLoadingActivities(true);
        const data = await api.getActivities(user.token);
        setActivities(data);
        
        // If an activity was pre-selected, load its details
        if (bookingFormState.activityId) {
          const selectedActivity = data.find(a => a.id === bookingFormState.activityId);
          if (selectedActivity) {
            // Pre-select the first schedule if available
            if (selectedActivity.schedules && selectedActivity.schedules.length > 0) {
              setBookingFormState(prev => ({
                ...prev,
                scheduleId: selectedActivity.schedules?.[0].id || null,
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
        toast.error("Failed to load activities");
      } finally {
        setLoadingActivities(false);
      }
    };
    
    fetchActivities();
  }, [user, showBookDialog, bookingFormState.activityId]);
  
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  const handleCancelBooking = async () => {
    if (bookingToCancel === null || !user?.token) return;
    
    try {
      await api.cancelBooking(user.token, bookingToCancel);
      
      // Update bookings list
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingToCancel 
            ? { ...booking, status: "canceled" } 
            : booking
        )
      );
      
      setOpenDialog(false);
      toast.success("Booking canceled successfully");
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const handleBookNewActivity = () => {
    setBookingFormState({
      activityId: null,
      date: undefined,
      scheduleId: null,
    });
    setShowBookDialog(true);
  };

  const handleCreateBooking = async () => {
    if (!user?.token) return;
    if (!bookingFormState.activityId || !bookingFormState.date) {
      toast.error("Please select an activity and date");
      return;
    }
    
    try {
      const bookingData = {
        activity_id: bookingFormState.activityId,
        date: format(bookingFormState.date, 'yyyy-MM-dd'),
        activity_schedule_id: bookingFormState.scheduleId,
      };
      
      const newBooking = await api.createBooking(user.token, bookingData);
      
      setBookings(prev => [...prev, newBooking]);
      setShowBookDialog(false);
      toast.success("Activity booked successfully!");
      
      // Reset form state
      setBookingFormState({
        activityId: null,
        date: undefined,
        scheduleId: null,
      });
      
      // Switch to upcoming tab to show the new booking
      setActiveTab("upcoming");
    } catch (error) {
      console.error("Error booking activity:", error);
      toast.error("Failed to book activity: " + (error as Error).message);
    }
  };

  const handleViewAllActivities = () => {
    navigate("/member/activities");
  };

  // Format time from API (HH:MM:SS) to readable format (HH:MM AM/PM)
  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    return `${h % 12 || 12}:${minutes} ${h < 12 ? 'AM' : 'PM'}`;
  };
  
  // Get time range for booking
  const getTimeRange = (booking: Booking) => {
    if (!booking.schedule) return "Flexible time";
    return `${formatTime(booking.schedule.start_time)} - ${formatTime(booking.schedule.end_time)}`;
  };

  // Get available schedules for selected activity
  const getAvailableSchedules = () => {
    if (!bookingFormState.activityId) return [];
    
    const selectedActivity = activities.find(a => a.id === bookingFormState.activityId);
    return selectedActivity?.schedules || [];
  };

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <Button onClick={handleBookNewActivity}>Book New Activity</Button>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse">Loading bookings...</div>
              </div>
            ) : filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardHeader className={`flex flex-row items-center gap-4 pb-2 ${
                      booking.status === 'canceled' ? 'bg-destructive/10' : 
                      booking.status === 'completed' ? 'bg-success/10' : 'bg-primary/5'
                    }`}>
                      <div className="flex flex-col">
                        <CardTitle className="text-lg">{booking.activity.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <User size={14} />
                          {booking.activity.trainer?.name || "Any Trainer"}
                        </CardDescription>
                      </div>
                      <div className="ml-auto">
                        {booking.status === 'upcoming' && (
                          <Dialog open={openDialog && bookingToCancel === booking.id} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                onClick={() => setBookingToCancel(booking.id)}
                              >
                                Cancel
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancel Booking</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to cancel your booking for {booking.activity.name}? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setOpenDialog(false)}>
                                  Keep Booking
                                </Button>
                                <Button variant="destructive" onClick={handleCancelBooking}>
                                  Cancel Booking
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        {booking.status === 'canceled' && (
                          <div className="px-2 py-1 bg-destructive/20 text-destructive rounded text-xs font-medium">
                            Canceled
                          </div>
                        )}
                        {booking.status === 'completed' && (
                          <div className="px-2 py-1 bg-success/20 text-success rounded text-xs font-medium">
                            Completed
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span>{getTimeRange(booking)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-muted-foreground" />
                        <span>{booking.activity.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileX className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No bookings found</h3>
                <p className="mt-2 text-muted-foreground">
                  You don't have any {activeTab} bookings.
                </p>
                <Button className="mt-4" variant="outline" onClick={handleViewAllActivities}>
                  Browse Activities
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Book New Activity Dialog */}
      <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book New Activity</DialogTitle>
            <DialogDescription>
              Select an activity, date, and time slot to book your session.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {loadingActivities ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse">Loading activities...</div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Activity</label>
                  <Select 
                    value={bookingFormState.activityId?.toString() || ""} 
                    onValueChange={(value) => setBookingFormState(prev => ({
                      ...prev,
                      activityId: parseInt(value),
                      scheduleId: null, // Reset schedule when activity changes
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an activity" />
                    </SelectTrigger>
                    <SelectContent>
                      {activities.map((activity) => (
                        <SelectItem key={activity.id} value={activity.id.toString()}>
                          {activity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <div className="flex justify-center border rounded-md p-2">
                    <CalendarPicker
                      mode="single"
                      selected={bookingFormState.date}
                      onSelect={(date) => setBookingFormState(prev => ({
                        ...prev,
                        date,
                      }))}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="rounded-md"
                    />
                  </div>
                </div>
                
                {bookingFormState.activityId && getAvailableSchedules().length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Time Slot</label>
                    <Select 
                      value={bookingFormState.scheduleId?.toString() || ""} 
                      onValueChange={(value) => setBookingFormState(prev => ({
                        ...prev,
                        scheduleId: parseInt(value),
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableSchedules().map((schedule) => (
                          <SelectItem key={schedule.id} value={schedule.id.toString()}>
                            {schedule.day_of_week}, {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex space-x-2 justify-between items-center">
            <Button variant="outline" onClick={() => setShowBookDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateBooking}
              disabled={!bookingFormState.activityId || !bookingFormState.date}
            >
              Book Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedLayout>
  );
}
