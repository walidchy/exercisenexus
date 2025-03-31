
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { ArrowUpDown, Calendar, Phone, Search, User } from "lucide-react";
import mockApi from "@/services/mockApi";
import { toast } from "sonner";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  lastVisit: string;
  subscription: string;
  status: string;
  progress: string;
}

export default function Clients() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await mockApi.get('/trainer/clients');
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Failed to load client data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  const filteredClients = clients.filter(client => {
    // Filter by status
    if (filter !== "all" && client.status !== filter) return false;
    
    // Filter by search query
    if (searchQuery && !client.name.toLowerCase().includes(searchQuery.toLowerCase()) && !client.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressBadgeClass = (progress: string) => {
    switch (progress) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "needs attention":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <AnimatedLayout>
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Loading client data...</p>
        </div>
      </AnimatedLayout>
    );
  }

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Add Client</Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="all">All Clients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <TabsContent value={filter} className="mt-0">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle>Client List</CardTitle>
                <CardDescription>
                  {filteredClients.length} clients found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground">
                        <th className="h-10 px-4 text-left font-medium">
                          <div className="flex items-center gap-1">
                            Client
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th className="h-10 px-4 text-left font-medium">Contact</th>
                        <th className="h-10 px-4 text-left font-medium">Joined</th>
                        <th className="h-10 px-4 text-left font-medium">Last Visit</th>
                        <th className="h-10 px-4 text-left font-medium">Status</th>
                        <th className="h-10 px-4 text-left font-medium">Progress</th>
                        <th className="h-10 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => (
                        <tr key={client.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                {client.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-xs text-muted-foreground">{client.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-1">
                              <Phone size={14} className="text-muted-foreground" />
                              <span>{client.phone}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-muted-foreground" />
                              <span>{client.joinDate}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {client.lastVisit}
                          </td>
                          <td className="p-4 align-middle">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(client.status)}`}>
                              {client.status}
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressBadgeClass(client.progress)}`}>
                              {client.progress}
                            </span>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">View</Button>
                              <Button size="sm" variant="outline">Message</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedLayout>
  );
}
