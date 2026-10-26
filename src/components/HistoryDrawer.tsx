import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Trash2,
  Heart,
  Clock,
  Sparkles,
  Smartphone,
} from 'lucide-react-native';
import { WallpaperItem } from '../utils/wallpaper-engine';
import { WallpaperRenderer } from './WallpaperRenderer';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: WallpaperItem[];
  onSelectWallpaper: (item: WallpaperItem) => void;
  onClearHistory: () => void;
  onToggleFavorite: (id: string) => void;
  favorites: Set<string>;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectWallpaper,
  onClearHistory,
  onToggleFavorite,
  favorites,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all');

  if (!isOpen) return null;

  const displayedWallpapers =
    filterMode === 'favorites'
      ? history.filter((item) => favorites.has(item.id))
      : history;

  const handleConfirmClear = () => {
    Alert.alert(
      'Clear Gallery History',
      'Are you sure you want to clear your saved wallpaper history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: onClearHistory },
      ]
    );
  };

  const itemWidth = Math.max(130, (width - 32 - 12) / 2);
  const itemHeight = itemWidth * (16 / 9);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top, 12) }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Clock size={18} color="#22d3ee" />
            <View>
              <Text style={styles.headerTitle}>Your Wallpaper Gallery</Text>
              <Text style={styles.headerSubtitle}>
                {history.length} saved creations • {favorites.size} favorites
              </Text>
            </View>
          </View>

          <View style={styles.headerActionsRow}>
            {history.length > 0 && (
              <Pressable
                onPress={handleConfirmClear}
                style={({ pressed }) => [styles.trashButton, pressed && styles.pressed]}
                accessibilityLabel="Clear gallery history"
              >
                <Trash2 size={16} color="#fda4af" />
              </Pressable>
            )}

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
              accessibilityLabel="Close gallery"
            >
              <X size={18} color="#cbd5e1" />
            </Pressable>
          </View>
        </View>

        {/* Filter Toggle: All vs Favorites */}
        <View style={styles.filterBar}>
          <Pressable
            onPress={() => setFilterMode('all')}
            style={[styles.filterTab, filterMode === 'all' && styles.filterTabActive]}
          >
            <Text
              style={[
                styles.filterTabText,
                filterMode === 'all' && styles.filterTabTextActive,
              ]}
            >
              All Wallpapers ({history.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilterMode('favorites')}
            style={[styles.filterTab, filterMode === 'favorites' && styles.filterTabActive]}
          >
            <Heart
              size={12}
              color={filterMode === 'favorites' ? '#f43f5e' : '#94a3b8'}
              fill={filterMode === 'favorites' ? '#f43f5e' : 'transparent'}
            />
            <Text
              style={[
                styles.filterTabText,
                filterMode === 'favorites' && styles.filterTabTextActive,
              ]}
            >
              Favorites ({favorites.size})
            </Text>
          </Pressable>
        </View>

        {/* Gallery Grid */}
        <ScrollView
          style={styles.galleryScroll}
          contentContainerStyle={[
            styles.galleryContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 16 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {displayedWallpapers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Smartphone size={40} color="#334155" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>
                {filterMode === 'favorites'
                  ? 'No favorites saved yet'
                  : 'No wallpapers generated yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {filterMode === 'favorites'
                  ? 'Tap the heart icon on any wallpaper to add it to your favorites.'
                  : 'Generated wallpapers automatically appear here.'}
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {displayedWallpapers.map((item) => {
                const isFav = favorites.has(item.id);
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      onSelectWallpaper(item);
                      onClose();
                    }}
                    style={[
                      styles.galleryCard,
                      { width: itemWidth, height: itemHeight },
                    ]}
                  >
                    <WallpaperRenderer
                      imageUrl={item.imageUrl}
                      rawSvgXml={item.rawSvgXml}
                    />

                    {/* Heart button */}
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      style={[
                        styles.favoriteIconBox,
                        isFav && styles.favoriteIconBoxActive,
                      ]}
                      accessibilityLabel={
                        isFav ? 'Remove from favorites' : 'Add to favorites'
                      }
                    >
                      <Heart
                        size={12}
                        color={isFav ? '#ffffff' : '#e2e8f0'}
                        fill={isFav ? '#f43f5e' : 'transparent'}
                      />
                    </Pressable>

                    {/* Bottom caption */}
                    <View style={styles.cardCaptionBox}>
                      <Text style={styles.cardPromptText} numberOfLines={1}>
                        {item.prompt}
                      </Text>
                      <Text style={styles.cardMetaText}>
                        {item.aspectRatio} • {item.imageSize}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0d16',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trashButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(225, 29, 72, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  filterTabActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: '#06b6d4',
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  filterTabTextActive: {
    color: '#22d3ee',
    fontWeight: '700',
  },
  galleryScroll: {
    flex: 1,
  },
  galleryContent: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  galleryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  favoriteIconBox: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  favoriteIconBoxActive: {
    backgroundColor: '#e11d48',
  },
  cardCaptionBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    zIndex: 5,
  },
  cardPromptText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardMetaText: {
    fontSize: 9,
    color: '#22d3ee',
    fontFamily: 'monospace',
    marginTop: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  emptySubtitle: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
