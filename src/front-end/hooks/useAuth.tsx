
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../services/api";
import axios from "axios";
import { API_BASE_URL } from "../../back-end/config/api";

// Define user types based on roles
type UserRole = "member" | "trainer" | "admin";

/**
 * User interface defining the structure of user data
 */
interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  token?: string;
}

/**
 * AuthContext interface defines all methods and properties available through the context
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyUser: (userId: number) => Promise<void>;
  rejectUser: (userId: number) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  verifyUser: async () => {},
  rejectUser: async () => {},
});

// Flag to use mock data when backend is not available
const USE_MOCK_DATA = true; // Set to false when your backend is ready

/**
 * Mock users for development purposes
 * This allows testing without a backend
 */
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
  },
  "user@gmail.com": {
    id: 4,
    name: "Google User",
    email: "user@gmail.com",
    role: "member" as UserRole,
    isVerified: true,
    token: "mock-token-google"
  }
};

/**
 * AuthProvider component provides authentication context to the application
 * It handles user authentication, session management, and redirects
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  /**
   * Check for existing session on mount
   * This loads the user from localStorage if available
   */
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
              setUser(null);
            }
          }
        } else {
          // No saved user, ensure user is null
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("gym_user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  /**
   * Login function authenticates a user and stores their session
   * @param email User's email address
   * @param password User's password
   */
  const login = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return Promise.reject(new Error("Email and password are required"));
    }
    
    setIsLoading(true);
    
    try {
      if (USE_MOCK_DATA) {
        // Mock login for development without backend
        const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS];
        
        if (mockUser) {
          // For mock data, accept any password - this is only for development
          // In a real app, we would properly validate credentials
          
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
          throw new Error("User not found");
        }
      }
      
      // Call the API service
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
      const errorMessage = (error as Error).message || "Login failed";
      toast.error(`Login failed: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * User verification function (for admin)
   * Approves a pending user registration
   * @param userId ID of the user to verify
   */
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

  /**
   * User rejection function (for admin)
   * Rejects a pending user registration
   * @param userId ID of the user to reject
   */
  const rejectUser = async (userId: number) => {
    try {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.success("User rejected successfully (Mock Mode)");
        return Promise.resolve();
      }
      
      if (!user?.token) {
        throw new Error("No auth token available");
      }
      
      await api.rejectUser(user.token, userId);
      toast.success("User rejected successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error("Rejection failed: " + (error as Error).message);
      throw error;
    }
  };

  /**
   * Logout function
   * Clears the user session and redirects to login
   */
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
    <AuthContext.Provider value={{ user, isLoading, login, logout, verifyUser, rejectUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth hook provides access to the auth context
 * @returns Auth context values and methods
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Route guard hook to protect routes based on user role
 * @param allowedRoles Optional array of roles that can access the route
 * @returns User and loading state
 */
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
