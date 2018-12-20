import { Tile } from './tile.model';
import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewTypes } from './tile-preview-types';

export interface TilePreviewCharWithList extends TilePreviewBase {
  TileListTitle: string;
  TileChartTitle: string;
  PostUrl: string;
  TileListData: any;
  TileChartData: any;
}

export function generateTilePreviewChartWithListFromTile(tile: Tile): TilePreviewCharWithList {

  const previewData = tile.TilePreviewData[ 0 ] !== undefined ?
    tile.TilePreviewData[ 0 ] : { TileListTitle: undefined, TileListData: undefined };

  const tileListTitle = previewData.TileListTitle;
  const tileChartTitle = previewData.TileChartTitle;
  const postUrl = previewData.PostUrl;

  const tileListData = previewData.TileListData !== undefined && previewData.TileListData.length > 0 ? previewData.TileListData : undefined;
  const tileChartData = previewData.TileChartData !== undefined
    && previewData.TileChartData.length > 0 ? previewData.TileChartData : undefined;

  return {
    TileListTitle: tileListTitle,
    TileChartTitle: tileChartTitle,
    PostUrl: postUrl,
    TileListData: tileListData,
    TileChartData: tileChartData,
    PreviewType: TilePreviewTypes.ChartWithList
  };
}
