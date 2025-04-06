
import React, { useEffect, useState } from "react";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import ApiTester from "@/front-end/components/utils/ApiTester";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/**
 * ApiTest Page Component
 * 
 * Provides an interface for testing API endpoints and displays the current API configuration
 */
const ApiTest = () => {
  const [guideContent, setGuideContent] = useState("");
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Fetch the API setup guide markdown content
  useEffect(() => {
    fetch('/src/utils/apiSetupGuide.md')
      .then(response => response.text())
      .then(text => setGuideContent(text))
      .catch(error => console.error("Error loading API setup guide:", error));
  }, []);

  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Tester</h1>
            <p className="text-muted-foreground">
              Test your API connection and endpoints
            </p>
          </div>
          
          <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileText size={16} />
                API Setup Guide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>API Setup Guide</DialogTitle>
                <DialogDescription>
                  Instructions for setting up your backend API
                </DialogDescription>
              </DialogHeader>
              <div className="markdown-content prose prose-sm max-w-none dark:prose-invert">
                <pre>{guideContent}</pre>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>
              Current configuration for your backend connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">API Base URL:</p>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{API_BASE_URL}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Using Real API:</p>
                  <div className="text-sm font-mono p-2 rounded bg-green-100 text-green-800">
                    Connected to API at {API_BASE_URL}
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>To change API URL:</strong> Update the <code className="bg-muted px-1 rounded">VITE_API_URL</code> value in your <code className="bg-muted px-1 rounded">.env</code> file or set it in environment variables.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <ApiTester />
      </div>
    </AnimatedLayout>
  );
};

export default ApiTest;
