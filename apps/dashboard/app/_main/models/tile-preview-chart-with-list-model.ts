import { Tile } from './tile.model';
import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewTypes } from './tile-preview-types';


export interface TilePreviewCharWithList extends TilePreviewBase {
  TileListTitle: string;
  TileListData: any;
}

export function generateTilePreviewChartWithListFromTile(tile: Tile): TilePreviewCharWithList {

  const previewData = tile.TilePreviewData[ 0 ] !== undefined ?
    tile.TilePreviewData[ 0 ] : { TileListTitle: undefined, TileListData: undefined };

  const tileListTitle = previewData.TileListTitle;

  const tileListData = previewData.TileListData !== undefined && previewData.TileListData.length > 0 ? previewData.TileListData : undefined;

  return {
    TileListTitle: tileListTitle,
    TileListData: tileListData,
    PreviewType: TilePreviewTypes.ChartWithList
  };
}
