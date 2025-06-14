import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FaceDetectionOverlay } from './FaceDetectionOverlay';
import { MakeupGuides } from './MakeupGuides';
import { HairStyleGuides } from './HairStyleGuides';
import { SkincareGuides } from './SkincareGuides';
import { MirrorDataRows } from './MirrorDataRows';
import { SocialFilters } from './SocialFilters';
import { 
  Camera, 
  CameraOff, 
  RotateCcw, 
  Zap, 
  Sun, 
  Moon,
  Maximize2,
  Minimize2,
  User,
  Clock,
  Calendar,
  AlertCircle,
  Instagram,
  Heart,
  Star,
  Sparkles,
  Volume2,
  VolumeX,
  Focus,
  Aperture,
  Filter,
  Palette
} from 'lucide-react';

interface MirrorViewProps {
  displayType: string;
  mirrorMode: 'normal' | 'makeup' | 'hair' | 'skincare';
  faceDetectionEnabled: boolean;
  onMirrorModeChange: (mode: 'normal' | 'makeup' | 'hair' | 'skincare') => void;
  onFaceDetectionToggle: (enabled: boolean) => void;
}

interface FaceData {
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
}

export const MirrorView: React.FC<MirrorViewProps> = ({ 
  displayType, 
  mirrorMode, 
  faceDetectionEnabled,
  onMirrorModeChange,
  onFaceDetectionToggle 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [faces, setFaces] = useState<FaceData[]>([]);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isFullMirror, setIsFullMirror] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraStatus, setCameraStatus] = useState<'checking' | 'available' | 'unavailable' | 'denied'>('checking');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    checkCameraAvailability();
  }, []);

  useEffect(() => {
    if (isStreamActive && faceDetectionEnabled) {
      const interval = setInterval(() => {
        detectFaces();
      }, 100); // 10 FPS face detection
      return () => clearInterval(interval);
    }
  }, [isStreamActive, faceDetectionEnabled]);

  const checkCameraAvailability = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraStatus('unavailable');
        setError('Camera API not supported in this environment');
        enableDemoMode();
        return;
      }

      // Check if any video input devices are available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        setCameraStatus('unavailable');
        setError('No camera devices found');
        enableDemoMode();
        return;
      }

      setCameraStatus('available');
      await startCamera();
    } catch (err) {
      console.error('Error checking camera availability:', err);
      setCameraStatus('unavailable');
      setError('Unable to access camera devices');
      enableDemoMode();
    }
  };

  const enableDemoMode = () => {
    // Create comprehensive mock face data for demo - positioned in center column only
    const viewerWidth = 640;
    const viewerHeight = 480;
    
    // Constrain to center column (1/3 to 2/3 of viewer width)
    const centerColumnLeft = viewerWidth * 0.333; // 1/3
    const centerColumnRight = viewerWidth * 0.667; // 2/3
    const centerRegionX = (centerColumnLeft + centerColumnRight) / 2; // Middle of center column
    const centerRegionY = viewerHeight * 0.625; // Middle of 50%-75% height range
    const faceWidth = 120; // Smaller to fit in center column
    const faceHeight = 160;
    
    setFaces([{
      x: centerRegionX - faceWidth / 2,
      y: centerRegionY - faceHeight / 2,
      width: faceWidth,
      height: faceHeight,
      confidence: 0.95,
      landmarks: {
        eyes: { 
          left: { x: centerRegionX - faceWidth * 0.2, y: centerRegionY - faceHeight * 0.15 }, 
          right: { x: centerRegionX + faceWidth * 0.2, y: centerRegionY - faceHeight * 0.15 } 
        },
        nose: { x: centerRegionX, y: centerRegionY },
        mouth: { x: centerRegionX, y: centerRegionY + faceHeight * 0.25 }
      }
    }]);
    
    // Start mock face detection updates
    const interval = setInterval(() => {
      if (faceDetectionEnabled) {
        detectFaces();
      }
    }, 200);

    return () => clearInterval(interval);
  };

  const startCamera = async () => {
    try {
      setCameraStatus('checking');
      
      // Try different camera constraints in order of preference
      const constraints = [
        // High quality front camera
        { 
          video: { 
            width: { ideal: 1920 }, 
            height: { ideal: 1080 },
            facingMode: 'user'
          } 
        },
        // Medium quality front camera
        { 
          video: { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 },
            facingMode: 'user'
          } 
        },
        // Basic front camera
        { 
          video: { 
            facingMode: 'user'
          } 
        },
        // Any camera
        { 
          video: true 
        }
      ];

      let stream = null;
      let lastError = null;

      for (const constraint of constraints) {
        try {
          console.log('Trying camera constraint:', constraint);
          stream = await navigator.mediaDevices.getUserMedia(constraint);
          break;
        } catch (err) {
          console.log('Camera constraint failed:', err);
          lastError = err;
          continue;
        }
      }

      if (!stream) {
        throw lastError || new Error('All camera constraints failed');
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
        setCameraStatus('available');
        setError(null);
        
        // Wait for video to load before clearing error
        videoRef.current.onloadedmetadata = () => {
          setError(null);
        };
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      
      let errorMessage = 'Camera access failed';
      let status: 'unavailable' | 'denied' = 'unavailable';
      
      if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found - using demo mode';
        status = 'unavailable';
      } else if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied - please allow camera permissions';
        status = 'denied';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application';
        status = 'unavailable';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not supported - using demo mode';
        status = 'unavailable';
      } else {
        errorMessage = `Camera error: ${err.message || 'Unknown error'} - using demo mode`;
        status = 'unavailable';
      }
      
      setCameraStatus(status);
      setError(errorMessage);
      setIsStreamActive(false);
      
      // Create centered mock face data for camera error fallback - center column only
      const viewerWidth = 640;
      const viewerHeight = 480;
      const centerColumnLeft = viewerWidth * 0.333;
      const centerColumnRight = viewerWidth * 0.667;
      const centerRegionX = (centerColumnLeft + centerColumnRight) / 2;
      const centerRegionY = viewerHeight * 0.625;
      const faceWidth = 120;
      const faceHeight = 160;
      
      setFaces([{
        x: centerRegionX - faceWidth / 2,
        y: centerRegionY - faceHeight / 2,
        width: faceWidth,
        height: faceHeight,
        confidence: 0.95,
        landmarks: {
          eyes: { 
            left: { x: centerRegionX - faceWidth * 0.2, y: centerRegionY - faceHeight * 0.15 }, 
            right: { x: centerRegionX + faceWidth * 0.2, y: centerRegionY - faceHeight * 0.15 } 
          },
          nose: { x: centerRegionX, y: centerRegionY },
          mouth: { x: centerRegionX, y: centerRegionY + faceHeight * 0.25 }
        }
      }]);
      
      enableDemoMode();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped camera track:', track.label);
      });
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
    }
  };

  const detectFaces = () => {
    // Enhanced mock face detection for demo mode - constrained to center column only
    if (Math.random() > 0.2) { // 80% success rate for more realistic demo
      const viewerWidth = 640;
      const viewerHeight = 480;
      
      // Calculate center column bounds (1/3 to 2/3 of viewer width)
      const centerColumnLeft = viewerWidth * 0.333; // 1/3
      const centerColumnRight = viewerWidth * 0.667; // 2/3
      const centerTop = viewerHeight * 0.4; // Higher up for better positioning
      const centerBottom = viewerHeight * 0.8; // Lower for more space
      
      // Face dimensions - smaller to fit in center column
      const faceWidth = 100 + Math.random() * 40; // 100-140px width
      const faceHeight = 140 + Math.random() * 40; // 140-180px height
      
      // Calculate available space for face within center column
      const availableWidth = centerColumnRight - centerColumnLeft - faceWidth;
      const availableHeight = centerBottom - centerTop - faceHeight;
      
      // Ensure minimum space available
      const safeAvailableWidth = Math.max(availableWidth, 20);
      const safeAvailableHeight = Math.max(availableHeight, 20);
      
      // Position face randomly within the center column
      const faceX = centerColumnLeft + Math.random() * safeAvailableWidth;
      const faceY = centerTop + Math.random() * safeAvailableHeight;
      
      const mockFace: FaceData = {
        x: faceX,
        y: faceY,
        width: faceWidth,
        height: faceHeight,
        confidence: 0.85 + Math.random() * 0.15,
        landmarks: {
          eyes: { 
            left: { x: faceX + faceWidth * 0.3 + Math.random() * 5, y: faceY + faceHeight * 0.35 + Math.random() * 3 }, 
            right: { x: faceX + faceWidth * 0.7 + Math.random() * 5, y: faceY + faceHeight * 0.35 + Math.random() * 3 } 
          },
          nose: { x: faceX + faceWidth * 0.5 + Math.random() * 5, y: faceY + faceHeight * 0.55 + Math.random() * 3 },
          mouth: { x: faceX + faceWidth * 0.5 + Math.random() * 5, y: faceY + faceHeight * 0.75 + Math.random() * 3 }
        }
      };
      setFaces([mockFace]);
    } else {
      setFaces([]);
    }
  };

  const adjustBrightness = (delta: number) => {
    setBrightness(prev => Math.max(50, Math.min(150, prev + delta)));
  };

  const adjustContrast = (delta: number) => {
    setContrast(prev => Math.max(50, Math.min(150, prev + delta)));
  };

  const resetCamera = () => {
    stopCamera();
    setTimeout(() => {
      if (cameraStatus === 'available') {
        startCamera();
      } else {
        checkCameraAvailability();
      }
    }, 500);
  };

  const requestCameraPermission = async () => {
    setCameraStatus('checking');
    await checkCameraAvailability();
  };

  const videoStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
    transform: 'scaleX(-1)', // Mirror effect
  };

  const getModeTitle = () => {
    switch (mirrorMode) {
      case 'makeup': return 'Makeup Studio';
      case 'hair': return 'Hair Styling';
      case 'skincare': return 'Skincare Analysis';
      default: return 'Smart Mirror';
    }
  };

  const getModeDescription = () => {
    switch (mirrorMode) {
      case 'makeup': return 'AI-powered makeup guidance and color matching';
      case 'hair': return 'Professional hair styling and color recommendations';
      case 'skincare': return 'Advanced skin health analysis and care recommendations';
      default: return 'Intelligent mirror with face detection and analysis';
    }
  };

  const getStatusBadgeVariant = () => {
    if (isStreamActive) return 'default';
    if (cameraStatus === 'denied') return 'destructive';
    return 'secondary';
  };

  const getStatusText = () => {
    if (isStreamActive) return 'Live Camera';
    if (cameraStatus === 'checking') return 'Connecting...';
    if (cameraStatus === 'denied') return 'Permission Denied';
    if (cameraStatus === 'unavailable') return 'Demo Mode';
    return 'Camera Off';
  };

  const socialFilters = [
    { id: 'instagram-glow', name: 'IG Glow', icon: Instagram, color: 'from-pink-500 to-purple-500' },
    { id: 'snapchat-dog', name: 'Snap Dog', icon: Heart, color: 'from-yellow-400 to-yellow-600' },
    { id: 'tiktok-beauty', name: 'TT Beauty', icon: Star, color: 'from-pink-400 to-red-500' },
    { id: 'facebook-frame', name: 'FB Frame', icon: Sparkles, color: 'from-blue-500 to-blue-700' },
  ];

  return (
    <div className={`relative h-full flex flex-col bg-white ${isFullMirror ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header Section - Light theme */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6 text-gray-600" />
              <div>
                <h2 className="text-lg text-gray-900">{getModeTitle()}</h2>
                <p className="text-sm text-gray-600">{getModeDescription()}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {currentTime.toLocaleDateString([], { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="absolute top-20 left-4 z-20">
        <Badge variant={getStatusBadgeVariant()} className="bg-white border-gray-300 text-gray-700">
          {getStatusText()}
        </Badge>
        {faces.length > 0 && faceDetectionEnabled && (
          <Badge variant="outline" className="ml-2 bg-white border-gray-300 text-gray-700">
            Face Detected ({Math.round(faces[0].confidence * 100)}%)
          </Badge>
        )}
      </div>

      {/* Video Container - Keep dark for camera visibility */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {error || cameraStatus === 'unavailable' || cameraStatus === 'denied' ? (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="text-center max-w-md">
              <div className="flex justify-center mb-4">
                {cameraStatus === 'denied' ? (
                  <AlertCircle className="h-16 w-16 text-yellow-400" />
                ) : (
                  <CameraOff className="h-16 w-16 opacity-50" />
                )}
              </div>
              <p className="text-lg mb-2">
                {cameraStatus === 'denied' ? 'Camera Permission Required' : 'Camera Unavailable'}
              </p>
              <p className="text-sm opacity-70 mb-4">{error}</p>
              {cameraStatus === 'denied' ? (
                <Button 
                  onClick={requestCameraPermission}
                  className="mb-4 bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Grant Camera Access
                </Button>
              ) : (
                <Button 
                  onClick={resetCamera}
                  variant="outline"
                  className="mb-4 border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry Camera
                </Button>
              )}
              <p className="text-xs opacity-50">
                {cameraStatus === 'denied' 
                  ? 'Please allow camera access to use the mirror features'
                  : 'Running in demo mode with simulated face detection'
                }
              </p>
            </div>
          </div>
        ) : cameraStatus === 'checking' ? (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg mb-2">Connecting to Camera</p>
              <p className="text-sm opacity-70">Please wait...</p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={videoStyle}
          />
        )}

        {/* 3-Column Touch Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 flex pointer-events-none">
            {/* Left Column - Control Buttons */}
            <div className="w-1/3 flex flex-col justify-center items-center gap-4 p-4 pointer-events-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustBrightness(10)}
                className="bg-black/20 backdrop-blur-sm border-white/30 text-white hover:bg-black/40 w-12 h-12 rounded-full"
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustBrightness(-10)}
                className="bg-black/20 backdrop-blur-sm border-white/30 text-white hover:bg-black/40 w-12 h-12 rounded-full"
              >
                <Moon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className="bg-black/20 backdrop-blur-sm border-white/30 text-white hover:bg-black/40 w-12 h-12 rounded-full"
              >
                {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFaceDetectionToggle(!faceDetectionEnabled)}
                className={`backdrop-blur-sm border-white/30 text-white hover:bg-black/40 w-12 h-12 rounded-full ${
                  faceDetectionEnabled ? 'bg-yellow-500/50' : 'bg-black/20'
                }`}
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>

            {/* Center Column - Face Detection & Social Filters */}
            <div className="w-1/3 relative">
              {/* Face Detection Area Indicator */}
              <div className="absolute inset-4 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center pointer-events-none">
                <div className="text-white/50 text-center">
                  <Focus className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-xs">Face Detection Zone</p>
                </div>
              </div>

              {/* Social Media Filter Buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 pointer-events-auto">
                {socialFilters.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <Button
                      key={filter.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                      className={`backdrop-blur-sm border-white/30 text-white hover:bg-black/40 w-10 h-10 rounded-full ${
                        activeFilter === filter.id ? `bg-gradient-to-r ${filter.color} bg-opacity-60` : 'bg-black/20'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </Button>
                  );
                })}
              </div>

              {/* Active Filter Badge */}
              {activeFilter && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
                  <Badge className="bg-black/50 text-white border-white/30">
                    {socialFilters.find(f => f.id === activeFilter)?.name}
                  </Badge>
                </div>
              )}
            </div>

            {/* Right Column - Mode & Utility Buttons */}
            <div className="w-1/3 flex flex-col justify-center items-center gap-4 p-4 pointer-events-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMirrorModeChange('makeup')}
                className={`backdrop-blur-sm border-white/30 text-white hover:bg-black/40 w-12 h-12 rounded-full ${
                  mirrorMode === 'makeup' ? 'bg-pink-500/50' : 'bg-black/20'
                }`}
              >
                <Palette className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMirrorModeChange('hair')}
                className={`backdrop-blur-sm border-white/30 text-white hover:bg-black/40 w-12 h-12 rounded-full ${
                  mirrorMode === 'hair' ? 'bg-blue-500/50' : 'bg-black/20'
                }`}
              >
                <Aperture className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMirrorModeChange('skincare')}
                className={`backdrop-blur-sm border-white/30 text-white hover:bg-black/40 w-12 h-12 rounded-full ${
                  mirrorMode === 'skincare' ? 'bg-green-500/50' : 'bg-black/20'
                }`}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullMirror(!isFullMirror)}
                className="bg-black/20 backdrop-blur-sm border-white/30 text-white hover:bg-black/40 w-12 h-12 rounded-full"
              >
                {isFullMirror ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* Face Detection Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Face Detection Overlays - Only in center column */}
        {faceDetectionEnabled && faces.length > 0 && (
          <FaceDetectionOverlay faces={faces} mirrorMode={mirrorMode} />
        )}

        {/* Social Media Filters */}
        <SocialFilters faces={faces} activeFilter={activeFilter} />

        {/* Mode-specific Overlays - Only in center column */}
        {mirrorMode === 'makeup' && faces.length > 0 && (
          <MakeupGuides faces={faces} />
        )}
        
        {mirrorMode === 'hair' && faces.length > 0 && (
          <HairStyleGuides faces={faces} />
        )}
        
        {mirrorMode === 'skincare' && faces.length > 0 && (
          <SkincareGuides faces={faces} />
        )}

        {/* Camera Toggle */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
          <Button
            variant={isStreamActive ? "destructive" : "default"}
            size="sm"
            onClick={isStreamActive ? stopCamera : resetCamera}
            className="bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {isStreamActive ? (
              <>
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Camera
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                {cameraStatus === 'denied' ? 'Grant Access' : 'Start Camera'}
              </>
            )}
          </Button>
        </div>

        {/* Overlay Toggle */}
        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOverlay(!showOverlay)}
            className="bg-white/90 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {showOverlay ? 'Hide Controls' : 'Show Controls'}
          </Button>
        </div>
      </div>

      {/* Data Rows Section - Light theme */}
      <div className="bg-white border-t border-gray-200">
        <MirrorDataRows 
          mirrorMode={mirrorMode}
          faceDetectionEnabled={faceDetectionEnabled}
          faces={faces}
          onFaceDetectionToggle={onFaceDetectionToggle}
        />
      </div>

      {/* Footer Section - Light theme */}
      <div className="bg-gray-50 border-t border-gray-200 p-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Magic Mirror Pro v2.0</span>
            <span>•</span>
            <span>AI Beauty Assistant</span>
            <span>•</span>
            <span className={`${cameraStatus === 'unavailable' ? 'text-orange-600' : 
                              cameraStatus === 'denied' ? 'text-red-600' : 
                              'text-blue-600'}`}>
              {cameraStatus === 'unavailable' ? 'Demo Mode' : 
               cameraStatus === 'denied' ? 'Permission Required' : 
               'Camera Ready'}
            </span>
            {activeFilter && (
              <>
                <span>•</span>
                <span className="text-purple-600">
                  Filter: {socialFilters.find(f => f.id === activeFilter)?.name}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>Session: {Math.floor(Date.now() / 1000) % 3600}s</span>
            <span>•</span>
            <span>Quality: {isStreamActive ? 'HD' : 'Demo'}</span>
            <span>•</span>
            <span>Zone: Center Column</span>
            <span>•</span>
            <span className="text-green-600">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};