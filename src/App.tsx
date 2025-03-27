
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Member pages
import MemberDashboard from "./pages/member/Dashboard";

// Trainer pages
import TrainerDashboard from "./pages/trainer/Dashboard";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";

// AppLayout
import { AppLayout } from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Member routes */}
            <Route path="/member" element={<AppLayout allowedRoles={["member"]} />}>
              <Route index element={<MemberDashboard />} />
              {/* Add more member routes here */}
            </Route>
            
            {/* Trainer routes */}
            <Route path="/trainer" element={<AppLayout allowedRoles={["trainer"]} />}>
              <Route index element={<TrainerDashboard />} />
              {/* Add more trainer routes here */}
            </Route>
            
            {/* Admin routes */}
            <Route path="/admin" element={<AppLayout allowedRoles={["admin"]} />}>
              <Route index element={<AdminDashboard />} />
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
