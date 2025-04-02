
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/front-end/services/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardContent, CardFooter } from "@/components/ui/card";

// Form schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize form
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsSubmitting(true);
    
    try {
      await api.forgotPassword(data.email);
      
      // Show success message
      setIsSuccess(true);
      toast.success("If your email exists in our system, you'll receive password reset instructions.");
    } catch (error) {
      console.error("Password reset request failed:", error);
      
      // We still show success message even if there's an error for security reasons
      // This prevents email enumeration attacks
      setIsSuccess(true);
      toast.success("If your email exists in our system, you'll receive password reset instructions.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <CardContent className="space-y-4 pt-6">
        {isSuccess ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm text-green-800">
              <p>Password reset instructions have been sent.</p>
              <p className="mt-2">Please check your email and follow the instructions to reset your password.</p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        {...field} 
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending instructions..." : "Send Reset Instructions"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center border-t p-4">
        <Button variant="default" className="text-xs" asChild>
          <Link to="/login">Return to login</Link>
        </Button>
      </CardFooter>
    </>
  );
}
