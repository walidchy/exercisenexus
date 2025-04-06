
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import axios from "axios";

/**
 * ApiTester component allows users to test API endpoints directly from the frontend
 * It supports GET, POST, PUT, PATCH, and DELETE HTTP methods
 */
const ApiTester = () => {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/user");
  const [requestBody, setRequestBody] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Handles the API test request based on user inputs
   */
  const handleTest = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      // Prepare headers with authorization if token is provided
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      // Prepare request URL
      const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      
      // Parse JSON body if provided for non-GET requests
      let parsedBody = undefined;
      if (method !== 'GET' && requestBody) {
        try {
          parsedBody = JSON.parse(requestBody);
        } catch (e) {
          setError("Invalid JSON in request body");
          setLoading(false);
          return;
        }
      }

      // Make the API request using axios
      const response = await axios({
        method: method.toLowerCase(),
        url,
        headers,
        data: parsedBody,
      });

      // Set the response data
      setResponse({
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
      });
    } catch (error) {
      console.error("API Test Error:", error);
      
      if (axios.isAxiosError(error)) {
        setError(
          `Error: ${error.response?.status || ''} ${error.response?.statusText || ''}\n` +
          `${JSON.stringify(error.response?.data || error.message, null, 2)}`
        );
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format JSON for display
   */
  const formatJson = (data) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Endpoint Testing</CardTitle>
          <CardDescription>
            Test your API endpoints with different HTTP methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Method</label>
              <Select 
                value={method}
                onValueChange={setMethod}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-3">
              <label className="text-sm font-medium">Endpoint</label>
              <div className="flex">
                <div className="bg-muted text-muted-foreground px-3 py-2 text-sm border rounded-l-md border-r-0">
                  {API_BASE_URL}
                </div>
                <Input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="/user"
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Authentication Token (optional)</label>
            <Input
              type="text"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder="Bearer token"
            />
          </div>
          
          {method !== "GET" && (
            <div>
              <label className="text-sm font-medium">Request Body (JSON)</label>
              <Textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder='{"key": "value"}'
                className="font-mono text-sm h-32"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleTest} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Endpoint"
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            <pre className="whitespace-pre-wrap font-mono text-xs overflow-auto">
              {error}
            </pre>
          </AlertDescription>
        </Alert>
      )}
      
      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>
              Status: {response.status} {response.statusText}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 font-mono text-xs">
              {formatJson(response.data)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiTester;
