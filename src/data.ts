import { AspectRatio, Resolution, TimelineStep } from './types';

export interface PromptPreset {
  id: string;
  category: string;
  title: string;
  promptCn: string;
  promptEn: string;
  videoUrl: string;
}

export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'space_portal',
    category: '科幻',
    title: '星际跃迁',
    promptCn: '一艘科技感十足的飞船穿过深空中的环形虫洞，周围是粒子星云和引力扭曲。超级大片，写实，史诗光影。',
    promptEn: 'A cinematic shot of a futuristic sleek spaceship traveling through a spinning wormhole portal in deep space, surrounded by glowing nebula particles and gravity distortions, ultra-detailed, 8k resolution, cosmic lights.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-44101-large.mp4' // Representing tech tunnel/portal
  },
  {
    id: 'cyberpunk_neon',
    category: '赛博朋克',
    title: '雨夜霓虹',
    promptCn: '下过雨后的赛博朋克夜间街区，粉蓝相间的霓虹灯折射在湿滑的地面，一个穿着风衣的神秘人在蒸汽中独自前行。',
    promptEn: 'Rain-slicked cyberpunk alley with hyper-detailed magenta and cyan neon signs, glowing reflections on wet asphalt, a lone figure in a techwear cloak walking into misty steam, cinematic compositing.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-neon-city-street-at-night-41584-large.mp4'
  },
  {
    id: 'nature_waterfall',
    category: '自然风光',
    title: '晨曦飞瀑',
    promptCn: '清晨云雾环绕的绿色高山峡谷，一挂壮丽的瀑布倾泻而下，阳光穿过雾气洒在波光粼粼的水面。航拍镜头极其震撼。',
    promptEn: 'Breathtaking drone flyby of a pristine mountain canyon covered in dense green pines, majestic twin waterfalls cascading into a serene crystal river beneath golden morning sun beams, professional color grading.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4'
  },
  {
    id: 'liquid_dream',
    category: '艺术抽象',
    title: '梦幻流动',
    promptCn: '宏观特写：五彩斑斓的流体在缓慢交融扭动，金属光泽与梦幻色彩波纹互动，极慢动作，唯美细腻。',
    promptEn: 'Macro close-up of colorful iridescent metallic fluids blending slowly, dynamic wave patterns, pastel gradient swirls with liquid chrome reflections, premium commercial vibe, 120fps slow-motion.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-1427-large.mp4' // Represents natural rhythmic fluids
  },
  {
    id: 'mystic_forest',
    category: '魔幻',
    title: '迷雾山涧',
    promptCn: '穿过森林的清澈溪流，两岸有荧光蘑菇散发微光，微风吹拂树叶，阳光透过树冠，带着魔法般的唯美感觉。',
    promptEn: 'Shallow panning shot of a clean stream winding through a dense mossy forest with subtle magical glowing spores, soft morning light godrays piercing through old oak canopy, mystical fantasy atmosphere.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-small-stream-in-the-forest-2244-large.mp4'
  }
];

export const ASPECT_RATIOS: { value: AspectRatio; label: string; aspectClass: string; iconW: number; iconH: number }[] = [
  { value: '21:9', label: '21:9 (电影宽画幅)', aspectClass: 'aspect-[21/9]', iconW: 24, iconH: 10 },
  { value: '16:9', label: '16:9 (横屏/电视)', aspectClass: 'aspect-video', iconW: 20, iconH: 11 },
  { value: '4:3', label: '4:3 (经典屏幕)', aspectClass: 'aspect-[4/3]', iconW: 16, iconH: 12 },
  { value: '3:4', label: '3:4 (竖屏拍摄)', aspectClass: 'aspect-[3/4]', iconW: 12, iconH: 16 },
  { value: '9:16', label: '9:16 (手机短视频)', aspectClass: 'aspect-[9/16]', iconW: 10, iconH: 18 }
];

export const RESOLUTIONS: { value: Resolution; label: string; desc: string }[] = [
  { value: '480p', label: '480p (标清)', desc: '速度最快，适用于快速预览测试' },
  { value: '720p', label: '720p (高清)', desc: '清晰度良好，平衡处理所需时长' },
  { value: '1080p', label: '1080p (全高清)', desc: '极高画质细节，呈现出画面的微小纹理' }
];

export const GENERATION_STEPS: TimelineStep[] = [
  {
    id: 'setup',
    label: '初始化引擎',
    description: '加载 Seedance 2.0 节点配置，建立安全传输加密通道。',
    status: 'pending',
    minProgress: 0,
    maxProgress: 15
  },
  {
    id: 'parser',
    label: '分析图像与文本嵌入',
    description: '利用大模型深度解析提示词，重塑参考图片的3D物理空间锚点。',
    status: 'pending',
    minProgress: 15,
    maxProgress: 35
  },
  {
    id: 'motion',
    label: '解算时序运动轨迹',
    description: 'Seedance 物理引擎生成多维矢量运动速度，确保前后帧过渡平滑无闪烁。',
    status: 'pending',
    minProgress: 35,
    maxProgress: 55
  },
  {
    id: 'diffusion',
    label: '多级去噪时域渲染',
    description: '多维分块注意力扩散（SD Latent Space Processing），迭代 50 Steps 生成无损帧。',
    status: 'pending',
    minProgress: 55,
    maxProgress: 85
  },
  {
    id: 'upscale',
    label: '细节重建与画质增强',
    description: '进行超分辨率重构，插帧补充音频，封装高码率 H.264/AAC 容器。',
    status: 'pending',
    minProgress: 85,
    maxProgress: 100
  }
];

export function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
