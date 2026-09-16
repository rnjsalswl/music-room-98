import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { win98, bevel, bevelStyle, platformSwatches } from '../theme/win98';
import { fontBody, fontHeading } from '../theme/fonts';
import { useAppState, platformList } from '../state/AppState';
import { profileName, profileSummary } from '../data/mock';

const LINKED_COUNT = 4;

export function MeScreen() {
  const { state, actions } = useAppState();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={[styles.profileCard, bevelStyle(bevel.raisedOuter)]}>
        <View style={[styles.avatar, bevelStyle(bevel.sunkenOuter)]}>
          <Text style={styles.avatarText}>지</Text>
        </View>
        <View>
          <Text style={styles.profileName}>{profileName}</Text>
          <Text style={styles.profileSummary}>{profileSummary}</Text>
        </View>
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>플랫폼 연결</Text>
        <Text style={styles.sectionMeta}>기본 1개</Text>
      </View>

      <View>
        {platformList.map((name, i) => {
          const isMine = name === state.myPlatform;
          const linked = i < LINKED_COUNT;
          return (
            <Pressable
              key={name}
              style={({ pressed }) => [
                styles.row,
                { backgroundColor: isMine ? win98.titleFrom : pressed ? win98.tooltipBg : win98.fieldBg },
              ]}
              onPress={() => actions.setPlatform(name)}
            >
              <View style={[styles.mark, bevelStyle(bevel.sunkenOuter)]}>
                <Text style={styles.markText}>{isMine ? '●' : linked ? '✓' : ''}</Text>
              </View>
              <View style={[styles.swatch, { backgroundColor: platformSwatches[name] }]} />
              <Text style={[styles.rowName, { color: isMine ? win98.white : win98.windowText }]} numberOfLines={1}>
                {name}
              </Text>
              <Text style={[styles.rowState, { color: isMine ? win98.white : win98.windowText }]}>
                {isMine ? '기본' : linked ? '연결됨' : '연결하기'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>기본으로 지정한 플랫폼에서 방의 모든 곡이 열립니다. 방 멤버가 다른 앱을 써도 상관없습니다.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: win98.fieldBg },
  content: { padding: 8, gap: 10, paddingBottom: 24 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 9,
    backgroundColor: win98.face,
  },
  avatar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c67139' },
  avatarText: { fontFamily: fontHeading, fontSize: 19, color: win98.white },
  profileName: { fontFamily: fontBody, fontWeight: '700', fontSize: 14 },
  profileSummary: { fontFamily: fontBody, fontSize: 11.5 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: win98.darkGray,
  },
  sectionTitle: { fontFamily: fontHeading, fontSize: 17 },
  sectionMeta: { fontFamily: fontBody, fontSize: 11 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: win98.darkGray,
    borderStyle: 'dotted',
  },
  mark: { width: 14, height: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: win98.white },
  markText: { fontFamily: fontBody, fontWeight: '700', fontSize: 10 },
  swatch: { width: 22, height: 22, borderWidth: 1, borderColor: win98.black },
  rowName: { flex: 1, fontFamily: fontBody, fontWeight: '700', fontSize: 13 },
  rowState: { fontFamily: fontBody, fontWeight: '700', fontSize: 10.5 },
  banner: { padding: 7, backgroundColor: win98.tooltipBg, borderWidth: 1, borderColor: win98.black },
  bannerText: { fontFamily: fontBody, fontSize: 11, lineHeight: 16 },
});
