import React, { useState, useEffect } from 'react';
import { WallpaperItem, sanitizeFilename } from '../utils/wallpaper-engine';
import {
  X,
  Download,
  RefreshCw,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Smartphone,
  Sparkles,
  Share2,
  Check,
  Flashlight,
  Camera,
} from 'lucide-react';

interface LightboxModalProps {
  wallpaper: WallpaperItem;
  allWallpapers: WallpaperItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemix: (wallpaper: WallpaperItem) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  onSelectIndex: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  wallpaper,
  allWallpapers,
  isOpen,
  onClose,
  onRemix,
  onToggleFavorite,
  isFavorite,
  onSelectIndex,
}) => {
  const [showPhoneOverlay, setShowPhoneOverlay] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [currentDate, setCurrentDate] = useState('Wednesday, October 21');

  // Update clock to current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, wallpaper, allWallpapers]);

  if (!isOpen) return null;

  const currentIndex = allWallpapers.findIndex((w) => w.id === wallpaper.id);
  const totalCount = allWallpapers.length;

  const handlePrev = () => {
    if (totalCount <= 1) return;
    const prevIdx = (currentIndex - 1 + totalCount) % totalCount;
    onSelectIndex(prevIdx);
  };

  const handleNext = () => {
    if (totalCount <= 1) return;
    const nextIdx = (currentIndex + 1) % totalCount;
    onSelectIndex(nextIdx);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const filename = sanitizeFilename(wallpaper.prompt, wallpaper.id);

      // Handle SVG data URLs or base64 images
      if (wallpaper.imageUrl.startsWith('data:image/svg+xml')) {
        // Convert SVG to Canvas to trigger high-res PNG download
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = wallpaper.imageUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        const link = document.createElement('a');
        link.href = wallpaper.imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(wallpaper.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full screen wallpaper preview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
    >
      {/* Top Floating App Bar */}
      <div className="absolute top-0 inset-x-0 z-40 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
        {/* Left: Counter & Title */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onClose}
            aria-label="Close full screen view"
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white shadow-xl transition-transform active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="hidden sm:block px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
            <span className="text-cyan-400 font-bold">Variation #{wallpaper.variationIndex + 1}</span>
            <span className="text-slate-400 mx-1.5">•</span>
            <span className="text-slate-300">{wallpaper.variationTitle}</span>
          </div>
        </div>

        {/* Right: Lock Screen Mockup Toggle & Favorite */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Phone Overlay Toggle */}
          <button
            onClick={() => setShowPhoneOverlay(!showPhoneOverlay)}
            aria-label={showPhoneOverlay ? 'Hide Lock Screen Overlay' : 'Show Lock Screen Overlay'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold backdrop-blur-md transition-all ${
              showPhoneOverlay
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25'
                : 'bg-black/60 hover:bg-black/90 border-white/15 text-white'
            }`}
          >
            {showPhoneOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {showPhoneOverlay ? 'Hide Lock Screen' : 'Phone Lock Screen'}
            </span>
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite(wallpaper.id)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2.5 rounded-full border backdrop-blur-md transition-colors ${
              isFavorite
                ? 'bg-rose-500/80 border-rose-400 text-white'
                : 'bg-black/60 hover:bg-black/90 border-white/15 text-white'
            }`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Main Wallpaper Display Area */}
      <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-6 select-none overflow-hidden">
        {/* Previous Variation Button */}
        {totalCount > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous wallpaper variation"
            className="absolute left-2 sm:left-6 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white shadow-xl transition-all hidden sm:flex items-center justify-center hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Variation Button */}
        {totalCount > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next wallpaper variation"
            className="absolute right-2 sm:right-6 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white shadow-xl transition-all hidden sm:flex items-center justify-center hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Wallpaper Image Container (Phone Frame Proportions) */}
        <div
          className={`relative max-h-[85vh] sm:max-h-[88vh] rounded-3xl overflow-hidden shadow-2xl border border-white/15 transition-all duration-300 ${
            wallpaper.aspectRatio === '9:16'
              ? 'aspect-[9/16] w-auto h-full max-w-[420px]'
              : 'max-w-full max-h-[85vh]'
          }`}
        >
          <img
            src={wallpaper.imageUrl}
            alt={wallpaper.prompt}
            className="w-full h-full object-cover"
          />

          {/* REALISTIC PHONE LOCK SCREEN OVERLAY */}
          {showPhoneOverlay && (
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 bg-gradient-to-b from-black/40 via-transparent to-black/60 animate-in fade-in duration-200">
              {/* Dynamic Island / Notch + Status bar */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-6 rounded-full bg-black/90 border border-white/10 shadow-lg mb-2 flex items-center justify-between px-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <div className="w-2 h-2 rounded-full bg-cyan-500/80 animate-pulse" />
                </div>
                <div className="w-full flex items-center justify-between text-[11px] font-semibold text-white/90 px-2">
                  <span>5G</span>
                  <span>98%</span>
                </div>
              </div>

              {/* Big Digital Clock & Date */}
              <div className="text-center my-auto -mt-12 space-y-1">
                <div className="text-xs uppercase tracking-widest font-semibold text-white/80 drop-shadow">
                  {currentDate}
                </div>
                <div className="text-7xl sm:text-8xl font-bold tracking-tight text-white font-mono drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {currentTime}
                </div>

                {/* Sample Widget */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs text-white/90 shadow-lg mt-3">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Aura: 72° • Clear Sky</span>
                </div>
              </div>

              {/* Bottom Quick Tools (Flashlight & Camera) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white shadow-lg">
                    <Flashlight className="w-5 h-5" />
                  </div>
                  <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-lg border border-white/20 flex items-center justify-center text-white shadow-lg">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>

                {/* Home Indicator Bar */}
                <div className="w-32 h-1 bg-white/70 rounded-full mx-auto" />
              </div>
            </div>
          )}

          {/* Aspect Ratio & Quality Badge (hidden when phone lock screen is on to avoid overlap) */}
          {!showPhoneOverlay && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white shadow">
                {wallpaper.aspectRatio}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-cyan-300 shadow">
                {wallpaper.imageSize}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Control Bar (Download & Remix) */}
      <div className="absolute bottom-0 inset-x-0 z-40 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col items-center gap-3">
        {/* Prompt Caption */}
        <div className="max-w-xl text-center px-4">
          <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-1">
            "{wallpaper.prompt}"
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center justify-center gap-3 w-full max-w-md">
          {/* REMIX BUTTON (Mandated) */}
          <button
            onClick={() => onRemix(wallpaper)}
            aria-label="Remix wallpaper: use as reference for next batch"
            className="flex-1 py-3.5 px-4 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Remix Variation</span>
          </button>

          {/* DOWNLOAD BUTTON (Mandated) */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            aria-label="Download high-resolution wallpaper"
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25 transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-white" />
            <span>{isDownloading ? 'Saving...' : 'Download Image'}</span>
          </button>

          {/* Copy Prompt / Share */}
          <button
            onClick={handleCopyPrompt}
            aria-label="Copy wallpaper prompt"
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Swipe / Arrow Hint */}
        <div className="text-[11px] text-slate-400 font-medium sm:hidden">
          Swipe or tap outside to close • Variation {currentIndex + 1} of {totalCount}
        </div>
      </div>
    </div>
  );
};
