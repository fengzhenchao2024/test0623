import React, { useState, useEffect } from 'react';
import { Sparkles, Video, HelpCircle, Flame, Layers, AlertCircle, RefreshCw, Send, CheckCircle } from 'lucide-react';
import ApiKeyInput from './components/ApiKeyInput';
import PromptSection from './components/PromptSection';
import ImageFilesUpload from './components/ImageFilesUpload';
import ParametersSection from './components/ParametersSection';
import GenerationTimeline from './components/GenerationTimeline';
import VideoPlayerOutput from './components/VideoPlayerOutput';

import {
  Resolution,
  AspectRatio,
  UploadedImage,
  GeneratorStatus,
  TimelineStep,
  GenerationHistoryItem,
  EngineModel
} from './types';

import {
  PROMPT_PRESETS,
  GENERATION_STEPS,
  PromptPreset
} from './data';

export default function App() {
  // 1. Core Config State
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('seedance_api_key') || '';
  });
  
  const [prompt, setPrompt] = useState<string>('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [resolution, setResolution] = useState<Resolution>('720p');
  const [duration, setDuration] = useState<number>(5); // default 5 seconds
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9'); // default widescreen
  const [engineModel, setEngineModel] = useState<EngineModel>('seedance2.0');

  // Automatically downgrade selected resolution to 720p if fast engine does not support 1080p
  const handleEngineModelChange = (model: EngineModel) => {
    setEngineModel(model);
    if (model === 'seedance2.0-fast' && resolution === '1080p') {
      setResolution('720p');
    }
  };

  // 2. Generation Engine Sync State
  const [status, setStatus] = useState<GeneratorStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>(GENERATION_STEPS);
  
  // Save active parameters used for the creation
  const [activeParams, setActiveParams] = useState<{
    videoUrl: string;
    ratio: string;
    prompt: string;
    resolution: string;
    duration: number;
  }>({
    videoUrl: '',
    ratio: '16:9',
    prompt: '',
    resolution: '720p',
    duration: 5
  });

  // Validation warning flag
  const [validationError, setValidationError] = useState<string | null>(null);

  // 3. Persistent History State
  const [history, setHistory] = useState<GenerationHistoryItem[]>(() => {
    const saved = localStorage.getItem('seedance_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync API Key
  useEffect(() => {
    localStorage.setItem('seedance_api_key', apiKey);
  }, [apiKey]);

  // Sync History
  useEffect(() => {
    localStorage.setItem('seedance_history', JSON.stringify(history));
  }, [history]);

  // Handle template selection
  const handleSelectPreset = (preset: PromptPreset) => {
    setPrompt(preset.promptCn);
    // Auto-align video selection placeholder with the chosen preset
    setActiveParams((prev) => ({
      ...prev,
      videoUrl: preset.videoUrl
    }));
    setValidationError(null);
  };

  // Helper: map user's prompt to a fitting stock video for realistic simulation
  const resolveMockVideoUrl = (promptText: string): string => {
    const text = promptText.toLowerCase();
    
    // Check if a preset is already chosen
    const matchedPreset = PROMPT_PRESETS.find(
      (p) => text.includes(p.title) || text.includes(p.promptCn.substring(0, 4))
    );
    if (matchedPreset) {
      return matchedPreset.videoUrl;
    }

    // Match keywords semantic
    if (text.includes('赛博') || text.includes('霓虹') || text.includes('cyber') || text.includes('alley')) {
      return 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-neon-city-street-at-night-41584-large.mp4';
    }
    if (text.includes('星际') || text.includes('太空') || text.includes('space') || text.includes('sleek')) {
      return 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-44101-large.mp4';
    }
    if (text.includes('瀑布') || text.includes('森林') || text.includes('waterfall') || text.includes('mountain')) {
      return 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4';
    }
    if (text.includes('流体') || text.includes('海洋') || text.includes('wave') || text.includes('sea')) {
      return 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-1427-large.mp4';
    }
    if (text.includes('溪流') || text.includes('水面') || text.includes('stream') || text.includes('river')) {
      return 'https://assets.mixkit.co/videos/preview/mixkit-small-stream-in-the-forest-2244-large.mp4';
    }

    // Fallback circular random generator
    const index = Math.floor(Math.random() * PROMPT_PRESETS.length);
    return PROMPT_PRESETS[index].videoUrl;
  };

  // Handle generation click
  const handleGenerate = () => {
    setValidationError(null);

    // Prompt check (can also have images, but prompt is nice)
    if (!prompt.trim() && images.length === 0) {
      setValidationError('错误：请输入画面创意提示词，或至少上传一张参考图像。');
      return;
    }

    // Start simulation progress bar
    setStatus('generating');
    setProgress(0);
    setCurrentStepIndex(0);
    
    // Choose appropriate mock video URL beforehand so progress completion binds correctly
    const targetVideoUrl = resolveMockVideoUrl(prompt);

    // Reset steps state
    setTimelineSteps(GENERATION_STEPS.map((s) => ({ ...s, status: 'pending' })));

    let currentProgress = 0;
    const intervalSpeed = engineModel === 'seedance2.0-fast' ? 75 : 180; // Fast engine operates at twice the speed
    
    const interval = setInterval(() => {
      // Accelerate or smooth step rates
      const stepIncrement = Math.floor(Math.random() * 4) + 2; // increments of 2-5%
      currentProgress = Math.min(100, currentProgress + stepIncrement);
      setProgress(currentProgress);

      // Determine step index according to min/max range limits
      const determinedIndex = GENERATION_STEPS.findIndex(
        (step) => currentProgress >= step.minProgress && currentProgress <= step.maxProgress
      );
      
      if (determinedIndex !== -1) {
        setCurrentStepIndex(determinedIndex);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Finalize metadata configuration parameters
        const newHistoryItem: GenerationHistoryItem = {
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          timestamp: Date.now(),
          params: {
            prompt: prompt || '未填提示词（图片模型生成）',
            images: [...images],
            resolution,
            duration,
            aspectRatio
          },
          videoUrl: targetVideoUrl,
          duration,
          resolution,
          aspectRatio,
          prompt: prompt || '无（参考图生成）'
        };

        // Cache parameters into the active viewport
        setActiveParams({
          videoUrl: targetVideoUrl,
          ratio: aspectRatio,
          prompt: prompt || '基于参考图标定生成',
          resolution: resolution,
          duration: duration
        });

        // Prepend new history record
        setHistory((prev) => [newHistoryItem, ...prev]);
        setStatus('success');
      }
    }, intervalSpeed);
  };

  // Load a prior history item back into the workspace state triggers
  const handleSelectHistory = (item: GenerationHistoryItem) => {
    setPrompt(item.params.prompt);
    setImages(item.params.images);
    setResolution(item.params.resolution);
    setDuration(item.params.duration);
    setAspectRatio(item.params.aspectRatio);

    setActiveParams({
      videoUrl: item.videoUrl,
      ratio: item.aspectRatio,
      prompt: item.prompt,
      resolution: item.resolution,
      duration: item.duration
    });
    
    setStatus('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete historical item
  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* HEADER SECTION with API key on top-right */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-900 px-4 py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo badge and title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/10 border border-indigo-400/20">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-100 font-display">
                  Seedance 2.0 视频生成工作台
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-500 text-white rounded">V2.0</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500">
                新代多级分块注意力扩散渲染架构，呈现极致画面一致性
              </p>
            </div>
          </div>

          {/* Prompt warning of plain API Key placement at the top-right corner as requested */}
          <div className="flex-shrink-0">
            <ApiKeyInput apiKey={apiKey} onKeyChange={setApiKey} />
          </div>

        </div>
      </header>

      {/* CORE WRAPPER GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column Controls: Prompt + Upload + Config (7 units large in standard visual ratio) */}
        <section col-span-12="true" className="lg:col-span-7 space-y-6">
          
          {/* Banner notification / state indicator */}
          {!apiKey.trim() && (
            <div className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-300 leading-relaxed animate-pulse">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold">安全提醒：</span>
                当前右上角的 API Key 未设定。虽支持跳过接口直接进行沙盒高保真动画模拟，但若需对接真实 API，请在右上方填入您的 Seedance API Key。支持明文输入及本地缓存。
              </div>
            </div>
          )}

          {/* Validation Warning Area */}
          {validationError && (
            <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl p-4 text-xs animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 1: Prompts config */}
          <PromptSection
            prompt={prompt}
            onPromptChange={(val) => {
              setPrompt(val);
              setValidationError(null);
            }}
            onSelectPreset={handleSelectPreset}
          />

          {/* Section 2: Reference Image Upload (up to 9 images) */}
          <ImageFilesUpload
            images={images}
            onImagesChange={(imgs) => {
              setImages(imgs);
              setValidationError(null);
            }}
          />

          {/* Section 3: Fine-Tune parameters (Resolution, Duration, Aspect Ratio) */}
          <ParametersSection
            resolution={resolution}
            onResolutionChange={setResolution}
            duration={duration}
            onDurationChange={setDuration}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            engineModel={engineModel}
            onEngineModelChange={handleEngineModelChange}
          />

          {/* Bottom Generation Trigger button */}
          <div className="pt-2">
            <button
              id="global-generate-btn"
              type="button"
              disabled={status === 'generating'}
              onClick={handleGenerate}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 select-none relative overflow-hidden ${
                status === 'generating'
                  ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white hover:shadow-indigo-500/15 cursor-pointer hover:border-indigo-400 border border-transparent'
              }`}
            >
              {status === 'generating' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>正在渲染 Seedance 视频帧 ({progress}%) ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>立即生成 Seedance 并行视频 (Generate Video)</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-3 mt-3.5 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-indigo-500" /> Auto-Scaling GPU Enabled
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-500" /> Seedance Flow 2.0 API Core
              </span>
            </div>
          </div>

        </section>

        {/* Right Column Monitor & history list (5 units wide) */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Timeline processing logs */}
          <GenerationTimeline
            progress={progress}
            status={status}
            steps={timelineSteps}
            currentStepIndex={currentStepIndex}
          />

          {/* Active outcome visualizer & Download Links & General history storage items */}
          <VideoPlayerOutput
            status={status}
            activeVideoUrl={activeParams.videoUrl}
            activeRatio={activeParams.ratio}
            activePrompt={activeParams.prompt}
            activeResolution={activeParams.resolution}
            activeDuration={activeParams.duration}
            history={history}
            onSelectHistory={handleSelectHistory}
            onDeleteHistory={handleDeleteHistory}
          />

        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-900 py-6 px-4 bg-slate-950 text-center text-[11px] text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 Seedance Engine, Inc. All rights reserved.</span>
          <span>采用 React + TailwindCSS 构建，专为 AI 创意资产流水线设计</span>
        </div>
      </footer>
    </div>
  );
}
