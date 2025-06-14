import React, { useEffect, useRef } from 'react';

interface GestureDetectorProps {
  displayType: 'vr' | 'xr';
}

export const GestureDetector: React.FC<GestureDetectorProps> = ({ displayType }) => {
  const gestureRef = useRef<{ 
    startX: number; 
    startY: number; 
    isTracking: boolean;
    lastTime: number;
  }>({ startX: 0, startY: 0, isTracking: false, lastTime: 0 });

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      gestureRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        isTracking: true,
        lastTime: Date.now()
      };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!gestureRef.current.isTracking) return;

      const deltaX = e.clientX - gestureRef.current.startX;
      const deltaY = e.clientY - gestureRef.current.startY;
      const deltaTime = Date.now() - gestureRef.current.lastTime;

      // Detect swipe gestures
      if (Math.abs(deltaX) > 100 || Math.abs(deltaY) > 100) {
        const direction = Math.abs(deltaX) > Math.abs(deltaY) 
          ? (deltaX > 0 ? 'right' : 'left')
          : (deltaY > 0 ? 'down' : 'up');
        
        handleGesture('swipe', direction);
        gestureRef.current.isTracking = false;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!gestureRef.current.isTracking) return;

      const deltaTime = Date.now() - gestureRef.current.lastTime;
      const deltaX = Math.abs(e.clientX - gestureRef.current.startX);
      const deltaY = Math.abs(e.clientY - gestureRef.current.startY);

      // Detect tap gesture
      if (deltaTime < 300 && deltaX < 10 && deltaY < 10) {
        handleGesture('tap', { x: e.clientX, y: e.clientY });
      }

      gestureRef.current.isTracking = false;
    };

    // Add event listeners
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    // VR/XR specific gesture handling
    if (displayType === 'vr' || displayType === 'xr') {
      initializeXRGestures();
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [displayType]);

  const initializeXRGestures = async () => {
    // @ts-ignore - WebXR types might not be available
    if ('xr' in navigator && navigator.xr) {
      try {
        // @ts-ignore
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        if (isSupported) {
          // Initialize WebXR gesture detection
          console.log('WebXR gestures initialized');
        }
      } catch (error) {
        console.warn('WebXR not available:', error);
      }
    }
  };

  const handleGesture = (type: string, data: any) => {
    console.log(`Gesture detected: ${type}`, data);
    
    // Dispatch custom gesture events
    const event = new CustomEvent('magicMirrorGesture', {
      detail: { type, data }
    });
    document.dispatchEvent(event);

    // Handle specific gestures
    switch (type) {
      case 'swipe':
        handleSwipeGesture(data);
        break;
      case 'tap':
        handleTapGesture(data);
        break;
    }
  };

  const handleSwipeGesture = (direction: string) => {
    switch (direction) {
      case 'left':
        // Navigate to next widget or page
        break;
      case 'right':
        // Navigate to previous widget or page
        break;
      case 'up':
        // Scroll up or increase brightness
        break;
      case 'down':
        // Scroll down or decrease brightness
        break;
    }
  };

  const handleTapGesture = (position: { x: number; y: number }) => {
    // Find element at tap position and trigger interaction
    const element = document.elementFromPoint(position.x, position.y);
    if (element && element.click) {
      element.click();
    }
  };

  return null; // This component doesn't render anything
};