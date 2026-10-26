import React from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle, ImageStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface WallpaperRendererProps {
  imageUrl: string;
  rawSvgXml?: string;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  width?: number | string;
  height?: number | string;
}

export const WallpaperRenderer: React.FC<WallpaperRendererProps> = ({
  imageUrl,
  rawSvgXml,
  style,
  width = '100%',
  height = '100%',
}) => {
  // If raw SVG XML string was provided
  if (rawSvgXml) {
    return (
      <View style={[styles.container, style]}>
        <SvgXml xml={rawSvgXml} width={width} height={height} />
      </View>
    );
  }

  // If data URI contains SVG
  if (imageUrl.startsWith('data:image/svg+xml')) {
    let xml = '';
    try {
      if (imageUrl.includes(';utf8,')) {
        xml = decodeURIComponent(imageUrl.split(';utf8,')[1]);
      } else if (imageUrl.includes(';base64,')) {
        const base64Part = imageUrl.split(';base64,')[1];
        if (typeof atob === 'function') {
          xml = decodeURIComponent(escape(atob(base64Part)));
        }
      } else {
        xml = decodeURIComponent(imageUrl.replace(/^data:image\/svg\+xml;[^,]*,/, ''));
      }
    } catch {
      xml = '';
    }

    if (xml) {
      return (
        <View style={[styles.container, style]}>
          <SvgXml xml={xml} width={width} height={height} />
        </View>
      );
    }
  }

  // Standard Image (PNG/JPEG base64 or remote URL)
  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
