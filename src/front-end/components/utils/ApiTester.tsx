import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { API_BASE_URL, USE_MOCK_DATA } from "@/back-end/config/api";
import axios from 'axios';
import { toast } from "sonner";

const ApiTester = () => {
  const [endpoint, setEndpoint] = useState('/login');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('{\n  "email": "email@example.com",\n  "password": "password"\n}');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState('');

  const handleTest = async () => {
    try {
      setLoading(true);
      setResponse('');
      
      const options = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        data: method !== 'GET' ? JSON.parse(requestBody) : undefined
      };
      
      const result = await axios(options);
      
      setResponse(JSON.stringify(result.data, null, 2));
      toast.success('API request successful');
    } catch (error: any) {
      console.error('API test error:', error);
      setResponse(
        JSON.stringify({
          error: error.message,
          response: error.response?.data || 'No response data',
          status: error.response?.status || 'Unknown status'
        }, null, 2)
      );
      toast.error(`API Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Laravel API Tester</span>
          <div className="flex items-center space-x-2 text-sm font-normal">
            <span>Using mock data:</span>
            <code className={USE_MOCK_DATA ? "text-yellow-500" : "text-green-500"}>
              {USE_MOCK_DATA ? "Yes" : "No"}
            </code>
          </div>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Base URL: <code className="bg-muted px-1 rounded">{API_BASE_URL}</code>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Label htmlFor="method">Method</Label>
            <select
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="endpoint">Endpoint</Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/api/endpoint"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="token">Authorization Token (optional)</Label>
          <Input
            id="token"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            placeholder="Bearer token"
          />
        </div>
        
        {method !== 'GET' && (
          <div>
            <Label htmlFor="body">Request Body (JSON)</Label>
            <textarea
              id="body"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full h-32 p-2 border rounded font-mono text-sm bg-background"
              placeholder="{}"
            />
          </div>
        )}
        
        <Button onClick={handleTest} disabled={loading} className="w-full">
          {loading ? 'Sending request...' : 'Test API Endpoint'}
        </Button>
        
        {response && (
          <div>
            <Label>Response:</Label>
            <pre className="bg-black text-green-400 p-4 rounded-md overflow-auto max-h-96 text-sm">
              {response}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTester;
