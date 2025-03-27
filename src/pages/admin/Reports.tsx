
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Download, Calendar, BarChart, ArrowUpDown, Users, Activity as ActivityIcon, DollarSign } from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data for the charts
const membershipData = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 59 },
  { name: "Mar", value: 80 },
  { name: "Apr", value: 81 },
  { name: "May", value: 56 },
  { name: "Jun", value: 55 },
  { name: "Jul", value: 40 },
  { name: "Aug", value: 50 },
  { name: "Sep", value: 70 },
  { name: "Oct", value: 90 },
  { name: "Nov", value: 95 },
  { name: "Dec", value: 100 }
];

const revenueData = [
  { name: "Jan", value: 12000 },
  { name: "Feb", value: 19000 },
  { name: "Mar", value: 15000 },
  { name: "Apr", value: 23000 },
  { name: "May", value: 26000 },
  { name: "Jun", value: 24000 },
  { name: "Jul", value: 20000 },
  { name: "Aug", value: 25000 },
  { name: "Sep", value: 27000 },
  { name: "Oct", value: 30000 },
  { name: "Nov", value: 32000 },
  { name: "Dec", value: 35000 }
];

const activityAttendanceData = [
  { name: "Yoga", attendees: 120 },
  { name: "HIIT", attendees: 150 },
  { name: "Pilates", attendees: 90 },
  { name: "Cycling", attendees: 135 },
  { name: "Strength", attendees: 165 },
  { name: "Swimming", attendees: 80 }
];

const membershipTypeData = [
  { name: "Basic", value: 340 },
  { name: "Standard", value: 520 },
  { name: "Premium", value: 280 },
  { name: "Family", value: 160 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Reports() {
  const [timeFrame, setTimeFrame] = useState<string>("year");
  
  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <div className="flex items-center gap-2">
            <Select defaultValue="year" onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-1">
              <Download size={16} />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Members</CardDescription>
              <CardTitle className="text-3xl">1,324</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">↑ 12.5%</span> from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>New Sign-ups</CardDescription>
              <CardTitle className="text-3xl">87</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">↑ 5.3%</span> from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Trainers</CardDescription>
              <CardTitle className="text-3xl">24</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="text-muted-foreground font-medium">→ 0%</span> from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Monthly Revenue</CardDescription>
              <CardTitle className="text-3xl">$35,420</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">↑ 8.2%</span> from last month
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={18} className="text-primary" />
                Membership Growth
              </CardTitle>
              <CardDescription>
                New member registrations over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={membershipData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="New Members" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign size={18} className="text-primary" />
                Revenue
              </CardTitle>
              <CardDescription>
                Monthly revenue over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={{ r: 8 }} name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ActivityIcon size={18} className="text-primary" />
                Activity Attendance
              </CardTitle>
              <CardDescription>
                Popular activities by attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={activityAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendees" fill="#8884d8" name="Attendees" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart size={18} className="text-primary" />
                Membership Distribution
              </CardTitle>
              <CardDescription>
                Members by membership type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={membershipTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {membershipTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} members`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analytics</CardTitle>
            <CardDescription>
              Comprehensive data about gym performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-muted-foreground">
                    <th className="h-10 px-4 text-left font-medium">
                      <div className="flex items-center gap-1">
                        Metric
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th className="h-10 px-4 text-left font-medium">Current</th>
                    <th className="h-10 px-4 text-left font-medium">Previous</th>
                    <th className="h-10 px-4 text-left font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">Total Members</td>
                    <td className="p-4 align-middle">1,324</td>
                    <td className="p-4 align-middle">1,254</td>
                    <td className="p-4 align-middle text-green-500">+5.6%</td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">Active Members</td>
                    <td className="p-4 align-middle">1,102</td>
                    <td className="p-4 align-middle">1,030</td>
                    <td className="p-4 align-middle text-green-500">+7.0%</td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">Monthly Revenue</td>
                    <td className="p-4 align-middle">$35,420</td>
                    <td className="p-4 align-middle">$32,850</td>
                    <td className="p-4 align-middle text-green-500">+7.8%</td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">Average Daily Visits</td>
                    <td className="p-4 align-middle">287</td>
                    <td className="p-4 align-middle">265</td>
                    <td className="p-4 align-middle text-green-500">+8.3%</td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">Class Attendance Rate</td>
                    <td className="p-4 align-middle">78%</td>
                    <td className="p-4 align-middle">75%</td>
                    <td className="p-4 align-middle text-green-500">+4.0%</td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">Member Retention Rate</td>
                    <td className="p-4 align-middle">92%</td>
                    <td className="p-4 align-middle">89%</td>
                    <td className="p-4 align-middle text-green-500">+3.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedLayout>
  );
}
