import { TilePreviewBase } from './tile-preview-base.model';
import { Tile } from './tile.model';
import { TilePreviewTypes } from './tile-preview-types';

export interface TilePreviewList extends  TilePreviewBase {
  DetailData?: Object;
}

export function generateTilePreviewListFromTile(tile: Tile): TilePreviewList {
  return {
    PreviewType: TilePreviewTypes.List,
    IconClass: tile.IconClass
  };
}
