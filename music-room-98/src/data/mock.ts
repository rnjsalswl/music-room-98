export type Entry = {
  id: string;
  user: string;
  userInitial: string;
  userBg: string;
  time: string;
  title: string;
  artist: string;
  platform: string;
  glyph: string;
  gradient: [string, string];
  note: string;
};

export type Room = {
  id: string;
  name: string;
  seats: string;
  dotColor: string;
  last: string;
};

export type Member = {
  name: string;
  glyph: string;
  face: string;
};

export const members: Member[] = [
  { name: '지민', glyph: '지', face: '#8c491a' },
  { name: '이든', glyph: '이', face: '#b2622d' },
  { name: '서아', glyph: '서', face: '#7a8a5e' },
  { name: '태오', glyph: '태', face: '#c67139' },
  { name: '하린', glyph: '하', face: '#728157' },
];

export const rooms: Room[] = [
  { id: 'r1', name: '야간 산책 클럽', seats: '5/8', dotColor: '#c67139', last: '서아 · Paper Boats' },
  { id: 'r2', name: '출근길 셋로그', seats: '3/8', dotColor: '#7a8a5e', last: '민우 · 첫차' },
  { id: 'r3', name: '새벽 4시', seats: '2/8', dotColor: '#808080', last: '어제 03:51' },
];

export const initialEntries: Entry[] = [
  { id: 'e5', user: '서아', userInitial: '서', userBg: '#7a8a5e', time: '22:31', title: 'Paper Boats', artist: 'Halcyon Field', platform: 'Melon', glyph: 'P', gradient: ['#ff4fc3', '#18c8e8'], note: '비 오는 날 첫 곡으로 좋음' },
  { id: 'e4', user: '태오', userInitial: '태', userBg: '#c67139', time: '22:12', title: '느린 여름', artist: '오소리', platform: 'FLO', glyph: '느', gradient: ['#ff77d9', '#00b7d4'], note: '' },
  { id: 'e3', user: '하린', userInitial: '하', userBg: '#728157', time: '21:58', title: 'Tangerine Hour', artist: 'Mimi & the Moths', platform: 'YouTube Music', glyph: 'T', gradient: ['#c04bd8', '#2fd8e8'], note: '후반 2분만 들어도 됨' },
  { id: 'e2', user: '이든', userInitial: '이', userBg: '#b2622d', time: '21:40', title: 'Static Bloom', artist: 'Vantage', platform: 'Apple Music', glyph: 'S', gradient: ['#6a3ca8', '#48e0ff'], note: '' },
  { id: 'e1', user: '지민', userInitial: '지', userBg: '#8c491a', time: '21:22', title: '창문 열어둘게', artist: '소요', platform: 'Spotify', glyph: '창', gradient: ['#ff5fb0', '#21b8d8'], note: '' },
];

export const nowPlaying = {
  title: '밤의 산책',
  artist: '유정하 — 느린 여름 EP',
  glyph: '밤',
  gradient: ['#ff4fc3', '#8a4be0'] as [string, string],
  progressPct: 44,
  timeLeft: '1:52',
};

export const roomCode = 'NIGHT-72';
export const roomTitle = '야간 산책 클럽';
export const profileName = '지민';
export const profileSummary = '이번 주 14곡 공유 · 방 3개';
