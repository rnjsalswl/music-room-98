import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { win98 } from '../theme/win98';

const DELAYS = [0, 260, 520];

// Three bouncing bars — the CSS `@keyframes eq` equivalent, looping 4px↔14px.
export function EqualizerBars({ color = win98.titleFrom }: { color?: string }) {
  const values = useRef(DELAYS.map(() => new Animated.Value(4))).current;

  useEffect(() => {
    const loops = values.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(DELAYS[i]),
          Animated.timing(v, { toValue: 14, duration: 450, useNativeDriver: false }),
          Animated.timing(v, { toValue: 4, duration: 450, useNativeDriver: false }),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [values]);

  return (
    <View style={styles.row}>
      {values.map((v, i) => (
        <Animated.View key={i} style={[styles.bar, { height: v, backgroundColor: color }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 14 },
  bar: { width: 3 },
});
