import { FeatureTypes } from './feature-types';
import { TileTypes } from './tile-types';

export interface Feature {
  Type: FeatureTypes;
  TileType: TileTypes;
  HasAccess: boolean;
  Url: string;
}
