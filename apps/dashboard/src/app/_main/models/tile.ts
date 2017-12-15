import { TileTypes } from './tile-types';
import { UserTileDto } from '../../../../../../libs/models/dashboard';
import { TilePreviewTypes } from './tile-preview-types';

export interface Tile extends UserTileDto {
  Type: TileTypes;
  PreviewType: TilePreviewTypes;
  IconClass: string;
  payload: any;
}
