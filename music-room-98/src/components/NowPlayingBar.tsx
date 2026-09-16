import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { win98, bevel, bevelStyle } from '../theme/win98';
import { fontBody } from '../theme/fonts';
import { EqualizerBars } from './EqualizerBars';
import { Win98Button } from './Win98Button';
import { useAppState } from '../state/AppState';

// The mini deep-linked player strip that appears under the window once a
// shared track has been opened ("playHere"), with a stop control.
export function NowPlayingBar() {
  const { state, actions } = useAppState();
  if (!state.now) return null;

  return (
    <View style={[styles.wrap, bevelStyle(bevel.raisedOuter)]}>
      <EqualizerBars />
      <View style={[styles.screen, bevelStyle(bevel.sunkenOuter)]}>
        <Text style={styles.title} numberOfLines={1}>{state.now.title}</Text>
        <Text style={styles.sub} numberOfLines={1}>{state.myPlatform} 재생 중 · {state.now.from} 공유</Text>
      </View>
      <Win98Button style={styles.stop} textStyle={styles.stopText} onPress={actions.stopNow}>■</Win98Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 8,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    backgroundColor: win98.face,
  },
  screen: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: win98.screenBg,
  },
  title: { fontFamily: fontBody, fontWeight: '700', fontSize: 11.5, color: win98.screenGreen },
  sub: { fontFamily: fontBody, fontSize: 10, color: win98.screenGreenDim },
  stop: { width: 30, height: 30, minHeight: 30, padding: 0 },
  stopText: { fontSize: 10 },
});
