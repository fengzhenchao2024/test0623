import React, { useEffect, useState } from 'react';

interface VisualizerProps {
  isPlaying: boolean;
}

export default function Visualizer({ isPlaying }: VisualizerProps) {
  const [barHeights, setBarHeights] = useState<number[]>(new Array(24).fill(12));

  // Simulating real-time sound frequencies
  useEffect(() => {
    if (!isPlaying) {
      // Return bars to rest level cleanly
      const interval = setInterval(() => {
        setBarHeights((prev) => prev.map((h) => Math.max(6, h - (h - 6) * 0.15)));
      }, 50);
      return () => clearInterval(interval);
    }

    const interval = setInterval(() => {
      setBarHeights((prev) =>
        prev.map(() => {
          const randAmplitude = Math.floor(Math.random() * 56) + 8; // dynamic range
          return randAmplitude;
        })
      );
    }, 90);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div 
      id="spectrum-visualizer" 
      className="flex items-end justify-center gap-1 h-20 w-full px-4 border border-slate-200/65 rounded-xl bg-slate-50 relative overflow-hidden"
    >
      {/* Absolute faint background laser grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

      {barHeights.map((height, idx) => (
        <div
          id={`visualizer-bar-${idx}`}
          key={idx}
          className="flex-1 rounded-t-md transition-all duration-100 ease-out"
          style={{
            height: `${height}%`,
            background: `linear-gradient(to top, var(--color-indigo-600) 0%, var(--color-violet-500) 50%, var(--color-sky-400) 100%)`
          }}
        />
      ))}
    </div>
  );
}
