// Dynamic Color Demo - Test all API color responses
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { colorApiService } from '../../services/colorApiService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Palette,
  Sparkles,
  RefreshCw,
  Building,
  User,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
  TestTube,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

export const DynamicColorDemo: React.FC = () => {
  const { currentTheme, isDarkMode, applyTheme, availableThemes } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Test all API endpoints
  const runColorApiTests = async () => {
    setIsLoading(true);
    const results: Record<string, any> = {};
    const status: Record<string, boolean> = {};

    try {
      // Test 1: Fetch all color themes
      toast.info('Testing color themes API...');
      const themesResponse = await colorApiService.fetchColorThemes();
      results.themes = themesResponse;
      status.themes = themesResponse.success;

      // Test 2: Organization colors
      toast.info('Testing organization colors...');
      const orgResponse = await colorApiService.fetchOrganizationColors('edu-123');
      results.organization = orgResponse;
      status.organization = orgResponse.success;

      // Test 3: User preferences
      toast.info('Testing user preferences...');
      const userResponse = await colorApiService.fetchUserColorPreferences('user-456');
      results.user = userResponse;
      status.user = userResponse.success;

      // Test 4: Dynamic colors
      toast.info('Testing dynamic colors...');
      const dynamicResponse = await colorApiService.fetchDynamicColors();
      results.dynamic = dynamicResponse;
      status.dynamic = dynamicResponse.success;

      setTestResults(results);
      setApiStatus(status);
      
      const successCount = Object.values(status).filter(Boolean).length;
      toast.success(`API Tests Complete: ${successCount}/4 successful`);
    } catch (error) {
      toast.error('API tests failed');
      console.error('API test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply dynamic theme based on time
  const applyTimeBasedTheme = async () => {
    try {
      const response = await colorApiService.fetchDynamicColors();
      if (response.success && response.theme) {
        // This is a simplified apply - in real app this would go through ThemeContext
        toast.success(`Applied time-based theme: ${response.theme.name}`);
      }
    } catch (error) {
      toast.error('Failed to apply time-based theme');
    }
  };

  // Color palette component
  const ColorPalette: React.FC<{ colors: any; title: string }> = ({ colors, title }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(colors).slice(0, 8).map(([key, value]) => (
            <div key={key} className="text-center">
              <div 
                className="w-full h-8 rounded border mb-1"
                style={{ backgroundColor: value as string }}
                title={`${key}: ${value}`}
              />
              <p className="text-xs truncate">{key}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  useEffect(() => {
    // Run initial tests
    runColorApiTests();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
          <TestTube className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Dynamic Color API Demo</h1>
        <p className="text-muted-foreground">
          Testing real-time color fetching and application
        </p>
        {currentTheme && (
          <Badge variant="secondary">
            Current: {currentTheme.name} • {isDarkMode ? 'Dark' : 'Light'}
          </Badge>
        )}
      </motion.div>

      {/* API Status Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            API Status Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { key: 'themes', label: 'Color Themes', icon: <Palette className="w-4 h-4" /> },
              { key: 'organization', label: 'Organization', icon: <Building className="w-4 h-4" /> },
              { key: 'user', label: 'User Prefs', icon: <User className="w-4 h-4" /> },
              { key: 'dynamic', label: 'Dynamic', icon: <Clock className="w-4 h-4" /> },
            ].map((api) => (
              <div key={api.key} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                {api.icon}
                <span className="text-sm font-medium">{api.label}</span>
                {apiStatus[api.key] !== undefined && (
                  apiStatus[api.key] ? (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 ml-auto" />
                  )
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={runColorApiTests} 
              disabled={isLoading}
              className="flex-1"
              size="sm"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Testing...' : 'Run Tests'}
            </Button>
            <Button 
              onClick={applyTimeBasedTheme}
              variant="outline"
              size="sm"
            >
              <Clock className="w-4 h-4 mr-2" />
              Time Theme
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="organization">Org</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="dynamic">Dynamic</TabsTrigger>
          </TabsList>
          
          <TabsContent value="themes" className="space-y-4">
            <Alert>
              <Palette className="h-4 w-4" />
              <AlertDescription>
                {testResults.themes?.success ? 
                  `✅ Loaded ${testResults.themes?.data?.length || 0} themes` :
                  '❌ Failed to load themes'
                }
              </AlertDescription>
            </Alert>
            
            {testResults.themes?.data?.slice(0, 2).map((theme: any, index: number) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium">{theme.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPalette colors={theme.light} title="Light Mode" />
                  <ColorPalette colors={theme.dark} title="Dark Mode" />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="organization" className="space-y-4">
            <Alert>
              <Building className="h-4 w-4" />
              <AlertDescription>
                {testResults.organization?.success ? 
                  `✅ Organization theme: ${testResults.organization?.theme?.name}` :
                  '❌ Failed to load organization theme'
                }
              </AlertDescription>
            </Alert>
            
            {testResults.organization?.theme && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPalette 
                  colors={testResults.organization.theme.light} 
                  title="Organization Light" 
                />
                <ColorPalette 
                  colors={testResults.organization.theme.dark} 
                  title="Organization Dark" 
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="user" className="space-y-4">
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                {testResults.user?.success ? 
                  (testResults.user?.theme ? 
                    `✅ User theme: ${testResults.user.theme.name}` :
                    '✅ No user preferences set'
                  ) :
                  '❌ Failed to load user preferences'
                }
              </AlertDescription>
            </Alert>
            
            {testResults.user?.theme && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPalette 
                  colors={testResults.user.theme.light} 
                  title="User Light" 
                />
                <ColorPalette 
                  colors={testResults.user.theme.dark} 
                  title="User Dark" 
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="dynamic" className="space-y-4">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                {testResults.dynamic?.success ? 
                  `✅ Dynamic theme: ${testResults.dynamic?.theme?.name}` :
                  '❌ Failed to generate dynamic theme'
                }
              </AlertDescription>
            </Alert>
            
            {testResults.dynamic?.theme && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPalette 
                  colors={testResults.dynamic.theme.light} 
                  title="Dynamic Light" 
                />
                <ColorPalette 
                  colors={testResults.dynamic.theme.dark} 
                  title="Dynamic Dark" 
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Current Theme Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Current Active Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentTheme && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{currentTheme.name}</h4>
                  <p className="text-sm text-muted-foreground">{currentTheme.description}</p>
                </div>
                <Badge variant={isDarkMode ? "default" : "secondary"}>
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </Badge>
              </div>
              
              <ColorPalette 
                colors={isDarkMode ? currentTheme.dark : currentTheme.light} 
                title={`Current Theme Colors (${isDarkMode ? 'Dark' : 'Light'})`}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Theme Switcher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Quick Theme Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {availableThemes.slice(0, 6).map((theme) => (
              <Button
                key={theme.id}
                variant={currentTheme?.id === theme.id ? "default" : "outline"}
                size="sm"
                onClick={() => applyTheme(theme.id)}
                className="h-auto p-3 flex flex-col gap-2"
              >
                <div className="flex gap-1">
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: isDarkMode ? theme.dark.primary : theme.light.primary }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: isDarkMode ? theme.dark.secondary : theme.light.secondary }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: isDarkMode ? theme.dark.accent : theme.light.accent }}
                  />
                </div>
                <span className="text-xs">{theme.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Footer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl"
      >
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          🎨 Dynamic color API system active! All colors are fetched from mock APIs in real-time.
        </p>
      </motion.div>
    </div>
  );
};