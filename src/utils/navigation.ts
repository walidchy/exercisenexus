
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Interface for navigation menu items
 */
export interface MenuItem {
  label: string;
  path: string;
  icon?: React.ComponentType<any>;
  children?: MenuItem[];
  permissions?: string[];
}

/**
 * Get appropriate navigation menu items based on user role
 * @param role User role (member, trainer, admin)
 * @returns Array of navigation menu items
 */
export const getNavigation = (role: string): MenuItem[] => {
  switch (role) {
    case 'admin':
      return adminNavigation;
    case 'trainer':
      return trainerNavigation;
    case 'member':
      return memberNavigation;
    default:
      return [];
  }
};

/**
 * Member navigation menu items
 */
export const memberNavigation: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/member',
    permissions: ['canViewMemberDashboard'],
  },
  {
    label: 'Activities',
    path: '/member/activities',
    permissions: ['canViewMemberDashboard'],
  },
  {
    label: 'My Bookings',
    path: '/member/bookings',
    permissions: ['canBookActivities'],
  },
  {
    label: 'Membership Plans',
    path: '/member/membership-plans',
    permissions: ['canViewMemberDashboard'],
  },
  {
    label: 'Profile',
    path: '/member/profile',
  },
];

/**
 * Trainer navigation menu items
 */
export const trainerNavigation: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/trainer',
    permissions: ['canViewTrainerDashboard'],
  },
  {
    label: 'Activities',
    path: '/trainer/activities',
    permissions: ['canManageActivities'],
  },
  {
    label: 'Schedule',
    path: '/trainer/schedule',
    permissions: ['canManageSchedule'],
  },
  {
    label: 'Clients',
    path: '/trainer/clients',
    permissions: ['canViewTrainerDashboard'],
  },
  {
    label: 'Profile',
    path: '/trainer/profile',
  },
];

/**
 * Admin navigation menu items
 */
export const adminNavigation: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/admin',
    permissions: ['canViewAdminDashboard'],
  },
  {
    label: 'Members',
    path: '/admin/members',
    permissions: ['canManageUsers'],
  },
  {
    label: 'Trainers',
    path: '/admin/trainers',
    permissions: ['canManageUsers'],
  },
  {
    label: 'Activities',
    path: '/admin/activities',
    permissions: ['canManageActivities'],
  },
  {
    label: 'User Verification',
    path: '/admin/user-verification',
    permissions: ['canManageUsers'],
  },
  {
    label: 'Reports',
    path: '/admin/reports',
    permissions: ['canViewReports'],
  },
  {
    label: 'Settings',
    path: '/admin/settings',
    permissions: ['canViewAdminDashboard'],
  },
  {
    label: 'API Test',
    path: '/admin/api-test',
    permissions: ['canViewAdminDashboard'],
  },
];

/**
 * Custom hook to scroll to top on navigation
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

/**
 * Get breadcrumb items based on current path
 * @param path Current path
 * @param role User role
 * @returns Array of breadcrumb items
 */
export const getBreadcrumbs = (path: string, role: string): {label: string, path: string}[] => {
  const parts = path.split('/').filter(Boolean);
  const breadcrumbs: {label: string, path: string}[] = [];
  
  // Add home breadcrumb
  if (parts.length > 0 && parts[0] === role) {
    breadcrumbs.push({ label: 'Home', path: `/${role}` });
  }
  
  // Add remaining breadcrumbs
  if (parts.length > 1) {
    const navItems = getNavigation(role);
    const currentPath = `/${parts.join('/')}`;
    
    // Find matching navigation item
    const matchingItem = navItems.find(item => item.path === currentPath);
    
    if (matchingItem) {
      breadcrumbs.push({ label: matchingItem.label, path: matchingItem.path });
    } else {
      // Fallback: just use capitalized path part
      const lastPart = parts[parts.length - 1];
      breadcrumbs.push({
        label: lastPart.charAt(0).toUpperCase() + lastPart.slice(1),
        path: currentPath
      });
    }
  }
  
  return breadcrumbs;
};
