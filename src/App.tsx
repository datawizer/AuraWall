/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  WallpaperItem,
  AspectRatio,
  ImageSize,
  ModelType,
  generateThemedWallpaperSvg,
  VARIATION_DIRECTIVES,
} from './utils/wallpaper-engine';
import { Header } from './components/Header';
import { ControlsBar } from './components/ControlsBar';
import { VibeInput } from './components/VibeInput';
import { WallpaperGrid } from './components/WallpaperGrid';
import { LightboxModal } from './components/LightboxModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { Sparkles, Smartphone } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'aurawall_history_v1';
const STORAGE_KEY_FAVORITES = 'aurawall_favorites_v1';

// Seed initial starter wallpapers for rainy cyberpunk lo-fi
const INITIAL_PROMPT = 'rainy cyberpunk lo-fi';

function createInitialWallpapers(): WallpaperItem[] {
  return [0, 1, 2, 3].map((idx) => {
    const directive = VARIATION_DIRECTIVES[idx];
    return {
      id: `seed-init-${idx}`,
      prompt: INITIAL_PROMPT,
      aspectRatio: '9:16',
      imageSize: '4K',
      model: 'gemini-3-pro-image-preview',
      imageUrl: generateThemedWallpaperSvg(INITIAL_PROMPT, idx, '9:16'),
      variationIndex: idx,
      variationTitle: directive.title,
      createdAt: Date.now() - (3 - idx) * 60000,
    };
  });
}

export default function App() {
  const [prompt, setPrompt] = useState<string>(INITIAL_PROMPT);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [imageSize, setImageSize] = useState<ImageSize>('4K');
  const [model, setModel] = useState<ModelType>('gemini-3-pro-image-preview');

  // Wallpapers & state
  const [wallpapers, setWallpapers] = useState<(WallpaperItem | null)[]>(() => createInitialWallpapers());
  const [loadingSlots, setLoadingSlots] = useState<boolean[]>([false, false, false, false]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeRemixItem, setActiveRemixItem] = useState<WallpaperItem | null>(null);

  // Modals & Drawers
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperItem | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Persistence: History & Favorites
  const [history, setHistory] = useState<WallpaperItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return createInitialWallpapers();
  });

  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // fallback
    }
    return new Set<string>();
  });

  // Save history & favorites
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 30)));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(favorites)));
    } catch (err) {
      console.warn('LocalStorage favorites save failed:', err);
    }
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  /**
   * Generate a single slot variation
   */
  const generateSlot = useCallback(
    async (slotIndex: number, currentPrompt: string, remixItem: WallpaperItem | null) => {
      setLoadingSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = true;
        return next;
      });

      try {
        const response = await fetch('/api/generate-variation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: currentPrompt,
            variationIndex: slotIndex,
            aspectRatio,
            imageSize,
            model,
            referenceImage: remixItem ? remixItem.imageUrl : undefined,
            isRemix: Boolean(remixItem),
          }),
        });

        const data = await response.json();
        const directive = VARIATION_DIRECTIVES[slotIndex];

        const newItem: WallpaperItem = {
          id: `wall-${Date.now()}-${slotIndex}-${Math.random().toString(36).substring(2, 7)}`,
          prompt: currentPrompt,
          aspectRatio,
          imageSize,
          model,
          imageUrl: data.imageUrl || generateThemedWallpaperSvg(currentPrompt, slotIndex, aspectRatio),
          variationIndex: slotIndex,
          variationTitle: data.variationTitle || directive.title,
          createdAt: Date.now(),
          isRemix: Boolean(remixItem),
          parentReferenceId: remixItem?.id,
        };

        setWallpapers((prev) => {
          const next = [...prev];
          next[slotIndex] = newItem;
          return next;
        });

        setHistory((prev) => [newItem, ...prev.filter((item) => item.id !== newItem.id)]);
      } catch (err) {
        console.error(`Error generating variation ${slotIndex}:`, err);
        // Fallback
        const directive = VARIATION_DIRECTIVES[slotIndex];
        const fallbackItem: WallpaperItem = {
          id: `wall-fallback-${Date.now()}-${slotIndex}`,
          prompt: currentPrompt,
          aspectRatio,
          imageSize,
          model,
          imageUrl: generateThemedWallpaperSvg(currentPrompt, slotIndex, aspectRatio),
          variationIndex: slotIndex,
          variationTitle: directive.title,
          createdAt: Date.now(),
          isRemix: Boolean(remixItem),
        };
        setWallpapers((prev) => {
          const next = [...prev];
          next[slotIndex] = fallbackItem;
          return next;
        });
      } finally {
        setLoadingSlots((prev) => {
          const next = [...prev];
          next[slotIndex] = false;
          return next;
        });
      }
    },
    [aspectRatio, imageSize, model]
  );

  /**
   * Generate all 4 variations
   */
  const handleGenerateAll = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setLoadingSlots([true, true, true, true]);

    const activeRemix = activeRemixItem;

    try {
      await Promise.all([
        generateSlot(0, prompt, activeRemix),
        generateSlot(1, prompt, activeRemix),
        generateSlot(2, prompt, activeRemix),
        generateSlot(3, prompt, activeRemix),
      ]);
    } finally {
      setIsLoading(false);
      setLoadingSlots([false, false, false, false]);
    }
  }, [prompt, isLoading, activeRemixItem, generateSlot]);

  /**
   * Trigger Remix Mode for a specific wallpaper
   */
  const handleRemixWallpaper = (item: WallpaperItem) => {
    setActiveRemixItem(item);
    // Auto-populate or preserve prompt
    if (!prompt) {
      setPrompt(item.prompt);
    }
    setSelectedWallpaper(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelRemix = () => {
    setActiveRemixItem(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setFavorites(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      localStorage.removeItem(STORAGE_KEY_FAVORITES);
    } catch {}
  };

  // Valid wallpapers for lightbox carousel
  const validWallpapers = wallpapers.filter((w): w is WallpaperItem => w !== null);

  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        currentModel={model}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Mobile-First Studio Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-5 pb-20">
        {/* Controls Bar: Aspect Ratio (9:16 default), Resolution (1K, 2K, 4K), Model */}
        <ControlsBar
          aspectRatio={aspectRatio}
          onChangeAspectRatio={setAspectRatio}
          imageSize={imageSize}
          onChangeImageSize={setImageSize}
          model={model}
          onChangeModel={setModel}
        />

        {/* Vibe Input & Preset Tray */}
        <VibeInput
          prompt={prompt}
          onChangePrompt={setPrompt}
          onGenerate={handleGenerateAll}
          isLoading={isLoading}
          activeRemixItem={activeRemixItem}
          onCancelRemix={handleCancelRemix}
        />

        {/* 4 Wallpaper Variations Grid */}
        <WallpaperGrid
          wallpapers={wallpapers}
          aspectRatio={aspectRatio}
          isLoading={isLoading}
          loadingSlots={loadingSlots}
          onSelectWallpaper={setSelectedWallpaper}
          onRemixWallpaper={handleRemixWallpaper}
          onToggleFavorite={handleToggleFavorite}
          onRegenerateSlot={(idx) => generateSlot(idx, prompt, activeRemixItem)}
          favorites={favorites}
        />
      </main>

      {/* Full-Screen Lightbox Modal with Download, Remix, and Phone Mockup Toggle */}
      {selectedWallpaper && (
        <LightboxModal
          wallpaper={selectedWallpaper}
          allWallpapers={validWallpapers.length > 0 ? validWallpapers : [selectedWallpaper]}
          isOpen={Boolean(selectedWallpaper)}
          onClose={() => setSelectedWallpaper(null)}
          onRemix={handleRemixWallpaper}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favorites.has(selectedWallpaper.id)}
          onSelectIndex={(index) => {
            if (validWallpapers[index]) {
              setSelectedWallpaper(validWallpapers[index]);
            }
          }}
        />
      )}

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectWallpaper={setSelectedWallpaper}
        onClearHistory={handleClearHistory}
        onToggleFavorite={handleToggleFavorite}
        favorites={favorites}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentModel={model}
        onChangeModel={setModel}
        currentSize={imageSize}
        onChangeSize={setImageSize}
        currentRatio={aspectRatio}
        onChangeRatio={setAspectRatio}
      />
    </div>
  );
}
