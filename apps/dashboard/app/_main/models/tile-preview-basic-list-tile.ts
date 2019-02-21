import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewTypes } from './tile-preview-types';
import { Tile } from './tile.model';

export interface TilePreviewBasicListTile extends TilePreviewBase {
  Heading: string;
  HeadingIconImage: string;
  Items: ListItem[];
}

interface ListItem {
  IconClass: string;
  Name: string;
  Url: string;
}

export function generateTilePreviewBasicListFromTile(tile: Tile): TilePreviewBasicListTile {
    return {
      PreviewType: TilePreviewTypes.BasicList,
      IconClass: tile.IconClass,
      Heading: tile.TilePreviewData[0].Heading,
      HeadingIconImage: tile.TilePreviewData[0].HeadingIconImage,
      Items: tile.TilePreviewData[0].Items
    };
}
