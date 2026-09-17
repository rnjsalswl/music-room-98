import { Linking, Platform } from 'react-native';

// The mock catalog has no real track IDs, so a "real" deep link means a
// search deep link — this is the honest, always-available integration for
// every platform (no OAuth, no developer account, works today).
const SEARCH_URL: Record<string, (q: string) => string> = {
  Spotify: (q) => `https://open.spotify.com/search/${encodeURIComponent(q)}`,
  'Apple Music': (q) => `https://music.apple.com/search?term=${encodeURIComponent(q)}`,
  'YouTube Music': (q) => `https://music.youtube.com/search?q=${encodeURIComponent(q)}`,
  Melon: (q) => `https://www.melon.com/search/total/index.htm?q=${encodeURIComponent(q)}`,
  '지니': (q) => `https://www.genie.co.kr/search/searchMain?query=${encodeURIComponent(q)}`,
  FLO: (q) => `https://www.music-flo.com/search/more/track?keyword=${encodeURIComponent(q)}`,
  Bugs: (q) => `https://music.bugs.co.kr/search/integrated?q=${encodeURIComponent(q)}`,
};

// Only Spotify documents a public, unauthenticated app URI scheme for search.
const APP_SCHEME: Partial<Record<string, (q: string) => string>> = {
  Spotify: (q) => `spotify:search:${encodeURIComponent(q)}`,
};

export async function openInPlatform(platform: string, title: string, artist: string): Promise<void> {
  const query = `${title} ${artist}`.trim();
  const webUrl = (SEARCH_URL[platform] ?? SEARCH_URL.Spotify)(query);
  const appUrl = APP_SCHEME[platform]?.(query);

  if (appUrl && Platform.OS !== 'web') {
    try {
      if (await Linking.canOpenURL(appUrl)) {
        await Linking.openURL(appUrl);
        return;
      }
    } catch {
      // fall through to web URL
    }
  }

  await Linking.openURL(webUrl);
}
