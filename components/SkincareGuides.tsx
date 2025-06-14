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

interface SkincareGuidesProps {
  faces: FaceData[];
}

export const SkincareGuides: React.FC<SkincareGuidesProps> = ({ faces }) => {
  const [activeAnalysis, setActiveAnalysis] = useState<'t-zone' | 'pores' | 'wrinkles' | 'dark-circles' | 'acne-zones'>('t-zone');

  if (faces.length === 0) return null;

  const face = faces[0];

  const renderTZoneGuide = () => (
    <div className="absolute inset-0">
      {/* T-Zone: Forehead */}
      <div
        className="absolute border-2 border-green-300 bg-green-300/20"
        style={{
          left: `${((face.x + face.width * 0.25) / 640) * 100}%`,
          top: `${((face.y - face.height * 0.05) / 480) * 100}%`,
          width: `${((face.width * 0.5) / 640) * 100}%`,
          height: `${((face.height * 0.35) / 480) * 100}%`,
          borderRadius: '20px 20px 50% 50%',
        }}
      >
        <div className="absolute top-2 left-2 text-xs text-green-700 bg-white/80 px-1 rounded">
          T-Zone: Forehead
        </div>
      </div>
      
      {/* T-Zone: Nose */}
      {face.landmarks && (
        <div
          className="absolute border-2 border-green-300 bg-green-300/20 rounded-full"
          style={{
            left: `${((face.landmarks.nose.x - 20) / 640) * 100}%`,
            top: `${((face.landmarks.nose.y - 30) / 480) * 100}%`,
            width: `${(40 / 640) * 100}%`,
            height: `${(80 / 480) * 100}%`,
          }}
        >
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-green-700 bg-white/80 px-1 rounded">
            T-Zone: Nose
          </div>
        </div>
      )}

      {/* Chin area */}
      <div
        className="absolute border-2 border-green-300 bg-green-300/20 rounded-full"
        style={{
          left: `${((face.x + face.width * 0.35) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.75) / 480) * 100}%`,
          width: `${((face.width * 0.3) / 640) * 100}%`,
          height: `${((face.height * 0.2) / 480) * 100}%`,
        }}
      >
        <div className="absolute top-1 left-2 text-xs text-green-700 bg-white/80 px-1 rounded">
          Chin
        </div>
      </div>
    </div>
  );

  const renderPoresGuide = () => (
    <div className="absolute inset-0">
      {/* Nose pore area */}
      {face.landmarks && (
        <div
          className="absolute border-2 border-orange-400 bg-orange-400/30"
          style={{
            left: `${((face.landmarks.nose.x - 15) / 640) * 100}%`,
            top: `${((face.landmarks.nose.y - 10) / 480) * 100}%`,
            width: `${(30 / 640) * 100}%`,
            height: `${(30 / 480) * 100}%`,
            borderRadius: '50%',
          }}
        />
      )}
      
      {/* Cheek pore areas */}
      <div
        className="absolute border-2 border-orange-300 bg-orange-300/20 rounded-full"
        style={{
          left: `${((face.x + face.width * 0.1) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.45) / 480) * 100}%`,
          width: `${((face.width * 0.25) / 640) * 100}%`,
          height: `${((face.height * 0.25) / 480) * 100}%`,
        }}
      />
      <div
        className="absolute border-2 border-orange-300 bg-orange-300/20 rounded-full"
        style={{
          left: `${((face.x + face.width * 0.65) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.45) / 480) * 100}%`,
          width: `${((face.width * 0.25) / 640) * 100}%`,
          height: `${((face.height * 0.25) / 480) * 100}%`,
        }}
      />
      
      {/* Forehead pore zone */}
      <div
        className="absolute border-2 border-orange-300 bg-orange-300/15"
        style={{
          left: `${((face.x + face.width * 0.3) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.05) / 480) * 100}%`,
          width: `${((face.width * 0.4) / 640) * 100}%`,
          height: `${((face.height * 0.25) / 480) * 100}%`,
          borderRadius: '20px',
        }}
      />
    </div>
  );

  const renderWrinklesGuide = () => (
    <div className="absolute inset-0">
      {/* Forehead lines */}
      {[0.15, 0.25, 0.35].map((position, index) => (
        <div
          key={`forehead-${index}`}
          className="absolute border-t-2 border-red-300"
          style={{
            left: `${((face.x + face.width * 0.2) / 640) * 100}%`,
            top: `${((face.y + face.height * position) / 480) * 100}%`,
            width: `${((face.width * 0.6) / 640) * 100}%`,
            height: '2px',
          }}
        />
      ))}
      
      {/* Eye area - crow's feet */}
      {face.landmarks && (
        <>
          <div
            className="absolute border-2 border-red-300 bg-red-300/10"
            style={{
              left: `${((face.landmarks.eyes.left.x + 25) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.left.y - 10) / 480) * 100}%`,
              width: `${(20 / 640) * 100}%`,
              height: `${(20 / 480) * 100}%`,
              clipPath: 'polygon(0 50%, 100% 0, 100% 100%)',
            }}
          />
          <div
            className="absolute border-2 border-red-300 bg-red-300/10"
            style={{
              left: `${((face.landmarks.eyes.right.x - 45) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.right.y - 10) / 480) * 100}%`,
              width: `${(20 / 640) * 100}%`,
              height: `${(20 / 480) * 100}%`,
              clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
            }}
          />
        </>
      )}

      {/* Nasolabial folds */}
      {face.landmarks && (
        <>
          <div
            className="absolute border-l-2 border-red-400 bg-red-400/10"
            style={{
              left: `${((face.landmarks.nose.x - 25) / 640) * 100}%`,
              top: `${((face.landmarks.nose.y + 20) / 480) * 100}%`,
              width: '20px',
              height: `${(40 / 480) * 100}%`,
              borderRadius: '0 0 0 50px',
            }}
          />
          <div
            className="absolute border-r-2 border-red-400 bg-red-400/10"
            style={{
              left: `${((face.landmarks.nose.x + 5) / 640) * 100}%`,
              top: `${((face.landmarks.nose.y + 20) / 480) * 100}%`,
              width: '20px',
              height: `${(40 / 480) * 100}%`,
              borderRadius: '0 0 50px 0',
            }}
          />
        </>
      )}
    </div>
  );

  const renderDarkCirclesGuide = () => (
    <div className="absolute inset-0">
      {face.landmarks && (
        <>
          {/* Under-eye circles */}
          <div
            className="absolute border-2 border-purple-300 bg-purple-300/30 rounded-full"
            style={{
              left: `${((face.landmarks.eyes.left.x - 30) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.left.y + 5) / 480) * 100}%`,
              width: `${(60 / 640) * 100}%`,
              height: `${(25 / 480) * 100}%`,
            }}
          >
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-purple-700 bg-white/80 px-1 rounded">
              Dark Circles
            </div>
          </div>
          <div
            className="absolute border-2 border-purple-300 bg-purple-300/30 rounded-full"
            style={{
              left: `${((face.landmarks.eyes.right.x - 30) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.right.y + 5) / 480) * 100}%`,
              width: `${(60 / 640) * 100}%`,
              height: `${(25 / 480) * 100}%`,
            }}
          />
          
          {/* Puffiness areas */}
          <div
            className="absolute border border-purple-200 bg-purple-200/20 rounded-full"
            style={{
              left: `${((face.landmarks.eyes.left.x - 25) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.left.y - 5) / 480) * 100}%`,
              width: `${(50 / 640) * 100}%`,
              height: `${(15 / 480) * 100}%`,
            }}
          />
          <div
            className="absolute border border-purple-200 bg-purple-200/20 rounded-full"
            style={{
              left: `${((face.landmarks.eyes.right.x - 25) / 640) * 100}%`,
              top: `${((face.landmarks.eyes.right.y - 5) / 480) * 100}%`,
              width: `${(50 / 640) * 100}%`,
              height: `${(15 / 480) * 100}%`,
            }}
          />
        </>
      )}
    </div>
  );

  const renderAcneZonesGuide = () => (
    <div className="absolute inset-0">
      {/* Common acne zones */}
      <div
        className="absolute border-2 border-red-400 bg-red-400/20"
        style={{
          left: `${((face.x + face.width * 0.3) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.05) / 480) * 100}%`,
          width: `${((face.width * 0.4) / 640) * 100}%`,
          height: `${((face.height * 0.25) / 480) * 100}%`,
          borderRadius: '20px',
        }}
      >
        <div className="absolute top-2 left-2 text-xs text-red-700 bg-white/80 px-1 rounded">
          Forehead Zone
        </div>
      </div>
      
      {/* Nose and chin */}
      {face.landmarks && (
        <div
          className="absolute border-2 border-red-400 bg-red-400/20 rounded-full"
          style={{
            left: `${((face.landmarks.nose.x - 20) / 640) * 100}%`,
            top: `${((face.landmarks.nose.y - 20) / 480) * 100}%`,
            width: `${(40 / 640) * 100}%`,
            height: `${(60 / 480) * 100}%`,
          }}
        />
      )}
      
      <div
        className="absolute border-2 border-red-400 bg-red-400/20 rounded-full"
        style={{
          left: `${((face.x + face.width * 0.4) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.8) / 480) * 100}%`,
          width: `${((face.width * 0.2) / 640) * 100}%`,
          height: `${((face.height * 0.15) / 480) * 100}%`,
        }}
      >
        <div className="absolute top-1 left-1 text-xs text-red-700 bg-white/80 px-1 rounded">
          Chin
        </div>
      </div>

      {/* Jawline acne zones */}
      <div
        className="absolute border-2 border-red-300 bg-red-300/15"
        style={{
          left: `${((face.x + face.width * 0.05) / 640) * 100}%`,
          top: `${((face.y + face.height * 0.65) / 480) * 100}%`,
          width: `${((face.width * 0.9) / 640) * 100}%`,
          height: `${((face.height * 0.2) / 480) * 100}%`,
          borderRadius: '0 0 50px 50px',
        }}
      >
        <div className="absolute top-2 left-4 text-xs text-red-600 bg-white/80 px-1 rounded">
          Jawline Zone
        </div>
      </div>
    </div>
  );

  const renderAnalysisContent = () => {
    switch (activeAnalysis) {
      case 't-zone':
        return renderTZoneGuide();
      case 'pores':
        return renderPoresGuide();
      case 'wrinkles':
        return renderWrinklesGuide();
      case 'dark-circles':
        return renderDarkCirclesGuide();
      case 'acne-zones':
        return renderAcneZonesGuide();
      default:
        return null;
    }
  };

  return (
    <>
      {/* Skincare Analysis Controls */}
      <div className="absolute top-16 left-4 z-20 flex flex-col gap-2">
        <Badge variant="outline" className="backdrop-blur-sm bg-green-500/20 text-white border-green-300">
          Skincare Analysis
        </Badge>
        <div className="flex flex-col gap-1">
          {[
            { id: 't-zone', label: 'T-Zone', color: 'bg-green-500' },
            { id: 'pores', label: 'Pores', color: 'bg-orange-500' },
            { id: 'wrinkles', label: 'Lines', color: 'bg-red-500' },
            { id: 'dark-circles', label: 'Dark Circles', color: 'bg-purple-500' },
            { id: 'acne-zones', label: 'Acne Zones', color: 'bg-red-600' },
          ].map((analysis) => (
            <Button
              key={analysis.id}
              variant={activeAnalysis === analysis.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveAnalysis(analysis.id as any)}
              className={`backdrop-blur-sm text-xs ${
                activeAnalysis === analysis.id 
                  ? `${analysis.color} text-white` 
                  : 'bg-black/50 text-white border-white/20'
              }`}
            >
              {analysis.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Render the active analysis */}
      {renderAnalysisContent()}
    </>
  );
};