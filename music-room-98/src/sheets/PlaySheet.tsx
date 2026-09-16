import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { win98, bevel, bevelStyle, platformSwatches } from '../theme/win98';
import { fontBody } from '../theme/fonts';
import { Win98Button } from '../components/Win98Button';
import { VaporwaveArt } from '../components/VaporwaveArt';
import { useAppState } from '../state/AppState';

export function PlaySheet() {
  const { state, actions } = useAppState();
  const sel = state.entries.find((e) => e.id === state.selId);
  if (!sel) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <VaporwaveArt size={58} glyph={sel.glyph} gradient={sel.gradient} fontSize={23} />
        <View style={styles.info}>
          <Text style={styles.title}>{sel.title}</Text>
          <Text style={styles.artist}>{sel.artist}</Text>
          <Text style={styles.meta}>{sel.user}님이 {sel.platform}에서 공유 · {sel.time}</Text>
        </View>
      </View>

      {!!sel.note && (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>“{sel.note}”</Text>
        </View>
      )}

      <View style={[styles.platformRow, bevelStyle(bevel.sunkenOuter)]}>
        <View style={[styles.swatch, { backgroundColor: platformSwatches[state.myPlatform] }]} />
        <View style={styles.platformInfo}>
          <Text style={styles.platformTitle}>내 기본 플랫폼: {state.myPlatform}</Text>
          <Text style={styles.platformSub}>딥링크로 바로 이동해 내 계정에서 재생합니다</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Win98Button style={styles.grow} onPress={actions.playHere}>{state.myPlatform}에서 열기</Win98Button>
        <Win98Button style={styles.cancel} textStyle={styles.cancelText} onPress={actions.closeSheet}>취소</Win98Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 11 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  info: { flex: 1 },
  title: { fontFamily: fontBody, fontWeight: '700', fontSize: 15 },
  artist: { fontFamily: fontBody, fontSize: 12 },
  meta: { fontFamily: fontBody, fontSize: 11, color: '#303030', marginTop: 3 },
  noteBox: { padding: 9, backgroundColor: win98.tooltipBg, borderWidth: 1, borderColor: win98.black },
  noteText: { fontFamily: fontBody, fontSize: 12, lineHeight: 17 },
  platformRow: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 9, backgroundColor: win98.fieldBg },
  swatch: { width: 26, height: 26, borderWidth: 1, borderColor: win98.black },
  platformInfo: { flex: 1 },
  platformTitle: { fontFamily: fontBody, fontWeight: '700', fontSize: 12 },
  platformSub: { fontFamily: fontBody, fontSize: 11, color: '#303030' },
  actions: { flexDirection: 'row', gap: 7 },
  grow: { flex: 1 },
  cancel: { paddingHorizontal: 13 },
  cancelText: { fontSize: 12.5 },
});
