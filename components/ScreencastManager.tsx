import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  X, 
  Cast, 
  Monitor, 
  Smartphone, 
  Laptop, 
  Tv,
  Play,
  Pause,
  Square,
  Volume2,
  Settings
} from 'lucide-react';

interface ScreencastManagerProps {
  onClose: () => void;
  displayType: string;
}

interface CastDevice {
  id: string;
  name: string;
  type: 'chromecast' | 'airplay' | 'miracast' | 'webrtc';
  status: 'available' | 'casting' | 'busy';
  icon: React.ReactNode;
}

export const ScreencastManager: React.FC<ScreencastManagerProps> = ({ onClose, displayType }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [castDevices, setCastDevices] = useState<CastDevice[]>([
    { id: '1', name: 'Living Room TV', type: 'chromecast', status: 'available', icon: <Tv className="h-4 w-4" /> },
    { id: '2', name: 'Kitchen Display', type: 'miracast', status: 'available', icon: <Monitor className="h-4 w-4" /> },
    { id: '3', name: 'iPad Pro', type: 'airplay', status: 'busy', icon: <Smartphone className="h-4 w-4" /> },
  ]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [streamQuality, setStreamQuality] = useState('1080p');
  const videoRef = useRef<HTMLVideoElement>(null);

  const scanForDevices = async () => {
    setIsScanning(true);
    
    // Simulate scanning
    setTimeout(() => {
      setCastDevices(prev => [
        ...prev,
        { id: '4', name: 'Bedroom Mirror', type: 'webrtc', status: 'available', icon: <Monitor className="h-4 w-4" /> }
      ]);
      setIsScanning(false);
    }, 2000);
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCasting(true);
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const stopScreenShare = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCasting(false);
  };

  const castToDevice = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setCastDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'casting' }
          : device
      )
    );
    startScreenShare();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Cast className="h-5 w-5" />
            <CardTitle>Screencast Manager</CardTitle>
            {isCasting && <Badge>Live</Badge>}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="devices" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="devices">Cast Devices</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="devices" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3>Available Devices</h3>
                <Button 
                  variant="outline" 
                  onClick={scanForDevices}
                  disabled={isScanning}
                >
                  {isScanning ? 'Scanning...' : 'Scan for Devices'}
                </Button>
              </div>

              <div className="grid gap-4">
                {castDevices.map((device) => (
                  <div 
                    key={device.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {device.icon}
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{device.name}</span>
                          <Badge 
                            variant={device.status === 'available' ? 'outline' : 
                                   device.status === 'casting' ? 'default' : 'secondary'}
                          >
                            {device.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">
                          {device.type} Device
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {device.status === 'available' && (
                        <Button
                          size="sm"
                          onClick={() => castToDevice(device.id)}
                        >
                          Cast
                        </Button>
                      )}
                      {device.status === 'casting' && device.id === selectedDevice && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={stopScreenShare}
                        >
                          Stop
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {castDevices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No devices found. Click "Scan for Devices" to search.
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-contain"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'/%3E%3C/svg%3E"
                />
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={isCasting ? stopScreenShare : startScreenShare}
                  className="flex items-center gap-2"
                >
                  {isCasting ? (
                    <>
                      <Square className="h-4 w-4" />
                      Stop Casting
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start Screen Share
                    </>
                  )}
                </Button>
              </div>

              {isCasting && (
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Live streaming to {castDevices.find(d => d.id === selectedDevice)?.name}</span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Stream Quality</label>
                  <select 
                    value={streamQuality}
                    onChange={(e) => setStreamQuality(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="480p">480p (Standard)</option>
                    <option value="720p">720p (HD)</option>
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="4k">4K (Ultra HD)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label>Audio Enabled</label>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>

                <div className="flex items-center justify-between">
                  <label>Low Latency Mode</label>
                  <input type="checkbox" className="toggle" />
                </div>

                <div className="flex items-center justify-between">
                  <label>Auto-reconnect</label>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};