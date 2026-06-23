import React from 'react';
import { Play, Download, Trash2, Video, Calendar, Eye, HelpCircle } from 'lucide-react';
import { GenerationHistoryItem, GeneratorStatus } from '../types';
import { ASPECT_RATIOS } from '../data';

interface VideoPlayerOutputProps {
  status: GeneratorStatus;
  activeVideoUrl: string;
  activeRatio: string;
  activePrompt: string;
  activeResolution: string;
  activeDuration: number;
  history: GenerationHistoryItem[];
  onSelectHistory: (item: GenerationHistoryItem) => void;
  onDeleteHistory: (id: string) => void;
}

export default function VideoPlayerOutput({
  status,
  activeVideoUrl,
  activeRatio,
  activePrompt,
  activeResolution,
  activeDuration,
  history,
  onSelectHistory,
  onDeleteHistory
}: VideoPlayerOutputProps) {
  // Find correct CSS aspect ratio target class based on active ratio value
  const matchedRatio = ASPECT_RATIOS.find((r) => r.value === activeRatio);
  const aspectClass = matchedRatio ? matchedRatio.aspectClass : 'aspect-video';

  return (
    <div id="video-output-wrapper" className="space-y-6">
      {/* 1. Main Video Output Card */}
      {status === 'success' && activeVideoUrl && (
        <div id="active-video-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="text-sm font-semibold text-slate-100">生成结果 (Current Render)</h3>
            </div>
            
            {/* Download Link */}
            <a
              id="active-download-link"
              href={activeVideoUrl}
              download={`seedance-video-${activeRatio.replace(':', 'x')}-${activeResolution}.mp4`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              下载视频 (Download)
            </a>
          </div>

          {/* Sizable Video Stage respecting requested aspect ratios */}
          <div className={`relative w-full overflow-hidden bg-black rounded-xl border border-slate-950 flex items-center justify-center ${aspectClass} group shadow-inner transition-all duration-300`}>
            <video
              id="rendered-video-player"
              src={activeVideoUrl}
              controls
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
            {/* Visual crop assistance guide line to indicate real aspect layout */}
            <div className="absolute inset-0 pointer-events-none border border-white/5 group-hover:border-indigo-500/20 transition-colors" />
          </div>

          {/* Render parameters metadata summary */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 space-y-2 text-xs">
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
              <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800/40">
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">分辨率</span>
                <span className="text-indigo-400 font-bold">{activeResolution}</span>
              </div>
              <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800/40">
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">时长</span>
                <span className="text-indigo-400 font-bold">{activeDuration} 秒</span>
              </div>
              <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800/40">
                <span className="text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">画面比例</span>
                <span className="text-indigo-400 font-bold">{activeRatio}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900">
              <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">创意描述:</span>
              <p className="text-slate-300 italic font-medium leading-relaxed bg-slate-900/30 px-2 py-1.5 rounded">
                "{activePrompt}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Historic List Section */}
      <div id="generation-history-card" className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200">生成历史记录 ({history.length})</h2>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-slate-600 border border-dashed border-slate-800/40 rounded-xl bg-slate-950/10">
            <HelpCircle className="w-7 h-7 text-slate-700 mb-2.5" />
            <p className="text-xs font-medium text-slate-500">当前暂无历史生成记录</p>
            <p className="text-[10px] text-slate-600 mt-1">
              配置提示词并点击上方“立即生成视频”开始创作
            </p>
          </div>
        ) : (
          <div id="history-items-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {history.map((item) => {
              const rConfig = ASPECT_RATIOS.find((r) => r.value === item.aspectRatio);
              const rClass = rConfig ? rConfig.aspectClass : 'aspect-video';
              
              return (
                <div
                  id={`history-card-${item.id}`}
                  key={item.id}
                  className="bg-slate-950/90 border border-slate-850 rounded-xl overflow-hidden shadow-md hover:border-slate-700 transition-all group flex flex-col text-xs"
                >
                  {/* Miniature cropped preview that loads video on click */}
                  <div
                    onClick={() => onSelectHistory(item)}
                    className="relative aspect-video w-full cursor-pointer bg-black overflow-hidden flex items-center justify-center border-b border-slate-900"
                  >
                    <video
                      src={item.videoUrl}
                      muted
                      loop
                      className="w-full h-full object-cover"
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    
                    {/* Hover state cover indicating video preview */}
                    <div className="absolute inset-0 bg-slate-950/45 opacity-100 group-hover:opacity-0 transition-opacity flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-indigo-400 border border-slate-800">
                        <Play className="w-4 h-4 fill-indigo-400/20" />
                      </div>
                    </div>
                    
                    {/* Badges in preview */}
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950/90 text-indigo-400 font-mono border border-slate-800">
                        {item.aspectRatio}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950/90 text-indigo-400 font-mono border border-slate-800">
                        {item.resolution}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 bg-slate-950/90 text-[9px] text-slate-400 px-1 py-0.5 rounded border border-slate-800 font-mono">
                      {item.duration}s
                    </div>
                  </div>

                  {/* Body containing Prompt & Date details */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 font-mono block">
                        {new Date(item.timestamp).toLocaleTimeString()} — 提示词:
                      </span>
                      <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed italic" title={item.prompt}>
                        "{item.prompt}"
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2.5 border-t border-slate-900">
                      <button
                        id={`load-history-${item.id}`}
                        type="button"
                        onClick={() => onSelectHistory(item)}
                        className="flex-1 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 py-1 rounded text-[10px] font-semibold transition-all flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        装载预览
                      </button>
                      
                      <a
                        id={`download-history-${item.id}`}
                        href={item.videoUrl}
                        download={`seedance-history-${item.id}.mp4`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:text-indigo-400 text-slate-400 transition-colors flex items-center justify-center"
                        title="下载视频"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>

                      <button
                        id={`delete-history-${item.id}`}
                        type="button"
                        onClick={() => onDeleteHistory(item.id)}
                        className="p-1 px-2 rounded bg-slate-900 hover:bg-rose-950 hover:text-rose-400 text-slate-500 border border-slate-850 hover:border-rose-900/55 transition-all text-xs"
                        title="删除记录"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
