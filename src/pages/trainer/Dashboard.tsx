
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Users, Clock, Dumbbell, ArrowRight, Calendar } from "lucide-react";

const TrainerDashboard = () => {
  const { user } = useAuth();
  
  // Mock data for today's classes
  const todayClasses = [
    {
      id: 1,
      name: "Morning HIIT",
      time: "07:00 - 08:00",
      participants: 12,
      maxParticipants: 15,
      location: "Studio 2"
    },
    {
      id: 2,
      name: "Strength Training",
      time: "10:30 - 11:30",
      participants: 8,
      maxParticipants: 10,
      location: "Weights Area"
    },
    {
      id: 3,
      name: "Yoga Basics",
      time: "17:00 - 18:00",
      participants: 15,
      maxParticipants: 20,
      location: "Studio 1"
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">
          Manage your classes and clients
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats cards */}
        {[
          {
            title: "Today's Classes",
            value: "3",
            description: "Next: HIIT at 7:00 AM",
            icon: <CalendarCheck className="h-5 w-5 text-primary" />,
            color: "bg-primary/10",
          },
          {
            title: "Active Clients",
            value: "28",
            description: "2 new this week",
            icon: <Users className="h-5 w-5 text-indigo-500" />,
            color: "bg-indigo-500/10",
          },
          {
            title: "Class Hours",
            value: "12",
            description: "This week",
            icon: <Clock className="h-5 w-5 text-teal-500" />,
            color: "bg-teal-500/10",
          },
          {
            title: "Workout Plans",
            value: "8",
            description: "Active plans",
            icon: <Dumbbell className="h-5 w-5 text-amber-500" />,
            color: "bg-amber-500/10",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </CardContent>
              <CardFooter className="pt-1">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Today's Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your classes for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link to="/trainer/schedule">
                  <Calendar className="mr-2 h-4 w-4" />
                  Full Schedule
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((cls, index) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{cls.name}</h3>
                      <div className="flex space-x-4">
                        <span className="text-sm text-muted-foreground">{cls.time}</span>
                        <span className="text-sm text-muted-foreground">{cls.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{cls.participants}/{cls.maxParticipants}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          cls.participants === cls.maxParticipants
                            ? "bg-orange-50 text-orange-700 hover:bg-orange-50"
                            : "bg-green-50 text-green-700 hover:bg-green-50"
                        }
                      >
                        {cls.participants === cls.maxParticipants ? "Full" : "Available"}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Client Requests</CardTitle>
              <CardDescription>Recent messages and inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Emily Johnson",
                    message: "I'd like to reschedule my personal training session from Thursday to Friday.",
                    time: "2 hours ago"
                  },
                  {
                    name: "Michael Thompson",
                    message: "Need advice on my nutrition plan for muscle building.",
                    time: "Yesterday"
                  },
                  {
                    name: "Jessica Williams",
                    message: "Could you recommend some stretching exercises for my lower back?",
                    time: "2 days ago"
                  }
                ].map((request, index) => (
                  <div key={index} className="p-4 rounded-lg border space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{request.name}</span>
                      <span className="text-xs text-muted-foreground">{request.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/trainer/messages">
                  View All Messages
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Your stats for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Client Attendance Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Client Attendance</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "87%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    5% higher than last month
                  </p>
                </div>
                
                {/* Client Satisfaction */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Client Satisfaction</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: "92%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on feedback from 18 clients
                  </p>
                </div>
                
                {/* Class Booking Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Class Booking Rate</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: "78%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average fill rate across all classes
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Detailed Analytics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TrainerDashboard;
