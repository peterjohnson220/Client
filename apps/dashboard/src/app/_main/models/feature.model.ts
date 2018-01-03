import { FeatureTypes } from './feature-types';
import { TileTypes } from './tile-types';
import { Tile } from './tile.model';

export interface Feature {
  type: FeatureTypes;
  tileType: TileTypes;
  hasAccess: boolean;
  url: string;
}
