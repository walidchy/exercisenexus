
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Edit, User } from "lucide-react";

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
