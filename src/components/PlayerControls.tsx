import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, VolumeX, Flame } from 'lucide-react';
import { PlayerState, Track } from '../types';
import { formatDuration } from '../data';

interface PlayerControlsProps {
  currentTrack: Track;
  state: PlayerState;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleLoop: () => void;
}

export default function PlayerControls({
  currentTrack,
  state,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleLoop
}: PlayerControlsProps) {
  
  const percentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div id="player-controls-container" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      
      {/* 1. Progressive Seek Track Bar */}
      <div className="space-y-1">
        <div className="relative flex items-center h-4 group">
          <input
            id="track-seek-slider"
            type="range"
            min={0}
            max={state.duration || 100}
            step={0.5}
            value={state.currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 h-1 hover:h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer transition-all"
          />
          {/* Visual highlight trace */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-y-1/2 h-1 pointer-events-none rounded-lg bg-gradient-to-r from-indigo-500 to-sky-400"
            style={{ 
              left: 0, 
              width: `${percentage}%`
            }} 
          />
        </div>
        
        {/* Time Labels */}
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>{formatDuration(state.currentTime)}</span>
          <span className="flex items-center gap-1 font-semibold text-indigo-600">
            <Flame className="w-2.5 h-2.5 text-indigo-600 animate-pulse" />
            Live HQ Streaming
          </span>
          <span>{formatDuration(state.duration || 300)}</span>
        </div>
      </div>

      {/* 2. Audio Control Panel Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1">
        
        {/* Loop, Shuffle Modes Left-side */}
        <div className="flex items-center gap-4">
          <button
            id="toggle-shuffle-btn"
            type="button"
            onClick={onToggleShuffle}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              state.isShuffling
                ? 'text-indigo-650 border-indigo-200 bg-indigo-50'
                : 'text-slate-400 border-transparent hover:text-slate-650'
            }`}
            title={state.isShuffling ? "开启随机播放" : "顺序播放"}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            id="toggle-loop-btn"
            type="button"
            onClick={onToggleLoop}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              state.isLooping
                ? 'text-indigo-650 border-indigo-200 bg-indigo-50'
                : 'text-slate-400 border-transparent hover:text-slate-650'
            }`}
            title={state.isLooping ? "单曲循环" : "列表循环"}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Trigger Buttons Center */}
        <div className="flex items-center gap-4">
          <button
            id="prev-track-btn"
            type="button"
            onClick={onPrev}
            className="p-3.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="上一首"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            id="play-pause-btn"
            type="button"
            onClick={onPlayPause}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-600 to-sky-400 text-white flex items-center justify-center hover:scale-105 active:scale-[0.97] transition-all cursor-pointer shadow-lg shadow-indigo-500/15"
            title={state.isPlaying ? "暂停" : "播放"}
          >
            {state.isPlaying ? (
              <Pause className="w-6 h-6 stroke-[3] fill-white text-white" />
            ) : (
              <Play className="w-6 h-6 stroke-[3] fill-white text-white ml-0.5" />
            )}
          </button>

          <button
            id="next-track-btn"
            type="button"
            onClick={onNext}
            className="p-3.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs"
            title="下一首"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Dynamic Volume Controls Right-side */}
        <div className="flex items-center gap-2 w-full md:w-32">
          <button
            id="toggle-mute-btn"
            type="button"
            onClick={onToggleMute}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0 cursor-pointer"
            title={state.isMuted ? "解禁" : "静音"}
          >
            {state.isMuted || state.volume === 0 ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <input
            id="volume-slider"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={state.isMuted ? 0 : state.volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-indigo-650 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer border border-slate-200/50"
          />
        </div>

      </div>

    </div>
  );
}
