
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Clock, Users, Dumbbell, ArrowRight, BadgePlus, Calendar } from "lucide-react";

const MemberDashboard = () => {
  const { user } = useAuth();
  
  // Mock data
  const nextClass = {
    name: "HIIT Training",
    trainer: "Sarah Johnson",
    time: "Today at 6:00 PM",
    location: "Studio 3"
  };
  
  const membershipDetails = {
    plan: "Premium Fitness",
    status: "Active",
    validUntil: "October 15, 2023",
    daysLeft: 21
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your fitness journey
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats cards */}
        {[
          {
            title: "Next Class",
            value: "Today",
            description: "HIIT Training at 6:00 PM",
            icon: <CalendarCheck className="h-5 w-5 text-primary" />,
            color: "bg-primary/10",
          },
          {
            title: "Completed Workouts",
            value: "12",
            description: "This month",
            icon: <Dumbbell className="h-5 w-5 text-indigo-500" />,
            color: "bg-indigo-500/10",
          },
          {
            title: "Active Days",
            value: "8",
            description: "Last 2 weeks",
            icon: <Clock className="h-5 w-5 text-teal-500" />,
            color: "bg-teal-500/10",
          },
          {
            title: "Community",
            value: "3",
            description: "Active challenges",
            icon: <Users className="h-5 w-5 text-amber-500" />,
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Class */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="col-span-1"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Upcoming Class</span>
                <Badge variant="outline">Today</Badge>
              </CardTitle>
              <CardDescription>Your next scheduled activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{nextClass.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{nextClass.time}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  <span>Trainer: {nextClass.trainer}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Dumbbell className="mr-1 h-4 w-4" />
                  <span>{nextClass.location}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/member/bookings">
                  View All Classes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Membership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="col-span-1"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Membership</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                  {membershipDetails.status}
                </Badge>
              </CardTitle>
              <CardDescription>Your current plan details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{membershipDetails.plan}</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Valid until:</span>
                    <span>{membershipDetails.validUntil}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Days remaining:</span>
                    <span>{membershipDetails.daysLeft} days</span>
                  </div>
                </div>
                
                <div className="w-full bg-secondary rounded-full h-1.5 mt-3">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${(membershipDetails.daysLeft / 30) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <BadgePlus className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Workout Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="col-span-1"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Your activity for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="grid gap-1">
                    <span className="text-sm font-medium">Calories Burned</span>
                    <span className="text-2xl font-bold">1,248</span>
                  </div>
                  <div className="grid gap-1 text-right">
                    <span className="text-sm font-medium">Target</span>
                    <span className="text-sm text-muted-foreground">2,000</span>
                  </div>
                </div>
                
                <div className="w-full h-24 flex items-end justify-between">
                  {[40, 65, 30, 85, 50, 70, 45].map((value, i) => (
                    <div key={i} className="h-full flex flex-col justify-end items-center space-y-1 w-8">
                      <div 
                        className="w-full bg-primary/80 rounded transition-all duration-500 ease-out"
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/member/progress">
                  View Full Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MemberDashboard;
