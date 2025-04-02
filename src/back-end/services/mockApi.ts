import axios from 'axios';
import { toast } from 'sonner';

// Create a mock API instance with simulated delay
const mockApi = axios.create({
  baseURL: '/api',
});

// Add response interceptor to simulate network delay
mockApi.interceptors.response.use(
  (response) => {
    return new Promise((resolve) => {
      // Simulate network delay (300-800ms)
      setTimeout(() => {
        resolve(response);
      }, Math.floor(Math.random() * 500) + 300);
    });
  },
  (error) => {
    toast.error('API Error: ' + (error.response?.data?.message || error.message));
    return Promise.reject(error);
  }
);

// Mock response handlers for different endpoints
const mockResponses = {
  // Trainer Profile data
  '/trainer/profile': {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    id: 'T12345',
    specialization: 'Strength & Conditioning',
    experience: '5 years',
    contact: '+1 (555) 123-4567',
    certifications: [
      {
        id: 1,
        name: 'Certified Personal Trainer (CPT)',
        issuer: 'National Academy of Sports Medicine (NASM)',
        issueDate: 'January 2020',
        expiryDate: 'January 2024',
      },
      {
        id: 2,
        name: 'Corrective Exercise Specialist (CES)',
        issuer: 'American Council on Exercise (ACE)',
        issueDate: 'March 2021',
        expiryDate: null,
      },
      {
        id: 3,
        name: 'Strength & Conditioning Coach',
        issuer: 'National Strength and Conditioning Association (NSCA)',
        issueDate: 'September 2022',
        expiryDate: 'September 2025',
      },
    ],
  },
  
  // Membership Plans
  '/membership-plans': [
    {
      id: 1,
      name: 'Basic',
      description: 'Perfect for beginners and casual gym-goers',
      price: 29.99,
      features: [
        'Gym access (6am-10pm)',
        'Basic equipment usage',
        'Locker access',
        '2 group classes per month',
      ],
      popular: false,
    },
    {
      id: 2,
      name: 'Premium',
      description: 'Our most popular plan for serious fitness enthusiasts',
      price: 59.99,
      features: [
        '24/7 gym access',
        'Full equipment usage',
        'Locker access',
        'Unlimited group classes',
        'Basic fitness assessment',
        'Access to sauna & pool',
      ],
      popular: true,
    },
    {
      id: 3,
      name: 'Elite',
      description: 'The ultimate fitness experience with premium perks',
      price: 99.99,
      features: [
        '24/7 gym access',
        'Full equipment usage',
        'Premium locker access',
        'Unlimited group classes',
        'Comprehensive fitness assessment',
        'Personal training session (2x/month)',
        '1 free guest per visit',
        'Access to sauna, pool & spa',
        'Nutrition consultation',
      ],
      popular: false,
    },
  ],
  
  // Member Activities
  '/activities': [
    {
      id: 1,
      name: 'Yoga Class',
      description: 'Relax and improve flexibility with our yoga sessions',
      trainer_id: 3,
      category: 'Wellness',
      difficulty_level: 'Beginner',
      duration_minutes: 60,
      max_participants: 20,
      location: 'Studio 1',
      equipment_needed: ['Yoga mat', 'Towel'],
      trainer: { name: 'Emma Wilson' },
      schedules: [
        {
          id: 101,
          day_of_week: 'Monday',
          start_time: '09:00:00',
          end_time: '10:00:00',
          is_recurring: true
        }
      ]
    },
    {
      id: 2,
      name: 'HIIT Workout',
      description: 'High-intensity interval training for maximum calorie burn',
      trainer_id: 1,
      category: 'Cardio',
      difficulty_level: 'Intermediate',
      duration_minutes: 45,
      max_participants: 25,
      location: 'Main Gym',
      equipment_needed: ['Dumbbells', 'Jump rope', 'Exercise mat'],
      trainer: { name: 'Sarah Johnson' },
      schedules: [
        {
          id: 102,
          day_of_week: 'Tuesday',
          start_time: '18:00:00',
          end_time: '19:00:00',
          is_recurring: true
        }
      ]
    },
    {
      id: 3,
      name: 'Strength Training',
      description: 'Build muscle and strength with our comprehensive program',
      trainer_id: 2,
      category: 'Strength',
      difficulty_level: 'Advanced',
      duration_minutes: 90,
      max_participants: 20,
      location: 'Weight Room',
      equipment_needed: ['Barbells', 'Kettlebells', 'Resistance bands'],
      trainer: { name: 'Mike Thompson' },
      schedules: [
        {
          id: 103,
          day_of_week: 'Wednesday',
          start_time: '17:00:00',
          end_time: '18:30:00',
          is_recurring: true
        }
      ]
    },
    {
      id: 4,
      name: 'Pilates',
      description: 'Core strengthening and flexibility exercises',
      trainer_id: 4,
      category: 'Wellness',
      difficulty_level: 'All Levels',
      duration_minutes: 60,
      max_participants: 15,
      location: 'Studio 2',
      equipment_needed: ['Pilates mat', 'Resistance ring'],
      trainer: { name: 'Lisa Rodriguez' },
      schedules: [
        {
          id: 104,
          day_of_week: 'Thursday',
          start_time: '10:00:00',
          end_time: '11:00:00',
          is_recurring: true
        }
      ]
    },
    {
      id: 5,
      name: 'Cycling',
      description: 'Indoor cycling class with high energy music',
      trainer_id: 5,
      category: 'Cardio',
      difficulty_level: 'Intermediate',
      duration_minutes: 60,
      max_participants: 25,
      location: 'Spin Room',
      equipment_needed: [],
      trainer: { name: 'James Parker' },
      schedules: [
        {
          id: 105,
          day_of_week: 'Friday',
          start_time: '19:00:00',
          end_time: '20:00:00',
          is_recurring: true
        }
      ]
    }
  ],
  
  // Trainer Activities (same structure but with different operations available)
  '/trainer/activities': [
    {
      id: 1,
      name: 'Yoga Class',
      description: 'Relax and improve flexibility with our yoga sessions',
      time: '09:00 - 10:00',
      day: 'Monday',
      participants: 12,
      maxParticipants: 20,
      location: 'Studio 1',
      level: 'Beginner',
      category: 'Wellness'
    },
    {
      id: 2,
      name: 'HIIT Workout',
      description: 'High-intensity interval training for maximum calorie burn',
      time: '18:00 - 19:00',
      day: 'Tuesday',
      participants: 18,
      maxParticipants: 25,
      location: 'Main Gym',
      level: 'Intermediate',
      category: 'Cardio'
    },
    {
      id: 3,
      name: 'Strength Training',
      description: 'Build muscle and strength with our comprehensive program',
      time: '17:00 - 18:30',
      day: 'Wednesday',
      participants: 15,
      maxParticipants: 20,
      location: 'Weight Room',
      level: 'Advanced',
      category: 'Strength'
    },
    {
      id: 4,
      name: 'Pilates',
      description: 'Core strengthening and flexibility exercises',
      time: '10:00 - 11:00',
      day: 'Thursday',
      participants: 10,
      maxParticipants: 15,
      location: 'Studio 2',
      level: 'All Levels',
      category: 'Wellness'
    },
    {
      id: 5,
      name: 'Cycling',
      description: 'Indoor cycling class with high energy music',
      time: '19:00 - 20:00',
      day: 'Friday',
      participants: 20,
      maxParticipants: 25,
      location: 'Spin Room',
      level: 'Intermediate',
      category: 'Cardio'
    }
  ],
  
  // Trainer Clients
  '/trainer/clients': [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2023-05-15',
      lastVisit: '2023-11-10',
      subscription: 'Premium',
      status: 'active',
      progress: 'good'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1 (555) 234-5678',
      joinDate: '2023-06-22',
      lastVisit: '2023-11-12',
      subscription: 'Basic',
      status: 'active',
      progress: 'excellent'
    },
    {
      id: 3,
      name: 'Carol Williams',
      email: 'carol@example.com',
      phone: '+1 (555) 345-6789',
      joinDate: '2023-04-10',
      lastVisit: '2023-10-05',
      subscription: 'Premium',
      status: 'inactive',
      progress: 'needs attention'
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+1 (555) 456-7890',
      joinDate: '2023-08-03',
      lastVisit: '2023-11-11',
      subscription: 'Premium',
      status: 'active',
      progress: 'good'
    },
    {
      id: 5,
      name: 'Eva Davis',
      email: 'eva@example.com',
      phone: '+1 (555) 567-8901',
      joinDate: '2023-07-19',
      lastVisit: '2023-09-30',
      subscription: 'Basic',
      status: 'inactive',
      progress: 'needs attention'
    }
  ],
  
  // Schedule Data
  '/trainer/schedule': {
    currentWeek: "November 13-19, 2023",
    previousWeek: "November 6-12, 2023",
    nextWeek: "November 20-26, 2023",
    nextTwoWeeks: "November 27 - December 3, 2023",
    scheduleData: [
      { id: 1, day: "Monday", time: "09:00 - 10:00", activity: "Yoga Class", participants: 12, location: "Studio 1" },
      { id: 2, day: "Monday", time: "18:00 - 19:00", activity: "HIIT Workout", participants: 18, location: "Main Gym" },
      { id: 3, day: "Tuesday", time: "10:00 - 11:00", activity: "Pilates", participants: 10, location: "Studio 2" },
      { id: 4, day: "Wednesday", time: "17:00 - 18:30", activity: "Strength Training", participants: 15, location: "Weight Room" },
      { id: 5, day: "Thursday", time: "08:00 - 09:00", activity: "Morning Stretching", participants: 8, location: "Studio 1" },
      { id: 6, day: "Friday", time: "19:00 - 20:00", activity: "Cycling", participants: 20, location: "Spin Room" },
      { id: 7, day: "Saturday", time: "10:00 - 11:30", activity: "Full Body Workout", participants: 16, location: "Main Gym" }
    ]
  },
  
  // Member Dashboard data
  '/member/dashboard': {
    nextClass: {
      name: "HIIT Training",
      trainer: "Sarah Johnson",
      time: "Today at 6:00 PM",
      location: "Studio 3"
    },
    membershipDetails: {
      plan: "Premium Fitness",
      status: "Active",
      validUntil: "October 15, 2023",
      daysLeft: 21
    },
    stats: {
      completedWorkouts: 12,
      activeDays: 8,
      activeChallenges: 3,
      caloriesBurned: 1248
    },
    weeklyProgress: [40, 65, 30, 85, 50, 70, 45]
  },
  
  // Admin Dashboard data
  '/admin/dashboard': {
    membershipStats: {
      active: 248,
      newThisMonth: 32,
      expiringSoon: 15,
      revenueThisMonth: 12680
    },
    equipmentStats: {
      total: 76,
      needsMaintenance: 5,
      scheduledMaintenance: 3
    },
    revenueData: [
      { month: "Jan", amount: 9500 },
      { month: "Feb", amount: 10200 },
      { month: "Mar", amount: 9800 },
      { month: "Apr", amount: 11000 },
      { month: "May", amount: 10500 },
      { month: "Jun", amount: 11800 }
    ]
  },
  
  // Admin Members
  '/admin/members': [
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
  ]
};

// Request interceptor to simulate backend API responses
mockApi.interceptors.request.use(
  async (config) => {
    // Get the endpoint being requested
    const endpoint = config.url || '';
    
    // Check if we have a mock response for this endpoint
    if (mockResponses[endpoint]) {
      // Return mock data instead of making a real request
      return {
        ...config,
        adapter: () => {
          return Promise.resolve({
            data: mockResponses[endpoint],
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          });
        },
      };
    }
    
    // If we don't have mock data, let the request proceed (it will likely fail in our mock environment)
    console.warn(`No mock data available for endpoint: ${endpoint}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default mockApi;
