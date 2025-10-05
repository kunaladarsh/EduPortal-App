import React, { useState } from "react";
import { Switch } from "../ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { Sun, Moon, Palette } from "lucide-react";

export const SwitchThemeTest: React.FC = () => {
  const [testSwitch1, setTestSwitch1] = useState(false);
  const [testSwitch2, setTestSwitch2] = useState(true);
  const [testSwitch3, setTestSwitch3] = useState(false);
  const { isDarkMode, toggleDarkMode, currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Switch Theme Test
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Test switches with different themes and dark/light modes
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Controls */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Theme Controls</h3>
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  {isDarkMode ? (
                    <Moon className="h-4 w-4 text-primary" />
                  ) : (
                    <Sun className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-sm">Dark Mode</span>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              </div>

              {/* Theme Selector */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Color Theme</span>
                <div className="grid grid-cols-2 gap-2">
                  {availableThemes.slice(0, 6).map((theme) => (
                    <Button
                      key={theme.id}
                      variant={currentTheme === theme.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme(theme.id)}
                      className="w-full"
                    >
                      {theme.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Test Switches */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Test Switches</h3>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium">Switch 1 (Off)</span>
                  <p className="text-xs text-muted-foreground">
                    Should show switch-background color
                  </p>
                </div>
                <Switch checked={testSwitch1} onCheckedChange={setTestSwitch1} />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium">Switch 2 (On)</span>
                  <p className="text-xs text-muted-foreground">
                    Should show primary color
                  </p>
                </div>
                <Switch checked={testSwitch2} onCheckedChange={setTestSwitch2} />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium">Switch 3 (Off)</span>
                  <p className="text-xs text-muted-foreground">
                    Test unchecked state
                  </p>
                </div>
                <Switch checked={testSwitch3} onCheckedChange={setTestSwitch3} />
              </div>
            </div>

            {/* Current Theme Info */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Theme:</span>
                  <span className="font-medium">{availableThemes.find(t => t.id === currentTheme)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode:</span>
                  <span className="font-medium">{isDarkMode ? "Dark" : "Light"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Primary Color:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary border border-border"></div>
                    <span className="font-mono text-xs">var(--primary)</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Switch BG:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-switch-background border border-border"></div>
                    <span className="font-mono text-xs">var(--switch-background)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-3 bg-chart-4/5 border border-chart-4/20 rounded-lg">
              <p className="text-xs text-chart-4 font-medium mb-2">✓ Test Instructions:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>1. Toggle switches on/off - they should use primary color when on</li>
                <li>2. Change themes - switches should immediately update colors</li>
                <li>3. Toggle dark mode - switches should adapt to dark/light mode</li>
                <li>4. All switches should smoothly transition between states</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};