
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Member pages
import MemberDashboard from "./pages/member/Dashboard";
import MemberProfile from "./pages/member/Profile";
import MemberActivities from "./pages/member/Activities";
import MemberBookings from "./pages/member/Bookings";
import MembershipPlans from "./pages/member/MembershipPlans";

// Trainer pages
import TrainerDashboard from "./pages/trainer/Dashboard";
import TrainerProfile from "./pages/trainer/Profile";
import TrainerActivities from "./pages/trainer/Activities";
import TrainerClients from "./pages/trainer/Clients";
import TrainerSchedule from "./pages/trainer/Schedule";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMembers from "./pages/admin/Members";
import AdminTrainers from "./pages/admin/Trainers";
import AdminActivities from "./pages/admin/Activities";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import UserVerification from "./pages/admin/UserVerification";
import AddUser from "./pages/admin/AddUser";

// AppLayout
import { AppLayout } from "./components/layout/AppLayout";

// Create a new query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Member routes */}
            <Route path="/member" element={<AppLayout allowedRoles={["member"]} />}>
              <Route index element={<MemberDashboard />} />
              <Route path="profile" element={<MemberProfile />} />
              <Route path="activities" element={<MemberActivities />} />
              <Route path="bookings" element={<MemberBookings />} />
              <Route path="membership-plans" element={<MembershipPlans />} />
              {/* Add more member routes here */}
            </Route>
            
            {/* Trainer routes */}
            <Route path="/trainer" element={<AppLayout allowedRoles={["trainer"]} />}>
              <Route index element={<TrainerDashboard />} />
              <Route path="profile" element={<TrainerProfile />} />
              <Route path="activities" element={<TrainerActivities />} />
              <Route path="clients" element={<TrainerClients />} />
              <Route path="schedule" element={<TrainerSchedule />} />
              {/* Add more trainer routes here */}
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={<AppLayout allowedRoles={["admin"]} />}>
              <Route index element={<AdminDashboard />} />
              <Route path="members" element={<AdminMembers />} />
              <Route path="trainers" element={<AdminTrainers />} />
              <Route path="activities" element={<AdminActivities />} />
              <Route path="user-verification" element={<UserVerification />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
              {/* Add more admin routes here */}
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
          <Sonner position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
