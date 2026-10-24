import React, { useState } from 'react';
import {
  AspectRatio,
  ImageSize,
  ModelType,
  ASPECT_RATIOS,
  IMAGE_SIZES,
} from '../utils/wallpaper-engine';
import { Smartphone, Monitor, Square, SlidersHorizontal, Sparkles, Check, ChevronDown } from 'lucide-react';

interface ControlsBarProps {
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  imageSize: ImageSize;
  onChangeImageSize: (size: ImageSize) => void;
  model: ModelType;
  onChangeModel: (model: ModelType) => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  aspectRatio,
  onChangeAspectRatio,
  imageSize,
  onChangeImageSize,
  model,
  onChangeModel,
}) => {
  const [showRatioModal, setShowRatioModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  const currentRatioOption = ASPECT_RATIOS.find((r) => r.id === aspectRatio) || ASPECT_RATIOS[0];
  const currentSizeOption = IMAGE_SIZES.find((s) => s.id === imageSize) || IMAGE_SIZES[0];

  return (
    <div className="w-full">
      {/* Quick Affordance Bar */}
      <div className="grid grid-cols-3 gap-2 p-1.5 sm:p-2 rounded-2xl bg-white/[0.04] border border-white/10">
        {/* Aspect Ratio Selector Trigger */}
        <button
          type="button"
          onClick={() => setShowRatioModal(true)}
          aria-label={`Aspect ratio: ${currentRatioOption.label} (${currentRatioOption.sublabel})`}
          className="flex items-center justify-between gap-1 sm:gap-2 px-2.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 transition-colors text-left"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              {currentRatioOption.id === '9:16' ? (
                <Smartphone className="w-3.5 h-3.5" />
              ) : currentRatioOption.id === '1:1' ? (
                <Square className="w-3.5 h-3.5" />
              ) : (
                <Monitor className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Ratio</div>
              <div className="text-xs font-bold text-white truncate">
                {currentRatioOption.label}
              </div>
            </div>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 hidden sm:block" />
        </button>

        {/* Resolution / Image Size Trigger */}
        <button
          type="button"
          onClick={() => setShowSizeModal(true)}
          aria-label={`Image resolution: ${currentSizeOption.label} (${currentSizeOption.badge})`}
          className="flex items-center justify-between gap-1 sm:gap-2 px-2.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 transition-colors text-left"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
              {imageSize}
            </div>
            <div className="min-w-0">
              <div className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Quality</div>
              <div className="text-xs font-bold text-white truncate">
                {currentSizeOption.label} <span className="text-[10px] font-normal text-slate-400">({currentSizeOption.badge})</span>
              </div>
            </div>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 hidden sm:block" />
        </button>

        {/* Model Affordance Toggle */}
        <button
          type="button"
          onClick={() => {
            const next = model === 'gemini-3-pro-image-preview' ? 'gemini-nano-banana-2.1' : 'gemini-3-pro-image-preview';
            onChangeModel(next);
          }}
          aria-label={`Switch AI Model. Currently: ${model}`}
          className="flex items-center justify-between gap-1 sm:gap-2 px-2.5 py-2 rounded-xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 hover:from-cyan-900/40 hover:to-indigo-900/40 border border-cyan-500/30 text-cyan-200 transition-colors text-left"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] sm:text-[10px] uppercase font-bold text-cyan-400/80">Model</div>
              <div className="text-xs font-bold truncate">
                {model === 'gemini-3-pro-image-preview' ? 'Studio Pro' : 'Nano 2.1'}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Aspect Ratio Modal / Drawer */}
      {showRatioModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Select Aspect Ratio"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setShowRatioModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Select Aspect Ratio</h3>
              </div>
              <button
                onClick={() => setShowRatioModal(false)}
                aria-label="Close aspect ratio picker"
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300 hover:text-white"
              >
                Done
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Phone wallpapers default to portrait <span className="text-cyan-400 font-semibold">9:16</span>. Choose any ratio for tablets, desktops, or avatars.
            </p>

            <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {ASPECT_RATIOS.map((option) => {
                const isSelected = option.id === aspectRatio;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChangeAspectRatio(option.id);
                      setShowRatioModal(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    {/* Visual Ratio Box */}
                    <div
                      className={`shrink-0 rounded-md border flex items-center justify-center ${
                        isSelected ? 'border-cyan-400 bg-cyan-400/20' : 'border-slate-600 bg-white/5'
                      }`}
                      style={{
                        width: option.widthRatio >= option.heightRatio ? '26px' : `${Math.max(14, (option.widthRatio / option.heightRatio) * 26)}px`,
                        height: option.heightRatio >= option.widthRatio ? '26px' : `${Math.max(14, (option.heightRatio / option.widthRatio) * 26)}px`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{option.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{option.sublabel}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Image Size / Quality Modal */}
      {showSizeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Select Image Resolution"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setShowSizeModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Select Image Resolution</h3>
              </div>
              <button
                onClick={() => setShowSizeModal(false)}
                aria-label="Close quality picker"
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300 hover:text-white"
              >
                Done
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Render at standard 1K speed, crisp 2K HD, or maximum 4K studio quality powered by <span className="text-indigo-400 font-semibold">Gemini 3 Pro Image</span>.
            </p>

            <div className="space-y-2.5">
              {IMAGE_SIZES.map((option) => {
                const isSelected = option.id === imageSize;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChangeImageSize(option.id);
                      setShowSizeModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {option.id}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{option.label} Resolution</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                            {option.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{option.description} • {option.pixelHint}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
