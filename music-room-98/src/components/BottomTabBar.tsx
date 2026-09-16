import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { win98, bevel, bevelStyle } from '../theme/win98';
import { fontBody } from '../theme/fonts';
import { Win98Button } from './Win98Button';
import { useAppState } from '../state/AppState';

const TABS = [
  { id: 'home', label: '홈', icon: '▣' },
  { id: 'room', label: '방', icon: '♫' },
  { id: 'me', label: '나', icon: '◉' },
] as const;

export function BottomTabBar() {
  const { state, actions } = useAppState();
  const [clock, setClock] = useState(formatClock());

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock()), 30000);
    return () => clearInterval(id);
  }, []);

  const goto = { home: actions.goHome, room: actions.goRoom, me: actions.goMe } as const;

  return (
    <View style={styles.wrap}>
      {TABS.map((t) => (
        <Win98Button key={t.id} style={styles.tab} active={state.screen === t.id} onPress={goto[t.id]}>
          <View style={styles.tabInner}>
            <Text style={styles.icon}>{t.icon}</Text>
            <Text style={styles.label}>{t.label}</Text>
          </View>
        </Win98Button>
      ))}
      <View style={[styles.clock, bevelStyle(bevel.sunkenOuter)]}>
        <Text style={styles.clockText}>{clock}</Text>
      </View>
    </View>
  );
}

function formatClock() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    backgroundColor: win98.face,
    borderTopWidth: 2,
    borderTopColor: win98.white,
  },
  tab: { flex: 1, minHeight: 34, paddingHorizontal: 0 },
  tabInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  icon: { fontSize: 13 },
  label: { fontFamily: fontBody, fontWeight: '700', fontSize: 11.5, color: win98.windowText },
  clock: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: win98.face,
  },
  clockText: { fontFamily: fontBody, fontSize: 11, color: win98.windowText },
});
