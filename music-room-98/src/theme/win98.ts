// Full Windows 98 palette (per design chat: teal ground, gray chrome, navy titlebar).
// Organic's terracotta/sage accents are kept only for album-art tiles and status dots.
export const win98 = {
  desktop: '#008080',
  face: '#c0c0c0',
  faceHover: '#cdcdcd',
  facePressed: '#a8a8a8',
  white: '#ffffff',
  black: '#000000',
  darkGray: '#808080',
  titleFrom: '#000080',
  titleTo: '#1084d0',
  windowText: '#000000',
  mutedText: '#404040',
  fieldBg: '#ffffff',
  tooltipBg: '#ffffe1',
  screenGreen: '#00ff9c',
  screenGreenDim: '#7ad4a8',
  screenBg: '#000000',
} as const;

// Bevel border colors: [top, right, bottom, left]
export const bevel = {
  raisedOuter: [win98.white, win98.black, win98.black, win98.white],
  raisedInner: ['#dfdfdf', win98.darkGray, win98.darkGray, '#dfdfdf'],
  sunkenOuter: [win98.darkGray, win98.white, win98.white, win98.darkGray],
  sunkenInner: [win98.black, '#dfdfdf', '#dfdfdf', win98.black],
  pressedOuter: [win98.black, win98.white, win98.white, win98.black],
} as const;

export function bevelStyle(colors: readonly [string, string, string, string], width = 2) {
  const [top, right, bottom, left] = colors;
  return {
    borderTopWidth: width,
    borderRightWidth: width,
    borderBottomWidth: width,
    borderLeftWidth: width,
    borderTopColor: top,
    borderRightColor: right,
    borderBottomColor: bottom,
    borderLeftColor: left,
  } as const;
}

// Vaporwave gradient "beds" used as album-art fallback — approximated as two-stop
// linear gradients since RN has no CSS conic/repeating-gradient primitive.
export const vaporGradients: [string, string][] = [
  ['#ff4fc3', '#18c8e8'],
  ['#ff77d9', '#00b7d4'],
  ['#c04bd8', '#2fd8e8'],
  ['#6a3ca8', '#48e0ff'],
  ['#ff5fb0', '#21b8d8'],
  ['#a83fd0', '#19d0e8'],
];

export const memberFaces: Record<string, string> = {
  '지민': '#8c491a',
  '이든': '#b2622d',
  '서아': '#7a8a5e',
  '태오': '#c67139',
  '하린': '#728157',
};

export const platformSwatches: Record<string, string> = {
  'Spotify': '#7a8a5e',
  'Apple Music': '#808080',
  'YouTube Music': '#c67139',
  'Melon': '#8fa073',
  '지니': '#000080',
  'FLO': '#b2622d',
  'Bugs': '#56633f',
};

export const platformList = ['Spotify', 'Apple Music', 'YouTube Music', 'Melon', '지니', 'FLO', 'Bugs'];
