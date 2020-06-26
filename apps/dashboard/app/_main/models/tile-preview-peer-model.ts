import { Tile } from './tile.model';
import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewTypes } from './tile-preview-types';

export interface TilePreviewPeer extends TilePreviewBase {
  ChartType: string;
  ChartLabel: string;
  ShouldLimitLegendText: boolean;
  SelectedExchangeId: number;
  ExchangePreviewModels: any[];
  TileUrl: string;
}

export function generateTilePreviewPeerFromTile(tile: Tile): TilePreviewPeer {

  const previewData = tile.TilePreviewData[ 0 ] !== undefined ?
    tile.TilePreviewData[ 0 ] : { TileListTitle: undefined, TileListData: undefined };
  const exchangePreviewModels = !!previewData.ExchangePreviewModels && previewData.ExchangePreviewModels.length ? previewData.ExchangePreviewModels : [];

  return {
    ChartType: tile.ChartType,
    ChartLabel: tile.ChartLabel,
    ShouldLimitLegendText: tile.ShouldLimitLegendText,
    SelectedExchangeId: previewData.SelectedExchangeId,
    ExchangePreviewModels: exchangePreviewModels.map(m => {
      const newModel = {...m};
      newModel.CompanyJobTileChartItems = m.CompanyJobTileChartItems.map(item => {
        const mappedItem = {...item};
        switch (item.DataField) {
          case 'Matched':
            mappedItem.color = '#A3A3A3';
            break;
          case 'Pending Review':
            mappedItem.color = '#264478';
            break;
          case 'Not Matched':
            mappedItem.color = '#C79500';
            break;
          default:
            break;
        }
        return mappedItem;
      });

      return newModel;
    }),
    PreviewType: !!tile.TilePreviewData ? TilePreviewTypes.Peer : TilePreviewTypes.Icon,
    IconClass: tile.IconClass,
    TileUrl: ''
  };
}
