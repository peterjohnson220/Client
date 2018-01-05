import { TileTypes } from './tile-types';
import { TilePreviewTypes } from './tile-preview-types';
import { TilePreviewChartTypes } from './tile-preview-chart-types';

export interface Tile {
  Id: number;
  Label: string;
  Type: TileTypes;
  PreviewType: TilePreviewTypes;
  ChartType?: TilePreviewChartTypes;
  ChartLabel?: string;
  IconClass: string;
  CssClass: string;
  TilePreviewData: any;
  Size: number;
  Order: number;
  Url: string;
  NgAppLink: boolean;
}

export function generateMockTile(): Tile {
  return {
    Id: 1,
    Label: 'test tile',
    Type: TileTypes.PayMarkets,
    PreviewType: TilePreviewTypes.Icon,
    IconClass: 'fa fa-file-text-o',
    Url: 'test tile url',
    NgAppLink: false,
    Order: 0,
    Size: 2,
    CssClass: 'test cssClass',
    TilePreviewData: [ 'test tile data' ]
  };
}
