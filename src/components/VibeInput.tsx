import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  Sparkles,
  Dices,
  Wand2,
  X,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react-native';
import {
  VibePreset,
  VIBE_PRESETS,
  SURPRISE_VIBES,
  MOOD_TAGS,
  WallpaperItem,
} from '../utils/wallpaper-engine';
import { WallpaperRenderer } from './WallpaperRenderer';

interface VibeInputProps {
  prompt: string;
  onChangePrompt: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  activeRemixItem: WallpaperItem | null;
  onCancelRemix: () => void;
}

export const VibeInput: React.FC<VibeInputProps> = ({
  prompt,
  onChangePrompt,
  onGenerate,
  isLoading,
  activeRemixItem,
  onCancelRemix,
}) => {
  const handleSelectPreset = (preset: VibePreset) => {
    onChangePrompt(preset.vibe);
  };

  const handleSurprise = () => {
    const random = SURPRISE_VIBES[Math.floor(Math.random() * SURPRISE_VIBES.length)];
    onChangePrompt(random);
  };

  const handleAddMoodTag = (tagText: string) => {
    const cleanTag = tagText.replace(/^[^\w\s]+/, '').trim();
    if (!prompt.includes(cleanTag)) {
      onChangePrompt(prompt ? `${prompt.trim()}, ${cleanTag}` : cleanTag);
    }
  };

  const canGenerate = prompt.trim().length > 0 && !isLoading;

  return (
    <View style={styles.container}>
      {/* Active Remix Reference Banner */}
      {activeRemixItem && (
        <View style={styles.remixBanner}>
          <View style={styles.remixInfoRow}>
            <View style={styles.remixThumbBox}>
              <WallpaperRenderer
                imageUrl={activeRemixItem.imageUrl}
                rawSvgXml={activeRemixItem.rawSvgXml}
              />
              <View style={styles.remixThumbBadge}>
                <Text style={styles.remixThumbBadgeText}>
                  #{activeRemixItem.variationIndex + 1}
                </Text>
              </View>
            </View>

            <View style={styles.remixDetails}>
              <View style={styles.remixTitleRow}>
                <RefreshCw size={12} color="#22d3ee" />
                <Text style={styles.remixTitleText}>REMIX MODE ACTIVE</Text>
              </View>
              <Text style={styles.remixDescText} numberOfLines={1}>
                Using reference image to evolve styles
              </Text>
            </View>
          </View>

          <Pressable
            onPress={onCancelRemix}
            style={({ pressed }) => [styles.cancelRemixButton, pressed && styles.pressed]}
            accessibilityLabel="Cancel remix"
          >
            <X size={14} color="#e2e8f0" />
            <Text style={styles.cancelRemixButtonText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {/* Main Prompt Card */}
      <View style={styles.promptCard}>
        <View style={styles.promptHeader}>
          <View style={styles.promptTitleRow}>
            <Sparkles size={14} color="#22d3ee" />
            <Text style={styles.promptTitle}>DESCRIBE DESIRED VIBE</Text>
          </View>

          <Pressable
            onPress={handleSurprise}
            style={({ pressed }) => [styles.surpriseButton, pressed && styles.pressed]}
            accessibilityLabel="Surprise me with a random prompt"
          >
            <Dices size={14} color="#e879f9" />
            <Text style={styles.surpriseButtonText}>Surprise Me</Text>
          </Pressable>
        </View>

        {/* Input Field */}
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={3}
          value={prompt}
          onChangeText={onChangePrompt}
          placeholder="e.g. rainy cyberpunk lo-fi city street with glowing neon lights..."
          placeholderTextColor="#64748b"
          editable={!isLoading}
          textAlignVertical="top"
        />

        {/* Action Button */}
        <Pressable
          onPress={onGenerate}
          disabled={!canGenerate}
          style={({ pressed }) => [
            styles.generateButton,
            !canGenerate && styles.generateButtonDisabled,
            pressed && canGenerate && styles.generateButtonPressed,
          ]}
          accessibilityLabel={
            isLoading
              ? 'Generating wallpapers'
              : activeRemixItem
              ? 'Remix 4 variations'
              : 'Generate 4 variations'
          }
        >
          {isLoading ? (
            <View style={styles.buttonContentRow}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.generateButtonText}>Crafting 4 Variations...</Text>
            </View>
          ) : activeRemixItem ? (
            <View style={styles.buttonContentRow}>
              <RefreshCw size={16} color="#ffffff" />
              <Text style={styles.generateButtonText}>Remix 4 Variations</Text>
            </View>
          ) : (
            <View style={styles.buttonContentRow}>
              <Wand2 size={16} color="#ffffff" />
              <Text style={styles.generateButtonText}>Generate 4 Variations</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Inspirational Vibe Chips */}
      <View style={styles.presetsSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>INSPIRATIONAL VIBES</Text>
          <Text style={styles.sectionHint}>Tap to load</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetsScroll}
        >
          {VIBE_PRESETS.map((preset) => {
            const isSelected = prompt === preset.vibe;
            const dotColor = preset.gradientColors[0];

            return (
              <Pressable
                key={preset.id}
                onPress={() => handleSelectPreset(preset)}
                style={({ pressed }) => [
                  styles.presetChip,
                  isSelected && styles.presetChipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.presetDot, { backgroundColor: dotColor }]} />
                <Text
                  style={[
                    styles.presetChipText,
                    isSelected && styles.presetChipTextSelected,
                  ]}
                >
                  {preset.title}
                </Text>
                <ArrowUpRight size={12} color="#64748b" />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Mood Accent Tags */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodTagsScroll}
      >
        <Text style={styles.moodAddLabel}>ADD:</Text>
        {MOOD_TAGS.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => handleAddMoodTag(tag)}
            style={({ pressed }) => [styles.moodTagChip, pressed && styles.pressed]}
          >
            <Text style={styles.moodTagText}>{tag}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  remixBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(8, 47, 73, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
    borderRadius: 16,
  },
  remixInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  remixThumbBox: {
    width: 36,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#06b6d4',
    backgroundColor: '#020617',
    position: 'relative',
  },
  remixThumbBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(6, 182, 212, 0.9)',
    alignItems: 'center',
    paddingVertical: 1,
  },
  remixThumbBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#020617',
  },
  remixDetails: {
    flex: 1,
  },
  remixTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  remixTitleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#22d3ee',
    letterSpacing: 0.5,
  },
  remixDescText: {
    fontSize: 11,
    color: '#cbd5e1',
    marginTop: 2,
  },
  cancelRemixButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cancelRemixButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e2e8f0',
  },

  // Prompt Card
  promptCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promptTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promptTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  surpriseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  surpriseButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  textInput: {
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: '#ffffff',
    lineHeight: 18,
    minHeight: 70,
  },
  generateButton: {
    backgroundColor: '#0284c7',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    shadowOpacity: 0,
    elevation: 0,
  },
  generateButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  generateButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.2,
  },

  // Presets
  presetsSection: {
    gap: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  sectionHint: {
    fontSize: 9,
    color: '#64748b',
  },
  presetsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  presetChipSelected: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: '#06b6d4',
  },
  presetDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  presetChipTextSelected: {
    color: '#22d3ee',
  },

  // Mood tags
  moodTagsScroll: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  moodAddLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    marginRight: 2,
  },
  moodTagChip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  moodTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#cbd5e1',
  },
  pressed: {
    opacity: 0.7,
  },
});
