// Quick test component for Color API debugging
import React, { useState, useEffect } from 'react';
import { colorApiService } from '../../services/colorApiService';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, TestTube, Loader2 } from 'lucide-react';

export const ColorApiTest: React.FC = () => {
  const [isTestingOrg, setIsTestingOrg] = useState(false);
  const [orgResult, setOrgResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testOrganizationApi = async () => {
    setIsTestingOrg(true);
    setError(null);
    setOrgResult(null);

    try {
      console.log('🧪 Testing organization API with default-org...');
      const response = await colorApiService.fetchOrganizationColors('default-org');
      
      console.log('📋 Organization API Response:', response);
      setOrgResult(response);
      
      if (!response.success) {
        setError(response.error || 'Unknown API error');
      }
    } catch (err) {
      console.error('❌ Organization API Test Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsTestingOrg(false);
    }
  };

  // Auto-test on mount
  useEffect(() => {
    testOrganizationApi();
  }, []);

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Color API Debug Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testOrganizationApi} 
          disabled={isTestingOrg}
          className="w-full"
        >
          {isTestingOrg ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing Organization API...
            </>
          ) : (
            <>
              <TestTube className="w-4 h-4 mr-2" />
              Test Organization API (default-org)
            </>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {orgResult && (
          <Alert variant={orgResult.success ? "default" : "destructive"}>
            {orgResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={orgResult.success ? "default" : "destructive"}>
                    {orgResult.success ? 'SUCCESS' : 'FAILED'}
                  </Badge>
                  <span className="text-sm">
                    API Response at {new Date(orgResult.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {orgResult.success && orgResult.theme && (
                  <div className="mt-3">
                    <p><strong>Theme Name:</strong> {orgResult.theme.name}</p>
                    <p><strong>Theme ID:</strong> {orgResult.theme.id}</p>
                    <p><strong>Description:</strong> {orgResult.theme.description}</p>
                    
                    <div className="mt-2 flex gap-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: orgResult.theme.light?.primary }}
                        title="Primary Color (Light)"
                      />
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: orgResult.theme.light?.secondary }}
                        title="Secondary Color (Light)"
                      />
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: orgResult.theme.light?.accent }}
                        title="Accent Color (Light)"
                      />
                    </div>
                  </div>
                )}
                
                {!orgResult.success && (
                  <p className="text-red-600 mt-2">
                    <strong>Error:</strong> {orgResult.error}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground">
          <p>This test verifies that the organization color API works correctly.</p>
          <p>If you see a success message, the API is working properly.</p>
        </div>
      </CardContent>
    </Card>
  );
};