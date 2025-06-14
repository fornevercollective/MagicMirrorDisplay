import React, { useState, useEffect } from 'react';
import { ClockWidget } from './widgets/ClockWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { CalendarWidget } from './widgets/CalendarWidget';
import { NewsWidget } from './widgets/NewsWidget';
import { SystemInfoWidget } from './widgets/SystemInfoWidget';
import { GestureDetector } from './GestureDetector';

interface MagicMirrorDashboardProps {
  displayType: 'mirror' | 'touchscreen' | 'vr' | 'xr' | 'oled';
  isFullscreen: boolean;
}

interface WidgetConfig {
  id: string;
  component: React.ComponentType<any>;
  position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  size: 'small' | 'medium' | 'large';
  enabled: boolean;
}

export const MagicMirrorDashboard: React.FC<MagicMirrorDashboardProps> = ({ 
  displayType, 
  isFullscreen 
}) => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: 'clock', component: ClockWidget, position: 'top-right', size: 'medium', enabled: true },
    { id: 'weather', component: WeatherWidget, position: 'top-left', size: 'medium', enabled: true },
    { id: 'calendar', component: CalendarWidget, position: 'center-left', size: 'large', enabled: true },
    { id: 'news', component: NewsWidget, position: 'bottom-center', size: 'large', enabled: true },
    { id: 'system', component: SystemInfoWidget, position: 'bottom-right', size: 'small', enabled: true },
  ]);

  const getGridClasses = () => {
    switch (displayType) {
      case 'mirror':
        return 'grid-cols-3 grid-rows-3 gap-8 p-8';
      case 'vr':
      case 'xr':
        return 'grid-cols-4 grid-rows-4 gap-6 p-6';
      case 'oled':
        return 'grid-cols-3 grid-rows-3 gap-4 p-4';
      case 'touchscreen':
        return 'grid-cols-2 grid-rows-4 gap-4 p-4 md:grid-cols-3 md:grid-rows-3';
      default:
        return 'grid-cols-3 grid-rows-3 gap-4 p-4';
    }
  };

  const getPositionClasses = (position: string) => {
    const positions = {
      'top-left': 'col-start-1 row-start-1',
      'top-center': 'col-start-2 row-start-1',
      'top-right': 'col-start-3 row-start-1',
      'center-left': 'col-start-1 row-start-2',
      'center': 'col-start-2 row-start-2',
      'center-right': 'col-start-3 row-start-2',
      'bottom-left': 'col-start-1 row-start-3',
      'bottom-center': 'col-start-2 row-start-3',
      'bottom-right': 'col-start-3 row-start-3',
    };
    return positions[position as keyof typeof positions] || '';
  };

  const getSizeClasses = (size: string) => {
    const sizes = {
      'small': 'max-w-xs',
      'medium': 'max-w-sm',
      'large': 'max-w-lg',
    };
    return sizes[size as keyof typeof sizes] || '';
  };

  return (
    <>
      {/* Gesture Detection for VR/XR */}
      {(displayType === 'vr' || displayType === 'xr') && (
        <GestureDetector displayType={displayType} />
      )}

      <div className={`min-h-screen grid ${getGridClasses()}`}>
        {widgets
          .filter(widget => widget.enabled)
          .map(widget => {
            const WidgetComponent = widget.component;
            return (
              <div
                key={widget.id}
                className={`
                  ${getPositionClasses(widget.position)}
                  ${getSizeClasses(widget.size)}
                  flex items-center justify-center
                  ${displayType === 'mirror' ? 'text-white' : ''}
                  ${displayType === 'oled' ? 'rounded-lg bg-card/50 backdrop-blur-sm' : ''}
                  ${displayType === 'vr' || displayType === 'xr' ? 'rounded-xl bg-white/10 backdrop-blur-md border border-white/20' : ''}
                  transition-all duration-300 hover:scale-105
                `}
              >
                <WidgetComponent 
                  displayType={displayType}
                  size={widget.size}
                />
              </div>
            );
          })}
      </div>
    </>
  );
};