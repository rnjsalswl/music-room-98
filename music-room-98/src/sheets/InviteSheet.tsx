import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { win98, bevel, bevelStyle } from '../theme/win98';
import { fontBody, fontHeading } from '../theme/fonts';
import { Win98Button } from '../components/Win98Button';
import { useAppState, members } from '../state/AppState';
import { roomCode } from '../data/mock';

export function InviteSheet() {
  const { seatCap, actions } = useAppState();
  const seats = Array.from({ length: seatCap }, (_, i) => members[i] ?? null);

  return (
    <View style={styles.wrap}>
      <Text style={styles.intro}>
        이 방은 <Text style={styles.bold}>{members.length}/{seatCap}명</Text>입니다. 코드를 받은 사람만 들어올 수 있습니다.
      </Text>

      <View style={styles.codeRow}>
        <View style={[styles.codeBox, bevelStyle(bevel.sunkenOuter)]}>
          <Text style={styles.codeText}>{roomCode}</Text>
        </View>
        <Win98Button style={styles.copyBtn} textStyle={styles.copyText}>복사</Win98Button>
      </View>

      <View>
        <Text style={styles.fieldLabel}>자리 {seatCap}개</Text>
        <View style={[styles.grid, bevelStyle(bevel.sunkenOuter)]}>
          {seats.map((m, i) => (
            <View key={i} style={styles.seat}>
              <View style={[styles.face, { backgroundColor: m ? m.face : win98.face }]}>
                <Text style={[styles.faceText, { color: m ? win98.white : win98.darkGray }]}>{m ? m.glyph : '＋'}</Text>
              </View>
              <Text style={styles.faceName}>{m ? m.name : '빈자리'}</Text>
            </View>
          ))}
        </View>
      </View>

      <Win98Button style={styles.confirm} onPress={actions.closeSheet}>확인</Win98Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 11 },
  intro: { fontFamily: fontBody, fontSize: 12, lineHeight: 18 },
  bold: { fontWeight: '700' },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  codeBox: { flex: 1, paddingVertical: 9, paddingHorizontal: 10, backgroundColor: win98.fieldBg },
  codeText: { fontFamily: fontHeading, fontSize: 20, letterSpacing: 2 },
  copyBtn: { paddingHorizontal: 12 },
  copyText: { fontSize: 12 },
  fieldLabel: { fontFamily: fontBody, fontWeight: '700', fontSize: 11, marginBottom: 5 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 6,
    gap: 5,
    backgroundColor: win98.fieldBg,
  },
  seat: { width: '22%', alignItems: 'center', gap: 3, paddingVertical: 6 },
  face: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: win98.black },
  faceText: { fontFamily: fontHeading, fontSize: 13 },
  faceName: { fontFamily: fontBody, fontWeight: '700', fontSize: 10 },
  confirm: { width: '100%' },
});
