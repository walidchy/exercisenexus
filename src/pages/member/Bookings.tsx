
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Calendar, Clock, FileX, Info, MapPin, User } from "lucide-react";
import { toast } from "sonner";

// Mock booking data
const bookings = [
  {
    id: 1,
    activity: "Yoga Class",
    trainer: "Sarah Trainer",
    date: "2023-11-15",
    time: "09:00 - 10:00",
    location: "Studio 1",
    status: "upcoming"
  },
  {
    id: 2,
    activity: "HIIT Workout",
    trainer: "Mike Johnson",
    date: "2023-11-18",
    time: "18:00 - 19:00",
    location: "Main Gym",
    status: "upcoming"
  },
  {
    id: 3,
    activity: "Strength Training",
    trainer: "Alex Rodriguez",
    date: "2023-11-02",
    time: "17:00 - 18:30",
    location: "Weight Room",
    status: "completed"
  },
  {
    id: 4,
    activity: "Pilates",
    trainer: "Emma Wilson",
    date: "2023-10-28",
    time: "10:00 - 11:00",
    location: "Studio 2",
    status: "completed"
  },
  {
    id: 5,
    activity: "Cycling",
    trainer: "John Smith",
    date: "2023-10-12",
    time: "19:00 - 20:00",
    location: "Spin Room",
    status: "canceled"
  }
];

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [localBookings, setLocalBookings] = useState(bookings);
  
  const filteredBookings = localBookings.filter(booking => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  const handleCancelBooking = () => {
    if (bookingToCancel === null) return;
    
    setLocalBookings(prev => 
      prev.map(booking => 
        booking.id === bookingToCancel 
          ? { ...booking, status: "canceled" } 
          : booking
      )
    );
    
    setOpenDialog(false);
    toast.success("Booking canceled successfully");
  };

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <Button>Book New Activity</Button>
        </div>
        
        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardHeader className={`flex flex-row items-center gap-4 pb-2 ${
                      booking.status === 'canceled' ? 'bg-destructive/10' : 
                      booking.status === 'completed' ? 'bg-success/10' : 'bg-primary/5'
                    }`}>
                      <div className="flex flex-col">
                        <CardTitle className="text-lg">{booking.activity}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <User size={14} />
                          {booking.trainer}
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
                                  Are you sure you want to cancel your booking for {booking.activity}? This action cannot be undone.
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
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-muted-foreground" />
                        <span>{booking.location}</span>
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
                <Button className="mt-4" variant="outline">
                  Book an Activity
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedLayout>
  );
}
