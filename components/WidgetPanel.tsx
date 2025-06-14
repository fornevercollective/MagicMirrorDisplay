import React, { useState } from 'react';
import { ClockWidget } from './widgets/ClockWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { CalendarWidget } from './widgets/CalendarWidget';
import { NewsWidget } from './widgets/NewsWidget';
import { SystemInfoWidget } from './widgets/SystemInfoWidget';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WidgetPanelProps {
  displayType: 'mirror' | 'touchscreen' | 'vr' | 'xr' | 'oled';
  isFullscreen: boolean;
}

export const WidgetPanel: React.FC<WidgetPanelProps> = ({ displayType, isFullscreen }) => {
  const [collapsed, setCollapsed] = useState(false);

  const getRowStyle = (rowIndex: number) => {
    // E-ink friendly light styling for all display types
    return "flex gap-4 p-4 bg-white border-b border-gray-200";
  };

  const rowHeight = isFullscreen ? "h-1/3" : "min-h-[33vh]";

  if (collapsed) {
    return (
      <div className="w-12 flex flex-col items-center justify-center bg-gray-100 border-r border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(false)}
          className="rotate-180 mb-4 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(true)}
        className="absolute top-4 right-2 z-10 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Row 1: Clock & Weather */}
      <div className={`${rowHeight} ${getRowStyle(0)}`}>
        <div className="flex-1">
          <ClockWidget displayType={displayType} size="medium" />
        </div>
        <div className="flex-1">
          <WeatherWidget displayType={displayType} size="medium" />
        </div>
      </div>

      {/* Row 2: Calendar & News */}
      <div className={`${rowHeight} ${getRowStyle(1)}`}>
        <div className="flex-1">
          <CalendarWidget displayType={displayType} size="large" />
        </div>
        <div className="flex-1">
          <NewsWidget displayType={displayType} size="large" />
        </div>
      </div>

      {/* Row 3: System Info (Full Width) */}
      <div className={`${rowHeight} ${getRowStyle(2)}`}>
        <div className="w-full">
          <SystemInfoWidget displayType={displayType} size="large" />
        </div>
      </div>
    </div>
  );
};