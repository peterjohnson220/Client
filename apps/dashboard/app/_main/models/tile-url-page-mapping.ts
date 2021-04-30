import { TileTypes } from 'libs/models/dashboard';
import { UrlPage } from 'libs/models/url-redirect/url-page';

export interface TileUrlPageMapping {
  TileType: TileTypes;
  TargetPage: UrlPage;
}
