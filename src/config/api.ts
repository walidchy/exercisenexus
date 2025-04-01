
// API configuration constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Set this to false when connecting to a real Laravel backend
export const USE_MOCK_DATA = true;

// Base headers for API requests
export const getHeaders = (token?: string) => {
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// API error handling helper
export const handleApiError = (error: any): string => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    const responseData = error.response.data;
    if (responseData.message) {
      return responseData.message;
    } else if (responseData.errors) {
      // Collect validation errors
      return Object.values(responseData.errors)
        .flat()
        .join(', ');
    }
    return `Server error: ${error.response.status}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your connection.';
  } else {
    // Something happened in setting up the request
    return error.message || 'Unknown error occurred';
  }
};

// Mock data
export const MOCK_DATA = {
  // Membership plans
  membershipPlans: [
    {
      id: 1,
      name: "Basic",
      description: "Perfect for beginners",
      price: 29.99,
      features: [
        "Access to gym during standard hours",
        "Basic fitness assessment",
        "Access to standard equipment",
        "2 group classes per month"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Premium",
      description: "Our most popular plan",
      price: 49.99,
      features: [
        "24/7 gym access",
        "Complete fitness assessment",
        "Access to all equipment",
        "Unlimited group classes",
        "1 personal training session monthly"
      ],
      popular: true
    },
    {
      id: 3,
      name: "Elite",
      description: "For dedicated fitness enthusiasts",
      price: 79.99,
      features: [
        "24/7 gym access",
        "Advanced fitness assessment",
        "Access to all equipment",
        "Unlimited group classes",
        "4 personal training sessions monthly",
        "Nutrition consultation",
        "Access to sauna and spa"
      ],
      popular: false
    }
  ],
  
  // Activities
  activities: [
    {
      id: 1,
      name: "Yoga",
      description: "Improve flexibility and mindfulness",
      category: "Group",
      trainer_id: 2,
      image: "/images/yoga.jpg",
      duration: 60,
      capacity: 15,
      schedules: [
        { id: 1, day: "Monday", start_time: "09:00", end_time: "10:00", room: "Studio 1" },
        { id: 2, day: "Wednesday", start_time: "18:00", end_time: "19:00", room: "Studio 2" },
        { id: 3, day: "Friday", start_time: "07:00", end_time: "08:00", room: "Studio 1" }
      ]
    },
    {
      id: 2,
      name: "HIIT",
      description: "High-intensity interval training",
      category: "Group",
      trainer_id: 2,
      image: "/images/hiit.jpg",
      duration: 45,
      capacity: 12,
      schedules: [
        { id: 4, day: "Tuesday", start_time: "18:00", end_time: "18:45", room: "Main Floor" },
        { id: 5, day: "Thursday", start_time: "18:00", end_time: "18:45", room: "Main Floor" },
        { id: 6, day: "Saturday", start_time: "10:00", end_time: "10:45", room: "Main Floor" }
      ]
    },
    {
      id: 3,
      name: "Pilates",
      description: "Core strengthening and flexibility",
      category: "Group",
      trainer_id: 2,
      image: "/images/pilates.jpg",
      duration: 60,
      capacity: 10,
      schedules: [
        { id: 7, day: "Monday", start_time: "11:00", end_time: "12:00", room: "Studio 3" },
        { id: 8, day: "Wednesday", start_time: "11:00", end_time: "12:00", room: "Studio 3" }
      ]
    }
  ],
  
  // Bookings
  bookings: [
    {
      id: 1,
      activity_schedule_id: 2,
      user_id: 1,
      status: "confirmed",
      booked_at: "2023-06-10T14:00:00",
      activity: {
        id: 1,
        name: "Yoga",
        description: "Improve flexibility and mindfulness",
        image: "/images/yoga.jpg"
      },
      schedule: {
        id: 2,
        day: "Wednesday",
        start_time: "18:00",
        end_time: "19:00",
        room: "Studio 2"
      }
    },
    {
      id: 2,
      activity_schedule_id: 4,
      user_id: 1,
      status: "confirmed",
      booked_at: "2023-06-12T09:30:00",
      activity: {
        id: 2,
        name: "HIIT",
        description: "High-intensity interval training",
        image: "/images/hiit.jpg"
      },
      schedule: {
        id: 4, 
        day: "Tuesday",
        start_time: "18:00",
        end_time: "18:45",
        room: "Main Floor"
      }
    }
  ],
  
  // User membership
  userMembership: {
    id: 1,
    user_id: 1,
    membership_plan_id: 2,
    status: "active",
    start_date: "2023-05-01",
    end_date: "2023-06-01",
    auto_renew: true,
    plan: {
      id: 2,
      name: "Premium",
      price: 49.99
    }
  },
  
  // Settings
  settings: [
    { id: 1, key: "gym_name", value: "GymPro Fitness", group: "general" },
    { id: 2, key: "business_hours", value: "Monday-Friday: 6:00-22:00, Saturday-Sunday: 8:00-20:00", group: "general" },
    { id: 3, key: "contact_email", value: "info@gympro.example.com", group: "contact" },
    { id: 4, key: "contact_phone", value: "+1 (555) 123-4567", group: "contact" },
    { id: 5, key: "address", value: "123 Fitness Ave, Healthville, CA 90210", group: "contact" },
    { id: 6, key: "max_class_size", value: "20", group: "classes" },
    { id: 7, key: "booking_window_days", value: "14", group: "bookings" },
    { id: 8, key: "cancellation_policy_hours", value: "24", group: "bookings" }
  ],
  
  // Notifications
  notifications: [
    {
      id: 1,
      user_id: 1,
      title: "Booking Confirmed",
      message: "Your booking for Yoga on Wednesday at 18:00 is confirmed.",
      read: false,
      created_at: "2023-06-10T14:00:00"
    },
    {
      id: 2,
      user_id: 1,
      title: "New Promotion",
      message: "Bring a friend for free this weekend!",
      read: true,
      created_at: "2023-06-08T10:30:00"
    },
    {
      id: 3,
      user_id: 1,
      title: "Membership Renewal",
      message: "Your membership will renew in 5 days.",
      read: false,
      created_at: "2023-06-07T09:15:00"
    }
  ],
  
  // Users (for admin)
  users: [
    {
      id: 1,
      name: "John Member",
      email: "member@example.com",
      role: "member",
      isVerified: true,
      joined_date: "2023-01-15",
      membership_status: "active"
    },
    {
      id: 2,
      name: "Jane Trainer",
      email: "trainer@example.com",
      role: "trainer",
      isVerified: true,
      joined_date: "2022-11-05",
      specialties: ["Yoga", "Pilates", "HIIT"]
    },
    {
      id: 4,
      name: "Mike Newbie",
      email: "mike@example.com",
      role: "member",
      isVerified: false,
      joined_date: "2023-06-10",
      membership_status: "pending"
    }
  ],
  
  // Equipment
  equipment: [
    {
      id: 1,
      name: "Treadmill",
      quantity: 10,
      status: "operational",
      last_maintenance: "2023-05-15"
    },
    {
      id: 2,
      name: "Dumbbells Set",
      quantity: 15,
      status: "operational",
      last_maintenance: "2023-04-20"
    },
    {
      id: 3,
      name: "Rowing Machine",
      quantity: 5,
      status: "maintenance required",
      last_maintenance: "2023-02-10"
    }
  ]
};
