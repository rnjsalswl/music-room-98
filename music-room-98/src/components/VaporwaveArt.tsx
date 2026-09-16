import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fontHeading } from '../theme/fonts';
import { win98 } from '../theme/win98';

type Props = {
  size: number;
  glyph: string;
  gradient: [string, string];
  fontSize?: number;
};

// Vaporwave album-art fallback tile — pink/cyan diagonal gradient with a
// scanline overlay, standing in for the prototype's CSS dither+scanline fill
// (used wherever no real album art has been supplied).
export function VaporwaveArt({ size, glyph, gradient, fontSize }: Props) {
  return (
    <View style={{ width: size, height: size, overflow: 'hidden' }}>
      <LinearGradient
        colors={[gradient[0], '#8a4be0', gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.scanlines} pointerEvents="none">
        {Array.from({ length: Math.ceil(size / 4) }).map((_, i) => (
          <View
            key={i}
            style={{
              height: 1,
              marginBottom: 3,
              backgroundColor: i % 2 === 0 ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.06)',
            }}
          />
        ))}
      </View>
      <View style={styles.glyphWrap} pointerEvents="none">
        <Text style={[styles.glyph, { fontSize: fontSize ?? size * 0.42 }]}>{glyph}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scanlines: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  glyphWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  glyph: { fontFamily: fontHeading, color: win98.white },
});
