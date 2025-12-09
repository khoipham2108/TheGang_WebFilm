import React, { useState, useEffect } from 'react';

interface TheGangsLoaderInterface {
  isPref?: boolean | null;
}

const TheGangsLoader = ({isPref}: TheGangsLoaderInterface) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) return 99;
        return prev + 1;
      });
    }, isPref ? 420 : 35);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center overflow-hidden relative`}>
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle-bg absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="glow-orb glow-orb-1"></div>
      <div className="glow-orb glow-orb-2"></div>

      <div className="relative z-10 text-center">
        {/* Main text with 3D effect */}
        <div className="relative mb-12">
          <h1 className="text-9xl font-black tracking-wider relative">
            {/* Shadow layers for 3D effect */}
            <span className="absolute inset-0 text-shadow-3d">THE GANGS</span>
            <span className="absolute inset-0 text-shadow-3d-2">THE GANGS</span>
            
            {/* Base text */}
            <span className="relative inline-block">
              {'THE GANGS'.split('').map((char, i) => (
                <span
                  key={i}
                  className="inline-block wave-text"
                  style={{
                    animationDelay: `${i * 0.1}s`
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>

            {/* Gradient fill overlay */}
            <span 
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(${100 - progress}% 0 0 0)`
              }}
            >
              <span className="gradient-text">THE GANGS</span>
            </span>

            {/* Glowing edge effect */}
            <span 
              className="absolute right-0 w-full h-2 glow-edge"
              style={{
                bottom: `${progress}%`,
                transform: 'translateX(0%)'
              }}
            />
          </h1>
        </div>

        {/* Progress bar */}
        <div className="w-96 mx-auto">
          <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-orange-900/30 shadow-lg">
            <div 
              className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 transition-all relative overflow-hidden"
              style={{ width: `${progress}%`}}
            >
              <div className="shimmer absolute inset-0"></div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-orange-500 font-bold text-lg">{progress}%</span>
            <span className="text-orange-400/60 text-sm font-medium">{isPref ? 'Analyzing your preferences...': progress == 99 ? 'Hang on, few more secs...' : 'Loading...'}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          25% { transform: translateY(-10px) rotateX(5deg); }
          75% { transform: translateY(-5px) rotateX(-5deg); }
        }

        @keyframes particle-float {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes rotate {
          0% { transform: rotate(0deg) scale(1); opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.5; }
        }

        @keyframes ember-float {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) translateX(${Math.random() * 40 - 20}px) scale(0); opacity: 0; }
        }

        .wave-text {
          animation: wave 2s ease-in-out infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ff6b00, #ff8800, #ffaa00, #ff6b00);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
          filter: drop-shadow(0 0 30px rgba(255, 107, 0, 0.8))
                  drop-shadow(0 0 60px rgba(255, 107, 0, 0.4));
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .text-shadow-3d {
          color: #1a0a00;
          transform: translateZ(-20px);
        }

        .text-shadow-3d-2 {
          color: #2a1500;
          transform: translateZ(-10px);
        }

        .glow-edge {
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 107, 0, 0.8) 30%, 
            rgba(255, 170, 0, 1) 50%, 
            rgba(255, 107, 0, 0.8) 70%, 
            transparent
          );
          filter: blur(8px);
          box-shadow: 0 0 40px rgba(255, 107, 0, 0.8),
                      0 0 80px rgba(255, 107, 0, 0.4);
        }

        .particle-bg {
          background: radial-gradient(circle, rgba(255, 107, 0, 0.6), transparent);
          animation: particle-float linear infinite;
        }

        .glow-orb {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(100px);
          animation: glow-pulse 4s ease-in-out infinite;
        }

        .glow-orb-1 {
          background: radial-gradient(circle, rgba(255, 107, 0, 0.3), transparent);
          top: -100px;
          left: -100px;
        }

        .glow-orb-2 {
          background: radial-gradient(circle, rgba(255, 140, 0, 0.3), transparent);
          bottom: -100px;
          right: -100px;
          animation-delay: 2s;
        }

        .shimmer {
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.4), 
            transparent
          );
          animation: shimmer 2s infinite;
        }

        .rotating-circle {
          border: 2px solid rgba(255, 107, 0, 0.3);
          border-radius: 50%;
          border-top-color: rgba(255, 107, 0, 0.8);
          animation: rotate 3s linear infinite;
        }

        .ember {
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #ff6b00, #ff4400);
          border-radius: 50%;
          box-shadow: 0 0 10px #ff6b00, 0 0 20px #ff4400;
          animation: ember-float linear infinite;
        }

        h1 {
          font-family: 'Arial Black', sans-serif;
          letter-spacing: 0.1em;
          color: #2a2a2a;
          text-shadow: 
            2px 2px 0 #1a1a1a,
            4px 4px 0 #0a0a0a,
            6px 6px 0 #050505,
            8px 8px 20px rgba(0, 0, 0, 0.5);
          transform-style: preserve-3d;
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default TheGangsLoader;