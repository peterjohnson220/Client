import { TileTypes } from './tile-types';

export class Tile {
  type: TileTypes;
  label: string;
  iconClass: string;
  payload: any;
  tileId: number;
}
