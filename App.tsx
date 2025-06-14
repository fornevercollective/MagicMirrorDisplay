import React, { useState, useEffect } from 'react';
import { WidgetPanel } from './components/WidgetPanel';
import { MirrorView } from './components/MirrorView';
import { RemoteControl } from './components/RemoteControl';
import { ConfigPanel } from './components/ConfigPanel';
import { ScreencastManager } from './components/ScreencastManager';
import { DisplayTypeDetector } from './components/DisplayTypeDetector';
import { Button } from './components/ui/button';
import { Settings, Cast, Smartphone, Camera, Palette } from 'lucide-react';

export default function App() {
  const [displayType, setDisplayType] = useState<'mirror' | 'touchscreen' | 'vr' | 'xr' | 'oled'>('mirror');
  const [showConfig, setShowConfig] = useState(false);
  const [showRemote, setShowRemote] = useState(false);
  const [showScreencast, setShowScreencast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mirrorMode, setMirrorMode] = useState<'normal' | 'makeup' | 'hair' | 'skincare'>('normal');
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(true);

  useEffect(() => {
    // Auto-detect display type based on device capabilities
    const detector = new DisplayTypeDetector();
    setDisplayType(detector.detectDisplayType());

    // Handle fullscreen for VR/XR displays
    if (displayType === 'vr' || displayType === 'xr') {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    }
  }, [displayType]);

  const handleKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'c':
        setShowConfig(!showConfig);
        break;
      case 'r':
        setShowRemote(!showRemote);
        break;
      case 's':
        setShowScreencast(!showScreencast);
        break;
      case 'f':
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        } else {
          document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
        break;
      case 'm':
        const modes: Array<'normal' | 'makeup' | 'hair' | 'skincare'> = ['normal', 'makeup', 'hair', 'skincare'];
        const currentIndex = modes.indexOf(mirrorMode);
        setMirrorMode(modes[(currentIndex + 1) % modes.length]);
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showConfig, showRemote, showScreencast, mirrorMode]);

  return (
    <div className="min-h-screen bg-white text-foreground transition-all duration-300">
      {/* Control Panel - Always visible with light theme */}
      {!isFullscreen && (
        <div className="fixed top-4 left-4 z-50 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfig(!showConfig)}
            className="bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRemote(!showRemote)}
            className="bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowScreencast(!showScreencast)}
            className="bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Cast className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Mirror Mode Controls */}
      {!isFullscreen && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            variant={mirrorMode === 'normal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMirrorMode('normal')}
            className={mirrorMode === 'normal' 
              ? "bg-gray-900 text-white hover:bg-gray-800" 
              : "bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-50"
            }
          >
            <Camera className="h-4 w-4" />
          </Button>
          <Button
            variant={mirrorMode === 'makeup' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMirrorMode('makeup')}
            className={mirrorMode === 'makeup' 
              ? "bg-pink-600 text-white hover:bg-pink-700" 
              : "bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-50"
            }
          >
            <Palette className="h-4 w-4" />
          </Button>
          <Button
            variant={mirrorMode === 'hair' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMirrorMode('hair')}
            className={mirrorMode === 'hair' 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-50"
            }
          >
            Hair
          </Button>
          <Button
            variant={mirrorMode === 'skincare' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMirrorMode('skincare')}
            className={mirrorMode === 'skincare' 
              ? "bg-green-600 text-white hover:bg-green-700" 
              : "bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-50"
            }
          >
            Skin
          </Button>
        </div>
      )}

      {/* Main Layout: Left Widgets + Right Mirror */}
      <div className="flex h-screen">
        {/* Left Panel: Widgets in 3 Rows */}
        <div className="w-1/3 min-w-[400px] flex flex-col bg-gray-50/50 border-r border-gray-200">
          <WidgetPanel 
            displayType={displayType} 
            isFullscreen={isFullscreen}
          />
        </div>

        {/* Right Panel: Large Mirror */}
        <div className="flex-1 relative bg-white">
          <MirrorView
            displayType={displayType}
            mirrorMode={mirrorMode}
            faceDetectionEnabled={faceDetectionEnabled}
            onMirrorModeChange={setMirrorMode}
            onFaceDetectionToggle={setFaceDetectionEnabled}
          />
        </div>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <ConfigPanel 
          onClose={() => setShowConfig(false)}
          displayType={displayType}
          onDisplayTypeChange={setDisplayType}
        />
      )}

      {/* Remote Control Interface */}
      {showRemote && (
        <RemoteControl 
          onClose={() => setShowRemote(false)}
          displayType={displayType}
        />
      )}

      {/* Screencast Manager */}
      {showScreencast && (
        <ScreencastManager 
          onClose={() => setShowScreencast(false)}
          displayType={displayType}
        />
      )}
    </div>
  );
}
