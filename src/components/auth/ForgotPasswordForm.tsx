
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
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { api } from "@/services/api";

// Form schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call password reset API
      await api.forgotPassword(values.email);
      
      // Show success state
      setIsSuccess(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      console.error("Password reset error:", error);
      setError((error as Error).message || "Failed to send reset instructions. Please try again.");
      toast.error("Failed to send reset instructions");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg"
      >
        <div className="space-y-2 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent password reset instructions to your email address.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            variant="default"
            className="w-full"
            as={Link}
            to="/login"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
          
          <p className="text-sm text-center text-muted-foreground">
            Didn't receive the email?{" "}
            <button
              type="button"
              onClick={() => form.handleSubmit(onSubmit)()}
              className="font-medium text-primary hover:underline"
            >
              Click to resend
            </button>
          </p>
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
        <h1 className="text-3xl font-bold">Reset password</h1>
        <p className="text-muted-foreground">
          Enter your email and we'll send you password reset instructions
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            isLoading={isLoading}
          >
            {!isLoading && "Send reset instructions"}
          </Button>
          
          <div className="text-center">
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
