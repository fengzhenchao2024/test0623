import React, { useEffect, useRef } from 'react';
import { LyricLine } from '../types';
import { Sparkles, MessageSquare } from 'lucide-react';

interface LyricViewerProps {
  lyrics: LyricLine[];
  currentTime: number;
}

export default function LyricViewer({ lyrics, currentTime }: LyricViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Locate the index of current running lyric line
  const activeIndex = lyrics.reduce((acc, line, idx) => {
    if (currentTime >= line.time) {
      return idx;
    }
    return acc;
  }, -1);

  // Auto-scroll mechanics to bring the active focus into the vertical center
  useEffect(() => {
    if (containerRef.current) {
      const activeEl = containerRef.current.querySelector(`#lyric-line-${activeIndex}`);
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [activeIndex]);

  return (
    <div id="lyric-viewer-card" className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-sm flex flex-col h-[280px]">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-150 pb-2.5">
        <MessageSquare className="w-4 h-4 text-indigo-600" />
        <h3 className="text-xs font-semibold text-slate-800">声学流动歌词 (Dynamic Lyrics)</h3>
      </div>

      <div
        id="lyrics-body-container"
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-4 py-8 px-2 scrollbar-none text-center select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {lyrics.map((line, idx) => {
          const isHighlighted = idx === activeIndex;
          const isUpcoming = idx > activeIndex;

          return (
            <div
              id={`lyric-line-${idx}`}
              key={idx}
              className={`text-xs transition-all duration-500 ease-out ${
                isHighlighted
                  ? 'text-indigo-600 font-extrabold text-[13px] tracking-wide scale-[1.03] leading-relaxed drop-shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                  : isUpcoming
                  ? 'text-slate-400 font-medium scale-95 opacity-55'
                  : 'text-slate-600 opacity-80'
              }`}
            >
              <div className="flex flex-col items-center gap-1 justify-center">
                {isHighlighted && <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />}
                <span>{line.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
