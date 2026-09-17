import { supabase } from './supabaseClient';
import type { Entry } from '../data/mock';

export type RoomRow = {
  id: string;
  code: string;
  name: string;
  seat_cap: number;
  together: boolean;
};

type EntryRow = {
  id: string;
  room_id: string;
  user_name: string;
  user_initial: string;
  user_bg: string;
  title: string;
  artist: string;
  platform: string;
  glyph: string;
  gradient_from: string;
  gradient_to: string;
  note: string;
  created_at: string;
};

function rowToEntry(row: EntryRow): Entry {
  const d = new Date(row.created_at);
  return {
    id: row.id,
    user: row.user_name,
    userInitial: row.user_initial,
    userBg: row.user_bg,
    time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
    title: row.title,
    artist: row.artist,
    platform: row.platform,
    glyph: row.glyph,
    gradient: [row.gradient_from, row.gradient_to],
    note: row.note,
  };
}

export async function fetchRoomByCode(code: string): Promise<RoomRow | null> {
  const { data, error } = await supabase.from('rooms').select('*').eq('code', code).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchEntries(roomId: string): Promise<Entry[]> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as EntryRow[]).map(rowToEntry);
}

export async function insertEntry(
  roomId: string,
  entry: { user: string; userInitial: string; userBg: string; title: string; artist: string; platform: string; glyph: string; gradient: [string, string]; note: string }
): Promise<void> {
  const { error } = await supabase.from('entries').insert({
    room_id: roomId,
    user_name: entry.user,
    user_initial: entry.userInitial,
    user_bg: entry.userBg,
    title: entry.title,
    artist: entry.artist,
    platform: entry.platform,
    glyph: entry.glyph,
    gradient_from: entry.gradient[0],
    gradient_to: entry.gradient[1],
    note: entry.note,
  });
  if (error) throw error;
}

export async function setTogether(roomId: string, together: boolean): Promise<void> {
  const { error } = await supabase.from('rooms').update({ together }).eq('id', roomId);
  if (error) throw error;
}

export function subscribeToRoom(
  roomId: string,
  onNewEntry: (entry: Entry) => void,
  onRoomUpdate: (room: RoomRow) => void
) {
  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'entries', filter: `room_id=eq.${roomId}` },
      (payload) => onNewEntry(rowToEntry(payload.new as EntryRow))
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
      (payload) => onRoomUpdate(payload.new as RoomRow)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
