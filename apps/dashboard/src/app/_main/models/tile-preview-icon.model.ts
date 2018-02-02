import { TilePreviewBase } from './tile-preview-base.model';
import { Tile } from './tile.model';
import { TilePreviewTypes } from './tile-preview-types';

export interface TilePreviewIcon extends TilePreviewBase {
  IconClass: string;
  ContainsDetailData: boolean;
  CssClassName: string;
  IconSize: string;
  Title?: string;
  SubTitle?: string;
  DetailData?: Object;
}

export function generateTilePreviewIconFromTile(tile: Tile): TilePreviewIcon {
  if (tile.TilePreviewData === undefined ||
    tile.TilePreviewData === null ||
    tile.TilePreviewData.length === 0 ||
    tile.TilePreviewData[0] === undefined) {
    return {
      PreviewType: TilePreviewTypes.Icon,
      ContainsDetailData: false,
      IconClass: tile.IconClass,
      IconSize: 'fa-10x',
      CssClassName: 'preview-tile-icon'
    };
  }

  const previewData = tile.TilePreviewData[0];
  const title = previewData.Title !== undefined ? previewData.Title : undefined;
  const subTitle = previewData.SubTitle !== undefined ? previewData.SubTitle : undefined;
  const detailData = previewData.DetailData !== undefined && previewData.DetailData.length > 0 ? previewData.DetailData :  undefined;
  return {
    PreviewType: TilePreviewTypes.Icon,
    ContainsDetailData: true,
    IconClass: tile.IconClass,
    IconSize: 'fa-4x',
    CssClassName: 'preview-tile-icon-small',
    Title: title,
    SubTitle: subTitle,
    DetailData: detailData,
  };
}
