import * as FileSystem from 'expo-file-system/legacy';
import {
  Asset,
  Album,
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import {
  sanitizeFilename,
  WallpaperItem,
  prepareWallpaperFileData,
} from '../utils/wallpaper-engine';

/**
 * Persists wallpaper image/vector data to the device local file system.
 * Handles SVG XML (UTF-8), base64 raster images (clean base64), and remote downloads.
 */
async function writeWallpaperToDisk(
  wallpaper: WallpaperItem,
  directory: string
): Promise<{ fileUri: string; mimeType: string }> {
  const fileData = prepareWallpaperFileData(wallpaper);
  const filename = sanitizeFilename(wallpaper.prompt, wallpaper.id).replace(/\.png$/i, fileData.extension);
  const fileUri = `${directory}${filename}`;

  if (fileData.isRemote && fileData.remoteUrl) {
    const downloadResult = await FileSystem.downloadAsync(fileData.remoteUrl, fileUri);
    if (downloadResult.status !== 200) {
      throw new Error(`Failed to download image: status ${downloadResult.status}`);
    }
    return { fileUri, mimeType: fileData.mimeType };
  }

  if (fileData.encoding === 'base64') {
    if (!fileData.content) {
      throw new Error('Invalid base64 image data');
    }
    await FileSystem.writeAsStringAsync(fileUri, fileData.content, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } else {
    await FileSystem.writeAsStringAsync(fileUri, fileData.content, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  }

  return { fileUri, mimeType: fileData.mimeType };
}

export const mediaService = {
  /**
   * Save wallpaper image to the user's photo gallery
   */
  async saveWallpaperToGallery(
    wallpaper: WallpaperItem
  ): Promise<{ success: boolean; message: string }> {
    try {
      // AuraWall only saves wallpapers to the user's gallery and never reads from it.
      // Requesting write-only access avoids asking for broad photo read permissions,
      // which is privacy-friendly, works seamlessly in Expo Go, and prevents Android permission errors.
      let hasPermission = false;
      try {
        let permission = await getPermissionsAsync(true);
        if (!permission.granted) {
          permission = await requestPermissionsAsync(true);
        }
        hasPermission = permission.granted || permission.status === 'granted';
      } catch (permErr) {
        // In scoped storage environments (Android 10+) or edge-case runners, write permission
        // check may throw even though saving to MediaStore via ContentResolver succeeds.
        console.warn('Write-only permission check notice, proceeding to save:', permErr);
        hasPermission = true;
      }

      if (!hasPermission) {
        return {
          success: false,
          message: 'Permission to save photos was denied. Please allow photo permissions in settings.',
        };
      }

      // Write wallpaper to disk (robustly handling SVG UTF-8 or base64 raster)
      const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
      const { fileUri } = await writeWallpaperToDisk(wallpaper, baseDir);

      // Create asset in user's photo gallery using modern SDK 58 Asset API
      const asset = await Asset.create(fileUri);
      let albumSaved = false;

      // Best-effort attempt to organize into the "AuraWall" album.
      // Note: In write-only mode or Expo Go on modern Android, querying or creating albums
      // may be restricted, but the wallpaper is already successfully saved to the camera roll.
      try {
        const existingAlbum = await Album.get('AuraWall');
        if (existingAlbum) {
          await existingAlbum.add(asset);
        } else {
          await Album.create('AuraWall', [asset]);
        }
        albumSaved = true;
      } catch (albumErr) {
        // Non-critical: asset is already saved to Photos
        console.log('Saved to Photos (album categorization skipped in write-only mode):', albumErr);
      }

      return {
        success: true,
        message: albumSaved
          ? 'Wallpaper saved to your Photos in the "AuraWall" album!'
          : 'Wallpaper saved to your Photos!',
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

      const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
      const { fileUri, mimeType } = await writeWallpaperToDisk(wallpaper, baseDir);

      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: `AuraWall: ${wallpaper.variationTitle}`,
      });
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
