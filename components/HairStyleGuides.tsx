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

interface HairStyleGuidesProps {
  faces: FaceData[];
}

export const HairStyleGuides: React.FC<HairStyleGuidesProps> = ({ faces }) => {
  const [activeStyle, setActiveStyle] = useState<'bangs' | 'layers' | 'updo' | 'color-zones' | 'face-frame'>('bangs');

  if (faces.length === 0) return null;

  const face = faces[0];

  const renderBangsGuide = () => (
    <div className="absolute inset-0">
      {/* Forehead area for bangs */}
      <div
        className="absolute border-2 border-dashed border-blue-300 bg-blue-300/10"
        style={{
          left: `${((face.x + face.width * 0.15) / 640) * 100}%`,
          top: `${((face.y - face.height * 0.2) / 480) * 100}%`,
          width: `${((face.width * 0.7) / 640) * 100}%`,
          height: `${((face.height * 0.4) / 480) * 100}%`,
          borderRadius: '0 0 50% 50%',
        }}
      />
      {/* Side bang options */}
      <div
        className="absolute border-2 border-blue-400 bg-blue-400/20"
        style={{
          left: `${((face.x + face.width * 0.05) / 640) * 100}%`,
          top: `${((face.y - face.height * 0.15) / 480) * 100}%`,
          width: `${((face.width * 0.3) / 640) * 100}%`,
          height: `${((face.height * 0.35) / 480) * 100}%`,
          borderRadius: '0 0 80% 20%',
        }}
      />
      <div
        className="absolute border-2 border-blue-400 bg-blue-400/20"
        style={{
          left: `${((face.x + face.width * 0.65) / 640) * 100}%`,
          top: `${((face.y - face.height * 0.15) / 480) * 100}%`,
          width: `${((face.width * 0.3) / 640) * 100}%`,
          height: `${((face.height * 0.35) / 480) * 100}%`,
          borderRadius: '0 0 20% 80%',
        }}
      />
    </div>
  );

  const renderLayersGuide = () => (
    <div className="absolute inset-0">
      {/* Layer guidelines */}
      {[0.6, 0.8, 1.0, 1.2].map((multiplier, index) => (
        <div
          key={index}
          className="absolute border border-cyan-400 bg-cyan-400/5 rounded-full"
          style={{
            left: `${((face.x - face.width * (multiplier - 0.5)) / 640) * 100}%`,
            top: `${((face.y - face.height * 0.1) / 480) * 100}%`,
            width: `${((face.width * multiplier * 2) / 640) * 100}%`,
            height: `${((face.height * (1 + multiplier * 0.5)) / 480) * 100}%`,
          }}
        >
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-cyan-300 bg-black/50 px-1 rounded">
            Layer {index + 1}
          </div>
        </div>
      ))}
    </div>
  );

  const renderUpdoGuide = () => (
    <div className="absolute inset-0">
      {/* High bun position */}
      <div
        className="absolute border-2 border-yellow-400 bg-yellow-400/20 rounded-full"
        style={{
          left: `${((face.x + face.width * 0.35) / 640) * 100}%`,
          top: `${((face.y - face.height * 0.4) / 480) * 100}%`,
          width: `${((face.width * 0.3) / 640) * 100}%`,
          height: `${((face.width * 0.3) / 640) * 100}%`,
        }}
      />
      {/* Low bun position */}
      <div
        className="absolute border-2 border-yellow-300 bg-yellow-300/20 rounded-full"
        style={{
          left: `${((face.x + face.width * 0.35) / 640) * 100}%`,
          top: `${((face.y + face.height * 1.1) / 480) * 100}%`,
          width: `${((face.width * 0.3) / 640) * 100}%`,
          height: `${((face.width * 0.3) / 640) * 100}%`,
        }}
      />
      {/* Side parts for updo */}
      <div
        className="absolute border-l-2 border-yellow-400"
        style={{
          left: `${((face.x + face.width * 0.3) / 640) * 100}%`,
          top: `${((face.y - face.height * 0.2) / 480) * 100}%`,
          width: '2px',
          height: `${((face.height * 0.4) / 480) * 100}%`,
        }}
      />
      <div
        className="absolute border-l-2 border-yellow-400"
        style={{
          left: `${((face.x + face.width * 0.7) / 640) * 100}%`,
          top: `${((face.y - face.height * 0.2) / 480) * 100}%`,
          width: '2px',
          height: `${((face.height * 0.4) / 480) * 100}%`,
        }}
      />
    </div>
  );

  const renderColorZonesGuide = () => (
    <div className="absolute inset-0">
      {/* Highlight zones */}
      <div
        className="absolute border-2 border-yellow-200 bg-yellow-200/30"
        style={{
          left: `${((face.x + face.width * 0.1) / 640) * 100}%`,
          top: `${((face.y - face.height * 0.25) / 480) * 100}%`,
          width: `${((face.width * 0.8) / 640) * 100}%`,
          height: `${((face.height * 0.3) / 480) * 100}%`,
          borderRadius: '50%',
        }}
      >
        <div className="absolute top-2 left-2 text-xs text-yellow-600 bg-white/80 px-1 rounded">
          Highlights
        </div>
      </div>
      {/* Lowlight zones */}
      <div
        className="absolute border-2 border-amber-600 bg-amber-600/20"
        style={{
          left: `${((face.x - face.width * 0.1) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.2) / 480) * 100}%`,
          width: `${((face.width * 0.4) / 640) * 100}%`,
          height: `${((face.height * 0.8) / 480) * 100}%`,
          borderRadius: '50%',
        }}
      >
        <div className="absolute top-2 left-2 text-xs text-amber-800 bg-white/80 px-1 rounded">
          Lowlights
        </div>
      </div>
      <div
        className="absolute border-2 border-amber-600 bg-amber-600/20"
        style={{
          left: `${((face.x + face.width * 0.7) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.2) / 480) * 100}%`,
          width: `${((face.width * 0.4) / 640) * 100}%`,
          height: `${((face.height * 0.8) / 480) * 100}%`,
          borderRadius: '50%',
        }}
      >
        <div className="absolute top-2 right-2 text-xs text-amber-800 bg-white/80 px-1 rounded">
          Lowlights
        </div>
      </div>
    </div>
  );

  const renderFaceFrameGuide = () => (
    <div className="absolute inset-0">
      {/* Face-framing layers */}
      <div
        className="absolute border-2 border-teal-400 bg-teal-400/10"
        style={{
          left: `${((face.x - face.width * 0.05) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.1) / 480) * 100}%`,
          width: `${((face.width * 0.25) / 640) * 100}%`,
          height: `${((face.height * 0.7) / 480) * 100}%`,
          borderRadius: '0 50% 50% 0',
        }}
      />
      <div
        className="absolute border-2 border-teal-400 bg-teal-400/10"
        style={{
          left: `${((face.x + face.width * 0.8) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.1) / 480) * 100}%`,
          width: `${((face.width * 0.25) / 640) * 100}%`,
          height: `${((face.height * 0.7) / 480) * 100}%`,
          borderRadius: '50% 0 0 50%',
        }}
      />
      {/* Cheekbone-framing pieces */}
      {face.landmarks && (
        <>
          <div
            className="absolute border-2 border-teal-300 bg-teal-300/20 rounded-full"
            style={{
              left: `${((face.landmarks.eyes.left.x - 30) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.left.y + 20) / 480) * 100}%`,
              width: `${(40 / 640) * 100}%`,
              height: `${(60 / 480) * 100}%`,
            }}
          />
          <div
            className="absolute border-2 border-teal-300 bg-teal-300/20 rounded-full"
            style={{
              left: `${((face.landmarks.eyes.right.x - 10) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.right.y + 20) / 480) * 100}%`,
              width: `${(40 / 640) * 100}%`,
              height: `${(60 / 480) * 100}%`,
            }}
          />
        </>
      )}
    </div>
  );

  const renderStyleContent = () => {
    switch (activeStyle) {
      case 'bangs':
        return renderBangsGuide();
      case 'layers':
        return renderLayersGuide();
      case 'updo':
        return renderUpdoGuide();
      case 'color-zones':
        return renderColorZonesGuide();
      case 'face-frame':
        return renderFaceFrameGuide();
      default:
        return null;
    }
  };

  return (
    <>
      {/* Hair Style Guide Controls */}
      <div className="absolute top-16 left-4 z-20 flex flex-col gap-2">
        <Badge variant="outline" className="backdrop-blur-sm bg-blue-500/20 text-white border-blue-300">
          Hair Style Guide
        </Badge>
        <div className="flex flex-col gap-1">
          {[
            { id: 'bangs', label: 'Bangs', color: 'bg-blue-500' },
            { id: 'layers', label: 'Layers', color: 'bg-cyan-500' },
            { id: 'updo', label: 'Updo', color: 'bg-yellow-500' },
            { id: 'color-zones', label: 'Color', color: 'bg-amber-500' },
            { id: 'face-frame', label: 'Face Frame', color: 'bg-teal-500' },
          ].map((style) => (
            <Button
              key={style.id}
              variant={activeStyle === style.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveStyle(style.id as any)}
              className={`backdrop-blur-sm text-xs ${
                activeStyle === style.id 
                  ? `${style.color} text-white` 
                  : 'bg-black/50 text-white border-white/20'
              }`}
            >
              {style.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Render the active style guide */}
      {renderStyleContent()}
    </>
  );
};