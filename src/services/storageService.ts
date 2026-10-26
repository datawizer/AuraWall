import AsyncStorage from '@react-native-async-storage/async-storage';
import { WallpaperItem, AspectRatio, ImageSize, ModelType } from '../utils/wallpaper-engine';

const STORAGE_KEY_HISTORY = 'aurawall_history_v1';
const STORAGE_KEY_FAVORITES = 'aurawall_favorites_v1';
const STORAGE_KEY_SETTINGS = 'aurawall_settings_v1';

export interface AppSettings {
  geminiApiKey: string;
  defaultModel: ModelType;
  defaultSize: ImageSize;
  defaultRatio: AspectRatio;
}

const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: '',
  defaultModel: 'gemini-3-pro-image-preview',
  defaultSize: '4K',
  defaultRatio: '9:16',
};

export const storageService = {
  /**
   * Load history from AsyncStorage
   */
  async loadHistory(): Promise<WallpaperItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_HISTORY);
      if (data) {
        return JSON.parse(data) as WallpaperItem[];
      }
    } catch (err) {
      console.warn('Failed to load wallpaper history from storage:', err);
    }
    return [];
  },

  /**
   * Save history to AsyncStorage (caps at 50 recent items)
   */
  async saveHistory(history: WallpaperItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 50)));
    } catch (err) {
      console.warn('Failed to save wallpaper history to storage:', err);
    }
  },

  /**
   * Load favorite wallpaper IDs
   */
  async loadFavorites(): Promise<Set<string>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_FAVORITES);
      if (data) {
        const ids = JSON.parse(data) as string[];
        return new Set(ids);
      }
    } catch (err) {
      console.warn('Failed to load favorites from storage:', err);
    }
    return new Set<string>();
  },

  /**
   * Save favorite wallpaper IDs
   */
  async saveFavorites(favorites: Set<string>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(favorites)));
    } catch (err) {
      console.warn('Failed to save favorites to storage:', err);
    }
  },

  /**
   * Load settings (API Key, defaults)
   */
  async loadSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
        };
      }
    } catch (err) {
      console.warn('Failed to load settings from storage:', err);
    }
    return DEFAULT_SETTINGS;
  },

  /**
   * Save settings
   */
  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.warn('Failed to save settings to storage:', err);
    }
  },

  /**
   * Clear all history and favorites
   */
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY_HISTORY, STORAGE_KEY_FAVORITES]);
    } catch (err) {
      console.warn('Failed to clear storage data:', err);
    }
  },
};
