export class DisplayTypeDetector {
  detectDisplayType(): 'mirror' | 'touchscreen' | 'vr' | 'xr' | 'oled' {
    const userAgent = navigator.userAgent.toLowerCase();
    const screen = window.screen;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check for VR/XR capabilities
    if ('xr' in navigator) {
      // @ts-ignore - WebXR types might not be available
      return navigator.xr?.isSessionSupported?.('immersive-vr') ? 'vr' : 'xr';
    }

    // Check for OLED characteristics (high contrast ratio, deep blacks)
    const hasHighContrast = screen.colorDepth >= 24 && 
      (screen.width * screen.height) >= 2073600; // 1920x1080 or higher

    // Check for Magic Mirror setup (typically Raspberry Pi with specific resolutions)
    const isMagicMirror = 
      screen.width === 1920 && screen.height === 1080 && 
      !hasTouch && 
      (userAgent.includes('chromium') || userAgent.includes('electron'));

    // Determine display type
    if (isMagicMirror) {
      return 'mirror';
    } else if (hasTouch) {
      return 'touchscreen';
    } else if (hasHighContrast && screen.width >= 3840) {
      return 'oled';
    } else {
      return 'mirror'; // Default fallback
    }
  }

  getDisplayCapabilities() {
    return {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      hasWebXR: 'xr' in navigator,
      isFullscreenCapable: 'requestFullscreen' in document.documentElement,
    };
  }
}