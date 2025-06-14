import React from 'react';

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

interface FaceDetectionOverlayProps {
  faces: FaceData[];
  mirrorMode: 'normal' | 'makeup' | 'hair' | 'skincare';
}

export const FaceDetectionOverlay: React.FC<FaceDetectionOverlayProps> = ({ faces, mirrorMode }) => {
  const getOverlayColor = () => {
    switch (mirrorMode) {
      case 'makeup':
        return 'border-pink-400 bg-pink-400/10';
      case 'hair':
        return 'border-blue-400 bg-blue-400/10';
      case 'skincare':
        return 'border-green-400 bg-green-400/10';
      default:
        return 'border-white bg-white/10';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {faces.map((face, index) => (
        <div key={index}>
          {/* Face Bounding Box */}
          <div
            className={`absolute border-2 rounded-lg ${getOverlayColor()} backdrop-blur-sm transition-all duration-200`}
            style={{
              left: `${(face.x / 640) * 100}%`,
              top: `${(face.y / 480) * 100}%`,
              width: `${(face.width / 640) * 100}%`,
              height: `${(face.height / 480) * 100}%`,
            }}
          >
            {/* Confidence Score */}
            <div className="absolute -top-6 left-0 text-xs text-white bg-black/50 px-2 py-1 rounded">
              {Math.round(face.confidence * 100)}%
            </div>
          </div>

          {/* Face Oval Outline */}
          <div
            className={`absolute border-2 ${getOverlayColor()} rounded-full transition-all duration-200`}
            style={{
              left: `${((face.x - face.width * 0.1) / 640) * 100}%`,
              top: `${((face.y - face.height * 0.05) / 480) * 100}%`,
              width: `${((face.width * 1.2) / 640) * 100}%`,
              height: `${((face.height * 1.1) / 480) * 100}%`,
            }}
          />

          {/* Facial Landmarks */}
          {face.landmarks && (
            <>
              {/* Eyes */}
              <div
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                style={{
                  left: `${(face.landmarks.eyes.left.x / 640) * 100}%`,
                  top: `${(face.landmarks.eyes.left.y / 480) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
              <div
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                style={{
                  left: `${(face.landmarks.eyes.right.x / 640) * 100}%`,
                  top: `${(face.landmarks.eyes.right.y / 480) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              {/* Nose */}
              <div
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${(face.landmarks.nose.x / 640) * 100}%`,
                  top: `${(face.landmarks.nose.y / 480) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              {/* Mouth */}
              <div
                className="absolute w-2 h-2 bg-red-400 rounded-full"
                style={{
                  left: `${(face.landmarks.mouth.x / 640) * 100}%`,
                  top: `${(face.landmarks.mouth.y / 480) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};