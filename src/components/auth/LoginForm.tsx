
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";

// Form schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (isLoading) return; // Prevent multiple submits
    
    setIsLoading(true);
    
    try {
      await login(values.email, values.password);
      toast.success("Login successful!");
    } catch (error) {
      // Error handling is done in the login function
      console.error("Login submission error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Quick login buttons for demo
  const handleQuickLogin = (role: string) => {
    if (isLoading) return; // Prevent actions while loading
    
    let email = "";
    let password = "password";
    
    switch (role) {
      case "member":
        email = "member@example.com";
        break;
      case "trainer":
        email = "trainer@example.com";
        break;
      case "admin":
        email = "admin@example.com";
        break;
      default:
        return;
    }
    
    form.setValue("email", email);
    form.setValue("password", password);
    
    toast.info(`Using demo ${role} account: ${email}`);
    
    // Submit the form after a short delay to let the user see the values
    setTimeout(() => {
      form.handleSubmit(onSubmit)();
    }, 500);
  };
  
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("Password reset feature coming soon!");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to access your account
        </p>
      </div>
      
      <Alert className="bg-blue-50 text-blue-800 border-blue-100">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          New accounts require admin verification before access.
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
                  <Input placeholder="your@email.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">Remember me</FormLabel>
                </div>
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
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          type="button"
          className="text-xs"
          onClick={() => handleQuickLogin("member")}
          disabled={isLoading}
        >
          Member Demo
        </Button>
        <Button
          variant="outline"
          type="button"
          className="text-xs"
          onClick={() => handleQuickLogin("trainer")}
          disabled={isLoading}
        >
          Trainer Demo
        </Button>
        <Button
          variant="outline"
          type="button"
          className="text-xs"
          onClick={() => handleQuickLogin("admin")}
          disabled={isLoading}
        >
          Admin Demo
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
