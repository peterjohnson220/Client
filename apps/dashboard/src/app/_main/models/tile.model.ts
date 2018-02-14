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
    IconClass: 'far file-alt',
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
    IconClass: 'far file-alt',
    Url: 'test tile url',
    NgAppLink: false,
    Order: 0,
    Size: 2,
    CssClass: 'test cssClass',
    TilePreviewData: undefined
  };
}

export function generateMockListTile(): Tile {
  return {
    Id: 1,
    Label: 'test tile',
    Type: TileTypes.PayMarkets,
    PreviewType: TilePreviewTypes.List,
    IconClass: 'far file-alt',
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
    IconClass: 'far file-alt',
    Url: 'test tile url',
    NgAppLink: false,
    Order: 0,
    Size: 2,
    CssClass: 'test cssClass',
    TilePreviewData: [{
      Title: 'Boston',
      SubTitle: 'Default Market',
      DetailData: [
        { Key: 'Industry', Value: 'Software' },
        { Key: 'Size', Value: '10' },
        { Key: 'Location', Value: 'Back Bay' }
      ]
    }]
  };
}
