import React, { useState } from 'react';
import { VibePreset, VIBE_PRESETS, WallpaperItem } from '../utils/wallpaper-engine';
import { Sparkles, Dices, Wand2, X, RefreshCw, ArrowUpRight } from 'lucide-react';

interface VibeInputProps {
  prompt: string;
  onChangePrompt: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  activeRemixItem: WallpaperItem | null;
  onCancelRemix: () => void;
}

const SURPRISE_VIBES = [
  'rainy cyberpunk lo-fi alley with neon holographic signs and wet pavement reflection',
  'ethereal studio ghibli summer hill with wildflowers and distant cumulonimbus clouds',
  'dark OLED minimalist obsidian monolith with glowing gold geometric seam lines',
  'tokyo midnight rainy convenience store front with warm ambient interior light',
  'peaceful vaporwave purple beach sunset with grid horizon and low polygon palm trees',
  'cozy loft window overlooking rainy seattle skyline with steaming coffee mug silhouette',
  'minimalist scandinavian pine forest shrouded in ethereal morning mist',
  'cosmic surrealist planetary eclipse with violet nebula dust and iridescent stars',
  'warm retro 1970s desert dunes with gradient sunset and film grain texture',
  'futuristic organic bioluminescent deep sea cavern with glowing jellyfish',
];

const MOOD_TAGS = [
  '🌧️ Wet Raindrops',
  '⚡ Neon Bloom',
  '🌌 True OLED Black',
  '🌅 Golden Hour',
  '☕ Moody Lo-Fi',
  '🎨 Film Grain',
  '✨ Dreamy Bokeh',
];

export const VibeInput: React.FC<VibeInputProps> = ({
  prompt,
  onChangePrompt,
  onGenerate,
  isLoading,
  activeRemixItem,
  onCancelRemix,
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleSelectPreset = (preset: VibePreset) => {
    onChangePrompt(preset.vibe);
    setSelectedTag(preset.tag);
  };

  const handleSurprise = () => {
    const random = SURPRISE_VIBES[Math.floor(Math.random() * SURPRISE_VIBES.length)];
    onChangePrompt(random);
    setSelectedTag('Surprise');
  };

  const handleAddMoodTag = (tagText: string) => {
    const cleanTag = tagText.replace(/^[^\w\s]+/, '').trim();
    if (!prompt.includes(cleanTag)) {
      onChangePrompt(prompt ? `${prompt.trim()}, ${cleanTag}` : cleanTag);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate();
  };

  return (
    <div className="w-full space-y-3">
      {/* Active Remix Reference Banner */}
      {activeRemixItem && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 shadow-lg shadow-cyan-950/50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-16 rounded-xl overflow-hidden border border-cyan-400/50 shrink-0 bg-slate-900">
              <img
                src={activeRemixItem.imageUrl}
                alt="Remix reference"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 bg-cyan-900/90 text-[8px] font-bold text-center text-white py-0.5">
                Ref #{activeRemixItem.variationIndex + 1}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                  Remix Mode Active
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate max-w-[200px] sm:max-w-md font-medium">
                Using reference image to generate evolved variations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancelRemix}
            aria-label="Cancel remix and return to normal generation"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cancel Remix</span>
          </button>
        </div>
      )}

      {/* Main Prompt Card */}
      <form onSubmit={handleSubmit} className="relative rounded-3xl glass-panel p-3.5 sm:p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="vibe-prompt-input" className="text-xs font-bold tracking-wide uppercase text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Describe Desired Vibe
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSurprise}
              aria-label="Randomize wallpaper vibe"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Dices className="w-3 h-3 text-fuchsia-400" />
              <span>Surprise Me</span>
            </button>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            id="vibe-prompt-input"
            rows={2}
            value={prompt}
            onChange={(e) => onChangePrompt(e.target.value)}
            placeholder="e.g. rainy cyberpunk lo-fi city street with glowing neon lights..."
            disabled={isLoading}
            className="w-full bg-slate-950/60 rounded-2xl border border-white/10 p-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none font-medium leading-relaxed"
          />
        </div>

        {/* Bottom Form Row with Generate Button */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Generates 4 diverse stylistic variations in batch
          </span>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            aria-label="Generate 4 Wallpaper Variations"
            className={`w-full sm:w-auto ml-auto px-6 py-3 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg ${
              !prompt.trim() || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white shadow-indigo-500/25 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Crafting 4 Variations...</span>
              </>
            ) : activeRemixItem ? (
              <>
                <RefreshCw className="w-4 h-4 text-cyan-200" />
                <span>Remix 4 Variations</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-cyan-200" />
                <span>Generate 4 Variations</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Curated Vibe Preset Chips (Horizontal Swipe) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Inspirational Vibes
          </span>
          <span className="text-[10px] text-slate-400">Tap to load</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
          {VIBE_PRESETS.map((preset) => {
            const isSelected = prompt === preset.vibe;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 scale-[1.02]'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full bg-gradient-to-tr ${preset.gradient}`} />
                <span>{preset.title}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500 opacity-70" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood Accent Tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1">Add:</span>
        {MOOD_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleAddMoodTag(tag)}
            className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-slate-300 hover:text-white transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
