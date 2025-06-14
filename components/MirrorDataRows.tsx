import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  Heart, 
  Zap, 
  Droplets, 
  Sun, 
  Moon, 
  Thermometer,
  Activity,
  Eye,
  Sparkles,
  Timer
} from 'lucide-react';

interface MirrorDataRowsProps {
  mirrorMode: 'normal' | 'makeup' | 'hair' | 'skincare';
  faceDetectionEnabled: boolean;
  faces: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    landmarks?: {
      eyes: { left: { x: number; y: number }, right: { x: number; y: number } };
      nose: { x: number; y: number };
      mouth: { x: number; y: number };
    };
  }>;
  onFaceDetectionToggle?: (enabled: boolean) => void;
}

export const MirrorDataRows: React.FC<MirrorDataRowsProps> = ({ 
  mirrorMode, 
  faceDetectionEnabled, 
  faces,
  onFaceDetectionToggle 
}) => {
  const renderRow1 = () => {
    const getCurrentTime = () => {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getDate = () => {
      const now = new Date();
      return now.toLocaleDateString([], { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const getTemperature = () => {
      // Mock temperature data
      return Math.round(20 + Math.random() * 10);
    };

    const getHumidity = () => {
      // Mock humidity data
      return Math.round(40 + Math.random() * 30);
    };

    return (
      <div className="flex gap-4 p-4">
        {/* Time & Date */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <Timer className="h-5 w-5 text-blue-600" />
          <div>
            <div className="text-sm text-gray-600">Time</div>
            <div className="text-lg text-gray-900">{getCurrentTime()}</div>
            <div className="text-xs text-gray-500">{getDate()}</div>
          </div>
        </div>

        {/* Environment */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <Thermometer className="h-5 w-5 text-orange-600" />
          <div>
            <div className="text-sm text-gray-600">Environment</div>
            <div className="text-lg text-gray-900">{getTemperature()}°C</div>
            <div className="text-xs text-gray-500">{getHumidity()}% Humidity</div>
          </div>
        </div>

        {/* Lighting */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <Sun className="h-5 w-5 text-yellow-600" />
          <div>
            <div className="text-sm text-gray-600">Lighting</div>
            <div className="text-lg text-gray-900">Natural</div>
            <div className="text-xs text-gray-500">Optimal</div>
          </div>
        </div>

        {/* Face Detection - Now Clickable */}
        <div 
          className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg transition-all duration-200 ${
            onFaceDetectionToggle 
              ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer active:scale-95 hover:border-gray-300' 
              : 'bg-gray-50'
          }`}
          onClick={() => onFaceDetectionToggle && onFaceDetectionToggle(!faceDetectionEnabled)}
          role={onFaceDetectionToggle ? "button" : undefined}
          tabIndex={onFaceDetectionToggle ? 0 : undefined}
          onKeyDown={(e) => {
            if (onFaceDetectionToggle && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onFaceDetectionToggle(!faceDetectionEnabled);
            }
          }}
        >
          <Eye className={`h-5 w-5 transition-colors duration-200 ${
            faceDetectionEnabled && faces.length > 0 ? 'text-cyan-600' : 'text-gray-400'
          }`} />
          <div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              Face Detection
              {onFaceDetectionToggle && (
                <span className="text-xs text-gray-400">(click to toggle)</span>
              )}
            </div>
            <Badge 
              variant={faceDetectionEnabled && faces.length > 0 ? "default" : "secondary"} 
              className={`text-xs transition-all duration-200 ${
                faceDetectionEnabled && faces.length > 0 
                  ? "bg-cyan-100 text-cyan-800 border-cyan-200" 
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {faceDetectionEnabled 
                ? (faces.length > 0 ? `Active (${faces.length})` : "Enabled") 
                : "Disabled"
              }
            </Badge>
            {faceDetectionEnabled && faces.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Confidence: {Math.round(faces[0].confidence * 100)}%
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRow2 = () => {
    const getModeData = () => {
      switch (mirrorMode) {
        case 'makeup':
          return {
            title: 'Makeup Analysis',
            metrics: [
              { label: 'Foundation Match', value: 85, color: 'bg-pink-500' },
              { label: 'Color Harmony', value: 92, color: 'bg-purple-500' },
              { label: 'Skin Prep', value: 78, color: 'bg-orange-500' },
            ]
          };
        case 'hair':
          return {
            title: 'Hair Analysis',
            metrics: [
              { label: 'Hair Health', value: 88, color: 'bg-blue-500' },
              { label: 'Style Match', value: 75, color: 'bg-indigo-500' },
              { label: 'Color Vibrancy', value: 82, color: 'bg-teal-500' },
            ]
          };
        case 'skincare':
          return {
            title: 'Skin Analysis',
            metrics: [
              { label: 'Hydration', value: 72, color: 'bg-blue-400' },
              { label: 'Clarity', value: 85, color: 'bg-green-500' },
              { label: 'Texture', value: 90, color: 'bg-emerald-500' },
            ]
          };
        default:
          return {
            title: 'General Analysis',
            metrics: [
              { label: 'Image Quality', value: 95, color: 'bg-gray-500' },
              { label: 'Lighting', value: 88, color: 'bg-yellow-500' },
              { label: 'Focus', value: 92, color: 'bg-blue-500' },
            ]
          };
      }
    };

    const modeData = getModeData();

    return (
      <div className="flex gap-4 p-4 pt-0">
        {/* Mode Analysis */}
        <div className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-600">{modeData.title}</span>
          </div>
          <div className="space-y-2">
            {modeData.metrics.map((metric, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 min-w-20">{metric.label}</span>
                <div className="flex-1">
                  <Progress 
                    value={metric.value} 
                    className="h-2"
                  />
                </div>
                <span className="text-xs text-gray-600 min-w-8">{metric.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <Heart className="h-5 w-5 text-red-500" />
          <div>
            <div className="text-sm text-gray-600">System Health</div>
            <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
              Excellent
            </Badge>
            <div className="text-xs text-gray-500 mt-1">
              CPU: 45% | RAM: 62%
            </div>
          </div>
        </div>

        {/* AI Processing */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <Zap className="h-5 w-5 text-yellow-500" />
          <div>
            <div className="text-sm text-gray-600">AI Processing</div>
            <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
              {faceDetectionEnabled ? 'Active' : 'Standby'}
            </Badge>
            <div className="text-xs text-gray-500 mt-1">
              {faceDetectionEnabled ? '10 FPS' : 'Paused'}
            </div>
          </div>
        </div>

        {/* Mood/Wellness */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <div>
            <div className="text-sm text-gray-600">Wellness</div>
            <Badge variant="default" className="text-xs bg-purple-100 text-purple-800 border-purple-200">
              Radiant
            </Badge>
            <div className="text-xs text-gray-500 mt-1">
              Energy: High
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {renderRow1()}
      {renderRow2()}
    </div>
  );
};