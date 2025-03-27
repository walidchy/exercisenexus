
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedLayout from "@/components/ui/AnimatedLayout";

export default function MembershipPlans() {
  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Membership Plans</h1>
          <p className="mt-2 text-muted-foreground">
            Choose the perfect membership plan to reach your fitness goals
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Basic Plan */}
          <Card className="flex flex-col border-border">
            <CardHeader className="pb-4">
              <CardTitle>Basic</CardTitle>
              <CardDescription>
                Perfect for beginners and casual gym-goers
              </CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">$29.99</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="space-y-3">
                {[
                  "Gym access (6am-10pm)",
                  "Basic equipment usage",
                  "Locker access",
                  "2 group classes per month",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Subscribe</Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="flex flex-col relative border-primary bg-primary/5">
            <div className="absolute -top-3 right-0 left-0 mx-auto w-fit px-3 py-1 text-xs font-medium bg-primary text-white rounded-full">
              Most Popular
            </div>
            <CardHeader className="pb-4">
              <CardTitle>Premium</CardTitle>
              <CardDescription>
                Our most popular plan for serious fitness enthusiasts
              </CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">$59.99</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="space-y-3">
                {[
                  "24/7 gym access",
                  "Full equipment usage",
                  "Locker access",
                  "Unlimited group classes",
                  "Basic fitness assessment",
                  "Access to sauna & pool",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Subscribe</Button>
            </CardFooter>
          </Card>

          {/* Elite Plan */}
          <Card className="flex flex-col border-border">
            <CardHeader className="pb-4">
              <CardTitle>Elite</CardTitle>
              <CardDescription>
                The ultimate fitness experience with premium perks
              </CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">$99.99</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="space-y-3">
                {[
                  "24/7 gym access",
                  "Full equipment usage",
                  "Premium locker access",
                  "Unlimited group classes",
                  "Comprehensive fitness assessment",
                  "Personal training session (2x/month)",
                  "1 free guest per visit",
                  "Access to sauna, pool & spa",
                  "Nutrition consultation",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Subscribe</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Can I cancel my membership anytime?</AccordionTrigger>
              <AccordionContent>
                Yes, you can cancel your subscription at any time without any cancellation fees. 
                Your membership will remain active until the end of your current billing period.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I upgrade or downgrade my plan?</AccordionTrigger>
              <AccordionContent>
                You can change your membership plan at any time from your account dashboard. 
                Changes will take effect in the next billing cycle.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Are there any long-term contracts?</AccordionTrigger>
              <AccordionContent>
                No, all our memberships are month-to-month with no long-term contracts or 
                commitments required.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {/* Help Box */}
        <div className="mt-8 bg-muted p-6 rounded-lg">
          <div className="flex gap-4 items-start">
            <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium mb-2">Need help choosing a plan?</h3>
              <p className="text-muted-foreground mb-4">
                Our fitness experts are here to help you select the best membership plan for your goals.
                Schedule a free consultation with our team.
              </p>
              <Button variant="outline">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
