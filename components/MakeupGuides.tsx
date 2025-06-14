import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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

interface MakeupGuidesProps {
  faces: FaceData[];
}

export const MakeupGuides: React.FC<MakeupGuidesProps> = ({ faces }) => {
  const [activeGuide, setActiveGuide] = useState<'foundation' | 'eyeshadow' | 'eyeliner' | 'lipstick' | 'contour'>('foundation');

  if (faces.length === 0) return null;

  const face = faces[0]; // Use first detected face

  const renderFoundationGuide = () => (
    <div className="absolute inset-0">
      {/* Face oval for foundation coverage */}
      <div
        className="absolute border-2 border-dashed border-orange-300 bg-orange-300/5 rounded-full"
        style={{
          left: `${((face.x - face.width * 0.15) / 640) * 100}%`,
          top: `${((face.y - face.height * 0.1) / 480) * 100}%`,
          width: `${((face.width * 1.3) / 640) * 100}%`,
          height: `${((face.height * 1.2) / 480) * 100}%`,
        }}
      />
      {/* Forehead zone */}
      <div
        className="absolute border border-orange-400 bg-orange-400/10 rounded-full"
        style={{
          left: `${((face.x + face.width * 0.2) / 640) * 100}%`,
          top: `${((face.y - face.height * 0.05) / 480) * 100}%`,
          width: `${((face.width * 0.6) / 640) * 100}%`,
          height: `${((face.height * 0.3) / 480) * 100}%`,
        }}
      />
      {/* Cheek zones */}
      <div
        className="absolute border border-orange-400 bg-orange-400/10 rounded-full"
        style={{
          left: `${((face.x - face.width * 0.05) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.3) / 480) * 100}%`,
          width: `${((face.width * 0.4) / 640) * 100}%`,
          height: `${((face.height * 0.35) / 480) * 100}%`,
        }}
      />
      <div
        className="absolute border border-orange-400 bg-orange-400/10 rounded-full"
        style={{
          left: `${((face.x + face.width * 0.65) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.3) / 480) * 100}%`,
          width: `${((face.width * 0.4) / 640) * 100}%`,
          height: `${((face.height * 0.35) / 480) * 100}%`,
        }}
      />
    </div>
  );

  const renderEyeshadowGuide = () => (
    <div className="absolute inset-0">
      {face.landmarks && (
        <>
          {/* Left eye makeup zones */}
          <div
            className="absolute border border-purple-400 bg-purple-400/20 rounded-full"
            style={{
              left: `${((face.landmarks.eyes.left.x - 25) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.left.y - 15) / 480) * 100}%`,
              width: `${(50 / 640) * 100}%`,
              height: `${(30 / 480) * 100}%`,
            }}
          />
          {/* Right eye makeup zones */}
          <div
            className="absolute border border-purple-400 bg-purple-400/20 rounded-full"
            style={{
              left: `${((face.landmarks.eyes.right.x - 25) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.right.y - 15) / 480) * 100}%`,
              width: `${(50 / 640) * 100}%`,
              height: `${(30 / 480) * 100}%`,
            }}
          />
          {/* Eyebrow guides */}
          <div
            className="absolute border-t-2 border-purple-300"
            style={{
              left: `${((face.landmarks.eyes.left.x - 30) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.left.y - 25) / 480) * 100}%`,
              width: `${(60 / 640) * 100}%`,
              height: '2px',
            }}
          />
          <div
            className="absolute border-t-2 border-purple-300"
            style={{
              left: `${((face.landmarks.eyes.right.x - 30) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.right.y - 25) / 480) * 100}%`,
              width: `${(60 / 640) * 100}%`,
              height: '2px',
            }}
          />
        </>
      )}
    </div>
  );

  const renderEyelinerGuide = () => (
    <div className="absolute inset-0">
      {face.landmarks && (
        <>
          {/* Left eyeliner guide */}
          <div
            className="absolute border-b-2 border-black bg-black/10"
            style={{
              left: `${((face.landmarks.eyes.left.x - 30) / 640) * 100}%`,
              top: `${(face.landmarks.eyes.left.y / 480) * 100}%`,
              width: `${(60 / 640) * 100}%`,
              height: '3px',
            }}
          />
          {/* Right eyeliner guide */}
          <div
            className="absolute border-b-2 border-black bg-black/10"
            style={{
              left: `${((face.landmarks.eyes.right.x - 30) / 640) * 100}%`,
              top: `${(face.landmarks.eyes.right.y / 480) * 100}%`,
              width: `${(60 / 640) * 100}%`,
              height: '3px',
            }}
          />
          {/* Wing guides */}
          <div
            className="absolute w-4 h-2 border border-black bg-black/10 transform rotate-12"
            style={{
              left: `${((face.landmarks.eyes.left.x + 25) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.left.y - 5) / 480) * 100}%`,
            }}
          />
          <div
            className="absolute w-4 h-2 border border-black bg-black/10 transform -rotate-12"
            style={{
              left: `${((face.landmarks.eyes.right.x + 25) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.right.y - 5) / 480) * 100}%`,
            }}
          />
        </>
      )}
    </div>
  );

  const renderLipstickGuide = () => (
    <div className="absolute inset-0">
      {face.landmarks && (
        <>
          {/* Lip outline */}
          <div
            className="absolute border-2 border-red-400 bg-red-400/20 rounded-full"
            style={{
              left: `${((face.landmarks.mouth.x - 25) / 640) * 100}%`,
              top: `${((face.landmarks.mouth.y - 10) / 480) * 100}%`,
              width: `${(50 / 640) * 100}%`,
              height: `${(20 / 480) * 100}%`,
            }}
          />
          {/* Upper lip guide */}
          <div
            className="absolute border-t-2 border-red-300"
            style={{
              left: `${((face.landmarks.mouth.x - 20) / 640) * 100}%`,
              top: `${((face.landmarks.mouth.y - 8) / 480) * 100}%`,
              width: `${(40 / 640) * 100}%`,
              height: '2px',
            }}
          />
          {/* Lower lip guide */}
          <div
            className="absolute border-b-2 border-red-300"
            style={{
              left: `${((face.landmarks.mouth.x - 20) / 640) * 100}%`,
              top: `${((face.landmarks.mouth.y + 8) / 480) * 100}%`,
              width: `${(40 / 640) * 100}%`,
              height: '2px',
            }}
          />
        </>
      )}
    </div>
  );

  const renderContourGuide = () => (
    <div className="absolute inset-0">
      {/* Contour zones */}
      <div
        className="absolute border border-amber-400 bg-amber-400/10"
        style={{
          left: `${((face.x - face.width * 0.05) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.15) / 480) * 100}%`,
          width: `${((face.width * 0.2) / 640) * 100}%`,
          height: `${((face.height * 0.6) / 480) * 100}%`,
          clipPath: 'polygon(0 0, 80% 0, 50% 100%, 0 100%)',
        }}
      />
      <div
        className="absolute border border-amber-400 bg-amber-400/10"
        style={{
          right: `${((640 - face.x - face.width + face.width * 0.05) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.15) / 480) * 100}%`,
          width: `${((face.width * 0.2) / 640) * 100}%`,
          height: `${((face.height * 0.6) / 480) * 100}%`,
          clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 50% 100%)',
        }}
      />
      {/* Jawline contour */}
      <div
        className="absolute border-b-2 border-amber-300"
        style={{
          left: `${((face.x + face.width * 0.1) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.85) / 480) * 100}%`,
          width: `${((face.width * 0.8) / 640) * 100}%`,
          height: '2px',
          borderRadius: '0 0 50px 50px',
        }}
      />
    </div>
  );

  const renderGuideContent = () => {
    switch (activeGuide) {
      case 'foundation':
        return renderFoundationGuide();
      case 'eyeshadow':
        return renderEyeshadowGuide();
      case 'eyeliner':
        return renderEyelinerGuide();
      case 'lipstick':
        return renderLipstickGuide();
      case 'contour':
        return renderContourGuide();
      default:
        return null;
    }
  };

  return (
    <>
      {/* Makeup Guide Controls */}
      <div className="absolute top-16 left-4 z-20 flex flex-col gap-2">
        <Badge variant="outline" className="backdrop-blur-sm bg-pink-500/20 text-white border-pink-300">
          Makeup Guide
        </Badge>
        <div className="flex flex-col gap-1">
          {[
            { id: 'foundation', label: 'Foundation', color: 'bg-orange-500' },
            { id: 'eyeshadow', label: 'Eyeshadow', color: 'bg-purple-500' },
            { id: 'eyeliner', label: 'Eyeliner', color: 'bg-black' },
            { id: 'lipstick', label: 'Lipstick', color: 'bg-red-500' },
            { id: 'contour', label: 'Contour', color: 'bg-amber-600' },
          ].map((guide) => (
            <Button
              key={guide.id}
              variant={activeGuide === guide.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveGuide(guide.id as any)}
              className={`backdrop-blur-sm text-xs ${
                activeGuide === guide.id 
                  ? `${guide.color} text-white` 
                  : 'bg-black/50 text-white border-white/20'
              }`}
            >
              {guide.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Render the active guide */}
      {renderGuideContent()}
    </>
  );
};