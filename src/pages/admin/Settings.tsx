
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Settings as SettingsIcon, Bell, Mail, Lock, Building, Clock, Globe, Users, Shield } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

// Define interfaces for our settings data
interface GymInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

interface BusinessHour {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appNotifications: boolean;
  notifyEvents: {
    newMember: boolean;
    booking: boolean;
    cancelation: boolean;
    payment: boolean;
    feedback: boolean;
    subscription: boolean;
  };
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
}

interface SecuritySettings {
  enforceStrongPasswords: boolean;
  sessionTimeout: number;
  loginAttempts: number;
}

interface SystemSettings {
  gymCapacity: number;
  bookingWindow: number;
  cancellationPeriod: number;
  maintenanceMode: boolean;
}

interface LocalizationSettings {
  language: string;
  timeZone: string;
  dateFormat: string;
  currency: string;
}

interface SettingsData {
  gymInfo: GymInfo;
  businessHours: BusinessHour[];
  notifications: NotificationSettings;
  emailTemplates: EmailTemplate[];
  security: SecuritySettings;
  system: SystemSettings;
  localization: LocalizationSettings;
}

// Default settings data to use as fallback
const defaultSettings: SettingsData = {
  gymInfo: {
    name: "GymPro Fitness Center",
    email: "contact@gympro.com",
    phone: "+1 (555) 123-4567",
    website: "https://gympro.com",
    address: "123 Fitness Street, Gym City, GC 12345"
  },
  businessHours: [
    { day: "Monday", openTime: "06:00", closeTime: "22:00", isOpen: true },
    { day: "Tuesday", openTime: "06:00", closeTime: "22:00", isOpen: true },
    { day: "Wednesday", openTime: "06:00", closeTime: "22:00", isOpen: true },
    { day: "Thursday", openTime: "06:00", closeTime: "22:00", isOpen: true },
    { day: "Friday", openTime: "06:00", closeTime: "22:00", isOpen: true },
    { day: "Saturday", openTime: "08:00", closeTime: "20:00", isOpen: true },
    { day: "Sunday", openTime: "10:00", closeTime: "16:00", isOpen: false }
  ],
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    appNotifications: true,
    notifyEvents: {
      newMember: true,
      booking: true,
      cancelation: true,
      payment: true,
      feedback: false,
      subscription: true
    }
  },
  emailTemplates: [
    { id: "welcome", name: "Welcome Email", subject: "Welcome to GymPro!" },
    { id: "booking-confirm", name: "Booking Confirmation", subject: "Your booking has been confirmed!" },
    { id: "payment-receipt", name: "Payment Receipt", subject: "Thank you for your payment!" }
  ],
  security: {
    enforceStrongPasswords: true,
    sessionTimeout: 30,
    loginAttempts: 5
  },
  system: {
    gymCapacity: 150,
    bookingWindow: 14,
    cancellationPeriod: 12,
    maintenanceMode: false
  },
  localization: {
    language: "en-US",
    timeZone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD"
  }
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);

  // Derived states from settings with safe defaults
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false);
  const [appNotifications, setAppNotifications] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, we would use the API service with the user's token
        // For now, we'll use a direct axios call to our mock API
        try {
          const response = await axios.get('/api/admin/settings');
          setSettings(response.data);
          
          // Update the derived states
          if (response.data.notifications) {
            setEmailNotifications(response.data.notifications.emailNotifications);
            setSmsNotifications(response.data.notifications.smsNotifications);
            setAppNotifications(response.data.notifications.appNotifications);
          }
        } catch (err) {
          console.error('Error fetching settings:', err);
          setError('Failed to load settings. Please try again later.');
          
          // For demo purposes, set mock data when real fetch fails
          setSettings(defaultSettings);
          setEmailNotifications(defaultSettings.notifications.emailNotifications);
          setSmsNotifications(defaultSettings.notifications.smsNotifications);
          setAppNotifications(defaultSettings.notifications.appNotifications);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, we would call api.updateSettings(...)
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      toast.success("General settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
      console.error("Save error:", error);
    }
  };
  
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare the data to send
      const updatedNotifications = {
        ...settings?.notifications,
        emailNotifications,
        smsNotifications,
        appNotifications
      };
      
      // In a real app, we would call api.updateNotificationSettings(...)
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      // Update local state
      if (settings) {
        setSettings({
          ...settings,
          notifications: updatedNotifications as NotificationSettings
        });
      }
      
      toast.success("Notification settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save notification settings. Please try again.");
      console.error("Save error:", error);
    }
  };
  
  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, we would call api.updateSecuritySettings(...)
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      toast.success("Security settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save security settings. Please try again.");
      console.error("Save error:", error);
    }
  };

  if (loading) {
    return (
      <AnimatedLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </AnimatedLayout>
    );
  }

  if (error) {
    return (
      <AnimatedLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </AnimatedLayout>
    );
  }

  // Use default settings if settings is null
  const currentSettings = settings || defaultSettings;
  // Get safe user information with fallbacks to prevent "undefined" errors
  const userInitial = user?.name ? user.name.charAt(0) : "U";
  const userName = user?.name || "Guest User";

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-0 space-y-6">
            <Card>
              <form onSubmit={handleSaveGeneral}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building size={18} className="text-primary" />
                    Gym Information
                  </CardTitle>
                  <CardDescription>
                    Update your gym's basic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="gymName">Gym Name</Label>
                      <Input 
                        id="gymName" 
                        defaultValue={currentSettings.gymInfo.name} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Contact Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue={currentSettings.gymInfo.email} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input 
                        id="phone" 
                        defaultValue={currentSettings.gymInfo.phone} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website" 
                        defaultValue={currentSettings.gymInfo.website} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address" 
                      defaultValue={currentSettings.gymInfo.address} 
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  Business Hours
                </CardTitle>
                <CardDescription>
                  Set your gym's operating hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentSettings.businessHours.map((hour) => (
                    <div key={hour.day} className="flex items-center justify-between">
                      <span className="font-medium w-28">{hour.day}</span>
                      <div className="flex items-center gap-2">
                        <Input 
                          className="w-24" 
                          defaultValue={hour.openTime} 
                        />
                        <span>to</span>
                        <Input 
                          className="w-24" 
                          defaultValue={hour.closeTime} 
                        />
                        <Switch defaultChecked={hour.isOpen} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Hours</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0 space-y-6">
            <Card>
              <form onSubmit={handleSaveNotifications}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell size={18} className="text-primary" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how the system notifies you and your members
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via text message
                        </p>
                      </div>
                      <Switch 
                        checked={smsNotifications} 
                        onCheckedChange={setSmsNotifications} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">App Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive in-app notifications
                        </p>
                      </div>
                      <Switch 
                        checked={appNotifications} 
                        onCheckedChange={setAppNotifications} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Events to Notify</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={currentSettings.notifications.notifyEvents.newMember} id="new-member" />
                        <Label htmlFor="new-member">New Member Registration</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={currentSettings.notifications.notifyEvents.booking} id="booking" />
                        <Label htmlFor="booking">New Booking</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={currentSettings.notifications.notifyEvents.cancelation} id="cancelation" />
                        <Label htmlFor="cancelation">Booking Cancelation</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={currentSettings.notifications.notifyEvents.payment} id="payment" />
                        <Label htmlFor="payment">New Payment</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={currentSettings.notifications.notifyEvents.feedback} id="feedback" />
                        <Label htmlFor="feedback">Member Feedback</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={currentSettings.notifications.notifyEvents.subscription} id="subscription" />
                        <Label htmlFor="subscription">Subscription Changes</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Save Preferences</Button>
                </CardFooter>
              </form>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail size={18} className="text-primary" />
                  Email Templates
                </CardTitle>
                <CardDescription>
                  Customize notification email templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentSettings.emailTemplates.map((template) => (
                  <div key={template.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={template.id}>{template.name}</Label>
                      <Button variant="outline" size="sm">Edit Template</Button>
                    </div>
                    <Input id={template.id} defaultValue={template.subject} />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Templates</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-0 space-y-6">
            <Card>
              <form onSubmit={handleSaveSecurity}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock size={18} className="text-primary" />
                    Admin Account Security
                  </CardTitle>
                  <CardDescription>
                    Update your admin account password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit">Update Password</Button>
                </CardFooter>
              </form>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={18} className="text-primary" />
                  System Security
                </CardTitle>
                <CardDescription>
                  Configure system-wide security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enforce Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">
                      Require all users to use strong passwords
                    </p>
                  </div>
                  <Switch defaultChecked={currentSettings.security.enforceStrongPasswords} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out inactive users
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Input 
                      className="w-16 mr-2" 
                      type="number" 
                      defaultValue={currentSettings.security.sessionTimeout.toString()} 
                      min="5" 
                      max="120" 
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Login Attempts</Label>
                    <p className="text-sm text-muted-foreground">
                      Lock account after failed login attempts
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Input 
                      className="w-16 mr-2" 
                      type="number" 
                      defaultValue={currentSettings.security.loginAttempts.toString()} 
                      min="3" 
                      max="10" 
                    />
                    <span className="text-sm text-muted-foreground">attempts</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Security Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon size={18} className="text-primary" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system-wide settings for your gym
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gymCapacity">Maximum Gym Capacity</Label>
                  <Input 
                    id="gymCapacity" 
                    type="number" 
                    defaultValue={currentSettings.system.gymCapacity.toString()} 
                    min="10" 
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of members allowed in the gym at one time
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bookingWindow">Booking Window (days)</Label>
                  <Input 
                    id="bookingWindow" 
                    type="number" 
                    defaultValue={currentSettings.system.bookingWindow.toString()} 
                    min="1" 
                    max="90" 
                  />
                  <p className="text-xs text-muted-foreground">
                    How many days in advance members can book classes
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cancellationPeriod">Cancellation Period (hours)</Label>
                  <Input 
                    id="cancellationPeriod" 
                    type="number" 
                    defaultValue={currentSettings.system.cancellationPeriod.toString()} 
                    min="1" 
                    max="48" 
                  />
                  <p className="text-xs text-muted-foreground">
                    How many hours before a class members can cancel without penalty
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the system in maintenance mode
                    </p>
                  </div>
                  <Switch defaultChecked={currentSettings.system.maintenanceMode} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save System Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe size={18} className="text-primary" />
                  Localization
                </CardTitle>
                <CardDescription>
                  Set your preferred language and region settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select 
                      id="language" 
                      className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      defaultValue={currentSettings.localization.language}
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <select 
                      id="timeZone" 
                      className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      defaultValue={currentSettings.localization.timeZone}
                    >
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <select 
                      id="dateFormat" 
                      className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      defaultValue={currentSettings.localization.dateFormat}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select 
                      id="currency" 
                      className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      defaultValue={currentSettings.localization.currency}
                    >
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                      <option value="JPY">Japanese Yen (¥)</option>
                      <option value="CAD">Canadian Dollar (C$)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Localization</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedLayout>
  );
}
