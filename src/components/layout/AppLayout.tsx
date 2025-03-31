
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarWithRouter } from "@/components/layout/Sidebar";
import { useRequireAuth } from "@/hooks/useAuth";
import { Toaster } from "sonner";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import { Loader2 } from "lucide-react";

interface AppLayoutProps {
  allowedRoles?: Array<"member" | "trainer" | "admin">;
}

export function AppLayout({ allowedRoles }: AppLayoutProps) {
  const { isLoading } = useRequireAuth(allowedRoles);
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarWithRouter />
      
      <main className="flex-1 overflow-auto bg-background">
        <AnimatedLayout className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </AnimatedLayout>
      </main>
      
      <Toaster position="top-right" />
    </div>
  );
}

export default AppLayout;
