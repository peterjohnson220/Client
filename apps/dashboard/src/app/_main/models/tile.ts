import { TileTypes } from './tile-types';

export class Tile {
  type: TileTypes;
  label: string;
  backgroundColor: string;
  iconClass: string;
  payload: any;
  tileId: number;

  constructor() {
    this.payload = { hey: 'now'};
  }
}
