import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { win98, bevel, bevelStyle } from '../theme/win98';
import { fontBody, fontHeading } from '../theme/fonts';
import { Win98Button } from '../components/Win98Button';
import { EqualizerBars } from '../components/EqualizerBars';
import { VaporwaveArt } from '../components/VaporwaveArt';
import { useAppState, members } from '../state/AppState';
import { nowPlaying } from '../data/mock';

export function RoomFeedScreen() {
  const { state, actions } = useAppState();
  const memberLabel = `${members.length}/8명`;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={[styles.card, bevelStyle(bevel.raisedOuter)]}>
        <View style={styles.rowBetween}>
          <View style={styles.rowGap}>
            <EqualizerBars />
            <Text style={styles.label}>내가 지금 듣는 중</Text>
          </View>
          <View style={styles.platformBadge}>
            <Text style={styles.platformBadgeText}>{state.myPlatform}</Text>
          </View>
        </View>

        <View style={[styles.nowRow, bevelStyle(bevel.sunkenOuter)]}>
          <VaporwaveArt size={46} glyph={nowPlaying.glyph} gradient={nowPlaying.gradient} fontSize={20} />
          <View style={styles.nowInfo}>
            <Text style={styles.nowTitle} numberOfLines={1}>{nowPlaying.title}</Text>
            <Text style={styles.nowArtist} numberOfLines={1}>{nowPlaying.artist}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${nowPlaying.progressPct}%` }]} />
            </View>
          </View>
          <Text style={styles.nowTime}>{nowPlaying.timeLeft}</Text>
        </View>

        <View style={styles.actionsRow}>
          <Win98Button style={styles.grow} onPress={actions.openShare}>▶ 이 곡 방에 공유</Win98Button>
          <Win98Button style={styles.inviteBtn} textStyle={styles.smallText} onPress={actions.openInvite}>{memberLabel}</Win98Button>
        </View>
      </View>

      <View style={[styles.togetherRow, bevelStyle(bevel.raisedOuter)]}>
        <Text style={styles.togetherLabel}>같이 듣기 (동시 재생)</Text>
        <Win98Button flat style={styles.togetherBtn} textStyle={styles.smallText} onPress={actions.toggleTogether}>
          <View style={styles.togetherBtnInner}>
            <View style={[styles.checkbox, bevelStyle(bevel.sunkenOuter)]}>
              <Text style={styles.checkboxText}>{state.together ? '✓' : ''}</Text>
            </View>
            <Text style={styles.smallText}>{state.together ? '켜짐' : '꺼짐'}</Text>
          </View>
        </Win98Button>
      </View>

      {state.together && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            <Text style={styles.bold}>{members.length}명</Text>이 같은 타임코드에서 듣고 있습니다. 누가 곡을 바꾸면 방 전체가 따라갑니다.
          </Text>
        </View>
      )}

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>셋로그</Text>
        <Text style={styles.sectionMeta}>오늘 · {state.entries.length}곡</Text>
      </View>

      {state.syncing && state.entries.length === 0 && (
        <Text style={styles.syncingText}>방에 연결하는 중…</Text>
      )}

      <View>
        {state.entries.map((e, i) => (
          <Pressable
            key={e.id}
            style={({ pressed }) => [styles.entryRow, pressed && styles.entryRowPressed]}
            onPress={() => actions.openPlay(e.id)}
          >
            <Text style={styles.entryNo}>{String(state.entries.length - i).padStart(2, '0')}</Text>
            <VaporwaveArt size={44} glyph={e.glyph} gradient={e.gradient} fontSize={18} />
            <View style={styles.entryInfo}>
              <Text style={styles.entryTitle} numberOfLines={1}>{e.title}</Text>
              <Text style={styles.entryArtist} numberOfLines={1}>{e.artist}</Text>
              <View style={styles.entryMetaRow}>
                <View style={[styles.avatar, { backgroundColor: e.userBg }]}>
                  <Text style={styles.avatarText}>{e.userInitial}</Text>
                </View>
                <Text style={styles.entryMeta}>{e.user} · {e.time}</Text>
                <View style={styles.platformTag}>
                  <Text style={styles.platformTagText}>{e.platform}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.playChip, bevelStyle(bevel.raisedOuter)]}>
              <Text style={styles.playChipText}>▶</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Win98Button style={styles.exportBtn} textStyle={styles.exportText} onPress={actions.openExport}>
        💾 오늘 셋로그 {state.entries.length}곡 → 플레이리스트로 내보내기
      </Win98Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: win98.fieldBg },
  content: { padding: 8, gap: 11, paddingBottom: 24 },
  card: { backgroundColor: win98.face, padding: 8, gap: 7 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowGap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontFamily: fontBody, fontWeight: '700', fontSize: 11 },
  platformBadge: { backgroundColor: win98.titleFrom, paddingHorizontal: 6, paddingVertical: 1 },
  platformBadgeText: { fontFamily: fontBody, fontWeight: '700', fontSize: 10.5, color: win98.white },
  nowRow: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 7, backgroundColor: win98.screenBg },
  nowInfo: { flex: 1 },
  nowTitle: { fontFamily: fontBody, fontWeight: '700', fontSize: 13.5, color: win98.screenGreen },
  nowArtist: { fontFamily: fontBody, fontSize: 11.5, color: win98.screenGreenDim },
  progressTrack: { marginTop: 5, height: 7, backgroundColor: '#004b2e', flexDirection: 'row', padding: 1 },
  progressFill: { backgroundColor: win98.screenGreen },
  nowTime: { fontFamily: fontBody, fontSize: 11, color: win98.screenGreenDim },
  actionsRow: { flexDirection: 'row', gap: 6, marginTop: 1 },
  grow: { flex: 1 },
  inviteBtn: { paddingHorizontal: 11 },
  smallText: { fontSize: 12 },
  togetherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 5,
    paddingHorizontal: 7,
    backgroundColor: win98.face,
  },
  togetherLabel: { flex: 1, fontFamily: fontBody, fontWeight: '700', fontSize: 12 },
  togetherBtn: { minHeight: 0, paddingVertical: 5 },
  togetherBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkbox: { width: 13, height: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: win98.white },
  checkboxText: { fontSize: 10, fontFamily: fontBody },
  banner: { padding: 7, backgroundColor: win98.tooltipBg, borderWidth: 1, borderColor: win98.black },
  bannerText: { fontFamily: fontBody, fontSize: 11.5, lineHeight: 16 },
  bold: { fontWeight: '700' },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: win98.darkGray,
  },
  sectionTitle: { fontFamily: fontHeading, fontSize: 17 },
  sectionMeta: { fontFamily: fontBody, fontSize: 11 },
  syncingText: { fontFamily: fontBody, fontSize: 11, color: win98.mutedText, fontStyle: 'italic' },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 7,
    paddingHorizontal: 6,
    backgroundColor: win98.fieldBg,
    borderBottomWidth: 1,
    borderBottomColor: win98.darkGray,
    borderStyle: 'dotted',
  },
  entryRowPressed: { backgroundColor: win98.tooltipBg },
  entryNo: { width: 17, textAlign: 'right', fontFamily: fontBody, fontWeight: '700', fontSize: 11, color: win98.darkGray },
  entryInfo: { flex: 1, gap: 1 },
  entryTitle: { fontFamily: fontBody, fontWeight: '700', fontSize: 13 },
  entryArtist: { fontFamily: fontBody, fontSize: 11.5, color: win98.mutedText },
  entryMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  avatar: { width: 15, height: 15, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fontBody, fontWeight: '700', fontSize: 8.5, color: win98.white },
  entryMeta: { fontFamily: fontBody, fontSize: 10.5, color: win98.mutedText },
  platformTag: { backgroundColor: win98.face, paddingHorizontal: 5, borderWidth: 1, borderColor: win98.darkGray },
  platformTagText: { fontFamily: fontBody, fontWeight: '700', fontSize: 10 },
  playChip: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: win98.face },
  playChipText: { fontSize: 10 },
  exportBtn: { width: '100%' },
  exportText: { fontSize: 12.5 },
});
