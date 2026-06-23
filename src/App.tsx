import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, Sparkles, Volume2, Flame, Play, Pause, Library, 
  Disc, Headphones, Info, Compass, HelpCircle, Heart, Share2, Plus, VolumeX
} from 'lucide-react';
import { Track, PlayerState } from './types';
import { MUSIC_PLAYLIST, formatDuration } from './data';
import Visualizer from './components/Visualizer';
import LyricViewer from './components/LyricViewer';
import Playlist from './components/Playlist';
import PlayerControls from './components/PlayerControls';

export default function App() {
  // 1. Queue Content States
  const [tracks, setTracks] = useState<Track[]>(MUSIC_PLAYLIST);
  const [currentTrack, setCurrentTrack] = useState<Track>(MUSIC_PLAYLIST[0]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customAudioUrl, setCustomAudioUrl] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customArtist, setCustomArtist] = useState<string>('');

  // 2. Playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.55);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  // 3. Audio HTML node ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 4. Interaction compliance Overlay (to fix browser autoplay blocks gracefully)
  const [needsGesture, setNeedsGesture] = useState<boolean>(true);

  // Initial stream setup hooks
  useEffect(() => {
    // Instantiate new Audio element
    const audio = new Audio(currentTrack.audioUrl);
    audio.volume = volume;
    audio.loop = isLooping;
    audioRef.current = audio;

    // Register audio lifecycle listeners
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      handleNextTrack();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    // Prompt immediate load
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Sync track swap
  const changeTrack = (track: Track, shouldPlayImmediately: boolean = true) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      
      setCurrentTrack(track);
      setCurrentTime(0);

      if (shouldPlayImmediately) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setNeedsGesture(false);
          })
          .catch((err) => {
            console.log('Autoplay restriction blocked play on track swap:', err);
            setIsPlaying(false);
          });
      } else {
        setIsPlaying(false);
      }
    }
  };

  // Sync volume level updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync looping modes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  // Playback Toggle Handlers
  const handlePlayPause = () => {
    if (needsGesture) {
      setNeedsGesture(false);
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log('Standard play method failed to resolve:', err);
          });
      }
    }
  };

  const handleNextTrack = () => {
    if (isShuffling) {
      const randIdx = Math.floor(Math.random() * tracks.length);
      changeTrack(tracks[randIdx]);
    } else {
      const idx = tracks.findIndex((t) => t.id === currentTrack.id);
      const nextIdx = (idx + 1) % tracks.length;
      changeTrack(tracks[nextIdx]);
    }
  };

  const handlePrevTrack = () => {
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + tracks.length) % tracks.length;
    changeTrack(tracks[prevIdx]);
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (newVol > 0) {
      setIsMuted(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  // User imports custom URL for testing
  const handleAddCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAudioUrl.trim() || !customTitle.trim()) return;

    const newTrack: Track = {
      id: `custom_${Date.now()}`,
      title: customTitle,
      artist: customArtist || '流式原音 (Unknown Artist)',
      album: '自定流播源',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
      audioUrl: customAudioUrl.trim(),
      genre: '流式网络音频',
      duration: '03:45',
      lyrics: [
        { time: 0, text: '🎵 [网络音频源正在读取中]' },
        { time: 10, text: '暂无嵌入歌词，尽情享受流式美感' }
      ]
    };

    setTracks((prev) => [...prev, newTrack]);
    changeTrack(newTrack);
    
    // Clear inputs
    setCustomAudioUrl('');
    setCustomTitle('');
    setCustomArtist('');
  };

  // Overlay Play click gesture
  const handleAcknowledgeAutoplay = () => {
    setNeedsGesture(false);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log('Overlay clicked but autoplay still restricted:', err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-850 flex flex-col font-sans select-none relative overflow-hidden">
      
      {/* AMBIENT GLOWING ORBS WITH LIGHT FILTER */}
      <div className="absolute top-[-25%] left-[-20%] w-[80%] h-[80%] rounded-full bg-indigo-200/40 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-200/40 blur-[120px] pointer-events-none" />

      {/* 1. Header Area with logo & stream status */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-sky-450 flex items-center justify-center border border-indigo-400/20 shadow-sm">
              <Headphones className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 font-display">
                Nebula Aura Music Player
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                高保真无损原音流式体验模式 (Light Luxe)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs bg-indigo-50 border border-indigo-100 text-indigo-600 font-mono font-bold px-3 py-1.5 rounded-xl shadow-xs">
              HQ Aether Stream
            </span>
          </div>
        </div>
      </header>

      {/* AUTO PLAY COMPLIANT GESTURE OVERLAY */}
      {needsGesture && (
        <div id="gesture-overlay" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in animate-duration-300">
          <div className="max-w-sm bg-white border border-slate-100 p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 to-sky-400" />
            
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto border border-indigo-105 animate-pulse">
              <Compass className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">高保真音乐播放器已准备就绪</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                受浏览器和现代安全协定限制，需用户轻触激活音频解码引擎。点击下方按钮，开始体验奢华乐章。
              </p>
            </div>

            <button
              id="activate-audio-btn"
              type="button"
              onClick={handleAcknowledgeAutoplay}
              className="w-full py-3 px-5 rounded-2xl bg-indigo-605 hover:bg-indigo-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-indigo-600/15 cursor-pointer hover:scale-102 transition-all"
            >
              一键开启高品质试听
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER WORKSPACE GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Vinyl disc + Controls + Simulated Visuals (7 units large) */}
        <section className="lg:col-span-7 space-y-6">
          
          {/* Active Audio State Panel */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 relative overflow-hidden min-h-[300px] flex flex-col justify-between shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <Disc className="w-48 h-48 animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            {/* Core Artwork Metadata Area */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              
              {/* Rotating custom vinyl CD disk */}
              <div className="relative flex-shrink-0">
                <div 
                  className={`w-40 h-40 rounded-full bg-slate-900 p-2.5 border-4 border-slate-200 shadow-xl relative flex items-center justify-center transition-transform ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '15s', animationTimingFunction: 'linear' }}
                >
                  {/* Outer vinyl track patterns */}
                  <div className="absolute inset-2 border border-slate-950/20 rounded-full" />
                  <div className="absolute inset-5 border border-slate-950/20 rounded-full" />
                  <div className="absolute inset-8 border border-slate-950/20 rounded-full" />

                  {/* Album Cover wrap */}
                  <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-950 relative">
                    <img
                      src={currentTrack.coverUrl}
                      alt={currentTrack.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {/* Tiny spindle hole */}
                    <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-slate-950 border border-slate-805 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    </div>
                  </div>
                </div>

                {/* Aesthetic tonearm stylus needle indicator */}
                <div 
                  className="absolute top-0 right-[-15px] h-20 w-8 origin-top transition-transform duration-500 ease-out pointer-events-none hidden sm:block"
                  style={{
                    transform: isPlaying ? 'rotate(18deg)' : 'rotate(-10deg)'
                  }}
                >
                  <div className="w-1.5 h-16 bg-slate-400 rounded-full relative ml-2 shadow-sm">
                    <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-slate-300" />
                    <div className="absolute bottom-0 right-[-3px] w-3 h-4 bg-slate-355 rounded-xs origin-top rotate-[-12deg]" />
                  </div>
                </div>
              </div>

              {/* Title & info text details */}
              <div className="text-center sm:text-left space-y-3 flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] text-indigo-650 font-bold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{currentTrack.genre}</span>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-850 tracking-tight leading-tight select-text truncate">
                    {currentTrack.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                    {currentTrack.artist} — 《<span className="italic">{currentTrack.album}</span>》
                  </p>
                </div>

                {/* Social interactive buttons */}
                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs pt-1">
                  <button
                    id="toggle-favourite-btn"
                    type="button"
                    onClick={() => toggleFavorite(currentTrack.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      favorites.includes(currentTrack.id) ? 'text-rose-500 font-bold font-semibold' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(currentTrack.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{favorites.includes(currentTrack.id) ? '已收藏' : '加入收藏'}</span>
                  </button>

                  <button
                    id="social-share-btn"
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentTrack.audioUrl);
                      alert('高无损音频直链已复制至剪贴板，快和好友一起分享聆听吧！');
                    }}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>分享源链接</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Simulated Live Visuals Frequency spectrum */}
            <div className="mt-6">
              <Visualizer isPlaying={isPlaying} />
            </div>

          </div>

          {/* Active Audio controls Panel */}
          <PlayerControls
            currentTrack={currentTrack}
            state={{
              isPlaying,
              currentTime,
              duration,
              volume,
              isMuted,
              isLooping,
              isShuffling
            }}
            onPlayPause={handlePlayPause}
            onNext={handleNextTrack}
            onPrev={handlePrevTrack}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleShuffle={() => setIsShuffling(!isShuffling)}
            onToggleLoop={() => setIsLooping(!isLooping)}
          />

          {/* User Custom Stream Injection Form */}
          <div id="add-track-card" className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-semibold text-slate-800">添加自定义流媒体音频 (User Testing Source)</h3>
            </div>
            
            <form onSubmit={handleAddCustomTrack} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="custom-title-input" className="text-slate-500 text-[10px]">歌曲名称 (Title)*</label>
                  <input
                    id="custom-title-input"
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="例如: 极品节奏"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="custom-artist-input" className="text-slate-500 text-[10px]">演唱/演奏者 (Artist)</label>
                  <input
                    id="custom-artist-input"
                    type="text"
                    value={customArtist}
                    onChange={(e) => setCustomArtist(e.target.value)}
                    placeholder="例如: 独立乐师"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="custom-url-input" className="text-slate-500 text-[10px]">直接流媒体音频 URL (Stream MP3 Direct URL)*</label>
                <input
                  id="custom-url-input"
                  type="url"
                  required
                  value={customAudioUrl}
                  onChange={(e) => setCustomAudioUrl(e.target.value)}
                  placeholder="https://example.com/sound.mp3"
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>

              <button
                id="submit-custom-track"
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                加入当前播放列表
              </button>
            </form>
          </div>

        </section>

        {/* Right column: Dynamic scrolling local lyrics + track playlists queue (5 units wide) */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Dynamic Sync lyrics pane */}
          <LyricViewer
            lyrics={currentTrack.lyrics}
            currentTime={currentTime}
          />

          {/* Regular track queue container */}
          <Playlist
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectTrack={(track) => changeTrack(track, true)}
            onRemoveTrack={(id) => {
              // Safeguard against emptying the active tracks completely
              if (tracks.length <= 1) {
                alert('播放队列必须至少保留一首可演奏乐曲！');
                return;
              }
              const remaining = tracks.filter((t) => t.id !== id);
              setTracks(remaining);
              if (currentTrack.id === id) {
                changeTrack(remaining[0], isPlaying);
              }
            }}
          />

          {/* Tiny helpful guide context box */}
          <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-normal space-y-1.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span>声学提示 & 使用贴士</span>
            </h4>
            <p>1. 本系统已自带4首精心挑选的公版无损测试音源，可在右上角随时一键切换。</p>
            <p>2. 支持中英文混校智能流动歌词，系统会根据播放进度百分百自动高亮并回滚视觉中心。</p>
          </div>

        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 py-6 px-4 bg-slate-100 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 Nebula Aura Inc. All rights reserved.</span>
          <span>采用 React + H5 WebAudio + TailwindCSS 构建，极致声学美学工程设计</span>
        </div>
      </footer>
    </div>
  );
}
