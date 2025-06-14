import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Cpu, MemoryStick, HardDrive, Wifi, Battery } from 'lucide-react';

interface SystemInfoWidgetProps {
  displayType: string;
  size: 'small' | 'medium' | 'large';
}

interface SystemInfo {
  cpu: number;
  memory: number;
  storage: number;
  network: 'connected' | 'disconnected' | 'limited';
  uptime: number;
  temperature: number;
  battery?: number;
}

export const SystemInfoWidget: React.FC<SystemInfoWidgetProps> = ({ displayType, size }) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    cpu: 25,
    memory: 68,
    storage: 45,
    network: 'connected',
    uptime: 86400000, // 1 day in milliseconds
    temperature: 42,
    battery: 85 // Optional for devices with battery
  });

  useEffect(() => {
    const updateSystemInfo = () => {
      // Simulate real-time system data
      setSystemInfo(prev => ({
        ...prev,
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        temperature: Math.max(30, Math.min(80, prev.temperature + (Math.random() - 0.5) * 3)),
        uptime: prev.uptime + 5000
      }));
    };

    const interval = setInterval(updateSystemInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h`;
  };

  const getStatusColor = (value: number, threshold: { warning: number; critical: number }) => {
    if (value >= threshold.critical) return 'text-red-500';
    if (value >= threshold.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  const ProgressBar = ({ value, className = "" }: { value: number; className?: string }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all duration-300 ${className}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );

  const content = (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Cpu className="h-4 w-4" />
        <span className="text-sm opacity-80">System Status</span>
      </div>

      <div className="space-y-2">
        {/* CPU Usage */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            CPU
          </span>
          <span className={getStatusColor(systemInfo.cpu, { warning: 70, critical: 90 })}>
            {Math.round(systemInfo.cpu)}%
          </span>
        </div>
        {size !== 'small' && (
          <ProgressBar 
            value={systemInfo.cpu} 
            className={systemInfo.cpu > 90 ? 'bg-red-500' : systemInfo.cpu > 70 ? 'bg-yellow-500' : 'bg-green-500'}
          />
        )}

        {/* Memory Usage */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1">
            <MemoryStick className="h-3 w-3" />
            RAM
          </span>
          <span className={getStatusColor(systemInfo.memory, { warning: 80, critical: 95 })}>
            {Math.round(systemInfo.memory)}%
          </span>
        </div>
        {size !== 'small' && (
          <ProgressBar 
            value={systemInfo.memory} 
            className={systemInfo.memory > 95 ? 'bg-red-500' : systemInfo.memory > 80 ? 'bg-yellow-500' : 'bg-blue-500'}
          />
        )}

        {/* Storage */}
        {size === 'large' && (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                Storage
              </span>
              <span>{Math.round(systemInfo.storage)}%</span>
            </div>
            <ProgressBar 
              value={systemInfo.storage} 
              className="bg-purple-500" 
            />
          </>
        )}

        {/* Network Status */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            Network
          </span>
          <span className={
            systemInfo.network === 'connected' ? 'text-green-500' :
            systemInfo.network === 'limited' ? 'text-yellow-500' : 'text-red-500'
          }>
            {systemInfo.network}
          </span>
        </div>

        {/* Battery (if available) */}
        {systemInfo.battery && (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Battery className="h-3 w-3" />
              Battery
            </span>
            <span className={getStatusColor(100 - systemInfo.battery, { warning: 80, critical: 95 })}>
              {systemInfo.battery}%
            </span>
          </div>
        )}

        {/* Additional info for larger sizes */}
        {size === 'large' && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="opacity-60">Uptime:</span>
                <div>{formatUptime(systemInfo.uptime)}</div>
              </div>
              <div>
                <span className="opacity-60">Temp:</span>
                <div className={getStatusColor(systemInfo.temperature, { warning: 60, critical: 75 })}>
                  {Math.round(systemInfo.temperature)}°C
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (displayType === 'mirror') {
    return <div className="text-white">{content}</div>;
  }

  return (
    <Card className="w-full h-full bg-transparent border-0">
      <CardContent className="p-4">
        {content}
      </CardContent>
    </Card>
  );
};