/**
 * AuraWall - AI Phone Wallpaper Studio
 * React Native Expo Mobile App
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import {
  WallpaperItem,
  AspectRatio,
  ImageSize,
  ModelType,
  generateThemedWallpaperSvg,
  generateThemedWallpaperSvgXml,
  VARIATION_DIRECTIVES,
} from './src/utils/wallpaper-engine';
import { Header } from './src/components/Header';
import { ControlsBar } from './src/components/ControlsBar';
import { VibeInput } from './src/components/VibeInput';
import { WallpaperGrid } from './src/components/WallpaperGrid';
import { LightboxModal } from './src/components/LightboxModal';
import { HistoryDrawer } from './src/components/HistoryDrawer';
import { SettingsModal } from './src/components/SettingsModal';
import { storageService } from './src/services/storageService';
import { generateSingleVariation } from './src/services/geminiService';

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
      rawSvgXml: generateThemedWallpaperSvgXml(INITIAL_PROMPT, idx, '9:16'),
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
  const [apiKey, setApiKey] = useState<string>('');

  // Wallpapers & Loading state
  const [wallpapers, setWallpapers] = useState<(WallpaperItem | null)[]>(() =>
    createInitialWallpapers()
  );
  const [loadingSlots, setLoadingSlots] = useState<boolean[]>([false, false, false, false]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeRemixItem, setActiveRemixItem] = useState<WallpaperItem | null>(null);

  // Modals
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperItem | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // History & Favorites
  const [history, setHistory] = useState<WallpaperItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load stored data on startup
  useEffect(() => {
    async function initStorage() {
      const storedSettings = await storageService.loadSettings();
      if (storedSettings.geminiApiKey) {
        setApiKey(storedSettings.geminiApiKey);
      }
      if (storedSettings.defaultModel) {
        setModel(storedSettings.defaultModel);
      }
      if (storedSettings.defaultSize) {
        setImageSize(storedSettings.defaultSize);
      }
      if (storedSettings.defaultRatio) {
        setAspectRatio(storedSettings.defaultRatio);
      }

      const storedHistory = await storageService.loadHistory();
      if (storedHistory.length > 0) {
        setHistory(storedHistory);
      } else {
        const initial = createInitialWallpapers();
        setHistory(initial);
        await storageService.saveHistory(initial);
      }

      const storedFavorites = await storageService.loadFavorites();
      setFavorites(storedFavorites);
    }

    initStorage();
  }, []);

  // Sync favorites change to storage
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      storageService.saveFavorites(next);
      return next;
    });
  };

  /**
   * Generate a single slot variation
   */
  const generateSlot = useCallback(
    async (
      slotIndex: number,
      currentPrompt: string,
      remixItem: WallpaperItem | null
    ) => {
      setLoadingSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = true;
        return next;
      });

      try {
        const result = await generateSingleVariation({
          prompt: currentPrompt,
          variationIndex: slotIndex,
          aspectRatio,
          imageSize,
          model,
          referenceImage: remixItem ? remixItem.imageUrl : undefined,
          isRemix: Boolean(remixItem),
          apiKey,
        });

        const directive = VARIATION_DIRECTIVES[slotIndex];
        const newItem: WallpaperItem = {
          id: `wall-${Date.now()}-${slotIndex}-${Math.random().toString(36).substring(2, 7)}`,
          prompt: currentPrompt,
          aspectRatio,
          imageSize,
          model,
          imageUrl: result.imageUrl,
          rawSvgXml: result.rawSvgXml,
          variationIndex: slotIndex,
          variationTitle: result.variationTitle || directive.title,
          createdAt: Date.now(),
          isRemix: Boolean(remixItem),
          parentReferenceId: remixItem?.id,
        };

        setWallpapers((prev) => {
          const next = [...prev];
          next[slotIndex] = newItem;
          return next;
        });

        setHistory((prev) => {
          const nextHistory = [newItem, ...prev.filter((i) => i.id !== newItem.id)];
          storageService.saveHistory(nextHistory);
          return nextHistory;
        });
      } catch (err) {
        console.error(`Error generating slot ${slotIndex}:`, err);
        // Fallback
        const directive = VARIATION_DIRECTIVES[slotIndex];
        const fallbackItem: WallpaperItem = {
          id: `wall-fallback-${Date.now()}-${slotIndex}`,
          prompt: currentPrompt,
          aspectRatio,
          imageSize,
          model,
          imageUrl: generateThemedWallpaperSvg(currentPrompt, slotIndex, aspectRatio),
          rawSvgXml: generateThemedWallpaperSvgXml(currentPrompt, slotIndex, aspectRatio),
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
    [aspectRatio, imageSize, model, apiKey]
  );

  /**
   * Generate all 4 variations concurrently
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
    if (!prompt) {
      setPrompt(item.prompt);
    }
    setSelectedWallpaper(null);
  };

  const handleCancelRemix = () => {
    setActiveRemixItem(null);
  };

  const handleClearHistory = async () => {
    setHistory([]);
    setFavorites(new Set());
    await storageService.clearAllData();
  };

  const handleModelChange = (newModel: ModelType) => {
    setModel(newModel);
    storageService.saveSettings({
      geminiApiKey: apiKey,
      defaultModel: newModel,
      defaultSize: imageSize,
      defaultRatio: aspectRatio,
    });
  };

  const handleRatioChange = (newRatio: AspectRatio) => {
    setAspectRatio(newRatio);
    storageService.saveSettings({
      geminiApiKey: apiKey,
      defaultModel: model,
      defaultSize: imageSize,
      defaultRatio: newRatio,
    });
  };

  const handleSizeChange = (newSize: ImageSize) => {
    setImageSize(newSize);
    storageService.saveSettings({
      geminiApiKey: apiKey,
      defaultModel: model,
      defaultSize: newSize,
      defaultRatio: aspectRatio,
    });
  };

  const handleSaveApiKey = async (newKey: string) => {
    setApiKey(newKey);
    await storageService.saveSettings({
      geminiApiKey: newKey,
      defaultModel: model,
      defaultSize: imageSize,
      defaultRatio: aspectRatio,
    });
  };

  const validWallpapers = wallpapers.filter((w): w is WallpaperItem => w !== null);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Header */}
        <Header
          currentModel={model}
          historyCount={history.length}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Scrollable Main Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Quick Affordances: Aspect Ratio, Resolution Quality, Model */}
            <ControlsBar
              aspectRatio={aspectRatio}
              onChangeAspectRatio={handleRatioChange}
              imageSize={imageSize}
              onChangeImageSize={handleSizeChange}
              model={model}
              onChangeModel={handleModelChange}
            />

            {/* Vibe Input & Inspiration Tray */}
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
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Full-Screen Lightbox Modal */}
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

        {/* History / Gallery Modal */}
        <HistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectWallpaper={setSelectedWallpaper}
          onClearHistory={handleClearHistory}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
        />

        {/* Studio Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentModel={model}
          onChangeModel={handleModelChange}
          currentSize={imageSize}
          onChangeSize={handleSizeChange}
          currentRatio={aspectRatio}
          onChangeRatio={handleRatioChange}
          apiKey={apiKey}
          onChangeApiKey={handleSaveApiKey}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080c',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
});
