import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Smartphone, Sparkles, Clock, Settings } from 'lucide-react-native';
import { ModelType } from '../utils/wallpaper-engine';

interface HeaderProps {
  currentModel: ModelType;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModel,
  historyCount,
  onOpenHistory,
  onOpenSettings,
}) => {
  const insets = useSafeAreaInsets();

  const modelLabel =
    currentModel === 'gemini-3-pro-image-preview' ? 'Gemini 3 Pro' : 'Gemini Nano';

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
      <View style={styles.contentRow}>
        {/* Brand / Logo */}
        <View style={styles.brandRow}>
          <View style={styles.logoIconBadge}>
            <Smartphone size={18} color="#ffffff" strokeWidth={2.5} />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>AuraWall</Text>
              <View style={styles.studioBadge}>
                <Text style={styles.studioBadgeText}>STUDIO</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>AI Phone Wallpaper Generator</Text>
          </View>
        </View>

        {/* Right Actions */}
        <View style={styles.actionsRow}>
          {/* Active Model Indicator Chip */}
          <View style={styles.modelBadge}>
            <Sparkles size={12} color="#22d3ee" />
            <Text style={styles.modelBadgeText} numberOfLines={1}>
              {modelLabel}
            </Text>
          </View>

          {/* History / Gallery Button */}
          <Pressable
            onPress={onOpenHistory}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            accessibilityLabel={`Open wallpaper history, ${historyCount} items`}
          >
            <Clock size={18} color="#cbd5e1" />
            {historyCount > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {historyCount > 9 ? '9+' : historyCount}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Settings Button */}
          <Pressable
            onPress={onOpenSettings}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            accessibilityLabel="Open settings"
          >
            <Settings size={18} color="#cbd5e1" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#0a0b12',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  studioBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 99,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.35)',
  },
  studioBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#67e8f9',
    letterSpacing: 0.6,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94a3b8',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modelBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  iconButton: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ scale: 0.95 }],
  },
  countBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#020617',
  },
});
