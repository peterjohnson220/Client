import { FeatureTypes } from './feature-types';
import { TileTypes } from './tile-types';
import { Tile } from './tile.model';

export interface Feature {
  Type: FeatureTypes;
  TileType: TileTypes;
  Tile: Tile;
  HasAccess: boolean;
  Url: string;
}
