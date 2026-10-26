import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {
  Smartphone,
  Maximize2,
  RefreshCw,
  Heart,
  Sparkles,
} from 'lucide-react-native';
import {
  WallpaperItem,
  AspectRatio,
  getAspectRatioNumeric,
  VARIATION_DIRECTIVES,
} from '../utils/wallpaper-engine';
import { WallpaperRenderer } from './WallpaperRenderer';

interface WallpaperGridProps {
  wallpapers: (WallpaperItem | null)[];
  aspectRatio: AspectRatio;
  isLoading: boolean;
  loadingSlots: boolean[];
  onSelectWallpaper: (item: WallpaperItem) => void;
  onRemixWallpaper: (item: WallpaperItem) => void;
  onToggleFavorite: (id: string) => void;
  onRegenerateSlot: (index: number) => void;
  favorites: Set<string>;
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({
  wallpapers,
  aspectRatio,
  isLoading,
  loadingSlots,
  onSelectWallpaper,
  onRemixWallpaper,
  onToggleFavorite,
  onRegenerateSlot,
  favorites,
}) => {
  const { width } = useWindowDimensions();
  const numericRatio = getAspectRatioNumeric(aspectRatio);

  // Calculate card width for 2-column layout with padding and gap
  // container has horizontal padding: 16 * 2 = 32, gap between columns = 12
  const cardWidth = Math.max(140, (width - 32 - 12) / 2);
  const cardHeight = Math.min(cardWidth / numericRatio, cardWidth * 1.85);

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleRow}>
          <Smartphone size={16} color="#22d3ee" />
          <Text style={styles.headerTitle}>4 GENERATED VARIATIONS</Text>
        </View>
        <Text style={styles.headerSubtitle}>Tap to inspect & remix</Text>
      </View>

      {/* 2x2 Grid */}
      <View style={styles.grid}>
        {[0, 1, 2, 3].map((slotIndex) => {
          const item = wallpapers[slotIndex];
          const isSlotLoading = loadingSlots[slotIndex];
          const directive = VARIATION_DIRECTIVES[slotIndex];
          const isFavorite = item ? favorites.has(item.id) : false;

          return (
            <View
              key={slotIndex}
              style={[
                styles.cardContainer,
                { width: cardWidth, height: cardHeight },
              ]}
            >
              {/* Slot Loading Overlay */}
              {isSlotLoading && (
                <View style={styles.loadingOverlay}>
                  <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="small" color="#22d3ee" />
                  </View>
                  <Text style={styles.loadingTitle}>Variation #{slotIndex + 1}</Text>
                  <Text style={styles.loadingSubtitle} numberOfLines={1}>
                    {directive.title}
                  </Text>
                  <View style={styles.shimmerBar}>
                    <View style={styles.shimmerProgress} />
                  </View>
                </View>
              )}

              {/* Wallpaper Card or Placeholder */}
              {item ? (
                <Pressable
                  style={styles.cardPressable}
                  onPress={() => onSelectWallpaper(item)}
                  accessibilityLabel={`View Variation ${slotIndex + 1} (${item.variationTitle})`}
                >
                  <WallpaperRenderer
                    imageUrl={item.imageUrl}
                    rawSvgXml={item.rawSvgXml}
                  />

                  {/* Top Bar with Slot Badge and Favorite Heart */}
                  <View style={styles.cardTopBar}>
                    <View style={styles.slotBadge}>
                      <Text style={styles.slotBadgeText}>
                        #{slotIndex + 1} • {item.variationTitle.split(' ')[0]}
                      </Text>
                    </View>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      style={[
                        styles.favoriteButton,
                        isFavorite && styles.favoriteButtonActive,
                      ]}
                      accessibilityLabel={
                        isFavorite ? 'Remove from favorites' : 'Add to favorites'
                      }
                    >
                      <Heart
                        size={12}
                        color={isFavorite ? '#ffffff' : '#e2e8f0'}
                        fill={isFavorite ? '#f43f5e' : 'transparent'}
                      />
                    </Pressable>
                  </View>

                  {/* Bottom Bar Overlay */}
                  <View style={styles.cardBottomBar}>
                    <View style={styles.bottomInfoColumn}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.variationTitle}
                      </Text>
                      <View style={styles.cardMetaRow}>
                        <Text style={styles.cardMetaText}>{item.aspectRatio}</Text>
                        <Text style={styles.cardMetaDot}>•</Text>
                        <Text style={styles.cardMetaText}>{item.imageSize}</Text>
                        {item.isRemix && (
                          <Text style={styles.remixTag}>REMIX</Text>
                        )}
                      </View>
                    </View>

                    {/* Quick Action Buttons */}
                    <View style={styles.cardActionsRow}>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          onRemixWallpaper(item);
                        }}
                        style={styles.quickRemixButton}
                        accessibilityLabel={`Remix variation ${slotIndex + 1}`}
                      >
                        <RefreshCw size={12} color="#67e8f9" />
                      </Pressable>

                      <View style={styles.quickExpandIcon}>
                        <Maximize2 size={12} color="#ffffff" />
                      </View>
                    </View>
                  </View>
                </Pressable>
              ) : (
                /* Empty Placeholder */
                <View style={styles.placeholderCard}>
                  <View style={styles.placeholderNumber}>
                    <Text style={styles.placeholderNumberText}>#{slotIndex + 1}</Text>
                  </View>
                  <Text style={styles.placeholderTitle}>{directive.title}</Text>
                  <Text style={styles.placeholderSub} numberOfLines={2}>
                    {directive.subheading}
                  </Text>
                  <Pressable
                    onPress={() => onRegenerateSlot(slotIndex)}
                    disabled={isLoading}
                    style={styles.placeholderButton}
                  >
                    <Text style={styles.placeholderButtonText}>+ Generate</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0a0d16',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPressable: {
    width: '100%',
    height: '100%',
  },
  cardTopBar: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  slotBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  slotBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
  },
  favoriteButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#e11d48',
    borderColor: '#f43f5e',
  },
  cardBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  bottomInfoColumn: {
    flex: 1,
    paddingRight: 6,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#67e8f9',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  cardMetaText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#cbd5e1',
  },
  cardMetaDot: {
    fontSize: 8,
    color: '#64748b',
  },
  remixTag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#22d3ee',
    marginLeft: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickRemixButton: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: 'rgba(6, 182, 212, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickExpandIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    backgroundColor: 'rgba(2, 6, 23, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  spinnerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  loadingTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#22d3ee',
  },
  loadingSubtitle: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 2,
    textAlign: 'center',
  },
  shimmerBar: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginTop: 8,
  },
  shimmerProgress: {
    width: '60%',
    height: '100%',
    backgroundColor: '#06b6d4',
  },

  // Empty placeholder
  placeholderCard: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  placeholderNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  placeholderNumberText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
  },
  placeholderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#cbd5e1',
    textAlign: 'center',
  },
  placeholderSub: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 2,
  },
  placeholderButton: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  placeholderButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#22d3ee',
  },
});
