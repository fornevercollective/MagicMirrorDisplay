import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Cloud, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';

interface WeatherWidgetProps {
  displayType: string;
  size: 'small' | 'medium' | 'large';
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ displayType, size }) => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: 'partly-cloudy',
    humidity: 65,
    windSpeed: 8,
    forecast: [
      { day: 'Today', high: 24, low: 18, condition: 'sunny' },
      { day: 'Tomorrow', high: 26, low: 19, condition: 'cloudy' },
      { day: 'Wed', high: 22, low: 16, condition: 'rainy' },
    ]
  });

  const getWeatherIcon = (condition: string, className: string = "h-8 w-8") => {
    switch (condition) {
      case 'sunny':
        return <Sun className={className} />;
      case 'cloudy':
      case 'partly-cloudy':
        return <Cloud className={className} />;
      case 'rainy':
        return <CloudRain className={className} />;
      case 'snowy':
        return <Snowflake className={className} />;
      default:
        return <Sun className={className} />;
    }
  };

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-mono">{weather.temperature}°</div>
          <div className="text-sm opacity-80 capitalize">
            {weather.condition.replace('-', ' ')}
          </div>
        </div>
        {getWeatherIcon(weather.condition, displayType === 'vr' || displayType === 'xr' ? "h-12 w-12" : "h-8 w-8")}
      </div>

      {size !== 'small' && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Humidity: {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-3 w-3" />
            <span>Wind: {weather.windSpeed} km/h</span>
          </div>
        </div>
      )}

      {size === 'large' && (
        <div className="border-t pt-4">
          <div className="text-sm mb-2 opacity-80">3-Day Forecast</div>
          <div className="space-y-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="w-16">{day.day}</span>
                <div className="flex items-center gap-2">
                  {getWeatherIcon(day.condition, "h-4 w-4")}
                  <span>{day.high}°/{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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