import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewTypes } from './tile-preview-types';
import { Tile } from './tile.model';
import { convertToFaIconFormat } from 'libs/core/functions';

export interface TilePreviewBasicListTile extends TilePreviewBase {
  Heading: string;
  HeadingIconImage: string;
  Items: ListItem[];
  faIconClass?: string[];
}

interface ListItem {
  IconClass: string;
  Name: string;
  Url: string;
}

export function generateTilePreviewBasicListFromTile(tile: Tile): TilePreviewBasicListTile {
    const faIconClass = convertToFaIconFormat(tile.IconClass);
    return {
      PreviewType: TilePreviewTypes.BasicList,
      IconClass: tile.IconClass,
      faIconClass: faIconClass,
      Heading: tile.TilePreviewData[0].Heading,
      HeadingIconImage: tile.TilePreviewData[0].HeadingIconImage,
      Items: tile.TilePreviewData[0].Items
    };
}
