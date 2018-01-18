import { TilePreviewBase } from './tile-preview-base.model';

export interface TilePreviewIcon extends TilePreviewBase {
  IconClass: string;
  ContainsPayLoad: boolean;
  CssClassName: string;
  IconSize: string;
  Title?: string;
  SubTitle?: string;
  DetailData?: Object;
}
