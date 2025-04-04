
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Search, CheckCircle2, XCircle, Filter } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usersApi } from "@/services/api";

// User type
interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: string;
  registeredDate: string;
  status: "pending" | "verified" | "rejected";
}

export default function UserVerification() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState<{[key: number]: boolean}>({});
  const { user, verifyUser, rejectUser } = useAuth();
  
  // Fetch users when component mounts
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setIsLoading(prev => ({ ...prev, loading: true }));
        const fetchedUsers = await usersApi.getUsers({ verified: false });
        
        // Map API response to component state
        const mappedUsers = fetchedUsers.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          registeredDate: new Date(user.created_at).toLocaleDateString(),
          status: "pending"
        }));
        
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load pending users. Please try again.");
        
        // Fallback to empty users list
        setUsers([]);
      } finally {
        setIsLoading(prev => ({ ...prev, loading: false }));
      }
    };
    
    fetchPendingUsers();
  }, []);
  
  const filteredUsers = users.filter(user => {
    // Apply search filter
    const matchesSearch = !searchQuery 
      ? true 
      : user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply role filter
    const matchesRole = roleFilter === "all" ? true : user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  const handleVerify = async (userId: number) => {
    try {
      setIsLoading(prev => ({ ...prev, [userId]: true }));
      
      // Call the API to verify the user
      await verifyUser(userId);
      
      // Update local state to reflect the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: "verified" } : user
      ));
      
      toast.success("User verified successfully");
    } catch (error) {
      console.error("Failed to verify user:", error);
      toast.error("Failed to verify user. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleReject = async (userId: number) => {
    try {
      setIsLoading(prev => ({ ...prev, [userId]: true }));
      
      await rejectUser(userId);
      
      // Update local state to reflect the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: "rejected" } : user
      ));
      
      toast.success("User rejected successfully");
    } catch (error) {
      console.error("Failed to reject user:", error);
      toast.error("Failed to reject user. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "member":
        return "bg-green-100 text-green-800";
      case "trainer":
        return "bg-blue-100 text-blue-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">User Verification</h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <SelectValue placeholder="Filter by role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="member">Members</SelectItem>
                <SelectItem value="trainer">Trainers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Pending Verifications</CardTitle>
            <CardDescription>
              New users awaiting verification. Currently showing {filteredUsers.length} pending users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending verifications found.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="h-10 px-4 text-left font-medium">User</th>
                      <th className="h-10 px-4 text-left font-medium">Role</th>
                      <th className="h-10 px-4 text-left font-medium">Registered</th>
                      <th className="h-10 px-4 text-left font-medium">Status</th>
                      <th className="h-10 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge 
                            variant="outline" 
                            className={`px-2 py-1 ${getRoleBadgeColor(user.role)}`}
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          {user.registeredDate}
                        </td>
                        <td className="p-4 align-middle">
                          {user.status === "pending" ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          ) : user.status === "verified" ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          {user.status === "pending" && (
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleVerify(user.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={isLoading[user.id]}
                              >
                                {isLoading[user.id] ? (
                                  "Verifying..."
                                ) : (
                                  <>
                                    <CheckCircle2 size={16} className="mr-1" />
                                    Verify
                                  </>
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleReject(user.id)}
                                disabled={isLoading[user.id]}
                              >
                                {isLoading[user.id] ? (
                                  "Rejecting..."
                                ) : (
                                  <>
                                    <XCircle size={16} className="mr-1" />
                                    Reject
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                          {user.status === "verified" && (
                            <span className="text-sm text-muted-foreground">Verified</span>
                          )}
                          {user.status === "rejected" && (
                            <span className="text-sm text-muted-foreground">Rejected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedLayout>
  );
}
