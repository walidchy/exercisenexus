
// API Response wrapper type
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: string;
}

// User and Auth related types
export interface User {
  id: number;
  name: string;
  email: string;
  role: "member" | "trainer" | "admin";
  avatar?: string;
  is_verified: boolean;
  member?: MemberProfile;
  trainer?: TrainerProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: "member" | "trainer" | "admin";
}

// Profile types
interface BaseProfile {
  id: number;
  user_id: number;
  phone?: string;
  profile_image?: string;
}

export interface MemberProfile extends BaseProfile {
  date_of_birth?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  health_conditions?: string[];
  fitness_goals?: string[];
}

export interface TrainerProfile extends BaseProfile {
  bio?: string;
  specialties?: string[];
  experience_years?: number;
  certification?: string[];
  availability?: TrainerAvailability[];
}

export interface TrainerAvailability {
  day: string;
  start_time: string;
  end_time: string;
}

// Activity related types
export interface Activity {
  id: number;
  name: string;
  description: string;
  category: string;
  duration: number;
  max_participants?: number;
  difficulty_level: string;
  image_url?: string;
  trainer_id?: number;
  trainer?: User;
  schedules?: ActivitySchedule[];
}

export interface ActivitySchedule {
  id: number;
  activity_id: number;
  day: string;
  start_time: string;
  end_time: string;
  room?: string;
}

// Booking related types
export interface Booking {
  id: number;
  user_id: number;
  activity_id: number;
  schedule_id?: number;
  trainer_id?: number;
  date: string;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  cancellation_reason?: string;
  user?: User;
  activity?: Activity;
  schedule?: ActivitySchedule;
  trainer?: User;
}

// Membership related types
export interface MembershipPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  features: string[];
  is_active: boolean;
  popular?: boolean;
}

export interface UserMembership {
  id: number;
  user_id: number;
  membership_plan_id: number;
  start_date: string;
  end_date: string;
  status: "active" | "expired" | "cancelled";
  auto_renew: boolean;
  membership_plan?: MembershipPlan;
}

// Notification type
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read_at: string | null;
  created_at: string;
}

// Equipment type
export interface Equipment {
  id: number;
  name: string;
  type: string;
  description?: string;
  quantity: number;
  status: "available" | "maintenance" | "out_of_order";
  last_maintenance?: string;
}

// Setting type
export interface Setting {
  id: number;
  key: string;
  value: any;
  group: string;
  is_public: boolean;
}
