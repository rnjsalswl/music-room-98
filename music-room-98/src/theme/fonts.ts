import { useFonts, Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import { PixelifySans_400Regular, PixelifySans_700Bold } from '@expo-google-fonts/pixelify-sans';

// The prototype calls for Tahoma / Gulim / Dotum / "MS Sans Serif" — none of those
// bitmap system fonts are freely licensed for bundling, so Pixelify Sans stands in
// as the closest openly-licensed pixel-UI face. Caprasimo (the design system's own
// display font) is kept for the same glyph/heading accents the prototype used it for.
export const fontHeading = 'Caprasimo_400Regular';
export const fontBody = 'PixelifySans_400Regular';
export const fontBodyBold = 'PixelifySans_700Bold';

export function useWin98Fonts() {
  return useFonts({
    Caprasimo_400Regular,
    PixelifySans_400Regular,
    PixelifySans_700Bold,
  });
}
