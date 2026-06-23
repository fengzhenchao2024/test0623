import React from 'react';
import { Loader2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { TimelineStep, GeneratorStatus } from '../types';

interface GenerationTimelineProps {
  progress: number;
  status: GeneratorStatus;
  steps: TimelineStep[];
  currentStepIndex: number;
}

export default function GenerationTimeline({
  progress,
  status,
  steps,
  currentStepIndex
}: GenerationTimelineProps) {
  if (status === 'idle') return null;

  return (
    <div id="generation-timeline-card" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'generating' ? (
            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
          ) : status === 'failed' ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <h3 className="text-sm font-semibold text-slate-200">
            {status === 'generating' ? 'Seedance 2.0 视频生成中...' : status === 'failed' ? '视频生成失败' : '视频渲染完成'}
          </h3>
        </div>
        <span className="text-sm font-mono font-bold text-indigo-400">
          {progress}%
        </span>
      </div>

      {/* Main Progress Bar */}
      <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60 p-[1px]">
        <div
          id="progress-bar-fill"
          className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-400 transition-all duration-300 relative"
          style={{ width: `${progress}%` }}
        >
          {/* Animated glossy gleam during generation */}
          {status === 'generating' && (
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          )}
        </div>
      </div>

      {/* Stage-by-Stage Timeline */}
      <div id="timeline-steps" className="space-y-4 pt-1">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex && status === 'generating';
          const isCompleted = idx < currentStepIndex || status === 'success';
          const isPending = idx > currentStepIndex && status === 'generating';

          return (
            <div
              id={`timeline-step-${step.id}`}
              key={step.id}
              className={`flex items-start gap-3.5 transition-all duration-300 ${
                isActive ? 'opacity-100 scale-[1.01]' : isCompleted ? 'opacity-85' : 'opacity-40'
              }`}
            >
              {/* Step state icon */}
              <div className="mt-0.5 flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${
                    isActive ? 'text-indigo-400 font-bold' : isCompleted ? 'text-slate-300ClassName' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                  {isActive && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 animate-pulse">
                      进行中
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
