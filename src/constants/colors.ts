export const colors = {
  background: '#fffaf3',
  darkBackground: '#e9e3d6',
  border: '#a09583',
  darkBorder: '#5e5847',
  point: '#d68200',
  alert: '#b6441d',
  text: '#1b1a12',
} as const;

export type ColorKey = keyof typeof colors;
