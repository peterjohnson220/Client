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
  ShouldLimitLegendText?: boolean;
  IconClass: string;
  CssClass: string;
  TilePreviewData: any;
  Size: number;
  Order: number;
  Url: string;
  NgAppLink: boolean;
  MarketingEnabled: boolean;
  MarketingDescription: string;
  MarketingButtonText: string;
  IgnoreTileAnchorOverlay?: boolean;
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
    TilePreviewData: undefined,
    MarketingEnabled: false,
    MarketingDescription: '',
    MarketingButtonText: ''
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
    TilePreviewData: undefined,
    MarketingEnabled: false,
    MarketingDescription: '',
    MarketingButtonText: ''
  };
}

export function generateMockListTile(showColumnHeadings: boolean, mainButtonUrl: string = 'mainButtonUrl'): Tile {
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
    MarketingEnabled: false,
    MarketingDescription: '',
    MarketingButtonText: '',
    TilePreviewData: [ {
      MainButtonText: 'test button text',
      MainButtonIcon: 'test button icon',
      MainButtonUrl: mainButtonUrl,
      ShowColumnHeadings: showColumnHeadings,
      DetailData: [
        {
          RowData: [
            {
              ColumnName: 'Project Name',
              Text: 'a new test project',
              Url: '/marketdata/marketdata.asp?usersession_id=156025',
              TooltipText: null,
              Hideable: false,
              TileListItemType: 'Link'
            }, {
              ColumnName: '# Jobs', Text: '1', Url: null, TooltipText: null, Hideable: true, TileListItemType: 'Text'
            }, {
              ColumnName: 'Created', Text: '02/07/2018', Url: null,
              TooltipText: 'Created By: test person', Hideable: true, TileListItemType: 'Text'
            }, {
              ColumnName: null,
              Text: 'fa fa-thumb-tack',
              Url: null,
              TooltipText: null,
              Hideable: false,
              TileListItemType: 'Icon'
            }
          ]
        }
      ]
    } ]
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
    MarketingEnabled: false,
    MarketingDescription: '',
    MarketingButtonText: '',
    TilePreviewData: [ {
      Title: 'Boston',
      SubTitle: 'Default Market',
      DetailData: [
        { Key: 'Industry', Value: 'Software' },
        { Key: 'Size', Value: '10' },
        { Key: 'Location', Value: 'Back Bay' }
      ]
    } ]
  };
}
