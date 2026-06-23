import React from 'react';
import { Sliders, Video, Film, Eye, Info, Zap, ChevronRight } from 'lucide-react';
import { Resolution, AspectRatio, EngineModel } from '../types';
import { RESOLUTIONS, ASPECT_RATIOS } from '../data';

interface ParametersSectionProps {
  resolution: Resolution;
  onResolutionChange: (res: Resolution) => void;
  duration: number;
  onDurationChange: (dur: number) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  engineModel: EngineModel;
  onEngineModelChange: (model: EngineModel) => void;
}

export default function ParametersSection({
  resolution,
  onResolutionChange,
  duration,
  onDurationChange,
  aspectRatio,
  onAspectRatioChange,
  engineModel,
  onEngineModelChange
}: ParametersSectionProps) {
  // If engineModel === 'seedance2.0-fast', then 1080p is excluded
  const filteredResolutions = RESOLUTIONS.filter(
    (res) => !(engineModel === 'seedance2.0-fast' && res.value === '1080p')
  );

  return (
    <div id="parameters-section-card" className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Sliders className="w-4 h-4 text-indigo-400" />
        <h2 className="text-sm font-semibold text-slate-200 tracking-tight">高级渲染参数</h2>
      </div>

      {/* 0. Engine Model Selection (Seedance 2.0 or Seedance 2.0 Fast) */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>选择渲染引擎模型 (Engine Model)</span>
        </label>
        
        <div id="engine-model-selection" className="grid grid-cols-2 gap-3">
          <button
            id="engine-model-standard"
            type="button"
            onClick={() => onEngineModelChange('seedance2.0')}
            className={`p-3 rounded-xl border text-left transition-all outline-none flex flex-col gap-1 cursor-pointer ${
              engineModel === 'seedance2.0'
                ? 'bg-indigo-500/10 border-indigo-500/80 text-indigo-200 shadow-md shadow-indigo-500/5'
                : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono">Seedance 2.0</span>
              <span className={`text-[8px] px-1.5 py-0.2 rounded font-semibold ${
                engineModel === 'seedance2.0' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                全能旗舰
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              支持1080p极真渲染与微观光影，追求最顶尖画质过渡。
            </p>
          </button>

          <button
            id="engine-model-fast"
            type="button"
            onClick={() => onEngineModelChange('seedance2.0-fast')}
            className={`p-3 rounded-xl border text-left transition-all outline-none flex flex-col gap-1 cursor-pointer ${
              engineModel === 'seedance2.0-fast'
                ? 'bg-amber-500/10 border-amber-500/80 text-amber-200 shadow-md shadow-amber-500/5'
                : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono">Seedance 2.0 Fast</span>
              <span className={`text-[8px] px-1.5 py-0.2 rounded font-semibold ${
                engineModel === 'seedance2.0-fast' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                极速轻量
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              渲染效率提升 50%，最快仅需4秒，不支持 1080p 采样。
            </p>
          </button>
        </div>
      </div>

      {/* 1. Resolution Dropdown clearest instructions: 要有一个选择清晰度的下拉菜单，（480p、720p、1080p、） */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="resolution-select" className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-slate-400" />
            <span>选择视频清晰度 (Resolution)</span>
          </label>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300">
            {resolution}
          </span>
        </div>
        <div className="relative">
          <select
            id="resolution-select"
            value={resolution}
            onChange={(e) => onResolutionChange(e.target.value as Resolution)}
            className="w-full text-xs bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500/80 focus:border-indigo-500 appearance-none cursor-pointer transition-all"
          >
            {filteredResolutions.map((res) => (
              <option key={res.value} value={res.value}>
                {res.label} — {res.desc}
              </option>
            ))}
          </select>
          {/* Custom selector arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Video Duration Slider range 4~15s, default 5s */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label htmlFor="duration-slider" className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>调整视频时长 (Duration)</span>
          </label>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-200 font-mono tracking-tight">{duration}</span>
            <span className="text-[10px] text-slate-500">秒</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="duration-decrease-btn"
            type="button"
            disabled={duration <= 4}
            onClick={() => onDurationChange(Math.max(4, duration - 1))}
            className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 text-sm font-semibold transition-all flex items-center justify-center flex-shrink-0"
          >
            -
          </button>
          
          <div className="relative flex-1 flex items-center h-5">
            <input
              id="duration-slider"
              type="range"
              min={4}
              max={15}
              step={1}
              value={duration}
              onChange={(e) => onDurationChange(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer border border-slate-800/20"
            />
          </div>

          <button
            id="duration-increase-btn"
            type="button"
            disabled={duration >= 15}
            onClick={() => onDurationChange(Math.min(15, duration + 1))}
            className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-400 text-sm font-semibold transition-all flex items-center justify-center flex-shrink-0"
          >
            +
          </button>
        </div>
        <div className="flex justify-between text-[9px] text-slate-600 font-mono px-1">
          <span>4秒 (极速模式)</span>
          <span>5秒 (默认)</span>
          <span>10秒</span>
          <span>15秒 (电影感慢速)</span>
        </div>
      </div>

      {/* 3. Aspect Ratio Selection (21:9, 16:9, 4:3, 3:4, 9:16) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>设置视频画幅比例 (Ratio)</span>
          </label>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300">
            {aspectRatio}
          </span>
        </div>
        
        <div id="ratio-selector-grid" className="grid grid-cols-5 gap-2">
          {ASPECT_RATIOS.map((ratio) => {
            const isSelected = aspectRatio === ratio.value;
            return (
              <button
                id={`ratio-${ratio.value.replace(':', '-')}`}
                key={ratio.value}
                type="button"
                onClick={() => onAspectRatioChange(ratio.value)}
                className={`py-3 px-1 rounded-xl border flex flex-col items-center justify-between gap-2.5 transition-all outline-none ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500/80 text-indigo-300 shadow-md shadow-indigo-500/5 scale-[1.02]'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                {/* Geometrical miniature representation of aspect ratio */}
                <div className="flex items-center justify-center h-7 flex-shrink-0">
                  <div
                    className={`border transition-colors ${
                      isSelected ? 'border-indigo-400 bg-indigo-400/25' : 'border-slate-600 bg-slate-950'
                    } rounded-sm shadow-inner`}
                    style={{
                      width: `${ratio.iconW * 1.5}px`,
                      height: `${ratio.iconH * 1.5}px`
                    }}
                  />
                </div>
                
                <span className="text-[10px] font-bold font-mono tracking-tighter">
                  {ratio.value}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-1.5 bg-slate-950/40 border border-slate-800/40 p-2.5 rounded-lg text-[10px] text-slate-500 leading-normal">
        <Info className="w-3.5 h-3.5 text-indigo-400/80 flex-shrink-0 mt-0.5" />
        <span>画幅比例将直接影响物理摄像机的纵深剪裁度。21:9 极具影院质感，9:16 则最适合作为小红书、抖音等平台的短视频模版。</span>
      </div>
    </div>
  );
}
