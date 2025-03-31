
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../services/api";
import axios from "axios";
import { API_BASE_URL, getHeaders } from "../config/api";

// Define user types based on roles
type UserRole = "member" | "trainer" | "admin";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyUser: (userId: number) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  verifyUser: async () => {},
});

// Flag to use mock data when backend is not available
const USE_MOCK_DATA = true; // Set to false when your backend is ready

// Mock user data for development
const MOCK_USERS = {
  "member@example.com": {
    id: 1,
    name: "John Member",
    email: "member@example.com",
    role: "member" as UserRole,
    isVerified: true,
    token: "mock-token-member"
  },
  "trainer@example.com": {
    id: 2,
    name: "Jane Trainer",
    email: "trainer@example.com",
    role: "trainer" as UserRole,
    isVerified: true,
    token: "mock-token-trainer"
  },
  "admin@example.com": {
    id: 3,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as UserRole,
    isVerified: true,
    token: "mock-token-admin"
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for existing user session
        const savedUser = localStorage.getItem("gym_user");
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          
          if (USE_MOCK_DATA) {
            // Just use the saved user data for mock mode
            setUser(parsedUser);
          } else {
            // Validate token by fetching current user
            try {
              const userData = await api.getCurrentUser(parsedUser.token);
              setUser({
                ...userData,
                isVerified: userData.is_verified,
                token: parsedUser.token
              });
            } catch (error) {
              console.error("Token validation error:", error);
              localStorage.removeItem("gym_user");
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("gym_user");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      if (USE_MOCK_DATA) {
        // Mock login for development without backend
        const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS];
        
        if (mockUser && password === "password") {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          setUser(mockUser);
          localStorage.setItem("gym_user", JSON.stringify(mockUser));
          
          // Redirect based on user role
          if (mockUser.role === "member") {
            navigate("/member");
          } else if (mockUser.role === "trainer") {
            navigate("/trainer");
          } else if (mockUser.role === "admin") {
            navigate("/admin");
          }
          
          toast.success("Login successful (Mock Mode)");
          return;
        } else {
          throw new Error("Invalid credentials");
        }
      }
      
      // Call the Laravel API via our service
      const response = await api.login(email, password);
      
      // Check if user is verified
      if (!response.user.is_verified) {
        toast.error("Your account is pending verification. Please contact admin.");
        setIsLoading(false);
        return;
      }
      
      const userData: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        avatar: response.user.avatar,
        isVerified: response.user.is_verified,
        token: response.token
      };
      
      // Save user to state and localStorage
      setUser(userData);
      localStorage.setItem("gym_user", JSON.stringify(userData));
      
      // Set default Authorization header for axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      
      // Redirect based on user role
      if (userData.role === "member") {
        navigate("/member");
      } else if (userData.role === "trainer") {
        navigate("/trainer");
      } else if (userData.role === "admin") {
        navigate("/admin");
      }
      
      toast.success("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // User verification function (for admin)
  const verifyUser = async (userId: number) => {
    try {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.success("User verified successfully (Mock Mode)");
        return Promise.resolve();
      }
      
      if (!user?.token) {
        throw new Error("No auth token available");
      }
      
      await api.verifyUser(user.token, userId);
      toast.success("User verified successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed: " + (error as Error).message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    if (!USE_MOCK_DATA && user?.token) {
      // Call API to invalidate token
      api.logout(user.token).catch(err => {
        console.error("Logout API error:", err);
      });
    }
    
    // Clear axios Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    localStorage.removeItem("gym_user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Route guard hook
export const useRequireAuth = (allowedRoles?: UserRole[]) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (!isLoading && user) {
      // Check if user is verified
      if (!user.isVerified) {
        navigate("/login");
        toast.error("Your account is pending verification. Please contact admin.");
        return;
      }

      // Check if user has the required role
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to the user's default page based on role
        const homePath = `/${user.role}`;
        navigate(homePath);
        toast.error("You don't have permission to access this page");
      }
    }
  }, [user, isLoading, navigate, allowedRoles]);
  
  return { user, isLoading };
};
