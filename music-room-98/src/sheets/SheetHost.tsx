import React from 'react';
import { SheetModal } from './SheetModal';
import { PlaySheet } from './PlaySheet';
import { ShareSheet } from './ShareSheet';
import { InviteSheet } from './InviteSheet';
import { ExportSheet } from './ExportSheet';
import { useAppState } from '../state/AppState';
import { roomCode } from '../data/mock';

const TITLES = {
  play: '재생 — 플랫폼 열기',
  share: '지금 듣는 곡 공유',
  invite: `멤버 초대 — ${roomCode}`,
  export: '플레이리스트 내보내기',
} as const;

export function SheetHost() {
  const { state, actions } = useAppState();
  const sheet = state.sheet;

  return (
    <SheetModal visible={!!sheet} title={sheet ? TITLES[sheet] : ''} onClose={actions.closeSheet}>
      {sheet === 'play' && <PlaySheet />}
      {sheet === 'share' && <ShareSheet />}
      {sheet === 'invite' && <InviteSheet />}
      {sheet === 'export' && <ExportSheet />}
    </SheetModal>
  );
}
