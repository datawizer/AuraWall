import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { sanitizeFilename, WallpaperItem } from '../utils/wallpaper-engine';

export const mediaService = {
  /**
   * Save wallpaper image to the user's photo gallery
   */
  async saveWallpaperToGallery(
    wallpaper: WallpaperItem
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        return {
          success: false,
          message: 'Permission to access photo library was denied. Please allow photo permissions in settings.',
        };
      }

      const filename = sanitizeFilename(wallpaper.prompt, wallpaper.id);
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      if (wallpaper.imageUrl.startsWith('data:image/')) {
        // Base64 data URL
        const base64Data = wallpaper.imageUrl.split(',')[1];
        if (!base64Data) {
          throw new Error('Invalid base64 image data');
        }

        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else if (wallpaper.imageUrl.startsWith('http://') || wallpaper.imageUrl.startsWith('https://')) {
        // Remote file URL
        const downloadResult = await FileSystem.downloadAsync(wallpaper.imageUrl, fileUri);
        if (downloadResult.status !== 200) {
          throw new Error(`Failed to download image: status ${downloadResult.status}`);
        }
      } else {
        // Fallback for raw SVG XML
        const xml = wallpaper.rawSvgXml || wallpaper.imageUrl;
        await FileSystem.writeAsStringAsync(fileUri.replace('.png', '.svg'), xml, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('AuraWall', asset, false);

      return {
        success: true,
        message: 'Wallpaper saved to your Photos in the "AuraWall" album!',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Failed to save wallpaper:', msg);
      return {
        success: false,
        message: `Could not save wallpaper: ${msg}`,
      };
    }
  },

  /**
   * Share wallpaper with system share dialog
   */
  async shareWallpaper(wallpaper: WallpaperItem): Promise<boolean> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        // Fallback to copying prompt
        await Clipboard.setStringAsync(wallpaper.prompt);
        return false;
      }

      const filename = sanitizeFilename(wallpaper.prompt, wallpaper.id);
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      if (wallpaper.imageUrl.startsWith('data:image/')) {
        const base64Data = wallpaper.imageUrl.split(',')[1];
        if (base64Data) {
          await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          await Sharing.shareAsync(fileUri, {
            mimeType: 'image/png',
            dialogTitle: `AuraWall: ${wallpaper.variationTitle}`,
          });
          return true;
        }
      } else if (wallpaper.imageUrl.startsWith('http://') || wallpaper.imageUrl.startsWith('https://')) {
        const download = await FileSystem.downloadAsync(wallpaper.imageUrl, fileUri);
        await Sharing.shareAsync(download.uri, {
          dialogTitle: `AuraWall: ${wallpaper.variationTitle}`,
        });
        return true;
      }

      // Share prompt text
      await Clipboard.setStringAsync(wallpaper.prompt);
      return true;
    } catch (err) {
      console.warn('Error sharing wallpaper:', err);
      return false;
    }
  },

  /**
   * Copy prompt to clipboard
   */
  async copyPrompt(prompt: string): Promise<void> {
    await Clipboard.setStringAsync(prompt);
  },
};
