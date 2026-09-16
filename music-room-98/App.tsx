import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { win98, bevel, bevelStyle } from './src/theme/win98';
import { fontBody, useWin98Fonts } from './src/theme/fonts';
import { AppStateProvider, useAppState, members } from './src/state/AppState';
import { RoomListScreen } from './src/screens/RoomListScreen';
import { RoomFeedScreen } from './src/screens/RoomFeedScreen';
import { MeScreen } from './src/screens/MeScreen';
import { BottomTabBar } from './src/components/BottomTabBar';
import { NowPlayingBar } from './src/components/NowPlayingBar';
import { Toast } from './src/components/Toast';
import { SheetHost } from './src/sheets/SheetHost';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [fontsLoaded] = useWin98Fonts();

  return (
    <SafeAreaProvider>
      {fontsLoaded ? (
        <AppStateProvider>
          <AppShell />
        </AppStateProvider>
      ) : (
        <View style={styles.loading} />
      )}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const MENU_ITEMS = ['파일', '방', '보기', '도움말'];

function AppShell() {
  const insets = useSafeAreaInsets();
  const { state } = useAppState();
  const seatCap = 8;

  const winTitle =
    state.screen === 'room' ? '야간 산책 클럽 — 셋로그' : state.screen === 'home' ? '음악방.exe' : '내 계정 — 플랫폼 연결';
  const statusText = state.together
    ? '같이 듣기 켜짐 — 방 전체가 같은 곡을 재생합니다'
    : state.now
    ? `${state.myPlatform}에서 재생 중`
    : '준비됨';
  const memberLabel = `${members.length}/${seatCap}명`;

  return (
    <View style={[styles.desktop, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={[styles.window, bevelStyle(bevel.raisedOuter)]}>
        <LinearGradient
          colors={[win98.titleFrom, win98.titleTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.titlebar}
        >
          <View style={[styles.titleIcon, bevelStyle(bevel.raisedOuter)]}>
            <Text style={styles.titleIconText}>♪</Text>
          </View>
          <Text style={styles.titleText} numberOfLines={1}>{winTitle}</Text>
          <View style={styles.chromeBtns}>
            <View style={[styles.chromeBtn, bevelStyle(bevel.raisedOuter)]}><Text style={styles.chromeGlyph}>_</Text></View>
            <View style={[styles.chromeBtn, bevelStyle(bevel.raisedOuter)]}><Text style={styles.chromeGlyphSm}>□</Text></View>
            <View style={[styles.chromeBtn, bevelStyle(bevel.raisedOuter)]}><Text style={styles.chromeGlyph}>✕</Text></View>
          </View>
        </LinearGradient>

        <View style={styles.menuBar}>
          {MENU_ITEMS.map((m) => (
            <Text key={m} style={styles.menuItem}>{m}</Text>
          ))}
        </View>

        <View style={[styles.contentArea, bevelStyle(bevel.sunkenOuter)]}>
          {state.screen === 'room' && <RoomFeedScreen />}
          {state.screen === 'home' && <RoomListScreen />}
          {state.screen === 'me' && <MeScreen />}
        </View>

        <View style={styles.statusBar}>
          <View style={[styles.statusChip, styles.statusChipGrow, bevelStyle(bevel.sunkenOuter)]}>
            <Text style={styles.statusText} numberOfLines={1}>{statusText}</Text>
          </View>
          <View style={[styles.statusChip, bevelStyle(bevel.sunkenOuter)]}>
            <Text style={styles.statusText}>{memberLabel}</Text>
          </View>
        </View>
      </View>

      <NowPlayingBar />

      <BottomTabBar />

      <Toast message={state.toast || null} />
      <SheetHost />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: win98.desktop },
  desktop: {
    flex: 1,
    backgroundColor: win98.desktop,
  },
  window: {
    flex: 1,
    margin: 8,
    backgroundColor: win98.face,
  },
  titlebar: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 4, paddingHorizontal: 6 },
  titleIcon: { width: 15, height: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: win98.face },
  titleIconText: { fontSize: 9 },
  titleText: { flex: 1, color: win98.white, fontFamily: fontBody, fontWeight: '700', fontSize: 12 },
  chromeBtns: { flexDirection: 'row', gap: 2 },
  chromeBtn: { width: 17, height: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: win98.face },
  chromeGlyph: { fontFamily: fontBody, fontWeight: '700', fontSize: 10 },
  chromeGlyphSm: { fontFamily: fontBody, fontSize: 9 },
  menuBar: { flexDirection: 'row', gap: 2, paddingVertical: 2, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: win98.darkGray },
  menuItem: { fontFamily: fontBody, fontSize: 11.5, paddingVertical: 2, paddingHorizontal: 7, textDecorationLine: 'underline' },
  contentArea: { flex: 1, margin: 4, backgroundColor: win98.fieldBg, overflow: 'hidden' },
  statusBar: { flexDirection: 'row', gap: 4, paddingHorizontal: 4, paddingTop: 3, paddingBottom: 4 },
  statusChip: { paddingVertical: 2, paddingHorizontal: 6, backgroundColor: win98.face },
  statusChipGrow: { flex: 1 },
  statusText: { fontFamily: fontBody, fontSize: 10.5 },
});
