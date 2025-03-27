
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Edit, User, Award } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Trainer Profile</h1>
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
                  <p className="text-sm font-medium text-muted-foreground">Trainer ID</p>
                  <p className="font-medium">#{user?.id || "000"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Specialization</p>
                  <p className="font-medium">Strength & Conditioning</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                  <p className="font-medium">5 years</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="flex items-center gap-2">
              <Award size={18} className="text-primary" />
              Certifications & Qualifications
            </CardTitle>
            <CardDescription>Your professional certifications and qualifications</CardDescription>
          </CardHeader>
          <CardContent className="p-6 divide-y">
            <div className="py-4 first:pt-0 last:pb-0">
              <h3 className="font-medium">Certified Personal Trainer (CPT)</h3>
              <p className="text-sm text-muted-foreground mt-1">National Academy of Sports Medicine (NASM)</p>
              <p className="text-sm mt-1">Issued: January 2020 • Expires: January 2024</p>
            </div>
            
            <div className="py-4 first:pt-0 last:pb-0">
              <h3 className="font-medium">Corrective Exercise Specialist (CES)</h3>
              <p className="text-sm text-muted-foreground mt-1">American Council on Exercise (ACE)</p>
              <p className="text-sm mt-1">Issued: March 2021 • No Expiration</p>
            </div>
            
            <div className="py-4 first:pt-0 last:pb-0">
              <h3 className="font-medium">Strength & Conditioning Coach</h3>
              <p className="text-sm text-muted-foreground mt-1">National Strength and Conditioning Association (NSCA)</p>
              <p className="text-sm mt-1">Issued: September 2022 • Expires: September 2025</p>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit size={16} />
                <span>Update Certifications</span>
              </Button>
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
          </CardContent>
        </Card>
      </div>
    </AnimatedLayout>
  );
}
