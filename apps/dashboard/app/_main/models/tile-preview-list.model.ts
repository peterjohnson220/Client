import { Tile } from './tile.model';
import { TilePreviewBase } from './tile-preview-base.model';
import { TilePreviewTypes } from './tile-preview-types';


export interface TilePreviewList extends TilePreviewBase {
  MainButtonText: string;
  MainButtonIcon: string;
  MainButtonUrl: string;
  ShowColumnHeadings: boolean;
  DetailData: any;
  MarketingEnabled: boolean;
}

export function generateTilePreviewListFromTile(tile: Tile): TilePreviewList {

  const previewData = tile.TilePreviewData[ 0 ] !== undefined ?
    tile.TilePreviewData[ 0 ] : { Title: undefined, SubTitle: undefined, DetailData: undefined };

  const mainButtonText = previewData.MainButtonText !== undefined ? previewData.MainButtonText : undefined;
  const mainButtonIcon = previewData.MainButtonIcon !== undefined ? previewData.MainButtonIcon : undefined;
  const mainButtonUrl = previewData.MainButtonUrl !== undefined ? previewData.MainButtonUrl : undefined;
  const ShowColumnHeadings = previewData.ShowColumnHeadings !== undefined ? previewData.ShowColumnHeadings : false;

  const detailData = previewData.DetailData !== undefined && previewData.DetailData.length > 0 ? previewData.DetailData : undefined;
  return {
    MainButtonText: mainButtonText,
    MainButtonIcon: mainButtonIcon,
    MainButtonUrl: mainButtonUrl,
    ShowColumnHeadings: ShowColumnHeadings,
    DetailData: detailData,
    PreviewType: tile.PreviewType,
    MarketingEnabled: tile.MarketingEnabled
  };
}


