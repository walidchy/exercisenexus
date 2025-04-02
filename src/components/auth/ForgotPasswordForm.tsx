
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react";

// Form schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (isLoading) return; // Prevent multiple submits
    
    setIsLoading(true);
    
    try {
      // In real implementation, we would call an API endpoint
      // For now, just simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Password reset instructions sent to your email");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset request error:", error);
      toast.error("Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg"
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent password reset instructions to <span className="font-medium">{form.getValues("email")}</span>
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsSubmitted(false)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Try another email
          </Button>
          
          <Button asChild variant="secondary" className="w-full">
            <Link to="/login">
              Return to login
            </Link>
          </Button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Forgot password?</h1>
        <p className="text-muted-foreground">
          Enter your email and we'll send you reset instructions
        </p>
      </div>
      
      <Alert className="bg-blue-50 text-blue-800 border-blue-100">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          For this demo, no actual email will be sent.
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your@email.com" 
                    {...field} 
                    disabled={isLoading}
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            aria-busy={isLoading ? 'true' : 'false'}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send reset instructions
              </>
            )}
          </Button>
          
          <div className="text-center mt-4">
            <Link 
              to="/login" 
              className="text-sm font-medium text-primary hover:underline inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to login
            </Link>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default ForgotPasswordForm;
