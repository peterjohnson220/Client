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

export function generateMockChartTile(): Tile {
  return {
    Id: 1,
    Label: 'test tile',
    Type: TileTypes.PayMarkets,
    PreviewType: TilePreviewTypes.Chart,
    IconClass: 'fa fa-file-text-o',
    Url: 'test tile url',
    NgAppLink: false,
    Order: 0,
    Size: 2,
    CssClass: 'test cssClass',
    TilePreviewData: undefined
  };
}

export function generateMockIconTile(): Tile {
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

export function generateMockListTile(): Tile {
  return {
    Id: 1,
    Label: 'test tile',
    Type: TileTypes.PayMarkets,
    PreviewType: TilePreviewTypes.List,
    IconClass: 'fa fa-file-text-o',
    Url: 'test tile url',
    NgAppLink: false,
    Order: 0,
    Size: 2,
    CssClass: 'test cssClass',
    TilePreviewData: undefined
  };
}

export function generateMockIconTileWithPayload(): Tile {
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
    TilePreviewData: {
      Title: 'Boston',
      SubTitle: 'Default Market',
      PayloadDetails: {
        Industry: 'Software',
        Size: '10',
        Location: 'Back Bay'
      }
    }
  };
}

