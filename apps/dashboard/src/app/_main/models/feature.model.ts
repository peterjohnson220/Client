import { FeatureTypes } from './feature-types';
import { TileTypes } from './tile-types';

export interface Feature {
  Name: string;
  Type: FeatureTypes;
  Url: string;
}
