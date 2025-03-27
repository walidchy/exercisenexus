
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6 inline-block"
        >
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Gym<span className="font-bold">Pro</span>
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Modern Gym Management System
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          Streamlined booking, member management, and trainer scheduling
          in one beautiful interface
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate("/login")}
            size="lg"
            className="px-8"
          >
            Sign in
          </Button>
          
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            size="lg"
            className="px-8"
          >
            Learn more
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-16 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Feature cards */}
        {[
          {
            title: "For Members",
            description: "Book classes, track progress, and manage your membership",
            delay: 0.8,
          },
          {
            title: "For Trainers",
            description: "Schedule sessions, manage clients, and monitor attendance",
            delay: 0.9,
          },
          {
            title: "For Administrators",
            description: "Oversee operations, analyze data, and optimize performance",
            delay: 1.0,
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: feature.delay, duration: 0.4 }}
            className="glass rounded-xl p-6 border border-border shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Index;
