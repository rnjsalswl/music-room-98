import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { win98 } from '../theme/win98';
import { fontBody } from '../theme/fonts';

// Pop-in info toast (mirrors the `.dc.html` `@keyframes popin` + tooltip-yellow bar).
export function Toast({ message }: { message: string | null }) {
  const translate = useRef(new Animated.Value(12)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    translate.setValue(12);
    opacity.setValue(0.4);
    Animated.parallel([
      Animated.timing(translate, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [message, translate, opacity]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateY: translate }], opacity }]}>
      <View style={styles.icon}><Text style={styles.iconText}>i</Text></View>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 116,
    zIndex: 90,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 10,
    backgroundColor: win98.tooltipBg,
    borderWidth: 2,
    borderColor: win98.black,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 6,
  },
  icon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: win98.titleFrom,
  },
  iconText: { color: win98.white, fontFamily: fontBody, fontWeight: '700', fontSize: 12 },
  text: { flex: 1, fontFamily: fontBody, fontSize: 11.5, lineHeight: 16, color: win98.windowText },
});
