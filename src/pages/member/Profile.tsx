
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Edit, User, Heart, Activity, CreditCard, FileText, Check } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Profile() {
  const { user } = useAuth();

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Edit size={16} />
            <span>Edit Profile</span>
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your personal information and account details</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0 flex flex-col items-center space-y-3">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-semibold">
                  {user?.name.charAt(0) || <User className="h-10 w-10" />}
                </div>
                <Button variant="outline" size="sm">Change Photo</Button>
              </div>
              
              <div className="flex-1 grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user?.name || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Member ID</p>
                  <p className="font-medium">#{user?.id || "000"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                  <p className="font-medium capitalize">{user?.role || "Member"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <p className="font-medium">Not provided</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">Not provided</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Metrics Card */}
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Health Metrics</CardTitle>
                <CardDescription>Your latest health and fitness measurements</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Height</p>
                <p className="text-2xl font-semibold">5'11"</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Weight</p>
                <p className="text-2xl font-semibold">180 lbs</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Body Fat</p>
                <p className="text-2xl font-semibold">18%</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">BMI</p>
                <p className="text-2xl font-semibold">24.8</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Blood Pressure</p>
                <p className="text-2xl font-semibold">120/80</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Resting Heart Rate</p>
                <p className="text-2xl font-semibold">68 bpm</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button className="flex items-center gap-2">
                <Activity size={16} />
                <span>Update Health Information</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Card */}
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment options</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white p-1 rounded">
                    <span className="font-bold text-xs">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Default</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>Add Payment Method</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>Your recent payment history</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Premium Membership</TableCell>
                  <TableCell>Oct 1, 2023</TableCell>
                  <TableCell>$99.00</TableCell>
                  <TableCell>
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">Paid</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Premium Membership</TableCell>
                  <TableCell>Sep 1, 2023</TableCell>
                  <TableCell>$99.00</TableCell>
                  <TableCell>
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">Paid</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Premium Membership</TableCell>
                  <TableCell>Aug 1, 2023</TableCell>
                  <TableCell>$99.00</TableCell>
                  <TableCell>
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">Paid</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">View All Payments</Button>
            </div>
          </CardContent>
        </Card>

        {/* Membership Card */}
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle>Membership</CardTitle>
            <CardDescription>Your current membership plan and benefits</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
                  <p className="text-xl font-semibold text-primary">Premium</p>
                  <span className="inline-block mt-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Expires</p>
                  <p className="font-medium">December 31, 2023</p>
                </div>
                
                <Button className="w-full sm:w-auto">Manage Membership</Button>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Membership Perks</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span>Unlimited Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span>Free Towel Service</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span>1 Free Personal Training/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <span>Guest Passes (2/month)</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">Change your account password</p>
              </div>
              <Button variant="outline">Change Password</Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">Manage how we contact you</p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedLayout>
  );
}
