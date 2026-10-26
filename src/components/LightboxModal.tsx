import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Download,
  RefreshCw,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  Share2,
  Check,
  Flashlight,
  Camera,
} from 'lucide-react-native';
import { WallpaperItem, getAspectRatioNumeric } from '../utils/wallpaper-engine';
import { WallpaperRenderer } from './WallpaperRenderer';
import { mediaService } from '../services/mediaService';

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
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const [showPhoneOverlay, setShowPhoneOverlay] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [currentDate, setCurrentDate] = useState('Wednesday, October 21');

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const handleSaveToGallery = async () => {
    try {
      setIsSaving(true);
      const res = await mediaService.saveWallpaperToGallery(wallpaper);
      Alert.alert(res.success ? 'Saved!' : 'Notice', res.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    await mediaService.shareWallpaper(wallpaper);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dimensions for wallpaper preview box
  const numericRatio = getAspectRatioNumeric(wallpaper.aspectRatio);
  const availableHeight = height - insets.top - insets.bottom - 160;
  const availableWidth = width - 32;

  let previewWidth = availableWidth;
  let previewHeight = previewWidth / numericRatio;

  if (previewHeight > availableHeight) {
    previewHeight = availableHeight;
    previewWidth = previewHeight * numericRatio;
  }

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        {/* Top Floating App Bar */}
        <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
          {/* Close & Variation label */}
          <View style={styles.topBarLeft}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}
              accessibilityLabel="Close lightbox"
            >
              <X size={18} color="#ffffff" />
            </Pressable>

            <View style={styles.variationTag}>
              <Text style={styles.variationTagNumber}>
                #{wallpaper.variationIndex + 1}
              </Text>
              <Text style={styles.variationTagDot}>•</Text>
              <Text style={styles.variationTagTitle} numberOfLines={1}>
                {wallpaper.variationTitle}
              </Text>
            </View>
          </View>

          {/* Right actions: Lock Screen overlay toggle & favorite */}
          <View style={styles.topBarRight}>
            <Pressable
              onPress={() => setShowPhoneOverlay(!showPhoneOverlay)}
              style={({ pressed }) => [
                styles.lockScreenToggle,
                showPhoneOverlay && styles.lockScreenToggleActive,
                pressed && styles.pressed,
              ]}
              accessibilityLabel={
                showPhoneOverlay ? 'Hide lock screen preview' : 'Show lock screen preview'
              }
            >
              {showPhoneOverlay ? (
                <EyeOff size={14} color="#020617" />
              ) : (
                <Eye size={14} color="#ffffff" />
              )}
              <Text
                style={[
                  styles.lockScreenToggleText,
                  showPhoneOverlay && styles.lockScreenToggleTextActive,
                ]}
              >
                {showPhoneOverlay ? 'Hide Preview' : 'Lock Screen'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onToggleFavorite(wallpaper.id)}
              style={({ pressed }) => [
                styles.roundButton,
                isFavorite && styles.favoriteRoundButtonActive,
                pressed && styles.pressed,
              ]}
              accessibilityLabel={
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <Heart
                size={18}
                color={isFavorite ? '#ffffff' : '#cbd5e1'}
                fill={isFavorite ? '#f43f5e' : 'transparent'}
              />
            </Pressable>
          </View>
        </View>

        {/* Wallpaper Display Center */}
        <View style={styles.previewContainer}>
          {/* Left Arrow Button */}
          {totalCount > 1 && (
            <Pressable
              onPress={handlePrev}
              style={({ pressed }) => [styles.navArrowLeft, pressed && styles.pressed]}
              accessibilityLabel="Previous wallpaper"
            >
              <ChevronLeft size={22} color="#ffffff" />
            </Pressable>
          )}

          {/* Wallpaper Frame */}
          <View
            style={[
              styles.wallpaperFrame,
              { width: previewWidth, height: previewHeight },
            ]}
          >
            <WallpaperRenderer
              imageUrl={wallpaper.imageUrl}
              rawSvgXml={wallpaper.rawSvgXml}
            />

            {/* REALISTIC PHONE LOCK SCREEN SIMULATION */}
            {showPhoneOverlay && (
              <View style={styles.lockScreenOverlay} pointerEvents="none">
                {/* Dynamic Island / Notch */}
                <View style={styles.notchContainer}>
                  <View style={styles.notchIsland}>
                    <View style={styles.notchCamera} />
                    <View style={styles.notchSensor} />
                  </View>
                  <View style={styles.statusBarRow}>
                    <Text style={styles.statusBarText}>5G</Text>
                    <Text style={styles.statusBarText}>98%</Text>
                  </View>
                </View>

                {/* Big Digital Clock & Date */}
                <View style={styles.clockContainer}>
                  <Text style={styles.lockScreenDate}>{currentDate}</Text>
                  <Text style={styles.lockScreenClock}>{currentTime}</Text>

                  {/* Aura Widget */}
                  <View style={styles.lockScreenWidget}>
                    <Sparkles size={12} color="#67e8f9" />
                    <Text style={styles.lockScreenWidgetText}>
                      Aura: 72° • Clear Sky
                    </Text>
                  </View>
                </View>

                {/* Bottom Tools (Flashlight & Camera + Home Indicator) */}
                <View style={styles.bottomLockToolsContainer}>
                  <View style={styles.bottomToolIconsRow}>
                    <View style={styles.lockToolCircle}>
                      <Flashlight size={16} color="#ffffff" />
                    </View>
                    <View style={styles.lockToolCircle}>
                      <Camera size={16} color="#ffffff" />
                    </View>
                  </View>
                  <View style={styles.homeIndicator} />
                </View>
              </View>
            )}

            {/* Ratio badge (hidden when phone overlay is shown to avoid clashing) */}
            {!showPhoneOverlay && (
              <View style={styles.frameBadge}>
                <Text style={styles.frameBadgeText}>
                  {wallpaper.aspectRatio} • {wallpaper.imageSize}
                </Text>
              </View>
            )}
          </View>

          {/* Right Arrow Button */}
          {totalCount > 1 && (
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [styles.navArrowRight, pressed && styles.pressed]}
              accessibilityLabel="Next wallpaper"
            >
              <ChevronRight size={22} color="#ffffff" />
            </Pressable>
          )}
        </View>

        {/* Bottom Floating Control Bar */}
        <View style={[styles.bottomControlBar, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
          {/* Prompt description */}
          <Text style={styles.promptCaption} numberOfLines={1}>
            "{wallpaper.prompt}"
          </Text>

          {/* Buttons Row */}
          <View style={styles.actionButtonsRow}>
            {/* REMIX BUTTON */}
            <Pressable
              onPress={() => onRemix(wallpaper)}
              style={({ pressed }) => [styles.remixActionButton, pressed && styles.pressed]}
              accessibilityLabel="Remix this wallpaper"
            >
              <RefreshCw size={14} color="#22d3ee" />
              <Text style={styles.remixActionButtonText}>Remix</Text>
            </Pressable>

            {/* SAVE BUTTON */}
            <Pressable
              onPress={handleSaveToGallery}
              disabled={isSaving}
              style={({ pressed }) => [
                styles.saveActionButton,
                isSaving && styles.disabled,
                pressed && styles.pressed,
              ]}
              accessibilityLabel="Save wallpaper to photos"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Download size={14} color="#ffffff" />
              )}
              <Text style={styles.saveActionButtonText}>
                {isSaving ? 'Saving...' : 'Save Image'}
              </Text>
            </Pressable>

            {/* SHARE / COPY BUTTON */}
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [styles.shareActionButton, pressed && styles.pressed]}
              accessibilityLabel="Share wallpaper or copy prompt"
            >
              {copied ? (
                <Check size={16} color="#34d399" />
              ) : (
                <Share2 size={16} color="#ffffff" />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#030407',
    justifyContent: 'space-between',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roundButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteRoundButtonActive: {
    backgroundColor: '#e11d48',
    borderColor: '#f43f5e',
  },
  variationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  variationTagNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#22d3ee',
  },
  variationTagDot: {
    fontSize: 10,
    color: '#64748b',
  },
  variationTagTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
    maxWidth: 100,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lockScreenToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  lockScreenToggleActive: {
    backgroundColor: '#06b6d4',
    borderColor: '#22d3ee',
  },
  lockScreenToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  lockScreenToggleTextActive: {
    color: '#020617',
  },

  // Preview Center
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 16,
  },
  navArrowLeft: {
    position: 'absolute',
    left: 8,
    zIndex: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowRight: {
    position: 'absolute',
    right: 8,
    zIndex: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wallpaperFrame: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  frameBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  frameBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#22d3ee',
  },

  // Realistic Lock Screen Overlay
  lockScreenOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'space-between',
    padding: 16,
  },
  notchContainer: {
    alignItems: 'center',
    gap: 4,
  },
  notchIsland: {
    width: 80,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  notchCamera: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1e293b',
  },
  notchSensor: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#06b6d4',
  },
  statusBarRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  statusBarText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    opacity: 0.85,
  },
  clockContainer: {
    alignItems: 'center',
    marginVertical: 'auto',
  },
  lockScreenDate: {
    fontSize: 11,
    fontWeight: '700',
    color: '#e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  lockScreenClock: {
    fontSize: 54,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'monospace',
    letterSpacing: -1,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginVertical: 2,
  },
  lockScreenWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 6,
  },
  lockScreenWidgetText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#f8fafc',
  },
  bottomLockToolsContainer: {
    alignItems: 'center',
    gap: 12,
  },
  bottomToolIconsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  lockToolCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 110,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },

  // Bottom Control Bar
  bottomControlBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: 'rgba(10, 11, 18, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
    alignItems: 'center',
  },
  promptCaption: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '500',
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    maxWidth: 380,
  },
  remixActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  remixActionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#22d3ee',
  },
  saveActionButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#0284c7',
  },
  saveActionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  shareActionButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
