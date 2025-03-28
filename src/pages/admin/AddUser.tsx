
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Bookmark, CheckCircle, CircleAlert } from "lucide-react";

// Define validation schema
const userSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["member", "trainer", "admin"]),
  
  // Optional fields based on role
  membership_id: z.string().optional(),
  health_info: z.string().optional(),
  specialization: z.string().optional(),
  experience: z.string().optional(),
  certifications: z.string().optional(),
  position: z.string().optional(),
  salary: z.string().optional(),
  is_verified: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function AddUser() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      role: "member",
      membership_id: "",
      health_info: "",
      specialization: "",
      experience: "",
      certifications: "",
      position: "",
      salary: "",
      is_verified: true,
    },
  });
  
  const role = form.watch("role");

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call your API
      console.log("User creation data:", data);
      
      // Mock successful user creation
      setTimeout(() => {
        toast.success(`${data.role.charAt(0).toUpperCase() + data.role.slice(1)} added successfully!`);
        form.reset();
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("User creation failed", error);
      toast.error("Failed to add user. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
        
        <Tabs defaultValue="add-user" className="space-y-4">
          <TabsList>
            <TabsTrigger value="add-user" className="flex items-center gap-1">
              <UserPlus size={16} />
              Add User
            </TabsTrigger>
            <TabsTrigger value="bulk-import" className="flex items-center gap-1">
              <Bookmark size={16} />
              Bulk Import
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="add-user" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Create User Account</CardTitle>
                <CardDescription>
                  Add a new user to the system with appropriate role and permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="user@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input placeholder="••••••••" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="trainer">Trainer</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="is_verified"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Account is verified</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Enable this to allow the user to login immediately
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {role === "member" && (
                      <>
                        <Separator className="my-4" />
                        <h3 className="text-lg font-medium mb-4">Member Information</h3>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="membership_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Membership ID (optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., MEM12345" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="health_info"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Health Information (optional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="List any health conditions or important information"
                                    className="min-h-[100px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}
                    
                    {role === "trainer" && (
                      <>
                        <Separator className="my-4" />
                        <h3 className="text-lg font-medium mb-4">Trainer Information</h3>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="specialization"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Specialization</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Weight Training, Yoga" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="2" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="certifications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Certifications</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="List trainer certifications"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    
                    {role === "admin" && (
                      <>
                        <Separator className="my-4" />
                        <h3 className="text-lg font-medium mb-4">Staff Information</h3>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Manager, Front Desk" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="salary"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Salary</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="50000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-end">
                      <Button type="submit" className="flex items-center gap-2" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create User"}
                        {!isSubmitting && <CheckCircle size={16} />}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bulk-import">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Import Users</CardTitle>
                <CardDescription>
                  Import multiple users at once using a CSV file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
                  <div className="rounded-full p-3 bg-muted">
                    <CircleAlert size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Bulk import feature</h3>
                  <p className="text-muted-foreground max-w-md">
                    This feature will be available in the next update. You can add users one at a time for now.
                  </p>
                  <Button variant="outline" onClick={() => {}}>Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedLayout>
  );
}
