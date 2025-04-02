
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import ApiTester from "@/front-end/components/utils/ApiTester";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE_URL, USE_MOCK_DATA } from "@/back-end/config/api";

const ApiTest = () => {
  return (
    <AnimatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Tester</h1>
            <p className="text-muted-foreground">
              Test your Laravel API connection and endpoints
            </p>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>
              Current configuration for your Laravel backend connection
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
                  <p className="text-sm font-medium">Using Mock Data:</p>
                  <div className={`text-sm font-mono p-2 rounded ${USE_MOCK_DATA ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                    {USE_MOCK_DATA ? "Yes - Using mock data" : "No - Connected to real API"}
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>To connect to your Laravel backend:</strong> Update the <code className="bg-muted px-1 rounded">USE_MOCK_DATA</code> value in <code className="bg-muted px-1 rounded">src/config/api.ts</code> to <code className="bg-muted px-1 rounded">false</code> and ensure your Laravel API is properly configured.
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
