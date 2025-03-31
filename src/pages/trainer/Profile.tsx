
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Edit, User, Award } from "lucide-react";
import mockApi from "@/services/mockApi";
import { toast } from "sonner";

interface Certification {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
}

interface TrainerProfile {
  name: string;
  email: string;
  id: string;
  specialization: string;
  experience: string;
  contact: string;
  certifications: Certification[];
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await mockApi.get('/trainer/profile');
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching trainer profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <AnimatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading profile data...</p>
        </div>
      </AnimatedLayout>
    );
  }

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
                  {profile?.name.charAt(0) || user?.name.charAt(0) || <User className="h-10 w-10" />}
                </div>
                <Button variant="outline" size="sm">Change Photo</Button>
              </div>
              
              <div className="flex-1 grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="font-medium">{profile?.name || user?.name || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email || user?.email || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Trainer ID</p>
                  <p className="font-medium">#{profile?.id || user?.id || "000"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Specialization</p>
                  <p className="font-medium">{profile?.specialization || "Strength & Conditioning"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                  <p className="font-medium">{profile?.experience || "5 years"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
                  <p className="font-medium">{profile?.contact || "+1 (555) 123-4567"}</p>
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
            {profile?.certifications.map((cert) => (
              <div key={cert.id} className="py-4 first:pt-0 last:pb-0">
                <h3 className="font-medium">{cert.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{cert.issuer}</p>
                <p className="text-sm mt-1">
                  Issued: {cert.issueDate} • {cert.expiryDate ? `Expires: ${cert.expiryDate}` : 'No Expiration'}
                </p>
              </div>
            ))}
            
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
