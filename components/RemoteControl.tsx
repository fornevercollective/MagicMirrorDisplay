import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  X, 
  Power, 
  Volume2, 
  Sun, 
  Palette,
  Layout,
  Wifi,
  Settings,
  Smartphone,
  Monitor
} from 'lucide-react';

interface RemoteControlProps {
  onClose: () => void;
  displayType: string;
}

export const RemoteControl: React.FC<RemoteControlProps> = ({ onClose, displayType }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [brightness, setBrightness] = useState([75]);
  const [volume, setVolume] = useState([50]);
  const [powerState, setPowerState] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);

  useEffect(() => {
    // Simulate WebSocket connection
    const connectToMagicMirror = () => {
      setTimeout(() => {
        setIsConnected(true);
        setConnectedDevices(['Magic Mirror - Living Room', 'Touch Display - Kitchen']);
      }, 1000);
    };

    connectToMagicMirror();
  }, []);

  const handlePowerToggle = () => {
    setPowerState(!powerState);
    // In real implementation, this would send power command to the display
  };

  const handleBrightnessChange = (value: number[]) => {
    setBrightness(value);
    // In real implementation, this would adjust display brightness
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    // In real implementation, this would adjust system volume
  };

  const sendCommand = (command: string) => {
    console.log(`Sending command: ${command}`);
    // In real implementation, this would send commands via WebSocket
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            <CardTitle>Magic Mirror Remote Control</CardTitle>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Connecting..."}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="controls" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="space-y-6">
              {/* Power Control */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Power className="h-5 w-5" />
                  <Label>Display Power</Label>
                </div>
                <Switch
                  checked={powerState}
                  onCheckedChange={handlePowerToggle}
                />
              </div>

              {/* Brightness Control */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  <Label>Brightness ({brightness[0]}%)</Label>
                </div>
                <Slider
                  value={brightness}
                  onValueChange={handleBrightnessChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  <Label>Volume ({volume[0]}%)</Label>
                </div>
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => sendCommand('refresh')} variant="outline">
                  Refresh Display
                </Button>
                <Button onClick={() => sendCommand('screenshot')} variant="outline">
                  Take Screenshot
                </Button>
                <Button onClick={() => sendCommand('restart')} variant="outline">
                  Restart System
                </Button>
                <Button onClick={() => sendCommand('sleep')} variant="outline">
                  Sleep Mode
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {['Clock', 'Weather', 'Calendar', 'News', 'System Info'].map((widget) => (
                  <div key={widget} className="flex items-center justify-between p-3 border rounded-lg">
                    <span>{widget}</span>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
              
              <Button onClick={() => sendCommand('reset_layout')} className="w-full">
                Reset to Default Layout
              </Button>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4">
              <div className="space-y-2">
                <Label>Connected Displays</Label>
                {connectedDevices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <span>{device}</span>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full">
                Scan for New Devices
              </Button>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Dark Mode</Label>
                  <Switch 
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Auto Sleep</Label>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Motion Detection</Label>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Voice Control</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};