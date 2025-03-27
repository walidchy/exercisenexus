
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Settings, Bell, Mail, Lock, Building, Clock, Globe, Users, Shield } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false);
  const [appNotifications, setAppNotifications] = useState<boolean>(true);
  
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("General settings saved successfully!");
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification settings saved successfully!");
  };
  
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security settings saved successfully!");
  };

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
                      <Input id="gymName" defaultValue="GymPro Fitness Center" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Contact Email</Label>
                      <Input id="email" type="email" defaultValue="contact@gympro.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue="https://gympro.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" defaultValue="123 Fitness Street, Gym City, GC 12345" />
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
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="font-medium w-28">{day}</span>
                      <div className="flex items-center gap-2">
                        <Input 
                          className="w-24" 
                          defaultValue={day === "Sunday" ? "10:00" : "06:00"} 
                        />
                        <span>to</span>
                        <Input 
                          className="w-24" 
                          defaultValue={day === "Sunday" ? "16:00" : "22:00"} 
                        />
                        <Switch defaultChecked={day !== "Sunday"} />
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
                        <Switch defaultChecked id="new-member" />
                        <Label htmlFor="new-member">New Member Registration</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked id="booking" />
                        <Label htmlFor="booking">New Booking</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked id="cancelation" />
                        <Label htmlFor="cancelation">Booking Cancelation</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked id="payment" />
                        <Label htmlFor="payment">New Payment</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="feedback" />
                        <Label htmlFor="feedback">Member Feedback</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked id="subscription" />
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="welcome">Welcome Email</Label>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                  <Input id="welcome" defaultValue="Welcome to GymPro!" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="booking-confirm">Booking Confirmation</Label>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                  <Input id="booking-confirm" defaultValue="Your booking has been confirmed!" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payment-receipt">Payment Receipt</Label>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                  <Input id="payment-receipt" defaultValue="Thank you for your payment!" />
                </div>
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
                  <Switch defaultChecked />
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
                      defaultValue="30" 
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
                      defaultValue="5" 
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
                  <Settings size={18} className="text-primary" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system-wide settings for your gym
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gymCapacity">Maximum Gym Capacity</Label>
                  <Input id="gymCapacity" type="number" defaultValue="150" min="10" />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of members allowed in the gym at one time
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bookingWindow">Booking Window (days)</Label>
                  <Input id="bookingWindow" type="number" defaultValue="14" min="1" max="90" />
                  <p className="text-xs text-muted-foreground">
                    How many days in advance members can book classes
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cancellationPeriod">Cancellation Period (hours)</Label>
                  <Input id="cancellationPeriod" type="number" defaultValue="12" min="1" max="48" />
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
                  <Switch />
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
                      defaultValue="en-US"
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
                      defaultValue="America/New_York"
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
                      defaultValue="MM/DD/YYYY"
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
                      defaultValue="USD"
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
