import React from 'react';
import { Badge } from './ui/badge';

interface SocialFiltersProps {
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
  activeFilter: string | null;
}

export const SocialFilters: React.FC<SocialFiltersProps> = ({ faces, activeFilter }) => {
  if (faces.length === 0 || !activeFilter) return null;

  const face = faces[0];
  
  const renderFilter = () => {
    switch (activeFilter) {
      case 'instagram-glow':
        return (
          <div 
            className="absolute pointer-events-none"
            style={{
              left: face.x - 20,
              top: face.y - 20,
              width: face.width + 40,
              height: face.height + 40,
            }}
          >
            {/* Instagram Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-orange-400 opacity-30 blur-xl"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-pink-300 via-purple-400 to-orange-300 opacity-20 blur-lg"></div>
            
            {/* Sparkles */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-6 w-1 h-1 bg-pink-300 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-4 right-4 w-1 h-1 bg-orange-300 rounded-full animate-pulse delay-500"></div>
          </div>
        );
        
      case 'snapchat-dog':
        return (
          <div 
            className="absolute pointer-events-none"
            style={{
              left: face.x,
              top: face.y,
              width: face.width,
              height: face.height,
            }}
          >
            {/* Dog Ears */}
            <div className="absolute -top-8 left-4 w-8 h-12 bg-amber-800 rounded-full transform -rotate-12 border-2 border-amber-900"></div>
            <div className="absolute -top-8 right-4 w-8 h-12 bg-amber-800 rounded-full transform rotate-12 border-2 border-amber-900"></div>
            <div className="absolute -top-6 left-5 w-5 h-8 bg-pink-300 rounded-full transform -rotate-12"></div>
            <div className="absolute -top-6 right-5 w-5 h-8 bg-pink-300 rounded-full transform rotate-12"></div>
            
            {/* Dog Nose */}
            {face.landmarks && (
              <div 
                className="absolute w-6 h-4 bg-black rounded-full"
                style={{
                  left: face.landmarks.nose.x - face.x - 12,
                  top: face.landmarks.nose.y - face.y - 8,
                }}
              ></div>
            )}
            
            {/* Dog Tongue */}
            {face.landmarks && (
              <div 
                className="absolute w-4 h-8 bg-pink-400 rounded-b-full border-2 border-pink-500"
                style={{
                  left: face.landmarks.mouth.x - face.x - 8,
                  top: face.landmarks.mouth.y - face.y + 4,
                }}
              ></div>
            )}
          </div>
        );
        
      case 'tiktok-beauty':
        return (
          <div 
            className="absolute pointer-events-none"
            style={{
              left: face.x - 10,
              top: face.y - 10,
              width: face.width + 20,
              height: face.height + 20,
            }}
          >
            {/* Beauty Smoothing Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 opacity-40 blur-md"></div>
            
            {/* Rosy Cheeks */}
            {face.landmarks && (
              <>
                <div 
                  className="absolute w-8 h-6 bg-pink-300 rounded-full opacity-30 blur-sm"
                  style={{
                    left: face.landmarks.eyes.left.x - face.x - 15,
                    top: face.landmarks.eyes.left.y - face.y + 20,
                  }}
                ></div>
                <div 
                  className="absolute w-8 h-6 bg-pink-300 rounded-full opacity-30 blur-sm"
                  style={{
                    left: face.landmarks.eyes.right.x - face.x + 5,
                    top: face.landmarks.eyes.right.y - face.y + 20,
                  }}
                ></div>
              </>
            )}
            
            {/* Lip Tint */}
            {face.landmarks && (
              <div 
                className="absolute w-6 h-3 bg-red-400 rounded-full opacity-60"
                style={{
                  left: face.landmarks.mouth.x - face.x - 12,
                  top: face.landmarks.mouth.y - face.y - 2,
                }}
              ></div>
            )}
          </div>
        );
        
      case 'facebook-frame':
        return (
          <div 
            className="absolute pointer-events-none"
            style={{
              left: face.x - 30,
              top: face.y - 40,
              width: face.width + 60,
              height: face.height + 80,
            }}
          >
            {/* Facebook Frame */}
            <div className="absolute inset-0 border-4 border-blue-500 rounded-lg">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                #SelfieTime
              </div>
            </div>
            
            {/* Facebook Logo */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded text-white flex items-center justify-center text-xs">
              f
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {renderFilter()}
    </div>
  );
};