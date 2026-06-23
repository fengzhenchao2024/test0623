import React from 'react';
import { Sparkles, MessageSquareCode, Copy, Trash2 } from 'lucide-react';
import { PROMPT_PRESETS, PromptPreset } from '../data';

interface PromptSectionProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  onSelectPreset: (preset: PromptPreset) => void;
}

export default function PromptSection({ prompt, onPromptChange, onSelectPreset }: PromptSectionProps) {
  const handleClear = () => onPromptChange('');

  return (
    <div id="prompt-section-card" className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <MessageSquareCode className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-tight">提示词配置 (Prompt)</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{prompt.length} / 1000 字</span>
          {prompt.trim() && (
            <button
              id="clear-prompt-btn"
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 ml-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              清空
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative group">
        <textarea
          id="prompt-textarea"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="请输入您想生成的视频画面创意描述，例如：一艘精美的飞船穿过深空中的恒星环。建议中英文搭配或使用细节词描绘..."
          rows={3}
          maxLength={1000}
          className="w-full text-sm bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none transition-all resize-y leading-relaxed"
        />
        <div className="absolute right-3.5 bottom-3 text-[10px] text-slate-600 group-focus-within:text-indigo-400/60 pointer-events-none font-mono">
          Seedance V2.0
        </div>
      </div>

      {/* Presets Pills */}
      <div className="mt-4">
        <p className="text-[11px] font-medium text-slate-500 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>常用高品质创意模版 (点击一键载入参数)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {PROMPT_PRESETS.map((preset) => {
            const isSelected = prompt === preset.promptCn || prompt === preset.promptEn;
            return (
              <button
                id={`preset-${preset.id}`}
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all flex flex-col gap-0.5 ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-950/50 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] px-1 bg-slate-800 text-indigo-400 rounded-md py-0.2 font-medium">
                    {preset.category}
                  </span>
                  <span className="font-semibold text-slate-300">{preset.title}</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
                  {preset.promptCn}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
