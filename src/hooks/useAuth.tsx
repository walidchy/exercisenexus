
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define user types based on roles
type UserRole = "member" | "trainer" | "admin";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
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

// This would connect to your Laravel API in a real implementation
const mockApiLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock authentication logic
  if (password !== "password") {
    throw new Error("Invalid credentials");
  }
  
  // Return mock user based on email
  if (email.includes("member")) {
    return {
      id: 1,
      name: "John Member",
      email: "member@example.com",
      role: "member",
      isVerified: true,
    };
  } else if (email.includes("trainer")) {
    return {
      id: 2,
      name: "Sarah Trainer",
      email: "trainer@example.com",
      role: "trainer",
      isVerified: true,
    };
  } else if (email.includes("admin")) {
    return {
      id: 3,
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      isVerified: true,
    };
  }
  
  // Default to member for this demo, but set as unverified
  return {
    id: 4,
    name: "Default User",
    email: email,
    role: "member",
    isVerified: false,
  };
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
          setUser(JSON.parse(savedUser));
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
      // In a real app, this would call your Laravel API
      const user = await mockApiLogin(email, password);
      
      // Check if user is verified
      if (!user.isVerified) {
        toast.error("Your account is pending verification. Please contact admin.");
        setIsLoading(false);
        return;
      }
      
      // Save user to state and localStorage
      setUser(user);
      localStorage.setItem("gym_user", JSON.stringify(user));
      
      // Redirect based on user role
      if (user.role === "member") {
        navigate("/member");
      } else if (user.role === "trainer") {
        navigate("/trainer");
      } else if (user.role === "admin") {
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
      // In a real app, this would call your API to verify the user
      // Mock verification for demo
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
