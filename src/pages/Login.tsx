
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      const redirectPath = `/${user.role}`;
      navigate(redirectPath);
    }
  }, [user, isLoading, navigate]);
  
  // If still loading or user is defined, show loading or nothing
  if (isLoading || user) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/90">
      <header className="flex items-center justify-between py-6 px-8">
        <div className="flex items-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
          >
            Gym<span className="font-bold">Pro</span>
          </motion.span>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className="text-sm text-muted-foreground">
            Need help? <a href="#" className="text-primary hover:underline">Contact support</a>
          </span>
        </motion.div>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex flex-col justify-center p-8"
          >
            <h1 className="text-4xl font-bold mb-4">
              Welcome to<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                GymPro Management
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md">
              The complete solution for gym owners, trainers, and members.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                "Role-based access control",
                "Booking management",
                "Member tracking",
                "Schedule optimization",
                "Payment processing",
                "Progress monitoring",
                "Equipment management",
                "Attendance tracking"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <div className="flex flex-col justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
      
      <footer className="py-6 px-8 text-center text-sm text-muted-foreground">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          © {new Date().getFullYear()} GymPro Management. All rights reserved.
        </motion.p>
      </footer>
    </div>
  );
};

export default Login;
