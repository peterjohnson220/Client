import { TilePreviewBase } from './tile-preview-base.model';

export interface TilePreviewIcon extends TilePreviewBase {
  containsPayLoad: boolean;
  cssClassName: string;
  iconSize: string;
  title?: string;
  subTitle?: string;
  detailsDictionary?: Object;
}
