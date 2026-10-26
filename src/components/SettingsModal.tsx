import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  X,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Key,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react-native';
import { ModelType, ImageSize, AspectRatio } from '../utils/wallpaper-engine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: ModelType;
  onChangeModel: (model: ModelType) => void;
  currentSize: ImageSize;
  onChangeSize: (size: ImageSize) => void;
  currentRatio: AspectRatio;
  onChangeRatio: (ratio: AspectRatio) => void;
  apiKey: string;
  onChangeApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  onChangeModel,
  currentSize,
  onChangeSize,
  currentRatio,
  onChangeRatio,
  apiKey,
  onChangeApiKey,
}) => {
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Sparkles size={18} color="#22d3ee" />
              <Text style={styles.title}>Studio Specifications</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={16} color="#cbd5e1" />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              {/* API Key Configuration */}
              <View style={styles.cardSection}>
                <View style={styles.sectionHeaderRow}>
                  <Key size={14} color="#22d3ee" />
                  <Text style={styles.sectionTitle}>Gemini API Key</Text>
                </View>

                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.keyInput}
                    value={apiKey}
                    onChangeText={onChangeApiKey}
                    placeholder="Enter your Google Gemini API Key"
                    placeholderTextColor="#64748b"
                    secureTextEntry={!showKey}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setShowKey(!showKey)}
                    style={styles.eyeButton}
                  >
                    {showKey ? (
                      <EyeOff size={16} color="#94a3b8" />
                    ) : (
                      <Eye size={16} color="#94a3b8" />
                    )}
                  </Pressable>
                </View>

                <Text style={styles.sectionDescription}>
                  Saved securely on your device. When provided, wallpapers are generated
                  with live Google Gemini AI. When empty, AuraWall uses offline procedural SVG fallbacks.
                </Text>
              </View>

              {/* AI Engine Model Selection */}
              <View style={styles.cardSection}>
                <View style={styles.sectionHeaderRow}>
                  <Sparkles size={14} color="#818cf8" />
                  <Text style={styles.sectionTitle}>Generation Model</Text>
                </View>

                <View style={styles.modelButtonsRow}>
                  <Pressable
                    onPress={() => onChangeModel('gemini-3-pro-image-preview')}
                    style={[
                      styles.choiceButton,
                      currentModel === 'gemini-3-pro-image-preview' &&
                        styles.choiceButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.choiceButtonTitle,
                        currentModel === 'gemini-3-pro-image-preview' &&
                          styles.choiceButtonTitleSelected,
                      ]}
                    >
                      Gemini 3 Pro Image
                    </Text>
                    <Text style={styles.choiceButtonSubtitle}>
                      Studio retina details & crisp lighting
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => onChangeModel('gemini-nano-banana-2.1')}
                    style={[
                      styles.choiceButton,
                      currentModel === 'gemini-nano-banana-2.1' &&
                        styles.choiceButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.choiceButtonTitle,
                        currentModel === 'gemini-nano-banana-2.1' &&
                          styles.choiceButtonTitleSelected,
                      ]}
                    >
                      Gemini Nano 2.1
                    </Text>
                    <Text style={styles.choiceButtonSubtitle}>
                      Ultra-fast low-latency generation
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Resolution Options */}
              <View style={styles.cardSection}>
                <View style={styles.sectionHeaderRow}>
                  <Smartphone size={14} color="#a855f7" />
                  <Text style={styles.sectionTitle}>Default Resolution</Text>
                </View>

                <View style={styles.sizeButtonsRow}>
                  {(['1K', '2K', '4K'] as ImageSize[]).map((size) => {
                    const isSelected = currentSize === size;
                    return (
                      <Pressable
                        key={size}
                        onPress={() => onChangeSize(size)}
                        style={[
                          styles.sizeButton,
                          isSelected && styles.sizeButtonSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.sizeButtonText,
                            isSelected && styles.sizeButtonTextSelected,
                          ]}
                        >
                          {size}
                        </Text>
                        <Text style={styles.sizeSubText}>
                          {size === '4K' ? 'Retina' : size === '2K' ? 'HD' : 'Fast'}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Specs & Capabilities Checklist */}
              <View style={styles.cardSection}>
                <View style={styles.sectionHeaderRow}>
                  <Info size={14} color="#34d399" />
                  <Text style={styles.sectionTitle}>Studio Capabilities</Text>
                </View>

                <View style={styles.checklist}>
                  <View style={styles.checkItem}>
                    <CheckCircle2 size={14} color="#22d3ee" />
                    <Text style={styles.checkItemText}>
                      4-variation perspective diversification
                    </Text>
                  </View>
                  <View style={styles.checkItem}>
                    <CheckCircle2 size={14} color="#22d3ee" />
                    <Text style={styles.checkItemText}>
                      Reference image remixing for continuous style evolution
                    </Text>
                  </View>
                  <View style={styles.checkItem}>
                    <CheckCircle2 size={14} color="#22d3ee" />
                    <Text style={styles.checkItemText}>
                      Interactive lock screen simulation with live clock
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Close button */}
          <Pressable onPress={onClose} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </Pressable>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    maxHeight: '85%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  closeButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  scrollArea: {
    padding: 16,
  },
  contentContainer: {
    gap: 14,
    paddingBottom: 10,
  },
  cardSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  keyInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    paddingVertical: 8,
  },
  eyeButton: {
    padding: 4,
  },
  sectionDescription: {
    fontSize: 10,
    color: '#94a3b8',
    lineHeight: 14,
  },
  modelButtonsRow: {
    gap: 8,
  },
  choiceButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  choiceButtonSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: '#6366f1',
  },
  choiceButtonTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  choiceButtonTitleSelected: {
    color: '#818cf8',
  },
  choiceButtonSubtitle: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  sizeButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sizeButtonSelected: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: '#a855f7',
  },
  sizeButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#cbd5e1',
  },
  sizeButtonTextSelected: {
    color: '#c084fc',
  },
  sizeSubText: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 2,
  },
  checklist: {
    gap: 6,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkItemText: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  doneButton: {
    margin: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
