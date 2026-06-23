import React, { useState } from 'react';
import { Track } from '../types';
import { Music, Play, Disc, Trash2, Search, SlidersHorizontal, ListMusic } from 'lucide-react';

interface PlaylistProps {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onRemoveTrack?: (id: string) => void;
}

export default function Playlist({
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onRemoveTrack
}: PlaylistProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', ...Array.from(new Set(tracks.map((t) => t.genre.split(' ')[0])))];

  // Filtering criteria based on search inputs
  const filteredTracks = tracks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || t.genre.startsWith(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div id="playlist-manager-card" className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-150 pb-2.5">
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-semibold text-slate-800">播放列表 (Current Queue)</h3>
        </div>
        <span className="text-[10px] bg-slate-100 font-mono text-indigo-600 px-2 py-0.5 rounded-md border border-slate-200">
          共 {tracks.length} 首
        </span>
      </div>

      {/* Track Search and Genre Filters */}
      <div className="space-y-2">
        <div className="relative">
          <input
            id="track-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索歌名、创作人..."
            className="w-full bg-slate-50 placeholder-slate-400 text-xs px-3 py-2 pr-8 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-slate-800 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
        </div>

        {/* Categories / Genres */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {genres.map((g) => (
            <button
              id={`genre-pill-${g}`}
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                selectedGenre === g
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-650 shadow-xs'
                  : 'bg-slate-50/85 border-slate-200/60 text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Tracks Container */}
      <div id="tracks-queue-list" className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
        {filteredTracks.map((track) => {
          const isCurrent = track.id === currentTrack.id;
          
          return (
            <div
              id={`queue-item-${track.id}`}
              key={track.id}
              onClick={() => onSelectTrack(track)}
              className={`group flex items-center justify-between p-2 rounded-xl transition-all border cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-50/70 border-indigo-200/60 hover:bg-indigo-50'
                  : 'bg-slate-50/60 border-transparent hover:bg-slate-100 hover:border-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Playing Visual Indicator Cover */}
                <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {isCurrent && (
                    <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-xs flex items-center justify-center">
                      {isPlaying ? (
                        <div id="playing-equalizer-dots" className="flex items-end gap-[2px] h-3">
                          <span className="w-[2px] bg-indigo-300 rounded-t-xs animate-bounce h-2" />
                          <span className="w-[2px] bg-indigo-300 rounded-t-xs animate-bounce h-3" style={{ animationDelay: '0.1s' }} />
                          <span className="w-[2px] bg-indigo-300 rounded-t-xs animate-bounce h-1.5" style={{ animationDelay: '0.2s' }} />
                        </div>
                      ) : (
                        <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
                      )}
                    </div>
                  )}
                </div>

                {/* Track titles */}
                <div className="min-w-0">
                  <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-indigo-650' : 'text-slate-800'}`}>
                    {track.title}
                  </h4>
                  <p className="text-[10px] text-slate-555 truncate mt-0.5">
                    {track.artist} • <span className="italic">{track.album}</span>
                  </p>
                </div>
              </div>

              {/* End details: track duration tag & delete triggers */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400 font-medium">
                  {track.duration}
                </span>

                {onRemoveTrack && (
                  <button
                    id={`delete-track-btn-${track.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTrack(track.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer"
                    title="移出列表"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}

        {filteredTracks.length === 0 && (
          <div className="text-center py-10 px-2 text-slate-400 text-[10px] italic">
            没有找到合适配对的音乐
          </div>
        )}
      </div>

    </div>
  );
}
