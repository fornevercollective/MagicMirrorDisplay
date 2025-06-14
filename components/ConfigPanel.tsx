import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  X, 
  Settings, 
  Monitor, 
  Palette,
  Globe,
  Clock,
  Cloud,
  Calendar,
  Newspaper,
  Cpu
} from 'lucide-react';

interface ConfigPanelProps {
  onClose: () => void;
  displayType: string;
  onDisplayTypeChange: (type: 'mirror' | 'touchscreen' | 'vr' | 'xr' | 'oled') => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ 
  onClose, 
  displayType,
  onDisplayTypeChange 
}) => {
  const [config, setConfig] = useState({
    timezone: 'America/New_York',
    units: 'metric',
    language: 'en',
    updateInterval: 300000, // 5 minutes
    weatherApiKey: '',
    newsApiKey: '',
    calendarUrl: '',
    autoSleep: true,
    motionDetection: true,
    voiceControl: false,
    theme: 'dark'
  });

  const [widgets, setWidgets] = useState([
    { id: 'clock', name: 'Clock', icon: <Clock className="h-4 w-4" />, enabled: true, position: 'top-right' },
    { id: 'weather', name: 'Weather', icon: <Cloud className="h-4 w-4" />, enabled: true, position: 'top-left' },
    { id: 'calendar', name: 'Calendar', icon: <Calendar className="h-4 w-4" />, enabled: true, position: 'center-left' },
    { id: 'news', name: 'News', icon: <Newspaper className="h-4 w-4" />, enabled: true, position: 'bottom-center' },
    { id: 'system', name: 'System Info', icon: <Cpu className="h-4 w-4" />, enabled: true, position: 'bottom-right' },
  ]);

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleWidgetToggle = (id: string, enabled: boolean) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === id ? { ...widget, enabled } : widget
      )
    );
  };

  const saveConfiguration = () => {
    // In real implementation, this would save to localStorage or send to backend
    localStorage.setItem('magicMirrorConfig', JSON.stringify({ config, widgets }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Magic Mirror Configuration</CardTitle>
            <Badge variant="outline">{displayType.toUpperCase()}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="display" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="widgets">Widgets</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="apis">APIs</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="display" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayType">Display Type</Label>
                  <Select 
                    value={displayType} 
                    onValueChange={(value: any) => onDisplayTypeChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mirror">Magic Mirror</SelectItem>
                      <SelectItem value="touchscreen">Touchscreen</SelectItem>
                      <SelectItem value="oled">OLED Display</SelectItem>
                      <SelectItem value="vr">VR Headset</SelectItem>
                      <SelectItem value="xr">XR Device</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={config.theme} 
                    onValueChange={(value) => handleConfigChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSleep">Auto Sleep</Label>
                  <Switch
                    id="autoSleep"
                    checked={config.autoSleep}
                    onCheckedChange={(checked) => handleConfigChange('autoSleep', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="motionDetection">Motion Detection</Label>
                  <Switch
                    id="motionDetection"
                    checked={config.motionDetection}
                    onCheckedChange={(checked) => handleConfigChange('motionDetection', checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="widgets" className="space-y-4">
              <div className="grid gap-4">
                {widgets.map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {widget.icon}
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{widget.name}</span>
                          <Badge variant="outline">{widget.position}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Select defaultValue={widget.position}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="top-center">Top Center</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="center-left">Center Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="center-right">Center Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="bottom-center">Bottom Center</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Switch
                        checked={widget.enabled}
                        onCheckedChange={(checked) => handleWidgetToggle(widget.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={config.timezone} 
                    onValueChange={(value) => handleConfigChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Berlin">Berlin</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="units">Units</Label>
                  <Select 
                    value={config.units} 
                    onValueChange={(value) => handleConfigChange('units', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (°C, km/h)</SelectItem>
                      <SelectItem value="imperial">Imperial (°F, mph)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={config.language} 
                    onValueChange={(value) => handleConfigChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="apis" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="weatherApiKey">Weather API Key</Label>
                  <Input
                    id="weatherApiKey"
                    type="password"
                    placeholder="Enter OpenWeatherMap API key"
                    value={config.weatherApiKey}
                    onChange={(e) => handleConfigChange('weatherApiKey', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Get your free API key from openweathermap.org
                  </p>
                </div>

                <div>
                  <Label htmlFor="newsApiKey">News API Key</Label>
                  <Input
                    id="newsApiKey"
                    type="password"
                    placeholder="Enter News API key"
                    value={config.newsApiKey}
                    onChange={(e) => handleConfigChange('newsApiKey', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Get your free API key from newsapi.org
                  </p>
                </div>

                <div>
                  <Label htmlFor="calendarUrl">Calendar URL</Label>
                  <Input
                    id="calendarUrl"
                    type="url"
                    placeholder="Enter calendar iCal URL"
                    value={config.calendarUrl}
                    onChange={(e) => handleConfigChange('calendarUrl', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Use Google Calendar, Outlook, or any iCal compatible URL
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="updateInterval">Update Interval (milliseconds)</Label>
                  <Input
                    id="updateInterval"
                    type="number"
                    min="30000"
                    max="3600000"
                    step="30000"
                    value={config.updateInterval}
                    onChange={(e) => handleConfigChange('updateInterval', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    How often to refresh data (minimum 30 seconds)
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="voiceControl">Voice Control</Label>
                  <Switch
                    id="voiceControl"
                    checked={config.voiceControl}
                    onCheckedChange={(checked) => handleConfigChange('voiceControl', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>System Information</Label>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Version:</span>
                      <span className="ml-2">2.0.0</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Node.js:</span>
                      <span className="ml-2">v18.17.0</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Platform:</span>
                      <span className="ml-2">{navigator.platform}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Screen:</span>
                      <span className="ml-2">{window.screen.width}×{window.screen.height}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveConfiguration}>
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};