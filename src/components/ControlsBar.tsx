import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Smartphone,
  Square,
  Monitor,
  Sparkles,
  ChevronDown,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react-native';
import {
  AspectRatio,
  ImageSize,
  ModelType,
  ASPECT_RATIOS,
  IMAGE_SIZES,
} from '../utils/wallpaper-engine';

interface ControlsBarProps {
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  imageSize: ImageSize;
  onChangeImageSize: (size: ImageSize) => void;
  model: ModelType;
  onChangeModel: (model: ModelType) => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  aspectRatio,
  onChangeAspectRatio,
  imageSize,
  onChangeImageSize,
  model,
  onChangeModel,
}) => {
  const [showRatioModal, setShowRatioModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  const currentRatioOption =
    ASPECT_RATIOS.find((r) => r.id === aspectRatio) || ASPECT_RATIOS[0];
  const currentSizeOption =
    IMAGE_SIZES.find((s) => s.id === imageSize) || IMAGE_SIZES[0];

  return (
    <View style={styles.container}>
      <View style={styles.affordanceBar}>
        {/* Aspect Ratio Selector */}
        <Pressable
          onPress={() => setShowRatioModal(true)}
          style={({ pressed }) => [styles.segmentButton, pressed && styles.segmentPressed]}
          accessibilityLabel={`Aspect ratio: ${currentRatioOption.label} (${currentRatioOption.sublabel})`}
        >
          <View style={styles.segmentIconBoxCyan}>
            {currentRatioOption.id === '9:16' ? (
              <Smartphone size={14} color="#22d3ee" />
            ) : currentRatioOption.id === '1:1' ? (
              <Square size={14} color="#22d3ee" />
            ) : (
              <Monitor size={14} color="#22d3ee" />
            )}
          </View>
          <View style={styles.segmentTextBox}>
            <Text style={styles.segmentLabel}>RATIO</Text>
            <Text style={styles.segmentValue} numberOfLines={1}>
              {currentRatioOption.label}
            </Text>
          </View>
          <ChevronDown size={12} color="#64748b" />
        </Pressable>

        {/* Quality / Resolution Selector */}
        <Pressable
          onPress={() => setShowSizeModal(true)}
          style={({ pressed }) => [styles.segmentButton, pressed && styles.segmentPressed]}
          accessibilityLabel={`Resolution: ${currentSizeOption.label} (${currentSizeOption.badge})`}
        >
          <View style={styles.segmentIconBoxIndigo}>
            <Text style={styles.segmentSizeBadgeText}>{imageSize}</Text>
          </View>
          <View style={styles.segmentTextBox}>
            <Text style={styles.segmentLabel}>QUALITY</Text>
            <Text style={styles.segmentValue} numberOfLines={1}>
              {currentSizeOption.badge}
            </Text>
          </View>
          <ChevronDown size={12} color="#64748b" />
        </Pressable>

        {/* Model Toggle */}
        <Pressable
          onPress={() => {
            const next =
              model === 'gemini-3-pro-image-preview'
                ? 'gemini-nano-banana-2.1'
                : 'gemini-3-pro-image-preview';
            onChangeModel(next);
          }}
          style={({ pressed }) => [
            styles.segmentButton,
            styles.segmentButtonModel,
            pressed && styles.segmentPressed,
          ]}
          accessibilityLabel={`AI Model: ${model}`}
        >
          <View style={styles.segmentIconBoxFuchsia}>
            <Sparkles size={14} color="#e879f9" />
          </View>
          <View style={styles.segmentTextBox}>
            <Text style={styles.segmentLabelFuchsia}>MODEL</Text>
            <Text style={styles.segmentValue} numberOfLines={1}>
              {model === 'gemini-3-pro-image-preview' ? 'Studio Pro' : 'Nano 2.1'}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Aspect Ratio Modal */}
      <Modal
        visible={showRatioModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRatioModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRatioModal(false)}
        >
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <SlidersHorizontal size={16} color="#22d3ee" />
                <Text style={styles.modalTitle}>Select Aspect Ratio</Text>
              </View>
              <Pressable
                onPress={() => setShowRatioModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={16} color="#94a3b8" />
              </Pressable>
            </View>

            <Text style={styles.modalDescription}>
              Default is mobile <Text style={styles.highlightText}>9:16</Text>. Select custom
              proportions for tablets, ultrawide desktops, or social avatars.
            </Text>

            <ScrollView style={styles.optionsScrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.ratioGrid}>
                {ASPECT_RATIOS.map((option) => {
                  const isSelected = option.id === aspectRatio;
                  const wRatio = option.widthRatio;
                  const hRatio = option.heightRatio;
                  const boxWidth = wRatio >= hRatio ? 28 : Math.max(14, (wRatio / hRatio) * 28);
                  const boxHeight = hRatio >= wRatio ? 28 : Math.max(14, (hRatio / wRatio) * 28);

                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => {
                        onChangeAspectRatio(option.id);
                        setShowRatioModal(false);
                      }}
                      style={[
                        styles.ratioCard,
                        isSelected && styles.ratioCardSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.ratioBoxPreview,
                          { width: boxWidth, height: boxHeight },
                          isSelected && styles.ratioBoxPreviewSelected,
                        ]}
                      />
                      <View style={styles.ratioCardContent}>
                        <View style={styles.ratioCardTopRow}>
                          <Text style={styles.ratioCardLabel}>{option.label}</Text>
                          {isSelected && <Check size={14} color="#22d3ee" />}
                        </View>
                        <Text style={styles.ratioCardSublabel} numberOfLines={1}>
                          {option.sublabel}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </Pressable>
        </TouchableOpacity>
      </Modal>

      {/* Quality / Image Size Modal */}
      <Modal
        visible={showSizeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSizeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSizeModal(false)}
        >
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Sparkles size={16} color="#818cf8" />
                <Text style={styles.modalTitle}>Select Image Resolution</Text>
              </View>
              <Pressable
                onPress={() => setShowSizeModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={16} color="#94a3b8" />
              </Pressable>
            </View>

            <Text style={styles.modalDescription}>
              Choose standard 1K speed, 2K crisp HD, or maximum 4K studio fidelity.
            </Text>

            <View style={styles.sizeOptionsContainer}>
              {IMAGE_SIZES.map((option) => {
                const isSelected = option.id === imageSize;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => {
                      onChangeImageSize(option.id);
                      setShowSizeModal(false);
                    }}
                    style={[
                      styles.sizeCard,
                      isSelected && styles.sizeCardSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.sizeBadgeBig,
                        isSelected && styles.sizeBadgeBigSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.sizeBadgeBigText,
                          isSelected && styles.sizeBadgeBigTextSelected,
                        ]}
                      >
                        {option.id}
                      </Text>
                    </View>

                    <View style={styles.sizeCardContent}>
                      <View style={styles.sizeCardTitleRow}>
                        <Text style={styles.sizeCardLabel}>
                          {option.label} Resolution
                        </Text>
                        <View style={styles.sizeBadgeSmall}>
                          <Text style={styles.sizeBadgeSmallText}>{option.badge}</Text>
                        </View>
                      </View>
                      <Text style={styles.sizeCardSublabel}>
                        {option.description} • {option.pixelHint}
                      </Text>
                    </View>

                    {isSelected && <Check size={18} color="#818cf8" />}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  affordanceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  segmentButtonModel: {
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
    borderColor: 'rgba(168, 85, 247, 0.25)',
  },
  segmentPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    transform: [{ scale: 0.98 }],
  },
  segmentIconBoxCyan: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentIconBoxIndigo: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentIconBoxFuchsia: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(232, 121, 249, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSizeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#818cf8',
  },
  segmentTextBox: {
    flex: 1,
  },
  segmentLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  segmentLabelFuchsia: {
    fontSize: 8,
    fontWeight: '700',
    color: '#e879f9',
    letterSpacing: 0.5,
  },
  segmentValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalCloseButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalDescription: {
    fontSize: 12,
    color: '#94a3b8',
    marginVertical: 12,
    lineHeight: 18,
  },
  highlightText: {
    color: '#22d3ee',
    fontWeight: '700',
  },
  optionsScrollView: {
    maxHeight: 380,
  },
  ratioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 12,
  },
  ratioCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  ratioCardSelected: {
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: '#06b6d4',
  },
  ratioBoxPreview: {
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#64748b',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  ratioBoxPreviewSelected: {
    borderColor: '#22d3ee',
    backgroundColor: 'rgba(6, 182, 212, 0.25)',
  },
  ratioCardContent: {
    flex: 1,
  },
  ratioCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratioCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  ratioCardSublabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },

  // Size Modal
  sizeOptionsContainer: {
    gap: 10,
    paddingBottom: 8,
  },
  sizeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sizeCardSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderColor: '#6366f1',
  },
  sizeBadgeBig: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBadgeBigSelected: {
    backgroundColor: '#6366f1',
  },
  sizeBadgeBigText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#cbd5e1',
  },
  sizeBadgeBigTextSelected: {
    color: '#ffffff',
  },
  sizeCardContent: {
    flex: 1,
  },
  sizeCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sizeCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  sizeBadgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  sizeBadgeSmallText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  sizeCardSublabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 3,
  },
});
