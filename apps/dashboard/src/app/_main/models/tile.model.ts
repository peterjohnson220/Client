export interface Tile {
  id: number;
  name: string;
  url: string;
  position: number;
  size: number;
  cssClass?: string;
  bgColor?: string;
  tileData?: any;
}
