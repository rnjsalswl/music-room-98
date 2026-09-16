import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { win98, bevel, bevelStyle } from '../theme/win98';
import { fontBody } from '../theme/fonts';
import { Win98Button } from '../components/Win98Button';
import { VaporwaveArt } from '../components/VaporwaveArt';
import { useAppState, roomData } from '../state/AppState';
import { nowPlaying } from '../data/mock';

export function ShareSheet() {
  const { state, actions } = useAppState();

  return (
    <View style={styles.wrap}>
      <View style={[styles.nowRow, bevelStyle(bevel.sunkenOuter)]}>
        <VaporwaveArt size={48} glyph={nowPlaying.glyph} gradient={nowPlaying.gradient} fontSize={20} />
        <View style={styles.nowInfo}>
          <Text style={styles.nowTitle}>{nowPlaying.title}</Text>
          <Text style={styles.nowArtist}>유정하 · {state.myPlatform}에서 재생 중</Text>
        </View>
      </View>

      <View>
        <Text style={styles.fieldLabel}>한 줄 메모 (선택)</Text>
        <TextInput
          value={state.note}
          onChangeText={actions.setNote}
          placeholder="새벽에 들으면 다름"
          placeholderTextColor="#808080"
          style={[styles.input, bevelStyle(bevel.sunkenOuter)]}
        />
      </View>

      <View>
        <Text style={styles.fieldLabel}>보낼 방</Text>
        <View style={[styles.roomList, bevelStyle(bevel.sunkenOuter)]}>
          {roomData.map((r) => {
            const picked = state.picked.includes(r.id);
            return (
              <Pressable
                key={r.id}
                style={[styles.roomRow, { backgroundColor: picked ? win98.titleFrom : win98.fieldBg }]}
                onPress={() => actions.pickRoom(r.id)}
              >
                <View style={[styles.check, bevelStyle(bevel.sunkenOuter)]}>
                  <Text style={styles.checkText}>{picked ? '✓' : ''}</Text>
                </View>
                <Text style={[styles.roomName, { color: picked ? win98.white : win98.windowText }]} numberOfLines={1}>
                  {r.name}
                </Text>
                <Text style={[styles.roomSeats, { color: picked ? win98.white : win98.windowText }]}>{r.seats}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Win98Button style={styles.submit} onPress={actions.doShare}>셋로그에 올리기</Win98Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 11 },
  nowRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 8, backgroundColor: win98.fieldBg },
  nowInfo: { flex: 1 },
  nowTitle: { fontFamily: fontBody, fontWeight: '700', fontSize: 14 },
  nowArtist: { fontFamily: fontBody, fontSize: 11.5 },
  fieldLabel: { fontFamily: fontBody, fontWeight: '700', fontSize: 11, marginBottom: 4 },
  input: {
    minHeight: 40,
    padding: 8,
    fontFamily: fontBody,
    fontSize: 12.5,
    backgroundColor: win98.fieldBg,
    color: win98.windowText,
  },
  roomList: { backgroundColor: win98.fieldBg },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: win98.darkGray,
    borderStyle: 'dotted',
  },
  check: { width: 14, height: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: win98.white },
  checkText: { fontFamily: fontBody, fontWeight: '700', fontSize: 10 },
  roomName: { flex: 1, fontFamily: fontBody, fontWeight: '700', fontSize: 12.5 },
  roomSeats: { fontFamily: fontBody, fontSize: 11 },
  submit: { width: '100%' },
});
