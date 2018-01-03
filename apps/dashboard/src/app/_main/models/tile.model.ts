import { TileTypes } from './tile-types';
import { TilePreviewTypes } from './tile-preview-types';

export interface Tile {
  id: number;
  label: string;
  type: TileTypes;
  previewType: TilePreviewTypes;
  iconClass: string;
  cssClass: string;
  payload: any;
  size: number;
  order: number;
  url: string;
  ngAppLink: boolean;
}

export function generateMockTile(): Tile {
  return {
    id: 1,
    label: 'test tile',
    type: TileTypes.PayMarkets,
    previewType: TilePreviewTypes.Icon,
    iconClass: 'fa fa-file-text-o',
    url: 'test tile url',
    ngAppLink: false,
    order: 0,
    size: 2,
    cssClass: 'test cssClass',
    payload: [ 'test tile data' ]
  };
}
