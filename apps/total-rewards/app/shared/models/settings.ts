import { FontFamily, FontSize } from '../types';

export interface Settings {
  ChartColors: string[];
  FontSize: FontSize;
  FontFamily: FontFamily;
}

export function generateMockSettings(): Settings {
  return {
    ChartColors: ['#1f2f3d', '#0883be', '#ffb300', '#dc1e34', '#2dd02d'],
    FontSize: 'Medium',
    FontFamily: 'Default',
  };
}
