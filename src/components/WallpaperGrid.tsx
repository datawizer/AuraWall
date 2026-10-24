import React from 'react';
import {
  WallpaperItem,
  AspectRatio,
  getAspectRatioStyle,
  VARIATION_DIRECTIVES,
} from '../utils/wallpaper-engine';
import { Maximize2, RefreshCw, Heart, Sparkles, Smartphone, Download } from 'lucide-react';

interface WallpaperGridProps {
  wallpapers: (WallpaperItem | null)[];
  aspectRatio: AspectRatio;
  isLoading: boolean;
  loadingSlots: boolean[];
  onSelectWallpaper: (item: WallpaperItem) => void;
  onRemixWallpaper: (item: WallpaperItem) => void;
  onToggleFavorite: (id: string) => void;
  onRegenerateSlot: (index: number) => void;
  favorites: Set<string>;
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({
  wallpapers,
  aspectRatio,
  isLoading,
  loadingSlots,
  onSelectWallpaper,
  onRemixWallpaper,
  onToggleFavorite,
  onRegenerateSlot,
  favorites,
}) => {
  const aspectClass = getAspectRatioStyle(aspectRatio);

  return (
    <div className="w-full space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">
            4 Generated Variations
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Tap any wallpaper to view full screen & remix
        </span>
      </div>

      {/* 4 Variations Grid (2x2 on mobile & desktop) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {[0, 1, 2, 3].map((slotIndex) => {
          const item = wallpapers[slotIndex];
          const isSlotLoading = loadingSlots[slotIndex];
          const directive = VARIATION_DIRECTIVES[slotIndex];
          const isFavorite = item ? favorites.has(item.id) : false;

          return (
            <div
              key={slotIndex}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden glass-card border border-white/10 transition-all shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/40 ${aspectClass} flex flex-col justify-between`}
            >
              {/* If slot is loading */}
              {isSlotLoading ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                  <div className="relative w-12 h-12 flex items-center justify-center mb-3">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                    <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
                  </div>
                  <div className="text-center space-y-1 max-w-[140px]">
                    <span className="text-[11px] font-bold text-cyan-300 block">
                      Variation #{slotIndex + 1}
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      {directive.title}
                    </p>
                  </div>
                  {/* Shimmer bar */}
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
                    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-indigo-500 animate-shimmer" />
                  </div>
                </div>
              ) : null}

              {/* Wallpaper Image or Empty Slot */}
              {item ? (
                <div
                  className="w-full h-full relative cursor-pointer group"
                  onClick={() => onSelectWallpaper(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectWallpaper(item);
                    }
                  }}
                  aria-label={`View Variation ${slotIndex + 1} (${item.variationTitle}) full screen`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Top Bar on Card */}
                  <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white shadow">
                      #{slotIndex + 1} • {item.variationTitle.split(' ')[0]}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.id);
                        }}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        className={`p-1.5 rounded-full backdrop-blur-md border transition-colors ${
                          isFavorite
                            ? 'bg-rose-500/80 border-rose-400 text-white'
                            : 'bg-black/60 border-white/10 text-white/80 hover:text-white'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Overlay on Card */}
                  <div className="absolute bottom-0 inset-x-0 p-2 sm:p-2.5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end justify-between z-10">
                    <div className="min-w-0 pr-1">
                      <div className="text-[10px] sm:text-xs font-bold text-cyan-300 truncate">
                        {item.variationTitle}
                      </div>
                      <div className="text-[9px] text-slate-300 font-mono flex items-center gap-1">
                        <span>{item.aspectRatio}</span>
                        <span>•</span>
                        <span>{item.imageSize}</span>
                        {item.isRemix && (
                          <span className="text-cyan-400 font-bold ml-0.5">REMIX</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemixWallpaper(item);
                        }}
                        aria-label={`Remix Variation ${slotIndex + 1}`}
                        title="Remix with this image"
                        className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/30 text-cyan-200 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      <div
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                        title="View Fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty / Initial Placeholder */
                <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white/[0.02] text-center space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                    <span className="font-bold text-xs">#{slotIndex + 1}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">
                      {directive.title}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                      {directive.subheading}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRegenerateSlot(slotIndex)}
                    disabled={isLoading}
                    aria-label={`Generate variation slot ${slotIndex + 1}`}
                    className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 pt-1"
                  >
                    + Tap to generate
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
