
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

const Index = () => {
  const navigate = useNavigate();
  const [showLearnMoreDialog, setShowLearnMoreDialog] = React.useState(false);
  
  const handleLearnMore = () => {
    setShowLearnMoreDialog(true);
  };
  
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
            onClick={handleLearnMore}
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
      
      {/* Learn More Dialog */}
      <Dialog open={showLearnMoreDialog} onOpenChange={setShowLearnMoreDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>About GymPro</DialogTitle>
            <DialogDescription>
              Our comprehensive gym management solution
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <h4 className="text-lg font-semibold">Key Features</h4>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">🏋️ For Members:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Easy class and session booking</li>
                <li>Track your workout progress</li>
                <li>Manage your membership details</li>
                <li>View trainer availability</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">👨‍🏫 For Trainers:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Schedule and manage client sessions</li>
                <li>Track client attendance and progress</li>
                <li>Create customized workout plans</li>
                <li>View and update your availability</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">👩‍💼 For Administrators:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Complete member and trainer management</li>
                <li>Comprehensive reporting tools</li>
                <li>Facility and equipment tracking</li>
                <li>User verification and permissions control</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="flex space-x-2 justify-between">
            <Button variant="outline" onClick={() => setShowLearnMoreDialog(false)}>Close</Button>
            <Button onClick={() => {
              setShowLearnMoreDialog(false);
              navigate("/register");
              toast.success("Let's get you registered!");
            }}>Register Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
