import { Tile } from './tile.model';
import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewTypes } from './tile-preview-types';

export interface TilePreviewCharWithList extends TilePreviewBase {
  TileListTitle: string;
  TileChartTitle: string;
  PostUrl: string;
  BaseUrl: string;
  TileListData: any;
  TileChartData: any;
  ActionItemTitle: string;
  ActionItemType: string;
  HeadingIconImage: string;
}

export function generateTilePreviewChartWithListFromTile(tile: Tile): TilePreviewCharWithList {

  const previewData = tile.TilePreviewData[ 0 ] !== undefined ?
    tile.TilePreviewData[ 0 ] : { TileListTitle: undefined, TileListData: undefined };

  const tileListTitle = previewData.TileListTitle;
  const tileChartTitle = previewData.TileChartTitle;
  const postUrl = previewData.PostUrl;
  const baseUrl = previewData.BaseUrl;
  const actionItemTitle = previewData.ActionItemTitle;
  const actionItemType = previewData.ActionItemType;

  const tileListData = previewData.TileListData !== undefined && previewData.TileListData.length > 0 ? previewData.TileListData : undefined;
  const tileChartData = previewData.TileChartData !== undefined ? previewData.TileChartData : undefined;

  return {
    TileListTitle: tileListTitle,
    TileChartTitle: tileChartTitle,
    PostUrl: postUrl,
    BaseUrl: baseUrl,
    TileListData: tileListData,
    TileChartData: tileChartData,
    PreviewType: TilePreviewTypes.ChartWithList,
    ActionItemTitle: actionItemTitle,
    ActionItemType: actionItemType,
    HeadingIconImage: tile.TilePreviewData[0].HeadingIconImage
  };
}
