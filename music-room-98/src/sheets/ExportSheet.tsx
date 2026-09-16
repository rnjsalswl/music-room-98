import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { win98, bevel, bevelStyle, platformSwatches } from '../theme/win98';
import { fontBody } from '../theme/fonts';
import { Win98Button } from '../components/Win98Button';
import { useAppState, dayMeta, exportTargetNames, ExportDay, members } from '../state/AppState';

const DAY_IDS: ExportDay[] = ['today', 'yday', 'week'];

export function ExportSheet() {
  const { state, activeDay, actions } = useAppState();
  const target = state.exportTarget || state.myPlatform;
  const hint =
    target === '텍스트로 복사 / 내보내기'
      ? '곡 목록을 텍스트·M3U로 받습니다. 플랫폼 계정이 필요 없습니다.'
      : `${target}에서 찾을 수 없는 곡은 건너뛰고, 목록 끝에 따로 표시합니다.`;

  return (
    <View style={styles.wrap}>
      <View style={[styles.summary, bevelStyle(bevel.sunkenOuter)]}>
        <View style={styles.summaryIcon}><Text style={styles.summaryIconText}>💾</Text></View>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryTitle}>야간 산책 09/16 (화)</Text>
          <Text style={styles.summarySub}>그 날 올라온 {state.entries.length}곡 · 멤버 {members.length}명</Text>
        </View>
      </View>

      <View>
        <Text style={styles.fieldLabel}>내보낼 날짜</Text>
        <View style={styles.dayRow}>
          {DAY_IDS.map((id) => {
            const active = state.exportDay === id;
            return (
              <Win98Button
                key={id}
                flat
                active={active}
                style={styles.dayBtn}
                textStyle={styles.dayText}
                onPress={() => actions.setExportDay(id)}
              >
                {dayMeta[id].label}
              </Win98Button>
            );
          })}
        </View>
      </View>

      <View>
        <Text style={styles.fieldLabel}>내보낼 곳</Text>
        <View style={[styles.targetList, bevelStyle(bevel.sunkenOuter)]}>
          {exportTargetNames.map((name) => {
            const active = target === name;
            const isText = name === '텍스트로 복사 / 내보내기';
            return (
              <Pressable
                key={name}
                style={[styles.targetRow, { backgroundColor: active ? win98.titleFrom : win98.fieldBg }]}
                onPress={() => actions.setExportTarget(name)}
              >
                <View style={[styles.mark, bevelStyle(bevel.sunkenOuter)]}>
                  <Text style={styles.markText}>{active ? '●' : ''}</Text>
                </View>
                <View style={[styles.swatch, { backgroundColor: isText ? win98.face : platformSwatches[name] }]} />
                <Text style={[styles.targetName, { color: active ? win98.white : win98.windowText }]} numberOfLines={1}>
                  {name}
                </Text>
                <Text style={[styles.targetNote, { color: active ? win98.white : win98.windowText }]}>
                  {isText ? 'M3U · 곡 목록' : name === state.myPlatform ? '기본' : '연결됨'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>{hint}</Text>
      </View>

      <View style={styles.actions}>
        <Win98Button style={styles.grow} onPress={actions.doExport}>내보내기</Win98Button>
        <Win98Button style={styles.cancel} textStyle={styles.cancelText} onPress={actions.closeSheet}>취소</Win98Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 11 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 8, backgroundColor: win98.fieldBg },
  summaryIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: win98.face, borderWidth: 2, borderColor: win98.white },
  summaryIconText: { fontSize: 17 },
  summaryInfo: { flex: 1 },
  summaryTitle: { fontFamily: fontBody, fontWeight: '700', fontSize: 12.5 },
  summarySub: { fontFamily: fontBody, fontSize: 11, color: '#303030' },
  fieldLabel: { fontFamily: fontBody, fontWeight: '700', fontSize: 11, marginBottom: 4 },
  dayRow: { flexDirection: 'row', gap: 4 },
  dayBtn: { flex: 1, minHeight: 36 },
  dayText: { fontSize: 11.5 },
  targetList: { backgroundColor: win98.fieldBg },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: win98.darkGray,
    borderStyle: 'dotted',
  },
  mark: { width: 13, height: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: win98.white },
  markText: { fontFamily: fontBody, fontWeight: '700', fontSize: 9 },
  swatch: { width: 20, height: 20, borderWidth: 1, borderColor: win98.black },
  targetName: { flex: 1, fontFamily: fontBody, fontWeight: '700', fontSize: 12.5 },
  targetNote: { fontFamily: fontBody, fontSize: 10.5 },
  banner: { padding: 7, backgroundColor: win98.tooltipBg, borderWidth: 1, borderColor: win98.black },
  bannerText: { fontFamily: fontBody, fontSize: 11, lineHeight: 16 },
  actions: { flexDirection: 'row', gap: 7 },
  grow: { flex: 1 },
  cancel: { paddingHorizontal: 13 },
  cancelText: { fontSize: 12.5 },
});
