import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { 
  ArrowUpDown, 
  Calendar, 
  Download, 
  FileEdit, 
  Search, 
  Trash, 
  User, 
  UserPlus, 
  Mail,
  PhoneCall 
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Mock member data
const members = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2023-05-15",
    membershipType: "Premium",
    membershipStatus: "Active",
    lastVisit: "2023-11-10"
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1 (555) 234-5678",
    joinDate: "2023-06-22",
    membershipType: "Basic",
    membershipStatus: "Active",
    lastVisit: "2023-11-12"
  },
  {
    id: 3,
    name: "Carol Williams",
    email: "carol@example.com",
    phone: "+1 (555) 345-6789",
    joinDate: "2023-04-10",
    membershipType: "Premium",
    membershipStatus: "Expired",
    lastVisit: "2023-10-05"
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@example.com",
    phone: "+1 (555) 456-7890",
    joinDate: "2023-08-03",
    membershipType: "Premium",
    membershipStatus: "Active",
    lastVisit: "2023-11-11"
  },
  {
    id: 5,
    name: "Eva Davis",
    email: "eva@example.com",
    phone: "+1 (555) 567-8901",
    joinDate: "2023-07-19",
    membershipType: "Basic",
    membershipStatus: "Suspended",
    lastVisit: "2023-09-30"
  },
  {
    id: 6,
    name: "Frank Miller",
    email: "frank@example.com",
    phone: "+1 (555) 678-9012",
    joinDate: "2023-09-05",
    membershipType: "Basic",
    membershipStatus: "Active",
    lastVisit: "2023-11-09"
  },
  {
    id: 7,
    name: "Grace Wilson",
    email: "grace@example.com",
    phone: "+1 (555) 789-0123",
    joinDate: "2023-10-20",
    membershipType: "Premium",
    membershipStatus: "Active",
    lastVisit: "2023-11-13"
  }
];

export default function Members() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const navigate = useNavigate();
  
  const filteredMembers = members.filter(member => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.phone.includes(searchQuery) ||
      member.membershipType.toLowerCase().includes(searchLower) ||
      member.membershipStatus.toLowerCase().includes(searchLower)
    );
  });
  
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the API
    toast.success("Member added successfully!");
    setShowAddDialog(false);
  };
  
  const handleEditMember = (member: any) => {
    toast.info(`Editing ${member.name}'s details`);
    // In a real application, you would navigate to an edit page or open an edit modal
    setSelectedMember(member);
  };
  
  const handleDeleteMember = (member: any) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteMember = () => {
    // In a real app, this would send a delete request to the API
    toast.success(`${selectedMember.name} has been removed`);
    setShowDeleteDialog(false);
  };
  
  const handleViewProfile = (member: any) => {
    toast.info(`Viewing ${member.name}'s profile`);
    // In a real application, you would navigate to the member's profile page
  };
  
  const handleExportData = () => {
    toast.success("Member data exported successfully!");
    // In a real app, this would generate and download a CSV/Excel file
  };
  
  const handleAddNewMember = () => {
    navigate("/admin/add-user");
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Member Management</h1>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleExportData}
            >
              <Download size={16} />
              <span>Export</span>
            </Button>
            <Button 
              className="flex items-center gap-1"
              onClick={handleAddNewMember}
            >
              <UserPlus size={16} />
              <span>Add Member</span>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-1">
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Manage all gym members from here. Currently showing {filteredMembers.length} members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-muted-foreground">
                    <th className="h-10 px-4 text-left font-medium">
                      <div className="flex items-center gap-1">
                        Member
                        <ArrowUpDown size={14} />
                      </div>
                    </th>
                    <th className="h-10 px-4 text-left font-medium">Join Date</th>
                    <th className="h-10 px-4 text-left font-medium">Membership</th>
                    <th className="h-10 px-4 text-left font-medium">Status</th>
                    <th className="h-10 px-4 text-left font-medium">Last Visit</th>
                    <th className="h-10 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-muted-foreground" />
                          <span>{member.joinDate}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {member.membershipType}
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.membershipStatus)}`}>
                          {member.membershipStatus}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        {member.lastVisit}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            onClick={() => handleViewProfile(member)}
                            title="View Profile"
                          >
                            <User size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            onClick={() => handleEditMember(member)}
                            title="Edit Member"
                          >
                            <FileEdit size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="text-destructive"
                            onClick={() => handleDeleteMember(member)}
                            title="Delete Member"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedMember?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteMember}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedLayout>
  );
}
