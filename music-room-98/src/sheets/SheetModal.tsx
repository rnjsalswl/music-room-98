import React, { ReactNode, useEffect, useRef } from 'react';
import { Modal, Pressable, View, Text, Animated, StyleSheet } from 'react-native';
import { win98, bevel, bevelStyle } from '../theme/win98';
import { fontBody } from '../theme/fonts';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

// Modal backdrop + beveled window chrome shared by all four bottom sheets
// (play / share / invite / export) — mirrors the prototype's overlay + popin.
export function SheetModal({ visible, title, onClose, children }: Props) {
  const translate = useRef(new Animated.Value(12)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!visible) return;
    translate.setValue(12);
    opacity.setValue(0.4);
    Animated.parallel([
      Animated.timing(translate, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [visible, translate, opacity]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[styles.window, bevelStyle(bevel.raisedOuter), { transform: [{ translateY: translate }], opacity }]}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={[win98.titleFrom, win98.titleTo]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.titlebar}
            >
              <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
              <Pressable style={[styles.closeBtn, bevelStyle(bevel.raisedOuter)]} onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </LinearGradient>
            <View style={styles.body}>{children}</View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  window: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: win98.face,
  },
  titlebar: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 4, paddingHorizontal: 6 },
  titleText: { flex: 1, color: win98.white, fontFamily: fontBody, fontWeight: '700', fontSize: 12 },
  closeBtn: { width: 17, height: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: win98.face },
  closeText: { fontFamily: fontBody, fontWeight: '700', fontSize: 10 },
  body: { padding: 12, gap: 11 },
});
