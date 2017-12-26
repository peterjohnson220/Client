import { TileTypes } from './tile-types';
import { TilePreviewTypes } from './tile-preview-types';
import { TilePreviewChartTypes } from './tile-preview-chart-types';

export interface Tile {
  Id: number;
  Label: string;
  Type: TileTypes;
  PreviewType: TilePreviewTypes;
  ChartType?: TilePreviewChartTypes;
  IconClass: string;
  CssClass: string;
  Payload: any;
  Size: number;
  Order: number;
  Url: string;
}

export function generateMockTile(): Tile {
  return {
    Id: 1,
    Label: 'test tile',
    Type: TileTypes.PayMarkets,
    PreviewType: TilePreviewTypes.Icon,
    IconClass: 'fa fa-file-text-o',
    Url: 'test tile url',
    Order: 0,
    Size: 2,
    CssClass: 'test cssClass',
    Payload: [ 'test tile data' ]
  };
}
