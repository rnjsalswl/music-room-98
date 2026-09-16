import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { win98, bevel, bevelStyle } from '../theme/win98';
import { fontBody } from '../theme/fonts';

type Props = {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  style?: object;
};

// The beveled gray window frame with a navy→blue gradient titlebar, reused for
// every screen and every modal sheet — mirrors the repeated inline-style chrome
// in the .dc.html prototype's window shell.
export function Win98Window({ title, right, children, style }: Props) {
  return (
    <View style={[styles.window, bevelStyle(bevel.raisedOuter), style]}>
      <LinearGradient
        colors={[win98.titleFrom, win98.titleTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.titlebar}
      >
        <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
        {right}
      </LinearGradient>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    backgroundColor: win98.face,
  },
  titlebar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    gap: 7,
  },
  titleText: {
    flex: 1,
    color: win98.white,
    fontFamily: fontBody,
    fontWeight: '700',
    fontSize: 12,
  },
  body: {
    flex: 1,
  },
});
