import React from 'react';
import { WallpaperItem } from '../utils/wallpaper-engine';
import { X, Trash2, Heart, Download, RefreshCw, Smartphone } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: WallpaperItem[];
  onSelectWallpaper: (item: WallpaperItem) => void;
  onClearHistory: () => void;
  onToggleFavorite: (id: string) => void;
  favorites: Set<string>;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectWallpaper,
  onClearHistory,
  onToggleFavorite,
  favorites,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wallpaper history and saved favorites"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-slate-900 border-l border-white/10 p-5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-base text-white">Your Wallpaper Gallery</h3>
              <p className="text-xs text-slate-400">{history.length} saved creations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                aria-label="Clear all wallpaper history"
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs transition-colors"
                title="Clear History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close history drawer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Wallpaper Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Smartphone className="w-12 h-12 text-slate-600 mb-3 stroke-[1.5]" />
              <p className="font-semibold text-sm text-slate-300">No wallpapers saved yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Your generated and favorited wallpapers will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {history.map((item) => {
                const isFav = favorites.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectWallpaper(item);
                      onClose();
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View wallpaper: ${item.prompt}`}
                    className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-950 border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all shadow-md"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Top heart badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md border ${
                        isFav ? 'bg-rose-500/80 border-rose-400 text-white' : 'bg-black/60 border-white/10 text-white/80'
                      }`}
                    >
                      <Heart className="w-3 h-3" fill={isFav ? 'currentColor' : 'none'} />
                    </button>

                    {/* Bottom Prompt Bar */}
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <p className="text-[10px] text-white font-medium line-clamp-1">{item.prompt}</p>
                      <div className="text-[9px] text-cyan-300 font-mono mt-0.5">
                        {item.aspectRatio} • {item.imageSize}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
