import { TilePreviewTypes } from './tile-preview-types';

export class TilePreviewType {
  AllTypes: TilePreviewTypes[];

  Chart: number = TilePreviewTypes.Chart;
  Icon: number = TilePreviewTypes.Icon;
  List: number = TilePreviewTypes.List;

  constructor() {
    this.AllTypes = [
      TilePreviewTypes.Chart,
      TilePreviewTypes.Icon,
      TilePreviewTypes.List
    ];
  }
}
