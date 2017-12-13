import { TileTypes } from './tile-types';

export interface Tile {
  type: TileTypes;
  label: string;
  iconClass: string;
  payload: any;
  tileId: number;
}
