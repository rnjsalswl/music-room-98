import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { Entry, rooms as roomData, members } from '../data/mock';
import { platformList } from '../theme/win98';
import { openInPlatform } from '../integrations/deepLinks';
import { fetchRoomByCode, fetchEntries, insertEntry, setTogether, subscribeToRoom } from '../integrations/roomSync';

export type ScreenId = 'home' | 'room' | 'me';
export type SheetId = 'play' | 'share' | 'invite' | 'export' | null;
export type ExportDay = 'today' | 'yday' | 'week';

type State = {
  screen: ScreenId;
  sheet: SheetId;
  selId: string | null;
  now: { title: string; from: string } | null;
  note: string;
  picked: string[];
  together: boolean;
  myPlatform: string;
  toast: string;
  exportDay: ExportDay;
  exportTarget: string | null;
  entries: Entry[];
  roomId: string | null;
  seatCap: number;
  syncing: boolean;
};

const initialState: State = {
  screen: 'room',
  sheet: null,
  selId: null,
  now: null,
  note: '',
  picked: ['r1'],
  together: false,
  myPlatform: 'Spotify',
  toast: '',
  exportDay: 'today',
  exportTarget: null,
  entries: [],
  roomId: null,
  seatCap: 8,
  syncing: true,
};

type Action =
  | { type: 'SET_SCREEN'; screen: ScreenId }
  | { type: 'OPEN_SHEET'; sheet: Exclude<SheetId, null>; selId?: string }
  | { type: 'CLOSE_SHEET' }
  | { type: 'SET_PLATFORM'; platform: string }
  | { type: 'SET_NOTE'; note: string }
  | { type: 'TOGGLE_ROOM_PICK'; roomId: string }
  | { type: 'PLAY_HERE' }
  | { type: 'STOP_NOW' }
  | { type: 'DO_SHARE_UI' }
  | { type: 'SET_EXPORT_DAY'; day: ExportDay }
  | { type: 'SET_EXPORT_TARGET'; target: string }
  | { type: 'DO_EXPORT' }
  | { type: 'SET_TOAST'; message: string }
  | { type: 'CLEAR_TOAST' }
  | { type: 'HYDRATE_ROOM'; roomId: string; together: boolean; seatCap: number; entries: Entry[] }
  | { type: 'HYDRATE_FAILED' }
  | { type: 'REMOTE_ENTRY'; entry: Entry }
  | { type: 'REMOTE_TOGETHER'; together: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };
    case 'OPEN_SHEET':
      return { ...state, sheet: action.sheet, selId: action.selId ?? state.selId };
    case 'CLOSE_SHEET':
      return { ...state, sheet: null };
    case 'SET_PLATFORM':
      return { ...state, myPlatform: action.platform };
    case 'SET_NOTE':
      return { ...state, note: action.note };
    case 'TOGGLE_ROOM_PICK':
      return {
        ...state,
        picked: state.picked.includes(action.roomId)
          ? state.picked.filter((id) => id !== action.roomId)
          : state.picked.concat(action.roomId),
      };
    case 'PLAY_HERE': {
      const sel = state.entries.find((e) => e.id === state.selId);
      if (!sel) return { ...state, sheet: null };
      return { ...state, sheet: null, now: { title: sel.title, from: sel.user } };
    }
    case 'STOP_NOW':
      return { ...state, now: null };
    case 'DO_SHARE_UI':
      return { ...state, sheet: null, note: '', screen: 'room' };
    case 'SET_EXPORT_DAY':
      return { ...state, exportDay: action.day };
    case 'SET_EXPORT_TARGET':
      return { ...state, exportTarget: action.target };
    case 'DO_EXPORT':
      return { ...state, sheet: null };
    case 'SET_TOAST':
      return { ...state, toast: action.message };
    case 'CLEAR_TOAST':
      return { ...state, toast: '' };
    case 'HYDRATE_ROOM':
      return {
        ...state,
        roomId: action.roomId,
        together: action.together,
        seatCap: action.seatCap,
        entries: action.entries,
        syncing: false,
      };
    case 'HYDRATE_FAILED':
      return { ...state, syncing: false };
    case 'REMOTE_ENTRY':
      if (state.entries.some((e) => e.id === action.entry.id)) return state;
      return { ...state, entries: [action.entry, ...state.entries] };
    case 'REMOTE_TOGETHER':
      return { ...state, together: action.together };
    default:
      return state;
  }
}

export const dayMeta: Record<ExportDay, { label: string; count: number }> = {
  today: { label: '오늘 09/16', count: 0 },
  yday: { label: '어제 09/15', count: 9 },
  week: { label: '이번 주 전체', count: 31 },
};

export const exportTargetNames = [...platformList.slice(0, 4), '텍스트로 복사 / 내보내기'];

const ROOM_CODE = 'NIGHT-72';

type Ctx = {
  state: State;
  flash: (message: string) => void;
  activeDay: { id: ExportDay; label: string; count: number };
  seatCap: number;
  actions: {
    goHome: () => void;
    goRoom: () => void;
    goMe: () => void;
    openPlay: (entryId: string) => void;
    openShare: () => void;
    openInvite: () => void;
    openExport: () => void;
    closeSheet: () => void;
    toggleTogether: () => void;
    setPlatform: (name: string) => void;
    setNote: (text: string) => void;
    pickRoom: (roomId: string) => void;
    playHere: () => void;
    stopNow: () => void;
    doShare: () => void;
    setExportDay: (day: ExportDay) => void;
    setExportTarget: (target: string) => void;
    doExport: () => void;
  };
};

const AppContext = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((message: string) => {
    dispatch({ type: 'SET_TOAST', message });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2600);
  }, []);

  // Hydrate the shared room from Supabase, then stay subscribed so every
  // device viewing this room sees new setlog entries and the "같이 듣기"
  // toggle in real time — this is the one room this build talks to
  // (NIGHT-72 / 야간 산책 클럽); creating other rooms is still local-only.
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      try {
        const room = await fetchRoomByCode(ROOM_CODE);
        if (!room) throw new Error('room not found');
        const entries = await fetchEntries(room.id);
        if (cancelled) return;
        dispatch({ type: 'HYDRATE_ROOM', roomId: room.id, together: room.together, seatCap: room.seat_cap, entries });
        unsubscribe = subscribeToRoom(
          room.id,
          (entry) => dispatch({ type: 'REMOTE_ENTRY', entry }),
          (updatedRoom) => dispatch({ type: 'REMOTE_TOGETHER', together: updatedRoom.together })
        );
      } catch {
        if (cancelled) return;
        dispatch({ type: 'HYDRATE_FAILED' });
        flash('실시간 동기화 연결 실패 — 네트워크를 확인해주세요.');
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [flash]);

  const activeDay = useMemo(() => {
    const meta = dayMeta[state.exportDay];
    const count = state.exportDay === 'today' ? state.entries.length : meta.count;
    return { id: state.exportDay, label: meta.label, count };
  }, [state.exportDay, state.entries.length]);

  const actions = useMemo(
    () => ({
      goHome: () => dispatch({ type: 'SET_SCREEN', screen: 'home' }),
      goRoom: () => dispatch({ type: 'SET_SCREEN', screen: 'room' }),
      goMe: () => dispatch({ type: 'SET_SCREEN', screen: 'me' }),
      openPlay: (entryId: string) => dispatch({ type: 'OPEN_SHEET', sheet: 'play', selId: entryId }),
      openShare: () => dispatch({ type: 'OPEN_SHEET', sheet: 'share' }),
      openInvite: () => dispatch({ type: 'OPEN_SHEET', sheet: 'invite' }),
      openExport: () => dispatch({ type: 'OPEN_SHEET', sheet: 'export' }),
      closeSheet: () => dispatch({ type: 'CLOSE_SHEET' }),
      toggleTogether: () => {
        if (!state.roomId) return;
        const next = !state.together;
        setTogether(state.roomId, next).catch(() => flash('동기화 실패 — 네트워크를 확인해주세요.'));
      },
      setPlatform: (name: string) => {
        dispatch({ type: 'SET_PLATFORM', platform: name });
        flash(name + '을 기본 플랫폼으로 지정했습니다.');
      },
      setNote: (text: string) => dispatch({ type: 'SET_NOTE', note: text }),
      pickRoom: (roomId: string) => dispatch({ type: 'TOGGLE_ROOM_PICK', roomId }),
      playHere: () => {
        const sel = state.entries.find((e) => e.id === state.selId);
        dispatch({ type: 'PLAY_HERE' });
        flash(state.myPlatform + '에서 검색을 엽니다 — 실제 트랙 카탈로그 연동 전이라 제목/아티스트로 검색합니다.');
        if (sel) openInPlatform(state.myPlatform, sel.title, sel.artist).catch(() => {});
      },
      stopNow: () => dispatch({ type: 'STOP_NOW' }),
      doShare: () => {
        if (!state.roomId) {
          flash('방 동기화가 아직 준비되지 않았습니다.');
          return;
        }
        const entry = {
          user: '지민',
          userInitial: '지',
          userBg: '#8c491a',
          title: '밤의 산책',
          artist: '유정하',
          platform: state.myPlatform,
          glyph: '밤',
          gradient: ['#f6a06b', '#ff4fc3'] as [string, string],
          note: state.note,
        };
        dispatch({ type: 'DO_SHARE_UI' });
        insertEntry(state.roomId, entry)
          .then(() => flash('셋로그에 올렸습니다 — 방에 있는 모든 기기에 실시간으로 표시됩니다.'))
          .catch(() => flash('업로드 실패 — 네트워크를 확인해주세요.'));
      },
      setExportDay: (day: ExportDay) => dispatch({ type: 'SET_EXPORT_DAY', day }),
      setExportTarget: (target: string) => dispatch({ type: 'SET_EXPORT_TARGET', target }),
      doExport: () => {
        const target = state.exportTarget || state.myPlatform;
        const meta = dayMeta[state.exportDay];
        const count = state.exportDay === 'today' ? state.entries.length : meta.count;
        dispatch({ type: 'DO_EXPORT' });
        flash(
          target === '텍스트로 복사 / 내보내기'
            ? meta.label + ' ' + count + '곡을 텍스트 목록으로 복사했습니다.'
            : meta.label + ' ' + count + '곡을 ' + target + ' 플레이리스트로 내보냈습니다.'
        );
      },
    }),
    [state.together, state.myPlatform, state.exportTarget, state.exportDay, state.entries, state.selId, state.roomId, state.note, flash]
  );

  const value = useMemo(
    () => ({ state, flash, activeDay, seatCap: state.seatCap, actions }),
    [state, flash, activeDay, actions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

export { roomData, members, platformList };
