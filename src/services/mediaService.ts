import * as FileSystem from 'expo-file-system/legacy';
import {
  Asset,
  Album,
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-media-library';
import * as MediaLibraryLegacy from 'expo-media-library/legacy';
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
      // Specifically request photo-only permission to prevent requesting unused audio/video permissions
      let hasPermission = false;
      try {
        let permission = await getPermissionsAsync(false, ['photo']);
        if (!permission.granted) {
          permission = await requestPermissionsAsync(false, ['photo']);
        }
        hasPermission = permission.granted || permission.status === 'granted';
      } catch (permErr) {
        console.warn('Granular photo permission error, falling back to write-only:', permErr);
      }

      if (!hasPermission) {
        // Fallback: try write-only request which does not require audio or broad read permissions
        try {
          const writeOnlyPerm = await requestPermissionsAsync(true);
          hasPermission = writeOnlyPerm.granted || writeOnlyPerm.status === 'granted';
        } catch (writeErr) {
          console.warn('Write-only permission error:', writeErr);
        }
      }

      if (!hasPermission) {
        return {
          success: false,
          message: 'Permission to access photo library was denied. Please allow photo permissions in settings.',
        };
      }

      const filename = sanitizeFilename(wallpaper.prompt, wallpaper.id);
      let targetUri = `${FileSystem.documentDirectory}${filename}`;

      if (wallpaper.imageUrl.startsWith('data:image/')) {
        // Base64 data URL
        const base64Data = wallpaper.imageUrl.split(',')[1];
        if (!base64Data) {
          throw new Error('Invalid base64 image data');
        }

        await FileSystem.writeAsStringAsync(targetUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } else if (wallpaper.imageUrl.startsWith('http://') || wallpaper.imageUrl.startsWith('https://')) {
        // Remote file URL
        const downloadResult = await FileSystem.downloadAsync(wallpaper.imageUrl, targetUri);
        if (downloadResult.status !== 200) {
          throw new Error(`Failed to download image: status ${downloadResult.status}`);
        }
      } else {
        // Fallback for raw SVG XML
        targetUri = targetUri.replace(/\.png$/i, '.svg');
        const xml = wallpaper.rawSvgXml || wallpaper.imageUrl;
        await FileSystem.writeAsStringAsync(targetUri, xml, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }

      // Create asset using the modern SDK 58 Asset API, with legacy fallback
      try {
        const asset = await Asset.create(targetUri);
        try {
          const existingAlbum = await Album.get('AuraWall');
          if (existingAlbum) {
            await existingAlbum.add(asset);
          } else {
            await Album.create('AuraWall', [asset]);
          }
        } catch (albumErr) {
          console.warn('Could not add to "AuraWall" album, but wallpaper is saved in Photos:', albumErr);
        }
      } catch (assetErr) {
        console.warn('Modern Asset.create error, falling back to legacy MediaLibrary API:', assetErr);
        const legacyAsset = await MediaLibraryLegacy.createAssetAsync(targetUri);
        try {
          const existingAlbum = await MediaLibraryLegacy.getAlbumAsync('AuraWall');
          if (existingAlbum) {
            await MediaLibraryLegacy.addAssetsToAlbumAsync([legacyAsset], existingAlbum, false);
          } else {
            await MediaLibraryLegacy.createAlbumAsync('AuraWall', legacyAsset, false);
          }
        } catch (legacyAlbumErr) {
          console.warn('Could not add to "AuraWall" legacy album, but wallpaper is saved in Photos:', legacyAlbumErr);
        }
      }

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
