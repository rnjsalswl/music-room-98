import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { win98, bevel, bevelStyle } from '../theme/win98';
import { fontBody } from '../theme/fonts';
import { Win98Button } from '../components/Win98Button';
import { useAppState, roomData, members } from '../state/AppState';

export function RoomListScreen() {
  const { actions } = useAppState();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>내 방</Text>
        <Text style={styles.sectionMeta}>한 방 최대 8명</Text>
      </View>

      {roomData.map((r) => (
        <Pressable
          key={r.id}
          style={({ pressed }) => [styles.roomRow, bevelStyle(pressed ? bevel.pressedOuter : bevel.raisedOuter), pressed && styles.roomRowPressed]}
          onPress={actions.goRoom}
        >
          <View style={styles.roomTop}>
            <View style={[styles.dot, { backgroundColor: r.dotColor }]} />
            <Text style={styles.roomName} numberOfLines={1}>{r.name}</Text>
            <View style={styles.seatsBadge}>
              <Text style={styles.seatsBadgeText}>{r.seats}</Text>
            </View>
          </View>
          <View style={styles.roomBottom}>
            <View style={styles.faces}>
              {members.slice(0, 3).map((m, i) => (
                <View key={i} style={[styles.face, { backgroundColor: m.face }]}>
                  <Text style={styles.faceText}>{m.glyph}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.roomLast} numberOfLines={1}>{r.last}</Text>
          </View>
        </Pressable>
      ))}

      <Win98Button style={styles.newRoomBtn} onPress={actions.openInvite}>＋ 새 방 만들기</Win98Button>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>방은 초대 코드로만 들어옵니다. 공개 검색은 없습니다.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: win98.fieldBg },
  content: { padding: 8, gap: 10, paddingBottom: 24 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: win98.darkGray,
  },
  sectionTitle: { fontFamily: fontBody, fontWeight: '700', fontSize: 15 },
  sectionMeta: { fontFamily: fontBody, fontSize: 11 },
  roomRow: { padding: 9, gap: 6, backgroundColor: win98.face },
  roomRowPressed: { backgroundColor: win98.faceHover },
  roomTop: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 11, height: 11, borderWidth: 1, borderColor: win98.black },
  roomName: { flex: 1, fontFamily: fontBody, fontWeight: '700', fontSize: 14 },
  seatsBadge: { backgroundColor: win98.titleFrom, paddingHorizontal: 6, paddingVertical: 1 },
  seatsBadgeText: { fontFamily: fontBody, fontWeight: '700', fontSize: 10.5, color: win98.white },
  roomBottom: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  faces: { flexDirection: 'row', gap: 3 },
  face: { width: 17, height: 17, alignItems: 'center', justifyContent: 'center' },
  faceText: { fontFamily: fontBody, fontWeight: '700', fontSize: 9, color: win98.white },
  roomLast: { flex: 1, fontFamily: fontBody, fontSize: 11, color: '#202020' },
  newRoomBtn: { width: '100%' },
  banner: { padding: 7, backgroundColor: win98.tooltipBg, borderWidth: 1, borderColor: win98.black },
  bannerText: { fontFamily: fontBody, fontSize: 11, lineHeight: 16 },
});
