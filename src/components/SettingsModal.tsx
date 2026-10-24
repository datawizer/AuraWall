import React from 'react';
import { X, Sparkles, Smartphone, CheckCircle2, Shield, Info } from 'lucide-react';
import { ModelType, ImageSize, AspectRatio } from '../utils/wallpaper-engine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: ModelType;
  onChangeModel: (model: ModelType) => void;
  currentSize: ImageSize;
  onChangeSize: (size: ImageSize) => void;
  currentRatio: AspectRatio;
  onChangeRatio: (ratio: AspectRatio) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  onChangeModel,
  currentSize,
  onChangeSize,
  currentRatio,
  onChangeRatio,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Studio settings and specifications"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">Wallpaper Studio Specs</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* AI Model Architecture */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Image Generation Engine
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                {currentModel}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipped with <span className="text-white font-medium">gemini-3-pro-image-preview</span> for studio-quality mobile wallpaper rendering and high-res details, and <span className="text-white font-medium">gemini-nano-banana-2.1</span> for ultra-fast generation.
            </p>
          </div>

          {/* Resolution Specs */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                Resolution Affordance (1K, 2K, 4K)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                Active: {currentSize}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => onChangeSize(size)}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-colors ${
                    currentSize === size
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {size} {size === '4K' ? 'Retina' : size === '2K' ? 'HD' : 'Standard'}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Specs */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400" />
                Aspect Ratio Control
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Active: {currentRatio}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Supports full aspect ratio control: 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, and 21:9.
            </p>
          </div>

          {/* Features Checklist */}
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>4 variation diversification with perspective synthesis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Reference image remixing for continuous style evolution</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Interactive real-time phone lock screen simulation</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-colors"
        >
          Close Specifications
        </button>
      </div>
    </div>
  );
};
