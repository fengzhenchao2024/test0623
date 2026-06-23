export type Resolution = '480p' | '720p' | '1080p';

export type AspectRatio = '21:9' | '16:9' | '4:3' | '3:4' | '9:16';

export type EngineModel = 'seedance2.0' | 'seedance2.0-fast';

export interface UploadedImage {
  id: string;
  name: string;
  url: string; // Base64 data URL string for local preview
  size: string; // Formatting like "1.2 MB"
}

export type GeneratorStatus = 'idle' | 'generating' | 'success' | 'failed';

export interface GenerationParams {
  prompt: string;
  images: UploadedImage[];
  resolution: Resolution;
  duration: number; // 4 to 15 seconds
  aspectRatio: AspectRatio;
}

export interface TimelineStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  minProgress: number; // For simulating the progress bar
  maxProgress: number;
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: number;
  params: GenerationParams;
  videoUrl: string;
  duration: number;
  resolution: Resolution;
  aspectRatio: AspectRatio;
  prompt: string;
}
