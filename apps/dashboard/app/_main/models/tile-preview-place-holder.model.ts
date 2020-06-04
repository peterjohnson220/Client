import { TilePreviewBase } from './tile-preview-base.model';
import { Tile } from './tile.model';
import { TilePreviewTypes } from './tile-preview-types';
import { TileTypes } from 'libs/models/dashboard';

export interface TilePreviewPlaceHolder extends  TilePreviewBase {
  TileType: TileTypes;
  Image?: string;
}

export function generateTilePreviewPlaceHolderFromTile(tile: Tile): TilePreviewPlaceHolder {
  return {
    TileType: tile.Type,
    IconClass: tile.IconClass,
    PreviewType: TilePreviewTypes.PlaceHolder,
  };
}
