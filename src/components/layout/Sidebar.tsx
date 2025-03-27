
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Home,
  Calendar,
  Users,
  Activity,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  BarChart,
  CreditCard
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({ to, icon, label, isCollapsed }: SidebarLinkProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200 group",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-sidebar-accent text-sidebar-foreground"
      )}
    >
      <span className="flex items-center justify-center w-5 h-5">
        {icon}
      </span>
      
      {!isCollapsed && (
        <span className="ml-3 text-sm font-medium transition-opacity duration-200">
          {label}
        </span>
      )}
      
      {isCollapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0, x: -10 }}
          className="absolute left-14 px-2 py-1 ml-6 text-sm font-medium bg-popover text-popover-foreground rounded-md shadow-lg opacity-0 whitespace-nowrap pointer-events-none z-50 group-hover:opacity-100 group-hover:pointer-events-auto"
        >
          {label}
        </motion.span>
      )}
    </Link>
  );
};

const getMemberLinks = () => [
  { to: "/member", icon: <Home size={18} />, label: "Dashboard" },
  { to: "/member/profile", icon: <User size={18} />, label: "Profile" },
  { to: "/member/activities", icon: <Activity size={18} />, label: "Activities" },
  { to: "/member/bookings", icon: <Calendar size={18} />, label: "My Bookings" },
  { to: "/member/membership-plans", icon: <CreditCard size={18} />, label: "Membership Plans" },
];

const getTrainerLinks = () => [
  { to: "/trainer", icon: <Home size={18} />, label: "Dashboard" },
  { to: "/trainer/profile", icon: <User size={18} />, label: "Profile" },
  { to: "/trainer/activities", icon: <Activity size={18} />, label: "Activities" },
  { to: "/trainer/clients", icon: <Users size={18} />, label: "Clients" },
  { to: "/trainer/schedule", icon: <Calendar size={18} />, label: "Schedule" },
];

const getAdminLinks = () => [
  { to: "/admin", icon: <Home size={18} />, label: "Dashboard" },
  { to: "/admin/members", icon: <Users size={18} />, label: "Members" },
  { to: "/admin/trainers", icon: <Activity size={18} />, label: "Trainers" },
  { to: "/admin/activities", icon: <Calendar size={18} />, label: "Activities" },
  { to: "/admin/reports", icon: <BarChart size={18} />, label: "Reports" },
  { to: "/admin/settings", icon: <Settings size={18} />, label: "Settings" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Get links based on user role
  const getLinks = () => {
    if (!user) return [];
    
    switch (user.role) {
      case "member":
        return getMemberLinks();
      case "trainer":
        return getTrainerLinks();
      case "admin":
        return getAdminLinks();
      default:
        return [];
    }
  };
  
  const links = getLinks();
  
  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="h-screen flex flex-col border-r border-sidebar-border bg-sidebar shadow-sm relative"
    >
      {/* Logo and Collapse Button */}
      <div className={cn(
        "flex items-center h-16 px-4",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex items-center">
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Gym<span className="font-bold">Pro</span>
            </span>
          </div>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center">
            <span className="text-xl font-bold text-primary">G</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      {/* User Profile */}
      <div className={cn(
        "flex items-center px-4 py-4 mb-2 border-b border-sidebar-border",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <div className="flex-shrink-0 w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          {user?.name.charAt(0) || "U"}
        </div>
        
        {!isCollapsed && (
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        )}
      </div>
      
      {/* Navigation Links */}
      <div className="flex flex-col flex-1 px-3 py-2 overflow-y-auto">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
      
      {/* Logout Button */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full flex items-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="ml-3 text-sm">Logout</span>}
        </Button>
      </div>
    </motion.div>
  );
}

export default Sidebar;
