import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';

interface ClockWidgetProps {
  displayType: string;
  size: 'small' | 'medium' | 'large';
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({ displayType, size }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: displayType === 'mirror' ? '2-digit' : undefined
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTextSize = () => {
    if (displayType === 'vr' || displayType === 'xr') {
      return size === 'large' ? 'text-6xl' : size === 'medium' ? 'text-4xl' : 'text-2xl';
    }
    return size === 'large' ? 'text-4xl' : size === 'medium' ? 'text-2xl' : 'text-xl';
  };

  const content = (
    <div className="text-center">
      <div className={`font-mono ${getTextSize()} mb-2`}>
        {formatTime(time)}
      </div>
      {size !== 'small' && (
        <div className="text-sm opacity-80">
          {formatDate(time)}
        </div>
      )}
    </div>
  );

  if (displayType === 'mirror') {
    return <div className="text-white">{content}</div>;
  }

  return (
    <Card className="w-full h-full flex items-center justify-center bg-transparent border-0">
      <CardContent className="p-4">
        {content}
      </CardContent>
    </Card>
  );
};