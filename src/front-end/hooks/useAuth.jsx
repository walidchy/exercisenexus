
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../services/api";

// Create context with default values
const AuthContext = createContext({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  verifyUser: async () => {},
  rejectUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for existing user session
        const savedUser = localStorage.getItem("gym_user");
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          
          // Validate token by fetching current user
          try {
            const userData = await api.getCurrentUser();
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

  // Login function
  const login = async (email, password) => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return Promise.reject(new Error("Email and password are required"));
    }
    
    setIsLoading(true);
    
    try {
      // Call the API service
      const response = await api.login(email, password);
      
      // Check if user is verified
      if (!response.user.is_verified) {
        toast.error("Your account is pending verification. Please contact admin.");
        setIsLoading(false);
        return;
      }
      
      const userData = {
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
      const errorMessage = error.message || "Login failed";
      toast.error(`Login failed: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // User verification function (for admin)
  const verifyUser = async (userId) => {
    try {
      await api.verifyUser(userId);
      toast.success("User verified successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed: " + error.message);
      throw error;
    }
  };

  // User rejection function (for admin)
  const rejectUser = async (userId) => {
    try {
      await api.rejectUser(userId);
      toast.success("User rejected successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error("Rejection failed: " + error.message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Call API to invalidate token
    api.logout().catch(err => {
      console.error("Logout API error:", err);
    });
    
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

export const useAuth = () => useContext(AuthContext);

// Route guard hook
export const useRequireAuth = (allowedRoles) => {
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
