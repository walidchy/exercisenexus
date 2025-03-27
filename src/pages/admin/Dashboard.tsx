
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, DollarSign, Users, Activity, ArrowRight, ArrowUp, ArrowDown, CheckCircle, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Mock data
  const membershipStats = {
    active: 248,
    newThisMonth: 32,
    expiringSoon: 15,
    revenueThisMonth: 12680
  };
  
  const equipmentStats = {
    total: 76,
    needsMaintenance: 5,
    scheduledMaintenance: 3
  };
  
  // Revenue chart data
  const revenueData = [
    { month: "Jan", amount: 9500 },
    { month: "Feb", amount: 10200 },
    { month: "Mar", amount: 9800 },
    { month: "Apr", amount: 11000 },
    { month: "May", amount: 10500 },
    { month: "Jun", amount: 11800 }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Complete overview of your facility's performance
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats cards */}
        {[
          {
            title: "Total Members",
            value: membershipStats.active,
            change: "+12%",
            isPositive: true,
            icon: <Users className="h-5 w-5 text-primary" />,
            color: "bg-primary/10",
          },
          {
            title: "Monthly Revenue",
            value: `$${membershipStats.revenueThisMonth}`,
            change: "+8%",
            isPositive: true,
            icon: <DollarSign className="h-5 w-5 text-green-500" />,
            color: "bg-green-500/10",
          },
          {
            title: "Active Trainers",
            value: "14",
            change: "+2",
            isPositive: true,
            icon: <Activity className="h-5 w-5 text-amber-500" />,
            color: "bg-amber-500/10",
          },
          {
            title: "Class Attendance",
            value: "82%",
            change: "-3%",
            isPositive: false,
            icon: <BarChart3 className="h-5 w-5 text-indigo-500" />,
            color: "bg-indigo-500/10",
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
                <div className="flex items-center text-xs">
                  <span className="text-muted-foreground">{stat.title}</span>
                  <span className={`ml-2 flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <div className="h-full flex items-end space-x-2">
                  {revenueData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div 
                        className="w-full rounded-t bg-primary/80 transition-all duration-500 ease-out relative group"
                        style={{ height: `${(data.amount / 12000) * 100}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs rounded px-2 py-1 pointer-events-none transition-opacity">
                          ${data.amount}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">{data.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/reports">
                  View Detailed Reports
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Equipment Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Equipment Status</CardTitle>
              <CardDescription>Maintenance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Equipment</span>
                  <span className="text-sm font-bold">{equipmentStats.total}</span>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900/30 flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800 dark:text-amber-300">{equipmentStats.needsMaintenance} Items Need Attention</h3>
                      <p className="text-sm text-amber-700 dark:text-amber-400">Requires maintenance or repair</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900/30 flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-300">{equipmentStats.scheduledMaintenance} Scheduled Maintenance</h3>
                      <p className="text-sm text-green-700 dark:text-green-400">Maintenance scheduled in the next 7 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/admin/equipment">
                  Equipment Management
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      {/* Membership Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Membership Insights</CardTitle>
            <CardDescription>Key metrics for member management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "New Members",
                  value: membershipStats.newThisMonth,
                  description: "Joined this month",
                  change: "+8%",
                  isPositive: true,
                  color: "text-primary"
                },
                {
                  title: "Expiring Soon",
                  value: membershipStats.expiringSoon,
                  description: "Next 30 days",
                  change: "-2",
                  isPositive: true,
                  color: "text-amber-500"
                },
                {
                  title: "Retention Rate",
                  value: "94%",
                  description: "Last 3 months",
                  change: "+2%",
                  isPositive: true,
                  color: "text-green-500"
                }
              ].map((stat, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">{stat.title}</span>
                    <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                    <span className="text-xs text-muted-foreground mt-1">{stat.description}</span>
                    <div className="flex items-center mt-2 text-xs">
                      <span className={`flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground ml-2">vs. previous period</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/members">
                View All Members
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
