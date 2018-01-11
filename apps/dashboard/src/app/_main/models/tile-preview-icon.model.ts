import { TilePreviewBase } from './tile-preview-base.model';

export interface TilePreviewIcon extends TilePreviewBase {
  ContainsPayLoad: boolean;
  CssClassName: string;
  IconSize: string;
  Title?: string;
  SubTitle?: string;
  DetailsDictionary?: Object;
}

export function generateMockTilePreviewIcon(): TilePreviewIcon {
  return {
    IconClass: 'fa-home',
    ContainsPayLoad: false,
    CssClassName: '',
    IconSize: ''
  };
}
